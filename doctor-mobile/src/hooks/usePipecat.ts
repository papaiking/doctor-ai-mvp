import { useState, useRef, useCallback, useEffect } from 'react';
import {
  PipecatClient,
  PipecatClientOptions,
  RTVIEvent,
} from '@pipecat-ai/client-js';
import { WebSocketTransport } from '@pipecat-ai/websocket-transport';
import { config } from '../config';

export type ConnectionStatus =
  | 'idle'
  | 'connecting'
  | 'connected'
  | 'disconnected'
  | 'error';

export function usePipecat() {
  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>('idle');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState<{ id: string; role: 'user' | 'assistant'; content: string }[]>([]);
  const [error, setError] = useState<string | null>(null);

  const pcClientRef = useRef<PipecatClient | null>(null);
  const botAudioRef = useRef<HTMLAudioElement | null>(null);
  const speakingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const setupAudioTrack = useCallback((track: MediaStreamTrack) => {
    if (
      botAudioRef.current?.srcObject &&
      'getAudioTracks' in botAudioRef.current.srcObject
    ) {
      const oldTrack = (botAudioRef.current.srcObject as MediaStream).getAudioTracks()[0];
      if (oldTrack?.id === track.id) return;
    }
    botAudioRef.current = botAudioRef.current || document.createElement('audio');
    botAudioRef.current.autoplay = true;
    botAudioRef.current.srcObject = new MediaStream([track]);
    if (!botAudioRef.current.parentNode) {
      document.body.appendChild(botAudioRef.current);
    }
  }, []);

  const setupTrackListeners = useCallback(
    (client: PipecatClient) => {
      client.on(RTVIEvent.TrackStarted, (track, participant) => {
        if (!participant?.local && track.kind === 'audio') {
          setupAudioTrack(track);
        }
      });
    },
    [setupAudioTrack]
  );

  const connect = useCallback(async () => {
    if (pcClientRef.current) return;
    setError(null);
    setConnectionStatus('connecting');

    try {
      if (navigator.mediaDevices?.getUserMedia) {
        try {
          const testStream = await navigator.mediaDevices.getUserMedia({ audio: true });
          testStream.getTracks().forEach(t => t.stop());
        } catch (micErr) {
          const msg = micErr instanceof Error ? micErr.message : String(micErr);
          throw new Error(`Cannot access microphone: ${msg}. Please grant microphone permission in your device settings.`);
        }
      } else {
        throw new Error('Browser or WebView does not support microphone access.');
      }

      const transport = new WebSocketTransport(
        config.forceWsHost
          ? { wsUrl: `${config.forceWsScheme}://${config.forceWsHost}` }
          : undefined,
      );

      const pipecatConfig: PipecatClientOptions = {
        transport,
        enableMic: true,
        enableCam: false,
        callbacks: {
          onConnected: () => {
            setConnectionStatus('connected');
          },
          onDisconnected: () => {
            setConnectionStatus('disconnected');
            pcClientRef.current = null;
          },
          onBotReady: () => {
            if (!pcClientRef.current) return;
            const tracks = pcClientRef.current.tracks();
            if (tracks.bot?.audio) {
              setupAudioTrack(tracks.bot.audio);
            }
          },
          onUserTranscript: (data) => {
            if (!data.final) return;
            const msg = {
              id: `user-${Date.now()}`,
              role: 'user' as const,
              content: data.text,
            };
            setMessages((prev) => [...prev, msg]);
            if (speakingTimerRef.current) {
              clearTimeout(speakingTimerRef.current);
              speakingTimerRef.current = null;
            }
            setIsSpeaking(false);
          },
          onBotTranscript: (data) => {
            const msg = {
              id: `bot-${Date.now()}`,
              role: 'assistant' as const,
              content: data.text,
            };
            setMessages((prev) => [...prev, msg]);
            setIsSpeaking(true);
            if (speakingTimerRef.current) {
              clearTimeout(speakingTimerRef.current);
            }
            speakingTimerRef.current = setTimeout(() => {
              setIsSpeaking(false);
              speakingTimerRef.current = null;
            }, 3000);
          },
          onMessageError: (err) => {
            console.error('Message error:', err);
          },
          onError: (err) => {
            console.error('Error:', err);
            const errorMsg =
              typeof err.data === 'object' && err.data !== null
                ? ((err.data as Record<string, unknown>).message as string) ||
                  JSON.stringify(err.data)
                : String(err.data || err.label || 'Unknown error');
            setError(errorMsg);
            setConnectionStatus('error');
          },
        },
      };

      const client = new PipecatClient(pipecatConfig);
      pcClientRef.current = client;
      setupTrackListeners(client);

      if (config.forceWsHost) {
        const t = (client as unknown as { _transport: { _connect: (p: Record<string, unknown>) => Promise<void>; _wsUrl: string | null } })._transport;
        if (t) {
          const origConnect = t._connect.bind(t);
          t._connect = async (connectParams) => {
            if (connectParams?.wsUrl && typeof connectParams.wsUrl === 'string') {
              try {
                const url = new URL(connectParams.wsUrl);
                url.host = config.forceWsHost;
                if (config.forceWsScheme) url.protocol = `${config.forceWsScheme}:`;
                connectParams.wsUrl = url.toString();
              } catch {
                // ignore URL parse errors
              }
            }
            return origConnect(connectParams);
          };
        }
      }

      await client.initDevices();
      await client.startBotAndConnect({
        endpoint: config.endpointUrl,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Connection failed';
      setError(msg);
      setConnectionStatus('error');
      if (pcClientRef.current) {
        try {
          await pcClientRef.current.disconnect();
        } catch {
          // ignore cleanup errors
        }
        pcClientRef.current = null;
      }
    }
  }, [setupAudioTrack, setupTrackListeners]);

  const disconnect = useCallback(async () => {
    if (!pcClientRef.current) return;
    try {
      await pcClientRef.current.disconnect();
    } catch (err) {
      console.error('Disconnect error:', err);
    }
    if (
      botAudioRef.current?.srcObject &&
      'getAudioTracks' in botAudioRef.current.srcObject
    ) {
      (botAudioRef.current.srcObject as MediaStream)
        .getAudioTracks()
        .forEach((t) => t.stop());
      botAudioRef.current.srcObject = null;
    }
    pcClientRef.current = null;
    setConnectionStatus('disconnected');
    setIsSpeaking(false);
    if (speakingTimerRef.current) {
      clearTimeout(speakingTimerRef.current);
      speakingTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      if (pcClientRef.current) {
        pcClientRef.current.disconnect().catch(console.error);
      }
    };
  }, []);

  const addMessage = useCallback((text: string) => {
    const msg = {
      id: `user-${Date.now()}`,
      role: 'user' as const,
      content: text,
    };
    setMessages((prev) => [...prev, msg]);
  }, []);

  return {
    connectionStatus,
    isSpeaking,
    isConnected: connectionStatus === 'connected',
    messages,
    error,
    connect,
    disconnect,
    addMessage,
  };
}

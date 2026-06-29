import { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Header } from './components/Header';
import { VoiceCanvas } from './components/VoiceCanvas';
import { ChatInterface } from './components/ChatInterface';
import { Controls } from './components/Controls';
import { IdleScreen } from './components/IdleScreen';
import { usePipecat } from './hooks/usePipecat';

const IDLE_TIMEOUT_MS = 30000;

export default function App() {
  const {
    connectionStatus,
    isSpeaking,
    isConnected,
    messages,
    error,
    connect,
    disconnect,
    addMessage,
  } = usePipecat();

  const [isIdleScreen, setIsIdleScreen] = useState(true);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (connectionStatus === 'disconnected' || connectionStatus === 'error') {
      idleTimerRef.current = setTimeout(() => {
        setIsIdleScreen(true);
      }, IDLE_TIMEOUT_MS);
    } else if (
      connectionStatus === 'connecting' ||
      connectionStatus === 'connected'
    ) {
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
        idleTimerRef.current = null;
      }
    }
    return () => {
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
        idleTimerRef.current = null;
      }
    };
  }, [connectionStatus]);

  const handleToggle = () => {
    if (isConnected) {
      disconnect();
    } else {
      connect();
    }
  };

  const handleIdleStart = () => {
    setIsIdleScreen(false);
    connect();
  };

  return (
    <div className="h-dvh flex flex-col bg-background font-sans antialiased text-text-main" id="app-root">
      <AnimatePresence mode="wait">
        {isIdleScreen ? (
          <motion.div
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-dvh flex flex-col"
          >
            <IdleScreen onStart={handleIdleStart} />
          </motion.div>
        ) : (
          <motion.div
            key="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-dvh flex flex-col"
          >
            <Header />
            <main className="flex-1 flex flex-col min-w-0 min-h-0 px-8 xl:px-16 py-8 xl:py-12">
              <div className="w-full flex-1 flex flex-col lg:flex-row items-center lg:items-stretch justify-center gap-12 xl:gap-24 min-h-0">
                <div className="flex flex-col items-center text-center flex-[2] min-w-0 justify-center">
                  <VoiceCanvas
                    isListening={isConnected}
                    isSpeaking={isSpeaking}
                  />
                  <Controls
                    isConnected={isConnected}
                    isSpeaking={isSpeaking}
                    connectionStatus={connectionStatus}
                    onToggle={handleToggle}
                  />
                  {error && (
                    <p className="mt-4 text-sm text-error">{error}</p>
                  )}
                </div>
                <div className="flex flex-col flex-[3] min-w-0 min-h-0">
                  <div className="mb-12 text-center lg:text-left shrink-0">
                    <h1 className="text-4xl md:text-5xl xl:text-6xl font-bold tracking-tight text-text-main mb-4">
                      Tôi có thể giúp gì cho bạn?
                    </h1>
                    <p className="text-lg xl:text-xl text-text-muted leading-relaxed">
                      Hệ thống Gnixy AI đang sẵn sàng hỗ trợ bạn theo dõi các chỉ số sức khỏe và lịch trình chăm sóc. Hãy bắt đầu nói khi bạn đã sẵn sàng.
                    </p>
                  </div>
                  <ChatInterface
                    messages={messages}
                    onSendText={addMessage}
                    disabled={connectionStatus === 'connecting'}
                  />
                </div>
              </div>
            </main>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, Loader2, Circle } from 'lucide-react';
import type { ConnectionStatus } from '../hooks/usePipecat';

const Waveform = () => (
  <div className="flex items-center gap-1 h-8 px-2">
    {[...Array(8)].map((_, i) => (
      <motion.div
        key={i}
        className="w-1 bg-primary rounded-full"
        animate={{ height: [8, 24, 12, 18, 8] }}
        transition={{
          duration: 0.8,
          repeat: Infinity,
          delay: i * 0.1,
          ease: 'easeInOut',
        }}
      />
    ))}
  </div>
);

interface VoiceVisualizerProps {
  isListening: boolean;
  isSpeaking: boolean;
  connectionStatus: ConnectionStatus;
}

export const VoiceVisualizer: React.FC<VoiceVisualizerProps> = ({
  isListening,
  isSpeaking,
  connectionStatus,
}) => {
  const isIdle = connectionStatus === 'idle' || connectionStatus === 'disconnected';
  const isConnecting = connectionStatus === 'connecting';

  return (
    <div className="flex flex-col items-center justify-center min-h-[25vh] py-4">
      <div className="relative w-40 h-40 md:w-48 md:h-48 flex items-center justify-center">
        {/* Pulsing rings when connected & listening */}
        <AnimatePresence>
          {isListening && !isSpeaking && (
            <>
              <motion.div
                key="ring-1"
                initial={{ scale: 0.8, opacity: 0.5 }}
                animate={{ scale: 1.5, opacity: 0 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
                className="absolute inset-0 rounded-full bg-primary/10"
              />
              <motion.div
                key="ring-2"
                initial={{ scale: 0.8, opacity: 0.3 }}
                animate={{ scale: 1.8, opacity: 0 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeOut', delay: 0.5 }}
                className="absolute inset-0 rounded-full bg-primary/20"
              />
            </>
          )}
        </AnimatePresence>

        {/* Outer Circle */}
        <div className="absolute inset-0 rounded-full bg-gray-100/50" />

        {/* Inner Circle with Mic / Loader */}
        <motion.div
          animate={
            isIdle
              ? { y: [0, -6, 0] }
              : isConnecting
                ? { scale: [1, 1.04, 1] }
                : isListening && !isSpeaking
                  ? { scale: [1, 1.05, 1] }
                  : {}
          }
          transition={
            isIdle
              ? { duration: 2.5, repeat: Infinity, ease: 'easeInOut' }
              : { duration: 0.5, repeat: Infinity }
          }
          className={`relative w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center shadow-lg z-10 ${
            isConnecting
              ? 'bg-primary/70'
              : isIdle
                ? 'bg-gray-300'
                : 'bg-primary shadow-primary/20'
          }`}
        >
          {isConnecting ? (
            <Loader2 className="text-white w-8 h-8 md:w-10 md:h-10 animate-spin" />
          ) : (
            <Mic className="text-white w-8 h-8 md:w-10 md:h-10" />
          )}
        </motion.div>
      </div>

      {/* Status text */}
      <div className="mt-4 text-center">
        {isSpeaking ? (
          <div className="flex flex-col items-center gap-2">
            <Waveform />
            <span className="text-primary font-bold tracking-widest text-sm">
              GNIXY AI ĐANG NÓI...
            </span>
          </div>
        ) : isConnecting ? (
          <div className="flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 text-primary animate-spin" />
            <span className="text-primary font-bold tracking-widest text-sm">
              ĐANG KẾT NỐI...
            </span>
          </div>
        ) : isListening ? (
          <>
            <div className="flex items-center justify-center gap-2 mb-1">
              <Circle size={10} fill="currentColor" className="text-success animate-pulse" />
              <span className="text-primary font-bold tracking-widest text-sm">
                ĐANG NGHE...
              </span>
            </div>
            <p className="text-gray-500 text-lg">
              Hãy nói đi, tôi đang lắng nghe bạn.
            </p>
          </>
        ) : (
          <p className="text-gray-400 text-lg">
            Sẵn sàng tư vấn
          </p>
        )}
      </div>
    </div>
  );
};

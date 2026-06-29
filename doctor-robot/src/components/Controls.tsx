import { motion } from 'motion/react';
import { Mic, Square, Circle } from 'lucide-react';

interface ControlsProps {
  isConnected: boolean;
  isSpeaking: boolean;
  connectionStatus: string;
  onToggle: () => void;
  disabled?: boolean;
}

const Waveform = () => (
  <div className="flex items-center gap-1 h-8 px-2">
    {[...Array(8)].map((_, i) => (
      <motion.div
        key={i}
        className="w-1 bg-[#0052CC] rounded-full"
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

export const Controls = ({ isConnected, isSpeaking, connectionStatus, onToggle, disabled }: ControlsProps) => {
  const isListening = connectionStatus === 'connected' && !isSpeaking;
  const statusText = isSpeaking
    ? 'Gnixy AI đang nói...'
    : isConnected
      ? 'Đang lắng nghe...'
      : 'Nhấn nút để bắt đầu tư vấn voice';

  return (
    <div className="mt-8 xl:mt-12 flex flex-col items-center gap-4 xl:gap-6 w-full">
      <button
        onClick={onToggle}
        disabled={disabled}
        id="main-action-button"
        className={`flex items-center gap-3 xl:gap-4 px-8 xl:px-10 py-4 xl:py-5 rounded-full text-lg xl:text-xl font-bold shadow-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
          isConnected
            ? 'bg-error text-white hover:bg-error/90'
            : 'bg-[#FF5C5C] text-white hover:bg-[#FF4545]'
        }`}
      >
        {isConnected ? (
          <>
            <Square size={24} fill="currentColor" /> DỪNG LẠI
          </>
        ) : (
          <>
            <Mic size={24} /> BẮT ĐẦU NÓI
          </>
        )}
      </button>

      <div className="flex items-center gap-2 h-8" id="status-indicator">
        {isConnected && !isSpeaking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-primary font-medium text-base xl:text-lg"
          >
            <Circle size={12} fill="currentColor" className="text-success animate-pulse" />
            {statusText}
          </motion.div>
        )}
        {isSpeaking && (
          <div className="flex items-center gap-2 text-primary font-medium text-base xl:text-lg">
            <Waveform />
            {statusText}
          </div>
        )}
        {!isConnected && !isSpeaking && (
          <p className="text-text-muted text-sm xl:text-base italic">{statusText}</p>
        )}
      </div>
    </div>
  );
};

import { motion, AnimatePresence } from 'motion/react';
import doctorIcon from '../assets/doctor_icon.png';

const Waveform = () => (
  <div className="flex items-center gap-1 h-8 px-2" id="voice-visualizer">
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

interface VoiceCanvasProps {
  isListening: boolean;
  isSpeaking: boolean;
}

export const VoiceCanvas = ({ isListening, isSpeaking }: VoiceCanvasProps) => {
  const showRings = isListening && !isSpeaking;
  const showWaveform = isSpeaking;
  const isIdle = !isListening && !isSpeaking;

  return (
    <div className="relative flex flex-col items-center" id="voice-canvas">
      <AnimatePresence>
        {showRings && (
          <>
            <motion.div
              key="ring-1"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1.2, opacity: 0.1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 rounded-full bg-primary"
            />
            <motion.div
              key="ring-2"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1.5, opacity: 0.05 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              className="absolute inset-0 rounded-full bg-primary"
            />
          </>
        )}
      </AnimatePresence>

      <motion.div
        className="relative z-10 w-72 h-72 md:w-80 md:h-80 xl:w-96 xl:h-96 flex items-center justify-center"
        animate={isIdle ? { y: [0, -8, 0] } : { y: 0 }}
        transition={
          isIdle
            ? { duration: 2.5, repeat: Infinity, ease: 'easeInOut' }
            : { duration: 0.3 }
        }
      >
        <img
          src={doctorIcon}
          alt="AI Healthcare Assistant"
          className="w-full h-full object-contain"
        />
      </motion.div>

      {showWaveform && (
        <div className="mt-4">
          <Waveform />
        </div>
      )}
    </div>
  );
};

import { useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Circle } from 'lucide-react';
import doctorGnixy from '../assets/doctor_gnixy.png';

interface IdleScreenProps {
  onStart: () => void;
}

export const IdleScreen = ({ onStart }: IdleScreenProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const img = imgRef.current;
    if (!container || !img) return;

    let rafId: number;
    let cleanup: (() => void) | null = null;

    const startAnimation = () => {
      const imgW = img.clientWidth || 256;
      const imgH = img.clientHeight || 256;
      const maxX = Math.max(0, container.clientWidth - imgW);
      const maxY = Math.max(0, container.clientHeight - imgH);

      if (maxX <= 0 || maxY <= 0) return;

      const angle = Math.random() * Math.PI * 2;
      const speed = 1.8 + Math.random() * 1.2;
      const vel = { x: Math.cos(angle) * speed, y: Math.sin(angle) * speed };
      const pos = {
        x: Math.random() * maxX,
        y: Math.random() * maxY,
      };

      img.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;

      const step = () => {
        pos.x += vel.x;
        pos.y += vel.y;

        if (pos.x <= 0) { pos.x = 0; vel.x = Math.abs(vel.x); }
        if (pos.x >= maxX) { pos.x = maxX; vel.x = -Math.abs(vel.x); }
        if (pos.y <= 0) { pos.y = 0; vel.y = Math.abs(vel.y); }
        if (pos.y >= maxY) { pos.y = maxY; vel.y = -Math.abs(vel.y); }

        img.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
        rafId = requestAnimationFrame(step);
      };

      rafId = requestAnimationFrame(step);
      cleanup = () => cancelAnimationFrame(rafId);
    };

    if (img.complete && img.naturalWidth > 0) {
      startAnimation();
    } else {
      img.addEventListener('load', startAnimation, { once: true });
    }

    return () => {
      cleanup?.();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="h-dvh bg-black relative overflow-hidden cursor-pointer select-none"
      onClick={onStart}
    >
      <img
        ref={imgRef}
        src={doctorGnixy}
        alt="Doctor Gnixy"
        className="w-64 h-64 md:w-80 md:h-80 xl:w-96 xl:h-96 object-contain absolute"
        style={{ willChange: 'transform' }}
        draggable={false}
      />

      <div className="absolute bottom-20 left-0 right-0 flex flex-col items-center gap-3 pointer-events-none">
        <h1 className="text-3xl md:text-4xl xl:text-5xl font-bold tracking-tight text-white">
          Bác sĩ Gnixy
        </h1>
        <p className="text-base md:text-lg text-white/70 font-medium">
          Chạm để bắt đầu
        </p>
        <motion.div
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Circle size={10} fill="currentColor" className="text-white" />
        </motion.div>
      </div>
    </div>
  );
};

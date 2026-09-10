import { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SpotlightOverlayProps {
  active: boolean;
  onDeactivate: () => void;
  size: 'small' | 'medium' | 'large';
}

const SIZE_MAP = {
  small: 100,
  medium: 180,
  large: 260,
};

export default function SpotlightOverlay({ active, onDeactivate, size }: SpotlightOverlayProps) {
  const [pos, setPos] = useState({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    setPos({ x: e.clientX, y: e.clientY });
  }, []);

  const handleKey = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onDeactivate();
  }, [onDeactivate]);

  useEffect(() => {
    if (!active) return;
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('keydown', handleKey);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('keydown', handleKey);
    };
  }, [active, handleMouseMove, handleKey]);

  if (!active) return null;

  const radius = SIZE_MAP[size];

  return (
    <AnimatePresence>
      <motion.div
        ref={ref}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-40 pointer-events-none"
        style={{
          background: `radial-gradient(circle ${radius}px at ${pos.x}px ${pos.y}px, transparent 0%, transparent ${radius - 10}px, rgba(0,0,0,0.85) ${radius + 20}px)`,
        }}
      >
        {/* 退出提示 */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-xs text-white/50 bg-black/50 backdrop-blur px-3 py-1.5 rounded-full pointer-events-auto">
          聚光灯模式 · Esc 退出 · 跟随鼠标移动
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

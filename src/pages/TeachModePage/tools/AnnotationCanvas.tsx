import { useRef, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Eraser, Undo2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AnnotationCanvasProps {
  active: boolean;
  onClose: () => void;
  containerRef: React.RefObject<HTMLDivElement>;
  initialDataUrl?: string | null;
  onSave: (dataUrl: string) => void;
}

type PenColor = 'red' | 'blue' | 'yellow';
type PenSize = 'thin' | 'thick';

const COLOR_MAP: Record<PenColor, string> = {
  red: '#ef4444',
  blue: '#3b82f6',
  yellow: '#facc15',
};

const SIZE_MAP: Record<PenSize, number> = {
  thin: 3,
  thick: 7,
};

export default function AnnotationCanvas({
  active,
  onClose,
  containerRef,
  initialDataUrl,
  onSave,
}: AnnotationCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [color, setColor] = useState<PenColor>('red');
  const [size, setSize] = useState<PenSize>('thin');
  const [tool, setTool] = useState<'pen' | 'eraser'>('pen');
  const drawingRef = useRef(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);
  const historyRef = useRef<ImageData[]>([]);

  // 初始化 Canvas 尺寸 + 加载已有批注
  useEffect(() => {
    if (!active || !canvasRef.current || !containerRef.current) return;
    const canvas = canvasRef.current;
    const rect = containerRef.current.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // 加载已有批注
    if (initialDataUrl) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
      img.src = initialDataUrl;
    }
    historyRef.current = [];
  }, [active, initialDataUrl, containerRef]);

  const saveSnapshot = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const snap = ctx.getImageData(0, 0, canvas.width, canvas.height);
    historyRef.current.push(snap);
    if (historyRef.current.length > 20) historyRef.current.shift();
  }, []);

  const getPoint = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    saveSnapshot();
    drawingRef.current = true;
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.setPointerCapture(e.pointerId);
    lastPointRef.current = getPoint(e);
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const pt = lastPointRef.current;
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, SIZE_MAP[size] / 2, 0, Math.PI * 2);
    ctx.fillStyle = tool === 'eraser' ? 'rgba(255,255,255,0.01)' : COLOR_MAP[color];
    if (tool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
    } else {
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.fill();
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx || !lastPointRef.current) return;
    const pt = getPoint(e);
    ctx.beginPath();
    ctx.moveTo(lastPointRef.current.x, lastPointRef.current.y);
    ctx.lineTo(pt.x, pt.y);
    ctx.strokeStyle = tool === 'eraser' ? 'rgba(0,0,0,1)' : COLOR_MAP[color];
    ctx.lineWidth = tool === 'eraser' ? SIZE_MAP[size] * 4 : SIZE_MAP[size];
    if (tool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
    } else {
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.stroke();
    lastPointRef.current = pt;
  };

  const handlePointerUp = () => {
    drawingRef.current = false;
    lastPointRef.current = null;
  };

  const handleUndo = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const snap = historyRef.current.pop();
    if (snap) {
      ctx.putImageData(snap, 0, 0);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    saveSnapshot();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const handleSaveAndClose = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const dataUrl = canvas.toDataURL('image/png');
      onSave(dataUrl);
    }
    onClose();
  };

  if (!active) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 z-30"
      >
        {/* Canvas 叠加层 */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full cursor-crosshair"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          onPointerCancel={handlePointerUp}
        />

        {/* 工具栏 */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-slate-900/90 backdrop-blur-md border border-white/15 rounded-full px-2 py-1.5 flex items-center gap-1 shadow-xl">
          {/* 颜色 */}
          {(['red', 'blue', 'yellow'] as PenColor[]).map((c) => (
            <button
              key={c}
              onClick={() => {
                setColor(c);
                setTool('pen');
              }}
              className={`size-7 rounded-full border-2 transition-all ${
                color === c && tool === 'pen' ? 'border-white scale-110' : 'border-transparent'
              }`}
              style={{ backgroundColor: COLOR_MAP[c] }}
              aria-label={`${c}色笔`}
            />
          ))}

          <div className="w-px h-5 bg-white/20 mx-1" />

          {/* 粗细 */}
          <button
            onClick={() => setSize('thin')}
            className={`size-7 rounded-full flex items-center justify-center text-xs ${
              size === 'thin' ? 'bg-white/20 text-white' : 'text-white/60 hover:text-white'
            }`}
            title="细笔"
          >
            <div className="size-1.5 rounded-full bg-current" />
          </button>
          <button
            onClick={() => setSize('thick')}
            className={`size-7 rounded-full flex items-center justify-center text-xs ${
              size === 'thick' ? 'bg-white/20 text-white' : 'text-white/60 hover:text-white'
            }`}
            title="粗笔"
          >
            <div className="size-3 rounded-full bg-current" />
          </button>

          <div className="w-px h-5 bg-white/20 mx-1" />

          {/* 橡皮擦 */}
          <button
            onClick={() => setTool('eraser')}
            className={`size-7 rounded-full flex items-center justify-center ${
              tool === 'eraser' ? 'bg-white/20 text-white' : 'text-white/60 hover:text-white'
            }`}
            title="橡皮擦 (E)"
          >
            <Eraser className="size-4" />
          </button>

          {/* 撤销 */}
          <button
            onClick={handleUndo}
            className="size-7 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10"
            title="撤销"
          >
            <Undo2 className="size-4" />
          </button>

          {/* 清空 */}
          <button
            onClick={handleClear}
            className="size-7 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10"
            title="清空 (C)"
          >
            <Trash2 className="size-4" />
          </button>

          <div className="w-px h-5 bg-white/20 mx-1" />

          {/* 保存退出 */}
          <Button
            size="sm"
            variant="secondary"
            onClick={handleSaveAndClose}
            className="h-7 text-xs px-3"
          >
            保存批注
          </Button>
          <button
            onClick={onClose}
            className="size-7 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10"
            title="丢弃并退出"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* 底部提示 */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-white/50 bg-black/40 backdrop-blur px-3 py-1 rounded-full">
          B 批注 · E 橡皮 · C 清空 · Esc 退出
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

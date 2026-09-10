import { useState, useRef, useEffect } from 'react';
import { Eraser, RotateCcw, Pencil, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

const CANVAS_SIZE = 280;

export default function ProjectDemoDigitRecognition() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushSize, setBrushSize] = useState(24);
  const [result, setResult] = useState<{ digit: number; confidence: number; top3: { digit: number; score: number }[] } | null>(null);
  const [isPredicting, setIsPredicting] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = CANVAS_SIZE;
    canvas.height = CANVAS_SIZE;
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  }, []);

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    let clientX: number, clientY: number;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;

    const { x, y } = getPos(e);
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
    ctx.fill();
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;

    const { x, y } = getPos(e);
    ctx.fillStyle = '#ffffff';
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // 用圆形填充模拟画笔
    ctx.beginPath();
    ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
    ctx.fill();
  };

  const endDraw = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    setResult(null);
  };

  const predictDigit = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsPredicting(true);
    setResult(null);

    // 模拟模型推理
    await new Promise((r) => setTimeout(r, 800));

    // 简单的基于像素中心的"伪识别"（演示用）
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    let totalX = 0,
      totalY = 0,
      count = 0;
    for (let i = 0; i < imageData.data.length; i += 4) {
      if (imageData.data[i] > 128) {
        const px = (i / 4) % CANVAS_SIZE;
        const py = Math.floor(i / 4 / CANVAS_SIZE);
        totalX += px;
        totalY += py;
        count++;
      }
    }

    // 基于像素分布生成一个随机但有一定规律的数字
    // 真实情况下这里应该调用训练好的模型
    const centerX = count > 0 ? totalX / count : CANVAS_SIZE / 2;
    const centerY = count > 0 ? totalY / count : CANVAS_SIZE / 2;

    const seed = Math.abs(Math.floor(centerX * 0.1 + centerY * 0.05)) % 10;
    const digit = seed;
    const baseConf = 0.7 + Math.random() * 0.25;

    // 生成 top3
    const top3 = [
      { digit, score: baseConf },
      { digit: (digit + 3) % 10, score: baseConf * 0.3 },
      { digit: (digit + 7) % 10, score: baseConf * 0.1 },
    ].sort((a, b) => b.score - a.score);

    setResult({
      digit: top3[0].digit,
      confidence: top3[0].score,
      top3,
    });
    setIsPredicting(false);

    if (top3[0].score > 0.7) {
      toast.success(`AI 认为你写的是 ${top3[0].digit}`);
    } else {
      toast.info('识别结果不太确定，再写清楚一点试试？');
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-3 items-center">
        <Button variant="outline" onClick={clearCanvas}>
          <RotateCcw className="size-4 mr-2" />
          清空画布
        </Button>
        <Button
          onClick={predictDigit}
          disabled={isPredicting}
          className="bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600"
        >
          {isPredicting ? '识别中…' : '开始识别'}
        </Button>

        <div className="flex items-center gap-3 ml-auto">
          <Pencil className="size-4 text-muted-foreground" />
          <div className="w-32">
            <Slider
              value={[brushSize]}
              onValueChange={(v) => setBrushSize(v[0])}
              min={8}
              max={40}
              step={2}
            />
          </div>
          <span className="text-xs font-mono text-primary w-8">{brushSize}px</span>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 items-center justify-center">
        {/* 画板 */}
        <div className="relative">
          <div className="rounded-xl overflow-hidden border-2 border-border shadow-lg">
            <canvas
              ref={canvasRef}
              className="cursor-crosshair touch-none block"
              style={{ width: CANVAS_SIZE, height: CANVAS_SIZE }}
              onMouseDown={startDraw}
              onMouseMove={draw}
              onMouseUp={endDraw}
              onMouseLeave={endDraw}
              onTouchStart={startDraw}
              onTouchMove={draw}
              onTouchEnd={endDraw}
            />
          </div>
          <p className="text-xs text-muted-foreground text-center mt-2">
            用鼠标或手指在黑色画布上写一个数字 (0-9)
          </p>
        </div>

        {/* 识别结果 */}
        <div className="w-full md:w-56 space-y-4">
          <AnimatePresence mode="wait">
            {isPredicting ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-6 rounded-xl bg-muted/40 border border-border/60 text-center"
              >
                <div className="size-12 mx-auto mb-3 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                <p className="text-sm font-medium">AI 正在思考…</p>
                <p className="text-xs text-muted-foreground mt-1">神经网络推理中</p>
              </motion.div>
            ) : result ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-3"
              >
                <div className="p-6 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white text-center">
                  <p className="text-xs text-white/80 mb-1">AI 识别结果</p>
                  <p className="text-6xl font-black tabular-nums">{result.digit}</p>
                  <p className="text-xs text-white/80 mt-2">
                    置信度：{Math.round(result.confidence * 100)}%
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-card border border-border/60">
                  <p className="text-xs text-muted-foreground mb-2">Top 3 预测</p>
                  <div className="space-y-2">
                    {result.top3.map((r, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span
                          className={`text-lg font-bold tabular-nums w-6 ${
                            i === 0 ? 'text-emerald-600' : 'text-muted-foreground'
                          }`}
                        >
                          {r.digit}
                        </span>
                        <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${r.score * 100}%` }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            className={`h-full rounded-full ${
                              i === 0 ? 'bg-emerald-500' : i === 1 ? 'bg-blue-400' : 'bg-violet-400'
                            }`}
                          />
                        </div>
                        <span className="text-xs font-mono text-muted-foreground w-10 text-right">
                          {Math.round(r.score * 100)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-6 rounded-xl bg-muted/30 border border-dashed border-border/60 text-center"
              >
                <CheckCircle2 className="size-8 text-muted-foreground/30 mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">写好数字后点击「开始识别」</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

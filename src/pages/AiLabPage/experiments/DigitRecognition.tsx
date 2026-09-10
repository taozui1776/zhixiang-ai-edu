import { useRef, useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Eraser, Play, HelpCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

// 0-9 数字模板 (5x7 像素网格) — 简化的"模板匹配"算法
const DIGIT_TEMPLATES: Record<number, number[][]> = {
  0: [
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 1, 1],
    [1, 0, 1, 0, 1],
    [1, 1, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 0],
  ],
  1: [
    [0, 0, 1, 0, 0],
    [0, 1, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 1, 1, 1, 0],
  ],
  2: [
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [0, 0, 0, 0, 1],
    [0, 0, 0, 1, 0],
    [0, 0, 1, 0, 0],
    [0, 1, 0, 0, 0],
    [1, 1, 1, 1, 1],
  ],
  3: [
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [0, 0, 0, 0, 1],
    [0, 0, 1, 1, 0],
    [0, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 0],
  ],
  4: [
    [0, 0, 0, 1, 0],
    [0, 0, 1, 1, 0],
    [0, 1, 0, 1, 0],
    [1, 0, 0, 1, 0],
    [1, 1, 1, 1, 1],
    [0, 0, 0, 1, 0],
    [0, 0, 0, 1, 0],
  ],
  5: [
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0],
    [1, 1, 1, 1, 0],
    [0, 0, 0, 0, 1],
    [0, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 0],
  ],
  6: [
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 0],
  ],
  7: [
    [1, 1, 1, 1, 1],
    [0, 0, 0, 0, 1],
    [0, 0, 0, 1, 0],
    [0, 0, 1, 0, 0],
    [0, 1, 0, 0, 0],
    [0, 1, 0, 0, 0],
    [0, 1, 0, 0, 0],
  ],
  8: [
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 0],
  ],
  9: [
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 1],
    [0, 0, 0, 0, 1],
    [0, 0, 0, 0, 1],
    [0, 1, 1, 1, 0],
  ],
};

const CANVAS_SIZE = 280;
const GRID_SIZE = 28;

type ResultItem = { digit: number; confidence: number };

export default function DigitRecognition() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [results, setResults] = useState<ResultItem[]>([]);
  const [recognizing, setRecognizing] = useState(false);

  // 初始化画布
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    // 网格背景 (淡)
    ctx.strokeStyle = '#f1f5f9';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo((i * CANVAS_SIZE) / GRID_SIZE, 0);
      ctx.lineTo((i * CANVAS_SIZE) / GRID_SIZE, CANVAS_SIZE);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, (i * CANVAS_SIZE) / GRID_SIZE);
      ctx.lineTo(CANVAS_SIZE, (i * CANVAS_SIZE) / GRID_SIZE);
      ctx.stroke();
    }
  }, []);

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = CANVAS_SIZE / rect.width;
    const scaleY = CANVAS_SIZE / rect.height;
    if ('touches' in e) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY,
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    const pos = getPos(e);
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const pos = getPos(e);
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    ctx.strokeStyle = '#1e1b4b';
    ctx.lineWidth = 16;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  };

  const endDraw = () => {
    setIsDrawing(false);
  };

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    // 网格
    ctx.strokeStyle = '#f1f5f9';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo((i * CANVAS_SIZE) / GRID_SIZE, 0);
      ctx.lineTo((i * CANVAS_SIZE) / GRID_SIZE, CANVAS_SIZE);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, (i * CANVAS_SIZE) / GRID_SIZE);
      ctx.lineTo(CANVAS_SIZE, (i * CANVAS_SIZE) / GRID_SIZE);
      ctx.stroke();
    }
    setResults([]);
  }, []);

  // 将画布采样为 5x7 二值网格
  const sampleGrid = (): number[][] => {
    const canvas = canvasRef.current;
    if (!canvas) return Array(7).fill(null).map(() => Array(5).fill(0));
    const ctx = canvas.getContext('2d');
    if (!ctx) return Array(7).fill(null).map(() => Array(5).fill(0));

    const imgData = ctx.getImageData(0, 0, CANVAS_SIZE, CANVAS_SIZE).data;

    // 先找到笔迹边界 (bbox)
    let minX = CANVAS_SIZE,
      maxX = 0,
      minY = CANVAS_SIZE,
      maxY = 0;
    const cellSize = CANVAS_SIZE / GRID_SIZE;
    for (let gy = 0; gy < GRID_SIZE; gy++) {
      for (let gx = 0; gx < GRID_SIZE; gx++) {
        // 检查每个 cell 中心像素
        const px = Math.floor((gx + 0.5) * cellSize);
        const py = Math.floor((gy + 0.5) * cellSize);
        const idx = (py * CANVAS_SIZE + px) * 4;
        // 白色 r=g=b=255; 笔迹颜色深
        const darkness = 255 - (imgData[idx] * 0.299 + imgData[idx + 1] * 0.587 + imgData[idx + 2] * 0.114);
        if (darkness > 50) {
          if (gx < minX) minX = gx;
          if (gx > maxX) maxX = gx;
          if (gy < minY) minY = gy;
          if (gy > maxY) maxY = gy;
        }
      }
    }

    if (maxX < minX || maxY < minY) {
      return Array(7).fill(null).map(() => Array(5).fill(0));
    }

    // 将 bbox 内的笔迹缩放到 5x7
    const bboxW = maxX - minX + 1;
    const bboxH = maxY - minY + 1;
    const result: number[][] = [];
    for (let row = 0; row < 7; row++) {
      const rowArr: number[] = [];
      for (let col = 0; col < 5; col++) {
        // 反采样：5x7 的每格对应 bbox 中的一个区域
        const srcStartX = minX + (col * bboxW) / 5;
        const srcEndX = minX + ((col + 1) * bboxW) / 5;
        const srcStartY = minY + (row * bboxH) / 7;
        const srcEndY = minY + ((row + 1) * bboxH) / 7;

        let darkCount = 0;
        let totalCount = 0;
        for (let sy = Math.floor(srcStartY); sy <= Math.floor(srcEndY); sy++) {
          for (let sx = Math.floor(srcStartX); sx <= Math.floor(srcEndX); sx++) {
            const px = Math.floor((sx + 0.5) * cellSize);
            const py = Math.floor((sy + 0.5) * cellSize);
            if (px < 0 || px >= CANVAS_SIZE || py < 0 || py >= CANVAS_SIZE) continue;
            const idx = (py * CANVAS_SIZE + px) * 4;
            const darkness = 255 - (imgData[idx] * 0.299 + imgData[idx + 1] * 0.587 + imgData[idx + 2] * 0.114);
            totalCount++;
            if (darkness > 50) darkCount++;
          }
        }
        rowArr.push(totalCount > 0 && darkCount / totalCount > 0.3 ? 1 : 0);
      }
      result.push(rowArr);
    }
    return result;
  };

  const recognize = async () => {
    setRecognizing(true);
    setResults([]);
    // 模拟 AI 思考过程
    await new Promise((r) => setTimeout(r, 600));

    const grid = sampleGrid();

    // 检查是否为空
    const filledCells = grid.flat().filter((v) => v === 1).length;
    if (filledCells < 3) {
      toast.info('画布太空啦，写一个数字再试试～');
      setRecognizing(false);
      return;
    }

    // 与每个模板比较相似度
    const scores: ResultItem[] = [];
    for (let d = 0; d <= 9; d++) {
      const template = DIGIT_TEMPLATES[d];
      let match = 0;
      let total = 0;
      for (let r = 0; r < 7; r++) {
        for (let c = 0; c < 5; c++) {
          total++;
          if (grid[r][c] === template[r][c]) match++;
        }
      }
      scores.push({ digit: d, confidence: Math.round((match / total) * 100) });
    }

    // 加入一些随机性，让演示更"AI 感"
    const finalScores = scores.map((s) => ({
      digit: s.digit,
      confidence: Math.min(99, Math.max(5, s.confidence + Math.floor(Math.random() * 10 - 3))),
    }));

    finalScores.sort((a, b) => b.confidence - a.confidence);
    setResults(finalScores.slice(0, 3));
    setRecognizing(false);
  };

  const topResult = results[0];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-6">
        {/* 画布区 */}
        <div className="space-y-4">
          <div className="aspect-square max-w-[320px] mx-auto w-full relative">
            <canvas
              ref={canvasRef}
              width={CANVAS_SIZE}
              height={CANVAS_SIZE}
              onMouseDown={startDraw}
              onMouseMove={draw}
              onMouseUp={endDraw}
              onMouseLeave={endDraw}
              onTouchStart={startDraw}
              onTouchMove={draw}
              onTouchEnd={endDraw}
              className="w-full h-full rounded-2xl border-2 border-border bg-white cursor-crosshair shadow-inner touch-none"
            />
            {topResult && (
              <div className="absolute -top-3 -right-3 size-20 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 text-white flex flex-col items-center justify-center shadow-lg animate-bounce">
                <div className="text-2xl font-bold">{topResult.digit}</div>
                <div className="text-[10px] opacity-90">{topResult.confidence}%</div>
              </div>
            )}
          </div>

          <div className="flex gap-2 justify-center flex-wrap">
            <Button onClick={recognize} disabled={recognizing} className="gap-2">
              <Play className="size-4" />
              {recognizing ? 'AI 识别中...' : '让 AI 猜一猜'}
            </Button>
            <Button variant="outline" onClick={clearCanvas} className="gap-2">
              <Eraser className="size-4" />
              清空画布
            </Button>
          </div>
        </div>

        {/* 结果区 */}
        <div className="space-y-3">
          <div className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
            <HelpCircle className="size-3.5" />
            AI 猜测 Top 3
          </div>
          {results.length === 0 && !recognizing && (
            <div className="p-6 rounded-xl bg-muted/40 border border-border/50 text-center text-sm text-muted-foreground">
              在左边写一个 0-9 的数字
              <br />
              然后点「让 AI 猜一猜」
            </div>
          )}
          {recognizing && (
            <div className="p-6 rounded-xl bg-gradient-to-br from-primary/10 to-purple-500/10 border border-primary/20 text-center">
              <div className="text-sm text-primary font-medium">AI 正在识别...</div>
              <div className="text-xs text-muted-foreground mt-1">提取特征 · 模板匹配</div>
            </div>
          )}
          <div className="space-y-2">
            {results.map((r, i) => (
              <div
                key={r.digit}
                className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                  i === 0
                    ? 'bg-gradient-to-r from-amber-500/15 to-orange-500/10 border-amber-500/30'
                    : 'bg-card border-border/50'
                }`}
              >
                <div
                  className={`size-10 rounded-lg flex items-center justify-center text-xl font-bold ${
                    i === 0
                      ? 'bg-gradient-to-br from-amber-500 to-orange-500 text-white'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {r.digit}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-medium">
                      {i === 0 ? '最可能' : i === 1 ? '第 2 名' : '第 3 名'}
                    </span>
                    <span className="tabular-nums text-muted-foreground">{r.confidence}%</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        i === 0
                          ? 'bg-gradient-to-r from-amber-500 to-orange-500'
                          : i === 1
                            ? 'bg-sky-500'
                            : 'bg-violet-500'
                      }`}
                      style={{ width: `${r.confidence}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 原理卡片 */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-primary/5 to-purple-500/5 border border-primary/20">
        <div className="flex items-start gap-3">
          <Badge className="bg-primary/15 text-primary border-primary/20 shrink-0">AI 小知识</Badge>
          <p className="text-sm text-muted-foreground leading-relaxed">
            <span className="font-medium text-foreground">手写数字识别</span>
            是计算机视觉的经典入门案例。真实的 AI 会使用卷积神经网络（CNN）从海量手写样本中学习特征；
            这里的 Demo 用简化的「模板匹配」算法模拟 AI 的识别过程——把你写的数字缩放到标准尺寸，再和 0-9 的模板逐一比对相似度。
          </p>
        </div>
      </div>
    </div>
  );
}

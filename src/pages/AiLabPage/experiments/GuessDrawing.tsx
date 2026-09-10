import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Eraser, Lightbulb, Sparkles, Palette, GraduationCap, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type Stage = 'primary' | 'junior';

const CANVAS_SIZE = 280;

// 预设图形类别（简单形状，用特征匹配）
const CATEGORIES = [
  { id: 'circle', name: '圆形', emoji: '⭕' },
  { id: 'square', name: '方形', emoji: '⬜' },
  { id: 'triangle', name: '三角形', emoji: '🔺' },
  { id: 'star', name: '星星', emoji: '⭐' },
  { id: 'heart', name: '爱心', emoji: '❤️' },
  { id: 'house', name: '房子', emoji: '🏠' },
  { id: 'tree', name: '树', emoji: '🌳' },
  { id: 'sun', name: '太阳', emoji: '☀️' },
];

// 网格大小（用于特征提取）
const GRID = 14;

type Prediction = { id: string; name: string; emoji: string; confidence: number };

export default function GuessDrawing() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [hasDrawing, setHasDrawing] = useState(false);
  const [stage, setStage] = useState<Stage>('primary');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);

  // 初始化 canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = CANVAS_SIZE * dpr;
    canvas.height = CANVAS_SIZE * dpr;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.scale(dpr, dpr);
    ctx.fillStyle = '#fafafa';
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  }, []);

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = CANVAS_SIZE / rect.width;
    const scaleY = CANVAS_SIZE / rect.height;
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

  const drawLine = (from: { x: number; y: number }, to: { x: number; y: number }) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
  };

  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsDrawing(true);
    const pos = getPos(e);
    lastPosRef.current = pos;
    drawLine(pos, pos);
  };

  const onDraw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    e.preventDefault();
    const pos = getPos(e);
    if (lastPosRef.current) {
      drawLine(lastPosRef.current, pos);
    }
    lastPosRef.current = pos;
  };

  const endDraw = () => {
    if (isDrawing) {
      setIsDrawing(false);
      setHasDrawing(true);
      lastPosRef.current = null;
      analyze();
    }
  };

  // 清空画布
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#fafafa';
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    setPredictions([]);
    setHasDrawing(false);
  };

  // 提取图像特征（二值化 + 网格密度）
  const extractFeatures = (): number[] => {
    const canvas = canvasRef.current;
    if (!canvas) return new Array(GRID * GRID).fill(0);
    const ctx = canvas.getContext('2d');
    if (!ctx) return new Array(GRID * GRID).fill(0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const dpr = window.devicePixelRatio || 1;
    const pixelStep = Math.floor((CANVAS_SIZE * dpr) / GRID);

    const features: number[] = [];
    for (let gy = 0; gy < GRID; gy++) {
      for (let gx = 0; gx < GRID; gx++) {
        let darkPixels = 0;
        let total = 0;
        for (let dy = 0; dy < pixelStep; dy++) {
          for (let dx = 0; dx < pixelStep; dx++) {
            const px = gx * pixelStep + dx;
            const py = gy * pixelStep + dy;
            if (px >= canvas.width || py >= canvas.height) continue;
            const idx = (py * canvas.width + px) * 4;
            const brightness = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
            if (brightness < 200) darkPixels++;
            total++;
          }
        }
        features.push(total > 0 ? darkPixels / total : 0);
      }
    }
    return features;
  };

  // 计算额外形状特征
  const extractShapeFeatures = (): {
    aspectRatio: number;
    fillRatio: number;
    centroidX: number;
    centroidY: number;
    cornerCount: number;
    symmetry: number;
  } => {
    const canvas = canvasRef.current;
    if (!canvas) return { aspectRatio: 1, fillRatio: 0, centroidX: 0.5, centroidY: 0.5, cornerCount: 0, symmetry: 0 };
    const ctx = canvas.getContext('2d');
    if (!ctx) return { aspectRatio: 1, fillRatio: 0, centroidX: 0.5, centroidY: 0.5, cornerCount: 0, symmetry: 0 };

    const dpr = window.devicePixelRatio || 1;
    const w = canvas.width;
    const h = canvas.height;
    const imageData = ctx.getImageData(0, 0, w, h);
    const data = imageData.data;

    let minX = w, maxX = 0, minY = h, maxY = 0;
    let darkCount = 0;
    let sumX = 0, sumY = 0;
    let leftDark = 0, rightDark = 0;

    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const idx = (y * w + x) * 4;
        const brightness = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
        if (brightness < 200) {
          darkCount++;
          sumX += x;
          sumY += y;
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
          if (x < w / 2) leftDark++;
          else rightDark++;
        }
      }
    }

    if (darkCount < 50) {
      return { aspectRatio: 1, fillRatio: 0, centroidX: 0.5, centroidY: 0.5, cornerCount: 0, symmetry: 0 };
    }

    const bbW = maxX - minX;
    const bbH = maxY - minY;
    const aspectRatio = bbH > 0 ? bbW / bbH : 1;
    const fillRatio = darkCount / (bbW * bbH + 1);
    const centroidX = sumX / darkCount / w;
    const centroidY = sumY / darkCount / h;
    const symmetry = 1 - Math.abs(leftDark - rightDark) / (leftDark + rightDark);

    // 估算"角点"（边缘方向突变次数）
    const edgePixels: { x: number; y: number }[] = [];
    const step = Math.max(1, Math.floor(darkCount / 100));
    let cnt = 0;
    for (let y = 0; y < h && cnt < 200; y += 3) {
      for (let x = 0; x < w && cnt < 200; x += 3) {
        const idx = (y * w + x) * 4;
        const brightness = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
        if (brightness < 200) {
          // 检查是不是边缘点（周围有空白）
          const check = (dx: number, dy: number) => {
            const nx = x + dx, ny = y + dy;
            if (nx < 0 || nx >= w || ny < 0 || ny >= h) return true;
            const nidx = (ny * w + nx) * 4;
            return (data[nidx] + data[nidx + 1] + data[nidx + 2]) / 3 >= 200;
          };
          if (check(-3, 0) || check(3, 0) || check(0, -3) || check(0, 3)) {
            edgePixels.push({ x, y });
            cnt++;
          }
        }
      }
    }

    // 计算角点数量近似（方向变化 > 阈值）
    let cornerCount = 0;
    if (edgePixels.length > 10) {
      for (let i = 2; i < edgePixels.length - 2; i++) {
        const p0 = edgePixels[i - 2];
        const p1 = edgePixels[i];
        const p2 = edgePixels[i + 2];
        const a1 = Math.atan2(p1.y - p0.y, p1.x - p0.x);
        const a2 = Math.atan2(p2.y - p1.y, p2.x - p1.x);
        let diff = Math.abs(a2 - a1);
        if (diff > Math.PI) diff = 2 * Math.PI - diff;
        if (diff > 0.5) cornerCount++;
      }
    }

    return { aspectRatio, fillRatio, centroidX, centroidY, cornerCount, symmetry };
  };

  // 形状模板的"理想特征"（手工设计的类别特征向量）
  const getTemplateScore = (features: number[], shape: ReturnType<typeof extractShapeFeatures>): Record<string, number> => {
    const scores: Record<string, number> = {};

    // 计算整体密度和对称性等基础分
    const totalDark = features.reduce((a, b) => a + b, 0);
    const density = totalDark / (GRID * GRID);

    // 圆形：填充率中等、宽高比接近1、角点少、对称性高
    const circleScore =
      Math.exp(-Math.pow(shape.aspectRatio - 1, 2) * 8) * 0.35 +
      Math.exp(-Math.pow(shape.fillRatio - 0.5, 2) * 20) * 0.25 +
      Math.max(0, 1 - shape.cornerCount / 30) * 0.25 +
      shape.symmetry * 0.15;
    scores.circle = circleScore;

    // 方形：填充率较高、宽高比接近1、有4个明显的角（中等角点数）
    const squareScore =
      Math.exp(-Math.pow(shape.aspectRatio - 1, 2) * 8) * 0.3 +
      Math.exp(-Math.pow(shape.fillRatio - 0.7, 2) * 15) * 0.3 +
      Math.exp(-Math.pow((shape.cornerCount - 20) / 15, 2)) * 0.25 +
      shape.symmetry * 0.15;
    scores.square = squareScore;

    // 三角形：填充率中等、有3个明显角、底部宽顶部窄
    // 检查上半部分和下半部分密度比
    let topHalf = 0, bottomHalf = 0;
    for (let y = 0; y < GRID; y++) {
      for (let x = 0; x < GRID; x++) {
        const idx = y * GRID + x;
        if (y < GRID / 2) topHalf += features[idx];
        else bottomHalf += features[idx];
      }
    }
    const topBottomRatio = bottomHalf > 0 ? topHalf / bottomHalf : 1;
    const triangleScore =
      Math.exp(-Math.pow(topBottomRatio - 0.5, 2) * 8) * 0.35 +
      Math.exp(-Math.pow((shape.cornerCount - 25) / 20, 2)) * 0.25 +
      Math.exp(-Math.pow(shape.aspectRatio - 0.9, 2) * 5) * 0.2 +
      Math.exp(-Math.pow(shape.fillRatio - 0.45, 2) * 15) * 0.2;
    scores.triangle = triangleScore;

    // 星星：角点多、对称性高、填充率中等偏低、有"突出"
    const starScore =
      Math.min(1, shape.cornerCount / 40) * 0.35 +
      shape.symmetry * 0.25 +
      Math.exp(-Math.pow(shape.fillRatio - 0.4, 2) * 12) * 0.2 +
      Math.exp(-Math.pow(shape.aspectRatio - 1, 2) * 6) * 0.2;
    scores.star = starScore;

    // 爱心：上宽下尖、左右对称、底部有个"尖"
    // 检查中间行的左右对称
    let leftHalf = 0, rightHalf = 0;
    for (let y = 0; y < GRID; y++) {
      for (let x = 0; x < GRID; x++) {
        const idx = y * GRID + x;
        if (x < GRID / 2) leftHalf += features[idx];
        else rightHalf += features[idx];
      }
    }
    const heartSymmetry = 1 - Math.abs(leftHalf - rightHalf) / (leftHalf + rightHalf + 0.001);
    // 爱心顶部宽底部窄
    const heartScore =
      heartSymmetry * 0.3 +
      Math.exp(-Math.pow(topBottomRatio - 1.5, 2) * 5) * 0.25 +
      Math.exp(-Math.pow(shape.aspectRatio - 1.1, 2) * 5) * 0.2 +
      Math.exp(-Math.pow(shape.fillRatio - 0.5, 2) * 15) * 0.25;
    scores.heart = heartScore;

    // 房子：下部分方、上部分尖（三角屋顶）
    const houseScore =
      Math.exp(-Math.pow(topBottomRatio - 0.8, 2) * 5) * 0.3 +
      Math.exp(-Math.pow(shape.aspectRatio - 0.95, 2) * 5) * 0.2 +
      Math.exp(-Math.pow(shape.fillRatio - 0.55, 2) * 10) * 0.25 +
      Math.exp(-Math.pow((shape.cornerCount - 30) / 20, 2)) * 0.25;
    scores.house = houseScore;

    // 树：上圆下窄（树冠+树干）、底部集中垂直
    // 检查底部 1/4 是否窄（树干）
    let bottomQuarter = 0;
    for (let y = Math.floor(GRID * 0.75); y < GRID; y++) {
      for (let x = 0; x < GRID; x++) {
        bottomQuarter += features[y * GRID + x];
      }
    }
    const bottomRatio = bottomQuarter / (totalDark + 0.001);
    const treeScore =
      Math.exp(-Math.pow(bottomRatio - 0.2, 2) * 8) * 0.3 +
      Math.exp(-Math.pow(shape.aspectRatio - 1.3, 2) * 4) * 0.25 +
      shape.symmetry * 0.2 +
      Math.exp(-Math.pow(shape.fillRatio - 0.4, 2) * 10) * 0.25;
    scores.tree = treeScore;

    // 太阳：圆形 + 外围"射线"（角点多但是径向的）
    const sunScore =
      shape.symmetry * 0.25 +
      Math.min(1, shape.cornerCount / 35) * 0.3 +
      Math.exp(-Math.pow(shape.aspectRatio - 1, 2) * 6) * 0.2 +
      Math.exp(-Math.pow(shape.fillRatio - 0.45, 2) * 10) * 0.25;
    scores.sun = sunScore;

    // 如果几乎没有画东西，全部给低分
    if (density < 0.02) {
      Object.keys(scores).forEach((k) => { scores[k] = 0.05; });
    }

    return scores;
  };

  // 分析图像
  const analyze = useCallback(() => {
    setIsAnalyzing(true);
    setTimeout(() => {
      const features = extractFeatures();
      const shape = extractShapeFeatures();
      const rawScores = getTemplateScore(features, shape);

      // 转为概率（softmax + 放大差异）
      const temperature = 0.15;
      const exps = Object.entries(rawScores).map(([k, v]) => ({
        id: k,
        exp: Math.exp(v / temperature),
      }));
      const sumExp = exps.reduce((a, b) => a + b.exp, 0);

      const results: Prediction[] = exps
        .map((e) => {
          const cat = CATEGORIES.find((c) => c.id === e.id)!;
          return {
            id: e.id,
            name: cat.name,
            emoji: cat.emoji,
            confidence: (e.exp / sumExp) * 100,
          };
        })
        .sort((a, b) => b.confidence - a.confidence);

      setPredictions(results);
      setIsAnalyzing(false);
    }, 400);
  }, []);

  const topPrediction = predictions[0];

  const primaryTip = (
    <div className="space-y-2 text-sm">
      <p className="font-medium text-foreground">🧒 小学版：AI 猜谜游戏</p>
      <ul className="space-y-1 text-muted-foreground text-xs list-disc pl-4">
        <li>在左边画板上画一个图形（比如圆、星星、房子）</li>
        <li>画完后松手，AI 会立刻猜你画的是什么</li>
        <li>看看 AI 猜对了吗？它给出的百分比代表它有多"确定"</li>
        <li>试着画得更完整、更清楚，AI 会猜得更准！</li>
      </ul>
    </div>
  );

  const juniorTip = (
    <div className="space-y-2 text-sm">
      <p className="font-medium text-foreground">🔬 初中版：图像识别的秘密</p>
      <ul className="space-y-1 text-muted-foreground text-xs list-disc pl-4">
        <li><span className="font-medium">图像 = 像素矩阵</span>：图片其实是很多小格子，每个格子有不同颜色</li>
        <li><span className="font-medium">特征提取</span>：AI 会分析形状的轮廓、对称性、角点数量等特征</li>
        <li><span className="font-medium">模式匹配</span>：把提取到的特征和已知图形的模板做对比</li>
        <li><span className="font-medium">置信度</span>：百分比越高，说明 AI 越确定它猜得对</li>
        <li><span className="font-medium">试一试</span>：画得越标准，AI 越准；画歪了或加了多余线条，AI 会"糊涂"</li>
      </ul>
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* 左侧：画板 */}
      <div className="lg:col-span-2 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <p className="text-sm text-muted-foreground">
            在画板上画一个图形，松手后 AI 会立即识别
          </p>
          <Button size="sm" variant="secondary" onClick={clearCanvas} className="gap-1.5">
            <Eraser className="size-3.5" />
            清空画板
          </Button>
        </div>

        <div className="relative rounded-xl border-2 border-dashed border-border bg-card overflow-hidden shadow-sm inline-block">
          <canvas
            ref={canvasRef}
            onMouseDown={startDraw}
            onMouseMove={onDraw}
            onMouseUp={endDraw}
            onMouseLeave={endDraw}
            onTouchStart={startDraw}
            onTouchMove={onDraw}
            onTouchEnd={endDraw}
            className="block cursor-crosshair touch-none"
            style={{ width: CANVAS_SIZE, height: CANVAS_SIZE, maxWidth: '100%' }}
          />
          {!hasDrawing && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <p className="text-muted-foreground text-sm flex items-center gap-2">
                <Palette className="size-4" />
                用鼠标或手指在这里画吧～
              </p>
            </div>
          )}
          {isAnalyzing && (
            <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center">
              <div className="flex items-center gap-2 text-sm text-foreground">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                  <Sparkles className="size-5 text-primary" />
                </motion.div>
                AI 正在识别…
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="text-xs text-muted-foreground self-center">试着画：</span>
          {CATEGORIES.map((c) => (
            <Badge key={c.id} variant="outline" className="gap-1 bg-card/50">
              <span>{c.emoji}</span>
              {c.name}
            </Badge>
          ))}
        </div>
      </div>

      {/* 右侧：识别结果 + 知识 */}
      <div className="space-y-4">
        {/* 识别结果 */}
        <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
          <div className="p-4 border-b border-border/50 bg-muted/30">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Target className="size-4 text-primary" />
              识别结果
            </div>
          </div>
          <div className="p-4 space-y-4">
            {predictions.length > 0 ? (
              <>
                {/* Top 1 */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center p-4 rounded-xl bg-gradient-to-br from-primary/10 to-purple-500/10 border border-primary/20"
                >
                  <div className="text-5xl mb-2">{topPrediction.emoji}</div>
                  <div className="text-xl font-bold text-foreground">{topPrediction.name}</div>
                  <div className="text-sm text-primary font-semibold mt-1">
                    {topPrediction.confidence.toFixed(1)}% 置信度
                  </div>
                  <div className="mt-3 h-2 bg-background rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${topPrediction.confidence}%` }}
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                      className="h-full bg-gradient-to-r from-primary to-purple-500"
                    />
                  </div>
                </motion.div>

                {/* Top 2-3 */}
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">其他可能：</p>
                  {predictions.slice(1, 4).map((p, i) => (
                    <motion.div
                      key={p.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + i * 0.1 }}
                      className="flex items-center gap-3"
                    >
                      <span className="text-xl">{p.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-foreground">{p.name}</span>
                          <span className="text-muted-foreground tabular-nums">{p.confidence.toFixed(1)}%</span>
                        </div>
                        <div className="h-1.5 bg-muted rounded-full overflow-hidden mt-1">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${p.confidence}%` }}
                            transition={{ duration: 0.6, delay: 0.2 + i * 0.1, ease: 'easeOut' }}
                            className="h-full bg-muted-foreground/40"
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-muted-foreground text-sm">
                画个图形，让 AI 猜猜看 👀
              </div>
            )}
          </div>
        </div>

        {/* 学段切换 */}
        <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
          <Tabs value={stage} onValueChange={(v) => setStage(v as Stage)} className="w-full">
            <TabsList className="grid grid-cols-2 w-full h-9 rounded-none border-b border-border/50">
              <TabsTrigger value="primary" className="text-xs">小学</TabsTrigger>
              <TabsTrigger value="junior" className="text-xs">初中</TabsTrigger>
            </TabsList>
            <TabsContent value="primary" className="p-4 mt-0">{primaryTip}</TabsContent>
            <TabsContent value="junior" className="p-4 mt-0">{juniorTip}</TabsContent>
          </Tabs>
        </div>

        {/* 知识点 */}
        <div className="rounded-xl bg-pink-500/5 border border-pink-500/20 p-4 space-y-2">
          <div className="flex items-center gap-2 text-sm font-semibold text-pink-600">
            <Lightbulb className="size-4" />
            AI 小知识
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            图像识别的核心是<span className="text-foreground font-medium">特征提取 + 模式匹配</span>。
            AI 先从图片里提取线条、形状、纹理等特征，
            再把这些特征和它学过的各种图形模式对比，找出最像的那一个。
            真实的图像识别 AI 用了更深的神经网络，但基本思路是一样的！
          </p>
        </div>
      </div>
    </div>
  );
}

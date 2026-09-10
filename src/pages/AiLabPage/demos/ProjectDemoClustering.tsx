import { useState, useRef, useCallback, useEffect } from 'react';
import { Play, RotateCcw, Plus, Minus, Shuffle, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

interface Point {
  x: number;
  y: number;
  cluster: number;
}

const CANVAS_W = 520;
const CANVAS_H = 380;
const K_COLORS = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

function generateRandomPoints(count: number, k: number): Point[] {
  const points: Point[] = [];
  // 生成 k 个簇的中心
  const centers = [];
  for (let i = 0; i < k; i++) {
    centers.push({
      x: 60 + Math.random() * (CANVAS_W - 120),
      y: 60 + Math.random() * (CANVAS_H - 120),
    });
  }

  for (let i = 0; i < count; i++) {
    const ci = i % k;
    const cx = centers[ci].x + (Math.random() - 0.5) * 120;
    const cy = centers[ci].y + (Math.random() - 0.5) * 100;
    points.push({
      x: Math.max(10, Math.min(CANVAS_W - 10, cx)),
      y: Math.max(10, Math.min(CANVAS_H - 10, cy)),
      cluster: -1,
    });
  }
  return points;
}

export default function ProjectDemoClustering() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [k, setK] = useState(3);
  const [pointCount, setPointCount] = useState(120);
  const [points, setPoints] = useState<Point[]>(() => generateRandomPoints(120, 3));
  const [centroids, setCentroids] = useState<{ x: number; y: number }[]>([]);
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [converged, setConverged] = useState(false);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    // 网格
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    for (let x = 0; x < CANVAS_W; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, CANVAS_H);
      ctx.stroke();
    }
    for (let y = 0; y < CANVAS_H; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(CANVAS_W, y);
      ctx.stroke();
    }

    // 绘制点
    points.forEach((p) => {
      const color = p.cluster >= 0 ? K_COLORS[p.cluster % K_COLORS.length] : '#94a3b8';
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.6)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    });

    // 绘制质心
    centroids.forEach((c, i) => {
      const color = K_COLORS[i % K_COLORS.length];
      ctx.fillStyle = color;
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(c.x, c.y, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // 质心十字
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(c.x - 5, c.y);
      ctx.lineTo(c.x + 5, c.y);
      ctx.moveTo(c.x, c.y - 5);
      ctx.lineTo(c.x, c.y + 5);
      ctx.stroke();
    });
  }, [points, centroids]);

  useEffect(() => {
    draw();
  }, [draw]);

  const resetPoints = () => {
    setPoints(generateRandomPoints(pointCount, k));
    setCentroids([]);
    setStep(0);
    setConverged(false);
    setIsPlaying(false);
  };

  const initializeCentroids = () => {
    // K-Means++ 风格：随机选 k 个点作为初始质心
    const shuffled = [...points].sort(() => Math.random() - 0.5);
    const newCentroids = shuffled.slice(0, k).map((p) => ({ x: p.x, y: p.y }));
    setCentroids(newCentroids);
    setStep(1);
    setConverged(false);
  };

  const assignClusters = (pts: Point[], cents: { x: number; y: number }[]): Point[] => {
    return pts.map((p) => {
      let minDist = Infinity;
      let minIdx = -1;
      cents.forEach((c, i) => {
        const dist = (p.x - c.x) ** 2 + (p.y - c.y) ** 2;
        if (dist < minDist) {
          minDist = dist;
          minIdx = i;
        }
      });
      return { ...p, cluster: minIdx };
    });
  };

  const updateCentroids = (pts: Point[], kVal: number): { x: number; y: number }[] => {
    const newCentroids = [];
    for (let i = 0; i < kVal; i++) {
      const clusterPts = pts.filter((p) => p.cluster === i);
      if (clusterPts.length === 0) {
        // 空簇：随机放一个点
        newCentroids.push({
          x: Math.random() * CANVAS_W,
          y: Math.random() * CANVAS_H,
        });
      } else {
        const avgX = clusterPts.reduce((s, p) => s + p.x, 0) / clusterPts.length;
        const avgY = clusterPts.reduce((s, p) => s + p.y, 0) / clusterPts.length;
        newCentroids.push({ x: avgX, y: avgY });
      }
    }
    return newCentroids;
  };

  const runOneStep = () => {
    if (centroids.length === 0) {
      initializeCentroids();
      return;
    }

    // 分配簇
    const newPoints = assignClusters(points, centroids);
    // 更新质心
    const newCentroids = updateCentroids(newPoints, k);

    // 判断是否收敛
    const maxMove = Math.max(
      ...newCentroids.map((c, i) => {
        if (i >= centroids.length) return Infinity;
        return Math.sqrt((c.x - centroids[i].x) ** 2 + (c.y - centroids[i].y) ** 2);
      }),
    );

    setPoints(newPoints);
    setCentroids(newCentroids);
    setStep((s) => s + 1);

    if (maxMove < 1) {
      setConverged(true);
      setIsPlaying(false);
    }
  };

  // 自动播放
  useEffect(() => {
    if (!isPlaying || converged) return;
    const timer = setTimeout(() => {
      runOneStep();
    }, 500);
    return () => clearTimeout(timer);
  }, [isPlaying, step, converged, centroids, points, k]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    const newPoint: Point = { x, y, cluster: -1 };
    setPoints([...points, newPoint]);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-3 items-center">
        <Button onClick={initializeCentroids} variant="outline">
          <Shuffle className="size-4 mr-2" />
          随机初始化质心
        </Button>
        <Button onClick={runOneStep} disabled={converged}>
          <Zap className="size-4 mr-2" />
          单步运行
        </Button>
        <Button
          onClick={() => setIsPlaying(!isPlaying)}
          className="bg-gradient-to-r from-emerald-600 to-teal-500"
          disabled={converged}
        >
          <Play className="size-4 mr-2" />
          {isPlaying ? '暂停' : '自动播放'}
        </Button>
        <Button variant="outline" onClick={resetPoints}>
          <RotateCcw className="size-4 mr-2" />
          重置数据
        </Button>

        <div className="flex items-center gap-3 ml-auto">
          <span className="text-xs text-muted-foreground">K 值</span>
          <div className="w-28">
            <Slider value={[k]} onValueChange={(v) => setK(v[0])} min={2} max={6} step={1} />
          </div>
          <span className="text-sm font-bold text-primary w-5">{k}</span>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="rounded-xl overflow-hidden border border-border/60 bg-card shadow-sm">
            <canvas
              ref={canvasRef}
              width={CANVAS_W}
              height={CANVAS_H}
              className="w-full cursor-crosshair block"
              onClick={handleCanvasClick}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            点击画布可以手动添加数据点
          </p>
        </div>

        <div className="w-full md:w-56 space-y-3">
          <div className="p-4 rounded-xl bg-card border border-border/60">
            <p className="text-xs text-muted-foreground mb-2">当前状态</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">数据点</span>
                <span className="font-semibold tabular-nums">{points.length} 个</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">迭代步数</span>
                <span className="font-semibold tabular-nums text-primary">{step}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">状态</span>
                <Badge className={converged ? 'bg-emerald-500 border-0' : 'bg-blue-500 border-0'}>
                  {converged ? '已收敛' : step === 0 ? '未开始' : '迭代中'}
                </Badge>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-card border border-border/60">
            <p className="text-xs text-muted-foreground mb-2">簇颜色</p>
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: k }).map((_, i) => (
                <div key={i} className="flex items-center gap-1">
                  <div
                    className="size-3 rounded-full"
                    style={{ backgroundColor: K_COLORS[i % K_COLORS.length] }}
                  />
                  <span className="text-xs text-foreground">簇 {i + 1}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-amber-50 border border-amber-100">
            <p className="text-xs text-amber-700 leading-relaxed">
              💡 K-Means 算法：随机选 K 个质心 → 把点归到最近的簇 → 更新质心位置 → 反复迭代直到收敛
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Play, RotateCcw, Plus, Minus, Zap, Target, TrendingDown, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type Point = { x: number; y: number; label: 0 | 1 };
type Stage = 'primary' | 'junior' | 'senior';

const CANVAS_SIZE = 400;
const CLASS_A_COLOR = '#6366f1'; // indigo  (苹果/蓝)
const CLASS_B_COLOR = '#ec4899'; // pink    (橘子/粉)

// 逻辑回归 + 梯度下降
function sigmoid(z: number): number {
  return 1 / (1 + Math.exp(-z));
}

function predict(x: number, y: number, w0: number, w1: number, b: number): number {
  return sigmoid(w0 * x + w1 * y + b);
}

export default function MlTrainer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [points, setPoints] = useState<Point[]>([]);
  const [activeClass, setActiveClass] = useState<0 | 1>(0);
  const [isTraining, setIsTraining] = useState(false);
  const [trainingStep, setTrainingStep] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [loss, setLoss] = useState(0);
  const [learningRate, setLearningRate] = useState(0.5);
  const [stage, setStage] = useState<Stage>('junior');

  // 模型参数
  const modelRef = useRef({ w0: 0, w1: 0, b: 0 });
  const animRef = useRef<number | null>(null);

  // 初始示例数据
  useEffect(() => {
    const initial: Point[] = [];
    // 蓝点（左上）
    for (let i = 0; i < 8; i++) {
      initial.push({
        x: 80 + Math.random() * 100,
        y: 80 + Math.random() * 100,
        label: 0,
      });
    }
    // 粉点（右下）
    for (let i = 0; i < 8; i++) {
      initial.push({
        x: 220 + Math.random() * 100,
        y: 220 + Math.random() * 100,
        label: 1,
      });
    }
    setPoints(initial);
  }, []);

  // 绘制 canvas
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    if (canvas.width !== CANVAS_SIZE * dpr) {
      canvas.width = CANVAS_SIZE * dpr;
      canvas.height = CANVAS_SIZE * dpr;
      ctx.scale(dpr, dpr);
    }

    // 背景
    ctx.fillStyle = '#fafafa';
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // 网格
    ctx.strokeStyle = '#f0f0f0';
    ctx.lineWidth = 1;
    for (let i = 0; i <= CANVAS_SIZE; i += 40) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, CANVAS_SIZE);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(CANVAS_SIZE, i);
      ctx.stroke();
    }

    // 决策背景（训练后）
    if (trainingStep > 0 || isTraining) {
      const { w0, w1, b } = modelRef.current;
      const step = 8;
      for (let px = 0; px < CANVAS_SIZE; px += step) {
        for (let py = 0; py < CANVAS_SIZE; py += step) {
          const p = predict(px, py, w0 * 0.01, w1 * 0.01, b);
          const r = Math.round(99 + (236 - 99) * p);
          const g = Math.round(102 + (72 - 102) * p);
          const bv = Math.round(241 + (153 - 241) * p);
          ctx.fillStyle = `rgba(${r}, ${g}, ${bv}, ${0.15 + p * 0.15})`;
          ctx.fillRect(px, py, step, step);
        }
      }

      // 决策边界线 (p=0.5)
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.6)';
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 4]);
      ctx.beginPath();
      // w0*x + w1*y + b = 0  → y = -(w0*x + b) / w1
      const w0s = w0 * 0.01;
      const w1s = w1 * 0.01;
      if (Math.abs(w1s) > 0.0001) {
        const y1 = -(w0s * 0 + b) / w1s;
        const y2 = -(w0s * CANVAS_SIZE + b) / w1s;
        ctx.moveTo(0, y1);
        ctx.lineTo(CANVAS_SIZE, y2);
      }
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // 数据点
    points.forEach((p) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 8, 0, Math.PI * 2);
      ctx.fillStyle = p.label === 0 ? CLASS_A_COLOR : CLASS_B_COLOR;
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    // 坐标轴标签
    ctx.fillStyle = '#94a3b8';
    ctx.font = '11px sans-serif';
    ctx.fillText('特征 1（如：颜色）', CANVAS_SIZE - 100, CANVAS_SIZE - 8);
    ctx.save();
    ctx.translate(12, 60);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('特征 2（如：形状）', 0, 0);
    ctx.restore();
  }, [points, isTraining, trainingStep]);

  useEffect(() => {
    draw();
  }, [draw]);

  // 点击加数据点
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isTraining) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = CANVAS_SIZE / rect.width;
    const scaleY = CANVAS_SIZE / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    if (x < 0 || x > CANVAS_SIZE || y < 0 || y > CANVAS_SIZE) return;
    setPoints((prev) => [...prev, { x, y, label: activeClass }]);
  };

  // 计算准确率和损失
  const computeMetrics = (w0: number, w1: number, b: number) => {
    if (points.length === 0) return { acc: 0, lossVal: 0 };
    let correct = 0;
    let totalLoss = 0;
    const w0s = w0 * 0.01;
    const w1s = w1 * 0.01;
    points.forEach((p) => {
      const pred = predict(p.x, p.y, w0s, w1s, b);
      const predLabel = pred >= 0.5 ? 1 : 0;
      if (predLabel === p.label) correct++;
      // 交叉熵损失
      const y = p.label;
      totalLoss += -y * Math.log(pred + 1e-10) - (1 - y) * Math.log(1 - pred + 1e-10);
    });
    return { acc: (correct / points.length) * 100, lossVal: totalLoss / points.length };
  };

  // 训练
  const startTraining = () => {
    if (points.length < 4) return;
    setIsTraining(true);
    setTrainingStep(0);
    modelRef.current = { w0: 0, w1: 0, b: 0 };

    let step = 0;
    const totalSteps = 200;
    const lr = learningRate;

    const trainStep = () => {
      const { w0, w1, b } = modelRef.current;
      const w0s = w0 * 0.01;
      const w1s = w1 * 0.01;

      let dw0 = 0, dw1 = 0, db = 0;
      points.forEach((p) => {
        const pred = predict(p.x, p.y, w0s, w1s, b);
        const error = pred - p.label;
        dw0 += error * p.x;
        dw1 += error * p.y;
        db += error;
      });

      const n = points.length;
      const newW0 = w0 - (lr * dw0) / n;
      const newW1 = w1 - (lr * dw1) / n;
      const newB = b - (lr * db) / n;

      modelRef.current = { w0: newW0, w1: newW1, b: newB };
      step++;
      setTrainingStep(step);

      const metrics = computeMetrics(newW0, newW1, newB);
      setAccuracy(metrics.acc);
      setLoss(metrics.lossVal);

      if (step < totalSteps) {
        animRef.current = requestAnimationFrame(trainStep);
      } else {
        setIsTraining(false);
      }
    };

    animRef.current = requestAnimationFrame(trainStep);
  };

  const resetModel = () => {
    if (animRef.current) cancelAnimationFrame(animRef.current);
    modelRef.current = { w0: 0, w1: 0, b: 0 };
    setIsTraining(false);
    setTrainingStep(0);
    setAccuracy(0);
    setLoss(0);
  };

  const clearPoints = () => {
    resetModel();
    setPoints([]);
  };

  useEffect(() => {
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  // 小学提示
  const primaryTip = (
    <div className="space-y-2 text-sm">
      <p className="font-medium text-foreground">🧒 小学版：观察 AI 的"眼力"</p>
      <ul className="space-y-1 text-muted-foreground text-xs list-disc pl-4">
        <li>画布上有两种颜色的小圆点，它们代表不同的东西（比如<span className="text-indigo-500 font-medium">苹果</span>和<span className="text-pink-500 font-medium">橘子</span>）</li>
        <li>点击"开始训练"，看看 AI 能不能找到一条线把它们分开</li>
        <li>AI 找到的分界线越清楚，说明它"学得越好"</li>
        <li>你也可以用鼠标在画布上点一点，添加更多数据！</li>
      </ul>
    </div>
  );

  // 初中提示
  const juniorTip = (
    <div className="space-y-2 text-sm">
      <p className="font-medium text-foreground">🔬 初中版：训练过程观察</p>
      <ul className="space-y-1 text-muted-foreground text-xs list-disc pl-4">
        <li><span className="font-medium">数据准备</span>：先选择类别（蓝/粉），在画布上点击添加数据点</li>
        <li><span className="font-medium">开始训练</span>：点击训练按钮，观察分界线的变化</li>
        <li><span className="font-medium">损失下降</span>：左边的"损失值"会越来越小，说明模型在进步</li>
        <li><span className="font-medium">准确率上升</span>：模型分类正确的比例越来越高</li>
        <li><span className="font-medium">试一试</span>：把两类点混在一起，看看 AI 还能分清楚吗？</li>
      </ul>
    </div>
  );

  // 高中提示
  const seniorTip = (
    <div className="space-y-2 text-sm">
      <p className="font-medium text-foreground">🧠 高中版：理解参数与算法</p>
      <ul className="space-y-1 text-muted-foreground text-xs list-disc pl-4">
        <li><span className="font-medium">模型</span>：逻辑回归（Logistic Regression）二分类器</li>
        <li><span className="font-medium">参数</span>：w₀、w₁ 为特征权重，b 为偏置项</li>
        <li><span className="font-medium">损失函数</span>：二元交叉熵（Binary Cross-Entropy）</li>
        <li><span className="font-medium">优化算法</span>：批量梯度下降（Batch Gradient Descent）</li>
        <li><span className="font-medium">学习率</span>：调节下方滑块观察收敛速度与稳定性的权衡</li>
        <li><span className="font-medium">决策边界</span>：w₀x₁ + w₁x₂ + b = 0 即为分界线</li>
      </ul>
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* 左侧：画布 + 控制 */}
      <div className="lg:col-span-2 space-y-4">
        {/* 类别选择 */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm font-medium text-muted-foreground">添加数据：</span>
          <Button
            size="sm"
            variant={activeClass === 0 ? 'default' : 'secondary'}
            onClick={() => setActiveClass(0)}
            className="gap-2"
          >
            <span className="size-3 rounded-full bg-white" />
            类别 A（蓝点）
          </Button>
          <Button
            size="sm"
            variant={activeClass === 1 ? 'default' : 'secondary'}
            onClick={() => setActiveClass(1)}
            className="gap-2"
            style={activeClass === 1 ? { backgroundColor: CLASS_B_COLOR } : undefined}
          >
            <span className="size-3 rounded-full bg-pink-200" />
            类别 B（粉点）
          </Button>
          <Button size="sm" variant="ghost" onClick={clearPoints} className="ml-auto gap-1.5">
            <RotateCcw className="size-3.5" />
            清空数据
          </Button>
        </div>

        {/* Canvas */}
        <div className="relative rounded-xl border border-border/50 overflow-hidden bg-card shadow-sm">
          <canvas
            ref={canvasRef}
            onClick={handleCanvasClick}
            className="w-full aspect-square cursor-crosshair block"
            style={{ maxWidth: CANVAS_SIZE }}
          />
          {points.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <p className="text-muted-foreground text-sm">点击画布添加数据点</p>
            </div>
          )}
        </div>

        {/* 训练控制 */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Button
              onClick={startTraining}
              disabled={isTraining || points.length < 4}
              className="gap-2"
            >
              {isTraining ? (
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                  <Zap className="size-4" />
                </motion.div>
              ) : (
                <Play className="size-4" />
              )}
              {isTraining ? '训练中…' : '开始训练'}
            </Button>
            <Button variant="secondary" onClick={resetModel} className="gap-1.5" disabled={isTraining}>
              <RotateCcw className="size-3.5" />
              重置模型
            </Button>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label className="text-xs text-muted-foreground">学习率 (Learning Rate)</Label>
              <span className="text-xs font-mono text-foreground">{learningRate.toFixed(2)}</span>
            </div>
            <Slider
              value={[learningRate]}
              onValueChange={(v) => setLearningRate(v[0])}
              min={0.05}
              max={2}
              step={0.05}
              disabled={isTraining}
            />
          </div>
        </div>
      </div>

      {/* 右侧：指标 + 学段提示 */}
      <div className="space-y-4">
        {/* 指标卡 */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-border/50 bg-card p-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
              <Target className="size-3.5 text-emerald-600" />
              准确率
            </div>
            <div className="text-2xl font-bold tabular-nums text-foreground">
              {accuracy.toFixed(1)}<span className="text-sm font-normal text-muted-foreground">%</span>
            </div>
            <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-300"
                style={{ width: `${accuracy}%` }}
              />
            </div>
          </div>
          <div className="rounded-xl border border-border/50 bg-card p-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
              <TrendingDown className="size-3.5 text-primary" />
              损失值
            </div>
            <div className="text-2xl font-bold tabular-nums text-foreground">
              {loss.toFixed(3)}
            </div>
            <div className="mt-2 text-[10px] text-muted-foreground">
              迭代步数：{trainingStep} / 200
            </div>
          </div>
        </div>

        {/* 训练完成提示 */}
        {trainingStep >= 200 && !isTraining && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-4"
          >
            <div className="flex items-start gap-2">
              <CheckCircle2 className="size-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-semibold text-emerald-700">训练完成！</div>
                <p className="text-xs text-emerald-600 mt-0.5">
                  模型在 {trainingStep} 步后达到 {accuracy.toFixed(1)}% 的准确率。
                  试着添加更多数据或打乱数据分布，看看模型表现如何变化。
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* 学段切换 */}
        <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
          <Tabs value={stage} onValueChange={(v) => setStage(v as Stage)} className="w-full">
            <TabsList className="grid grid-cols-3 w-full h-9 rounded-none border-b border-border/50">
              <TabsTrigger value="primary" className="text-xs">小学</TabsTrigger>
              <TabsTrigger value="junior" className="text-xs">初中</TabsTrigger>
              <TabsTrigger value="senior" className="text-xs">高中</TabsTrigger>
            </TabsList>
            <TabsContent value="primary" className="p-4 mt-0">{primaryTip}</TabsContent>
            <TabsContent value="junior" className="p-4 mt-0">{juniorTip}</TabsContent>
            <TabsContent value="senior" className="p-4 mt-0">{seniorTip}</TabsContent>
          </Tabs>
        </div>

        {/* 知识点 */}
        <div className="rounded-xl bg-primary/5 border border-primary/20 p-4 space-y-2">
          <div className="flex items-center gap-2 text-sm font-semibold text-primary">
            <Plus className="size-4" />
            学到了什么？
          </div>
          <ul className="text-xs text-muted-foreground space-y-1 list-disc pl-4">
            <li>机器学习 = 从数据中自动学习规律</li>
            <li>训练过程就是不断"猜答案 → 看对错 → 调参数"的循环</li>
            <li>数据越丰富、分布越清晰，AI 学得越好</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

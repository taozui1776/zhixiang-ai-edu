import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BrainCircuit,
  Database,
  Settings2,
  Play,
  Download,
  Cpu,
  Eye,
  Mic,
  FileText,
  Layers,
  TrendingUp,
  AlertCircle,
  Clock,
  CheckCircle2,
  Zap,
  Sparkles,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Image from '@/components/ui/image';
import { toast } from 'sonner';

const MASCOT_IMG = 'https://aka.doubaocdn.com/s/FTGHri7UGK';

/** 训练流程步骤 */
const TRAIN_STEPS = [
  { id: 'data', title: '数据准备', icon: Database, desc: '上传数据、标注、划分训练集/验证集' },
  { id: 'model', title: '模型选择', icon: BrainCircuit, desc: '选择任务类型与模型架构' },
  { id: 'config', title: '训练配置', icon: Settings2, desc: '设置学习率、批次大小、训练轮数' },
  { id: 'train', title: '开始训练', icon: Play, desc: '可视化训练过程，实时查看损失与准确率' },
  { id: 'deploy', title: '导出部署', icon: Download, desc: '导出模型文件，一键部署到智象硬件' },
];

/** 支持的任务类型 */
const TASK_TYPES = [
  {
    id: 'image-classification',
    title: '图像分类',
    icon: Eye,
    desc: '识别图片属于哪个类别，适用于物体识别、垃圾分类等场景',
    difficulty: '入门',
    stage: '小学 · 初中',
  },
  {
    id: 'object-detection',
    title: '物体检测',
    icon: Zap,
    desc: '在图片中定位并识别多个物体，适用于自动驾驶、智能监控等',
    difficulty: '进阶',
    stage: '初中 · 高中',
  },
  {
    id: 'speech-recognition',
    title: '语音识别',
    icon: Mic,
    desc: '将语音转换为文字，适用于语音助手、声控装置等',
    difficulty: '进阶',
    stage: '初中 · 高中',
  },
  {
    id: 'text-classification',
    title: '文本分类',
    icon: FileText,
    desc: '对文本进行分类，适用于情感分析、垃圾邮件识别等',
    difficulty: '入门',
    stage: '高中',
  },
];

/** 模拟训练日志 */
const MOCK_LOGS = [
  { t: '00:01', level: 'info', msg: '加载数据集... 共 1200 张图片' },
  { t: '00:02', level: 'info', msg: '训练集: 960 张，验证集: 240 张' },
  { t: '00:03', level: 'info', msg: '数据增强: 随机裁剪 + 水平翻转 + 颜色抖动' },
  { t: '00:05', level: 'info', msg: '初始化模型: MobileNetV2 (pretrained)' },
  { t: '00:06', level: 'info', msg: 'Epoch 1/10 开始...' },
  { t: '00:12', level: 'info', msg: 'Epoch 1 完成: loss=1.234, accuracy=58.2%' },
  { t: '00:13', level: 'info', msg: 'Epoch 2/10 开始...' },
  { t: '00:20', level: 'info', msg: 'Epoch 2 完成: loss=0.876, accuracy=72.4%' },
  { t: '00:25', level: 'success', msg: '训练完成！最终准确率: 91.7%' },
];

export default function AiTrainingPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [taskType, setTaskType] = useState('image-classification');
  const [training, setTraining] = useState(false);
  const [trainProgress, setTrainProgress] = useState(0);
  const [epochs, setEpochs] = useState(10);
  const [batchSize, setBatchSize] = useState(32);
  const [learningRate, setLearningRate] = useState([0.001]);
  const [logs, setLogs] = useState<typeof MOCK_LOGS>([]);

  const startTraining = () => {
    if (training) return;
    setTraining(true);
    setTrainProgress(0);
    setLogs([]);

    // 模拟训练过程
    let idx = 0;
    const timer = setInterval(() => {
      idx += 1;
      setTrainProgress((idx / MOCK_LOGS.length) * 100);
      setLogs((prev) => [...prev, MOCK_LOGS[idx - 1]]);
      if (idx >= MOCK_LOGS.length) {
        clearInterval(timer);
        setTraining(false);
        toast.success('模型训练完成！');
      }
    }, 600);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-purple-50/30">
      <main className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-12">
        {/* 顶部标题 */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="size-12 rounded-xl bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center shadow-lg shadow-primary/20">
              <BrainCircuit className="size-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">AI 模型训练</h1>
              <p className="text-sm text-muted-foreground mt-1">
                从零开始训练你的第一个 AI 模型
              </p>
            </div>
          </div>
          <Badge variant="outline" className="w-fit gap-1.5 px-3 py-1 text-xs">
            <Sparkles className="size-3 text-amber-500" />
            即将推出 · 预览版
          </Badge>
        </div>

        {/* 训练流程步骤 */}
        <Card className="mb-6">
          <CardContent className="p-5">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
              {TRAIN_STEPS.map((step, idx) => {
                const Icon = step.icon;
                const isActive = idx === activeStep;
                const isDone = idx < activeStep;
                return (
                  <div key={step.id} className="flex items-center gap-3 flex-1 min-w-0">
                    <button
                      onClick={() => !training && setActiveStep(idx)}
                      disabled={training}
                      className="flex items-center gap-2.5 text-left disabled:opacity-60"
                    >
                      <div
                        className={`size-9 rounded-full flex items-center justify-center shrink-0 transition-all ${
                          isActive
                            ? 'bg-primary text-white shadow-md shadow-primary/20'
                            : isDone
                              ? 'bg-emerald-500 text-white'
                              : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {isDone ? <CheckCircle2 className="size-4" /> : <Icon className="size-4" />}
                      </div>
                      <div className="hidden sm:block min-w-0">
                        <div className="text-sm font-medium text-foreground">
                          {idx + 1}. {step.title}
                        </div>
                        <div className="text-[10px] text-muted-foreground truncate max-w-[120px]">
                          {step.desc}
                        </div>
                      </div>
                    </button>
                    {idx < TRAIN_STEPS.length - 1 && (
                      <div
                        className={`hidden md:block flex-1 h-0.5 rounded-full ${
                          idx < activeStep ? 'bg-emerald-500' : 'bg-border'
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* 主体：步骤内容 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 左侧：配置区 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 步骤1: 数据准备 */}
            {activeStep === 0 && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">选择任务类型</CardTitle>
                    <CardDescription className="text-xs">
                      选择你想训练的 AI 模型任务
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {TASK_TYPES.map((task) => {
                        const Icon = task.icon;
                        const selected = taskType === task.id;
                        return (
                          <button
                            key={task.id}
                            onClick={() => setTaskType(task.id)}
                            className={`text-left p-4 rounded-xl border-2 transition-all ${
                              selected
                                ? 'border-primary bg-primary/5 shadow-md shadow-primary/10'
                                : 'border-border/60 hover:border-primary/40 hover:bg-accent/30'
                            }`}
                          >
                            <div className="flex items-start gap-3 mb-2">
                              <div
                                className={`size-10 rounded-lg flex items-center justify-center shrink-0 ${
                                  selected
                                    ? 'bg-primary text-white'
                                    : 'bg-muted text-muted-foreground'
                                }`}
                              >
                                <Icon className="size-5" />
                              </div>
                              <div>
                                <div className="font-semibold text-foreground text-sm">
                                  {task.title}
                                </div>
                                <div className="text-[10px] text-muted-foreground mt-0.5">
                                  {task.stage}
                                </div>
                              </div>
                            </div>
                            <p className="text-xs text-foreground/70">{task.desc}</p>
                            <div className="mt-2">
                              <Badge
                                variant={selected ? 'default' : 'secondary'}
                                className="text-[10px]"
                              >
                                {task.difficulty}
                              </Badge>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">数据集</CardTitle>
                    <CardDescription className="text-xs">
                      上传你的数据集，或使用示例数据集
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="border-2 border-dashed border-border rounded-xl p-8 text-center bg-muted/20 hover:bg-muted/30 transition-colors cursor-pointer">
                      <div className="size-12 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
                        <Database className="size-6 text-primary" />
                      </div>
                      <div className="text-sm font-medium text-foreground mb-1">
                        拖拽数据集到此处，或点击上传
                      </div>
                      <div className="text-xs text-muted-foreground mb-4">
                        支持 JPG / PNG 图片文件夹，建议每个类别 ≥ 100 张
                      </div>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => toast.info('上传数据集功能（预留）')}
                      >
                        选择文件夹
                      </Button>
                    </div>
                    <div className="mt-4 pt-4 border-t border-border/60">
                      <div className="text-xs text-muted-foreground mb-2">或使用示例数据集</div>
                      <div className="flex flex-wrap gap-2">
                        {['猫狗分类', '手写数字', '食物识别', '垃圾分类'].map((d) => (
                          <Badge
                            key={d}
                            variant="outline"
                            className="cursor-pointer hover:bg-accent px-3 py-1"
                            onClick={() => toast.info(`加载示例数据集：${d}（预留）`)}
                          >
                            {d}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* 步骤2-3: 模型与配置 */}
            {(activeStep === 1 || activeStep === 2) && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">模型架构</CardTitle>
                    <CardDescription className="text-xs">
                      选择适合你任务的模型
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {[
                      { name: 'MobileNetV2', desc: '轻量级模型，适合部署到边缘设备', size: '14 MB' },
                      { name: 'ResNet18', desc: '经典残差网络，准确率更高', size: '44 MB' },
                      { name: 'EfficientNet-B0', desc: '高效网络架构，精度与速度平衡', size: '20 MB' },
                    ].map((m, idx) => (
                      <div
                        key={m.name}
                        className={`p-3 rounded-lg border transition-all cursor-pointer ${
                          idx === 0
                            ? 'border-primary bg-primary/5'
                            : 'border-border/60 hover:border-primary/40'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-sm font-medium text-foreground">{m.name}</div>
                            <div className="text-xs text-muted-foreground">{m.desc}</div>
                          </div>
                          <Badge variant="outline" className="text-[10px]">{m.size}</Badge>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">训练参数</CardTitle>
                    <CardDescription className="text-xs">
                      调整训练超参数
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="epochs">训练轮数 (Epoch)</Label>
                        <Input
                          id="epochs"
                          type="number"
                          value={epochs}
                          onChange={(e) => setEpochs(Number(e.target.value))}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="batch">批次大小 (Batch Size)</Label>
                        <Select value={String(batchSize)} onValueChange={(v) => setBatchSize(Number(v))}>
                          <SelectTrigger id="batch">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="8">8</SelectItem>
                            <SelectItem value="16">16</SelectItem>
                            <SelectItem value="32">32</SelectItem>
                            <SelectItem value="64">64</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label>学习率 (Learning Rate)</Label>
                        <span className="text-xs text-muted-foreground font-mono">
                          {learningRate[0].toFixed(4)}
                        </span>
                      </div>
                      <Slider
                        value={learningRate}
                        onValueChange={setLearningRate}
                        min={0.0001}
                        max={0.01}
                        step={0.0001}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>数据增强</Label>
                      <div className="flex flex-wrap gap-2">
                        {['随机裁剪', '水平翻转', '颜色抖动', '旋转', '缩放'].map((a, i) => (
                          <Badge
                            key={a}
                            variant={i < 3 ? 'default' : 'outline'}
                            className="text-[10px] cursor-pointer"
                          >
                            {a}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* 步骤4: 训练 */}
            {activeStep === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-base">训练过程</CardTitle>
                        <CardDescription className="text-xs">
                          实时查看训练进度与损失曲线
                        </CardDescription>
                      </div>
                      <Button onClick={startTraining} disabled={training} className="gap-2">
                        <Play className="size-4" />
                        {training ? '训练中...' : '开始训练'}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>训练进度</span>
                        <span>{trainProgress.toFixed(0)}%</span>
                      </div>
                      <Progress value={trainProgress} />
                    </div>

                    {/* 训练日志 */}
                    <div className="bg-foreground/95 rounded-lg p-4 font-mono text-xs text-emerald-400 h-64 overflow-y-auto">
                      {logs.length === 0 ? (
                        <div className="text-foreground/40">
                          等待开始训练...
                          <br />
                          <span className="animate-pulse">_</span>
                        </div>
                      ) : (
                        logs.map((log, i) => (
                          <div key={i} className="flex gap-2">
                            <span className="text-foreground/40">[{log.t}]</span>
                            <span
                              className={
                                log.level === 'success'
                                  ? 'text-emerald-400'
                                  : log.level === 'error'
                                    ? 'text-rose-400'
                                    : 'text-sky-300'
                              }
                            >
                              {log.msg}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* 步骤5: 导出部署 */}
            {activeStep === 4 && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">模型导出与部署</CardTitle>
                    <CardDescription className="text-xs">
                      导出模型文件，部署到智象硬件或本地使用
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      { title: '导出为 ONNX 格式', desc: '通用模型格式，可在多种框架中使用', icon: FileText },
                      { title: '导出为 TensorFlow Lite', desc: '适用于移动端和嵌入式设备部署', icon: Cpu },
                      { title: '一键部署到智象 AI 主控板', desc: '通过 USB 或 Wi-Fi 直接烧录到硬件', icon: Zap },
                      { title: '一键部署到智象 AI 视觉模块', desc: '部署到视觉模块进行端侧推理', icon: Eye },
                    ].map((item, idx) => {
                      const Icon = item.icon;
                      return (
                        <div
                          key={item.title}
                          className="p-4 rounded-lg border border-border/60 hover:border-primary/40 hover:bg-accent/20 transition-all cursor-pointer"
                          onClick={() => toast.info(`${item.title}（预留）`)}
                        >
                          <div className="flex items-center gap-3">
                            <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                              <Icon className="size-4.5 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-foreground">{item.title}</div>
                              <div className="text-xs text-muted-foreground">{item.desc}</div>
                            </div>
                            <Badge variant="outline" className="text-[10px] shrink-0">
                              即将推出
                            </Badge>
                          </div>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* 底部操作按钮 */}
            <div className="flex justify-between">
              <Button
                variant="secondary"
                onClick={() => setActiveStep((p) => Math.max(0, p - 1))}
                disabled={activeStep === 0 || training}
              >
                上一步
              </Button>
              <Button
                onClick={() => setActiveStep((p) => Math.min(TRAIN_STEPS.length - 1, p + 1))}
                disabled={activeStep === TRAIN_STEPS.length - 1 || training}
                className="gap-2"
              >
                下一步
                <TrendingUp className="size-4" />
              </Button>
            </div>
          </div>

          {/* 右侧：预览 + 提示 */}
          <div className="space-y-4">
            <Card className="bg-gradient-to-br from-primary/5 to-purple-500/5 border-primary/10">
              <CardContent className="p-5 text-center">
                <div className="size-16 mx-auto mb-3 rounded-full bg-white/60 flex items-center justify-center shadow-sm">
                  <Image src={MASCOT_IMG} alt="" className="size-12 object-contain" />
                </div>
                <h3 className="font-semibold text-foreground mb-1.5">AI 训练平台</h3>
                <p className="text-xs text-muted-foreground mb-4">
                  可视化的 AI 模型训练平台，让中小学生也能理解模型训练的全过程
                </p>
                <Badge variant="outline" className="text-[10px]">预览版 · 功能陆续开放中</Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">当前配置</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">任务类型</span>
                  <span className="font-medium text-foreground">
                    {TASK_TYPES.find((t) => t.id === taskType)?.title}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">模型架构</span>
                  <span className="font-medium text-foreground">MobileNetV2</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">训练轮数</span>
                  <span className="font-medium text-foreground tabular-nums">{epochs}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">批次大小</span>
                  <span className="font-medium text-foreground tabular-nums">{batchSize}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">学习率</span>
                  <span className="font-medium text-foreground font-mono">{learningRate[0].toFixed(4)}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-amber-200/60 bg-amber-50/30">
              <CardContent className="p-4 flex items-start gap-3">
                <AlertCircle className="size-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-amber-800 mb-1">温馨提示</div>
                  <p className="text-xs text-amber-700/80">
                    AI 训练平台当前为预览版本，使用模拟数据演示训练过程。完整的真实训练功能即将开放，敬请期待。
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Code2,
  Database,
  Sparkles,
  ArrowRight,
  Plus,
  Trash2,
  BarChart3,
  X,
  ExternalLink,
  Layers,
  Lightbulb,
  Wrench,
  Palette,
  Bot,
  BrainCircuit,
  Cpu,
  Wifi,
  FlaskConical,
  Cloud,
  Languages,
  Music,
  Flame,
  MessageSquare,
  Camera,
  FileSpreadsheet,
  Usb,
  Blocks,
  Boxes,
  NotebookPen,
  Cat,
  GraduationCap,
  Rocket,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useNavigate } from 'react-router-dom';
import {
  MOCK_TOOLS,
  TOOL_CATEGORIES,
  STAGE_LABELS,
  type ITool,
  type ToolCategory,
} from '@/data/tools';
import { MOCK_WORKS } from '@/data/works';
import Image from '@/components/ui/image';
import { toast } from 'sonner';

const MASCOT_IMG = 'https://aka.doubaocdn.com/s/FTGHri7UGK';

// 图标映射
const iconMap: Record<string, typeof Code2> = {
  code: Code2,
  blocks: Blocks,
  brain: BrainCircuit,
  cat: Cat,
  chip: Cpu,
  boxes: Boxes,
  notebook: NotebookPen,
  palette: Palette,
  music: Music,
  languages: Languages,
  bot: Bot,
  sparkles: Sparkles,
  message: MessageSquare,
  flame: Flame,
  'brain-circuit': BrainCircuit,
  wifi: Wifi,
  camera: Camera,
  form: FileSpreadsheet,
  usb: Usb,
  database: Database,
  cloud: Cloud,
  'bar-chart': BarChart3,
  flask: FlaskConical,
  lab: FlaskConical,
  train: Rocket,
};

// 分类主色渐变
const categoryGradients: Record<ToolCategory, string> = {
  coding: 'from-blue-500 to-cyan-400',
  'ai-creation': 'from-pink-500 to-rose-400',
  'ai-llm': 'from-purple-500 to-violet-500',
  'iot-hardware': 'from-emerald-500 to-teal-400',
  data: 'from-amber-500 to-orange-400',
  simulation: 'from-indigo-500 to-blue-500',
};

const categoryIcons: Record<ToolCategory, typeof Code2> = {
  coding: Code2,
  'ai-creation': Palette,
  'ai-llm': BrainCircuit,
  'iot-hardware': Cpu,
  data: Database,
  simulation: FlaskConical,
};

interface DataRecord {
  id: number;
  name: string;
  value: number;
}

const defaultData: DataRecord[] = [
  { id: 1, name: '周一', value: 23 },
  { id: 2, name: '周二', value: 35 },
  { id: 3, name: '周三', value: 28 },
  { id: 4, name: '周四', value: 42 },
  { id: 5, name: '周五', value: 31 },
];

function ToolCard({ tool }: { tool: ITool }) {
  const navigate = useNavigate();
  const Icon = iconMap[tool.iconKey] || Wrench;
  const gradientClass = categoryGradients[tool.category] || 'from-gray-500 to-slate-400';

  const handleClick = () => {
    if (tool.isInternal) {
      if (tool.url === '#data-tool') {
        // 数据采集小工具走 dialog
        return; // 由父组件控制
      }
      navigate(tool.url);
    } else {
      window.open(tool.url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <Card
      className="h-full group hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border-border/60 overflow-hidden cursor-pointer flex flex-col"
      onClick={handleClick}
    >
      <div className={`h-1 w-full bg-gradient-to-r ${gradientClass}`} />
      <CardHeader className="pb-3 flex-1">
        <div className="flex items-start justify-between mb-3">
          <div
            className={`size-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${gradientClass} text-white shadow-md`}
          >
            <Icon className="size-6" />
          </div>
          {tool.highlight && (
            <Badge
              variant="outline"
              className="text-[11px] font-normal bg-primary/5 text-primary border-primary/20"
            >
              {tool.highlight}
            </Badge>
          )}
        </div>
        <CardTitle className="text-base font-bold leading-tight group-hover:text-primary transition-colors">
          {tool.name}
        </CardTitle>
        <CardDescription className="text-xs line-clamp-2 mt-1.5">
          {tool.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0 space-y-3">
        <div className="flex flex-wrap gap-1.5">
          {tool.stages.map((s) => (
            <Badge key={s} variant="outline" className="text-[10px] font-normal h-5 px-1.5">
              {STAGE_LABELS[s]}
            </Badge>
          ))}
          <Badge
            variant="outline"
            className={`text-[10px] font-normal h-5 px-1.5 ${
              tool.toolType === '平台自有'
                ? 'text-primary bg-primary/5 border-primary/20'
                : tool.toolType === '在线即用'
                  ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                  : 'text-amber-700 bg-amber-50 border-amber-200'
            }`}
          >
            {tool.toolType}
          </Badge>
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-border/40">
          <span className="text-[11px] text-muted-foreground">{tool.source}</span>
          <div className="text-xs text-primary font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
            {tool.isInternal ? '立即使用' : '打开'}
            {tool.isInternal ? (
              <ArrowRight className="size-3.5" />
            ) : (
              <ExternalLink className="size-3.5" />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ToolsPage() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<ToolCategory | 'all'>('all');
  const [showDataTool, setShowDataTool] = useState(false);
  const [dataRecords, setDataRecords] = useState<DataRecord[]>(defaultData);
  const [newName, setNewName] = useState('');
  const [newValue, setNewValue] = useState('');

  // 统计
  const totalTools = MOCK_TOOLS.length;
  const internalTools = MOCK_TOOLS.filter((t) => t.toolType === '平台自有').length;
  const onlineTools = MOCK_TOOLS.filter((t) => t.toolType === '在线即用').length;

  // 筛选工具
  const filteredTools =
    activeCategory === 'all'
      ? MOCK_TOOLS
      : MOCK_TOOLS.filter((t) => t.category === activeCategory);

  // 数据工具逻辑
  const total = dataRecords.reduce((sum, r) => sum + r.value, 0);
  const avg = dataRecords.length > 0 ? Math.round(total / dataRecords.length) : 0;
  const max = dataRecords.length > 0 ? Math.max(...dataRecords.map((r) => r.value)) : 0;
  const min = dataRecords.length > 0 ? Math.min(...dataRecords.map((r) => r.value)) : 0;
  const stats = { total, avg, max, min, count: dataRecords.length };
  const maxVal = Math.max(...dataRecords.map((r) => r.value), 1);

  const addRecord = () => {
    if (!newName.trim() || !newValue) {
      toast.error('请填写完整的名称和数值');
      return;
    }
    const val = Number(newValue);
    if (isNaN(val)) {
      toast.error('数值必须是数字');
      return;
    }
    setDataRecords((prev) => [...prev, { id: Date.now(), name: newName.trim(), value: val }]);
    setNewName('');
    setNewValue('');
    toast.success('数据已添加');
  };

  const removeRecord = (id: number) => {
    setDataRecords((prev) => prev.filter((r) => r.id !== id));
    toast.success('数据已删除');
  };

  // 处理数据采集工具点击
  const handleDataToolClick = () => {
    setShowDataTool(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/[0.02] to-purple-500/5">
      {/* Hero */}
      <section className="w-full bg-gradient-to-br from-indigo-600 via-purple-600 to-violet-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 size-64 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-10 right-20 size-80 rounded-full bg-cyan-400 blur-3xl" />
        </div>
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-14 md:py-18 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-2xl"
          >
            <Badge
              variant="outline"
              className="mb-4 px-3 py-1 bg-white/10 border-white/20 text-white backdrop-blur-sm"
            >
              <Wrench className="size-3.5 mr-1" />
              学科工具
            </Badge>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 tracking-tight">
              一站式 AI 教育工具集
            </h1>
            <p className="text-base md:text-lg text-white/80 leading-relaxed mb-6">
              编程、创作、物联网、AI 大模型，打开即用
              <br />
              精选 {totalTools}+ 优质工具，覆盖小学到高中全学段
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <div className="size-9 rounded-lg bg-white/20 flex items-center justify-center backdrop-blur-sm">
                  <Layers className="size-5" />
                </div>
                <div>
                  <div className="text-xl font-bold">{totalTools}+</div>
                  <div className="text-[11px] text-white/70">优质工具</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="size-9 rounded-lg bg-white/20 flex items-center justify-center backdrop-blur-sm">
                  <Sparkles className="size-5" />
                </div>
                <div>
                  <div className="text-xl font-bold">{onlineTools}+</div>
                  <div className="text-[11px] text-white/70">在线即用</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="size-9 rounded-lg bg-white/20 flex items-center justify-center backdrop-blur-sm">
                  <GraduationCap className="size-5" />
                </div>
                <div>
                  <div className="text-xl font-bold">{internalTools}</div>
                  <div className="text-[11px] text-white/70">平台自有</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
        {/* 小象吉祥物 */}
        <div className="absolute right-8 bottom-4 size-24 md:size-32 opacity-30 hidden md:block">
          <Image src={MASCOT_IMG} alt="智象" className="w-full h-full object-contain" />
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-4 md:px-6 py-10 space-y-12">
        {/* 分类 Tab + 工具网格 */}
        <section>
          <Tabs
            value={activeCategory}
            onValueChange={(v) => setActiveCategory(v as ToolCategory | 'all')}
            className="w-full"
          >
            <div className="overflow-x-auto -mx-4 px-4 mb-6">
              <TabsList className="inline-flex w-auto min-w-full">
                <TabsTrigger value="all" className="gap-1.5 whitespace-nowrap">
                  <Layers className="size-3.5" />
                  全部工具
                </TabsTrigger>
                {TOOL_CATEGORIES.map((cat) => {
                  const Icon = categoryIcons[cat.value];
                  return (
                    <TabsTrigger
                      key={cat.value}
                      value={cat.value}
                      className="gap-1.5 whitespace-nowrap"
                    >
                      <Icon className="size-3.5" />
                      {cat.label}
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </div>

            {/* 全部工具视图：按分类分组展示 */}
            <TabsContent value="all" className="mt-0 space-y-10">
              {TOOL_CATEGORIES.map((cat, catIdx) => {
                const catTools = MOCK_TOOLS.filter((t) => t.category === cat.value);
                if (catTools.length === 0) return null;
                const CatIcon = categoryIcons[cat.value];
                return (
                  <motion.div
                    key={cat.value}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: catIdx * 0.05 }}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className={`size-9 rounded-xl bg-gradient-to-br ${categoryGradients[cat.value]} flex items-center justify-center text-white shadow-sm`}
                      >
                        <CatIcon className="size-5" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-foreground">{cat.label}</h3>
                        <p className="text-xs text-muted-foreground">{cat.desc}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {catTools.map((tool, i) => (
                        <motion.div
                          key={tool.id}
                          initial={{ opacity: 0, y: 16 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.4, delay: i * 0.05 }}
                        >
                          {tool.url === '#data-tool' ? (
                            <div onClick={handleDataToolClick}>
                              <ToolCard tool={tool} />
                            </div>
                          ) : (
                            <ToolCard tool={tool} />
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </TabsContent>

            {/* 各分类 Tab 内容 */}
            {TOOL_CATEGORIES.map((cat) => {
              const catTools = filteredTools.filter((t) => t.category === cat.value);
              return (
                <TabsContent key={cat.value} value={cat.value} className="mt-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {catTools.map((tool, i) => (
                      <motion.div
                        key={tool.id}
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: i * 0.05 }}
                      >
                        {tool.url === '#data-tool' ? (
                          <div onClick={handleDataToolClick}>
                            <ToolCard tool={tool} />
                          </div>
                        ) : (
                          <ToolCard tool={tool} />
                        )}
                      </motion.div>
                    ))}
                  </div>
                </TabsContent>
              );
            })}
          </Tabs>
        </section>

        {/* 作品展示 */}
        <section>
          <div className="flex items-end justify-between mb-6 flex-wrap gap-4">
            <div>
              <Badge
                variant="secondary"
                className="mb-2 bg-purple-500/10 text-purple-600 border-purple-500/20"
              >
                学生作品
              </Badge>
              <h2 className="text-2xl md:text-3xl font-bold">优秀作品展示</h2>
              <p className="text-muted-foreground mt-1">
                看看同学们用学科工具创造的精彩作品
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {MOCK_WORKS.map((work, i) => (
              <motion.div
                key={work.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
              >
                <Card className="h-full overflow-hidden group hover:shadow-lg transition-all duration-300 border-border/60">
                  <div className="aspect-[4/3] overflow-hidden bg-muted relative">
                    {work.imageUrl ? (
                      <Image
                        src={work.imageUrl}
                        alt={work.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-100/50 to-blue-100/50 dark:from-purple-900/20 dark:to-blue-900/20">
                        <Palette className="size-12 text-muted-foreground/30" />
                      </div>
                    )}
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-background/90 backdrop-blur-sm text-foreground border-border/50">
                        {work.category}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-1 line-clamp-1">{work.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {work.description}
                    </p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">{work.author}</span>
                      <span className="text-muted-foreground">{work.grade}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      {/* 数据采集工具 Dialog */}
      <Dialog open={showDataTool} onOpenChange={setShowDataTool}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="size-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-400 flex items-center justify-center text-white">
                <Database className="size-4" />
              </div>
              数据采集小工具
            </DialogTitle>
            <DialogDescription>
              快速录入数据并生成可视化统计图表，体验数据采集与分析的基本过程
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-2">
            {/* 统计 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: '数据条数', value: stats.count, icon: Database, color: 'text-blue-500' },
                { label: '总和', value: stats.total, icon: BarChart3, color: 'text-emerald-500' },
                { label: '平均值', value: stats.avg, icon: Sparkles, color: 'text-purple-500' },
                { label: '最大值', value: stats.max, icon: ArrowRight, color: 'text-orange-500' },
              ].map((s) => {
                const Icon = s.icon;
                return (
                  <Card key={s.label} className="border-border/60">
                    <CardContent className="p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Icon className={`size-4 ${s.color}`} />
                        <span className="text-xs text-muted-foreground">{s.label}</span>
                      </div>
                      <div className="text-xl font-bold">{s.value}</div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* 柱状图 */}
            <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
              <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <BarChart3 className="size-4 text-primary" />
                数据可视化
              </h4>
              {dataRecords.length === 0 ? (
                <div className="py-10 text-center text-sm text-muted-foreground">
                  暂无数据，请在下方添加数据
                </div>
              ) : (
                <div className="space-y-2">
                  {dataRecords.map((r) => (
                    <div key={r.id} className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground w-12 truncate">
                        {r.name}
                      </span>
                      <div className="flex-1 h-7 bg-background rounded-md overflow-hidden border border-border/50">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(r.value / maxVal) * 100}%` }}
                          transition={{ duration: 0.5 }}
                          className="h-full bg-gradient-to-r from-amber-500 to-orange-400 rounded-md flex items-center justify-end pr-2"
                        >
                          <span className="text-[10px] text-white font-medium">{r.value}</span>
                        </motion.div>
                      </div>
                      <button
                        onClick={() => removeRecord(r.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                        aria-label="删除"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 添加数据 */}
            <div className="p-4 rounded-xl border border-border/50">
              <h4 className="text-sm font-semibold mb-3">添加数据</h4>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 space-y-1">
                  <Label htmlFor="data-name">名称</Label>
                  <Input
                    id="data-name"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="例如：周六"
                  />
                </div>
                <div className="w-full sm:w-32 space-y-1">
                  <Label htmlFor="data-value">数值</Label>
                  <Input
                    id="data-value"
                    type="number"
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    placeholder="0"
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={addRecord} className="w-full sm:w-auto">
                    <Plus className="size-4 mr-1" />
                    添加
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setDataRecords(defaultData);
                toast.success('已重置为示例数据');
              }}
            >
              重置示例数据
            </Button>
            <Button variant="secondary" onClick={() => setShowDataTool(false)}>
              关闭
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

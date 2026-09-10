import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BrainCircuit,
  Sparkles,
  Code2,
  MessageCircle,
  Zap,
  CheckCircle2,
  XCircle,
  Clock,
  BarChart3,
  Key,
  Plus,
  TrendingUp,
  ShieldCheck,
  Cpu,
  Eye,
  Mic,
  FileText,
  Info,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import Image from '@/components/ui/image';
import { toast } from 'sonner';

const MASCOT_IMG = 'https://aka.doubaocdn.com/s/FTGHri7UGK';

interface IAiModel {
  id: string;
  name: string;
  codename: string;
  category: 'text' | 'code' | 'vision' | 'voice';
  icon: typeof BrainCircuit;
  version: string;
  status: 'online' | 'beta' | 'coming';
  description: string;
  capabilities: string[];
  contextWindow: string;
  avgResponseTime: string;
  usageThisMonth: number;
  totalUsage: number;
}

const AI_MODELS: IAiModel[] = [
  {
    id: 'lesson-planner',
    name: '智象备课助手',
    codename: 'ZX-Edu-Teach',
    category: 'text',
    icon: Sparkles,
    version: 'v2.1.0',
    status: 'online',
    description: '专为 K12 教学设计的教案生成模型，熟悉人教版新课标与安徽省课程纲要。',
    capabilities: ['教案框架生成', '教学目标设计', '课堂活动策划', '重难点分析', '实验设计建议'],
    contextWindow: '8K tokens',
    avgResponseTime: '3.2s',
    usageThisMonth: 128,
    totalUsage: 1542,
  },
  {
    id: 'code-gen',
    name: '智象代码助手',
    codename: 'ZX-Code-Kid',
    category: 'code',
    icon: Code2,
    version: 'v1.5.0',
    status: 'online',
    description: '面向青少年编程教育的代码生成模型，支持 Python / 图形化 / MicroPython。',
    capabilities: ['Python 代码生成', '图形化积木转译', '代码解释与注释', '错误调试建议', '实验步骤生成'],
    contextWindow: '4K tokens',
    avgResponseTime: '2.8s',
    usageThisMonth: 256,
    totalUsage: 2891,
  },
  {
    id: 'qa-ai',
    name: '智象通识问答',
    codename: 'ZX-AI-QA',
    category: 'text',
    icon: MessageCircle,
    version: 'v1.8.0',
    status: 'online',
    description: 'AI 知识问答模型，用通俗语言解释人工智能概念，适合中小学生理解。',
    capabilities: ['AI 概念解释', '知识问答', '类比说明', '扩展知识', '学习建议'],
    contextWindow: '4K tokens',
    avgResponseTime: '2.1s',
    usageThisMonth: 512,
    totalUsage: 6328,
  },
  {
    id: 'vision-ai',
    name: '智象视觉理解',
    codename: 'ZX-Vision',
    category: 'vision',
    icon: Eye,
    version: 'v0.9.0',
    status: 'beta',
    description: '多模态视觉理解模型，支持图像分析、识别结果解读、实验现象描述。',
    capabilities: ['图像内容描述', '实验现象分析', '识别结果解读', '图形化编程转文字'],
    contextWindow: '图像 + 2K text',
    avgResponseTime: '4.5s',
    usageThisMonth: 0,
    totalUsage: 0,
  },
  {
    id: 'voice-ai',
    name: '智象语音助手',
    codename: 'ZX-Voice',
    category: 'voice',
    icon: Mic,
    version: 'v0.5.0',
    status: 'coming',
    description: '语音识别与合成模型，支持课堂语音交互、文字转语音朗读课件。',
    capabilities: ['语音转文字', '文字转语音', '课堂听写', '多角色朗读'],
    contextWindow: '-',
    avgResponseTime: '-',
    usageThisMonth: 0,
    totalUsage: 0,
  },
];

/** 能力矩阵行 */
const CAPABILITY_MATRIX = [
  { capability: '文本生成', lesson: true, code: true, qa: true, vision: false, voice: false },
  { capability: '代码生成', lesson: false, code: true, qa: false, vision: false, voice: false },
  { capability: '图像理解', lesson: false, code: false, qa: false, vision: true, voice: false },
  { capability: '语音识别', lesson: false, code: false, qa: false, vision: false, voice: true },
  { capability: '教育场景优化', lesson: true, code: true, qa: true, vision: true, voice: true },
  { capability: 'K12 知识对齐', lesson: true, code: false, qa: true, vision: false, voice: false },
];

export default function AiModelCenterPage() {
  const [apiDialog, setApiDialog] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [apiName, setApiName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleAddApi = () => {
    if (!apiKey.trim() || !apiName.trim()) {
      toast.warning('请填写模型名称和 API Key');
      return;
    }
    setSubmitting(true);
    // 预留：真实实现时保存到 localStorage
    setTimeout(() => {
      setSubmitting(false);
      setApiDialog(false);
      toast.success(`已添加自定义模型「${apiName}」`);
      setApiKey('');
      setApiName('');
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-purple-50/30">
      <main className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-12">
        {/* 顶部标题 */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4">
            <BrainCircuit className="size-3.5" />
            AI 模型中心
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            AI 模型中心
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            已接入的 AI 模型一览，查看能力与用量，接入自定义模型
          </p>
        </div>

        {/* 统计概览 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="text-xs text-muted-foreground mb-1">已接入模型</div>
              <div className="text-2xl font-bold text-foreground tabular-nums">
                {AI_MODELS.filter((m) => m.status !== 'coming').length}
                <span className="text-sm font-normal text-muted-foreground ml-1">个</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-xs text-muted-foreground mb-1">本月调用</div>
              <div className="text-2xl font-bold text-primary tabular-nums">
                {AI_MODELS.reduce((s, m) => s + m.usageThisMonth, 0)}
                <span className="text-sm font-normal text-muted-foreground ml-1">次</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-xs text-muted-foreground mb-1">平均响应时间</div>
              <div className="text-2xl font-bold text-emerald-600 tabular-nums">
                2.7
                <span className="text-sm font-normal text-muted-foreground ml-1">秒</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-xs text-muted-foreground mb-1">累计调用</div>
              <div className="text-2xl font-bold text-purple-600 tabular-nums">
                10.7
                <span className="text-sm font-normal text-muted-foreground ml-1">千次</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tab 切换 */}
        <Tabs defaultValue="models" className="space-y-6">
          <TabsList className="bg-card border border-border/60 p-1">
            <TabsTrigger value="models" className="gap-1.5">
              <BrainCircuit className="size-3.5" />
              已接入模型
            </TabsTrigger>
            <TabsTrigger value="compare" className="gap-1.5">
              <BarChart3 className="size-3.5" />
              能力对比
            </TabsTrigger>
            <TabsTrigger value="stats" className="gap-1.5">
              <TrendingUp className="size-3.5" />
              调用统计
            </TabsTrigger>
            <TabsTrigger value="custom" className="gap-1.5">
              <Key className="size-3.5" />
              自定义模型
            </TabsTrigger>
          </TabsList>

          {/* 已接入模型 */}
          <TabsContent value="models">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {AI_MODELS.map((model, idx) => {
                const Icon = model.icon;
                return (
                  <motion.div
                    key={model.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.06 }}
                  >
                    <Card className="h-full hover:shadow-md transition-shadow">
                      <CardContent className="p-5">
                        <div className="flex items-start gap-3 mb-4">
                          <div
                            className={`size-11 rounded-xl flex items-center justify-center shrink-0 ${
                              model.status === 'online'
                                ? 'bg-gradient-to-br from-primary to-purple-500'
                                : model.status === 'beta'
                                  ? 'bg-gradient-to-br from-amber-400 to-orange-500'
                                  : 'bg-muted'
                            }`}
                          >
                            <Icon className="size-5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-semibold text-foreground">{model.name}</h3>
                              {model.status === 'online' && (
                                <Badge className="text-[10px] bg-emerald-500 hover:bg-emerald-600">在线</Badge>
                              )}
                              {model.status === 'beta' && (
                                <Badge className="text-[10px] bg-amber-500 hover:bg-amber-600">Beta</Badge>
                              )}
                              {model.status === 'coming' && (
                                <Badge variant="outline" className="text-[10px]">即将推出</Badge>
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground mt-0.5">
                              {model.codename} · {model.version}
                            </div>
                          </div>
                        </div>

                        <p className="text-sm text-foreground/80 mb-3">{model.description}</p>

                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {model.capabilities.map((cap) => (
                            <Badge key={cap} variant="secondary" className="text-[10px] font-normal">
                              {cap}
                            </Badge>
                          ))}
                        </div>

                        <div className="grid grid-cols-3 gap-2 pt-3 border-t border-border/60">
                          <div>
                            <div className="text-[10px] text-muted-foreground">上下文</div>
                            <div className="text-xs font-medium text-foreground">{model.contextWindow}</div>
                          </div>
                          <div>
                            <div className="text-[10px] text-muted-foreground">平均响应</div>
                            <div className="text-xs font-medium text-foreground">{model.avgResponseTime}</div>
                          </div>
                          <div>
                            <div className="text-[10px] text-muted-foreground">本月调用</div>
                            <div className="text-xs font-medium text-foreground tabular-nums">
                              {model.usageThisMonth}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </TabsContent>

          {/* 能力对比 */}
          <TabsContent value="compare">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">模型能力矩阵</CardTitle>
                <CardDescription className="text-xs">
                  各模型在不同能力维度上的支持情况
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/60 bg-muted/30">
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground text-xs w-40">
                        能力维度
                      </th>
                      {AI_MODELS.filter((m) => m.status !== 'coming').map((m) => (
                        <th key={m.id} className="px-3 py-3 font-medium text-foreground text-xs text-center min-w-[100px]">
                          {m.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {CAPABILITY_MATRIX.map((row, idx) => (
                      <tr key={row.capability} className="border-b border-border/40 hover:bg-accent/20">
                        <td className="px-4 py-3 text-foreground/80 text-sm">{row.capability}</td>
                        <td className="px-3 py-3 text-center">
                          {row.lesson ? (
                            <CheckCircle2 className="size-4 text-emerald-500 mx-auto" />
                          ) : (
                            <XCircle className="size-4 text-muted-foreground/30 mx-auto" />
                          )}
                        </td>
                        <td className="px-3 py-3 text-center">
                          {row.code ? (
                            <CheckCircle2 className="size-4 text-emerald-500 mx-auto" />
                          ) : (
                            <XCircle className="size-4 text-muted-foreground/30 mx-auto" />
                          )}
                        </td>
                        <td className="px-3 py-3 text-center">
                          {row.qa ? (
                            <CheckCircle2 className="size-4 text-emerald-500 mx-auto" />
                          ) : (
                            <XCircle className="size-4 text-muted-foreground/30 mx-auto" />
                          )}
                        </td>
                        <td className="px-3 py-3 text-center">
                          {row.vision ? (
                            <CheckCircle2 className="size-4 text-amber-500 mx-auto" />
                          ) : (
                            <XCircle className="size-4 text-muted-foreground/30 mx-auto" />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 调用统计 */}
          <TabsContent value="stats">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">本月调用统计</CardTitle>
                <CardDescription className="text-xs">
                  各 AI 模型的使用情况（模拟数据）
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                {AI_MODELS.filter((m) => m.status !== 'coming').map((model) => {
                  const pct = model.usageThisMonth > 0 ? Math.min(100, (model.usageThisMonth / 600) * 100) : 0;
                  return (
                    <div key={model.id}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm font-medium text-foreground">{model.name}</span>
                        <span className="text-xs text-muted-foreground tabular-nums">
                          {model.usageThisMonth} 次
                        </span>
                      </div>
                      <Progress value={pct} className="h-2" />
                    </div>
                  );
                })}
                <div className="pt-4 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
                  <span>累计调用 10,761 次</span>
                  <span>平均成功率 99.2%</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 自定义模型 */}
          <TabsContent value="custom">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Key className="size-4 text-primary" />
                  自定义模型接入
                </CardTitle>
                <CardDescription className="text-xs">
                  接入你自己的大模型 API，扩展平台 AI 能力
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-8 text-center border border-dashed border-border rounded-xl bg-muted/20">
                  <div className="size-16 mx-auto mb-4 rounded-full bg-primary/5 flex items-center justify-center">
                    <Image src={MASCOT_IMG} alt="" className="size-12 object-contain" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    自定义模型接入 — 即将开放
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
                    即将支持接入 OpenAI / 豆包 / 通义 / 文心等主流大模型，配置 API Key 即可使用。
                    <br />
                    敬请期待！
                  </p>
                  <Button onClick={() => setApiDialog(true)} className="gap-2">
                    <Plus className="size-4" />
                    抢先体验
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* 自定义模型接入对话框 */}
      <Dialog open={apiDialog} onOpenChange={setApiDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>接入自定义模型</DialogTitle>
            <DialogDescription>
              填写你的模型 API 信息，接入后可在 AI 工具中使用。
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="modelName">模型名称</Label>
              <Input
                id="modelName"
                placeholder="例如：我的专属 AI 助手"
                value={apiName}
                onChange={(e) => setApiName(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="apiKey">API Key</Label>
              <Input
                id="apiKey"
                type="password"
                placeholder="sk-xxxxxxxxxxxxxxxx"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
            </div>
            <div className="text-xs text-muted-foreground flex items-start gap-2">
              <ShieldCheck className="size-3.5 shrink-0 mt-0.5" />
              <span>API Key 仅存储在本地浏览器，不会上传到服务器。</span>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setApiDialog(false)}>
              取消
            </Button>
            <Button onClick={handleAddApi} disabled={submitting}>
              {submitting ? '配置中...' : '添加模型'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

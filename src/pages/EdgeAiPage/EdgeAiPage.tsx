import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Cpu,
  Eye,
  Mic,
  Zap,
  ChevronRight,
  Lock,
  ExternalLink,
  Sparkles,
  Rocket,
  BrainCircuit,
  Database,
  Play,
  Info,
  ShieldCheck,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Image from '@/components/ui/image';
import { useNavigate } from 'react-router-dom';

const MASCOT_IMG = 'https://aka.doubaocdn.com/s/FTGHri7UGK';

const EDGE_EXPERIMENTS = [
  {
    id: 'local-image-classify',
    title: '本地图像分类',
    subtitle: 'On-Device Image Classification',
    icon: Eye,
    stage: '初中 · 高中',
    gradient: 'from-sky-500 to-blue-600',
    description:
      '在智象 AI 视觉模块上运行图像分类模型，识别结果完全在本地处理，不需要联网。',
    requiredHardware: '智象 AI 视觉模块',
    difficulty: '进阶',
    status: 'coming',
  },
  {
    id: 'local-speech',
    title: '本地语音识别',
    subtitle: 'On-Device Speech Recognition',
    icon: Mic,
    stage: '初中 · 高中',
    gradient: 'from-emerald-500 to-teal-600',
    description:
      '在智象 AI 主控板上运行语音识别模型，实现离线语音控制和命令词识别。',
    requiredHardware: '智象 AI 主控板 + 语音模块',
    difficulty: '进阶',
    status: 'coming',
  },
  {
    id: 'object-detect',
    title: '本地物体检测',
    subtitle: 'On-Device Object Detection',
    icon: Zap,
    stage: '高中',
    gradient: 'from-violet-500 to-purple-600',
    description:
      '实时视频流中的物体检测与追踪，在边缘设备上直接运行 YOLO 轻量化模型。',
    requiredHardware: '智象 AI 视觉模块 Pro',
    difficulty: '挑战',
    status: 'planned',
  },
  {
    id: 'train-deploy',
    title: '训练 → 部署全流程',
    subtitle: 'Train to Deploy Pipeline',
    icon: Rocket,
    stage: '高中',
    gradient: 'from-primary to-purple-600',
    description:
      '从数据采集 → 模型训练 → 导出 → 部署到硬件，完整的端到端 AI 工程实践。',
    requiredHardware: '智象 AI 主控板 + AI 视觉模块',
    difficulty: '挑战',
    status: 'planned',
  },
];

const EDGE_ADVANTAGES = [
  {
    icon: Zap,
    title: '实时响应',
    desc: '不依赖网络，延迟低至毫秒级',
  },
  {
    icon: ShieldCheck,
    title: '隐私保护',
    desc: '数据在本地处理，不上传云端',
  },
  {
    icon: Database,
    title: '离线可用',
    desc: '无网络环境下也能正常运行',
  },
  {
    icon: BrainCircuit,
    title: '真实工程体验',
    desc: '完整的端到端 AI 开发流程',
  },
];

export default function EdgeAiPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-purple-50/30">
      {/* Hero */}
      <section className="w-full py-16 md:py-20 bg-gradient-to-br from-primary/10 via-primary/5 to-violet-500/10">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1 text-center md:text-left">
              <Badge className="mb-4 bg-white/80 text-primary border-primary/20 backdrop-blur">
                <Cpu className="size-3 mr-1" />
                边缘 AI 实验
              </Badge>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">
                边缘 AI 实验室
                <br />
                <span className="bg-gradient-to-r from-primary to-violet-600 bg-clip-text text-transparent">
                  让 AI 在本地硬件上运行
                </span>
              </h1>
              <p className="text-muted-foreground text-base max-w-lg mb-6">
                告别云端依赖，体验 AI 模型在本地硬件上的实时推理。
                从图像分类到语音识别，从零感受边缘智能的魅力。
              </p>
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <Button size="lg" className="gap-2" onClick={() => navigate('/hardware')}>
                  <Cpu className="size-4" />
                  了解智象硬件
                  <ChevronRight className="size-4" />
                </Button>
                <Button size="lg" variant="secondary" className="gap-2" onClick={() => navigate('/ai-training')}>
                  <Sparkles className="size-4" />
                  AI 训练平台
                </Button>
              </div>
            </div>
            <div className="size-48 md:size-64 shrink-0 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-violet-500/20 rounded-full blur-3xl" />
              <Image
                src={MASCOT_IMG}
                alt=""
                className="relative size-full object-contain drop-shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-4 md:px-6 py-12 md:py-16 space-y-16">
        {/* 边缘 AI 优势 */}
        <section>
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
              为什么要学边缘 AI
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              真实世界中的 AI 很多都运行在设备本地，而不是云端
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {EDGE_ADVANTAGES.map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08 }}
                >
                  <Card className="h-full text-center hover:shadow-md transition-shadow">
                    <CardContent className="p-5">
                      <div className="size-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-primary/10 to-violet-500/10 flex items-center justify-center">
                        <Icon className="size-6 text-primary" />
                      </div>
                      <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* 边缘 AI 实验 */}
        <section>
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
              边缘 AI 实验项目
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              配合智象 AI 硬件，完成从入门到进阶的边缘智能实验
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {EDGE_EXPERIMENTS.map((exp, idx) => {
              const Icon = exp.icon;
              return (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08 }}
                >
                  <Card className="h-full overflow-hidden hover:shadow-md transition-shadow group">
                    <div className={`h-32 bg-gradient-to-br ${exp.gradient} relative`}>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Icon className="size-14 text-white/20" />
                      </div>
                      <div className="absolute top-3 left-3 flex gap-2">
                        <Badge className="text-[10px] bg-white/20 backdrop-blur text-white border-white/30">
                          {exp.stage}
                        </Badge>
                        {(exp.status === 'coming' || exp.status === 'planned') && (
                          <Badge className="text-[10px] bg-white/90 text-foreground backdrop-blur">
                            即将推出
                          </Badge>
                        )}
                      </div>
                      <div className="absolute top-3 right-3">
                        <Badge variant="outline" className="text-[10px] text-white border-white/30 bg-white/10 backdrop-blur">
                          {exp.difficulty}
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-5">
                      <div className="mb-2">
                        <div className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider">
                          {exp.subtitle}
                        </div>
                        <h3 className="text-lg font-bold text-foreground">{exp.title}</h3>
                      </div>
                      <p className="text-sm text-foreground/70 mb-4">{exp.description}</p>

                      <div className="flex items-center justify-between pt-3 border-t border-border/60">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Lock className="size-3" />
                          需要 {exp.requiredHardware}
                        </div>
                        <Button
                          size="sm"
                          variant="secondary"
                          className="gap-1"
                          onClick={() => navigate('/hardware')}
                        >
                          了解硬件
                          <ExternalLink className="size-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* 学习路径 */}
        <section>
          <Card className="bg-gradient-to-br from-primary/5 to-violet-500/5 border-primary/10 overflow-hidden">
            <CardContent className="p-8 md:p-10">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
                <div className="lg:col-span-2">
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
                    边缘 AI 学习路径
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    从云端 AI 入门，逐步走向边缘智能，一步步成为 AI 小工程师
                  </p>
                  <Button onClick={() => navigate('/ai-lab')} className="gap-2">
                    从云端 AI 开始
                    <Play className="size-4" />
                  </Button>
                </div>
                <div className="lg:col-span-3 space-y-3">
                  {[
                    {
                      step: 1,
                      title: '云端 AI 体验',
                      desc: '通过 AI 实验室体验图像识别、语音助手等云端 AI 能力',
                      status: '已开放',
                    },
                    {
                      step: 2,
                      title: '模型训练入门',
                      desc: '在 AI 训练平台了解数据 → 训练 → 推理的完整流程',
                      status: '预览版',
                    },
                    {
                      step: 3,
                      title: '边缘推理实践',
                      desc: '将训练好的模型部署到智象硬件，在本地运行',
                      status: '即将推出',
                    },
                    {
                      step: 4,
                      title: '端到端项目',
                      desc: '完成从数据采集到硬件部署的完整 AI 工程项目',
                      status: '规划中',
                    },
                  ].map((s, idx) => (
                    <div key={s.step} className="flex items-start gap-4 p-4 rounded-lg bg-white/60 backdrop-blur-sm border border-white/80">
                      <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-sm font-bold text-primary">
                        {s.step}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-foreground text-sm">{s.title}</h3>
                          <Badge
                            variant={idx < 2 ? 'default' : 'outline'}
                            className="text-[10px]"
                          >
                            {s.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">{s.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}

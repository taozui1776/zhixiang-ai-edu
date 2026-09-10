import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Play,
  BookOpen,
  Lightbulb,
  GraduationCap,
  Copy,
  ChevronRight,
  RefreshCw,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { getProjectById, type IAiLabProject } from '@/data/ai-lab-projects';
import ProjectDemoFaceRecognition from './demos/ProjectDemoFaceRecognition';
import ProjectDemoDigitRecognition from './demos/ProjectDemoDigitRecognition';
import ProjectDemoClustering from './demos/ProjectDemoClustering';
import ProjectDemoBinarization from './demos/ProjectDemoBinarization';
import ProjectDemoEdgeDetection from './demos/ProjectDemoEdgeDetection';
import ProjectDemoTTS from './demos/ProjectDemoTTS';
import ProjectDemoASR from './demos/ProjectDemoASR';
import ProjectDemoWordCloud from './demos/ProjectDemoWordCloud';
import ProjectDemoChat from './demos/ProjectDemoChat';
import ProjectDemoDecisionTree from './demos/ProjectDemoDecisionTree';
import ProjectDemoShortestPath from './demos/ProjectDemoShortestPath';
import ProjectDemoOcr from './demos/ProjectDemoOcr';
import ProjectDemoLicensePlate from './demos/ProjectDemoLicensePlate';
import ProjectDemoImageClassification from './demos/ProjectDemoImageClassification';
import ProjectDemoSpeechEvaluation from './demos/ProjectDemoSpeechEvaluation';
import ProjectDemoNewsClassification from './demos/ProjectDemoNewsClassification';
import ProjectDemoTextToImage from './demos/ProjectDemoTextToImage';

// 有真实交互的项目
const INTERACTIVE_DEMOS: Record<string, React.ComponentType> = {
  'cv-face-recognition': ProjectDemoFaceRecognition,
  'cv-digit-recognition': ProjectDemoDigitRecognition,
  'cv-binarization': ProjectDemoBinarization,
  'cv-edge-detection': ProjectDemoEdgeDetection,
  'nlp-tts': ProjectDemoTTS,
  'nlp-asr': ProjectDemoASR,
  'nlp-wordcloud': ProjectDemoWordCloud,
  'nlp-turing': ProjectDemoChat,
  'aigc-chat': ProjectDemoChat,
  'ml-clustering': ProjectDemoClustering,
  'ml-decision-tree': ProjectDemoDecisionTree,
  'ml-shortest-path': ProjectDemoShortestPath,
  'cv-ocr': ProjectDemoOcr,
  'cv-license-plate': ProjectDemoLicensePlate,
  'cv-image-classification': ProjectDemoImageClassification,
  'speech-evaluation': ProjectDemoSpeechEvaluation,
  'nlp-news-classification': ProjectDemoNewsClassification,
  'aigc-text-to-image': ProjectDemoTextToImage,
};

const CATEGORY_GRADIENT: Record<string, string> = {
  'computer-vision': 'from-blue-600 to-cyan-500',
  nlp: 'from-violet-600 to-purple-500',
  'machine-learning': 'from-emerald-600 to-teal-500',
  aigc: 'from-pink-500 to-orange-500',
};

const TIER_COLORS = {
  体验: 'bg-orange-100 text-orange-700 border-orange-200',
  探究: 'bg-amber-100 text-amber-700 border-amber-200',
  训练: 'bg-rose-100 text-rose-700 border-rose-200',
};

export default function AiLabProjectPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const project = projectId ? getProjectById(projectId) : undefined;

  const [activeTab, setActiveTab] = useState('experiment');

  if (!project) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="py-12 text-center">
            <BookOpen className="size-12 text-muted-foreground/40 mx-auto mb-3" />
            <h2 className="text-lg font-semibold mb-2">项目未找到</h2>
            <p className="text-sm text-muted-foreground mb-4">该实验项目不存在或已下架</p>
            <Button onClick={() => navigate('/ai-lab')}>返回 AI 实验室</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const DemoComponent = INTERACTIVE_DEMOS[project.id];
  const hasDemo = !!DemoComponent;

  const copyKnowledge = () => {
    navigator.clipboard.writeText(
      `${project.knowledge.title}\n${project.knowledge.content}`,
    );
    toast.success('已复制到剪贴板');
  };

  return (
    <div className="min-h-screen bg-slate-50/60">
      {/* 顶部标题栏 */}
      <div
        className={`w-full bg-gradient-to-r ${CATEGORY_GRADIENT[project.category]} relative overflow-hidden`}
      >
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 py-5">
          <div className="flex items-center gap-2 text-sm text-white/70 mb-3">
            <Button
              variant="ghost"
              size="sm"
              className="text-white/70 hover:text-white hover:bg-white/10 h-8 px-2"
              onClick={() => navigate('/ai-lab')}
            >
              <ArrowLeft className="size-4 mr-1" />
              返回 AI 实验室
            </Button>
            <ChevronRight className="size-3" />
            <span>{project.categoryLabel}</span>
            <ChevronRight className="size-3" />
            <span className="text-white">{project.name}</span>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge
                  variant="outline"
                  className={`text-xs border-0 ${TIER_COLORS[project.tier as keyof typeof TIER_COLORS]}`}
                >
                  {project.tier}级项目
                </Badge>
                <Badge className="text-xs bg-white/20 text-white border-0 backdrop-blur-sm">
                  {project.techTag}
                </Badge>
                <Badge variant="outline" className="text-xs bg-white/10 text-white border-white/30">
                  {project.level}
                </Badge>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">{project.name}</h1>
              <p className="text-white/80 text-sm md:text-base mt-2 max-w-2xl">
                {project.description}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                className="bg-white text-primary hover:bg-white/90 shadow-lg"
                onClick={() => setActiveTab('experiment')}
              >
                <Play className="size-4 mr-2 fill-primary/20" />
                开始实验
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 主体内容 */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* 左侧：实验主区 */}
          <div className="lg:col-span-8 xl:col-span-9">
            <Card className="border-0 shadow-sm h-full">
              <CardHeader className="pb-0">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="bg-transparent h-9 p-0 gap-3 border-b-0">
                    <TabsTrigger
                      value="experiment"
                      className="h-9 px-3 text-sm data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
                    >
                      <Play className="size-3.5 mr-1.5" />
                      实验操作
                    </TabsTrigger>
                    <TabsTrigger
                      value="knowledge"
                      className="h-9 px-3 text-sm data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
                    >
                      <Lightbulb className="size-3.5 mr-1.5" />
                      知识卡片
                    </TabsTrigger>
                    <TabsTrigger
                      value="teaching"
                      className="h-9 px-3 text-sm data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
                    >
                      <GraduationCap className="size-3.5 mr-1.5" />
                      教学建议
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardHeader>

              <CardContent className="pt-4">
                <TabsContent value="experiment" className="mt-0">
                  <ExperimentArea project={project} DemoComponent={DemoComponent} hasDemo={hasDemo} />
                </TabsContent>

                <TabsContent value="knowledge" className="mt-0">
                  <KnowledgeCard project={project} onCopy={copyKnowledge} />
                </TabsContent>

                <TabsContent value="teaching" className="mt-0">
                  <TeachingAdvice project={project} />
                </TabsContent>
              </CardContent>
            </Card>
          </div>

          {/* 右侧：信息侧栏 */}
          <div className="lg:col-span-4 xl:col-span-3 space-y-4">
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">项目信息</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <InfoRow label="技术方向" value={project.categoryLabel} />
                <InfoRow label="技术标签" value={project.techTag} />
                <InfoRow label="难度等级" value={project.level} />
                <InfoRow label="项目类型" value={`${project.tier}级`} />
                <InfoRow label="建议时长" value={project.teaching.duration} />
                <InfoRow label="适用学段" value={project.teaching.suitableGrades} />
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">知识要点</CardTitle>
                <CardDescription>核心概念速览</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {project.knowledge.keyPoints.map((kp, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="size-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span className="text-foreground">{kp}</span>
                    </li>
                  ))}
                 </ul>
               </CardContent>
             </Card>

             {project.relatedLessons && project.relatedLessons.length > 0 && (
               <Card className="border-0 shadow-sm bg-gradient-to-br from-primary/5 to-purple-500/5">
                 <CardHeader className="pb-2">
                   <CardTitle className="text-base flex items-center gap-1.5">
                     <BookOpen className="size-4 text-primary" />
                     对应课程
                   </CardTitle>
                   <CardDescription>本实验适合以下课程课时</CardDescription>
                 </CardHeader>
                 <CardContent className="space-y-2">
                   {project.relatedLessons.map((rl, i) => (
                     <button
                       key={i}
                       onClick={() => navigate(`/course/${rl.courseId}`)}
                       className="w-full text-left p-3 rounded-lg border border-border/60 bg-card hover:border-primary/40 hover:bg-primary/[0.03] transition-all group"
                     >
                       <div className="text-xs text-muted-foreground mb-0.5">{rl.courseTitle}</div>
                       <div className="text-sm font-medium text-foreground flex items-center justify-between gap-2">
                         <span className="truncate">{rl.lessonTitle}</span>
                         <ChevronRight className="size-3.5 text-muted-foreground shrink-0 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                       </div>
                     </button>
                   ))}
                 </CardContent>
               </Card>
             )}
           </div>
        </div>
      </main>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-foreground font-medium">{value}</span>
    </div>
  );
}

function ExperimentArea({
  project,
  DemoComponent,
  hasDemo,
}: {
  project: IAiLabProject;
  DemoComponent?: React.ComponentType;
  hasDemo: boolean;
}) {
  if (!hasDemo) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center py-10">
        <div className="size-20 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/20 flex items-center justify-center mb-4">
          <RefreshCw className="size-10 text-primary animate-spin-slow" />
        </div>
        <h3 className="text-lg font-semibold mb-2">演示加载中</h3>
        <p className="text-sm text-muted-foreground max-w-md text-center mb-6">
          {project.name} 正在准备交互演示界面，请稍候…
        </p>
        <div className="w-full max-w-sm space-y-3">
          <div className="h-3 bg-muted/60 rounded-full overflow-hidden">
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: '300%' }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="h-full w-1/3 bg-gradient-to-r from-transparent via-primary/30 to-transparent"
            />
          </div>
          <p className="text-xs text-muted-foreground text-center">
            提示：该项目为演示版，完整版支持更多交互功能
          </p>
        </div>
      </div>
    );
  }

  return DemoComponent ? <DemoComponent /> : null;
}

function KnowledgeCard({
  project,
  onCopy,
}: {
  project: IAiLabProject;
  onCopy: () => void;
}) {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Lightbulb className="size-5 text-amber-500" />
          {project.knowledge.title}
        </h3>
        <Button variant="outline" size="sm" onClick={onCopy}>
          <Copy className="size-3.5 mr-1" />
          复制
        </Button>
      </div>

      <div className="p-5 rounded-xl bg-gradient-to-br from-amber-50/80 to-orange-50/60 border border-amber-100">
        <p className="text-sm text-foreground leading-relaxed">
          {project.knowledge.content}
        </p>
      </div>

      <div>
        <h4 className="text-sm font-semibold mb-3 text-foreground">💡 核心知识要点</h4>
        <div className="space-y-2">
          {project.knowledge.keyPoints.map((kp, i) => (
            <div
              key={i}
              className="flex items-start gap-3 p-3 rounded-lg border border-border/60 bg-card"
            >
              <div className="size-6 rounded-full bg-primary/10 text-primary text-xs font-semibold flex items-center justify-center shrink-0">
                {i + 1}
              </div>
              <p className="text-sm text-foreground pt-0.5">{kp}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TeachingAdvice({ project }: { project: IAiLabProject }) {
  return (
    <div className="space-y-5">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <GraduationCap className="size-5 text-emerald-500" />
        教学建议
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100">
          <p className="text-xs text-emerald-600 mb-1">适用学段</p>
          <p className="text-sm font-semibold text-emerald-800">
            {project.teaching.suitableGrades}
          </p>
        </div>
        <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
          <p className="text-xs text-blue-600 mb-1">建议时长</p>
          <p className="text-sm font-semibold text-blue-800">{project.teaching.duration}</p>
        </div>
        <div className="p-4 rounded-xl bg-violet-50 border border-violet-100">
          <p className="text-xs text-violet-600 mb-1">项目类型</p>
          <p className="text-sm font-semibold text-violet-800">{project.tier}级实验</p>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-semibold mb-3 text-foreground">📚 教学实施建议</h4>
        <div className="space-y-2">
          {project.teaching.tips.map((tip, i) => (
            <div
              key={i}
              className="flex items-start gap-3 p-3 rounded-lg border border-border/60 bg-card"
            >
              <div className="size-6 rounded-full bg-emerald-500/10 text-emerald-600 text-xs font-semibold flex items-center justify-center shrink-0">
                {i + 1}
              </div>
              <p className="text-sm text-foreground pt-0.5">{tip}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 rounded-xl bg-gradient-to-br from-primary/5 to-accent/10 border border-border/60">
        <h4 className="text-sm font-semibold mb-2 flex items-center gap-1.5">
          <BookOpen className="size-4 text-primary" />
          配套资源
        </h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• 配套教案与课件可在课程库对应课程中下载</li>
          <li>• 学生实验记录单与学习任务单可从课程资源获取</li>
          <li>• 教师培训视频请前往"教师培训"页面</li>
        </ul>
      </div>
    </div>
  );
}

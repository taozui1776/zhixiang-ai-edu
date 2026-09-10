import { useState, useMemo } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  BookOpen,
  PlayCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  CheckCircle2,
  Layers,
  Monitor,
  BookMarked,
  Lightbulb,
  ExternalLink,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { MOCK_TUTORIALS, MOCK_TUTORIAL_CATEGORIES, type ITutorial } from '@/data/tutorials';

export default function TeacherTrainingPage() {
  const [selectedCategory, setSelectedCategory] = useState('platform');

  const filteredTutorials = useMemo(
    () => MOCK_TUTORIALS.filter((t) => t.categoryId === selectedCategory),
    [selectedCategory],
  );

  return (
    <div className="min-h-screen bg-slate-50/60">
      {/* 顶部 Banner */}
      <div className="w-full bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,rgba(255_255_255_0.15),transparent_50%)]" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="bg-white/20 text-white border-0 backdrop-blur-sm mb-3">
              <BookOpen className="size-3 mr-1" />
              教师培训中心
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
              专业成长，从这里开始
            </h1>
            <p className="text-white/80 max-w-2xl text-base">
              系统化教师培训教程，涵盖平台操作、工具使用、课程串讲，
              帮助您快速掌握希沃-智象平台，上好每一节 AI 通识课。
            </p>
          </motion.div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        <div className="grid grid-cols-12 gap-5">
          {/* 左侧分类 */}
          <aside className="col-span-12 md:col-span-3">
            <Card className="border-0 shadow-sm sticky top-20">
              <CardContent className="p-3">
                <div className="space-y-1">
                  {MOCK_TUTORIAL_CATEGORIES.map((cat, i) => {
                    const isActive = selectedCategory === cat.id;
                    const count = MOCK_TUTORIALS.filter((t) => t.categoryId === cat.id).length;
                    return (
                      <motion.button
                        key={cat.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: i * 0.05 }}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                          isActive
                            ? 'bg-primary text-primary-foreground'
                            : 'text-foreground hover:bg-muted/50'
                        }`}
                      >
                        <span className="text-xl">{cat.icon}</span>
                        <div className="flex-1 text-left">
                          <p className={`font-medium ${isActive ? '' : ''}`}>{cat.name}</p>
                          <p
                            className={`text-[10px] ${isActive ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}
                          >
                            {count} 个教程
                          </p>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>

                <Separator className="my-3" />

                <div className="px-3 py-3 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="size-4 text-emerald-600" />
                    <span className="text-sm font-semibold text-emerald-700">我的进度</span>
                  </div>
                  <p className="text-xs text-emerald-600 mb-2">已完成 4/12 个教程</p>
                  <Progress value={33} className="h-1.5 bg-emerald-100" />
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* 右侧教程列表 */}
          <section className="col-span-12 md:col-span-9">
            <h2 className="text-lg font-bold mb-4">
              {MOCK_TUTORIAL_CATEGORIES.find((c) => c.id === selectedCategory)?.name}
              <span className="text-sm font-normal text-muted-foreground ml-2">
                共 {filteredTutorials.length} 个教程
              </span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTutorials.map((tutorial, i) => (
                <TutorialCard key={tutorial.id} tutorial={tutorial} index={i} />
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

function TutorialCard({ tutorial, index }: { tutorial: ITutorial; index: number }) {
  const navigate = useNavigate();

  // 模拟进度（随机生成）
  const progress = [100, 100, 60, 30, 0, 0][index % 6];
  const isCompleted = progress === 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Card
         className="border-0 shadow-sm hover:shadow-md transition-all cursor-pointer group h-full overflow-hidden"
         onClick={() => navigate(`/training/${tutorial.id}`)}
       >
         <div className="h-28 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center relative">
           <span className="text-5xl group-hover:scale-110 transition-transform">
             {tutorial.coverEmoji}
           </span>
           {isCompleted && (
             <div className="absolute top-2 right-2">
               <Badge className="bg-emerald-500 text-white border-0 text-[10px]">
                 <CheckCircle2 className="size-3 mr-1" />
                 已完成
               </Badge>
             </div>
           )}
         </div>
         <CardContent className="p-4">
           <div className="flex items-center gap-2 mb-2">
             <Badge variant="outline" className="text-[10px] h-5 font-normal">
               {tutorial.categoryName}
             </Badge>
             <Badge variant="outline" className="text-[10px] h-5 font-normal">
               {tutorial.difficulty}
             </Badge>
           </div>
           <h3 className="text-sm font-semibold mb-1.5 line-clamp-2 min-h-[2.5em] group-hover:text-primary transition-colors">
             {tutorial.title}
           </h3>
           <p className="text-xs text-muted-foreground line-clamp-2 mb-3 min-h-[2.5em]">
             {tutorial.description}
           </p>

           <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
             <span className="flex items-center gap-1">
               <Clock className="size-3" />
               {tutorial.duration}
             </span>
             <span className="flex items-center gap-1">
               <Layers className="size-3" />
               {tutorial.steps.length} 个步骤
             </span>
           </div>

           {progress > 0 && (
             <div className="mt-2 mb-3">
               <div className="flex items-center justify-between text-[10px] mb-1">
                 <span className="text-muted-foreground">学习进度</span>
                 <span className="font-medium tabular-nums">{progress}%</span>
               </div>
               <Progress value={progress} className="h-1" />
             </div>
           )}

           <Button
             variant="outline"
             size="sm"
             className="w-full h-7 text-xs"
             onClick={(e) => {
               e.stopPropagation();
               if (tutorial.experienceUrl) {
                 navigate(tutorial.experienceUrl);
               }
             }}
           >
             立即体验
             <ExternalLink className="size-3 ml-1" />
           </Button>
         </CardContent>
       </Card>
    </motion.div>
  );
}

// 教程详情页
export function TeacherTrainingDetailPage() {
  const { tutorialId } = useParams<{ tutorialId: string }>();
  const navigate = useNavigate();

  const tutorial = MOCK_TUTORIALS.find((t) => t.id === tutorialId) || MOCK_TUTORIALS[0];
  const prevTutorial = tutorial.prevId
    ? MOCK_TUTORIALS.find((t) => t.id === tutorial.prevId)
    : null;
  const nextTutorial = tutorial.nextId
    ? MOCK_TUTORIALS.find((t) => t.id === tutorial.nextId)
    : null;

  return (
    <div className="min-h-screen bg-slate-50/60">
      <main className="max-w-4xl mx-auto px-4 md:px-6 py-6">
        {/* 返回 */}
        <button
          onClick={() => navigate('/training')}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="size-4" />
          返回培训列表
        </button>

        {/* 教程头部 */}
        <Card className="border-0 shadow-sm mb-5 overflow-hidden">
          <div className="h-40 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 flex items-center gap-6 px-8">
            <div className="size-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-5xl">
              {tutorial.coverEmoji}
            </div>
            <div className="text-white">
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-white/20 text-white border-0">{tutorial.categoryName}</Badge>
                <Badge variant="outline" className="bg-white/10 text-white border-white/30">
                  {tutorial.difficulty}
                </Badge>
              </div>
              <h1 className="text-xl md:text-2xl font-bold text-white">{tutorial.title}</h1>
              <div className="flex items-center gap-4 mt-2 text-white/80 text-sm">
                <span className="flex items-center gap-1">
                  <Clock className="size-4" />
                  {tutorial.duration}
                </span>
                <span className="flex items-center gap-1">
                  <Layers className="size-4" />
                  {tutorial.steps.length} 个步骤
                </span>
              </div>
            </div>
          </div>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">{tutorial.description}</p>
          </CardContent>
        </Card>

        {/* 教程内容 */}
        <div className="space-y-4 mb-6">
          {tutorial.steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <Card className="border-0 shadow-sm">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="size-8 shrink-0 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white text-sm font-bold">
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-semibold mb-2">步骤 {i + 1}</h3>
                      <p className="text-sm text-foreground/90 leading-relaxed">{step}</p>

                      {/* 截图占位 */}
                      <div className="mt-4 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-200/60 p-6 text-center">
                        <Monitor className="size-8 mx-auto text-slate-400 mb-2" />
                        <p className="text-xs text-slate-500">操作示意图</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

          {/* 底部导航 */}
          <div className="space-y-4 py-4">
            {/* 去体验按钮 */}
            {tutorial.experienceUrl && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="p-5 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 border border-emerald-100 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white shrink-0">
                    <Lightbulb className="size-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">学完了？去试试吧！</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      打开对应功能页面，动手实践本节课学到的内容
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => navigate(tutorial.experienceUrl!)}
                  className="shrink-0"
                >
                  去体验
                  <ExternalLink className="size-4 ml-1.5" />
                </Button>
              </motion.div>
            )}

            {/* 上下篇导航 */}
            <div className="flex items-center justify-between gap-4">
              <div>
                {prevTutorial ? (
                  <Button variant="outline" onClick={() => navigate(`/training/${prevTutorial.id}`)}>
                    <ChevronLeft className="size-4 mr-1" />
                    上一篇：{prevTutorial.title}
                  </Button>
                ) : (
                  <div />
                )}
              </div>
              <div>
                {nextTutorial ? (
                  <Button onClick={() => navigate(`/training/${nextTutorial.id}`)}>
                    下一篇：{nextTutorial.title}
                    <ChevronRight className="size-4 ml-1" />
                  </Button>
                ) : (
                  <Badge className="bg-emerald-500 border-0">
                    <CheckCircle2 className="size-3 mr-1" />
                    已到最后一课
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

import { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Target,
  FileText,
  Presentation,
  FlaskConical,
  ClipboardList,
  Cpu,
  Clock,
  ChevronRight,
  ChevronDown,
  Sparkles,
  PlayCircle,
  BookOpen,
  Lightbulb,
  Trophy,
  ShieldCheck,
  Map,
  Users,
  Wrench,
  Rocket,
  CheckCircle2,
  BadgeCheck,
  BrainCircuit,
  Palette,
  ChevronLeft,
  X,
  ExternalLink,
  Beaker,
  Zap,
  GraduationCap,
  Image as ImageIcon,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getPblProjectById, type IPblProject, type IPblLesson } from '@/data/pbl';
import { PBL_COURSEWARE, type ICoursewareSlide, type ILessonCourseware } from '@/data/pbl-courseware';
import Image from '@/components/ui/image';
import { toast } from 'sonner';

const TAB_ITEMS = [
  { value: 'overview', label: '项目概览', icon: BookOpen },
  { value: 'objectives', label: '学习目标', icon: Target },
  { value: 'lessons', label: '课时安排', icon: Presentation },
  { value: 'resources', label: '配套资源', icon: Wrench },
  { value: 'challenge', label: '拓展挑战', icon: Rocket },
  { value: 'showcase', label: '成果展示', icon: Trophy },
  { value: 'alignment', label: '课标对标', icon: Map },
];

const TOOL_TAB_MAP: Record<string, string> = {
  lesson: 'lesson',
  code: 'code',
  qa: 'qa',
  image: 'image',
};

export default function PblProjectPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedLessonId, setExpandedLessonId] = useState<string | null>(null);
  const [slideIndex, setSlideIndex] = useState(0);

  const project: IPblProject | undefined = projectId ? getPblProjectById(projectId) : undefined;

  const coursewareMap = useMemo(() => {
    const map: Record<string, ILessonCourseware> = {};
    PBL_COURSEWARE.forEach((cw) => {
      map[cw.lessonId] = cw;
    });
    return map;
  }, []);

  if (!project) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="py-12 text-center">
            <BookOpen className="size-12 text-muted-foreground/40 mx-auto mb-3" />
            <h2 className="text-lg font-semibold mb-2">项目未找到</h2>
            <p className="text-sm text-muted-foreground mb-4">
              您访问的PBL项目不存在或已被移除
            </p>
            <Button onClick={() => navigate('/courses')}>返回课程库</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const Icon =
    project.iconKey === 'camera'
      ? Cpu
      : project.iconKey === 'brain'
        ? BrainCircuit
        : project.iconKey === 'palette'
          ? Palette
          : project.iconKey === 'mic'
            ? PlayCircle
            : project.iconKey === 'languages'
              ? FileText
              : Sparkles;

  const handleExpand = (lessonId: string) => {
    if (expandedLessonId === lessonId) {
      setExpandedLessonId(null);
    } else {
      setExpandedLessonId(lessonId);
      setSlideIndex(0);
    }
  };

  const handleToolJump = (type: string, targetTab: string) => {
    if (type === 'ai-tool') {
      const hash = TOOL_TAB_MAP[targetTab] ? `#${TOOL_TAB_MAP[targetTab]}` : '';
      navigate(`/ai-tools${hash}`);
      toast.success('正在跳转至AI工具…');
    } else if (type === 'ai-lab') {
      navigate('/ai-lab');
      toast.success('正在跳转至AI实验室…');
    } else if (type === 'coding-lab') {
      navigate('/coding-lab');
      toast.success('正在跳转至编程实验室…');
    } else if (type === 'subject-tools') {
      navigate('/tools');
      toast.success('正在跳转至学科工具…');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section
        className={`w-full bg-gradient-to-br ${project.colorFrom} ${project.colorTo} text-white relative overflow-hidden`}
      >
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 size-64 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-10 right-20 size-80 rounded-full bg-white/50 blur-3xl" />
        </div>
        <div className="max-w-5xl mx-auto px-4 md:px-6 py-12 md:py-14 relative z-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-xs text-white/70 mb-4 flex-wrap">
            <Link to="/" className="hover:text-white transition-colors">
              首页
            </Link>
            <ChevronRight className="size-3" />
            <Link to="/courses" className="hover:text-white transition-colors">
              课程库
            </Link>
            <ChevronRight className="size-3" />
            <Link to="/courses?pbl=1" className="hover:text-white transition-colors">
              PBL项目课
            </Link>
            <ChevronRight className="size-3" />
            <span className="text-white/90 truncate max-w-[200px]">{project.title}</span>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="text-white/80 hover:text-white hover:bg-white/10 -ml-2 mb-4"
          >
            <ArrowLeft className="size-4 mr-1" />
            返回
          </Button>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <div className="flex items-start gap-4">
              <div className="size-16 md:size-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0 border border-white/30">
                <Icon className="size-8 md:size-10 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <Badge className="mb-2 bg-white/20 text-white border-white/30 backdrop-blur-sm">
                  PBL 项目式学习 · {project.techCategory}
                </Badge>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-1">
                  {project.title}
                </h1>
                <p className="text-lg md:text-xl text-white/80 font-medium">{project.subtitle}</p>
              </div>
            </div>

            {/* 项目数据 */}
            <div className="flex flex-wrap gap-4 pt-2">
              <div className="flex items-center gap-2">
                <div className="size-8 rounded-lg bg-white/20 flex items-center justify-center">
                  <Clock className="size-4" />
                </div>
                <div>
                  <div className="text-lg font-bold">{project.totalHours}</div>
                  <div className="text-[11px] text-white/70">课时</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="size-8 rounded-lg bg-white/20 flex items-center justify-center">
                  <BookOpen className="size-4" />
                </div>
                <div>
                  <div className="text-lg font-bold">{project.totalLessons}</div>
                  <div className="text-[11px] text-white/70">课节</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="size-8 rounded-lg bg-white/20 flex items-center justify-center">
                  <Users className="size-4" />
                </div>
                <div>
                  <div className="text-lg font-bold">{project.stageLabel}</div>
                  <div className="text-[11px] text-white/70">{project.gradeRange}</div>
                </div>
              </div>
            </div>

            {/* 技术标签 */}
            <div className="flex flex-wrap gap-2 pt-2">
              {project.techTags.map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="bg-white/10 text-white border-white/30 text-xs"
                >
                  {tag}
                </Badge>
              ))}
            </div>

            {/* CTA */}
            <div className="pt-4 flex flex-wrap gap-3">
              <Button
                size="lg"
                onClick={() => {
                  setActiveTab('lessons');
                  setTimeout(() => {
                    document.getElementById('lessons-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }, 100);
                }}
                className="gap-2 shadow-lg bg-white text-foreground hover:bg-white/90 h-12"
              >
                <PlayCircle className="size-5" />
                开始学习
              </Button>
              <Button
                size="lg"
                variant="secondary"
                onClick={() => toast.success('已加入备课清单')}
                className="gap-2 h-12 bg-white/20 text-white border-white/30 hover:bg-white/30"
              >
                <FileText className="size-4" />
                加入备课
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content Tabs */}
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full grid grid-cols-4 md:grid-cols-7 h-auto md:h-10 mb-6 overflow-x-auto justify-start">
            {TAB_ITEMS.map((tab) => {
              const TabIcon = tab.icon;
              return (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="flex items-center gap-1.5 py-2 data-[state=active]:bg-background whitespace-nowrap"
                >
                  <TabIcon className="size-3.5" />
                  <span className="text-xs md:text-sm">{tab.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {/* 项目概览 */}
          <TabsContent value="overview">
            <div className="space-y-6">
              {/* 驱动问题 */}
              <Card className="border-primary/20 bg-gradient-to-r from-primary/[0.04] to-purple-500/[0.04]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Lightbulb className="size-5 text-primary" />
                    项目驱动问题
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-medium text-foreground leading-relaxed">
                    「{project.drivingQuestion}」
                  </p>
                </CardContent>
              </Card>

              {/* 项目背景 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <BookOpen className="size-5 text-primary" />
                    项目背景
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground leading-relaxed">
                  {project.projectBackground}
                </CardContent>
              </Card>

              {/* 课时概览 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Presentation className="size-5 text-primary" />
                    项目课时概览
                  </CardTitle>
                  <CardDescription>共 {project.totalLessons} 课时，{project.totalHours} 学时</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {project.lessons.map((lesson, i) => (
                      <div
                        key={lesson.id}
                        className="flex items-start gap-3 p-3 rounded-lg border border-border/50 hover:border-primary/30 hover:bg-accent/20 transition-all cursor-pointer"
                        onClick={() => {
                          setActiveTab('lessons');
                          setExpandedLessonId(lesson.id);
                          setSlideIndex(0);
                          setTimeout(() => {
                            const el = document.getElementById(`lesson-${lesson.id}`);
                            el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                          }, 100);
                        }}
                      >
                        <div
                          className={`size-8 rounded-md bg-gradient-to-br ${project.colorFrom} ${project.colorTo} text-white flex items-center justify-center text-sm font-bold shrink-0`}
                        >
                          {i + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm">{lesson.title}</div>
                          <div className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                            {lesson.description}
                          </div>
                        </div>
                        <ChevronRight className="size-4 text-muted-foreground shrink-0 mt-1" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* 学习目标 */}
          <TabsContent value="objectives">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="size-5 text-primary" />
                  学习目标
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {[
                  { title: '知识目标', items: project.objectives.knowledge, color: 'text-blue-500 bg-blue-500/10' },
                  { title: '能力目标', items: project.objectives.ability, color: 'text-emerald-500 bg-emerald-500/10' },
                  { title: '素养目标', items: project.objectives.literacy, color: 'text-purple-500 bg-purple-500/10' },
                ].map((group) => (
                  <div key={group.title}>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <span className={`size-6 rounded-md ${group.color} flex items-center justify-center`}>
                        <CheckCircle2 className="size-3.5" />
                      </span>
                      {group.title}
                    </h4>
                    <ul className="space-y-2 pl-9">
                      {group.items.map((item, i) => (
                        <li key={i} className="flex gap-2 text-foreground">
                          <span className="text-muted-foreground mt-1">•</span>
                          <span className="leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* 课时安排 */}
          <TabsContent value="lessons">
            <div id="lessons-section" className="space-y-4">
              {project.lessons.map((lesson, i) => {
                const courseware = coursewareMap[lesson.id];
                const isExpanded = expandedLessonId === lesson.id;
                return (
                  <motion.div
                    key={lesson.id}
                    id={`lesson-${lesson.id}`}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                  >
                    <Card className="overflow-hidden group hover:shadow-md transition-all border-border/60">
                      <div className={`h-1 w-full bg-gradient-to-r ${project.colorFrom} ${project.colorTo}`} />
                      <CardContent className="p-5">
                        <div
                          className="flex items-start gap-4 cursor-pointer"
                          onClick={() => handleExpand(lesson.id)}
                        >
                          <div
                            className={`size-12 rounded-xl bg-gradient-to-br ${project.colorFrom} ${project.colorTo} text-white flex items-center justify-center text-lg font-bold shrink-0 shadow-md`}
                          >
                            {lesson.lessonIndex}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <h3 className="font-bold text-base">{lesson.title}</h3>
                              <Badge variant="outline" className="text-[10px] font-normal h-5">
                                {lesson.duration}分钟
                              </Badge>
                              {lesson.experiment && (
                                <Badge className="text-[10px] font-normal h-5 bg-emerald-500/10 text-emerald-700 border-emerald-200">
                                  含实验
                                </Badge>
                              )}
                              {courseware && (
                                <Badge className="text-[10px] font-normal h-5 bg-primary/10 text-primary border-primary/20">
                                  完整课件
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">
                              {lesson.description}
                            </p>
                            <div className="space-y-2">
                              <div className="text-xs text-muted-foreground flex flex-wrap gap-1.5">
                                <span className="font-medium text-foreground">核心知识点：</span>
                                {lesson.knowledgePoints.map((kp) => (
                                  <Badge
                                    key={kp}
                                    variant="outline"
                                    className="text-[10px] font-normal py-0 h-5"
                                  >
                                    {kp}
                                  </Badge>
                                ))}
                              </div>
                              <div className="flex items-center gap-1.5">
                                {lesson.resourceTypes.map((r) => (
                                  <Badge
                                    key={r}
                                    variant="secondary"
                                    className="text-[10px] font-normal py-0 h-5"
                                  >
                                    {r}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                          <Button size="sm" variant="outline" className="shrink-0">
                            {isExpanded ? '收起' : '查看课件'}
                            {isExpanded ? (
                              <ChevronDown className="size-3.5 ml-1" />
                            ) : (
                              <ChevronRight className="size-3.5 ml-1" />
                            )}
                          </Button>
                        </div>

                        {/* 展开的课件内容 */}
                        <AnimatePresence>
                          {isExpanded && courseware && (
                            <CoursewareViewer
                              lesson={lesson}
                              courseware={courseware}
                              slideIndex={slideIndex}
                              setSlideIndex={setSlideIndex}
                              onToolJump={handleToolJump}
                              colorFrom={project.colorFrom}
                              colorTo={project.colorTo}
                            />
                          )}
                          {isExpanded && !courseware && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="pt-4 mt-4 border-t border-border/50"
                            >
                              <div className="p-6 bg-muted/30 rounded-lg text-center">
                                <BookOpen className="size-8 text-muted-foreground/40 mx-auto mb-2" />
                                <p className="text-sm text-muted-foreground">课件正在完善中，敬请期待</p>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </TabsContent>

          {/* 配套资源 */}
          <TabsContent value="resources">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Wrench className="size-5 text-primary" />
                    配套工具
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {project.tools.map((tool) => (
                      <li key={tool} className="flex items-center gap-2">
                        <BadgeCheck className="size-4 text-primary shrink-0" />
                        <span>{tool}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Cpu className="size-5 text-primary" />
                    硬件清单
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {project.hardware.map((h) => (
                      <li key={h} className="flex items-center gap-2">
                        <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <FileText className="size-5 text-primary" />
                    资源类型
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    {['教案', '课件', '实验指导', '作业单', '评价量表', '教师指南'].map((r) => (
                      <Badge
                        key={r}
                        className="px-3 py-1.5 text-sm bg-primary/10 text-primary border-primary/20"
                      >
                        {r}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* 拓展挑战 */}
          <TabsContent value="challenge">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Rocket className="size-5 text-primary" />
                  拓展挑战
                </CardTitle>
                <CardDescription>
                  完成基础项目后，尝试以下进阶挑战，进一步提升能力
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {project.extensionChallenges.map((challenge, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-r from-amber-500/5 to-orange-500/5 border border-amber-500/20"
                  >
                    <div className="size-7 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 text-white flex items-center justify-center text-sm font-bold shrink-0">
                      {i + 1}
                    </div>
                    <p className="text-foreground leading-relaxed pt-0.5">{challenge}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* 成果展示 */}
          <TabsContent value="showcase">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="size-5 text-primary" />
                  成果展示建议
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-6 rounded-xl bg-gradient-to-r from-purple-500/5 to-pink-500/5 border border-purple-500/20">
                  <p className="text-lg font-medium text-foreground leading-relaxed">
                    {project.showcase}
                  </p>
                </div>
                <div className="mt-4 space-y-3 text-sm text-muted-foreground">
                  <p>建议以小组为单位进行项目成果展示，每个小组展示时间 8-10 分钟，包含：</p>
                  <ul className="space-y-1.5 pl-5 list-disc">
                    <li>项目方案介绍（问题、思路、技术）</li>
                    <li>作品现场演示或展演</li>
                    <li>收获与反思分享</li>
                    <li>答辩互动环节</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 课标对标 */}
          <TabsContent value="alignment">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Map className="size-5 text-primary" />
                  课标对标
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {project.standardAlignment.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-4 rounded-xl border border-border/50"
                  >
                    <ShieldCheck className="size-5 text-primary shrink-0 mt-0.5" />
                    <p className="text-foreground leading-relaxed">{item}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

interface CoursewareViewerProps {
  lesson: IPblLesson;
  courseware: ILessonCourseware;
  slideIndex: number;
  setSlideIndex: (i: number) => void;
  onToolJump: (type: string, targetTab: string) => void;
  colorFrom: string;
  colorTo: string;
}

function CoursewareViewer({
  lesson,
  courseware,
  slideIndex,
  setSlideIndex,
  onToolJump,
  colorFrom,
  colorTo,
}: CoursewareViewerProps) {
  const slides = courseware.slides;
  const currentSlide = slides[slideIndex];
  const totalSlides = slides.length;
  const isFirst = slideIndex === 0;
  const isLast = slideIndex === totalSlides - 1;

  const slideTypeLabel = {
    cover: '封面',
    knowledge: '知识点',
    activity: '活动探究',
    case: '案例分析',
    summary: '小结',
  } as const;

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="pt-4 mt-4 border-t border-border/50"
    >
      {/* 课件区 */}
      <div className="space-y-4">
        {/* 课件主区域 */}
        <div
          className={`relative rounded-2xl bg-gradient-to-br ${colorFrom} ${colorTo} text-white overflow-hidden shadow-lg`}
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 size-64 rounded-full bg-white blur-3xl" />
            <div className="absolute bottom-0 left-10 size-48 rounded-full bg-white/70 blur-3xl" />
          </div>
          <div className="relative z-10 p-6 md:p-8 min-h-[360px] flex flex-col">
            {/* 顶栏 */}
            <div className="flex items-center justify-between mb-4">
              <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm text-xs">
                第 {lesson.lessonIndex} 课 · {slideTypeLabel[currentSlide.type]}
              </Badge>
              <span className="text-xs text-white/70 font-mono">
                {slideIndex + 1} / {totalSlides}
              </span>
            </div>

            {/* 内容 */}
            <div className="flex-1 flex flex-col">
              <AnimatePresence mode="wait">
                <motion.div
                  key={slideIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="flex-1"
                >
                  <h3 className="text-xl md:text-2xl font-bold mb-4">{currentSlide.title}</h3>
                  <div className="whitespace-pre-line text-white/90 leading-relaxed text-sm md:text-base">
                    {currentSlide.content}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* 底部知识点 */}
            {currentSlide.keyPoints && currentSlide.keyPoints.length > 0 && (
              <div className="mt-6 pt-4 border-t border-white/20">
                <div className="text-xs text-white/70 mb-2 flex items-center gap-1.5">
                  <Zap className="size-3.5" />
                  关键知识点
                </div>
                <div className="flex flex-wrap gap-2">
                  {currentSlide.keyPoints.map((kp, i) => (
                    <Badge
                      key={i}
                      className="bg-white/15 text-white border-white/25 text-[11px] backdrop-blur-sm"
                    >
                      {kp}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 翻页控制 */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSlideIndex(slideIndex - 1)}
            disabled={isFirst}
            className="gap-1"
          >
            <ChevronLeft className="size-4" />
            上一页
          </Button>

          {/* 页码指示器 */}
          <div className="flex items-center gap-1.5">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setSlideIndex(i)}
                className={`size-2 rounded-full transition-all ${
                  i === slideIndex ? 'bg-primary w-6' : 'bg-border hover:bg-muted-foreground/40'
                }`}
                aria-label={`跳转到第${i + 1}页`}
              />
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setSlideIndex(slideIndex + 1)}
            disabled={isLast}
            className="gap-1"
          >
            下一页
            <ChevronRight className="size-4" />
          </Button>
        </div>

        {/* 配套实验/工具 */}
        {courseware.experiments && courseware.experiments.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Beaker className="size-4 text-primary" />
              配套实验与工具
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {courseware.experiments.map((exp, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl border border-border/60 bg-card hover:border-primary/30 hover:bg-accent/20 transition-all cursor-pointer group"
                  onClick={() => onToolJump(exp.type, exp.targetTab)}
                >
                  <div className="flex items-start gap-3">
                    <div className="size-9 rounded-lg bg-gradient-to-br from-primary/15 to-purple-500/15 flex items-center justify-center shrink-0">
                      {exp.type === 'ai-lab' ? (
                        <FlaskConical className="size-4 text-primary" />
                      ) : exp.type === 'code-lab' ? (
                        <Cpu className="size-4 text-primary" />
                      ) : exp.type === 'ai-tool' ? (
                        <Sparkles className="size-4 text-primary" />
                      ) : (
                        <Wrench className="size-4 text-primary" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm flex items-center gap-1">
                        {exp.name}
                        <ExternalLink className="size-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {exp.description}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 课标对标 */}
        {courseware.standardPoints && courseware.standardPoints.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <GraduationCap className="size-4 text-primary" />
              本课课标对标
            </h4>
            <div className="p-4 rounded-xl bg-gradient-to-r from-primary/[0.04] to-purple-500/[0.04] border border-primary/10">
              <ul className="space-y-2">
                {courseware.standardPoints.map((sp, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="size-4 text-primary shrink-0 mt-0.5" />
                    <span className="text-foreground">{sp}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

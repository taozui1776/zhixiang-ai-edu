import { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  BookOpen,
  Target,
  FileText,
  Presentation,
  FlaskConical,
  ClipboardList,
  PlayCircle,
  Heart,
  ChevronRight,
  ChevronDown,
  ChevronLeft,
  Download,
  Clock,
  Layers,
  CheckCircle2,
  Circle,
  Star,
  Sparkles,
  ZoomIn,
  Lightbulb,
  ListOrdered,
  GraduationCap,
  Rocket,
  Trophy,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { getCourseSummaryById, type ICourseSummary } from '@/data/course-summary';
import { MOCK_COURSE_SUMMARY } from '@/data/course-summary';
import { SAMPLE_COURSES, type ISampleCourse, type ISampleLesson, type CoursewareSlide } from '@/data/sample-courses';
import { MOCK_CHALLENGES, CHALLENGE_STAGES } from '@/data/after-school';
import { useTeacherAuth } from '@/context/TeacherAuthContext';
import { useFavorites, useRecentItems } from '@/hooks/useTeacherData';
import { toast } from 'sonner';
import Image from '@/components/ui/image';

interface ILessonItem {
  id: string;
  title: string;
  duration: number;
  status: 'completed' | 'in-progress' | 'not-started';
  resources: { type: string; name: string }[];
}

interface IUnitItem {
  id: string;
  title: string;
  description: string;
  lessons: ILessonItem[];
}

// 为样板课生成结构化的单元-课时目录
function buildCourseStructure(course: ICourseSummary): IUnitItem[] {
  const unitCount = 2; // 8课时 → 2个单元，每单元4课时
  const units: IUnitItem[] = [];

  const unitTitles: Record<string, string[]> = {
    'course-primary-ai-intro': ['第一单元 · 初识AI世界', '第二单元 · 数据与智能'],
    'course-junior-vision': ['第一单元 · 视觉入门', '第二单元 · 卷积网络探秘'],
    'course-senior-algorithm': ['第一单元 · 机器学习基础', '第二单元 · 深度学习进阶'],
  };

  const lessonNames: Record<string, string[][]> = {
    'course-primary-ai-intro': [
      ['第1课 身边的智能小伙伴', '第2课 什么是人工智能', '第3课 数据小侦探', '第4课 智能小管家'],
      ['第5课 AI创意绘画初体验', '第6课 图像里的秘密', '第7课 声音的魔法', '第8课 我的第一个AI项目'],
    ],
    'course-junior-vision': [
      ['第1课 眼睛与相机', '第2课 图像识别入门', '第3课 人脸检测大揭秘', '第4课 特征提取与匹配'],
      ['第5课 卷积神经网络初探', '第6课 训练一个分类器', '第7课 目标检测应用', '第8课 计算机视觉项目'],
    ],
    'course-senior-algorithm': [
      ['第1课 机器学习初体验', '第2课 监督学习与无监督学习', '第3课 线性回归与分类', '第4课 决策树与随机森林'],
      ['第5课 神经网络基础', '第6课 反向传播与优化', '第7课 深度学习框架实践', '第8课 综合项目：AI分类系统'],
    ],
  };

  const unitTitleList = unitTitles[course.id] || ['第一单元', '第二单元'];
  const lessonNameList = lessonNames[course.id] || [
    ['第1课', '第2课', '第3课', '第4课'],
    ['第5课', '第6课', '第7课', '第8课'],
  ];

  for (let u = 0; u < unitCount; u++) {
    const lessons: ILessonItem[] = [];
    for (let l = 0; l < 4; l++) {
      const lessonIndex = u * 4 + l;
      let status: 'completed' | 'in-progress' | 'not-started' = 'not-started';
      const completed = course.completedLessons || 0;
      if (lessonIndex < completed) status = 'completed';
      else if (lessonIndex === completed) status = 'in-progress';

      lessons.push({
        id: `${course.id}-u${u + 1}-l${l + 1}`,
        title: lessonNameList[u][l],
        duration: 40,
        status,
        resources: [
          { type: '教案', name: `${lessonNameList[u][l]} 教学设计.docx` },
          { type: '课件', name: `${lessonNameList[u][l]} 教学课件.pptx` },
          { type: '实验', name: `${lessonNameList[u][l]} 实验指导.pdf` },
          { type: '作业', name: `${lessonNameList[u][l]} 课后练习.docx` },
        ],
      });
    }
    units.push({
      id: `${course.id}-u${u + 1}`,
      title: unitTitleList[u],
      description: `本单元共 4 课时，引导学生逐步掌握核心概念与实践方法。`,
      lessons,
    });
  }

  return units;
}

const RESOURCE_TABS = [
   { value: 'courseware', label: '课件预览' },
   { value: 'lessonPlan', label: '教案' },
   { value: 'experiment', label: '实验' },
   { value: 'homework', label: '作业' },
   { value: 'extension', label: '课后拓展' },
   { value: 'all', label: '全部资源' },
 ];

// 查找样板课
type SampleCourseMap = Record<string, ISampleCourse>;
const sampleCourseMap: SampleCourseMap = {};
SAMPLE_COURSES.forEach((c) => {
  sampleCourseMap[c.id] = c;
});

function getSampleCourse(id: string): ISampleCourse | undefined {
  return sampleCourseMap[id];
}

// 根据 course-summary 的课时 id 找到样板课中对应的课时
function findSampleLesson(
  sampleCourse: ISampleCourse | undefined,
  lessonIndex: number,
): ISampleLesson | undefined {
  if (!sampleCourse) return undefined;
  return sampleCourse.units.flatMap((u) => u.lessons).find((l) => l.index === lessonIndex);
}

// ========== 课件翻页预览组件 ==========
function SlideViewer({ slides, lessonTitle }: { slides: CoursewareSlide[]; lessonTitle: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const total = slides.length;
  const slide = slides[currentIndex];

  const goPrev = () => setCurrentIndex((i) => Math.max(0, i - 1));
  const goNext = () => setCurrentIndex((i) => Math.min(total - 1, i + 1));
  const goTo = (i: number) => setCurrentIndex(i);

  const slideTypeColors: Record<string, string> = {
    title: 'from-indigo-500 to-purple-600',
    knowledge: 'from-blue-500 to-cyan-500',
    case: 'from-emerald-500 to-teal-500',
    question: 'from-amber-500 to-orange-500',
    practice: 'from-pink-500 to-rose-500',
    summary: 'from-violet-500 to-purple-600',
  };

  const slideTypeLabels: Record<string, string> = {
    title: '课程导入',
    knowledge: '知识讲解',
    case: '案例分析',
    question: '思考提问',
    practice: '课堂练习',
    summary: '总结回顾',
  };

  return (
    <div className="space-y-4">
      {/* 课件主显示区 */}
      <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 shadow-lg">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className={`absolute inset-0 bg-gradient-to-br ${slideTypeColors[slide.type] || slideTypeColors.knowledge} p-8 md:p-12 flex flex-col justify-center`}
          >
            <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-medium">
              {slideTypeLabels[slide.type] || slide.type}
            </div>
            <div className="absolute top-4 left-4 text-white/60 text-xs">
              第 {currentIndex + 1} / {total} 页
            </div>
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-6 leading-tight drop-shadow-sm">
              {slide.title}
            </h2>
            <ul className="space-y-3">
              {slide.points.map((point, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 + i * 0.08 }}
                  className="flex items-start gap-3 text-white/90 text-base md:text-lg"
                >
                  <span className="size-2 mt-2 rounded-full bg-white/70 shrink-0" />
                  <span className="leading-relaxed">{point}</span>
                </motion.li>
              ))}
            </ul>
            <div className="absolute bottom-4 right-4 text-white/40 text-xs">
              {lessonTitle}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* 翻页按钮 */}
        <button
          onClick={goPrev}
          disabled={currentIndex === 0}
          className="absolute left-3 top-1/2 -translate-y-1/2 size-10 rounded-full bg-black/30 backdrop-blur-sm text-white hover:bg-black/50 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-all"
        >
          <ChevronLeft className="size-5" />
        </button>
        <button
          onClick={goNext}
          disabled={currentIndex === total - 1}
          className="absolute right-3 top-1/2 -translate-y-1/2 size-10 rounded-full bg-black/30 backdrop-blur-sm text-white hover:bg-black/50 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-all"
        >
          <ChevronRight className="size-5" />
        </button>
      </div>

      {/* 页码导航条 */}
      <div className="flex items-center justify-center gap-1.5 flex-wrap">
        {slides.map((s, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`size-7 rounded-md text-xs font-medium transition-all ${
              i === currentIndex
                ? 'bg-primary text-white scale-110'
                : 'bg-muted hover:bg-muted/70 text-muted-foreground'
            }`}
            title={`第${i + 1}页：${s.title}`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* 进度条 */}
      <div className="h-1 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-primary to-purple-500 transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / total) * 100}%` }}
        />
      </div>
    </div>
  );
}

export default function CourseDetailPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { isLoggedIn } = useTeacherAuth();

  const course = courseId ? getCourseSummaryById(courseId) : undefined;
  const units = course ? buildCourseStructure(course) : [];

  // 样板课真实数据
  const sampleCourse = courseId ? getSampleCourse(courseId) : undefined;
  const hasSampleData = !!sampleCourse;

  // 相关课后挑战（按学段匹配，取前3个）
  const relatedChallenges = MOCK_CHALLENGES.filter(
    (c) => sampleCourse && c.stage === sampleCourse.stage,
  ).slice(0, 4);

  const [expandedUnits, setExpandedUnits] = useState<string[]>(
    units.map((u) => u.id),
  );
  const [selectedLessonId, setSelectedLessonId] = useState<string>(
    units[0]?.lessons[0]?.id || '',
  );
  const [resourceTab, setResourceTab] = useState(hasSampleData ? 'courseware' : 'all');
  const { favoriteIds, toggleFavorite } = useFavorites();
  const { addRecent } = useRecentItems();
  const isFavorite = course ? favoriteIds.includes(course.id) : false;
  const [showAllCourses, setShowAllCourses] = useState(false);

  // 访问课程详情页时写入最近使用记录
  useEffect(() => {
    if (course) {
      addRecent({
        id: course.id,
        type: 'course',
        title: course.title,
        subtitle: course.stageLabel,
        path: `/courses/${course.id}`,
        coverImage: course.coverImage,
      });
    }
  }, [course?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // 计算当前选中课时在样板课中的索引
  const currentLessonIndex = (() => {
    const allLessons = units.flatMap((u) => u.lessons);
    const idx = allLessons.findIndex((l) => l.id === selectedLessonId);
    return idx >= 0 ? idx : 0;
  })();

  const currentSampleLesson = findSampleLesson(sampleCourse, currentLessonIndex + 1);

  if (!course) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="py-12 text-center">
            <BookOpen className="size-12 text-muted-foreground/40 mx-auto mb-3" />
            <h2 className="text-lg font-semibold mb-2">课程未找到</h2>
            <p className="text-sm text-muted-foreground mb-4">
              您访问的课程不存在或已被移除
            </p>
            <Button onClick={() => navigate('/courses')}>返回课程库</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentLesson = units
    .flatMap((u) => u.lessons)
    .find((l) => l.id === selectedLessonId);

  const completedCount = course.completedLessons || 0;
  const progress = Math.round((completedCount / course.totalLessons) * 100);

  const toggleUnit = (unitId: string) => {
    setExpandedUnits((prev) =>
      prev.includes(unitId) ? prev.filter((id) => id !== unitId) : [...prev, unitId],
    );
  };

  const handleStartTeach = () => {
    if (!isLoggedIn) {
      toast.info('请先登录后使用授课模式');
      navigate('/login');
      return;
    }
    toast.info('正在进入授课模式…');
    navigate(`/teach/${course.id}`);
  };

  const handleFavorite = () => {
    if (!isLoggedIn) {
      toast.info('请先登录后使用收藏功能');
      return;
    }
    if (!course) return;
    toggleFavorite(course.id);
    toast.success(isFavorite ? '已取消收藏' : '已加入收藏');
  };

  const handleDownloadResource = (name: string) => {
    toast.success(`正在下载：${name}`);
  };

  const filteredResources =
    currentLesson && resourceTab !== 'all'
      ? currentLesson.resources.filter((r) => r.type === resourceTab)
      : currentLesson?.resources || [];

  const statusIcon = (status: string) => {
    if (status === 'completed') return <CheckCircle2 className="size-4 text-emerald-500" />;
    if (status === 'in-progress')
      return <PlayCircle className="size-4 text-primary fill-primary/20" />;
    return <Circle className="size-4 text-muted-foreground/40" />;
  };

  return (
    <div className="min-h-screen bg-slate-50/60">
      {/* 顶部课程信息区 */}
      <div className="w-full bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute top-[-30%] right-[-10%] w-[500px] h-[500px] bg-blue-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-[-20%] left-[-5%] w-[400px] h-[400px] bg-purple-400/20 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 pt-6 pb-8">
          {/* 面包屑 */}
          <div className="flex items-center gap-2 text-sm text-white/70 mb-4">
            <Button
              variant="ghost"
              size="sm"
              className="text-white/70 hover:text-white hover:bg-white/10 h-8 px-2"
              onClick={() => navigate('/courses')}
            >
              <ArrowLeft className="size-4 mr-1" />
              返回课程库
            </Button>
            <ChevronRight className="size-3" />
            <span>课程详情</span>
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            {/* 封面 */}
            <div className="w-full md:w-72 shrink-0">
              <div className="aspect-video md:aspect-[4/3] rounded-xl overflow-hidden shadow-2xl ring-2 ring-white/20">
                <Image
                  src={course.coverImage}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* 课程信息 */}
            <div className="flex-1 text-white">
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge className="bg-white/20 text-white border-0 backdrop-blur-sm">
                  {course.stageLabel}
                </Badge>
                <Badge className="bg-white/20 text-white border-0 backdrop-blur-sm">
                  {course.category}
                </Badge>
                <Badge
                  variant="outline"
                  className="bg-white/10 text-white/90 border-white/30"
                >
                  难度：{course.difficulty}
                </Badge>
              </div>

              <h1 className="text-2xl md:text-3xl font-bold mb-2">{course.title}</h1>
              <p className="text-white/80 text-sm md:text-base leading-relaxed mb-4 max-w-2xl">
                {course.description}
              </p>

              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/70 mb-5">
                <span className="flex items-center gap-1.5">
                  <Layers className="size-4" />
                  {course.totalLessons} 课时
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="size-4" />
                  共 {Math.round(course.duration / 60)} 小时
                </span>
                <span className="flex items-center gap-1.5">
                  <PlayCircle className="size-4" />
                  已学习 {completedCount} 课时 ({progress}%)
                </span>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button
                  size="lg"
                  className="bg-white text-primary hover:bg-white/90 shadow-lg h-11 px-6"
                  onClick={handleStartTeach}
                >
                  <PlayCircle className="size-4 mr-2 fill-primary/20" />
                  开始授课
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-white/10 text-white border-white/30 hover:bg-white/20 hover:text-white h-11"
                  onClick={handleFavorite}
                >
                  <Heart
                    className={`size-4 mr-2 ${isFavorite ? 'fill-red-400 text-red-400' : ''}`}
                  />
                  {isFavorite ? '已收藏' : '收藏'}
                </Button>
              </div>
            </div>
          </div>

          {/* 进度条 */}
          <div className="mt-6 max-w-xl">
            <div className="flex items-center justify-between text-xs text-white/70 mb-1.5">
              <span>学习进度</span>
              <span>
                {completedCount} / {course.totalLessons} 课时
              </span>
            </div>
            <Progress
              value={progress}
              className="h-2 bg-white/20 [&>div]:bg-white"
            />
          </div>
        </div>
      </div>

      {/* 主体内容：左侧目录 + 右侧资源 */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* 左侧：课程目录 */}
          <div className="lg:col-span-4 xl:col-span-3">
            <div className="sticky top-20">
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-3 border-b border-border/60">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                      <BookOpen className="size-4 text-primary" />
                      课程目录
                    </CardTitle>
                    <Badge variant="outline" className="text-xs">
                      {course.totalLessons} 课时
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-0 max-h-[calc(100vh-220px)] overflow-y-auto">
                  <div className="divide-y divide-border/60">
                    {units.map((unit, ui) => {
                      const isExpanded = expandedUnits.includes(unit.id);
                      return (
                        <div key={unit.id}>
                          <button
                            onClick={() => toggleUnit(unit.id)}
                            className="w-full px-4 py-3 flex items-center gap-2 hover:bg-muted/30 transition-colors text-left"
                          >
                            {isExpanded ? (
                              <ChevronDown className="size-4 text-muted-foreground shrink-0" />
                            ) : (
                              <ChevronRight className="size-4 text-muted-foreground shrink-0" />
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-foreground truncate">
                                {unit.title}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {unit.lessons.length} 课时
                              </p>
                            </div>
                            <Badge variant="outline" className="text-[10px] shrink-0">
                              单元 {ui + 1}
                            </Badge>
                          </button>

                          {isExpanded && (
                            <div className="pb-1">
                              {unit.lessons.map((lesson) => {
                                const isActive = selectedLessonId === lesson.id;
                                return (
                                  <button
                                    key={lesson.id}
                                    onClick={() => setSelectedLessonId(lesson.id)}
                                    className={`w-full px-4 pl-10 py-2.5 flex items-center gap-3 text-left transition-colors ${
                                      isActive
                                        ? 'bg-primary/10 border-l-2 border-primary'
                                        : 'hover:bg-muted/40 border-l-2 border-transparent'
                                    }`}
                                  >
                                    {statusIcon(lesson.status)}
                                    <div className="flex-1 min-w-0">
                                      <p
                                        className={`text-sm truncate ${
                                          isActive
                                            ? 'font-medium text-primary'
                                            : 'text-foreground'
                                        }`}
                                      >
                                        {lesson.title}
                                      </p>
                                      <p className="text-xs text-muted-foreground">
                                        {lesson.duration} 分钟
                                      </p>
                                    </div>
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* 右侧：资源区 */}
          <div className="lg:col-span-8 xl:col-span-9 space-y-6">
            {/* 当前课时信息 + 资源Tab */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3 border-b border-border/60">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <Badge variant="outline" className="mb-2 text-xs">
                      当前选中课时
                    </Badge>
                    <CardTitle className="text-lg font-semibold">
                      {currentLesson?.title || '请选择课时'}
                    </CardTitle>
                    <CardDescription className="text-sm mt-1">
                      {currentLesson?.duration} 分钟 · 包含 {currentLesson?.resources.length} 个教学资源
                    </CardDescription>
                  </div>
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                    onClick={handleStartTeach}
                  >
                    <PlayCircle className="size-3.5 mr-1.5" />
                    开始授课
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="p-0">
                {/* 资源类型Tab */}
                <div className="px-4 pt-3 border-b border-border/40">
                  <Tabs value={resourceTab} onValueChange={setResourceTab}>
                    <TabsList className="bg-transparent h-9 p-0 gap-1 border-b-0">
                      {RESOURCE_TABS.map((tab) => (
                        <TabsTrigger
                          key={tab.value}
                          value={tab.value}
                          className="h-9 px-3 text-xs data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
                        >
                          {tab.label}
                        </TabsTrigger>
                      ))}
                    </TabsList>

                    {/* 样板课真实内容 */}
                    {hasSampleData && currentSampleLesson && (
                      <div className="pt-4 pb-1">
                        {/* 课件预览 */}
                        {resourceTab === 'courseware' && (
                          <SlideViewer
                            slides={currentSampleLesson.courseware.slidesDetail}
                            lessonTitle={currentSampleLesson.title}
                          />
                        )}

                        {/* 教案 */}
                        {resourceTab === 'lessonPlan' && (
                          <div className="space-y-5">
                            <div>
                              <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                                <Target className="size-4 text-blue-500" />
                                教学目标
                              </h4>
                              <ul className="space-y-1.5 ml-6">
                                {currentSampleLesson.objectives.map((obj, i) => (
                                  <li key={i} className="text-sm text-muted-foreground list-disc">
                                    {obj}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="p-4 rounded-lg bg-blue-50/60 border border-blue-100">
                                <h5 className="text-sm font-semibold text-blue-800 mb-2">教学重点</h5>
                                <ul className="space-y-1">
                                  {currentSampleLesson.lessonPlan.keyPoints.map((p, i) => (
                                    <li key={i} className="text-xs text-blue-700 list-disc ml-4">
                                      {p}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              <div className="p-4 rounded-lg bg-amber-50/60 border border-amber-100">
                                <h5 className="text-sm font-semibold text-amber-800 mb-2">教学难点</h5>
                                <ul className="space-y-1">
                                  {currentSampleLesson.lessonPlan.difficultPoints.map((p, i) => (
                                    <li key={i} className="text-xs text-amber-700 list-disc ml-4">
                                      {p}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>

                            <div>
                              <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                                <ListOrdered className="size-4 text-emerald-500" />
                                教学过程
                              </h4>
                              <div className="space-y-2">
                                {currentSampleLesson.lessonPlan.process.map((step, i) => (
                                  <div
                                    key={i}
                                    className="flex gap-3 p-3 rounded-lg border border-border/50 hover:border-primary/20 transition-colors"
                                  >
                                    <div className="shrink-0 w-16 text-xs font-medium text-primary bg-primary/10 rounded-md h-6 flex items-center justify-center">
                                      {step.time}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="text-sm font-medium text-foreground mb-0.5">
                                        {step.activity}
                                      </div>
                                      <p className="text-xs text-muted-foreground leading-relaxed">
                                        {step.content}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className="p-4 rounded-lg bg-gradient-to-r from-violet-50/60 to-purple-50/60 border border-violet-100">
                              <h5 className="text-sm font-semibold text-violet-800 mb-1.5">课堂小结</h5>
                              <p className="text-xs text-violet-700 leading-relaxed">
                                {currentSampleLesson.lessonPlan.summary}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* 实验 */}
                        {resourceTab === 'experiment' && (
                          <div className="space-y-5">
                             <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100">
                               <div className="flex items-center gap-2 mb-2">
                                 <FlaskConical className="size-5 text-emerald-600" />
                                 <h4 className="text-base font-semibold text-emerald-900">
                                   {currentSampleLesson.experiment.name}
                                 </h4>
                               </div>
                               <div className="flex items-center gap-3 flex-wrap text-xs">
                                 <Badge
                                   variant="outline"
                                   className="text-emerald-700 border-emerald-200 bg-white/60"
                                 >
                                   难度：{currentSampleLesson.experiment.difficulty}
                                 </Badge>
                               </div>
                               {currentSampleLesson.experiment.relatedAiLabProjectId && (
                                 <Button
                                   size="sm"
                                   className="mt-3 w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                                   onClick={() =>
                                     navigate(`/ai-lab/project/${currentSampleLesson.experiment.relatedAiLabProjectId}`)
                                   }
                                 >
                                   <Sparkles className="size-3.5 mr-1.5" />
                                   去 AI 实验室做实验
                                 </Button>
                               )}
                             </div>

                            <div>
                              <h5 className="text-sm font-semibold text-foreground mb-2">实验目的</h5>
                              <p className="text-sm text-muted-foreground leading-relaxed">
                                {currentSampleLesson.experiment.purpose}
                              </p>
                            </div>

                            <div>
                              <h5 className="text-sm font-semibold text-foreground mb-2">所需材料</h5>
                              <div className="flex flex-wrap gap-2">
                                {currentSampleLesson.experiment.materials.map((m, i) => (
                                  <Badge
                                    key={i}
                                    variant="secondary"
                                    className="text-xs font-normal"
                                  >
                                    {m}
                                  </Badge>
                                ))}
                              </div>
                            </div>

                            <div>
                              <h5 className="text-sm font-semibold text-foreground mb-3">实验步骤</h5>
                              <ol className="space-y-2.5">
                                {currentSampleLesson.experiment.steps.map((step, i) => (
                                  <li key={i} className="flex items-start gap-3">
                                    <span className="shrink-0 size-6 rounded-full bg-emerald-500 text-white text-xs font-bold flex items-center justify-center">
                                      {i + 1}
                                    </span>
                                    <p className="text-sm text-foreground leading-relaxed pt-0.5">
                                      {step}
                                    </p>
                                  </li>
                                ))}
                              </ol>
                            </div>

                            <div className="p-4 rounded-lg bg-amber-50/70 border border-amber-100">
                              <h5 className="text-sm font-semibold text-amber-800 mb-2 flex items-center gap-1.5">
                                <Lightbulb className="size-4" />
                                小贴士
                              </h5>
                              <ul className="space-y-1">
                                {currentSampleLesson.experiment.tips.map((tip, i) => (
                                  <li
                                    key={i}
                                    className="text-xs text-amber-700 list-disc ml-4 leading-relaxed"
                                  >
                                    {tip}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        )}

                        {/* 作业 */}
                        {resourceTab === 'homework' && (
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <ClipboardList className="size-5 text-amber-500" />
                                <h4 className="text-base font-semibold text-foreground">
                                  {currentSampleLesson.homework.title}
                                </h4>
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {currentSampleLesson.homework.type}作业
                              </Badge>
                            </div>

                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {currentSampleLesson.homework.description}
                            </p>

                            <div className="pt-2">
                              <h5 className="text-sm font-semibold text-foreground mb-3">作业题目</h5>
                              <div className="space-y-3">
                                {currentSampleLesson.homework.questions.map((q, i) => (
                                  <div
                                    key={i}
                                    className="flex items-start gap-3 p-3 rounded-lg bg-amber-50/40 border border-amber-100/60"
                                  >
                                    <span className="shrink-0 size-6 rounded-md bg-amber-500 text-white text-xs font-bold flex items-center justify-center">
                                      {i + 1}
                                    </span>
                                    <p className="text-sm text-foreground leading-relaxed pt-0.5">
                                      {q}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* 课后拓展 */}
                        {resourceTab === 'extension' && (
                          <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-1">
                              <Rocket className="size-5 text-violet-500" />
                              <h4 className="text-base font-semibold text-foreground">
                                课后拓展挑战
                              </h4>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              学有余力的同学可以挑战以下项目，综合运用本课程学到的知识。
                            </p>

                            {relatedChallenges.length === 0 ? (
                              <div className="text-center py-8 text-muted-foreground text-sm">
                                暂无相关挑战
                              </div>
                            ) : (
                              <div className="grid gap-3">
                                {relatedChallenges.map((challenge) => {
                                  const stageInfo = CHALLENGE_STAGES.find(
                                    (s) => s.value === challenge.stage,
                                  );
                                  return (
                                    <button
                                      key={challenge.id}
                                      onClick={() =>
                                        navigate(`/after-school/challenge/${challenge.id}`)
                                      }
                                      className="w-full text-left p-4 rounded-xl bg-violet-50/40 border border-violet-100/60 hover:bg-violet-100/50 hover:border-violet-200 transition-all group"
                                    >
                                      <div className="flex items-start justify-between gap-3">
                                        <div className="flex-1 min-w-0">
                                          <h5 className="text-sm font-semibold text-foreground flex items-center gap-2">
                                            <Trophy className="size-4 text-amber-500" />
                                            {challenge.title}
                                          </h5>
                                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                            {challenge.description}
                                          </p>
                                          <div className="flex items-center gap-2 mt-2 flex-wrap">
                                            <Badge
                                              variant="outline"
                                              className="text-[10px] bg-white/60"
                                            >
                                              {stageInfo?.label}
                                            </Badge>
                                            <Badge
                                              variant="outline"
                                              className="text-[10px] bg-white/60"
                                            >
                                              难度{'★'.repeat(challenge.difficulty)}
                                            </Badge>
                                            <span className="text-[10px] text-muted-foreground">
                                              ⏱ {challenge.duration}
                                            </span>
                                          </div>
                                        </div>
                                        <ChevronRight className="size-4 text-muted-foreground shrink-0 mt-1 group-hover:text-violet-500 group-hover:translate-x-0.5 transition-all" />
                                      </div>
                                    </button>
                                  );
                                })}
                              </div>
                            )}

                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full"
                              onClick={() => navigate('/after-school')}
                            >
                              查看全部挑战
                              <ChevronRight className="size-4 ml-1" />
                            </Button>
                          </div>
                        )}

                        {/* 全部资源 */}
                        {resourceTab === 'all' && (
                          <div className="space-y-3 py-2">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                              {[
                                { label: '课件页数', value: `${currentSampleLesson.courseware.slides} 页`, icon: Presentation, color: 'text-violet-500 bg-violet-50 border-violet-100' },
                                { label: '教案完整度', value: '完整', icon: FileText, color: 'text-blue-500 bg-blue-50 border-blue-100' },
                                { label: '实验难度', value: currentSampleLesson.experiment.difficulty, icon: FlaskConical, color: 'text-emerald-500 bg-emerald-50 border-emerald-100' },
                                { label: '作业类型', value: currentSampleLesson.homework.type, icon: ClipboardList, color: 'text-amber-500 bg-amber-50 border-amber-100' },
                              ].map((item, i) => {
                                const Icon = item.icon;
                                return (
                                  <div
                                    key={i}
                                    className={`p-3 rounded-lg border ${item.color}`}
                                  >
                                    <Icon className="size-5 mb-1.5" />
                                    <div className="text-[11px] opacity-70 mb-0.5">{item.label}</div>
                                    <div className="text-sm font-semibold">{item.value}</div>
                                  </div>
                                );
                              })}
                            </div>
                            <p className="text-xs text-muted-foreground text-center pt-2">
                              切换上方标签查看完整内容，或点击下方按钮下载全部资源
                            </p>
                            <div className="flex justify-center">
                              <Button size="sm" variant="outline" className="gap-1.5">
                                <Download className="size-3.5" />
                                下载本课时全部资源
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* 非样板课回退：文件列表 */}
                    {!hasSampleData && (
                      <div className="pt-3">
                        {filteredResources.length === 0 ? (
                          <div className="text-center py-12 text-muted-foreground text-sm">
                            当前课时暂无此类型资源
                          </div>
                        ) : (
                          <div className="space-y-2 pb-2">
                            {filteredResources.map((res, ri) => (
                              <motion.div
                                key={ri}
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.2, delay: ri * 0.03 }}
                                className="flex items-center gap-4 p-3 rounded-lg border border-border/60 hover:border-primary/30 hover:bg-primary/5 transition-all group"
                              >
                                <div
                                  className={`size-10 rounded-lg flex items-center justify-center text-white shrink-0 ${
                                    res.type === '教案'
                                      ? 'bg-blue-500'
                                      : res.type === '课件'
                                        ? 'bg-violet-500'
                                        : res.type === '实验'
                                          ? 'bg-emerald-500'
                                          : res.type === '作业'
                                            ? 'bg-amber-500'
                                            : 'bg-pink-500'
                                  }`}
                                >
                                  {res.type === '教案' && <FileText className="size-5" />}
                                  {res.type === '课件' && <Presentation className="size-5" />}
                                  {res.type === '实验' && <FlaskConical className="size-5" />}
                                  {res.type === '作业' && <ClipboardList className="size-5" />}
                                  {res.type === '视频' && <PlayCircle className="size-5" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <p className="text-sm font-medium text-foreground truncate">
                                      {res.name}
                                    </p>
                                    <Badge
                                      variant="outline"
                                      className="text-[10px] shrink-0 bg-primary/5 text-primary border-primary/20"
                                    >
                                      {res.type === '教案' || res.type === '课件'
                                        ? '教学设计'
                                        : '学习任务'}
                                    </Badge>
                                  </div>
                                  <p className="text-xs text-muted-foreground mt-0.5">
                                    {res.type}资源 · 可下载
                                  </p>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-8 text-xs"
                                    onClick={() => handleDownloadResource(res.name)}
                                  >
                                    <Download className="size-3.5 mr-1" />
                                    下载
                                  </Button>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </Tabs>
                </div>
              </CardContent>
            </Card>

            {/* 课程介绍卡片 */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Sparkles className="size-4 text-primary" />
                  课程亮点
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    {
                      icon: Target,
                      title: '目标明确',
                      desc: '每节课对应明确的知识目标与能力目标',
                    },
                    {
                      icon: FlaskConical,
                      title: '动手实践',
                      desc: '配套实验活动，让学生在做中学',
                    },
                    {
                      icon: Star,
                      title: '素养导向',
                      desc: '对标国家AI通识教育指南与课标要求',
                    },
                  ].map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={i}
                        className="p-4 rounded-xl bg-gradient-to-br from-primary/5 to-accent/20 border border-border/60"
                      >
                        <Icon className="size-5 text-primary mb-2" />
                        <h4 className="font-semibold text-sm text-foreground mb-1">
                          {item.title}
                        </h4>
                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

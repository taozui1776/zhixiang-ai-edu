import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
  ExternalLink,
  Beaker,
  Zap,
  GraduationCap,
  CameraIcon,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { VISION_COURSE, type IVisionLesson } from '@/data/vision-course';
import Image from '@/components/ui/image';
import { toast } from 'sonner';

const TAB_ITEMS = [
  { value: 'overview', label: '课程介绍', icon: BookOpen },
  { value: 'objectives', label: '学习目标', icon: Target },
  { value: 'lessons', label: '课时安排', icon: Presentation },
  { value: 'experiments', label: '配套实验', icon: FlaskConical },
  { value: 'showcase', label: '项目作品', icon: Trophy },
  { value: 'alignment', label: '课标对标', icon: ShieldCheck },
];

export default function VisionCoursePage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedLessonId, setExpandedLessonId] = useState<string | null>(null);
  const [slideIndex, setSlideIndex] = useState(0);

  const course = VISION_COURSE;

  const handleExpand = (lessonId: string) => {
    if (expandedLessonId === lessonId) {
      setExpandedLessonId(null);
    } else {
      setExpandedLessonId(lessonId);
      setSlideIndex(0);
    }
  };

  const handleToolJump = (type: string, targetTab: string) => {
    switch (type) {
      case 'ai-lab':
        navigate(targetTab ? `/ai-lab#${targetTab}` : '/ai-lab');
        toast.success('正在跳转至AI实验室…');
        break;
      case 'coding-lab':
        navigate('/coding-lab');
        toast.success('正在跳转至编程实验室…');
        break;
      case 'hardware':
        navigate('/hardware');
        toast.success('正在跳转至硬件生态页…');
        break;
      case 'subject-tools':
        navigate('/tools');
        toast.success('正在跳转至学科工具…');
        break;
      case 'ai-tool':
        navigate(targetTab ? `/ai-tools#${targetTab}` : '/ai-tools');
        toast.success('正在跳转至AI工具…');
        break;
      default:
        break;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section
        className={`w-full bg-gradient-to-br ${course.colorFrom} ${course.colorTo} text-white relative overflow-hidden`}
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
            <span className="text-white/90 truncate max-w-[200px]">{course.title}</span>
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
                <CameraIcon className="size-8 md:size-10 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap gap-2 mb-2">
                  <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                    {course.courseType}
                  </Badge>
                  <Badge className="bg-gradient-to-r from-emerald-400 to-teal-400 text-white border-0 backdrop-blur-sm shadow-sm">
                    完整课程 · {course.totalLessons}课时
                  </Badge>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-1">
                  {course.title}
                </h1>
                <p className="text-lg md:text-xl text-white/80 font-medium">{course.subtitle}</p>
              </div>
            </div>

            {/* 课程数据 */}
            <div className="flex flex-wrap gap-4 pt-2">
              <div className="flex items-center gap-2">
                <div className="size-8 rounded-lg bg-white/20 flex items-center justify-center">
                  <Clock className="size-4" />
                </div>
                <div>
                  <div className="text-lg font-bold">{course.totalHours}</div>
                  <div className="text-[11px] text-white/70">课时</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="size-8 rounded-lg bg-white/20 flex items-center justify-center">
                  <BookOpen className="size-4" />
                </div>
                <div>
                  <div className="text-lg font-bold">{course.totalLessons}</div>
                  <div className="text-[11px] text-white/70">课节</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="size-8 rounded-lg bg-white/20 flex items-center justify-center">
                  <Users className="size-4" />
                </div>
                <div>
                  <div className="text-lg font-bold">{course.stageLabel}</div>
                  <div className="text-[11px] text-white/70">{course.gradeRange}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="size-8 rounded-lg bg-white/20 flex items-center justify-center">
                  <Cpu className="size-4" />
                </div>
                <div>
                  <div className="text-lg font-bold">AI视觉传感器</div>
                  <div className="text-[11px] text-white/70">核心硬件</div>
                </div>
              </div>
            </div>

            {/* 标签 */}
            <div className="flex flex-wrap gap-2 pt-2">
              {course.courseTags.map((tag) => (
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
        <div className="space-y-2 mb-6">
          <div className="flex flex-wrap gap-2 overflow-x-auto">
            {TAB_ITEMS.map((tab) => {
              const TabIcon = tab.icon;
              const isActive = activeTab === tab.value;
              return (
                <button
                  key={tab.value}
                  onClick={() => setActiveTab(tab.value)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-primary text-white shadow-md'
                      : 'bg-card text-muted-foreground hover:bg-accent hover:text-foreground border border-border/50'
                  }`}
                >
                  <TabIcon className="size-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 课程介绍 */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <Card className="border-primary/20 bg-gradient-to-r from-primary/[0.04] to-blue-500/[0.04]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Lightbulb className="size-5 text-primary" />
                  课程简介
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground leading-relaxed">{course.description}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <BookOpen className="size-5 text-primary" />
                  课程背景
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground leading-relaxed">
                {course.background}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Presentation className="size-5 text-primary" />
                  课程大纲
                </CardTitle>
                <CardDescription>共 {course.totalLessons} 课时，循序渐进掌握机器视觉</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {course.lessons.map((lesson, i) => (
                    <div
                      key={lesson.id}
                      className="flex items-start gap-3 p-3 rounded-lg border border-border/50 hover:border-primary/30 hover:bg-accent/20 transition-all cursor-pointer"
                      onClick={() => {
                        setActiveTab('lessons');
                        setExpandedLessonId(lesson.id);
                        setSlideIndex(0);
                        setTimeout(() => {
                          const el = document.getElementById(`vision-lesson-${lesson.id}`);
                          el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }, 100);
                      }}
                    >
                      <div
                        className={`size-8 rounded-md bg-gradient-to-br ${course.colorFrom} ${course.colorTo} text-white flex items-center justify-center text-sm font-bold shrink-0`}
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
        )}

        {/* 学习目标 */}
        {activeTab === 'objectives' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="size-5 text-primary" />
                学习目标
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                { title: '知识目标', items: course.objectives.knowledge, color: 'text-blue-500 bg-blue-500/10' },
                { title: '能力目标', items: course.objectives.ability, color: 'text-emerald-500 bg-emerald-500/10' },
                { title: '素养目标', items: course.objectives.literacy, color: 'text-purple-500 bg-purple-500/10' },
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
        )}

        {/* 课时安排 */}
        {activeTab === 'lessons' && (
          <div id="lessons-section" className="space-y-4">
            {course.lessons.map((lesson, i) => {
              const isExpanded = expandedLessonId === lesson.id;
              return (
                <motion.div
                  key={lesson.id}
                  id={`vision-lesson-${lesson.id}`}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                >
                  <Card className="overflow-hidden group hover:shadow-md transition-all border-border/60">
                    <div className={`h-1 w-full bg-gradient-to-r ${course.colorFrom} ${course.colorTo}`} />
                    <CardContent className="p-5">
                      <div
                        className="flex items-start gap-4 cursor-pointer"
                        onClick={() => handleExpand(lesson.id)}
                      >
                        <div
                          className={`size-12 rounded-xl bg-gradient-to-br ${course.colorFrom} ${course.colorTo} text-white flex items-center justify-center text-lg font-bold shrink-0 shadow-md`}
                        >
                          {lesson.lessonIndex}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <h3 className="font-bold text-base">{lesson.title}</h3>
                            <Badge variant="outline" className="text-[10px] font-normal h-5">
                              {lesson.duration}分钟
                            </Badge>
                            <Badge className="text-[10px] font-normal h-5 bg-primary/10 text-primary border-primary/20">
                              完整课件
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">
                            {lesson.description}
                          </p>
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
                        </div>
                        <Button size="sm" variant="outline" className="shrink-0">
                          {isExpanded ? '收起' : '查看课件'}
                          {isExpanded ? (
                            <ChevronRight className="size-3.5 ml-1 rotate-90" />
                          ) : (
                            <ChevronRight className="size-3.5 ml-1" />
                          )}
                        </Button>
                      </div>

                      <AnimatePresence>
                        {isExpanded && (
                          <CoursewareViewer
                            lesson={lesson}
                            slideIndex={slideIndex}
                            setSlideIndex={setSlideIndex}
                            onToolJump={handleToolJump}
                            colorFrom={course.colorFrom}
                            colorTo={course.colorTo}
                          />
                        )}
                      </AnimatePresence>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* 配套实验 */}
        {activeTab === 'experiments' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FlaskConical className="size-5 text-primary" />
                  AI实验室
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {['图像分类实验', 'AI数字识别', '情感分析实验', '词云实验'].map((name, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl border border-border/60 hover:border-primary/30 hover:bg-accent/20 transition-all cursor-pointer group"
                    onClick={() => handleToolJump('ai-lab', '')}
                  >
                    <div className="flex items-center gap-3">
                      <div className="size-9 rounded-lg bg-gradient-to-br from-primary/15 to-purple-500/15 flex items-center justify-center shrink-0">
                        <FlaskConical className="size-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm flex items-center gap-1">
                          {name}
                          <ExternalLink className="size-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Cpu className="size-5 text-primary" />
                  编程实验室
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {['物体追踪项目', '扫码识别项目', '颜色分拣项目', '巡线机器人项目', '综合创意项目'].map((name, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl border border-border/60 hover:border-primary/30 hover:bg-accent/20 transition-all cursor-pointer group"
                    onClick={() => handleToolJump('coding-lab', '')}
                  >
                    <div className="flex items-center gap-3">
                      <div className="size-9 rounded-lg bg-gradient-to-br from-emerald-500/15 to-teal-500/15 flex items-center justify-center shrink-0">
                        <Cpu className="size-4 text-emerald-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm flex items-center gap-1">
                          {name}
                          <ExternalLink className="size-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Wrench className="size-5 text-primary" />
                  学科工具
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {['Mind+在线版', 'Python编程工具', '数据可视化工具'].map((name, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl border border-border/60 hover:border-primary/30 hover:bg-accent/20 transition-all cursor-pointer group"
                    onClick={() => handleToolJump('subject-tools', '')}
                  >
                    <div className="flex items-center gap-3">
                      <div className="size-9 rounded-lg bg-gradient-to-br from-amber-500/15 to-orange-500/15 flex items-center justify-center shrink-0">
                        <Wrench className="size-4 text-amber-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm flex items-center gap-1">
                          {name}
                          <ExternalLink className="size-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Sparkles className="size-5 text-primary" />
                  AI工具
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {['AI备课助手', 'AI实验/代码生成', 'AI通识问答'].map((name, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl border border-border/60 hover:border-primary/30 hover:bg-accent/20 transition-all cursor-pointer group"
                    onClick={() => handleToolJump('ai-tool', '')}
                  >
                    <div className="flex items-center gap-3">
                      <div className="size-9 rounded-lg bg-gradient-to-br from-purple-500/15 to-pink-500/15 flex items-center justify-center shrink-0">
                        <Sparkles className="size-4 text-purple-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm flex items-center gap-1">
                          {name}
                          <ExternalLink className="size-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}

        {/* 项目作品 */}
        {activeTab === 'showcase' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="size-5 text-primary" />
                项目作品展示
              </CardTitle>
              <CardDescription>
                学生们用AI视觉传感器创作的精彩项目
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { name: '智能门禁系统', author: '五年级 李明组', desc: '人脸识别开门，陌生人报警' },
                  { name: '颜色分拣机器人', author: '六年级 王芳组', desc: '自动识别颜色，分装入盒' },
                  { name: '巡线送餐小车', author: '初中 张伟组', desc: '沿黑线送餐，避障停止' },
                  { name: '手势控制灯', author: '五年级 陈静组', desc: '不同手势控制不同灯光' },
                  { name: '扫码签到系统', author: '初中 刘洋组', desc: '扫二维码自动记录签到' },
                  { name: '智能分类垃圾桶', author: '六年级 赵磊组', desc: '颜色+形状识别自动分桶' },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl border border-border/60 hover:border-primary/30 hover:bg-accent/20 transition-all cursor-pointer group"
                  >
                    <div className="aspect-video rounded-lg bg-gradient-to-br from-primary/10 to-blue-500/10 mb-3 flex items-center justify-center">
                      <CameraIcon className="size-8 text-primary/40" />
                    </div>
                    <div className="font-medium text-sm">{item.name}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{item.author}</div>
                    <div className="text-xs text-muted-foreground mt-1">{item.desc}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* 课标对标 */}
        {activeTab === 'alignment' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="size-5 text-primary" />
                课标对标
              </CardTitle>
              <CardDescription>
                对标《中小学人工智能通识教育指南(2025年版)》与《安徽省中小学人工智能通识教育课程纲要》
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                '了解人工智能的基本概念、发展历程和典型应用，感知人工智能对社会生活的影响',
                '认识计算机视觉是人工智能的重要研究方向，了解其基本原理和应用场景',
                '通过操作AI视觉传感器，体验图像识别、人脸识别等AI功能，培养动手实践能力',
                '了解人工智能相关的伦理与安全问题，树立负责任的AI使用意识',
                '培养计算思维、创新思维和团队协作能力，提高信息科技核心素养',
                '形成对人工智能的正确认知，激发对AI技术的兴趣和探究欲望',
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-4 rounded-xl border border-border/50"
                >
                  <BadgeCheck className="size-5 text-primary shrink-0 mt-0.5" />
                  <p className="text-foreground leading-relaxed">{item}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

interface CoursewareViewerProps {
  lesson: IVisionLesson;
  slideIndex: number;
  setSlideIndex: (i: number) => void;
  onToolJump: (type: string, targetTab: string) => void;
  colorFrom: string;
  colorTo: string;
}

function CoursewareViewer({
  lesson,
  slideIndex,
  setSlideIndex,
  onToolJump,
  colorFrom,
  colorTo,
}: CoursewareViewerProps) {
  const slides = lesson.slides;
  const currentSlide = slides[slideIndex];
  const totalSlides = slides.length;
  const isFirst = slideIndex === 0;
  const isLast = slideIndex === totalSlides - 1;

  const slideTypeLabel: Record<string, string> = {
    cover: '封面',
    knowledge: '知识点',
    activity: '活动探究',
    case: '案例分析',
    summary: '小结',
  };

  const typeIconMap: Record<string, typeof Zap> = {
    cover: Sparkles,
    knowledge: Zap,
    activity: Lightbulb,
    case: Trophy,
    summary: ClipboardList,
  };
  const TypeIcon = typeIconMap[currentSlide.type] || Zap;

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="pt-4 mt-4 border-t border-border/50"
    >
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
              <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm text-xs flex items-center gap-1">
                <TypeIcon className="size-3" />
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
                  {currentSlide.subtitle && (
                    <p className="text-white/70 text-sm mb-3">{currentSlide.subtitle}</p>
                  )}
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
        {lesson.experiments && lesson.experiments.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Beaker className="size-4 text-primary" />
              配套实验与工具
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {lesson.experiments.map((exp, i) => {
                const iconMap: Record<string, typeof FlaskConical> = {
                  'ai-lab': FlaskConical,
                  'coding-lab': Cpu,
                  hardware: Cpu,
                  'subject-tools': Wrench,
                  'ai-tool': Sparkles,
                };
                const ExpIcon = iconMap[exp.type] || FlaskConical;
                const colorMap: Record<string, string> = {
                  'ai-lab': 'from-primary/15 to-purple-500/15',
                  'coding-lab': 'from-emerald-500/15 to-teal-500/15',
                  hardware: 'from-blue-500/15 to-cyan-500/15',
                  'subject-tools': 'from-amber-500/15 to-orange-500/15',
                  'ai-tool': 'from-purple-500/15 to-pink-500/15',
                };
                const textColorMap: Record<string, string> = {
                  'ai-lab': 'text-primary',
                  'coding-lab': 'text-emerald-600',
                  hardware: 'text-blue-600',
                  'subject-tools': 'text-amber-600',
                  'ai-tool': 'text-purple-600',
                };
                return (
                  <div
                    key={i}
                    className="p-3 rounded-xl border border-border/60 bg-card hover:border-primary/30 hover:bg-accent/20 transition-all cursor-pointer group"
                    onClick={() => onToolJump(exp.type, exp.targetTab || '')}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`size-9 rounded-lg bg-gradient-to-br ${colorMap[exp.type] || colorMap['ai-lab']} flex items-center justify-center shrink-0`}
                      >
                        <ExpIcon className={`size-4 ${textColorMap[exp.type] || 'text-primary'}`} />
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
                );
              })}
            </div>
          </div>
        )}

        {/* 课标对标 */}
        {lesson.standardPoints && lesson.standardPoints.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <GraduationCap className="size-4 text-primary" />
              本课课标对标
            </h4>
            <div className="p-4 rounded-xl bg-gradient-to-r from-primary/[0.04] to-blue-500/[0.04] border border-primary/10">
              <ul className="space-y-2">
                {lesson.standardPoints.map((sp, i) => (
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

import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  PlayCircle,
  BookOpen,
  FlaskConical,
  Cpu,
  Sparkles,
  ChevronRight,
  Users,
  Clock,
  CheckCircle2,
  Circle,
  Code2,
  GraduationCap,
  Zap,
  Bot,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import StartClassDialog from '@/components/StartClassDialog';
import { MOCK_CLASSES } from '@/data/school-classes';
import { MOCK_COURSE_SUMMARY, type ICourseSummary } from '@/data/course-summary';
import Image from '@/components/ui/image';
import { toast } from 'sonner';
import { useTeacherAuth } from '@/context/TeacherAuthContext';
import {
  SelectGroup,
  SelectLabel,
} from '@/components/ui/select';

// ====== 5个大入口卡片配置 ======
const ENTRY_CARDS = [
  {
    id: 'start-class',
    title: '去上课',
    subtitle: '叮铃铃，上课啦~',
    icon: PlayCircle,
    gradient: 'from-orange-400 to-red-500',
    bgGlow: 'bg-orange-500/20',
    action: 'dialog',
  },
  {
    id: 'prepare',
    title: '去备课',
    subtitle: '课前准备，资源齐备',
    icon: BookOpen,
    gradient: 'from-blue-500 to-cyan-500',
    bgGlow: 'bg-blue-500/20',
    action: 'navigate',
    path: '/prepare',
  },
  {
    id: 'class-mgmt',
    title: '班级管理',
    subtitle: '多班管理，轻松切换',
    icon: GraduationCap,
    gradient: 'from-emerald-500 to-teal-600',
    bgGlow: 'bg-emerald-500/20',
    action: 'navigate',
    path: '/class',
  },
  {
    id: 'ai-lab',
    title: 'AI实验室',
    subtitle: '23个AI实验，即开即用',
    icon: FlaskConical,
    gradient: 'from-violet-500 to-purple-600',
    bgGlow: 'bg-violet-500/20',
    action: 'navigate',
    path: '/ai-lab',
  },
  {
    id: 'ai-assistant',
    title: 'AI助手',
    subtitle: 'AI赋能教学',
    icon: Bot,
    gradient: 'from-indigo-500 to-purple-500',
    bgGlow: 'bg-indigo-500/20',
    action: 'float',
  },
];

// ====== 课时数据 ======
interface LessonItem {
  id: string;
  index: number;
  title: string;
  status: 'completed' | 'current' | 'upcoming';
  time?: string;
  duration: number;
}

// ====== 编程工具 ======
const CODE_TOOLS = [
  { id: 'scratch', name: 'Scratch', icon: Code2, color: 'from-orange-400 to-amber-500', path: '/coding-lab' },
  { id: 'mind+', name: 'Mind+', icon: Zap, color: 'from-blue-500 to-cyan-500', path: '/coding-lab' },
  { id: 'arduino', name: 'Arduino', icon: Cpu, color: 'from-emerald-500 to-teal-500', path: '/coding-lab' },
  { id: 'mpython', name: 'mPython', icon: Code2, color: 'from-violet-500 to-purple-500', path: '/coding-lab' },
];

// ====== 硬件连接 ======
const HARDWARE_TOOLS = [
  { id: 'hangkong', name: '行空板K10', icon: Cpu, color: 'from-blue-500 to-indigo-500', path: '/hardware/connect' },
  { id: 'zhangkong', name: '掌控板', icon: Zap, color: 'from-orange-500 to-red-500', path: '/hardware/connect' },
  { id: 'zhixiang-box', name: '智象实验盒', icon: FlaskConical, color: 'from-emerald-500 to-teal-500', path: '/hardware/connect' },
  { id: 'microbit', name: 'micro:bit', icon: Code2, color: 'from-purple-500 to-pink-500', path: '/hardware/connect' },
];

export default function HomePage() {
  const navigate = useNavigate();
  const { profile } = useTeacherAuth();
  const [startClassOpen, setStartClassOpen] = useState(false);

  // 默认选中七年级(1)班
  const [selectedClassId, setSelectedClassId] = useState<string>('class-g7-1');
  const selectedClass = MOCK_CLASSES.find((c) => c.id === selectedClassId);

  // 根据班级学段匹配课程
  const classCourses = useMemo(() => {
    if (!selectedClass) return MOCK_COURSE_SUMMARY.slice(0, 2);
    const stageMap: Record<string, string> = {
      '小学低段': 'primary-low',
      '小学高段': 'primary-high',
      '初中': 'junior',
      '高中': 'senior',
    };
    const stageKey = stageMap[selectedClass.stage] || '';
    const matched = MOCK_COURSE_SUMMARY.filter((c) => c.stage === stageKey);
    return matched.length > 0 ? matched : MOCK_COURSE_SUMMARY.slice(0, 2);
  }, [selectedClass]);

  // 默认选中第一个课程
  const [selectedCourseId, setSelectedCourseId] = useState<string>(classCourses[0]?.id || '');
  const selectedCourse = classCourses.find((c) => c.id === selectedCourseId) || classCourses[0];

  // 生成课程的课时列表
  const lessons = useMemo<LessonItem[]>(() => {
    if (!selectedCourse) return [];
    const total = selectedCourse.totalLessons;
    const completed = selectedCourse.completedLessons ?? 0;
    const lessonTitles = [
      '身边的智能小伙伴',
      '数据小侦探',
      '声音的秘密',
      '智能小管家',
      '算法初体验',
      '机器视觉入门',
      '语音识别实验',
      'AI创意项目',
    ];
    return Array.from({ length: Math.min(total, 5) }).map((_, i) => {
      const idx = i + 1;
      const isCompleted = idx <= completed;
      const isCurrent = idx === completed + 1;
      return {
        id: `lesson-${idx}`,
        index: idx,
        title: lessonTitles[i] || `第${idx}课 探索AI`,
        status: isCompleted ? 'completed' : isCurrent ? 'current' : 'upcoming',
        time: isCompleted ? `9月${5 + i}日 10:00` : undefined,
        duration: 40,
      };
    });
  }, [selectedCourse]);

  // 处理入口卡片点击
  function handleEntryClick(action: string, path?: string) {
    if (action === 'dialog') {
      setStartClassOpen(true);
    } else if (action === 'navigate' && path) {
      navigate(path);
    } else if (action === 'float') {
    }
  }

  // 开始上课
  function handleStartLesson(lessonId: string) {
    if (selectedCourse) {
      navigate(`/teach/${selectedCourse.id}`);
      toast.success('即将进入课堂');
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8 space-y-6 md:space-y-8">
        {/* ====== 第一行：5个大入口卡片 ====== */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4"
        >
          {ENTRY_CARDS.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.button
                key={card.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                onClick={() => handleEntryClick(card.action, card.path)}
                className={`relative group rounded-2xl bg-gradient-to-br ${card.gradient} p-4 md:p-5 text-white text-left overflow-hidden shadow-md hover:shadow-xl transition-shadow`}
              >
                {/* 背景装饰光斑 */}
                <div className={`absolute -top-6 -right-6 w-20 h-20 ${card.bgGlow} rounded-full blur-xl`} />
                <div className="relative z-10">
                  <Icon className="size-7 md:size-8 mb-3 opacity-95" strokeWidth={2} />
                  <h3 className="text-lg md:text-xl font-bold mb-1">{card.title}</h3>
                  <p className="text-xs md:text-sm text-white/80">{card.subtitle}</p>
                </div>
                <ChevronRight className="absolute bottom-3 right-3 size-4 text-white/50 group-hover:translate-x-0.5 transition-transform" />
              </motion.button>
            );
          })}
        </motion.div>

        {/* ====== 第二行：授课记录区（核心区域） ====== */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="border border-border/60 shadow-sm overflow-hidden">
            <CardContent className="p-0">
              <div className="flex flex-col lg:flex-row min-h-[480px]">
                {/* 左侧：班级 + 课程信息（约25%） */}
                <div className="lg:w-1/4 border-b lg:border-b-0 lg:border-r border-border/60 bg-gradient-to-b from-primary/5 to-transparent p-5 space-y-5">
                  {/* 班级选择（更醒目，最近使用置顶） */}
                  <div>
                    <label className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                      <GraduationCap className="size-4 text-emerald-600" />
                      授课班级
                    </label>
                    <Select value={selectedClassId} onValueChange={setSelectedClassId}>
                      <SelectTrigger className="h-12 text-base font-semibold border-2 border-emerald-500/30 bg-emerald-50/50 hover:bg-emerald-50 hover:border-emerald-500/50 transition-colors">
                        <SelectValue placeholder="选择班级" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel className="text-[10px] font-semibold text-emerald-600 uppercase tracking-wider">
                            最近使用
                          </SelectLabel>
                          {MOCK_CLASSES.slice(0, 2).map((c) => (
                            <SelectItem key={`recent-${c.id}`} value={c.id} className="text-sm">
                              <span className="flex items-center justify-between w-full gap-4">
                                <span className="font-medium">{c.name}</span>
                                <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                                  最近
                                </span>
                              </span>
                            </SelectItem>
                          ))}
                        </SelectGroup>
                        <SelectGroup>
                          <SelectLabel className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                            全部班级
                          </SelectLabel>
                          {MOCK_CLASSES.map((c) => (
                            <SelectItem key={c.id} value={c.id} className="text-sm">
                              <span className="flex items-center justify-between w-full gap-4">
                                <span>{c.name}</span>
                                <span className="text-[10px] text-muted-foreground">
                                  {c.stage} · {c.studentCount}人
                                </span>
                              </span>
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {selectedClass && (
                      <p className="text-xs text-muted-foreground mt-1.5">
                        {selectedClass.grade} · {selectedClass.studentCount}名学生 · {selectedClass.classroom}
                      </p>
                    )}
                  </div>

                  {/* 课程选择下拉 */}
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                      当前课程
                    </label>
                    <Select
                      value={selectedCourseId}
                      onValueChange={setSelectedCourseId}
                    >
                      <SelectTrigger className="h-9 text-sm">
                        <SelectValue placeholder="选择课程" />
                      </SelectTrigger>
                      <SelectContent>
                        {classCourses.map((c) => (
                          <SelectItem key={c.id} value={c.id} className="text-sm">
                            {c.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* 课程封面图 + 信息 */}
                  {selectedCourse && (
                    <div className="rounded-xl overflow-hidden border border-border/60 bg-card">
                      <div className="aspect-video bg-muted relative">
                        <Image
                          src={selectedCourse.coverImage}
                          alt={selectedCourse.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                        <div className="absolute bottom-2 left-2 right-2">
                          <p className="text-white text-sm font-semibold line-clamp-1">
                            {selectedCourse.title}
                          </p>
                        </div>
                      </div>
                      <div className="p-3 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground flex items-center gap-1">
                            <Clock className="size-3" />
                            {selectedCourse.totalLessons} 课时
                          </span>
                          <Badge variant="outline" className="text-[10px]">
                            {selectedCourse.difficulty}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 学生快捷登录按钮 */}
                  <Button
                    variant="default"
                    className="w-full h-10 text-sm"
                    onClick={() => toast.info('学生登录二维码已生成')}
                  >
                    <Users className="size-4 mr-2" />
                    学生快捷登录
                  </Button>
                </div>

                {/* 右侧：课时列表（约75%） */}
                <div className="lg:w-3/4 p-5 md:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                      <BookOpen className="size-5 text-primary" />
                      课时列表
                    </h3>
                    <Badge variant="outline" className="text-xs">
                      共 {selectedCourse?.totalLessons || 0} 课时
                    </Badge>
                  </div>

                  <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                    {lessons.map((lesson, i) => (
                      <motion.div
                        key={lesson.id}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.15 + i * 0.05 }}
                        className={`relative rounded-xl border p-4 md:p-5 transition-all overflow-hidden ${
                          lesson.status === 'completed'
                            ? 'bg-muted/30 border-border/40'
                            : lesson.status === 'current'
                              ? 'bg-gradient-to-r from-primary/5 via-primary/3 to-transparent border-primary/30 shadow-sm'
                              : 'bg-card border-border/60 hover:border-primary/20 hover:bg-primary/[0.02]'
                        }`}
                      >
                        {/* 装饰：智象风格小插画元素 */}
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none">
                          <Sparkles className="size-24" />
                        </div>

                        <div className="flex items-center gap-4 relative z-10">
                          {/* 左侧：序号 + 标题 */}
                          <div className="flex items-start gap-3 flex-1 min-w-0">
                            {/* 序号圆环 */}
                            <div
                              className={`size-10 shrink-0 rounded-full flex items-center justify-center text-sm font-bold ${
                                lesson.status === 'completed'
                                  ? 'bg-emerald-100 text-emerald-600'
                                  : lesson.status === 'current'
                                    ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
                                    : 'bg-muted text-muted-foreground'
                              }`}
                            >
                              {lesson.status === 'completed' ? (
                                <CheckCircle2 className="size-5" />
                              ) : (
                                <span>{lesson.index}</span>
                              )}
                            </div>

                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm md:text-base font-medium text-foreground line-clamp-1">
                                课时 {lesson.index}  {lesson.title}
                              </h4>
                              <div className="flex items-center gap-2 mt-1">
                                {lesson.status === 'completed' && (
                                  <>
                                    <Badge
                                      variant="outline"
                                      className="text-[10px] bg-emerald-50 text-emerald-600 border-emerald-200"
                                    >
                                      已完成
                                    </Badge>
                                    <span className="text-[11px] text-muted-foreground">
                                      {lesson.time}
                                    </span>
                                  </>
                                )}
                                {lesson.status === 'current' && (
                                  <Badge
                                    variant="outline"
                                    className="text-[10px] bg-amber-50 text-amber-600 border-amber-200"
                                  >
                                    未开始 · 下一节
                                  </Badge>
                                )}
                                {lesson.status === 'upcoming' && (
                                  <Badge
                                    variant="outline"
                                    className="text-[10px] text-muted-foreground"
                                  >
                                    未开始
                                  </Badge>
                                )}
                                <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                                  <Clock className="size-3" />
                                  {lesson.duration} 分钟
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* 右侧：操作按钮 */}
                          <div className="shrink-0">
                            {lesson.status === 'current' && (
                              <Button
                                size="sm"
                                className="h-9 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-md shadow-primary/20"
                                onClick={() => handleStartLesson(lesson.id)}
                              >
                                <PlayCircle className="size-4 mr-1.5" />
                                开始上课
                              </Button>
                            )}
                            {lesson.status === 'completed' && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-9 text-xs"
                                onClick={() => navigate(`/teach/${selectedCourse?.id}`)}
                              >
                                复习
                                <ChevronRight className="size-3 ml-1" />
                              </Button>
                            )}
                            {lesson.status === 'upcoming' && (
                              <Circle className="size-3 text-muted-foreground/30" />
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* 查看全部课时 */}
                  {(selectedCourse?.totalLessons ?? 0) > 5 && (
                    <div className="mt-4 pt-3 border-t border-border/40">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full h-8 text-xs text-muted-foreground hover:text-foreground"
                        onClick={() =>
                          selectedCourse && navigate(`/courses/${selectedCourse.id}`)
                        }
                      >
                        查看全部 {selectedCourse?.totalLessons} 课时
                        <ChevronRight className="size-3 ml-0.5" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* ====== 第三行：底部两栏 ====== */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* 左栏：编程工具 */}
          <Card className="border border-border/60 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
                  <Code2 className="size-4 text-primary" />
                  编程工具
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-muted-foreground hover:text-foreground h-7"
                  onClick={() => navigate('/tools')}
                >
                  查看更多
                  <ChevronRight className="size-3 ml-0.5" />
                </Button>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {CODE_TOOLS.map((tool) => {
                  const Icon = tool.icon;
                  return (
                    <button
                      key={tool.id}
                 onClick={() => navigate(tool.path)}
                      className="group flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-muted/50 transition-colors"
                    >
                      <div
                        className={`size-12 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center text-white shadow-sm group-hover:scale-110 transition-transform`}
                      >
                        <Icon className="size-6" />
                      </div>
                      <span className="text-xs text-foreground font-medium">{tool.name}</span>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* 右栏：硬件连接 */}
          <Card className="border border-border/60 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
                  <Cpu className="size-4 text-primary" />
                  硬件连接
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-muted-foreground hover:text-foreground h-7"
                  onClick={() => navigate('/hardware/connect')}
                >
                  查看更多
                  <ChevronRight className="size-3 ml-0.5" />
                </Button>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {HARDWARE_TOOLS.map((hw) => {
                  const Icon = hw.icon;
                  return (
                    <button
                      key={hw.id}
                      onClick={() => navigate(hw.path)}
                      className="group flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-muted/50 transition-colors"
                    >
                      <div
                        className={`size-12 rounded-xl bg-gradient-to-br ${hw.color} flex items-center justify-center text-white shadow-sm group-hover:scale-110 transition-transform`}
                      >
                        <Icon className="size-6" />
                      </div>
                      <span className="text-xs text-foreground font-medium text-center leading-tight">{hw.name}</span>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>

      {/* 开课设置弹窗 */}
      <StartClassDialog open={startClassOpen} onOpenChange={setStartClassOpen} />
    </div>
  );
}

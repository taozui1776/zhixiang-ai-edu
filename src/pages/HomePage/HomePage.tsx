import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Play,
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
          <Card className="border border-slate-200 shadow-sm overflow-hidden">
            <CardContent className="p-0">
              <div className="flex flex-col lg:flex-row min-h-[480px]">
                {/* 左侧：上课准备区（约30%） */}
                <div className="lg:w-[30%] border-b lg:border-b-0 lg:border-r border-slate-200 p-5 flex flex-col"
                  style={{ background: 'linear-gradient(180deg, #f8f7ff 0%, #ffffff 100%)' }}>
                  
                  {/* 今日课程卡片 */}
                  <div className="mb-4 rounded-xl p-4 text-white relative overflow-hidden"
                    style={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)' }}>
                    <div className="absolute -right-4 -top-4 w-20 h-20 rounded-full bg-white/10" />
                    <div className="absolute -right-8 -bottom-8 w-24 h-24 rounded-full bg-white/5" />
                    
                    <div className="relative z-10">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                        <span className="text-xs opacity-80">今日课程</span>
                      </div>
                      <div className="text-lg font-bold mb-1">{selectedCourse?.title || '机器视觉应用'}</div>
                      <div className="flex items-center gap-2 text-xs opacity-90 flex-wrap">
                        <span>{selectedClass?.name || '七年级(1)班'}</span>
                        <span className="w-1 h-1 rounded-full bg-white/50" />
                        <span>第3节</span>
                        <span className="w-1 h-1 rounded-full bg-white/50" />
                        <span>10:00-10:45</span>
                      </div>
                    </div>
                  </div>

                  {/* 上课配置 */}
                  <div className="space-y-3 flex-1">
                    <div>
                      <label className="text-xs font-medium text-slate-500 mb-1 block">授课班级</label>
                      <Select value={selectedClassId} onValueChange={setSelectedClassId}>
                        <SelectTrigger className="h-9 text-sm border border-slate-200 bg-white hover:border-violet-300 transition-colors">
                          <SelectValue placeholder="选择班级" />
                        </SelectTrigger>
                        <SelectContent>
                          {MOCK_CLASSES.map((c) => (
                            <SelectItem key={c.id} value={c.id} className="text-sm">
                              <span className="flex items-center justify-between w-full gap-4">
                                <span>{c.name}</span>
                                <span className="text-[10px] text-slate-400">{c.stage} · {c.studentCount}人</span>
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-slate-500 mb-1 block">授课课程</label>
                      <Select value={selectedCourseId} onValueChange={setSelectedCourseId}>
                        <SelectTrigger className="h-9 text-sm border border-slate-200 bg-white hover:border-violet-300 transition-colors">
                          <SelectValue placeholder="选择课程" />
                        </SelectTrigger>
                        <SelectContent>
                          {classCourses.map((c) => (
                            <SelectItem key={c.id} value={c.id} className="text-sm">{c.title}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {selectedCourse && (
                      <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
                        <span className="flex items-center gap-1">
                          <Clock className="size-3" /> {selectedCourse.totalLessons}课时
                        </span>
                        <span className="flex items-center gap-1">
                          <BookOpen className="size-3" /> {selectedCourse.difficulty}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* 开始上课按钮 */}
                  <Button
                    size="lg"
                    className="w-full h-11 text-sm font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all mt-4"
                    style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
                    onClick={() => selectedCourse && navigate(`/teach/${selectedCourse.id}`)}
                  >
                    <Play className="size-4 mr-2 fill-current" />
                    开始上课
                  </Button>
                </div>

                {/* 右侧：课时列表（约70%） */}
                <div className="lg:w-[70%] p-5 bg-white">
                  {/* 头部 + 进度条 */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                        <BookOpen className="size-5 text-violet-600" />
                        课时列表
                      </h3>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-slate-400">进度 1/8</span>
                        <Badge variant="outline" className="text-xs border-slate-200 text-slate-600">
                          共 {selectedCourse?.totalLessons || 0} 课时
                        </Badge>
                      </div>
                    </div>
                    {/* 进度条 */}
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-500"
                        style={{ width: '12.5%', background: 'linear-gradient(90deg, #6366f1, #8b5cf6)' }} />
                    </div>
                  </div>

                  {/* 课时列表 */}
                  <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
                    {lessons.map((lesson, i) => (
                      <motion.div
                        key={lesson.id}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 + i * 0.04 }}
                        onClick={() => selectedCourse && navigate(`/teach/${selectedCourse.id}`)}
                        className={`relative rounded-lg border p-3.5 transition-all cursor-pointer group ${
                          lesson.status === 'completed'
                            ? 'bg-slate-50/50 border-slate-100'
                            : lesson.status === 'current'
                              ? 'bg-gradient-to-r from-violet-50/80 to-white border-violet-200 shadow-sm'
                              : 'bg-white border-slate-100 hover:border-violet-200 hover:bg-violet-50/30'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {/* 序号 */}
                          <div className={`size-8 shrink-0 rounded-full flex items-center justify-center text-xs font-bold ${
                            lesson.status === 'completed'
                              ? 'bg-emerald-100 text-emerald-600'
                              : lesson.status === 'current'
                                ? 'bg-gradient-to-br from-violet-500 to-indigo-500 text-white shadow-sm'
                                : 'bg-slate-100 text-slate-400 group-hover:bg-violet-100 group-hover:text-violet-600 transition-colors'
                          }`}>
                            {lesson.status === 'completed' ? <CheckCircle2 className="size-4" /> : lesson.index}
                          </div>

                          {/* 内容 */}
                          <div className="flex-1 min-w-0">
                            <h4 className={`text-sm font-medium truncate ${
                              lesson.status === 'completed' ? 'text-slate-400' : 'text-slate-800'
                            }`}>
                              课时{lesson.index} · {lesson.title}
                            </h4>
                            <div className="flex items-center gap-2 mt-1">
                              {lesson.status === 'current' && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-50 text-amber-600 border border-amber-100 font-medium">
                                  下一节
                                </span>
                              )}
                              {lesson.status === 'completed' && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-600 border border-emerald-100">
                                  已完成
                                </span>
                              )}
                              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                                <Clock className="size-3" /> {lesson.duration || 40}分钟
                              </span>
                              <span className="text-[10px] text-slate-300 flex items-center gap-1 ml-1">
                                <span className="px-1 py-0.5 rounded bg-slate-50 border border-slate-100">课件</span>
                                <span className="px-1 py-0.5 rounded bg-slate-50 border border-slate-100">实验</span>
                              </span>
                            </div>
                          </div>

                          {/* 箭头 */}
                          <ChevronRight className={`size-4 shrink-0 transition-colors ${
                            lesson.status === 'current' ? 'text-violet-500' : 'text-slate-200 group-hover:text-violet-400'
                          }`} />
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* 查看全部 */}
                  <div className="mt-3 pt-3 border-t border-slate-100">
                    <button
                      onClick={() => selectedCourse && navigate(`/courses/${selectedCourse.id}`)}
                      className="text-xs text-violet-600 hover:text-violet-700 font-medium flex items-center gap-1 mx-auto"
                    >
                      查看全部 {selectedCourse?.totalLessons || 0} 课时
                      <ChevronRight className="size-3" />
                    </button>
                  </div>
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

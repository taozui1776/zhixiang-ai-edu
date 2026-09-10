import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getTeachHistory, type TeachRecord } from '../TeachModePage/tools';
import {
   User,
   School,
   GraduationCap,
   FolderOpen,
   Heart,
   Clock,
   BarChart3,
   BookOpen,
   FlaskConical,
   AlertTriangle,
   ChevronRight,
   LayoutDashboard,
   TrendingUp,
   Target,
   Zap,
   Trash2,
   PlayCircle,
   Database,
   ChevronDown,
   Calendar,
   Cpu,
   Code2,
   History,
   CalendarDays,
   Sparkles,
   Clock3,
   Users,
   Layers,
 } from 'lucide-react';
 import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
 import { Button } from '@/components/ui/button';
 import { Badge } from '@/components/ui/badge';
 import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
 import {
   Select,
   SelectTrigger,
   SelectValue,
   SelectContent,
   SelectItem,
 } from '@/components/ui/select';
import { useTeacherAuth } from '@/context/TeacherAuthContext';
import { useFavorites, usePrepareList } from '@/hooks/useTeacherData';
import { getAllLessons, type ILesson } from '@/data/courses';
import { MOCK_CLASSES } from '@/data/school-classes';
import { MOCK_TEACHING_RECORDS } from '@/data/dashboard';
import { useNavigate } from 'react-router-dom';
import Image from '@/components/ui/image';
import { toast } from 'sonner';

const MASCOT_IMG = 'https://aka.doubaocdn.com/s/FTGHri7UGK';

const STAGE_LABELS: Record<string, string> = {
  primary: '小学',
  junior: '初中',
  senior: '高中',
  all: '全学段',
};

const STAGE_COLORS: Record<string, string> = {
  primary: 'bg-emerald-500/15 text-emerald-700 border-emerald-500/20',
  junior: 'bg-sky-500/15 text-sky-700 border-sky-500/20',
  senior: 'bg-violet-500/15 text-violet-700 border-violet-500/20',
  all: 'bg-primary/15 text-primary border-primary/20',
};

// Mock 课堂记录数据
const MOCK_CLASS_RECORDS = [
  { id: 1, lessonId: 'primary-g3-u1-l1', lessonTitle: '身边的智能小伙伴', date: '2025-09-02', duration: 40, experiments: 2, stage: 'primary' },
  { id: 2, lessonId: 'primary-g3-u1-l2', lessonTitle: '智能音箱小助理', date: '2025-09-03', duration: 40, experiments: 1, stage: 'primary' },
  { id: 3, lessonId: 'junior-g7-u1-l1', lessonTitle: 'AI 绘画与创意表达', date: '2025-09-04', duration: 45, experiments: 1, stage: 'junior' },
  { id: 4, lessonId: 'primary-g4-u2-l2', lessonTitle: '数据采集小能手', date: '2025-08-28', duration: 40, experiments: 2, stage: 'primary' },
  { id: 5, lessonId: 'senior-g10-u1-l1', lessonTitle: '机器学习初体验', date: '2025-08-26', duration: 45, experiments: 1, stage: 'senior' },
];

// Mock 学情看板数据
const MOCK_LEARNING_STATS = {
  totalClasses: 128,
  avgParticipation: 89,
  experimentCompletion: 76,
  totalStudents: 156,
  weakPoints: [
    { name: '神经网络原理', weak: 35, total: 80 },
    { name: '数据标注规范', weak: 28, total: 72 },
    { name: '算法复杂度', weak: 25, total: 65 },
    { name: '伦理判断', weak: 15, total: 90 },
    { name: '传感器应用', weak: 20, total: 85 },
  ],
  weeklyTrend: [12, 15, 18, 14, 22, 19, 28], // 最近7天课时数
};

export default function TeacherCenterPage() {
  const { profile } = useTeacherAuth();
  const navigate = useNavigate();
  const { favoriteIds, toggleFavorite } = useFavorites(profile?.id);
  const { prepareIds, removeFromPrepare } = usePrepareList(profile?.id);
  const [activeTab, setActiveTab] = useState('dashboard');

  const [teachHistory, setTeachHistory] = useState<TeachRecord[]>([]);

  useEffect(() => {
    setTeachHistory(getTeachHistory().slice(0, 3));
    // 每 5 秒刷新一次（授课页面可能在写入）
    const timer = setInterval(() => {
      setTeachHistory(getTeachHistory().slice(0, 3));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const allLessons = useMemo(() => getAllLessons(), []);
  const favoriteLessons = useMemo(
    () => allLessons.filter((l) => favoriteIds.includes(l.id)),
    [allLessons, favoriteIds],
  );
  const prepareLessons = useMemo(
    () => allLessons.filter((l) => prepareIds.includes(l.id)),
    [allLessons, prepareIds],
  );

const stats = MOCK_LEARNING_STATS;

   // 班级选择状态
   const [selectedClassId, setSelectedClassId] = useState<string>('');

   // 班级对应课程 mock 数据
   const classCourses: Record<string, Array<{
     id: string;
     name: string;
     cover: string;
     totalLessons: number;
     completedLessons: number;
     difficulty: '入门' | '进阶' | '挑战';
     currentLesson: string;
     currentLessonIndex: number;
     courseId: string;
   }>> = {
     'class-g5-1': [
       { id: 'c1', name: 'AI 通识入门', cover: '', totalLessons: 16, completedLessons: 6, difficulty: '入门', currentLesson: '第7课 智能小管家', currentLessonIndex: 7, courseId: 'primary-g3-u1-l1' },
       { id: 'c2', name: '数据小侦探', cover: '', totalLessons: 12, completedLessons: 8, difficulty: '进阶', currentLesson: '第9课 数据可视化', currentLessonIndex: 9, courseId: 'primary-g4-u2-l2' },
       { id: 'c3', name: '声音的秘密', cover: '', totalLessons: 8, completedLessons: 3, difficulty: '入门', currentLesson: '第4课 语音识别小实验', currentLessonIndex: 4, courseId: 'primary-g5-u3-l3' },
       { id: 'c4', name: '机器人入门', cover: '', totalLessons: 10, completedLessons: 0, difficulty: '挑战', currentLesson: '第1课 认识机器人', currentLessonIndex: 1, courseId: 'junior-g8-u2-l2' },
     ],
     'class-g4-1': [
       { id: 'c1', name: 'AI 通识入门', cover: '', totalLessons: 16, completedLessons: 4, difficulty: '入门', currentLesson: '第5课 身边的智能小伙伴', currentLessonIndex: 5, courseId: 'primary-g3-u1-l1' },
       { id: 'c2', name: '数据小侦探', cover: '', totalLessons: 12, completedLessons: 2, difficulty: '进阶', currentLesson: '第3课 数据采集', currentLessonIndex: 3, courseId: 'primary-g4-u2-l2' },
     ],
     'class-g7-1': [
       { id: 'c1', name: '机器视觉应用', cover: '', totalLessons: 14, completedLessons: 5, difficulty: '进阶', currentLesson: '第6课 图像风格迁移', currentLessonIndex: 6, courseId: 'junior-g7-u1-l1' },
       { id: 'c2', name: '机器人入门', cover: '', totalLessons: 10, completedLessons: 3, difficulty: '进阶', currentLesson: '第4课 传感器与智能小车', currentLessonIndex: 4, courseId: 'junior-g8-u2-l2' },
       { id: 'c3', name: 'AI 与创意', cover: '', totalLessons: 8, completedLessons: 7, difficulty: '入门', currentLesson: '第8课 AI 创作展', currentLessonIndex: 8, courseId: 'junior-g7-u1-l1' },
     ],
     'class-g10-2': [
       { id: 'c1', name: 'AI 算法基础', cover: '', totalLessons: 18, completedLessons: 4, difficulty: '挑战', currentLesson: '第5课 机器学习与模型训练', currentLessonIndex: 5, courseId: 'senior-g10-u1-l1' },
       { id: 'c2', name: '伦理与社会', cover: '', totalLessons: 8, completedLessons: 2, difficulty: '入门', currentLesson: '第3课 AI 伦理与隐私', currentLessonIndex: 3, courseId: 'senior-g11-u2-l2' },
     ],
   };

   const currentCourses = selectedClassId ? (classCourses[selectedClassId] || []) : [];
   const displayCourses = currentCourses.slice(0, 3);

   // 本周课程表 mock
   const weeklySchedule = [
     { day: '周一', dayIndex: 0, lessons: [
       { className: '五年级(1)班', course: 'AI 通识入门', period: '第3节' },
       { className: '五年级(2)班', course: '数据小侦探', period: '第5节' },
     ]},
     { day: '周二', dayIndex: 1, lessons: [
       { className: '七年级(3)班', course: '机器视觉应用', period: '第2节' },
     ]},
     { day: '周三', dayIndex: 2, lessons: [
       { className: '五年级(1)班', course: 'AI 通识入门', period: '第4节' },
       { className: '高一(1)班', course: 'AI 算法基础', period: '第6节' },
     ]},
     { day: '周四', dayIndex: 3, lessons: [] },
     { day: '周五', dayIndex: 4, lessons: [
       { className: '七年级(3)班', course: '机器人入门', period: '第1节' },
       { className: '五年级(2)班', course: '声音的秘密', period: '第3节' },
     ]},
   ];

   // 最近使用 mock
   const recentItems = [
     { id: 'r1', name: 'AI 通识入门', type: '课程', typeLabel: '课程', icon: BookOpen, gradient: 'from-blue-500 to-indigo-500' },
     { id: 'r2', name: 'AI 实验室', type: 'tool', typeLabel: '工具', icon: FlaskConical, gradient: 'from-violet-500 to-purple-500' },
     { id: 'r3', name: '编程实验室', type: 'tool', typeLabel: '工具', icon: Code2, gradient: 'from-emerald-500 to-teal-500' },
     { id: 'r4', name: '机器视觉应用', type: '课程', typeLabel: '课程', icon: Layers, gradient: 'from-amber-500 to-orange-500' },
   ];

   const handleStartLesson = (courseId: string, lessonIndex: number) => {
     navigate(`/teach/${courseId}`);
     toast.success(`正在打开第${lessonIndex}课...`);
   };

   return (
    <div className="min-h-screen bg-background">
      <section className="w-full bg-gradient-to-br from-primary/10 via-background to-purple-500/10 py-10 md:py-14">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row items-start gap-6"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-purple-500/30 rounded-2xl blur-xl scale-90" />
              <div className="relative size-20 md:size-24 rounded-2xl bg-white ring-4 ring-white shadow-lg overflow-hidden">
                <Image src={MASCOT_IMG} alt="教师头像" className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h1 className="text-2xl md:text-3xl font-bold">{profile?.name || '教师'}老师</h1>
                <Badge variant="outline" className="border-primary/30 text-primary bg-primary/5">
                  <GraduationCap className="size-3 mr-1" />
                  {STAGE_LABELS[(profile as { stage?: string })?.stage || 'primary']}
                </Badge>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <School className="size-4" />
                  {profile?.school || '未设置学校'}
                </span>
                <span className="flex items-center gap-1.5">
                  <User className="size-4" />
                  账号：{profile?.account}
                </span>
              </div>
              <p className="text-xs text-muted-foreground/70 mt-2 flex items-center gap-1.5">
                <AlertTriangle className="size-3 text-amber-500" />
                以下学情数据为演示数据，用于展示功能效果
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="flex w-full h-auto p-1 mb-6 overflow-x-auto justify-start">
             {[
               { value: 'dashboard', label: '学情概览', icon: LayoutDashboard },
               { value: 'prepare', label: '我的备课', icon: FolderOpen, count: prepareLessons.length },
               { value: 'favorites', label: '我的收藏', icon: Heart, count: favoriteLessons.length },
               { value: 'records', label: '课堂记录', icon: Clock },
               { value: 'data', label: '数据管理', icon: Database },
             ].map((item) => {
              const Icon = item.icon;
              return (
                <TabsTrigger
                  key={item.value}
                  value={item.value}
                  className="flex items-center gap-2 px-4 py-2.5 whitespace-nowrap"
                >
                  <Icon className="size-4" />
                  {item.label}
                  {item.count !== undefined && item.count > 0 && (
                    <Badge variant="secondary" className="ml-0.5 px-1.5 h-4 text-[10px] min-w-[18px] justify-center">
                      {item.count}
                    </Badge>
                  )}
                </TabsTrigger>
              );
            })}
          </TabsList>

          {/* 学情概览 */}
           <TabsContent value="dashboard" className="mt-0 space-y-6">
             {/* 紫色核心区域 */}
             <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.5 }}
             >
               <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-indigo-600 via-primary to-violet-600 text-white">
                 {/* 背景装饰 */}
                 <div className="absolute inset-0 overflow-hidden pointer-events-none">
                   <div className="absolute -top-24 -right-24 size-64 bg-white/10 rounded-full blur-3xl" />
                   <div className="absolute -bottom-20 -left-10 size-56 bg-purple-400/20 rounded-full blur-3xl" />
                   <div className="absolute top-1/2 left-1/3 size-40 bg-blue-400/10 rounded-full blur-2xl" />
                 </div>

                 <div className="relative p-5 md:p-6">
                   <div className="flex flex-col lg:flex-row gap-6">
                     {/* 左栏 - 今日授课 */}
                     <div className="flex-1 min-w-0">
                       {/* 顶部欢迎行 */}
                       <div className="flex items-center justify-between mb-4">
                         <div className="flex items-center gap-3 min-w-0">
                           <h2 className="text-lg md:text-xl font-semibold truncate">
                             下午好，{profile?.name || '老师'}老师 👋
                           </h2>
                           <span className="hidden sm:inline text-xs text-white/70 whitespace-nowrap">
                             {new Date().toLocaleDateString('zh-CN', { month: 'long', day: 'numeric', weekday: 'long' })}
                           </span>
                         </div>
                         <div className="size-14 md:size-16 shrink-0 relative">
                           <Image src={MASCOT_IMG} alt="智象" className="w-full h-full object-contain drop-shadow-lg" />
                         </div>
                       </div>

                       {/* 班级选择器 */}
                       <div className="mb-4">
                         <Select value={selectedClassId} onValueChange={setSelectedClassId}>
                           <SelectTrigger className="w-full bg-white/10 border-white/20 text-white hover:bg-white/15 focus:ring-white/30 h-11">
                             <SelectValue placeholder="请选择班级，查看今日课程" />
                           </SelectTrigger>
                           <SelectContent>
                             {MOCK_CLASSES.map((cls) => (
                               <SelectItem key={cls.id} value={cls.id}>
                                 <div className="flex items-center justify-between w-full gap-4">
                                   <span>{cls.name}</span>
                                   <span className="text-xs text-muted-foreground">{cls.studentCount}人</span>
                                 </div>
                               </SelectItem>
                             ))}
                           </SelectContent>
                         </Select>
                       </div>

                       {/* 课程列表 */}
                       {selectedClassId ? (
                         <div className="space-y-2.5">
                           {displayCourses.map((course) => {
                             const progress = Math.round((course.completedLessons / course.totalLessons) * 100);
                             return (
                               <div
                                 key={course.id}
                                 className="bg-white/10 hover:bg-white/15 backdrop-blur-sm rounded-xl p-3.5 border border-white/10 transition-all"
                               >
                                 <div className="flex items-center gap-3">
                                   {/* 课程封面 */}
                                   <div className="size-12 md:size-14 shrink-0 rounded-lg bg-gradient-to-br from-white/20 to-white/5 flex items-center justify-center border border-white/10">
                                     <BookOpen className="size-6 text-white/90" />
                                   </div>

                                   {/* 课程信息 */}
                                   <div className="flex-1 min-w-0">
                                     <div className="flex items-center gap-2 mb-1">
                                       <h3 className="font-semibold text-sm md:text-base truncate">{course.name}</h3>
                                       <Badge variant="outline" className="text-[10px] border-white/30 text-white/90 bg-white/10 shrink-0 h-4 px-1.5">
                                         {course.difficulty}
                                       </Badge>
                                     </div>
                                     <div className="text-xs text-white/70 mb-1.5">
                                       共 {course.totalLessons} 课时 · 已学 {course.completedLessons} 节
                                     </div>
                                     {/* 进度条 */}
                                     <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                                       <div
                                         className="h-full bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full"
                                         style={{ width: `${progress}%` }}
                                       />
                                     </div>
                                   </div>

                                   {/* 右侧操作 */}
                                   <div className="flex flex-col items-end gap-1.5 shrink-0">
                                     <Select defaultValue={String(course.currentLessonIndex)}>
                                       <SelectTrigger className="h-7 text-xs bg-white/10 border-white/20 text-white w-24 px-2">
                                         <SelectValue />
                                       </SelectTrigger>
                                       <SelectContent>
                                         {Array.from({ length: course.totalLessons }, (_, i) => (
                                           <SelectItem key={i + 1} value={String(i + 1)}>
                                             第 {i + 1} 课
                                           </SelectItem>
                                         ))}
                                       </SelectContent>
                                     </Select>
                                     <Button
                                       size="sm"
                                       className="h-7 text-xs bg-white text-primary hover:bg-white/90 font-medium px-3"
                                       onClick={() => handleStartLesson(course.courseId, course.currentLessonIndex)}
                                     >
                                       <PlayCircle className="size-3.5 mr-1" />
                                       继续上课
                                     </Button>
                                   </div>
                                 </div>
                               </div>
                             );
                           })}

                           {currentCourses.length > 3 && (
                             <Button
                               variant="ghost"
                               size="sm"
                               className="w-full text-white/80 hover:text-white hover:bg-white/10 h-8 text-xs"
                               onClick={() => navigate('/courses')}
                             >
                               查看全部 {currentCourses.length} 门课程
                               <ChevronRight className="size-3.5 ml-0.5" />
                             </Button>
                           )}
                         </div>
                       ) : (
                         <div className="flex flex-col items-center justify-center py-6 text-center bg-white/5 rounded-xl border border-white/10 border-dashed">
                           <Calendar className="size-8 text-white/40 mb-2" />
                           <p className="text-sm text-white/70">请选择班级，查看今日课程</p>
                         </div>
                       )}
                     </div>

                     {/* 右栏 - 数据与快捷入口 */}
                     <div className="w-full lg:w-[320px] shrink-0 flex flex-col gap-4">
                       {/* 今日数据 */}
                       <div>
                         <h3 className="text-sm font-medium text-white/80 mb-2.5 flex items-center gap-1.5">
                           <BarChart3 className="size-4" />
                           今日数据
                         </h3>
                         <div className="grid grid-cols-3 gap-2">
                           {[
                             { label: '累计授课', value: 128, unit: '小时', icon: Clock3, gradient: 'from-sky-400/30 to-blue-500/30' },
                             { label: '本周课时', value: 12, unit: '节', icon: CalendarDays, gradient: 'from-emerald-400/30 to-teal-500/30' },
                             { label: '授课班级', value: 4, unit: '个', icon: Users, gradient: 'from-amber-400/30 to-orange-500/30' },
                           ].map((item) => {
                             const Icon = item.icon;
                             return (
                               <div
                                 key={item.label}
                                 className={`bg-gradient-to-br ${item.gradient} backdrop-blur-sm rounded-xl p-3 border border-white/10`}
                               >
                                 <Icon className="size-4 text-white/80 mb-1.5" />
                                 <div className="text-xl font-bold tabular-nums leading-tight">{item.value}</div>
                                 <div className="text-[10px] text-white/70">
                                   {item.label}
                                   <span className="text-white/50 ml-0.5">{item.unit}</span>
                                 </div>
                               </div>
                             );
                           })}
                         </div>
                       </div>

                       {/* 快捷工具 */}
                       <div>
                         <h3 className="text-sm font-medium text-white/80 mb-2.5 flex items-center gap-1.5">
                           <Zap className="size-4" />
                           快捷工具
                         </h3>
                         <div className="grid grid-cols-2 gap-2">
                           {[
                             { name: 'AI 实验室', icon: FlaskConical, path: '/ai-lab', gradient: 'from-sky-500/20 to-cyan-500/20' },
                             { name: '编程实验室', icon: Code2, path: '/coding-lab', gradient: 'from-violet-500/20 to-purple-500/20' },
                             { name: '硬件连接', icon: Cpu, path: '/hardware/connect', gradient: 'from-emerald-500/20 to-teal-500/20' },
                             { name: 'AI 工具', icon: Sparkles, path: '/ai-tools', gradient: 'from-amber-500/20 to-orange-500/20' },
                           ].map((tool) => {
                             const Icon = tool.icon;
                             return (
                               <Button
                                 key={tool.name}
                                 variant="ghost"
                                 className="h-auto flex-col items-start gap-1.5 py-3 px-3 bg-white/10 hover:bg-white/20 text-white border border-white/10"
                                 onClick={() => navigate(tool.path)}
                               >
                                 <Icon className="size-5 text-white/90" />
                                 <span className="font-medium text-sm">{tool.name}</span>
                               </Button>
                             );
                           })}
                         </div>
                       </div>
                     </div>
                   </div>
                 </div>
               </div>
             </motion.div>

             {/* 白色区域 - 三栏布局 */}
             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
               {/* 左栏：最近使用 */}
               <motion.div
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ duration: 0.4, delay: 0.1 }}
               >
                 <Card className="h-full border-border/60">
                   <CardHeader className="pb-3">
                     <CardTitle className="flex items-center gap-2 text-base">
                       <History className="size-4 text-primary" />
                       最近使用
                     </CardTitle>
                   </CardHeader>
                   <CardContent>
                     <div className="grid grid-cols-2 gap-3">
                       {recentItems.map((item) => {
                         const Icon = item.icon;
                         return (
                           <button
                             key={item.id}
                             onClick={() => toast.info(`打开${item.name}`)}
                             className="text-left p-3 rounded-xl border border-border/60 hover:border-primary/30 hover:bg-primary/5 transition-all group"
                           >
                             <div className={`size-9 rounded-lg bg-gradient-to-br ${item.gradient} flex items-center justify-center text-white mb-2`}>
                               <Icon className="size-4.5" />
                             </div>
                             <div className="font-medium text-sm line-clamp-1 mb-0.5">{item.name}</div>
                             <div className="text-[10px] text-muted-foreground">{item.typeLabel}</div>
                           </button>
                         );
                       })}
                     </div>
                   </CardContent>
                 </Card>
               </motion.div>

               {/* 中栏：授课记录 */}
               <motion.div
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ duration: 0.4, delay: 0.2 }}
               >
                 <Card className="h-full border-border/60">
                   <CardHeader className="pb-3">
                     <div className="flex items-center justify-between">
                       <CardTitle className="flex items-center gap-2 text-base">
                         <Clock className="size-4 text-primary" />
                         授课记录
                       </CardTitle>
                       <Button
                         variant="ghost"
                         size="sm"
                         onClick={() => setActiveTab('records')}
                         className="text-muted-foreground hover:text-foreground -mr-2 h-7 text-xs"
                       >
                         查看全部
                         <ChevronRight className="size-3.5 ml-0.5" />
                       </Button>
                     </div>
                   </CardHeader>
                   <CardContent className="pt-0">
                     <div className="space-y-1">
                       {MOCK_TEACHING_RECORDS.slice(0, 5).map((record) => (
                         <div
                           key={record.id}
                           className="flex items-center gap-3 py-2.5 border-b border-border/40 last:border-b-0"
                         >
                           <div className="shrink-0 text-center min-w-[48px]">
                             <div className="text-sm font-semibold text-foreground tabular-nums">
                               {record.date.split('-')[2]}
                             </div>
                             <div className="text-[10px] text-muted-foreground">
                               {record.date.split('-')[1]}月
                             </div>
                           </div>
                           <div className="flex-1 min-w-0">
                             <div className="text-sm font-medium truncate">{record.lessonName}</div>
                             <div className="text-xs text-muted-foreground truncate">
                               {record.className} · {record.time}
                             </div>
                           </div>
                           <Badge
                             variant="outline"
                             className={
                               record.status === 'completed'
                                 ? 'border-emerald-200 bg-emerald-50 text-emerald-700 text-[10px] h-5'
                                 : record.status === 'in-progress'
                                   ? 'border-amber-200 bg-amber-50 text-amber-700 text-[10px] h-5'
                                   : 'border-blue-200 bg-blue-50 text-blue-700 text-[10px] h-5'
                             }
                           >
                             {record.status === 'completed' ? '已完成' : record.status === 'in-progress' ? '进行中' : '已排课'}
                           </Badge>
                         </div>
                       ))}
                     </div>
                   </CardContent>
                 </Card>
               </motion.div>

               {/* 右栏：本周课程表 */}
               <motion.div
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ duration: 0.4, delay: 0.3 }}
               >
                 <Card className="h-full border-border/60">
                   <CardHeader className="pb-3">
                     <div className="flex items-center justify-between">
                       <CardTitle className="flex items-center gap-2 text-base">
                         <CalendarDays className="size-4 text-primary" />
                         本周课程表
                       </CardTitle>
                     </div>
                   </CardHeader>
                   <CardContent className="pt-0">
                     <div className="space-y-2">
                       {weeklySchedule.map((day) => (
                         <div key={day.dayIndex} className="flex gap-3">
                           <div className="w-10 shrink-0 text-xs font-medium text-muted-foreground pt-1">
                             {day.day}
                           </div>
                           <div className="flex-1 space-y-1.5">
                             {day.lessons.length > 0 ? (
                               day.lessons.map((lesson, idx) => (
                                 <div
                                   key={idx}
                                   className="text-xs p-2 rounded-lg bg-gradient-to-r from-primary/5 to-transparent border border-primary/10"
                                 >
                                   <div className="font-medium text-foreground mb-0.5 truncate">{lesson.course}</div>
                                   <div className="text-muted-foreground flex items-center gap-1.5">
                                     <span>{lesson.className}</span>
                                     <span className="text-border">·</span>
                                     <span>{lesson.period}</span>
                                   </div>
                                 </div>
                               ))
                             ) : (
                               <div className="text-xs text-muted-foreground/60 py-1.5 italic">
                                 暂无安排
                               </div>
                             )}
                           </div>
                         </div>
                       ))}
                     </div>
                     <Button
                       variant="ghost"
                       size="sm"
                       className="w-full mt-3 text-primary hover:text-primary h-8 text-xs"
                       onClick={() => toast.info('完整课表功能开发中')}
                     >
                       查看完整课表
                       <ChevronRight className="size-3.5 ml-0.5" />
                     </Button>
                   </CardContent>
                 </Card>
               </motion.div>
             </div>
           </TabsContent>

          {/* 我的备课 */}
          <TabsContent value="prepare" className="mt-0">
            {prepareLessons.length === 0 ? (
              <EmptyState
                icon={FolderOpen}
                title="还没有备课内容"
                desc="浏览课程库，把你要备的课加入备课清单吧"
                actionText="去课程库"
                onAction={() => navigate('/courses')}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {prepareLessons.map((lesson, i) => (
                  <LessonCard
                    key={lesson.id}
                    lesson={lesson}
                    index={i}
                    onOpen={() => navigate(`/courses/${lesson.id}`)}
                    onRemove={() => removeFromPrepare(lesson.id)}
                    actionLabel="移出备课"
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* 我的收藏 */}
          <TabsContent value="favorites" className="mt-0">
            {favoriteLessons.length === 0 ? (
              <EmptyState
                icon={Heart}
                title="还没有收藏内容"
                desc="收藏你喜欢的课程，方便下次快速找到"
                actionText="去课程库"
                onAction={() => navigate('/courses')}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {favoriteLessons.map((lesson, i) => (
                  <LessonCard
                    key={lesson.id}
                    lesson={lesson}
                    index={i}
                    onOpen={() => navigate(`/courses/${lesson.id}`)}
                    onRemove={() => toggleFavorite(lesson.id)}
                    actionLabel="取消收藏"
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* 课堂记录 */}
          <TabsContent value="records" className="mt-0">
            <Card className="border-border/60">
              <CardContent className="p-0">
                <div className="w-full overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border/60 bg-muted/30">
                        <th className="text-left font-medium text-muted-foreground px-4 py-3 whitespace-nowrap">课程名称</th>
                        <th className="text-left font-medium text-muted-foreground px-4 py-3 whitespace-nowrap">学段</th>
                        <th className="text-left font-medium text-muted-foreground px-4 py-3 whitespace-nowrap">上课日期</th>
                        <th className="text-left font-medium text-muted-foreground px-4 py-3 whitespace-nowrap">时长</th>
                        <th className="text-left font-medium text-muted-foreground px-4 py-3 whitespace-nowrap">实验数</th>
                        <th className="text-right font-medium text-muted-foreground px-4 py-3 whitespace-nowrap">操作</th>
                      </tr>
                    </thead>
                    <tbody>
                      {MOCK_CLASS_RECORDS.map((record) => (
                        <tr key={record.id} className="border-b border-border/40 hover:bg-muted/30 transition-colors">
                          <td className="px-4 py-3">
                            <span className="font-medium block max-w-[240px] truncate">{record.lessonTitle}</span>
                          </td>
                          <td className="px-4 py-3">
                            <Badge variant="outline" className={STAGE_COLORS[record.stage]}>
                              {STAGE_LABELS[record.stage]}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{record.date}</td>
                          <td className="px-4 py-3 tabular-nums">{record.duration} 分钟</td>
                          <td className="px-4 py-3 tabular-nums">{record.experiments} 个</td>
                          <td className="px-4 py-3 text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="gap-1 text-primary"
                              onClick={() => navigate(`/courses/${record.lessonId}`)}
                            >
                              查看 <ChevronRight className="size-3.5" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
            <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1.5">
              <AlertTriangle className="size-3 text-amber-500" />
              以上为演示数据，用于展示课堂记录的呈现方式
            </p>
          </TabsContent>

          {/* 数据管理 Tab */}
          <TabsContent value="data" className="mt-0 space-y-5">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">本地数据概览</CardTitle>
                <CardDescription className="text-xs">
                  管理存储在本地浏览器中的数据
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { label: '授课记录', count: '28 条', icon: Clock },
                    { label: '我的收藏', count: `${favoriteLessons.length} 课`, icon: Heart },
                    { label: '我的备课', count: `${prepareLessons.length} 课`, icon: FolderOpen },
                    { label: '实验数据', count: '45 次', icon: FlaskConical },
                  ].map((s) => {
                    const Icon = s.icon;
                    return (
                      <div key={s.label} className="p-3 rounded-lg bg-muted/40">
                        <Icon className="size-4 text-primary mb-1.5" />
                        <div className="text-lg font-bold text-foreground tabular-nums">{s.count}</div>
                        <div className="text-[10px] text-muted-foreground">{s.label}</div>
                      </div>
                    );
                  })}
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button size="sm" variant="secondary" onClick={() => navigate('/teacher/data-management')} className="gap-1.5">
                    <Database className="size-3.5" />
                    进入数据管理中心
                  </Button>
                  <Button size="sm" variant="outline" className="gap-1.5" onClick={() => toast.info('数据已导出（预留）')}>
                    <Trash2 className="size-3.5" />
                    导出数据
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-emerald-50/50 border-emerald-200/60">
              <CardContent className="p-5 flex items-start gap-3">
                <div className="size-10 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <Database className="size-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-emerald-800 mb-1.5">数据隐私保护</h3>
                  <p className="text-xs text-emerald-700/80 leading-relaxed">
                    智象平台以本地优先为设计原则，您的授课记录、备课笔记、实验数据等均保存在浏览器本地，
                    默认不上传服务器。AI 调用数据仅用于完成当前请求，不用于模型训练。
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function UsersIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function SparklesIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3Z" />
    </svg>
  );
}

function LessonCard({
  lesson,
  index,
  onOpen,
  onRemove,
  actionLabel,
}: {
  lesson: ILesson;
  index: number;
  onOpen: () => void;
  onRemove: () => void;
  actionLabel: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Card className="h-full overflow-hidden group hover:shadow-md transition-all border-border/60 bg-card">
        <CardContent className="p-4 space-y-3">
          <div>
            <div className="flex items-start gap-2 mb-1">
              <Badge variant="outline" className={STAGE_COLORS[lesson.stage]}>
                {STAGE_LABELS[lesson.stage]}
              </Badge>
              <span className="text-xs text-muted-foreground ml-auto">{lesson.duration} 分钟</span>
            </div>
            <h3 className="font-semibold text-base leading-tight line-clamp-2 group-hover:text-primary transition-colors">
              {lesson.title}
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              {lesson.unitTitle} · {lesson.gradeName}
            </p>
          </div>
          <div className="flex flex-wrap gap-1">
            {lesson.resourceTypes.map((t) => (
              <Badge key={t} variant="secondary" className="text-[10px] py-0 h-4.5 font-normal">
                {t}
              </Badge>
            ))}
          </div>
          <div className="flex gap-2 pt-1">
            <Button size="sm" variant="default" className="flex-1 gap-1" onClick={onOpen}>
              打开 <ChevronRight className="size-3.5" />
            </Button>
            <Button size="sm" variant="ghost" className="text-muted-foreground hover:text-rose-600 gap-1" onClick={onRemove}>
              <Trash2 className="size-3.5" />
              {actionLabel}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function EmptyState({
  icon: Icon,
  title,
  desc,
  actionText,
  onAction,
}: {
  icon: any;
  title: string;
  desc: string;
  actionText: string;
  onAction: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="relative mb-4">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-full blur-xl scale-75" />
        <div className="relative size-20 rounded-2xl bg-primary/10 flex items-center justify-center">
          <Icon className="size-8 text-primary" />
        </div>
      </div>
      <h3 className="text-lg font-semibold mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground mb-4 max-w-xs">{desc}</p>
      <Button onClick={onAction}>{actionText}</Button>
    </div>
  );
}

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  BookOpen,
  Trophy,
  Clock,
  Target,
  Award,
  TrendingUp,
  ChevronRight,
  FlaskConical,
  Sparkles,
  Calendar,
  Star,
  BarChart3,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTeacherAuth } from '@/context/TeacherAuthContext';

// mock 已完成课程
const completedCourses = [
  {
    id: 'p3-u1-l1',
    title: '人工智能在身边',
    unit: '第一单元 智能学习与生活',
    stage: '小学',
    completedAt: '2025-03-10',
    score: 92,
  },
  {
    id: 'p3-u1-l2',
    title: '会说话的智能音箱',
    unit: '第一单元 智能学习与生活',
    stage: '小学',
    completedAt: '2025-03-15',
    score: 88,
  },
  {
    id: 'p3-u2-l1',
    title: '数据是什么',
    unit: '第二单元 数据与人工智能',
    stage: '小学',
    completedAt: '2025-03-22',
    score: 95,
  },
];

// mock 进行中的课程
const inProgressCourses = [
  {
    id: 'p3-u2-l2',
    title: '数据采集与标注',
    unit: '第二单元 数据与人工智能',
    stage: '小学',
    progress: 60,
  },
  {
    id: 'p3-u3-l1',
    title: '模式识别初体验',
    unit: '第三单元 身边的AI算法',
    stage: '小学',
    progress: 30,
  },
];

// mock 实验记录
const experiments = [
  {
    id: 'exp-1',
    name: '图像分类小实验',
    type: '计算机视觉',
    completedAt: '2025-03-18',
    duration: 25,
    result: '成功',
  },
  {
    id: 'exp-2',
    name: '猜一猜我画的是什么',
    type: '图形识别',
    completedAt: '2025-03-20',
    duration: 18,
    result: '成功',
  },
  {
    id: 'exp-3',
    name: '数字手写体识别',
    type: '机器学习',
    completedAt: '2025-03-25',
    duration: 32,
    result: '进行中',
  },
];

// mock 测评成绩
const quizRecords = [
  {
    id: 'q-1',
    title: '第一单元 智能生活小测验',
    score: 92,
    total: 100,
    date: '2025-03-12',
    rank: '优秀',
  },
  {
    id: 'q-2',
    title: '第二单元 数据知识小测验',
    score: 85,
    total: 100,
    date: '2025-03-24',
    rank: '良好',
  },
];

// mock 成就徽章
const achievements = [
  { id: 'a1', name: '初学乍练', desc: '完成第一节AI课', icon: Star, unlocked: true },
  { id: 'a2', name: '实验小达人', desc: '完成3个AI实验', icon: FlaskConical, unlocked: true },
  { id: 'a3', name: '思考之星', desc: '测评成绩优秀', icon: Award, unlocked: true },
  { id: 'a4', name: '编程小能手', desc: '完成5个编程任务', icon: Sparkles, unlocked: false },
];

export default function StudentCenterPage() {
  const navigate = useNavigate();
  const { profile } = useTeacherAuth();

  const totalProgress = useMemo(() => {
    // mock 总进度：已完成 3 课，本学期 16 课
    return Math.round((completedCourses.length / 16) * 100);
  }, []);

  const totalStudyMinutes = useMemo(() => {
    return experiments.reduce((sum, e) => sum + e.duration, 0) + completedCourses.length * 45;
  }, []);

  const studentName = profile?.role === 'student' ? profile.name : '同学';
  const gradeName = profile?.role === 'student' ? profile.gradeName : '三年级';
  const schoolName = profile?.role === 'student' ? profile.school : '智象 AI 学校';

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50/50 via-background to-primary/5">
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12 space-y-8">
        {/* 欢迎横幅 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="overflow-hidden border-0 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 text-white shadow-lg shadow-emerald-500/20">
            <CardContent className="p-6 md:p-8 relative">
              <div className="absolute right-4 top-4 size-24 md:size-32 opacity-20">
                <div className="text-[8rem]">🐘</div>
              </div>
              <div className="relative z-10">
                <p className="text-emerald-100 text-sm mb-1">
                  {new Date().toLocaleDateString('zh-CN', { weekday: 'long', month: 'long', day: 'numeric' })}
                </p>
                <h1 className="text-2xl md:text-3xl font-bold mb-2">
                  你好，{studentName} 同学 👋
                </h1>
                <p className="text-emerald-50/90 text-sm mb-5">
                  {schoolName} · {gradeName} · 今天也要继续探索 AI 的奥秘哦！
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button
                    variant="secondary"
                    className="bg-white/20 hover:bg-white/30 text-white border-0"
                    onClick={() => navigate('/courses')}
                  >
                    <BookOpen className="size-4 mr-1.5" />
                    开始学习
                  </Button>
                  <Button
                    variant="secondary"
                    className="bg-white/20 hover:bg-white/30 text-white border-0"
                    onClick={() => navigate('/ai-lab')}
                  >
                    <FlaskConical className="size-4 mr-1.5" />
                    做实验
                  </Button>
                  <Button
                    variant="secondary"
                    className="bg-white/20 hover:bg-white/30 text-white border-0"
                    onClick={() => navigate('/training')}
                  >
                    <Target className="size-4 mr-1.5" />
                    测一测
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* 数据概览 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-blue-100/50">
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="size-9 rounded-lg bg-blue-500/15 flex items-center justify-center">
                    <BookOpen className="size-5 text-blue-600" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-blue-900">
                  {completedCourses.length}
                </div>
                <div className="text-xs text-blue-700/70">已完成课程</div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-gradient-to-br from-emerald-50 to-emerald-100/50">
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="size-9 rounded-lg bg-emerald-500/15 flex items-center justify-center">
                    <Clock className="size-5 text-emerald-600" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-emerald-900">
                  {totalStudyMinutes}
                  <span className="text-sm font-normal text-emerald-700/70 ml-1">分钟</span>
                </div>
                <div className="text-xs text-emerald-700/70">累计学习时长</div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-gradient-to-br from-amber-50 to-amber-100/50">
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="size-9 rounded-lg bg-amber-500/15 flex items-center justify-center">
                    <FlaskConical className="size-5 text-amber-600" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-amber-900">
                  {experiments.filter((e) => e.result === '成功').length}
                </div>
                <div className="text-xs text-amber-700/70">成功实验数</div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-gradient-to-br from-purple-50 to-purple-100/50">
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="size-9 rounded-lg bg-purple-500/15 flex items-center justify-center">
                    <Trophy className="size-5 text-purple-600" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-purple-900">
                  {achievements.filter((a) => a.unlocked).length}
                </div>
                <div className="text-xs text-purple-700/70">获得徽章</div>
              </CardContent>
            </Card>
          </div>
        </motion.section>

        {/* 主要内容：三列布局 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 左列：进行中的课程 + 已完成 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 进行中的课程 */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                      <BookOpen className="size-5 text-primary" />
                      正在学习
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate('/courses')}
                      className="text-xs gap-1"
                    >
                      更多课程
                      <ChevronRight className="size-3.5" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {inProgressCourses.map((course, idx) => (
                    <motion.div
                      key={course.id}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: idx * 0.1 }}
                      className="p-4 rounded-xl border border-border/60 hover:border-primary/30 hover:bg-accent/30 transition-all cursor-pointer group"
                      onClick={() => navigate(`/course/${course.id}`)}
                    >
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="min-w-0 flex-1">
                          <h4 className="font-medium text-foreground group-hover:text-primary transition-colors">
                            {course.title}
                          </h4>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {course.unit} · {course.stage}
                          </p>
                        </div>
                        <Badge variant="secondary" className="shrink-0">
                          进行中
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3">
                        <Progress value={course.progress} className="flex-1 h-2" />
                        <span className="text-xs font-medium text-muted-foreground shrink-0">
                          {course.progress}%
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </motion.section>

            {/* 已完成课程 */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Award className="size-5 text-emerald-500" />
                      已完成课程
                    </CardTitle>
                    <Badge variant="outline" className="text-xs">
                      共 {completedCourses.length} 节
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  {completedCourses.map((course, idx) => (
                    <motion.div
                      key={course.id}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: idx * 0.05 }}
                      className="flex items-center gap-4 p-3 rounded-lg hover:bg-accent/40 transition-colors cursor-pointer"
                      onClick={() => navigate(`/course/${course.id}`)}
                    >
                      <div className="size-9 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
                        <Star className="size-4 text-emerald-600 fill-emerald-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-foreground truncate">
                          {course.title}
                        </div>
                        <div className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                          <Calendar className="size-3" />
                          {course.completedAt}
                          <span className="text-border">·</span>
                          {course.unit}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-sm font-bold text-emerald-600">
                          {course.score}
                          <span className="text-xs font-normal text-muted-foreground ml-0.5">分</span>
                        </div>
                        <div className="text-[10px] text-muted-foreground">课程得分</div>
                      </div>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </motion.section>

            {/* 实验记录 */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                      <FlaskConical className="size-5 text-amber-500" />
                      我的实验
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate('/ai-lab')}
                      className="text-xs gap-1"
                    >
                      去实验室
                      <ChevronRight className="size-3.5" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  {experiments.map((exp, idx) => (
                    <motion.div
                      key={exp.id}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: idx * 0.05 }}
                      className="flex items-center gap-3 p-3 rounded-lg border border-border/40 hover:border-primary/30 hover:bg-accent/30 transition-all cursor-pointer"
                      onClick={() => navigate('/ai-lab')}
                    >
                      <div className="size-9 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                        <FlaskConical className="size-4 text-amber-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-foreground truncate">
                          {exp.name}
                        </div>
                        <div className="text-xs text-muted-foreground flex items-center gap-2">
                          <Clock className="size-3" />
                          {exp.duration} 分钟
                          <span className="text-border">·</span>
                          {exp.type}
                        </div>
                      </div>
                      <Badge
                        variant={exp.result === '成功' ? 'default' : 'secondary'}
                        className={exp.result !== '成功' ? '' : 'bg-emerald-500 hover:bg-emerald-600'}
                      >
                        {exp.result}
                      </Badge>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </motion.section>
          </div>

          {/* 右列：学习进度 + 测评成绩 + 徽章 */}
          <div className="space-y-6">
            {/* 学习进度 */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.05 }}
            >
              <Card className="bg-gradient-to-br from-primary/5 to-purple-500/5 border-primary/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <TrendingUp className="size-5 text-primary" />
                    本学期学习进度
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center py-2">
                    <div className="text-5xl font-black text-primary tabular-nums">
                      {totalProgress}%
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      已完成 {completedCourses.length} / 16 课时
                    </div>
                  </div>
                  <Progress value={totalProgress} className="h-3" />
                  <p className="text-xs text-muted-foreground text-center">
                    继续加油！再完成 13 节课就可以拿到本学期结业证书啦 🎉
                  </p>
                </CardContent>
              </Card>
            </motion.section>

            {/* 测评成绩 */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                      <BarChart3 className="size-5 text-violet-500" />
                      测评成绩
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate('/training')}
                      className="text-xs gap-1"
                    >
                      去训练
                      <ChevronRight className="size-3.5" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  {quizRecords.map((q, idx) => (
                    <motion.div
                      key={q.id}
                      initial={{ opacity: 0, x: 10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: idx * 0.05 }}
                      className="p-3 rounded-lg border border-border/40 hover:bg-accent/30 transition-colors cursor-pointer"
                      onClick={() => navigate('/training')}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm font-medium text-foreground line-clamp-1 flex-1 mr-2">
                          {q.title}
                        </span>
                        <Badge
                          variant={q.rank === '优秀' ? 'default' : 'secondary'}
                          className={
                            q.rank === '优秀'
                              ? 'bg-amber-500 hover:bg-amber-600 shrink-0'
                              : 'shrink-0'
                          }
                        >
                          {q.rank}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>
                          <span className="font-bold text-foreground">{q.score}</span>
                          <span className="text-muted-foreground">/{q.total} 分</span>
                        </span>
                        <span>{q.date}</span>
                      </div>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </motion.section>

            {/* 成就徽章 */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Trophy className="size-5 text-amber-500" />
                    我的徽章
                  </CardTitle>
                  <CardDescription className="text-xs">
                    已获得 {achievements.filter((a) => a.unlocked).length} /{' '}
                    {achievements.length} 个
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {achievements.map((a, idx) => {
                      const Icon = a.icon;
                      return (
                        <motion.div
                          key={a.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.4, delay: idx * 0.05 }}
                          className={`p-3 rounded-xl text-center transition-all ${
                            a.unlocked
                              ? 'bg-gradient-to-br from-amber-50 to-amber-100/50 border border-amber-200/60'
                              : 'bg-muted/30 border border-border/40 opacity-60 grayscale'
                          }`}
                        >
                          <div
                            className={`size-10 mx-auto rounded-full flex items-center justify-center mb-2 ${
                              a.unlocked
                                ? 'bg-amber-400/20 text-amber-600'
                                : 'bg-muted text-muted-foreground'
                            }`}
                          >
                            <Icon className="size-5" />
                          </div>
                          <div
                            className={`text-xs font-medium ${
                              a.unlocked ? 'text-amber-900' : 'text-muted-foreground'
                            }`}
                          >
                            {a.name}
                          </div>
                          <div
                            className={`text-[10px] mt-0.5 ${
                              a.unlocked ? 'text-amber-700/70' : 'text-muted-foreground/70'
                            }`}
                          >
                            {a.desc}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.section>
          </div>
        </div>
      </main>
    </div>
  );
}

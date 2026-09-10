import { useState, useMemo, useEffect } from 'react';
import {
  BarChart3,
  Clock,
  BookOpen,
  CheckCircle2,
  Users,
  Download,
  Calendar,
  TrendingUp,
  Activity,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';
import { toast } from 'sonner';
import { MOCK_STUDENT_PROGRESS, type ILessonRecord } from '@/data/analytics';
import { MOCK_CLASSES } from '@/data/school-classes';
import { useNavigate } from 'react-router-dom';

const TIME_RANGES = [
  { value: 'week', label: '本周' },
  { value: 'month', label: '本月' },
  { value: 'semester', label: '本学期' },
];

// 图表颜色 - 蓝紫色系
const CHART_COLORS = ['#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899'];

export default function AnalyticsCenterPage() {
  const navigate = useNavigate();
  const [selectedClass, setSelectedClass] = useState('all');
  const [timeRange, setTimeRange] = useState('month');
  const [activeTab, setActiveTab] = useState<'lessons' | 'students'>('lessons');

  // 从 localStorage 读取真实授课记录
  const [lessonRecords, setLessonRecords] = useState<ILessonRecord[]>([]);

  const loadRecords = () => {
    try {
      const raw = localStorage.getItem('zhixiang_teach_history');
      if (raw) {
        const arr = JSON.parse(raw);
        setLessonRecords(Array.isArray(arr) ? arr : []);
      } else {
        setLessonRecords([]);
      }
    } catch {
      setLessonRecords([]);
    }
  };

  // 首次加载 + 监听 storage 变化
  useEffect(() => {
    loadRecords();
    const handleStorage = () => loadRecords();
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const classRecords = useMemo(() => {
    if (selectedClass === 'all') return lessonRecords;
    return lessonRecords.filter((r) => r.classId === selectedClass);
  }, [lessonRecords, selectedClass]);

  const classProgress = useMemo(() => {
    if (selectedClass === 'all') return MOCK_STUDENT_PROGRESS;
    const className = MOCK_CLASSES.find((c) => c.id === selectedClass)?.name;
    return MOCK_STUDENT_PROGRESS.filter((s) => s.className === className);
  }, [selectedClass]);

  // 计算汇总数据
  const stats = useMemo(() => {
    const totalMinutes = classRecords.reduce((sum, r) => sum + r.duration, 0);
    const completedCount = classRecords.filter((r) => r.status === '已完成').length;
    const avgCompletion =
      classProgress.length > 0
        ? Math.round(
            classProgress.reduce((sum, s) => sum + s.completionRate, 0) / classProgress.length,
          )
        : 0;
    const activeStudents = classProgress.filter((s) => s.completionRate > 0).length;

    return {
      totalMinutes,
      completedCount,
      avgCompletion,
      activeStudents,
    };
  }, [classRecords, classProgress]);

  // 授课时长趋势（折线图） - 根据真实记录生成
  const lineData = useMemo(() => {
    // 最近 4 周的课时统计
    const weeks = ['第1周', '第2周', '第3周', '第4周'];
    const lessonCounts = [0, 0, 0, 0];
    const expCounts = [0, 0, 0, 0];

    if (classRecords.length > 0) {
      const now = new Date();
      classRecords.forEach((r) => {
        const d = new Date(r.date);
        const diffDays = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
        const weekIndex = Math.min(3, Math.floor(diffDays / 7));
        const idx = 3 - weekIndex; // 倒过来，最近的在最后
        if (idx >= 0 && idx < 4) {
          lessonCounts[idx] += 1;
          if (r.courseName.includes('AI') || r.courseName.includes('机器') || r.courseName.includes('算法')) {
            expCounts[idx] += 1;
          }
        }
      });
    }

    return { weeks, lessonCounts, expCounts };
  }, [classRecords]);

  const lineOption: EChartsOption = {
    tooltip: { trigger: 'axis' },
    legend: { bottom: 0, type: 'scroll' },
    grid: { left: '3%', right: '4%', bottom: '20%', containLabel: true },
    xAxis: {
       type: 'category',
       data: lineData.weeks,
      axisLine: { lineStyle: { color: '#e5e7eb' } },
      axisLabel: { color: '#64748b', fontSize: 12 },
    },
    yAxis: {
      type: 'value',
      name: '课时数',
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: '#f1f5f9' } },
      axisLabel: { color: '#64748b', fontSize: 12 },
    },
    series: [
      {
         name: '授课课时',
         type: 'line',
         data: lineData.lessonCounts,
        smooth: true,
        lineStyle: { width: 3, color: CHART_COLORS[0] },
        itemStyle: { color: CHART_COLORS[0] },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(99,102,241,0.3)' },
              { offset: 1, color: 'rgba(99,102,241,0.02)' },
            ],
          },
        },
      },
      {
         name: 'AI实验次数',
         type: 'line',
         data: lineData.expCounts,
        smooth: true,
        lineStyle: { width: 3, color: CHART_COLORS[2] },
        itemStyle: { color: CHART_COLORS[2] },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(168,85,247,0.25)' },
              { offset: 1, color: 'rgba(168,85,247,0.02)' },
            ],
          },
        },
      },
    ],
  };

  // 课程完成率（环形图）
  const pieOption: EChartsOption = {
    tooltip: { trigger: 'item' },
    legend: { bottom: 0, type: 'scroll' },
    series: [
      {
        name: '完成率分布',
        type: 'pie',
        radius: ['60%', '80%'],
        center: ['50%', '45%'],
        avoidLabelOverlap: false,
        label: { show: false },
        emphasis: { label: { show: false } },
        labelLine: { show: false },
        data: [
          { value: stats.avgCompletion, name: '已完成', itemStyle: { color: CHART_COLORS[0] } },
          { value: 100 - stats.avgCompletion, name: '未完成', itemStyle: { color: '#e2e8f0' } },
        ],
      },
    ],
  };

  // AI实验使用排行（条形图）
  const barOption: EChartsOption = {
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    legend: { show: false },
    grid: { left: '3%', right: '10%', bottom: '3%', top: '3%', containLabel: true },
    xAxis: {
      type: 'value',
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: '#f1f5f9' } },
      axisLabel: { color: '#64748b', fontSize: 11 },
    },
    yAxis: {
      type: 'category',
      data: ['人脸识别', 'AI生图', '语音合成', '图像分类', '智能问答'],
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: '#475569', fontSize: 12 },
    },
    series: [
      {
        type: 'bar',
        data: [86, 72, 65, 58, 45],
        barWidth: 18,
        itemStyle: {
          borderRadius: [0, 4, 4, 0],
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 1, y2: 0,
            colorStops: [
              { offset: 0, color: '#818cf8' },
              { offset: 1, color: '#6366f1' },
            ],
          },
        },
      },
    ],
  };

  return (
    <div className="min-h-screen bg-slate-50/60">
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 space-y-5">
        {/* 顶部筛选 */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl md:text-2xl font-bold flex items-center gap-2">
              <BarChart3 className="size-6 text-primary" />
              学情中心
            </h1>
            <p className="text-sm text-muted-foreground mt-1">班级教学数据与学生学习进度分析</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger className="w-48 h-9">
                <SelectValue placeholder="选择班级" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部班级</SelectItem>
                {MOCK_CLASSES.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32 h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TIME_RANGES.map((r) => (
                  <SelectItem key={r.value} value={r.value}>
                    {r.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="sm"
              onClick={() => toast.success('数据导出成功')}
            >
              <Download className="size-3.5 mr-1" />
              导出 Excel
            </Button>
          </div>
        </div>

        {/* 数据概览卡片 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <KpiCard
            icon={<Clock className="size-5" />}
            label="总授课时长"
            value={`${Math.floor(stats.totalMinutes / 60)}h ${stats.totalMinutes % 60}m`}
            trend="+12%"
            color="from-blue-500 to-indigo-500"
          />
          <KpiCard
            icon={<BookOpen className="size-5" />}
            label="已上课时数"
            value={`${stats.completedCount} 节`}
            trend="+3"
            color="from-emerald-500 to-teal-500"
          />
          <KpiCard
            icon={<CheckCircle2 className="size-5" />}
            label="课程完成率"
            value={`${stats.avgCompletion}%`}
            trend="+5%"
            color="from-violet-500 to-purple-500"
          />
          <KpiCard
            icon={<Users className="size-5" />}
            label="活跃学生数"
            value={`${stats.activeStudents} 人`}
            trend="+8%"
            color="from-amber-500 to-orange-500"
          />
        </div>

        {/* 图表区 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <Card className="border-0 shadow-sm lg:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="size-4 text-blue-500" />
                授课时长趋势
              </CardTitle>
              <CardDescription className="text-xs">近 4 周授课与实验数据</CardDescription>
            </CardHeader>
            <CardContent>
              <ReactECharts option={lineOption} className="h-[280px]" />
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Activity className="size-4 text-violet-500" />
                课程完成率
              </CardTitle>
              <CardDescription className="text-xs">班级整体进度</CardDescription>
            </CardHeader>
            <CardContent className="relative">
              <ReactECharts option={pieOption} className="h-[250px]" />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none -mt-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-foreground tabular-nums">
                    {stats.avgCompletion}%
                  </p>
                  <p className="text-xs text-muted-foreground">平均完成率</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <Card className="border-0 shadow-sm lg:col-span-3">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <BarChart3 className="size-4 text-fuchsia-500" />
                AI 实验使用次数排行
              </CardTitle>
              <CardDescription className="text-xs">本月各实验项目使用情况</CardDescription>
            </CardHeader>
            <CardContent>
              <ReactECharts option={barOption} className="h-[260px]" />
            </CardContent>
          </Card>
        </div>

        {/* 表格区 */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-0">
            <Tabs
              value={activeTab}
              onValueChange={(v) => setActiveTab(v as 'lessons' | 'students')}
            >
              <div className="px-5 pt-4 border-b border-border/40">
                <TabsList className="h-auto p-1 bg-muted/30 w-auto rounded-xl mb-0">
                  <TabsTrigger
                    value="lessons"
                    className="data-[state=active]:bg-white data-[state=active]:shadow-sm h-auto py-2 px-4 text-sm"
                  >
                    <Calendar className="size-4 mr-1.5" />
                    授课记录
                  </TabsTrigger>
                  <TabsTrigger
                    value="students"
                    className="data-[state=active]:bg-white data-[state=active]:shadow-sm h-auto py-2 px-4 text-sm"
                  >
                    <Users className="size-4 mr-1.5" />
                    学生学情
                  </TabsTrigger>
                </TabsList>
              </div>

               <TabsContent value="lessons" className="mt-0">
                 {classRecords.length === 0 ? (
                   <div className="py-16 text-center">
                     <div className="size-16 mx-auto mb-4 rounded-full bg-muted/30 flex items-center justify-center">
                       <Calendar className="size-8 text-muted-foreground/40" />
                     </div>
                     <h3 className="text-base font-semibold text-foreground mb-1">暂无授课记录</h3>
                     <p className="text-sm text-muted-foreground mb-4">
                       去课程库开启第一节课，数据会自动记录到这里
                     </p>
                     <Button onClick={() => (navigate('/courses'))}>
                       <BookOpen className="size-4 mr-1.5" />
                       去上一节课
                     </Button>
                   </div>
                 ) : (
                   <div className="w-full overflow-x-auto">
                     <table className="w-full text-sm">
                       <thead>
                         <tr className="border-b border-border/60 bg-muted/20">
                           <th className="text-left font-medium text-muted-foreground px-4 py-2.5 text-xs uppercase tracking-wide">
                             日期
                           </th>
                           <th className="text-left font-medium text-muted-foreground px-4 py-2.5 text-xs uppercase tracking-wide">
                             班级
                           </th>
                           <th className="text-left font-medium text-muted-foreground px-4 py-2.5 text-xs uppercase tracking-wide">
                             课程
                           </th>
                           <th className="text-left font-medium text-muted-foreground px-4 py-2.5 text-xs uppercase tracking-wide">
                             课时
                           </th>
                           <th className="text-left font-medium text-muted-foreground px-4 py-2.5 text-xs uppercase tracking-wide">
                             时长
                           </th>
                           <th className="text-left font-medium text-muted-foreground px-4 py-2.5 text-xs uppercase tracking-wide">
                             授课教师
                           </th>
                           <th className="text-left font-medium text-muted-foreground px-4 py-2.5 text-xs uppercase tracking-wide">
                             状态
                           </th>
                         </tr>
                       </thead>
                       <tbody>
                         {classRecords.map((r) => (
                           <tr
                             key={r.id}
                             className="border-b border-border/40 last:border-0 hover:bg-muted/20"
                           >
                             <td className="px-4 py-3 font-mono text-xs">{r.date}</td>
                             <td className="px-4 py-3">{r.className}</td>
                             <td className="px-4 py-3">
                               <div>
                                 <p className="font-medium">{r.courseName}</p>
                                 <p className="text-xs text-muted-foreground">{r.lessonTitle}</p>
                               </div>
                             </td>
                             <td className="px-4 py-3 text-muted-foreground">1 课时</td>
                             <td className="px-4 py-3 tabular-nums">{r.duration} 分钟</td>
                             <td className="px-4 py-3 text-muted-foreground">{r.teacherName}</td>
                             <td className="px-4 py-3">
                               <Badge
                                 variant={r.status === '已完成' ? 'default' : 'outline'}
                                 className={
                                   r.status === '已完成'
                                     ? 'bg-emerald-100 text-emerald-700 border-0'
                                     : 'text-amber-600 border-amber-200 bg-amber-50'
                                 }
                               >
                                 {r.status}
                               </Badge>
                             </td>
                           </tr>
                         ))}
                       </tbody>
                     </table>
                   </div>
                 )}
               </TabsContent>

              <TabsContent value="students" className="mt-0">
                <div className="w-full overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border/60 bg-muted/20">
                        <th className="text-left font-medium text-muted-foreground px-4 py-2.5 text-xs uppercase tracking-wide">
                          学生姓名
                        </th>
                        <th className="text-left font-medium text-muted-foreground px-4 py-2.5 text-xs uppercase tracking-wide">
                          班级
                        </th>
                        <th className="text-left font-medium text-muted-foreground px-4 py-2.5 text-xs uppercase tracking-wide">
                          已上课时
                        </th>
                        <th className="text-left font-medium text-muted-foreground px-4 py-2.5 text-xs uppercase tracking-wide">
                          完成率
                        </th>
                        <th className="text-left font-medium text-muted-foreground px-4 py-2.5 text-xs uppercase tracking-wide">
                          实验次数
                        </th>
                        <th className="text-left font-medium text-muted-foreground px-4 py-2.5 text-xs uppercase tracking-wide">
                          最近上课
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {classProgress.map((s) => (
                        <tr
                          key={s.id}
                          className="border-b border-border/40 last:border-0 hover:bg-muted/20"
                        >
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="size-7 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-xs font-medium">
                                {s.studentName.charAt(0)}
                              </div>
                              <span className="font-medium">{s.studentName}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">{s.className}</td>
                          <td className="px-4 py-3 tabular-nums">
                            {s.lessonsCompleted}/{s.totalLessons}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2 w-40">
                              <Progress value={s.completionRate} className="h-1.5" />
                              <span className="text-xs tabular-nums w-10 shrink-0">
                                {s.completionRate}%
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 tabular-nums">{s.experimentsCount} 次</td>
                          <td className="px-4 py-3 text-muted-foreground text-xs">
                            {s.lastLessonAt}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

function KpiCard({
  icon,
  label,
  value,
  trend,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  trend: string;
  color: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="border-0 shadow-sm overflow-hidden">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div
              className={`size-9 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-white`}
            >
              {icon}
            </div>
            <Badge variant="outline" className="text-[10px] bg-emerald-50 text-emerald-600 border-emerald-100">
              {trend}
            </Badge>
          </div>
          <p className="text-2xl font-bold tabular-nums mb-0.5">{value}</p>
          <p className="text-xs text-muted-foreground">{label}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

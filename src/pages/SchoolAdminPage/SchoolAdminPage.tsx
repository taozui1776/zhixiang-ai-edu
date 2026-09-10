import { useState } from 'react';
import {
  Building2,
  Users,
  GraduationCap,
  Clock,
  BarChart3,
  Plus,
  Download,
  Search,
  MoreHorizontal,
  RefreshCw,
  Trash2,
  Edit,
  BookOpen,
  PieChart,
  TrendingUp,
  School,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';
import { toast } from 'sonner';
import {
  MOCK_TEACHERS,
  MOCK_SCHOOL_COURSES,
  type ITeacher,
} from '@/data/school-admin';

const MOCK_SCHOOL_CLASSES = [
  { grade: '四年级', classCount: 6, studentCount: 248 },
  { grade: '七年级', classCount: 8, studentCount: 312 },
  { grade: '高一', classCount: 10, studentCount: 420 },
  { grade: '高二', classCount: 9, studentCount: 378 },
  { grade: '高三', classCount: 8, studentCount: 336 },
];

const CHART_COLORS = ['#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899', '#f43f5e'];

export default function SchoolAdminPage() {
  const [activeTab, setActiveTab] = useState('teachers');

  // 学校数据总览
  const totalStats = {
    teacherCount: MOCK_TEACHERS.filter(t => t.status === 'active').length,
    classCount: MOCK_SCHOOL_CLASSES.reduce((sum, g) => sum + g.classCount, 0),
    studentCount: 1520,
    totalMinutes: 3280,
  };

  // 全校授课趋势
  const overviewChartOption: EChartsOption = {
    tooltip: { trigger: 'axis' },
    legend: { bottom: 0, type: 'scroll' },
    grid: { left: '3%', right: '4%', bottom: '20%', containLabel: true },
    xAxis: {
      type: 'category',
      data: ['9月', '10月', '11月', '12月', '1月', '2月', '3月', '4月', '5月', '6月'],
      axisLabel: { color: '#64748b', fontSize: 11 },
    },
    yAxis: {
      type: 'value',
      name: '课时',
      axisLine: { show: false },
      splitLine: { lineStyle: { color: '#f1f5f9' } },
      axisLabel: { color: '#64748b', fontSize: 11 },
    },
    series: [
      {
        name: '授课课时',
        type: 'line',
        data: [86, 104, 128, 145, 132, 98, 110, 136, 152, 168],
        smooth: true,
        lineStyle: { width: 2.5, color: CHART_COLORS[0] },
        itemStyle: { color: CHART_COLORS[0] },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(99,102,241,0.25)' },
              { offset: 1, color: 'rgba(99,102,241,0.02)' },
            ],
          },
        },
      },
      {
        name: 'AI 实验次数',
        type: 'bar',
        data: [42, 68, 95, 124, 108, 56, 72, 98, 135, 158],
        barWidth: 14,
        itemStyle: {
          borderRadius: [4, 4, 0, 0],
          color: CHART_COLORS[2],
        },
      },
    ],
  };

  // 各班级使用对比（饼图）
  const classUsageOption: EChartsOption = {
    tooltip: { trigger: 'item' },
    legend: { bottom: 0, type: 'scroll' },
    series: [
      {
        type: 'pie',
        radius: ['55%', '78%'],
        center: ['50%', '45%'],
        avoidLabelOverlap: false,
        label: { show: false },
        emphasis: { label: { show: false } },
        labelLine: { show: false },
        data: [
          { value: 168, name: '四年级1班', itemStyle: { color: CHART_COLORS[0] } },
          { value: 142, name: '七年级1班', itemStyle: { color: CHART_COLORS[1] } },
          { value: 135, name: '高一2班', itemStyle: { color: CHART_COLORS[2] } },
          { value: 98, name: '其他班级', itemStyle: { color: CHART_COLORS[4] } },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-slate-50/60">
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 space-y-5">
        {/* 学校信息总览 */}
        <Card className="border-0 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 p-5 text-white">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="size-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Building2 className="size-7" />
                </div>
                <div>
                  <h1 className="text-xl md:text-2xl font-bold">实验中学</h1>
                  <p className="text-white/70 text-sm mt-0.5">学校管理后台</p>
                </div>
              </div>
              <div className="flex gap-6 text-center">
                <KpiMini icon={<Users className="size-4" />} value={totalStats.teacherCount} label="教师" />
                <KpiMini icon={<GraduationCap className="size-4" />} value={totalStats.classCount} label="班级" />
                <KpiMini icon={<School className="size-4" />} value={totalStats.studentCount} label="学生" />
                <KpiMini icon={<Clock className="size-4" />} value={`${Math.floor(totalStats.totalMinutes/60)}h`} label="总授课" />
              </div>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="px-5 pt-4 border-b border-border/40">
              <TabsList className="h-auto p-1 bg-muted/30 w-full md:w-auto rounded-xl mb-0">
                <TabsTrigger
                  value="teachers"
                  className="data-[state=active]:bg-white data-[state=active]:shadow-sm h-auto py-2 px-4 text-sm"
                >
                  <Users className="size-4 mr-1.5" />
                  教师管理
                </TabsTrigger>
                <TabsTrigger
                  value="classes"
                  className="data-[state=active]:bg-white data-[state=active]:shadow-sm h-auto py-2 px-4 text-sm"
                >
                  <GraduationCap className="size-4 mr-1.5" />
                  班级管理
                </TabsTrigger>
                <TabsTrigger
                  value="courses"
                  className="data-[state=active]:bg-white data-[state=active]:shadow-sm h-auto py-2 px-4 text-sm"
                >
                  <BookOpen className="size-4 mr-1.5" />
                  课程管理
                </TabsTrigger>
                <TabsTrigger
                  value="stats"
                  className="data-[state=active]:bg-white data-[state=active]:shadow-sm h-auto py-2 px-4 text-sm"
                >
                  <BarChart3 className="size-4 mr-1.5" />
                  数据统计
                </TabsTrigger>
              </TabsList>
            </div>

            {/* 教师管理 */}
            <TabsContent value="teachers" className="mt-0">
              <TeacherManagement />
            </TabsContent>

            {/* 班级管理 */}
            <TabsContent value="classes" className="mt-0">
              <ClassManagementAdmin />
            </TabsContent>

            {/* 课程管理 */}
            <TabsContent value="courses" className="mt-0">
              <CourseManagement />
            </TabsContent>

            {/* 数据统计 */}
            <TabsContent value="stats" className="mt-0">
              <div className="p-5 space-y-5">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                  <Card className="border shadow-sm lg:col-span-2">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center gap-2">
                        <TrendingUp className="size-4 text-indigo-500" />
                        全校授课趋势
                      </CardTitle>
                      <CardDescription className="text-xs">近 10 个月授课数据</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ReactECharts option={overviewChartOption} className="h-[280px]" />
                    </CardContent>
                  </Card>

                  <Card className="border shadow-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center gap-2">
                        <PieChart className="size-4 text-violet-500" />
                        班级使用占比
                      </CardTitle>
                      <CardDescription className="text-xs">本月各班级使用</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ReactECharts option={classUsageOption} className="h-[250px]" />
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </main>
    </div>
  );
}

function KpiMini({ icon, value, label }: { icon: React.ReactNode; value: string | number; label: string }) {
  return (
    <div className="text-center">
      <div className="flex items-center justify-center gap-1 text-white/80 mb-0.5">
        {icon}
      </div>
      <p className="text-xl font-bold tabular-nums">{value}</p>
      <p className="text-[11px] text-white/70">{label}</p>
    </div>
  );
}

// 教师管理
function TeacherManagement() {
  const [teachers, setTeachers] = useState<ITeacher[]>(MOCK_TEACHERS);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [openAdd, setOpenAdd] = useState(false);
  const [newTeacher, setNewTeacher] = useState({ name: '', account: '', phone: '' });

  const filtered = teachers.filter(
    (t) =>
      t.name.includes(searchKeyword) ||
      t.account.includes(searchKeyword) ||
      (t.phone || '').includes(searchKeyword),
  );

  const handleAdd = () => {
    if (!newTeacher.name || !newTeacher.account) {
      toast.info('请填写教师姓名和账号');
      return;
    }
    const teacher: ITeacher = {
      id: `t-new-${Date.now()}`,
      name: newTeacher.name,
      account: newTeacher.account,
      phone: newTeacher.phone,
      role: 'teacher',
      subject: '信息技术',
      classCount: 0,
      studentCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'active',
    };
    setTeachers((prev) => [teacher, ...prev]);
    setOpenAdd(false);
    setNewTeacher({ name: '', account: '', phone: '' });
    toast.success(`已创建教师：${newTeacher.name}`);
  };

  const handleDelete = (id: string, name: string) => {
    setTeachers((prev) => prev.filter((t) => t.id !== id));
    toast.success(`已删除教师：${name}`);
  };

  return (
    <div className="p-5">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <p className="text-sm text-muted-foreground">共 {teachers.length} 位教师</p>
        <div className="flex gap-2 flex-wrap">
          <div className="relative">
            <Search className="size-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="搜索教师姓名/账号"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="pl-8 h-9 text-sm w-48"
            />
          </div>
          <Button variant="outline" size="sm">
            <Download className="size-3.5 mr-1" />
            导出
          </Button>
          <Dialog open={openAdd} onOpenChange={setOpenAdd}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="size-3.5 mr-1" />
                创建教师
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>创建教师账号</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div className="space-y-1.5">
                  <Label>教师姓名</Label>
                  <Input
                    placeholder="请输入教师姓名"
                    value={newTeacher.name}
                    onChange={(e) => setNewTeacher({ ...newTeacher, name: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>账号</Label>
                  <Input
                    placeholder="设置登录账号"
                    value={newTeacher.account}
                    onChange={(e) => setNewTeacher({ ...newTeacher, account: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>手机号</Label>
                  <Input
                    placeholder="请输入手机号"
                    value={newTeacher.phone}
                    onChange={(e) => setNewTeacher({ ...newTeacher, phone: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">取消</Button>
                </DialogClose>
                <Button onClick={handleAdd}>创建</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="w-full overflow-x-auto rounded-lg border border-border/60">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/60 bg-muted/20">
              <th className="text-left font-medium text-muted-foreground px-4 py-2.5 text-xs uppercase tracking-wide">
                教师
              </th>
              <th className="text-left font-medium text-muted-foreground px-4 py-2.5 text-xs uppercase tracking-wide">
                账号
              </th>
              <th className="text-left font-medium text-muted-foreground px-4 py-2.5 text-xs uppercase tracking-wide">
                手机号
              </th>
              <th className="text-left font-medium text-muted-foreground px-4 py-2.5 text-xs uppercase tracking-wide">
                角色
              </th>
              <th className="text-left font-medium text-muted-foreground px-4 py-2.5 text-xs uppercase tracking-wide">
                学科
              </th>
              <th className="text-left font-medium text-muted-foreground px-4 py-2.5 text-xs uppercase tracking-wide">
                授课班级
              </th>
              <th className="text-left font-medium text-muted-foreground px-4 py-2.5 text-xs uppercase tracking-wide">
                创建时间
              </th>
              <th className="text-right font-medium text-muted-foreground px-4 py-2.5 text-xs uppercase tracking-wide">
                操作
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((t) => (
              <tr key={t.id} className="border-b border-border/40 last:border-0 hover:bg-muted/20">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="size-8 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-white text-xs font-medium">
                      {t.name.charAt(0)}
                    </div>
                    <span className="font-medium">{t.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{t.account}</td>
                <td className="px-4 py-3 text-muted-foreground">{t.phone || '-'}</td>
                <td className="px-4 py-3">
                  <Badge variant="outline" className="text-[10px]">
                    {t.role === 'admin' ? '管理员' : t.role === 'teacher' ? '授课教师' : t.role}
                  </Badge>
                </td>
                <td className="px-4 py-3 tabular-nums">{t.classCount} 个班</td>
                <td className="px-4 py-3 text-muted-foreground">{t.subject}</td>
                <td className="px-4 py-3 text-muted-foreground text-xs">{t.createdAt}</td>
                <td className="px-4 py-3 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="size-7">
                        <MoreHorizontal className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-36">
                      <DropdownMenuItem className="text-xs cursor-pointer">
                        <Edit className="size-3.5 mr-2" />
                        编辑信息
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-xs cursor-pointer"
                        onClick={() => toast.success(`已重置 ${t.name} 的密码`)}
                      >
                        <RefreshCw className="size-3.5 mr-2" />
                        重置密码
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-xs text-rose-600 cursor-pointer"
                        onClick={() => handleDelete(t.id, t.name)}
                      >
                        <Trash2 className="size-3.5 mr-2" />
                        删除账号
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// 班级管理（全校视角）
function ClassManagementAdmin() {
  return (
    <div className="p-5">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted-foreground">
          全校共 {MOCK_SCHOOL_CLASSES.reduce((s, g) => s + g.classCount, 0)} 个班级
        </p>
        <Button variant="outline" size="sm">
          <Download className="size-3.5 mr-1" />
          导出
        </Button>
      </div>

      <div className="space-y-3">
        {MOCK_SCHOOL_CLASSES.map((grade, gi) => (
          <motion.div
            key={grade.grade}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: gi * 0.05 }}
          >
            <Card className="border border-border/60 shadow-none">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Badge className="bg-indigo-100 text-indigo-700 border-0">
                    {grade.grade}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {grade.classCount} 个班 / {grade.studentCount} 名学生
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {Array.from({ length: grade.classCount }).map((_, i) => (
                    <div
                      key={i}
                      className="px-3 py-2 rounded-lg bg-muted/30 border border-border/50 flex items-center justify-between text-sm hover:bg-muted/50 cursor-pointer transition-colors"
                    >
                      <span className="font-medium truncate">
                        {grade.grade.replace(/[一二三四五六七八九十]/g, '').replace('年级', '').replace('高一', '高1').replace('高二', '高2').replace('高三', '高3')}
                        {i + 1}班
                      </span>
                      <span className="text-xs text-muted-foreground shrink-0 ml-2">
                        {Math.floor(40 + Math.random() * 15)}人
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// 课程管理
function CourseManagement() {
  const [courses, setCourses] = useState(MOCK_SCHOOL_COURSES);

  const handleToggle = (id: string) => {
    setCourses((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, status: c.status === 'active' ? 'expired' : 'active' as 'active' | 'expired' } : c,
      ),
    );
    const course = courses.find((c) => c.id === id);
    if (course) {
      toast.success(course.status === 'active' ? `已停用课程：${course.name}` : `已启用课程：${course.name}`);
    }
  };

  const gradients = [
    'bg-gradient-to-br from-blue-400 to-indigo-500',
    'bg-gradient-to-br from-violet-400 to-purple-500',
    'bg-gradient-to-br from-fuchsia-400 to-pink-500',
    'bg-gradient-to-br from-emerald-400 to-teal-500',
    'bg-gradient-to-br from-amber-400 to-orange-500',
    'bg-gradient-to-br from-cyan-400 to-sky-500',
  ];
  const emojis = ['🤖', '📊', '🎨', '👁️', '🧩', '⚖️'];

  return (
    <div className="p-5">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted-foreground">
          已开通 {courses.filter((c) => c.status === 'active').length} / {courses.length} 门课程
        </p>
        <Button size="sm">
          <Plus className="size-3.5 mr-1" />
          开通课程
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {courses.map((c, i) => (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
          >
            <Card className={`border shadow-none overflow-hidden ${c.status === 'active' ? '' : 'opacity-60'}`}>
              <div className={`h-24 flex items-center justify-center text-4xl ${gradients[i % gradients.length]} text-white`}>
                {emojis[i % emojis.length]}
              </div>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h3 className="font-semibold text-sm">{c.name}</h3>
                    <Badge variant="outline" className="text-[10px] mt-1 h-4">
                      {c.stage}
                    </Badge>
                  </div>
                  <Badge
                    className={`text-[10px] border-0 ${c.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}
                  >
                    {c.status === 'active' ? '使用中' : '已到期'}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2 mb-3 h-8">
                  {c.module}
                </p>
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                  <span>{c.lessonsCount} 课时</span>
                  <span>开通 {c.activatedAt}</span>
                </div>
                <Button
                  variant={c.status === 'active' ? 'outline' : 'default'}
                  size="sm"
                  className="w-full"
                  onClick={() => handleToggle(c.id)}
                >
                  {c.status === 'active' ? '停用课程' : '启用课程'}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

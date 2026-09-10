import { useState, useMemo } from 'react';
import {
  Users,
  Plus,
  Search,
  MoreHorizontal,
  Trash2,
  RefreshCw,
  MoveRight,
  Download,
  Upload,
  ChevronRight,
  ChevronDown,
  FileSpreadsheet,
  X,
  UserPlus,
  Layers,
  UserMinus,
  Eye,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
import { Checkbox } from '@/components/ui/checkbox';
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
import { toast } from 'sonner';
import { MOCK_CLASSES, MOCK_STUDENTS, GRADES, type IClass, type IStudent } from '@/data/school-classes';

type TabValue = 'students' | 'groups';

const GRADE_CLASSES_MAP: Record<string, string[]> = {
  '一年级': ['一1班', '一2班'],
  '二年级': ['二1班', '二2班'],
  '三年级': ['三1班', '三2班'],
  '四年级': ['四年级1班', '四年级2班', '四年级3班'],
  '五年级': ['五1班', '五2班'],
  '六年级': ['六1班', '六2班'],
  '七年级': ['七年级1班', '七年级2班'],
  '八年级': ['八1班', '八2班'],
  '九年级': ['九1班'],
  '高一': ['高一1班', '高一2班', '高一3班'],
  '高二': ['高二1班', '高二2班'],
  '高三': ['高三1班', '高三2班'],
};

export default function ClassManagementPage() {
  const [onlyMyClass, setOnlyMyClass] = useState(true);
  const [selectedGrade, setSelectedGrade] = useState<string>('四年级');
  const [expandedGrades, setExpandedGrades] = useState<Set<string>>(new Set(['四年级', '七年级', '高一']));
  const [selectedClassId, setSelectedClassId] = useState('class-g4-1');
  const [activeTab, setActiveTab] = useState<TabValue>('students');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [students, setStudents] = useState<IStudent[]>(MOCK_STUDENTS);

  const selectedClass = MOCK_CLASSES.find((c) => c.id === selectedClassId) || MOCK_CLASSES[0];
  const classStudents = students.filter((s) => s.classId === selectedClassId);

  const filteredStudents = useMemo(() => {
    if (!searchKeyword.trim()) return classStudents;
    const kw = searchKeyword.toLowerCase();
    return classStudents.filter(
      (s) => s.name.toLowerCase().includes(kw) || s.account.toLowerCase().includes(kw),
    );
  }, [classStudents, searchKeyword]);

  const toggleGrade = (grade: string) => {
    const newExpanded = new Set(expandedGrades);
    if (newExpanded.has(grade)) {
      newExpanded.delete(grade);
    } else {
      newExpanded.add(grade);
    }
    setExpandedGrades(newExpanded);
  };

  const handleSelectClass = (grade: string, className: string) => {
    setSelectedGrade(grade);
    // 从 mock 中找到匹配的班级
    const found = MOCK_CLASSES.find(
      (c) => c.grade === grade && c.name === className,
    );
    if (found) {
      setSelectedClassId(found.id);
    } else {
      // 如果没有 mock 数据，使用第一个 mock
      setSelectedClassId(MOCK_CLASSES[0].id);
      toast.info('该班级暂无学生数据，展示示例班级');
    }
  };

  const handleDeleteStudent = (studentId: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== studentId));
    toast.success('学生已移除');
  };

  const handleResetPassword = (studentName: string) => {
    toast.success(`已重置 ${studentName} 的密码为 123456`);
  };

  const handleAddStudent = (name: string) => {
    const newStudent: IStudent = {
      id: `s-new-${Date.now()}`,
      name,
      account: `${name}_${selectedClass.gradeLevel}g`,
      classId: selectedClassId,
      className: selectedClass.name,
      grade: selectedClass.grade,
      createdAt: new Date().toISOString().split('T')[0],
      lastLoginAt: '-',
      lessonsCompleted: 0,
      totalLessons: 20,
      completionRate: 0,
    };
    setStudents((prev) => [...prev, newStudent]);
    toast.success(`已添加学生：${name}`);
  };

  return (
    <div className="min-h-screen bg-slate-50/60">
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        {/* 顶部操作栏 */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-5">
          <div>
            <h1 className="text-xl md:text-2xl font-bold">班级管理</h1>
            <p className="text-sm text-muted-foreground mt-1">管理班级、学生与学习小组</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Checkbox
                id="only-my"
                checked={onlyMyClass}
                onCheckedChange={(v) => setOnlyMyClass(!!v)}
              />
              <label htmlFor="only-my" className="text-sm cursor-pointer text-muted-foreground">
                只看我的班级
              </label>
            </div>
            <Button>
              <Plus className="size-4 mr-1.5" />
              创建班级
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-5">
          {/* 左侧年级树 */}
          <aside className="col-span-12 md:col-span-3">
            <Card className="border-0 shadow-sm sticky top-20">
              <CardContent className="p-3">
                <div className="space-y-0.5">
                  {GRADES.map((grade) => {
                    const classes = GRADE_CLASSES_MAP[grade] || [];
                    const isExpanded = expandedGrades.has(grade);
                    const isSelectedGrade = selectedGrade === grade;

                    return (
                      <div key={grade}>
                        <button
                          onClick={() => toggleGrade(grade)}
                          className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                            isSelectedGrade
                              ? 'bg-primary/10 text-primary font-medium'
                              : 'text-foreground hover:bg-muted/50'
                          }`}
                        >
                          {isExpanded ? (
                            <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
                          ) : (
                            <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
                          )}
                          <span className="flex-1 text-left">{grade}</span>
                          <span className="text-xs text-muted-foreground">{classes.length}班</span>
                        </button>

                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div className="pl-6 space-y-0.5 py-1">
                                {classes.map((cls) => {
                                  const mockClass = MOCK_CLASSES.find(
                                    (c) => c.grade === grade && c.name === cls,
                                  );
                                  const isSelected = selectedClassId === mockClass?.id;
                                  return (
                                    <button
                                      key={cls}
                                      onClick={() => handleSelectClass(grade, cls)}
                                      className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                                        isSelected
                                          ? 'bg-primary text-primary-foreground'
                                          : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                                      }`}
                                    >
                                      <Users className="size-3.5 shrink-0" />
                                      <span className="flex-1 text-left truncate">{cls}</span>
                                      {mockClass && (
                                        <span
                                          className={`text-[10px] ${isSelected ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}
                                        >
                                          {mockClass.studentCount}人
                                        </span>
                                      )}
                                    </button>
                                  );
                                })}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* 右侧主内容 */}
          <section className="col-span-12 md:col-span-9 space-y-4">
            {/* 班级信息卡 */}
            <Card className="border-0 shadow-sm bg-gradient-to-r from-slate-900 to-slate-800 text-white">
              <CardContent className="p-5">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <Badge className="bg-white/10 text-white/80 border-0 mb-2">
                      {selectedClass.grade}
                    </Badge>
                    <h2 className="text-xl font-bold text-white">{selectedClass.name}</h2>
                    <p className="text-sm text-white/70 mt-1">
                      {selectedClass.description || '人工智能通识课班级'}
                    </p>
                  </div>
                  <div className="flex gap-6 text-center">
                    <div>
                      <p className="text-2xl font-bold text-white">{selectedClass.studentCount}</p>
                      <p className="text-xs text-white/60">学生人数</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-white">{selectedClass.groups.length}</p>
                      <p className="text-xs text-white/60">学习小组</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-white">{selectedClass.teacherName}</p>
                      <p className="text-xs text-white/60">授课教师</p>
                    </div>
                    <div className="hidden md:block">
                      <p className="text-sm font-medium text-white">{selectedClass.createdAt}</p>
                      <p className="text-xs text-white/60">创建时间</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabValue)}>
              <TabsList className="h-auto p-1 bg-muted/50 w-full md:w-auto rounded-xl mb-4">
                <TabsTrigger
                  value="students"
                  className="data-[state=active]:bg-white data-[state=active]:shadow-sm h-auto py-2 px-4"
                >
                  <Users className="size-4 mr-1.5" />
                  学生管理
                </TabsTrigger>
                <TabsTrigger
                  value="groups"
                  className="data-[state=active]:bg-white data-[state=active]:shadow-sm h-auto py-2 px-4"
                >
                  <Layers className="size-4 mr-1.5" />
                  小组管理
                </TabsTrigger>
              </TabsList>

              <TabsContent value="students" className="mt-0">
                <Card className="border-0 shadow-sm">
                  <CardHeader className="pb-3 flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-base">学生列表</CardTitle>
                      <CardDescription className="text-xs">
                        共 {classStudents.length} 名学生
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <div className="relative">
                        <Search className="size-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          placeholder="搜索学生姓名/账号"
                          value={searchKeyword}
                          onChange={(e) => setSearchKeyword(e.target.value)}
                          className="pl-8 h-9 text-sm w-48"
                        />
                      </div>
                      <AddStudentDialog
                        grade={selectedClass.grade}
                        onAdd={handleAddStudent}
                      />
                      <ExcelImportDialog />
                      <Button variant="outline" size="sm">
                        <Download className="size-3.5 mr-1" />
                        导出
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="w-full overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border/60 bg-muted/30">
                            <th className="text-left font-medium text-muted-foreground px-4 py-2.5 text-xs uppercase tracking-wide">
                              姓名
                            </th>
                            <th className="text-left font-medium text-muted-foreground px-4 py-2.5 text-xs uppercase tracking-wide">
                              账号
                            </th>
                            <th className="text-left font-medium text-muted-foreground px-4 py-2.5 text-xs uppercase tracking-wide">
                              班级
                            </th>
                            <th className="text-left font-medium text-muted-foreground px-4 py-2.5 text-xs uppercase tracking-wide">
                              创建时间
                            </th>
                            <th className="text-left font-medium text-muted-foreground px-4 py-2.5 text-xs uppercase tracking-wide">
                              完成率
                            </th>
                            <th className="text-right font-medium text-muted-foreground px-4 py-2.5 text-xs uppercase tracking-wide">
                              操作
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredStudents.map((s, i) => (
                            <tr
                              key={s.id}
                              className="border-b border-border/40 last:border-0 hover:bg-muted/20"
                            >
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-2.5">
                                  <div className="size-7 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-xs font-medium shrink-0">
                                    {s.name.charAt(0)}
                                  </div>
                                  <span className="font-medium">{s.name}</span>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-muted-foreground font-mono text-xs">
                                {s.account}
                              </td>
                              <td className="px-4 py-3 text-muted-foreground">{s.className}</td>
                              <td className="px-4 py-3 text-muted-foreground">{s.createdAt}</td>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-2">
                                  <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
                                    <div
                                      className={`h-full rounded-full ${
                                        s.completionRate >= 80
                                          ? 'bg-emerald-500'
                                          : s.completionRate >= 50
                                            ? 'bg-amber-500'
                                            : 'bg-rose-500'
                                      }`}
                                      style={{ width: `${s.completionRate}%` }}
                                    />
                                  </div>
                                  <span className="text-xs tabular-nums w-10">{s.completionRate}%</span>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-right">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="size-7">
                                      <MoreHorizontal className="size-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end" className="w-36">
                                    <DropdownMenuItem
                                      className="text-xs cursor-pointer"
                                      onClick={() => handleResetPassword(s.name)}
                                    >
                                      <RefreshCw className="size-3.5 mr-2" />
                                      重置密码
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="text-xs cursor-pointer">
                                      <MoveRight className="size-3.5 mr-2" />
                                      调整班级
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      className="text-xs text-rose-600 cursor-pointer"
                                      onClick={() => handleDeleteStudent(s.id)}
                                    >
                                      <Trash2 className="size-3.5 mr-2" />
                                      移除学生
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {filteredStudents.length === 0 && (
                        <div className="py-12 text-center">
                          <Eye className="size-10 mx-auto text-muted-foreground/30 mb-2" />
                          <p className="text-sm text-muted-foreground">暂无匹配的学生</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="groups" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedClass.groups.map((group, idx) => {
                    const groupStudents = students.filter((s) =>
                      group.studentIds.includes(s.id),
                    );
                    return (
                      <Card key={group.id} className="border-0 shadow-sm">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-base flex items-center gap-2">
                              <span className={`size-2.5 rounded-full ${group.color}`} />
                              {group.name}
                            </CardTitle>
                            <Badge variant="outline" className="text-xs">
                              {groupStudents.length} 人
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-wrap gap-2 mb-3">
                            {groupStudents.map((s) => (
                              <div
                                key={s.id}
                                className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-muted/50 text-sm"
                              >
                                <div className="size-5 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-[10px]">
                                  {s.name.charAt(0)}
                                </div>
                                <span className="text-xs">{s.name}</span>
                              </div>
                            ))}
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="flex-1">
                              <UserPlus className="size-3.5 mr-1" />
                              添加成员
                            </Button>
                            <Button variant="outline" size="sm" className="flex-1">
                              <UserMinus className="size-3.5 mr-1" />
                              管理成员
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}

                  {/* 创建小组卡片 */}
                  <Card className="border-0 shadow-sm border-2 border-dashed border-border/60 bg-transparent">
                    <CardContent className="p-6 h-full flex flex-col items-center justify-center text-center">
                      <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-3">
                        <Plus className="size-6 text-primary" />
                      </div>
                      <h3 className="text-sm font-semibold mb-1">创建小组</h3>
                      <p className="text-xs text-muted-foreground mb-3">
                        将学生分组，便于开展项目式学习
                      </p>
                      <Button size="sm" variant="outline">
                        <Plus className="size-3.5 mr-1" />
                        新建小组
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </section>
        </div>
      </main>
    </div>
  );
}

// 添加学生弹窗
function AddStudentDialog({
  grade,
  onAdd,
}: {
  grade: string;
  onAdd: (name: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');

  const handleSubmit = () => {
    if (!name.trim()) {
      toast.info('请输入学生姓名');
      return;
    }
    onAdd(name.trim());
    setName('');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <UserPlus className="size-3.5 mr-1" />
          添加学生
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>添加学生</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label>学生姓名</Label>
            <Input
              placeholder="请输入学生姓名"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label>
              账号
              <span className="text-muted-foreground text-xs ml-1">（系统自动生成）</span>
            </Label>
            <Input
              disabled
              value={name ? `${name}_${grade.charAt(0)}g` : ''}
              className="bg-muted/50"
            />
          </div>
          <div className="space-y-1.5">
            <Label>
              初始密码
              <span className="text-muted-foreground text-xs ml-1">（默认 123456）</span>
            </Label>
            <Input disabled value="123456" className="bg-muted/50 font-mono" />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">取消</Button>
          </DialogClose>
          <Button onClick={handleSubmit}>确认添加</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Excel 导入弹窗
function ExcelImportDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Upload className="size-3.5 mr-1" />
          Excel 导入
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>批量导入学生</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="p-4 rounded-xl bg-muted/30 border border-border/60 space-y-2">
            <h4 className="text-sm font-semibold flex items-center gap-2">
              <FileSpreadsheet className="size-4 text-primary" />
              导入说明
            </h4>
            <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
              <li>请使用 Excel 模板填写学生信息</li>
              <li>必填字段：姓名、学号</li>
              <li>支持 .xlsx / .xls 格式</li>
              <li>单次最多导入 200 名学生</li>
            </ul>
          </div>

          <div className="border-2 border-dashed border-border/60 rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
            <Upload className="size-8 mx-auto text-muted-foreground/50 mb-2" />
            <p className="text-sm text-muted-foreground mb-1">
              点击或拖拽文件到此处上传
            </p>
            <p className="text-xs text-muted-foreground">支持 .xlsx / .xls</p>
          </div>

          <Button variant="outline" size="sm" className="w-full" onClick={() => toast.info('模板下载中…')}>
            <Download className="size-3.5 mr-1" />
            下载导入模板
          </Button>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">取消</Button>
          </DialogClose>
          <Button
            onClick={() => {
              toast.success('导入成功，共 25 名学生');
              setOpen(false);
            }}
          >
            开始导入
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

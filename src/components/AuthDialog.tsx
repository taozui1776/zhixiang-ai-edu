import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  User,
  School,
  GraduationCap,
  Lock,
  UserPlus,
  LogIn,
  ArrowLeft,
  Sparkles,
  BookOpen,
  FlaskConical,
  Target,
  Cpu,
} from 'lucide-react';
import { useTeacherAuth, type SchoolStage } from '@/context/TeacherAuthContext';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import Image from '@/components/ui/image';

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultRole?: 'teacher' | 'student';
}

const TEACHER_STAGE_OPTIONS: { value: SchoolStage; label: string }[] = [
  { value: 'primary', label: '小学' },
  { value: 'junior', label: '初中' },
  { value: 'senior', label: '高中' },
  { value: 'all', label: '全学段' },
];

const STUDENT_GRADE_OPTIONS = [
  { value: 'G3', label: '三年级' },
  { value: 'G4', label: '四年级' },
  { value: 'G5', label: '五年级' },
  { value: 'G6', label: '六年级' },
  { value: 'G7', label: '七年级' },
  { value: 'G8', label: '八年级' },
  { value: 'G10', label: '高一' },
  { value: 'G11', label: '高二' },
];

const MASCOT_IMG = 'https://aka.doubaocdn.com/s/FTGHri7UGK';

export default function AuthDialog({
  open,
  onOpenChange,
  defaultRole,
}: AuthDialogProps) {
  const { login, register } = useTeacherAuth();
  const [step, setStep] = useState<'role' | 'login' | 'register'>('role');
  const [role, setRole] = useState<'teacher' | 'student'>(defaultRole ?? 'teacher');

  // 登录表单
  const [loginAccount, setLoginAccount] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // 注册表单
  const [regAccount, setRegAccount] = useState('');
  const [regName, setRegName] = useState('');
  const [regSchool, setRegSchool] = useState('');
  const [regStage, setRegStage] = useState<SchoolStage>('primary');
  const [regGrade, setRegGrade] = useState('G3');
  const [regClassName, setRegClassName] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPassword2, setRegPassword2] = useState('');
  const [regLoading, setRegLoading] = useState(false);

  // 弹窗打开时重置到角色选择
  useEffect(() => {
    if (open) {
      setStep('role');
      setLoginAccount('');
      setLoginPassword('');
      if (defaultRole) setRole(defaultRole);
    }
  }, [open, defaultRole]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginAccount.trim() || !loginPassword) {
      toast.error('请输入账号和密码');
      return;
    }
    setLoginLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    const result = login(role, loginAccount.trim(), loginPassword);
    setLoginLoading(false);
    if (result.success) {
      toast.success(result.message);
      onOpenChange(false);
      setLoginAccount('');
      setLoginPassword('');
    } else {
      toast.error(result.message);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regAccount.trim() || !regName.trim() || !regSchool.trim() || !regPassword) {
      toast.error('请填写完整信息');
      return;
    }
    if (regPassword.length < 6) {
      toast.error('密码长度至少 6 位');
      return;
    }
    if (regPassword !== regPassword2) {
      toast.error('两次输入的密码不一致');
      return;
    }
    setRegLoading(true);
    await new Promise((r) => setTimeout(r, 600));

    let result;
    if (role === 'teacher') {
      result = register('teacher', {
        role: 'teacher',
        account: regAccount.trim(),
        name: regName.trim(),
        school: regSchool.trim(),
        stage: regStage,
        password: regPassword,
      } as Parameters<typeof register>[1]);
    } else {
      const gradeInfo = STUDENT_GRADE_OPTIONS.find((g) => g.value === regGrade);
      result = register('student', {
        role: 'student',
        account: regAccount.trim(),
        name: regName.trim(),
        school: regSchool.trim(),
        grade: regGrade,
        gradeName: gradeInfo?.label ?? '',
        className: regClassName.trim() || undefined,
        password: regPassword,
      } as Parameters<typeof register>[1]);
    }

    setRegLoading(false);
    if (result.success) {
      toast.success(result.message);
      onOpenChange(false);
      // 清空表单
      setRegAccount('');
      setRegName('');
      setRegSchool('');
      setRegPassword('');
      setRegPassword2('');
      setRegClassName('');
    } else {
      toast.error(result.message);
    }
  };

  const selectRole = (r: 'teacher' | 'student') => {
    setRole(r);
    setStep('login');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px] p-0 overflow-hidden">
        {/* 顶部渐变 Banner */}
        <div className="relative bg-gradient-to-r from-primary/10 via-purple-500/10 to-cyan-500/10 p-6 pb-4">
          <div className="absolute right-6 top-4 size-20 opacity-20">
            <Image src={MASCOT_IMG} alt="智象" className="w-full h-full object-contain" />
          </div>
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
              <span className="size-7 rounded-lg bg-primary/20 flex items-center justify-center">
                <Sparkles className="size-4 text-primary" />
              </span>
              {step === 'role' ? '选择身份' : role === 'teacher' ? '教师中心' : '学生中心'}
            </DialogTitle>
            <DialogDescription>
              {step === 'role'
                ? '请选择你的身份，开启智象 AI 学习之旅'
                : role === 'teacher'
                ? '登录后可使用备课管理、学情看板等教师专属功能'
                : '登录后查看你的学习进度与实验记录'}
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-6 pt-4">
          <AnimatePresence mode="wait">
            {/* 步骤 1：角色选择 */}
            {step === 'role' && (
              <motion.div
                key="role"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12 }}
                transition={{ duration: 0.25 }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
              >
                {/* 老师卡片 */}
                <button
                  onClick={() => selectRole('teacher')}
                  className="group relative text-left p-5 rounded-2xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100/50 hover:border-blue-400 hover:shadow-lg transition-all duration-300"
                >
                  <div className="size-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white mb-3 shadow-md shadow-blue-500/30">
                    <GraduationCap className="size-6" />
                  </div>
                  <h3 className="text-lg font-bold text-blue-900 mb-1">我是老师</h3>
                  <p className="text-xs text-blue-700/70 leading-relaxed mb-3">
                    教师备课、课堂授课、学情分析
                  </p>
                  <div className="flex flex-wrap gap-1">
                    <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-blue-200/60 text-blue-800">
                      课程库
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-blue-200/60 text-blue-800">
                      AI 备课
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-blue-200/60 text-blue-800">
                      学情看板
                    </span>
                  </div>
                </button>

                {/* 学生卡片 */}
                <button
                  onClick={() => selectRole('student')}
                  className="group relative text-left p-5 rounded-2xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-emerald-100/50 hover:border-emerald-400 hover:shadow-lg transition-all duration-300"
                >
                  <div className="size-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white mb-3 shadow-md shadow-emerald-500/30">
                    <BookOpen className="size-6" />
                  </div>
                  <h3 className="text-lg font-bold text-emerald-900 mb-1">我是学生</h3>
                  <p className="text-xs text-emerald-700/70 leading-relaxed mb-3">
                    课程学习、实验探索、素养测评
                  </p>
                  <div className="flex flex-wrap gap-1">
                    <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-emerald-200/60 text-emerald-800">
                      AI 实验室
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-emerald-200/60 text-emerald-800">
                      编程
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-emerald-200/60 text-emerald-800">
                      训练
                    </span>
                  </div>
                </button>
              </motion.div>
            )}

            {/* 步骤 2/3：登录 / 注册 */}
            {(step === 'login' || step === 'register') && (
              <motion.div
                key="form"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.25 }}
                className="space-y-4"
              >
                {/* 返回角色选择 */}
                <button
                  onClick={() => setStep('role')}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="size-3" />
                  选择其他身份
                </button>

                <Tabs
                  value={step}
                  onValueChange={(v) => setStep(v as 'login' | 'register')}
                >
                  <TabsList className="grid grid-cols-2 w-full mb-5">
                    <TabsTrigger value="login" className="gap-1.5">
                      <LogIn className="size-3.5" />
                      登录
                    </TabsTrigger>
                    <TabsTrigger value="register" className="gap-1.5">
                      <UserPlus className="size-3.5" />
                      注册
                    </TabsTrigger>
                  </TabsList>

                  {/* 登录 */}
                  <TabsContent value="login" className="mt-0">
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="login-account">账号 / 手机号</Label>
                        <div className="relative">
                          <User className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            id="login-account"
                            value={loginAccount}
                            onChange={(e) => setLoginAccount(e.target.value)}
                            placeholder={`请输入${role === 'teacher' ? '教师' : '学生'}账号`}
                            className="pl-9"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="login-password">密码</Label>
                        <div className="relative">
                          <Lock className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            id="login-password"
                            type="password"
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                            placeholder="请输入密码"
                            className="pl-9"
                          />
                        </div>
                      </div>
                      <Button
                        type="submit"
                        className={`w-full ${role === 'student' ? 'bg-emerald-600 hover:bg-emerald-700' : ''}`}
                        disabled={loginLoading}
                      >
                        {loginLoading && (
                          <span className="size-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                        )}
                        {role === 'teacher' ? '登录教师中心' : '登录学生中心'}
                      </Button>
                      <p className="text-xs text-center text-muted-foreground">
                        还没有账号？{' '}
                        <button
                          type="button"
                          onClick={() => setStep('register')}
                          className="text-primary hover:underline font-medium"
                        >
                          立即注册
                        </button>
                      </p>
                    </form>
                  </TabsContent>

                  {/* 注册 */}
                  <TabsContent value="register" className="mt-0">
                    <form onSubmit={handleRegister} className="space-y-3">
                      <div className="space-y-1.5">
                        <Label htmlFor="reg-account">账号</Label>
                        <div className="relative">
                          <User className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            id="reg-account"
                            value={regAccount}
                            onChange={(e) => setRegAccount(e.target.value)}
                            placeholder="设置一个账号"
                            className="pl-9"
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="reg-name">{role === 'teacher' ? '姓名' : '昵称'}</Label>
                        <div className="relative">
                          <User className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            id="reg-name"
                            value={regName}
                            onChange={(e) => setRegName(e.target.value)}
                            placeholder={role === 'teacher' ? '真实姓名' : '你的昵称'}
                            className="pl-9"
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="reg-school">学校</Label>
                        <div className="relative">
                          <School className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            id="reg-school"
                            value={regSchool}
                            onChange={(e) => setRegSchool(e.target.value)}
                            placeholder="所在学校名称"
                            className="pl-9"
                          />
                        </div>
                      </div>

                      {role === 'teacher' ? (
                        <div className="space-y-1.5">
                          <Label>所教学段</Label>
                          <Select value={regStage} onValueChange={(v) => setRegStage(v as SchoolStage)}>
                            <SelectTrigger>
                              <SelectValue placeholder="选择学段" />
                            </SelectTrigger>
                            <SelectContent>
                              {TEACHER_STAGE_OPTIONS.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value}>
                                  {opt.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1.5">
                            <Label>年级</Label>
                            <Select value={regGrade} onValueChange={setRegGrade}>
                              <SelectTrigger>
                                <SelectValue placeholder="选择年级" />
                              </SelectTrigger>
                              <SelectContent>
                                {STUDENT_GRADE_OPTIONS.map((opt) => (
                                  <SelectItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-1.5">
                            <Label htmlFor="reg-class">班级（选填）</Label>
                            <Input
                              id="reg-class"
                              value={regClassName}
                              onChange={(e) => setRegClassName(e.target.value)}
                              placeholder="如 3 班"
                            />
                          </div>
                        </div>
                      )}

                      <div className="space-y-1.5">
                        <Label htmlFor="reg-password">设置密码</Label>
                        <div className="relative">
                          <Lock className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            id="reg-password"
                            type="password"
                            value={regPassword}
                            onChange={(e) => setRegPassword(e.target.value)}
                            placeholder="至少 6 位"
                            className="pl-9"
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="reg-password2">确认密码</Label>
                        <div className="relative">
                          <Lock className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            id="reg-password2"
                            type="password"
                            value={regPassword2}
                            onChange={(e) => setRegPassword2(e.target.value)}
                            placeholder="再次输入密码"
                            className="pl-9"
                          />
                        </div>
                      </div>
                      <Button
                        type="submit"
                        className={`w-full mt-2 ${role === 'student' ? 'bg-emerald-600 hover:bg-emerald-700' : ''}`}
                        disabled={regLoading}
                      >
                        {regLoading && (
                          <span className="size-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                        )}
                        注册{role === 'teacher' ? '教师' : '学生'}账号
                      </Button>
                      <p className="text-xs text-center text-muted-foreground">
                        已有账号？{' '}
                        <button
                          type="button"
                          onClick={() => setStep('login')}
                          className="text-primary hover:underline font-medium"
                        >
                          立即登录
                        </button>
                      </p>
                    </form>
                  </TabsContent>
                </Tabs>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 底部功能说明 */}
        {step === 'role' && (
          <div className="px-6 pb-5 pt-2 border-t border-border/50 bg-muted/20">
            <p className="text-[11px] text-muted-foreground text-center">
              智象平台 · 让每一节 AI 通识课都能动手 · 数据本地安全存储
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

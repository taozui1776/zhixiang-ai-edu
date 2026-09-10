import { useState, type FormEvent } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { Eye, EyeOff, User, Lock, LogIn, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTeacherAuth } from '@/context/TeacherAuthContext';
import { toast } from 'sonner';
import Image from '@/components/ui/image';
const LOGO_URL = 'https://aka.doubaocdn.com/s/FTGHri7UGK';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, login, register } = useTeacherAuth();
  const [username, setUsername] = useState('teacher');
  const [password, setPassword] = useState('123456');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const from = (location.state as any)?.from || '/';

  if (isLoggedIn) {
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      toast.error('请输入账号和密码');
      return;
    }

    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 600));

    // 演示账号：优先登录，不存在则自动注册
    let result = login('teacher', username, password);
    if (!result.success && username === 'teacher' && password === '123456') {
      register('teacher', {
        role: 'teacher',
        account: 'teacher',
        name: '演示教师',
        school: '希沃-智象体验学校',
        stage: 'all',
        password: '123456',
      });
      result = login('teacher', username, password);
    }
    if (result.success) {
      toast.success('登录成功，欢迎回来！');
      navigate(from, { replace: true });
    } else {
      toast.error(result.message + '（演示账号：teacher / 123456）');
    }
    setIsLoading(false);
  };

  const fillDemoAccount = () => {
    setUsername('teacher');
    setPassword('123456');
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 relative overflow-hidden flex items-center justify-center p-4">
      {/* 背景装饰光斑 */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-400/20 rounded-full blur-3xl" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-purple-400/20 rounded-full blur-3xl" />
      <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-cyan-400/10 rounded-full blur-3xl" />

      {/* 电路线纹理 */}
      <svg
        className="absolute inset-0 w-full h-full opacity-5"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      <div className="relative z-10 w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* 左侧品牌区 */}
        <div className="hidden lg:flex flex-col gap-8 text-white pr-8">
          <div className="flex items-center gap-4">
            <div className="size-20 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-xl">
              <Image src={LOGO_URL} alt="智象Logo" className="size-14 object-contain" />
            </div>
            <div>
              <h1 className="text-4xl font-bold tracking-tight">智象</h1>
              <p className="text-white/70 text-lg">AI 人工智能通识教育平台</p>
            </div>
          </div>

          <h2 className="text-2xl font-semibold leading-relaxed">
            让每一节 AI 通识课
            <br />
            都能动手做
          </h2>

          <div className="space-y-4">
            {[
              '对标国家 AI 通识教育指南',
              '课程 + 工具 + 硬件一站式教学',
              'AI 备课助手，一键生成教案',
              '支持多品牌硬件接入',
            ].map((text) => (
              <div key={text} className="flex items-center gap-3 text-white/90">
                <div className="size-6 rounded-full bg-white/10 flex items-center justify-center">
                  <Sparkles className="size-3.5" />
                </div>
                <span>{text}</span>
              </div>
            ))}
          </div>

          <p className="text-white/40 text-sm mt-auto pt-8">© 2026 智象教育 · 版本 V2.0</p>
        </div>

        {/* 右侧登录卡 */}
        <Card className="bg-white/95 backdrop-blur-xl border-0 shadow-2xl rounded-2xl">
          <CardContent className="p-8 md:p-10">
            {/* 移动端 Logo */}
            <div className="lg:hidden flex flex-col items-center mb-8">
              <div className="size-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center mb-3 shadow-lg">
                <Image src={LOGO_URL} alt="智象Logo" className="size-10 object-contain" />
              </div>
              <h2 className="text-xl font-bold text-foreground">希沃-智象AI人工智能教育平台</h2>
            </div>

            <h3 className="text-2xl font-bold text-foreground mb-1">教师登录</h3>
            <p className="text-muted-foreground text-sm mb-8">欢迎回来，请登录您的教师账号</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">账号</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="请输入账号"
                    className="pl-10 h-12"
                    autoComplete="username"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">密码</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="请输入密码"
                    className="pl-10 pr-10 h-12"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label={showPassword ? '隐藏密码' : '显示密码'}
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded border-border" defaultChecked />
                  <span className="text-muted-foreground">记住账号</span>
                </label>
                <a
                  href="#"
                  className="text-primary hover:underline"
                  onClick={(e) => {
                    e.preventDefault();
                    toast.info('请联系学校管理员重置密码');
                  }}
                >
                  忘记密码？
                </a>
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-base font-medium bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    登录中…
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <LogIn className="size-4" />
                    登 录
                  </span>
                )}
              </Button>
            </form>

            {/* 演示账号提示 */}
            <div className="mt-6 p-4 bg-primary/5 border border-primary/10 rounded-xl">
              <div className="flex items-start gap-3">
                <Badge
                  variant="outline"
                  className="shrink-0 border-primary/30 text-primary bg-primary/5"
                >
                  演示账号
                </Badge>
                <div className="flex-1 text-sm space-y-1">
                  <div className="text-foreground">
                    教师：<code className="font-mono bg-muted px-1.5 py-0.5 rounded">teacher</code>{' '}
                    /{' '}
                    <code className="font-mono bg-muted px-1.5 py-0.5 rounded">123456</code>
                  </div>
                  <button
                    onClick={fillDemoAccount}
                    className="text-primary text-xs hover:underline"
                  >
                    一键填入演示账号
                  </button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

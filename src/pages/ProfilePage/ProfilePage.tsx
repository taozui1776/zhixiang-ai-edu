import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Lock,
  Heart,
  BookOpen,
  Bell,
  School,
  Calendar,
  Shield,
  ChevronRight,
  Eye,
  EyeOff,
  Download,
  Clock,
  Cpu,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSubscription, PLAN_LABELS } from '@/hooks/use-subscription';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { MOCK_COURSE_SUMMARY } from '@/data/course-summary';
import { useFavorites } from '@/hooks/useTeacherData';
import Image from '@/components/ui/image';
import { getAiConfig, saveAiConfig, testAiConnection, type AiConfig } from '@/lib/ai-client';
import { useLocation } from 'react-router-dom';

interface FavoriteCourse {
  id: string;
  title: string;
  category: string;
  lessons: number;
  duration: string;
}

interface TeachRecord {
  id: string;
  date: string;
  className: string;
  courseName: string;
  lessonTitle: string;
  duration: number;
  status: '已完成' | '进行中' | '未开始';
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { subscription, plan } = useSubscription();
  const [activeTab, setActiveTab] = useState('info');
  const { favoriteIds, toggleFavorite } = useFavorites();
  const [teachHistory, setTeachHistory] = useState<TeachRecord[]>([]);

  // AI 设置状态
  const [aiConfig, setAiConfig] = useState<AiConfig>({ apiKey: '', baseURL: '', model: '' });
  const [showApiKey, setShowApiKey] = useState(false);
  const [testingConnection, setTestingConnection] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null);

  // URL 参数 tab 自动切换
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (tab === 'ai') {
      setActiveTab('ai');
    }
  }, [location.search]);

  // 加载 AI 配置
  useEffect(() => {
    const cfg = getAiConfig();
    setAiConfig(cfg);
  }, []);

  // 根据收藏 ID 从课程数据中取完整信息
  const favoriteCourses = favoriteIds
    .map((id) => MOCK_COURSE_SUMMARY.find((c) => c.id === id))
    .filter(Boolean) as typeof MOCK_COURSE_SUMMARY;

  // 从 localStorage 加载授课记录
  useEffect(() => {
    try {
      const histRaw = localStorage.getItem('zhixiang_teach_history');
      if (histRaw) {
        const hist = JSON.parse(histRaw);
        setTeachHistory(Array.isArray(hist) ? hist : []);
      }
    } catch {
      setTeachHistory([]);
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-50/60">
      <main className="max-w-5xl mx-auto px-4 md:px-6 py-6">
        {/* 顶部个人卡 */}
        <Card className="border-0 shadow-sm mb-5 overflow-hidden bg-gradient-to-r from-slate-900 to-indigo-900 text-white">
          <CardContent className="p-6">
            <div className="flex items-center gap-5">
              <div className="size-20 rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold shrink-0 shadow-lg shadow-indigo-900/30">
                王
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl font-bold">王老师</h1>
                <p className="text-white/70 text-sm mt-0.5">中小学信息技术教师</p>
                <div className="flex items-center gap-3 mt-2 flex-wrap">
                  <Badge className="bg-white/15 text-white border-0">
                    <School className="size-3 mr-1" />
                    实验中学
                  </Badge>
                  <Badge className="bg-emerald-500/80 text-white border-0">
                     <Shield className="size-3 mr-1" />
                     {PLAN_LABELS[plan]}
                   </Badge>
                   <span className="text-xs text-white/60 flex items-center gap-1">
                     <Clock className="size-3" />
                     有效期至 {subscription.expireAt}
                   </span>
                  <span className="text-xs text-white/60 flex items-center gap-1">
                    <Calendar className="size-3" />
                    注册于 2024-09-01
                  </span>
                </div>
              </div>
               <div className="text-right hidden md:flex flex-col gap-2 items-end">
                 <p className="text-3xl font-bold text-white">126</p>
                 <p className="text-xs text-white/60">累计授课时长</p>
                 <Button
                   size="sm"
                   variant="outline"
                   className="bg-white/10 text-white border-white/20 hover:bg-white/20 hover:text-white"
                   onClick={() => navigate('/pricing')}
                 >
                   升级版本
                   <ChevronRight className="size-3 ml-1" />
                 </Button>
               </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <div className="px-4 pt-4 border-b border-border/40">
                <TabsList className="h-auto p-1 bg-muted/30 w-full md:w-auto rounded-xl mb-0">
                  <TabsTrigger
                    value="info"
                    className="data-[state=active]:bg-white data-[state=active]:shadow-sm h-auto py-2 px-4 text-sm"
                  >
                    <User className="size-4 mr-1.5" />
                    个人信息
                  </TabsTrigger>
                  <TabsTrigger
                    value="password"
                    className="data-[state=active]:bg-white data-[state=active]:shadow-sm h-auto py-2 px-4 text-sm"
                  >
                    <Lock className="size-4 mr-1.5" />
                    修改密码
                  </TabsTrigger>
                  <TabsTrigger
                    value="favorites"
                    className="data-[state=active]:bg-white data-[state=active]:shadow-sm h-auto py-2 px-4 text-sm"
                  >
                    <Heart className="size-4 mr-1.5" />
                    我的收藏
                  </TabsTrigger>
                  <TabsTrigger
                    value="history"
                    className="data-[state=active]:bg-white data-[state=active]:shadow-sm h-auto py-2 px-4 text-sm"
                  >
                    <BookOpen className="size-4 mr-1.5" />
                    授课记录
                  </TabsTrigger>
                   <TabsTrigger
                     value="notifications"
                     className="data-[state=active]:bg-white data-[state=active]:shadow-sm h-auto py-2 px-4 text-sm"
                   >
                     <Bell className="size-4 mr-1.5" />
                     通知设置
                   </TabsTrigger>
                   <TabsTrigger
                     value="ai"
                     className="data-[state=active]:bg-white data-[state=active]:shadow-sm h-auto py-2 px-4 text-sm"
                   >
                     <Cpu className="size-4 mr-1.5" />
                     AI 设置
                   </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="info" className="mt-0 p-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <ProfileField label="姓名" value="王老师" />
                  <ProfileField label="账号" value="wangteacher" />
                  <ProfileField label="学校" value="实验中学" />
                  <ProfileField label="角色" value="教师" />
                  <ProfileField label="手机号" value="138****8888" />
                  <ProfileField label="注册时间" value="2024-09-01" />
                </div>
                <div className="mt-5 pt-5 border-t border-border/40">
                  <Button>
                    <User className="size-4 mr-1.5" />
                    编辑资料
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="password" className="mt-0 p-5">
                <ChangePasswordForm />
              </TabsContent>

              <TabsContent value="favorites" className="mt-0 p-5">
                {favoriteCourses.length === 0 ? (
                  <div className="py-12 text-center">
                    <Heart className="size-10 text-muted-foreground/20 mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground mb-2">暂无收藏课程</p>
                    <p className="text-xs text-muted-foreground/70 mb-4">去课程库收藏感兴趣的课程吧</p>
                    <Button variant="outline" size="sm" onClick={() => navigate('/courses')}>
                      去课程库
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {favoriteCourses.map((c, i) => (
                    <motion.div
                      key={c.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.05 }}
                    >
                      <Card
                        className="border border-border/60 shadow-none hover:border-primary/30 hover:shadow-sm transition-all overflow-hidden"
                      >
                        <div
                          className="flex items-center gap-3 p-4 cursor-pointer"
                          onClick={() => navigate(`/courses/${c.id}`)}
                        >
                          <div className="size-12 rounded-xl overflow-hidden shrink-0 bg-muted">
                            <Image src={c.coverImage} alt={c.title} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm truncate">{c.title}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-[10px] h-4">
                                {c.category}
                              </Badge>
                              <span className="text-xs text-muted-foreground">{c.totalLessons} 课时</span>
                            </div>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(c.id);
                              toast.success('已取消收藏');
                            }}
                            className="shrink-0 size-7 rounded-full hover:bg-rose-50 flex items-center justify-center transition-colors"
                            aria-label="取消收藏"
                          >
                            <Heart className="size-4 text-rose-500 fill-rose-500" />
                          </button>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="history" className="mt-0">
                <div className="p-4 pb-0 flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">共 {teachHistory.length} 条授课记录</p>
                  <Button variant="outline" size="sm">
                    <Download className="size-3.5 mr-1" />
                    导出
                  </Button>
                </div>
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
                          状态
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {teachHistory.map((r) => (
                        <tr
                          key={r.id}
                          className="border-b border-border/40 last:border-0 hover:bg-muted/20"
                        >
                          <td className="px-4 py-3 font-mono text-xs">{r.date}</td>
                          <td className="px-4 py-3">{r.className}</td>
                          <td className="px-4 py-3">
                            <p className="font-medium">{r.courseName}</p>
                            <p className="text-xs text-muted-foreground">{r.lessonTitle}</p>
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">1 课时</td>
                          <td className="px-4 py-3 tabular-nums">{r.duration} 分钟</td>
                          <td className="px-4 py-3">
                            <Badge className="bg-emerald-100 text-emerald-700 border-0 text-[10px]">
                              {r.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="p-4 flex items-center justify-between border-t border-border/40">
                  <p className="text-xs text-muted-foreground">显示 1-6 条，共 42 条</p>
                  <div className="flex gap-1">
                    <Button variant="outline" size="sm" disabled>上一页</Button>
                    <Button variant="outline" size="sm" className="bg-primary/10 border-primary/20 text-primary">1</Button>
                    <Button variant="outline" size="sm">2</Button>
                    <Button variant="outline" size="sm">3</Button>
                    <Button variant="outline" size="sm">下一页</Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="notifications" className="mt-0 p-5">
                <div className="space-y-1">
                  <NotificationItem
                    title="上课提醒"
                    description="课程开始前 15 分钟发送提醒"
                    defaultChecked={true}
                  />
                  <Separator className="my-2" />
                  <NotificationItem
                    title="学生作业提交"
                    description="学生提交作业后立即通知"
                    defaultChecked={true}
                  />
                  <Separator className="my-2" />
                  <NotificationItem
                    title="系统公告"
                    description="接收平台更新和重要通知"
                    defaultChecked={true}
                  />
                  <Separator className="my-2" />
                  <NotificationItem
                    title="课程更新"
                    description="有新课程上线时通知"
                    defaultChecked={false}
                  />
                  <Separator className="my-2" />
                  <NotificationItem
                    title="学情周报"
                    description="每周一发送班级学情报告"
                    defaultChecked={true}
                  />
                  <Separator className="my-2" />
                  <NotificationItem
                    title="营销通知"
                    description="促销活动和优惠信息"
                    defaultChecked={false}
                  />
                </div>
              </TabsContent>

              <TabsContent value="ai" className="mt-0 p-5">
                <div className="space-y-5">
                  <div>
                    <h3 className="text-base font-semibold flex items-center gap-2">
                      <Sparkles className="size-4 text-primary" />
                      AI 服务配置
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      部署到外部服务器后，AI功能需要配置您自己的 API Key。推荐使用
                      <span className="text-primary font-medium"> DeepSeek </span>
                      （便宜、中文效果好），也支持任何 OpenAI 兼容的 API 服务（如通义千问、Kimi 等）。
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">API Key</Label>
                      <div className="relative">
                        <Input
                          type={showApiKey ? 'text' : 'password'}
                          value={aiConfig.apiKey}
                          onChange={(e) => setAiConfig({ ...aiConfig, apiKey: e.target.value })}
                          placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxx"
                          className="pr-10 h-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowApiKey(!showApiKey)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showApiKey ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                        </button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        您的 API Key 仅保存在本地浏览器中，不会上传到任何服务器。
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">API Base URL</Label>
                      <Input
                        value={aiConfig.baseURL}
                        onChange={(e) => setAiConfig({ ...aiConfig, baseURL: e.target.value })}
                        placeholder="https://api.deepseek.com"
                        className="h-10"
                      />
                      <p className="text-xs text-muted-foreground">
                        默认 DeepSeek。若使用其他服务，请填入对应的 OpenAI 兼容地址，如
                        <code className="mx-1 px-1 py-0.5 bg-muted rounded text-[11px]">
                          https://dashscope.aliyuncs.com/compatible-mode/v1
                        </code>
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Model</Label>
                      <Input
                        value={aiConfig.model}
                        onChange={(e) => setAiConfig({ ...aiConfig, model: e.target.value })}
                        placeholder="deepseek-chat"
                        className="h-10"
                      />
                      <p className="text-xs text-muted-foreground">
                        默认 deepseek-chat，可修改为其他模型名称。
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <Button
                      onClick={() => {
                        saveAiConfig(aiConfig);
                        toast.success('AI 设置已保存');
                        setTestResult(null);
                      }}
                      className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                    >
                      <CheckCircle2 className="size-4 mr-1.5" />
                      保存设置
                    </Button>
                    <Button
                      variant="outline"
                      disabled={testingConnection || !aiConfig.apiKey}
                      onClick={async () => {
                        setTestingConnection(true);
                        setTestResult(null);
                        const ok = await testAiConnection(aiConfig);
                        setTestResult(ok ? 'success' : 'error');
                        setTestingConnection(false);
                        if (ok) toast.success('API 连接正常');
                        else toast.error('API 连接失败，请检查配置');
                      }}
                    >
                      {testingConnection ? (
                        <>
                          <Loader2 className="size-4 mr-1.5 animate-spin" />
                          测试中…
                        </>
                      ) : (
                        '测试连接'
                      )}
                    </Button>
                    {testResult === 'success' && (
                      <span className="text-xs text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 className="size-4" /> 连接成功
                      </span>
                    )}
                    {testResult === 'error' && (
                      <span className="text-xs text-rose-600 flex items-center gap-1">
                        <AlertCircle className="size-4" /> 连接失败
                      </span>
                    )}
                  </div>

                  <div className="mt-4 p-4 rounded-xl bg-indigo-50/60 border border-indigo-100">
                    <p className="text-xs text-indigo-800 font-medium mb-2">💡 小提示</p>
                    <ul className="text-[11px] text-indigo-700/80 space-y-1 list-disc list-inside">
                      <li>DeepSeek 注册地址：platform.deepseek.com（新用户送额度）</li>
                      <li>也可使用阿里云通义千问、月之暗面 Kimi 等支持 OpenAI 兼容格式的服务</li>
                      <li>API Key 只保存在您当前浏览器的 localStorage 中，清除浏览器数据会丢失</li>
                    </ul>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

function ProfileField({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-muted-foreground font-normal">{label}</Label>
      <div className="px-3 py-2.5 rounded-lg bg-muted/30 border border-border/50 text-sm">
        {value}
      </div>
    </div>
  );
}

function ChangePasswordForm() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.info('请填写完整密码信息');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('两次输入的新密码不一致');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('新密码长度不能少于 6 位');
      return;
    }
    toast.success('密码修改成功，请重新登录');
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="max-w-md space-y-4">
      <div className="space-y-1.5">
        <Label>当前密码</Label>
        <div className="relative">
          <Input
            type={showOld ? 'text' : 'password'}
            placeholder="请输入当前密码"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="pr-9"
          />
          <button
            type="button"
            onClick={() => setShowOld(!showOld)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showOld ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>新密码</Label>
        <div className="relative">
          <Input
            type={showNew ? 'text' : 'password'}
            placeholder="请输入新密码（至少 6 位）"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="pr-9"
          />
          <button
            type="button"
            onClick={() => setShowNew(!showNew)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showNew ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>确认新密码</Label>
        <div className="relative">
          <Input
            type={showConfirm ? 'text' : 'password'}
            placeholder="请再次输入新密码"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="pr-9"
          />
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showConfirm ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
      </div>

      <div className="pt-2">
        <Button onClick={handleSubmit}>
          <Lock className="size-4 mr-1.5" />
          确认修改
        </Button>
      </div>
    </div>
  );
}

function NotificationItem({
  title,
  description,
  defaultChecked,
}: {
  title: string;
  description: string;
  defaultChecked?: boolean;
}) {
  const [checked, setChecked] = useState(defaultChecked ?? false);
  return (
    <div className="flex items-center justify-between py-2">
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <Switch
        checked={checked}
        onCheckedChange={setChecked}
      />
    </div>
  );
}

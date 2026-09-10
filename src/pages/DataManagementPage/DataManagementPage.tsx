import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Database,
  Trash2,
  Download,
  ShieldCheck,
  HardDrive,
  Clock,
  Heart,
  BookOpen,
  FlaskConical,
  User,
  AlertTriangle,
  CheckCircle2,
  Info,
  FileText,
  Cpu,
  Eye,
  Lock,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import Image from '@/components/ui/image';

const MASCOT_IMG = 'https://aka.doubaocdn.com/s/FTGHri7UGK';

interface IStorageItem {
  key: string;
  label: string;
  icon: typeof Heart;
  description: string;
  sizeKB: number;
  count: number;
}

export default function DataManagementPage() {
  const [storageItems, setStorageItems] = useState<IStorageItem[]>([]);
  const [totalSize, setTotalSize] = useState(0);
  const [settings, setSettings] = useState({
    aiDataForTraining: false,
    autoClearOld: true,
    hardwareDataPersist: false,
    anonymousUsage: true,
  });

  useEffect(() => {
    // 计算本地存储使用情况（模拟数据 + 真实 localStorage 读取）
    const items: IStorageItem[] = [
      {
        key: 'favorites',
        label: '我的收藏',
        icon: Heart,
        description: '收藏的课程列表',
        sizeKB: 2.4,
        count: 5,
      },
      {
        key: 'prepare-notes',
        label: '备课笔记',
        icon: BookOpen,
        description: '各课程的备课笔记与标记状态',
        sizeKB: 8.7,
        count: 12,
      },
      {
        key: 'teach-history',
        label: '授课记录',
        icon: Clock,
        description: '历史授课记录与进度',
        sizeKB: 15.3,
        count: 28,
      },
      {
        key: 'experiment-results',
        label: '实验数据',
        icon: FlaskConical,
        description: 'AI 实验结果与传感器数据',
        sizeKB: 32.1,
        count: 45,
      },
      {
        key: 'user-profile',
        label: '用户信息',
        icon: User,
        description: '登录状态与个人偏好设置',
        sizeKB: 1.2,
        count: 1,
      },
    ];
    setStorageItems(items);
    setTotalSize(items.reduce((s, i) => s + i.sizeKB, 0));
  }, []);

  const handleClearItem = (item: IStorageItem) => {
    // 预留：真实实现时调用 localStorage.removeItem
    toast.success(`已清除「${item.label}」数据`);
    setStorageItems((prev) =>
      prev.map((i) => (i.key === item.key ? { ...i, sizeKB: 0, count: 0 } : i)),
    );
    setTotalSize((prev) => prev - item.sizeKB);
  };

  const handleClearAll = () => {
    // 预留：真实实现时遍历清除
    toast.success('已清除所有本地数据');
    setStorageItems((prev) => prev.map((i) => ({ ...i, sizeKB: 0, count: 0 })));
    setTotalSize(0);
  };

  const handleExportData = () => {
    // 预留：导出 JSON
    const data = {
      exportedAt: new Date().toISOString(),
      storageItems,
      settings,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `zhixiang-data-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('数据已导出');
  };

  const handleToggleSetting = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
    toast.info('设置已更新');
  };

  const usedPercent = Math.min(100, (totalSize / 5000) * 100); // 5MB 限制

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-purple-50/30">
      <main className="max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-12">
        {/* 顶部标题 */}
        <div className="flex items-center gap-3 mb-8">
          <div className="size-12 rounded-xl bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center shadow-lg shadow-primary/20">
            <Database className="size-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">数据管理</h1>
            <p className="text-sm text-muted-foreground mt-1">
              管理本地存储的数据，查看使用情况，导出或清除数据
            </p>
          </div>
        </div>

        <Tabs defaultValue="storage" className="space-y-6">
          <TabsList className="bg-card border border-border/60 p-1">
            <TabsTrigger value="storage" className="gap-1.5">
              <HardDrive className="size-3.5" />
              存储空间
            </TabsTrigger>
            <TabsTrigger value="privacy" className="gap-1.5">
              <ShieldCheck className="size-3.5" />
              隐私设置
            </TabsTrigger>
            <TabsTrigger value="policy" className="gap-1.5">
              <FileText className="size-3.5" />
              数据政策
            </TabsTrigger>
          </TabsList>

          {/* 存储空间 */}
          <TabsContent value="storage" className="space-y-6">
            {/* 总览卡 */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-foreground">本地存储使用</span>
                  <span className="text-sm text-muted-foreground tabular-nums">
                    {totalSize.toFixed(1)} KB / 5 MB
                  </span>
                </div>
                <Progress value={usedPercent} className="h-2 mb-4" />
                <div className="flex flex-wrap gap-3">
                  <Button variant="secondary" size="sm" onClick={handleExportData} className="gap-1.5">
                    <Download className="size-3.5" />
                    导出数据
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm" className="gap-1.5">
                        <Trash2 className="size-3.5" />
                        清除全部数据
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>确认清除所有数据？</AlertDialogTitle>
                        <AlertDialogDescription>
                          此操作将删除本地存储的所有数据，包括收藏、备课笔记、授课记录等，且无法恢复。
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>取消</AlertDialogCancel>
                        <AlertDialogAction onClick={handleClearAll} className="bg-destructive hover:bg-destructive/90">
                          确认清除
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>

            {/* 数据分类列表 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">数据分类</CardTitle>
                <CardDescription className="text-xs">
                  各类数据的存储占用与操作
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border/60">
                  {storageItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.key} className="p-4 flex items-center gap-4 hover:bg-accent/20 transition-colors">
                        <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <Icon className="size-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-medium text-foreground">{item.label}</h3>
                            <Badge variant="outline" className="text-[10px]">
                              {item.count} 条
                            </Badge>
                          </div>
                          <div className="text-xs text-muted-foreground mt-0.5">
                            {item.description}
                          </div>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <span className="text-sm font-medium text-foreground/70 tabular-nums w-16 text-right">
                            {item.sizeKB.toFixed(1)} KB
                          </span>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                            onClick={() => handleClearItem(item)}
                          >
                            <Trash2 className="size-3.5 mr-1" />
                            清除
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 隐私设置 */}
          <TabsContent value="privacy" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">隐私与数据设置</CardTitle>
                <CardDescription className="text-xs">
                  控制你的数据如何被使用
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                {[
                  {
                    key: 'autoClearOld' as const,
                    title: '自动清除旧数据',
                    desc: '超过 90 天的授课记录与实验数据自动清除',
                    icon: Clock,
                  },
                  {
                    key: 'hardwareDataPersist' as const,
                    title: '硬件数据持久化',
                    desc: '关闭后硬件传感器数据仅实时显示，不保存到本地（推荐课堂使用）',
                    icon: Cpu,
                  },
                  {
                    key: 'aiDataForTraining' as const,
                    title: '允许 AI 使用数据改进',
                    desc: '允许平台使用你的使用数据来改进 AI 模型质量（匿名化处理）',
                    icon: Eye,
                    warn: true,
                  },
                  {
                    key: 'anonymousUsage' as const,
                    title: '匿名使用统计',
                    desc: '帮助我们了解平台使用情况以优化体验（不包含个人信息）',
                    icon: Info,
                  },
                ].map((s) => {
                  const Icon = s.icon;
                  return (
                    <div key={s.key} className="flex items-start gap-3">
                      <div className="size-9 rounded-lg bg-muted flex items-center justify-center shrink-0 mt-0.5">
                        <Icon className={`size-4 ${s.warn ? 'text-amber-500' : 'text-muted-foreground'}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <Label className="text-sm font-medium text-foreground cursor-pointer">
                              {s.title}
                            </Label>
                            <p className="text-xs text-muted-foreground mt-0.5">{s.desc}</p>
                          </div>
                          <Switch
                            checked={settings[s.key]}
                            onCheckedChange={() => handleToggleSetting(s.key)}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* 隐私原则 */}
            <Card className="bg-emerald-50/50 border-emerald-200/60">
              <CardContent className="p-5 flex items-start gap-3">
                <div className="size-10 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <ShieldCheck className="size-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-emerald-800 mb-1.5">智象数据隐私原则</h3>
                  <ul className="space-y-1 text-sm text-emerald-700/80">
                    <li className="flex items-start gap-1.5">
                      <CheckCircle2 className="size-3.5 shrink-0 mt-0.5" />
                      <span>课堂数据默认本地存储，不上传云端</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <CheckCircle2 className="size-3.5 shrink-0 mt-0.5" />
                      <span>硬件数据实时处理，不持久化存储</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <CheckCircle2 className="size-3.5 shrink-0 mt-0.5" />
                      <span>AI 调用数据不用于模型训练</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <CheckCircle2 className="size-3.5 shrink-0 mt-0.5" />
                      <span>所有数据可一键导出、一键清除</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 数据政策 */}
          <TabsContent value="policy" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">数据与隐私政策</CardTitle>
                <CardDescription className="text-xs">
                  更新于 2025-12-01
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5 text-sm text-foreground/75 leading-relaxed">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">1. 数据收集范围</h3>
                  <p>
                    智象平台重视用户隐私。本平台以本地优先为设计原则，大部分教学功能（课程浏览、备课、授课模式、实验操作）的数据均存储在您的浏览器本地，不上传至服务器。
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-2">2. 本地存储的数据</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>用户登录信息（账号、姓名、学校）</li>
                    <li>课程收藏与授课历史记录</li>
                    <li>备课笔记与备课状态标记</li>
                    <li>AI 实验结果与传感器数据</li>
                    <li>个人偏好与设置</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-2">3. 硬件数据处理</h3>
                  <p>
                    硬件（主控板、传感器、AI 视觉模块等）连接后产生的数据默认仅在浏览器中实时处理，不会自动上传。您可以选择将数据导出为 CSV 或保存到本地存储。
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-2">4. AI 调用数据</h3>
                  <p>
                    使用 AI 工具（备课助手、代码生成、通识问答等）时，您输入的内容会发送至 AI 服务以生成结果。这些数据仅用于完成当前请求，不会被用于模型训练或其他用途。
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-2">5. 数据控制权</h3>
                  <p>
                    您始终拥有自己数据的控制权。您可以在本页面查看各类数据的存储情况，随时导出为 JSON 格式备份，或一键清除所有本地数据。
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

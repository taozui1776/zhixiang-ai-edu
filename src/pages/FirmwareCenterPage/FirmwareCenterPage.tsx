import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Download,
  Clock,
  CheckCircle2,
  AlertCircle,
  Cpu,
  Eye,
  Zap,
  ChevronRight,
  History,
  Sparkles,
  FileText,
  ShieldCheck,
  Info,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import Image from '@/components/ui/image';
import { toast } from 'sonner';

const MASCOT_IMG = 'https://aka.doubaocdn.com/s/FTGHri7UGK';

interface IFirmwareInfo {
  id: string;
  hardwareName: string;
  hardwareType: string;
  icon: typeof Cpu;
  currentVersion: string;
  latestVersion: string;
  releaseDate: string;
  size: string;
  changeLog: string[];
  status: 'up-to-date' | 'update-available' | 'beta';
}

const FIRMWARE_LIST: IFirmwareInfo[] = [
  {
    id: 'zx-mainboard-fw',
    hardwareName: '智象 AI 主控板',
    hardwareType: '主控板',
    icon: Cpu,
    currentVersion: '1.0.0',
    latestVersion: '1.2.0',
    releaseDate: '2025-12-15',
    size: '1.2 MB',
    changeLog: [
      '新增 AI 视觉模块原生支持',
      '优化 Wi-Fi 连接稳定性',
      '修复部分传感器读数不准的问题',
      '新增 3 个内置演示程序',
      '支持一键 OTA 升级',
    ],
    status: 'update-available',
  },
  {
    id: 'zx-vision-fw',
    hardwareName: '智象 AI 视觉模块',
    hardwareType: 'AI 视觉',
    icon: Eye,
    currentVersion: '0.8.2',
    latestVersion: '0.9.0',
    releaseDate: '2025-12-10',
    size: '856 KB',
    changeLog: [
      '新增文字识别（OCR）算法',
      '识别人脸准确率提升 15%',
      '优化低光环境识别效果',
      '新增一键批量训练模式',
    ],
    status: 'update-available',
  },
  {
    id: 'zx-voice-fw',
    hardwareName: '智象 AI 语音模块',
    hardwareType: '语音模块',
    icon: Zap,
    currentVersion: '1.0.0',
    latestVersion: '1.0.0',
    releaseDate: '2025-11-20',
    size: '512 KB',
    changeLog: ['首个正式发布版本', '支持 20 条自定义命令词', '低功耗待机模式'],
    status: 'up-to-date',
  },
];

/** 历史版本 */
const HISTORY_VERSIONS = [
  { version: '1.2.0', date: '2025-12-15', type: '稳定版' },
  { version: '1.1.0', date: '2025-10-28', type: '稳定版' },
  { version: '1.0.5', date: '2025-09-15', type: '稳定版' },
  { version: '1.0.0', date: '2025-08-01', type: '首发版' },
  { version: '0.9.0', date: '2025-07-10', type: '内测版' },
];

export default function FirmwareCenterPage() {
  const [updateDialog, setUpdateDialog] = useState(false);
  const [currentFirmware, setCurrentFirmware] = useState<IFirmwareInfo | null>(null);
  const [updating, setUpdating] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleStartUpdate = (fw: IFirmwareInfo) => {
    setCurrentFirmware(fw);
    setUpdateDialog(true);
  };

  const handleUpdate = async () => {
    setUpdating(true);
    setProgress(0);
    // 模拟更新进度（预留真实固件更新流程）
    for (let i = 0; i <= 100; i += 4) {
      await new Promise((r) => setTimeout(r, 120));
      setProgress(i);
    }
    setUpdating(false);
    toast.success('固件更新完成');
    setTimeout(() => setUpdateDialog(false), 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-purple-50/30">
      <main className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-12">
        {/* 顶部标题区 */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4">
            <Sparkles className="size-3.5" />
            固件中心
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            固件管理中心
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            一站式管理智象全系硬件的固件版本，自动检测更新、一键 OTA 升级、支持历史版本回退
          </p>
        </div>

        {/* 主要内容 */}
        <div className="space-y-8">
          {/* 支持的硬件列表 */}
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Cpu className="size-5 text-primary" />
                支持的硬件
              </CardTitle>
              <CardDescription className="text-sm">
                当前支持 3 款智象自有硬件的固件升级，更多型号陆续接入中
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border/60">
                {FIRMWARE_LIST.map((fw, idx) => {
                  const Icon = fw.icon;
                  return (
                    <motion.div
                      key={fw.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.08 }}
                      className="p-5 hover:bg-accent/20 transition-colors"
                    >
                      <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <div className="size-12 rounded-xl bg-gradient-to-br from-primary/10 to-purple-500/10 flex items-center justify-center shrink-0">
                          <Icon className="size-6 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-semibold text-foreground">{fw.hardwareName}</h3>
                            <Badge variant="outline" className="text-[10px]">
                              {fw.hardwareType}
                            </Badge>
                            {fw.status === 'update-available' && (
                              <Badge className="text-[10px] bg-amber-500 hover:bg-amber-600">
                                有更新
                              </Badge>
                            )}
                            {fw.status === 'up-to-date' && (
                              <Badge className="text-[10px] bg-emerald-500 hover:bg-emerald-600">
                                已是最新
                              </Badge>
                            )}
                            {fw.status === 'beta' && (
                              <Badge variant="outline" className="text-[10px] text-violet-600 border-violet-300">
                                Beta
                              </Badge>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1 flex flex-wrap gap-x-3 gap-y-1">
                            <span>最新版本 v{fw.latestVersion}</span>
                            <span>·</span>
                            <span>{fw.releaseDate} 发布</span>
                            <span>·</span>
                            <span>{fw.size}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => toast.info('更新日志展开（预留）')}
                          >
                            <FileText className="size-3.5 mr-1.5" />
                            更新日志
                          </Button>
                          {fw.status === 'update-available' && (
                            <Button size="sm" onClick={() => handleStartUpdate(fw)}>
                              <Download className="size-3.5 mr-1.5" />
                              立即更新
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* 更新日志摘要 */}
                      {fw.status === 'update-available' && (
                        <div className="mt-4 ml-0 md:ml-16 pl-0 md:pl-4 border-l-2 border-primary/20 py-1">
                          <div className="text-xs text-muted-foreground mb-1.5">
                            v{fw.latestVersion} 更新内容：
                          </div>
                          <ul className="space-y-0.5">
                            {fw.changeLog.map((item, i) => (
                              <li key={i} className="text-xs text-foreground/70 flex items-start gap-1.5">
                                <CheckCircle2 className="size-3 text-emerald-500 shrink-0 mt-0.5" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* 更新向导说明 + 历史版本 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <ShieldCheck className="size-5 text-primary" />
                  固件更新向导
                </CardTitle>
                <CardDescription className="text-sm">
                  安全、简单的 5 步更新流程
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { step: 1, title: '连接设备', desc: '通过 USB 或蓝牙连接硬件到电脑' },
                  { step: 2, title: '备份配置', desc: '自动备份设备配置与用户数据' },
                  { step: 3, title: '下载固件', desc: '从云端下载最新固件版本' },
                  { step: 4, title: '烧录固件', desc: '写入新固件，期间请勿断电' },
                  { step: 5, title: '验证完成', desc: '校验固件完整性，自动重启设备' },
                ].map((item) => (
                  <div key={item.step} className="flex items-start gap-3">
                    <div className="size-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-sm font-bold text-primary">
                      {item.step}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-foreground">{item.title}</div>
                      <div className="text-xs text-muted-foreground">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <History className="size-5 text-primary" />
                  历史版本
                </CardTitle>
                <CardDescription className="text-sm">
                  可回退到任意历史稳定版本
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border/60">
                  {HISTORY_VERSIONS.map((v, idx) => (
                    <div
                      key={v.version}
                      className="px-6 py-3 flex items-center justify-between hover:bg-accent/20 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="size-1.5 rounded-full bg-primary shrink-0" />
                        <div>
                          <div className="text-sm font-medium text-foreground">
                            v{v.version}
                          </div>
                          <div className="text-xs text-muted-foreground">{v.date}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-[10px]">
                          {v.type}
                        </Badge>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-xs h-7"
                          onClick={() => toast.info(`回退到 v${v.version}（预留）`)}
                        >
                          回退
                          <ChevronRight className="size-3.5 ml-1" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 即将推出提示 */}
          <Card className="bg-gradient-to-br from-primary/5 to-purple-500/5 border-primary/10">
            <CardContent className="p-8 flex flex-col md:flex-row items-center gap-6">
              <div className="size-20 shrink-0 rounded-2xl bg-white/60 backdrop-blur flex items-center justify-center shadow-sm">
                <Image src={MASCOT_IMG} alt="" className="size-16 object-contain" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-lg font-bold text-foreground mb-2">
                  更多硬件型号正在接入中
                </h3>
                <p className="text-sm text-muted-foreground mb-4 max-w-xl">
                  智象固件中心将持续支持更多第三方硬件品牌。掌控板、行空板、micro:bit、二哈识图等主流设备的固件管理功能即将开放。
                </p>
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  <Badge variant="outline">掌控板</Badge>
                  <Badge variant="outline">行空板</Badge>
                  <Badge variant="outline">micro:bit</Badge>
                  <Badge variant="outline">二哈识图</Badge>
                  <Badge variant="outline">+ 更多</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* 更新对话框 */}
      <Dialog open={updateDialog} onOpenChange={setUpdateDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>固件更新</DialogTitle>
            <DialogDescription>
              {currentFirmware &&
                `将 ${currentFirmware.hardwareName} 从 v${currentFirmware.currentVersion} 更新到 v${currentFirmware.latestVersion}`}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">更新进度</span>
                <span className="font-medium">{progress}%</span>
              </div>
              <Progress value={progress} />
            </div>
            <div className="text-xs text-muted-foreground flex items-start gap-2">
              <Info className="size-3.5 shrink-0 mt-0.5" />
              <span>更新过程中请勿断开设备连接。设备将自动重启 1-2 次，属于正常现象。</span>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setUpdateDialog(false)} disabled={updating}>
              取消
            </Button>
            <Button onClick={handleUpdate} disabled={updating} className="gap-2">
              {updating ? '更新中...' : '开始更新'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

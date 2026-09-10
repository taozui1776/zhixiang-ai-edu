import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Blocks,
  Code2,
  Package,
  ExternalLink,
  MonitorPlay,
  Sparkles,
  Lightbulb,
  X,
  BookOpen,
  PlayCircle,
  Cpu,
  Wifi,
  Info,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { MOCK_CODING_TOOLS, type ICodingTool } from '@/data/coding-lab';
import ProjectTemplatesSection from './sections/ProjectTemplatesSection';

type TabValue = 'graphical' | 'code' | 'external';

const TAB_CONFIG: Record<TabValue, { label: string; icon: typeof Blocks; desc: string }> = {
  graphical: { label: '图形化编程', icon: Blocks, desc: '拖拽积木，零基础入门' },
  code: { label: '代码编程', icon: Code2, desc: 'Python / C++ 代码实践' },
  external: { label: '外部工具', icon: Package, desc: '桌面软件与下载' },
};

// 分类映射
const GRAPHICAL_IDS = ['scratch', 'makecode', 'mindplus-online'];
const CODE_IDS = ['jupyterlite', 'thonny', 'mu-editor'];
const EXTERNAL_IDS = ['mindplus-desktop', 'mpythonx', 'canmv', 'kittenblock', 'mblock', 'openblock', 'phet'];

export default function CodingLabPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabValue>('graphical');
  const [showGuide, setShowGuide] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [hardwareStatus, setHardwareStatus] = useState<{ connected: boolean; deviceName?: string }>({
    connected: false,
  });

  // 从 localStorage 读取硬件连接状态
  useEffect(() => {
    const checkHardware = () => {
      try {
        const raw = localStorage.getItem('zhixiang_hardware_connected');
        if (raw) {
          const device = JSON.parse(raw);
          setHardwareStatus({ connected: true, deviceName: device.name });
        } else {
          setHardwareStatus({ connected: false });
        }
      } catch {
        setHardwareStatus({ connected: false });
      }
    };
    checkHardware();
    window.addEventListener('storage', checkHardware);
    return () => window.removeEventListener('storage', checkHardware);
  }, []);

  const { graphicalTools, codeTools, externalTools } = useMemo(() => {
    return {
      graphicalTools: MOCK_CODING_TOOLS.filter((t) => GRAPHICAL_IDS.includes(t.id)),
      codeTools: MOCK_CODING_TOOLS.filter((t) => CODE_IDS.includes(t.id)),
      externalTools: MOCK_CODING_TOOLS.filter((t) => EXTERNAL_IDS.includes(t.id)),
    };
  }, []);

  const toolsByTab: Record<TabValue, ICodingTool[]> = {
    graphical: graphicalTools,
    code: codeTools,
    external: externalTools,
  };

  return (
    <div className="min-h-screen bg-slate-50/60">
      {/* 顶部 Banner */}
      <div className="w-full bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(255_255_255_0.15),transparent_50%)]" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="bg-white/20 text-white border-0 backdrop-blur-sm mb-3">
              <Sparkles className="size-3 mr-1" />
              编程实验室
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
              从图形化到代码化，一站式编程学习
            </h1>
            <p className="text-white/80 max-w-2xl text-base">
              精选国内外优质编程工具，覆盖小学到高中全学段。图形化入门、Python 进阶、AI 视觉实践，
              搭配丰富的项目模板，让每个学生都能找到适合自己的编程起点。
            </p>
          </motion.div>
        </div>
      </div>

       <main className="max-w-7xl mx-auto px-4 md:px-6 py-8 space-y-8">
         {/* 硬件连接状态条 */}
         <motion.div
           initial={{ opacity: 0, y: -10 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.4, delay: 0.2 }}
         >
           <Card
             className={`border-0 shadow-sm overflow-hidden ${
               hardwareStatus.connected
                 ? 'bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/50'
                 : 'bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/50'
             }`}
           >
             <CardContent className="py-3 px-5 flex items-center justify-between">
               <div className="flex items-center gap-3">
                 <div
                   className={`size-9 rounded-xl flex items-center justify-center shrink-0 ${
                     hardwareStatus.connected
                       ? 'bg-emerald-500 text-white'
                       : 'bg-amber-500 text-white'
                   }`}
                 >
                   {hardwareStatus.connected ? (
                     <Wifi className="size-4" />
                   ) : (
                     <Cpu className="size-4" />
                   )}
                 </div>
                 <div>
                   <p className="text-sm font-semibold text-foreground">
                     {hardwareStatus.connected
                       ? `已连接 · ${hardwareStatus.deviceName}`
                       : '未连接硬件设备'}
                   </p>
                   <p className="text-xs text-muted-foreground">
                     {hardwareStatus.connected
                       ? '可以直接向设备发送代码或查看串口数据'
                       : '连接硬件后可以烧录代码、查看串口数据'}
                   </p>
                 </div>
               </div>
               <Button
                 size="sm"
                 variant={hardwareStatus.connected ? 'outline' : 'default'}
                 onClick={() => navigate('/hardware-connect')}
               >
                 {hardwareStatus.connected ? (
                   <>
                     <MonitorPlay className="size-3.5 mr-1.5" />
                     查看串口
                   </>
                 ) : (
                   <>
                     <Cpu className="size-3.5 mr-1.5" />
                     连接硬件
                   </>
                 )}
               </Button>
             </CardContent>
           </Card>
         </motion.div>

         {/* 工具分类 Tab */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold">编程工具</h2>
            <Button variant="outline" size="sm" onClick={() => setShowGuide(true)}>
              <Lightbulb className="size-4 mr-2 text-amber-500" />
              使用指引
            </Button>
          </div>

          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabValue)}>
            <TabsList className="h-auto p-1 bg-muted/50 w-full md:w-auto rounded-xl">
              {(Object.keys(TAB_CONFIG) as TabValue[]).map((key) => {
                const cfg = TAB_CONFIG[key];
                const Icon = cfg.icon;
                return (
                  <TabsTrigger
                    key={key}
                    value={key}
                    className="flex-1 md:flex-none data-[state=active]:bg-white data-[state=active]:shadow-sm h-auto py-2.5 px-4"
                  >
                    <Icon className="size-4 mr-2" />
                    <div className="text-left">
                      <div className="text-sm font-medium">{cfg.label}</div>
                      <div className="text-[10px] text-muted-foreground hidden md:block">
                        {cfg.desc}
                      </div>
                    </div>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            <TabsContent value="graphical" className="mt-6">
              <ToolsGrid tools={graphicalTools} showOpenMode />
            </TabsContent>
            <TabsContent value="code" className="mt-6">
              <ToolsGrid tools={codeTools} showOpenMode />
            </TabsContent>
            <TabsContent value="external" className="mt-6">
              <ToolsGrid tools={externalTools} externalOnly />
            </TabsContent>
          </Tabs>
        </section>

        {/* 编程项目模板 */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl font-bold">编程项目模板</h2>
              <p className="text-sm text-muted-foreground mt-1">
                精选经典入门项目，含代码示例和接线图，快速上手
              </p>
            </div>
          </div>
          <ProjectTemplatesSection
            selectedTemplate={selectedTemplate}
            setSelectedTemplate={setSelectedTemplate}
          />
        </section>

        {/* 硬件抽象层说明 */}
        <section>
          <Card className="border-0 shadow-sm bg-gradient-to-br from-primary/5 via-background to-accent/10">
            <CardContent className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row items-start gap-5">
                <div className="size-14 rounded-2xl bg-gradient-to-br from-primary to-violet-500 flex items-center justify-center shrink-0">
                  <Cpu className="size-7 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold mb-2">智象硬件抽象层</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    智象平台自研统一硬件适配层（HAL），一套 API 兼容 Arduino、micro:bit、行空板、
                    掌控板等多品牌主流硬件。学校已有硬件不浪费，统一平台统一管理，
                    降低教学成本，提升教学效率。
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {['Arduino', 'micro:bit', 'ESP32', '行空板', '掌控板', '树莓派'].map((h) => (
                      <Badge
                        key={h}
                        variant="outline"
                        className="bg-white/60 border-primary/20 text-primary"
                      >
                        ✓ {h}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      {/* 使用指引弹窗 */}
      <GuideDialog open={showGuide} onOpenChange={setShowGuide} />
    </div>
  );
}

function ToolsGrid({
  tools,
  showOpenMode = false,
  externalOnly = false,
}: {
  tools: ICodingTool[];
  showOpenMode?: boolean;
  externalOnly?: boolean;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {tools.map((tool, idx) => (
        <ToolCard
          key={tool.id}
          tool={tool}
          index={idx}
          showOpenMode={showOpenMode}
          externalOnly={externalOnly}
        />
      ))}
    </div>
  );
}

function ToolCard({
  tool,
  index,
  showOpenMode,
  externalOnly,
}: {
  tool: ICodingTool;
  index: number;
  showOpenMode: boolean;
  externalOnly: boolean;
}) {
  const [isLoading, setIsLoading] = useState(false);

  const openTool = () => {
    setIsLoading(true);
    // 模拟短暂加载后新窗口打开
    setTimeout(() => {
      window.open(tool.url, '_blank', 'noopener,noreferrer');
      setIsLoading(false);
    }, 300);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Card className="h-full border-0 shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
        <div className={`h-1.5 bg-gradient-to-r ${tool.accentColor}`} />
        <CardHeader className="pb-3">
          <div className="flex items-start gap-3">
            <div
              className={`size-12 rounded-xl bg-gradient-to-br ${tool.accentColor} flex items-center justify-center text-2xl shadow-sm shrink-0`}
            >
              {tool.logo}
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-base flex items-center gap-2">
                {tool.name}
                {tool.isOpenSource && (
                  <Badge
                    variant="outline"
                    className="text-[10px] h-5 px-1.5 font-normal bg-emerald-50 text-emerald-600 border-emerald-200"
                  >
                    开源
                  </Badge>
                )}
              </CardTitle>
              <CardDescription className="text-xs mt-0.5">
                {tool.englishName}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0 space-y-3">
          <p className="text-sm text-muted-foreground line-clamp-2">{tool.description}</p>

          <div className="flex flex-wrap gap-1.5">
            {tool.toolTypes.slice(0, 3).map((t) => (
              <Badge key={t} variant="outline" className="text-[11px] h-5 font-normal">
                {tool.toolTypes.length > 1 && t === 'hybrid' ? '图形化+代码' : t === 'graphical' ? '图形化' : t === 'python' ? 'Python' : t === 'aivision' ? 'AI视觉' : '仿真'}
              </Badge>
            ))}
            {tool.hardware && (
              <Badge variant="outline" className="text-[11px] h-5 font-normal">
                <Wifi className="size-2.5 mr-1" />
                {tool.hardware.split(' / ')[0]}
              </Badge>
            )}
          </div>

          <div className="pt-2 flex items-center justify-between">
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              {externalOnly ? (
                <>
                  <ExternalLink className="size-3" />
                  新窗口打开
                </>
              ) : tool.category === 'local' ? (
                <>
                  <MonitorPlay className="size-3" />
                  本地软件
                </>
              ) : (
                <>
                  <MonitorPlay className="size-3" />
                  在线可用
                </>
              )}
            </div>
            <Button size="sm" onClick={openTool} disabled={isLoading}>
              {isLoading ? (
                <>打开中…</>
              ) : (
                <>
                  <ExternalLink className="size-3.5 mr-1.5" />
                  {tool.category === 'local' ? '前往下载' : '打开工具'}
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function GuideDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lightbulb className="size-5 text-amber-500" />
            编程实验室使用指引
          </DialogTitle>
          <DialogDescription>快速上手智象编程实验室</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              {
                icon: Blocks,
                title: '图形化编程',
                desc: '拖拽积木块即可编程，适合零基础入门',
                color: 'from-orange-400 to-amber-500',
              },
              {
                icon: Code2,
                title: '代码编程',
                desc: 'Python / C++ 实时代码运行，进阶学习',
                color: 'from-blue-500 to-indigo-500',
              },
              {
                icon: Package,
                title: '外部工具',
                desc: '专业桌面软件下载，连接真实硬件',
                color: 'from-emerald-500 to-teal-500',
              },
            ].map((item, i) => (
              <div
                key={i}
                className="p-4 rounded-xl bg-muted/30 border border-border/60 text-center"
              >
                <div
                  className={`size-10 mx-auto mb-2 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center`}
                >
                  <item.icon className="size-5 text-white" />
                </div>
                <p className="text-sm font-semibold">{item.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold flex items-center gap-2">
              <BookOpen className="size-4 text-primary" />
              新手三步上手
            </h4>
            <div className="space-y-2">
              {[
                '选择你想学习的编程方式（图形化 / 代码），点击「打开工具」',
                '参考「编程项目模板」中的示例，完成第一个项目',
                '准备好硬件后，前往「硬件连接中心」连接设备，进行真实硬件实验',
              ].map((step, i) => (
                <div
                  key={i}
                  className="flex gap-3 p-3 rounded-lg bg-card border border-border/60"
                >
                  <div className="size-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0">
                    {i + 1}
                  </div>
                  <p className="text-sm text-foreground pt-0.5">{step}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
            <div className="flex gap-2">
              <Info className="size-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-sm text-amber-800">
                <p className="font-medium mb-1">温馨提示</p>
                <p className="text-amber-700/90">
                  部分在线工具为国外站点，首次加载可能稍慢；所有工具均支持新窗口打开使用。
                  连接硬件需要对应 USB 驱动和串口通信权限。
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

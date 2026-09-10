import { motion } from 'framer-motion';
import { useState } from 'react';
import {
  Cpu,
  Eye,
  Box,
  CircuitBoard,
  ShieldCheck,
  Zap,
  Puzzle,
  CheckCircle2,
  ArrowRight,
  Image as ImageIcon,
  Send,
  Sparkles,
  Layers,
  StepForward,
  Usb,
  Mic,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import SerialConsole from '@/components/SerialConsole';
import Image from '@/components/ui/image';
import {
  HARDWARE_CATEGORIES,
  getHardwareByCategory,
  type IHardware,
  type HardwareCategoryKey,
} from '@/data/hardware';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const STAGE_LABELS: Record<string, string> = {
  primary: '小学',
  junior: '初中',
  senior: '高中',
};

const STAGE_COLORS: Record<string, string> = {
  primary: 'bg-emerald-500/15 text-emerald-700 border-emerald-500/20',
  junior: 'bg-sky-500/15 text-sky-700 border-sky-500/20',
  senior: 'bg-violet-500/15 text-violet-700 border-violet-500/20',
};

const MASCOT_IMG = 'https://aka.doubaocdn.com/s/RUYRoCZ6Ts';

const CATEGORY_ICONS: Record<string, typeof Cpu> = {
  cpu: Cpu,
  eye: Eye,
  box: Box,
  chip: CircuitBoard,
};

// 两阶段路线图
const ROADMAP_STEPS = [
  {
    step: '第一阶段',
    title: '开放适配，快速接入',
    desc: '开放接入盛思、DFRobot、micro:bit 等主流教育硬件协议，让学校现有设备直接能用',
    items: ['掌控板 / 行空板原生支持', 'micro:bit MakeCode 整合', 'Gravity 传感器生态兼容', '二哈识图等 AI 模块接入'],
    color: 'from-blue-500 to-cyan-400',
  },
  {
    step: '第二阶段',
    title: '自有品牌，深度整合',
    desc: '推出智象专属教学硬件套件，与课程内容深度整合，打造一体化教学体验',
    items: ['智象 AI 学习主控板', '定制化传感器套件', '智能机器人套装', '平台-硬件一键联动'],
    color: 'from-purple-500 to-pink-500',
  },
];

const PLATFORM_FEATURES = [
  {
    icon: ShieldCheck,
    title: '硬件中立',
    desc: '平台不绑定特定硬件品牌，开放接入市场主流产品',
    color: 'from-blue-500 to-cyan-400',
  },
  {
    icon: Puzzle,
    title: '多品牌开放',
    desc: '盛思、DFRobot、micro:bit、嘉楠等主流品牌全面支持',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: Zap,
    title: '即插即用',
    desc: '统一的硬件接入协议，教学设备一键连接使用',
    color: 'from-amber-500 to-orange-400',
  },
];

function HardwareCard({ hw, index }: { hw: IHardware; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
    >
      <Card className="h-full overflow-hidden group hover:shadow-lg transition-all duration-300 border-border/60 bg-card hover:border-primary/30">
        {/* Image */}
        <div className="aspect-[4/3] overflow-hidden bg-gradient-to-br from-muted to-muted/50 relative">
          {hw.imageUrl ? (
            <Image
              src={hw.imageUrl}
              alt={hw.name}
              className="w-full h-full object-contain p-6 group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ImageIcon className="size-12 text-muted-foreground/30" />
            </div>
          )}
          <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
            {hw.stages.map((s) => (
              <Badge
                key={s}
                className={`text-[11px] backdrop-blur-sm border ${STAGE_COLORS[s]}`}
              >
                {STAGE_LABELS[s]}
              </Badge>
            ))}
          </div>
          <div className="absolute top-3 right-3">
            <Badge
              variant="secondary"
              className="text-[11px] bg-background/90 backdrop-blur-sm"
            >
              {hw.price}
            </Badge>
          </div>
        </div>

        <CardContent className="p-4 space-y-3">
          <div>
            <div className="flex items-baseline gap-1.5 mb-0.5 min-w-0">
              <h3 className="text-base font-bold truncate">{hw.name}</h3>
              {hw.model && (
                <span className="text-xs text-muted-foreground shrink-0">{hw.model}</span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">品牌：{hw.brand}</p>
          </div>

          <p className="text-sm text-foreground/80 line-clamp-2 leading-relaxed">
            {hw.tagline}
          </p>

          {hw.features && hw.features.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {hw.features.slice(0, 4).map((f) => (
                <Badge
                  key={f}
                  variant="outline"
                  className="text-[10px] py-0 h-4.5 border-border/60 font-normal"
                >
                  {f}
                </Badge>
              ))}
            </div>
          )}

          <div className="pt-1 border-t border-border/50">
            <div className="text-[11px] text-muted-foreground mb-1">适配编程工具</div>
            <div className="flex flex-wrap gap-1">
              {hw.programmingTools.map((tool) => (
                <Badge
                  key={tool}
                  variant="secondary"
                  className="text-[10px] py-0 h-4.5 font-normal"
                >
                  {tool}
                </Badge>
              ))}
            </div>
          </div>

          {hw.resourceNote && (
            <div className="flex items-center gap-1.5 text-[11px] text-primary">
              <Sparkles className="size-3 shrink-0" />
              <span>{hw.resourceNote}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function HardwarePage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'ecosystem' | 'console' | 'firmware' | 'own'>('ecosystem');
  const [partnerOpen, setPartnerOpen] = useState(false);
  const [partnerForm, setPartnerForm] = useState({
    company: '',
    contact: '',
    phone: '',
    product: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const handlePartnerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!partnerForm.company || !partnerForm.contact || !partnerForm.phone) {
      toast.error('请填写企业名称、联系人和联系电话');
      return;
    }
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 800));
    setSubmitting(false);
    toast.success('合作申请已提交，我们会尽快与您联系！');
    setPartnerOpen(false);
    setPartnerForm({ company: '', contact: '', phone: '', product: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="w-full bg-gradient-to-br from-cyan-500/10 via-background to-purple-500/10 py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <Badge className="mb-3 bg-primary/15 text-primary border-primary/20">
              <Cpu className="size-3 mr-1" />
              硬件生态
            </Badge>
            <h1 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">
              开放中立的 AI 教育硬件生态
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              智象平台坚持硬件中立原则，开放接入盛思、DFRobot、micro:bit 等主流教育硬件品牌。
              学校可根据自身条件灵活选择，让 AI 通识教育落地更轻松。
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-10">
        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as 'ecosystem' | 'console')}
          className="w-full"
        >
          <div className="flex justify-center mb-8">
            <TabsList className="bg-muted/60 p-1">
              <TabsTrigger value="ecosystem" className="gap-1.5 px-5">
                <Cpu className="size-3.5" />
                硬件生态
              </TabsTrigger>
              <TabsTrigger value="console" className="gap-1.5 px-5">
                <Usb className="size-3.5" />
                硬件连接中心
              </TabsTrigger>
              <TabsTrigger value="firmware" className="gap-1.5 px-5">
                <Layers className="size-3.5" />
                固件中心
              </TabsTrigger>
              <TabsTrigger value="own" className="gap-1.5 px-5">
                <Sparkles className="size-3.5" />
                智象自有硬件
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="ecosystem" className="mt-0 space-y-20">
        {/* 平台三大特性 */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
          {PLATFORM_FEATURES.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Card className="h-full border-border/60 bg-gradient-to-br from-card to-muted/30">
                  <CardContent className="p-6 space-y-3">
                    <div
                      className={`size-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white shadow-md`}
                    >
                      <Icon className="size-5" />
                    </div>
                    <h3 className="font-semibold text-lg">{item.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {item.desc}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </section>

        {/* 两阶段路线图 */}
        <section>
          <div className="text-center max-w-2xl mx-auto mb-10">
            <Badge
              variant="secondary"
              className="mb-3 bg-primary/10 text-primary border-primary/20"
            >
              <Layers className="size-3 mr-1" />
              发展路线
            </Badge>
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              开放适配 + 自有品牌两步走
            </h2>
            <p className="text-muted-foreground">
              先快速接入现有成熟硬件生态，再逐步推出深度整合的自有品牌硬件
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {ROADMAP_STEPS.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
              >
                <Card className="h-full overflow-hidden border-border/60">
                  <CardContent className="p-6 md:p-7 space-y-5">
                    <div className="flex items-center gap-3">
                      <div
                        className={`size-11 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white shadow-md`}
                      >
                        <StepForward className="size-5" />
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">{step.step}</div>
                        <h3 className="text-lg font-bold">{step.title}</h3>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                    <ul className="grid grid-cols-2 gap-2">
                      {step.items.map((it) => (
                        <li key={it} className="flex items-center gap-2 text-sm">
                          <CheckCircle2 className="size-4 text-primary shrink-0" />
                          <span className="text-foreground/80">{it}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 四大硬件分类 */}
        <section className="space-y-14">
          <div className="text-center max-w-2xl mx-auto">
            <Badge
              variant="secondary"
              className="mb-3 bg-primary/10 text-primary border-primary/20"
            >
              <Box className="size-3 mr-1" />
              生态全景
            </Badge>
            <h2 className="text-2xl md:text-3xl font-bold mb-3">全栈式硬件生态矩阵</h2>
            <p className="text-muted-foreground">
              从主控板到传感器，从 AI 模块到教学套装，覆盖 AI 通识教育全场景
            </p>
            <p className="text-xs text-muted-foreground mt-4">
              * 以上价格为参考市场价，仅供参考，以实际采购为准
            </p>
          </div>

          {HARDWARE_CATEGORIES.map((cat, catIndex) => {
            const Icon = CATEGORY_ICONS[cat.icon] || Cpu;
            const items = getHardwareByCategory(cat.key as HardwareCategoryKey);
            // 响应式列数: 主控板6个→3列, AI模块3个→3列, 套装4个→2列, 传感器2个→2列
            const gridCols =
              items.length >= 5
                ? 'md:grid-cols-2 lg:grid-cols-3'
                : items.length >= 4
                  ? 'md:grid-cols-2'
                  : items.length >= 3
                    ? 'md:grid-cols-2 lg:grid-cols-3'
                    : 'md:grid-cols-2';
            return (
              <div key={cat.key}>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-3 mb-5 pb-3 border-b border-border/60"
                >
                  <div className="size-10 rounded-xl bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-white shadow-sm">
                    <Icon className="size-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{cat.title}</h3>
                    <p className="text-sm text-muted-foreground">{cat.subtitle}</p>
                  </div>
                  <Badge variant="outline" className="ml-auto text-xs border-border/60">
                    {items.length} 款
                  </Badge>
                </motion.div>

                <div className={`grid grid-cols-1 ${gridCols} gap-5`}>
                  {items.map((hw, i) => (
                    <HardwareCard key={hw.id} hw={hw} index={catIndex * 10 + i} />
                  ))}
                </div>
              </div>
            );
          })}
        </section>

         {/* 自有品牌预告 */}
         <section className="rounded-2xl overflow-hidden border border-primary/20 bg-gradient-to-br from-primary/5 via-purple-500/5 to-cyan-500/5">
           <div className="p-8 md:p-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
             <motion.div
               initial={{ opacity: 0, x: -20 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.6 }}
             >
               <Badge
                 variant="secondary"
                 className="mb-3 bg-primary/15 text-primary border-primary/20"
               >
                 <Sparkles className="size-3 mr-1" />
                 智象自有品牌
               </Badge>
               <h2 className="text-2xl md:text-3xl font-bold mb-3">
                 智象自有教学硬件，研发中
               </h2>
               <p className="text-muted-foreground leading-relaxed mb-5">
                 专为人工智能通识教育定制的智象教学硬件套件正在研发中，
                 将深度整合平台课程资源，为师生提供更流畅的一体化教学体验。
               </p>
               <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Card className="border-border/50 bg-card/60">
                  <CardContent className="p-4">
                    <Cpu className="size-5 text-primary mb-2" />
                    <div className="text-sm font-medium">AI 学习主控板</div>
                    <div className="text-xs text-muted-foreground">入门-进阶全覆盖</div>
                  </CardContent>
                </Card>
                <Card className="border-border/50 bg-card/60">
                  <CardContent className="p-4">
                    <CircuitBoard className="size-5 text-primary mb-2" />
                    <div className="text-sm font-medium">传感器套件</div>
                    <div className="text-xs text-muted-foreground">即插即用扩展</div>
                  </CardContent>
                </Card>
                <Card className="border-border/50 bg-card/60">
                  <CardContent className="p-4">
                    <Box className="size-5 text-primary mb-2" />
                    <div className="text-sm font-medium">机器人套装</div>
                    <div className="text-xs text-muted-foreground">项目式学习</div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>

             <motion.div
               initial={{ opacity: 0, x: 20 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.6, delay: 0.1 }}
               className="flex flex-col items-center lg:items-end"
             >
               <div className="relative w-56 h-56 md:w-64 md:h-64">
                 <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/30 to-purple-400/20 rounded-full blur-2xl" />
                 <Image
                   src={MASCOT_IMG}
                   alt="智象自有硬件吉祥物"
                   className="relative z-10 w-full h-full object-contain drop-shadow-xl"
                 />
               </div>
               <Button size="lg" onClick={() => setPartnerOpen(true)} className="mt-2 gap-1">
                 预约咨询 <ArrowRight className="size-4" />
               </Button>
             </motion.div>
          </div>
        </section>

        {/* 合作接入 CTA */}
        <section className="py-10 md:py-12 px-6 md:px-10 rounded-2xl bg-gradient-to-r from-primary/10 via-purple-500/10 to-cyan-500/10 border border-primary/20 flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-xl md:text-2xl font-bold mb-2">硬件品牌合作</h3>
            <p className="text-sm text-muted-foreground">
              如果您是教育硬件厂商，欢迎接入智象平台，共同推动 AI 通识教育发展
            </p>
          </div>
          <Button size="lg" onClick={() => setPartnerOpen(true)}>
            申请合作接入
            <ArrowRight className="size-4" />
          </Button>
        </section>
          </TabsContent>

          <TabsContent value="console" className="mt-0">
            <div className="space-y-6">
              {/* 硬件连接中心介绍 */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white overflow-hidden relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-purple-500/10" />
                <div className="relative z-10 max-w-2xl">
                  <Badge className="mb-3 bg-cyan-500/20 text-cyan-300 border-cyan-500/30">
                    <Usb className="size-3 mr-1" />
                    Web Serial 直连
                  </Badge>
                  <h2 className="text-2xl md:text-3xl font-bold mb-3">
                    浏览器端硬件连接中心
                  </h2>
                  <p className="text-slate-300 leading-relaxed mb-4">
                    基于 Web Serial API，无需安装任何驱动或软件，打开浏览器即可直连硬件设备。
                    支持掌控板、行空板、micro:bit 等主流教育硬件，实现零部署硬件编程与数据采集。
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="border-white/20 text-white/80">零安装</Badge>
                    <Badge variant="outline" className="border-white/20 text-white/80">零驱动</Badge>
                    <Badge variant="outline" className="border-white/20 text-white/80">实时通信</Badge>
                    <Badge variant="outline" className="border-white/20 text-white/80">模拟模式</Badge>
                  </div>
                </div>
              </motion.div>

              {/* 串口控制台 */}
              <Card className="border-border/60">
                <CardContent className="p-5 md:p-6">
                  <SerialConsole />
                </CardContent>
              </Card>

              {/* 使用说明 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    step: '01',
                    title: '连接硬件',
                    desc: '使用 USB 数据线将硬件设备连接到电脑，确认设备已开机',
                    icon: Usb,
                  },
                  {
                    step: '02',
                    title: '选择串口',
                    desc: '点击「连接硬件」按钮，在弹出的串口选择器中选择对应设备',
                    icon: Cpu,
                  },
                  {
                    step: '03',
                    title: '数据交互',
                    desc: '发送指令、接收传感器数据、调试程序，一切在浏览器内完成',
                    icon: Zap,
                  },
                ].map((s, i) => (
                  <motion.div
                    key={s.step}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                  >
                    <Card className="h-full border-border/60 bg-card">
                      <CardContent className="p-5 space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                            <s.icon className="size-4 text-primary" />
                          </div>
                          <span className="text-sm font-mono text-muted-foreground">第 {s.step} 步</span>
                        </div>
                        <h4 className="font-semibold">{s.title}</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* 固件中心 Tab */}
          <TabsContent value="firmware" className="mt-0">
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-primary/10 to-violet-500/10 border border-primary/20"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <Badge className="mb-3 bg-primary/15 text-primary border-primary/20">
                      <Layers className="size-3 mr-1" />
                      固件中心
                    </Badge>
                    <h2 className="text-2xl md:text-3xl font-bold mb-2">固件管理与更新</h2>
                    <p className="text-sm text-muted-foreground max-w-xl">
                      支持多款教育硬件的固件下载、更新与回退，保持设备始终处于最佳状态
                    </p>
                  </div>
                  <Badge variant="outline" className="w-fit gap-1.5 px-3 py-1.5 text-xs">
                    <Sparkles className="size-3" />
                    即将推出
                  </Badge>
                </div>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { name: '行空板 K10', latest: 'v3.1.2', date: '2025-11-20', size: '4.2 MB' },
                  { name: '掌控板 2.0', latest: 'v2.5.0', date: '2025-10-15', size: '2.8 MB' },
                  { name: 'micro:bit V2', latest: 'v0256', date: '2025-09-30', size: '1.5 MB' },
                ].map((fw) => (
                  <Card key={fw.name} className="border-border/60 hover:border-primary/30 transition-colors">
                    <CardContent className="p-5">
                      <h3 className="font-semibold text-foreground mb-1">{fw.name}</h3>
                      <div className="text-xs text-muted-foreground mb-3">
                        最新版本：<span className="text-primary font-medium">{fw.latest}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                        <span>{fw.date}</span>
                        <span>{fw.size}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="secondary" className="flex-1" onClick={() => toast.info('固件下载（预留）')}>
                          下载固件
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card className="border-border/60">
                <CardHeader>
                  <CardTitle className="text-base">固件更新向导</CardTitle>
                  <CardDescription className="text-xs">
                    简单 5 步完成固件更新
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                    {['连接设备', '备份数据', '下载固件', '烧录固件', '验证完成'].map((step, i) => (
                      <div key={step} className="text-center p-4 rounded-lg bg-muted/40">
                        <div className="size-8 mx-auto mb-2 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                          {i + 1}
                        </div>
                        <div className="text-xs font-medium text-foreground">{step}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="text-center">
                <Button variant="secondary" onClick={() => navigate('/hardware/firmware')} className="gap-2">
                  查看完整固件中心
                  <ArrowRight className="size-4" />
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* 智象自有硬件 Tab */}
          <TabsContent value="own" className="mt-0">
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="p-6 md:p-10 rounded-2xl bg-gradient-to-br from-primary/10 via-purple-500/10 to-cyan-500/10 border border-primary/20 overflow-hidden relative"
              >
                <div className="absolute right-0 top-0 w-64 h-64 bg-gradient-to-br from-cyan-400/20 to-transparent rounded-full blur-3xl" />
                <div className="relative z-10 max-w-2xl">
                  <Badge className="mb-3 bg-white/90 text-primary border-primary/20 backdrop-blur">
                    <Sparkles className="size-3 mr-1" />
                    智象自有品牌
                  </Badge>
                  <h2 className="text-2xl md:text-4xl font-bold mb-3 text-foreground">
                    专为 AI 通识教育定制
                  </h2>
                  <p className="text-muted-foreground leading-relaxed mb-5">
                    智象自有教学硬件深度整合平台课程资源，从主控板到 AI 模块，从传感器到机器人套件，
                    为中小学 AI 通识教育提供一体化的硬件解决方案。
                  </p>
                  <Badge variant="outline" className="text-xs gap-1.5 px-3 py-1">
                    即将推出 · 敬请期待
                  </Badge>
                </div>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {[
                  {
                    name: '智象 AI 主控板',
                    price: '¥99 - 149',
                    tagline: '对标行空板 K10，入门-进阶全覆盖',
                    features: ['ESP32-S3', '240×240 彩屏', 'Wi-Fi + 蓝牙', '支持图形化 + Python'],
                    icon: Cpu,
                    date: '2026 Q1',
                  },
                  {
                    name: '智象 AI 视觉模块',
                    price: '¥199 - 229',
                    tagline: '对标二哈识图，本地图像识别',
                    features: ['K210 芯片', '本地分类/检测', '摄像头一体', '无需联网'],
                    icon: Eye,
                    date: '2026 Q2',
                  },
                  {
                    name: '智象 AI 语音模块',
                    price: '¥79 - 99',
                    tagline: '离线语音识别 + 语音合成',
                    features: ['本地识别', '支持自定义词条', '麦克风阵列', '低功耗'],
                    icon: Mic,
                    date: '2026 Q2',
                  },
                  {
                    name: '智象传感器基础包',
                    price: '¥199 - 299',
                    tagline: '8 款常用传感器，即插即用',
                    features: ['温湿度', '光线', '声音', '超声波 + 更多'],
                    icon: CircuitBoard,
                    date: '2026 Q1',
                  },
                ].map((p, idx) => {
                  const Icon = p.icon;
                  return (
                    <motion.div
                      key={p.name}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.08 }}
                    >
                      <Card className="h-full border-border/60 hover:border-primary/30 hover:shadow-md transition-all overflow-hidden">
                        <div className="h-28 bg-gradient-to-br from-primary/10 to-violet-500/10 flex items-center justify-center relative">
                          <Image
                            src={MASCOT_IMG}
                            alt=""
                            className="size-16 object-contain drop-shadow-md"
                          />
                          <Badge className="absolute top-3 right-3 text-[10px] bg-white/90 text-foreground backdrop-blur">
                            {p.date} 上市
                          </Badge>
                        </div>
                        <CardContent className="p-4 space-y-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <Icon className="size-4 text-primary shrink-0" />
                              <h3 className="font-bold text-foreground text-sm">{p.name}</h3>
                            </div>
                            <div className="text-xs text-primary font-medium">{p.price}</div>
                          </div>
                          <p className="text-xs text-muted-foreground">{p.tagline}</p>
                          <div className="flex flex-wrap gap-1">
                            {p.features.map((f) => (
                              <Badge key={f} variant="outline" className="text-[10px] font-normal">
                                {f}
                              </Badge>
                            ))}
                          </div>
                          <Button
                            size="sm"
                            variant="secondary"
                            className="w-full text-xs"
                            onClick={() => toast.info('已加入通知列表（预留）')}
                          >
                            通知我
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>

              <div className="text-center">
                <Button size="lg" onClick={() => setPartnerOpen(true)} className="gap-2">
                  预约硬件试用 <ArrowRight className="size-4" />
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* 合作申请表单 */}
      <Dialog open={partnerOpen} onOpenChange={setPartnerOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Cpu className="size-5 text-primary" />
              硬件品牌合作申请
            </DialogTitle>
            <DialogDescription>
              填写以下信息，我们的合作团队会在 3 个工作日内与您联系
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handlePartnerSubmit} className="space-y-4 py-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company">企业名称 *</Label>
                <Input
                  id="company"
                  value={partnerForm.company}
                  onChange={(e) => setPartnerForm((p) => ({ ...p, company: e.target.value }))}
                  placeholder="请输入企业名称"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact">联系人 *</Label>
                <Input
                  id="contact"
                  value={partnerForm.contact}
                  onChange={(e) => setPartnerForm((p) => ({ ...p, contact: e.target.value }))}
                  placeholder="请输入联系人姓名"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">联系电话 *</Label>
                <Input
                  id="phone"
                  value={partnerForm.phone}
                  onChange={(e) => setPartnerForm((p) => ({ ...p, phone: e.target.value }))}
                  placeholder="请输入联系电话"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="product">主营产品</Label>
                <Input
                  id="product"
                  value={partnerForm.product}
                  onChange={(e) => setPartnerForm((p) => ({ ...p, product: e.target.value }))}
                  placeholder="如：主控板、传感器等"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">合作意向说明</Label>
              <Textarea
                id="message"
                value={partnerForm.message}
                onChange={(e) => setPartnerForm((p) => ({ ...p, message: e.target.value }))}
                placeholder="请简要描述您的产品与合作方向"
                rows={3}
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="secondary" onClick={() => setPartnerOpen(false)}>
                取消
              </Button>
              <Button type="submit" disabled={submitting} className="gap-1">
                {submitting ? '提交中...' : '提交申请'}
                <Send className="size-3.5" />
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

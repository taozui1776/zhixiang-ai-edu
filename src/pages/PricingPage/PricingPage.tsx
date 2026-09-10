import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Crown,
  Check,
  X,
  Sparkles,
  Building2,
  Landmark,
  Phone,
  Mail,
  User,
  ChevronRight,
  MonitorPlay,
  BookOpen,
  FlaskConical,
  Users,
  BarChart3,
  UploadCloud,
  Wrench,
  Headphones,
  Cpu,
  Zap,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useSubscription, PLAN_LABELS } from '@/hooks/use-subscription';

const TIERS = [
  {
    id: 'basic',
    name: '基础版',
    price: '免费',
    priceUnit: '基础功能永久免费',
    desc: '适合个人教师试用，覆盖核心课程与基础实验',
    icon: MonitorPlay,
    color: 'from-slate-500 to-slate-600',
    badge: null,
    features: [
      { name: '课程资源浏览', available: true, detail: '部分免费课程' },
      { name: '基础AI实验', available: true, detail: '6 个精选实验' },
      { name: 'AI工具试用', available: true, detail: '每日限额' },
      { name: '编程实验室', available: true },
      { name: '学情中心', available: false },
      { name: '班级管理', available: false },
      { name: '学校管理后台', available: false },
      { name: '专属客服', available: false },
    ],
    cta: '切换到基础版',
    ctaVariant: 'secondary' as const,
  },
  {
     id: 'pro',
     name: '专业版',
     price: '¥3,999',
     priceUnit: '/ 校 / 年',
     desc: '学校推荐方案，全功能解锁，含学情与班级管理',
     icon: Crown,
     color: 'from-primary to-violet-600',
     badge: '热门',
     features: [
       { name: '全部课程资源', available: true, detail: '32+ 课，全学段' },
       { name: '全部AI实验', available: true, detail: '24 个互动实验' },
       { name: 'AI工具无限使用', available: true },
       { name: '编程实验室', available: true },
       { name: '学情中心', available: true },
       { name: '班级管理', available: true },
       { name: '学校管理后台', available: true },
       { name: '专属客服支持', available: true },
     ],
     cta: '切换到专业版',
     ctaVariant: 'default' as const,
   },
   {
     id: 'ultimate',
     name: '旗舰版',
     price: '¥10-50万',
     priceUnit: '/ 区域 / 年',
     desc: '区域集采方案，支持定制化服务与私有化部署',
     icon: Landmark,
     color: 'from-amber-500 to-orange-500',
     badge: '区域集采',
     features: [
       { name: '全部课程资源', available: true, detail: '持续更新' },
       { name: '全部AI实验', available: true },
       { name: 'AI工具无限使用', available: true },
       { name: '编程实验室', available: true },
       { name: '学情中心', available: true, detail: '区域数据驾驶舱' },
       { name: '班级管理', available: true },
       { name: '学校管理后台', available: true },
       { name: '私有化部署 / 定制域名', available: true },
       { name: '专属服务团队', available: true },
       { name: '硬件配套方案', available: true },
     ],
     cta: '切换到旗舰版',
     ctaVariant: 'default' as const,
   },
 ];

const PLANS = [
  {
    id: 'lab',
    name: 'AI 实验室整体方案',
    desc: '硬件设备 + 平台订阅 + 课程资源 + 教师培训，一站式建设',
    price: '约 ¥3-20万',
    priceDesc: '依配置而定',
    icon: FlaskConical,
    items: [
      'AI 实验硬件套装（掌控板/行空板等）',
      '智象平台标准版/专业版订阅',
      '全部 32+ 节课程资源及配套实验',
      '教师培训（线上+线下）',
      '教学支持与教研服务',
    ],
    color: 'from-primary to-blue-500',
  },
  {
    id: 'platform',
    name: '纯平台订阅方案',
    desc: '仅订阅平台资源与服务，学校已有硬件时的轻量选择',
    price: '¥1-3万',
    priceDesc: '/ 校 / 年',
    icon: BookOpen,
    items: [
      '全学段课程资源（教案+课件+实验+作业）',
      'AI 工具与 AI 实验',
      '教师账号与备课管理',
      '学情看板与数据统计',
      '技术支持与版本更新',
    ],
    color: 'from-emerald-500 to-teal-500',
  },
  {
    id: 'regional',
    name: '区域集采方案',
    desc: '面向教育局/集团校的区域整体解决方案',
    price: '¥10-50万',
    priceDesc: '/ 区域 / 年',
    icon: Landmark,
    items: [
      '区域内所有学校全覆盖',
      '私有化部署 / 定制域名',
      '区域学情数据驾驶舱',
      '校本资源上传与区域共享',
      '定制课程开发与教研支持',
      '专属客户经理与服务团队',
    ],
    color: 'from-amber-500 to-orange-500',
  },
];

const FEATURE_COMPARE = [
  {
    category: '课程资源',
    icon: BookOpen,
    items: [
      { name: '小学段课程（4 年级 × 8 课）', demo: '部分', standard: true, pro: true },
      { name: '初中段课程（2 年级 × 8 课）', demo: '部分', standard: true, pro: true },
      { name: '高中段课程（2 年级 × 8 课）', demo: false, standard: true, pro: true },
      { name: '课程教案 + 课件 + 实验 + 作业', demo: '预览', standard: true, pro: true },
      { name: '课程持续更新', demo: false, standard: true, pro: true },
      { name: '知识点对标体系', demo: true, standard: true, pro: true },
    ],
  },
  {
    category: 'AI 与工具',
    icon: Cpu,
    items: [
      { name: 'AI 备课助手', demo: '限额', standard: '无限', pro: '无限' },
      { name: 'AI 实验/代码生成', demo: '限额', standard: '无限', pro: '无限' },
      { name: 'AI 通识问答', demo: '限额', standard: '无限', pro: '无限' },
      { name: '互动 AI 实验', demo: '3 个', standard: '全部 8+', pro: '全部 8+' },
      { name: '数据采集工具', demo: true, standard: true, pro: true },
    ],
  },
  {
    category: '教师功能',
    icon: Users,
    items: [
      { name: '教师账号', demo: false, standard: '全校', pro: '全区域' },
      { name: '备课管理', demo: false, standard: true, pro: true },
      { name: '我的收藏', demo: false, standard: true, pro: true },
      { name: '课堂记录', demo: false, standard: true, pro: true },
      { name: '班级学情看板', demo: false, standard: true, pro: true },
    ],
  },
  {
    category: '部署与服务',
    icon: Wrench,
    items: [
      { name: '公有云 SaaS', demo: true, standard: true, pro: true },
      { name: '私有化部署', demo: false, standard: false, pro: true },
      { name: '定制域名', demo: false, standard: false, pro: true },
      { name: '校本资源上传', demo: false, standard: false, pro: true },
      { name: '区域学情数据驾驶舱', demo: false, standard: false, pro: true },
      { name: '定制课程开发', demo: false, standard: false, pro: true },
      { name: '技术支持', demo: '社区', standard: '工作日', pro: '7×24' },
      { name: '教师培训', demo: false, standard: '可选', pro: '含' },
      { name: '硬件配套方案', demo: false, standard: '可选', pro: '含' },
    ],
  },
];

export default function PricingPage() {
  const navigate = useNavigate();
  const { plan, switchPlan } = useSubscription();
  const [activeTab, setActiveTab] = useState('tiers');
  const [formData, setFormData] = useState({
    school: '',
    contact: '',
    phone: '',
    tier: 'standard',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.school || !formData.contact || !formData.phone) {
      toast.error('请填写学校名称、联系人和电话');
      return;
    }
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 800));
    setSubmitting(false);
    toast.success('已收到您的咨询，我们会尽快与您联系！');
    setFormData({ school: '', contact: '', phone: '', tier: 'standard', message: '' });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="w-full bg-gradient-to-br from-primary/10 via-background to-purple-500/10 py-14 md:py-20 relative overflow-hidden">
        <div className="absolute top-10 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="max-w-7xl mx-auto px-4 md:px-6 relative text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            <Badge className="mb-3 bg-primary/15 text-primary border-primary/20">
              <Crown className="size-3 mr-1" />
              版本与方案
            </Badge>
            <h1 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">
              选择适合您的
              <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                智象版本
              </span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              从个人演示到区域集采，智象为不同规模的学校和区域提供灵活的订阅方案，
              让每一所学校都能轻松开展 AI 通识教育。
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16 space-y-20">
        {/* 版本对比 */}
        <section>
          <div className="text-center max-w-2xl mx-auto mb-10">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-2xl md:text-3xl font-bold mb-3"
            >
              版本分层对比
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-muted-foreground"
            >
              三个版本，满足不同场景需求
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {TIERS.map((tier, i) => {
              const Icon = tier.icon;
              return (
                <motion.div
                  key={tier.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="relative"
                >
                  {tier.badge && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                      <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 shadow-sm">
                        <Sparkles className="size-3 mr-1" />
                        {tier.badge}
                      </Badge>
                    </div>
                  )}
                  <Card
                    className={`h-full border-border/60 overflow-hidden flex flex-col ${
                      tier.badge ? 'ring-2 ring-primary/30 shadow-lg' : ''
                    }`}
                  >
                    <div className={`h-2 w-full bg-gradient-to-r ${tier.color}`} />
                    <CardHeader>
                      <div className={`size-12 rounded-xl bg-gradient-to-br ${tier.color} text-white flex items-center justify-center mb-4 shadow-md`}>
                        <Icon className="size-6" />
                      </div>
                      <CardTitle className="text-xl">{tier.name}</CardTitle>
                      <CardDescription>{tier.desc}</CardDescription>
                      <div className="pt-3">
                        <span className="text-3xl md:text-4xl font-bold tracking-tight">{tier.price}</span>
                        <span className="text-sm text-muted-foreground ml-1">{tier.priceUnit}</span>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3 flex-1">
                      {tier.features.map((f) => (
                        <div key={f.name} className="flex items-start gap-2 text-sm">
                          {f.available ? (
                            <Check className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                          ) : (
                            <X className="size-4 text-muted-foreground/40 shrink-0 mt-0.5" />
                          )}
                          <span className={f.available ? 'text-foreground' : 'text-muted-foreground/60'}>
                            {f.name}
                            {f.detail && (
                              <span className="block text-xs text-muted-foreground mt-0.5">{f.detail}</span>
                            )}
                          </span>
                        </div>
                      ))}
                    </CardContent>
                    <div className="p-6 pt-0 mt-auto">
                       <Button
                         variant={tier.ctaVariant}
                         className="w-full gap-1.5"
                         onClick={() => {
                           if (plan === tier.id) {
                             toast.info('当前已是此版本');
                             return;
                           }
                           switchPlan(tier.id as any);
                           toast.success(`已切换到${PLAN_LABELS[tier.id as keyof typeof PLAN_LABELS] || tier.name}`);
                         }}
                       >
                         {plan === tier.id ? '当前版本' : tier.cta}
                         {plan !== tier.id && <Check className="size-4" />}
                       </Button>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* 采购方案 */}
        <section>
          <div className="text-center max-w-2xl mx-auto mb-10">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-2xl md:text-3xl font-bold mb-3"
            >
              三种采购方案
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-muted-foreground"
            >
              实验室整体建设、纯平台订阅、区域集采，灵活满足不同需求
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PLANS.map((plan, i) => {
              const Icon = plan.icon;
              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <Card className="h-full border-border/60 overflow-hidden group hover:shadow-md transition-all">
                    <div className={`h-2 w-full bg-gradient-to-r ${plan.color}`} />
                    <CardContent className="p-6 space-y-4">
                      <div className={`size-11 rounded-xl bg-gradient-to-br ${plan.color} text-white flex items-center justify-center shadow-sm`}>
                        <Icon className="size-5" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold mb-1">{plan.name}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">{plan.desc}</p>
                      </div>
                      <div className="py-2 border-y border-border/40">
                        <div className="text-2xl font-bold tabular-nums tracking-tight">{plan.price}</div>
                        <div className="text-xs text-muted-foreground">{plan.priceDesc}</div>
                      </div>
                      <ul className="space-y-2">
                        {plan.items.map((item) => (
                          <li key={item} className="flex items-start gap-2 text-sm">
                            <Check className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                            <span className="text-foreground/80">{item}</span>
                          </li>
                        ))}
                      </ul>
                      <Button
                        variant="ghost"
                        className="w-full gap-1.5 text-primary"
                        onClick={() => {
                          setActiveTab('contact');
                        }}
                      >
                        咨询详情
                        <ChevronRight className="size-4" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* 功能清单对比表 */}
        <section>
          <div className="text-center max-w-2xl mx-auto mb-10">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-2xl md:text-3xl font-bold mb-3"
            >
              功能详细对比
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-muted-foreground"
            >
              全面了解各版本包含的功能
            </motion.p>
          </div>

          <Card className="border-border/60 overflow-hidden">
            <CardContent className="p-0">
              <div className="w-full overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/50 border-b border-border/60">
                      <th className="text-left font-semibold px-5 py-4 w-[35%] whitespace-nowrap">
                        功能项
                      </th>
                      <th className="text-center font-semibold px-4 py-4 w-[20%] whitespace-nowrap text-muted-foreground">
                        演示版
                      </th>
                      <th className="text-center font-semibold px-4 py-4 w-[22%] whitespace-nowrap text-primary">
                        标准版
                      </th>
                      <th className="text-center font-semibold px-4 py-4 w-[23%] whitespace-nowrap text-amber-600">
                        专业版
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {FEATURE_COMPARE.map((cat) => {
                      const Icon = cat.icon;
                      return (
                        <>
                          <tr key={cat.category} className="bg-muted/30 border-b border-border/40">
                            <td colSpan={4} className="px-5 py-2.5 font-semibold text-foreground/80 text-sm">
                              <span className="flex items-center gap-2">
                                <Icon className="size-4 text-primary" />
                                {cat.category}
                              </span>
                            </td>
                          </tr>
                          {cat.items.map((item) => (
                            <tr
                              key={item.name}
                              className="border-b border-border/40 hover:bg-muted/20 transition-colors"
                            >
                              <td className="px-5 py-3 text-foreground/80">{item.name}</td>
                              <td className="px-4 py-3 text-center">{renderCell(item.demo)}</td>
                              <td className="px-4 py-3 text-center">{renderCell(item.standard)}</td>
                              <td className="px-4 py-3 text-center">{renderCell(item.pro)}</td>
                            </tr>
                          ))}
                        </>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* 咨询表单 */}
        <section id="contact">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <Badge className="bg-primary/15 text-primary border-primary/20">
                <Zap className="size-3 mr-1" />
                立即咨询
              </Badge>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                想了解更多？
                <br />
                <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                  留下联系方式，我们为您定制方案
                </span>
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                无论您是学校教师、教育局负责人，还是合作伙伴，
                都欢迎联系我们获取详细的产品演示和方案报价。
              </p>

              <div className="space-y-3 pt-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/40 border border-border/40">
                  <div className="size-9 rounded-lg bg-primary/15 text-primary flex items-center justify-center">
                    <Phone className="size-4" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">咨询热线</div>
                    <div className="text-sm text-muted-foreground">400-888-8888</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/40 border border-border/40">
                  <div className="size-9 rounded-lg bg-emerald-500/15 text-emerald-600 flex items-center justify-center">
                    <Mail className="size-4" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">商务邮箱</div>
                    <div className="text-sm text-muted-foreground">business@zhixiang-ai.edu</div>
                  </div>
                </div>
              </div>
            </div>

            <Card className="border-border/60 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl">预约演示 / 方案咨询</CardTitle>
                <CardDescription>填写以下信息，我们会在 1 个工作日内与您联系</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="school">学校 / 单位名称 *</Label>
                    <div className="relative">
                      <Building2 className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="school"
                        value={formData.school}
                        onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                        placeholder="请输入学校或单位名称"
                        className="pl-9"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="contact">联系人 *</Label>
                      <div className="relative">
                        <User className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="contact"
                          value={formData.contact}
                          onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                          placeholder="您的姓名"
                          className="pl-9"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">联系电话 *</Label>
                      <div className="relative">
                        <Phone className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="手机号"
                          className="pl-9"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tier">意向版本</Label>
                    <Select value={formData.tier} onValueChange={(v) => setFormData({ ...formData, tier: v })}>
                      <SelectTrigger id="tier">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {TIERS.map((t) => (
                          <SelectItem key={t.id} value={t.id}>
                            {t.name} - {t.price}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">补充说明（选填）</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="学校规模、具体需求等..."
                      rows={3}
                    />
                  </div>
                  <Button type="submit" className="w-full gap-1.5" disabled={submitting}>
                    {submitting ? '提交中...' : '提交咨询'}
                    <ChevronRight className="size-4" />
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">
                    提交即表示您同意我们的《隐私政策》，我们承诺不泄露您的信息
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
}

function renderCell(value: boolean | string) {
  if (value === true) {
    return <Check className="size-5 text-emerald-500 mx-auto" />;
  }
  if (value === false) {
    return <X className="size-5 text-muted-foreground/30 mx-auto" />;
  }
  if (typeof value === 'string') {
    return <span className="text-xs text-muted-foreground">{value}</span>;
  }
  return null;
}

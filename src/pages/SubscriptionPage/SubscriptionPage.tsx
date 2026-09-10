import { useState } from 'react';
import {
  Check,
  X,
  Sparkles,
  Building2,
  Users,
  BookOpen,
  Bot,
  Code2,
  Cpu,
  BarChart3,
  GraduationCap,
  ShieldCheck,
  Headphones,
  MessageCircle,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Star,
  Zap,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { useSubscription, PLAN_LABELS } from '@/hooks/use-subscription';

interface PricingFeature {
  name: string;
  basic: boolean | string;
  pro: boolean | string;
  ultimate: boolean | string;
  icon: React.ReactNode;
}

const PRICING_FEATURES: PricingFeature[] = [
  { name: 'AI 通识课程库', basic: true, pro: true, ultimate: true, icon: <BookOpen className="size-4" /> },
  { name: 'AI 实验室', basic: true, pro: true, ultimate: true, icon: <Bot className="size-4" /> },
  { name: '编程工具（Scratch/Python）', basic: true, pro: true, ultimate: true, icon: <Code2 className="size-4" /> },
  { name: '硬件连接支持', basic: false, pro: true, ultimate: true, icon: <Cpu className="size-4" /> },
  { name: '学情中心', basic: false, pro: true, ultimate: true, icon: <BarChart3 className="size-4" /> },
  { name: '班级管理', basic: false, pro: true, ultimate: true, icon: <GraduationCap className="size-4" /> },
  { name: 'AI 备课助手', basic: false, pro: true, ultimate: true, icon: <Sparkles className="size-4" /> },
  { name: '教师数', basic: '10 位', pro: '30 位', ultimate: '不限', icon: <Users className="size-4" /> },
  { name: '班级数', basic: '20 个', pro: '60 个', ultimate: '不限', icon: <Building2 className="size-4" /> },
  { name: '学校管理后台', basic: false, pro: false, ultimate: true, icon: <Building2 className="size-4" /> },
  { name: '教师培训课程', basic: false, pro: false, ultimate: true, icon: <GraduationCap className="size-4" /> },
  { name: '专属客户经理', basic: false, pro: false, ultimate: true, icon: <Headphones className="size-4" /> },
  { name: '定制课程开发', basic: false, pro: false, ultimate: '2 门/年', icon: <Sparkles className="size-4" /> },
  { name: '技术支持', basic: '工作日', pro: '7x12小时', ultimate: '7x24小时', icon: <ShieldCheck className="size-4" /> },
];

const FAQS = [
  {
    q: '是否支持免费试用？',
    a: '支持。学校用户可申请 30 天免费试用，试用期间可体验专业版全部功能。申请方式：联系在线客服或拨打 400-888-8888。',
  },
  {
    q: '支持哪些付款方式？',
    a: '支持公对公转账、支付宝、微信支付等方式。开具增值税普通发票或专用发票，发票内容为"信息技术服务费"。',
  },
  {
    q: '续费价格和流程是怎样的？',
    a: '续费价格以当前版本官网价格为准，提前 30 天续费可享受 9 折优惠。续费流程：登录学校管理后台 → 订阅中心 → 选择续费 → 完成支付。',
  },
  {
    q: '多校区可以使用同一个账号吗？',
    a: '旗舰版支持多校区统一管理，可在学校管理后台添加多个校区，每个校区独立管理班级和教师数据。专业版及以下单校区使用。',
  },
  {
    q: '学生账号有限制吗？',
    a: '学生账号不设上限，所有版本均支持无限制学生注册和使用。教师账号和班级数按版本限制。',
  },
  {
    q: '数据安全如何保障？',
    a: '平台已通过等保三级认证，所有数据采用 AES-256 加密存储，传输使用 TLS 1.3 协议。支持学校私有化部署（旗舰版专属）。',
  },
];

export default function SubscriptionPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const { plan, switchPlan } = useSubscription();

  const toggleFaq = (index: number) => {
     setOpenFaq(openFaq === index ? null : index);
   };

   const handleSelectPlan = (targetPlan: 'basic' | 'pro' | 'ultimate') => {
     if (plan === targetPlan) {
       toast.info('当前已是此版本');
       return;
     }
     switchPlan(targetPlan);
     toast.success(`已切换到${PLAN_LABELS[targetPlan]}`);
   };

  return (
    <div className="min-h-screen bg-slate-50/60">
      {/* Hero */}
      <div className="w-full bg-gradient-to-b from-indigo-50 via-slate-50 to-transparent relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-indigo-200/40 to-transparent rounded-full blur-3xl -top-20" />
        <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-6 pt-16 pb-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="bg-primary/10 text-primary border-0 mb-4">
              <Star className="size-3 mr-1" />
              选择适合您学校的版本
            </Badge>
            <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
              让每一所学校都能上好
              <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 bg-clip-text text-transparent">
                AI 通识课
              </span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-base">
              从基础版到旗舰版，满足不同规模学校的 AI 教育需求。
              无需额外硬件，无需专业教师，开箱即用。
            </p>
          </motion.div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 md:px-6 pb-16 -mt-2">
        {/* 定价卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
          {/* 基础版 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <Card className="border-2 border-border/60 shadow-sm h-full flex flex-col hover:border-primary/30 hover:shadow-md transition-all">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <span className="text-xl">🌱</span>
                  基础版
                </CardTitle>
                <CardDescription className="text-sm">
                  适合小规模学校起步探索 AI 教育
                </CardDescription>
                <div className="mt-3">
                  <span className="text-4xl font-bold">¥9,800</span>
                  <span className="text-muted-foreground text-sm ml-1">/ 校 / 年</span>
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <div className="space-y-2.5 mb-5 flex-1">
                  {PRICING_FEATURES.slice(0, 3).map((f) => (
                    <FeatureItem key={f.name} icon={f.icon} name={f.name} value={f.basic} />
                  ))}
                </div>
                 <Button variant="outline" className="w-full" onClick={() => handleSelectPlan('basic')}>
                   {plan === 'basic' ? '当前版本' : '切换到此版本'}
                 </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* 专业版 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
              <Badge className="bg-gradient-to-r from-indigo-500 to-violet-500 text-white border-0 px-3 shadow-md">
                <Zap className="size-3 mr-1" />
                最受欢迎
              </Badge>
            </div>
            <Card className="border-2 border-primary/50 shadow-lg h-full flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/10 to-transparent rounded-bl-full" />
              <CardHeader className="pb-2 relative">
                <CardTitle className="text-lg flex items-center gap-2">
                  <span className="text-xl">🚀</span>
                  专业版
                </CardTitle>
                <CardDescription className="text-sm">
                  适合中小学全面开展 AI 通识教学
                </CardDescription>
                <div className="mt-3">
                  <span className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                    ¥19,800
                  </span>
                  <span className="text-muted-foreground text-sm ml-1">/ 校 / 年</span>
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col relative">
                <div className="space-y-2.5 mb-5 flex-1">
                  {PRICING_FEATURES.map((f) => (
                    <FeatureItem key={f.name} icon={f.icon} name={f.name} value={f.pro} />
                  ))}
                </div>
                 <Button className="w-full bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600" onClick={() => handleSelectPlan('pro')}>
                   {plan === 'pro' ? '当前版本' : '切换到此版本'}
                   {plan !== 'pro' && <ArrowRight className="size-4 ml-1" />}
                 </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* 旗舰版 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <Card className="border-2 border-amber-200 shadow-sm h-full flex flex-col hover:border-amber-300 hover:shadow-md transition-all bg-gradient-to-b from-amber-50/50 to-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <span className="text-xl">👑</span>
                  旗舰版
                </CardTitle>
                <CardDescription className="text-sm">
                  适合教育集团/多校区学校定制服务
                </CardDescription>
                <div className="mt-3">
                  <span className="text-4xl font-bold text-amber-600">¥39,800</span>
                  <span className="text-muted-foreground text-sm ml-1">/ 校 / 年</span>
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <div className="space-y-2.5 mb-5 flex-1">
                  {PRICING_FEATURES.map((f) => (
                    <FeatureItem key={f.name} icon={f.icon} name={f.name} value={f.ultimate} />
                  ))}
                </div>
                 <Button
                   variant="outline"
                   className="w-full border-amber-300 text-amber-700 hover:bg-amber-50 hover:text-amber-800"
                   onClick={() => handleSelectPlan('ultimate')}
                 >
                   {plan === 'ultimate' ? '当前版本' : '切换到此版本'}
                 </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* 区域集采 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="border-0 shadow-sm overflow-hidden mb-12 bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900">
            <CardContent className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                <div className="size-16 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
                  <Building2 className="size-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">区域集采方案</h3>
                  <p className="text-white/70 text-sm">
                    教育局或教育集团 10 校以上统一采购，享受专属折扣价格。
                    提供区域统一管理后台、教师培训、定制课程开发等服务。
                  </p>
                </div>
                <div className="shrink-0">
                  <Button
                    size="lg"
                    className="bg-white text-indigo-600 hover:bg-white/90"
                    onClick={() => toast.info('集采方案咨询已提交')}
                  >
                    咨询集采方案
                    <ArrowRight className="size-4 ml-1" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* 购买流程 */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-center mb-2">购买流程</h2>
          <p className="text-sm text-muted-foreground text-center mb-8">四步快速开通，当天即可使用</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { step: 1, title: '选择版本', desc: '根据学校规模选择合适的版本' },
              { step: 2, title: '填写信息', desc: '提交学校名称和联系方式' },
              { step: 3, title: '签约付款', desc: '签订合同并完成付款' },
              { step: 4, title: '开通账号', desc: '1 个工作日内开通全部功能' },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.5 + i * 0.1 }}
              >
                <Card className="border-0 shadow-sm text-center h-full">
                  <CardContent className="p-5">
                    <div className="size-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-white flex items-center justify-center mx-auto mb-3 text-sm font-bold">
                      {item.step}
                    </div>
                    <h4 className="font-semibold mb-1">{item.title}</h4>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 常见问题 */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-center mb-2">常见问题</h2>
          <p className="text-sm text-muted-foreground text-center mb-6">
            还有其他问题？
            <button className="text-primary hover:underline ml-1" onClick={() => toast.info('客服即将接入')}>
              联系在线客服
            </button>
          </p>
          <div className="space-y-2">
            {FAQS.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.6 + i * 0.05 }}
              >
                <Card
                  className={`border shadow-none cursor-pointer transition-all ${openFaq === i ? 'border-primary/30' : 'border-border/60'}`}
                  onClick={() => toggleFaq(i)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <HelpCircle className={`size-5 shrink-0 mt-0.5 ${openFaq === i ? 'text-primary' : 'text-muted-foreground/50'}`} />
                        <h4 className="font-medium text-sm">{faq.q}</h4>
                      </div>
                      {openFaq === i ? (
                        <ChevronUp className="size-4 shrink-0 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
                      )}
                    </div>
                    <AnimatePresence>
                      {openFaq === i && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <p className="text-sm text-muted-foreground mt-3 pl-8 leading-relaxed">
                            {faq.a}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      {/* CTA */}
      <div className="w-full bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 py-12">
        <div className="max-w-4xl mx-auto px-4 md:px-6 text-center text-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            准备好开启 AI 通识教育之旅了吗？
          </h2>
          <p className="text-white/80 mb-6">
            已有 1,000+ 所学校选择智象平台
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Button
              size="lg"
              className="bg-white text-indigo-600 hover:bg-white/90"
              onClick={() => toast.info('免费试用申请已提交')}
            >
              申请免费试用
              <ArrowRight className="size-4 ml-1" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10"
              onClick={() => toast.info('产品演示预约成功')}
            >
              预约产品演示
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureItem({
  icon,
  name,
  value,
}: {
  icon: React.ReactNode;
  name: string;
  value: boolean | string;
}) {
  if (value === false) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground/60">
        <X className="size-4 shrink-0 text-muted-foreground/40" />
        <span className="line-through">{name}</span>
      </div>
    );
  }

  if (typeof value === 'string') {
    return (
      <div className="flex items-center gap-2 text-sm">
        <Check className="size-4 shrink-0 text-emerald-500" />
        <span className="flex-1">{name}</span>
        <span className="text-xs text-muted-foreground font-medium tabular-nums">{value}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-sm">
      <Check className="size-4 shrink-0 text-emerald-500" />
      <span>{name}</span>
    </div>
  );
}

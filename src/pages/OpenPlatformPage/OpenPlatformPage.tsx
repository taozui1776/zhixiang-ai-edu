import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Layers,
  Plug,
  FileText,
  Users,
  Code2,
  BookOpen,
  GraduationCap,
  Handshake,
  MessageSquare,
  ShieldCheck,
  ArrowRight,
  Mail,
  Sparkles,
  Workflow,
  Cpu,
  Zap,
  ExternalLink,
  Lock,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Image from '@/components/ui/image';
import { toast } from 'sonner';

const MASCOT_IMG = 'https://aka.doubaocdn.com/s/FTGHri7UGK';

const OPEN_SECTIONS = [
  {
    id: 'hardware',
    title: '硬件接入协议',
    subtitle: 'Hardware Protocol',
    icon: Plug,
    description: '开放硬件接入协议，第三方硬件厂商可按协议标准接入智象平台',
    status: '即将开放',
    features: [
      '统一设备抽象层接口（HAL）',
      'WebSerial / WebBluetooth 连接协议',
      '传感器数据标准格式',
      '固件 OTA 升级规范',
      '兼容性认证流程',
    ],
  },
  {
    id: 'content',
    title: '内容创作工具',
    subtitle: 'Content SDK',
    icon: BookOpen,
    description: '老师和第三方开发者可以创作课程、实验、课件并发布到平台',
    status: '即将开放',
    features: [
      '课程 Markdown 格式规范',
      '课件模板开发工具',
      '实验交互组件 SDK',
      '内容审核与上架流程',
      '创作者收益分成',
    ],
  },
  {
    id: 'api',
    title: '平台 API',
    subtitle: 'Platform API',
    icon: Code2,
    description: '开放平台核心能力 API，支持第三方系统集成',
    status: '即将开放',
    features: [
      '课程资源查询 API',
      '用户数据同步 API',
      'AI 能力调用 API',
      '硬件控制 API',
      'OAuth 2.0 授权',
    ],
  },
  {
    id: 'community',
    title: '开发者社区',
    subtitle: 'Developer Community',
    icon: Users,
    description: '连接一线教师、开发者和硬件厂商的共创社区',
    status: '即将开放',
    features: [
      '课程资源分享区',
      '技术问答论坛',
      '创意作品展示',
      '月度优秀创作者评选',
      '官方技术支持',
    ],
  },
];

const PARTNER_TYPES = [
  {
    icon: Cpu,
    title: '硬件厂商',
    desc: '接入智象硬件生态，获得课程资源与用户渠道支持',
    tags: ['主控板', '传感器', 'AI 模块', '机器人'],
  },
  {
    icon: GraduationCap,
    title: '教育机构',
    desc: '联合开发课程体系，共同推进 AI 通识教育落地',
    tags: ['教材出版', '教研机构', '学校集团', '教育局'],
  },
  {
    icon: Sparkles,
    title: '内容创作者',
    desc: '创作优质 AI 课程与实验，获得收益分成与品牌曝光',
    tags: ['一线教师', '独立开发者', '工作室', '高校团队'],
  },
];

export default function OpenPlatformPage() {
  const [formData, setFormData] = useState({
    name: '',
    org: '',
    type: '',
    email: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      toast.warning('请填写姓名和邮箱');
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      toast.success('已收到您的合作意向，我们会尽快联系您！');
      setFormData({ name: '', org: '', type: '', email: '', message: '' });
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-purple-50/30">
      {/* Hero */}
      <section className="w-full py-16 md:py-24 bg-gradient-to-br from-primary/10 via-primary/5 to-purple-500/10">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1 text-center md:text-left">
              <Badge className="mb-4 bg-white/80 text-primary border-primary/20 backdrop-blur">
                <Layers className="size-3 mr-1" />
                开放平台
              </Badge>
              <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
                智象开放平台
                <br />
                <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                  共建 AI 教育生态
                </span>
              </h1>
              <p className="text-muted-foreground text-base md:text-lg max-w-lg mb-6">
                开放硬件接入协议、内容创作工具、平台 API 与开发者社区，
                携手硬件厂商、教育机构与创作者，共同打造 K12 AI 通识教育的完整生态。
              </p>
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <Button size="lg" className="gap-2">
                  了解合作
                  <ArrowRight className="size-4" />
                </Button>
                <Button size="lg" variant="secondary" className="gap-2">
                  <FileText className="size-4" />
                  文档中心（即将开放）
                </Button>
              </div>
            </div>
            <div className="size-56 md:size-72 shrink-0 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-full blur-3xl" />
              <Image
                src={MASCOT_IMG}
                alt=""
                className="relative size-full object-contain drop-shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-4 md:px-6 py-12 md:py-16 space-y-16">
        {/* 四大开放能力 */}
        <section>
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
              四大开放能力
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              从硬件接入到内容创作，从 API 到社区，全方位开放平台能力
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {OPEN_SECTIONS.map((section, idx) => {
              const Icon = section.icon;
              return (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08 }}
                >
                  <Card className="h-full hover:shadow-md transition-shadow overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="size-12 rounded-xl bg-gradient-to-br from-primary/10 to-purple-500/10 flex items-center justify-center shrink-0">
                          <Icon className="size-6 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-bold text-lg text-foreground">{section.title}</h3>
                            <Badge variant="outline" className="text-[10px]">
                              {section.status}
                            </Badge>
                          </div>
                          <div className="text-xs text-muted-foreground mt-0.5 font-mono">
                            {section.subtitle}
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-foreground/70 mb-4">{section.description}</p>
                      <ul className="space-y-2">
                        {section.features.map((f, i) => (
                          <li key={i} className="text-xs text-foreground/70 flex items-center gap-2">
                            <span className="size-1.5 rounded-full bg-primary shrink-0" />
                            {f}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* 合作伙伴计划 */}
        <section>
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
              合作伙伴计划
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              三种合作类型，总有一种适合你
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {PARTNER_TYPES.map((p, idx) => {
              const Icon = p.icon;
              return (
                <motion.div
                  key={p.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Card className="h-full text-center hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="size-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary/10 to-purple-500/10 flex items-center justify-center">
                        <Icon className="size-7 text-primary" />
                      </div>
                      <h3 className="font-bold text-lg text-foreground mb-2">{p.title}</h3>
                      <p className="text-sm text-foreground/70 mb-4">{p.desc}</p>
                      <div className="flex flex-wrap gap-1.5 justify-center">
                        {p.tags.map((t) => (
                          <Badge key={t} variant="secondary" className="text-[10px] font-normal">
                            {t}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* 合作联系表单 */}
        <section>
          <Card className="bg-gradient-to-br from-primary/5 to-purple-500/5 border-primary/10 overflow-hidden">
            <CardContent className="p-8 md:p-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
                    成为合作伙伴
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    留下您的联系方式，我们的商务团队会在 3 个工作日内与您联系。
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm text-foreground/80">
                      <Mail className="size-4 text-primary" />
                      partner@zhixiang-ai.edu
                    </div>
                    <div className="flex items-center gap-3 text-sm text-foreground/80">
                      <MessageSquare className="size-4 text-primary" />
                      工作日 9:00 - 18:00 在线
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="name">姓名 *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="您的姓名"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="org">单位</Label>
                      <Input
                        id="org"
                        value={formData.org}
                        onChange={(e) => setFormData({ ...formData, org: e.target.value })}
                        placeholder="公司 / 学校"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="email">邮箱 *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="your@email.com"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="type">合作类型</Label>
                    <Input
                      id="type"
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      placeholder="硬件厂商 / 教育机构 / 内容创作者"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="msg">合作意向描述</Label>
                    <Textarea
                      id="msg"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="简单描述您的合作意向..."
                      rows={3}
                    />
                  </div>
                  <Button type="submit" className="w-full gap-2" disabled={submitting}>
                    <Handshake className="size-4" />
                    {submitting ? '提交中...' : '提交合作意向'}
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}

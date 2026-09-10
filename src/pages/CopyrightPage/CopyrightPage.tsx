import { motion } from 'framer-motion';
import {
  ShieldCheck,
  BookOpen,
  Scale,
  AlertTriangle,
  Mail,
  FileCheck,
  CreativeCommons,
  ChevronRight,
  Copy,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Image from '@/components/ui/image';

const MASCOT_IMG = 'https://aka.doubaocdn.com/s/RUYRoCZ6Ts';

const LICENSE_EXPLANATIONS = [
  {
    short: 'CC BY',
    full: 'Creative Commons 署名 4.0',
    icon: CreativeCommons,
    desc: '只要对原作者进行署名，就可以自由地分发、修改、商业使用本作品。',
    do: ['商业使用', '修改改编', '自由分发', '私人使用'],
    dont: ['不标明原作者', '错误署名'],
    color: 'from-emerald-500 to-teal-500',
  },
  {
    short: 'CC BY-SA',
    full: 'Creative Commons 署名-相同方式共享 4.0',
    icon: CreativeCommons,
    desc: '在署名的基础上，修改后的衍生作品必须以相同的 CC BY-SA 协议发布。',
    do: ['商业使用', '修改改编', '自由分发'],
    dont: ['修改后更换协议', '不标明原作者'],
    color: 'from-sky-500 to-blue-500',
  },
  {
    short: 'CC BY-NC',
    full: 'Creative Commons 署名-非商业 4.0',
    icon: CreativeCommons,
    desc: '允许署名使用，但不可用于商业目的。',
    do: ['非商业使用', '修改改编', '自由分发'],
    dont: ['商业销售', '付费使用'],
    color: 'from-amber-500 to-orange-500',
  },
  {
    short: '自研版权',
    full: '智象原创 · 版权所有',
    icon: FileCheck,
    desc: '由智象教研团队原创开发，受著作权法保护。授权学校可教学使用，禁止未经授权的商用转售。',
    do: ['课堂教学使用', '教师备课使用', '学生学习使用'],
    dont: ['商用转售', '未经授权复制', '二次发布'],
    color: 'from-primary to-purple-500',
  },
  {
    short: '公共领域',
    full: 'Public Domain / 公共领域',
    icon: BookOpen,
    desc: '作品已进入公共领域，不受版权限制，可以自由使用。',
    do: ['任意使用', '修改改编', '商业使用'],
    dont: ['冒用作者署名'],
    color: 'from-slate-500 to-slate-600',
  },
];

const RESOURCE_STRATEGY = [
  {
    title: '自研原创',
    desc: '智象教研团队原创开发的核心课程资源，对标国家指南与安徽纲要，保证教学质量',
    count: '约 60%',
    color: 'from-primary to-purple-500',
  },
  {
    title: '合规改编',
    desc: '基于开源项目和 CC 协议开放资源，按照授权协议合规二次开发与改编',
    count: '约 25%',
    color: 'from-amber-500 to-orange-500',
  },
  {
    title: '公共资源聚合',
    desc: '聚合公共领域和 CC 协议教育资源，保留原作者署名，规范使用',
    count: '约 15%',
    color: 'from-emerald-500 to-teal-500',
  },
];

const FAQ_ITEMS = [
  {
    q: '平台课程资源可以用于商业用途吗？',
    a: '智象平台上标注为「自研原创」的课程资源版权归智象所有，仅面向授权学校提供教学使用，不得商用转售。标注为 CC 协议的资源请遵循相应协议的商业使用条款。',
  },
  {
    q: '我可以把平台的课件分享给其他学校吗？',
    a: '自研原创课程仅限授权学校内部教学使用。CC 协议的资源可以在遵循相应协议（署名、相同方式共享等）的前提下分享。',
  },
  {
    q: '平台如何保证资源的版权合规性？',
    a: '智象建立了严格的资源审核机制：1) 所有外部资源均来自可信的开放教育资源平台；2) 每一份资源都有明确的来源追溯和授权记录；3) 改编作品严格遵循原协议要求；4) 定期进行版权合规审计。',
  },
  {
    q: '发现平台上有侵权内容怎么办？',
    a: '如果您认为平台上的任何资源侵犯了您的权益，请通过下方联系方式向我们提交投诉，我们会在 3 个工作日内核实并处理。',
  },
  {
    q: '教师可以下载课件用于课堂投影吗？',
    a: '授权学校的教师可以下载课程课件用于本校课堂教学使用，这属于正常教学使用范围。',
  },
];

export default function CopyrightPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="w-full bg-gradient-to-br from-primary/10 via-background to-purple-500/10 py-14 md:py-20 relative overflow-hidden">
        <div className="absolute top-20 right-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="max-w-7xl mx-auto px-4 md:px-6 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge className="mb-3 bg-primary/15 text-primary border-primary/20">
                <ShieldCheck className="size-3 mr-1" />
                版权与合规
              </Badge>
              <h1 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">
                透明的版权政策
                <br />
                <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                  负责任的教育资源
                </span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                智象坚持版权合规原则，清晰标注每一份资源的来源与授权类型。
                我们聚合公共资源、原创开发与合规改编相结合，让学校用得安心、教师用得放心。
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex justify-center"
            >
              <div className="relative w-56 h-56 md:w-64 md:h-64">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-full blur-3xl scale-75" />
                <Image
                  src={MASCOT_IMG}
                  alt="智象版权合规"
                  className="relative z-10 w-full h-full object-contain drop-shadow-xl"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16 space-y-20">
        {/* 资源策略 */}
        <section>
          <div className="text-center max-w-2xl mx-auto mb-10">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-2xl md:text-3xl font-bold mb-3"
            >
              三类资源 · 全程透明
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-muted-foreground"
            >
              每一份资源都有明确的来源标注和授权说明
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {RESOURCE_STRATEGY.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Card className="h-full border-border/60 overflow-hidden">
                  <div className={`h-2 w-full bg-gradient-to-r ${item.color}`} />
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-baseline justify-between">
                      <h3 className="text-xl font-bold">{item.title}</h3>
                      <Badge variant="outline" className="border-border/60">
                        {item.count}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 授权协议说明 */}
        <section>
          <div className="text-center max-w-2xl mx-auto mb-10">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-2xl md:text-3xl font-bold mb-3 flex items-center justify-center gap-2"
            >
              <Scale className="size-7 text-primary" />
              授权协议一览
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-muted-foreground"
            >
              了解各类授权协议的含义和使用规范
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {LICENSE_EXPLANATIONS.map((lic, i) => {
              const Icon = lic.icon;
              return (
                <motion.div
                  key={lic.short}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                >
                  <Card className="h-full border-border/60">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div
                          className={`size-10 rounded-xl bg-gradient-to-br ${lic.color} flex items-center justify-center text-white shadow-sm`}
                        >
                          <Icon className="size-5" />
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">{lic.short}</div>
                          <CardTitle className="text-base">{lic.full}</CardTitle>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground leading-relaxed">{lic.desc}</p>
                      <div className="space-y-2">
                        <div className="text-xs font-medium text-emerald-600 flex items-center gap-1">
                          <span className="size-1.5 rounded-full bg-emerald-500" />
                          可以做
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {lic.do.map((d) => (
                            <Badge key={d} variant="outline" className="text-[11px] border-emerald-500/30 bg-emerald-500/5 text-emerald-700">
                              {d}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-xs font-medium text-rose-600 flex items-center gap-1">
                          <span className="size-1.5 rounded-full bg-rose-500" />
                          不可以做
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {lic.dont.map((d) => (
                            <Badge key={d} variant="outline" className="text-[11px] border-rose-500/30 bg-rose-500/5 text-rose-700">
                              {d}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* FAQ */}
        <section>
          <div className="text-center max-w-2xl mx-auto mb-10">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-2xl md:text-3xl font-bold mb-3"
            >
              常见问题
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-muted-foreground"
            >
              关于版权合规，你可能想知道的
            </motion.p>
          </div>

          <Card className="border-border/60 max-w-3xl mx-auto">
            <CardContent className="p-6">
              <Accordion type="single" collapsible className="w-full">
                {FAQ_ITEMS.map((item, i) => (
                  <AccordionItem key={i} value={`item-${i}`}>
                    <AccordionTrigger className="text-left text-sm font-medium hover:no-underline">
                      {item.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                      {item.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </section>

        {/* 侵权投诉 */}
        <section className="rounded-2xl overflow-hidden border border-primary/20 bg-gradient-to-br from-primary/5 via-purple-500/5 to-cyan-500/5">
          <div className="p-8 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <Badge variant="secondary" className="mb-3 bg-primary/15 text-primary border-primary/20">
                <AlertTriangle className="size-3 mr-1" />
                侵权投诉
              </Badge>
              <h2 className="text-2xl md:text-3xl font-bold mb-3">
                发现侵权内容？请联系我们
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-5">
                智象高度重视知识产权保护。如果您认为平台上的任何内容侵犯了您的合法权益，
                请通过以下方式与我们联系，我们会在 3 个工作日内核实处理。
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="size-4 text-primary" />
                  <span>copyright@zhixiang-ai.edu</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 px-2 text-xs gap-1"
                    onClick={() => {
                      navigator.clipboard?.writeText('copyright@zhixiang-ai.edu');
                    }}
                  >
                    <Copy className="size-3" />
                    复制
                  </Button>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <BookOpen className="size-4 text-primary" />
                  <span>请提供：作品链接、权属证明、您的联系方式</span>
                </div>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative w-40 h-40">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-400/20 to-rose-400/20 rounded-full blur-2xl" />
                <Image
                  src={MASCOT_IMG}
                  alt="版权保护"
                  className="relative z-10 w-full h-full object-contain"
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

import { motion } from 'framer-motion';
import { BookMarked, Award, ShieldCheck, FileCheck } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const POLICIES = [
  {
    icon: BookMarked,
    title: '中小学人工智能通识教育指南',
    subtitle: '2025 年版',
    issuer: '教育部',
    description: '全面对标国家人工智能通识教育指导文件，确保课程内容的权威性和规范性。',
    points: ['明确 AI 通识教育目标', '规范课程内容体系', '指导教学实施路径'],
  },
  {
    icon: Award,
    title: '安徽省中小学人工智能通识教育课程纲要',
    subtitle: '2025 年版',
    issuer: '安徽省教育厅',
    description: '深度契合安徽省地方课程纲要，提供本土化、可落地的 AI 教育解决方案。',
    points: ['学段衔接设计', '课时内容规划', '评价方式建议'],
  },
];

const FEATURES = [
  { icon: ShieldCheck, label: '内容权威合规' },
  { icon: FileCheck, label: '教案课件齐全' },
];

export default function PolicySection() {
  return (
    <section className="w-full py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            权威政策依据
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-muted-foreground text-lg"
          >
            严格对标国家级与省级 AI 教育政策，让教学有据可依
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {POLICIES.map((policy, i) => {
            const Icon = policy.icon;
            return (
              <motion.div
                key={policy.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
              >
                <Card className="h-full border-primary/20 bg-gradient-to-br from-card to-primary/5 overflow-hidden">
                  <CardContent className="p-6 md:p-8">
                    <div className="flex items-start gap-4 mb-5">
                      <div className="size-14 rounded-2xl bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-white shadow-lg shrink-0">
                        <Icon className="size-7" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold mb-0.5">{policy.title}</h3>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-primary font-medium">{policy.subtitle}</span>
                          <span className="text-muted-foreground">·</span>
                          <span className="text-muted-foreground text-xs">{policy.issuer}</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                      {policy.description}
                    </p>

                    <ul className="space-y-2">
                      {policy.points.map((p) => (
                        <li
                          key={p}
                          className="text-sm text-foreground/80 flex items-center gap-2"
                        >
                          <span className="size-1.5 rounded-full bg-primary" />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom features strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex flex-wrap justify-center gap-6 md:gap-12"
        >
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.label} className="flex items-center gap-2 text-muted-foreground">
                <Icon className="size-5 text-primary" />
                <span className="text-sm font-medium">{f.label}</span>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

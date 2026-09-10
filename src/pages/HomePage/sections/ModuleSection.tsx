import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Wrench, Target, Sparkles, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const MODULES = [
  {
    path: '/courses',
    title: '数字课程',
    subtitle: 'Digital Courses',
    icon: BookOpen,
    description: '对标国家纲要，覆盖全学段的系统化 AI 课程资源',
    highlights: ['教案 + 课件 + 实验 + 作业', '学段 → 年级 → 单元 → 课', '每单元 4 课时完整设计'],
    gradient: 'from-blue-500 to-cyan-400',
  },
  {
    path: '/tools',
    title: '学科工具',
    subtitle: 'Subject Tools',
    icon: Wrench,
    description: '轻量级教学工具集合，支持课堂演示与学生实践',
    highlights: ['图形化编程入口', '数据采集小工具', '模型训练体验', '学生作品展示'],
    gradient: 'from-emerald-500 to-teal-400',
  },
  {
    path: '/training',
    title: '训练中心',
    subtitle: 'Training Center',
    icon: Target,
    description: 'AI 素养测评与专项练习，巩固知识提升能力',
    highlights: ['分学段素养测评', '模块化专项练习', '难度分级进阶', '学习数据追踪'],
    gradient: 'from-orange-500 to-amber-400',
  },
  {
    path: '/ai-tools',
    title: 'AI 工具',
    subtitle: 'AI Toolkit',
    icon: Sparkles,
    description: '面向教师与学生的 AI 能力工具，赋能教与学',
    highlights: ['AI 备课助手', '实验/代码生成', 'AI 通识问答', '真实 AI 能力调用'],
    gradient: 'from-primary to-purple-500',
  },
];

export default function ModuleSection() {
  const navigate = useNavigate();

  return (
    <section className="w-full py-16 md:py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            四大核心模块
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-muted-foreground text-lg"
          >
            课程 + 工具 + 训练 + AI，一站式 AI 通识教育解决方案
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {MODULES.map((mod, i) => {
            const Icon = mod.icon;
            return (
              <motion.div
                key={mod.path}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
              >
                <Card
                  className="group cursor-pointer hover:shadow-lg transition-all duration-300 overflow-hidden border-border/60 h-full"
                  onClick={() => navigate(mod.path)}
                >
                  <CardContent className="p-6 md:p-8">
                    <div className="flex items-start gap-5">
                      <div
                        className={`size-14 shrink-0 rounded-2xl bg-gradient-to-br ${mod.gradient} flex items-center justify-center text-white shadow-lg`}
                      >
                        <Icon className="size-7" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-2 mb-1">
                          <h3 className="text-xl font-bold">{mod.title}</h3>
                          <span className="text-xs text-muted-foreground font-mono">
                            {mod.subtitle}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">
                          {mod.description}
                        </p>
                        <ul className="grid grid-cols-2 gap-y-1.5 gap-x-4">
                          {mod.highlights.map((h) => (
                            <li
                              key={h}
                              className="text-sm text-foreground/80 flex items-center gap-1.5"
                            >
                              <span className={`size-1.5 rounded-full bg-gradient-to-r ${mod.gradient}`} />
                              {h}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div className="mt-5 pt-4 border-t border-border/50 flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">立即体验</span>
                      <span className="text-sm font-medium text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
                        进入 <ArrowRight className="size-4" />
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

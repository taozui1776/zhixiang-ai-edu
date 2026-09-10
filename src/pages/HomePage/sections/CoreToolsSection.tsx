import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, FlaskConical, Code2, Wrench, ArrowRight, GraduationCap } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const CORE_TOOLS = [
  {
    path: '/courses',
    title: '课程库',
    subtitle: '完整课程体系',
    icon: BookOpen,
    description: '对标国家纲要，K12 全学段系统化 AI 课程',
    stats: ['3 学段', '8 大模块', '完整课时'],
    gradient: 'from-primary to-blue-500',
  },
  {
    path: '/ai-lab',
    title: 'AI 实验室',
    subtitle: '动手学 AI',
    icon: FlaskConical,
    description: '7 个真实 AI 实验，可视化理解算法原理',
    stats: ['图像识别', '文本生成', '模型训练'],
    gradient: 'from-violet-500 to-purple-500',
  },
  {
    path: '/coding-lab',
    title: '编程实验室',
    subtitle: '从图形化到代码',
    icon: Code2,
    description: 'Scratch + Python 双路径，循序渐进学编程',
    stats: ['图形化编程', 'Python 入门', '硬件编程'],
    gradient: 'from-emerald-500 to-teal-500',
  },
  {
    path: '/tools',
    title: '学科工具',
    subtitle: '教学辅助工具',
    icon: Wrench,
    description: '数据采集、模型训练、作品展示等轻量工具',
    stats: ['6 大类工具', '24+ 子工具', '课堂即用'],
    gradient: 'from-amber-500 to-orange-500',
  },
];

export default function CoreToolsSection() {
  const navigate = useNavigate();

  return (
    <section className="w-full py-16 md:py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              <GraduationCap className="size-3 mr-1" />
              一站式 AI 通识教学
            </Badge>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            四大核心功能
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-muted-foreground text-lg"
          >
            老师好备课、学生能实践，课程 + 实验 + 编程 + 工具全链路贯通
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {CORE_TOOLS.map((tool, i) => {
            const Icon = tool.icon;
            return (
              <motion.div
                key={tool.path}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                whileHover={{ y: -6 }}
              >
                <Card
                  className="group cursor-pointer hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 overflow-hidden border-border/60 h-full"
                  onClick={() => navigate(tool.path)}
                >
                  <CardContent className="p-5 md:p-6 flex flex-col h-full">
                    <div
                      className={`size-14 rounded-2xl bg-gradient-to-br ${tool.gradient} flex items-center justify-center text-white shadow-lg mb-4`}
                    >
                      <Icon className="size-7" />
                    </div>

                    <div className="text-xs text-muted-foreground mb-1">{tool.subtitle}</div>
                    <h3 className="text-xl font-bold mb-2">{tool.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4 flex-1">
                      {tool.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {tool.stats.map((s) => (
                        <Badge
                          key={s}
                          variant="outline"
                          className="text-[10px] h-5 px-2 border-border/60 bg-background"
                        >
                          {s}
                        </Badge>
                      ))}
                    </div>

                    <div className="pt-3 border-t border-border/50 flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">进入查看</span>
                      <span className="text-sm font-medium text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
                        开始 <ArrowRight className="size-3.5" />
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

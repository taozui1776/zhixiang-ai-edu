import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Rocket, Eye, ArrowRight, Clock, Layers } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const COURSE_SERIES = [
  {
    path: '/courses/course-primary-ai-intro',
    title: '常规 AI 通识课',
    subtitle: '标准课程体系',
    icon: BookOpen,
    description: '对标国家《中小学人工智能通识教育指南》，小学到高中循序渐进的 8 大模块完整课程',
    hours: '32 课时起步',
    feature: '教案+课件+实验+作业',
    gradient: 'from-blue-500 to-primary',
    tags: ['小学三~六年级', '初中七~八年级', '高中高一高二'],
  },
  {
    path: '/courses/course-senior-algorithm',
    title: 'PBL 项目式学习',
    subtitle: '跨学科项目课',
    icon: Rocket,
    description: '以真实问题为驱动，学生在项目实践中综合运用 AI 知识与计算思维',
    hours: '6 大系列 30+ 课时',
    feature: '项目驱动 · 小组协作',
    gradient: 'from-violet-500 to-purple-500',
    tags: ['AI 创意绘画', '智能对话设计', '数据新闻', 'AI 音乐'],
  },
  {
    path: '/courses/course-junior-vision',
    title: '机器视觉入门课',
    subtitle: 'AI 视觉专题',
    icon: Eye,
    description: '从图像识别到卷积神经网络，用真实实验带学生看懂 AI 视觉背后的原理',
    hours: '7 课时完整课件',
    feature: '动手实验 · 可视化',
    gradient: 'from-emerald-500 to-teal-500',
    tags: ['图像识别', '人脸检测', '卷积网络', '数据标注'],
  },
];

export default function CourseSeriesSection() {
  const navigate = useNavigate();

  return (
    <section className="w-full py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex items-end justify-between mb-10">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Badge className="mb-3 bg-emerald-500/10 text-emerald-700 border-emerald-500/20">
                <Layers className="size-3 mr-1" />
                完整课程体系
              </Badge>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-4xl font-bold mb-2"
            >
              三套精品课程
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-muted-foreground"
            >
              从基础通识到项目实践，满足不同场景教学需求
            </motion.p>
          </div>
          <button
            onClick={() => navigate('/courses')}
            className="hidden md:flex items-center gap-1 text-sm text-primary hover:gap-2 transition-all font-medium"
          >
            查看全部 <ArrowRight className="size-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {COURSE_SERIES.map((series, i) => {
            const Icon = series.icon;
            return (
              <motion.div
                key={series.path}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -4 }}
              >
                <Card
                  className="group cursor-pointer hover:shadow-xl transition-all duration-300 overflow-hidden border-border/60 h-full"
                  onClick={() => navigate(series.path)}
                >
                  {/* 顶部渐变条 */}
                  <div className={`h-2 bg-gradient-to-r ${series.gradient}`} />
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="flex items-start gap-4 mb-4">
                      <div
                        className={`size-12 shrink-0 rounded-xl bg-gradient-to-br ${series.gradient} flex items-center justify-center text-white shadow-md`}
                      >
                        <Icon className="size-6" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs text-muted-foreground mb-0.5">
                          {series.subtitle}
                        </div>
                        <h3 className="text-xl font-bold line-clamp-1">{series.title}</h3>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed flex-1">
                      {series.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {series.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="text-[10px] h-5 px-2 border-border/60 bg-muted/30"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-border/50">
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="size-3.5" />
                          {series.hours}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
                        进入课程 <ArrowRight className="size-3.5" />
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

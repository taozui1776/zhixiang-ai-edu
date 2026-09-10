import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GraduationCap, School, Building2, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const STAGES = [
  {
    id: 'primary',
    name: '小学',
    subtitle: '三 ~ 六年级',
    icon: GraduationCap,
    description: '兴趣启蒙、体验为主，在玩中学、做中学',
    features: ['AI 在身边', '数据小侦探', '语音识别体验', '智能小管家'],
    color: 'from-sky-500 to-cyan-400',
    bgColor: 'bg-sky-50',
    textColor: 'text-sky-600',
  },
  {
    id: 'junior',
    name: '初中',
    subtitle: '七 ~ 八年级',
    icon: School,
    description: '动手实践、算法思维，从体验走向创造',
    features: ['AI 创意表达', '机器人入门', 'Python 基础', '传感器应用'],
    color: 'from-primary to-purple-500',
    bgColor: 'bg-purple-50',
    textColor: 'text-primary',
  },
  {
    id: 'senior',
    name: '高中',
    subtitle: '高一 ~ 高二',
    icon: Building2,
    description: '深入算法、编程进阶，培养计算思维与创新能力',
    features: ['机器学习', '神经网络', '模型训练', 'AI 伦理'],
    color: 'from-indigo-500 to-violet-500',
    bgColor: 'bg-indigo-50',
    textColor: 'text-indigo-600',
  },
];

export default function StageSection() {
  const navigate = useNavigate();

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
            全学段覆盖，循序渐进
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-muted-foreground text-lg"
          >
            从小学到高中，8 个年级阶梯式课程体系，让 AI 学习像爬楼梯一样自然
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {STAGES.map((stage, i) => {
            const Icon = stage.icon;
            return (
              <motion.div
                key={stage.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
              >
                <Card
                  className="group cursor-pointer hover:shadow-lg transition-all duration-300 overflow-hidden border-border/60 h-full"
                  onClick={() => navigate(`/courses?stage=${stage.id}`)}
                >
                  <CardContent className="p-6 md:p-8 space-y-5">
                    {/* Icon */}
                    <div
                      className={`size-14 rounded-2xl bg-gradient-to-br ${stage.color} flex items-center justify-center text-white shadow-lg`}
                    >
                      <Icon className="size-7" />
                    </div>

                    {/* Title */}
                    <div>
                      <h3 className="text-xl font-bold mb-1 flex items-center gap-2">
                        {stage.name}
                        <span className={`text-sm font-normal ${stage.textColor}`}>
                          {stage.subtitle}
                        </span>
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {stage.description}
                      </p>
                    </div>

                    {/* Features */}
                    <ul className="space-y-2">
                      {stage.features.map((f) => (
                        <li
                          key={f}
                          className="text-sm text-foreground/80 flex items-center gap-2"
                        >
                          <span
                            className={`size-1.5 rounded-full bg-gradient-to-r ${stage.color}`}
                          />
                          {f}
                        </li>
                      ))}
                    </ul>

                    {/* CTA */}
                    <div className="pt-2 flex items-center gap-1 text-sm font-medium text-primary group-hover:gap-2 transition-all">
                      查看课程
                      <ArrowRight className="size-4" />
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

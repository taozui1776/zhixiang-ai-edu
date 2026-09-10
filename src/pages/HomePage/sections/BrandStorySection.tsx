import { motion } from 'framer-motion';
import { Sparkles, Heart, Lightbulb, Users } from 'lucide-react';
import Image from '@/components/ui/image';

const MASCOT_IMG = 'https://aka.doubaocdn.com/s/RUYRoCZ6Ts';

const VALUES = [
  {
    icon: Sparkles,
    title: '科技启蒙',
    desc: '用有趣的方式让孩子初识 AI，激发好奇心与探索欲',
  },
  {
    icon: Heart,
    title: '温度教育',
    desc: '小象陪伴式学习，知识有温度、成长有伙伴',
  },
  {
    icon: Lightbulb,
    title: '动手实践',
    desc: '每节课都有实验与编程任务，在做中学、在玩中悟',
  },
  {
    icon: Users,
    title: '师生同行',
    desc: '为教师备好课、为学生搭好台，家校社协同育新人',
  },
];

export default function BrandStorySection() {
  return (
    <section className="w-full py-16 md:py-20 bg-gradient-to-b from-background to-primary/5">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Mascot */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex justify-center order-2 lg:order-1"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-sky-300/30 to-purple-400/20 rounded-full blur-3xl scale-75" />
            <div className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96">
              <div className="absolute -inset-2 bg-gradient-to-br from-primary/20 via-sky-400/10 to-purple-500/20 rounded-full blur-2xl" />
              <Image
                src={MASCOT_IMG}
                alt="智象——AI 小象吉祥物"
                className="relative z-10 w-full h-full object-contain drop-shadow-xl"
              />
            </div>

            {/* Decorative tag */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="absolute bottom-4 -right-2 md:right-4 bg-card/90 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-lg border border-border/50 z-20"
            >
              <div className="flex items-center gap-2">
                <span className="text-2xl">👋</span>
                <div>
                  <div className="text-sm font-semibold text-foreground">你好，我是智象</div>
                  <div className="text-xs text-muted-foreground">你的 AI 学习小伙伴</div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right: Story text */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6 order-1 lg:order-2"
          >
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20">
              <Sparkles className="size-3.5" />
              关于智象
            </div>

            <h2 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight">
              一只热爱 AI 的
              <span className="bg-gradient-to-r from-primary to-sky-500 bg-clip-text text-transparent">
                {' '}小象{' '}
              </span>
              ，陪伴你走进 AI 世界
            </h2>

             <p className="text-base text-muted-foreground leading-relaxed">
               智象是面向未来的人工智能通识教育平台，深耕中小学课堂，服务全学段成长。
               我们以可爱的 AI 小象「智象」为吉祥物，把抽象的人工智能知识
               变成生动有趣的故事、动手实践的实验和充满创意的项目，
               让每一个学习者都能在实践中认识 AI、爱上 AI。
             </p>
             <p className="text-base text-muted-foreground leading-relaxed">
               从小学到高中，从身边的智能音箱到算法背后的原理，
               智象陪你一步一步走进奇妙的人工智能世界。
             </p>

            <div className="grid grid-cols-2 gap-4 pt-2">
              {VALUES.map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 * i }}
                    className="flex items-start gap-3 p-4 rounded-xl bg-card/60 border border-border/50"
                  >
                    <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Icon className="size-4 text-primary" />
                    </div>
                    <div className="space-y-0.5 min-w-0">
                      <div className="text-sm font-semibold text-foreground">{item.title}</div>
                      <div className="text-xs text-muted-foreground leading-relaxed">{item.desc}</div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

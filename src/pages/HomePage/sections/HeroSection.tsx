import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, BookOpen, ArrowRight, PlayCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import Image from '@/components/ui/image';
import { getTeachHistory, type TeachRecord } from '@/pages/TeachModePage/tools';

const HERO_IMG = 'https://aka.doubaocdn.com/s/RUYRoCZ6Ts';

export default function HeroSection() {
  const navigate = useNavigate();
  const [teachHistory, setTeachHistory] = useState<TeachRecord[]>([]);

  useEffect(() => {
    setTeachHistory(getTeachHistory().slice(0, 2));
  }, []);

  return (
    <section className="w-full relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-purple-500/10" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-24 lg:py-32 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6"
          >
            <Badge
              variant="secondary"
              className="px-3 py-1 text-sm gap-1.5 bg-primary/10 text-primary border-primary/20"
            >
              <Sparkles className="size-3.5" />
              对标 2025 版国家 AI 通识教育指南
            </Badge>

             <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
               人工智能
               <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                 {' '}通识教育{' '}
               </span>
               平台
             </h1>

             <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
               智象 —— 让每一节 AI 通识课都能动手。
               面向中小学课堂、覆盖 K12 学段，整合课程资源、动手实验与 AI 工具，
               老师好备课、学生能实践，在做中学 AI。
             </p>

            <div className="flex flex-wrap gap-3 pt-2">
              {/* 醒目的主行动按钮 */}
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-purple-500 rounded-xl blur-lg opacity-60 animate-pulse" />
                <Button
                  size="lg"
                  onClick={() => navigate('/courses')}
                  className="relative gap-2 px-8 h-14 text-lg font-semibold bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-500/90 shadow-xl shadow-primary/30"
                >
                  <PlayCircle className="size-5" />
                  开始上课
                </Button>
              </motion.div>

              <Button
                size="lg"
                variant="secondary"
                onClick={() => navigate('/ai-tools')}
                className="h-14 text-base"
              >
                <Sparkles className="size-4" />
                AI 备课助手
              </Button>
            </div>

            {/* 最近授课快速入口（有记录时显示） */}
            {teachHistory.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="pt-4"
              >
                <div className="text-xs text-muted-foreground mb-2 flex items-center gap-1.5">
                  <Clock className="size-3.5" />
                  最近授课
                </div>
                <div className="flex flex-wrap gap-2">
                  {teachHistory.map((record) => {
                    const progress =
                      record.totalSlides > 1
                        ? Math.round((record.slideIndex / (record.totalSlides - 1)) * 100)
                        : 100;
                    return (
                      <Card
                        key={record.courseId}
                        onClick={() => navigate(`/teach/${record.courseId}`)}
                        className="cursor-pointer hover:border-primary/40 hover:shadow-md hover:shadow-primary/10 transition-all w-56"
                      >
                        <CardContent className="p-3">
                          <div className="text-sm font-medium text-foreground line-clamp-1 mb-1.5">
                            {record.lessonTitle}
                          </div>
                          <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-1.5">
                            <span>第 {record.slideIndex + 1}/{record.totalSlides} 页</span>
                            <span className="text-primary font-semibold">{progress}%</span>
                          </div>
                          <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-primary to-purple-500 rounded-full"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </motion.div>
            )}

            <div className="flex items-center gap-6 pt-4">
              <div className="flex items-center gap-2">
                <BookOpen className="size-5 text-primary" />
                <div>
                  <div className="text-2xl font-bold">200+</div>
                  <div className="text-xs text-muted-foreground">课时资源</div>
                </div>
              </div>
              <div className="h-10 w-px bg-border" />
              <div>
                <div className="text-2xl font-bold">8 个</div>
                <div className="text-xs text-muted-foreground">课程模块</div>
              </div>
              <div className="h-10 w-px bg-border" />
              <div>
                <div className="text-2xl font-bold">3 学段</div>
                <div className="text-xs text-muted-foreground">全年级覆盖</div>
              </div>
            </div>
          </motion.div>

          {/* Right: Mascot image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex justify-center"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-full blur-3xl scale-75 top-10" />
             <div className="relative w-72 h-72 md:w-96 md:h-96 lg:w-[450px] lg:h-[450px]">
               <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/25 via-blue-400/15 to-purple-500/20 animate-pulse" />
               <div className="absolute -inset-4 bg-gradient-to-br from-sky-300/30 to-purple-400/20 rounded-full blur-2xl scale-90" />
               <Image
                 src={HERO_IMG}
                 alt="智象吉祥物"
                 className="relative z-10 w-full h-full object-contain drop-shadow-2xl"
               />
             </div>

            {/* Floating cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="absolute top-10 -left-2 md:-left-8 bg-card/90 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-border/50 z-20"
            >
              <div className="flex items-center gap-2">
                <div className="size-8 rounded-lg bg-green-500/15 flex items-center justify-center">
                  <BookOpen className="size-4 text-green-600" />
                </div>
                <div>
                  <div className="text-xs font-semibold">小学三年级</div>
                  <div className="text-[10px] text-muted-foreground">第1单元 · 初识AI</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="absolute bottom-16 -right-2 md:-right-4 bg-card/90 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-border/50 z-20"
            >
              <div className="flex items-center gap-2">
                <div className="size-8 rounded-lg bg-primary/15 flex items-center justify-center">
                  <Sparkles className="size-4 text-primary" />
                </div>
                <div>
                  <div className="text-xs font-semibold">AI 备课助手</div>
                  <div className="text-[10px] text-muted-foreground">一键生成教案</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

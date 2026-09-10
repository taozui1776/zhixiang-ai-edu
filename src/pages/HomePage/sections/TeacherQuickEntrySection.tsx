import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PlayCircle, Clock, ChevronRight, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate, Link } from 'react-router-dom';
import { getTeachHistory, type TeachRecord } from '@/pages/TeachModePage/tools';

const STAGE_LABELS: Record<string, string> = {
  primary: '小学',
  junior: '初中',
  senior: '高中',
};

export default function TeacherQuickEntrySection() {
  const navigate = useNavigate();
  const [teachHistory, setTeachHistory] = useState<TeachRecord[]>([]);

  useEffect(() => {
    setTeachHistory(getTeachHistory().slice(0, 3));
    const timer = setInterval(() => {
      setTeachHistory(getTeachHistory().slice(0, 3));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  if (teachHistory.length === 0) return null;

  return (
    <section className="w-full py-12 md:py-16 bg-gradient-to-br from-primary/5 via-background to-purple-500/5">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-primary/15 text-primary border-primary/20">
                  <GraduationCap className="size-3 mr-1" />
                  教师专区
                </Badge>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">最近授课</h2>
              <p className="text-muted-foreground mt-1">继续上次的课堂进度，一键进入授课模式</p>
            </div>
            <Button variant="ghost" asChild className="text-muted-foreground hover:text-foreground">
              <Link to="/teacher-center">
                教师中心
                <ChevronRight className="size-4 ml-1" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {teachHistory.map((record, i) => {
              const progress =
                record.totalSlides > 1
                  ? Math.round((record.slideIndex / (record.totalSlides - 1)) * 100)
                  : 100;
              const stageLabel = STAGE_LABELS[record.stage || ''] || '课程';
              return (
                <motion.button
                  key={record.courseId}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  whileHover={{ y: -4 }}
                  onClick={() => navigate(`/teach/${record.courseId}`)}
                  className="text-left group"
                >
                  <Card className="h-full overflow-hidden border-border/60 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 transition-all">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <Badge variant="outline" className="text-[10px] border-primary/25 text-primary bg-primary/5">
                          {stageLabel}
                        </Badge>
                        <div className="size-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                          <PlayCircle className="size-4" />
                        </div>
                      </div>

                      <div className="font-semibold text-foreground line-clamp-2 mb-3 min-h-[2.75rem]">
                        {record.lessonTitle}
                      </div>

                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                        <span>第 {record.slideIndex + 1} / {record.totalSlides} 页</span>
                        <span className="font-semibold text-primary">{progress}%</span>
                      </div>

                      <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden mb-3">
                        <div
                          className="h-full bg-gradient-to-r from-primary to-purple-500 rounded-full"
                          style={{ width: `${progress}%` }}
                        />
                      </div>

                      <div className="text-[11px] text-muted-foreground/70 flex items-center gap-1">
                        <Clock className="size-3" />
                        {new Date(record.lastTime).toLocaleString('zh-CN', {
                          month: 'numeric',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

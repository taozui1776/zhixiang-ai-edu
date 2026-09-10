import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Target,
  Award,
  BookOpen,
  Trophy,
  TrendingUp,
  Brain,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ChevronRight,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { MOCK_TRAININGS, getQuizByStage, type IQuizQuestion } from '@/data/training';
import { toast } from 'sonner';

type QuizQuestion = IQuizQuestion;

const STAGE_TABS = [
  { value: 'primary', label: '小学', grades: '三 ~ 六年级' },
  { value: 'junior', label: '初中', grades: '七 ~ 八年级' },
  { value: 'senior', label: '高中', grades: '高一、高二' },
];

const STAGE_LABELS: Record<string, string> = {
  primary: '小学',
  junior: '初中',
  senior: '高中',
};

interface QuizState {
  trainingId: string;
  trainingName: string;
  stage: 'primary' | 'junior' | 'senior';
  currentIndex: number;
  answers: (number | null)[];
  showResult: boolean;
}

export default function TrainingPage() {
  const [activeStage, setActiveStage] = useState<'primary' | 'junior' | 'senior'>('primary');
  const [quiz, setQuiz] = useState<QuizState | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);

  const filteredTrainings = MOCK_TRAININGS.filter((t) => t.stage === activeStage);

  // 按当前答题的学段取对应题库
  const currentQuizData = quiz ? getQuizByStage(quiz.stage) : [];
  const totalQuestions = currentQuizData.length;
  const currentQuestion = quiz && currentQuizData.length > 0 ? currentQuizData[quiz.currentIndex] : null;

  const score = useMemo(() => {
    if (!quiz) return 0;
    return quiz.answers.reduce((count, ans, i) => {
    return count + (ans === currentQuizData[i].correctIndex ? 1 : 0);
    }, 0);
  }, [quiz]);

  const correctRate = quiz && quiz.answers.filter((a) => a !== null).length > 0
    ? Math.round((score / quiz.answers.filter((a) => a !== null).length) * 100)
    : 0;

  const startQuiz = (training: (typeof MOCK_TRAININGS)[0]) => {
    const quizData = getQuizByStage(training.stage);
    setQuiz({
      trainingId: training.id,
      trainingName: training.title,
      currentIndex: 0,
      answers: new Array(quizData.length).fill(null),
      stage: training.stage,
      showResult: false,
    });
    setSelectedOption(null);
    setHasAnswered(false);
  };

  const closeQuiz = () => {
    setQuiz(null);
    setSelectedOption(null);
    setHasAnswered(false);
  };

  const selectOption = (index: number) => {
    if (hasAnswered || !currentQuestion) return;
    setSelectedOption(index);
  };

  const submitAnswer = () => {
    if (selectedOption === null || !quiz) return;
    setHasAnswered(true);

    const newAnswers = [...quiz.answers];
    newAnswers[quiz.currentIndex] = selectedOption;
    setQuiz({ ...quiz, answers: newAnswers });

    const isCorrect = selectedOption === currentQuestion!.correctIndex;
    if (isCorrect) {
      toast.success('回答正确！');
    } else {
      toast.error('回答错误，看看解析吧');
    }
  };

  const nextQuestion = () => {
    if (!quiz) return;
    if (quiz.currentIndex < totalQuestions - 1) {
      setQuiz({ ...quiz, currentIndex: quiz.currentIndex + 1 });
      setSelectedOption(null);
      setHasAnswered(false);
    } else {
      setQuiz({ ...quiz, showResult: true });
    }
  };

  const restartQuiz = () => {
    if (!quiz) return;
    setQuiz({
      ...quiz,
      currentIndex: 0,
      answers: new Array(currentQuizData.length).fill(null),
      showResult: false,
    });
    setSelectedOption(null);
    setHasAnswered(false);
    toast.info('测评已重置，重新开始吧！');
  };

  const progress = quiz
    ? ((quiz.currentIndex + (hasAnswered ? 1 : 0)) / totalQuestions) * 100
    : 0;

  const stageStats = {
    primary: { count: 12, done: 0, rank: '青铜学习者' },
    junior: { count: 15, done: 0, rank: '白银探索者' },
    senior: { count: 18, done: 0, rank: '黄金研究员' },
  };

  const currentStats = stageStats[activeStage as keyof typeof stageStats] || stageStats.primary;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="w-full bg-gradient-to-br from-orange-500/10 via-background to-amber-500/10 py-14 md:py-18">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <Badge className="mb-3 bg-orange-500/15 text-orange-600 border-orange-500/20">
              <Target className="size-3 mr-1" />
              训练中心
            </Badge>
            <h1 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">
              AI 素养训练
            </h1>
            <p className="text-lg text-muted-foreground">
              分级题目与测评，边学边练，稳步提升你的 AI 素养与创新能力。
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 space-y-12">
        {/* Stats cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: '题库总量', value: '200+', icon: BookOpen, color: 'from-blue-500 to-cyan-400' },
            { label: '学段覆盖', value: '3 学段', icon: Award, color: 'from-purple-500 to-pink-500' },
            { label: '题目类型', value: '6 种', icon: Brain, color: 'from-emerald-500 to-teal-400' },
            { label: '学习等级', value: '5 级', icon: Trophy, color: 'from-amber-500 to-orange-400' },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
              >
                <Card className="h-full border-border/60">
                  <CardContent className="p-4 md:p-5">
                    <div
                      className={`size-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center text-white mb-2`}
                    >
                      <Icon className="size-5" />
                    </div>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="text-xs text-muted-foreground">{stat.label}</div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Stage tabs */}
        <Tabs value={activeStage} onValueChange={(v) => setActiveStage(v as 'primary' | 'junior' | 'senior')}>
          <TabsList className="grid grid-cols-3 w-full md:w-auto">
            {STAGE_TABS.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {STAGE_TABS.map((tab) => (
            <TabsContent key={tab.value} value={tab.value} className="mt-6 space-y-6">
              {/* Stage info banner */}
              <Card className="border-border/60 bg-gradient-to-r from-primary/5 via-purple-500/5 to-orange-500/5">
                <CardContent className="p-5 flex flex-col md:flex-row items-start md:items-center gap-4">
                  <div className="size-14 rounded-2xl bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-white shadow-lg shrink-0">
                    <TrendingUp className="size-7" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-0.5">
                      {tab.label}学段 · AI 素养训练
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {tab.grades} · 共 {currentStats.count} 套测评 · 当前等级：
                      {currentStats.rank}
                    </p>
                  </div>
                  <Button variant="secondary" className="shrink-0">
                    查看学习报告
                    <ChevronRight className="size-4" />
                  </Button>
                </CardContent>
              </Card>

              {/* Training cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredTrainings.map((item, i) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.05 }}
                  >
                    <Card className="h-full hover:shadow-lg transition-all duration-300 border-border/60 overflow-hidden">
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge
                            variant={item.type === 'assessment' ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {item.type === 'assessment' ? '测评' : '练习'}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {item.questionCount} 题
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {item.duration} 分钟
                          </Badge>
                        </div>
                        <CardTitle className="text-lg">{item.title}</CardTitle>
                        <CardDescription className="text-sm line-clamp-2">
                          {item.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center gap-2 text-xs">
                          <Badge variant="outline" className="text-[11px] py-0 h-5">
                            {item.difficulty}
                          </Badge>
                          <span className="text-muted-foreground">{item.module}</span>
                        </div>
                        <Button
                          className="w-full gap-1"
                          onClick={() => startQuiz(item)}
                        >
                          开始{item.type === 'assessment' ? '测评' : '练习'}
                          <ArrowRight className="size-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}

                {/* More coming card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: filteredTrainings.length * 0.05 }}
                >
                  <Card className="h-full border-dashed border-border/80 bg-muted/20 hover:bg-muted/40 transition-colors">
                    <CardContent className="p-6 flex flex-col items-center justify-center h-full min-h-[200px] text-center">
                      <Sparkles className="size-10 text-muted-foreground/30 mb-2" />
                      <h3 className="font-semibold text-muted-foreground mb-1">
                        更多测评即将上线
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        我们正持续更新题库，敬请期待
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Learning features */}
        <section className="py-6">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <Badge
              variant="secondary"
              className="mb-2 bg-purple-500/10 text-purple-600 border-purple-500/20"
            >
              特色功能
            </Badge>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">科学训练，稳步提升</h2>
            <p className="text-muted-foreground">
              多元测评形式 + 智能学习分析，让每一次练习都有收获
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                icon: Brain,
                title: '智能出题',
                desc: '根据学习进度智能调整题目难度，越练越精准',
                color: 'from-blue-500 to-cyan-400',
              },
              {
                icon: BookOpen,
                title: '详细解析',
                desc: '每道题都附详细讲解，做错了也能马上理解',
                color: 'from-emerald-500 to-teal-400',
              },
              {
                icon: Trophy,
                title: '等级体系',
                desc: '青铜到王者 5 大等级，闯关升级有成就感',
                color: 'from-amber-500 to-orange-400',
              },
              {
                icon: TrendingUp,
                title: '学习报告',
                desc: '可视化学习数据，精准定位知识薄弱点',
                color: 'from-purple-500 to-pink-500',
              },
            ].map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                >
                  <Card className="h-full border-border/60">
                    <CardContent className="p-5 space-y-2">
                      <div
                        className={`size-11 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center text-white`}
                      >
                        <Icon className="size-5" />
                      </div>
                      <h3 className="font-semibold">{f.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {f.desc}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </section>
      </div>

      {/* Quiz Dialog */}
      <Dialog open={quiz !== null} onOpenChange={(open) => !open && closeQuiz()}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Trophy className="size-5 text-primary" />
              {quiz?.trainingName}
            </DialogTitle>
            <DialogDescription>
              {quiz?.showResult
                ? `共 ${totalQuestions} 题，答对 ${score} 题，正确率 ${correctRate}%`
                : `第 ${(quiz?.currentIndex ?? 0) + 1} / ${totalQuestions} 题`}
            </DialogDescription>
          </DialogHeader>

          {!quiz?.showResult && currentQuestion && (
            <>
              <Progress value={progress} className="h-1.5" />

              <div className="space-y-4 pt-2">
                <h3 className="text-lg font-semibold leading-relaxed">
                  {currentQuestion.question}
                </h3>

                <div className="space-y-2.5">
                  {currentQuestion.options.map((opt, i) => {
                    const isSelected = selectedOption === i;
                    const isCorrect = i === currentQuestion.correctIndex;
                    const showCorrect = hasAnswered && isCorrect;
                    const showWrong = hasAnswered && isSelected && !isCorrect;

                    return (
                      <button
                        key={i}
                        onClick={() => selectOption(i)}
                        disabled={hasAnswered}
                        className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-start gap-3 ${
                          showCorrect
                            ? 'border-emerald-500 bg-emerald-500/10'
                            : showWrong
                              ? 'border-destructive bg-destructive/10'
                              : isSelected
                                ? 'border-primary bg-primary/10'
                                : 'border-border/60 hover:border-primary/50 hover:bg-muted/50'
                        } ${hasAnswered ? 'cursor-default' : 'cursor-pointer'}`}
                      >
                        <span
                          className={`size-6 rounded-full flex items-center justify-center shrink-0 text-sm font-semibold ${
                            showCorrect
                              ? 'bg-emerald-500 text-white'
                              : showWrong
                                ? 'bg-destructive text-white'
                                : isSelected
                                  ? 'bg-primary text-primary-foreground'
                                  : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {String.fromCharCode(65 + i)}
                        </span>
                        <span className="flex-1 pt-0.5">{opt}</span>
                        {showCorrect && (
                          <CheckCircle2 className="size-5 text-emerald-500 shrink-0" />
                        )}
                        {showWrong && (
                          <XCircle className="size-5 text-destructive shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {hasAnswered && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="p-4 rounded-xl bg-muted/50 border border-border/60 text-sm"
                  >
                    <div className="font-semibold mb-1 flex items-center gap-1.5">
                      <Sparkles className="size-4 text-primary" />
                      解析
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      {currentQuestion.explanation}
                    </p>
                  </motion.div>
                )}
              </div>

              <DialogFooter className="flex-col sm:flex-row gap-2">
                <Button variant="secondary" onClick={closeQuiz}>
                  退出测评
                </Button>
                {!hasAnswered ? (
                  <Button onClick={submitAnswer} disabled={selectedOption === null}>
                    提交答案
                    <CheckCircle2 className="size-4 ml-1" />
                  </Button>
                ) : (
                  <Button onClick={nextQuestion}>
                    {quiz.currentIndex < totalQuestions - 1 ? '下一题' : '查看结果'}
                    <ArrowRight className="size-4 ml-1" />
                  </Button>
                )}
              </DialogFooter>
            </>
          )}

          {quiz?.showResult && (
            <div className="space-y-5 py-2">
              <div className="text-center py-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', duration: 0.6 }}
                  className={`size-24 rounded-full mx-auto mb-4 flex items-center justify-center text-white shadow-lg ${
                    correctRate >= 80
                      ? 'bg-gradient-to-br from-emerald-500 to-teal-400'
                      : correctRate >= 60
                        ? 'bg-gradient-to-br from-amber-500 to-orange-400'
                        : 'bg-gradient-to-br from-blue-500 to-cyan-400'
                  }`}
                >
                  <Trophy className="size-12" />
                </motion.div>
                <h3 className="text-2xl font-bold mb-1">
                  {correctRate >= 80
                    ? '太棒了！'
                    : correctRate >= 60
                      ? '继续加油！'
                      : '再接再厉！'}
                </h3>
                <p className="text-muted-foreground">
                  你答对了 <span className="font-bold text-foreground">{score}</span> /{' '}
                  {totalQuestions} 题，正确率{' '}
                  <span className="font-bold text-foreground">{correctRate}%</span>
                </p>
              </div>

              {/* Breakdown */}
              <div className="p-4 rounded-xl bg-muted/30 border border-border/50 space-y-2">
                <div className="text-sm font-semibold mb-2">答题详情</div>
                {currentQuizData.map((q, i) => {
                  const userAns = quiz.answers[i];
                  const isCorrect = userAns === q.correctIndex;
                  return (
                    <div
                      key={q.id}
                      className="flex items-start gap-2 text-sm py-1.5 border-b border-border/50 last:border-0"
                    >
                      {isCorrect ? (
                        <CheckCircle2 className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="size-4 text-destructive shrink-0 mt-0.5" />
                      )}
                      <span className="flex-1 line-clamp-1">
                        第 {i + 1} 题：{q.question}
                      </span>
                    </div>
                  );
                })}
              </div>

              <DialogFooter className="flex-col sm:flex-row gap-2">
                <Button variant="secondary" onClick={closeQuiz}>
                  返回列表
                </Button>
                <Button onClick={restartQuiz}>
                  <RotateCcw className="size-4 mr-1" />
                  再测一次
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Rocket,
  Star,
  Clock,
  Cpu,
  Lightbulb,
  Trophy,
  Calendar,
  ExternalLink,
  BookOpen,
  Search,
  Sparkles,
  Award,
  Layers,
  GraduationCap,
  Target,
  Zap,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  MOCK_CHALLENGES,
  MOCK_CONTESTS,
  MOCK_RESOURCES,
  CHALLENGE_STAGES,
  CONTEST_CATEGORIES,
  RESOURCE_CATEGORIES,
  type IChallenge,
  type IContest,
  type IResource,
  type ChallengeStage,
  type ContestCategory,
  type ResourceCategory,
} from '@/data/after-school';
import Image from '@/components/ui/image';
import { useNavigate } from 'react-router-dom';

const MASCOT_IMG = 'https://aka.doubaocdn.com/s/FTGHri7UGK';

// 难度星级渲染
function DifficultyStars({ level }: { level: 1 | 2 | 3 }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3].map((i) => (
        <Star
          key={i}
          className={`size-3.5 ${
            i <= level
              ? 'text-amber-400 fill-amber-400'
              : 'text-muted-foreground/30'
          }`}
        />
      ))}
    </div>
  );
}

// ============ 课后挑战卡片 ============
function ChallengeCard({ challenge }: { challenge: IChallenge }) {
  const navigate = useNavigate();
  const stageInfo = CHALLENGE_STAGES.find((s) => s.value === challenge.stage)!;
  return (
    <Card
      className="h-full border border-border/60 hover:border-primary/30 hover:shadow-md transition-all duration-300 flex flex-col overflow-hidden group cursor-pointer"
      onClick={() => navigate(`/after-school/challenge/${challenge.id}`)}
    >
      <div className="h-1 w-full bg-gradient-to-r from-primary via-purple-500 to-cyan-500" />
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2 mb-2">
          <Badge variant="outline" className={`text-[11px] ${stageInfo.color}`}>
            {stageInfo.label}
          </Badge>
          <DifficultyStars level={challenge.difficulty} />
        </div>
        <CardTitle className="text-base font-bold leading-tight group-hover:text-primary transition-colors">
          {challenge.title}
        </CardTitle>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
          <Clock className="size-3.5" />
          {challenge.duration}
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col pt-0">
        <p className="text-sm text-muted-foreground leading-relaxed mb-3 line-clamp-3">
          {challenge.description}
        </p>
        <div className="flex items-start gap-1.5 text-xs text-muted-foreground mb-3">
          <Cpu className="size-3.5 shrink-0 mt-0.5" />
          <span>{challenge.hardware}</span>
        </div>
        <div className="flex flex-wrap gap-1 mb-3">
          {challenge.knowledge.slice(0, 3).map((k) => (
            <Badge key={k} variant="secondary" className="text-[10px] font-normal">
              {k}
            </Badge>
          ))}
        </div>
        <div className="mt-auto pt-2 flex items-center justify-between">
          <Badge variant="outline" className="text-[10px] font-normal">
            {challenge.category}
          </Badge>
          <Button variant="ghost" size="sm" className="text-xs h-7 gap-1 -mr-2">
            开始挑战
            <Zap className="size-3.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ============ 竞赛卡片 ============
function ContestCard({ contest }: { contest: IContest }) {
  const catLabels = contest.categories
    .map((c) => CONTEST_CATEGORIES.find((cc) => cc.value === c)?.label)
    .filter(Boolean) as string[];
  const stageLabels = contest.stages.map(
    (s) => CHALLENGE_STAGES.find((cs) => cs.value === s)?.label,
  );

  return (
    <Card className="h-full border border-border/60 hover:border-primary/30 hover:shadow-md transition-all duration-300 flex flex-col overflow-hidden group">
      <div className="h-1 w-full bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500" />
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2 mb-1">
          <CardTitle className="text-base font-bold leading-tight group-hover:text-primary transition-colors">
            {contest.name}
          </CardTitle>
        </div>
        <CardDescription className="text-xs">{contest.organizer}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col pt-0 space-y-3">
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
          {contest.description}
        </p>

        <div className="space-y-2 text-xs">
          <div className="flex items-start gap-2">
            <Calendar className="size-3.5 text-muted-foreground shrink-0 mt-0.5" />
            <span className="text-muted-foreground">
              <span className="text-foreground font-medium">举办周期：</span>
              {contest.cycle}
            </span>
          </div>
          <div className="flex items-start gap-2">
            <GraduationCap className="size-3.5 text-muted-foreground shrink-0 mt-0.5" />
            <span className="text-muted-foreground">
              <span className="text-foreground font-medium">参赛学段：</span>
              {stageLabels.join('、')}
            </span>
          </div>
          <div className="flex items-start gap-2">
            <Trophy className="size-3.5 text-muted-foreground shrink-0 mt-0.5" />
            <span className="text-muted-foreground">
              <span className="text-foreground font-medium">比赛方向：</span>
              {catLabels.join(' / ')}
            </span>
          </div>
        </div>

        {contest.highlight && (
          <div className="px-2.5 py-1.5 rounded-md bg-amber-50 border border-amber-200/60 text-[11px] text-amber-700 flex items-center gap-1.5">
            <Award className="size-3.5 shrink-0" />
            {contest.highlight}
          </div>
        )}

        <div className="mt-auto pt-2">
          <Button
            variant="outline"
            size="sm"
            className="w-full text-xs gap-1"
            onClick={() => window.open(contest.website, '_blank', 'noopener,noreferrer')}
          >
            查看官网
            <ExternalLink className="size-3.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ============ 资源卡片 ============
function ResourceCard({ resource }: { resource: IResource }) {
  const catInfo = RESOURCE_CATEGORIES.find((c) => c.value === resource.category);
  const stageLabels = resource.stages.map(
    (s) => CHALLENGE_STAGES.find((cs) => cs.value === s)?.label,
  );

  const typeLabels: Record<string, string> = {
    tutorial: '教程',
    course: '课程',
    book: '书籍',
    website: '网站',
    tool: '工具',
  };

  return (
    <Card className="h-full border border-border/60 hover:border-primary/30 hover:shadow-sm transition-all duration-300 overflow-hidden group">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="size-10 rounded-lg bg-gradient-to-br from-primary/10 to-accent flex items-center justify-center shrink-0">
            {resource.type === 'book' && <BookOpen className="size-5 text-primary" />}
            {resource.type === 'tutorial' && <Lightbulb className="size-5 text-primary" />}
            {resource.type === 'course' && <GraduationCap className="size-5 text-primary" />}
            {resource.type === 'website' && <GlobeIcon className="size-5 text-primary" />}
            {resource.type === 'tool' && <Cpu className="size-5 text-primary" />}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors truncate">
              {resource.name}
            </h4>
            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
              <Badge variant="outline" className="text-[10px] font-normal h-5 px-1.5">
                {typeLabels[resource.type] || resource.type}
              </Badge>
              {resource.isFree && (
                <Badge
                  variant="outline"
                  className="text-[10px] font-normal h-5 px-1.5 text-emerald-700 border-emerald-200 bg-emerald-50"
                >
                  免费
                </Badge>
              )}
            </div>
          </div>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed mt-3 line-clamp-2">
          {resource.description}
        </p>
        <div className="flex items-center justify-between mt-3 pt-2 border-t border-border/40">
          <span className="text-[11px] text-muted-foreground">{stageLabels.join(' / ')}</span>
          {resource.url !== '#' && (
            <button
              onClick={() => window.open(resource.url, '_blank', 'noopener,noreferrer')}
              className="text-xs text-primary hover:underline font-medium flex items-center gap-0.5"
            >
              去看看
              <ExternalLink className="size-3" />
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function GlobeIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

// ============ 备赛建议 ============
function ContestTipsSection() {
  const tips = [
    {
      icon: Target,
      title: '如何选择比赛',
      points: [
        '根据学段和兴趣方向选择，优先教育部白名单赛事',
        '入门先参加校内 / 区级比赛积累经验',
        '认准官方主办单位，避免商业味过重的"水赛"',
      ],
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Layers,
      title: '备赛时间规划',
      points: [
        '提前 2-3 个月开始备赛，每周固定 2-3 次练习',
        '先打基础（编程/硬件/算法），再练真题',
        '赛前 1 个月集中模拟训练，查漏补缺',
      ],
      color: 'from-emerald-500 to-teal-500',
    },
    {
      icon: Sparkles,
      title: '备赛技巧',
      points: [
        '组队参赛：分工合作，发挥各自特长',
        '多做真题：熟悉题型和评分标准',
        '记录错题：建立错题本，反复巩固',
      ],
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: Award,
      title: '心态与成长',
      points: [
        '重在参与，过程比结果更重要',
        '比赛是检验学习的方式，不是目的',
        '每次比赛后复盘总结，持续进步',
      ],
      color: 'from-amber-500 to-orange-500',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="mt-12"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="size-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white shadow-md shadow-amber-500/30">
          <Lightbulb className="size-5" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-foreground">备赛建议</h3>
          <p className="text-sm text-muted-foreground">科学备赛，事半功倍</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {tips.map((tip, idx) => {
          const Icon = tip.icon;
          return (
            <motion.div
              key={tip.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <Card className="h-full border-0 bg-gradient-to-br from-background to-muted/50 hover:shadow-md transition-all duration-300">
                <CardContent className="p-5">
                  <div
                    className={`size-11 rounded-xl bg-gradient-to-br ${tip.color} flex items-center justify-center text-white shadow-sm mb-3`}
                  >
                    <Icon className="size-5" />
                  </div>
                  <h4 className="font-bold text-foreground mb-3">{tip.title}</h4>
                  <ul className="space-y-2">
                    {tip.points.map((p, i) => (
                      <li key={i} className="text-xs text-muted-foreground leading-relaxed flex items-start gap-2">
                        <span className="size-1.5 rounded-full bg-primary shrink-0 mt-1.5" />
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
    </motion.div>
  );
}

export default function AfterSchoolPage() {
  const [activeTab, setActiveTab] = useState<'challenges' | 'contests' | 'resources'>(
    'challenges',
  );

  // 挑战筛选
  const [challengeStage, setChallengeStage] = useState<ChallengeStage | 'all'>('all');
  const [challengeKeyword, setChallengeKeyword] = useState('');

  const filteredChallenges = useMemo(() => {
    return MOCK_CHALLENGES.filter((c) => {
      const stageMatch = challengeStage === 'all' || c.stage === challengeStage;
      const keywordMatch =
        !challengeKeyword ||
        c.title.toLowerCase().includes(challengeKeyword.toLowerCase()) ||
        c.description.toLowerCase().includes(challengeKeyword.toLowerCase()) ||
        c.knowledge.some((k) => k.includes(challengeKeyword));
      return stageMatch && keywordMatch;
    });
  }, [challengeStage, challengeKeyword]);

  // 竞赛筛选
  const [contestCategory, setContestCategory] = useState<ContestCategory | 'all'>('all');
  const [contestStage, setContestStage] = useState<ChallengeStage | 'all'>('all');

  const filteredContests = useMemo(() => {
    return MOCK_CONTESTS.filter((c) => {
      const catMatch = contestCategory === 'all' || c.categories.includes(contestCategory);
      const stageMatch = contestStage === 'all' || c.stages.includes(contestStage);
      return catMatch && stageMatch;
    });
  }, [contestCategory, contestStage]);

  // 资源筛选
  const [resourceCategory, setResourceCategory] = useState<ResourceCategory | 'all'>('all');
  const [resourceStage, setResourceStage] = useState<ChallengeStage | 'all'>('all');

  const filteredResources = useMemo(() => {
    return MOCK_RESOURCES.filter((r) => {
      const catMatch = resourceCategory === 'all' || r.category === resourceCategory;
      const stageMatch = resourceStage === 'all' || r.stages.includes(resourceStage);
      return catMatch && stageMatch;
    });
  }, [resourceCategory, resourceStage]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/[0.02] to-purple-500/5">
      {/* Hero */}
      <section className="w-full bg-gradient-to-br from-indigo-600 via-purple-600 to-violet-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 size-64 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-10 right-20 size-80 rounded-full bg-cyan-400 blur-3xl" />
        </div>
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-16 md:py-20 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center max-w-3xl mx-auto"
          >
            <Badge
              variant="outline"
              className="mb-5 px-3 py-1 bg-white/10 border-white/20 text-white backdrop-blur-sm"
            >
              <Rocket className="size-3.5 mr-1" />
              课后拓展 · 动手挑战
            </Badge>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 tracking-tight">
              课堂之外，继续动手
            </h1>
            <p className="text-base md:text-lg text-white/80 leading-relaxed mb-6">
              AI 课后挑战 · 竞赛备赛资源 · 学习资料推荐
              <br />
              让 45 分钟的课堂延伸到课外，每一个感兴趣的同学都能继续探索
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button
                size="lg"
                variant="secondary"
                className="bg-white text-purple-700 hover:bg-white/90 gap-2"
                onClick={() => setActiveTab('challenges')}
              >
                <Zap className="size-4" />
                课后挑战
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent text-white border-white/30 hover:bg-white/10 hover:text-white gap-2"
                onClick={() => setActiveTab('contests')}
              >
                <Trophy className="size-4" />
                AI 竞赛
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent text-white border-white/30 hover:bg-white/10 hover:text-white gap-2"
                onClick={() => setActiveTab('resources')}
              >
                <BookOpen className="size-4" />
                备赛资源
              </Button>
            </div>
          </motion.div>
        </div>
        {/* 小象吉祥物装饰 */}
        <div className="absolute right-8 bottom-4 size-24 md:size-32 opacity-30">
          <Image src={MASCOT_IMG} alt="智象" className="w-full h-full object-contain" />
        </div>
      </section>

      {/* Tab 切换 */}
      <main className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as typeof activeTab)}
          className="w-full"
        >
          <TabsList className="grid w-full max-w-lg mx-auto grid-cols-3 mb-8">
            <TabsTrigger value="challenges" className="text-sm gap-1.5">
              <Zap className="size-4" />
              课后挑战
            </TabsTrigger>
            <TabsTrigger value="contests" className="text-sm gap-1.5">
              <Trophy className="size-4" />
              AI 竞赛
            </TabsTrigger>
            <TabsTrigger value="resources" className="text-sm gap-1.5">
              <BookOpen className="size-4" />
              备赛资源
            </TabsTrigger>
          </TabsList>

          {/* Tab 1: 课后挑战 */}
          <TabsContent value="challenges" className="mt-0">
            {/* 筛选栏 */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="flex-1 relative">
                <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="搜索挑战项目或知识点…"
                  value={challengeKeyword}
                  onChange={(e) => setChallengeKeyword(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select
                value={challengeStage}
                onValueChange={(v) => setChallengeStage(v as ChallengeStage | 'all')}
              >
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="选择学段" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部学段</SelectItem>
                  {CHALLENGE_STAGES.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-muted-foreground">
                共 <span className="font-medium text-foreground">{filteredChallenges.length}</span>{' '}
                个挑战项目
              </p>
            </div>

            {filteredChallenges.length === 0 ? (
              <div className="text-center py-16">
                <div className="size-16 mx-auto rounded-full bg-muted flex items-center justify-center mb-4">
                  <Search className="size-6 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">暂无匹配的挑战项目，试试其他关键词吧</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                {filteredChallenges.map((c, i) => (
                  <motion.div
                    key={c.id}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  >
                    <ChallengeCard challenge={c} />
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Tab 2: AI 竞赛 */}
          <TabsContent value="contests" className="mt-0">
            {/* 筛选栏 */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <Select
                value={contestCategory}
                onValueChange={(v) => setContestCategory(v as ContestCategory | 'all')}
              >
                <SelectTrigger className="w-full sm:w-44">
                  <SelectValue placeholder="比赛方向" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部方向</SelectItem>
                  {CONTEST_CATEGORIES.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={contestStage}
                onValueChange={(v) => setContestStage(v as ChallengeStage | 'all')}
              >
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="参赛学段" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部学段</SelectItem>
                  {CHALLENGE_STAGES.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-muted-foreground">
                共 <span className="font-medium text-foreground">{filteredContests.length}</span>{' '}
                个竞赛
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
              {filteredContests.map((c, i) => (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                >
                  <ContestCard contest={c} />
                </motion.div>
              ))}
            </div>

            {/* 备赛建议 */}
            <ContestTipsSection />
          </TabsContent>

          {/* Tab 3: 备赛资源 */}
          <TabsContent value="resources" className="mt-0">
            {/* 筛选栏 */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <Select
                value={resourceCategory}
                onValueChange={(v) => setResourceCategory(v as ResourceCategory | 'all')}
              >
                <SelectTrigger className="w-full sm:w-44">
                  <SelectValue placeholder="资源类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部类型</SelectItem>
                  {RESOURCE_CATEGORIES.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={resourceStage}
                onValueChange={(v) => setResourceStage(v as ChallengeStage | 'all')}
              >
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="适用学段" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部学段</SelectItem>
                  {CHALLENGE_STAGES.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-muted-foreground">
                共 <span className="font-medium text-foreground">{filteredResources.length}</span>{' '}
                个推荐资源
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredResources.map((r, i) => (
                <motion.div
                  key={r.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                >
                  <ResourceCard resource={r} />
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Cpu,
  Eye,
  Mic,
  Brain,
  Sparkles,
  Search,
  Star,
  Library,
  Zap,
  Flame,
  Target,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Image from '@/components/ui/image';
import {
  AI_LAB_PROJECTS,
  type AiLabCategory,
  type AiProjectTier,
  type AiProjectLevel,
  type IAiLabProject,
} from '@/data/ai-lab-projects';

const CATEGORY_TABS: { value: AiLabCategory | 'all'; label: string; icon: typeof Eye }[] = [
  { value: 'all', label: '全部项目', icon: Sparkles },
  { value: 'computer-vision', label: '计算机视觉', icon: Eye },
  { value: 'nlp', label: '自然语言处理', icon: Mic },
  { value: 'machine-learning', label: '机器学习', icon: Brain },
  { value: 'aigc', label: 'AIGC', icon: Sparkles },
];

const TIER_COLORS: Record<AiProjectTier, string> = {
  体验: 'bg-orange-100 text-orange-700 border-orange-200',
  探究: 'bg-amber-100 text-amber-700 border-amber-200',
  训练: 'bg-rose-100 text-rose-700 border-rose-200',
};

const TIER_ICON = {
  体验: Zap,
  探究: Flame,
  训练: Target,
};

const DIFFICULTY_OPTIONS: { value: 'all' | AiProjectLevel; label: string }[] = [
  { value: 'all', label: '全部难度' },
  { value: '入门', label: '入门级' },
  { value: '进阶', label: '进阶级' },
];

export default function AiLabPage() {
  const navigate = useNavigate();
  const [category, setCategory] = useState<AiLabCategory | 'all'>('all');
  const [difficulty, setDifficulty] = useState<'all' | AiProjectLevel>('all');
  const [keyword, setKeyword] = useState('');

  const filteredProjects = useMemo(() => {
    return AI_LAB_PROJECTS.filter((p) => {
      if (category !== 'all' && p.category !== category) return false;
      if (difficulty !== 'all' && p.level !== difficulty) return false;
      if (keyword.trim()) {
        const kw = keyword.toLowerCase();
        return (
          p.name.toLowerCase().includes(kw) ||
          p.description.toLowerCase().includes(kw) ||
          p.techTag.toLowerCase().includes(kw)
        );
      }
      return true;
    });
  }, [category, difficulty, keyword]);

  // 按分类分组（全部模式下）
  const groupedProjects = useMemo(() => {
    if (category !== 'all') return null;
    const groups: Record<AiLabCategory, IAiLabProject[]> = {
      'computer-vision': [],
      nlp: [],
      'machine-learning': [],
      aigc: [],
    };
    filteredProjects.forEach((p) => {
      groups[p.category].push(p);
    });
    return groups;
  }, [filteredProjects, category]);

  return (
    <div className="min-h-screen bg-slate-50/60">
      {/* 顶部 Banner */}
      <div className="w-full bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute top-[-30%] right-[-5%] w-[400px] h-[400px] bg-cyan-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-[-20%] left-[-5%] w-[350px] h-[350px] bg-violet-400/20 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 text-white">
              <Badge className="bg-white/20 text-white border-0 mb-4 backdrop-blur-sm">
                <Sparkles className="size-3 mr-1" />
                AI 虚拟实验室
              </Badge>
              <h1 className="text-3xl md:text-4xl font-bold mb-3">
                AI 就在这里，触手可及
              </h1>
              <p className="text-white/80 text-sm md:text-base max-w-lg mb-6 leading-relaxed">
                计算机视觉、自然语言处理、机器学习、AIGC
                四大方向，20+个交互式实验项目，在浏览器中即可体验 AI 的神奇魅力。
              </p>
              <div className="flex flex-wrap gap-3">
                <Button
                  size="lg"
                  className="bg-white text-primary hover:bg-white/90 shadow-lg h-11"
                  onClick={() => {
                    const recommended = AI_LAB_PROJECTS.find((p) => p.isRecommended);
                    if (recommended) navigate(`/ai-lab/${recommended.id}`);
                  }}
                >
                  <Star className="size-4 mr-2 text-amber-500" />
                  开始推荐实验
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-white/10 text-white border-white/30 hover:bg-white/20 hover:text-white h-11"
                  onClick={() => navigate('/my-materials')}
                >
                  <Library className="size-4 mr-2" />
                  我的素材库
                </Button>
              </div>
            </div>

            {/* 右侧虚拟人 / 图标装饰 */}
            <div className="hidden md:block w-64 shrink-0">
              <div className="relative w-64 h-64">
                <div className="absolute inset-0 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
                  <Cpu className="size-24 text-white/80" />
                </div>
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute -top-2 -right-2 size-16 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center"
                >
                  <Eye className="size-7 text-white" />
                </motion.div>
                <motion.div
                  animate={{ y: [0, 6, 0] }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: 0.5,
                  }}
                  className="absolute bottom-2 -left-2 size-14 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center"
                >
                  <Brain className="size-6 text-white" />
                </motion.div>
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: 1,
                  }}
                  className="absolute top-1/2 -right-4 size-12 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center"
                >
                  <Sparkles className="size-5 text-white" />
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 筛选 + 分类 Tab */}
      <div className="w-full bg-card border-b border-border/60 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3">
          <div className="flex flex-col gap-3">
            {/* 分类 Tab */}
            <Tabs
              value={category}
              onValueChange={(v) => setCategory(v as AiLabCategory | 'all')}
            >
              <TabsList className="bg-muted/50 h-9 flex-wrap h-auto">
                {CATEGORY_TABS.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <TabsTrigger
                      key={tab.value}
                      value={tab.value}
                      className="h-8 px-3 text-xs md:text-sm data-[state=active]:bg-white"
                    >
                      <Icon className="size-3.5 mr-1.5" />
                      {tab.label}
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </Tabs>

            {/* 搜索 + 难度筛选 */}
            <div className="flex items-center gap-3">
              <div className="flex-1 relative max-w-xl">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="搜索项目名称、技术标签…"
                  className="pl-10 h-9 bg-muted/40 border-muted"
                />
              </div>

              <Select
                value={difficulty}
                onValueChange={(v) => setDifficulty(v as typeof difficulty)}
              >
                <SelectTrigger className="w-[120px] h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DIFFICULTY_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* 项目列表 */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        {/* 全部模式：按分类分组展示 */}
        {groupedProjects ? (
          <div className="space-y-10">
            {(
              [
                { key: 'computer-vision', label: '计算机视觉', icon: Eye },
                { key: 'nlp', label: '自然语言处理', icon: Mic },
                { key: 'machine-learning', label: '机器学习', icon: Brain },
                { key: 'aigc', label: 'AIGC', icon: Sparkles },
              ] as const
            ).map((cat) => {
              const projects = groupedProjects[cat.key];
              if (projects.length === 0) return null;
              const Icon = cat.icon;
              return (
                <div key={cat.key}>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="size-7 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="size-4 text-primary" />
                    </div>
                    <h2 className="text-lg font-semibold text-foreground">{cat.label}</h2>
                    <Badge variant="outline" className="text-xs">
                      {projects.length} 个项目
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {projects.map((p, i) => (
                      <motion.div
                        key={p.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, delay: i * 0.03 }}
                      >
                        <ProjectCard project={p} onClick={() => navigate(`/ai-lab/${p.id}`)} />
                      </motion.div>
                    ))}
                  </div>
                </div>
              );
            })}

            {filteredProjects.length === 0 && <EmptyResult />}
          </div>
        ) : (
          // 单分类模式：网格展示
          <>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm text-muted-foreground">
                共找到 <strong className="text-foreground">{filteredProjects.length}</strong> 个项目
              </span>
            </div>

            {filteredProjects.length === 0 ? (
              <EmptyResult />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredProjects.map((p, i) => (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: i * 0.03 }}
                  >
                    <ProjectCard project={p} onClick={() => navigate(`/ai-lab/${p.id}`)} />
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

function ProjectCard({
  project,
  onClick,
}: {
  project: IAiLabProject;
  onClick: () => void;
}) {
  const TierIcon = TIER_ICON[project.tier];

  const categoryGradient: Record<string, string> = {
    'computer-vision': 'from-blue-500 to-cyan-500',
    nlp: 'from-violet-500 to-purple-500',
    'machine-learning': 'from-emerald-500 to-teal-500',
    aigc: 'from-pink-500 to-orange-500',
  };

  return (
    <Card
      onClick={onClick}
      className="group cursor-pointer hover:shadow-lg transition-all duration-300 overflow-hidden border-border/60 h-full bg-card"
    >
      {/* 顶部图标区 */}
      <div
        className={`h-20 bg-gradient-to-br ${categoryGradient[project.category]} relative flex items-center justify-center`}
      >
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative z-10 text-white flex items-center gap-3">
          <div className="size-11 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center">
            <Cpu className="size-5" />
          </div>
          <div>
            <p className="text-[11px] text-white/80">{project.categoryLabel}</p>
            <p className="text-sm font-semibold">{project.name}</p>
          </div>
        </div>
        {project.isRecommended && (
          <Badge className="absolute top-2 right-2 text-[10px] bg-amber-400 text-amber-900 border-0">
            <Star className="size-3 mr-0.5 fill-amber-900" />
            推荐
          </Badge>
        )}
      </div>

      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <Badge
            variant="outline"
            className={`text-[10px] h-5 px-2 border-0 ${TIER_COLORS[project.tier]}`}
          >
            <TierIcon className="size-3 mr-1" />
            {project.tier}
          </Badge>
          <Badge variant="outline" className="text-[10px] h-5 px-2">
            {project.techTag}
          </Badge>
          <Badge
            variant="outline"
            className={`text-[10px] h-5 px-2 ml-auto ${
              project.level === '入门'
                ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                : 'bg-violet-50 text-violet-600 border-violet-200'
            }`}
          >
            {project.level}
          </Badge>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed mb-3 min-h-[2.5rem]">
          {project.shortDesc}
        </p>

        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <span className="text-xs text-muted-foreground">{project.teaching.duration}</span>
          <span className="text-xs font-medium text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
            开始实验 →
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyResult() {
  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="py-16 text-center">
        <div className="size-16 mx-auto mb-4 rounded-2xl bg-muted/60 flex items-center justify-center">
          <Search className="size-7 text-muted-foreground/50" />
        </div>
        <h3 className="text-base font-semibold text-foreground mb-1">暂无匹配项目</h3>
        <p className="text-sm text-muted-foreground">试试调整筛选条件</p>
      </CardContent>
    </Card>
  );
}

import { useState, useMemo } from 'react';
import { Heart } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Search,
  Filter,
  BookOpen,
  Clock,
  ChevronDown,
  ArrowRight,
  Layers,
  Star,
  PlayCircle,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
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
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { Checkbox } from '@/components/ui/checkbox';
import { useIsMobile } from '@/hooks/use-mobile';
import Image from '@/components/ui/image';
import {
  MOCK_COURSE_SUMMARY,
  type ICourseSummary,
  type CourseDifficulty,
} from '@/data/course-summary';
import { useFavorites } from '@/hooks/useTeacherData';

const STAGE_TABS = [
  { value: 'all', label: '全部学段' },
  { value: 'primary-low', label: '小学低段' },
  { value: 'primary-high', label: '小学高段' },
  { value: 'junior', label: '初中' },
  { value: 'senior', label: '高中' },
] as const;

const CATEGORIES = ['全部类别', 'AI 通识', 'AI 应用', 'PBL 项目', '信息科技'] as const;

const DIFFICULTIES: { value: 'all' | CourseDifficulty; label: string }[] = [
  { value: 'all', label: '全部难度' },
  { value: '入门', label: '入门' },
  { value: '进阶', label: '进阶' },
  { value: '挑战', label: '挑战' },
];

const SORT_OPTIONS = [
  { value: 'default', label: '综合排序' },
  { value: 'recent', label: '最近使用' },
  { value: 'lessons-desc', label: '课时从多到少' },
  { value: 'difficulty-asc', label: '难度从低到高' },
];

export default function CourseLibraryPage() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [searchParams] = useSearchParams();
  const urlStage = (searchParams.get('stage') as string) || 'all';

  const [stage, setStage] = useState<string>(urlStage);
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('全部类别');
  const [difficulty, setDifficulty] = useState<'all' | CourseDifficulty>('all');
  const [sortBy, setSortBy] = useState('default');
  const [filterOpen, setFilterOpen] = useState(false);
  const { favoriteIds, toggleFavorite } = useFavorites();

  const courses = useMemo(() => {
    let result = [...MOCK_COURSE_SUMMARY];

    if (stage !== 'all') {
      result = result.filter((c) => c.stage === stage);
    }
    if (category !== '全部类别') {
      result = result.filter((c) => c.category === category);
    }
    if (difficulty !== 'all') {
      result = result.filter((c) => c.difficulty === difficulty);
    }
    if (keyword.trim()) {
      const kw = keyword.toLowerCase();
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(kw) ||
          c.description.toLowerCase().includes(kw) ||
          c.tags.some((t) => t.toLowerCase().includes(kw)),
      );
    }

    // 排序
    switch (sortBy) {
      case 'lessons-desc':
        result.sort((a, b) => b.totalLessons - a.totalLessons);
        break;
      case 'difficulty-asc': {
        const order: Record<CourseDifficulty, number> = { 入门: 1, 进阶: 2, 挑战: 3 };
        result.sort((a, b) => order[a.difficulty] - order[b.difficulty]);
        break;
      }
      default:
        break;
    }

    return result;
  }, [stage, category, difficulty, keyword, sortBy]);

  const difficultyColor = (d: CourseDifficulty) => {
    if (d === '入门') return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    if (d === '进阶') return 'bg-blue-100 text-blue-700 border-blue-200';
    return 'bg-violet-100 text-violet-700 border-violet-200';
  };

  return (
    <div className="min-h-screen bg-slate-50/60">
      {/* 顶部筛选区 */}
      <div className="w-full bg-card border-b border-border/60 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
          {/* 学段Tab */}
          <div className="flex items-center justify-between mb-3 gap-4">
            <Tabs value={stage} onValueChange={setStage} className="flex-1">
              <TabsList className="bg-muted/50 h-9">
                {STAGE_TABS.map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="h-8 px-3 text-xs md:text-sm data-[state=active]:bg-white"
                  >
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          {/* 搜索 + 筛选 + 排序 */}
          <div className="flex items-center gap-3">
            <div className="flex-1 relative max-w-xl">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="搜索课程名称、知识点、标签…"
                className="pl-10 h-10 bg-muted/40 border-muted"
              />
            </div>

            {!isMobile && (
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-[140px] h-10">
                  <SelectValue placeholder="学科分类" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {!isMobile && (
              <Select value={difficulty} onValueChange={(v) => setDifficulty(v as typeof difficulty)}>
                <SelectTrigger className="w-[120px] h-10">
                  <SelectValue placeholder="难度" />
                </SelectTrigger>
                <SelectContent>
                  {DIFFICULTIES.map((d) => (
                    <SelectItem key={d.value} value={d.value}>
                      {d.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[130px] h-10">
                <SelectValue placeholder="排序" />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {isMobile && (
              <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="h-10 w-10 shrink-0">
                    <Filter className="size-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px]">
                  <div className="space-y-6 py-4">
                    <h3 className="font-semibold text-base">筛选条件</h3>

                    <div className="space-y-3">
                      <p className="text-sm font-medium">学科分类</p>
                      <div className="space-y-2">
                        {CATEGORIES.map((c) => (
                          <label
                            key={c}
                            className="flex items-center gap-2 text-sm cursor-pointer"
                          >
                            <Checkbox
                              checked={category === c}
                              onCheckedChange={() => setCategory(c)}
                            />
                            {c}
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <p className="text-sm font-medium">难度</p>
                      <div className="space-y-2">
                        {DIFFICULTIES.map((d) => (
                          <label
                            key={d.value}
                            className="flex items-center gap-2 text-sm cursor-pointer"
                          >
                            <Checkbox
                              checked={difficulty === d.value}
                              onCheckedChange={() => setDifficulty(d.value as typeof difficulty)}
                            />
                            {d.label}
                          </label>
                        ))}
                      </div>
                    </div>

                    <SheetClose asChild>
                      <Button className="w-full">应用筛选</Button>
                    </SheetClose>
                  </div>
                </SheetContent>
              </Sheet>
            )}
          </div>
        </div>
      </div>

      {/* 主体课程列表 */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <BookOpen className="size-4 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">全部课程</h2>
            <Badge variant="outline" className="text-xs">
              共 {courses.length} 门
            </Badge>
          </div>
        </div>

        {courses.length === 0 ? (
          <Card className="border-0 shadow-sm">
            <CardContent className="py-16 text-center">
              <div className="size-16 mx-auto mb-4 rounded-2xl bg-muted/60 flex items-center justify-center">
                <Search className="size-7 text-muted-foreground/50" />
              </div>
              <h3 className="text-base font-semibold text-foreground mb-1">暂无匹配课程</h3>
              <p className="text-sm text-muted-foreground mb-4">
                试试调整筛选条件或搜索关键词
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setStage('all');
                  setCategory('全部类别');
                  setDifficulty('all');
                  setKeyword('');
                }}
              >
                重置筛选
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {courses.map((course, i) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                whileHover={{ y: -4 }}
              >
                <CourseCard
                  course={course}
                  difficultyColor={difficultyColor(course.difficulty)}
                  isFavorite={favoriteIds.includes(course.id)}
                  onClick={() => navigate(`/courses/${course.id}`)}
                  onToggleFavorite={(e) => {
                    e.stopPropagation();
                    toggleFavorite(course.id);
                    toast.success(favoriteIds.includes(course.id) ? '已取消收藏' : '已加入收藏');
                  }}
                />
              </motion.div>
            ))}
          </div>
        )}

        {/* 更多课程预告 */}
        {courses.length < 6 && (
          <div className="mt-10 p-6 rounded-xl bg-gradient-to-br from-primary/5 to-accent/20 border border-border/60 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Star className="size-4 text-primary" />
              <span className="text-sm font-medium text-foreground">更多课程持续更新中</span>
            </div>
            <p className="text-xs text-muted-foreground max-w-md mx-auto">
              我们正在持续丰富课程资源库，涵盖更多学段、更多主题的AI课程，敬请关注。
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

function CourseCard({
  course,
  difficultyColor,
  isFavorite,
  onClick,
  onToggleFavorite,
}: {
  course: ICourseSummary;
  difficultyColor: string;
  isFavorite: boolean;
  onClick: () => void;
  onToggleFavorite: (e: React.MouseEvent) => void;
}) {
  const progress = course.completedLessons
    ? Math.round((course.completedLessons / course.totalLessons) * 100)
    : 0;

  return (
    <Card
      className="group cursor-pointer hover:shadow-xl transition-all duration-300 overflow-hidden border-border/60 h-full bg-card"
      onClick={onClick}
    >
      {/* 封面 */}
      <div className="relative aspect-video overflow-hidden bg-muted">
        <Image
          src={course.coverImage}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge className="text-[10px] bg-white/90 text-foreground border-0 backdrop-blur-xs">
            {course.stageLabel}
          </Badge>
          <Badge
            variant="outline"
            className={`text-[10px] border-0 ${difficultyColor}`}
          >
            {course.difficulty}
          </Badge>
        </div>
        <button
          onClick={onToggleFavorite}
          className="absolute top-3 right-3 size-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center shadow-sm hover:bg-white transition-colors"
          aria-label={isFavorite ? '取消收藏' : '收藏'}
        >
          <Heart className={`size-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : 'text-foreground/60'}`} />
        </button>
        {progress > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
            <div
              className="h-full bg-primary transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>

      <CardContent className="p-5 flex flex-col h-[calc(100%-12rem)]">
        <div className="flex items-start gap-2 mb-2">
          <span className="text-[11px] text-muted-foreground bg-muted/60 px-2 py-0.5 rounded">
            {course.category}
          </span>
          <span className="text-[11px] text-muted-foreground flex items-center gap-1 ml-auto">
            <Clock className="size-3" />
            {course.totalLessons} 课时
          </span>
        </div>

        <h3 className="text-base font-bold text-foreground line-clamp-1 mb-1.5 group-hover:text-primary transition-colors">
          {course.title}
        </h3>

        <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1 leading-relaxed">
          {course.description}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {course.tags.slice(0, 3).map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              className="text-[10px] h-5 px-2 border-border/60 bg-muted/30"
            >
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-border/50">
          <span className="text-xs text-muted-foreground">
            {progress > 0 ? `已学 ${progress}%` : '未开始'}
          </span>
          <span className="text-sm font-medium text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
            进入课程 <ArrowRight className="size-3.5" />
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

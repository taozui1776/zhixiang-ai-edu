import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Map,
  BookOpen,
  CheckCircle2,
  Circle,
  ChevronRight,
  Search,
  GraduationCap,
  Target,
  Layers,
  Filter,
  Flag,
  Mountain,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import {
  KNOWLEDGE_MODULES,
  getKnowledgeByModule,
  getCoverageStats,
  LESSON_KNOWLEDGE_MAP,
} from '@/data/knowledge';
import { getAllLessons } from '@/data/courses';
import type { IKnowledgePoint } from '@/data/knowledge';
import { useNavigate } from 'react-router-dom';

const STAGE_LABELS: Record<string, string> = {
  primary: '小学',
  junior: '初中',
  senior: '高中',
  all: '全学段',
};

const STAGE_OPTIONS = [
  { value: 'all', label: '全部学段' },
  { value: 'primary', label: '小学段' },
  { value: 'junior', label: '初中段' },
  { value: 'senior', label: '高中段' },
];

const MODULE_ICONS = ['🧠', '📊', '🔍', '⚙️', '🤝', '🤖', '💻', '⚖️'];

export default function KnowledgeMapPage() {
  const [activeModule, setActiveModule] = useState<string>('smart_life');
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState('all');
  const navigate = useNavigate();

  const stats = getCoverageStats();

  // 按模块分组的知识点
  const modulePoints = useMemo(() => {
    const coveredIds = new Set(Object.values(LESSON_KNOWLEDGE_MAP).flat());
    const allLessons = getAllLessons();
    const lessonTitleMap: Record<string, string> = {};
    allLessons.forEach((l) => {
      lessonTitleMap[l.id] = l.title;
    });

    return KNOWLEDGE_MODULES.map((mod) => {
      const points = getKnowledgeByModule(mod.key).filter((kp) => {
        const matchSearch =
          !search ||
          kp.title.toLowerCase().includes(search.toLowerCase()) ||
          kp.description.toLowerCase().includes(search.toLowerCase());
        const matchStage = stageFilter === 'all' || kp.stage === stageFilter || kp.stage === 'all';
        return matchSearch && matchStage;
      });
      const covered = points.filter((p) => coveredIds.has(p.id)).length;
      return {
        ...mod,
        points,
        covered,
        total: points.length,
        rate: points.length ? Math.round((covered / points.length) * 100) : 0,
      };
    });
  }, [search, stageFilter]);

  const activeModuleData = modulePoints.find((m) => m.key === activeModule);
  const coveredIds = new Set(Object.values(LESSON_KNOWLEDGE_MAP).flat());
  const allLessons = getAllLessons();
  const lessonTitleMap: Record<string, string> = {};
  allLessons.forEach((l) => {
    lessonTitleMap[l.id] = l.title;
  });

  // 把该模块的知识点按国家指南/安徽纲要分组展示
  const nationalPoints = activeModuleData?.points.filter((p) => p.source === 'national') ?? [];
  const anhuiPoints = activeModuleData?.points.filter((p) => p.source === 'anhui') ?? [];

  function getLessonTitles(pointId: string) {
    const lessonIds = Object.entries(LESSON_KNOWLEDGE_MAP)
      .filter(([, ids]) => ids.includes(pointId))
      .map(([lid]) => lid);
    return lessonIds.map((id) => ({ id, title: lessonTitleMap[id] || id }));
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="w-full bg-gradient-to-br from-primary/10 via-background to-cyan-500/10 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <Badge className="mb-3 bg-primary/15 text-primary border-primary/20">
              <Map className="size-3 mr-1" />
              知识点地图
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
              知识点对标体系
              <span className="block mt-1 bg-gradient-to-r from-primary to-cyan-500 bg-clip-text text-transparent">
                全面对齐国家指南与安徽纲要
              </span>
            </h1>
            <p className="text-muted-foreground leading-relaxed">
              智象课程体系严格对标《中小学人工智能通识教育指南(2025年版)》
              和《安徽省中小学人工智能通识教育课程纲要(2025年版)》，
              8 大课程模块、核心知识点全覆盖，让每一节课都有据可依。
            </p>
          </motion.div>

          {/* 覆盖率总览 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10"
          >
            {[
              {
                label: '课程模块',
                value: KNOWLEDGE_MODULES.length,
                unit: '大',
                icon: Layers,
                color: 'from-primary to-blue-500',
              },
              {
                label: '核心知识点',
                value: stats.totalPoints,
                unit: '个',
                icon: Target,
                color: 'from-purple-500 to-fuchsia-500',
              },
              {
                label: '国家指南覆盖率',
                value: stats.nationalPercent,
                unit: '%',
                icon: Flag,
                color: 'from-emerald-500 to-teal-500',
                sub: `${stats.coveredNational}/${stats.totalNational}`,
              },
              {
                label: '安徽纲要覆盖率',
                value: stats.anhuiPercent,
                unit: '%',
                icon: Mountain,
                color: 'from-amber-500 to-orange-500',
                sub: `${stats.coveredAnhui}/${stats.totalAnhui}`,
              },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <Card key={item.label} className="border-border/60 bg-card/80 backdrop-blur">
                  <CardContent className="p-4 md:p-5">
                    <div
                      className={`size-9 rounded-lg bg-gradient-to-br ${item.color} text-white flex items-center justify-center mb-3 shadow-sm`}
                    >
                      <Icon className="size-4.5" />
                    </div>
                    <div className="text-2xl md:text-3xl font-bold tabular-nums tracking-tight">
                      {item.value}
                      <span className="text-sm font-medium text-muted-foreground ml-1">{item.unit}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">{item.label}</div>
                    {item.sub && (
                      <div className="text-[10px] text-muted-foreground/70 mt-0.5">{item.sub} 个知识点</div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-10">
        {/* 搜索 + 筛选 */}
        <div className="flex flex-col md:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="搜索知识点..."
              className="pl-9"
            />
          </div>
          <div className="flex gap-2">
            <Select value={stageFilter} onValueChange={setStageFilter}>
              <SelectTrigger className="w-[140px]">
                <div className="flex items-center gap-1.5">
                  <GraduationCap className="size-3.5 text-muted-foreground" />
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent>
                {STAGE_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* 左侧模块导航 + 右侧知识点详情 */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* 模块导航 */}
          <div className="lg:col-span-1 space-y-2">
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 px-3">
              <Filter className="size-3 inline mr-1" />
              课程模块
            </div>
            {modulePoints.map((mod, i) => {
              if (mod.total === 0) return null;
              const isActive = activeModule === mod.key;
              return (
                <button
                  key={mod.key}
                  onClick={() => setActiveModule(mod.key)}
                  className={`w-full text-left p-3 rounded-xl transition-all ${
                    isActive
                      ? 'bg-primary/10 border border-primary/30 shadow-sm'
                      : 'border border-transparent hover:bg-muted/50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-xl">{MODULE_ICONS[i]}</span>
                    <div className="flex-1 min-w-0">
                      <div className={`font-medium text-sm ${isActive ? 'text-primary' : 'text-foreground'}`}>
                        {mod.name}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">{mod.total} 个知识点</div>
                      <div className="mt-2 h-1 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            mod.rate >= 80
                              ? 'bg-emerald-500'
                              : mod.rate >= 50
                              ? 'bg-amber-500'
                              : 'bg-rose-500'
                          }`}
                          style={{ width: `${mod.rate}%` }}
                        />
                      </div>
                    </div>
                    <div className="text-xs font-semibold tabular-nums text-muted-foreground shrink-0">
                      {mod.rate}%
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* 知识点详情 */}
          <div className="lg:col-span-3 space-y-5">
            {activeModuleData && (
              <motion.div
                key={activeModule}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <Card className="border-border/60 overflow-hidden">
                  <div className="h-1 w-full bg-gradient-to-r from-primary to-purple-500" />
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-2xl">
                        {MODULE_ICONS[KNOWLEDGE_MODULES.findIndex((m) => m.key === activeModule)]}
                      </span>
                      <div>
                        <CardTitle className="text-xl">{activeModuleData.name}</CardTitle>
                        <CardDescription>
                          本模块共 {activeModuleData.total} 个知识点，已覆盖 {activeModuleData.covered} 个
                        </CardDescription>
                      </div>
                      <Badge className="ml-auto bg-emerald-500/15 text-emerald-700 border-emerald-500/20">
                        覆盖率 {activeModuleData.rate}%
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* 国家指南知识点 */}
                    {nationalPoints.length > 0 && (
                      <div>
                        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2 text-blue-700">
                          <Flag className="size-4" />
                          国家指南知识点（{nationalPoints.length}）
                        </h3>
                        <Accordion type="single" collapsible className="w-full border border-blue-100 rounded-xl overflow-hidden">
                          {nationalPoints.map((kp, i) => (
                            <PointAccordionItem
                              key={kp.id}
                              kp={kp}
                              index={i}
                              isLast={i === nationalPoints.length - 1}
                              covered={coveredIds.has(kp.id)}
                              lessons={getLessonTitles(kp.id)}
                              onOpenLesson={(id) => navigate(`/courses/${id}`)}
                            />
                          ))}
                        </Accordion>
                      </div>
                    )}

                    {/* 安徽纲要知识点 */}
                    {anhuiPoints.length > 0 && (
                      <div>
                        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2 text-purple-700">
                          <Mountain className="size-4" />
                          安徽纲要知识点（{anhuiPoints.length}）
                        </h3>
                        <Accordion type="single" collapsible className="w-full border border-purple-100 rounded-xl overflow-hidden">
                          {anhuiPoints.map((kp, i) => (
                            <PointAccordionItem
                              key={kp.id}
                              kp={kp}
                              index={i}
                              isLast={i === anhuiPoints.length - 1}
                              covered={coveredIds.has(kp.id)}
                              lessons={getLessonTitles(kp.id)}
                              onOpenLesson={(id) => navigate(`/courses/${id}`)}
                            />
                          ))}
                        </Accordion>
                      </div>
                    )}

                    {activeModuleData.total === 0 && (
                      <div className="text-center py-10 text-muted-foreground">
                        该模块暂无匹配的知识点，请调整筛选条件
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </div>

        {/* 底部说明 */}
        <Card className="mt-12 border-primary/20 bg-gradient-to-br from-primary/5 via-background to-cyan-500/5">
          <CardContent className="p-6 text-center">
            <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
              智象持续迭代课程体系，不断补充和完善知识点覆盖。
              以上数据为当前版本统计，最终以实际课程为准。
              <br />
              如需详细的知识点对标报告，可通过「版本与方案」页面联系我们。
            </p>
            <Button className="mt-4 gap-1.5" onClick={() => navigate('/pricing')}>
              查看采购方案
              <ChevronRight className="size-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function PointAccordionItem({
  kp,
  index,
  isLast,
  covered,
  lessons,
  onOpenLesson,
}: {
  kp: IKnowledgePoint;
  index: number;
  isLast: boolean;
  covered: boolean;
  lessons: { id: string; title: string }[];
  onOpenLesson: (id: string) => void;
}) {
  return (
    <AccordionItem
      value={kp.id}
      className={`border-t border-border/40 ${index === 0 ? 'border-t-0' : ''} ${isLast ? '' : ''}`}
    >
      <AccordionTrigger className="px-4 py-3 hover:bg-muted/30 hover:no-underline text-left">
        <div className="flex items-center gap-3 flex-1 pr-4 min-w-0">
          {covered ? (
            <CheckCircle2 className="size-4 shrink-0 text-emerald-500" />
          ) : (
            <Circle className="size-4 shrink-0 text-muted-foreground/50" />
          )}
          <div className="flex-1 min-w-0">
            <div className="font-medium text-sm md:text-base truncate">{kp.title}</div>
          </div>
          <Badge variant="outline" className="shrink-0 text-[10px] h-4.5 border-border/60">
            {STAGE_LABELS[kp.stage]}
          </Badge>
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-4 pb-4">
        <div className="pl-7 space-y-3">
          <p className="text-sm text-muted-foreground leading-relaxed">{kp.description}</p>

          {lessons.length > 0 ? (
            <div>
              <div className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
                <BookOpen className="size-3" />
                关联课程（{lessons.length} 节）
              </div>
              <div className="flex flex-wrap gap-2">
                {lessons.map((l) => (
                  <Badge
                    key={l.id}
                    variant="secondary"
                    className="cursor-pointer hover:bg-accent transition-colors"
                    onClick={() => onOpenLesson(l.id)}
                  >
                    <span className="max-w-[160px] truncate">{l.title}</span>
                    <ChevronRight className="size-3 ml-0.5 shrink-0" />
                  </Badge>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-sm text-muted-foreground/70 italic flex items-center gap-1.5">
              <Circle className="size-3" />
              该知识点课程规划中，敬请期待
            </div>
          )}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}

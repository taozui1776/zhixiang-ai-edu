import { useState } from 'react';
import { FileText, Sparkles, Tag, RefreshCw, BookOpen, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';

interface ClassificationResult {
  category: string;
  confidence: number;
  subCategory: string;
  allScores: { label: string; score: number }[];
}

const CATEGORIES = [
  { key: 'tech', label: '科技', icon: '💻', color: 'text-blue-600 bg-blue-50' },
  { key: 'sports', label: '体育', icon: '⚽', color: 'text-emerald-600 bg-emerald-50' },
  { key: 'finance', label: '财经', icon: '💰', color: 'text-amber-600 bg-amber-50' },
  { key: 'entertainment', label: '娱乐', icon: '🎬', color: 'text-pink-600 bg-pink-50' },
  { key: 'health', label: '健康', icon: '🏥', color: 'text-rose-600 bg-rose-50' },
  { key: 'education', label: '教育', icon: '📚', color: 'text-violet-600 bg-violet-50' },
];

const SAMPLE_TEXTS = [
  {
    title: '科技新闻',
    text: '人工智能大模型最新突破：国产AI芯片性能再创新高，算力密度提升3倍。最新发布的通用人工智能平台在多项基准测试中超越国际同类产品，标志着我国在人工智能硬件领域取得重大进展。专家表示，这将为各行各业的智能化转型提供更强支撑。',
    expectedCategory: 'tech',
  },
  {
    title: '体育新闻',
    text: '世界杯预选赛激战正酣，国足主场2:1逆转对手，取得关键胜利。本场比赛球队展现出顽强拼搏精神，下半场连进两球完成逆转。球迷们纷纷表示，看到了中国足球的希望和进步。下一轮比赛将在客场进行。',
    expectedCategory: 'sports',
  },
  {
    title: '财经新闻',
    text: '央行宣布降准0.5个百分点，释放长期资金约1万亿元。此次降准旨在优化金融机构资金结构，增强金融机构支持实体经济的能力。分析师认为，降准有助于降低社会融资成本，对股市和债市形成积极影响。',
    expectedCategory: 'finance',
  },
];

export default function ProjectDemoNewsClassification() {
  const [inputText, setInputText] = useState('');
  const [isClassifying, setIsClassifying] = useState(false);
  const [result, setResult] = useState<ClassificationResult | null>(null);

  const runClassification = (preset?: typeof SAMPLE_TEXTS[0]) => {
    const text = preset?.text || inputText.trim();
    if (!text) {
      toast.error('请先输入新闻文本');
      return;
    }
    if (preset) setInputText(preset.text);

    setIsClassifying(true);
    setResult(null);

    setTimeout(() => {
      // 基于关键词模拟分类（演示用）
      const scores = CATEGORIES.map((cat) => {
        let score = 10 + Math.random() * 15; // 基础分
        const lowerText = text.toLowerCase();
        if (cat.key === 'tech' && /AI|人工智能|芯片|科技|互联网|算法|模型/.test(text)) score += 60;
        if (cat.key === 'sports' && /比赛|足球|篮球|奥运|国足|进球|世界杯/.test(text)) score += 60;
        if (cat.key === 'finance' && /央行|降准|股市|金融|经济|投资|GDP|财经/.test(text)) score += 60;
        if (cat.key === 'entertainment' && /电影|明星|综艺|音乐|娱乐|票房/.test(text)) score += 50;
        if (cat.key === 'health' && /健康|医疗|医院|疾病|医药|疫情/.test(text)) score += 50;
        if (cat.key === 'education' && /教育|学校|学生|课程|学习|AI通识/.test(text)) score += 55;
        return { label: cat.label, score: Math.min(99, score) };
      });

      scores.sort((a, b) => b.score - a.score);
      const top = scores[0];

      const catConfig = CATEGORIES.find((c) => c.label === top.label)!;
      setResult({
        category: top.label,
        confidence: top.score,
        subCategory: catConfig.key,
        allScores: scores,
      });
      setIsClassifying(false);
      toast.success('分类完成');
    }, 1500);
  };

  const getCategoryStyle = (label: string) => {
    const cat = CATEGORIES.find((c) => c.label === label);
    return cat?.color || 'text-gray-600 bg-gray-50';
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {['输入新闻文本', 'AI分析文本特征', '输出分类结果'].map((step, i) => (
          <div key={step} className="flex items-center gap-2">
            <span className="size-6 rounded-full bg-violet-500/10 text-violet-600 text-xs flex items-center justify-center font-medium">
              {i + 1}
            </span>
            <span className="text-xs text-muted-foreground">{step}</span>
          </div>
        ))}
      </div>

      {/* 类别标签 */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <Badge key={cat.key} variant="outline" className="text-xs">
            <span className="mr-1">{cat.icon}</span>
            {cat.label}
          </Badge>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* 左：输入 */}
        <Card className="overflow-hidden">
          <CardContent className="p-4 min-h-[320px] flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-foreground flex items-center gap-2">
                <FileText className="size-4 text-violet-600" />
                新闻文本
              </span>
              <span className="text-xs text-muted-foreground">{inputText.length} 字</span>
            </div>

            <Textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="在此粘贴或输入一段新闻文本，AI将自动判断它属于哪个类别…"
              className="flex-1 min-h-[200px] resize-none text-sm leading-relaxed"
            />

            <div className="flex gap-2 mt-3">
              <Button
                onClick={() => runClassification()}
                disabled={isClassifying || !inputText.trim()}
                className="flex-1"
              >
                <Sparkles className="size-4 mr-2" />
                {isClassifying ? '分类中…' : '开始分类'}
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setInputText('');
                  setResult(null);
                }}
              >
                <RefreshCw className="size-3.5 mr-1" /> 清空
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 右：结果 */}
        <Card className="overflow-hidden">
          <CardContent className="p-4 min-h-[320px] flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-foreground flex items-center gap-2">
                <Tag className="size-4 text-violet-600" />
                分类结果
              </span>
              {result && (
                <Badge className={`text-sm ${getCategoryStyle(result.category)}`}>
                  {result.category}
                </Badge>
              )}
            </div>

            <div className="flex-1">
              {result ? (
                <div className="space-y-4">
                  {/* 主类别 */}
                  <div className="text-center py-5 bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl">
                    <div className="text-5xl mb-2">
                      {CATEGORIES.find((c) => c.label === result.category)?.icon}
                    </div>
                    <p className="text-2xl font-bold text-violet-700 mb-1">{result.category}</p>
                    <p className="text-xs text-violet-600/70">
                      置信度 {result.confidence.toFixed(1)}%
                    </p>
                  </div>

                  {/* 各类别得分 */}
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-foreground flex items-center gap-1.5">
                      <BookOpen className="size-3.5 text-violet-600" />
                      各类别得分
                    </p>
                    {result.allScores.map((s, i) => (
                      <div key={i}>
                        <div className="flex items-center justify-between text-xs mb-0.5">
                          <span className="text-foreground">
                            <span className="mr-1.5">
                              {CATEGORIES.find((c) => c.label === s.label)?.icon}
                            </span>
                            {s.label}
                          </span>
                          <span
                            className={`font-medium tabular-nums ${i === 0 ? 'text-violet-600' : 'text-muted-foreground'}`}
                          >
                            {s.score.toFixed(1)}%
                          </span>
                        </div>
                        <Progress value={s.score} className="h-1.5 bg-violet-100/30" />
                      </div>
                    ))}
                  </div>
                </div>
              ) : isClassifying ? (
                <div className="h-full flex flex-col items-center justify-center py-8">
                  <div className="size-12 rounded-full border-3 border-violet-300 border-t-violet-600 animate-spin mb-3" />
                  <p className="text-sm text-foreground font-medium">正在分析文本…</p>
                  <p className="text-xs text-muted-foreground mt-1">提取关键词并计算分类概率</p>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center py-8">
                  <div className="size-14 rounded-2xl bg-muted/60 flex items-center justify-center mb-3">
                    <Tag className="size-7 text-muted-foreground/40" />
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">暂无分类结果</p>
                  <p className="text-xs text-muted-foreground/70">输入文本后点击开始分类</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 示例 */}
      <Card className="border-dashed">
        <CardContent className="p-4">
          <p className="text-xs font-medium text-foreground mb-3 flex items-center gap-2">
            <Lightbulb className="size-4 text-amber-500" />
            快速体验：试试下面的示例新闻
          </p>
          <Tabs defaultValue="tech">
            <TabsList className="h-8">
              {SAMPLE_TEXTS.map((s, i) => (
                <TabsTrigger key={i} value={s.expectedCategory} className="text-xs h-7">
                  {s.title}
                </TabsTrigger>
              ))}
            </TabsList>
            {SAMPLE_TEXTS.map((s, i) => (
              <TabsContent key={i} value={s.expectedCategory}>
                <div className="p-3 bg-muted/30 rounded-lg text-sm text-foreground/80 leading-relaxed line-clamp-3 mb-3">
                  {s.text}
                </div>
                <Button size="sm" variant="secondary" onClick={() => runClassification(s)}>
                  <Sparkles className="size-3.5 mr-1.5" />
                  用这个示例分类
                </Button>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

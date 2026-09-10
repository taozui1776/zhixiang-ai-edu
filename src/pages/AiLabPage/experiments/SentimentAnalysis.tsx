import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, MessageCircleHeart, HelpCircle, RefreshCw } from 'lucide-react';

// 正面情感关键词
const POSITIVE_WORDS = [
  '喜欢', '开心', '高兴', '快乐', '棒', '好', '赞', '优秀', '美', '爱',
  '满意', '精彩', '厉害', '聪明', '有趣', '温暖', '幸福', '棒极了', '太赞了',
  '不错', '很好', '真棒', '完美', '感谢', '惊喜',
];

// 负面情感关键词
const NEGATIVE_WORDS = [
  '讨厌', '难过', '伤心', '失望', '坏', '差', '糟糕', '生气', '愤怒', '悲伤',
  '不满', '失败', '痛苦', '烦恼', '焦虑', '郁闷', '无聊', '难过', '难受',
  '不好', '很差', '太差', '烂', '痛苦', '沮丧', '愤怒', '失望',
];

// 程度副词（加权）
const INTENSIFIERS = ['很', '非常', '特别', '十分', '超级', '最', '极', '真的', '太'];
const DIMINISHERS = ['有点', '稍微', '一点', '不太'];

const SAMPLE_SENTENCES = [
  '今天的 AI 课真有趣，我学到了好多新知识！',
  '这个实验太难了，我做了好久都没成功，好失望。',
  '智象平台的课程资源很丰富，老师备课效率提高了不少。',
  '天气有点冷，但是心情还不错。',
  '机器学习的概念有点难理解，需要多花点时间。',
];

type SentimentResult = {
  label: '正面' | '负面' | '中性';
  score: number; // -100 ~ 100
  positiveHits: string[];
  negativeHits: string[];
};

export default function SentimentAnalysis() {
  const [text, setText] = useState('');
  const [result, setResult] = useState<SentimentResult | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  const analyze = async () => {
    if (!text.trim()) return;
    setAnalyzing(true);
    setResult(null);
    await new Promise((r) => setTimeout(r, 700));

    const positiveHits: string[] = [];
    const negativeHits: string[] = [];
    let posScore = 0;
    let negScore = 0;

    // 检查每个正面词
    for (const word of POSITIVE_WORDS) {
      const re = new RegExp(word, 'g');
      const matches = text.match(re);
      if (matches) {
        matches.forEach((m) => positiveHits.push(m));
        posScore += matches.length * 10;
      }
    }

    // 检查每个负面词
    for (const word of NEGATIVE_WORDS) {
      const re = new RegExp(word, 'g');
      const matches = text.match(re);
      if (matches) {
        matches.forEach((m) => negativeHits.push(m));
        negScore += matches.length * 10;
      }
    }

    // 程度副词加权
    for (const int of INTENSIFIERS) {
      const re = new RegExp(`${int}.{0,2}(${[...POSITIVE_WORDS, ...NEGATIVE_WORDS].join('|')})`, 'g');
      const matches = [...text.matchAll(re)];
      for (const m of matches) {
        const matchedWord = m[1];
        if (POSITIVE_WORDS.includes(matchedWord)) posScore += 8;
        if (NEGATIVE_WORDS.includes(matchedWord)) negScore += 8;
      }
    }

    // 减弱词
    for (const dim of DIMINISHERS) {
      const re = new RegExp(`${dim}.{0,2}(${[...POSITIVE_WORDS, ...NEGATIVE_WORDS].join('|')})`, 'g');
      const matches = [...text.matchAll(re)];
      for (const m of matches) {
        const matchedWord = m[1];
        if (POSITIVE_WORDS.includes(matchedWord)) posScore = Math.max(0, posScore - 5);
        if (NEGATIVE_WORDS.includes(matchedWord)) negScore = Math.max(0, negScore - 5);
      }
    }

    // 感叹号加权（情感更强烈）
    const exclamations = (text.match(/！|!/g) || []).length;
    if (exclamations > 0) {
      const boost = exclamations * 3;
      if (posScore > negScore) posScore += boost;
      else if (negScore > posScore) negScore += boost;
    }

    // 归一化到 -100 ~ 100
    const total = posScore + negScore;
    let finalScore = 0;
    if (total > 0) {
      finalScore = Math.round(((posScore - negScore) / total) * 100);
    }
    // 文本长度修正：短文本可能误判
    if (text.length < 6 && total < 20) finalScore = Math.round(finalScore * 0.5);

    let label: '正面' | '负面' | '中性' = '中性';
    if (finalScore > 20) label = '正面';
    else if (finalScore < -20) label = '负面';

    // 去重
    setResult({
      label,
      score: finalScore,
      positiveHits: [...new Set(positiveHits)],
      negativeHits: [...new Set(negativeHits)],
    });
    setAnalyzing(false);
  };

  const trySample = (s: string) => {
    setText(s);
    setResult(null);
  };

  // 高亮渲染
  const highlightedText = useMemo(() => {
    if (!result || !text) return text;
    // 构建带高亮的 JSX 会比较复杂，这里用简单的标记方式
    return text;
  }, [text, result]);

  const scoreColor =
    result?.label === '正面'
      ? 'from-emerald-500 to-teal-500'
      : result?.label === '负面'
        ? 'from-rose-500 to-red-500'
        : 'from-slate-400 to-gray-500';

  const scoreTextColor =
    result?.label === '正面'
      ? 'text-emerald-600'
      : result?.label === '负面'
        ? 'text-rose-600'
        : 'text-slate-500';

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-6 items-start">
        {/* 输入区 */}
        <div className="space-y-3">
          <div className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
            <MessageCircleHeart className="size-3.5" />
            输入一句话
          </div>
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="输入一句话，让 AI 分析它的情感倾向..."
            rows={5}
            className="resize-none"
          />
          <div className="flex items-center justify-between">
            <div className="text-xs text-muted-foreground">
              {text.length} 字
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setText('');
                  setResult(null);
                }}
                className="gap-1"
              >
                <RefreshCw className="size-3" />
                清空
              </Button>
              <Button onClick={analyze} disabled={!text.trim() || analyzing} className="gap-2">
                <Sparkles className="size-4" />
                {analyzing ? '分析中...' : '分析情感'}
              </Button>
            </div>
          </div>

          {/* 示例句子 */}
          <div className="pt-2">
            <div className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
              <HelpCircle className="size-3" />
              试试这些句子：
            </div>
            <div className="flex flex-wrap gap-1.5">
              {SAMPLE_SENTENCES.map((s, i) => (
                <button
                  key={i}
                  onClick={() => trySample(s)}
                  className="text-xs px-2.5 py-1.5 rounded-full bg-muted hover:bg-accent hover:text-accent-foreground transition-colors text-muted-foreground"
                >
                  {s.length > 20 ? s.slice(0, 20) + '...' : s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 结果区 */}
        <div className="space-y-4">
          <div className="text-sm font-medium text-muted-foreground">分析结果</div>

          {!result && !analyzing && (
            <div className="p-8 rounded-2xl bg-muted/40 border border-border/50 text-center text-sm text-muted-foreground">
              输入一句话，看看 AI 怎么判断它的情感～
            </div>
          )}

          {analyzing && (
            <div className="p-8 rounded-2xl bg-gradient-to-r from-primary/10 to-purple-500/10 border border-primary/20 text-center">
              <Sparkles className="size-8 mx-auto mb-2 text-primary animate-pulse" />
              <div className="text-sm font-medium text-primary">AI 正在分析...</div>
              <div className="text-xs text-muted-foreground mt-1">关键词匹配 · 情感计算</div>
            </div>
          )}

          {result && (
            <div className="space-y-4">
              {/* 情感大标签 */}
              <div className="p-5 rounded-2xl border text-center bg-card">
                <div className="text-xs text-muted-foreground mb-2">情感倾向</div>
                <div
                  className={`text-4xl font-bold bg-gradient-to-r ${scoreColor} bg-clip-text text-transparent`}
                >
                  {result.label}
                </div>
                <div className={`text-sm mt-1 ${scoreTextColor}`}>
                  情感分：{result.score > 0 ? '+' : ''}
                  {result.score}
                </div>

                {/* 情感条 */}
                <div className="mt-4">
                  <div className="relative h-3 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`absolute top-0 h-full transition-all duration-700 ${
                        result.score >= 0
                          ? 'left-1/2 bg-gradient-to-r from-emerald-400 to-teal-500'
                          : 'right-1/2 bg-gradient-to-l from-rose-400 to-red-500'
                      }`}
                      style={{
                        width: `${Math.abs(result.score) / 2}%`,
                      }}
                    />
                    <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-foreground/20 -translate-x-1/2" />
                  </div>
                  <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                    <span>负面</span>
                    <span>中性</span>
                    <span>正面</span>
                  </div>
                </div>
              </div>

              {/* 关键词命中 */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                  <div className="text-xs font-medium text-emerald-600 mb-2">正面关键词</div>
                  {result.positiveHits.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {result.positiveHits.map((w, i) => (
                        <Badge
                          key={i}
                          className="text-[11px] bg-emerald-500/15 text-emerald-600 border-emerald-500/20"
                        >
                          {w}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <div className="text-xs text-muted-foreground">无</div>
                  )}
                </div>
                <div className="p-3 rounded-xl bg-rose-500/5 border border-rose-500/20">
                  <div className="text-xs font-medium text-rose-600 mb-2">负面关键词</div>
                  {result.negativeHits.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {result.negativeHits.map((w, i) => (
                        <Badge
                          key={i}
                          className="text-[11px] bg-rose-500/15 text-rose-600 border-rose-500/20"
                        >
                          {w}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <div className="text-xs text-muted-foreground">无</div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 原理卡片 */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-500/5 to-teal-500/5 border border-emerald-500/20">
        <div className="flex items-start gap-3">
          <Badge className="bg-emerald-500/15 text-emerald-600 border-emerald-500/20 shrink-0">
            AI 小知识
          </Badge>
          <p className="text-sm text-muted-foreground leading-relaxed">
            <span className="font-medium text-foreground">情感分析</span>
            是自然语言处理（NLP）的重要应用。真实的 AI 情感分析会基于海量标注数据训练深度学习模型，理解上下文和隐含语义。
            这里的 Demo 用「关键词词典 + 程度副词加权」的方法做简化版情感计算——正面词加分、负面词减分，程度副词放大效果。
          </p>
        </div>
      </div>
    </div>
  );
}

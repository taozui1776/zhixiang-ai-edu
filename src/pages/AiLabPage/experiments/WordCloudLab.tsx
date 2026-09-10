import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Cloud, Sparkles, RefreshCw, Hash, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';

// 中文停用词
const STOP_WORDS = new Set([
  '的', '了', '是', '在', '我', '有', '和', '就', '不', '人', '都', '一', '一个',
  '上', '也', '很', '到', '说', '要', '去', '你', '会', '着', '没有', '看', '好',
  '自己', '这', '那', '他', '她', '它', '们', '什么', '怎么', '为什么', '哪', '哪里',
  '可以', '可能', '因为', '所以', '但是', '而且', '或者', '如果', '虽然', '不过',
  '还', '又', '再', '才', '就', '都', '能', '能够', '应该', '必须', '需要',
  '中', '里', '从', '向', '对', '与', '和', '跟', '同', '及', '等', '等等',
  '今天', '明天', '昨天', '现在', '时候', '时间',
  '我们', '你们', '他们', '它们', '这个', '那个', '这些', '那些',
  '把', '被', '让', '给', '比', '像', '如',
]);

// 关键词提取简易算法：基于词频 + 长度加权
function extractKeywords(text: string, topN = 15): { word: string; count: number; weight: number }[] {
  // 中文简单分词：按标点和空格切，然后 2-4 字滑窗
  const sentences = text.split(/[，。！？、；：""''（）【】\s,.!?;:'"()\[\]]+/).filter(Boolean);

  const wordCount: Record<string, number> = {};

  for (const sentence of sentences) {
    if (sentence.length < 2) continue;

    // 2-4 字滑窗抽取候选词
    for (let len = 2; len <= Math.min(4, sentence.length); len++) {
      for (let i = 0; i <= sentence.length - len; i++) {
        const word = sentence.slice(i, i + len);
        // 跳过纯数字
        if (/^\d+$/.test(word)) continue;
        // 跳过停用词
        if (STOP_WORDS.has(word)) continue;
        wordCount[word] = (wordCount[word] || 0) + 1;
      }
    }
  }

  // 过滤掉被更长词包含的短词（如果长词频率相同）
  const allWords = Object.keys(wordCount);
  const filtered = allWords.filter((word) => {
    // 如果有更长的词包含它且频率 >= 它的频率，它可能只是长词的一部分
    for (const longer of allWords) {
      if (longer.length > word.length && longer.includes(word) && wordCount[longer] >= wordCount[word]) {
        // 只有当长词频率相同时才去掉短词（避免把真实词去掉）
        if (wordCount[longer] === wordCount[word] && word.length === 2) return false;
      }
    }
    return true;
  });

  // 计算权重：词频 * 长度因子 * 位置因子
  const results = filtered.map((word) => {
    const count = wordCount[word];
    const lengthBonus = word.length * 0.3; // 越长越可能是专业术语
    // 位置因子：出现在开头的词更重要
    const firstPos = text.indexOf(word);
    const positionBonus = firstPos >= 0 ? Math.max(0, 1 - firstPos / text.length) * 0.5 : 0;
    const weight = count * (1 + lengthBonus + positionBonus);
    return { word, count, weight };
  });

  results.sort((a, b) => b.weight - a.weight);
  return results.slice(0, topN);
}

const SAMPLE_TEXTS = [
  {
    label: 'AI 介绍',
    text: '人工智能是研究如何让计算机模拟人类智能的科学。机器学习是人工智能的核心技术，它让计算机能够从数据中学习规律。深度学习是机器学习的一个分支，使用多层神经网络来处理复杂问题。',
  },
  {
    label: '课堂总结',
    text: '今天我们学习了图像识别的基本原理。图像识别是计算机视觉的重要应用。AI 通过卷积神经网络从图片中提取特征，然后进行分类和识别。同学们在实验中亲手训练了一个简单的图像分类模型。',
  },
  {
    label: '机器人',
    text: '智能机器人是人工智能与机械工程的结合体。传感器让机器人感知环境，处理器让机器人思考决策，执行器让机器人行动。未来机器人将在教育、医疗、工业等领域发挥更大作用。',
  },
];

export default function WordCloudLab() {
  const [text, setText] = useState('');
  const [keywords, setKeywords] = useState<{ word: string; count: number; weight: number }[]>([]);
  const [generating, setGenerating] = useState(false);

  const maxWeight = useMemo(() => {
    if (keywords.length === 0) return 1;
    return Math.max(...keywords.map((k) => k.weight));
  }, [keywords]);

  const generate = async () => {
    if (!text.trim()) return;
    setGenerating(true);
    setKeywords([]);
    await new Promise((r) => setTimeout(r, 600));
    const kw = extractKeywords(text, 20);
    setKeywords(kw);
    setGenerating(false);
  };

  const trySample = (t: string) => {
    setText(t);
    setKeywords([]);
  };

  // 词云颜色
  const colors = [
    'text-primary',
    'text-purple-600',
    'text-pink-500',
    'text-sky-600',
    'text-emerald-600',
    'text-amber-600',
    'text-rose-500',
    'text-indigo-600',
    'text-teal-600',
    'text-orange-500',
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-6 items-start">
        {/* 输入区 */}
        <div className="space-y-3">
          <div className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
            <Hash className="size-3.5" />
            输入一段中文文本
          </div>
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="输入一段中文文本，AI 会自动提取关键词并生成词云..."
            rows={8}
            className="resize-none"
          />
          <div className="flex items-center justify-between">
            <div className="text-xs text-muted-foreground">{text.length} 字</div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setText('');
                  setKeywords([]);
                }}
                className="gap-1"
              >
                <RefreshCw className="size-3" />
                清空
              </Button>
              <Button onClick={generate} disabled={!text.trim() || generating} className="gap-2">
                <Cloud className="size-4" />
                {generating ? '生成中...' : '生成词云'}
              </Button>
            </div>
          </div>

          {/* 示例文本 */}
          <div className="pt-2">
            <div className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
              <HelpCircle className="size-3" />
              试试这些文本：
            </div>
            <div className="flex flex-wrap gap-1.5">
              {SAMPLE_TEXTS.map((s, i) => (
                <button
                  key={i}
                  onClick={() => trySample(s.text)}
                  className="text-xs px-2.5 py-1.5 rounded-full bg-muted hover:bg-accent hover:text-accent-foreground transition-colors text-muted-foreground"
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 词云区 */}
        <div className="space-y-3">
          <div className="text-sm font-medium text-muted-foreground">关键词词云</div>

          {keywords.length === 0 && !generating && (
            <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-primary/5 via-purple-500/5 to-pink-500/5 border border-border/50 flex flex-col items-center justify-center text-muted-foreground relative overflow-hidden">
              <Cloud className="size-12 mb-2 opacity-20" />
              <p className="text-sm">输入文本，看看关键词云的样子</p>
              {/* 装饰性的云 */}
              <div className="absolute top-6 left-6 text-2xl opacity-10">AI</div>
              <div className="absolute top-10 right-10 text-lg opacity-10">学习</div>
              <div className="absolute bottom-8 left-12 text-xl opacity-10">智能</div>
              <div className="absolute bottom-6 right-8 text-base opacity-10">数据</div>
            </div>
          )}

          {generating && (
            <div className="aspect-[4/3] rounded-2xl bg-gradient-to-r from-primary/10 to-purple-500/10 border border-primary/20 flex flex-col items-center justify-center">
              <Sparkles className="size-8 mb-2 text-primary animate-pulse" />
              <div className="text-sm font-medium text-primary">AI 正在生成词云...</div>
              <div className="text-xs text-muted-foreground mt-1">分词 · 计算词频 · 关键词提取</div>
            </div>
          )}

          {keywords.length > 0 && (
            <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-primary/5 via-purple-500/5 to-pink-500/5 border border-border/50 p-6 flex items-center justify-center relative overflow-hidden">
              {/* 词云展示 */}
              <div className="relative w-full h-full flex items-center justify-center">
                {keywords.map((kw, i) => {
                  const ratio = kw.weight / maxWeight;
                  const fontSize = Math.max(12, 14 + ratio * 32);
                  const colorClass = colors[i % colors.length];
                  // 伪随机位置（基于 index 的确定性分布）
                  const angle = (i * 137.5) % 360; // 黄金角分布
                  const radius = 5 + (i / keywords.length) * 40;
                  const x = 50 + Math.cos((angle * Math.PI) / 180) * radius;
                  const y = 50 + Math.sin((angle * Math.PI) / 180) * radius * 0.7;

                  return (
                    <motion.span
                      key={kw.word}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: i * 0.05 }}
                      className={`absolute font-bold ${colorClass} whitespace-nowrap`}
                      style={{
                        left: `${x}%`,
                        top: `${y}%`,
                        fontSize: `${fontSize}px`,
                        transform: 'translate(-50%, -50%)',
                        opacity: 0.5 + ratio * 0.5,
                      }}
                    >
                      {kw.word}
                    </motion.span>
                  );
                })}
              </div>
            </div>
          )}

          {/* 关键词列表 */}
          {keywords.length > 0 && (
            <div className="pt-2">
              <div className="text-xs text-muted-foreground mb-2">Top 关键词</div>
              <div className="flex flex-wrap gap-1.5">
                {keywords.slice(0, 10).map((kw, i) => (
                  <Badge
                    key={kw.word}
                    variant="outline"
                    className="text-xs bg-primary/5 border-primary/20 text-primary"
                  >
                    {kw.word}
                    <span className="text-[10px] text-muted-foreground ml-1">{kw.count}次</span>
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 原理卡片 */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-violet-500/5 to-indigo-500/5 border border-violet-500/20">
        <div className="flex items-start gap-3">
          <Badge className="bg-violet-500/15 text-violet-600 border-violet-500/20 shrink-0">AI 小知识</Badge>
          <p className="text-sm text-muted-foreground leading-relaxed">
            <span className="font-medium text-foreground">关键词提取</span>
            是自然语言处理的基础任务之一。真实的 AI 会用 TF-IDF、TextRank 或大模型来提取关键词，
            考虑词频、位置、词性、上下文等多种因素。这里的 Demo 用「词频 + 长度加权 + 位置加权」的简化方法模拟关键词提取过程，
            并通过词云的形式直观展示——字号越大、越靠中间，说明这个词越重要。
          </p>
        </div>
      </div>
    </div>
  );
}

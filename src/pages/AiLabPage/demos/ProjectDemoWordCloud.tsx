import { useState, useMemo } from 'react';
import { RefreshCw, Download, Type, Palette, Hash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const SAMPLE_TEXT = `人工智能（AI）是计算机科学的一个重要分支，它研究如何让计算机模拟人类的智能行为。
机器学习是人工智能的核心技术之一，通过大量数据训练模型，让计算机学会识别规律。
深度学习则是机器学习的一个子领域，使用多层神经网络来处理复杂问题，如图像识别、自然语言处理和语音合成等。
在教育领域，人工智能可以帮助老师批改作业、推荐学习资源，甚至为每个学生定制个性化的学习路径。
智象AI实验室为同学们提供了丰富的AI实验项目，让大家在动手实践中感受人工智能的魅力。`;

const COLOR_SCHEMES = [
  { name: '蓝紫渐变', colors: ['#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef'] },
  { name: '活力橙红', colors: ['#f97316', '#ef4444', '#dc2626', '#f59e0b', '#eab308'] },
  { name: '清新青绿', colors: ['#10b981', '#14b8a6', '#06b6d4', '#22d3ee', '#84cc16'] },
  { name: '粉紫梦幻', colors: ['#ec4899', '#f472b6', '#a855f7', '#c084fc', '#f0abfc'] },
];

interface WordCount {
  word: string;
  count: number;
}

export default function ProjectDemoWordCloud() {
  const [text, setText] = useState(SAMPLE_TEXT);
  const [maxWords, setMaxWords] = useState(50);
  const [schemeIdx, setSchemeIdx] = useState(0);

  const wordData = useMemo<WordCount[]>(() => {
    // 简易中文分词：按 2-4 字窗口 + 停用词过滤
    const stopWords = new Set([
      '的', '是', '在', '和', '了', '也', '都', '就', '要', '会', '能', '可以', '一个',
      '等', '及', '与', '或', '不', '让', '为', '中', '上', '下', '它', '他', '她',
      '这', '那', '有', '没', '被', '把', '给', '从', '到', '对', '向', '如', '所',
      '我们', '你们', '他们', '它们', '怎么', '什么', '为什么', '因为', '所以',
    ]);

    const counts: Record<string, number> = {};

    // 简单：按标点和空格分段，再用 2-gram / 3-gram 统计
    const segments = text.split(/[，。、！？；：""''（）《》\n\s,.;:!?()]+/).filter(Boolean);

    // 2-gram
    segments.forEach((seg) => {
      for (let i = 0; i < seg.length - 1; i++) {
        const w = seg.slice(i, i + 2);
        if (!stopWords.has(w) && /^[\u4e00-\u9fa5]+$/.test(w)) {
          counts[w] = (counts[w] || 0) + 1;
        }
      }
    });

    // 3-gram（出现次数多的优先保留）
    segments.forEach((seg) => {
      for (let i = 0; i < seg.length - 2; i++) {
        const w = seg.slice(i, i + 3);
        if (!stopWords.has(w) && /^[\u4e00-\u9fa5]+$/.test(w)) {
          counts[w] = (counts[w] || 0) + 1.5;
        }
      }
    });

    const sorted = Object.entries(counts)
      .map(([word, count]) => ({ word, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, maxWords);

    return sorted;
  }, [text, maxWords]);

  const maxCount = wordData[0]?.count || 1;
  const minCount = wordData[wordData.length - 1]?.count || 0;

  const colors = COLOR_SCHEMES[schemeIdx].colors;

  // 螺旋布局生成位置（模拟词云）
  const wordPositions = useMemo(() => {
    const placed: { word: string; count: number; x: number; y: number; size: number; color: string; rotation: number }[] = [];
    const W = 600;
    const H = 400;
    const centerX = W / 2;
    const centerY = H / 2;

    // 已放置的词的矩形区域（用于粗略碰撞检测）
    const placedRects: { x: number; y: number; w: number; h: number }[] = [];

    wordData.forEach((item, idx) => {
      const t = maxCount === minCount ? 1 : (item.count - minCount) / (maxCount - minCount);
      const fontSize = 14 + t * 42; // 14px ~ 56px
      const colorIdx = Math.floor(Math.random() * colors.length);
      const color = colors[colorIdx];
      const rotation = Math.random() > 0.75 ? 90 : 0; // 少量垂直

      // 估算词的宽度
      const estW = item.word.length * fontSize * (rotation === 90 ? 1 : 1) + 10;
      const estH = fontSize + 8;

      // 螺旋搜索空位
      let placedOk = false;
      let angle = 0;
      let radius = 0;
      const step = 0.3;

      for (let attempt = 0; attempt < 500 && !placedOk; attempt++) {
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);

        const rx = rotation === 90 ? x - estH / 2 : x - estW / 2;
        const ry = rotation === 90 ? y - estW / 2 : y - estH / 2;
        const rw = rotation === 90 ? estH : estW;
        const rh = rotation === 90 ? estW : estH;

        // 边界检测
        if (rx < 5 || ry < 5 || rx + rw > W - 5 || ry + rh > H - 5) {
          angle += step;
          radius += 0.5;
          continue;
        }

        // 碰撞检测
        let overlap = false;
        for (const pr of placedRects) {
          if (
            rx < pr.x + pr.w &&
            rx + rw > pr.x &&
            ry < pr.y + pr.h &&
            ry + rh > pr.y
          ) {
            overlap = true;
            break;
          }
        }

        if (!overlap) {
          placed.push({
            word: item.word,
            count: item.count,
            x,
            y,
            size: fontSize,
            color,
            rotation,
          });
          placedRects.push({ x: rx, y: ry, w: rw, h: rh });
          placedOk = true;
        }

        angle += step;
        radius += 0.3;
      }
    });

    return placed;
  }, [wordData, maxCount, minCount, colors]);

  const regenerate = () => {
    // 强制重排（通过改变 state 触发重新计算）
    setMaxWords(maxWords);
    toast.info('词云已重新生成');
  };

  const copyWords = () => {
    const result = wordData.map((w) => `${w.word} (${w.count})`).join('\n');
    navigator.clipboard.writeText(result);
    toast.success('词频统计已复制');
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 左侧输入 */}
        <div className="md:col-span-1 space-y-3">
          <div>
            <label className="text-sm font-medium flex items-center gap-2 mb-2">
              <Type className="size-4 text-primary" />
              输入文本
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full h-48 p-3 rounded-xl border border-border/60 bg-card text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/60"
              placeholder="粘贴要生成词云的文本…"
            />
          </div>

          <div className="p-3 rounded-xl bg-card border border-border/60 space-y-3">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-medium flex items-center gap-1.5">
                  <Hash className="size-3.5" />
                  词数量
                </label>
                <span className="text-xs font-mono text-primary">{maxWords}</span>
              </div>
              <Slider
                value={[maxWords]}
                onValueChange={(v) => setMaxWords(v[0])}
                min={20}
                max={100}
                step={10}
              />
            </div>

            <div>
              <label className="text-xs font-medium flex items-center gap-1.5 mb-2">
                <Palette className="size-3.5" />
                配色方案
              </label>
              <RadioGroup
                value={String(schemeIdx)}
                onValueChange={(v) => setSchemeIdx(Number(v))}
                className="grid grid-cols-2 gap-2"
              >
                {COLOR_SCHEMES.map((s, i) => (
                  <div key={s.name} className="flex items-center">
                    <RadioGroupItem value={String(i)} id={`scheme-${i}`} className="sr-only peer" />
                    <Label
                      htmlFor={`scheme-${i}`}
                      className="w-full p-2 rounded-lg border border-border/60 cursor-pointer text-center text-xs peer-data-[state=checked]:border-primary/60 peer-data-[state=checked]:bg-primary/5 transition-colors"
                    >
                      <div className="flex gap-0.5 justify-center mb-1">
                        {s.colors.slice(0, 5).map((c, ci) => (
                          <div
                            key={ci}
                            className="size-3 rounded-sm"
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>
                      {s.name}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={regenerate}>
              <RefreshCw className="size-4 mr-2" />
              重新生成
            </Button>
            <Button variant="outline" onClick={copyWords}>
              <Download className="size-4 mr-2" />
              导出词频
            </Button>
          </div>
        </div>

        {/* 右侧词云 */}
        <div className="md:col-span-2">
          <div className="relative w-full aspect-[3/2] rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 border border-border/60 overflow-hidden">
            <svg viewBox="0 0 600 400" className="w-full h-full">
              {wordPositions.map((item, i) => (
                <motion.text
                  key={item.word + i}
                  x={item.x}
                  y={item.y}
                  fill={item.color}
                  fontSize={item.size}
                  fontWeight={item.size > 30 ? 700 : item.size > 20 ? 600 : 500}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: i * 0.01, ease: 'easeOut' }}
                  style={{
                    transform: item.rotation ? `rotate(${item.rotation}deg)` : undefined,
                    transformOrigin: `${item.x}px ${item.y}px`,
                  }}
                  className="select-none"
                >
                  {item.word}
                </motion.text>
              ))}
            </svg>

            {wordData.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm">
                请输入文本来生成词云
              </div>
            )}
          </div>

          <div className="flex items-center justify-between mt-3">
            <Badge variant="outline" className="text-xs">
              共 {wordData.length} 个高频词
            </Badge>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">字号越大 = 出现频率越高</span>
            </div>
          </div>
        </div>
      </div>

      {/* Top 词频列表 */}
      {wordData.length > 0 && (
        <div className="p-4 rounded-xl bg-card border border-border/60">
          <p className="text-sm font-medium mb-3">Top 10 高频词</p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {wordData.slice(0, 10).map((w, i) => (
              <div
                key={w.word}
                className="flex items-center gap-2 p-2 rounded-lg bg-muted/30"
              >
                <span
                  className="size-5 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                  style={{ backgroundColor: colors[i % colors.length] }}
                >
                  {i + 1}
                </span>
                <span className="text-sm font-medium truncate">{w.word}</span>
                <span className="text-xs text-muted-foreground ml-auto tabular-nums">
                  {Math.round(w.count)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

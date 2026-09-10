import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Image from '@/components/ui/image';
import { Sparkles, ImageIcon, HelpCircle } from 'lucide-react';

// 示例图片（用 emoji 插画 + 渐变背景模拟）
const SAMPLE_IMAGES = [
  {
    id: 'cat',
    name: '猫咪',
    emoji: '🐱',
    bg: 'from-orange-200 to-amber-300',
    trueColor: '暖色系',
    trueShape: '圆形脸',
  },
  {
    id: 'dog',
    name: '小狗',
    emoji: '🐶',
    bg: 'from-amber-200 to-yellow-300',
    trueColor: '暖色系',
    trueShape: '长嘴型',
  },
  {
    id: 'flower',
    name: '花朵',
    emoji: '🌸',
    bg: 'from-pink-200 to-rose-300',
    trueColor: '粉色系',
    trueShape: '对称花瓣',
  },
  {
    id: 'car',
    name: '小汽车',
    emoji: '🚗',
    bg: 'from-red-200 to-rose-300',
    trueColor: '红色系',
    trueShape: '矩形车身',
  },
  {
    id: 'tree',
    name: '大树',
    emoji: '🌳',
    bg: 'from-green-200 to-emerald-300',
    trueColor: '绿色系',
    trueShape: '伞形树冠',
  },
  {
    id: 'bird',
    name: '小鸟',
    emoji: '🐦',
    bg: 'from-sky-200 to-blue-300',
    trueColor: '蓝色系',
    trueShape: '流线型',
  },
];

// AI 分类标签
const CATEGORIES = ['猫', '狗', '花', '车', '树', '鸟'];

// 颜色特征 → 类别的映射关系（模拟特征权重）
const COLOR_FEATURES: Record<string, Record<string, number>> = {
  '暖色系': { 猫: 25, 狗: 30, 花: 10, 车: 15, 树: 5, 鸟: 10 },
  '粉色系': { 猫: 5, 狗: 5, 花: 40, 车: 10, 树: 10, 鸟: 15 },
  '红色系': { 猫: 5, 狗: 5, 花: 15, 车: 40, 树: 5, 鸟: 10 },
  '绿色系': { 猫: 5, 狗: 5, 花: 15, 车: 5, 树: 45, 鸟: 5 },
  '蓝色系': { 猫: 5, 狗: 5, 花: 10, 车: 10, 树: 5, 鸟: 45 },
};

// 形状特征 → 类别的映射
const SHAPE_FEATURES: Record<string, Record<string, number>> = {
  '圆形脸': { 猫: 35, 狗: 15, 花: 15, 车: 5, 树: 15, 鸟: 10 },
  '长嘴型': { 猫: 10, 狗: 35, 花: 5, 车: 5, 树: 5, 鸟: 25 },
  '对称花瓣': { 猫: 5, 狗: 5, 花: 40, 车: 5, 树: 20, 鸟: 5 },
  '矩形车身': { 猫: 5, 狗: 5, 花: 5, 车: 45, 树: 5, 鸟: 5 },
  '伞形树冠': { 猫: 5, 狗: 5, 花: 15, 车: 5, 树: 40, 鸟: 5 },
  '流线型': { 猫: 5, 狗: 15, 花: 5, 车: 15, 树: 5, 鸟: 35 },
};

type ClassResult = { label: string; score: number };

export default function ImageClassification() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [classifying, setClassifying] = useState(false);
  const [results, setResults] = useState<ClassResult[]>([]);

  const selected = useMemo(() => SAMPLE_IMAGES.find((s) => s.id === selectedId), [selectedId]);

  const classify = async () => {
    if (!selected) return;
    setClassifying(true);
    setResults([]);
    // 模拟 AI 思考
    await new Promise((r) => setTimeout(r, 900));

    const colorScores = COLOR_FEATURES[selected.trueColor] || {};
    const shapeScores = SHAPE_FEATURES[selected.trueShape] || {};

    const combined: ClassResult[] = CATEGORIES.map((label) => {
      const colorScore = colorScores[label] || 5;
      const shapeScore = shapeScores[label] || 5;
      // 加权综合 + 一点随机性
      const base = colorScore * 0.4 + shapeScore * 0.6;
      const jitter = (Math.random() - 0.5) * 8;
      const finalScore = Math.max(2, Math.min(98, base + jitter));
      return { label, score: Math.round(finalScore) };
    });

    combined.sort((a, b) => b.score - a.score);
    setResults(combined.slice(0, 3));
    setClassifying(false);
  };

  return (
    <div className="space-y-6">
      {/* 图片选择区 */}
      <div>
        <div className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-1.5">
          <ImageIcon className="size-3.5" />
          选择一张图片让 AI 识别
        </div>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {SAMPLE_IMAGES.map((img) => {
            const isSelected = selectedId === img.id;
            return (
              <button
                key={img.id}
                onClick={() => {
                  setSelectedId(img.id);
                  setResults([]);
                }}
                className={`aspect-square rounded-xl bg-gradient-to-br ${img.bg} flex items-center justify-center text-4xl md:text-5xl transition-all border-2 ${
                  isSelected
                    ? 'border-primary scale-105 shadow-lg ring-2 ring-primary/30'
                    : 'border-transparent hover:scale-105'
                }`}
              >
                {img.emoji}
              </button>
            );
          })}
        </div>
      </div>

      {/* 分类主区 */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-6 items-start">
        {/* 左侧：选中图片 + 按钮 */}
        <div className="space-y-4">
          {selected ? (
            <div
              className={`aspect-[4/3] rounded-2xl bg-gradient-to-br ${selected.bg} flex items-center justify-center text-7xl md:text-8xl shadow-inner relative overflow-hidden`}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
              <span className="relative z-10 drop-shadow-md">{selected.emoji}</span>
              {classifying && (
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-20">
                  <div className="text-white text-center">
                    <Sparkles className="size-8 mx-auto mb-2 animate-pulse" />
                    <div className="text-sm font-medium">AI 正在分析...</div>
                    <div className="text-xs text-white/70 mt-1">提取颜色特征 · 形状特征</div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="aspect-[4/3] rounded-2xl bg-muted/40 border border-dashed border-border flex flex-col items-center justify-center text-muted-foreground">
              <ImageIcon className="size-10 mb-2 opacity-40" />
              <p className="text-sm">请先选择一张图片</p>
            </div>
          )}

          <div className="flex gap-2 justify-center">
            <Button onClick={classify} disabled={!selected || classifying} className="gap-2">
              <Sparkles className="size-4" />
              {classifying ? '识别中...' : '开始识别'}
            </Button>
          </div>
        </div>

        {/* 右侧：结果 */}
        <div className="space-y-3">
          <div className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
            <HelpCircle className="size-3.5" />
            AI 分类结果 Top 3
          </div>
          {results.length === 0 && !classifying && (
            <div className="p-6 rounded-xl bg-muted/40 border border-border/50 text-center text-sm text-muted-foreground">
              选择图片并点击「开始识别」
              <br />
              看看 AI 认得对不对
            </div>
          )}
          <div className="space-y-2">
            {results.map((r, i) => (
              <div
                key={r.label}
                className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                  i === 0
                    ? 'bg-gradient-to-r from-primary/15 to-purple-500/10 border-primary/30'
                    : 'bg-card border-border/50'
                }`}
              >
                <div className="size-10 rounded-lg bg-muted flex items-center justify-center text-xl">
                  {
                    { 猫: '🐱', 狗: '🐶', 花: '🌸', 车: '🚗', 树: '🌳', 鸟: '🐦' }[r.label]
                  }
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="font-medium">
                      {r.label}
                      {i === 0 && (
                        <Badge className="ml-2 text-[10px] bg-primary/20 text-primary border-primary/30">
                          Top 1
                        </Badge>
                      )}
                    </span>
                    <span className="tabular-nums text-muted-foreground">{r.score}%</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        i === 0
                          ? 'bg-gradient-to-r from-primary to-purple-500'
                          : i === 1
                            ? 'bg-sky-500'
                            : 'bg-amber-500'
                      }`}
                      style={{ width: `${r.score}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 原理卡片 */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-pink-500/5 to-rose-500/5 border border-pink-500/20">
        <div className="flex items-start gap-3">
          <Badge className="bg-pink-500/15 text-pink-600 border-pink-500/20 shrink-0">AI 小知识</Badge>
          <p className="text-sm text-muted-foreground leading-relaxed">
            <span className="font-medium text-foreground">图像分类</span>
            是计算机视觉最基础的任务。真实的 AI 会用深度卷积网络（CNN）从数百万张图片中学习「什么是猫、什么是狗」的特征。
            这里的 Demo 用「颜色 + 形状」两个简化特征模拟分类过程——AI 先看颜色分布，再看轮廓形状，综合判断最像的类别。
          </p>
        </div>
      </div>
    </div>
  );
}

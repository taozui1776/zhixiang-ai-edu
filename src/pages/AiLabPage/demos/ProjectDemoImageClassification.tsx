import { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, Eye, Scan, RefreshCw, Sparkles, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import Image from '@/components/ui/image';

interface RecognitionItem {
  label: string;
  confidence: number;
  category: string;
}

const SAMPLE_IMAGES = [
  {
    label: '猫咪',
    url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&h=400&fit=crop',
    results: [
      { label: '虎斑猫', confidence: 92.5, category: '动物-猫科' },
      { label: '家猫', confidence: 87.3, category: '动物-宠物' },
      { label: '小型哺乳类', confidence: 71.2, category: '动物' },
    ],
  },
  {
    label: '向日葵',
    url: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=600&h=400&fit=crop',
    results: [
      { label: '向日葵', confidence: 95.8, category: '植物-花卉' },
      { label: '菊科植物', confidence: 88.4, category: '植物' },
      { label: '黄色花朵', confidence: 76.1, category: '植物-花卉' },
    ],
  },
  {
    label: '城市建筑',
    url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600&h=400&fit=crop',
    results: [
      { label: '摩天大楼', confidence: 94.2, category: '建筑-城市' },
      { label: '城市天际线', confidence: 90.6, category: '场景-城市' },
      { label: '现代建筑', confidence: 82.1, category: '建筑' },
    ],
  },
];

export default function ProjectDemoImageClassification() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<RecognitionItem[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('请上传图片文件');
      return;
    }
    const reader = new FileReader();
    reader.onload = (evt) => {
      setImageUrl(evt.target?.result as string);
      setResults([]);
    };
    reader.readAsDataURL(file);
  };

  const runClassification = (sample?: typeof SAMPLE_IMAGES[0]) => {
    setIsAnalyzing(true);
    setResults([]);
    if (sample) setImageUrl(sample.url);

    setTimeout(() => {
      if (sample) {
        setResults(sample.results);
      } else {
        setResults([
          { label: '自然风光', confidence: 89.3, category: '场景-户外' },
          { label: '山脉', confidence: 76.5, category: '自然地理' },
          { label: '天空', confidence: 68.2, category: '自然' },
        ]);
      }
      setIsAnalyzing(false);
      toast.success('图像识别完成');
    }, 1800);
  };

  const handleReset = () => {
    setImageUrl(null);
    setResults([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {['上传图片', 'AI特征提取', '输出分类结果'].map((step, i) => (
          <div key={step} className="flex items-center gap-2">
            <span className="size-6 rounded-full bg-emerald-500/10 text-emerald-600 text-xs flex items-center justify-center font-medium">
              {i + 1}
            </span>
            <span className="text-xs text-muted-foreground">{step}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* 左：图片 */}
        <Card className="border-dashed border-2">
          <CardContent className="p-4 min-h-[320px] flex flex-col">
            {!imageUrl ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
                <div className="size-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-4">
                  <Eye className="size-8 text-emerald-600" />
                </div>
                <h4 className="font-medium text-foreground mb-1">上传图片</h4>
                <p className="text-xs text-muted-foreground mb-4">
                  AI 将识别图片中的物体并给出分类
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <Button onClick={() => fileInputRef.current?.click()} className="bg-emerald-600 hover:bg-emerald-700">
                  <ImageIcon className="size-4 mr-2" />
                  选择图片
                </Button>
              </div>
            ) : (
              <div className="flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Eye className="size-4 text-emerald-600" />
                    待识别图片
                  </span>
                  <Button variant="ghost" size="sm" onClick={handleReset}>
                    <RefreshCw className="size-3.5 mr-1" /> 换一张
                  </Button>
                </div>
                <div className="flex-1 relative rounded-lg overflow-hidden bg-muted mb-3">
                  <Image
                    src={imageUrl}
                    alt="待识别"
                    className="w-full h-full object-cover"
                    style={{ maxHeight: '240px' }}
                  />
                  {isAnalyzing && (
                    <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center">
                      <div className="relative size-12 mb-3">
                        <div className="absolute inset-0 border-3 border-emerald-400/30 rounded-full" />
                        <div className="absolute inset-0 border-3 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                        <Scan className="absolute inset-0 m-auto size-6 text-white" />
                      </div>
                      <p className="text-sm text-white font-medium">AI 正在"看"图片…</p>
                    </div>
                  )}
                </div>
                <Button
                  disabled={isAnalyzing}
                  onClick={() => runClassification()}
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                >
                  <Sparkles className="size-4 mr-2" />
                  {isAnalyzing ? '识别中…' : '开始识别物体'}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 右：结果 */}
        <Card className="overflow-hidden">
          <CardContent className="p-4 min-h-[320px] flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-foreground flex items-center gap-2">
                <Tag className="size-4 text-emerald-600" />
                Top 3 识别结果
              </span>
              {results.length > 0 && (
                <Badge variant="outline" className="text-[10px]">
                  置信度从高到低
                </Badge>
              )}
            </div>

            <div className="flex-1">
              {results.length > 0 ? (
                <div className="space-y-3">
                  {results.map((r, i) => (
                    <div key={i} className="p-3 rounded-lg bg-muted/30 border border-border/40">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="size-6 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold flex items-center justify-center">
                            {i + 1}
                          </span>
                          <span className="font-medium text-foreground">{r.label}</span>
                        </div>
                        <span className="text-sm font-bold text-emerald-600 tabular-nums">
                          {r.confidence.toFixed(1)}%
                        </span>
                      </div>
                      <Progress value={r.confidence} className="h-1.5 bg-emerald-100/50" />
                      <div className="flex items-center justify-between mt-2">
                        <Badge variant="outline" className="text-[10px] h-5">
                          {r.category}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  <p className="text-xs text-muted-foreground pt-2 border-t border-border/30">
                    💡 AI 给出的是"可能性排序"，置信度越高代表 AI 越"确信"自己的判断
                  </p>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center py-8">
                  <div className="size-14 rounded-2xl bg-muted/60 flex items-center justify-center mb-3">
                    <Eye className="size-7 text-muted-foreground/40" />
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">暂无识别结果</p>
                  <p className="text-xs text-muted-foreground/70">上传图片后开始识别</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 示例 */}
      <div>
        <p className="text-xs text-muted-foreground mb-2">📸 试试示例图片：</p>
        <div className="flex gap-3 flex-wrap">
          {SAMPLE_IMAGES.map((s, i) => (
            <button
              key={i}
              onClick={() => runClassification(s)}
              className="group flex items-center gap-2 px-3 py-2 rounded-lg border border-border/60 hover:border-emerald-300 hover:bg-emerald-50/50 transition-all text-left"
            >
              <div className="size-10 rounded overflow-hidden bg-muted shrink-0">
                <Image src={s.url} alt={s.label} className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="text-xs font-medium text-foreground">{s.label}</p>
                <p className="text-[10px] text-muted-foreground">点击立即识别</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

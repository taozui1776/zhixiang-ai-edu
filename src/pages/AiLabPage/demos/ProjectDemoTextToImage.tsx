import { useState } from 'react';
import { Image as ImageIcon, Sparkles, Download, RefreshCw, Palette, Wand2, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { toast } from 'sonner';
import Image from '@/components/ui/image';

interface GeneratedImage {
  url: string;
  prompt: string;
  size: string;
  style: string;
}

const STYLE_PRESETS = [
  { id: 'photorealistic', label: '写实摄影', icon: '📷', desc: '真实感照片效果' },
  { id: 'anime', label: '日系动漫', icon: '🎨', desc: '二次元动漫风格' },
  { id: 'oil-painting', label: '油画艺术', icon: '🖼️', desc: '油画笔触质感' },
  { id: '3d-render', label: '3D渲染', icon: '🧊', desc: '三维立体渲染' },
  { id: 'watercolor', label: '水彩插画', icon: '💧', desc: '水彩晕染效果' },
  { id: 'cyberpunk', label: '赛博朋克', icon: '🌆', desc: '科幻霓虹风格' },
];

const SIZE_OPTIONS = [
  { value: '1:1', label: '1:1 正方形', w: 300, h: 300 },
  { value: '16:9', label: '16:9 横屏', w: 480, h: 270 },
  { value: '9:16', label: '9:16 竖屏', w: 270, h: 480 },
  { value: '4:3', label: '4:3 标准', w: 400, h: 300 },
];

const SAMPLE_PROMPTS = [
  {
    style: 'photorealistic',
    prompt: '一只可爱的橘猫坐在窗台上，阳光透过窗帘洒进来，温暖的午后时光，8K超高清',
  },
  {
    style: 'anime',
    prompt: '星空下的少年仰望银河，流星划过天际，日系动漫风格，唯美梦幻',
  },
  {
    style: '3d-render',
    prompt: '漂浮在空中的水晶岛屿，瀑布倾泻而下，3D渲染，奇幻仙境',
  },
];

export default function ProjectDemoTextToImage() {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('photorealistic');
  const [size, setSize] = useState('1:1');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<GeneratedImage | null>(null);
  const [progress, setProgress] = useState(0);

  const currentStyle = STYLE_PRESETS.find((s) => s.id === style) || STYLE_PRESETS[0];
  const currentSize = SIZE_OPTIONS.find((s) => s.value === size) || SIZE_OPTIONS[0];

  const generateImage = (preset?: typeof SAMPLE_PROMPTS[0]) => {
    const finalPrompt = preset?.prompt || prompt.trim();
    if (!finalPrompt) {
      toast.error('请输入画面描述');
      return;
    }
    if (preset) {
      setPrompt(preset.prompt);
      setStyle(preset.style);
    }

    setIsGenerating(true);
    setGeneratedImage(null);
    setProgress(0);

    // 模拟生成进度
    let p = 0;
    const timer = setInterval(() => {
      p += Math.random() * 15 + 5;
      if (p >= 100) {
        p = 100;
        clearInterval(timer);

        // 使用 picsum 作为生成结果占位（demo 环境）
        const seed = Math.floor(Math.random() * 1000);
        const imgUrl = `https://picsum.photos/seed/${seed}/${currentSize.w * 2}/${currentSize.h * 2}`;

        setGeneratedImage({
          url: imgUrl,
          prompt: finalPrompt,
          size: size,
          style: currentStyle.label,
        });
        setIsGenerating(false);
        toast.success('图片生成完成');
      }
      setProgress(Math.min(99, p));
    }, 200);
  };

  const downloadImage = () => {
    if (generatedImage) {
      toast.info('图片下载功能将在接入真实AI后开启');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {['输入画面描述', '选择风格尺寸', 'AI生成图片'].map((step, i) => (
          <div key={step} className="flex items-center gap-2">
            <span className="size-6 rounded-full bg-pink-500/10 text-pink-600 text-xs flex items-center justify-center font-medium">
              {i + 1}
            </span>
            <span className="text-xs text-muted-foreground">{step}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* 左：输入区 */}
        <Card className="overflow-hidden">
          <CardContent className="p-4 min-h-[480px] flex flex-col">
            <div className="flex items-center gap-2 mb-3">
              <Wand2 className="size-4 text-pink-600" />
              <span className="text-sm font-medium text-foreground">画面描述 (Prompt)</span>
            </div>

            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="描述你想要的画面，越详细效果越好…
例如：一只可爱的橘猫坐在窗台上，阳光透过窗帘洒进来，温暖的午后时光"
              className="flex-1 min-h-[120px] resize-none text-sm leading-relaxed mb-4"
            />

            {/* 风格选择 */}
            <div className="mb-4">
              <p className="text-xs font-medium text-foreground mb-2 flex items-center gap-1.5">
                <Palette className="size-3.5 text-pink-600" />
                画面风格
              </p>
              <div className="grid grid-cols-3 gap-2">
                {STYLE_PRESETS.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setStyle(s.id)}
                    className={`p-2 rounded-lg border transition-all text-left ${
                      style === s.id
                        ? 'border-pink-300 bg-pink-50 ring-1 ring-pink-200'
                        : 'border-border/60 hover:border-pink-200 hover:bg-pink-50/30'
                    }`}
                  >
                    <div className="text-lg mb-0.5">{s.icon}</div>
                    <div className="text-[11px] font-medium text-foreground">{s.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 尺寸选择 */}
            <div className="mb-4">
              <p className="text-xs font-medium text-foreground mb-2 flex items-center gap-1.5">
                <Layers className="size-3.5 text-pink-600" />
                图片尺寸
              </p>
              <Select value={size} onValueChange={setSize}>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SIZE_OPTIONS.map((s) => (
                    <SelectItem key={s.value} value={s.value} className="text-sm">
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={() => generateImage()}
              disabled={isGenerating}
              className="w-full bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600"
            >
              <Sparkles className="size-4 mr-2" />
              {isGenerating ? `生成中 ${Math.floor(progress)}%…` : '开始生成图片'}
            </Button>
          </CardContent>
        </Card>

        {/* 右：生成结果 */}
        <Card className="overflow-hidden">
          <CardContent className="p-4 min-h-[480px] flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-foreground flex items-center gap-2">
                <ImageIcon className="size-4 text-pink-600" />
                生成结果
              </span>
              {generatedImage && (
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-[10px]">
                    {generatedImage.style}
                  </Badge>
                  <Badge variant="outline" className="text-[10px]">
                    {generatedImage.size}
                  </Badge>
                </div>
              )}
            </div>

            <div className="flex-1 flex items-center justify-center">
              {isGenerating ? (
                <div className="text-center w-full">
                  <div className="relative w-48 h-48 mx-auto mb-4 rounded-2xl overflow-hidden bg-gradient-to-br from-pink-100 via-purple-100 to-orange-100">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="relative size-20">
                        <div className="absolute inset-0 rounded-full border-4 border-pink-200" />
                        <div
                          className="absolute inset-0 rounded-full border-4 border-pink-500 border-t-transparent animate-spin"
                        />
                        <Wand2 className="absolute inset-0 m-auto size-8 text-pink-500" />
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-pink-200">
                      <div
                        className="h-full bg-gradient-to-r from-pink-500 to-orange-500 transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                  <p className="text-sm font-medium text-foreground mb-1">AI 正在作画…</p>
                  <p className="text-xs text-muted-foreground">
                    正在根据描述生成图片，请稍候
                  </p>
                </div>
              ) : generatedImage ? (
                <div className="w-full h-full flex flex-col">
                  <div className="flex-1 flex items-center justify-center p-2 bg-muted/40 rounded-xl mb-3">
                    <div className="relative rounded-lg overflow-hidden shadow-lg max-w-full max-h-[320px]">
                      <Image
                        src={generatedImage.url}
                        alt="生成的图片"
                        className="max-w-full max-h-[320px] object-contain"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      💡 {generatedImage.prompt}
                    </p>
                    <div className="flex gap-2">
                      <Button variant="secondary" size="sm" className="flex-1" onClick={downloadImage}>
                        <Download className="size-3.5 mr-1.5" />
                        下载图片
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="flex-1"
                        onClick={() => generateImage()}
                      >
                        <RefreshCw className="size-3.5 mr-1.5" />
                        再生成一张
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="size-20 rounded-2xl bg-gradient-to-br from-pink-100 to-orange-100 flex items-center justify-center mx-auto mb-4">
                    <ImageIcon className="size-10 text-pink-400" />
                  </div>
                  <p className="text-sm text-foreground font-medium mb-1">生成的图片将出现在这里</p>
                  <p className="text-xs text-muted-foreground">
                    输入描述后点击"开始生成"
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 示例 prompt */}
      <Card className="border-dashed">
        <CardContent className="p-4">
          <p className="text-xs font-medium text-foreground mb-3">✨ 试试这些灵感提示词：</p>
          <Tabs defaultValue="0">
            <TabsList className="h-8">
              {SAMPLE_PROMPTS.map((_, i) => (
                <TabsTrigger key={i} value={`${i}`} className="text-xs h-7">
                  灵感 {i + 1}
                </TabsTrigger>
              ))}
            </TabsList>
            {SAMPLE_PROMPTS.map((s, i) => (
              <TabsContent key={i} value={`${i}`}>
                <div className="p-3 bg-muted/30 rounded-lg text-sm text-foreground/80 leading-relaxed mb-3">
                  {s.prompt}
                </div>
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600"
                  onClick={() => generateImage(s)}
                >
                  <Sparkles className="size-3.5 mr-1.5" />
                  用这个灵感生成
                </Button>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

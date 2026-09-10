import { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, FileText, Scan, RefreshCw, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import Image from '@/components/ui/image';

interface OcrResult {
  text: string;
  confidence: number;
  charCount: number;
  lang: string;
}

const SAMPLE_IMAGES = [
  {
    label: '示例1：书籍标题页',
    url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=400&fit=crop',
    expected:
      'The Great Gatsby\n\nIn my younger and more vulnerable years my father gave me some advice that I\'ve been turning over in my mind ever since.\n\n"Whenever you feel like criticizing anyone," he told me, "just remember that all the people in this world haven\'t had the advantages that you\'ve had."',
  },
  {
    label: '示例2：手写笔记',
    url: 'https://images.unsplash.com/photo-1517842645767-c639042777db?w=600&h=400&fit=crop',
    expected:
      'Monday Plan\n- 9:00  团队晨会\n- 10:00 项目评审\n- 14:00 代码Review\n- 16:00 客户沟通\n\n备注：\n准备好产品原型图',
  },
];

export default function ProjectDemoOcr() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<OcrResult | null>(null);
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
      setResult(null);
    };
    reader.readAsDataURL(file);
  };

  const runOcr = (sample?: typeof SAMPLE_IMAGES[0]) => {
    setIsAnalyzing(true);
    setResult(null);
    if (sample) {
      setImageUrl(sample.url);
    }

    // 模拟OCR识别过程
    setTimeout(() => {
      const text = sample
        ? sample.expected
        : imageUrl
          ? '智象AI通识教育平台\n\n面向K12阶段的人工智能通识教育解决方案，通过"做中学"的方式，让学生在趣味实验中理解AI原理、培养计算思维。\n\n课程体系：\n• 小学低段：AI启蒙\n• 小学高段：AI通识入门\n• 初中：机器视觉入门\n• 高中：AI算法基础'
          : '';

      setResult({
        text,
        confidence: 96.8,
        charCount: text.replace(/\s/g, '').length,
        lang: '中英混合',
      });
      setIsAnalyzing(false);
      toast.success('文字识别完成');
    }, 1500);
  };

  const handleReset = () => {
    setImageUrl(null);
    setResult(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const copyText = () => {
    if (result) {
      navigator.clipboard.writeText(result.text);
      toast.success('已复制到剪贴板');
    }
  };

  return (
    <div className="space-y-4">
      {/* 操作步骤 */}
      <div className="flex flex-wrap gap-2">
        {['上传图片', 'AI识别', '查看结果'].map((step, i) => (
          <div key={step} className="flex items-center gap-2">
            <span className="size-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-medium">
              {i + 1}
            </span>
            <span className="text-xs text-muted-foreground">{step}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* 左侧：上传/图片预览区 */}
        <Card className="border-dashed border-2">
          <CardContent className="p-4 min-h-[320px] flex flex-col">
            {!imageUrl ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
                <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                  <Upload className="size-8 text-primary" />
                </div>
                <h4 className="font-medium text-foreground mb-1">上传含文字的图片</h4>
                <p className="text-xs text-muted-foreground mb-4">
                  支持 JPG/PNG 格式，建议图片中文字清晰
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <Button onClick={() => fileInputRef.current?.click()}>
                  <ImageIcon className="size-4 mr-2" />
                  选择图片
                </Button>
              </div>
            ) : (
              <div className="flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-foreground flex items-center gap-2">
                    <ImageIcon className="size-4 text-primary" />
                    图片预览
                  </span>
                  <Button variant="ghost" size="sm" onClick={handleReset}>
                    <RefreshCw className="size-3.5 mr-1" /> 换一张
                  </Button>
                </div>
                <div className="flex-1 relative rounded-lg overflow-hidden bg-muted mb-3">
                  <Image
                    src={imageUrl}
                    alt="待识别图片"
                    className="w-full h-full object-contain"
                    style={{ maxHeight: '240px' }}
                  />
                  {isAnalyzing && (
                    <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center">
                      <div className="relative size-12 mb-3">
                        <div className="absolute inset-0 border-3 border-primary/30 rounded-full" />
                        <div className="absolute inset-0 border-3 border-primary border-t-transparent rounded-full animate-spin" />
                        <Scan className="absolute inset-0 m-auto size-6 text-white" />
                      </div>
                      <p className="text-sm text-white font-medium">正在识别文字…</p>
                    </div>
                  )}
                </div>
                <Button
                  disabled={isAnalyzing}
                  onClick={() => runOcr()}
                  className="w-full"
                >
                  <Sparkles className="size-4 mr-2" />
                  {isAnalyzing ? '识别中…' : '开始识别文字'}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 右侧：识别结果区 */}
        <Card className="overflow-hidden">
          <CardContent className="p-4 min-h-[320px] flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-foreground flex items-center gap-2">
                <FileText className="size-4 text-primary" />
                识别结果
              </span>
              {result && (
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-[10px]">
                    置信度 {result.confidence}%
                  </Badge>
                  <Badge variant="outline" className="text-[10px]">
                    {result.charCount} 字
                  </Badge>
                  <Badge variant="outline" className="text-[10px]">
                    {result.lang}
                  </Badge>
                </div>
              )}
            </div>

            <div className="flex-1">
              {result ? (
                <div className="h-full">
                  <div className="p-3 bg-muted/40 rounded-lg text-sm text-foreground whitespace-pre-line leading-relaxed max-h-[260px] overflow-y-auto font-mono">
                    {result.text}
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button variant="secondary" size="sm" className="flex-1" onClick={copyText}>
                      复制文本
                    </Button>
                    <Button variant="secondary" size="sm" className="flex-1" onClick={() => runOcr()}>
                      重新识别
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center py-8">
                  <div className="size-14 rounded-2xl bg-muted/60 flex items-center justify-center mb-3">
                    <FileText className="size-7 text-muted-foreground/40" />
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">暂无识别结果</p>
                  <p className="text-xs text-muted-foreground/70">
                    上传图片后点击"开始识别"
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 示例图片 */}
      <div>
        <p className="text-xs text-muted-foreground mb-2">💡 试试示例图片：</p>
        <div className="flex gap-3 flex-wrap">
          {SAMPLE_IMAGES.map((s, i) => (
            <button
              key={i}
              onClick={() => runOcr(s)}
              className="group flex items-center gap-2 px-3 py-2 rounded-lg border border-border/60 hover:border-primary/30 hover:bg-primary/5 transition-all text-left"
            >
              <div className="size-10 rounded overflow-hidden bg-muted shrink-0">
                <Image src={s.url} alt={s.label} className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="text-xs font-medium text-foreground">{s.label}</p>
                <p className="text-[10px] text-muted-foreground">点击立即体验</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

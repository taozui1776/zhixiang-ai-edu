import { useState, useRef, useCallback, useEffect } from 'react';
import { Upload, SunMoon, Contrast, Download, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import Image from '@/components/ui/image';
import { toast } from 'sonner';

export default function ProjectDemoBinarization() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [threshold, setThreshold] = useState(128);
  const [mode, setMode] = useState<'original' | 'grayscale' | 'binary'>('binary');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processImage = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img || !img.naturalWidth) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 限制最大尺寸
    const maxW = 600;
    const scale = Math.min(1, maxW / img.naturalWidth);
    canvas.width = Math.round(img.naturalWidth * scale);
    canvas.height = Math.round(img.naturalHeight * scale);

    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    if (mode === 'original') return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      // 灰度化：Luma 公式
      const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];

      if (mode === 'grayscale') {
        data[i] = gray;
        data[i + 1] = gray;
        data[i + 2] = gray;
      } else if (mode === 'binary') {
        // 二值化
        const v = gray >= threshold ? 255 : 0;
        data[i] = v;
        data[i + 1] = v;
        data[i + 2] = v;
      }
    }

    ctx.putImageData(imageData, 0, 0);
  }, [mode, threshold]);

  useEffect(() => {
    if (imageUrl) {
      processImage();
    }
  }, [imageUrl, mode, threshold, processImage]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      setImageUrl(evt.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const clearImage = () => {
    setImageUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `binary-threshold-${threshold}.png`;
    link.href = canvas.toDataURL();
    link.click();
    toast.success('图片已保存');
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-3 items-center">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          id="binarization-upload"
        />
        <label htmlFor="binarization-upload">
          <Button variant="outline" className="cursor-pointer">
            <Upload className="size-4 mr-2" />
            上传图片
          </Button>
        </label>

        <div className="flex gap-1 p-1 bg-muted/50 rounded-lg">
          {[
            { value: 'original', label: '原图' },
            { value: 'grayscale', label: '灰度' },
            { value: 'binary', label: '二值化' },
          ].map((m) => (
            <button
              key={m.value}
              onClick={() => setMode(m.value as typeof mode)}
              className={`px-3 py-1.5 text-xs rounded-md transition-colors ${
                mode === m.value
                  ? 'bg-white text-primary shadow-sm font-medium'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        {imageUrl && (
          <>
            <Button variant="ghost" onClick={clearImage} className="text-muted-foreground">
              <Trash2 className="size-4 mr-2" />
              清除
            </Button>
            <Button variant="outline" onClick={downloadImage}>
              <Download className="size-4 mr-2" />
              保存
            </Button>
          </>
        )}

        {mode === 'binary' && (
          <div className="flex items-center gap-3 ml-auto">
            <Contrast className="size-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">阈值</span>
            <div className="w-40">
              <Slider
                value={[threshold]}
                onValueChange={(v) => setThreshold(v[0])}
                min={0}
                max={255}
                step={1}
              />
            </div>
            <span className="text-sm font-mono text-primary w-10">{threshold}</span>
          </div>
        )}
      </div>

      <div className="relative rounded-xl overflow-hidden bg-muted/40 border border-border/60 min-h-[360px] flex items-center justify-center">
        {!imageUrl ? (
          <div className="text-center py-16">
            <SunMoon className="size-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">上传一张图片体验二值化效果</p>
            <p className="text-xs text-muted-foreground/70 mt-1">
              调节阈值，观察图像的黑白变化
            </p>
          </div>
        ) : (
          <>
            <Image
              ref={imgRef}
              src={imageUrl}
              alt="待处理"
              crossOrigin="anonymous"
              className="hidden"
            />
            <canvas ref={canvasRef} className="max-w-full max-h-[500px] object-contain block" />
          </>
        )}
      </div>

      {imageUrl && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100">
            <p className="text-xs text-blue-600 mb-1">第 1 步</p>
            <p className="text-sm font-semibold text-blue-800">彩色 → 灰度</p>
            <p className="text-xs text-blue-600/80 mt-1">
              用亮度公式 Y = 0.299R + 0.587G + 0.114B 把彩色图变成灰度图
            </p>
          </div>
          <div className="p-4 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100">
            <p className="text-xs text-amber-600 mb-1">第 2 步</p>
            <p className="text-sm font-semibold text-amber-800">灰度 → 二值</p>
            <p className="text-xs text-amber-600/80 mt-1">
              大于阈值变白色，小于阈值变黑色，整张图只有两种颜色
            </p>
          </div>
          <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100">
            <p className="text-xs text-emerald-600 mb-1">应用</p>
            <p className="text-sm font-semibold text-emerald-800">文字识别预处理</p>
            <p className="text-xs text-emerald-600/80 mt-1">
              二值化是 OCR 文字识别等任务的重要前置处理步骤
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

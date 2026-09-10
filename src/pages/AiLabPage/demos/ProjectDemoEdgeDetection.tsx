import { useState, useRef, useEffect, useCallback } from 'react';
import { Upload, Frame, Sun, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Image } from '@/components/ui/image';

type EdgeAlgorithm = 'sobel' | 'canny';

export default function ProjectDemoEdgeDetection() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [algorithm, setAlgorithm] = useState<EdgeAlgorithm>('sobel');
  const [threshold, setThreshold] = useState(50);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sobelEdge = useCallback(
    (ctx: CanvasRenderingContext2D, w: number, h: number, thresh: number) => {
      const imageData = ctx.getImageData(0, 0, w, h);
      const data = imageData.data;
      const gray = new Uint8ClampedArray(w * h);

      // 转灰度
      for (let i = 0; i < w * h; i++) {
        const idx = i * 4;
        gray[i] = 0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2];
      }

      const output = new Uint8ClampedArray(w * h);

      // Sobel 算子
      const gx = [-1, 0, 1, -2, 0, 2, -1, 0, 1];
      const gy = [-1, -2, -1, 0, 0, 0, 1, 2, 1];

      for (let y = 1; y < h - 1; y++) {
        for (let x = 1; x < w - 1; x++) {
          let sumX = 0;
          let sumY = 0;
          for (let ky = -1; ky <= 1; ky++) {
            for (let kx = -1; kx <= 1; kx++) {
              const pixel = gray[(y + ky) * w + (x + kx)];
              const ki = (ky + 1) * 3 + (kx + 1);
              sumX += pixel * gx[ki];
              sumY += pixel * gy[ki];
            }
          }
          const magnitude = Math.sqrt(sumX * sumX + sumY * sumY);
          output[y * w + x] = magnitude > thresh ? 255 : 0;
        }
      }

      // 写回（用主色调显示边缘）
      for (let i = 0; i < w * h; i++) {
        const idx = i * 4;
        const v = output[i];
        data[idx] = v; // R
        data[idx + 1] = v * 0.8; // G
        data[idx + 2] = v; // B
        data[idx + 3] = 255;
      }

      ctx.putImageData(imageData, 0, 0);
    },
    [],
  );

  const cannyEdge = useCallback(
    (ctx: CanvasRenderingContext2D, w: number, h: number, thresh: number) => {
      // 简化版 Canny：高斯模糊 + Sobel + 双阈值
      const imageData = ctx.getImageData(0, 0, w, h);
      const data = imageData.data;
      const gray = new Float32Array(w * h);

      for (let i = 0; i < w * h; i++) {
        const idx = i * 4;
        gray[i] = 0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2];
      }

      // 简单高斯模糊（3x3）
      const blurred = new Float32Array(w * h);
      const gaussian = [1, 2, 1, 2, 4, 2, 1, 2, 1];
      const gSum = 16;
      for (let y = 1; y < h - 1; y++) {
        for (let x = 1; x < w - 1; x++) {
          let sum = 0;
          for (let ky = -1; ky <= 1; ky++) {
            for (let kx = -1; kx <= 1; kx++) {
              sum += gray[(y + ky) * w + (x + kx)] * gaussian[(ky + 1) * 3 + (kx + 1)];
            }
          }
          blurred[y * w + x] = sum / gSum;
        }
      }

      // Sobel 计算梯度强度和方向
      const magnitude = new Float32Array(w * h);
      const direction = new Float32Array(w * h);
      const gx = [-1, 0, 1, -2, 0, 2, -1, 0, 1];
      const gy = [-1, -2, -1, 0, 0, 0, 1, 2, 1];

      for (let y = 2; y < h - 2; y++) {
        for (let x = 2; x < w - 2; x++) {
          let sumX = 0;
          let sumY = 0;
          for (let ky = -1; ky <= 1; ky++) {
            for (let kx = -1; kx <= 1; kx++) {
              const pixel = blurred[(y + ky) * w + (x + kx)];
              const ki = (ky + 1) * 3 + (kx + 1);
              sumX += pixel * gx[ki];
              sumY += pixel * gy[ki];
            }
          }
          magnitude[y * w + x] = Math.sqrt(sumX * sumX + sumY * sumY);
          direction[y * w + x] = Math.atan2(sumY, sumX);
        }
      }

      // 双阈值
      const high = thresh;
      const low = thresh * 0.4;
      const output = new Uint8ClampedArray(w * h);

      for (let y = 2; y < h - 2; y++) {
        for (let x = 2; x < w - 2; x++) {
          const idx = y * w + x;
          const mag = magnitude[idx];
          if (mag > high) {
            output[idx] = 255;
          } else if (mag > low) {
            // 检查 8 邻域是否有强边缘
            let hasStrong = false;
            for (let ky = -1; ky <= 1 && !hasStrong; ky++) {
              for (let kx = -1; kx <= 1 && !hasStrong; kx++) {
                if (ky === 0 && kx === 0) continue;
                if (magnitude[(y + ky) * w + (x + kx)] > high) {
                  hasStrong = true;
                }
              }
            }
            output[idx] = hasStrong ? 255 : 0;
          } else {
            output[idx] = 0;
          }
        }
      }

      for (let i = 0; i < w * h; i++) {
        const idx = i * 4;
        const v = output[i];
        data[idx] = v;
        data[idx + 1] = v * 0.9;
        data[idx + 2] = v;
        data[idx + 3] = 255;
      }

      ctx.putImageData(imageData, 0, 0);
    },
    [],
  );

  const processImage = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img || !img.naturalWidth) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const maxW = 600;
    const scale = Math.min(1, maxW / img.naturalWidth);
    canvas.width = Math.round(img.naturalWidth * scale);
    canvas.height = Math.round(img.naturalHeight * scale);

    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    if (algorithm === 'sobel') {
      sobelEdge(ctx, canvas.width, canvas.height, threshold);
    } else {
      cannyEdge(ctx, canvas.width, canvas.height, threshold);
    }
  }, [algorithm, threshold, sobelEdge, cannyEdge]);

  useEffect(() => {
    if (imageUrl) {
      const timer = setTimeout(processImage, 50);
      return () => clearTimeout(timer);
    }
  }, [imageUrl, algorithm, threshold, processImage]);

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

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-3 items-center">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          id="edge-upload"
        />
        <label htmlFor="edge-upload">
          <Button variant="outline" className="cursor-pointer">
            <Upload className="size-4 mr-2" />
            上传图片
          </Button>
        </label>

        <RadioGroup
          value={algorithm}
          onValueChange={(v) => setAlgorithm(v as EdgeAlgorithm)}
          className="flex gap-1 p-1 bg-muted/50 rounded-lg"
        >
          <div className="flex items-center">
            <RadioGroupItem value="sobel" id="sobel" className="peer sr-only" />
            <Label
              htmlFor="sobel"
              className="px-3 py-1.5 text-xs rounded-md cursor-pointer peer-data-[state=checked]:bg-white peer-data-[state=checked]:text-primary peer-data-[state=checked]:shadow-sm transition-colors"
            >
              Sobel 算子
            </Label>
          </div>
          <div className="flex items-center">
            <RadioGroupItem value="canny" id="canny" className="peer sr-only" />
            <Label
              htmlFor="canny"
              className="px-3 py-1.5 text-xs rounded-md cursor-pointer peer-data-[state=checked]:bg-white peer-data-[state=checked]:text-primary peer-data-[state=checked]:shadow-sm transition-colors"
            >
              Canny 算法
            </Label>
          </div>
        </RadioGroup>

        {imageUrl && (
          <Button variant="ghost" onClick={clearImage} className="text-muted-foreground">
            <Trash2 className="size-4 mr-2" />
            清除
          </Button>
        )}

        <div className="flex items-center gap-3 ml-auto">
          <Frame className="size-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">阈值</span>
          <div className="w-40">
            <Slider
              value={[threshold]}
              onValueChange={(v) => setThreshold(v[0])}
              min={10}
              max={150}
              step={5}
            />
          </div>
          <span className="text-sm font-mono text-primary w-10">{threshold}</span>
        </div>
      </div>

      <div className="relative rounded-xl overflow-hidden bg-muted/40 border border-border/60 min-h-[360px] flex items-center justify-center">
        {!imageUrl ? (
          <div className="text-center py-16">
            <Frame className="size-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">上传一张图片体验边缘检测效果</p>
            <p className="text-xs text-muted-foreground/70 mt-1">
              AI 是怎么"看到"物体轮廓的？
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
        <div className="p-4 rounded-xl bg-gradient-to-br from-violet-50/80 to-indigo-50/60 border border-violet-100">
          <div className="flex items-center gap-2 mb-2">
            <Badge className="bg-violet-500 border-0">💡 原理小知识</Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-violet-900">
            <div>
              <p className="font-semibold mb-1">Sobel 算子</p>
              <p className="text-xs text-violet-700/90">
                通过水平和垂直两个方向的 3×3 卷积核计算梯度，找出亮度变化剧烈的位置，就是边缘。计算速度快，效果直观。
              </p>
            </div>
            <div>
              <p className="font-semibold mb-1">Canny 算法</p>
              <p className="text-xs text-violet-700/90">
                高斯模糊 → 计算梯度 → 非极大值抑制 → 双阈值筛选，四步精心设计的边缘检测算法，边缘更细更准确。
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

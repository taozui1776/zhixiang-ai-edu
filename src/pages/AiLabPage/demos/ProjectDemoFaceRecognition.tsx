import { useState, useRef, useCallback, useEffect } from 'react';
import { Upload, Camera, Scan, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import Image from '@/components/ui/image';

export default function ProjectDemoFaceRecognition() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<FaceResult[]>([]);
  const [confidence, setConfidence] = useState(70);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  interface FaceResult {
    x: number;
    y: number;
    w: number;
    h: number;
    label: string;
    score: number;
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      setImageUrl(evt.target?.result as string);
      setResults([]);
    };
    reader.readAsDataURL(file);
  };

  const drawFaceBoxes = useCallback(
    (faces: FaceResult[]) => {
      const canvas = canvasRef.current;
      const img = imgRef.current;
      if (!canvas || !img) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;

      ctx.drawImage(img, 0, 0);

      faces.forEach((face) => {
        ctx.strokeStyle = '#22d3ee';
        ctx.lineWidth = Math.max(3, face.w * 0.02);
        ctx.strokeRect(face.x, face.y, face.w, face.h);

        // 标签背景
        const label = `${face.label} ${Math.round(face.score * 100)}%`;
        ctx.font = `${Math.max(14, face.w * 0.06)}px sans-serif`;
        const textWidth = ctx.measureText(label).width;
        ctx.fillStyle = '#22d3ee';
        ctx.fillRect(face.x, face.y - 28, textWidth + 12, 28);
        ctx.fillStyle = '#fff';
        ctx.fillText(label, face.x + 6, face.y - 8);

        // 五官点
        ctx.fillStyle = '#f59e0b';
        const dotSize = Math.max(3, face.w * 0.015);
        const features = [
          [face.x + face.w * 0.3, face.y + face.h * 0.35], // 左眼
          [face.x + face.w * 0.7, face.y + face.h * 0.35], // 右眼
          [face.x + face.w * 0.5, face.y + face.h * 0.5], // 鼻尖
          [face.x + face.w * 0.35, face.y + face.h * 0.7], // 左嘴角
          [face.x + face.w * 0.65, face.y + face.h * 0.7], // 右嘴角
        ];
        features.forEach(([fx, fy]) => {
          ctx.beginPath();
          ctx.arc(fx, fy, dotSize, 0, Math.PI * 2);
          ctx.fill();
        });
      });
    },
    [],
  );

  const analyzeFace = async () => {
    if (!imageUrl) return;
    setIsAnalyzing(true);

    // 模拟人脸检测（等比例生成假数据）
    await new Promise((r) => setTimeout(r, 1200));

    const img = imgRef.current;
    if (!img) return;

    const w = img.naturalWidth;
    const h = img.naturalHeight;

    // 模拟检测到 1-2 张人脸
    const faceCount = Math.random() > 0.5 ? 2 : 1;
    const faces: FaceResult[] = [];

    for (let i = 0; i < faceCount; i++) {
      const faceW = w * (0.2 + Math.random() * 0.15);
      const faceH = faceW * 1.25;
      faces.push({
        x: w * (0.2 + i * 0.45) + (Math.random() - 0.5) * w * 0.05,
        y: h * (0.15 + Math.random() * 0.1),
        w: faceW,
        h: faceH,
        label: i === 0 ? 'AI 同学' : '用户',
        score: 0.85 + Math.random() * 0.13,
      });
    }

    setResults(faces);
    drawFaceBoxes(faces);
    setIsAnalyzing(false);
    toast.success(`检测到 ${faces.length} 张人脸`);
  };

  const clearImage = () => {
    setImageUrl(null);
    setResults([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-3">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          id="face-upload"
        />
        <label htmlFor="face-upload">
          <Button variant="outline" className="cursor-pointer">
            <Upload className="size-4 mr-2" />
            上传图片
          </Button>
        </label>
        <Button
          onClick={analyzeFace}
          disabled={!imageUrl || isAnalyzing}
          className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600"
        >
          {isAnalyzing ? (
            <>
              <Scan className="size-4 mr-2 animate-pulse" />
              识别中…
            </>
          ) : (
            <>
              <Scan className="size-4 mr-2" />
              开始识别
            </>
          )}
        </Button>
        {imageUrl && (
          <Button variant="ghost" onClick={clearImage} className="text-muted-foreground">
            <Trash2 className="size-4 mr-2" />
            清除
          </Button>
        )}

        <div className="flex items-center gap-3 ml-auto">
          <span className="text-xs text-muted-foreground">置信度阈值</span>
          <div className="w-32">
            <Slider
              value={[confidence]}
              onValueChange={(v) => setConfidence(v[0])}
              min={30}
              max={95}
              step={5}
            />
          </div>
          <span className="text-xs font-mono text-primary w-10">{confidence}%</span>
        </div>
      </div>

      <div className="relative rounded-xl overflow-hidden bg-muted/40 border border-border/60 min-h-[320px] flex items-center justify-center">
        {!imageUrl ? (
          <div className="text-center py-16">
            <Camera className="size-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">上传一张含有人脸的图片开始体验</p>
            <p className="text-xs text-muted-foreground/70 mt-1">支持 JPG / PNG 格式</p>
          </div>
        ) : (
          <div className="relative w-full inline-block">
            <Image
              ref={imgRef}
              src={imageUrl}
              alt="待识别"
              className="w-full max-h-[500px] object-contain"
              crossOrigin="anonymous"
              style={{ display: 'none' }}
              onLoad={() => {
                const canvas = canvasRef.current;
                const img = imgRef.current;
                if (!canvas || !img) return;
                canvas.width = img.naturalWidth;
                canvas.height = img.naturalHeight;
                const ctx = canvas.getContext('2d');
                if (ctx) ctx.drawImage(img, 0, 0);
              }}
            />
            <canvas
              ref={canvasRef}
              className="w-full max-h-[500px] object-contain"
              style={{ display: 'block' }}
            />
          </div>
        )}
      </div>

      {results.length > 0 && (
        <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-100">
          <div className="flex items-center gap-2 mb-3">
            <Badge className="bg-emerald-500 border-0">识别成功</Badge>
            <span className="text-sm text-emerald-700">
              检测到 <strong>{results.length}</strong> 张人脸
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {results.map((r, i) => (
              <div
                key={i}
                className="p-3 rounded-lg bg-white border border-emerald-100 flex items-center gap-3"
              >
                <div className="size-12 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white font-bold">
                  {i + 1}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">{r.label}</p>
                  <p className="text-xs text-muted-foreground">
                    置信度：{Math.round(r.score * 100)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

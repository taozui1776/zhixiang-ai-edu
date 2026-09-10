import { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, Car, Scan, RefreshCw, Sparkles, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import Image from '@/components/ui/image';

interface PlateResult {
  plateNumber: string;
  plateColor: string;
  vehicleType: string;
  confidence: number;
  region: string;
}

const SAMPLE_IMAGES = [
  {
    label: '蓝牌小车',
    url: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600&h=400&fit=crop',
    result: {
      plateNumber: '京A·12345',
      plateColor: '蓝色',
      vehicleType: '小型轿车',
      confidence: 98.5,
      region: '北京',
    },
  },
  {
    label: '绿牌新能源',
    url: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=600&h=400&fit=crop',
    result: {
      plateNumber: '沪AD·12345',
      plateColor: '绿色',
      vehicleType: '新能源汽车',
      confidence: 97.2,
      region: '上海',
    },
  },
  {
    label: '黄牌货车',
    url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=400&fit=crop',
    result: {
      plateNumber: '粤B·88888',
      plateColor: '黄色',
      vehicleType: '大型货车',
      confidence: 95.8,
      region: '广东深圳',
    },
  },
];

export default function ProjectDemoLicensePlate() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<PlateResult | null>(null);
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

  const runRecognition = (sample?: typeof SAMPLE_IMAGES[0]) => {
    setIsAnalyzing(true);
    setResult(null);
    if (sample) setImageUrl(sample.url);

    setTimeout(() => {
      if (sample) {
        setResult(sample.result);
      } else {
        setResult({
          plateNumber: '浙A·99999',
          plateColor: '蓝色',
          vehicleType: '小型轿车',
          confidence: 94.3,
          region: '浙江杭州',
        });
      }
      setIsAnalyzing(false);
      toast.success('车牌识别完成');
    }, 1800);
  };

  const handleReset = () => {
    setImageUrl(null);
    setResult(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const plateColorClass = (color: string) => {
    switch (color) {
      case '蓝色':
        return 'bg-blue-600 text-white border-blue-700';
      case '绿色':
        return 'bg-gradient-to-r from-green-600 to-emerald-500 text-white border-green-700';
      case '黄色':
        return 'bg-yellow-400 text-black border-yellow-500';
      default:
        return 'bg-blue-600 text-white border-blue-700';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {['上传车辆图片', 'AI定位车牌', '识别字符输出'].map((step, i) => (
          <div key={step} className="flex items-center gap-2">
            <span className="size-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-medium">
              {i + 1}
            </span>
            <span className="text-xs text-muted-foreground">{step}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* 左：图片上传 */}
        <Card className="border-dashed border-2">
          <CardContent className="p-4 min-h-[320px] flex flex-col">
            {!imageUrl ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
                <div className="size-16 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-4">
                  <Car className="size-8 text-blue-600" />
                </div>
                <h4 className="font-medium text-foreground mb-1">上传车辆图片</h4>
                <p className="text-xs text-muted-foreground mb-4">
                  支持正面/背面车牌清晰的车辆照片
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <Button onClick={() => fileInputRef.current?.click()} className="bg-blue-600 hover:bg-blue-700">
                  <ImageIcon className="size-4 mr-2" />
                  选择图片
                </Button>
              </div>
            ) : (
              <div className="flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Car className="size-4 text-blue-600" />
                    车辆图片
                  </span>
                  <Button variant="ghost" size="sm" onClick={handleReset}>
                    <RefreshCw className="size-3.5 mr-1" /> 换一张
                  </Button>
                </div>
                <div className="flex-1 relative rounded-lg overflow-hidden bg-muted mb-3">
                  <Image
                    src={imageUrl}
                    alt="车辆图片"
                    className="w-full h-full object-cover"
                    style={{ maxHeight: '240px' }}
                  />
                  {isAnalyzing && (
                    <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center">
                      <div className="relative size-12 mb-3">
                        <div className="absolute inset-0 border-3 border-blue-400/30 rounded-full" />
                        <div className="absolute inset-0 border-3 border-blue-400 border-t-transparent rounded-full animate-spin" />
                        <Scan className="absolute inset-0 m-auto size-6 text-white" />
                      </div>
                      <p className="text-sm text-white font-medium">正在定位车牌…</p>
                    </div>
                  )}
                </div>
                <Button
                  disabled={isAnalyzing}
                  onClick={() => runRecognition()}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  <Sparkles className="size-4 mr-2" />
                  {isAnalyzing ? '识别中…' : '开始识别车牌'}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 右：识别结果 */}
        <Card className="overflow-hidden">
          <CardContent className="p-4 min-h-[320px] flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-foreground flex items-center gap-2">
                <CheckCircle className="size-4 text-blue-600" />
                识别结果
              </span>
              {result && (
                <Badge variant="outline" className="text-[10px]">
                  置信度 {result.confidence}%
                </Badge>
              )}
            </div>

            <div className="flex-1">
              {result ? (
                <div className="space-y-4">
                  {/* 车牌大图 */}
                  <div className="text-center">
                    <div
                      className={`inline-block px-6 py-3 rounded-lg border-2 ${plateColorClass(result.plateColor)} font-bold text-2xl tracking-widest shadow-lg`}
                      style={{ fontFamily: 'Georgia, serif' }}
                    >
                      {result.plateNumber}
                    </div>
                  </div>

                  {/* 信息列表 */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg bg-muted/40">
                      <p className="text-[10px] text-muted-foreground mb-1">车牌颜色</p>
                      <p className="text-sm font-medium text-foreground">{result.plateColor}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/40">
                      <p className="text-[10px] text-muted-foreground mb-1">车辆类型</p>
                      <p className="text-sm font-medium text-foreground">{result.vehicleType}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/40">
                      <p className="text-[10px] text-muted-foreground mb-1">所属地区</p>
                      <p className="text-sm font-medium text-foreground">{result.region}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/40">
                      <p className="text-[10px] text-muted-foreground mb-1">识别置信度</p>
                      <p className="text-sm font-medium text-foreground">{result.confidence}%</p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-border/40">
                    <p className="text-xs text-muted-foreground mb-2">
                      💡 技术原理：目标检测定位车牌 → 字符分割 → CNN字符识别 → 校验输出
                    </p>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center py-8">
                  <div className="size-14 rounded-2xl bg-muted/60 flex items-center justify-center mb-3">
                    <Car className="size-7 text-muted-foreground/40" />
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">暂无识别结果</p>
                  <p className="text-xs text-muted-foreground/70">上传车辆图片后开始识别</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 示例 */}
      <div>
        <p className="text-xs text-muted-foreground mb-2">🚗 试试示例图片：</p>
        <div className="flex gap-3 flex-wrap">
          {SAMPLE_IMAGES.map((s, i) => (
            <button
              key={i}
              onClick={() => runRecognition(s)}
              className="group flex items-center gap-2 px-3 py-2 rounded-lg border border-border/60 hover:border-blue-300 hover:bg-blue-50/50 transition-all text-left"
            >
              <div className="size-10 rounded overflow-hidden bg-muted shrink-0">
                <Image src={s.url} alt={s.label} className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="text-xs font-medium text-foreground">{s.label}</p>
                <p className="text-[10px] text-muted-foreground">{s.result.plateNumber}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

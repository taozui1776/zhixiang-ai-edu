import { useState, useEffect } from 'react';
import { Play, Code, Lightbulb, ChevronRight, Copy, X, Maximize2, Cpu, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export interface ProjectTemplate {
  id: string;
  title: string;
  difficulty: '入门' | '进阶' | '挑战';
  category: '图形化' | 'Python' | '物联网';
  description: string;
  code: string;
  wiring: string; // 接线说明
  duration: string;
  icon: string;
}

const TEMPLATES: ProjectTemplate[] = [
  {
    id: 'led-blink',
    title: '点亮 LED',
    difficulty: '入门',
    category: 'Python',
    description: '让开发板上的 LED 灯闪烁起来，认识数字输出和延时函数',
    duration: '15 分钟',
    icon: '💡',
    code: `from machine import Pin
import time

# 初始化 LED 引脚（常见行空板 13 号引脚）
led = Pin(13, Pin.OUT)

print("LED 闪烁开始")
count = 0

while True:
    led.value(1)          # 点亮 LED
    print(f"第 {count + 1} 次：亮")
    time.sleep(0.5)       # 保持 0.5 秒
    
    led.value(0)          # 熄灭 LED
    print(f"第 {count + 1} 次：灭")
    time.sleep(0.5)       # 保持 0.5 秒
    
    count += 1`,
    wiring:
      '板载 LED 通常已连接到特定引脚（行空板 13 号，ESP32 常用 2 号）。\n外接 LED 时：LED 长脚（阳极）→ 串联 220Ω 电阻 → 数字引脚；\nLED 短脚（阴极）→ GND。',
  },
  {
    id: 'dht-read',
    title: '温湿度读取',
    difficulty: '入门',
    category: 'Python',
    description: '读取 DHT11/DHT22 温湿度传感器数据并串口打印',
    duration: '20 分钟',
    icon: '🌡️',
    code: `from machine import Pin
import dht
import time

# DHT11 接在 14 号引脚
sensor = dht.DHT11(Pin(14))

print("开始读取温湿度数据")
print("=" * 30)

while True:
    try:
        sensor.measure()
        temp = sensor.temperature()
        humi = sensor.humidity()
        
        print(f"温度：{temp}°C")
        print(f"湿度：{humi}%")
        
        # 简单舒适度判断
        if temp > 30:
            print("👉 有点热，注意防暑")
        elif temp < 15:
            print("👉 有点凉，注意保暖")
        else:
            print("👉 温度适宜，舒适~")
            
        print("-" * 30)
        
    except Exception as e:
        print(f"读取失败：{e}")
    
    time.sleep(2)`,
    wiring:
      'DHT11/DHT22 三根线：\nVCC → 3.3V（或 5V）\nDATA → 数字引脚（如 14 号），并加 4.7kΩ 上拉电阻到 VCC\nGND → GND',
  },
  {
    id: 'face-detect',
    title: '人脸识别',
    difficulty: '进阶',
    category: 'Python',
    description: '使用摄像头 + AI 模型识别人脸，适合行空板 M10 / MaixCAM',
    duration: '45 分钟',
    icon: '👤',
    code: `from maix import camera, display, image, nn
import time

# 加载人脸识别模型
detector = nn.FaceRecognizer()

print("人脸识别启动...")
cam = camera.camera(320, 240)
disp = display.display()

frame_count = 0

while True:
    img = cam.read()
    
    # 人脸检测
    faces = detector.detect(img)
    
    for face in faces:
        # 画人脸框
        img.draw_rect(
            face.x, face.y, face.w, face.h,
            color=image.COLOR_GREEN, thickness=2
        )
        
        # 画五官点
        for point in face.points:
            img.draw_circle(point.x, point.y, 2, image.COLOR_RED, -1)
    
    # 显示帧率
    frame_count += 1
    img.draw_string(5, 5, f"人数: {len(faces)}", image.COLOR_GREEN)
    
    disp.show(img)
    
    time.sleep_ms(10)`,
    wiring:
      '行空板 M10 / MaixCAM 自带摄像头，直接使用即可。\n外接摄像头时：使用 MIPI CSI 接口连接，注意排线方向（蓝面朝内）。',
  },
  {
    id: 'iot-upload',
    title: '物联网数据上报',
    difficulty: '进阶',
    category: '物联网',
    description: '将传感器数据通过 Wi-Fi 上传到 IoT 平台（如 OneNET / MQTT）',
    duration: '40 分钟',
    icon: '📡',
    code: `import network
import time
from machine import Pin
from umqtt.simple import MQTTClient

# ====== 配置信息 ======
WIFI_SSID = "你的WiFi名称"
WIFI_PASS = "你的WiFi密码"
MQTT_SERVER = "mqtt.example.com"
MQTT_TOPIC = "classroom/sensor01"
DEVICE_ID = "xingkong-001"
# =====================

led = Pin(13, Pin.OUT)

def connect_wifi():
    wlan = network.WLAN(network.STA_IF)
    wlan.active(True)
    if not wlan.isconnected():
        print("连接 Wi-Fi...")
        wlan.connect(WIFI_SSID, WIFI_PASS)
        while not wlan.isconnected():
            time.sleep(0.5)
            led.value(not led.value())
    print("Wi-Fi 已连接！IP:", wlan.ifconfig()[0])
    led.value(1)
    return wlan

# 连接 Wi-Fi
connect_wifi()

# 连接 MQTT
client = MQTTClient(DEVICE_ID, MQTT_SERVER)
client.connect()
print("MQTT 已连接")

# 模拟传感器数据上报
import random
count = 0
while True:
    temp = 25 + random.random() * 5
    humi = 40 + random.random() * 20
    
    payload = f'{{"temp":{temp:.1f},"humi":{humi:.1f},"id":"{DEVICE_ID}"}}'
    client.publish(MQTT_TOPIC, payload)
    
    count += 1
    print(f"第 {count} 次上报：温度 {temp:.1f}°C, 湿度 {humi:.1f}%")
    
    time.sleep(3)`,
    wiring:
      '1. 确认开发板支持 Wi-Fi（行空板 / ESP32 均内置）\n'
      + '2. 温湿度传感器（DHT11）接数字引脚\n'
      + '3. 确保在同一局域网内，或 IoT 平台支持公网接入',
  },
];

const DIFF_COLORS = {
  入门: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  进阶: 'bg-blue-100 text-blue-700 border-blue-200',
  挑战: 'bg-rose-100 text-rose-700 border-rose-200',
};

export default function ProjectTemplatesSection({
   selectedTemplate,
   setSelectedTemplate,
 }: {
   selectedTemplate: string | null;
   setSelectedTemplate: (id: string | null) => void;
 }) {
   const selected = TEMPLATES.find((t) => t.id === selectedTemplate);
   const [hardwareConnected, setHardwareConnected] = useState(false);

   useEffect(() => {
     const check = () => {
       try {
         const raw = localStorage.getItem('zhixiang_hardware_connected');
         setHardwareConnected(!!raw);
       } catch {
         setHardwareConnected(false);
       }
     };
     check();
     window.addEventListener('storage', check);
     return () => window.removeEventListener('storage', check);
   }, []);

   const handleSendToHardware = () => {
     if (!selected) return;
     if (!hardwareConnected) {
       toast.info('请先连接硬件设备');
       // 跳转到硬件连接中心并带上代码参数
       const encoded = encodeURIComponent(selected.code);
       window.open(`/hardware-connect?code=${encoded}`, '_blank');
       return;
     }
     // 已连接：将代码存入 localStorage 供硬件连接中心读取，然后新窗口打开
     try {
       localStorage.setItem('zhixiang_pending_code', selected.code);
     } catch {
       // ignore
     }
     toast.success('代码已准备好，正在打开硬件连接中心…');
     window.open('/hardware-connect', '_blank');
   };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {TEMPLATES.map((tpl, i) => (
          <motion.div
            key={tpl.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
          >
            <Card
              className="h-full border-0 shadow-sm hover:shadow-md transition-all cursor-pointer group"
              onClick={() => setSelectedTemplate(tpl.id)}
            >
              <CardContent className="p-5 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="size-11 rounded-xl bg-gradient-to-br from-primary/10 to-accent/20 flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 transition-transform">
                    {tpl.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-semibold truncate">{tpl.title}</h3>
                    </div>
                    <div className="flex gap-1.5">
                      <Badge
                        variant="outline"
                        className={`text-[10px] h-4 px-1 ${DIFF_COLORS[tpl.difficulty]}`}
                      >
                        {tpl.difficulty}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="text-[10px] h-4 px-1 bg-primary/5 text-primary border-primary/20"
                      >
                        {tpl.category}
                      </Badge>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">{tpl.description}</p>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-muted-foreground">⏱ {tpl.duration}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-xs text-primary group-hover:translate-x-1 transition-transform"
                  >
                    查看示例
                    <ChevronRight className="size-3.5 ml-0.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Dialog
        open={!!selected}
        onOpenChange={(open) => !open && setSelectedTemplate(null)}
      >
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-hidden flex flex-col">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <span className="text-2xl">{selected.icon}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      {selected.title}
                      <Badge
                        variant="outline"
                        className={`text-[10px] h-5 px-1.5 ${DIFF_COLORS[selected.difficulty]}`}
                      >
                        {selected.difficulty}
                      </Badge>
                    </div>
                    <DialogDescription className="mt-0.5">
                      {selected.category} · {selected.duration}
                    </DialogDescription>
                  </div>
                </DialogTitle>
              </DialogHeader>

              <div className="flex-1 overflow-y-auto space-y-4 -mr-2 pr-2">
                <p className="text-sm text-foreground bg-muted/30 p-3 rounded-lg">
                  <Lightbulb className="size-4 mr-2 text-amber-500 inline -mt-0.5" />
                  {selected.description}
                </p>

                <div>
                  <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                    <Code className="size-4 text-primary" />
                    示例代码
                  </h4>
                  <div className="relative">
                    <pre className="p-4 rounded-xl bg-slate-900 text-slate-100 text-xs leading-relaxed overflow-x-auto">
                      <code>{selected.code}</code>
                    </pre>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="absolute top-2 right-2 h-7 text-xs"
                      onClick={() => {
                        navigator.clipboard.writeText(selected.code);
                        toast.success('代码已复制到剪贴板');
                      }}
                    >
                      <Copy className="size-3 mr-1" />
                      复制
                    </Button>
                  </div>
                </div>

                 <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-100">
                   <h4 className="text-sm font-semibold mb-2 text-blue-800 flex items-center gap-2">
                     🔌 接线说明
                   </h4>
                   <p className="text-sm text-blue-700/90 whitespace-pre-line leading-relaxed">
                     {selected.wiring}
                   </p>
                 </div>

                 <div className="flex items-center gap-2 pt-1">
                   <Button
                     className="flex-1"
                     onClick={handleSendToHardware}
                   >
                     <Cpu className="size-4 mr-1.5" />
                     {hardwareConnected ? '发送到硬件' : '连接硬件并运行'}
                   </Button>
                   <Button
                     variant="outline"
                     onClick={() => {
                       navigator.clipboard.writeText(selected.code);
                       toast.success('代码已复制到剪贴板');
                     }}
                   >
                     <Copy className="size-4 mr-1.5" />
                     复制代码
                   </Button>
                 </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

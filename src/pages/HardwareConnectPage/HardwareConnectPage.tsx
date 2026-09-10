import { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Usb,
  Cpu,
  Wifi,
  Bluetooth,
  Power,
  Activity,
  Send,
  Copy,
  ChevronRight,
  HelpCircle,
  Zap,
  Monitor,
  AlertTriangle,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { HARDWARE_DEVICES, type IHardwareDevice } from '@/data/hardware-devices';
import { Code2, ArrowRight } from 'lucide-react';

type ConnectState = 'disconnected' | 'connecting' | 'connected';

type ConnectMode = 'real' | 'demo';

interface SerialLog {
  id: number;
  type: 'sent' | 'received' | 'system';
  content: string;
  time: string;
}

export default function HardwareConnectPage() {
  const navigate = useNavigate();
  const [connectState, setConnectState] = useState<ConnectState>('disconnected');
  const [connectedDevice, setConnectedDevice] = useState<IHardwareDevice | null>(null);
  const [selectedDevice, setSelectedDevice] = useState<string>('xingkong-k10');
  const [codeInput, setCodeInput] = useState(`from machine import Pin
import time

led = Pin(13, Pin.OUT)
for i in range(5):
    led.value(1)
    time.sleep(0.5)
    led.value(0)
    time.sleep(0.5)
print("闪烁完成！")`);
  const [serialLogs, setSerialLogs] = useState<SerialLog[]>([]);
  const [sensorData, setSensorData] = useState({ temp: 0, humi: 0, light: 0, sound: 0 });
  const [isSending, setIsSending] = useState(false);
  const [connectMode, setConnectMode] = useState<ConnectMode>('demo');
  const [portInfo, setPortInfo] = useState<{ vendorId?: number; productId?: number; portName?: string }>({});
  const serialPortRef = useRef<SerialPort | null>(null);
  const readerRef = useRef<ReadableStreamDefaultReader<string> | null>(null);
  const readingRef = useRef(false);
  const sensorIntervalRef = useRef<number | null>(null);

  // 解析串口数据中的传感器值
  const parseSensorData = useCallback((line: string) => {
    const tempMatch = line.match(/温度[：:]\s*(-?\d+\.?\d*)/);
    const humiMatch = line.match(/湿度[：:]\s*(\d+\.?\d*)/);
    const lightMatch = line.match(/(光照|亮度)[：:]\s*(\d+)/);
    const soundMatch = line.match(/(声音|音量)[：:]\s*(\d+)/);
    setSensorData((prev) => ({
      temp: tempMatch ? Number(tempMatch[1]) : prev.temp,
      humi: humiMatch ? Number(humiMatch[1]) : prev.humi,
      light: lightMatch ? Number(lightMatch[2]) : prev.light,
      sound: soundMatch ? Number(soundMatch[2]) : prev.sound,
    }));
  }, []);

  // 代码模板列表
  const CODE_TEMPLATES = [
    { id: 'led-blink', name: 'LED 闪烁', code: `from machine import Pin
import time

led = Pin(13, Pin.OUT)
while True:
    led.value(1)
    time.sleep(0.5)
    led.value(0)
    time.sleep(0.5)` },
    { id: 'hello', name: 'Hello World', code: 'print("Hello, MicroPython!")' },
    { id: 'dht11', name: '温湿度读取', code: `from machine import Pin
import dht
import time

sensor = dht.DHT11(Pin(14))
while True:
    try:
        sensor.measure()
        print(f"温度: {sensor.temperature()}°C, 湿度: {sensor.humidity()}%")
    except Exception as e:
        print(f"读取失败: {e}")
    time.sleep(2)` },
    { id: 'pwm', name: 'PWM 呼吸灯', code: `from machine import Pin, PWM
import time

led = PWM(Pin(13))
led.freq(1000)

while True:
    for i in range(0, 1024, 10):
        led.duty(i)
        time.sleep(0.01)
    for i in range(1023, -1, -10):
        led.duty(i)
        time.sleep(0.01)` },
    { id: 'button', name: '按键检测', code: `from machine import Pin
import time

button = Pin(0, Pin.IN, Pin.PULL_UP)

while True:
    if button.value() == 0:
        print("按键按下")
        time.sleep(0.2)
    time.sleep(0.01)` },
  ];

  // 初始化：从 localStorage 读取待发送代码和连接状态
  useEffect(() => {
    try {
      const pendingCode = localStorage.getItem('zhixiang_pending_code');
      if (pendingCode) {
        setCodeInput(pendingCode);
        localStorage.removeItem('zhixiang_pending_code');
      }
    } catch {
      // ignore
    }
    try {
      const savedDevice = localStorage.getItem('zhixiang_hardware_connected');
      if (savedDevice) {
        const device = JSON.parse(savedDevice);
        const match = HARDWARE_DEVICES.find((d) => d.id === device.id);
        if (match) {
          setConnectState('connected');
          setConnectedDevice(match);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  const isSupported = typeof navigator !== 'undefined' && 'serial' in navigator;

  const selected = HARDWARE_DEVICES.find((d) => d.id === selectedDevice) || HARDWARE_DEVICES[0];

  const addLog = useCallback((type: SerialLog['type'], content: string) => {
    const now = new Date();
    const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    setSerialLogs((prev) => [
      ...prev.slice(-49),
      { id: Date.now() + Math.random(), type, content, time },
    ]);
  }, []);

  const connectDevice = async () => {
    if (!isSupported) {
      toast.info('当前浏览器不支持 Web Serial API，请使用 Chrome / Edge 浏览器，已切换到演示模式');
      // 不支持则进入演示模式
      setConnectState('connecting');
      setConnectMode('demo');
      addLog('system', '浏览器不支持 Web Serial，进入演示模式…');
      await new Promise((r) => setTimeout(r, 1000));
      setConnectState('connected');
      setConnectedDevice(selected);
      addLog('system', `✅ 演示模式已就绪：${selected.name}`);
      addLog('received', 'MicroPython v1.20.0; ESP32-S3');
      addLog('received', 'Type "help()" for more information.');
      addLog('received', '>>> ');
      toast.success('演示模式已启动');
      startSensorSimulation();
      return;
    }

    setConnectState('connecting');
    addLog('system', '正在请求串口设备…');

    try {
      // 真实 Web Serial 连接
      const port = await navigator.serial.requestPort();
      serialPortRef.current = port;

      await port.open({ baudRate: 115200 });

      setConnectMode('real');
      setConnectState('connected');
      setConnectedDevice(selected);

      // 读取 vendorId / productId
      const info = port.getInfo();
      setPortInfo({
        vendorId: info.usbVendorId,
        productId: info.usbProductId,
        portName: 'USB Serial',
      });

      try {
        localStorage.setItem(
          'zhixiang_hardware_connected',
          JSON.stringify({ ...selected, mode: 'real', vendorId: info.usbVendorId, productId: info.usbProductId }),
        );
      } catch {
        // ignore
      }

      addLog('system', `✅ 已通过 Web Serial 连接到 ${selected.name}`);
      if (info.usbVendorId) {
        addLog('system', `设备 VID:PID = 0x${info.usbVendorId.toString(16).padStart(4, '0')}:0x${(info.usbProductId ?? 0).toString(16).padStart(4, '0')}`);
      }
      toast.success(`成功连接 ${selected.name}`);

      // 启动串口读取循环
      startSerialRead(port);
    } catch (err) {
      // 用户取消或连接失败 → 降级为演示模式
      setConnectState('disconnected');
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes('cancel') || msg.includes('用户取消') || msg.includes('No port')) {
        toast.info('已取消选择设备，可点击「演示模式」体验功能');
        addLog('system', '用户取消了设备选择');
      } else {
        toast.error(`连接失败：${msg}，已切换到演示模式`);
        addLog('system', `❌ 连接失败：${msg}`);
        // 自动进入演示模式
        setTimeout(() => startDemoMode(), 500);
      }
    }
  };

  const startDemoMode = async () => {
    setConnectState('connecting');
    setConnectMode('demo');
    addLog('system', '进入演示模式（模拟数据）…');
    await new Promise((r) => setTimeout(r, 1000));
    setConnectState('connected');
    setConnectedDevice(selected);
    try {
      localStorage.setItem(
        'zhixiang_hardware_connected',
        JSON.stringify({ ...selected, mode: 'demo' }),
      );
    } catch {
      // ignore
    }
    addLog('system', `✅ 演示模式已就绪：${selected.name}`);
    addLog('received', 'MicroPython v1.20.0; ESP32-S3');
    addLog('received', 'Type "help()" for more information.');
    addLog('received', '>>> ');
    toast.success('演示模式已启动');
    startSensorSimulation();
  };

  // 串口读取循环
  const startSerialRead = async (port: SerialPort) => {
    if (!port.readable) return;
    readingRef.current = true;
    const decoder = new TextDecoderStream();
    const inputDone = port.readable.pipeTo(decoder.writable as unknown as WritableStream<Uint8Array>);
    const reader = decoder.readable.getReader();
    readerRef.current = reader;

    let buffer = '';
    try {
      while (readingRef.current) {
        const { value, done } = await reader.read();
        if (done) break;
        if (value) {
          buffer += value;
          // 按行处理
          const lines = buffer.split(/\r?\n/);
          buffer = lines.pop() || '';
          for (const line of lines) {
            if (line.trim()) {
              addLog('received', line.trim());
              parseSensorData(line.trim());
            }
          }
        }
      }
    } catch (err) {
      addLog('system', `串口读取中断：${err instanceof Error ? err.message : String(err)}`);
    } finally {
      try {
        reader.releaseLock();
      } catch {
        // ignore
      }
      readerRef.current = null;
    }
  };

  const disconnectDevice = async () => {
    readingRef.current = false;
    // 关闭 reader
    if (readerRef.current) {
      try {
        await readerRef.current.cancel();
        readerRef.current = null;
      } catch {
        // ignore
      }
    }
    // 关闭串口
    if (serialPortRef.current) {
      try {
        await serialPortRef.current.close();
      } catch {
        // ignore
      }
      serialPortRef.current = null;
    }
    // 清理模拟定时器
    if (sensorIntervalRef.current) {
      clearInterval(sensorIntervalRef.current);
      sensorIntervalRef.current = null;
    }
    setConnectState('disconnected');
    setConnectedDevice(null);
    setSensorData({ temp: 0, humi: 0, light: 0, sound: 0 });
    setPortInfo({});
    try {
      localStorage.removeItem('zhixiang_hardware_connected');
    } catch {
      // ignore
    }
    addLog('system', '🔌 已断开连接');
    toast.info('设备已断开');
  };

  const startSensorSimulation = () => {
    // 清理已有的定时器
    if (sensorIntervalRef.current) {
      clearInterval(sensorIntervalRef.current);
    }
    // 模拟传感器数据更新
    const baseTemp = 25 + Math.random() * 5;
    const baseHumi = 40 + Math.random() * 20;
    let frame = 0;

    sensorIntervalRef.current = window.setInterval(() => {
      frame++;
      setSensorData({
        temp: Number((baseTemp + Math.sin(frame * 0.1) * 1.2).toFixed(1)),
        humi: Number((baseHumi + Math.cos(frame * 0.08) * 5).toFixed(1)),
        light: Math.floor(500 + Math.sin(frame * 0.15) * 300 + Math.random() * 50),
        sound: Math.floor(30 + Math.random() * 20 + (frame % 7 === 0 ? 15 : 0)),
      });
    }, 1500);

    return () => {
      if (sensorIntervalRef.current) {
        clearInterval(sensorIntervalRef.current);
        sensorIntervalRef.current = null;
      }
    };
  };

  const sendCode = async () => {
    if (!codeInput.trim()) return;
    setIsSending(true);

    const lines = codeInput.split('\n');

    if (connectMode === 'real' && serialPortRef.current?.writable) {
      try {
        const writer = serialPortRef.current.writable.getWriter();
        const encoder = new TextEncoder();

        // 发送 Ctrl+C 中断当前程序
        await writer.write(encoder.encode('\x03'));
        addLog('sent', '<Ctrl+C> 中断程序');
        await new Promise((r) => setTimeout(r, 300));

        // 进入 raw REPL 模式 (Ctrl+A)
        await writer.write(encoder.encode('\x01'));
        addLog('sent', '<Ctrl+A> 进入原始 REPL 模式');
        await new Promise((r) => setTimeout(r, 200));

        // 逐行发送代码
        for (const line of lines) {
          if (line.trim()) {
            await writer.write(encoder.encode(line + '\r\n'));
            addLog('sent', line.trim());
            await new Promise((r) => setTimeout(r, 100));
          } else {
            // 空行也发送以保持缩进结构
            await writer.write(encoder.encode('\r\n'));
          }
        }

        // 发送 Ctrl+D 执行
        await writer.write(encoder.encode('\x04'));
        addLog('sent', '<Ctrl+D> 执行代码');

        writer.releaseLock();
        toast.success('代码已发送并执行');
      } catch (err) {
        addLog('system', `❌ 发送失败：${err instanceof Error ? err.message : String(err)}`);
        toast.error('代码发送失败');
      }
    } else {
      // 演示模式：模拟发送
      for (const line of lines) {
        if (line.trim()) {
          addLog('sent', line.trim());
          await new Promise((r) => setTimeout(r, 200));
        }
      }
      await new Promise((r) => setTimeout(r, 500));
      addLog('received', '>>> ... ... ... ... ...');
      await new Promise((r) => setTimeout(r, 800));
      addLog('received', '闪烁完成！');
      addLog('received', '>>> ');
      toast.success('代码已发送并执行（演示模式）');
    }

    setIsSending(false);
  };

  const sendQuickCommand = (cmd: string) => {
    setCodeInput(cmd);
  };

  // 组件卸载时清理连接和定时器
  useEffect(() => {
    return () => {
      readingRef.current = false;
      if (sensorIntervalRef.current) {
        clearInterval(sensorIntervalRef.current);
      }
      if (readerRef.current) {
        try { readerRef.current.cancel(); } catch {
          // ignore
        }
      }
      if (serialPortRef.current) {
        try { serialPortRef.current.close(); } catch {
          // ignore
        }
      }
    };
  }, []);

  // 新日志自动滚动到底部
  useEffect(() => {
    const el = document.getElementById('serial-monitor');
    if (el) el.scrollTop = el.scrollHeight;
  }, [serialLogs]);

  return (
    <div className="min-h-screen bg-slate-50/60">
      {/* 顶部 Banner */}
      <div className="w-full bg-gradient-to-r from-slate-800 via-slate-700 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,rgba(59_130_246_0.2),transparent_60%)]" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 py-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <Badge className="bg-blue-500/20 text-blue-300 border-0 mb-3">
                <Usb className="size-3 mr-1" />
                硬件连接中心
              </Badge>
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                一站式硬件连接与调试
              </h1>
              <p className="text-white/70 max-w-xl text-sm">
                通过 Web Serial API 直接连接开发板，无需安装驱动软件，
                在线烧录代码、查看串口输出、实时监测传感器数据。
              </p>
            </div>

              <div className="flex items-center gap-3">
               <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                 {connectState === 'connected' ? (
                   <>
                     <div className="size-2.5 rounded-full bg-emerald-400 animate-pulse" />
                     <span className="text-sm text-white">
                       已连接 · {connectedDevice?.name}
                       {connectMode === 'demo' && <span className="ml-1.5 text-white/60 text-xs">（演示模式）</span>}
                     </span>
                   </>
                 ) : connectState === 'connecting' ? (
                   <>
                     <div className="size-2.5 rounded-full bg-amber-400 animate-pulse" />
                     <span className="text-sm text-white">连接中…</span>
                   </>
                 ) : (
                   <>
                     <div className="size-2.5 rounded-full bg-slate-500" />
                     <span className="text-sm text-white/70">未连接设备</span>
                   </>
                 )}
               </div>
               {connectState === 'connected' ? (
                 <Button variant="destructive" onClick={disconnectDevice}>
                   断开连接
                 </Button>
               ) : (
                 <div className="flex gap-2">
                   <Button
                     onClick={startDemoMode}
                     variant="outline"
                     className="bg-white/10 text-white border-white/20 hover:bg-white/20"
                   >
                     演示模式
                   </Button>
                   <Button
                     onClick={connectDevice}
                     disabled={selected.status === 'coming-soon'}
                     className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
                   >
                     <Cpu className="size-4 mr-2" />
                     {selected.status === 'coming-soon' ? '即将上市' : '连接设备'}
                   </Button>
                 </div>
               )}
             </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 space-y-6">
        {/* 硬件列表 */}
        <section>
          <h2 className="text-lg font-bold mb-4">支持硬件</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
            {HARDWARE_DEVICES.map((device, idx) => (
              <HardwareCard
                key={device.id}
                device={device}
                selected={selectedDevice === device.id}
                onClick={() => {
                  if (device.status !== 'coming-soon') {
                    setSelectedDevice(device.id);
                    if (connectState === 'connected') {
                      disconnectDevice();
                    }
                  }
                }}
                index={idx}
              />
            ))}
          </div>
        </section>

        {/* 连接控制面板 */}
        {connectState !== 'disconnected' && (
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* 实时数据面板 */}
            <div className="lg:col-span-1">
              <Card className="border-0 shadow-sm h-full">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Activity className="size-4 text-emerald-500" />
                    实时数据面板
                  </CardTitle>
                  <CardDescription className="text-xs">
                    {connectMode === 'real' ? '实时传感器读数' : '演示模式：模拟传感器读数'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <SensorCard
                    label="温度"
                    value={sensorData.temp}
                    unit="°C"
                    icon="🌡️"
                    color="from-orange-400 to-red-500"
                  />
                  <SensorCard
                    label="湿度"
                    value={sensorData.humi}
                    unit="%"
                    icon="💧"
                    color="from-blue-400 to-cyan-500"
                  />
                  <SensorCard
                    label="光照"
                    value={sensorData.light}
                    unit="lux"
                    icon="☀️"
                    color="from-amber-400 to-yellow-500"
                  />
                  <SensorCard
                    label="声音"
                    value={sensorData.sound}
                    unit="dB"
                    icon="🔊"
                    color="from-violet-400 to-purple-500"
                  />

                   <div className="pt-2 border-t border-border/50 mt-3">
                     <p className="text-xs text-muted-foreground mb-2">设备信息</p>
                     <div className="space-y-1 text-xs">
                       <div className="flex justify-between">
                         <span className="text-muted-foreground">型号</span>
                         <span className="font-medium">{connectedDevice?.name}</span>
                       </div>
                       <div className="flex justify-between">
                         <span className="text-muted-foreground">芯片</span>
                         <span className="font-medium">{connectedDevice?.chip}</span>
                       </div>
                       <div className="flex justify-between">
                         <span className="text-muted-foreground">固件</span>
                         <span className="font-medium font-mono">v1.20.0</span>
                       </div>
                       <div className="flex justify-between">
                         <span className="text-muted-foreground">连接方式</span>
                         <span className="font-medium">{connectMode === 'real' ? 'Web Serial' : '演示模式'}</span>
                       </div>
                       {portInfo.vendorId && (
                         <div className="flex justify-between">
                           <span className="text-muted-foreground">VID:PID</span>
                           <span className="font-mono">
                             0x{portInfo.vendorId.toString(16).padStart(4, '0')}:
                             0x{(portInfo.productId ?? 0).toString(16).padStart(4, '0')}
                           </span>
                         </div>
                       )}
                     </div>
                   </div>
                </CardContent>
              </Card>
            </div>

            {/* 代码发送 + 串口监视器 */}
            <div className="lg:col-span-2 space-y-4">
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Send className="size-4 text-blue-500" />
                    发送代码
                  </CardTitle>
                  <CardDescription className="text-xs">
                    输入 MicroPython 代码，点击发送即可在硬件上执行
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-muted-foreground shrink-0">从模板选择：</span>
                    <Select
                      value=""
                      onValueChange={(val) => {
                        const tpl = CODE_TEMPLATES.find((t) => t.id === val);
                        if (tpl) setCodeInput(tpl.code);
                      }}
                    >
                      <SelectTrigger className="h-8 w-48 text-xs">
                        <SelectValue placeholder="选择代码模板" />
                      </SelectTrigger>
                      <SelectContent>
                        {CODE_TEMPLATES.map((tpl) => (
                          <SelectItem key={tpl.id} value={tpl.id} className="text-xs">
                            {tpl.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      size="sm"
                      className="ml-auto"
                      onClick={() => navigate('/coding-lab')}
                    >
                      <Code2 className="size-3.5 mr-1.5" />
                      打开编程实验室
                      <ArrowRight className="size-3 ml-1" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {['print("Hello, MicroPython!")', 'import machine', 'help()', 'from machine import Pin'].map(
                      (cmd) => (
                        <button
                          key={cmd}
                          onClick={() => sendQuickCommand(cmd)}
                          className="px-2.5 py-1 text-xs rounded-full bg-muted/60 text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                        >
                          {cmd}
                        </button>
                      ),
                    )}
                  </div>
                  <Textarea
                    value={codeInput}
                    onChange={(e) => setCodeInput(e.target.value)}
                    className="font-mono text-xs h-32 resize-none"
                    placeholder="输入要发送的 MicroPython 代码…"
                  />
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">
                      快捷键：Ctrl+Enter 发送
                    </span>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          navigator.clipboard.writeText(codeInput);
                          toast.success('代码已复制');
                        }}
                      >
                        <Copy className="size-3.5 mr-1" />
                        复制
                      </Button>
                      <Button size="sm" onClick={sendCode} disabled={isSending}>
                        {isSending ? '发送中…' : '发送并执行'}
                        <Send className="size-3.5 ml-1.5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Monitor className="size-4 text-emerald-500" />
                    串口监视器
                  </CardTitle>
                  <CardDescription className="text-xs">
                    {serialLogs.length} 条消息
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-56 overflow-y-auto bg-slate-900 rounded-lg p-3 font-mono text-xs space-y-0.5" id="serial-monitor">
                    {serialLogs.length === 0 ? (
                      <p className="text-slate-500">等待串口数据…</p>
                    ) : (
                      serialLogs.map((log) => (
                        <div key={log.id} className="flex gap-2">
                          <span className="text-slate-600 shrink-0">[{log.time}]</span>
                          <span
                            className={
                              log.type === 'sent'
                                ? 'text-cyan-400'
                                : log.type === 'received'
                                  ? 'text-emerald-400'
                                  : 'text-amber-400'
                            }
                          >
                            {log.type === 'sent' ? '> ' : ''}
                            {log.content}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        )}

        {/* FAQ */}
        <section>
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <HelpCircle className="size-5 text-primary" />
            常见问题排查
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                q: '找不到串口设备怎么办？',
                a: '1. 检查 USB 线是否为数据线（部分充电线无数据功能）\n2. 确认已安装对应驱动（CH340 / CP2102 / FTDI）\n3. 尝试更换 USB 口或重启电脑\n4. 关闭其他可能占用串口的软件',
                icon: AlertTriangle,
                color: 'text-amber-500',
              },
              {
                q: '驱动如何安装？',
                a: '常见 USB 转串口芯片驱动：\n• CH340：搜索"CH340 驱动"下载安装\n• CP2102：硅 Labs 官网下载 CP210x 驱动\n• FTDI：FTDI 官网下载 VCP 驱动\n安装后重启电脑即可识别',
                icon: Zap,
                color: 'text-blue-500',
              },
              {
                q: '串口被占用怎么办？',
                a: '1. 关闭 Mind+、Thonny、Arduino IDE 等其他编程软件\n2. 检查是否有多个浏览器标签页同时连接\n3. 拔掉 USB 线重新插入，再尝试连接\n4. Windows 可在设备管理器中查看 COM 口状态',
                icon: XCircle,
                color: 'text-rose-500',
              },
              {
                q: '为什么选 Web Serial？',
                a: 'Web Serial API 让浏览器直接和串口通信，无需安装本地软件。\n• 优点：零安装、跨平台、即插即用\n• 限制：需 Chrome / Edge 浏览器，部分移动设备不支持\n• 安全：每次连接需用户手动授权',
                icon: CheckCircle2,
                color: 'text-emerald-500',
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <Card className="border-0 shadow-sm h-full">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-3">
                      <item.icon className={`size-5 ${item.color} shrink-0 mt-0.5`} />
                      <div>
                        <h3 className="text-sm font-semibold mb-2">{item.q}</h3>
                        <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
                          {item.a}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 硬件抽象层说明 */}
        <section>
          <Card className="border-0 shadow-sm bg-gradient-to-r from-slate-900 to-slate-800 text-white">
            <CardContent className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row items-start gap-5">
                <div className="size-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shrink-0">
                  <Cpu className="size-7 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold mb-2 text-white">智象硬件抽象层（HAL）</h3>
                  <p className="text-sm text-white/70 leading-relaxed mb-4">
                    智象平台自研统一硬件适配层，一套 API 兼容多品牌主流硬件。
                    无论学校已有 Arduino、micro:bit、行空板还是掌控板，
                    都能在智象平台上统一管理、统一教学，不浪费已有硬件投入。
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {HARDWARE_DEVICES.filter((d) => d.status === 'available').map((d) => (
                      <Badge
                        key={d.id}
                        variant="outline"
                        className="bg-white/5 text-white/80 border-white/20"
                      >
                        ✓ {d.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}

function HardwareCard({
  device,
  selected,
  onClick,
  index,
}: {
  device: IHardwareDevice;
  selected: boolean;
  onClick: () => void;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Card
        className={`h-full border-2 cursor-pointer transition-all overflow-hidden ${
          selected
            ? 'border-primary shadow-md'
            : 'border-transparent shadow-sm hover:shadow-md'
        } ${device.status === 'coming-soon' ? 'opacity-60 cursor-not-allowed' : ''}`}
        onClick={onClick}
      >
        <CardContent className="p-4">
          <div className="size-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-2xl">
            {device.status === 'coming-soon' ? '🚧' : '🔌'}
          </div>
          <h3 className="text-sm font-semibold text-center mb-1">{device.name}</h3>
          <p className="text-xs text-muted-foreground text-center mb-2">{device.brand}</p>
          <div className="flex flex-wrap gap-1 justify-center">
            {device.communication.slice(0, 2).map((c) => (
              <Badge
                key={c}
                variant="outline"
                className="text-[10px] h-4 px-1 font-normal"
              >
                {c.split(' ')[0]}
              </Badge>
            ))}
          </div>
          <div className="mt-3 flex items-center justify-center">
            {device.status === 'coming-soon' ? (
              <Badge variant="outline" className="text-[10px] bg-amber-50 text-amber-600 border-amber-200">
                即将上市
              </Badge>
            ) : selected ? (
              <Badge className="text-[10px] bg-primary border-0">已选中</Badge>
            ) : (
              <span className="text-[11px] text-muted-foreground flex items-center">
                点击选择
                <ChevronRight className="size-3" />
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function SensorCard({
  label,
  value,
  unit,
  icon,
  color,
}: {
  label: string;
  value: number;
  unit: string;
  icon: string;
  color: string;
}) {
  return (
    <div className="p-3 rounded-xl bg-gradient-to-br from-muted/40 to-muted/20 border border-border/40">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="text-lg">{icon}</span>
      </div>
      <div className="flex items-baseline gap-1">
        <motion.span
          key={value}
          initial={{ opacity: 0.5, y: -2 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-2xl font-bold tabular-nums bg-gradient-to-r ${color} bg-clip-text text-transparent`}
        >
          {value}
        </motion.span>
        <span className="text-xs text-muted-foreground">{unit}</span>
      </div>
    </div>
  );
}

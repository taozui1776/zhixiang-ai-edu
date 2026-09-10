import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Usb,
  WifiOff,
  CheckCircle2,
  AlertCircle,
  Send,
  Trash2,
  Cpu,
  Zap,
  Thermometer,
  Droplets,
  Sun,
  Lightbulb,
  RefreshCw,
  Info,
  HelpCircle,
} from 'lucide-react';
import { toast } from 'sonner';

type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

interface SerialLog {
  id: number;
  type: 'sent' | 'received' | 'system';
  content: string;
  time: string;
}

const SUPPORTED_DEVICES = [
  { name: '掌控板 2.0 / 3.0', vendor: '盛思', baud: 115200, icon: Cpu },
  { name: '行空板 K10 / M10', vendor: 'DFRobot', baud: 115200, icon: Zap },
  { name: 'K210 星空板', vendor: 'Sipeed', baud: 115200, icon: Cpu },
  { name: 'micro:bit V1 / V2', vendor: 'micro:bit', baud: 115200, icon: Cpu },
  { name: 'Arduino Uno / Nano', vendor: 'Arduino', baud: 9600, icon: Cpu },
  { name: 'ESP32 系列开发板', vendor: 'Espressif', baud: 115200, icon: Cpu },
];

const PRESET_COMMANDS = [
  { label: '读取温度', cmd: 'temp' },
  { label: '读取湿度', cmd: 'humid' },
  { label: '读取光线', cmd: 'light' },
  { label: 'LED 开灯', cmd: 'led_on' },
  { label: 'LED 关灯', cmd: 'led_off' },
  { label: '获取传感器数据', cmd: 'sensor_all' },
  { label: '设备信息', cmd: 'info' },
  { label: '复位设备', cmd: 'reset' },
];

// 模拟传感器数据生成
function generateMockSensorData(): string {
  const temp = (22 + Math.random() * 8).toFixed(1);
  const humid = (45 + Math.random() * 30).toFixed(0);
  const light = Math.floor(200 + Math.random() * 800);
  const types = [
    `[SENSOR] temp=${temp}°C humid=${humid}% light=${light}lux`,
    `[INFO] Device: zhiXiang-v3.0, uptime: ${Math.floor(Math.random() * 3600)}s`,
    `[OK] Command executed successfully`,
    `[DATA] A0=${Math.floor(200 + Math.random() * 600)} A1=${Math.floor(100 + Math.random() * 400)}`,
    `[EVENT] Button A pressed`,
  ];
  return types[Math.floor(Math.random() * types.length)];
}

export default function SerialConsole() {
  const [status, setStatus] = useState<ConnectionStatus>('disconnected');
  const [portInfo, setPortInfo] = useState<{ vendorId?: number; productId?: number; name?: string }>({});
  const [logs, setLogs] = useState<SerialLog[]>([
    { id: 0, type: 'system', content: '智象硬件连接中心已就绪', time: formatTime() },
    { id: 1, type: 'system', content: '使用 USB 数据线连接硬件设备，点击「连接硬件」开始', time: formatTime() },
  ]);
  const [input, setInput] = useState('');
  const [displayMode, setDisplayMode] = useState<'text' | 'hex'>('text');
  const [simMode, setSimMode] = useState(false);
  const [baudRate, setBaudRate] = useState(115200);

  const portRef = useRef<any>(null);
  const readerRef = useRef<any>(null);
  const writerRef = useRef<any>(null);
  const logEndRef = useRef<HTMLDivElement>(null);
  const logIdRef = useRef(2);
  const simIntervalRef = useRef<number | null>(null);
  const keepReadingRef = useRef(false);

  const webSerialSupported = typeof navigator !== 'undefined' && 'serial' in navigator;

  function formatTime() {
    const d = new Date();
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(
      d.getSeconds(),
    ).padStart(2, '0')}`;
  }

  const addLog = useCallback((type: SerialLog['type'], content: string) => {
    const id = logIdRef.current++;
    setLogs((prev) => {
      const next = [...prev, { id, type, content, time: formatTime() }];
      // 限制最多 200 条
      if (next.length > 200) return next.slice(-200);
      return next;
    });
  }, []);

  // 自动滚动到底部
  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollTop = logEndRef.current.scrollHeight;
    }
  }, [logs]);

  // 从串口读取数据
  const readFromPort = useCallback(
    async (port: any) => {
      const decoder = new TextDecoder();
      keepReadingRef.current = true;
      try {
        readerRef.current = port.readable.getReader();
        let buffer = '';
        while (keepReadingRef.current) {
          try {
            const { value, done } = await readerRef.current.read();
            if (done) break;
            const text = decoder.decode(value, { stream: true });
            buffer += text;
            // 按行处理
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';
            for (const line of lines) {
              const trimmed = line.replace(/\r$/, '').trim();
              if (trimmed) addLog('received', trimmed);
            }
          } catch (readErr) {
            break;
          }
        }
      } catch (err) {
        addLog('system', `读取中断: ${String(err)}`);
      } finally {
        try {
          readerRef.current?.releaseLock();
        } catch (e) {
          // ignore
        }
        readerRef.current = null;
      }
    },
    [addLog],
  );

  const connectSerial = async () => {
    if (!webSerialSupported) {
      toast.error('当前浏览器不支持 Web Serial API');
      return;
    }
    setStatus('connecting');
    addLog('system', '正在请求串口设备...');

    try {
      const port = await (navigator as any).serial.requestPort();
      await port.open({ baudRate });

      // 读取设备信息
      const info = port.getInfo ? port.getInfo() : {};
      portRef.current = port;
      setPortInfo({
        vendorId: info.usbVendorId,
        productId: info.usbProductId,
        name: info.usbVendorId ? `USB 串口设备` : '未知设备',
      });

      setStatus('connected');
      addLog('system', `已连接设备，波特率 ${baudRate}`);
      if (info.usbVendorId) {
        addLog('system', `Vendor ID: 0x${info.usbVendorId.toString(16).toUpperCase().padStart(4, '0')}`);
      }

      // 开始读取
      readFromPort(port);
    } catch (err: any) {
      setStatus('error');
      const msg = String(err?.message || err);
      addLog('system', `连接失败: ${msg}`);
      toast.error('连接失败，请检查设备是否已连接且驱动正常');
      setTimeout(() => setStatus('disconnected'), 1500);
    }
  };

  const disconnectSerial = async () => {
    keepReadingRef.current = false;
    try {
      if (writerRef.current) {
        await writerRef.current.releaseLock();
        writerRef.current = null;
      }
      if (readerRef.current) {
        await readerRef.current.cancel();
        readerRef.current = null;
      }
      if (portRef.current) {
        await portRef.current.close();
        portRef.current = null;
      }
    } catch (e) {
      // ignore
    }
    setStatus('disconnected');
    setPortInfo({});
    addLog('system', '已断开连接');
  };

  // 模拟模式
  const toggleSimMode = async (checked: boolean) => {
    if (checked) {
      // 先断开真实连接
      if (status === 'connected') {
        await disconnectSerial();
      }
      setSimMode(true);
      setStatus('connected');
      setPortInfo({ name: '虚拟硬件模拟器', vendorId: 0xffff });
      addLog('system', '🧪 已进入模拟模式，虚拟传感器数据将每 2 秒上报一次');

      // 启动模拟数据
      simIntervalRef.current = window.setInterval(() => {
        const data = generateMockSensorData();
        addLog('received', data);
      }, 2000);
    } else {
      setSimMode(false);
      if (simIntervalRef.current) {
        clearInterval(simIntervalRef.current);
        simIntervalRef.current = null;
      }
      setStatus('disconnected');
      setPortInfo({});
      addLog('system', '已退出模拟模式');
    }
  };

  // 发送数据
  const sendData = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim()) return;
    const cmd = input.trim();
    addLog('sent', cmd);
    setInput('');

    if (simMode) {
      // 模拟回复
      setTimeout(() => {
        if (cmd === 'temp') {
          const t = (22 + Math.random() * 8).toFixed(1);
          addLog('received', `[SENSOR] temp=${t}°C`);
        } else if (cmd === 'humid') {
          const h = (45 + Math.random() * 30).toFixed(0);
          addLog('received', `[SENSOR] humid=${h}%`);
        } else if (cmd === 'light') {
          const l = Math.floor(200 + Math.random() * 800);
          addLog('received', `[SENSOR] light=${l}lux`);
        } else if (cmd === 'led_on') {
          addLog('received', '[OK] LED turned ON');
        } else if (cmd === 'led_off') {
          addLog('received', '[OK] LED turned OFF');
        } else if (cmd === 'sensor_all') {
          const t = (22 + Math.random() * 8).toFixed(1);
          const h = (45 + Math.random() * 30).toFixed(0);
          const l = Math.floor(200 + Math.random() * 800);
          addLog('received', `[SENSOR] temp=${t}°C humid=${h}% light=${l}lux`);
        } else if (cmd === 'info') {
          addLog('received', '[INFO] ZhiXiang Virtual Board v3.0');
          addLog('received', '[INFO] Firmware: 2025.01.15');
          addLog('received', '[INFO] Free memory: 128KB');
        } else if (cmd === 'reset') {
          addLog('received', '[SYSTEM] Resetting...');
          setTimeout(() => addLog('received', '[SYSTEM] Boot OK, ready'), 800);
        } else {
          addLog('received', `[UNKNOWN] Command '${cmd}' not recognized`);
        }
      }, 300 + Math.random() * 400);
      return;
    }

    // 真实串口发送
    if (!portRef.current || status !== 'connected') {
      toast.error('请先连接硬件或开启模拟模式');
      return;
    }
    try {
      if (!writerRef.current) {
        writerRef.current = portRef.current.writable.getWriter();
      }
      const encoder = new TextEncoder();
      await writerRef.current.write(encoder.encode(cmd + '\n'));
    } catch (err) {
      addLog('system', `发送失败: ${String(err)}`);
      toast.error('数据发送失败');
    }
  };

  const sendPreset = (cmd: string) => {
    setInput(cmd);
    // 直接发送
    setTimeout(() => {
      const fakeEvent = { preventDefault: () => {} } as any;
      sendData(fakeEvent);
    }, 0);
  };

  const clearLogs = () => {
    setLogs([
      { id: logIdRef.current++, type: 'system', content: '日志已清空', time: formatTime() },
    ]);
  };

  // 组件卸载时清理
  useEffect(() => {
    return () => {
      if (simIntervalRef.current) clearInterval(simIntervalRef.current);
      keepReadingRef.current = false;
      if (portRef.current) {
        portRef.current.close().catch(() => {});
      }
    };
  }, []);

  const statusConfig: Record<ConnectionStatus, { label: string; color: string; icon: any }> = {
    disconnected: { label: '未连接', color: 'text-slate-400 bg-slate-500/10 border-slate-500/20', icon: WifiOff },
    connecting: { label: '连接中...', color: 'text-amber-600 bg-amber-500/10 border-amber-500/20', icon: RefreshCw },
    connected: { label: '已连接', color: 'text-emerald-600 bg-emerald-500/10 border-emerald-500/20', icon: CheckCircle2 },
    error: { label: '连接失败', color: 'text-rose-600 bg-rose-500/10 border-rose-500/20', icon: AlertCircle },
  };

  const currentStatus = statusConfig[status];
  const StatusIcon = currentStatus.icon;

  return (
    <div className="space-y-5">
      {/* 顶部状态栏 */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Badge
            variant="outline"
            className={`text-sm px-3 py-1 border ${currentStatus.color}`}
          >
            <StatusIcon className="size-3.5 mr-1" />
            {simMode ? '模拟模式' : currentStatus.label}
          </Badge>
          {status === 'connected' && portInfo.name && (
            <Badge variant="outline" className="text-xs">
              <Usb className="size-3 mr-1" />
              {portInfo.name}
            </Badge>
          )}
          {portInfo.vendorId !== undefined && portInfo.vendorId > 0 && !simMode && (
            <span className="text-xs text-muted-foreground font-mono">
              VID:0x{portInfo.vendorId.toString(16).toUpperCase().padStart(4, '0')}
              {portInfo.productId
                ? ` PID:0x${portInfo.productId.toString(16).toUpperCase().padStart(4, '0')}`
                : ''}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <Switch id="sim-mode" checked={simMode} onCheckedChange={toggleSimMode} />
            <Label htmlFor="sim-mode" className="text-sm cursor-pointer">
              模拟硬件
            </Label>
          </div>
          <Button
            variant={status === 'connected' ? 'destructive' : 'default'}
            size="sm"
            onClick={status === 'connected' ? disconnectSerial : connectSerial}
            disabled={status === 'connecting' || (status !== 'connected' && simMode)}
            className="gap-1.5"
          >
            {status === 'connected' ? (
              <>
                <WifiOff className="size-4" />
                断开
              </>
            ) : status === 'connecting' ? (
              <>
                <RefreshCw className="size-4 animate-spin" />
                连接中
              </>
            ) : (
              <>
                <Usb className="size-4" />
                连接硬件
              </>
            )}
          </Button>
        </div>
      </div>

      {/* 不支持 Web Serial 时的提示 */}
      {!webSerialSupported && !simMode && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
          <AlertCircle className="size-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <div className="text-sm font-medium text-amber-700 dark:text-amber-400">
              当前浏览器不支持 Web Serial API
            </div>
            <p className="text-xs text-amber-600/80 dark:text-amber-300/80 mt-1">
              请使用 Chrome / Edge / Opera 等基于 Chromium 的浏览器体验硬件直连功能。
              你也可以开启「模拟硬件」开关，在没有真实硬件的情况下体验完整流程。
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-4">
        {/* 主终端区 */}
        <div className="space-y-3">
          {/* 终端窗口 */}
          <div className="rounded-xl border border-slate-800 bg-slate-950 overflow-hidden shadow-lg">
            {/* 终端标题栏 */}
            <div className="flex items-center justify-between px-3 py-2 bg-slate-900/80 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="size-3 rounded-full bg-rose-500/80" />
                  <div className="size-3 rounded-full bg-amber-500/80" />
                  <div className="size-3 rounded-full bg-emerald-500/80" />
                </div>
                <span className="text-xs text-slate-400 ml-2 font-mono">serial-console</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex rounded-md border border-slate-700 overflow-hidden">
                  <button
                    onClick={() => setDisplayMode('text')}
                    className={`px-2 py-0.5 text-[10px] font-mono transition-colors ${
                      displayMode === 'text'
                        ? 'bg-primary/20 text-primary'
                        : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    TEXT
                  </button>
                  <button
                    onClick={() => setDisplayMode('hex')}
                    className={`px-2 py-0.5 text-[10px] font-mono border-l border-slate-700 transition-colors ${
                      displayMode === 'hex'
                        ? 'bg-primary/20 text-primary'
                        : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    HEX
                  </button>
                </div>
                <button
                  onClick={clearLogs}
                  className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                  title="清空日志"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </div>

            {/* 日志区 */}
            <div
              ref={logEndRef}
              className="h-[280px] overflow-y-auto p-3 font-mono text-xs space-y-1 font-mono"
            >
              {logs.map((log) => (
                <div
                  key={log.id}
                  className={`flex gap-2 ${
                    log.type === 'sent'
                      ? 'text-sky-400'
                      : log.type === 'received'
                        ? 'text-emerald-400'
                        : 'text-slate-500 italic'
                  }`}
                >
                  <span className="text-slate-600 shrink-0">[{log.time}]</span>
                  <span className="shrink-0 w-10">
                    {log.type === 'sent' ? '→ TX' : log.type === 'received' ? '← RX' : '● SYS'}
                  </span>
                  <span className="break-all">
                    {displayMode === 'hex' && log.type === 'received'
                      ? Array.from(log.content)
                          .map((c) => c.charCodeAt(0).toString(16).padStart(2, '0').toUpperCase())
                          .join(' ')
                      : log.content}
                  </span>
                </div>
              ))}
            </div>

            {/* 输入区 */}
            <form
              onSubmit={sendData}
              className="flex items-center gap-2 p-3 border-t border-slate-800 bg-slate-900/50"
            >
              <span className="text-emerald-500 font-mono text-sm">$</span>
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="输入指令..."
                className="font-mono text-sm bg-slate-900 border-slate-700 text-emerald-300 placeholder:text-slate-600 focus-visible:ring-primary/30 h-8"
                disabled={status !== 'connected'}
              />
              <Button type="submit" size="sm" disabled={!input.trim() || status !== 'connected'}>
                <Send className="size-3.5" />
              </Button>
            </form>
          </div>

          {/* 预设指令 */}
          <div>
            <div className="text-xs text-muted-foreground mb-2 flex items-center gap-1.5">
              <Lightbulb className="size-3" />
              快捷指令
            </div>
            <div className="flex flex-wrap gap-1.5">
              {PRESET_COMMANDS.map((preset) => (
                <button
                  key={preset.cmd}
                  onClick={() => sendPreset(preset.cmd)}
                  disabled={status !== 'connected'}
                  className="text-xs px-2.5 py-1.5 rounded-md bg-muted hover:bg-accent hover:text-accent-foreground transition-colors text-muted-foreground border border-border/50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 右侧：支持的硬件 + 连接提示 */}
        <div className="space-y-4">
          {/* 实时数据卡片 */}
          {status === 'connected' && (
            <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20">
              <div className="text-xs font-medium text-emerald-700 dark:text-emerald-400 mb-3 flex items-center gap-1.5">
                <Zap className="size-3.5" />
                实时数据概览
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="text-center">
                  <Thermometer className="size-4 mx-auto text-orange-500 mb-1" />
                  <div className="text-lg font-bold tabular-nums text-foreground">26.4°</div>
                  <div className="text-[10px] text-muted-foreground">温度</div>
                </div>
                <div className="text-center">
                  <Droplets className="size-4 mx-auto text-sky-500 mb-1" />
                  <div className="text-lg font-bold tabular-nums text-foreground">58%</div>
                  <div className="text-[10px] text-muted-foreground">湿度</div>
                </div>
                <div className="text-center">
                  <Sun className="size-4 mx-auto text-amber-500 mb-1" />
                  <div className="text-lg font-bold tabular-nums text-foreground">512</div>
                  <div className="text-[10px] text-muted-foreground">光照</div>
                </div>
              </div>
              <p className="text-[10px] text-muted-foreground mt-2 text-center">
                {simMode ? '模拟数据 · 每 2 秒刷新' : '真实串口数据'}
              </p>
            </div>
          )}

          {/* 支持的硬件 */}
          <div className="p-4 rounded-xl border border-border/50 bg-card">
            <div className="text-xs font-medium text-foreground mb-3 flex items-center gap-1.5">
              <Cpu className="size-3.5 text-primary" />
              支持直连的硬件
            </div>
            <div className="space-y-2">
              {SUPPORTED_DEVICES.map((d, i) => {
                const Icon = d.icon;
                return (
                  <div key={i} className="flex items-center gap-2.5 py-1">
                    <div className="size-7 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                      <Icon className="size-3.5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-medium truncate">{d.name}</div>
                      <div className="text-[10px] text-muted-foreground">
                        {d.vendor} · {d.baud} bps
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 连接提示 */}
          <div className="p-4 rounded-xl bg-muted/40 border border-border/50">
            <div className="text-xs font-medium text-foreground mb-2 flex items-center gap-1.5">
              <HelpCircle className="size-3.5 text-muted-foreground" />
              连接提示
            </div>
            <ul className="text-[11px] text-muted-foreground space-y-1.5 leading-relaxed">
              <li>· 使用 USB 数据线连接硬件设备到电脑</li>
              <li>· 确认设备已开机，驱动安装正常</li>
              <li>· 默认波特率 115200（Arduino 用 9600）</li>
              <li>· 点击「连接硬件」选择对应串口</li>
              <li>· 没有硬件？打开「模拟硬件」体验完整功能</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

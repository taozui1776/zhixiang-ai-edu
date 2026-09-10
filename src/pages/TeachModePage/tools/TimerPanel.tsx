import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Pause, RotateCcw, Minimize2, Timer, Clock3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

interface TimerPanelProps {
  open: boolean;
  onClose: () => void;
  minimized: boolean;
  onToggleMinimize: () => void;
}

const PRESETS = [1, 3, 5, 10];

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

// Web Audio API 提示音
function playBeep() {
  try {
    const AudioCtx = (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext);
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.setValueAtTime(660, ctx.currentTime + 0.15);
    osc.frequency.setValueAtTime(880, ctx.currentTime + 0.3);
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.05);
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.55);
  } catch {
    /* ignore */
  }
}

export default function TimerPanel({ open, onClose, minimized, onToggleMinimize }: TimerPanelProps) {
  const [mode, setMode] = useState<'countdown' | 'stopwatch'>('countdown');
  const [duration, setDuration] = useState(5 * 60); // 倒计时总时长（秒）
  const [remaining, setRemaining] = useState(5 * 60);
  const [elapsed, setElapsed] = useState(0); // 秒表计时
  const [running, setRunning] = useState(false);
  const [inputMin, setInputMin] = useState('5');
  const [flash, setFlash] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const endTimeRef = useRef(0);
  const startTimeRef = useRef(0);

  const startCountdown = useCallback(() => {
    if (remaining <= 0) return;
    endTimeRef.current = Date.now() + remaining * 1000;
    setRunning(true);
  }, [remaining]);

  const startStopwatch = useCallback(() => {
    startTimeRef.current = Date.now() - elapsed * 1000;
    setRunning(true);
  }, [elapsed]);

  const stop = useCallback(() => {
    setRunning(false);
  }, []);

  const reset = useCallback(() => {
    setRunning(false);
    if (mode === 'countdown') {
      setRemaining(duration);
    } else {
      setElapsed(0);
    }
    setFlash(false);
  }, [mode, duration]);

  useEffect(() => {
    if (!running) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      if (mode === 'countdown') {
        const left = Math.max(0, Math.round((endTimeRef.current - Date.now()) / 1000));
        setRemaining(left);
        if (left === 0) {
          setRunning(false);
          setFlash(true);
          playBeep();
          setTimeout(() => setFlash(false), 3000);
        }
      } else {
        setElapsed(Math.round((Date.now() - startTimeRef.current) / 1000));
      }
    }, 100);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running, mode]);

  const handleSetMinutes = (min: number) => {
    setDuration(min * 60);
    setRemaining(min * 60);
    setInputMin(String(min));
    setRunning(false);
    setFlash(false);
  };

  const handleInputChange = (val: string) => {
    setInputMin(val);
    const n = parseInt(val, 10);
    if (!isNaN(n) && n >= 0 && n <= 120) {
      setDuration(n * 60);
      setRemaining(n * 60);
      setRunning(false);
    }
  };

  const currentDisplay = mode === 'countdown' ? remaining : elapsed;
  const isEnded = mode === 'countdown' && remaining === 0 && !running;

  // 最小化浮窗
  if (minimized && open) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`fixed top-20 right-6 z-50 rounded-2xl px-4 py-3 shadow-xl border ${
          flash ? 'bg-red-500 border-red-400 animate-pulse' : 'bg-slate-900/90 border-white/15 backdrop-blur-md'
        }`}
        onClick={onToggleMinimize}
      >
        <div className="flex items-center gap-3 cursor-pointer">
          {mode === 'countdown' ? (
            <Timer className={`size-5 ${isEnded ? 'text-red-200' : 'text-primary'}`} />
          ) : (
            <Clock3 className="size-5 text-primary" />
          )}
          <span className={`font-mono text-2xl font-bold tabular-nums ${isEnded ? 'text-white' : 'text-white'}`}>
            {formatTime(currentDisplay)}
          </span>
        </div>
      </motion.div>
    );
  }

  return (
    <AnimatePresence>
      {open && !minimized && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="fixed top-20 right-6 z-50 w-72 bg-slate-900/95 backdrop-blur-md border border-white/15 rounded-2xl shadow-2xl overflow-hidden"
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
            <div className="text-sm font-semibold text-white">课堂计时器</div>
            <div className="flex items-center gap-1">
              <button
                onClick={onToggleMinimize}
                className="size-7 rounded-md flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10"
                title="最小化"
              >
                <Minimize2 className="size-4" />
              </button>
              <button
                onClick={onClose}
                className="size-7 rounded-md flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10"
                title="关闭"
              >
                <X className="size-4" />
              </button>
            </div>
          </div>

          <Tabs defaultValue="countdown" onValueChange={(v) => setMode(v as 'countdown' | 'stopwatch')}>
            <TabsList className="w-full bg-white/5 p-1 m-0 rounded-none border-b border-white/10">
              <TabsTrigger value="countdown" className="flex-1 text-xs">倒计时</TabsTrigger>
              <TabsTrigger value="stopwatch" className="flex-1 text-xs">正计时</TabsTrigger>
            </TabsList>

            <TabsContent value="countdown" className="p-4 space-y-4">
              {/* 时间显示 */}
              <div className={`text-center py-4 ${isEnded ? 'animate-pulse' : ''}`}>
                <div className={`font-mono text-5xl font-bold tabular-nums ${isEnded ? 'text-red-400' : 'text-white'}`}>
                  {formatTime(remaining)}
                </div>
                {isEnded && (
                  <div className="text-xs text-red-400 mt-2">时间到！</div>
                )}
              </div>

              {/* 快捷预设 */}
              <div>
                <div className="text-xs text-white/50 mb-2">快捷时长</div>
                <div className="grid grid-cols-4 gap-2">
                  {PRESETS.map((m) => (
                    <button
                      key={m}
                      onClick={() => handleSetMinutes(m)}
                      className={`py-1.5 text-xs rounded-lg border transition-colors ${
                        duration === m * 60
                          ? 'bg-primary text-white border-primary'
                          : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      {m} 分钟
                    </button>
                  ))}
                </div>
              </div>

              {/* 自定义分钟 */}
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={inputMin}
                  onChange={(e) => handleInputChange(e.target.value)}
                  min={0}
                  max={120}
                  className="h-9 text-sm bg-white/5 border-white/15 text-white placeholder:text-white/30"
                />
                <span className="text-xs text-white/50">分钟</span>
              </div>

              {/* 控制按钮 */}
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={reset}
                  className="flex-1"
                >
                  <RotateCcw className="size-4 mr-1" />
                  重置
                </Button>
                <Button
                  size="sm"
                  onClick={running ? stop : startCountdown}
                  className="flex-1"
                >
                  {running ? <Pause className="size-4 mr-1" /> : <Play className="size-4 mr-1" />}
                  {running ? '暂停' : '开始'}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="stopwatch" className="p-4 space-y-4">
              <div className="text-center py-4">
                <div className="font-mono text-5xl font-bold tabular-nums text-white">
                  {formatTime(elapsed)}
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={reset}
                  className="flex-1"
                >
                  <RotateCcw className="size-4 mr-1" />
                  重置
                </Button>
                <Button
                  size="sm"
                  onClick={running ? stop : startStopwatch}
                  className="flex-1"
                >
                  {running ? <Pause className="size-4 mr-1" /> : <Play className="size-4 mr-1" />}
                  {running ? '暂停' : '开始'}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

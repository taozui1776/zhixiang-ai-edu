import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Users, Shuffle, RotateCcw, Plus, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { getStudentList, saveStudentList } from '../tools';

interface RandomPickerProps {
  open: boolean;
  onClose: () => void;
}

export default function RandomPicker({ open, onClose }: RandomPickerProps) {
  const [namesText, setNamesText] = useState('');
  const [noRepeat, setNoRepeat] = useState(true);
  const [picked, setPicked] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [rolling, setRolling] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const rollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // 初始化：从 storage 读取名单
  useEffect(() => {
    if (open) {
      const list = getStudentList();
      if (list.length > 0) {
        setNamesText(list.join('\n'));
      }
      setPicked(null);
      setHistory([]);
    }
  }, [open]);

  const names = useMemo(() => {
    return namesText
      .split(/[\n,，、]/)
      .map((s) => s.trim())
      .filter(Boolean);
  }, [namesText]);

  const availableNames = useMemo(() => {
    if (!noRepeat) return names;
    return names.filter((n) => !history.includes(n));
  }, [names, history, noRepeat]);

  const handleStartStop = useCallback(() => {
    if (rolling) {
      // 停止
      if (rollIntervalRef.current) clearInterval(rollIntervalRef.current);
      rollIntervalRef.current = null;
      setRolling(false);
      if (availableNames.length > 0) {
        const finalName = availableNames[Math.floor(Math.random() * availableNames.length)];
        setDisplayName(finalName);
        setPicked(finalName);
        setHistory((prev) => [...prev, finalName]);
      }
      return;
    }
    if (availableNames.length === 0) return;
    setRolling(true);
    setPicked(null);
    rollIntervalRef.current = setInterval(() => {
      const idx = Math.floor(Math.random() * availableNames.length);
      setDisplayName(availableNames[idx]);
    }, 60);
  }, [rolling, availableNames]);

  const handleReset = useCallback(() => {
    setHistory([]);
    setPicked(null);
    setDisplayName('');
    if (rollIntervalRef.current) clearInterval(rollIntervalRef.current);
    setRolling(false);
  }, []);

  // 保存名单
  const handleSaveNames = () => {
    saveStudentList(names);
  };

  useEffect(() => {
    return () => {
      if (rollIntervalRef.current) clearInterval(rollIntervalRef.current);
    };
  }, []);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="fixed top-20 right-6 z-50 w-80 bg-slate-900/95 backdrop-blur-md border border-white/15 rounded-2xl shadow-2xl overflow-hidden"
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
            <div className="text-sm font-semibold text-white">随机点名</div>
            <button
              onClick={onClose}
              className="size-7 rounded-md flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10"
            >
              <X className="size-4" />
            </button>
          </div>

          <Tabs defaultValue="picker">
            <TabsList className="w-full bg-white/5 p-1 m-0 rounded-none border-b border-white/10">
              <TabsTrigger value="picker" className="flex-1 text-xs">
                <Shuffle className="size-3.5 mr-1" />
                点名
              </TabsTrigger>
              <TabsTrigger value="names" className="flex-1 text-xs">
                <Users className="size-3.5 mr-1" />
                名单
              </TabsTrigger>
              <TabsTrigger value="history" className="flex-1 text-xs">
                <History className="size-3.5 mr-1" />
                记录
              </TabsTrigger>
            </TabsList>

            {/* 点名 Tab */}
            <TabsContent value="picker" className="p-4 space-y-4">
              {/* 显示区 */}
              <div className="h-32 flex items-center justify-center bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-xl border border-white/10">
                {displayName ? (
                  <motion.div
                    key={displayName + (rolling ? 'r' : 's')}
                    initial={{ scale: 0.8, opacity: 0.5 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={`text-4xl font-bold ${picked ? 'text-white' : 'text-white/80'}`}
                  >
                    {displayName}
                  </motion.div>
                ) : (
                  <div className="text-white/40 text-sm">
                    {names.length === 0 ? '请先添加学生名单' : '点击开始点名'}
                  </div>
                )}
              </div>

              {picked && (
                <div className="flex items-center justify-center gap-2">
                  <Badge variant="outline" className="border-green-500/40 text-green-400 bg-green-500/10">
                    已选中
                  </Badge>
                </div>
              )}

              {/* 不重复开关 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Switch id="no-repeat" checked={noRepeat} onCheckedChange={setNoRepeat} />
                  <Label htmlFor="no-repeat" className="text-xs text-white/70 cursor-pointer">
                    不重复点名
                  </Label>
                </div>
                <span className="text-xs text-white/40">
                  剩余 {availableNames.length} / {names.length} 人
                </span>
              </div>

              {/* 按钮 */}
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleReset}
                  className="flex-1"
                  disabled={rolling}
                >
                  <RotateCcw className="size-4 mr-1" />
                  重置
                </Button>
                <Button
                  size="sm"
                  onClick={handleStartStop}
                  className="flex-1"
                  disabled={availableNames.length === 0}
                >
                  <Shuffle className="size-4 mr-1" />
                  {rolling ? '停止' : '开始点名'}
                </Button>
              </div>
            </TabsContent>

            {/* 名单 Tab */}
            <TabsContent value="names" className="p-4 space-y-3">
              <Textarea
                value={namesText}
                onChange={(e) => setNamesText(e.target.value)}
                placeholder="输入学生姓名，支持换行、逗号、顿号分隔"
                rows={8}
                className="text-sm bg-white/5 border-white/15 text-white placeholder:text-white/30 resize-none"
              />
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/50">共 {names.length} 人</span>
                <Button size="sm" onClick={handleSaveNames}>
                  <Plus className="size-4 mr-1" />
                  保存名单
                </Button>
              </div>
            </TabsContent>

            {/* 记录 Tab */}
            <TabsContent value="history" className="p-4">
              {history.length === 0 ? (
                <div className="py-8 text-center text-white/40 text-sm">
                  暂无点名记录
                </div>
              ) : (
                <div className="space-y-1 max-h-56 overflow-y-auto">
                  {history.map((n, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/5 text-sm text-white/80"
                    >
                      <span className="flex items-center gap-2">
                        <span className="text-xs text-white/40 w-5">{i + 1}.</span>
                        {n}
                      </span>
                      {i === history.length - 1 && (
                        <Badge className="text-[10px] h-4">最新</Badge>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

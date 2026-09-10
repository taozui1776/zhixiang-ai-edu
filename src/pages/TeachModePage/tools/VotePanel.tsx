import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BarChart3, RotateCcw, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface VotePanelProps {
  open: boolean;
  onClose: () => void;
}

interface VoteOption {
  id: string;
  text: string;
  votes: number;
}

const DEFAULT_OPTIONS: VoteOption[] = [
  { id: 'A', text: '选项 A', votes: 0 },
  { id: 'B', text: '选项 B', votes: 0 },
  { id: 'C', text: '选项 C', votes: 0 },
  { id: 'D', text: '选项 D', votes: 0 },
];

export default function VotePanel({ open, onClose }: VotePanelProps) {
  const [question, setQuestion] = useState('本节课你最感兴趣的内容是？');
  const [options, setOptions] = useState<VoteOption[]>(DEFAULT_OPTIONS);
  const [editing, setEditing] = useState(true);
  const [showBars, setShowBars] = useState(true);
  const [anonymous, setAnonymous] = useState(true);

  const totalVotes = options.reduce((sum, o) => sum + o.votes, 0);
  const maxVotes = Math.max(...options.map((o) => o.votes), 1);

  const handleVote = useCallback((id: string) => {
    setOptions((prev) =>
      prev.map((o) => (o.id === id ? { ...o, votes: o.votes + 1 } : o)),
    );
  }, []);

  const handleReset = useCallback(() => {
    setOptions((prev) => prev.map((o) => ({ ...o, votes: 0 })));
  }, []);

  const updateOption = (id: string, text: string) => {
    setOptions((prev) => prev.map((o) => (o.id === id ? { ...o, text } : o)));
  };

  const removeOption = (id: string) => {
    if (options.length <= 2) return;
    setOptions((prev) => prev.filter((o) => o.id !== id));
  };

  const addOption = () => {
    if (options.length >= 6) return;
    const nextLetter = String.fromCharCode(65 + options.length);
    setOptions((prev) => [...prev, { id: nextLetter, text: `选项 ${nextLetter}`, votes: 0 }]);
  };

  const COLORS = [
    'from-blue-500 to-indigo-500',
    'from-emerald-500 to-teal-500',
    'from-amber-500 to-orange-500',
    'from-pink-500 to-rose-500',
    'from-purple-500 to-violet-500',
    'from-cyan-500 to-sky-500',
  ];

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
            <div className="flex items-center gap-2">
              <BarChart3 className="size-4 text-primary" />
              <span className="text-sm font-semibold text-white">课堂投票</span>
            </div>
            <button
              onClick={onClose}
              className="size-7 rounded-md flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10"
            >
              <X className="size-4" />
            </button>
          </div>

          <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
            {/* 题目 */}
            {editing ? (
              <div className="space-y-2">
                <Label className="text-xs text-white/50">投票题目</Label>
                <Input
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="h-9 text-sm bg-white/5 border-white/15 text-white placeholder:text-white/30"
                />
              </div>
            ) : (
              <div className="text-sm font-medium text-white">{question}</div>
            )}

            {/* 选项列表 */}
            <div className="space-y-2">
              {editing ? (
                <>
                  {options.map((opt, i) => (
                    <div key={opt.id} className="flex items-center gap-2">
                      <div className={`size-6 shrink-0 rounded-md bg-gradient-to-br ${COLORS[i % COLORS.length]} flex items-center justify-center text-xs font-bold text-white`}>
                        {opt.id}
                      </div>
                      <Input
                        value={opt.text}
                        onChange={(e) => updateOption(opt.id, e.target.value)}
                        className="h-8 text-sm bg-white/5 border-white/15 text-white"
                      />
                      <button
                        onClick={() => removeOption(opt.id)}
                        disabled={options.length <= 2}
                        className="size-7 shrink-0 rounded-md flex items-center justify-center text-white/40 hover:text-red-400 disabled:opacity-30"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  ))}
                  {options.length < 6 && (
                    <button
                      onClick={addOption}
                      className="w-full py-1.5 text-xs text-white/60 hover:text-white border border-dashed border-white/20 rounded-lg hover:border-white/40 transition-colors"
                    >
                      <Plus className="size-3.5 inline mr-1" />
                      添加选项
                    </button>
                  )}
                </>
              ) : (
                <>
                  {options.map((opt, i) => {
                    const pct = totalVotes > 0 ? (opt.votes / totalVotes) * 100 : 0;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => handleVote(opt.id)}
                        className="w-full text-left relative overflow-hidden rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors p-2.5"
                      >
                        {showBars && (
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.3 }}
                            className={`absolute inset-y-0 left-0 bg-gradient-to-r ${COLORS[i % COLORS.length]} opacity-25`}
                          />
                        )}
                        <div className="relative flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`size-5 rounded bg-gradient-to-br ${COLORS[i % COLORS.length]} flex items-center justify-center text-[10px] font-bold text-white`}>
                              {opt.id}
                            </div>
                            <span className="text-sm text-white/90">{opt.text}</span>
                          </div>
                          <div className="text-sm font-mono tabular-nums text-white/70">
                            {opt.votes} 票
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </>
              )}
            </div>

            {/* 统计信息 */}
            {!editing && (
              <div className="flex items-center justify-between text-xs text-white/50">
                <span>共 {totalVotes} 票</span>
                <div className="flex items-center gap-1.5">
                  <Switch
                    id="show-bars"
                    checked={showBars}
                    onCheckedChange={setShowBars}
                    className="scale-75"
                  />
                  <Label htmlFor="show-bars" className="text-xs text-white/50 cursor-pointer">
                    显示条形
                  </Label>
                </div>
              </div>
            )}

            {/* 控制按钮 */}
            <div className="flex gap-2 pt-2 border-t border-white/10">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleReset}
                className="flex-1"
                disabled={totalVotes === 0}
              >
                <RotateCcw className="size-3.5 mr-1" />
                重置
              </Button>
              <Button
                size="sm"
                onClick={() => setEditing(!editing)}
                className="flex-1"
              >
                {editing ? '开始投票' : '编辑题目'}
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

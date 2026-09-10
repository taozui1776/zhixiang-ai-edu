import { X, Keyboard, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

interface ShortcutsHelpProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SHORTCUTS = [
  { keys: ['?'], label: '显示 / 隐藏快捷键帮助' },
  { keys: ['←', '→'], label: '上一页 / 下一页' },
  { keys: ['Space'], label: '下一页' },
  { keys: ['Home', 'End'], label: '跳到第一页 / 最后一页' },
  { keys: ['A'], label: '切换批注模式' },
  { keys: ['T'], label: '显示 / 隐藏计时器' },
  { keys: ['R'], label: '随机点名' },
  { keys: ['S'], label: '聚光灯模式' },
  { keys: ['V'], label: 'AI 全屏回答' },
  { keys: ['Esc'], label: '退出全屏 / 关闭面板' },
  { keys: ['F'], label: '全屏切换' },
  { keys: ['+', '-'], label: '字体放大 / 缩小' },
  { keys: ['C'], label: '切换高对比度模式' },
];

export default function ShortcutsHelp({ open, onOpenChange }: ShortcutsHelpProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col p-0">
        <DialogHeader className="px-6 py-4 border-b border-border/50">
          <div className="flex items-center gap-2">
            <Keyboard className="size-5 text-primary" />
            <DialogTitle className="text-lg">键盘快捷键</DialogTitle>
          </div>
          <DialogDescription className="text-sm">
            授课模式下可使用以下快捷键，提升课堂操作效率
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
          {SHORTCUTS.map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between py-2 border-b border-border/40 last:border-b-0"
            >
              <span className="text-sm text-foreground/80">{item.label}</span>
              <div className="flex items-center gap-1">
                {item.keys.map((key, i) => (
                  <span key={i} className="flex items-center gap-1">
                    {i > 0 && <span className="text-muted-foreground text-xs">/</span>}
                    <kbd className="px-2 py-0.5 text-xs font-mono bg-muted border border-border/60 rounded shadow-sm">
                      {key}
                    </kbd>
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <DialogFooter className="px-6 py-3 border-t border-border/50">
          <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
            知道了
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// 首次进入引导（3步）
interface OnboardingGuideProps {
  step: number;
  totalSteps: number;
  title: string;
  description: string;
  onNext: () => void;
  onSkip: () => void;
  onPrev?: () => void;
}

export function OnboardingGuide({
  step,
  totalSteps,
  title,
  description,
  onNext,
  onSkip,
  onPrev,
}: OnboardingGuideProps) {
  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md">
      <div className="bg-card border border-border/60 rounded-2xl shadow-2xl p-5 relative">
        <button
          onClick={onSkip}
          className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"
          aria-label="跳过引导"
        >
          <X className="size-4" />
        </button>

        <div className="mb-3 flex items-center gap-1.5">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full flex-1 ${
                i <= step ? 'bg-primary' : 'bg-muted'
              }`}
            />
          ))}
        </div>

        <h3 className="text-base font-bold mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{description}</p>

        <div className="flex items-center justify-between">
          <button
            onClick={onSkip}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            跳过引导
          </button>
          <div className="flex gap-2">
            {onPrev && step > 0 && (
              <Button variant="ghost" size="sm" onClick={onPrev}>
                上一步
              </Button>
            )}
            <Button size="sm" onClick={onNext} className="gap-1">
              {step === totalSteps - 1 ? '开始上课' : '下一步'}
              <ChevronRight className="size-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

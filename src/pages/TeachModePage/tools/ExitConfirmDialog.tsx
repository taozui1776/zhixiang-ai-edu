import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Save, X, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ExitConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onSaveAndExit: () => void;
  onDiscardAndExit: () => void;
  hasUnsavedAnnotation: boolean;
  timerRunning: boolean;
}

export default function ExitConfirmDialog({
  open,
  onClose,
  onSaveAndExit,
  onDiscardAndExit,
  hasUnsavedAnnotation,
  timerRunning,
}: ExitConfirmDialogProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-md mx-4 bg-slate-900 border border-white/15 rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 pb-4">
              <div className="flex items-start gap-3">
                <div className="size-11 rounded-xl bg-amber-500/20 flex items-center justify-center shrink-0">
                  <AlertTriangle className="size-6 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">确认退出授课模式？</h3>
                  <p className="text-sm text-white/60 mt-1">
                    您有未保存的课堂内容，退出后可能丢失。
                  </p>
                </div>
              </div>
            </div>

            {/* 待处理项 */}
            <div className="px-6 pb-4 space-y-2">
              {hasUnsavedAnnotation && (
                <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white/5 border border-white/10">
                  <div className="size-2 rounded-full bg-amber-400 shrink-0" />
                  <span className="text-sm text-white/80">未保存的黑板批注</span>
                </div>
              )}
              {timerRunning && (
                <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white/5 border border-white/10">
                  <div className="size-2 rounded-full bg-blue-400 shrink-0 animate-pulse" />
                  <span className="text-sm text-white/80">计时器正在运行</span>
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="px-6 pb-6 space-y-2">
              <Button
                onClick={onSaveAndExit}
                className="w-full h-11"
              >
                <Save className="size-4 mr-2" />
                保存批注并退出
              </Button>
              <Button
                variant="secondary"
                onClick={onDiscardAndExit}
                className="w-full h-10 bg-white/5 border-white/15 text-white/70 hover:bg-white/10 hover:text-white"
              >
                <X className="size-4 mr-2" />
                丢弃并退出
              </Button>
              <Button
                variant="ghost"
                onClick={onClose}
                className="w-full h-10 text-white/50 hover:text-white hover:bg-white/5"
              >
                <ArrowLeft className="size-4 mr-2" />
                继续授课
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

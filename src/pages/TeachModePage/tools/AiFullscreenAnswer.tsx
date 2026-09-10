import { motion, AnimatePresence } from 'framer-motion';
import { X, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface AiFullscreenAnswerProps {
  open: boolean;
  onClose: () => void;
  content: string;
  question?: string;
}

export default function AiFullscreenAnswer({ open, onClose, content, question }: AiFullscreenAnswerProps) {
  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950"
      >
        {/* 顶部栏 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/20 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-xl bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center">
              <Maximize2 className="size-4 text-white" />
            </div>
            <div>
              <div className="text-sm font-semibold text-white">AI 解答 · 全屏展示</div>
              <div className="text-xs text-white/50">面向全班学生展示</div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-white/70 hover:text-white hover:bg-white/10"
          >
            <X className="size-5" />
          </Button>
        </div>

        {/* 内容区 */}
        <div className="flex-1 overflow-y-auto p-8 md:p-16">
          <div className="max-w-4xl mx-auto">
            {question && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm"
              >
                <div className="text-xs text-white/40 mb-2">问题</div>
                <div className="text-xl md:text-2xl font-semibold text-white">{question}</div>
              </motion.div>
            )}

            {content && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="prose prose-lg prose-invert max-w-none"
              >
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
              </motion.div>
            )}

            {!content && (
              <div className="py-20 text-center text-white/40">
                AI 正在思考中…
              </div>
            )}
          </div>
        </div>

        {/* 底部提示 */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-xs text-white/40 bg-black/40 backdrop-blur px-4 py-2 rounded-full">
          按 Esc 或点击右上角关闭全屏展示
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

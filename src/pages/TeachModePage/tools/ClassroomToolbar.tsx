import { motion, AnimatePresence } from 'framer-motion';
import {
  Pencil,
  Timer,
  Users,
  Lightbulb,
  BarChart3,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';

interface ClassroomToolbarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  onAnnotation: () => void;
  annotationActive: boolean;
  onTimer: () => void;
  timerOpen: boolean;
  onPicker: () => void;
  pickerOpen: boolean;
  onSpotlight: () => void;
  spotlightActive: boolean;
  onVote: () => void;
  voteOpen: boolean;
  isMobile?: boolean;
}

const TOOL_BTNS = [
  { id: 'annotation', label: '批注', icon: Pencil, shortcut: 'B' },
  { id: 'timer', label: '计时', icon: Timer, shortcut: 'T' },
  { id: 'picker', label: '点名', icon: Users, shortcut: 'R' },
  { id: 'spotlight', label: '聚光', icon: Lightbulb, shortcut: 'S' },
  { id: 'vote', label: '投票', icon: BarChart3, shortcut: 'V' },
] as const;

type ToolId = typeof TOOL_BTNS[number]['id'];

export default function ClassroomToolbar({
  collapsed,
  onToggleCollapse,
  onAnnotation,
  annotationActive,
  onTimer,
  timerOpen,
  onPicker,
  pickerOpen,
  onSpotlight,
  spotlightActive,
  onVote,
  voteOpen,
  isMobile,
}: ClassroomToolbarProps) {
  const handlers: Record<ToolId, () => void> = {
    annotation: onAnnotation,
    timer: onTimer,
    picker: onPicker,
    spotlight: onSpotlight,
    vote: onVote,
  };

  const activeStates: Record<ToolId, boolean> = {
    annotation: annotationActive,
    timer: timerOpen,
    picker: pickerOpen,
    spotlight: spotlightActive,
    vote: voteOpen,
  };

  // 移动端底部浮动栏
  if (isMobile) {
    return (
      <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-40">
        <div className="bg-slate-900/90 backdrop-blur-md border border-white/15 rounded-full px-1.5 py-1.5 flex items-center gap-0.5 shadow-xl">
          {TOOL_BTNS.map((tool) => {
            const Icon = tool.icon;
            const active = activeStates[tool.id];
            return (
              <button
                key={tool.id}
                onClick={handlers[tool.id]}
                className={`size-11 rounded-full flex flex-col items-center justify-center transition-all ${
                  active
                    ? 'bg-primary text-white shadow-lg shadow-primary/30'
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                }`}
                title={tool.label}
              >
                <Icon className="size-5" />
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // 桌面端左侧浮动工具栏（可收起）
  return (
    <AnimatePresence mode="wait">
      {!collapsed ? (
        <motion.div
          key="expanded"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="fixed left-4 top-1/2 -translate-y-1/2 z-40"
        >
          <div className="bg-slate-900/90 backdrop-blur-md border border-white/15 rounded-2xl p-1.5 flex flex-col gap-1 shadow-xl">
            {TOOL_BTNS.map((tool) => {
              const Icon = tool.icon;
              const active = activeStates[tool.id];
              return (
                <button
                  key={tool.id}
                  onClick={handlers[tool.id]}
                  className={`group relative w-12 h-12 rounded-xl flex flex-col items-center justify-center transition-all ${
                    active
                      ? 'bg-primary text-white shadow-lg shadow-primary/30'
                      : 'text-white/60 hover:text-white hover:bg-white/10'
                  }`}
                  title={`${tool.label} (${tool.shortcut})`}
                >
                  <Icon className="size-5" />
                  <span className="text-[9px] mt-0.5">{tool.label}</span>

                  {/* 悬浮提示 */}
                  <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap bg-slate-800 text-white text-xs px-2 py-1 rounded-md border border-white/10">
                    {tool.label}
                    <span className="text-white/40 ml-1">{tool.shortcut}</span>
                  </div>
                </button>
              );
            })}

            <div className="w-full h-px bg-white/10 my-1" />

            {/* 收起按钮 */}
            <button
              onClick={onToggleCollapse}
              className="w-12 h-9 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10"
              title="收起工具栏"
            >
              <ChevronUp className="size-4 -rotate-90" />
            </button>
          </div>
        </motion.div>
      ) : (
        <motion.button
          key="collapsed"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          onClick={onToggleCollapse}
          className="fixed left-3 top-1/2 -translate-y-1/2 z-40 size-10 bg-slate-900/90 backdrop-blur-md border border-white/15 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-slate-800 shadow-xl transition-all"
          title="展开工具栏"
        >
          <ChevronDown className="size-4 rotate-90" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  X,
  Send,
  Bot,
  Loader2,
  BrainCircuit,
  Code2,
  MessageSquare,
  HelpCircle,
  ChevronLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { streamChat, hasAiApiKey } from '@/lib/ai-client';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface AIAssistantFloatProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

type SceneMode = 'home' | 'concept' | 'code' | 'qa' | 'page-context';

interface SceneConfig {
  id: SceneMode;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle: string;
  color: string;
  placeholder: string;
}

const SCENES: SceneConfig[] = [
  {
    id: 'concept',
    icon: BrainCircuit,
    title: 'AI概念讲解',
    subtitle: '用K12学生能懂的方式讲清楚',
    color: 'from-violet-500 to-purple-600',
    placeholder: '输入一个AI概念，如：神经网络、大模型、机器学习…',
  },
  {
    id: 'code',
    icon: Code2,
    title: '代码助手',
    subtitle: 'MicroPython代码+接线+调试',
    color: 'from-blue-500 to-cyan-600',
    placeholder: '描述你的代码需求，如：行空板读取温湿度并显示',
  },
  {
    id: 'qa',
    icon: MessageSquare,
    title: '通识问答',
    subtitle: 'AI领域自由提问',
    color: 'from-indigo-500 to-purple-600',
    placeholder: '问问AI的任何问题：历史、原理、应用、伦理…',
  },
  {
    id: 'page-context',
    icon: HelpCircle,
    title: '问当前页面',
    subtitle: '结合当前页面上下文解答',
    color: 'from-pink-500 to-rose-500',
    placeholder: '结合当前页面内容提问…',
  },
];

export default function AIAssistantFloat({ open, onOpenChange }: AIAssistantFloatProps) {
  const navigate = useNavigate();
  const [mode, setMode] = useState<SceneMode>('home');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 打开时重置为首页
  useEffect(() => {
    if (open) {
      setMode('home');
    }
  }, [open]);

  function getPrompt(question: string): string {
    switch (mode) {
      case 'concept':
        return `你是一位擅长用通俗语言讲解AI概念的老师。请用K12学生能听懂的方式解释"${question}"这个AI概念。
请包含：1)一句话简单定义 2)生活中的类比 3)课堂举例 4)趣味小知识 5)引导思考问题。
语言生动有趣，避免堆砌专业术语。`;
      case 'code':
        return `你是一位MicroPython编程教学专家。请根据以下需求，为行空板/掌控板等常见AI教育硬件生成MicroPython代码和指导：
需求：${question}
请输出：1)功能说明 2)完整带注释的代码 3)关键代码解释 4)接线说明 5)调试建议。
代码要规范，注释详细，适合教学使用。`;
      case 'qa':
        return `你是一位专业的人工智能通识教育老师。请用适合K12学生的语言回答以下问题，生动有趣，鼓励好奇心：
问题：${question}`;
      case 'page-context':
        return `你是一位AI通识课教学助手。用户正在浏览当前页面，请结合AI通识教育的上下文回答以下问题：
问题：${question}
回答要贴合教学场景，实用有针对性。`;
      default:
        return question;
    }
  }

  async function handleSend(text?: string) {
    const question = text ?? input.trim();
    if (!question || isLoading) return;

    if (!hasAiApiKey()) {
      toast.warning('请先配置 AI API Key');
      onOpenChange(false);
      navigate('/profile?tab=ai');
      return;
    }

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: question,
    };
    const assistantMsg: Message = {
      id: `ai-${Date.now()}`,
      role: 'assistant',
      content: '',
    };

    setMessages((prev) => [...prev, userMsg, assistantMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const systemPrompt = getPrompt(question);
      await streamChat({
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages.slice(-6).map((m) => ({ role: m.role, content: m.content })),
          { role: 'user', content: question },
        ],
        onChunk: (text) => {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantMsg.id ? { ...m, content: m.content + text } : m,
            ),
          );
        },
      });
    } catch (e) {
      const msg = e instanceof Error ? e.message : '';
      if (msg === 'AI_API_KEY_MISSING') {
        toast.warning('请先配置 AI API Key');
      } else {
        toast.error('AI 助手暂不可用');
      }
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMsg.id
            ? { ...m, content: '抱歉，AI 助手暂时无法响应，请检查 API 设置后重试。' }
            : m,
        ),
      );
    } finally {
      setIsLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function enterScene(sceneId: SceneMode) {
    setMode(sceneId);
    setMessages([]);
  }

  const currentScene = SCENES.find((s) => s.id === mode);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[9998]"
            onClick={() => onOpenChange(false)}
          />

          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed right-6 bottom-6 w-[380px] max-w-[calc(100vw-3rem)] h-[560px] max-h-[calc(100vh-6rem)] bg-card rounded-2xl shadow-2xl border border-border/60 flex flex-col z-[9999] overflow-hidden"
          >
            {/* 头部 */}
            <div className="px-5 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex items-center gap-3 shrink-0">
              {mode !== 'home' && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-white/80 hover:text-white hover:bg-white/20 shrink-0 -ml-1"
                  onClick={() => setMode('home')}
                >
                  <ChevronLeft className="size-4" />
                </Button>
              )}
              <div className="size-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm shrink-0">
                <Sparkles className="size-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-base truncate">
                  {mode === 'home' ? '智象 AI 助手' : currentScene?.title}
                </h3>
                <p className="text-xs text-white/70 truncate">
                  {mode === 'home' ? '你的AI通识课教学好帮手' : currentScene?.subtitle}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white/80 hover:text-white hover:bg-white/20 shrink-0"
                onClick={() => onOpenChange(false)}
              >
                <X className="size-4" />
              </Button>
            </div>

            {/* 内容区 */}
            {mode === 'home' ? (
              /* 首页：4个快捷场景 */
              <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-background to-card">
                <p className="text-xs text-muted-foreground mb-3 px-1">选择一个场景快速开始</p>
                <div className="space-y-2.5">
                  {SCENES.map((scene) => {
                    const SIcon = scene.icon;
                    return (
                      <motion.button
                        key={scene.id}
                        whileHover={{ x: 4 }}
                        onClick={() => enterScene(scene.id)}
                        className="w-full flex items-center gap-3 p-3.5 rounded-xl bg-card border border-border/60 hover:border-primary/30 hover:shadow-sm transition-all text-left group"
                      >
                        <div
                          className={`size-11 shrink-0 rounded-xl bg-gradient-to-br ${scene.color} flex items-center justify-center text-white shadow-sm group-hover:scale-110 transition-transform`}
                        >
                          <SIcon className="size-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-foreground">{scene.title}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{scene.subtitle}</p>
                        </div>
                        <Badge
                          variant="outline"
                          className="text-[10px] border-primary/20 text-primary/70 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          开始
                        </Badge>
                      </motion.button>
                    );
                  })}
                </div>

                <div className="mt-6 p-3 rounded-xl bg-primary/5 border border-primary/10">
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    💡 提示：AI助手专注于AI通识教育领域，支持备课、上课、答疑等多种教学场景。
                  </p>
                </div>
              </div>
            ) : (
              /* 对话界面 */
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-background to-card">
              {/* 未配置 API Key 提示 */}
              {!hasAiApiKey() && messages.length === 0 && (
                <div className="mb-3 p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-700">
                  <p className="font-medium mb-1">请先配置 API Key</p>
                  <p className="text-[11px] opacity-80 mb-2">AI助手需要您自己的API Key才能使用</p>
                  <button
                    onClick={() => { onOpenChange(false); navigate('/profile?tab=ai'); }}
                    className="text-amber-700 font-medium underline underline-offset-2"
                  >
                    去个人中心配置
                  </button>
                </div>
              )}
              {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center">
                      <Bot className="size-10 mb-2 opacity-30" />
                      <p className="text-sm text-muted-foreground">{currentScene?.subtitle}</p>
                    </div>
                  ) : (
                    messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                      >
                        <div
                          className={`size-7 shrink-0 rounded-full flex items-center justify-center ${
                            msg.role === 'user'
                              ? 'bg-primary text-primary-foreground'
                              : `bg-gradient-to-br ${currentScene?.color || 'from-indigo-500 to-purple-500'} text-white`
                          }`}
                        >
                          {msg.role === 'user' ? (
                            <span className="text-[10px] font-bold">我</span>
                          ) : (
                            <Bot className="size-4" />
                          )}
                        </div>
                        <div
                          className={cn(
                            'max-w-[78%] rounded-2xl px-3 py-2 text-sm leading-relaxed',
                            msg.role === 'user'
                              ? 'bg-primary text-primary-foreground rounded-tr-sm'
                              : 'bg-card border border-border/60 text-foreground rounded-tl-sm shadow-sm',
                          )}
                        >
                          <div className="whitespace-pre-line">
                            {msg.content}
                            {msg.id === messages[messages.length - 1]?.id &&
                              isLoading &&
                              msg.role === 'assistant' && (
                                <span className="inline-block w-1.5 h-4 ml-0.5 bg-primary/60 animate-pulse align-middle" />
                              )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* 输入区 */}
                <div className="p-3 border-t border-border/60 shrink-0 bg-card">
                  <div className="relative">
                    <Textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder={currentScene?.placeholder}
                      className="min-h-[56px] max-h-[120px] resize-none pr-12 text-sm"
                      disabled={isLoading}
                    />
                    <Button
                      size="icon"
                      className="absolute right-2 bottom-2 h-8 w-8 bg-gradient-to-r from-indigo-600 to-purple-600"
                      onClick={() => handleSend()}
                      disabled={!input.trim() || isLoading}
                    >
                      {isLoading ? (
                        <Loader2 className="size-3.5 animate-spin" />
                      ) : (
                        <Send className="size-3.5" />
                      )}
                    </Button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Send,
  Sparkles,
  BookOpen,
  Lightbulb,
  Code2,
  FileText,
  Presentation,
  ListChecks,
  Image as ImageIcon,
  Search,
  BrainCircuit,
  RefreshCw,
  Copy,
  ThumbsUp,
  ThumbsDown,
  BookMarked,
  Zap,
  BarChart3,
  Bot,
  User,
  Loader2,
  ChevronRight,
  GraduationCap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { streamChat } from '@/lib/ai-client';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Image from '@/components/ui/image';

const PLUGIN_ID = 'ai_edu_multi_scene_text_generate_1';

// AI助手小象头像
const ELEPHANT_AVATAR =
  'https://aka.doubaocdn.com/s/RUYRoCZ6Ts';

// 场景分类
const SCENE_CATEGORIES = [
  {
    id: 'innovation',
    label: '教学创新',
    icon: BookOpen,
    color: 'from-blue-500 to-indigo-500',
    scenes: [
      { id: 'lesson-plan', label: '生成教案', desc: '大单元教学设计', icon: FileText },
      { id: 'ppt-outline', label: '生成课件PPT', desc: '课件大纲与结构', icon: Presentation },
      { id: 'exercises', label: '生成习题', desc: '智能出题含答案', icon: ListChecks },
      { id: 'exam-paper', label: '生成试卷', desc: '完整试卷与解析', icon: BookMarked },
    ],
  },
  {
    id: 'inspiration',
    label: '教学灵感',
    icon: Lightbulb,
    color: 'from-amber-500 to-orange-500',
    scenes: [
      { id: 'ai-image', label: '智能生图', desc: '教学配图生成', icon: ImageIcon },
      { id: 'knowledge', label: '知识点讲解', desc: '深入浅出讲概念', icon: BrainCircuit },
      { id: 'resources', label: '查找教学资源', desc: '资源推荐与整理', icon: Search },
      { id: 'hook', label: '课堂导入语', desc: '精彩开场设计', icon: Zap },
    ],
  },
  {
    id: 'optimize',
    label: '教学优化',
    icon: Sparkles,
    color: 'from-emerald-500 to-teal-500',
    scenes: [
      { id: 'key-points', label: '智能剖析重难点', desc: '重点难点深度解析', icon: BrainCircuit },
      { id: 'reflection', label: '教学反思生成', desc: '课后反思模板', icon: RefreshCw },
      { id: 'upload-course', label: '课程上传', desc: '拖拽文件智能分析', icon: FileText },
    ],
  },
  {
    id: 'coding',
    label: '编程专家',
    icon: Code2,
    color: 'from-violet-500 to-purple-500',
    scenes: [
      { id: 'code-help', label: '代码编程助手', desc: 'Python/C++/Java', icon: Code2 },
      { id: 'code-explain', label: '代码解释', desc: '逐行讲解代码逻辑', icon: BookOpen },
      { id: 'micropython', label: 'MicroPython代码', desc: '掌控板/行空板', icon: Zap },
    ],
  },
  {
    id: 'general',
    label: 'AI通识问答',
    icon: BrainCircuit,
    color: 'from-sky-500 to-cyan-500',
    scenes: [
      { id: 'ai-concept', label: 'AI概念问答', desc: '什么是AI/大模型', icon: BrainCircuit },
      { id: 'ai-history', label: 'AI发展史', desc: '人工智能的故事', icon: BookOpen },
      { id: 'ai-ethics', label: 'AI伦理讨论', desc: '隐私与社会责任', icon: Lightbulb },
      { id: 'free-chat', label: '自由问答', desc: '想到什么问什么', icon: Sparkles },
    ],
  },
];

interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
  scene?: string;
  loading?: boolean;
}

export default function AiAssistantPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'scenes'>('scenes');
  const [activeCategory, setActiveCategory] = useState<string>('innovation');
  const [selectedScene, setSelectedScene] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [deepThinking, setDeepThinking] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'ai',
      content: '你好！我是智象AI助手 🐘\n\n我可以帮你生成教案、课件、习题，讲解知识点，写代码，解答AI相关问题。\n\n选择下方场景模板快速开始，或直接输入问题自由对话～',
    },
  ]);

  // 场景表单状态
  const [formData, setFormData] = useState<Record<string, string>>({});
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  // 调用AI生成
  const generateContent = async (
    contentType: string,
    subject: string,
    topic: string,
    additional = '',
  ) => {
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: topic,
      scene: contentType,
    };
    const aiMsg: Message = {
      id: `ai-${Date.now()}`,
      role: 'ai',
      content: '',
      loading: true,
    };
    setMessages((prev) => [...prev, userMsg, aiMsg]);
    setActiveTab('chat');

    try {
      const prompt = `你是一位AI通识教育专家。请生成以下内容：
类型：${contentType}
学科/学段：${subject}
主题：${topic}
${additional ? '附加要求：' + additional : ''}

请用适合中小学教师使用的格式输出，结构清晰，可直接用于课堂教学。`;

      let full = '';
      await streamChat({
        messages: [{ role: 'user', content: prompt }],
        onChunk: (piece) => {
          if (piece) {
            full += piece;
            setMessages((prev) =>
              prev.map((m) =>
                m.id === aiMsg.id ? { ...m, content: full, loading: false } : m,
              ),
            );
          }
        },
      });
    } catch (err) {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === aiMsg.id
            ? { ...m, content: '抱歉，AI工具暂不可用，请先在个人中心配置API Key。', loading: false }
            : m,
        ),
      );
      toast.error('AI 生成失败，请检查API Key配置');
    }
  };

  // 自由对话提交
  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    generateContent('自由对话', 'AI通识', input, deepThinking ? '请深度思考后回答' : '');
    setInput('');
  };

  // 场景表单提交
  const handleSceneSubmit = () => {
    const topic = formData.topic || '';
    const stage = formData.stage || '小学高段';
    const additional = formData.additional || '';
    if (!topic.trim()) {
      toast.warning('请输入主题内容');
      return;
    }

    const sceneMap: Record<string, { type: string; subject: string; fullTopic: string }> = {
      'lesson-plan': { type: '教案', subject: `${stage}AI通识`, fullTopic: `${topic} 教案设计（大单元教学）` },
      'ppt-outline': { type: '课件大纲', subject: `${stage}AI通识`, fullTopic: `${topic} PPT课件大纲` },
      'exercises': { type: '习题', subject: `${stage}AI通识`, fullTopic: `${topic} 练习题` },
      'exam-paper': { type: '习题', subject: `${stage}AI通识`, fullTopic: `${topic} 测试试卷` },
      'knowledge': { type: '知识点讲解', subject: `${stage}AI通识`, fullTopic: `${topic} 知识点讲解` },
      'hook': { type: '教案', subject: `${stage}AI通识`, fullTopic: `${topic} 课堂导入语设计` },
      'key-points': { type: '知识点讲解', subject: `${stage}AI通识`, fullTopic: `${topic} 重难点深度剖析` },
      'reflection': { type: '知识点讲解', subject: `${stage}AI通识`, fullTopic: `${topic} 教学反思` },
      'code-help': { type: '代码助手', subject: '编程', fullTopic: `${topic} 代码实现` },
      'code-explain': { type: '代码助手', subject: '编程', fullTopic: `解释以下代码：${topic}` },
      'micropython': { type: '代码助手', subject: 'MicroPython', fullTopic: `MicroPython：${topic}` },
      'resources': { type: '知识点讲解', subject: '教育资源', fullTopic: `查找关于${topic}的教学资源` },
      'ai-image': { type: '知识点讲解', subject: '创意设计', fullTopic: `描述${topic}的图片生成prompt` },
      'upload-course': { type: '知识点讲解', subject: '课程分析', fullTopic: `分析课程内容：${topic}` },
    };

    const cfg = sceneMap[selectedScene || ''];
    if (cfg) {
      generateContent(cfg.type, cfg.subject, cfg.fullTopic, additional);
    }
    setSelectedScene(null);
    setFormData({});
  };

  const copyContent = (content: string) => {
    navigator.clipboard.writeText(content).then(() => {
      toast.success('已复制到剪贴板');
    });
  };

  const currentCategory = SCENE_CATEGORIES.find((c) => c.id === activeCategory);

  // 场景对应的表单字段
  const getSceneFormFields = (sceneId: string) => {
    const commonFields = [
      { key: 'stage', label: '适用学段', type: 'select', options: ['小学低段', '小学高段', '初中', '高中'] },
      { key: 'topic', label: '主题/课题', type: 'textarea', placeholder: '请输入课题或知识点，如：机器学习与模型训练' },
      { key: 'additional', label: '补充要求（选填）', type: 'textarea', placeholder: '如：难度适中、包含互动环节等' },
    ];

    if (['code-help', 'code-explain', 'micropython'].includes(sceneId)) {
      return [
        { key: 'topic', label: sceneId === 'code-explain' ? '待解释代码' : '功能需求', type: 'textarea', placeholder: sceneId === 'code-explain' ? '粘贴需要解释的代码...' : '描述你要实现的功能...' },
        { key: 'additional', label: '补充要求（选填）', type: 'textarea', placeholder: '如：Python版本、注释详细等' },
      ];
    }

    if (sceneId === 'ai-image') {
      return [
        { key: 'topic', label: '图片描述', type: 'textarea', placeholder: '描述你想要生成的图片内容...' },
        { key: 'additional', label: '风格要求（选填）', type: 'textarea', placeholder: '如：卡通风格、科技感、蓝紫色调等' },
      ];
    }

    if (sceneId === 'upload-course') {
      return [
        { key: 'topic', label: '课程分析需求', type: 'textarea', placeholder: '描述要分析的课程内容或上传文件...' },
      ];
    }

    return commonFields;
  };

  const selectedSceneInfo = (() => {
    for (const cat of SCENE_CATEGORIES) {
      const s = cat.scenes.find((sc) => sc.id === selectedScene);
      if (s) return { ...s, categoryLabel: cat.label };
    }
    return null;
  })();

  return (
    <>
      {/* 浮窗按钮 */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-[60] size-14 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-blue-600 shadow-lg shadow-purple-500/30 flex items-center justify-center text-white group overflow-hidden"
            aria-label="打开AI助手"
          >
            {/* 背景光晕动画 */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent animate-pulse" />
            {/* 小象动画 */}
            <span className="text-3xl relative z-10 animate-bounce" style={{ animationDuration: '2s' }}>
              🐘
            </span>
            <span className="absolute -top-1 -right-1 size-3 bg-emerald-500 rounded-full border-2 border-white animate-pulse" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* 侧边面板 */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* 遮罩 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[70] md:hidden"
              onClick={() => setIsOpen(false)}
            />
            {/* 面板 */}
            <motion.div
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full sm:w-[440px] md:w-[480px] bg-white shadow-2xl z-[80] flex flex-col"
            >
              {/* 头部 */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-700 text-white">
                <div className="flex items-center gap-3">
                  <div className="size-9 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
                    <span className="text-2xl">🐘</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">智象AI助手</h3>
                    <p className="text-[11px] text-white/70">你的AI教学伙伴</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8 text-white/80 hover:text-white hover:bg-white/20"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="size-4" />
                </Button>
              </div>

              {/* Tabs切换 */}
              <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'chat' | 'scenes')} className="flex-1 flex flex-col">
                <div className="px-3 pt-2 border-b border-border/60">
                  <TabsList className="w-full h-9 bg-muted/50">
                    <TabsTrigger value="scenes" className="flex-1 h-8 text-xs">
                      <Sparkles className="size-3.5 mr-1" />
                      场景模板
                    </TabsTrigger>
                    <TabsTrigger value="chat" className="flex-1 h-8 text-xs">
                      <Bot className="size-3.5 mr-1" />
                      自由对话
                    </TabsTrigger>
                  </TabsList>
                </div>

                {/* 场景模板Tab */}
                <TabsContent value="scenes" className="flex-1 overflow-hidden flex flex-col mt-0 p-0">
                  {/* 分类列表 */}
                  <ScrollArea className="flex-1">
                    <div className="p-3 space-y-4">
                      {SCENE_CATEGORIES.map((cat) => {
                        const Icon = cat.icon;
                        return (
                          <div key={cat.id}>
                            <button
                              onClick={() =>
                                setActiveCategory(activeCategory === cat.id ? '' : cat.id)
                              }
                              className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50 transition-colors text-left"
                            >
                              <div
                                className={`size-8 rounded-lg bg-gradient-to-br ${cat.color} flex items-center justify-center text-white shrink-0`}
                              >
                                <Icon className="size-4" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-foreground">{cat.label}</p>
                                <p className="text-[11px] text-muted-foreground">
                                  {cat.scenes.length}个场景
                                </p>
                              </div>
                              <ChevronRight
                                className={`size-4 text-muted-foreground transition-transform ${
                                  activeCategory === cat.id ? 'rotate-90' : ''
                                }`}
                              />
                            </button>

                            {activeCategory === cat.id && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="grid grid-cols-2 gap-2 mt-2 pl-10"
                              >
                                {cat.scenes.map((scene) => {
                                  const SceneIcon = scene.icon;
                                  return (
                                    <button
                                      key={scene.id}
                                      onClick={() => {
                                        setSelectedScene(scene.id);
                                        setActiveTab('chat');
                                      }}
                                      className={`text-left p-3 rounded-lg border transition-all border-border/60 hover:border-primary/40 hover:bg-primary/5`}
                                    >
                                      <SceneIcon className="size-4 text-primary mb-1.5" />
                                      <p className="text-xs font-medium text-foreground mb-0.5">
                                        {scene.label}
                                      </p>
                                      <p className="text-[10px] text-muted-foreground line-clamp-1">
                                        {scene.desc}
                                      </p>
                                    </button>
                                  );
                                })}
                              </motion.div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </ScrollArea>
                </TabsContent>

                {/* 对话Tab */}
                <TabsContent value="chat" className="flex-1 overflow-hidden flex flex-col mt-0 p-0">
                  <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-3 bg-slate-50/50">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                      >
                        <div className="size-7 rounded-full shrink-0 overflow-hidden flex items-center justify-center">
                          {msg.role === 'ai' ? (
                            <Image
                              src={ELEPHANT_AVATAR}
                              alt="AI"
                              className="size-7 object-contain"
                            />
                          ) : (
                            <div className="size-7 rounded-full bg-primary flex items-center justify-center text-white">
                              <User className="size-3.5" />
                            </div>
                          )}
                        </div>
                        <div
                          className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
                            msg.role === 'user'
                              ? 'bg-primary text-white rounded-tr-md'
                              : 'bg-white border border-border/60 text-foreground rounded-tl-md'
                          }`}
                        >
                          {msg.scene && msg.role === 'user' && (
                            <Badge variant="outline" className="text-[10px] mb-1 bg-white/20 text-white border-white/30">
                              {msg.scene}
                            </Badge>
                          )}
                          {msg.loading && !msg.content ? (
                            <div className="flex items-center gap-1.5 text-muted-foreground py-1">
                              <Loader2 className="size-3.5 animate-spin" />
                              <span className="text-xs">AI思考中…</span>
                            </div>
                          ) : (
                            <div
                              className={`prose prose-sm max-w-none ${
                                msg.role === 'user' ? 'prose-invert' : 'dark:prose-invert'
                              }`}
                            >
                              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {msg.content}
                              </ReactMarkdown>
                            </div>
                          )}
                          {msg.role === 'ai' && !msg.loading && msg.content && (
                            <div className="flex items-center gap-1 mt-2 pt-2 border-t border-border/40">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="size-6 hover:bg-muted"
                                onClick={() => copyContent(msg.content)}
                              >
                                <Copy className="size-3 text-muted-foreground" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="size-6 hover:bg-muted"
                              >
                                <ThumbsUp className="size-3 text-muted-foreground" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="size-6 hover:bg-muted"
                              >
                                <ThumbsDown className="size-3 text-muted-foreground" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* 场景表单（选中场景时显示） */}
                  {selectedScene && selectedSceneInfo && (
                    <div className="border-t border-border/60 bg-white p-3">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <selectedSceneInfo.icon className="size-4 text-primary" />
                          <span className="text-sm font-medium">{selectedSceneInfo.label}</span>
                          <Badge variant="outline" className="text-[10px]">
                            {selectedSceneInfo.categoryLabel}
                          </Badge>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs h-7"
                          onClick={() => setSelectedScene(null)}
                        >
                          取消
                        </Button>
                      </div>
                      <div className="space-y-2.5">
                        {getSceneFormFields(selectedScene).map((field) => (
                          <div key={field.key}>
                            <Label className="text-xs font-medium mb-1 block">
                              {field.label}
                            </Label>
                            {field.type === 'select' ? (
                              <Select
                                value={formData[field.key] || ''}
                                onValueChange={(v) =>
                                  setFormData((prev) => ({ ...prev, [field.key]: v }))
                                }
                              >
                                <SelectTrigger className="h-9 text-sm">
                                  <SelectValue placeholder={`请选择${field.label}`} />
                                </SelectTrigger>
                                <SelectContent>
                                  {(field.options || []).map((opt) => (
                                    <SelectItem key={opt} value={opt}>
                                      {opt}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            ) : field.type === 'textarea' ? (
                              <Textarea
                                value={formData[field.key] || ''}
                                onChange={(e) =>
                                  setFormData((prev) => ({ ...prev, [field.key]: e.target.value }))
                                }
                                placeholder={field.placeholder}
                                className="h-20 text-sm resize-none"
                              />
                            ) : (
                              <Input
                                value={formData[field.key] || ''}
                                onChange={(e) =>
                                  setFormData((prev) => ({ ...prev, [field.key]: e.target.value }))
                                }
                                placeholder={field.placeholder}
                                className="h-9 text-sm"
                              />
                            )}
                          </div>
                        ))}
                        <Button
                          className="w-full h-9 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                          onClick={handleSceneSubmit}
                        >
                          <Sparkles className="size-3.5 mr-1.5" />
                          立即生成
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* 底部输入区 */}
                  {!selectedScene && (
                    <div className="border-t border-border/60 bg-white p-3">
                      <div className="flex items-center justify-between mb-2 px-1">
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={deepThinking}
                            onCheckedChange={setDeepThinking}
                          />
                          <span className="text-[11px] text-muted-foreground">深度思考</span>
                        </div>
                        <button
                          onClick={() => setActiveTab('scenes')}
                          className="text-[11px] text-primary hover:underline"
                        >
                          场景模板
                        </button>
                      </div>
                      <form onSubmit={handleChatSubmit} className="flex items-end gap-2">
                        <Textarea
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          placeholder="输入你的问题，或选择场景模板快速开始..."
                          className="flex-1 h-10 min-h-[40px] max-h-[120px] text-sm resize-none"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              handleChatSubmit(e);
                            }
                          }}
                        />
                        <Button
                          type="submit"
                          size="icon"
                          className="size-10 bg-gradient-to-br from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shrink-0"
                          disabled={!input.trim()}
                        >
                          <Send className="size-4" />
                        </Button>
                      </form>
                      <p className="text-[10px] text-muted-foreground text-center mt-2">
                        内容由AI生成，仅供参考 · 按 Enter 发送，Shift+Enter 换行
                      </p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

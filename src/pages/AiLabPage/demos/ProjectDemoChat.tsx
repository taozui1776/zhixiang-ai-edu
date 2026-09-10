import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';


interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const QUICK_QUESTIONS = [
  '什么是人工智能？',
  '机器学习和深度学习有什么区别？',
  '神经网络是怎么工作的？',
  'AI 会取代人类吗？',
];

// 简易 AI 回复知识库
const KNOWLEDGE_BASE: Record<string, string> = {
  '人工智能':
    '人工智能（Artificial Intelligence，简称 AI）是计算机科学的一个重要分支，研究如何让机器模拟、延伸和扩展人类的智能。它包括机器学习、深度学习、自然语言处理、计算机视觉等多个子领域。人工智能的目标是让计算机具备像人一样的感知、推理、学习和决策能力。',
  '机器学习':
    '机器学习（Machine Learning）是人工智能的核心技术。它不直接编写具体的规则，而是通过大量数据训练模型，让计算机自己从数据中发现规律。机器学习分为监督学习、无监督学习、强化学习等类型。常见的算法包括决策树、K-Means 聚类、支持向量机等。',
  '深度学习':
    '深度学习（Deep Learning）是机器学习的一个子领域，使用多层神经网络来学习数据的特征表示。它之所以叫"深度"，是因为神经网络有很多层（几十甚至上百层）。深度学习在图像识别、语音识别、自然语言处理等方面取得了突破性进展，AlphaGo、ChatGPT 都是基于深度学习的代表。',
  '神经网络':
    '神经网络（Neural Network）是模仿人脑神经元工作方式设计的计算模型。它由大量相互连接的"神经元"组成，每个神经元接收输入、进行加权求和、再通过激活函数输出。通过调整连接权重，神经网络可以学习复杂的模式。深度学习就是层数很多的神经网络。',
  'ai 会取代人类吗':
    'AI 不会完全取代人类，但会改变很多工作的方式。AI 擅长处理重复性、规律性、数据密集型的任务，而人类在创造力、情感、审美、复杂决策等方面仍然不可替代。未来的趋势是"人机协作"——AI 作为工具帮助人类提高效率，而不是完全取代。重要的是学会和 AI 一起工作。',
  '自然语言处理':
    '自然语言处理（NLP）是让计算机理解和生成人类语言的技术。它包括语音识别、机器翻译、情感分析、问答系统、文本生成等任务。近年来，大语言模型（LLM）的出现让 NLP 技术取得了巨大进步，ChatGPT、文心一言等都是 NLP 的应用。',
  '计算机视觉':
    '计算机视觉（CV）是让计算机"看懂"图像和视频的技术。它包括图像分类、目标检测、人脸识别、文字识别（OCR）、图像分割等任务。自动驾驶、手机人脸识别、医学影像分析都是计算机视觉的应用场景。',
  '图灵测试':
    '图灵测试（Turing Test）由数学家阿兰·图灵在 1950 年提出，用来判断机器是否具有智能。测试方法是：一个人与另一个房间里的机器和真人分别对话，如果人无法区分对方是机器还是真人，就认为这台机器通过了图灵测试。现在的大语言模型已经在很多场景下接近或通过了图灵测试。',
};

function generateReply(question: string): string {
  const q = question.toLowerCase().trim();

  // 关键词匹配
  for (const [key, answer] of Object.entries(KNOWLEDGE_BASE)) {
    if (q.includes(key.toLowerCase())) {
      return answer;
    }
  }

  // 默认回复
  const defaultAnswers = [
    `关于"${question}"这个问题，涉及到人工智能的多个方面。简单来说，AI 的核心是让机器模拟人类的智能行为，包括感知、学习、推理和决策。目前 AI 已经在图像识别、语音处理、自然语言理解等领域取得了很大进展。你想深入了解哪个具体方向呢？`,
    `这是一个很好的问题！${question}是 AI 领域的重要话题。在智象 AI 实验室里，你可以通过动手实验来亲身体验相关技术。我建议你从"入门级"项目开始，逐步深入理解背后的原理。`,
    `你提到的"${question}"很有意思。人工智能的发展离不开算法、数据和算力三大要素。算法是方法，数据是燃料，算力是基础。三者结合才能让 AI 真正"聪明"起来。`,
  ];

  return defaultAnswers[Math.floor(Math.random() * defaultAnswers.length)];
}

export default function ProjectDemoChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content:
        '你好！我是智象 AI 助手 🐘，可以回答你关于人工智能通识的问题。试试问我"什么是人工智能？"或点击下方的快捷问题吧！',
    },
  ]);
  const [input, setInput] = useState('');
  const [isReplying, setIsReplying] = useState(false);
  const [displayedReply, setDisplayedReply] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, displayedReply]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isReplying) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text.trim(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsReplying(true);
    setDisplayedReply('');

    try {
      const reply = generateReply(text.trim());

      // 打字机效果
      for (let i = 0; i < reply.length; i++) {
        await new Promise((r) => setTimeout(r, 15 + Math.random() * 20));
        setDisplayedReply(reply.slice(0, i + 1));
      }

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: reply,
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      console.error('Chat error:', String(error));
      toast.error('回复生成失败，请重试');
    } finally {
      setIsReplying(false);
      setDisplayedReply('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <div className="flex flex-col h-[520px] rounded-xl border border-border/60 bg-card overflow-hidden">
      {/* 头部 */}
      <div className="px-4 py-3 border-b border-border/60 bg-gradient-to-r from-primary/5 to-accent/10 flex items-center gap-3">
        <div className="size-9 rounded-full bg-gradient-to-br from-primary to-violet-500 flex items-center justify-center">
          <Bot className="size-5 text-white" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold">智象 AI 通识助手</p>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            在线 · 随时为你解答 AI 问题
          </p>
        </div>
        <Badge className="bg-emerald-500 border-0 text-xs">
          <Sparkles className="size-3 mr-1" />
          AI 驱动
        </Badge>
      </div>

      {/* 消息列表 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`size-7 rounded-full shrink-0 flex items-center justify-center ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-br from-blue-500 to-cyan-500'
                    : 'bg-gradient-to-br from-primary to-violet-500'
                }`}
              >
                {msg.role === 'user' ? (
                  <User className="size-3.5 text-white" />
                ) : (
                  <Bot className="size-3.5 text-white" />
                )}
              </div>
              <div
                className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-primary text-primary-foreground rounded-tr-sm'
                    : 'bg-muted/60 text-foreground rounded-tl-sm'
                }`}
              >
                {msg.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isReplying && displayedReply && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-2"
          >
            <div className="size-7 rounded-full shrink-0 flex items-center justify-center bg-gradient-to-br from-primary to-violet-500">
              <Bot className="size-3.5 text-white" />
            </div>
            <div className="max-w-[80%] px-3 py-2 rounded-2xl rounded-tl-sm text-sm leading-relaxed bg-muted/60 text-foreground">
              {displayedReply}
              <span className="inline-block w-1.5 h-4 ml-0.5 bg-primary/60 animate-pulse align-middle" />
            </div>
          </motion.div>
        )}

        {isReplying && !displayedReply && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-2"
          >
            <div className="size-7 rounded-full shrink-0 flex items-center justify-center bg-gradient-to-br from-primary to-violet-500">
              <Bot className="size-3.5 text-white" />
            </div>
            <div className="px-3 py-3 rounded-2xl rounded-tl-sm bg-muted/60 flex gap-1">
              <span className="size-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="size-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="size-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 快捷问题 */}
      {messages.length <= 1 && (
        <div className="px-4 pb-2 flex flex-wrap gap-2">
          {QUICK_QUESTIONS.map((q) => (
            <button
              key={q}
              onClick={() => sendMessage(q)}
              className="px-3 py-1.5 text-xs rounded-full bg-primary/5 text-primary hover:bg-primary/10 border border-primary/20 transition-colors"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* 输入框 */}
      <form onSubmit={handleSubmit} className="p-3 border-t border-border/60 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="输入你的 AI 问题…"
          className="flex-1 px-4 py-2 text-sm rounded-full bg-muted/50 border border-transparent focus:outline-none focus:border-primary/30 focus:bg-background transition-all"
        />
        <Button
          type="submit"
          size="icon"
          disabled={!input.trim() || isReplying}
          className="rounded-full shrink-0"
        >
          <Send className="size-4" />
        </Button>
      </form>
    </div>
  );
}

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Volume2, Sparkles, Lightbulb, GraduationCap, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';

type Stage = 'primary' | 'junior';
type Message = { role: 'user' | 'ai'; text: string; type?: 'speech' | 'text' };

// 通识问答知识库（关键词匹配 + 回答）
const KNOWLEDGE_BASE: { keywords: string[]; answer: string; title: string }[] = [
  {
    keywords: ['人工智能', 'AI', '什么是', '是什么'],
    title: '🤖 什么是人工智能？',
    answer: '人工智能（AI）就是让计算机像人一样"聪明"，能听、能看、能说、能思考、能做决定。它不是魔法，而是通过大量数据和算法训练出来的。比如你平时用的语音助手、推荐你看什么视频、还有能下棋的 AlphaGo，都是 AI 的应用。',
  },
  {
    keywords: ['机器学习', '训练', '模型', '学习'],
    title: '📚 什么是机器学习？',
    answer: '机器学习是人工智能的一种方法——就像小朋友学习一样，计算机通过"看"很多例子（数据），自己找出规律，然后就能对新的东西做出判断。比如给它看很多猫的照片，它就能学会认出猫。这个过程叫"训练"，训练好的"大脑"叫"模型"。',
  },
  {
    keywords: ['神经网络', '神经元', '大脑'],
    title: '🧠 什么是神经网络？',
    answer: '神经网络是一种模仿人类大脑工作方式的 AI 算法。我们的大脑有很多神经元互相连接，神经网络也有很多"人工神经元"分层连接。信息从一层传到下一层，每一层提取不同的特征，最后得出答案。越深的神经网络，能学习的东西就越复杂。',
  },
  {
    keywords: ['语音识别', '说话', '听懂', '声音'],
    title: '🎤 语音识别是怎么回事？',
    answer: '语音识别就是让计算机"听懂"人说的话。过程大概是这样的：首先，麦克风把声音变成电信号；然后 AI 从声音信号中提取"声纹特征"；接着把这些特征和语音模型对比，识别出一个个字和词；最后连成完整的句子。就像我们学说话，听多了自然就懂了。',
  },
  {
    keywords: ['图像识别', '图片', '看图', '识别'],
    title: '👁️ 图像识别怎么做到的？',
    answer: '图像识别就是让计算机"看懂"图片里有什么。计算机看图片，其实是看到很多数字（每个像素的颜色）。它会一层一层地提取特征——先找线条和边缘，再找形状和纹理，最后组合成具体的物体。比如识别猫：先找到轮廓，再发现有尖耳朵、胡须、圆眼睛，最后判断"这是一只猫"。',
  },
  {
    keywords: ['大数据', '数据', '信息'],
    title: '📊 大数据是什么？',
    answer: '大数据就是非常非常多的数据，多到传统方法处理不了。AI 需要大数据来"学习"——数据越多、质量越好，AI 学得越好、越准确。就像小朋友见识越广，懂的东西就越多。但是大数据也需要保护隐私，不能随便用别人的数据哦。',
  },
  {
    keywords: ['机器人', '机器人是什么', '智能机器人'],
    title: '🤖 机器人和 AI 是什么关系？',
    answer: '机器人是有身体的机器（比如有手有脚的机械），而 AI 是"大脑"。有 AI 的机器人就是"智能机器人"，它们不仅能动，还能感知环境、自己做决定。比如扫地机器人能感知障碍物并绕开，就是 AI 在帮忙。',
  },
  {
    keywords: ['算法', '程序', '代码'],
    title: '📐 什么是算法？',
    answer: '算法就是解决问题的步骤和方法，就像菜谱一样——按照步骤一步一步来，就能做出菜。不同的是，算法是给计算机看的。好的算法又快又准，不好的算法可能要算很久。AI 里面有很多种算法，每种擅长解决不同的问题。',
  },
  {
    keywords: ['伦理', '道德', '安全', '隐私'],
    title: '⚖️ AI 伦理是什么？',
    answer: 'AI 伦理就是讨论"人工智能应该怎样用才对"。比如：AI 可以用来帮医生看病，但不能用来骗人；AI 可以推荐视频，但不能让小朋友沉迷；AI 可以收集数据，但必须保护大家的隐私。学 AI 不仅要学技术，还要学怎么负责任地用 AI。',
  },
  {
    keywords: ['深度学习', '深度'],
    title: '🌊 什么是深度学习？',
    answer: '深度学习是机器学习的一种，它的神经网络有很多很多层（所以叫"深度"）。层数越多，能学习的东西越复杂。比如图像识别、语音识别、翻译这些复杂任务，深度学习都做得很好。它就像一个有很多层过滤网的加工厂，每层提取不同的特征。',
  },
];

// 简单的通识应答逻辑
function generateAnswer(question: string): { title: string; answer: string } {
  const q = question.toLowerCase();
  let bestMatch = KNOWLEDGE_BASE[0];
  let bestScore = 0;

  KNOWLEDGE_BASE.forEach((item) => {
    let score = 0;
    item.keywords.forEach((kw) => {
      if (q.includes(kw.toLowerCase())) score++;
    });
    if (score > bestScore) {
      bestScore = score;
      bestMatch = item;
    }
  });

  if (bestScore === 0) {
    // 通用回答
    return {
      title: '💡 小知识',
      answer: '你问的这个问题很棒！人工智能的世界里有很多有趣的知识。你可以试着问我："什么是人工智能？""机器学习怎么学东西？""语音识别原理是什么？"等等，我都可以回答你哦～',
    };
  }

  return { title: bestMatch.title, answer: bestMatch.answer };
}

// 检查浏览器是否支持语音识别
function hasSpeechRecognition(): boolean {
  return typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);
}

export default function SpeechAssistant() {
  const [stage, setStage] = useState<Stage>('primary');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', text: '你好！我是智象 AI 语音助手 🐘 按住下方话筒说一句话，试试问我关于 AI 的问题吧！' },
  ]);
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [transcript, setTranscript] = useState('');
  const [aiThinking, setAiThinking] = useState(false);
  const recognitionRef = useRef<any>(null);
  const isManualModeRef = useRef(false);

  useEffect(() => {
    setIsSupported(hasSpeechRecognition());
  }, []);

  // 初始化语音识别
  useEffect(() => {
    if (!isSupported) return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'zh-CN';
    recognition.interimResults = true;
    recognition.continuous = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      let interimTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }
      setTranscript(finalTranscript || interimTranscript);
    };

    recognition.onend = () => {
      if (!isManualModeRef.current) {
        handleRecognitionEnd();
      }
    };

    recognition.onerror = (event: any) => {
      setIsListening(false);
      isManualModeRef.current = false;
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        setMessages((prev) => [
          ...prev,
          { role: 'ai', text: '🙊 听不到你的声音哦，请在浏览器设置中允许麦克风权限，然后再试试吧！' },
        ]);
      }
    };

    recognitionRef.current = recognition;
  }, [isSupported]);

  const handleRecognitionEnd = () => {
    setIsListening(false);
    const text = transcript.trim();
    if (text) {
      submitQuestion(text);
    }
  };

  const startListening = () => {
    if (!recognitionRef.current || isListening) return;
    setTranscript('');
    setIsListening(true);
    isManualModeRef.current = false;
    try {
      recognitionRef.current.start();
    } catch (e) {
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (!recognitionRef.current) return;
    isManualModeRef.current = true;
    recognitionRef.current.stop();
    setTimeout(() => {
      setIsListening(false);
      const text = transcript.trim();
      if (text) {
        submitQuestion(text);
      }
    }, 300);
  };

  const submitQuestion = (text: string) => {
    // 添加用户消息
    setMessages((prev) => [...prev, { role: 'user', text, type: 'speech' }]);
    setAiThinking(true);
    setTranscript('');

    // 模拟 AI 思考
    setTimeout(() => {
      const { title, answer } = generateAnswer(text);
      setMessages((prev) => [
        ...prev,
        { role: 'ai', text: `${title}\n\n${answer}`, type: 'text' },
      ]);
      setAiThinking(false);
    }, 800 + Math.random() * 600);
  };

  const primaryTip = (
    <div className="space-y-2 text-sm">
      <p className="font-medium text-foreground">🧒 小学版：和 AI 说说话</p>
      <ul className="space-y-1 text-muted-foreground text-xs list-disc pl-4">
        <li>按住话筒按钮，对着麦克风说一句话</li>
        <li>松开后，看看 AI 有没有听懂你说的话</li>
        <li>AI 还会回答你的问题哦～</li>
        <li>试试看：问"什么是人工智能？"</li>
      </ul>
    </div>
  );

  const juniorTip = (
    <div className="space-y-2 text-sm">
      <p className="font-medium text-foreground">🔬 初中版：语音识别原理</p>
      <ul className="space-y-1 text-muted-foreground text-xs list-disc pl-4">
        <li><span className="font-medium">声音 → 数字信号</span>：麦克风把声波转换成电信号</li>
        <li><span className="font-medium">特征提取</span>：AI 从声音中提取"声纹"特征</li>
        <li><span className="font-medium">声学模型</span>：把声音特征对应到音素和音节</li>
        <li><span className="font-medium">语言模型</span>：结合语法和语义，连成通顺的话</li>
        <li><span className="font-medium">自然语言理解</span>：理解意思后给出回答</li>
      </ul>
    </div>
  );

  // 不支持语音识别的降级提示
  if (!isSupported) {
    return (
      <div className="space-y-4">
        <Card className="border-amber-500/30 bg-amber-500/5">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="size-12 rounded-xl bg-amber-500/15 flex items-center justify-center shrink-0">
                <AlertCircle className="size-6 text-amber-600" />
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-foreground">你的浏览器暂不支持语音识别</h3>
                <p className="text-sm text-muted-foreground">
                  这个实验需要浏览器的语音识别功能。建议使用 Chrome、Edge 等支持 Web Speech API 的浏览器来体验。
                  不过没关系，你仍然可以通过下面的输入框和 AI 对话，了解语音识别的原理。
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="text-xs text-muted-foreground text-center">
          💡 提示：在 Chrome 浏览器中打开本页面，即可获得完整的语音识别体验
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* 左侧：对话区 */}
      <div className="lg:col-span-2 space-y-4">
        {/* 对话区 */}
        <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
          <div className="p-4 border-b border-border/50 bg-muted/30 flex items-center gap-2">
            <Volume2 className="size-4 text-primary" />
            <span className="text-sm font-semibold">语音对话</span>
          </div>
          <div className="h-72 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-muted/10 to-transparent">
            <AnimatePresence initial={false}>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-line ${
                      msg.role === 'user'
                        ? 'bg-primary text-primary-foreground rounded-br-md'
                        : 'bg-muted text-foreground rounded-bl-md'
                    }`}
                  >
                    {msg.role === 'user' && msg.type === 'speech' && (
                      <span className="opacity-70 text-xs block mb-1">🎤 你说：</span>
                    )}
                    {msg.text}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {aiThinking && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-1.5">
                  <motion.div
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                    className="size-2 rounded-full bg-primary/60"
                  />
                  <motion.div
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                    className="size-2 rounded-full bg-primary/60"
                  />
                  <motion.div
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                    className="size-2 rounded-full bg-primary/60"
                  />
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* 实时转录 */}
        {isListening && transcript && (
          <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-3">
            <p className="text-xs text-emerald-700 font-medium mb-0.5">正在识别…</p>
            <p className="text-sm text-emerald-800">{transcript}</p>
          </div>
        )}

        {/* 话筒按钮 */}
        <div className="flex flex-col items-center gap-3 py-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onMouseDown={startListening}
            onMouseUp={stopListening}
            onMouseLeave={() => isListening && stopListening()}
            onTouchStart={(e) => { e.preventDefault(); startListening(); }}
            onTouchEnd={(e) => { e.preventDefault(); stopListening(); }}
            className={`relative size-20 rounded-full flex items-center justify-center text-white shadow-lg transition-all ${
              isListening
                ? 'bg-red-500 shadow-red-500/40'
                : 'bg-gradient-to-br from-emerald-500 to-teal-500 shadow-emerald-500/30'
            }`}
          >
            {isListening ? (
              <>
                <MicOff className="size-8" />
                <motion.div
                  animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.2, 0.5] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                  className="absolute inset-0 rounded-full border-4 border-red-400"
                />
              </>
            ) : (
              <Mic className="size-8" />
            )}
          </motion.button>
          <p className="text-sm text-muted-foreground">
            {isListening ? '正在聆听…松开发送' : '按住话筒说话'}
          </p>
        </div>

        {/* 快捷问题 */}
        <div>
          <p className="text-xs text-muted-foreground mb-2">试试问这些问题：</p>
          <div className="flex flex-wrap gap-2">
            {['什么是人工智能？', '机器学习怎么学东西？', '语音识别原理是什么？', '什么是神经网络？', '大数据和AI的关系'].map((q) => (
              <Badge
                key={q}
                variant="outline"
                className="cursor-pointer hover:bg-muted gap-1 bg-card/50"
                onClick={() => submitQuestion(q)}
              >
                <Sparkles className="size-3" />
                {q}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* 右侧：知识 + 流程 */}
      <div className="space-y-4">
        {/* 流程图 */}
        <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
          <div className="p-4 border-b border-border/50 bg-muted/30">
            <div className="text-sm font-semibold">语音识别流程</div>
          </div>
          <div className="p-4 space-y-3">
            {[
              { step: 1, title: '声音采集', desc: '麦克风把声波变成电信号', icon: '🎤' },
              { step: 2, title: '特征提取', desc: '从声音中提取声纹特征', icon: '📊' },
              { step: 3, title: '声学模型', desc: '声音特征 → 音素/音节', icon: '🔤' },
              { step: 4, title: '语言模型', desc: '拼成通顺的文字句子', icon: '📝' },
              { step: 5, title: '语言理解', desc: '理解意思并给出回答', icon: '🧠' },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-3"
              >
                <div className="size-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 text-white text-xs font-bold flex items-center justify-center shrink-0">
                  {item.icon}
                </div>
                <div>
                  <div className="text-sm font-medium text-foreground">{item.title}</div>
                  <div className="text-xs text-muted-foreground">{item.desc}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 学段切换 */}
        <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
          <Tabs value={stage} onValueChange={(v) => setStage(v as Stage)} className="w-full">
            <TabsList className="grid grid-cols-2 w-full h-9 rounded-none border-b border-border/50">
              <TabsTrigger value="primary" className="text-xs">小学</TabsTrigger>
              <TabsTrigger value="junior" className="text-xs">初中</TabsTrigger>
            </TabsList>
            <TabsContent value="primary" className="p-4 mt-0">{primaryTip}</TabsContent>
            <TabsContent value="junior" className="p-4 mt-0">{juniorTip}</TabsContent>
          </Tabs>
        </div>

        {/* 知识点 */}
        <div className="rounded-xl bg-emerald-500/5 border border-emerald-500/20 p-4 space-y-2">
          <div className="flex items-center gap-2 text-sm font-semibold text-emerald-700">
            <Lightbulb className="size-4" />
            AI 小知识
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            语音识别技术经过了几十年的发展。早期的语音识别只能识别几个数字和单词，
            现在的 AI 已经能听懂各种语言和口音了。
            你平时用的语音助手、语音输入法，背后都是<span className="text-foreground font-medium">语音识别 + 自然语言理解</span>技术在工作。
          </p>
        </div>
      </div>
    </div>
  );
}

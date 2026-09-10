import { useState, useMemo, useRef, useEffect } from 'react';
import {
  BookOpen,
  Code2,
  MessageCircle,
  Sparkles,
  Copy,
  FileText,
  Lightbulb,
  Send,
  Loader2,
  GraduationCap,
  History,
  Download,
  ChevronRight,
  Bot,
  FlaskConical,
  Cpu,
  BrainCircuit,
  BookMarked,
  MessageSquare,
  HelpCircle,
  PlugZap,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { streamChat, hasAiApiKey } from '@/lib/ai-client';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils';

const STORAGE_KEY_HISTORY = 'zhixiang_aitools_history';

// ============ 类型定义 ============
type CategoryId = 'prepare' | 'classroom' | 'qa';

interface SceneConfig {
  id: string;
  category: CategoryId;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
  color: string;
  isChat?: boolean; // 是否对话式
}

interface HistoryItem {
  id: string;
  sceneId: string;
  sceneTitle: string;
  input: string;
  output: string;
  createdAt: string;
}

// ============ 场景配置 ============
const SCENES: SceneConfig[] = [
  // 备课助手（课前）
  {
    id: 'lesson-plan',
    category: 'prepare',
    icon: BookOpen,
    title: '生成AI通识教案',
    desc: '教学目标+重难点+教学过程+实验安排',
    color: 'from-indigo-500 to-blue-600',
  },
  {
    id: 'concept-explain',
    category: 'prepare',
    icon: BrainCircuit,
    title: 'AI概念通俗讲解',
    desc: 'K12学生能懂的类比与举例',
    color: 'from-violet-500 to-purple-600',
  },
  {
    id: 'class-intro',
    category: 'prepare',
    icon: Lightbulb,
    title: '课堂导入语',
    desc: '故事/提问/互动游戏趣味开场',
    color: 'from-amber-500 to-orange-500',
  },
  // 课堂助手（课中）
  {
    id: 'experiment-guide',
    category: 'classroom',
    icon: FlaskConical,
    title: '实验步骤指导',
    desc: 'AI实验室操作步骤+原理解释',
    color: 'from-emerald-500 to-teal-600',
  },
  {
    id: 'code-assistant',
    category: 'classroom',
    icon: Code2,
    title: 'MicroPython代码助手',
    desc: '行空板/掌控板代码+解释+调试',
    color: 'from-blue-500 to-cyan-600',
  },
  {
    id: 'wiring-guide',
    category: 'classroom',
    icon: PlugZap,
    title: '硬件接线指导',
    desc: '主控板+传感器接线说明+引脚表',
    color: 'from-orange-500 to-red-500',
  },
  // 通识问答（贯穿）
  {
    id: 'general-qa',
    category: 'qa',
    icon: MessageSquare,
    title: 'AI通识问答',
    desc: 'AI历史/原理/应用/伦理/未来',
    color: 'from-indigo-500 to-purple-600',
    isChat: true,
  },
  {
    id: 'student-qa',
    category: 'qa',
    icon: HelpCircle,
    title: '学生问题解答',
    desc: 'K12学生的奇思妙想标准回答',
    color: 'from-pink-500 to-rose-500',
  },
];

const CATEGORIES: { id: CategoryId; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'prepare', label: '备课助手', icon: BookMarked },
  { id: 'classroom', label: '课堂助手', icon: BookOpen },
  { id: 'qa', label: '通识问答', icon: MessageCircle },
];

// 常用概念快捷标签
const COMMON_CONCEPTS = [
  '神经网络', '机器学习', '大模型', '计算机视觉',
  '自然语言处理', '强化学习', '数据标注', '算法偏见',
];

// AI实验项目列表
const AI_EXPERIMENTS = [
  '人脸识别', '人脸比对', '人脸特征点', '语音合成',
  '语音识别', '图像分类', '图像风格迁移', '文字识别OCR',
  'AI绘画', '姿态识别', '手势识别', '颜色识别',
  '二维码识别', '物体检测', '情感分析', '文本摘要',
  '智能问答', '机器翻译', '数据可视化', '决策树',
  'K近邻算法', '神经网络入门', '强化学习入门',
];

// 主控板列表
const MAIN_BOARDS = [
  { id: 'hangkong-k10', name: '行空板 K10' },
  { id: 'zhangkong', name: '掌控板' },
  { id: 'zhixiang-box', name: '智象实验盒' },
  { id: 'microbit', name: 'micro:bit' },
];

// 传感器列表
const SENSORS = [
  { id: 'dht11', name: '温湿度传感器 (DHT11)' },
  { id: 'bh1750', name: '光线传感器 (BH1750)' },
  { id: 'sound', name: '声音传感器' },
  { id: 'servo', name: '舵机 (SG90)' },
  { id: 'ultrasonic', name: '超声波传感器 (HC-SR04)' },
  { id: 'pir', name: '人体红外传感器 (PIR)' },
  { id: 'led', name: 'RGB LED 灯环' },
  { id: 'buzzer', name: '无源蜂鸣器' },
];

// AI主题模块
const AI_MODULES = [
  { id: 'ai-basics', name: 'AI基础认知', placeholder: '如：初识人工智能、AI的前世今生', topics: ['初识人工智能', 'AI的前世今生', 'AI能做什么'] },
  { id: 'machine-learning', name: '机器学习', placeholder: '如：教电脑认数字、决策树入门、数据与模型', topics: ['教电脑认数字', '决策树入门', '数据与模型'] },
  { id: 'computer-vision', name: '计算机视觉', placeholder: '如：人脸识别的原理、图像分类入门', topics: ['人脸识别原理', '图像分类', 'OCR文字识别'] },
  { id: 'nlp', name: '自然语言处理', placeholder: '如：语音助手、机器翻译、智能对话', topics: ['语音助手', '机器翻译', '智能对话'] },
  { id: 'aigc', name: 'AIGC创作', placeholder: '如：AI绘画、智能写作、AI音乐', topics: ['AI绘画', '智能写作', 'AI音乐'] },
  { id: 'hardware-robot', name: '智能硬件与机器人', placeholder: '如：智能小车、环境监测、自动驾驶', topics: ['智能小车', '环境监测', '自动驾驶'] },
  { id: 'ethics', name: 'AI伦理与安全', placeholder: '如：AI会取代人类吗、数据隐私保护', topics: ['AI会取代人类吗', '数据隐私', '算法偏见'] },
  { id: 'industry', name: 'AI+行业应用', placeholder: '如：AI在医院、自动驾驶、智慧农业', topics: ['AI在医院', '自动驾驶', '智慧农业'] },
];

// 课时选项
const LESSON_OPTIONS = [
  { id: '1', label: '1课时（40分钟）' },
  { id: '2', label: '2课时（80分钟）' },
];

// 学段选项
const STAGES = [
  { id: 'primary-low', label: '小学低段' },
  { id: 'primary-high', label: '小学高段' },
  { id: 'junior', label: '初中' },
  { id: 'senior', label: '高中' },
];

// 导入语形式
const INTRO_FORMS = [
  { id: 'story', label: '故事导入' },
  { id: 'question', label: '提问导入' },
  { id: 'interactive', label: '互动游戏' },
  { id: 'video', label: '视频导入' },
];

export default function AiToolsPage() {
  const navigate = useNavigate();
  const [selectedSceneId, setSelectedSceneId] = useState('lesson-plan');
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState('');
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);

  // 表单状态
  const [stage, setStage] = useState('primary-high');
  const [aiModule, setAiModule] = useState('ai-basics');
  const [lessonCount, setLessonCount] = useState('1');
  const [topic, setTopic] = useState('');
  const [concept, setConcept] = useState('');
  const [introTopic, setIntroTopic] = useState('');
  const [introForm, setIntroForm] = useState('story');
  const [experiment, setExperiment] = useState('人脸识别');
  const [codeBoard, setCodeBoard] = useState('hangkong-k10');
  const [codeRequirement, setCodeRequirement] = useState('');
  const [wiringBoard, setWiringBoard] = useState('hangkong-k10');
  const [selectedSensors, setSelectedSensors] = useState<string[]>([]);
  const [generalInput, setGeneralInput] = useState('');
  const [studentQuestion, setStudentQuestion] = useState('');

  const resultRef = useRef<HTMLDivElement>(null);

  // 加载历史记录
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_HISTORY);
      if (saved) {
        setHistory(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  }, []);

  // 保存历史记录
  function saveHistory(item: Omit<HistoryItem, 'id' | 'createdAt'>) {
    const newItem: HistoryItem = {
      ...item,
      id: `h-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    const updated = [newItem, ...history].slice(0, 50);
    setHistory(updated);
    try {
      localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  }

  const selectedScene = SCENES.find((s) => s.id === selectedSceneId)!;
  const filteredScenes = useMemo(
    () => SCENES.filter((s) => s.category === selectedScene.category),
    [selectedScene],
  );

  // 构建prompt并调用插件
  async function generate() {
    let prompt = '';
    let inputSummary = '';

    switch (selectedSceneId) {
      case 'lesson-plan':
        if (!topic.trim()) {
          toast.warning('请输入课题');
          return;
        }
        prompt = `你是一位资深的人工智能通识教育专家。请为${STAGES.find(s => s.id === stage)?.label}的学生生成一节《${topic}》的完整教案。

【基本信息】
- 学科：人工智能通识
- 学段：${STAGES.find(s => s.id === stage)?.label}
- AI主题模块：${AI_MODULES.find(m => m.id === aiModule)?.name}
- 课时：${lessonCount}课时（${parseInt(lessonCount) * 40}分钟）
- 课题：${topic}

【教案要求】
请围绕"${AI_MODULES.find(m => m.id === aiModule)?.name}"模块的知识体系设计教案，包含以下部分：
1. 教学目标（知识目标、能力目标、情感目标）
2. 教学重难点
3. 教学过程（导入、新知讲授、实践活动/实验、小结拓展），请按课时分配时间
4. 实验/实践项目安排（具体步骤、材料清单、注意事项）
5. 作业设计（实践/探究/创作型）
6. 板书设计建议
7. 评价方式（过程性评价+作品评价）

要求：
- 语言适合${STAGES.find(s => s.id === stage)?.label}学生认知水平
- 注重动手实践和趣味引导
- 突出${AI_MODULES.find(m => m.id === aiModule)?.name}模块的核心概念与典型应用
- 结合生活中的AI案例，激发学生兴趣`;
        inputSummary = `${topic}（${AI_MODULES.find(m => m.id === aiModule)?.name}·${STAGES.find(s => s.id === stage)?.label}·${lessonCount}课时）`;
        break;

      case 'concept-explain':
        if (!concept.trim()) {
          toast.warning('请输入AI概念');
          return;
        }
        prompt = `你是一位擅长用通俗语言讲解AI概念的老师。请用K12学生能听懂的方式解释"${concept}"这个AI概念。
请包含：
1. 一句话简单定义（小学生也能懂）
2. 生活中的类比（用学生熟悉的事物打比方）
3. 课堂举例（2-3个具体应用场景）
4. 趣味小知识（一个让人"哇"的冷知识）
5. 引导思考（1个可以让学生讨论的问题）

语言生动有趣，避免堆砌专业术语。`;
        inputSummary = concept;
        break;

      case 'class-intro':
        if (!introTopic.trim()) {
          toast.warning('请输入AI主题');
          return;
        }
        prompt = `你是一位富有创意的AI教育老师。请围绕"${introTopic}"这个AI主题，设计一段${INTRO_FORMS.find(f => f.id === introForm)?.label}。
要求：
- 时长约3-5分钟
- 能迅速吸引学生注意力，激发好奇心
- 自然引出本课主题
- 包含具体的话术/互动设计
- 适合在课堂上现场实施

请输出完整的导入脚本，包括老师说的话和预计学生反应。`;
        inputSummary = `${introTopic}（${INTRO_FORMS.find(f => f.id === introForm)?.label}）`;
        break;

      case 'experiment-guide':
        prompt = `你是一位AI实验教学指导专家。请详细说明"${experiment}"实验的完整教学指导。
请包含以下部分：
1. 实验目标（学生能学到什么）
2. 实验原理（用通俗的语言解释背后的AI原理）
3. 操作步骤（分步骤，每步配简要说明）
4. 预期效果与观察要点
5. 常见问题与解决方法
6. 拓展思考（2-3个可以深入探究的问题）
7. 安全注意事项（如有）

适合中小学信息技术/AI通识课堂使用。`;
        inputSummary = experiment;
        break;

      case 'code-assistant':
        if (!codeRequirement.trim()) {
          toast.warning('请输入代码需求');
          return;
        }
        const boardName = MAIN_BOARDS.find(b => b.id === codeBoard)?.name;
        prompt = `你是一位MicroPython编程教学专家。请为${boardName}编写满足以下需求的MicroPython代码：
需求：${codeRequirement}

请输出：
1. 功能说明（这段代码实现了什么）
2. 完整MicroPython代码（带中文注释）
3. 逐行代码解释（重点行详细说明）
4. 接线说明（需要用到哪些引脚）
5. 调试建议（常见问题排查方法）
6. 拓展挑战（可以在此基础上做什么进阶修改）

代码要规范、可直接运行，注释详细，适合教学使用。`;
        inputSummary = `${boardName}：${codeRequirement.slice(0, 20)}`;
        break;

      case 'wiring-guide':
        if (selectedSensors.length === 0) {
          toast.warning('请至少选择一个传感器');
          return;
        }
        const wiringBoardName = MAIN_BOARDS.find(b => b.id === wiringBoard)?.name;
        const sensorNames = selectedSensors.map(s => SENSORS.find(sen => sen.id === s)?.name).join('、');
        prompt = `你是一位硬件教学指导专家。请详细说明${wiringBoardName}连接${sensorNames}的接线指导。
请输出：
1. 所需器材清单
2. 接线原理图说明（用文字描述各引脚连接关系）
3. 引脚配置表（表格形式：传感器引脚 → 主控板引脚 → 功能说明）
4. 接线步骤（按操作顺序）
5. 注意事项（易错点、安全提示）
6. 检测方法（接好后如何验证是否正确）
7. MicroPython 初始化代码示例

请确保信息准确可靠，适合课堂教学使用。`;
        inputSummary = `${wiringBoardName} + ${sensorNames}`;
        break;

      case 'student-qa':
        if (!studentQuestion.trim()) {
          toast.warning('请输入学生问题');
          return;
        }
        prompt = `你是一位耐心的AI通识课老师。有学生问了你一个问题："${studentQuestion}"
请给出适合K12学生的回答：
1. 先用1-2句话给出简洁明了的回答
2. 再用生动的例子/类比详细解释
3. 最后给出2-3个可以引导学生进一步思考和讨论的问题

语言要亲切、鼓励好奇心，避免打击学生提问的积极性。如果问题没有标准答案，也请坦诚说明，并引导学生思考。`;
        inputSummary = studentQuestion.slice(0, 30);
        break;
    }

    if (!hasAiApiKey()) {
      toast.warning('请先配置 AI API Key');
      navigate('/profile?tab=ai');
      return;
    }

    setIsLoading(true);
    setResult('');

    try {
      await streamChat({
        messages: [{ role: 'user', content: prompt }],
        onChunk: (text) => {
          setResult((prev) => prev + text);
        },
      });
      // 生成完成后保存历史
      setTimeout(() => {
        setResult((current) => {
          if (current) {
            saveHistory({
              sceneId: selectedSceneId,
              sceneTitle: selectedScene.title,
              input: inputSummary,
              output: current,
            });
          }
          return current;
        });
      }, 0);
    } catch (e) {
      const msg = e instanceof Error ? e.message : '';
      if (msg === 'AI_API_KEY_MISSING') {
        toast.warning('请先配置 AI API Key');
      } else {
        toast.error('AI 生成失败，请检查 API 设置');
        setResult((prev) => prev || '抱歉，AI 生成出现问题，请检查 API 设置后重试。');
      }
    } finally {
      setIsLoading(false);
    }
  }

  // 通识问答对话式发送
  async function sendChat() {
    if (!generalInput.trim() || isLoading) return;
    const question = generalInput.trim();
    setGeneralInput('');

    // 添加用户消息
    const userMsg = { role: 'user' as const, content: question };
    setChatMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    // 构建历史上下文
    const context = chatMessages.slice(-6).map(m => `${m.role === 'user' ? '学生' : '老师'}：${m.content}`).join('\n');
    const prompt = `你是一位专业的人工智能通识教育老师，正在和学生进行AI通识问答对话。
请用适合K12学生的语言回答问题，生动有趣，鼓励好奇心。

对话历史：
${context}

学生最新问题：${question}

请给出回答：`;

    if (!hasAiApiKey()) {
      toast.warning('请先配置 AI API Key');
      navigate('/profile?tab=ai');
      return;
    }

    try {
      setChatMessages((prev) => [...prev, { role: 'assistant', content: '' }]);
      let full = '';
      await streamChat({
        messages: [
          { role: 'system', content: '你是一位专业的人工智能通识教育老师，正在和学生进行AI通识问答对话。请用适合K12学生的语言回答问题，生动有趣，鼓励好奇心。' },
          ...chatMessages.slice(-8).map((m) => ({ role: m.role, content: m.content })),
          { role: 'user', content: question },
        ],
        onChunk: (text) => {
          full += text;
          setChatMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1] = { role: 'assistant', content: full };
            return updated;
          });
        },
      });
      if (full) {
        saveHistory({
          sceneId: 'general-qa',
          sceneTitle: 'AI通识问答',
          input: question.slice(0, 30),
          output: full,
        });
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : '';
      if (msg === 'AI_API_KEY_MISSING') {
        toast.warning('请先配置 AI API Key');
      } else {
        toast.error('AI 回答失败，请检查 API 设置');
        setChatMessages((prev) => [...prev, { role: 'assistant', content: '抱歉，暂时无法回答，请检查 API 设置后重试。' }]);
      }
    } finally {
      setIsLoading(false);
    }
  }

  function handleCopy() {
    if (!result) return;
    navigator.clipboard.writeText(result);
    toast.success('已复制到剪贴板');
  }

  function handleExport() {
    if (!result) return;
    const blob = new Blob([`${selectedScene.title}\n\n${result}`], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedScene.title}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('已导出');
  }

  function loadHistoryItem(item: HistoryItem) {
    setSelectedSceneId(item.sceneId);
    setResult(item.output);
    setShowHistory(false);
  }

  function clearHistory() {
    setHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEY_HISTORY);
    } catch {
      // ignore
    }
    toast.success('历史记录已清空');
  }

  // 切换场景时重置
  function switchScene(id: string) {
    setSelectedSceneId(id);
    setResult('');
    setChatMessages([]);
  }

  const Icon = selectedScene.icon;

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
        <div className="flex gap-6">
          {/* 左侧：场景导航 */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="space-y-6 sticky top-24">
              {/* 顶部标题 */}
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <Sparkles className="size-5 text-primary" />
                  AI教学助手
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setShowHistory(!showHistory)}
                >
                  <History className="size-4 text-muted-foreground" />
                </Button>
              </div>

              <div className="space-y-5">
                {CATEGORIES.map((cat) => {
                  const CatIcon = cat.icon;
                  const scenesInCat = SCENES.filter((s) => s.category === cat.id);
                  return (
                    <div key={cat.id}>
                      <div className="flex items-center gap-1.5 mb-2 px-1">
                        <CatIcon className="size-3.5 text-primary" />
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          {cat.label}
                        </span>
                      </div>
                      <div className="space-y-1">
                        {scenesInCat.map((s) => {
                          const SIcon = s.icon;
                          const isActive = selectedSceneId === s.id;
                          return (
                            <button
                              key={s.id}
                              onClick={() => switchScene(s.id)}
                              className={cn(
                                'w-full flex items-start gap-2.5 p-2.5 rounded-lg text-left transition-all',
                                isActive
                                  ? 'bg-primary/10 text-foreground'
                                  : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground',
                              )}
                            >
                              <div
                                className={cn(
                                  'size-8 shrink-0 rounded-lg flex items-center justify-center text-white',
                                  `bg-gradient-to-br ${s.color}`,
                                )}
                              >
                                <SIcon className="size-4" />
                              </div>
                              <div className="flex-1 min-w-0 pt-0.5">
                                <p className="text-sm font-medium leading-tight">{s.title}</p>
                                <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">
                                  {s.desc}
                                </p>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* 移动端场景选择 */}
          <div className="lg:hidden mb-4">
            <ScrollArea className="w-full">
              <div className="flex gap-2 pb-2">
                {SCENES.map((s) => {
                  const SIcon = s.icon;
                  const isActive = selectedSceneId === s.id;
                  return (
                    <button
                      key={s.id}
                      onClick={() => switchScene(s.id)}
                      className={cn(
                        'shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm',
                        isActive
                          ? 'bg-primary text-white'
                          : 'bg-card border border-border text-muted-foreground',
                      )}
                    >
                      <SIcon className="size-4" />
                      <span className="whitespace-nowrap">{s.title}</span>
                    </button>
                  );
                })}
              </div>
            </ScrollArea>
          </div>

          {/* 右侧：主内容区 */}
          <div className="flex-1 min-w-0">
            <Card className="border border-border/60 shadow-sm overflow-hidden">
              {/* 场景头部 */}
              <div className={`bg-gradient-to-r ${selectedScene.color} p-5 md:p-6 text-white`}>
                <div className="flex items-start gap-3">
                  <div className="size-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0">
                    <Icon className="size-6" />
                  </div>
                  <div className="flex-1">
                    <h1 className="text-xl font-bold">{selectedScene.title}</h1>
                    <p className="text-sm text-white/80 mt-0.5">{selectedScene.desc}</p>
                  </div>
                  <Badge variant="outline" className="bg-white/15 border-white/30 text-white text-xs">
                    AI通识课专用
                  </Badge>
                </div>
              </div>

              <CardContent className="p-5 md:p-6 space-y-6">
                {selectedScene.isChat ? (
                  /* 对话式界面（通识问答） */
                  <div className="flex flex-col h-[500px]">
                    <div className="flex-1 overflow-y-auto space-y-4 pr-2 mb-4">
                      {chatMessages.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground">
                          <Bot className="size-12 mb-3 opacity-30" />
                          <p className="text-sm">来聊聊AI的任何话题吧~</p>
                          <p className="text-xs mt-1">AI历史、原理、应用、伦理、未来趋势</p>
                        </div>
                      ) : (
                        chatMessages.map((msg, i) => (
                          <div
                            key={i}
                            className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                          >
                            <div
                              className={`size-7 shrink-0 rounded-full flex items-center justify-center ${
                                msg.role === 'user'
                                  ? 'bg-primary text-primary-foreground'
                                  : 'bg-gradient-to-br from-indigo-500 to-purple-500 text-white'
                              }`}
                            >
                              {msg.role === 'user' ? (
                                <span className="text-[10px] font-bold">我</span>
                              ) : (
                                <Bot className="size-4" />
                              )}
                            </div>
                            <div
                              className={`max-w-[75%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                                msg.role === 'user'
                                  ? 'bg-primary text-primary-foreground rounded-tr-sm'
                                  : 'bg-muted/50 text-foreground rounded-tl-sm border border-border/40'
                              }`}
                            >
                              <div className="whitespace-pre-line">
                                {msg.content}
                                {isLoading && i === chatMessages.length - 1 && msg.role === 'assistant' && (
                                  <span className="inline-block w-1.5 h-4 ml-0.5 bg-primary/60 animate-pulse align-middle" />
                                )}
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    <div className="relative">
                      <Textarea
                        value={generalInput}
                        onChange={(e) => setGeneralInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            sendChat();
                          }
                        }}
                        placeholder="输入你的AI问题，Enter 发送…"
                        className="min-h-[52px] max-h-[120px] resize-none pr-12 text-sm"
                        disabled={isLoading}
                      />
                      <Button
                        size="icon"
                        className="absolute right-2 bottom-2 h-9 w-9 bg-gradient-to-r from-indigo-600 to-purple-600"
                        onClick={sendChat}
                        disabled={!generalInput.trim() || isLoading}
                      >
                        {isLoading ? (
                          <Loader2 className="size-4 animate-spin" />
                        ) : (
                          <Send className="size-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                ) : (
                  /* 表单 + 结果界面 */
                  <>
                    {/* 表单区 */}
                    <div className="space-y-4">
                      {/* 生成教案 */}
                      {selectedSceneId === 'lesson-plan' && (
                        <>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label className="text-sm font-medium">学段</Label>
                              <Select value={stage} onValueChange={setStage}>
                                <SelectTrigger className="h-10">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {STAGES.map((s) => (
                                    <SelectItem key={s.id} value={s.id}>
                                      {s.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label className="text-sm font-medium">课时</Label>
                              <Select value={lessonCount} onValueChange={setLessonCount}>
                                <SelectTrigger className="h-10">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {LESSON_OPTIONS.map((l) => (
                                    <SelectItem key={l.id} value={l.id}>
                                      {l.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm font-medium">AI 主题模块</Label>
                            <Select value={aiModule} onValueChange={(v) => { setAiModule(v); setTopic(''); }}>
                              <SelectTrigger className="h-10">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {AI_MODULES.map((m) => (
                                  <SelectItem key={m.id} value={m.id}>
                                    {m.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm font-medium">课题</Label>
                            <Input
                              value={topic}
                              onChange={(e) => setTopic(e.target.value)}
                              placeholder={AI_MODULES.find(m => m.id === aiModule)?.placeholder || '请输入课题'}
                              className="h-10"
                            />
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-2">推荐课题：</p>
                            <div className="flex flex-wrap gap-1.5">
                              {AI_MODULES.find(m => m.id === aiModule)?.topics.map((t) => (
                                <Badge
                                  key={t}
                                  variant="outline"
                                  className="cursor-pointer hover:bg-primary/10 hover:border-primary/30 text-xs"
                                  onClick={() => setTopic(t)}
                                >
                                  {t}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </>
                      )}

                      {/* AI概念通俗讲解 */}
                      {selectedSceneId === 'concept-explain' && (
                        <>
                          <div className="space-y-2">
                            <Label className="text-sm font-medium">AI 概念</Label>
                            <Input
                              value={concept}
                              onChange={(e) => setConcept(e.target.value)}
                              placeholder="输入一个AI概念，如：神经网络、大模型、机器学习"
                              className="h-10"
                            />
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-2">常用概念：</p>
                            <div className="flex flex-wrap gap-1.5">
                              {COMMON_CONCEPTS.map((c) => (
                                <Badge
                                  key={c}
                                  variant="outline"
                                  className="cursor-pointer hover:bg-primary/10 hover:border-primary/30 text-xs"
                                  onClick={() => setConcept(c)}
                                >
                                  {c}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </>
                      )}

                      {/* 课堂导入语 */}
                      {selectedSceneId === 'class-intro' && (
                        <>
                          <div className="space-y-2">
                            <Label className="text-sm font-medium">AI 主题</Label>
                            <Input
                              value={introTopic}
                              onChange={(e) => setIntroTopic(e.target.value)}
                              placeholder="例如：数据标注、语音识别、智能推荐"
                              className="h-10"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm font-medium">导入形式</Label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                              {INTRO_FORMS.map((f) => (
                                <button
                                  key={f.id}
                                  onClick={() => setIntroForm(f.id)}
                                  className={cn(
                                    'h-10 rounded-md border text-sm transition-all',
                                    introForm === f.id
                                      ? 'bg-primary text-white border-primary'
                                      : 'border-input hover:border-primary/40',
                                  )}
                                >
                                  {f.label}
                                </button>
                              ))}
                            </div>
                          </div>
                        </>
                      )}

                      {/* 实验步骤指导 */}
                      {selectedSceneId === 'experiment-guide' && (
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">选择实验项目</Label>
                          <Select value={experiment} onValueChange={setExperiment}>
                            <SelectTrigger className="h-10">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="max-h-[300px]">
                              {AI_EXPERIMENTS.map((e) => (
                                <SelectItem key={e} value={e}>
                                  {e}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      {/* MicroPython代码助手 */}
                      {selectedSceneId === 'code-assistant' && (
                        <>
                          <div className="space-y-2">
                            <Label className="text-sm font-medium">主控板</Label>
                            <Select value={codeBoard} onValueChange={setCodeBoard}>
                              <SelectTrigger className="h-10">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {MAIN_BOARDS.map((b) => (
                                  <SelectItem key={b.id} value={b.id}>
                                    {b.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm font-medium">代码需求描述</Label>
                            <Textarea
                              value={codeRequirement}
                              onChange={(e) => setCodeRequirement(e.target.value)}
                              placeholder="例如：读取温湿度传感器数据并在OLED屏幕上显示，超过阈值时蜂鸣器报警"
                              className="min-h-[100px] resize-y text-sm"
                            />
                          </div>
                        </>
                      )}

                      {/* 硬件接线指导 */}
                      {selectedSceneId === 'wiring-guide' && (
                        <>
                          <div className="space-y-2">
                            <Label className="text-sm font-medium">主控板</Label>
                            <Select value={wiringBoard} onValueChange={setWiringBoard}>
                              <SelectTrigger className="h-10">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {MAIN_BOARDS.map((b) => (
                                  <SelectItem key={b.id} value={b.id}>
                                    {b.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm font-medium">传感器（可多选）</Label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                              {SENSORS.map((s) => (
                                <label
                                  key={s.id}
                                  className={cn(
                                    'flex items-center gap-2 p-2.5 rounded-md border text-sm cursor-pointer transition-colors',
                                    selectedSensors.includes(s.id)
                                      ? 'bg-primary/10 border-primary/40'
                                      : 'border-input hover:border-primary/30',
                                  )}
                                >
                                  <Checkbox
                                    checked={selectedSensors.includes(s.id)}
                                    onCheckedChange={(checked) => {
                                      if (checked) {
                                        setSelectedSensors((prev) => [...prev, s.id]);
                                      } else {
                                        setSelectedSensors((prev) => prev.filter((id) => id !== s.id));
                                      }
                                    }}
                                  />
                                  <span className="text-xs">{s.name}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                        </>
                      )}

                      {/* 学生问题解答 */}
                      {selectedSceneId === 'student-qa' && (
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">学生问题</Label>
                          <Textarea
                            value={studentQuestion}
                            onChange={(e) => setStudentQuestion(e.target.value)}
                            placeholder="例如：AI会不会取代人类？AI有意识吗？AI能创造艺术吗？"
                            className="min-h-[100px] resize-y text-sm"
                          />
                        </div>
                      )}

                      {/* 未配置 API Key 提示 */}
                      {!hasAiApiKey() && (
                        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3">
                          <div className="size-8 shrink-0 rounded-full bg-amber-100 flex items-center justify-center">
                            <Sparkles className="size-4 text-amber-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-amber-800">请先配置 AI API Key</p>
                            <p className="text-xs text-amber-700 mt-0.5">
                              部署到外部服务器后，AI功能需要配置您自己的 API Key 才能使用。
                            </p>
                            <Button
                              size="sm"
                              variant="outline"
                              className="mt-2 h-7 text-xs border-amber-300 text-amber-700 hover:bg-amber-100"
                              onClick={() => navigate('/profile?tab=ai')}
                            >
                              去配置
                            </Button>
                          </div>
                        </div>
                      )}

                      {/* 生成按钮 */}
                      <Button
                        onClick={generate}
                        disabled={isLoading}
                        className="w-full h-11 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="size-4 mr-2 animate-spin" />
                            正在生成…
                          </>
                        ) : (
                          <>
                            <Sparkles className="size-4 mr-2" />
                            生成{selectedScene.title.replace('生成', '').replace('AI', '')}
                          </>
                        )}
                      </Button>
                    </div>

                    {/* 结果区 */}
                    {(result || isLoading) && (
                      <div className="pt-6 border-t border-border/60">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                            <FileText className="size-4 text-primary" />
                            生成结果
                          </h3>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 text-xs"
                              onClick={handleCopy}
                              disabled={!result}
                            >
                              <Copy className="size-3 mr-1" />
                              复制
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 text-xs"
                              onClick={handleExport}
                              disabled={!result}
                            >
                              <Download className="size-3 mr-1" />
                              导出
                            </Button>
                          </div>
                        </div>
                        <div
                          ref={resultRef}
                          className="prose prose-sm max-w-none dark:prose-invert bg-muted/20 rounded-lg p-4 max-h-[500px] overflow-y-auto"
                        >
                          {result ? (
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{result}</ReactMarkdown>
                          ) : (
                            <div className="flex items-center gap-2 text-muted-foreground text-sm">
                              <Loader2 className="size-4 animate-spin" />
                              AI 正在思考中，请稍候…
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* 历史记录抽屉 */}
      <AnimatePresence>
        {showHistory && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
              onClick={() => setShowHistory(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-80 max-w-[85vw] bg-card border-l border-border z-50 flex flex-col"
            >
              <div className="p-4 border-b border-border flex items-center justify-between">
                <h3 className="font-semibold flex items-center gap-2">
                  <History className="size-4 text-primary" />
                  历史记录
                </h3>
                <div className="flex items-center gap-1">
                  {history.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs text-destructive hover:text-destructive"
                      onClick={clearHistory}
                    >
                      清空
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => setShowHistory(false)}
                  >
                    <X className="size-4" />
                  </Button>
                </div>
              </div>
              <ScrollArea className="flex-1">
                {history.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground text-sm">
                    暂无历史记录
                  </div>
                ) : (
                  <div className="p-2 space-y-1">
                    {history.map((item) => {
                      const scene = SCENES.find((s) => s.id === item.sceneId);
                      const SIcon = scene?.icon || Sparkles;
                      return (
                        <button
                          key={item.id}
                          onClick={() => loadHistoryItem(item)}
                          className="w-full text-left p-3 rounded-lg hover:bg-muted/50 transition-colors group"
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <SIcon className="size-3.5 text-primary" />
                            <span className="text-xs text-muted-foreground">
                              {item.sceneTitle}
                            </span>
                          </div>
                          <p className="text-sm font-medium line-clamp-1 text-foreground">
                            {item.input}
                          </p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">
                            {new Date(item.createdAt).toLocaleString()}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                )}
              </ScrollArea>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// Input 组件本地封装（避免未 import）
function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  );
}

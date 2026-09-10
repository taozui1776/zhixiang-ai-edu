import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Presentation,
  FlaskConical,
  Code2,
  Bot,
  Cpu,
  Sparkles,
  Send,
  Lightbulb,
  Loader2,
  PanelRightClose,
  PanelRightOpen,
  BookOpen,
  ArrowLeft,
  Maximize2,
  FileText,
  Users,
  ClipboardList,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { streamChat } from '@/lib/ai-client';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Image from '@/components/ui/image';
import { getLessonById, type ILesson, type CoursewareSlide } from '@/data/courses';
import { getCourseSummaryById, type ICourseSummary } from '@/data/course-summary';
import { useIsMobile } from '@/hooks/use-mobile';

// 工具组件
import ClassroomToolbar from './tools/ClassroomToolbar';
import AnnotationCanvas from './tools/AnnotationCanvas';
import TimerPanel from './tools/TimerPanel';
import RandomPicker from './tools/RandomPicker';
import SpotlightOverlay from './tools/SpotlightOverlay';
import VotePanel from './tools/VotePanel';
import AiFullscreenAnswer from './tools/AiFullscreenAnswer';
import HardwareStatusBar from './tools/HardwareStatusBar';
import ExitConfirmDialog from './tools/ExitConfirmDialog';
import ShortcutsHelp, { OnboardingGuide } from './tools/ShortcutsHelp';
import {
  saveTeachProgress,
  saveTeachRecord,
  getAnnotationRecord,
  saveAnnotationRecord,
  clearAnnotationRecord,
  getPrepareNotes,
  savePrepareNotes,
  type TeachRecord,
} from './tools';

const QA_PLUGIN_ID = 'ai_general_concept_qa_1';
const MASCOT_IMG = 'https://aka.doubaocdn.com/s/RUYRoCZ6Ts';

const TOOLS = [
  { id: 'courseware', label: '课件', icon: Presentation, emoji: '📖' },
  { id: 'lesson-plan', label: '教案', icon: FileText, emoji: '📋' },
  { id: 'experiment', label: '实验', icon: FlaskConical, emoji: '🔬' },
  { id: 'coding', label: '编程', icon: Code2, emoji: '💻' },
  { id: 'homework', label: '作业', icon: ClipboardList, emoji: '📝' },
  { id: 'notes', label: '备课笔记', icon: BookOpen, emoji: '📓' },
  { id: 'hardware', label: '硬件', icon: Cpu, emoji: '🔌' },
] as const;

type ToolId = typeof TOOLS[number]['id'];
type HardwareStatus = 'disconnected' | 'connecting' | 'connected';

// 根据课件主题构建页面（当没有逐页详情时使用）
function buildSlidesFromTopics(lesson: ILesson): CoursewareSlide[] {
  const slides: CoursewareSlide[] = [];
  slides.push({ title: lesson.title, type: 'title', points: [lesson.unitTitle, `${lesson.gradeName} · 第 ${lesson.lessonIndex} 课`, `模块：${lesson.module}`] });
  slides.push({ title: '教学目标', type: 'knowledge', points: lesson.objectives });
  lesson.courseware.topics.forEach((t, i) => {
    slides.push({
      title: t,
      type: i % 2 === 0 ? 'knowledge' : 'case',
      points: [`围绕「${t}」展开本环节教学`, '结合生活实例与课堂互动加深理解', '引导学生思考与讨论'],
    });
  });
  if (lesson.experiment && lesson.experiment.name) {
    slides.push({
      title: `动手实验：${lesson.experiment.name}`,
      type: 'practice',
      points: lesson.experiment.steps,
    });
  }
  slides.push({
    title: '课堂小结',
    type: 'summary',
    points: [
      '回顾本节课的核心知识点',
      '分享你的收获与疑问',
      `${lesson.homework.title}（课后作业）`,
    ],
  });
  return slides;
}


const ONBOARDING_KEY = 'zhixiang_teach_onboarding_shown';

const ONBOARDING_STEPS = [
  {
    title: '👋 欢迎来到授课模式',
    description:
      '智象授课模式为课堂投影优化设计。你可以使用方向键或空格键翻页，也可以直接点击侧边栏跳转到任意页。',
  },
  {
    title: '✏️ 课件批注 · 计时器 · 点名',
    description:
      '顶部工具栏提供课堂常用工具：按 A 键切换批注模式，按 T 键打开计时器，按 R 键随机点名，让课堂互动更高效。',
  },
  {
    title: '🧪 一键切换实验和编程',
    description:
      '侧边栏可以在课件、实验、编程、AI 助手之间自由切换。按 ? 键查看全部快捷键，开始你的 AI 课堂之旅吧！',
  },
];

const SLIDE_TYPE_MAP: Record<string, { label: string; color: string }> = {
  title: { label: '标题页', color: 'text-primary' },
  knowledge: { label: '知识讲解', color: 'text-blue-500' },
  case: { label: '案例分析', color: 'text-amber-500' },
  question: { label: '互动提问', color: 'text-pink-500' },
  practice: { label: '实践活动', color: 'text-emerald-600' },
  summary: { label: '课堂小结', color: 'text-purple-500' },
};

export default function TeachModePage() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const courseSummary: ICourseSummary | undefined = courseId
    ? getCourseSummaryById(courseId)
    : undefined;
  const lessonFromId: ILesson | undefined = courseId ? getLessonById(courseId) : undefined;

  // 课程级 ID 时，用第一课时的合成 lesson 数据
  const lesson: ILesson | undefined = useMemo(() => {
    if (lessonFromId) return lessonFromId;
    if (courseSummary) {
      return {
        id: courseSummary.id,
        title: `${courseSummary.title} · 第1课时`,
        unitId: `${courseSummary.id}-u1`,
        unitTitle: '第一单元',
        stage: courseSummary.stage.includes('primary')
          ? 'primary'
          : courseSummary.stage === 'junior'
            ? 'junior'
            : 'senior',
        grade: 'G5',
        gradeName: courseSummary.stageLabel,
        lessonIndex: 1,
        duration: 40,
        resourceTypes: ['教案', '课件', '实验', '作业'],
        module: courseSummary.category,
        objectives: [
          `了解${courseSummary.title}的核心概念`,
          '能够独立完成基础实验操作',
          '培养计算思维与创新意识',
        ],
        lessonPlan: {
          introduction: '通过生活实例引入本课主题，激发学生兴趣',
          keyPoints: ['核心概念理解', '动手实验操作', '小组合作探究'],
          activities: ['情境导入', '新知讲授', '实验探究', '展示交流'],
          summary: '回顾本节课重点，布置课后拓展任务',
        },
        courseware: {
          slides: 12,
          topics: [
            '课程导入',
            '核心概念讲解',
            '案例分析',
            '实验演示',
            '课堂练习',
            '总结与拓展',
          ],
          slidesDetail: [],
        },
        experiment: {
          name: '动手实验',
          steps: ['实验准备', '操作步骤一', '操作步骤二', '记录与分析', '实验结论'],
          materials: ['电脑', '实验软件', '实验记录单'],
          difficulty: courseSummary.difficulty,
        },
        homework: {
          title: '课后拓展任务',
          description: '结合课堂所学，完成一个小作品或探究报告',
          type: '创作',
        },
        hardwareTips: ['可配合掌控板/行空板进行拓展实验'],
      } as ILesson;
    }
    return undefined;
  }, [lessonFromId, courseSummary]);

  const [activeTool, setActiveTool] = useState<ToolId>('courseware');
  const [sideCollapsed, setSideCollapsed] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('right');

  // ===== 课堂工具栏状态 =====
  const [toolbarCollapsed, setToolbarCollapsed] = useState(false);
  const [annotationActive, setAnnotationActive] = useState(false);
  const [annotationDirty, setAnnotationDirty] = useState(false);
  const [timerOpen, setTimerOpen] = useState(false);
  const [timerMinimized, setTimerMinimized] = useState(false);
  const [timerRunning, setTimerRunning] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [spotlightActive, setSpotlightActive] = useState(false);
  const [spotlightSize, setSpotlightSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [voteOpen, setVoteOpen] = useState(false);
  const [exitConfirmOpen, setExitConfirmOpen] = useState(false);
  const [hardwareStatus, setHardwareStatus] = useState<HardwareStatus>('disconnected');
  const [hardwareDevice, setHardwareDevice] = useState<string>('');
  const [aiFullscreenOpen, setAiFullscreenOpen] = useState(false);
  const [aiFullscreenContent, setAiFullscreenContent] = useState('');
  const [aiFullscreenQuestion, setAiFullscreenQuestion] = useState('');

  // AI 助手
  const [aiInput, setAiInput] = useState('');
  const [prepareNotes, setPrepareNotes] = useState('');
  const [notesSaved, setNotesSaved] = useState(true);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiMessages, setAiMessages] = useState<{ role: 'user' | 'ai'; content: string }[]>([
    { role: 'ai', content: '你好！我是智象 AI 课堂助手 🐘 上课过程中遇到任何 AI 相关问题，都可以问我哦～' },
  ]);
  const aiChatRef = useRef<HTMLDivElement>(null);

  // 课件容器 ref（用于批注 Canvas 定位）
  const slideContainerRef = useRef<HTMLDivElement>(null);

  // 当前授课班级信息（从开课设置或localStorage读取）
  const [currentClassInfo, setCurrentClassInfo] = useState<{
    classId: string;
    className: string;
    courseName: string;
    lessonName: string;
  } | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('zhixiang_current_teach_class');
      if (raw) {
        const info = JSON.parse(raw);
        setCurrentClassInfo(info);
      }
    } catch (e) {
      // ignore
    }
  }, [courseId]);

  const slides = useMemo(() => {
    if (!lesson) return [];
    return lesson.courseware.slidesDetail && lesson.courseware.slidesDetail.length > 0
      ? lesson.courseware.slidesDetail
      : buildSlidesFromTopics(lesson);
  }, [lesson]);

  const totalSlides = slides.length;
  const currentSlide = slides[slideIndex];

  const stageLabel = lesson
    ? lesson.stage === 'primary'
      ? '小学'
      : lesson.stage === 'junior'
        ? '初中'
        : '高中'
    : '';

  // 当前页批注数据URL
  const currentAnnotationUrl = courseId
    ? getAnnotationRecord(courseId, slideIndex)
    : null;

  // 加载备课笔记
  useEffect(() => {
    if (courseId) {
      setPrepareNotes(getPrepareNotes(courseId));
    }
  }, [courseId]);

  // 备课笔记自动保存（防抖）
  useEffect(() => {
    if (!courseId) return;
    if (prepareNotes === getPrepareNotes(courseId)) {
      setNotesSaved(true);
      return;
    }
    setNotesSaved(false);
    const timer = setTimeout(() => {
      savePrepareNotes(courseId, prepareNotes);
      setNotesSaved(true);
    }, 800);
    return () => clearTimeout(timer);
  }, [prepareNotes, courseId]);

  // ===== 保存授课进度 =====
  useEffect(() => {
    if (!courseId || !lesson) return;
    const timer = setTimeout(() => {
      saveTeachProgress({
        courseId,
        lessonTitle: lesson.title,
        slideIndex,
        totalSlides,
        lastTime: new Date().toISOString(),
        stage: lesson.stage,
      });
    }, 2000);
    return () => clearTimeout(timer);
  }, [courseId, lesson, slideIndex, totalSlides]);

  // ===== 键盘快捷键 =====
  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      // 退出确认打开时不处理其他快捷键
      if (exitConfirmOpen) return;

      // 批注模式激活时，B/E/C 优先处理批注
      if (annotationActive) {
        if (e.key === 'Escape') {
          e.preventDefault();
          setAnnotationActive(false);
          return;
        }
        // 其他键让 Canvas 自己处理
        return;
      }

      // 聚光灯激活
      if (spotlightActive) {
        if (e.key === 'Escape') {
          e.preventDefault();
          setSpotlightActive(false);
        }
        return;
      }

      // AI 全屏打开
      if (aiFullscreenOpen) {
        if (e.key === 'Escape') {
          e.preventDefault();
          setAiFullscreenOpen(false);
        }
        return;
      }

      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
        case ' ':
          if (activeTool === 'courseware') {
            e.preventDefault();
            nextSlide();
          }
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
          if (activeTool === 'courseware') {
            e.preventDefault();
            prevSlide();
          }
          break;
        case 'f':
        case 'F':
          if (!e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            if (document.fullscreenElement) {
              document.exitFullscreen().catch(() => {});
            } else {
              document.documentElement.requestFullscreen().catch(() => {});
            }
          }
          break;
        case 'b':
        case 'B':
          e.preventDefault();
          if (activeTool === 'courseware') {
            setAnnotationActive((v) => !v);
          }
          break;
        case 't':
        case 'T':
          e.preventDefault();
          setTimerOpen((v) => !v);
          break;
        case 'r':
        case 'R':
          e.preventDefault();
          setPickerOpen((v) => !v);
          break;
        case 'v':
        case 'V':
          e.preventDefault();
          setVoteOpen((v) => !v);
          break;
        case 's':
        case 'S':
          if (!e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            setSpotlightActive((v) => !v);
          }
          break;
        case 'Escape':
          // 退出授课模式
          e.preventDefault();
          if (shortcutsOpen) {
            setShortcutsOpen(false);
          } else if (showOnboarding) {
            setShowOnboarding(false);
          } else if (annotationDirty || timerRunning) {
            setExitConfirmOpen(true);
          } else {
            navigate(-1);
          }
          break;
        case '?':
        case '/':
          if (e.shiftKey || e.key === '?') {
            e.preventDefault();
            setShortcutsOpen((v) => !v);
          }
          break;
        case 'a':
        case 'A':
          e.preventDefault();
          if (activeTool === 'courseware') {
            setAnnotationActive((v) => !v);
          }
          break;
      }
    },
    [slideIndex, activeTool, annotationActive, spotlightActive, aiFullscreenOpen, exitConfirmOpen, annotationDirty, timerRunning, shortcutsOpen, showOnboarding],
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleKey]);

  // 首次进入引导
  useEffect(() => {
    const shown = localStorage.getItem(ONBOARDING_KEY);
    if (!shown) {
      // 延迟一点再显示，让页面先渲染好
      const timer = setTimeout(() => setShowOnboarding(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const closeOnboarding = () => {
    localStorage.setItem(ONBOARDING_KEY, '1');
    setShowOnboarding(false);
  };

  const nextOnboardingStep = () => {
    if (onboardingStep >= ONBOARDING_STEPS.length - 1) {
      closeOnboarding();
    } else {
      setOnboardingStep((s) => s + 1);
    }
  };

  const prevOnboardingStep = () => {
    if (onboardingStep > 0) {
      setOnboardingStep((s) => s - 1);
    }
  };

  // AI 聊天自动滚动
  useEffect(() => {
    if (aiChatRef.current) {
      aiChatRef.current.scrollTop = aiChatRef.current.scrollHeight;
    }
  }, [aiMessages]);

  const nextSlide = useCallback(() => {
    if (slideIndex < totalSlides - 1) {
      setSlideDirection('right');
      setSlideIndex(slideIndex + 1);
    }
  }, [slideIndex, totalSlides]);

  const prevSlide = useCallback(() => {
    if (slideIndex > 0) {
      setSlideDirection('left');
      setSlideIndex(slideIndex - 1);
    }
  }, [slideIndex]);

  const handleHardwareConnect = async () => {
    if (hardwareStatus === 'connected') {
      setHardwareStatus('disconnected');
      setHardwareDevice('');
      toast.info('硬件已断开');
      return;
    }
    if (!(navigator as any).serial) {
      toast.error('当前浏览器不支持 Web Serial，请使用 Chrome 或 Edge 浏览器');
      return;
    }
    setHardwareStatus('connecting');
    try {
      const port = await (navigator as any).serial.requestPort();
      await port.open({ baudRate: 115200 });
      setHardwareStatus('connected');
      setHardwareDevice('掌控板 (Web Serial)');
      toast.success('硬件连接成功');
    } catch (e) {
      setHardwareStatus('disconnected');
      toast.error('连接已取消或失败');
    }
  };

  const handleAiSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiInput.trim() || aiLoading) return;
    const question = aiInput.trim();
    setAiInput('');
    setAiMessages((prev) => [...prev, { role: 'user', content: question }]);
    setAiLoading(true);

    const msgIndex = aiMessages.length + 1;
    setAiMessages((prev) => [...prev, { role: 'ai', content: '' }]);

    // 构建 prompt，带当前课件页上下文
    let prompt = question;
    if (activeTool === 'courseware' && currentSlide) {
      prompt = `当前正在讲解课件页：${currentSlide.title}\n内容要点：${currentSlide.points.join('；')}\n\n学生提问：${question}\n\n请用通俗易懂的语言回答，适合${stageLabel}学生理解。`;
    }

    try {
      let full = '';
      await streamChat({
        messages: [{ role: 'user', content: prompt }],
        onChunk: (piece) => {
          if (piece) {
            full += piece;
            setAiMessages((prev) => {
              const updated = [...prev];
              updated[msgIndex] = { role: 'ai', content: full };
              return updated;
            });
          }
        },
      });
      if (!full) {
        setAiMessages((prev) => {
          const updated = [...prev];
          updated[msgIndex] = { role: 'ai', content: '（AI 暂时没有给出回答，请换个问题试试～）' };
          return updated;
        });
      }
    } catch (err) {
      const errMsg = String(err);
      console.error('AI 课堂助手失败:', errMsg);
      setAiMessages((prev) => {
        const updated = [...prev];
        updated[msgIndex] = { role: 'ai', content: '抱歉，AI 服务暂时不可用，请稍后再试 🙏' };
        return updated;
      });
      toast.error('AI 助手暂不可用，请先在个人中心配置 API Key');
    } finally {
      setAiLoading(false);
    }
  };

  const askSample = (q: string) => {
    setAiInput(q);
  };

  // 基于当前课件页提问
  const askAboutCurrentSlide = () => {
    if (!currentSlide) return;
    const q = `请讲解一下「${currentSlide.title}」这部分内容`;
    setAiInput(q);
  };

  // 全屏展示 AI 回答
  const showAiFullscreen = () => {
    const lastAiMsg = [...aiMessages].reverse().find((m) => m.role === 'ai' && m.content);
    const lastUserMsg = [...aiMessages].reverse().find((m) => m.role === 'user');
    if (lastAiMsg) {
      setAiFullscreenContent(lastAiMsg.content);
      setAiFullscreenQuestion(lastUserMsg?.content || '');
      setAiFullscreenOpen(true);
    }
  };

  // 批注保存处理
  const handleAnnotationSave = (dataUrl: string) => {
    if (courseId) {
      saveAnnotationRecord(courseId, slideIndex, dataUrl);
      setAnnotationDirty(false);
      toast.success('批注已保存');
    }
  };

  // 退出授课
  const handleExit = () => {
    if (annotationDirty || timerRunning) {
      setExitConfirmOpen(true);
    } else {
      navigate(-1);
    }
  };

  const handleSaveAndExit = () => {
    // 保存当前批注
    if (annotationActive && courseId) {
      // 当前正在批注，先保存
      clearAnnotationRecord(courseId, slideIndex);
      // 注：实际批注Canvas的save在组件内部触发，这里直接退出时做个简化
    }
    // 保存完整授课记录（班级+课程+课时+时长）
    if (courseId && lesson) {
      const now = new Date();
      const dateStr = now.toISOString().split('T')[0];
      const timeStr = now.toTimeString().slice(0, 5);
      // 估算时长：从进入页面到现在（简化：40分钟标准课时）
      saveTeachRecord({
        courseId,
        lessonTitle: lesson.title,
        slideIndex,
        totalSlides,
        lastTime: now.toISOString(),
        stage: lesson.stage,
        className: currentClassInfo?.className || '',
        courseName: courseSummary?.title || lesson.title,
        duration: 40,
        date: dateStr,
        time: timeStr,
        status: 'completed',
      });
    }
    setExitConfirmOpen(false);
    toast.success('课堂数据已保存');
    navigate(-1);
  };

  const handleDiscardAndExit = () => {
    setExitConfirmOpen(false);
    navigate(-1);
  };

  if (!lesson) {
    return (
      <div className="fixed inset-0 bg-slate-950 text-white flex items-center justify-center z-50">
        <div className="text-center">
          <p className="text-lg mb-3">课程不存在</p>
          <Button onClick={() => navigate('/courses')}>返回课程库</Button>
        </div>
      </div>
    );
  }

  const slideTypeInfo = currentSlide ? SLIDE_TYPE_MAP[currentSlide.type] || SLIDE_TYPE_MAP.knowledge : null;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 text-white z-50 flex flex-col overflow-hidden">
      {/* 顶部栏 */}
      <header className="flex items-center justify-between px-4 md:px-6 py-3 border-b border-white/10 bg-black/20 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleExit}
            className="text-white/70 hover:text-white hover:bg-white/10 -ml-2"
          >
            <ArrowLeft className="size-4" />
            <span className="hidden md:inline ml-1">退出授课</span>
          </Button>
          <div className="w-px h-5 bg-white/15 hidden md:block" />
          <div className="min-w-0">
            {currentClassInfo?.className && (
              <div className="text-[11px] text-white/60 flex items-center gap-1.5 mb-0.5">
                <Users className="size-3" />
                <span className="font-medium text-white/80">{currentClassInfo.className}</span>
                <span className="text-white/30">·</span>
                <span className="truncate">{currentClassInfo.courseName || courseSummary?.title}</span>
              </div>
            )}
            <div className="text-sm md:text-base font-semibold truncate">{lesson.title}</div>
            <div className="text-xs text-white/50 flex items-center gap-2">
              <Badge variant="outline" className="text-[10px] h-4 px-1.5 border-white/20 text-white/70">
                {stageLabel}
              </Badge>
              <span className="truncate">{lesson.unitTitle}</span>
            </div>
          </div>
        </div>

        {/* 中间：页码/工具名 */}
        <div className="absolute left-1/2 -translate-x-1/2">
          {activeTool === 'courseware' && (
            <div className="flex items-center gap-2 text-sm">
              <span className="font-mono tabular-nums hidden md:block">
                <span className="text-lg font-bold text-white">{slideIndex + 1}</span>
                <span className="text-white/40"> / {totalSlides}</span>
              </span>
              {currentSlide && slideTypeInfo && (
                <Badge variant="outline" className="border-white/20 text-white/70 text-[10px]">
                  {slideTypeInfo.label}
                </Badge>
              )}
            </div>
          )}
          {activeTool !== 'courseware' && (
            <div className="text-sm text-white/60 hidden md:flex items-center gap-2">
              {TOOLS.find((t) => t.id === activeTool)?.emoji} {TOOLS.find((t) => t.id === activeTool)?.label}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* 硬件状态指示器 */}
          <HardwareStatusBar
            status={hardwareStatus}
            deviceName={hardwareDevice}
            onOpenConsole={() => {
              setActiveTool('hardware');
              toast.info('硬件控制台请前往硬件生态页使用');
            }}
          />

          {/* 全屏按钮 */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              if (document.fullscreenElement) {
                document.exitFullscreen().catch(() => {});
              } else {
                document.documentElement.requestFullscreen().catch(() => {});
              }
            }}
            className="text-white/70 hover:text-white hover:bg-white/10 hidden md:flex"
            title="全屏 (F)"
          >
            <Maximize2 className="size-4" />
          </Button>

          {!isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSideCollapsed(!sideCollapsed)}
              className="text-white/70 hover:text-white hover:bg-white/10"
              title={sideCollapsed ? '展开工具栏' : '收起工具栏'}
            >
              {sideCollapsed ? <PanelRightOpen className="size-4" /> : <PanelRightClose className="size-4" />}
            </Button>
          )}
        </div>
      </header>

      {/* 主体区 */}
      <div className="flex-1 flex overflow-hidden">
        {/* 主区域 */}
        <main className="flex-1 flex flex-col overflow-hidden relative">
          {/* 课件展示 */}
          {activeTool === 'courseware' && currentSlide && (
            <div
              ref={slideContainerRef}
              className="flex-1 flex items-center justify-center p-4 md:p-10 relative overflow-hidden"
            >
              {/* 装饰背景 */}
              <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
              <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

              {/* 翻页按钮 */}
              <button
                onClick={prevSlide}
                disabled={slideIndex === 0}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 size-11 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/15 flex items-center justify-center text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="上一页"
              >
                <ChevronLeft className="size-6" />
              </button>
              <button
                onClick={nextSlide}
                disabled={slideIndex === totalSlides - 1}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 size-11 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/15 flex items-center justify-center text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="下一页"
              >
                <ChevronRight className="size-6" />
              </button>

              {/* 幻灯片 */}
              <div className="relative w-full max-w-4xl aspect-[16/9]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={slideIndex}
                    initial={{ opacity: 0, x: slideDirection === 'right' ? 60 : -60 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: slideDirection === 'right' ? -60 : 60 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/95 to-white/90 text-slate-900 shadow-2xl shadow-black/40 p-8 md:p-12 flex flex-col border border-white/20"
                  >
                    {/* 类型标签 + 右上角课程名 */}
                    <div className="flex items-center justify-between mb-6">
                      <Badge
                        className={`bg-primary/10 text-primary border-primary/20 ${slideTypeInfo?.color || ''}`}
                        style={slideTypeInfo ? {} : undefined}
                      >
                        {slideTypeInfo?.label || '知识讲解'}
                      </Badge>
                      <div className="text-xs text-muted-foreground font-mono tabular-nums">
                        {lesson.title} · 第 {slideIndex + 1} 页
                      </div>
                    </div>

                    {/* 标题 */}
                    <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-foreground mb-6 md:mb-8">
                      {currentSlide.title}
                    </h2>

                    {/* 要点列表 */}
                    <ul className="space-y-3 md:space-y-4 flex-1">
                      {currentSlide.points.map((point, i) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.15 + i * 0.1, duration: 0.4 }}
                          className="flex items-start gap-3 text-base md:text-xl leading-relaxed"
                        >
                          <span className="text-primary mt-2 shrink-0">•</span>
                          <span className="text-foreground/90">{point}</span>
                        </motion.li>
                      ))}
                    </ul>

                    {/* 底部：知识点标签 + 页码 */}
                    <div className="mt-auto pt-4 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <Lightbulb className="size-4" />
                        <span>知识点：{currentSlide.title}</span>
                      </div>
                      <span className="font-mono tabular-nums">
                        {String(slideIndex + 1).padStart(2, '0')} / {String(totalSlides).padStart(2, '0')}
                      </span>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* 已有批注的预览（非批注模式下显示，淡） */}
                {!annotationActive && currentAnnotationUrl && (
                  <Image
                    src={currentAnnotationUrl}
                    alt="批注预览"
                    className="absolute inset-0 w-full h-full pointer-events-none opacity-40 rounded-2xl"
                  />
                )}
              </div>

              {/* 角落吉祥物 */}
              <div className="absolute bottom-4 right-4 md:bottom-6 md:right-6 size-14 md:size-20 pointer-events-none">
                <Image
                  src={MASCOT_IMG}
                  alt="智象"
                  className="w-full h-full object-contain drop-shadow-lg"
                />
              </div>

              {/* 黑板批注 Canvas */}
              <AnnotationCanvas
                active={annotationActive}
                onClose={() => setAnnotationActive(false)}
                containerRef={slideContainerRef}
                initialDataUrl={currentAnnotationUrl}
                onSave={handleAnnotationSave}
              />
            </div>
          )}

          {/* 实验 */}
          {activeTool === 'experiment' && (
            <div className="flex-1 overflow-y-auto p-4 md:p-8">
              <div className="max-w-3xl mx-auto space-y-6">
                <div className="flex items-start gap-4 mb-2">
                  <div className="size-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shrink-0 shadow-lg">
                    <FlaskConical className="size-7 text-white" />
                  </div>
                  <div>
                    <div className="text-sm text-white/50">动手实验</div>
                    <h2 className="text-2xl md:text-3xl font-bold text-white">{lesson.experiment.name}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="border-white/20 text-white/70">
                        难度：{lesson.experiment.difficulty}
                      </Badge>
                      <Badge variant="outline" className="border-white/20 text-white/70">
                        {lesson.duration} 分钟
                      </Badge>
                    </div>
                  </div>
                </div>

                {lesson.experiment.relatedAiLabProjectId && (
                  <div className="bg-gradient-to-r from-primary/20 to-purple-500/20 border border-primary/30 rounded-2xl p-4 flex items-center justify-between gap-4 backdrop-blur-sm">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="size-10 rounded-xl bg-primary/30 flex items-center justify-center shrink-0">
                        <Sparkles className="size-5 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-white">AI 实验室关联实验</div>
                        <div className="text-xs text-white/60 truncate">
                          点击前往 AI 实验室，交互式体验完整实验
                        </div>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => {
                        window.open(`/ai-lab/project/${lesson.experiment.relatedAiLabProjectId}`, '_blank');
                      }}
                      className="shrink-0"
                    >
                      打开 AI 实验室
                      <ArrowRight className="size-3.5 ml-1" />
                    </Button>
                  </div>
                )}

                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-sm">
                  <h3 className="text-sm font-semibold text-white/80 mb-3 flex items-center gap-2">
                    <Sparkles className="size-4 text-amber-400" />
                    实验材料
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {lesson.experiment.materials.map((m) => (
                      <Badge key={m} variant="outline" className="border-white/20 text-white/80 bg-white/5">
                        {m}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-sm">
                  <h3 className="text-sm font-semibold text-white/80 mb-4 flex items-center gap-2">
                    <BookOpen className="size-4 text-primary" />
                    操作步骤
                  </h3>
                  <div className="space-y-4">
                    {lesson.experiment.steps.map((step, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08 }}
                        className="flex gap-4"
                      >
                        <div className="flex flex-col items-center">
                          <div className="size-9 rounded-full bg-gradient-to-br from-primary to-purple-500 text-white flex items-center justify-center text-sm font-bold shrink-0 shadow-lg shadow-primary/30">
                            {i + 1}
                          </div>
                          {i < lesson.experiment.steps.length - 1 && (
                            <div className="w-px flex-1 bg-white/10 my-1.5" />
                          )}
                        </div>
                        <div className="flex-1 pt-1 pb-4">
                          <p className="text-white/90 leading-relaxed">{step}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 编程 */}
          {activeTool === 'coding' && (
            <div className="flex-1 overflow-y-auto p-4 md:p-8">
              <div className="max-w-3xl mx-auto space-y-6">
                <div className="flex items-start gap-4 mb-2">
                  <div className="size-14 rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-500 flex items-center justify-center shrink-0 shadow-lg">
                    <Code2 className="size-7 text-white" />
                  </div>
                  <div>
                    <div className="text-sm text-white/50">编程工具</div>
                    <h2 className="text-2xl md:text-3xl font-bold text-white">本课推荐编程工具</h2>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { name: '图形化编程', desc: 'Scratch / MakeCode 等拖拽式编程环境', color: 'from-pink-500 to-rose-500' },
                    { name: 'Python 编程', desc: 'Thonny / Mu 等 Python 代码环境', color: 'from-blue-500 to-indigo-500' },
                    { name: '掌控板编程', desc: 'mPython 图形化 + Python 双模式', color: 'from-emerald-500 to-teal-500' },
                    { name: 'micro:bit', desc: 'MakeCode for micro:bit 编程平台', color: 'from-amber-500 to-orange-500' },
                  ].map((item, i) => (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className="rounded-2xl bg-white/5 border border-white/10 p-5 hover:bg-white/10 transition-colors cursor-pointer backdrop-blur-sm"
                      onClick={() => navigate('/coding-lab')}
                    >
                      <div className={`size-10 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-3 shadow-md`}>
                        <Code2 className="size-5 text-white" />
                      </div>
                      <div className="font-semibold text-white">{item.name}</div>
                      <div className="text-sm text-white/50 mt-1">{item.desc}</div>
                      <div className="text-xs text-white/40 mt-3">点击跳转到编程实验室 →</div>
                    </motion.div>
                  ))}
                </div>

                <div className="rounded-2xl bg-primary/10 border border-primary/20 p-5">
                  <div className="flex items-start gap-3">
                    <Lightbulb className="size-5 text-primary shrink-0 mt-0.5" />
                    <div className="text-sm text-white/80 leading-relaxed">
                      <span className="font-semibold text-white">教学提示：</span>
                      本课编程环节可根据学校实际硬件与软件环境灵活选择工具。
                      建议以图形化编程入门，逐步过渡到代码编程，培养学生计算思维。
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 教案 */}
          {activeTool === 'lesson-plan' && (
            <div className="flex-1 overflow-y-auto p-4 md:p-8">
              <div className="max-w-3xl mx-auto space-y-6">
                <div className="flex items-start gap-4 mb-2">
                  <div className="size-14 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center shrink-0 shadow-lg">
                    <FileText className="size-7 text-white" />
                  </div>
                  <div>
                    <div className="text-sm text-white/50">教案</div>
                    <h2 className="text-2xl md:text-3xl font-bold text-white">
                      第 {lesson.lessonIndex} 课 教案
                    </h2>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="border-white/20 text-white/70">
                        {lesson.duration} 分钟
                      </Badge>
                      <Badge variant="outline" className="border-white/20 text-white/70">
                        {stageLabel}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-sm">
                  <h3 className="text-sm font-semibold text-white/80 mb-3 flex items-center gap-2">
                    <Sparkles className="size-4 text-violet-400" />
                    教学目标
                  </h3>
                  <ul className="space-y-2">
                    {lesson.objectives.map((obj, i) => (
                      <li key={i} className="flex gap-2 text-white/90 text-sm">
                        <span className="text-violet-400 shrink-0">•</span>
                        <span>{obj}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-sm">
                  <h3 className="text-sm font-semibold text-white/80 mb-3 flex items-center gap-2">
                    <BookOpen className="size-4 text-primary" />
                    教学过程
                  </h3>
                  <div className="space-y-4">
                    {[
                      { label: '情境导入', content: lesson.lessonPlan.introduction },
                      { label: '核心知识', content: lesson.lessonPlan.keyPoints.join('\n') },
                      { label: '教学活动', content: lesson.lessonPlan.activities.join('\n') },
                      { label: '课堂小结', content: lesson.lessonPlan.summary },
                    ].map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08 }}
                        className="flex gap-3"
                      >
                        <div className="size-7 rounded-full bg-violet-500/30 text-violet-300 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                          {i + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-white mb-1">{item.label}</div>
                          <p className="text-white/70 text-sm whitespace-pre-line leading-relaxed">
                            {item.content}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-sm">
                  <h3 className="text-sm font-semibold text-white/80 mb-3 flex items-center gap-2">
                    <Cpu className="size-4 text-amber-400" />
                    重难提示
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {lesson.lessonPlan.keyPoints.map((p, i) => (
                      <Badge
                        key={i}
                        variant="outline"
                        className="border-white/20 text-white/80 bg-white/5"
                      >
                        {p}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 作业 */}
          {activeTool === 'homework' && (
            <div className="flex-1 overflow-y-auto p-4 md:p-8">
              <div className="max-w-3xl mx-auto space-y-6">
                <div className="flex items-start gap-4 mb-2">
                  <div className="size-14 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center shrink-0 shadow-lg">
                    <ClipboardList className="size-7 text-white" />
                  </div>
                  <div>
                    <div className="text-sm text-white/50">课后作业</div>
                    <h2 className="text-2xl md:text-3xl font-bold text-white">
                      {lesson.homework.title}
                    </h2>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="border-white/20 text-white/70">
                        {lesson.homework.type}作业
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-sm">
                  <h3 className="text-sm font-semibold text-white/80 mb-3 flex items-center gap-2">
                    <BookOpen className="size-4 text-rose-400" />
                    作业要求
                  </h3>
                  <p className="text-white/90 text-sm leading-relaxed whitespace-pre-line">
                    {lesson.homework.description}
                  </p>
                </div>

                <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-5">
                  <div className="flex items-start gap-3">
                    <Lightbulb className="size-5 text-rose-400 shrink-0 mt-0.5" />
                    <div className="text-sm text-white/80 leading-relaxed">
                      <span className="font-semibold text-white">作业评价建议：</span>
                      作业以过程性评价为主，鼓励学生的探究精神与创新意识。
                      优秀作业可在下节课进行展示分享，激发学习积极性。
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* AI助手已移至全局浮动面板，授课模式请点击右下角 AI 助手按钮 */}

          {/* 硬件 */}
          {activeTool === 'hardware' && (
            <div className="flex-1 overflow-y-auto p-4 md:p-8">
              <div className="max-w-3xl mx-auto space-y-6">
                <div className="flex items-start gap-4 mb-2">
                  <div className="size-14 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shrink-0 shadow-lg">
                    <Cpu className="size-7 text-white" />
                  </div>
                  <div>
                    <div className="text-sm text-white/50">硬件提示</div>
                    <h2 className="text-2xl md:text-3xl font-bold text-white">本课相关硬件</h2>
                  </div>
                </div>

                {lesson.hardwareTips && lesson.hardwareTips.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {lesson.hardwareTips.map((hw, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08 }}
                        className="rounded-2xl bg-white/5 border border-white/10 p-5 hover:bg-white/10 transition-colors cursor-pointer backdrop-blur-sm"
                        onClick={() => navigate('/hardware')}
                      >
                        <div className="flex items-center gap-3">
                          <div className="size-12 rounded-xl bg-orange-500/20 flex items-center justify-center">
                            <Cpu className="size-6 text-orange-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-white truncate">{hw}</div>
                            <div className="text-xs text-white/50">点击查看硬件详情</div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-2xl bg-white/5 border border-white/10 p-10 text-center backdrop-blur-sm">
                    <Cpu className="size-12 text-white/20 mx-auto mb-3" />
                    <p className="text-white/60">本节课暂无特定硬件要求</p>
                    <p className="text-sm text-white/40 mt-1">可使用通用计算机设备开展教学</p>
                  </div>
                )}

                <div className="rounded-2xl bg-amber-500/10 border border-amber-500/20 p-5">
                  <div className="flex items-start gap-3">
                    <Lightbulb className="size-5 text-amber-400 shrink-0 mt-0.5" />
                    <div className="text-sm text-white/80 leading-relaxed">
                      <span className="font-semibold text-white">温馨提示：</span>
                      实验前请检查设备电量、连接状态与安全事项；
                      建议提前 5 分钟完成设备分发与开机准备，保证课堂时间高效利用。
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 底部栏 (课件模式) */}
          {activeTool === 'courseware' && (
            <div className="border-t border-white/10 bg-black/20 backdrop-blur-md px-4 md:px-6 py-3 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <div className="size-6 rounded-md bg-primary/20 flex items-center justify-center shrink-0">
                  <Lightbulb className="size-3.5 text-primary" />
                </div>
                <p className="text-xs md:text-sm text-white/60 truncate">
                  {currentSlide
                    ? currentSlide.type === 'summary'
                      ? '本页小结：引导学生回顾本节课收获，布置课后作业'
                      : currentSlide.points[0] || ''
                    : ''}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0 ml-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={prevSlide}
                  disabled={slideIndex === 0}
                  className="border-white/20 text-white/80 hover:bg-white/10 hover:text-white bg-transparent h-8"
                >
                  <ChevronLeft className="size-4" />
                  <span className="hidden md:inline">上一页</span>
                </Button>
                <div className="text-xs text-white/40 font-mono tabular-nums min-w-[50px] text-center">
                  {slideIndex + 1}/{totalSlides}
                </div>
                <Button
                  size="sm"
                  onClick={nextSlide}
                  disabled={slideIndex === totalSlides - 1}
                  className="h-8"
                >
                  <span className="hidden md:inline">下一页</span>
                  <ChevronRight className="size-4" />
                </Button>
              </div>
            </div>
          )}
        </main>

        {/* 右侧工具栏（桌面端） */}
        {!isMobile && (
          <aside
            className={`border-l border-white/10 bg-black/30 backdrop-blur-md flex flex-col transition-all duration-300 ${
              sideCollapsed ? 'w-16' : 'w-72'
            } shrink-0`}
          >
            {/* 工具按钮 */}
            <div className="p-2 border-b border-white/10 flex flex-col gap-1">
              {TOOLS.map((tool) => {
                const Icon = tool.icon;
                const isActive = activeTool === tool.id;
                return (
                  <button
                    key={tool.id}
                    onClick={() => setActiveTool(tool.id)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                      isActive
                        ? 'bg-primary/25 text-white border border-primary/40 shadow-lg shadow-primary/10'
                        : 'text-white/60 hover:text-white hover:bg-white/10'
                    }`}
                    title={tool.label}
                  >
                    <Icon className="size-5 shrink-0" />
                    {!sideCollapsed && (
                      <span className="text-sm font-medium truncate">{tool.label}</span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* 工具内容区 - 侧边栏的 AI 助手已移至全局浮动面板 */}
            {!sideCollapsed && activeTool === 'hardware' && (
              <div className="flex-1 p-3 overflow-y-auto">
                <div className="text-center py-6">
                  <div className="size-12 mx-auto mb-3 rounded-xl bg-orange-500/20 flex items-center justify-center">
                    <Cpu className="size-6 text-orange-400" />
                  </div>
                  <h4 className="text-sm font-medium text-white mb-1">硬件连接</h4>
                  <p className="text-xs text-white/50 mb-3">
                    状态：<span className={hardwareStatus === 'connected' ? 'text-emerald-400' : 'text-white/50'}>
                      {hardwareStatus === 'connected' ? '已连接' : hardwareStatus === 'connecting' ? '连接中' : '未连接'}
                    </span>
                  </p>
                  {hardwareDevice && (
                    <p className="text-xs text-white/60 mb-3">{hardwareDevice}</p>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-white/20 text-white/80 hover:bg-white/10 bg-transparent"
                    onClick={handleHardwareConnect}
                    disabled={hardwareStatus === 'connecting'}
                  >
                    {hardwareStatus === 'connecting' && <Loader2 className="size-3.5 mr-1.5 animate-spin" />}
                    {hardwareStatus === 'connected' ? '断开连接' : '连接硬件'}
                  </Button>
                </div>
              </div>
            )}

            {!sideCollapsed && activeTool === 'coding' && (
              <div className="flex-1 p-3 overflow-y-auto space-y-2">
                <p className="text-xs text-white/40 px-1 mb-1">编程工具快捷入口</p>
                {[
                  { name: 'Scratch', desc: '图形化编程', color: 'from-pink-500 to-rose-500' },
                  { name: 'Python', desc: '代码编程', color: 'from-blue-500 to-indigo-500' },
                  { name: '掌控板', desc: 'mPython', color: 'from-emerald-500 to-teal-500' },
                  { name: 'micro:bit', desc: 'MakeCode', color: 'from-amber-500 to-orange-500' },
                ].map((item) => (
                  <button
                    key={item.name}
                    onClick={() => {
                      window.open('/coding-lab', '_blank');
                    }}
                    className="w-full flex items-center gap-2.5 p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-left"
                  >
                    <div className={`size-8 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center shrink-0`}>
                      <Code2 className="size-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-white">{item.name}</div>
                      <div className="text-[11px] text-white/50">{item.desc}</div>
                    </div>
                    <ChevronRight className="size-3.5 text-white/30 shrink-0" />
                  </button>
                ))}
                <p className="text-[11px] text-white/30 text-center pt-2">新窗口打开 · 不中断授课</p>
              </div>
            )}

            {!sideCollapsed && activeTool === 'courseware' && (
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                <div className="text-xs text-white/40 px-2 mb-1">课件页码</div>
                {slides.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setSlideDirection(i > slideIndex ? 'right' : 'left');
                      setSlideIndex(i);
                    }}
                    className={`w-full text-left p-2.5 rounded-lg transition-all ${
                      i === slideIndex
                        ? 'bg-primary/25 border border-primary/40 text-white'
                        : 'text-white/60 hover:bg-white/10 border border-transparent'
                    }`}
                  >
                    <div className="text-xs font-mono text-white/40 mb-0.5">
                      第 {i + 1} 页
                    </div>
                    <div className="text-sm font-medium truncate">{s.title}</div>
                  </button>
                ))}
              </div>
            )}

            {!sideCollapsed && activeTool === 'notes' && (
              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="px-3 pt-3 pb-2 border-b border-white/10 flex items-center justify-between">
                  <div className="text-xs font-medium text-white/80">📝 备课笔记</div>
                  <span className={`text-[10px] ${notesSaved ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {notesSaved ? '已保存' : '保存中...'}
                  </span>
                </div>
                <textarea
                  value={prepareNotes}
                  onChange={(e) => setPrepareNotes(e.target.value)}
                  placeholder="在这里记录你的备课笔记、课堂提示、补充素材...

例如：
• 第3页可以举个生活中的例子
• 实验环节注意时间控制
• 提前准备好掌控板"
                  className="flex-1 w-full bg-transparent text-white/80 text-sm p-3 resize-none focus:outline-none placeholder:text-white/30 leading-relaxed"
                />
              </div>
            )}

            {!sideCollapsed && activeTool !== 'courseware' && activeTool !== 'notes' && activeTool !== 'coding' && activeTool !== 'hardware' && (
              <div className="flex-1 p-4 flex items-center justify-center">
                <p className="text-sm text-white/40 text-center">
                  主区域已显示{TOOLS.find((t) => t.id === activeTool)?.label}内容
                </p>
              </div>
            )}
          </aside>
        )}
      </div>

      {/* 移动端底部 Tab 栏 */}
      {isMobile && (
        <nav className="border-t border-white/10 bg-black/40 backdrop-blur-md flex items-center justify-around py-1.5 shrink-0">
          {TOOLS.map((tool) => {
            const Icon = tool.icon;
            const isActive = activeTool === tool.id;
            return (
              <button
                key={tool.id}
                onClick={() => setActiveTool(tool.id)}
                className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg transition-all ${
                  isActive ? 'text-primary' : 'text-white/50'
                }`}
              >
                <Icon className="size-5" />
                <span className="text-[10px]">{tool.label}</span>
              </button>
            );
          })}
        </nav>
      )}

      {/* ===== 课堂浮动工具栏 ===== */}
      <ClassroomToolbar
        collapsed={toolbarCollapsed}
        onToggleCollapse={() => setToolbarCollapsed(!toolbarCollapsed)}
        onAnnotation={() => {
          if (activeTool !== 'courseware') {
            setActiveTool('courseware');
            toast.info('批注功能仅在课件模式下使用');
          }
          setAnnotationActive((v) => !v);
          setAnnotationDirty(true);
        }}
        annotationActive={annotationActive}
        onTimer={() => setTimerOpen(!timerOpen)}
        timerOpen={timerOpen || timerMinimized}
        onPicker={() => setPickerOpen(!pickerOpen)}
        pickerOpen={pickerOpen}
        onSpotlight={() => setSpotlightActive(!spotlightActive)}
        spotlightActive={spotlightActive}
        onVote={() => setVoteOpen(!voteOpen)}
        voteOpen={voteOpen}
        isMobile={isMobile}
      />

      {/* 计时器面板 */}
      <TimerPanel
        open={timerOpen}
        onClose={() => {
          setTimerOpen(false);
          setTimerMinimized(false);
        }}
        minimized={timerMinimized}
        onToggleMinimize={() => setTimerMinimized(!timerMinimized)}
      />

      {/* 随机点名 */}
      <RandomPicker open={pickerOpen} onClose={() => setPickerOpen(false)} />

      {/* 投票 */}
      <VotePanel open={voteOpen} onClose={() => setVoteOpen(false)} />

      {/* 聚光灯 */}
      <SpotlightOverlay
        active={spotlightActive}
        onDeactivate={() => setSpotlightActive(false)}
        size={spotlightSize}
      />

      {/* AI 全屏回答 */}
      <AiFullscreenAnswer
        open={aiFullscreenOpen}
        onClose={() => setAiFullscreenOpen(false)}
        content={aiFullscreenContent}
        question={aiFullscreenQuestion}
      />

      {/* 退出确认对话框 */}
      <ExitConfirmDialog
        open={exitConfirmOpen}
        onClose={() => setExitConfirmOpen(false)}
        onSaveAndExit={handleSaveAndExit}
        onDiscardAndExit={handleDiscardAndExit}
        hasUnsavedAnnotation={annotationDirty}
        timerRunning={timerRunning}
      />

      {/* 快捷键帮助 */}
      <ShortcutsHelp open={shortcutsOpen} onOpenChange={setShortcutsOpen} />

      {/* 首次进入引导 */}
      {showOnboarding && (
        <OnboardingGuide
          step={onboardingStep}
          totalSteps={ONBOARDING_STEPS.length}
          title={ONBOARDING_STEPS[onboardingStep].title}
          description={ONBOARDING_STEPS[onboardingStep].description}
          onNext={nextOnboardingStep}
          onSkip={closeOnboarding}
          onPrev={onboardingStep > 0 ? prevOnboardingStep : undefined}
        />
      )}

      {/* 快捷键提示（首屏短暂显示） */}
      <ShortcutsHint />
    </div>
  );
}

// ===== 快捷键首次提示 =====
function ShortcutsHint() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 5000);
    return () => clearTimeout(t);
  }, []);

  if (!visible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="fixed bottom-24 left-1/2 -translate-x-1/2 z-30 bg-slate-900/80 backdrop-blur-md border border-white/15 rounded-full px-4 py-2 text-xs text-white/50 flex items-center gap-4 shadow-lg"
    >
      <span>快捷键：← → 翻页</span>
      <span className="text-white/20">·</span>
      <span>B 批注</span>
      <span className="text-white/20">·</span>
      <span>T 计时</span>
      <span className="text-white/20">·</span>
      <span>F 全屏</span>
      <span className="text-white/20">·</span>
      <span>Esc 退出</span>
      <button
        onClick={() => setVisible(false)}
        className="text-white/40 hover:text-white ml-1"
      >
        ✕
      </button>
    </motion.div>
  );
}

// ===== AI 聊天面板组件 =====
interface AiChatPanelProps {
  messages: { role: 'user' | 'ai'; content: string }[];
  loading: boolean;
  input: string;
  setInput: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onAskSample: (q: string) => void;
  chatRef: React.RefObject<HTMLDivElement>;
  compact?: boolean;
  onFullscreen?: () => void;
  onAskAboutSlide?: () => void;
  showSlideContext?: boolean;
}

function AiChatPanel({
  messages,
  loading,
  input,
  setInput,
  onSubmit,
  onAskSample,
  chatRef,
  compact,
  onFullscreen,
  onAskAboutSlide,
  showSlideContext,
}: AiChatPanelProps) {
  const sampleQuestions = [
    '什么是机器学习？',
    '神经网络是怎么工作的？',
    'AI 是怎么识别图片的？',
    '什么是语音识别？',
  ];

  const lastAiMsg = [...messages].reverse().find((m) => m.role === 'ai' && m.content);
  const hasAiAnswer = !!lastAiMsg && lastAiMsg.content.length > 10;

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {!compact && (
        <div className="px-4 py-3 border-b border-white/10 flex items-center gap-2">
          <div className="size-8 rounded-lg bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center">
            <Bot className="size-4 text-white" />
          </div>
          <div>
            <div className="text-sm font-semibold text-white">AI 课堂助手</div>
            <div className="text-[10px] text-white/50">随时解答 AI 相关问题</div>
          </div>
        </div>
      )}

      {/* 上下文提示 */}
      {showSlideContext && onAskAboutSlide && messages.length <= 1 && (
        <div className="mx-3 mt-2 p-2 rounded-lg bg-primary/10 border border-primary/20">
          <button
            onClick={onAskAboutSlide}
            className="w-full text-left text-xs text-primary-foreground hover:underline flex items-center gap-1.5"
          >
            <Lightbulb className="size-3" />
            基于当前课件页提问
          </button>
        </div>
      )}

      {/* 消息区 */}
      <div
        ref={chatRef}
        className={`flex-1 overflow-y-auto p-3 space-y-3 ${compact ? 'max-h-[60vh]' : ''}`}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-primary text-white rounded-br-md'
                  : 'bg-white/10 text-white/90 rounded-bl-md border border-white/10'
              }`}
            >
              {msg.role === 'ai' ? (
                msg.content ? (
                  <div className="prose prose-sm prose-invert max-w-none text-[13px]">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 py-1">
                    <motion.div
                      animate={{ y: [0, -3, 0] }}
                      transition={{ duration: 0.8, repeat: Infinity, delay: 0 }}
                      className="size-1.5 rounded-full bg-white/60"
                    />
                    <motion.div
                      animate={{ y: [0, -3, 0] }}
                      transition={{ duration: 0.8, repeat: Infinity, delay: 0.2 }}
                      className="size-1.5 rounded-full bg-white/60"
                    />
                    <motion.div
                      animate={{ y: [0, -3, 0] }}
                      transition={{ duration: 0.8, repeat: Infinity, delay: 0.4 }}
                      className="size-1.5 rounded-full bg-white/60"
                    />
                  </div>
                )
              ) : (
                <span>{msg.content}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 全屏投影按钮 */}
      {hasAiAnswer && onFullscreen && (
        <div className="px-3 pt-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={onFullscreen}
            className="w-full h-8 text-xs bg-white/5 border-white/15 text-white/70 hover:bg-white/10"
          >
            <Maximize2 className="size-3.5 mr-1.5" />
            投影到大屏展示
          </Button>
        </div>
      )}

      {/* 示例问题 */}
      {messages.length <= 1 && (
        <div className="px-3 pb-2 pt-2">
          <div className="text-[10px] text-white/40 mb-1.5 flex items-center gap-1">
            <Lightbulb className="size-3" />
            试试问这些
          </div>
          <div className="flex flex-wrap gap-1.5">
            {sampleQuestions.map((q) => (
              <button
                key={q}
                onClick={() => onAskSample(q)}
                className="text-[11px] px-2 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-colors border border-white/10"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 输入区 */}
      <form onSubmit={onSubmit} className="p-3 border-t border-white/10">
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="问问 AI…"
            rows={2}
            className="text-sm bg-white/5 border-white/15 text-white placeholder:text-white/30 focus-visible:ring-primary/50 resize-none min-h-[60px]"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                onSubmit(e);
              }
            }}
          />
          <Button
            type="submit"
            size="icon"
            disabled={loading || !input.trim()}
            className="shrink-0"
          >
            {loading ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
          </Button>
        </div>
      </form>
    </div>
  );
}

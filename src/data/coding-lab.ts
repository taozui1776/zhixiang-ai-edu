// EXPORTS: ICodingTool, MOCK_CODING_TOOLS, MOCK_WEB_TOOLS, MOCK_LOCAL_TOOLS, SCHOOL_STAGES, TOOL_TYPES

export type SchoolStage = 'primary' | 'junior' | 'senior' | 'cross';

export type ToolType = 'graphical' | 'python' | 'aivision' | 'simulation' | 'hybrid';

export type ToolCategory = 'web' | 'local';

export interface ICodingTool {
  id: string;
  name: string;
  englishName: string;
  description: string;
  url: string;
  stages: SchoolStage[];
  toolTypes: ToolType[];
  isOpenSource: boolean;
  hardware?: string;
  platform?: string;
  category: ToolCategory;
  embeddable?: boolean;
  embedUrl?: string;   // 内嵌专用 URL（与新窗口打开的 url 不同时使用）
  embedNote?: string;   // 内嵌说明/限制提示
  logo: string;
  accentColor: string;
}

export const SCHOOL_STAGES: { value: SchoolStage; label: string; color: string }[] = [
  { value: 'primary', label: '小学', color: 'emerald' },
  { value: 'junior', label: '初中', color: 'sky' },
  { value: 'senior', label: '高中', color: 'violet' },
  { value: 'cross', label: '跨学段', color: 'amber' },
];

export const TOOL_TYPES: Record<ToolType, string> = {
  graphical: '图形化编程',
  python: 'Python 编程',
  aivision: 'AI 视觉',
  simulation: '仿真模拟',
  hybrid: '图形化 + 代码',
};

export const MOCK_CODING_TOOLS: ICodingTool[] = [
  // ===== 网页在线工具 =====
  {
    id: 'scratch',
    name: 'Scratch',
    englishName: 'Scratch 3.0',
    description: 'MIT 媒体实验室开发的全球最流行图形化编程平台，拖拽积木创作互动故事、游戏与动画，是小学 AI 与编程入门的首选工具。',
    url: 'https://scratch.mit.edu/projects/editor/',
    stages: ['primary'],
    toolTypes: ['graphical'],
    isOpenSource: true,
    hardware: '无需硬件',
    category: 'web',
    embeddable: true,
    embedUrl: 'https://create.codelab.club/',
    embedNote: '内嵌使用 CodeLab 国内 Scratch 镜像，加载更快，支持中文界面',
    logo: '🐱',
    accentColor: 'from-orange-400 to-amber-500',
  },
  {
    id: 'makecode',
    name: 'MakeCode micro:bit',
    englishName: 'Microsoft MakeCode',
    description: '微软官方 micro:bit 在线编辑器，积木块与 JavaScript 双模式切换，支持模拟器运行与 WebUSB 直接烧录到硬件。',
    url: 'https://makecode.microbit.org/',
    stages: ['primary', 'junior'],
    toolTypes: ['hybrid'],
    isOpenSource: true,
    hardware: 'micro:bit V1/V2',
    category: 'web',
    embeddable: true,
    embedUrl: 'https://makecode.microbit.org/',
    embedNote: '微软官方支持 iframe 嵌入，支持积木块与 JavaScript 双模式',
    logo: '🟪',
    accentColor: 'from-purple-500 to-indigo-600',
  },
  {
    id: 'mindplus-online',
    name: 'Mind+ 在线版',
    englishName: 'Mind+ Online',
    description: '国产图形化编程平台，支持实时模式、上传模式、Python 积木与代码多模式切换，适配掌控板、micro:bit 等多款主控板。',
    url: 'https://ide.mindplus.top/',
    stages: ['primary', 'junior'],
    toolTypes: ['hybrid'],
    isOpenSource: false,
    hardware: '掌控板 / micro:bit / Arduino',
    category: 'web',
    embeddable: false,
    embedNote: '国产商业平台，限制 iframe 嵌入，新窗口打开使用',
    logo: '🤖',
    accentColor: 'from-amber-400 to-orange-500',
  },
  {
    id: 'kittenblock',
    name: 'Kittenblock 网页版',
    englishName: 'Kittenblock Web',
    description: '小喵科技出品的图形化编程工具网页版，支持 micro:bit、掌控板等多种硬件，内置丰富的 AI 功能扩展模块。',
    url: 'https://kblock.kittenbot.cn/',
    stages: ['primary'],
    toolTypes: ['graphical'],
    isOpenSource: false,
    hardware: '掌控板 / micro:bit',
    category: 'web',
    embeddable: false,
    embedNote: '国产商业平台，限制 iframe 嵌入，新窗口打开使用',
    logo: '🐱',
    accentColor: 'from-teal-400 to-cyan-500',
  },
  {
    id: 'mblock',
    name: 'mBlock 慧编程',
    englishName: 'mBlock',
    description: '童心制物出品的图形化编程平台，支持积木块与 Python 代码切换，集成 AI 认知服务，适配 CyberPi、光环板等硬件。',
    url: 'https://mblock.cc/',
    stages: ['primary', 'junior'],
    toolTypes: ['hybrid'],
    isOpenSource: false,
    hardware: 'CyberPi / 光环板 / micro:bit',
    category: 'web',
    embeddable: false,
    embedNote: '国产商业平台，限制 iframe 嵌入，新窗口打开使用',
    logo: '🐼',
    accentColor: 'from-blue-500 to-indigo-500',
  },
  {
    id: 'openblock',
    name: 'OpenBlock 在线',
    englishName: 'OpenBlock',
    description: '完全开源的图形化编程平台，支持 Arduino、micro:bit、ESP32 等多种硬件，社区驱动，适合开展开源硬件教学实践。',
    url: 'https://openblock.online/',
    stages: ['primary', 'junior'],
    toolTypes: ['graphical'],
    isOpenSource: true,
    hardware: 'Arduino / micro:bit / ESP32',
    category: 'web',
    embeddable: false,
    embedNote: '开源平台但登录同步等功能受 iframe 限制，建议新窗口打开',
    logo: '🧩',
    accentColor: 'from-green-500 to-emerald-600',
  },
  {
    id: 'jupyterlite',
    name: 'JupyterLite',
    englishName: 'JupyterLite',
    description: '纯网页运行的 Jupyter Lab，无需安装任何环境即可在浏览器中编写和运行 Python 代码，适合高中 AI 与数据科学入门。',
    url: 'https://jupyter.org/try-jupyter/lab/',
    stages: ['senior'],
    toolTypes: ['python'],
    isOpenSource: true,
    hardware: '无需硬件',
    category: 'web',
    embeddable: true,
    embedUrl: 'https://jupyter.org/try-jupyter/lab/index.html',
    embedNote: '纯前端 JupyterLab，无需后端即可内嵌运行 Python',
    logo: '📓',
    accentColor: 'from-orange-500 to-red-500',
  },
  {
    id: 'phet',
    name: 'PhET 仿真实验',
    englishName: 'PhET Simulations',
    description: '诺贝尔获奖团队开发的互动科学仿真实验，涵盖物理、生物、化学、数学等学科，为理解 AI 底层原理提供直观体验。',
    url: 'https://phet.colorado.edu/zh_CN/',
    stages: ['primary', 'junior', 'senior', 'cross'],
    toolTypes: ['simulation'],
    isOpenSource: true,
    hardware: '无需硬件',
    category: 'web',
    embeddable: false,
    embedNote: '单款仿真可嵌入，但首页为目录浏览页，推荐新窗口打开选择实验',
    logo: '🔬',
    accentColor: 'from-cyan-500 to-blue-500',
  },
  // ===== 本地安装软件 =====
  {
    id: 'thonny',
    name: 'Thonny',
    englishName: 'Thonny Python IDE',
    description: '专为初学者设计的轻量级 Python IDE，界面简洁、调试直观，内置可视化调试器，是初高中 Python 入门教学的最佳选择。',
    url: 'https://thonny.org/',
    stages: ['junior', 'senior'],
    toolTypes: ['python'],
    isOpenSource: true,
    hardware: '通用（无特定硬件）',
    platform: 'Windows / macOS / Linux',
    category: 'local',
    logo: '🐍',
    accentColor: 'from-green-500 to-emerald-600',
  },
  {
    id: 'mu-editor',
    name: 'Mu 编辑器',
    englishName: 'Mu Editor',
    description: '专为初学者和教育场景设计的简洁 Python 编辑器，支持 micro:bit、Adafruit CircuitPython 等多种硬件模式，操作简单上手快。',
    url: 'https://codewith.mu/',
    stages: ['primary', 'junior'],
    toolTypes: ['python'],
    isOpenSource: true,
    hardware: 'micro:bit / CircuitPython 开发板',
    platform: 'Windows / macOS / Linux',
    category: 'local',
    logo: '🎵',
    accentColor: 'from-pink-500 to-rose-500',
  },
  {
    id: 'mindplus-desktop',
    name: 'Mind+ 客户端',
    englishName: 'Mind+ Desktop',
    description: 'DFRobot 出品的 Mind+ 桌面版，图形化与代码双模式，支持更多硬件和完整功能，适合需要硬件直连的课堂教学。',
    url: 'https://mindplus.dfrobot.com.cn/',
    stages: ['primary', 'junior'],
    toolTypes: ['hybrid'],
    isOpenSource: false,
    hardware: '掌控板 / micro:bit / Arduino / 行空板',
    platform: 'Windows / macOS',
    category: 'local',
    logo: '🤖',
    accentColor: 'from-amber-500 to-orange-600',
  },
  {
    id: 'mpythonx',
    name: 'mPython X',
    englishName: 'mPython X',
    description: '盛思官方掌控板编程软件，支持图形化与 MicroPython 代码双模式，专为掌控板系列硬件深度优化，内置大量传感器扩展库。',
    url: 'https://www.labplus.cn/software',
    stages: ['primary', 'junior'],
    toolTypes: ['hybrid'],
    isOpenSource: false,
    hardware: '掌控板 mPython v2.0',
    platform: 'Windows / macOS',
    category: 'local',
    logo: '💡',
    accentColor: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'canmv',
    name: 'CanMV IDE / MaixPy IDE',
    englishName: 'CanMV / MaixPy IDE',
    description: '专为 K210 / K230 AI 视觉开发板设计的 Python IDE，支持机器视觉、深度学习模型部署，适合高中 AI 视觉进阶课程与项目实践。',
    url: 'https://wiki.sipeed.com/soft/maixpy/zh/',
    stages: ['junior', 'senior'],
    toolTypes: ['python', 'aivision'],
    isOpenSource: true,
    hardware: '星空版 K210 / MaixCAM K230',
    platform: 'Windows / macOS / Linux',
    category: 'local',
    logo: '👁️',
    accentColor: 'from-purple-500 to-pink-500',
  },
];

// 仅网页在线
export const MOCK_WEB_TOOLS = MOCK_CODING_TOOLS.filter((t) => t.category === 'web');

// 仅本地软件
export const MOCK_LOCAL_TOOLS = MOCK_CODING_TOOLS.filter((t) => t.category === 'local');

// 按学段分组
export function getToolsByStage(stage: SchoolStage): ICodingTool[] {
  if (stage === 'cross') {
    return MOCK_CODING_TOOLS.filter((t) => t.stages.length >= 3);
  }
  return MOCK_CODING_TOOLS.filter((t) => t.stages.includes(stage));
}

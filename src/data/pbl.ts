// EXPORTS: IPblProject, IPblLesson, MOCK_PBL_PROJECTS, getPblProjectById, getAllPblProjects
import type { ResourceType } from './courses';

export type PblTechCategory =
  | '图像识别'
  | '语音交互'
  | '自然语言处理'
  | '生成式AI'
  | '机器学习'
  | 'AI通识';

export interface IPblLessonExperiment {
  name: string;
  type: 'ai-lab' | 'ai-tool' | 'code-lab' | 'tool';
  targetTab?: string;
  description: string;
}

export interface IPblCoursewareSlide {
  slideIndex: number;
  title: string;
  subtitle?: string;
  content: string;
  keyPoints: string[];
  illustration: string;
  type: 'cover' | 'knowledge' | 'case' | 'activity' | 'summary';
}

export interface IPblLesson {
  id: string;
  title: string;
  lessonIndex: number;
  duration: number; // 分钟
  description: string;
  knowledgePoints: string[]; // 核心知识点
  resourceTypes: ResourceType[];
  experiment?: string; // 配套实验名称（旧字段，兼容）
  experiments?: IPblLessonExperiment[]; // 完整实验信息
  relatedTools?: string[]; // 配套工具
  standardPoints?: string[]; // 课标对标条目
  slides?: IPblCoursewareSlide[]; // 课件页面
}

export interface IPblProject {
  id: string;
  title: string;
  subtitle: string; // 项目副标题（真实场景）
  stage: 'primary' | 'junior' | 'mixed';
  stageLabel: string;
  gradeRange: string; // 如 "小学高年级/初中"
  totalLessons: number;
  totalHours: number;
  techCategory: PblTechCategory;
  techTags: string[]; // AI技术标签
  iconKey: string; // 图标标识
  colorFrom: string; // 渐变起始色
  colorTo: string; // 渐变结束色
  drivingQuestion: string; // 驱动问题
  projectBackground: string; // 项目背景
  objectives: {
    knowledge: string[];
    ability: string[];
    literacy: string[];
  };
  lessons: IPblLesson[];
  tools: string[]; // 配套工具
  hardware: string[]; // 硬件清单
  extensionChallenges: string[]; // 拓展挑战
  showcase: string; // 成果展示建议
  standardAlignment: string[]; // 对标课标
}

export const MOCK_PBL_PROJECTS: IPblProject[] = [
  // 项目一：AI初体验
  {
    id: 'pbl-1',
    title: 'AI初体验',
    subtitle: '走进人工智能',
    stage: 'primary',
    stageLabel: '小学',
    gradeRange: '小学中高年级',
    totalLessons: 4,
    totalHours: 4,
    techCategory: 'AI通识',
    techTags: ['人工智能基础', '机器学习', 'AI伦理'],
    iconKey: 'sparkles',
    colorFrom: 'from-indigo-500',
    colorTo: 'to-purple-500',
    drivingQuestion: '人工智能到底是什么？它能帮我们做什么？',
    projectBackground:
      '从学生身边熟悉的智能音箱、扫地机器人、人脸识别门禁等场景切入，带领学生走进AI世界，了解AI的基本概念与发展历程，建立对人工智能的整体认知。',
    objectives: {
      knowledge: [
        '了解人工智能的定义与基本特征',
        '知道AI发展简史中的关键里程碑',
        '理解机器学习的基本概念与三种学习方式',
        '认识AI的能力边界与伦理问题',
      ],
      ability: [
        '能举例说出生活中的AI应用',
        '能区分AI与普通程序的不同',
        '能完成一个简单的AI实验项目',
        '能客观评价AI的优缺点',
      ],
      literacy: [
        '培养信息意识与数字化学习能力',
        '树立正确的AI伦理观念',
        '激发对人工智能的学习兴趣',
      ],
    },
    lessons: [
      {
        id: 'pbl-1-l1',
        title: '人工智能的起源和发展',
        lessonIndex: 1,
        duration: 40,
        description: '从生活中的AI现象出发，了解什么是人工智能、AI发展简史以及AI在各个领域的应用。',
        knowledgePoints: ['人工智能定义', 'AI发展简史', 'AI应用领域'],
        resourceTypes: ['教案', '课件'],
      },
      {
        id: 'pbl-1-l2',
        title: '认识机器学习',
        lessonIndex: 2,
        duration: 40,
        description: '对比机器学习与传统编程，了解监督学习、无监督学习、强化学习三种基本范式。',
        knowledgePoints: ['机器学习概念', '监督学习', '无监督学习', '强化学习'],
        resourceTypes: ['教案', '课件', '实验'],
        experiment: '机器学习分类小实验',
      },
      {
        id: 'pbl-1-l3',
        title: 'AI能做什么',
        lessonIndex: 3,
        duration: 40,
        description: '探索AI的能力边界，了解AI的优势与局限，讨论AI伦理与社会责任问题。',
        knowledgePoints: ['AI能力边界', 'AI的局限', 'AI伦理', '社会责任'],
        resourceTypes: ['教案', '课件'],
      },
      {
        id: 'pbl-1-l4',
        title: '我的第一个AI项目',
        lessonIndex: 4,
        duration: 40,
        description: '使用智象AI实验室完成一个简单的AI实验，体验从数据到模型的完整过程。',
        knowledgePoints: ['AI实验流程', '数据采集', '模型训练', '结果评估'],
        resourceTypes: ['教案', '课件', '实验'],
        experiment: '图像分类小实验',
      },
    ],
    tools: ['智象AI实验室', 'AI通识问答'],
    hardware: ['计算机/平板', '网络环境'],
    extensionChallenges: [
      '记录一周内你使用到的AI功能，制作一份"AI生活地图"',
      '采访家人对AI的看法，整理一份小调查报告',
      '畅想未来10年AI会如何改变我们的生活，画一幅科幻画',
    ],
    showcase: 'AI学习小报 + 课堂展示分享',
    standardAlignment: [
      '对标《中小学人工智能通识教育指南》AI基础模块',
      '对标安徽省AI通识教育纲要小学段"感知与体验"要求',
    ],
  },

  // 项目二：AI食堂升级计划
  {
    id: 'pbl-2',
    title: 'AI食堂升级计划',
    subtitle: '图像识别技术应用',
    stage: 'primary',
    stageLabel: '小学',
    gradeRange: '小学高年级',
    totalLessons: 6,
    totalHours: 6,
    techCategory: '图像识别',
    techTags: ['计算机视觉', '人脸检测', '物体分类', '颜色识别'],
    iconKey: 'camera',
    colorFrom: 'from-emerald-500',
    colorTo: 'to-teal-500',
    drivingQuestion: '如何用图像识别技术让学校食堂变得更智能、更高效？',
    projectBackground:
      '以"学校食堂智能化升级"为真实项目场景，围绕就餐中的人脸支付、餐盘识别、餐余分拣等真实问题，带领学生一步步学习图像识别的核心技术，并动手实践训练自己的图像分类模型。',
    objectives: {
      knowledge: [
        '了解计算机视觉的基本概念',
        '理解人脸检测与人脸识别的区别',
        '掌握颜色识别的基本原理',
        '了解物体分类与模型训练的基本流程',
      ],
      ability: [
        '能使用AI工具完成简单的人脸检测实验',
        '能训练一个简单的图像分类模型',
        '能设计一个食堂AI应用场景方案',
        '能团队合作完成项目展示',
      ],
      literacy: [
        '培养计算思维与问题分解能力',
        '增强信息社会责任意识',
        '提升创新实践与团队协作能力',
      ],
    },
    lessons: [
      {
        id: 'pbl-2-l1',
        title: '计算机视觉初探',
        lessonIndex: 1,
        duration: 40,
        description: '认识计算机视觉，了解图像识别的基本原理和应用场景，引出食堂升级项目任务。',
        knowledgePoints: ['计算机视觉', '图像识别原理', '应用场景'],
        resourceTypes: ['教案', '课件'],
      },
      {
        id: 'pbl-2-l2',
        title: '智能就餐之人脸检测',
        lessonIndex: 2,
        duration: 40,
        description: '了解人脸检测技术原理，体验人脸检测功能，讨论其在食堂刷脸支付中的应用。',
        knowledgePoints: ['人脸检测', '特征点识别', '应用场景'],
        resourceTypes: ['教案', '课件', '实验'],
        experiment: '人脸检测小实验',
      },
      {
        id: 'pbl-2-l3',
        title: '智能就餐之人脸识别',
        lessonIndex: 3,
        duration: 40,
        description: '学习人脸识别的完整流程，了解模型训练原理，讨论人脸数据隐私保护问题。',
        knowledgePoints: ['人脸识别流程', '模型训练', '数据隐私'],
        resourceTypes: ['教案', '课件'],
      },
      {
        id: 'pbl-2-l4',
        title: '点餐助手之颜色识别',
        lessonIndex: 4,
        duration: 40,
        description: '学习颜色识别技术，通过实验体验颜色分类，了解其在智能餐盘中的应用。',
        knowledgePoints: ['颜色识别', 'RGB色彩空间', '智能餐盘'],
        resourceTypes: ['教案', '课件', '实验'],
        experiment: '颜色识别小实验',
      },
      {
        id: 'pbl-2-l5',
        title: '充值助手之二维码读取',
        lessonIndex: 5,
        duration: 40,
        description: '了解二维码的原理与结构，体验二维码识别技术，讨论图像编码的应用。',
        knowledgePoints: ['二维码原理', '图像编码', 'QR码结构'],
        resourceTypes: ['教案', '课件'],
      },
      {
        id: 'pbl-2-l6',
        title: '餐余分拣之物体分类',
        lessonIndex: 6,
        duration: 40,
        description: '学习物体分类技术，动手训练一个垃圾分类模型，完成项目总结展示。',
        knowledgePoints: ['物体分类', '模型训练实践', '垃圾分类AI'],
        resourceTypes: ['教案', '课件', '实验'],
        experiment: '图像分类模型训练',
      },
    ],
    tools: ['智象AI实验室', '机器学习训练演示'],
    hardware: ['计算机/平板', '摄像头', '网络环境'],
    extensionChallenges: [
      '设计一个你理想中的"未来智能食堂"方案，画出设计图并说明',
      '调研学校食堂的实际问题，提出AI改进建议',
      '尝试训练更多类别的物体分类模型',
    ],
    showcase: '项目方案海报 + 模型演示 + 小组答辩',
    standardAlignment: [
      '对标《中小学人工智能通识教育指南》计算机视觉模块',
      '对标安徽省AI通识教育纲要小学段"实践与创新"要求',
    ],
  },

  // 项目三：AI校园开放日助手
  {
    id: 'pbl-3',
    title: 'AI校园开放日助手',
    subtitle: '语音交互技术应用',
    stage: 'primary',
    stageLabel: '小学',
    gradeRange: '小学高年级',
    totalLessons: 6,
    totalHours: 6,
    techCategory: '语音交互',
    techTags: ['语音唤醒', '语音识别ASR', '语音合成TTS', '语音控制'],
    iconKey: 'mic',
    colorFrom: 'from-blue-500',
    colorTo: 'to-cyan-500',
    drivingQuestion: '如何打造一个AI语音助手，帮助学校做好校园开放日的接待工作？',
    projectBackground:
      '校园开放日是学校向家长和社会展示风采的重要时刻。本项目以"打造校园开放日AI语音助手"为驱动，带领学生系统学习语音唤醒、语音识别、语音合成、语音控制等核心技术，最终完成一个可演示的语音交互项目。',
    objectives: {
      knowledge: [
        '了解语音技术的基本概念与分类',
        '理解语音唤醒与关键词检测原理',
        '掌握语音识别(ASR)与语音合成(TTS)的基本概念',
        '了解语音交互系统的设计方法',
      ],
      ability: [
        '能使用语音识别工具完成语音转文字',
        '能设计一个简单的语音指令控制系统',
        '能完成一个语音助手原型项目',
        '能团队协作完成项目设计与展示',
      ],
      literacy: [
        '培养计算思维与人机交互设计思维',
        '提升问题解决与创新实践能力',
        '增强服务社会的责任意识',
      ],
    },
    lessons: [
      {
        id: 'pbl-3-l1',
        title: '语音初探之校园开放日的AI应用',
        lessonIndex: 1,
        duration: 40,
        description: '了解语音技术的发展与应用，提出校园开放日助手的项目需求与功能设计。',
        knowledgePoints: ['语音技术概述', '应用场景', '项目需求分析'],
        resourceTypes: ['教案', '课件'],
      },
      {
        id: 'pbl-3-l2',
        title: '校门迎宾之语音唤醒',
        lessonIndex: 2,
        duration: 40,
        description: '学习语音唤醒技术原理，了解关键词检测，体验语音唤醒功能。',
        knowledgePoints: ['语音唤醒', '关键词检测', '唤醒词设计'],
        resourceTypes: ['教案', '课件', '实验'],
        experiment: '语音唤醒体验',
      },
      {
        id: 'pbl-3-l3',
        title: '活动展示之语音识别',
        lessonIndex: 3,
        duration: 40,
        description: '学习语音识别ASR原理，体验语音转文字，了解语音识别技术的发展与挑战。',
        knowledgePoints: ['语音识别ASR', '声学模型', '语言模型'],
        resourceTypes: ['教案', '课件', '实验'],
        experiment: '语音转文字实验',
      },
      {
        id: 'pbl-3-l4',
        title: '环境监测之语音合成',
        lessonIndex: 4,
        duration: 40,
        description: '学习语音合成TTS技术，体验文字转语音，了解不同语音合成的效果差异。',
        knowledgePoints: ['语音合成TTS', '音色训练', '语音自然度'],
        resourceTypes: ['教案', '课件'],
      },
      {
        id: 'pbl-3-l5',
        title: '展区灯光之语音控制',
        lessonIndex: 5,
        duration: 40,
        description: '学习语音指令识别技术，设计语音控制硬件的简单交互系统。',
        knowledgePoints: ['语音指令识别', '意图理解', '硬件控制'],
        resourceTypes: ['教案', '课件', '实验'],
        experiment: '语音控制小灯实验',
      },
      {
        id: 'pbl-3-l6',
        title: '展区互动之语音交互',
        lessonIndex: 6,
        duration: 40,
        description: '整合前几节课所学，设计并展示校园开放日语音助手项目。',
        knowledgePoints: ['多轮对话', '语音助手设计', '项目整合'],
        resourceTypes: ['教案', '课件', '实验'],
        experiment: '语音助手项目展示',
      },
    ],
    tools: ['智象AI实验室', 'AI通识问答'],
    hardware: ['计算机/平板', '麦克风', '掌控板（可选）', '网络环境'],
    extensionChallenges: [
      '为你的语音助手增加更多有趣的功能',
      '调研不同语音助手产品的优缺点，写一份对比报告',
      '尝试用编程实现一个简单的语音交互程序',
    ],
    showcase: '语音助手演示 + 项目方案PPT + 现场讲解',
    standardAlignment: [
      '对标《中小学人工智能通识教育指南》语音交互模块',
      '对标安徽省AI通识教育纲要"智能交互"主题要求',
    ],
  },

  // 项目四：AI猫狗识别
  {
    id: 'pbl-4',
    title: 'AI猫狗识别',
    subtitle: '人工智能技术发展',
    stage: 'junior',
    stageLabel: '初中',
    gradeRange: '初中',
    totalLessons: 4,
    totalHours: 4,
    techCategory: '机器学习',
    techTags: ['符号主义', '连接主义', '深度学习', '神经网络', 'CNN'],
    iconKey: 'brain',
    colorFrom: 'from-violet-500',
    colorTo: 'to-purple-500',
    drivingQuestion: 'AI是如何一步步学会识别猫和狗的？人工智能的发展经历了哪些阶段？',
    projectBackground:
      '以"AI如何识别猫狗"为主线问题，带领学生回溯人工智能发展的三个重要阶段——符号主义、连接主义和深度学习，理解AI技术演进的脉络，并动手体验经典的手写数字识别实验，感受深度学习的威力。',
    objectives: {
      knowledge: [
        '了解AI发展的三个重要阶段及代表技术',
        '理解专家系统与知识图谱的基本概念',
        '掌握神经网络与深度学习的基本原理',
        '了解CNN卷积神经网络在图像识别中的应用',
      ],
      ability: [
        '能区分不同AI发展阶段的技术特点',
        '能完成一个简单的神经网络实验',
        '能分析AI技术发展的关键因素',
        '能辩证看待AI的现状与未来',
      ],
      literacy: [
        '培养计算思维与历史唯物主义视角',
        '增强科技伦理与社会责任意识',
        '激发探索前沿科技的热情',
      ],
    },
    lessons: [
      {
        id: 'pbl-4-l1',
        title: 'AI进化之揭秘人工智能发展',
        lessonIndex: 1,
        duration: 40,
        description: '回顾AI发展历史，了解符号主义、连接主义、行为主义三大学派，以及三次AI浪潮。',
        knowledgePoints: ['AI发展三阶段', '符号主义', '连接主义', 'AI浪潮'],
        resourceTypes: ['教案', '课件'],
      },
      {
        id: 'pbl-4-l2',
        title: '知识驱动之探秘人工智能基石',
        lessonIndex: 2,
        duration: 40,
        description: '学习专家系统与知识图谱，理解"知识驱动"的AI范式，分析其优势与局限。',
        knowledgePoints: ['专家系统', '知识图谱', '知识表示', '规则推理'],
        resourceTypes: ['教案', '课件'],
      },
      {
        id: 'pbl-4-l3',
        title: '学习赋能之解锁人工智能新篇',
        lessonIndex: 3,
        duration: 40,
        description: '学习神经网络与深度学习基本原理，了解CNN卷积神经网络在图像识别中的应用。',
        knowledgePoints: ['神经网络', '深度学习', 'CNN', '卷积层', '池化层'],
        resourceTypes: ['教案', '课件', '实验'],
        experiment: '手写数字识别CNN实验',
      },
      {
        id: 'pbl-4-l4',
        title: '展望之人工智能的现在与未来挑战',
        lessonIndex: 4,
        duration: 40,
        description: '了解AI当前发展现状与未来趋势，讨论AI伦理、安全与社会影响等议题。',
        knowledgePoints: ['AI现状', '未来趋势', 'AI伦理', '安全挑战'],
        resourceTypes: ['教案', '课件'],
      },
    ],
    tools: ['智象AI实验室', 'AI通识问答'],
    hardware: ['计算机/平板', '网络环境'],
    extensionChallenges: [
      '调研AI领域的最新突破，做一份科技小报',
      '尝试训练一个自己的图像分类模型',
      '撰写一篇"我眼中的AI未来"短文',
    ],
    showcase: '知识思维导图 + 实验报告 + 主题演讲',
    standardAlignment: [
      '对标《中小学人工智能通识教育指南》机器学习模块',
      '对标安徽省AI通识教育纲要初中段"理解与应用"要求',
    ],
  },

  // 项目五：智能翻译机
  {
    id: 'pbl-5',
    title: '智能翻译机',
    subtitle: '自然语言处理技术',
    stage: 'junior',
    stageLabel: '初中',
    gradeRange: '初中',
    totalLessons: 5,
    totalHours: 5,
    techCategory: '自然语言处理',
    techTags: ['NLP', '中文分词', '词嵌入', '机器翻译', '文本分析'],
    iconKey: 'languages',
    colorFrom: 'from-orange-500',
    colorTo: 'to-rose-500',
    drivingQuestion: 'AI是如何理解人类语言并实现不同语言之间翻译的？',
    projectBackground:
      '以"制作一台智能翻译机"为项目目标，带领学生走进自然语言处理(NLP)的世界，从最基础的中文分词、文本向量化，到机器翻译模型，一步步揭开AI理解人类语言的秘密，并动手完成词云生成、情感分析等NLP小实验。',
    objectives: {
      knowledge: [
        '了解自然语言处理(NLP)的基本概念与应用领域',
        '理解中文分词的原理与常用算法',
        '掌握文本向量化与词嵌入的基本思想',
        '了解机器翻译的发展历程与基本原理',
      ],
      ability: [
        '能使用NLP工具完成简单的文本分析',
        '能动手生成词云图和情感分析',
        '能评估翻译质量并给出改进建议',
        '能完成一个简单的翻译机原型设计',
      ],
      literacy: [
        '培养计算思维与语言智能素养',
        '提升跨文化理解与沟通能力',
        '增强对母语文化的自信与热爱',
      ],
    },
    lessons: [
      {
        id: 'pbl-5-l1',
        title: '走进智能翻译',
        lessonIndex: 1,
        duration: 40,
        description: '了解翻译的历史与机器翻译的发展，引出项目任务——打造自己的智能翻译机。',
        knowledgePoints: ['翻译历史', '机器翻译发展', 'NLP概述'],
        resourceTypes: ['教案', '课件'],
      },
      {
        id: 'pbl-5-l2',
        title: '智能翻译机之自然语言处理技术',
        lessonIndex: 2,
        duration: 40,
        description: '学习NLP的主要研究内容：词法分析、句法分析、语义分析、语用分析。',
        knowledgePoints: ['NLP研究内容', '词法分析', '句法分析', '语义分析'],
        resourceTypes: ['教案', '课件'],
      },
      {
        id: 'pbl-5-l3',
        title: '智能翻译机之中文分词',
        lessonIndex: 3,
        duration: 40,
        description: '学习中文分词的原理与挑战，了解常用分词算法，动手体验分词效果。',
        knowledgePoints: ['中文分词原理', '最大匹配法', '分词难点'],
        resourceTypes: ['教案', '课件', '实验'],
        experiment: '中文分词体验实验',
      },
      {
        id: 'pbl-5-l4',
        title: '智能翻译机之文本输入',
        lessonIndex: 4,
        duration: 40,
        description: '学习文本向量化与词嵌入的基本思想，理解AI如何"读懂"文字。',
        knowledgePoints: ['文本向量化', '词嵌入', 'Word2Vec', '语义空间'],
        resourceTypes: ['教案', '课件', '实验'],
        experiment: '词云生成实验',
      },
      {
        id: 'pbl-5-l5',
        title: '实现智能翻译机',
        lessonIndex: 5,
        duration: 40,
        description: '了解神经机器翻译模型，动手实践翻译功能，学习翻译质量评估方法。',
        knowledgePoints: ['神经机器翻译', 'Transformer', '翻译质量评估'],
        resourceTypes: ['教案', '课件', '实验'],
        experiment: '翻译实践与评估',
      },
    ],
    tools: ['智象AI实验室', 'AI通识问答'],
    hardware: ['计算机/平板', '网络环境'],
    extensionChallenges: [
      '对比不同翻译软件的效果，写一份评测报告',
      '尝试用AI翻译一首古诗，看看AI能不能理解诗意',
      '设计一个具有地方特色的方言翻译APP方案',
    ],
    showcase: '翻译机原型演示 + 技术原理海报 + 评测报告',
    standardAlignment: [
      '对标《中小学人工智能通识教育指南》自然语言处理模块',
      '对标安徽省AI通识教育纲要初中段"理解与应用"要求',
    ],
  },

  // 项目六：互动舞台剧创想营
  {
    id: 'pbl-6',
    title: '互动舞台剧创想营',
    subtitle: '生成式人工智能应用',
    stage: 'mixed',
    stageLabel: '小学/初中',
    gradeRange: '小学高年级/初中',
    totalLessons: 5,
    totalHours: 5,
    techCategory: '生成式AI',
    techTags: ['AI文本生成', 'AI绘画', 'Prompt工程', '多模态交互', '大语言模型'],
    iconKey: 'palette',
    colorFrom: 'from-pink-500',
    colorTo: 'to-fuchsia-500',
    drivingQuestion: '如何用生成式AI创作一台"未来博物馆奇妙夜"互动舞台剧？',
    projectBackground:
      '以"未来博物馆奇妙夜"为创作主题，带领学生体验生成式AI的魅力——用AI写剧本、用AI画角色、用AI做对话，最终完成一台融合AI技术与艺术创意的互动舞台剧。项目整合文本生成、图像生成、多模态对话等多种生成式AI技术。',
    objectives: {
      knowledge: [
        '了解生成式AI的基本概念与主要类型',
        '理解大语言模型的基本原理与能力',
        '掌握AI绘画的基本方法与提示词工程',
        '了解多模态交互的基本概念',
      ],
      ability: [
        '能用AI工具生成剧本和故事',
        '能写出有效的AI绘画提示词',
        '能设计AI角色与对话交互',
        '能团队协作完成舞台剧创作与演出',
      ],
      literacy: [
        '培养创新思维与审美能力',
        '提升团队协作与表达展示能力',
        '树立正确的AI创作伦理与版权意识',
      ],
    },
    lessons: [
      {
        id: 'pbl-6-l1',
        title: '未来博物馆奇妙夜之AI编剧',
        lessonIndex: 1,
        duration: 40,
        description: '了解生成式AI与大语言模型，使用AI生成舞台剧剧本，学习提示词写作技巧。',
        knowledgePoints: ['生成式AI', '大语言模型', 'AI文本生成', 'Prompt工程'],
        resourceTypes: ['教案', '课件', '实验'],
        experiment: 'AI生成剧本',
      },
      {
        id: 'pbl-6-l2',
        title: '未来博物馆奇妙夜之AI画师',
        lessonIndex: 2,
        duration: 40,
        description: '学习AI图像生成技术与Diffusion模型原理，动手生成舞台剧角色和场景图。',
        knowledgePoints: ['AI图像生成', 'Diffusion模型', 'AI绘画技巧'],
        resourceTypes: ['教案', '课件', '实验'],
        experiment: 'AI绘画创作',
      },
      {
        id: 'pbl-6-l3',
        title: '未来博物馆奇妙夜之文物角色设定',
        lessonIndex: 3,
        duration: 40,
        description: '深入学习提示词工程，为舞台剧设计独特的AI角色形象与人物设定。',
        knowledgePoints: ['提示词工程', '角色生成', '风格控制', '细节描述'],
        resourceTypes: ['教案', '课件', '实验'],
        experiment: 'AI角色设计',
      },
      {
        id: 'pbl-6-l4',
        title: '未来博物馆之文物互动',
        lessonIndex: 4,
        duration: 40,
        description: '了解AI多模态交互技术，与AI角色对话，设计舞台剧的互动环节。',
        knowledgePoints: ['多模态交互', 'AI对话', '角色设定', '互动设计'],
        resourceTypes: ['教案', '课件', '实验'],
        experiment: 'AI角色对话体验',
      },
      {
        id: 'pbl-6-l5',
        title: '未来博物馆奇妙夜演出',
        lessonIndex: 5,
        duration: 40,
        description: '整合项目成果，进行舞台剧排练与演出展示，分享项目收获与反思。',
        knowledgePoints: ['项目整合', '成果展示', '团队协作', '反思总结'],
        resourceTypes: ['教案', '课件'],
      },
    ],
    tools: ['AI绘画', 'AI通识问答', 'AI备课助手'],
    hardware: ['计算机/平板', '网络环境', '投影设备'],
    extensionChallenges: [
      '为你的舞台剧增加AI配音和背景音乐',
      '尝试用AI制作舞台剧海报和宣传视频',
      '把舞台剧录制成视频，加上AI字幕',
    ],
    showcase: '互动舞台剧现场演出 + 创作过程展 + 作品手册',
    standardAlignment: [
      '对标《中小学人工智能通识教育指南》生成式AI模块',
      '对标安徽省AI通识教育纲要"创新与创造"主题要求',
    ],
  },
];

export function getAllPblProjects(): IPblProject[] {
  return MOCK_PBL_PROJECTS;
}

export function getPblProjectById(id: string): IPblProject | undefined {
  return MOCK_PBL_PROJECTS.find((p) => p.id === id);
}

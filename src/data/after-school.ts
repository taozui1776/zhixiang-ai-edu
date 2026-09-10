// EXPORTS: IChallenge, IContest, IResource, MOCK_CHALLENGES, MOCK_CONTESTS, MOCK_RESOURCES, CHALLENGE_STAGES, CONTEST_CATEGORIES, RESOURCE_CATEGORIES

export type ChallengeStage = 'primary' | 'junior' | 'senior';
export type Difficulty = 1 | 2 | 3;
export type ContestCategory = 'ai' | 'robot' | 'coding' | 'innovation';
export type ResourceCategory = 'ai-intro' | 'coding-basic' | 'robot' | 'algorithm' | 'contest-past';

export interface IChallenge {
  id: string;
  title: string;
  stage: ChallengeStage;
  difficulty: Difficulty;
  hardware: string; // 所需硬件描述
  description: string;
  knowledge: string[]; // 拓展知识点
  duration: string; // 预计耗时
  category: string; // 分类标签
}

export interface IContest {
  id: string;
  name: string;
  organizer: string; // 主办方
  stages: ChallengeStage[]; // 参赛学段
  categories: ContestCategory[]; // 比赛内容方向
  cycle: string; // 举办时间周期
  website: string;
  description: string;
  highlight?: string; // 亮点/特色
}

export interface IResource {
  id: string;
  name: string;
  type: 'tutorial' | 'course' | 'book' | 'website' | 'tool';
  category: ResourceCategory;
  stages: ChallengeStage[];
  description: string;
  url: string;
  isFree: boolean;
}

export const CHALLENGE_STAGES: { value: ChallengeStage; label: string; color: string }[] = [
  { value: 'primary', label: '小学', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  { value: 'junior', label: '初中', color: 'bg-sky-100 text-sky-700 border-sky-200' },
  { value: 'senior', label: '高中', color: 'bg-violet-100 text-violet-700 border-violet-200' },
];

export const CONTEST_CATEGORIES: { value: ContestCategory; label: string }[] = [
  { value: 'ai', label: '人工智能' },
  { value: 'robot', label: '机器人' },
  { value: 'coding', label: '编程' },
  { value: 'innovation', label: '创新发明' },
];

export const RESOURCE_CATEGORIES: { value: ResourceCategory; label: string }[] = [
  { value: 'ai-intro', label: 'AI 入门' },
  { value: 'coding-basic', label: '编程基础' },
  { value: 'robot', label: '机器人' },
  { value: 'algorithm', label: '算法' },
  { value: 'contest-past', label: '竞赛真题' },
];

// 课后挑战 — 18 个，覆盖三学段
export const MOCK_CHALLENGES: IChallenge[] = [
  // 小学 6 个
  {
    id: 'c-p1',
    title: 'AI 猜数字游戏',
    stage: 'primary',
    difficulty: 1,
    hardware: '无需硬件，纯软件',
    description: '用 Scratch 做一个智能猜数字小游戏，让程序根据你的提示自动缩小范围猜出你心里想的数字。',
    knowledge: ['二分法思想', '条件判断', '变量与计数'],
    duration: '30 分钟',
    category: '图形化编程',
  },
  {
    id: 'c-p2',
    title: '会听话的小助手',
    stage: 'primary',
    difficulty: 2,
    hardware: '电脑 + 麦克风',
    description: '用图形化编程结合语音识别，做一个能听懂你指令的小助手——可以开关灯、报时、讲笑话。',
    knowledge: ['语音识别', '事件驱动', '指令理解'],
    duration: '1-2 小时',
    category: 'AI 语音',
  },
  {
    id: 'c-p3',
    title: 'AI 绘画创作：未来学校',
    stage: 'primary',
    difficulty: 1,
    hardware: '无需硬件，纯软件',
    description: '用 AI 绘画工具创作一幅你心目中的"未来学校"，并尝试用不同的描述词调整画面效果。',
    knowledge: ['AI 绘画', 'Prompt 描述', '创意表达'],
    duration: '1 小时',
    category: 'AI 创作',
  },
  {
    id: 'c-p4',
    title: '寻找家里的 AI',
    stage: 'primary',
    difficulty: 1,
    hardware: '无需硬件，观察记录',
    description: '观察并记录你家里有哪些应用了人工智能的设备或功能，做一张"AI 家庭地图"。',
    knowledge: ['AI 应用识别', '观察记录', '分类整理'],
    duration: '30 分钟',
    category: '生活观察',
  },
  {
    id: 'c-p5',
    title: '智能小夜灯',
    stage: 'primary',
    difficulty: 2,
    hardware: '掌控板 + 光线传感器',
    description: '用掌控板和光线传感器做一个自动感应的智能小夜灯——天黑自动亮，天亮自动灭。',
    knowledge: ['传感器', '条件判断', '硬件编程'],
    duration: '1-2 小时',
    category: '智能硬件',
  },
  {
    id: 'c-p6',
    title: '表情猜猜乐',
    stage: 'primary',
    difficulty: 2,
    hardware: '电脑 + 摄像头',
    description: '用 AI 图像识别做一个"表情猜猜乐"游戏：你对着摄像头做表情，AI 来猜是开心还是惊讶。',
    knowledge: ['图像识别', '表情分类', '人机交互'],
    duration: '1-2 小时',
    category: 'AI 视觉',
  },
  // 初中 6 个
  {
    id: 'c-j1',
    title: '水果识别小模型',
    stage: 'junior',
    difficulty: 2,
    hardware: '电脑（无需额外硬件）',
    description: '收集苹果、香蕉、橙子的照片，训练一个图像分类模型来识别三种水果，测试准确率有多高。',
    knowledge: ['图像分类', '模型训练', '数据集', '准确率评估'],
    duration: '2-3 小时',
    category: '机器学习',
  },
  {
    id: 'c-j2',
    title: 'AI 写科幻故事',
    stage: 'junior',
    difficulty: 1,
    hardware: '无需硬件，纯软件',
    description: '学习用 Prompt 工程技巧，让 AI 帮你写一篇关于"2077 年的学校"的科幻故事，不断调整指令让故事更精彩。',
    knowledge: ['Prompt 工程', '创意写作', 'AI 协作'],
    duration: '1 小时',
    category: 'AI 创作',
  },
  {
    id: 'c-j3',
    title: '环境监测小站',
    stage: 'junior',
    difficulty: 3,
    hardware: '行空板 + 温湿度/空气质量传感器',
    description: '用行空板搭建一个环境监测站，实时显示温湿度和空气质量数据，并记录到日志中分析变化趋势。',
    knowledge: ['传感器', '数据采集', '数据可视化', '物联网'],
    duration: '周末项目（半天）',
    category: '智能硬件',
  },
  {
    id: 'c-j4',
    title: '推荐算法偏见调查',
    stage: 'junior',
    difficulty: 2,
    hardware: '无需硬件，调研分析',
    description: '观察短视频/购物 App 的推荐内容，设计一个简单实验验证推荐算法是否存在"信息茧房"效应，记录你的发现。',
    knowledge: ['推荐算法', '算法偏见', '数据伦理', '批判性思维'],
    duration: '1-2 小时',
    category: 'AI 伦理',
  },
  {
    id: 'c-j5',
    title: '我的第一个聊天机器人',
    stage: 'junior',
    difficulty: 2,
    hardware: '无需硬件，纯软件',
    description: '用 Python 或图形化工具做一个简单的聊天机器人，预设多个话题分支，让它能跟你进行简单对话。',
    knowledge: ['对话系统', '状态机', '字符串处理'],
    duration: '2 小时',
    category: '自然语言',
  },
  {
    id: 'c-j6',
    title: '手势控制小游戏',
    stage: 'junior',
    difficulty: 3,
    hardware: '电脑 + 摄像头',
    description: '用 MediaPipe 或类似工具实现手势识别，用手势来控制一个简单的小游戏（如石头剪刀布 / 接水果）。',
    knowledge: ['手势识别', '计算机视觉', '游戏编程'],
    duration: '周末项目',
    category: 'AI 视觉',
  },
  // 高中 6 个
  {
    id: 'c-s1',
    title: '手写 k-NN 分类器',
    stage: 'senior',
    difficulty: 2,
    hardware: '无需硬件，纯软件',
    description: '用 Python 从零实现一个 k-近邻(k-NN)分类算法，在鸢尾花数据集上测试效果，对比不同 k 值的准确率。',
    knowledge: ['k-NN 算法', '分类问题', '距离度量', 'Python 数据处理'],
    duration: '2-3 小时',
    category: '经典算法',
  },
  {
    id: 'c-s2',
    title: '神经网络识别手写数字',
    stage: 'senior',
    difficulty: 3,
    hardware: '无需硬件，纯软件',
    description: '用 TensorFlow / PyTorch 搭建一个简单的神经网络，在 MNIST 数据集上训练识别手写数字，调参优化准确率。',
    knowledge: ['神经网络', '深度学习', '反向传播', 'MNIST', '模型调优'],
    duration: '周末项目',
    category: '深度学习',
  },
  {
    id: 'c-s3',
    title: 'AI 音乐生成',
    stage: 'senior',
    difficulty: 2,
    hardware: '无需硬件，纯软件',
    description: '使用 Magenta 或类似 AI 音乐生成工具，创作一段原创音乐片段，并探索不同模型参数对音乐风格的影响。',
    knowledge: ['生成式 AI', '音乐表示', 'LSTM/Transformer', '创意 AI'],
    duration: '2-3 小时',
    category: 'AI 创作',
  },
  {
    id: 'c-s4',
    title: '大模型幻觉检测实验',
    stage: 'senior',
    difficulty: 3,
    hardware: '无需硬件，调研+实验',
    description: '设计实验验证大语言模型的"幻觉"现象——让 AI 回答一组事实性问题，统计编造信息的比例，并设计验证方法。',
    knowledge: ['LLM 幻觉', '事实核查', 'Prompt 设计', 'AI 安全与伦理'],
    duration: '周末项目',
    category: 'AI 研究',
  },
  {
    id: 'c-s5',
    title: '实时姿态检测',
    stage: 'senior',
    difficulty: 3,
    hardware: '电脑 + 摄像头',
    description: '用 TensorFlow.js / ML5.js 或 MediaPipe 实现实时人体姿态检测，并做一个简单的健身动作计数应用。',
    knowledge: ['姿态估计', '计算机视觉', '实时处理', 'JavaScript'],
    duration: '周末项目',
    category: 'AI 视觉',
  },
  {
    id: 'c-s6',
    title: '智能垃圾分类器',
    stage: 'senior',
    difficulty: 3,
    hardware: 'micro:bit / 掌控板 + 摄像头模块',
    description: '训练一个图像分类模型识别可回收/有害/厨余/其他四类垃圾，部署到硬件上做成智能垃圾分类装置。',
    knowledge: ['图像分类', '模型部署', '边缘计算', '硬件集成'],
    duration: '周末项目（1-2天）',
    category: 'AI + 硬件',
  },
];

// AI 竞赛信息 — 10 个
export const MOCK_CONTESTS: IContest[] = [
  {
    id: 'contest-1',
    name: '全国青少年信息素养大赛',
    organizer: '中国电子学会',
    stages: ['primary', 'junior', 'senior'],
    categories: ['ai', 'robot', 'coding'],
    cycle: '每年一届（约 3-8 月）',
    website: 'https://www.qsesx.cn/',
    description:
      '原"全国青少年电子信息智能创新大赛"，面向中小学生的综合性科技竞赛，含人工智能、机器人、编程等多个赛项。',
    highlight: '教育部白名单赛事',
  },
  {
    id: 'contest-2',
    name: '宋庆龄少年儿童发明奖',
    organizer: '中国发明协会',
    stages: ['primary', 'junior', 'senior'],
    categories: ['innovation', 'ai'],
    cycle: '每年一届（约 5-10 月）',
    website: 'http://www.cainet.org.cn/',
    description:
      '以发明创新为核心的国家级青少年科技赛事，涵盖人工智能创新作品、创意发明等多个类别，鼓励青少年动手实践与创新思维。',
    highlight: '教育部白名单 · 国家级奖项',
  },
  {
    id: 'contest-3',
    name: '全国青少年科技创新大赛',
    organizer: '中国科协青少年科技中心',
    stages: ['primary', 'junior', 'senior'],
    categories: ['innovation', 'ai'],
    cycle: '每年一届（约 4-8 月）',
    website: 'https://castic.xiaoxiaotong.org/',
    description:
      '国内规模最大、层次最高的青少年科技教育活动之一，涵盖科技创新成果竞赛、科技实践活动等，人工智能是热门选题方向。',
    highlight: '教育部白名单 · 历史最悠久',
  },
  {
    id: 'contest-4',
    name: '全国中小学信息技术创新与实践大赛（NOC）',
    organizer: '中国人工智能学会',
    stages: ['primary', 'junior', 'senior'],
    categories: ['ai', 'coding', 'robot'],
    cycle: '每年一届（约 3-7 月）',
    website: 'https://www.noc.net.cn/',
    description:
      '简称 NOC 大赛，聚焦信息技术与人工智能创新实践，设编程猫创新编程、人工智能创作、机器人等多个赛项。',
    highlight: '教育部白名单 · 参赛规模大',
  },
  {
    id: 'contest-5',
    name: '世界机器人大会青少年机器人设计与信息素养大赛',
    organizer: '世界机器人大会组委会',
    stages: ['primary', 'junior', 'senior'],
    categories: ['robot', 'ai', 'coding'],
    cycle: '每年一届（约 5-8 月）',
    website: 'https://www.worldrobotconference.com/',
    description:
      '世界机器人大会配套的青少年赛事，含机器人设计、AI 应用、信息素养等赛项，优秀选手可参加世界机器人大会展演。',
    highlight: '世界机器人大会官方赛事',
  },
  {
    id: 'contest-6',
    name: '蓝桥杯青少年编程大赛',
    organizer: '工业和信息化部人才交流中心',
    stages: ['primary', 'junior', 'senior'],
    categories: ['coding', 'ai'],
    cycle: '每年一届（省赛 3-4 月，国赛 5-6 月）',
    website: 'https://www.lanqiao.cn/',
    description:
      '国内知名度高的编程竞赛，青少年组涵盖 Scratch、Python、C++、Arduino 等，另设青少组 AI 编程赛项。',
    highlight: '参赛人数多 · 认可度高',
  },
  {
    id: 'contest-7',
    name: '全国青少年人工智能创新挑战赛',
    organizer: '中国少年儿童发展服务中心',
    stages: ['primary', 'junior', 'senior'],
    categories: ['ai', 'coding', 'innovation'],
    cycle: '每年一届（约 4-10 月）',
    website: 'http://www.ai-challenge.cn/',
    description:
      '专注人工智能方向的全国性青少年竞赛，设人工智能编程、智能机器人、创意编程等多个专项赛，覆盖全学段。',
    highlight: '教育部白名单 · AI 专项',
  },
  {
    id: 'contest-8',
    name: '世界人工智能大会青少年 AI 创新大赛',
    organizer: '世界人工智能大会组委会',
    stages: ['primary', 'junior', 'senior'],
    categories: ['ai', 'innovation'],
    cycle: '每年一届（约 5-9 月）',
    website: 'https://www.worldaic.com.cn/',
    description:
      'WAIC 世界人工智能大会配套的青少年赛事，聚焦 AI 创新应用项目，优秀项目有机会在大会现场展示。',
    highlight: '顶级行业大会配套赛事',
  },
  {
    id: 'contest-9',
    name: '安徽省青少年科技创新大赛',
    organizer: '安徽省科协、省教育厅',
    stages: ['primary', 'junior', 'senior'],
    categories: ['innovation', 'ai', 'robot'],
    cycle: '每年一届（约 3-5 月）',
    website: 'https://ahkepu.org.cn/',
    description:
      '安徽省内最重要的青少年科技竞赛，是全国赛的省级选拔通道，设科技创新成果、科技实践、机器人等板块。',
    highlight: '省级赛事 · 国赛选拔赛',
  },
  {
    id: 'contest-10',
    name: '全国学生信息素养提升实践活动',
    organizer: '教育部教育技术与资源发展中心',
    stages: ['primary', 'junior', 'senior'],
    categories: ['coding', 'ai', 'robot'],
    cycle: '每年一届（约 3-7 月）',
    website: 'https://www.ncet.edu.cn/',
    description:
      '原"全国中小学电脑制作活动"，历史悠久的学生信息素养展示平台，含数字创作、计算思维、机器人、人工智能四大类项目。',
    highlight: '教育部直属 · 历史悠久',
  },
];

// 备赛资源推荐
export const MOCK_RESOURCES: IResource[] = [
  // AI 入门
  {
    id: 'r-1',
    name: 'AI4K12 人工智能教育指南',
    type: 'website',
    category: 'ai-intro',
    stages: ['primary', 'junior', 'senior'],
    description: '由 AAAI 推出的 K12 人工智能教育资源站，包含五大概念框架与教学案例，适合老师备课与学生拓展阅读。',
    url: 'https://ai4k12.org/',
    isFree: true,
  },
  {
    id: 'r-2',
    name: 'Code.org - 一小时编程',
    type: 'tutorial',
    category: 'coding-basic',
    stages: ['primary', 'junior'],
    description: '全球最知名的编程启蒙平台，提供一小时编程入门课程，用游戏化方式学习编程思维与计算思维。',
    url: 'https://code.org/',
    isFree: true,
  },
  {
    id: 'r-3',
    name: 'Kaggle Learn',
    type: 'course',
    category: 'algorithm',
    stages: ['junior', 'senior'],
    description: 'Kaggle 官方免费微课程，涵盖 Python、机器学习、数据可视化等，短小精悍，含在线练习环境。',
    url: 'https://www.kaggle.com/learn',
    isFree: true,
  },
  {
    id: 'r-4',
    name: 'Scratch 官方教程',
    type: 'tutorial',
    category: 'coding-basic',
    stages: ['primary'],
    description: 'MIT 开发的图形化编程平台官方教程，从入门到进阶项目，适合小学生从零开始学习编程。',
    url: 'https://scratch.mit.edu/tips',
    isFree: true,
  },
  {
    id: 'r-5',
    name: '吴恩达机器学习课程',
    type: 'course',
    category: 'algorithm',
    stages: ['senior'],
    description: '斯坦福大学经典机器学习入门课，适合高中生系统学习机器学习基础理论与 Python 实践。',
    url: 'https://www.coursera.org/learn/machine-learning',
    isFree: false,
  },
  {
    id: 'r-6',
    name: '《人工智能启蒙》（小学版）',
    type: 'book',
    category: 'ai-intro',
    stages: ['primary'],
    description: '面向小学生的 AI 启蒙读物，用漫画和故事方式讲解人工智能基础知识，适合亲子共读。',
    url: '#',
    isFree: false,
  },
  {
    id: 'r-7',
    name: 'Arduino 官方入门教程',
    type: 'tutorial',
    category: 'robot',
    stages: ['junior', 'senior'],
    description: 'Arduino 官方入门资源，从零开始学习开源电子原型平台，适合机器人与智能硬件入门。',
    url: 'https://www.arduino.cc/learn',
    isFree: true,
  },
  {
    id: 'r-8',
    name: 'Python 编程：从入门到实践',
    type: 'book',
    category: 'coding-basic',
    stages: ['junior', 'senior'],
    description: '经典 Python 入门教材，理论与项目结合，适合初中以上学生系统学习 Python 编程语言。',
    url: '#',
    isFree: false,
  },
  {
    id: 'r-9',
    name: 'TensorFlow 官方教程',
    type: 'tutorial',
    category: 'ai-intro',
    stages: ['senior'],
    description: 'Google 官方深度学习框架教程，从基础概念到实战项目，含中文版本，适合高中生深度学习入门。',
    url: 'https://www.tensorflow.org/tutorials',
    isFree: true,
  },
  {
    id: 'r-10',
    name: 'LeetCode 算法题库',
    type: 'website',
    category: 'algorithm',
    stages: ['senior'],
    description: '知名在线算法练习平台，按难度和题型分类的数千道题目，适合信息学竞赛与算法能力提升。',
    url: 'https://leetcode.cn/',
    isFree: true,
  },
  {
    id: 'r-11',
    name: 'NOIP / CSP 历年真题',
    type: 'website',
    category: 'contest-past',
    stages: ['junior', 'senior'],
    description: '信息学奥赛历年真题与题解集合，备战 CSP-J/S 与 NOIP 的必备资源。',
    url: 'https://www.noi.cn/',
    isFree: true,
  },
  {
    id: 'r-12',
    name: '机器人竞赛入门指南',
    type: 'tutorial',
    category: 'robot',
    stages: ['primary', 'junior'],
    description: '面向中小学生的机器人竞赛入门资源，涵盖 LEGO EV3、micro:bit、掌控板等常用平台的基础教程。',
    url: '#',
    isFree: true,
  },
];

// EXPORTS: AiLabCategory, AiProjectLevel, AiProjectTier, IAiLabProject, AI_LAB_PROJECTS, getProjectById

export type AiLabCategory =
  | 'computer-vision'
  | 'nlp'
  | 'machine-learning'
  | 'aigc';

export type AiProjectLevel = '入门' | '进阶';
export type AiProjectTier = '体验' | '探究' | '训练';

export interface IAiLabProject {
  id: string;
  name: string;
  category: AiLabCategory;
  categoryLabel: string;
  icon: string; // lucide icon name
  tier: AiProjectTier;
  level: AiProjectLevel;
  techTag: string;
  description: string;
  shortDesc: string;
  isRecommended?: boolean;
  // 知识卡片
  knowledge: {
    title: string;
    content: string;
    keyPoints: string[];
  };
  // 教学建议
  teaching: {
    suitableGrades: string;
    duration: string;
    tips: string[];
  };
  // 交互配置
  interaction: {
    type: 'demo' | 'interactive' | 'external';
    hasRealInteraction: boolean;
    prompt?: string;
  };
  // 关联课程课时
  relatedLessons?: {
    courseId: string;
    courseTitle: string;
    lessonTitle: string;
    lessonIndex: number;
  }[];
}

const CATEGORY_LABELS: Record<AiLabCategory, string> = {
  'computer-vision': '计算机视觉',
  nlp: '自然语言处理',
  'machine-learning': '机器学习',
  aigc: 'AIGC',
};

export const AI_LAB_PROJECTS: IAiLabProject[] = [
  // ========== 计算机视觉 ==========
  {
    id: 'cv-face-recognition',
    name: '人脸识别',
    category: 'computer-vision',
    categoryLabel: CATEGORY_LABELS['computer-vision'],
    icon: 'UserCircle',
    tier: '体验',
    level: '入门',
    techTag: '人脸识别',
    description: '上传一张人脸照片，体验AI识别人脸的能力，包括五官定位、年龄性别估计等。',
    shortDesc: 'AI 识别人脸五官与特征',
    isRecommended: true,
    knowledge: {
      title: '人脸识别技术原理',
      content:
        '人脸识别是计算机视觉的经典应用。AI 先检测图片中的人脸区域，然后提取面部特征点（如眼睛、鼻子、嘴巴的位置），最后将特征编码成向量与人脸库比对，从而识别身份。',
      keyPoints: ['人脸检测：找到人脸在哪里', '特征提取：提取五官与轮廓特征', '特征比对：与已知人脸库对比识别'],
    },
    teaching: {
      suitableGrades: '小学高段 ~ 初中',
      duration: '15 分钟',
      tips: [
        '可以用学生自己的照片来激发兴趣',
        '引导学生讨论人脸识别的应用场景与隐私问题',
        '对比不同角度、光线下面识别的效果差异',
      ],
    },
    interaction: { type: 'demo', hasRealInteraction: true },
    relatedLessons: [
      { courseId: 'course-junior-vision', courseTitle: '机器视觉入门', lessonTitle: '人脸检测大揭秘', lessonIndex: 3 },
    ],
  },
  {
    id: 'cv-ocr',
    name: 'OCR 文字识别',
    category: 'computer-vision',
    categoryLabel: CATEGORY_LABELS['computer-vision'],
    icon: 'FileText',
    tier: '体验',
    level: '入门',
    techTag: '文字识别',
    description: '上传含文字的图片，AI 自动识别并提取其中的文字内容。',
    shortDesc: '图片中的文字 AI 来读',
    knowledge: {
      title: 'OCR 光学字符识别',
      content:
        'OCR（Optical Character Recognition）即光学字符识别，是让计算机"读懂"图片中文字的技术。传统 OCR 通过字符模板匹配实现，现代 OCR 结合深度学习，能识别各种字体、手写体和复杂背景下的文字。',
      keyPoints: ['文字检测：定位文字区域', '文字识别：逐字符识别', '后处理：语义纠错与排版还原'],
    },
    teaching: {
      suitableGrades: '小学高段 ~ 高中',
      duration: '10 分钟',
      tips: [
        '可以用课本、作业纸来演示',
        '讨论 OCR 在日常生活中的应用（翻译软件、拍照搜题等）',
      ],
    },
    interaction: { type: 'demo', hasRealInteraction: true },
    relatedLessons: [
      { courseId: 'course-junior-vision', courseTitle: '机器视觉入门', lessonTitle: '特征提取与匹配', lessonIndex: 4 },
    ],
  },
  {
    id: 'cv-license-plate',
    name: '车牌识别',
    category: 'computer-vision',
    categoryLabel: CATEGORY_LABELS['computer-vision'],
    icon: 'Car',
    tier: '探究',
    level: '进阶',
    techTag: '目标检测',
    description: '输入或上传车牌图片，体验车牌自动识别的完整过程。',
    shortDesc: 'AI 秒读车牌号',
    knowledge: {
      title: '车牌识别技术',
      content:
        '车牌识别是目标检测 + OCR 的综合应用。先通过目标检测模型定位车牌区域，再用 OCR 模型识别车牌上的字符，最后进行校验输出结果。我国车牌有固定格式和颜色规则，可以辅助提高识别准确率。',
      keyPoints: ['车牌定位：找到车牌位置', '字符分割：切出每个字符', '字符识别：识别每个字符'],
    },
    teaching: {
      suitableGrades: '初中 ~ 高中',
      duration: '20 分钟',
      tips: ['可以结合智能交通话题展开讨论', '让学生思考车牌识别的局限性'],
    },
    interaction: { type: 'demo', hasRealInteraction: true },
  },
  {
    id: 'cv-image-classification',
    name: '看图识物',
    category: 'computer-vision',
    categoryLabel: CATEGORY_LABELS['computer-vision'],
    icon: 'Image',
    tier: '体验',
    level: '入门',
    techTag: '图像分类',
    description: '上传一张图片，AI 告诉你图中是什么物体，附带置信度。',
    shortDesc: 'AI 看图说出物体名称',
    isRecommended: true,
    knowledge: {
      title: '图像分类技术',
      content:
        '图像分类是计算机视觉最基础的任务。深度学习模型通过卷积神经网络（CNN）逐层提取图像的低级特征（边缘、纹理）到高级特征（形状、物体部件），最后输出属于各个类别的概率。',
      keyPoints: ['卷积层：提取特征', '池化层：降维浓缩', '全连接层：分类输出'],
    },
    teaching: {
      suitableGrades: '小学低段 ~ 高中',
      duration: '10 分钟',
      tips: ['用常见物体让学生猜测 AI 能否认出来', '讨论 AI 识别错误的情况和原因'],
    },
    interaction: { type: 'demo', hasRealInteraction: true },
  },
  {
    id: 'cv-classification-training',
    name: '图像分类训练',
    category: 'computer-vision',
    categoryLabel: CATEGORY_LABELS['computer-vision'],
    icon: 'Layers',
    tier: '训练',
    level: '进阶',
    techTag: '模型训练',
    description: '自己采集图片数据，训练一个图像分类模型，体验机器学习的全过程。',
    shortDesc: '从零训练一个分类器',
    isRecommended: true,
    knowledge: {
      title: '模型训练的原理',
      content:
        '训练图像分类模型就像教小朋友认东西——给它看很多张标注好的图片，它通过不断调整模型参数来"学习"特征。训练越好，模型识别准确率越高，但也要注意避免"死记硬背"（过拟合）。',
      keyPoints: ['数据采集：收集并标注图片', '模型训练：反复学习调整参数', '模型评估：测试准确率'],
    },
    teaching: {
      suitableGrades: '初中 ~ 高中',
      duration: '40 分钟',
      tips: ['可以用班级同学的照片做"人脸识别班级版"', '讨论数据量对模型效果的影响'],
    },
    interaction: { type: 'interactive', hasRealInteraction: true },
    relatedLessons: [
      { courseId: 'course-primary-ai-intro', courseTitle: 'AI 通识入门', lessonTitle: '图像里的秘密', lessonIndex: 6 },
      { courseId: 'course-senior-algorithm', courseTitle: 'AI 算法基础', lessonTitle: '神经网络基础', lessonIndex: 5 },
    ],
  },
  {
    id: 'cv-binarization',
    name: '图像二值化',
    category: 'computer-vision',
    categoryLabel: CATEGORY_LABELS['computer-vision'],
    icon: 'Contrast',
    tier: '探究',
    level: '入门',
    techTag: '图像处理',
    description: '上传图片，调节阈值，观察图像二值化的效果变化。',
    shortDesc: '让图片只有黑和白',
    knowledge: {
      title: '图像二值化',
      content:
        '图像二值化是最简单的图像处理操作：将灰度图像的每个像素与一个"阈值"比较，大于阈值的变成白色，小于阈值的变成黑色，整张图就只有黑白两种颜色。二值化常用于文字识别前的预处理。',
      keyPoints: ['灰度化：先把彩色图变成灰度图', '阈值比较：逐像素与阈值比较', '输出二值图：只有黑和白'],
    },
    teaching: {
      suitableGrades: '小学高段 ~ 初中',
      duration: '15 分钟',
      tips: ['让学生自己调节阈值观察变化', '结合数字图像的本质（像素）来讲'],
    },
    interaction: { type: 'interactive', hasRealInteraction: true },
  },
  {
    id: 'cv-edge-detection',
    name: '边缘检测',
    category: 'computer-vision',
    categoryLabel: CATEGORY_LABELS['computer-vision'],
    icon: 'Frame',
    tier: '探究',
    level: '进阶',
    techTag: '图像处理',
    description: '体验 Sobel / Canny 边缘检测算法，看看 AI 如何"看到"物体轮廓。',
    shortDesc: 'AI 看到的物体轮廓',
    knowledge: {
      title: '边缘检测原理',
      content:
        '边缘检测通过计算像素之间的亮度差异（梯度）来找到物体的轮廓。亮度变化剧烈的地方就是边缘。Sobel 算子通过水平和垂直两个方向的卷积核计算梯度，Canny 则是更精细的多步边缘检测算法。',
      keyPoints: ['梯度计算：找亮度变化大的位置', '非极大值抑制：只保留最强的边', '双阈值：筛选真假边缘'],
    },
    teaching: {
      suitableGrades: '初中 ~ 高中',
      duration: '20 分钟',
      tips: ['用不同类型的图片来观察边缘效果的差异', '讨论边缘检测的实际应用'],
    },
    interaction: { type: 'interactive', hasRealInteraction: true },
    relatedLessons: [
      { courseId: 'course-junior-vision', courseTitle: '机器视觉入门', lessonTitle: '图像识别入门', lessonIndex: 2 },
    ],
  },
  {
    id: 'cv-digit-recognition',
    name: '手写数字识别',
    category: 'computer-vision',
    categoryLabel: CATEGORY_LABELS['computer-vision'],
    icon: 'Pencil',
    tier: '训练',
    level: '进阶',
    techTag: 'MNIST',
    description: '在画板上写一个数字，让 AI 来认一认你写的是几。',
    shortDesc: '你的手写 AI 能认对吗',
    isRecommended: true,
    knowledge: {
      title: '手写数字识别',
      content:
        '手写数字识别是深度学习的"Hello World"。MNIST 数据集包含 6 万张 28×28 的手写数字图片，通过训练神经网络可以达到 99% 以上的准确率。这个项目训练的是一个简化版的 CNN 模型。',
      keyPoints: ['MNIST 数据集：经典入门数据集', 'CNN 网络：提取数字特征', '推理预测：判断你写的是几'],
    },
    teaching: {
      suitableGrades: '初中 ~ 高中',
      duration: '15 分钟',
      tips: [
        '让每个学生都试写几个数字，观察准确率',
        '讨论为什么写得潦草时 AI 会认错',
        '类比人类是如何学习识别数字的',
      ],
    },
    interaction: { type: 'interactive', hasRealInteraction: true },
    relatedLessons: [
      { courseId: 'course-junior-vision', courseTitle: '机器视觉入门', lessonTitle: '图像识别入门', lessonIndex: 2 },
      { courseId: 'course-senior-algorithm', courseTitle: 'AI 算法基础', lessonTitle: '神经网络基础', lessonIndex: 5 },
    ],
  },

  // ========== 自然语言处理 ==========
  {
    id: 'nlp-tts',
    name: '语音合成',
    category: 'nlp',
    categoryLabel: CATEGORY_LABELS['nlp'],
    icon: 'Volume2',
    tier: '体验',
    level: '入门',
    techTag: '语音合成',
    description: '输入一段文字，让 AI 用语音朗读出来，可以选择不同的音色和语速。',
    shortDesc: '让文字开口说话',
    knowledge: {
      title: '语音合成（TTS）技术',
      content:
        '语音合成（Text-to-Speech）是让计算机把文字变成语音的技术。传统 TTS 通过拼接录音片段实现，现代 TTS 用深度学习模型直接生成语音波形，可以模拟不同人的声音、语气和情感。',
      keyPoints: ['文本分析：理解文字的发音和韵律', '声学模型：生成语音频谱', '声码器：把频谱变成声音'],
    },
    teaching: {
      suitableGrades: '小学低段 ~ 高中',
      duration: '10 分钟',
      tips: ['让学生输入自己写的句子听 AI 朗读', '讨论 AI 语音和真人语音的区别'],
    },
    interaction: { type: 'interactive', hasRealInteraction: true },
    relatedLessons: [
      { courseId: 'course-primary-ai-intro', courseTitle: 'AI 通识入门', lessonTitle: '语音交互初体验', lessonIndex: 4 },
    ],
  },
  {
    id: 'nlp-asr',
    name: '语音转写',
    category: 'nlp',
    categoryLabel: CATEGORY_LABELS['nlp'],
    icon: 'Mic',
    tier: '体验',
    level: '入门',
    techTag: '语音识别',
    description: '对着麦克风说一段话，AI 实时把你说的话转写成文字。',
    shortDesc: '说话变成文字',
    isRecommended: true,
    knowledge: {
      title: '语音识别（ASR）技术',
      content:
        '自动语音识别（Automatic Speech Recognition）让计算机"听懂"人类说话。它先把音频切分成帧，提取声学特征，然后用声学模型识别每个帧对应的音素，再用语言模型修正成通顺的文字。',
      keyPoints: ['特征提取：从音频中提取声学特征', '声学模型：识别音素', '语言模型：组合成通顺的句子'],
    },
    teaching: {
      suitableGrades: '小学低段 ~ 高中',
      duration: '10 分钟',
      tips: ['让学生体验不同语速、口音下的识别效果', '讨论语音识别的应用场景'],
    },
    interaction: { type: 'interactive', hasRealInteraction: true },
    relatedLessons: [
      { courseId: 'course-primary-ai-intro', courseTitle: 'AI 通识入门', lessonTitle: '语音交互初体验', lessonIndex: 3 },
    ],
  },
  {
    id: 'nlp-qa',
    name: '智能问答',
    category: 'nlp',
    categoryLabel: CATEGORY_LABELS['nlp'],
    icon: 'MessageCircle',
    tier: '体验',
    level: '入门',
    techTag: '问答系统',
    description: '输入一个问题，AI 在知识库中查找答案并回答你。',
    shortDesc: '有问题问 AI',
    knowledge: {
      title: '智能问答系统',
      content:
        '智能问答系统让用户用自然语言提问，系统直接给出答案。早期问答系统基于知识图谱和信息检索，现代问答系统结合大语言模型，能理解更复杂的问题并生成更自然的回答。',
      keyPoints: ['问题理解：分析用户在问什么', '知识检索：找到相关信息', '答案生成：组织成通顺的回答'],
    },
    teaching: {
      suitableGrades: '小学高段 ~ 高中',
      duration: '15 分钟',
      tips: ['让学生尝试各种类型的问题', '引导学生思考 AI 回答的可信度'],
    },
    interaction: { type: 'demo', hasRealInteraction: true },
  },
  {
    id: 'nlp-turing',
    name: '图灵测试',
    category: 'nlp',
    categoryLabel: CATEGORY_LABELS['nlp'],
    icon: 'Bot',
    tier: '探究',
    level: '进阶',
    techTag: '人机对话',
    description: '和 AI 聊天，你能分辨出对面是 AI 还是真人吗？体验图灵测试的趣味。',
    shortDesc: '你能分辨 AI 和真人吗',
    isRecommended: true,
    knowledge: {
      title: '图灵测试与强人工智能',
      content:
        '图灵测试由计算机科学家阿兰·图灵在 1950 年提出：如果一台机器能在对话中让人类无法分辨它是机器还是人，就可以认为这台机器具有智能。现代大语言模型正在越来越接近通过图灵测试。',
      keyPoints: ['图灵测试：判断机器是否具有智能的经典方法', '中文房间：关于理解的哲学思考', '强 AI vs 弱 AI：真正的智能 vs 模拟智能'],
    },
    teaching: {
      suitableGrades: '初中 ~ 高中',
      duration: '25 分钟',
      tips: [
        '可以组织"真假 AI"课堂活动',
        '引导学生思考：什么是真正的智能？',
        '结合 AI 伦理展开讨论',
      ],
    },
    interaction: { type: 'interactive', hasRealInteraction: true },
  },
  {
    id: 'nlp-news-classification',
    name: '新闻文本分类',
    category: 'nlp',
    categoryLabel: CATEGORY_LABELS['nlp'],
    icon: 'Newspaper',
    tier: '训练',
    level: '进阶',
    techTag: '文本分类',
    description: '输入一段新闻内容，AI 自动判断它属于什么类别（科技/体育/财经等）。',
    shortDesc: 'AI 自动给新闻分类',
    knowledge: {
      title: '文本分类技术',
      content:
        '文本分类是自然语言处理的基础任务。先把文本转换成向量（词嵌入），然后用分类器判断类别。常见方法包括朴素贝叶斯、SVM 和深度学习中的 TextCNN、BERT 等。',
      keyPoints: ['文本表示：把文字变成数字向量', '分类模型：判断属于哪个类别', '评估指标：准确率、召回率、F1'],
    },
    teaching: {
      suitableGrades: '高中',
      duration: '25 分钟',
      tips: ['让学生自己写几句话让 AI 分类', '讨论分类错误的原因'],
    },
    interaction: { type: 'demo', hasRealInteraction: true },
  },
  {
    id: 'nlp-wordcloud',
    name: '词云生成',
    category: 'nlp',
    categoryLabel: CATEGORY_LABELS['nlp'],
    icon: 'Cloud',
    tier: '探究',
    level: '入门',
    techTag: '词频统计',
    description: '粘贴一段文字，自动生成词云图，一眼看出关键词。',
    shortDesc: '文字变成云彩图',
    knowledge: {
      title: '词云与词频统计',
      content:
        '词云是文本可视化的一种方式。先统计文本中每个词出现的频率，频率越高的词在词云中显示得越大越醒目。词云能直观地展示文本的主题和重点词汇。',
      keyPoints: ['分词：把句子切分成词语', '词频统计：统计每个词出现的次数', '可视化：用词的大小表示频率'],
    },
    teaching: {
      suitableGrades: '小学高段 ~ 高中',
      duration: '15 分钟',
      tips: ['可以用课文、作文来生成词云', '讨论词云的优缺点和适用场景'],
    },
    interaction: { type: 'interactive', hasRealInteraction: true },
  },

  // ========== 机器学习 ==========
  {
    id: 'ml-decision-tree',
    name: '决策树',
    category: 'machine-learning',
    categoryLabel: CATEGORY_LABELS['machine-learning'],
    icon: 'GitBranch',
    tier: '探究',
    level: '进阶',
    techTag: '决策树',
    description: '通过交互方式理解决策树如何一步步做决策，体验分类的过程。',
    shortDesc: '像树一样一步步做决定',
    knowledge: {
      title: '决策树算法',
      content:
        '决策树是一种基于树形结构的分类算法。它从根节点开始，根据特征的判断一步步往下走，最终到达叶节点得到分类结果。决策树的每个内部节点代表一个特征判断，分支代表判断结果。',
      keyPoints: ['根节点：第一个判断条件', '内部节点：中间判断步骤', '叶节点：最终分类结果'],
    },
    teaching: {
      suitableGrades: '初中 ~ 高中',
      duration: '25 分钟',
      tips: ['用"猜水果""猜动物"等游戏引入决策树概念', '让学生自己设计一棵简单的决策树'],
    },
    interaction: { type: 'interactive', hasRealInteraction: true },
    relatedLessons: [
      { courseId: 'course-senior-algorithm', courseTitle: 'AI 算法基础', lessonTitle: '经典算法探秘', lessonIndex: 2 },
    ],
  },
  {
    id: 'ml-clustering',
    name: '聚类分析',
    category: 'machine-learning',
    categoryLabel: CATEGORY_LABELS['machine-learning'],
    icon: 'CircleDot',
    tier: '探究',
    level: '进阶',
    techTag: 'K-Means',
    description: '在二维平面上点一些点，看看 K-Means 算法怎么自动把它们分组。',
    shortDesc: '物以类聚，人以群分',
    isRecommended: true,
    knowledge: {
      title: 'K-Means 聚类算法',
      content:
        '聚类是一种无监督学习算法，它能自动把相似的数据分成若干组（簇）。K-Means 是最经典的聚类算法：先随机选 K 个中心点，然后把每个点归到最近的中心，再更新中心位置，反复迭代直到稳定。',
      keyPoints: ['无监督学习：不需要标注数据', 'K 值：决定分成几类', '迭代优化：反复调整直到稳定'],
    },
    teaching: {
      suitableGrades: '初中 ~ 高中',
      duration: '20 分钟',
      tips: ['让学生先目测分组再看算法结果对比', '讨论 K 值选择对结果的影响'],
    },
    interaction: { type: 'interactive', hasRealInteraction: true },
    relatedLessons: [
      { courseId: 'course-senior-algorithm', courseTitle: 'AI 算法基础', lessonTitle: '经典算法探秘', lessonIndex: 3 },
    ],
  },
  {
    id: 'ml-neural-network',
    name: '神经网络原理',
    category: 'machine-learning',
    categoryLabel: CATEGORY_LABELS['machine-learning'],
    icon: 'Brain',
    tier: '探究',
    level: '进阶',
    techTag: '神经网络',
    description: '可视化展示神经网络的结构和工作原理，调节权重观察输出变化。',
    shortDesc: 'AI 的大脑长什么样',
    knowledge: {
      title: '人工神经网络',
      content:
        '人工神经网络受生物神经网络启发，由许多人工神经元层层连接组成。每个神经元接收输入，乘以权重，加上偏置，经过激活函数后输出。通过反向传播算法调整权重，神经网络就能"学习"数据中的规律。',
      keyPoints: ['神经元：基本计算单元', '层结构：输入层/隐藏层/输出层', '反向传播：调整权重的学习方法'],
    },
    teaching: {
      suitableGrades: '高中',
      duration: '30 分钟',
      tips: ['结合生物神经元类比讲解', '用简单的 XOR 问题演示神经网络的学习过程'],
    },
    interaction: { type: 'interactive', hasRealInteraction: true },
  },
  {
    id: 'ml-shortest-path',
    name: '最短路径',
    category: 'machine-learning',
    categoryLabel: CATEGORY_LABELS['machine-learning'],
    icon: 'Route',
    tier: '探究',
    level: '入门',
    techTag: '图算法',
    description: '在地图上选起点和终点，看看 Dijkstra 算法如何找到最短路径。',
    shortDesc: 'AI 帮你找最短路线',
    knowledge: {
      title: 'Dijkstra 最短路径算法',
      content:
        'Dijkstra 算法是经典的最短路径算法。它从起点开始，每次选离起点最近且未访问过的节点，更新它的邻居节点的距离，重复这个过程直到到达终点。就像水波纹扩散一样，先到达的就是最短路径。',
      keyPoints: ['贪心策略：每次选最近的节点', '松弛操作：更新邻居的距离', '最优子结构：最短路径的子路径也是最短的'],
    },
    teaching: {
      suitableGrades: '初中 ~ 高中',
      duration: '20 分钟',
      tips: ['用地图导航的例子引入', '让学生手动模拟算法过程'],
    },
    interaction: { type: 'interactive', hasRealInteraction: true },
  },
  {
    id: 'ml-data-viz',
    name: '大数据可视化',
    category: 'machine-learning',
    categoryLabel: CATEGORY_LABELS['machine-learning'],
    icon: 'BarChart3',
    tier: '体验',
    level: '入门',
    techTag: '数据可视化',
    description: '上传数据或使用示例数据，一键生成各种图表，直观感受数据之美。',
    shortDesc: '数据也可以很好看',
    knowledge: {
      title: '数据可视化',
      content:
        '数据可视化是用图表的方式展示数据，让人一眼就能看出数据中的规律和趋势。常见的图表类型包括柱状图、折线图、饼图、散点图、热力图等，不同的图表适合展示不同类型的数据关系。',
      keyPoints: ['柱状图：比较大小', '折线图：看趋势变化', '散点图：发现相关性'],
    },
    teaching: {
      suitableGrades: '小学高段 ~ 高中',
      duration: '15 分钟',
      tips: ['用班级成绩、身高体重等真实数据做可视化', '讨论什么样的数据适合什么样的图表'],
    },
    interaction: { type: 'demo', hasRealInteraction: true },
  },

  // ========== AIGC ==========
  {
    id: 'aigc-text-to-image',
    name: 'AI 生图',
    category: 'aigc',
    categoryLabel: CATEGORY_LABELS['aigc'],
    icon: 'ImagePlus',
    tier: '体验',
    level: '入门',
    techTag: '文生图',
    description: '用文字描述你想要的画面，AI 帮你画出来。',
    shortDesc: '文字秒变精美图片',
    isRecommended: true,
    knowledge: {
      title: 'AI 文生图技术',
      content:
        'AI 文生图是基于扩散模型（Diffusion Model）实现的。它先学习大量图片数据，理解文字和图像的对应关系，然后通过"去噪"的过程，从随机噪声中逐步生成符合文字描述的图片。',
      keyPoints: ['扩散模型：从噪声到清晰图像', '文本编码：理解你描述的内容', '生成过程：一步步去噪还原'],
    },
    teaching: {
      suitableGrades: '小学低段 ~ 高中',
      duration: '15 分钟',
      tips: ['让学生描述自己想象的画面让 AI 生成', '讨论 AI 绘画对艺术创作的影响'],
    },
    interaction: { type: 'demo', hasRealInteraction: true },
    relatedLessons: [
      { courseId: 'course-primary-ai-intro', courseTitle: 'AI 通识入门', lessonTitle: 'AIGC 创意工坊', lessonIndex: 7 },
    ],
  },
  {
    id: 'aigc-chat',
    name: 'AI 对话大模型',
    category: 'aigc',
    categoryLabel: CATEGORY_LABELS['aigc'],
    icon: 'MessageSquare',
    tier: '体验',
    level: '入门',
    techTag: '大语言模型',
    description: '和 AI 大模型自由对话，问问题、聊想法、求灵感。',
    shortDesc: '无所不知的 AI 助手',
    isRecommended: true,
    knowledge: {
      title: '大语言模型（LLM）',
      content:
        '大语言模型（Large Language Model）是一种在海量文本数据上训练的超大规模神经网络。它通过预测下一个词的方式学习语言规律，从而能生成通顺、有逻辑的文本回答，甚至能完成写作、编程、推理等复杂任务。',
      keyPoints: ['预训练：在海量数据上学习', '微调：让模型更符合人类偏好', '涌现能力：规模带来的神奇能力'],
    },
    teaching: {
      suitableGrades: '小学高段 ~ 高中',
      duration: '20 分钟',
      tips: ['引导学生正确使用 AI 工具', '讨论 AI 生成内容的可信度和伦理问题'],
    },
    interaction: { type: 'interactive', hasRealInteraction: true },
  },
  {
    id: 'aigc-doodle',
    name: 'AI 涂鸦',
    category: 'aigc',
    categoryLabel: CATEGORY_LABELS['aigc'],
    icon: 'Palette',
    tier: '探究',
    level: '入门',
    techTag: '涂鸦生图',
    description: '画一张简笔画，AI 把你的涂鸦变成精美的艺术作品。',
    shortDesc: '你的涂鸦也能变成大作',
    knowledge: {
      title: '涂鸦生图技术',
      content:
        '涂鸦生图是基于 ControlNet 等条件生成技术实现的。你画的简笔画作为"控制条件"，指导扩散模型按照你的构图来生成精美图片，既保留了你的创意构图，又让画面变得更加丰富好看。',
      keyPoints: ['ControlNet：控制生成的构图', '草图作为条件：保留你的创意', '扩散模型：生成精美细节'],
    },
    teaching: {
      suitableGrades: '小学低段 ~ 高中',
      duration: '15 分钟',
      tips: ['让每个学生都画一张涂鸦然后让 AI 生成', '对比不同涂鸦的生成效果'],
    },
    interaction: { type: 'demo', hasRealInteraction: true },
  },
  {
    id: 'aigc-landscape',
    name: 'AI 山水画',
    category: 'aigc',
    categoryLabel: CATEGORY_LABELS['aigc'],
    icon: 'Mountain',
    tier: '探究',
    level: '进阶',
    techTag: '风格化生成',
    description: '用 AI 生成中国传统山水画风格的作品，感受传统艺术与现代科技的碰撞。',
    shortDesc: 'AI 也会画水墨画',
    knowledge: {
      title: '风格化图像生成',
      content:
        '风格化生成让 AI 学习特定艺术风格（如水墨画、油画、卡通等），然后把普通图片或文字描述转换成对应风格。这涉及到风格迁移和条件生成技术，是 AI + 艺术的经典结合。',
      keyPoints: ['风格迁移：把一张图的风格用到另一张上', '风格学习：AI 学会某种艺术风格', '条件生成：按指定风格生成新图'],
    },
    teaching: {
      suitableGrades: '小学高段 ~ 高中',
      duration: '15 分钟',
      tips: [
        '结合美术课，让学生了解中国传统山水画',
        '讨论 AI 艺术和人类艺术的关系',
      ],
    },
    interaction: { type: 'demo', hasRealInteraction: true },
  },
];

export function getProjectById(id: string): IAiLabProject | undefined {
  return AI_LAB_PROJECTS.find((p) => p.id === id);
}

export function getProjectsByCategory(category: AiLabCategory): IAiLabProject[] {
  return AI_LAB_PROJECTS.filter((p) => p.category === category);
}

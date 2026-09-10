// EXPORTS: ITraining, IQuizQuestion, MOCK_TRAININGS, QUIZ_PRIMARY, QUIZ_JUNIOR, QUIZ_SENIOR, getQuizByStage

export interface ITraining {
  id: string;
  title: string;
  stage: 'primary' | 'junior' | 'senior';
  type: 'assessment' | 'practice';
  module: string;
  duration: number; // 分钟
  questionCount: number;
  description: string;
  difficulty: '入门' | '进阶' | '挑战';
}

export interface IQuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  knowledgePoint: string;
}

export const MOCK_TRAININGS: ITraining[] = [
  {
    id: '1',
    title: '小学 AI 素养测评',
    stage: 'primary',
    type: 'assessment',
    module: '综合素养',
    duration: 30,
    questionCount: 18,
    description: '面向小学 3-6 年级，覆盖 AI 基础概念、感知技术与生活应用',
    difficulty: '入门',
  },
  {
    id: '2',
    title: '初中算法基础练习',
    stage: 'junior',
    type: 'practice',
    module: '身边的人工智能算法',
    duration: 25,
    questionCount: 18,
    description: '机器学习原理、智能硬件与 AI 伦理综合练习题',
    difficulty: '进阶',
  },
  {
    id: '3',
    title: '高中伦理与社会测评',
    stage: 'senior',
    type: 'assessment',
    module: '人工智能伦理与社会责任',
    duration: 45,
    questionCount: 18,
    description: '深度学习、大模型、AI 伦理与产业发展综合测评',
    difficulty: '挑战',
  },
];

// ===== 小学段题库（18 题）=====
export const QUIZ_PRIMARY: IQuizQuestion[] = [
  {
    id: 1,
    question: '下列哪一项属于人工智能的应用？',
    options: ['用计算器算账', '语音助手回答问题', '普通闹钟响铃', '电视播放节目'],
    correctIndex: 1,
    explanation:
      '语音助手通过语音识别和自然语言处理技术理解人类语言并给出回答，属于典型的人工智能应用。计算器、闹钟、电视都是按照固定程序运行，没有智能。',
    knowledgePoint: 'AI 基本概念与生活应用',
  },
  {
    id: 2,
    question: '关于"数据"的描述，以下哪个是正确的？',
    options: [
      '只有数字才是数据',
      '文字、图片、声音都可以是数据',
      '数据必须存储在电脑里',
      '数据不能被修改',
    ],
    correctIndex: 1,
    explanation:
      '数据的形式非常多样，包括数字、文字、图片、声音、视频等，任何可以被记录和分析的信息都可以称为数据。数据不一定要存在电脑里，写在纸上的数字也是数据。',
    knowledgePoint: '数据基本概念',
  },
  {
    id: 3,
    question: '模式识别是人工智能的重要技术，下列哪个应用使用了模式识别？',
    options: ['微信发消息', '人脸识别解锁手机', '播放音乐', '给文件重命名'],
    correctIndex: 1,
    explanation:
      '人脸识别通过算法提取人脸的特征模式（眼睛、鼻子、嘴巴的形状和位置等），与已有的人脸数据进行比对，属于模式识别技术的典型应用。',
    knowledgePoint: '模式识别 / 图像识别',
  },
  {
    id: 4,
    question: '下列关于机器学习的说法，正确的是？',
    options: [
      '机器学习就是让机器像人一样思考',
      '机器学习是让机器从数据中学习规律',
      '机器学习不需要数据',
      '机器学习只能用来玩游戏',
    ],
    correctIndex: 1,
    explanation:
      '机器学习是人工智能的一个分支，核心是让计算机通过大量数据学习规律，从而做出预测或决策。它并不是让机器像人一样思考，而是从数据中总结模式。',
    knowledgePoint: '机器学习初体验',
  },
  {
    id: 5,
    question: '使用人工智能时，下列哪种做法是正确的？',
    options: [
      '随便把个人照片上传到陌生的 AI 网站',
      '用 AI 生成作业答案直接抄',
      '了解 AI 的局限性，合理使用 AI 工具',
      '认为 AI 说的一定都是对的',
    ],
    correctIndex: 2,
    explanation:
      'AI 有它的优势也有局限性，我们应该了解 AI 的能力边界，负责任地、合理地使用 AI 工具，同时注意保护个人隐私，不随意上传个人信息。',
    knowledgePoint: 'AI 伦理启蒙',
  },
  {
    id: 6,
    question: '手机上"语音转文字"功能使用了哪项人工智能技术？',
    options: ['图像识别', '语音识别', '人脸识别', '自动驾驶'],
    correctIndex: 1,
    explanation:
      '语音转文字（语音识别）技术能把人说的话转换成文字，它让机器"听懂"人类的语言，是自然语言处理领域的基础技术之一。',
    knowledgePoint: '语音识别',
  },
  {
    id: 7,
    question: '当你用手机拍照搜索"这是什么花"时，使用了哪项 AI 技术？',
    options: ['语音合成', '图像识别', '文字翻译', '推荐算法'],
    correctIndex: 1,
    explanation:
      '拍照识花使用的是图像识别技术，AI 通过分析图片中的花朵形状、颜色、纹理等特征，与数据库中的花卉图片进行比对，从而判断花的种类。',
    knowledgePoint: '图像识别 / 计算机视觉',
  },
  {
    id: 8,
    question: '以下哪个场景使用了"推荐算法"？',
    options: [
      '视频 app 给你推荐喜欢的视频',
      '用计算器做数学题',
      '把照片打印出来',
      '给朋友打电话',
    ],
    correctIndex: 0,
    explanation:
      '推荐算法是人工智能的重要应用，它根据你之前看过的内容、喜欢的内容，分析你的兴趣，然后推荐你可能喜欢的新视频、音乐、商品等。',
    knowledgePoint: '推荐算法 / AI 与生活',
  },
  {
    id: 9,
    question: '关于人脸识别技术，下列说法正确的是？',
    options: [
      '人脸识别可以随意使用，没有任何限制',
      '人脸识别必须经过本人同意才能采集',
      '所有人脸照片都应该公开分享',
      '人脸识别绝对不会出错',
    ],
    correctIndex: 1,
    explanation:
      '人脸信息属于个人敏感信息，人脸识别技术的使用必须遵守法律法规，采集人脸信息需要经过本人同意。我们要保护自己的人脸隐私。',
    knowledgePoint: 'AI 伦理启蒙 / 隐私保护',
  },
  {
    id: 10,
    question: 'AI 绘画工具（如文生图）是根据什么生成图片的？',
    options: ['随机乱画', '用户输入的文字描述', '复制别人的画', '直接拍照'],
    correctIndex: 1,
    explanation:
      'AI 绘画工具根据用户输入的文字描述（称为"提示词"或 Prompt）来生成图片。它通过学习大量图片和文字的对应关系，理解文字含义并创作出新的图像。',
    knowledgePoint: 'AI 创造工具 / 生成式 AI',
  },
  {
    id: 11,
    question: '下列哪个是"自然语言处理"的应用？',
    options: ['手机解锁', '智能翻译', '扫地机器人', '智能台灯'],
    correctIndex: 1,
    explanation:
      '自然语言处理（NLP）是让计算机理解和生成人类语言的技术。智能翻译、语音助手、智能问答都是典型的自然语言处理应用。',
    knowledgePoint: '自然语言处理初识',
  },
  {
    id: 12,
    question: '"训练"一个 AI 模型，最需要的是什么？',
    options: ['大量的数据', '漂亮的界面', '很大的屏幕', '很多游戏'],
    correctIndex: 0,
    explanation:
      '训练 AI 模型最关键的是大量的数据。就像小朋友通过看很多猫的照片来认识猫一样，AI 也需要看大量数据才能学会识别规律。',
    knowledgePoint: '机器学习初体验 / 数据与训练',
  },
  {
    id: 13,
    question: '以下哪个不是人工智能应用？',
    options: ['智能扫地机器人', '自动驾驶汽车', '普通的木质算盘', '智能语音音箱'],
    correctIndex: 2,
    explanation:
      '普通算盘是一种传统计算工具，需要人手动操作，没有智能。扫地机器人（路径规划）、自动驾驶（环境感知与决策）、智能音箱（语音交互）都用到了 AI 技术。',
    knowledgePoint: 'AI 基本概念辨析',
  },
  {
    id: 14,
    question: 'AI 合成语音（让机器说话）使用的技术叫什么？',
    options: ['语音识别', '语音合成', '图像识别', '手写识别'],
    correctIndex: 1,
    explanation:
      '语音合成（TTS，Text-to-Speech）是把文字转换成语音的技术，让机器能够"说话"。它和语音识别刚好相反——语音识别是"听进去"，语音合成是"说出来"。',
    knowledgePoint: '语音合成 / 人机交互',
  },
  {
    id: 15,
    question: '在使用 AI 工具时，我们应该怎样对待个人信息？',
    options: [
      '把家庭住址、手机号随便填写',
      '不随意上传姓名、照片等私人信息',
      '把别人的照片也一起上传',
      '无所谓，反正 AI 不会泄露',
    ],
    correctIndex: 1,
    explanation:
      '使用 AI 工具时要注意保护个人隐私，不随意上传真实姓名、照片、家庭住址等私人信息，也不要上传他人的信息。每个人都有隐私权。',
    knowledgePoint: 'AI 伦理 / 隐私保护',
  },
  {
    id: 16,
    question: '关于"自动驾驶汽车"，下列说法正确的是？',
    options: [
      '自动驾驶汽车完全不需要人',
      '自动驾驶靠传感器和 AI 算法感知周围环境',
      '自动驾驶汽车一定会出事故',
      '自动驾驶汽车只能在天上飞',
    ],
    correctIndex: 1,
    explanation:
      '自动驾驶汽车通过摄像头、雷达、激光雷达等多种传感器感知周围环境，再由 AI 算法做出驾驶决策。目前大多数自动驾驶仍需要人类驾驶员随时准备接管。',
    knowledgePoint: 'AI 应用 / 自动驾驶',
  },
  {
    id: 17,
    question: '要让 AI 学会"区分猫和狗"，最好的方法是？',
    options: [
      '直接告诉 AI 规则：猫有尖耳朵',
      '给 AI 看很多猫和狗的照片让它学习',
      '让 AI 读一本关于动物的书',
      '把 AI 放进动物园',
    ],
    correctIndex: 1,
    explanation:
      '让 AI 学会分类最有效的方法是提供大量标注好的数据（很多猫和狗的照片），AI 通过机器学习算法从数据中自动总结出猫和狗的特征区别。',
    knowledgePoint: '机器学习 / 数据标注',
  },
  {
    id: 18,
    question: '下列关于 AI 的说法，哪个是正确的？',
    options: [
      'AI 无所不能，可以替代人类做所有事',
      'AI 是人类的工具，可以帮助我们更好地学习和生活',
      'AI 会自己思考和有感情',
      'AI 只有坏处，我们不应该使用它',
    ],
    correctIndex: 1,
    explanation:
      'AI 是人类创造的工具，它可以在很多方面帮助我们提高效率，但它没有真正的意识和感情，也不是无所不能的。我们要学会合理、负责任地使用 AI。',
    knowledgePoint: 'AI 基本认知 / AI 与人类',
  },
];

// ===== 初中段题库（18 题）=====
export const QUIZ_JUNIOR: IQuizQuestion[] = [
  {
    id: 101,
    question: '在机器学习中，"监督学习"的含义是？',
    options: [
      '学习过程需要老师现场监督',
      '使用带有"正确答案"标注的数据进行训练',
      '机器自己随便学习，不需要数据',
      '只在白天学习的算法',
    ],
    correctIndex: 1,
    explanation:
      '监督学习是机器学习的一种方式，训练数据中每个样本都有明确的"标签"（即正确答案）。算法通过学习输入与输出之间的对应关系，来预测新数据的结果。例如用已标注"猫/狗"的图片训练分类器。',
    knowledgePoint: '监督学习原理',
  },
  {
    id: 102,
    question: '在训练 AI 识别动物之前，给图片打上"猫""狗""鸟"的标签，这个过程叫什么？',
    options: ['数据清洗', '数据标注', '数据删除', '数据压缩'],
    correctIndex: 1,
    explanation:
      '数据标注是指为原始数据（图片、文本、语音等）添加标签或说明的过程，它是监督学习的前提。标注质量直接影响 AI 模型的最终效果。',
    knowledgePoint: '数据标注',
  },
  {
    id: 103,
    question: 'AI 图像分类模型的"训练"和"推理"分别指什么？',
    options: [
      '训练是用数据学习规律，推理是用学到的模型做预测',
      '训练是让机器跑步，推理是让机器思考',
      '训练是写代码，推理是读代码',
      '训练和推理是一回事',
    ],
    correctIndex: 0,
    explanation:
      '训练（Training）是用大量标注数据让模型学习规律的过程，计算量大、耗时长；推理（Inference）是用训练好的模型对新数据进行预测的过程，速度快、可以实时进行。',
    knowledgePoint: '训练与推理',
  },
  {
    id: 104,
    question: '下列关于 AI 算法"偏见"的说法，正确的是？',
    options: [
      'AI 是客观的，绝对不会有偏见',
      '如果训练数据本身有偏差，AI 学到的结果也会有偏见',
      '偏见只存在于人类身上，AI 不会有',
      'AI 的偏见无法被纠正',
    ],
    correctIndex: 1,
    explanation:
      'AI 的偏见来源于训练数据。如果训练数据中某些群体的样本不足或标签有偏向，模型就会学到这种偏见，做出不公平的判断。这是 AI 伦理中的重要问题，可以通过改进数据和算法来缓解。',
    knowledgePoint: 'AI 伦理 / 算法偏见',
  },
  {
    id: 105,
    question: '智能音箱能听懂人说话并给出回应，涉及的核心技术不包括以下哪项？',
    options: ['语音识别（ASR）', '自然语言理解（NLU）', '语音合成（TTS）', '图像分割'],
    correctIndex: 3,
    explanation:
      '智能音箱的语音交互流程是：语音识别（把话转成文字）→ 自然语言理解（理解意思）→ 生成回答 → 语音合成（把文字读出来）。图像分割是计算机视觉技术，与语音交互无关。',
    knowledgePoint: '语音交互技术栈',
  },
  {
    id: 106,
    question: '掌控板、micro:bit 这类智能硬件中，用来感知环境光线强弱的部件叫什么？',
    options: ['按钮', '光线传感器', '蜂鸣器', 'LED 灯'],
    correctIndex: 1,
    explanation:
      '光线传感器（光敏电阻/光敏传感器）可以感知环境光线的强弱，将光信号转换为电信号，是智能硬件中常用的输入设备之一。按钮是输入设备但不能感光，蜂鸣器和 LED 是输出设备。',
    knowledgePoint: '智能硬件 / 传感器',
  },
  {
    id: 107,
    question: '在 AI 图像识别中，"特征"指的是什么？',
    options: [
      '图片的文件名',
      '图像中能够帮助区分不同类别的关键信息',
      '图片的大小',
      '图片的颜色数量',
    ],
    correctIndex: 1,
    explanation:
      '特征是图像中具有区分性的关键信息，比如边缘、纹理、形状、颜色分布等。AI 识别图像的过程，本质上就是提取特征并进行比对和分类的过程。',
    knowledgePoint: '图像分类 / 特征提取',
  },
  {
    id: 108,
    question: '关于 AI 与隐私保护，下列做法错误的是？',
    options: [
      '使用 AI 工具时仔细阅读隐私政策',
      '在公开场合随意使用人脸打卡 App',
      '不把自己和他人的敏感信息喂给 AI',
      '了解自己的数据将如何被使用',
    ],
    correctIndex: 1,
    explanation:
      '人脸信息属于高度敏感的个人生物特征信息，随意使用来源不明的人脸 App 可能导致个人隐私泄露。我们应该增强隐私保护意识，谨慎授权生物信息采集。',
    knowledgePoint: 'AI 伦理 / 隐私保护',
  },
  {
    id: 109,
    question: 'Prompt（提示词）工程的核心是？',
    options: [
      '写很长的代码',
      '设计合适的输入指令，让大模型给出更好的输出',
      '给模型训练更多数据',
      '让模型变得更快',
    ],
    correctIndex: 1,
    explanation:
      'Prompt 工程是指通过设计和优化输入提示词，引导大语言模型生成更高质量、更符合预期的输出。好的提示词通常包括清晰的任务描述、背景信息、输出格式要求等。',
    knowledgePoint: 'Prompt 工程入门',
  },
  {
    id: 110,
    question: '下列关于 AI 与编程关系的说法，正确的是？',
    options: [
      '学 AI 不需要会编程',
      'Python 是 AI 开发中最常用的编程语言之一',
      'AI 只能用图形化编程，不能写代码',
      '所有编程语言都只适合做 AI',
    ],
    correctIndex: 1,
    explanation:
      'Python 因其丰富的 AI 库（如 NumPy、TensorFlow、PyTorch、scikit-learn）和简洁的语法，成为 AI 开发中最主流的编程语言。图形化编程适合入门，代码编程则更灵活强大。',
    knowledgePoint: 'AI 与编程结合',
  },
  {
    id: 111,
    question: 'AI 视觉模块（如 K210）进行图像识别时，处理图像的正确顺序大致是？',
    options: [
      '图像采集 → 特征提取 → 模型推理 → 输出结果',
      '输出结果 → 图像采集 → 特征提取',
      '特征提取 → 图像采集 → 输出结果',
      '直接输出结果，不需要处理',
    ],
    correctIndex: 0,
    explanation:
      'AI 视觉识别的基本流程是：先用摄像头采集图像（输入），然后提取图像特征，再送入训练好的模型进行推理判断，最后输出识别结果。这是一个从感知到决策的过程。',
    knowledgePoint: 'AI 视觉工作原理',
  },
  {
    id: 112,
    question: '关于"算法推荐"可能带来的问题，下列说法错误的是？',
    options: [
      '可能导致"信息茧房"，让人只看到自己喜欢的内容',
      '可能会放大虚假信息的传播',
      '算法推荐完全有益，没有任何问题',
      '可能侵犯用户的隐私偏好',
    ],
    correctIndex: 2,
    explanation:
      '算法推荐在带来便利的同时，也可能引发信息茧房、虚假信息扩散、隐私泄露等问题。我们要认识到算法推荐的两面性，做数字时代的理性使用者。',
    knowledgePoint: 'AI 社会影响 / 算法推荐',
  },
  {
    id: 113,
    question: '在机器学习中，如果训练数据太少，最可能出现的问题是？',
    options: [
      '模型训练太快',
      '模型学不到充分的规律，泛化能力差',
      '数据会自动增多',
      '模型会变得太聪明',
    ],
    correctIndex: 1,
    explanation:
      '训练数据量不足时，模型无法学到充分的规律，对新数据的预测能力（泛化能力）就会很差。数据量和数据质量是决定机器学习效果的关键因素。',
    knowledgePoint: '数据质量与模型效果',
  },
  {
    id: 114,
    question: '下列哪项属于"生成式 AI"的应用？',
    options: ['用 AI 生成一篇作文', '用 AI 识别图片中的猫', '用 AI 推荐视频', '用 AI 识别语音'],
    correctIndex: 0,
    explanation:
      '生成式 AI 是指能够创造新内容（文字、图片、音频、代码等）的 AI 技术。AI 写作文、AI 绘画、AI 作曲都属于生成式 AI。图像识别、推荐、语音识别属于判别/分类类任务。',
    knowledgePoint: '生成式 AI',
  },
  {
    id: 115,
    question: '智能硬件中，"主控板"的主要作用是？',
    options: [
      '只负责发光',
      '接收传感器信息、运行程序、控制输出设备',
      '只负责供电',
      '只负责发出声音',
    ],
    correctIndex: 1,
    explanation:
      '主控板（如掌控板、micro:bit）是智能硬件的"大脑"，它接收来自传感器的输入信息，运行存储的程序进行计算和判断，然后控制 LED、蜂鸣器、电机等输出设备做出反应。',
    knowledgePoint: '智能硬件 / 主控板',
  },
  {
    id: 116,
    question: '以下关于 AI 安全的说法，正确的是？',
    options: [
      'AI 技术只需要发展，不需要考虑安全',
      'AI 技术的发展应该与安全治理同步推进',
      'AI 安全是大人的事，和学生没关系',
      'AI 一定会危害人类',
    ],
    correctIndex: 1,
    explanation:
      'AI 技术快速发展的同时，必须重视安全和伦理治理。包括数据安全、算法公平、隐私保护、内容合规等，都是 AI 安全的重要内容。每个人都应该具备 AI 安全意识。',
    knowledgePoint: 'AI 安全与治理',
  },
  {
    id: 117,
    question: '"深度学习"通常使用哪种结构来模拟人脑的工作方式？',
    options: ['决策树', '神经网络', '线性回归', '排序算法'],
    correctIndex: 1,
    explanation:
      '深度学习使用人工神经网络（尤其是多层神经网络）来模拟人脑神经元之间的连接和信号传递方式。"深度"指的是网络有很多层，能够学习越来越复杂的特征。',
    knowledgePoint: '深度学习基础',
  },
  {
    id: 118,
    question: '下列关于"AI 创作"（AI 写作/绘画）版权的说法，正确的是？',
    options: [
      'AI 生成的内容可以随便抄别人的作品作为训练数据',
      '使用 AI 生成的内容需要尊重版权和原创者权益',
      'AI 生成的内容没有任何版权问题',
      '把别人的作品直接交给 AI 模仿没有问题',
    ],
    correctIndex: 1,
    explanation:
      'AI 创作涉及复杂的版权问题。训练数据的来源、AI 生成内容的版权归属等都在讨论和规范中。我们在使用 AI 创作时，要尊重他人版权，不抄袭、不侵权。',
    knowledgePoint: 'AI 伦理 / 知识产权',
  },
];

// ===== 高中段题库（18 题）=====
export const QUIZ_SENIOR: IQuizQuestion[] = [
  {
    id: 201,
    question: '下列关于人工神经网络的描述，错误的是？',
    options: [
      '由大量神经元节点相互连接组成',
      '包含输入层、隐藏层和输出层',
      '完全复现了人脑的所有工作机制',
      '通过调整权重来学习数据中的模式',
    ],
    correctIndex: 2,
    explanation:
      '人工神经网络受人脑神经元连接方式的启发，但它是对生物神经网络的简化数学抽象，远没有完全复现人脑的复杂工作机制。人脑有数十亿神经元和万亿级突触连接，机制远比人工神经网络复杂。',
    knowledgePoint: '神经网络基础',
  },
  {
    id: 202,
    question: '在机器学习模型评估中，"准确率"指的是什么？',
    options: [
      '训练所用的时间',
      '正确预测的样本占总样本的比例',
      '模型参数的数量',
      '训练数据的数量',
    ],
    correctIndex: 1,
    explanation:
      '准确率（Accuracy）是最常用的分类模型评估指标，等于正确预测的样本数除以总样本数。但准确率在数据不平衡时可能有误导性，还需要结合精确率、召回率、F1 值等综合评估。',
    knowledgePoint: '模型评估 / 准确率',
  },
  {
    id: 203,
    question: '"过拟合"是指什么现象？',
    options: [
      '模型在训练集和测试集上表现都很好',
      '模型在训练集上表现很好，但在新数据上表现很差',
      '模型训练时间过长',
      '模型参数太少',
    ],
    correctIndex: 1,
    explanation:
      '过拟合（Overfitting）是指模型过度学习了训练数据中的细节和噪声，以至于把随机波动也当成了规律，导致在训练集上表现很好，但在未见过的新数据（测试集）上泛化能力很差。',
    knowledgePoint: '过拟合与泛化',
  },
  {
    id: 204,
    question: '下列哪项不是缓解过拟合的常用方法？',
    options: ['增加训练数据', '使用正则化（Regularization）', '增加模型复杂度和参数', 'Dropout / 早停'],
    correctIndex: 2,
    explanation:
      '增加模型复杂度和参数会让模型更容易过拟合，而不是缓解。缓解过拟合的常用方法包括：增加训练数据、数据增强、正则化（L1/L2）、Dropout、早停（Early Stopping）、降低模型复杂度等。',
    knowledgePoint: '过拟合缓解方法',
  },
  {
    id: 205,
    question: '大语言模型（LLM）的"预训练 + 微调"范式中，预训练的主要目的是？',
    options: [
      '让模型学会一门特定的编程语言',
      '在大规模通用语料上学习语言规律和世界知识',
      '只针对特定任务进行优化',
      '让模型变小变快',
    ],
    correctIndex: 1,
    explanation:
      '预训练是在大规模通用语料上让模型学习语言规律、世界知识和推理能力的过程，是大语言模型能力的基础。微调（Fine-tuning）则是在预训练的基础上，用特定任务数据进一步优化，使其更适合具体场景。',
    knowledgePoint: '大语言模型 / 预训练',
  },
  {
    id: 206,
    question: '关于"算法偏见"，下列说法正确的是？',
    options: [
      '算法是客观的，不会有偏见',
      '算法偏见完全无法解决',
      '算法偏见可能源于训练数据的代表性不足或标注偏差',
      '算法偏见只影响少数人，不必在意',
    ],
    correctIndex: 2,
    explanation:
      '算法偏见的主要来源是训练数据：如果训练数据对某些群体代表性不足，或标注本身带有人类偏见，模型就会学到并放大这些偏见。算法偏见可能影响招聘、信贷、司法等关键领域，需要严肃对待和积极治理。',
    knowledgePoint: 'AI 伦理 / 算法偏见',
  },
  {
    id: 207,
    question: '在计算机视觉中，卷积神经网络（CNN）的核心优势是？',
    options: [
      '可以处理任意长度的文本',
      '能够有效提取图像的局部空间特征',
      '只需要一个神经元就能识别所有物体',
      '不需要训练数据',
    ],
    correctIndex: 1,
    explanation:
      '卷积神经网络通过卷积核（filter）在图像上滑动提取局部特征，并通过多层堆叠逐步构建从低级（边缘、纹理）到高级（物体部件、整体）的特征表示，在图像识别任务上表现优异。',
    knowledgePoint: 'CNN / 计算机视觉',
  },
  {
    id: 208,
    question: '生成式 AI 中的"扩散模型"（Diffusion Model）主要用于什么任务？',
    options: ['图像生成', '语音识别', '文本分类', '数据压缩'],
    correctIndex: 0,
    explanation:
      '扩散模型是当前主流的图像生成技术（如 Stable Diffusion、DALL·E），其核心思想是通过逐步加噪和学习反向去噪过程来生成高质量图像。它在文生图、图生图等任务中表现出色。',
    knowledgePoint: '生成式 AI / 扩散模型',
  },
  {
    id: 209,
    question: '以下哪项最能体现"AI 与学科融合"的教育价值？',
    options: [
      '用 AI 代替老师上课',
      '用 AI 工具辅助各学科的探究式学习（如数据分析、实验模拟、创意表达）',
      '只开设独立的 AI 课程就行',
      '让学生天天和 AI 聊天',
    ],
    correctIndex: 1,
    explanation:
      'AI 与学科融合的核心价值是利用 AI 工具赋能各学科的教与学，比如用数据分析工具做科学探究、用 AI 模拟实验、用生成式 AI 辅助创意表达等，让 AI 成为学习的"认知工具"。',
    knowledgePoint: 'AI 与学科融合',
  },
  {
    id: 210,
    question: 'Transformer 架构中，"自注意力机制"（Self-Attention）的作用是？',
    options: [
      '让模型自己注意休息',
      '让模型在处理序列时关注上下文中的相关部分',
      '让模型参数自动减少',
      '让模型输出更长的文本',
    ],
    correctIndex: 1,
    explanation:
      '自注意力机制是 Transformer 的核心，它能让模型在处理序列中的每个位置时，动态关注序列中其他相关位置的信息，从而捕捉长距离依赖关系。这是大语言模型强大能力的重要基础。',
    knowledgePoint: 'Transformer / 注意力机制',
  },
  {
    id: 211,
    question: '关于 AI 的"可解释性"（Explainability），下列说法错误的是？',
    options: [
      '深度学习模型通常被认为是"黑箱"，可解释性较弱',
      '在医疗、金融、司法等高风险领域，可解释性非常重要',
      '可解释性只关乎学术研究，实际应用中不重要',
      '可解释性有助于发现模型的错误和偏见',
    ],
    correctIndex: 2,
    explanation:
      '可解释性在实际应用中至关重要，尤其在医疗诊断、金融风控、司法判决等高风险领域。如果不知道 AI 为什么做出某个决策，就无法信任和监督它，也难以追责。可解释性是 AI 治理的重要方向。',
    knowledgePoint: 'AI 可解释性 / 可信 AI',
  },
  {
    id: 212,
    question: '下列关于 AI 产业发展的描述，不正确的是？',
    options: [
      'AI 已应用于医疗、金融、制造、交通等多个行业',
      '大模型推动了新一轮 AI 应用浪潮',
      'AI 产业已经完全成熟，没有新的发展空间',
      'AI 与各行业的深度融合是重要发展趋势',
    ],
    correctIndex: 2,
    explanation:
      'AI 产业仍在快速发展中，大模型、多模态、具身智能、AI 科学计算等方向都有巨大的发展空间。AI 与各行业的深度融合也正在进行中，远未到"完全成熟"的阶段。',
    knowledgePoint: 'AI 产业发展',
  },
  {
    id: 213,
    question: '"具身智能"（Embodied AI）主要研究的是？',
    options: [
      '只在虚拟世界中运行的 AI',
      '具有物理身体、能与真实环境交互的 AI 系统',
      '只能用语音交互的 AI',
      '只能处理文本的 AI',
    ],
    correctIndex: 1,
    explanation:
      '具身智能是指具有物理身体（如机器人、无人机等）、能够通过感知和行动与真实物理世界交互的 AI 系统。它结合了计算机视觉、自然语言处理、运动控制等多种 AI 技术，被认为是 AI 发展的重要方向。',
    knowledgePoint: 'AI 前沿 / 具身智能',
  },
  {
    id: 214,
    question: '在 AI 开发中，"训练集、验证集、测试集"的划分目的是？',
    options: [
      '让数据量看起来更大',
      '分别用于模型训练、调参和最终性能评估',
      '让训练速度更快',
      '减少数据存储成本',
    ],
    correctIndex: 1,
    explanation:
      '训练集用于模型学习，验证集用于调整超参数和选择最优模型，测试集用于评估模型的最终泛化能力（必须只在最后使用一次）。合理划分数据集是避免过拟合、获得可靠评估结果的基础。',
    knowledgePoint: '数据集划分',
  },
  {
    id: 215,
    question: '关于 AI 监管与治理，下列说法正确的是？',
    options: [
      'AI 发展太快，监管只会阻碍创新',
      'AI 治理只需要政府做，企业和个人不用参与',
      '发展与治理并重，构建多方参与的 AI 治理体系',
      'AI 监管就是禁止使用 AI',
    ],
    correctIndex: 2,
    explanation:
      'AI 治理需要政府、企业、学术界和社会公众多方参与，在创新发展与风险防范之间寻求平衡。我国已出台《生成式人工智能服务管理暂行办法》等法规，推动 AI 健康有序发展。',
    knowledgePoint: 'AI 治理与监管',
  },
  {
    id: 216,
    question: '"Prompt Injection"（提示注入）攻击的主要风险是？',
    options: [
      '让大模型运行速度变慢',
      '通过精心构造的输入绕过模型安全限制，执行非预期指令',
      '让模型参数变多',
      '让模型忘记训练数据',
    ],
    correctIndex: 1,
    explanation:
      '提示注入是一种针对大语言模型的安全攻击，攻击者通过在用户输入或外部数据中嵌入精心构造的指令，诱使模型绕过安全限制，执行非预期的操作（如泄露系统提示、生成有害内容、执行恶意指令等）。',
    knowledgePoint: 'AI 安全 / 提示注入',
  },
  {
    id: 217,
    question: '在 AI 应用开发中，"API"的主要作用是？',
    options: [
      '提供图形化界面让用户画图',
      '提供标准化接口，让应用程序调用 AI 能力',
      '存储所有训练数据',
      '替换所有编程语言',
    ],
    correctIndex: 1,
    explanation:
      'API（应用程序编程接口）是 AI 能力对外提供服务的标准方式。开发者不需要自己训练大模型，通过调用 AI 服务商提供的 API（如大模型对话 API、图像识别 API 等），就能把 AI 能力集成到自己的应用中。',
    knowledgePoint: 'AI 应用开发 / API',
  },
  {
    id: 218,
    question: '下列关于"多模态大模型"的描述，正确的是？',
    options: [
      '只能处理文本一种类型的数据',
      '能够同时理解和生成文本、图像、音频等多种类型的信息',
      '只在手机上运行的模型',
      '只有一种模态但有多种颜色',
    ],
    correctIndex: 1,
    explanation:
      '多模态大模型能够同时处理和理解多种模态的数据（文本、图像、音频、视频等），实现跨模态的理解和生成（如图生文、文生图、图文对话等），是大模型发展的重要趋势。',
    knowledgePoint: '多模态大模型',
  },
];

// 按学段获取题库
export function getQuizByStage(stage: 'primary' | 'junior' | 'senior'): IQuizQuestion[] {
  switch (stage) {
    case 'primary':
      return QUIZ_PRIMARY;
    case 'junior':
      return QUIZ_JUNIOR;
    case 'senior':
      return QUIZ_SENIOR;
    default:
      return QUIZ_PRIMARY;
  }
}

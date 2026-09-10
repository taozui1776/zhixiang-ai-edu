// EXPORTS: IHardware, IHardwareCategory, HARDWARE_CATEGORIES, HARDWARE_ALL, getHardwareByCategory

export type HardwareStage = 'primary' | 'junior' | 'senior';

export interface IHardware {
  id: string;
  name: string;
  model?: string;
  brand: string;
  imageUrl: string;
  price: string; // 参考价格文字描述
  stages: HardwareStage[];
  programmingTools: string[]; // 适配编程工具
  tagline: string; // 一句话定位
  features?: string[];
  category: HardwareCategoryKey;
  resourceNote?: string; // 教学资源说明
}

export type HardwareCategoryKey = 'mainboard' | 'ai-module' | 'teaching-kit' | 'sensor';

export interface IHardwareCategory {
  key: HardwareCategoryKey;
  title: string;
  subtitle: string;
  icon: 'cpu' | 'eye' | 'box' | 'chip';
}

export const HARDWARE_CATEGORIES: IHardwareCategory[] = [
  {
    key: 'mainboard',
    title: '主控板',
    subtitle: "AI 课堂的「大脑」，承担模型运行与编程控制",
    icon: 'cpu',
  },
  {
    key: 'ai-module',
    title: 'AI 视觉 / 语音模块',
    subtitle: "让硬件「看得见、听得懂」，解锁感知层 AI 实验",
    icon: 'eye',
  },
  {
    key: 'teaching-kit',
    title: '教学套装',
    subtitle: "开箱即用的项目式学习套装，配套完整教学资源",
    icon: 'box',
  },
  {
    key: 'sensor',
    title: '传感器生态',
    subtitle: "丰富的输入输出模块，支持多样化创意项目",
    icon: 'chip',
  },
];

// 统一占位图（后续可替换为真实硬件图）
const PLACEHOLDER_IMG = '/spark/app/app_17dew4qtx2n/runtime/api/v1/storage/object/bucket_aadktjnrk6acw_static/static%2Faadktjlisj2mw_ve_miaoda';

export const HARDWARE_ALL: IHardware[] = [
  // ===== 主控板类 =====
  {
    id: 'mb-1',
    name: '掌控板 3.0',
    model: 'mPython 3.0',
    brand: '盛思',
    imageUrl: PLACEHOLDER_IMG,
    price: '约 ¥150',
    stages: ['primary', 'junior'],
    programmingTools: ['mPython', 'Mind+'],
    tagline: '国产入门级 AI 编程主控板，课堂普及率最高',
    features: ['ESP32-S3 主控', 'OLED 彩屏', '三轴加速度计', '触摸按键', 'WiFi/蓝牙'],
    category: 'mainboard',
  },
  {
    id: 'mb-2',
    name: '掌控板 2.0',
    model: 'mPython 2.0',
    brand: '盛思',
    imageUrl: PLACEHOLDER_IMG,
    price: '约 ¥99',
    stages: ['primary', 'junior'],
    programmingTools: ['mPython', 'Mind+'],
    tagline: '经典款入门主控板，性价比之选',
    features: ['ESP32 主控', 'OLED 显示屏', '三轴加速度计', '触摸按键'],
    category: 'mainboard',
  },
  {
    id: 'mb-3',
    name: '行空板 K10',
    model: 'K10',
    brand: 'DFRobot',
    imageUrl: PLACEHOLDER_IMG,
    price: '约 ¥158',
    stages: ['junior', 'senior'],
    programmingTools: ['Mind+', 'Python'],
    tagline: 'Linux 单板计算机，Python AI 教学主力',
    features: ['Linux 系统', '2.8 寸彩屏', 'Wi-Fi + 蓝牙', 'Python 原生支持'],
    category: 'mainboard',
  },
  {
    id: 'mb-4',
    name: '行空板 M10',
    model: 'M10',
    brand: 'DFRobot',
    imageUrl: PLACEHOLDER_IMG,
    price: '约 ¥599',
    stages: ['senior'],
    programmingTools: ['Mind+', 'Python'],
    tagline: '高性能 AI 单板机，支持深度学习模型部署',
    features: ['四核 ARM', 'NPU 算力加速', '触摸屏', 'Wi-Fi/蓝牙/以太网'],
    category: 'mainboard',
  },
  {
    id: 'mb-5',
    name: 'micro:bit V2',
    model: 'V2.2',
    brand: 'BBC / micro:bit 教育基金会',
    imageUrl: PLACEHOLDER_IMG,
    price: '约 ¥200-300',
    stages: ['primary', 'junior'],
    programmingTools: ['MakeCode', 'Python'],
    tagline: '全球普及的青少年编程入门神器',
    features: ['5×5 LED 矩阵', '双按钮', '温度传感器', '磁力计', '扬声器'],
    category: 'mainboard',
  },
  {
    id: 'mb-6',
    name: 'K210 星空板',
    model: 'K210',
    brand: '嘉楠',
    imageUrl: PLACEHOLDER_IMG,
    price: '约 ¥150-300',
    stages: ['junior', 'senior'],
    programmingTools: ['CanMV', 'MaixPy', 'Mind+'],
    tagline: '带 KPU 的 AI 视觉开发板，端侧机器学习首选',
    features: ['K210 RISC-V 双核', 'KPU 硬件加速', '摄像头接口', 'LCD 屏接口'],
    category: 'mainboard',
  },

  // ===== AI 视觉 / 语音模块类 =====
  {
    id: 'ai-1',
    name: '二哈识图 HuskyLens',
    model: 'HuskyLens',
    brand: 'DFRobot',
    imageUrl: PLACEHOLDER_IMG,
    price: '约 ¥249',
    stages: ['primary', 'junior', 'senior'],
    programmingTools: ['Mind+', 'Arduino', 'Python'],
    tagline: '零基础 AI 视觉传感器，一键训练人脸识别',
    features: ['人脸识别', '物体识别', '颜色识别', '线条追踪', '标签识别'],
    category: 'ai-module',
  },
  {
    id: 'ai-2',
    name: '二哈识图 2 Plus 套件',
    model: 'HuskyLens 2 Plus',
    brand: 'DFRobot',
    imageUrl: PLACEHOLDER_IMG,
    price: '约 ¥699',
    stages: ['junior', 'senior'],
    programmingTools: ['Mind+', 'Python'],
    tagline: '进阶 AI 视觉实验套件，支持更多识别算法',
    features: ['更高分辨率', '更多算法支持', '配套实验材料', '完整教学案例'],
    category: 'ai-module',
  },
  {
    id: 'ai-3',
    name: '离线语音识别模块',
    model: 'ASR01',
    brand: 'DFRobot',
    imageUrl: PLACEHOLDER_IMG,
    price: '约 ¥105',
    stages: ['primary', 'junior', 'senior'],
    programmingTools: ['Mind+', 'Arduino'],
    tagline: '离线语音交互模块，打造会听话的智能装置',
    features: ['离线识别', '自定义词条', 'I2C/UART 接口', '低功耗'],
    category: 'ai-module',
  },

  // ===== 教学套装类 =====
  {
    id: 'kit-1',
    name: '行空板 K10 AIoT 项目式学习套件',
    brand: 'DFRobot',
    imageUrl: PLACEHOLDER_IMG,
    price: '约 ¥499',
    stages: ['junior', 'senior'],
    programmingTools: ['Mind+', 'Python'],
    tagline: '含 36 节完整教学资源，AIoT 教学开箱即用',
    features: ['行空板 K10 主控', '多种传感器', '36 课时教学资源', '项目式案例'],
    category: 'teaching-kit',
    resourceNote: '含 36 节教学资源与配套课件',
  },
  {
    id: 'kit-2',
    name: '二哈识图机器视觉教学套件',
    brand: 'DFRobot',
    imageUrl: PLACEHOLDER_IMG,
    price: '约 ¥799',
    stages: ['primary', 'junior'],
    programmingTools: ['Mind+'],
    tagline: '机器视觉入门首选，配套 30 课时课件',
    features: ['二哈识图模块', '实验配件', '30 课时教学课件', '分级难度设计'],
    category: 'teaching-kit',
    resourceNote: '含 30 课时课件与教学案例',
  },
  {
    id: 'kit-3',
    name: '掌控板传感器套件',
    brand: '盛思',
    imageUrl: PLACEHOLDER_IMG,
    price: '约 ¥145-1150',
    stages: ['primary', 'junior'],
    programmingTools: ['mPython', 'Mind+'],
    tagline: '掌控板官方传感器套装，多档配置可选',
    features: ['多种传感器模块', '扩展板', '实验指导手册', '分级配置'],
    category: 'teaching-kit',
  },
  {
    id: 'kit-4',
    name: '麦昆 V5 教育机器人',
    model: 'Maqueen V5',
    brand: 'DFRobot',
    imageUrl: PLACEHOLDER_IMG,
    price: '约 ¥168',
    stages: ['primary', 'junior'],
    programmingTools: ['MakeCode', 'Mind+'],
    tagline: 'micro:bit 专属编程小车，机器人入门经典',
    features: ['双电机驱动', '红外巡线', '超声波避障', 'RGB 灯带'],
    category: 'teaching-kit',
  },

  // ===== 传感器生态类 =====
  {
    id: 'sensor-1',
    name: 'Gravity 传感器系列',
    brand: 'DFRobot',
    imageUrl: PLACEHOLDER_IMG,
    price: '约 ¥20-200 / 个',
    stages: ['primary', 'junior', 'senior'],
    programmingTools: ['Mind+', 'Arduino', 'Python'],
    tagline: '100+ SKU 传感器生态，满足全学段项目需求',
    features: ['即插即用接口', '100+ 传感器 SKU', '兼容多主控板', '标准化接线'],
    category: 'sensor',
    resourceNote: '100+ SKU，涵盖环境、运动、声音、光线等品类',
  },
  {
    id: 'sensor-2',
    name: '掌控板扩展传感器系列',
    brand: '盛思 / 编程虫',
    imageUrl: PLACEHOLDER_IMG,
    price: '多系列可选',
    stages: ['primary', 'junior'],
    programmingTools: ['mPython', 'Mind+'],
    tagline: '专为掌控板设计的扩展生态，无缝对接课堂',
    features: ['掌控板直插', '多系列可选', '配套教学案例', '中小学适用'],
    category: 'sensor',
  },
];

// 按分类获取硬件
export function getHardwareByCategory(category: HardwareCategoryKey): IHardware[] {
  return HARDWARE_ALL.filter((hw) => hw.category === category);
}

// 兼容旧的导出名
export const MOCK_HARDWARES = HARDWARE_ALL;

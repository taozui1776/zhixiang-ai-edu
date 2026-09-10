// EXPORTS: ITutorial, ITutorialCategory, MOCK_TUTORIAL_CATEGORIES, MOCK_TUTORIALS

export interface ITutorial {
  id: string;
  title: string;
  categoryId: string;
  categoryName: string;
  duration: string;
  difficulty: '入门' | '进阶' | '高级';
  coverEmoji: string;
  description: string;
  steps: string[];
  nextId?: string;
  prevId?: string;
  experienceUrl?: string;
}

export interface ITutorialCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export const MOCK_TUTORIAL_CATEGORIES: ITutorialCategory[] = [
  { id: 'platform', name: '平台使用', icon: '🖥️', description: '平台基础操作与功能介绍' },
  { id: 'tools', name: '工具使用', icon: '🛠️', description: '编程工具与硬件入门教程' },
  { id: 'courses', name: '课程串讲', icon: '📚', description: 'AI通识课程体系串讲' },
];

export const MOCK_TUTORIALS: ITutorial[] = [
  // 平台使用
  {
    id: 't-01',
    title: '智象平台总体介绍',
    categoryId: 'platform',
    categoryName: '平台使用',
    duration: '约8分钟',
    difficulty: '入门',
    coverEmoji: '🐘',
     description: '了解智象AI通识教育平台的整体功能架构与核心模块',
     experienceUrl: '/',
    steps: [
      '打开智象平台首页，了解品牌定位与核心价值',
      '浏览顶部导航栏，熟悉各功能模块入口',
      '查看首页学段入口，了解小学/初中/高中课程体系',
      '进入课程库页面，学习如何按学段筛选课程',
      '打开AI实验室，体验交互项目',
      '了解个人中心与账号设置功能',
    ],
    nextId: 't-02',
  },
  {
    id: 't-02',
    title: '登录与账号操作',
    categoryId: 'platform',
    categoryName: '平台使用',
    duration: '约5分钟',
    difficulty: '入门',
    coverEmoji: '🔐',
    description: '教师与学生账号登录、密码修改与基本设置',
    experienceUrl: '/',
    steps: [
      '打开登录页面，选择教师/学生身份',
      '输入账号密码，点击登录',
      '首次登录建议修改初始密码',
      '了解个人中心基本信息设置',
      '忘记密码时联系学校管理员重置',
    ],
    prevId: 't-01',
    nextId: 't-03',
  },
  {
    id: 't-03',
    title: '课程库使用指南',
    categoryId: 'platform',
    categoryName: '平台使用',
    duration: '约10分钟',
    difficulty: '入门',
    coverEmoji: '📖',
    description: '如何浏览、搜索课程，查看课程详情与教学资源',
    experienceUrl: '/courses',
    steps: [
      '从导航栏进入课程库页面',
      '使用顶部学段Tab切换小学/初中/高中',
      '通过左侧年级筛选器缩小范围',
      '使用搜索框按关键词查找课程',
      '点击课程卡片进入详情页',
      '在详情页切换Tab查看教案、课件、实验、作业',
      '收藏常用课程到我的收藏',
    ],
    prevId: 't-02',
    nextId: 't-04',
  },
  {
    id: 't-04',
    title: '授课模式操作指南',
    categoryId: 'platform',
    categoryName: '平台使用',
    duration: '约12分钟',
    difficulty: '入门',
    coverEmoji: '🎓',
    description: '如何进入授课模式，使用课堂教学工具与互动功能',
    experienceUrl: '/courses',
    steps: [
      '在课程详情页点击"开始授课"按钮',
      '了解授课模式界面布局（左侧目录+右侧内容）',
      '使用全屏模式进行课堂投影',
      '切换教学目标/教案/课件/实验等Tab',
      '使用课堂计时器功能',
      '查看班级学生学习进度',
      '课后查看授课记录与学情数据',
    ],
    prevId: 't-03',
    nextId: 't-05',
  },
  {
    id: 't-05',
    title: 'AI实验室使用教程',
    categoryId: 'platform',
    categoryName: '平台使用',
    duration: '约10分钟',
    difficulty: '入门',
    coverEmoji: '🔬',
    description: 'AI实验室项目浏览、分类筛选与实验操作',
    experienceUrl: '/ai-lab',
    steps: [
      '从导航栏进入AI实验室',
      '了解四大分类：计算机视觉/自然语言处理/机器学习/AIGC',
      '使用难度筛选器选择入门/进阶项目',
      '点击项目卡片进入实验详情',
      '在操作界面进行实验交互',
      '查看知识卡片了解技术原理',
      '参考教学建议设计课堂活动',
    ],
    prevId: 't-04',
    nextId: 't-06',
  },
  {
    id: 't-06',
    title: '硬件连接操作指南',
    categoryId: 'platform',
    categoryName: '平台使用',
    duration: '约8分钟',
    difficulty: '进阶',
    coverEmoji: '🔌',
    description: '使用Web Serial API连接开发板，在线烧录与调试',
    experienceUrl: '/hardware-connect',
    steps: [
      '准备工作：开发板、USB数据线、Chrome/Edge浏览器',
      '进入硬件连接中心',
      '选择对应的硬件型号',
      '点击"连接设备"按钮，在弹窗中选择串口',
      '查看设备信息与传感器数据',
      '在代码框中输入代码并发送执行',
      '通过串口监视器查看输出',
    ],
    prevId: 't-05',
  },

  // 工具使用
  {
    id: 't-07',
    title: 'Scratch图形化编程入门',
    categoryId: 'tools',
    categoryName: '工具使用',
    duration: '约15分钟',
    difficulty: '入门',
    coverEmoji: '🧩',
    description: '零基础入门Scratch图形化编程，制作第一个动画作品',
    experienceUrl: '/coding-lab',
    steps: [
      '打开编程实验室，进入Scratch编辑器',
      '了解Scratch界面：舞台、角色、积木区',
      '学习事件类积木：当绿旗被点击',
      '学习运动类积木：移动、旋转',
      '制作小猫走路动画',
      '添加背景与多个角色',
      '保存与分享作品',
    ],
    nextId: 't-08',
  },
  {
    id: 't-08',
    title: 'Mind+图形化编程入门',
    categoryId: 'tools',
    categoryName: '工具使用',
    duration: '约12分钟',
    difficulty: '入门',
    coverEmoji: '🧠',
    description: 'Mind+编程软件安装与基础操作，连接掌控板',
    experienceUrl: '/coding-lab',
    steps: [
      '下载并安装Mind+软件',
      '启动Mind+，选择"上传模式"',
      '添加扩展：选择掌控板/行空板',
      '连接开发板：USB连接并选择串口',
      '编写第一个程序：LED闪烁',
      '点击"上传"将程序烧录到开发板',
      '观察实验现象并调试',
    ],
    prevId: 't-07',
    nextId: 't-09',
  },
  {
    id: 't-09',
    title: '行空板K10入门教程',
    categoryId: 'tools',
    categoryName: '工具使用',
    duration: '约15分钟',
    difficulty: '入门',
    coverEmoji: '🟢',
    description: 'DFRobot行空板K10开箱与MicroPython编程入门',
    experienceUrl: '/hardware-connect',
    steps: [
      '行空板K10开箱与配件介绍',
      '认识板载资源：LED、按键、屏幕、传感器',
      '连接电脑，安装USB驱动',
      '使用Mind+进行图形化编程',
      '点亮板载LED灯',
      '读取板载光线传感器数据',
      '在屏幕上显示文字',
    ],
    prevId: 't-08',
    nextId: 't-10',
  },
  {
    id: 't-10',
    title: '掌控板2.0入门教程',
    categoryId: 'tools',
    categoryName: '工具使用',
    duration: '约12分钟',
    difficulty: '入门',
    coverEmoji: '🔵',
    description: '盛思掌控板2.0入门，mPython图形化编程',
    experienceUrl: '/hardware-connect',
    steps: [
      '掌控板2.0硬件介绍',
      '下载安装mPython X软件',
      '连接掌控板到电脑',
      '点亮RGB彩灯',
      '使用OLED显示屏显示文字',
      '读取声音传感器',
      '制作一个声光互动作品',
    ],
    prevId: 't-09',
  },

  // 课程串讲
  {
    id: 't-11',
    title: 'AI通识入门课程串讲',
    categoryId: 'courses',
    categoryName: '课程串讲',
    duration: '约20分钟',
    difficulty: '入门',
    coverEmoji: '🎯',
    description: '小学AI通识入门课程整体架构与教学建议',
    experienceUrl: '/course/c-ai-intro-primary',
    steps: [
      '课程体系概述：8大模块与4学段对应',
      '小学低段课程特点与教学策略',
      '小学高段课程特点与教学策略',
      '第1单元"初识人工智能"教学重点',
      '第2单元"数据小侦探"教学重点',
      '第3单元"声音的秘密"教学重点',
      '考核方式与学生评价建议',
    ],
    nextId: 't-12',
  },
  {
    id: 't-12',
    title: '机器视觉课程串讲',
    categoryId: 'courses',
    categoryName: '课程串讲',
    duration: '约18分钟',
    difficulty: '进阶',
    coverEmoji: '👁️',
    description: '初中机器视觉课程内容体系与实验设计',
    experienceUrl: '/course/c-computer-vision-junior',
    steps: [
      '机器视觉课程定位与目标',
      '课程结构：4单元16课时',
      '第1单元：图像基础与像素',
      '第2单元：人脸识别入门',
      '第3单元：图像分类训练',
      '第4单元：视觉应用项目',
      '硬件配套与实验安全注意事项',
    ],
    prevId: 't-11',
  },
];

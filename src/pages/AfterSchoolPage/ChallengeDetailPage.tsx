import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Target,
  Package,
  ListOrdered,
  Lightbulb,
  Star,
  Clock,
  Cpu,
  Zap,
  ChevronRight,
  CheckCircle,
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MOCK_CHALLENGES, CHALLENGE_STAGES, type IChallenge } from '@/data/after-school';
import { AI_LAB_PROJECTS } from '@/data/ai-lab-projects';
import { MOCK_COURSE_SUMMARY } from '@/data/course-summary';
import { BookOpen, Sparkles } from 'lucide-react';
import Image from '@/components/ui/image';

const MASCOT_IMG = 'https://aka.doubaocdn.com/s/FTGHri7UGK';

// 挑战 → 关联课程精准映射（按学段+知识点匹配）
const CHALLENGE_COURSE_MAP: Record<string, string[]> = {
  // 小学段 → AI通识入门 / PBL项目课
  'c-p1': ['course-primary-ai-intro'], // 猜数字游戏 → AI通识入门（变量、判断）
  'c-p2': ['course-primary-ai-intro'], // 语音小助手 → AI通识入门（语音交互）
  'c-p3': ['course-primary-ai-intro', 'course-pbl-general'], // AI绘画 → AI通识入门 + PBL
  'c-p4': ['course-primary-ai-intro'], // 寻找家里的AI → AI通识入门
  'c-p5': ['course-primary-ai-intro'], // 智能小夜灯 → AI通识入门（传感器）
  'c-p6': ['course-primary-ai-intro'], // 表情猜猜乐 → AI通识入门（图像识别）
  // 初中段 → 机器视觉入门 / 机器视觉应用
  'c-j1': ['course-vision-intro', 'course-junior-vision'], // 水果识别 → 机器视觉入门+应用
  'c-j2': ['course-vision-intro'], // AI写科幻故事 → 机器视觉入门（AI创作拓展）
  'c-j3': ['course-junior-vision'], // 环境监测 → 机器视觉应用（传感器+数据）
  'c-j4': ['course-junior-vision'], // 推荐算法偏见 → 机器视觉应用（AI伦理）
  'c-j5': ['course-junior-vision'], // 聊天机器人 → 机器视觉应用（NLP拓展）
  'c-j6': ['course-vision-intro', 'course-junior-vision'], // 手势控制 → 视觉入门+应用
  // 高中段 → AI算法基础
  'c-s1': ['course-senior-algorithm'], // k-NN分类器 → AI算法基础
  'c-s2': ['course-senior-algorithm'], // 神经网络手写数字 → AI算法基础
  'c-s3': ['course-senior-algorithm'], // AI音乐生成 → AI算法基础
  'c-s4': ['course-senior-algorithm'], // 大模型幻觉检测 → AI算法基础
  'c-s5': ['course-senior-algorithm'], // 图像风格迁移 → AI算法基础
  'c-s6': ['course-senior-algorithm'], // 强化学习走迷宫 → AI算法基础
};

function DifficultyStars({ level }: { level: 1 | 2 | 3 }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3].map((i) => (
        <Star
          key={i}
          className={`size-4 ${
            i <= level ? 'text-amber-400 fill-amber-400' : 'text-muted-foreground/30'
          }`}
        />
      ))}
    </div>
  );
}

// 挑战详情增强数据（项目目标、材料、步骤、拓展思考）
const CHALLENGE_DETAILS: Record<
  string,
  {
    goals: string[];
    materials: string[];
    steps: { title: string; content: string }[];
    extension: string[];
  }
> = {
  'c-p1': {
    goals: [
      '理解二分法（折半查找）的基本思想',
      '学会用变量记录猜测范围和次数',
      '能用条件判断实现"大了/小了"的反馈逻辑',
      '培养逻辑思维和问题拆解能力',
    ],
    materials: [
      '电脑一台（需联网）',
      'Scratch 编程环境（建议 3.0 以上版本）',
      '纸和笔（用于画流程图）',
    ],
    steps: [
      {
        title: '第 1 步：设计游戏规则',
        content:
          '在开始编程前，先和小伙伴讨论：如果让你猜 1-100 之间的一个数字，你会怎么猜？最快需要几次？把你的想法画成流程图。',
      },
      {
        title: '第 2 步：创建变量',
        content:
          '在 Scratch 中创建三个变量："目标数字"（随机 1-100）、"当前猜测"、"猜测次数"。想一想为什么需要这三个变量？',
      },
      {
        title: '第 3 步：实现提问和回答',
        content:
          '用"询问...并等待"积木让程序提问，用"回答"积木获取玩家输入。判断回答和目标数字的大小关系，给出"大了"或"小了"的提示。',
      },
      {
        title: '第 4 步：加入二分法智慧',
        content:
          '进阶挑战：让 AI 反过来猜你心里想的数字！AI 每次猜范围中间的数，根据你的"大了/小了"反馈缩小范围。这就是二分查找的原理。',
      },
      {
        title: '第 5 步：美化和扩展',
        content:
          '给游戏加上计分、音效、角色动画。可以增加难度选择（简单 1-50、困难 1-200），或者加入限时模式。',
      },
    ],
    extension: [
      '如果数字范围是 1-1000，二分法最多需要猜几次？为什么？',
      '想一想生活中还有哪些地方用到了"二分"的思想？（提示：查字典、找东西）',
      '尝试用列表记录每次猜测的历史，猜对后展示猜测过程。',
    ],
  },
  'c-p2': {
    goals: [
      '了解语音识别技术的基本原理',
      '学会调用语音识别扩展积木',
      '理解"事件驱动"的编程思想',
      '设计一个实用的语音助手应用',
    ],
    materials: [
      '电脑一台（带麦克风）',
      'Scratch 编程环境 + 语音识别扩展',
      '安静的环境（保证识别准确率）',
    ],
    steps: [
      {
        title: '第 1 步：测试语音识别',
        content:
          '在 Scratch 中添加"语音识别"扩展，点击"开始聆听"积木，对着麦克风说几句话，看看识别结果是否正确。试着说普通话、英语、方言，比较识别效果。',
      },
      {
        title: '第 2 步：理解指令关键词',
        content:
          '设计你的小助手能听懂哪些指令？比如："现在几点了"、"讲个笑话"、"开灯"、"关灯"。把这些指令列出来，思考程序怎么判断用户说了什么。',
      },
      {
        title: '第 3 步：编写条件分支',
        content:
          '用"如果...那么..."积木判断识别结果中是否包含关键词。比如识别结果包含"几点"，就让角色说出当前时间；包含"笑话"，就讲一个笑话。',
      },
      {
        title: '第 4 步：添加角色和场景',
        content:
          '选一个可爱的角色当你的助手，给它加上说话动画。设计一个温馨的家居背景，让助手看起来更亲切。',
      },
      {
        title: '第 5 步：扩展更多功能',
        content:
          '挑战自己：让助手能计算简单数学题、能播放音乐、能记录待办事项。想一想语音交互和键盘鼠标交互有什么不同？',
      },
    ],
    extension: [
      '为什么语音识别有时候会听错？可能的原因有哪些？',
      '如果你的助手能听懂方言，你觉得需要怎么做？',
      '畅想一下：未来的语音助手还能做什么？',
    ],
  },
  'c-p3': {
    goals: [
      '体验 AI 绘画的创作过程',
      '学习 Prompt（提示词）的编写技巧',
      '理解 AI 生成图像的基本原理',
      '培养创意表达和审美能力',
    ],
    materials: [
      '电脑或平板一台',
      'AI 绘画工具（如智象 AI 绘画模块）',
      '笔记本（记录你的创意和 Prompt）',
    ],
    steps: [
      {
        title: '第 1 步：构思你的未来学校',
        content:
          '闭上眼睛想一想：你心目中的未来学校是什么样子的？有什么样的建筑？学生们在做什么？用了哪些神奇的技术？把你的想法用文字描述出来，至少写 3 句话。',
      },
      {
        title: '第 2 步：学习 Prompt 四要素',
        content:
          '一个好的 Prompt 通常包含：主体（画什么）+ 风格（什么画风）+ 场景（在哪里）+ 细节（特别的元素）。试着把你刚才的描述改写成规范的 Prompt。',
      },
      {
        title: '第 3 步：生成第一张图',
        content:
          '把你的 Prompt 输入 AI 绘画工具，生成第一张图。仔细观察：哪些地方符合你的想象？哪些地方不满意？把不满意的地方记录下来。',
      },
      {
        title: '第 4 步：迭代优化 Prompt',
        content:
          '根据第一张图的结果，调整你的 Prompt。比如想要更梦幻的感觉，可以加"梦幻"、"光晕"等词；想要特定画风，可以加"卡通"、"水彩"、"赛博朋克"等。至少迭代 3 次。',
      },
      {
        title: '第 5 步：作品展示与分享',
        content:
          '选出你最满意的 1-2 张作品，给它们起个名字。和同学们分享你的创作过程：最开始的想法是什么？中间做了哪些调整？最终效果如何？',
      },
    ],
    extension: [
      'AI 画的图，版权应该属于谁？是 AI、写 Prompt 的人，还是训练数据的作者？',
      '如果让你用 AI 绘画做一个系列作品，你想做什么主题？',
      'AI 绘画和传统手绘各有什么优势？你更喜欢哪种？为什么？',
    ],
  },
  'c-p4': {
    goals: [
      '发现身边的人工智能应用',
      '学会观察和记录的科学方法',
      '对 AI 应用进行简单分类',
      '培养对技术的敏感度和好奇心',
    ],
    materials: [
      '笔记本和笔',
      '手机或相机（拍照记录，需家长同意）',
      '彩笔（制作地图用）',
    ],
    steps: [
      {
        title: '第 1 步：制定观察计划',
        content:
          '画一张你家的平面图，标出各个房间（客厅、卧室、厨房、卫生间等）。想一想：每个房间里可能有什么 AI 设备或功能？把你的猜测先写下来。',
      },
      {
        title: '第 2 步：实地探索',
        content:
          '按照房间顺序，逐一寻找家里的 AI 应用。注意：不只是机器人或智能音箱才是 AI！手机里的功能、APP 里的推荐、电视的语音遥控……都可能用到了 AI。',
      },
      {
        title: '第 3 步：详细记录',
        content:
          '每发现一个 AI 应用，记录：名称、在哪个房间、它能做什么、用了什么 AI 技术（视觉/语音/推荐…）、你使用它的频率。可以拍照辅助记录。',
      },
      {
        title: '第 4 步：制作 AI 家庭地图',
        content:
          '在你家的平面图上，用贴纸或彩色笔标注出所有 AI 应用的位置。不同类型的 AI 用不同颜色表示，比如视觉类用蓝色、语音类用红色、推荐类用黄色。',
      },
      {
        title: '第 5 步：总结与分享',
        content:
          '数一数你一共找到了多少个 AI 应用？哪个最让你意外？你觉得家里还缺什么样的 AI 产品？把你的地图和发现分享给家人。',
      },
    ],
    extension: [
      '十年前的家里有这么多 AI 吗？为什么现在 AI 越来越普及？',
      '你觉得 AI 让生活变得更好了吗？有没有什么担忧？',
      '如果让你发明一个家用 AI，你想做什么？它能解决什么问题？',
    ],
  },
  'c-p5': {
    goals: [
      '了解光线传感器的工作原理',
      '学会读取传感器的模拟数值',
      '掌握条件判断在硬件编程中的应用',
      '培养动手实践和问题调试能力',
    ],
    materials: [
      '掌控板（或 micro:bit）1 块',
      '光线传感器模块 1 个',
      'LED 灯珠 1 个 + 电阻',
      '面包板 + 杜邦线若干',
      'USB 数据线',
    ],
    steps: [
      {
        title: '第 1 步：认识光线传感器',
        content:
          '观察光线传感器，它上面有一个光敏电阻。用手遮住传感器，再拿开，看看数值有什么变化。思考：光线亮的时候数值大还是暗的时候数值大？',
      },
      {
        title: '第 2 步：搭建电路',
        content:
          '按照接线图，把光线传感器连接到掌控板的模拟输入引脚，把 LED 灯连接到数字输出引脚。接好后请老师或家长检查，确保没有接反。',
      },
      {
        title: '第 3 步：编写第一个程序——读取光线值',
        content:
          '编写程序，在掌控板的屏幕上实时显示光线传感器的数值。观察：白天和晚上的数值分别是多少？用手遮住时数值是多少？找到一个"临界值"。',
      },
      {
        title: '第 4 步：实现自动亮灯逻辑',
        content:
          '用"如果...那么...否则..."积木判断：当光线值低于临界值时，LED 灯亮；高于临界值时，LED 灯灭。测试一下：用手遮住传感器，灯亮了吗？拿开手，灯灭了吗？',
      },
      {
        title: '第 5 步：优化和扩展',
        content:
          '挑战 1：加入延时，避免光线短暂变化时灯频繁开关。挑战 2：用呼吸灯效果，光线越暗灯越亮。挑战 3：加入人体感应，只有天黑且有人时才亮灯。',
      },
    ],
    extension: [
      '为什么楼道里的声控灯要同时有光控？只有声控不行吗？',
      '除了光线传感器，你还知道哪些传感器？它们能检测什么？',
      '如果让你设计一个"智能窗帘"，你会怎么设计？需要哪些传感器？',
    ],
  },
  'c-p6': {
    goals: [
      '体验图像识别和表情分类技术',
      '了解 AI 如何"看懂"人的表情',
      '学习调用图像识别 API 的基本方法',
      '培养人机交互设计思维',
    ],
    materials: [
      '电脑一台（带摄像头）',
      '网络连接',
      '镜子（练习表情用）',
    ],
    steps: [
      {
        title: '第 1 步：表情大集合',
        content:
          '和同学一起，列出人常见的表情有哪些？（开心、悲伤、惊讶、愤怒、害怕、厌恶……）每种表情是什么样子的？对着镜子做一做，观察五官的变化。',
      },
      {
        title: '第 2 步：测试图像识别',
        content:
          '打开 AI 图像识别工具，对着摄像头做出不同表情，看看 AI 能不能正确识别。哪种表情识别最准？哪种最容易认错？把结果记录下来。',
      },
      {
        title: '第 3 步：设计游戏规则',
        content:
          '设计一个"表情猜猜乐"游戏：玩家在规定时间内做出指定表情，AI 猜对了得 1 分。可以设计关卡：简单关卡只有开心和难过，困难关卡有 6 种表情。',
      },
      {
        title: '第 4 步：制作游戏界面',
        content:
          '用图形化编程工具制作游戏界面：显示当前需要做的表情、倒计时、得分、摄像头画面。设计角色和背景音乐，增加游戏感。',
      },
      {
        title: '第 5 步：游戏测试与优化',
        content:
          '找同学来玩你的游戏，收集反馈。游戏好玩吗？难度合适吗？有没有什么 bug？根据反馈调整游戏参数，让游戏更好玩。',
      },
    ],
    extension: [
      'AI 是怎么识别表情的？它真的"理解"人的情绪吗？',
      '表情识别技术可以用在哪些地方？（提示：游戏、医疗、安全……）',
      '如果让你给 AI 增加一种新的表情识别，你想加什么？为什么？',
    ],
  },
  'c-j1': {
    goals: [
      '理解图像分类任务的定义和应用',
      '掌握数据集收集和标注的基本方法',
      '体验模型训练的完整流程',
      '学会评估模型准确率',
    ],
    materials: [
      '电脑一台（需联网）',
      '三种水果实物（苹果、香蕉、橙子），或手机拍照',
      'AI 模型训练平台（如智象训练工坊）',
      '笔记本（记录实验数据）',
    ],
    steps: [
      {
        title: '第 1 步：收集数据集',
        content:
          '为每种水果收集至少 20 张照片。注意多样性：不同角度、不同光线、不同背景、不同品种。可以自己拍，也可以从网上找（注意版权）。把照片按类别分到不同文件夹。',
      },
      {
        title: '第 2 步：数据增强和预处理',
        content:
          '学习数据增强的方法：翻转、旋转、裁剪、调整亮度等。想一想：为什么需要数据增强？只用 20 张原图训练和用增强后的 200 张训练，效果会有什么不同？',
      },
      {
        title: '第 3 步：训练模型',
        content:
          '把数据集上传到训练平台，选择图像分类模型，设置训练参数（训练轮数、学习率等），开始训练。观察训练过程中的损失值和准确率变化，理解它们的含义。',
      },
      {
        title: '第 4 步：评估模型效果',
        content:
          '用测试集评估训练好的模型。查看准确率、混淆矩阵：哪种水果识别最准？哪种最容易被认错？认错的那些照片有什么共同点？分析原因。',
      },
      {
        title: '第 5 步：优化模型',
        content:
          '根据评估结果，想办法提升模型准确率：增加数据、调整训练参数、改进数据质量……至少做 2 次优化实验，记录每次的准确率变化。',
      },
    ],
    extension: [
      '如果要识别 10 种水果，和识别 3 种水果相比，需要的数据量一样多吗？为什么？',
      '什么是"过拟合"？举一个生活中的例子来说明。',
      '图像分类除了识别水果，还能用来做什么？举出 5 个应用场景。',
    ],
  },
  'c-j2': {
    goals: [
      '掌握 Prompt 工程的核心技巧',
      '学会用 AI 进行创意协作',
      '理解 AI 生成文本的原理和局限',
      '培养批判性思维和创意写作能力',
    ],
    materials: [
      '电脑一台（需联网）',
      'AI 对话工具（如智象 AI 对话）',
      '笔记本（记录 Prompt 和效果）',
    ],
    steps: [
      {
        title: '第 1 步：给出第一个 Prompt',
        content:
          '先试试最简单的指令："写一个关于2077年学校的科幻故事"。看看 AI 生成的结果怎么样？你满意吗？哪里好？哪里不好？把优缺点记下来。',
      },
      {
        title: '第 2 步：学习 Prompt 五要素',
        content:
          '一个好的写作 Prompt 应该包含：角色（谁来写）、任务（写什么）、要求（字数/风格/结构）、背景（故事设定）、输出格式。试着用五要素改写你的 Prompt。',
      },
      {
        title: '第 3 步：迭代优化故事',
        content:
          '用优化后的 Prompt 再次生成故事。然后进行多轮对话：让 AI 展开某个情节、修改人物性格、增加悬念、调整结局。比较初版和终版的差异。',
      },
      {
        title: '第 4 步：加入你的创意',
        content:
          'AI 不是代替你创作，而是和你一起创作。想一想：你有什么独特的想法是 AI 想不到的？把你的创意加入故事中，让故事真正成为"你的作品"。',
      },
      {
        title: '第 5 步：作品展示',
        content:
          '完成你的科幻故事（建议 800-1500 字），起一个吸引人的标题。和同学们分享你的创作过程：你给了 AI 哪些指令？哪些是你自己的创意？你是如何和 AI 协作的？',
      },
    ],
    extension: [
      'AI 写的故事，算谁的作品？你认为应该怎么署名？',
      '为什么有时候 AI 会"一本正经地胡说八道"？这种现象叫什么？',
      '你觉得未来作家会被 AI 取代吗？为什么？',
    ],
  },
  'c-j3': {
    goals: [
      '了解多种环境传感器的工作原理',
      '学会读取和解析传感器数据',
      '掌握数据可视化的基本方法',
      '培养环保意识和数据思维',
    ],
    materials: [
      '掌控板/Arduino 1 块',
      '温湿度传感器（DHT11）1 个',
      '空气质量传感器（MQ-135 或类似）1 个',
      'OLED 显示屏 1 个',
      '面包板 + 杜邦线 + 电池盒',
    ],
    steps: [
      {
        title: '第 1 步：认识环境传感器',
        content:
          '学习温湿度传感器、空气质量传感器的工作原理和接线方法。查资料：什么是 PM2.5？什么是相对湿度？空气质量好坏的标准是什么？',
      },
      {
        title: '第 2 步：搭建监测站硬件',
        content:
          '按照电路图连接所有传感器和显示屏。把装置装进一个合适的外壳里（可以用 3D 打印或手工制作），做成一个便携的环境监测小站。',
      },
      {
        title: '第 3 步：编写数据读取程序',
        content:
          '编写程序，依次读取温度、湿度、空气质量数据，在 OLED 屏幕上显示出来。加入数值单位和简单的图形显示，让界面更友好。',
      },
      {
        title: '第 4 步：数据记录与分析',
        content:
          '扩展程序：把数据通过串口发送到电脑，用 Excel 或在线工具记录一天的数据变化。画出温度/湿度/空气质量随时间变化的曲线图。',
      },
      {
        title: '第 5 步：实地测试与结论',
        content:
          '把你的环境监测小站带到不同地方测试：教室、操场、家里、公园、马路边。比较不同地点的环境数据，写下你的发现和结论。',
      },
    ],
    extension: [
      '为什么要监测环境数据？这些数据对我们有什么用？',
      '如果让你设计一个"智慧校园环境监测系统"，你会在哪些地方放监测点？为什么？',
      '除了温湿度和空气质量，你还想监测哪些环境参数？',
    ],
  },
  'c-j4': {
    goals: [
      '理解图像风格迁移的原理',
      '体验 CNN 卷积神经网络在图像风格上的应用',
      '探索艺术与 AI 的结合',
      '培养跨学科思维（艺术 + 技术）',
    ],
    materials: [
      '电脑一台（需联网）',
      '3-5 张你自己拍的照片（风景、人物、建筑等）',
      '3-5 张艺术名画（如梵高、毕加索、莫奈的作品）',
      'AI 风格迁移工具',
    ],
    steps: [
      {
        title: '第 1 步：了解风格迁移',
        content:
          '什么是图像风格迁移？简单来说，就是把一张图的"内容"和另一张图的"风格"结合在一起。看一些风格迁移的经典案例（如把照片变成梵高风格），感受效果。',
      },
      {
        title: '第 2 步：准备素材',
        content:
          '选出 2-3 张你满意的照片作为"内容图"，选出 2-3 张风格鲜明的艺术作品作为"风格图"。思考：什么样的内容图和风格图搭配效果可能最好？',
      },
      {
        title: '第 3 步：进行风格迁移实验',
        content:
          '用 AI 风格迁移工具，把每张内容图分别和不同风格图组合。记录每一组的参数（风格强度、内容保留度等）和效果。至少生成 6 张结果图。',
      },
      {
        title: '第 4 步：对比与分析',
        content:
          '对比不同组合的效果：哪组最好看？哪组最有趣？风格强度调高和调低有什么区别？内容和风格的"平衡"在哪里最合适？',
      },
      {
        title: '第 5 步：创作你的 AI 艺术作品集',
        content:
          '选出最好的 3-5 张风格迁移作品，做成一个小作品集。给每张作品起个名字，写一段创作说明：原始照片是什么、用了什么风格、你做了哪些调整、想表达什么。',
      },
    ],
    extension: [
      '用 AI 做的风格迁移作品，算艺术吗？为什么？',
      'AI 绘画和风格迁移有什么区别和联系？',
      '你觉得 AI 会让更多人成为"艺术家"，还是会让真正的艺术家变得更稀缺？',
    ],
  },
  'c-j5': {
    goals: [
      '理解推荐系统的基本原理',
      '学习协同过滤和内容推荐两种方法',
      '动手实现一个简单的推荐系统',
      '了解推荐算法在现实中的应用和影响',
    ],
    materials: [
      '电脑一台',
      'Python 编程环境（建议使用 Jupyter Notebook）',
      '电影评分数据集（如 MovieLens 小型数据集）',
    ],
    steps: [
      {
        title: '第 1 步：理解推荐系统',
        content:
          '想一想：你刷短视频、逛购物网站时，平台是怎么"猜你喜欢"的？学习两种主要的推荐方法：基于内容的推荐（根据你看过的推荐相似的）和协同过滤（根据和你兴趣相似的人推荐）。',
      },
      {
        title: '第 2 步：准备数据集',
        content:
          '下载 MovieLens 100K 数据集，了解数据结构：用户 ID、电影 ID、评分、时间戳。用 Pandas 读取数据，做简单的数据探索：有多少用户？多少电影？评分分布怎样？',
      },
      {
        title: '第 3 步：实现基于内容的推荐',
        content:
          '提取电影的类型信息（动作、喜剧、爱情等），计算电影之间的相似度。对于一个用户喜欢的电影，推荐相似度最高的其他电影。测试一下推荐结果是否合理。',
      },
      {
        title: '第 4 步：实现协同过滤推荐',
        content:
          '实现一个简单的基于用户的协同过滤：找到和目标用户口味最像的用户，把他们喜欢但目标用户没看过的电影推荐过去。比较两种推荐方法的结果有什么不同。',
      },
      {
        title: '第 5 步：评估与讨论',
        content:
          '思考：怎么衡量推荐系统好不好？除了准确率，还有哪些指标？讨论推荐算法的社会影响：信息茧房、算法偏见、用户隐私……我们应该如何看待推荐算法？',
      },
    ],
    extension: [
      '你觉得"算法推荐"是让你的视野更宽了，还是更窄了？为什么？',
      '如果让你设计一个"反茧房"的推荐算法，你会怎么设计？',
      '推荐算法应该被监管吗？如果应该，你觉得应该怎么管？',
    ],
  },
  'c-j6': {
    goals: [
      '掌握人脸识别的基本流程',
      '了解人脸检测、关键点定位、特征提取的原理',
      '实现一个简单的人脸门禁系统',
      '思考人脸识别技术的伦理问题',
    ],
    materials: [
      '电脑一台（带摄像头）',
      'Python + OpenCV 环境',
      '人脸检测模型（Haar Cascade 或 MTCNN）',
    ],
    steps: [
      {
        title: '第 1 步：人脸检测',
        content:
          '使用 OpenCV 的 Haar 级联分类器实现实时人脸检测。在摄像头画面中用矩形框标出检测到的人脸。调整参数，观察在什么情况下检测效果好，什么情况下会漏检或误检。',
      },
      {
        title: '第 2 步：人脸关键点定位',
        content:
          '使用 dlib 或其他库提取人脸 68 个关键点（眼睛、鼻子、嘴巴、下巴轮廓）。把关键点画在人脸上。思考：这些关键点有什么用？',
      },
      {
        title: '第 3 步：人脸特征提取与比对',
        content:
          '使用预训练的人脸识别模型（如 FaceNet）提取人脸特征向量。计算两张人脸特征向量的距离，判断是不是同一个人。测试不同人、同一个人不同表情/角度的识别效果。',
      },
      {
        title: '第 4 步：制作智能门禁演示',
        content:
          '建立一个小型人脸库（录入 3-5 位同学的人脸），制作一个"智能门禁"程序：摄像头检测到人脸后，和人脸库比对，如果是授权用户显示"欢迎"并开绿灯，否则显示"未知人员"并亮红灯。',
      },
      {
        title: '第 5 步：伦理讨论',
        content:
          '分组讨论：人脸识别技术有哪些好处？有哪些风险和担忧？什么场景下应该使用人脸识别？什么场景下应该禁止？写一篇 300 字的小论文表达你的观点。',
      },
    ],
    extension: [
      '如果人脸信息被泄露了，会有什么后果？比手机号泄露更严重吗？',
      '你支持学校用人脸识别考勤吗？为什么？',
      '戴口罩、整容、双胞胎……人脸识别还能准确吗？这些问题怎么解决？',
    ],
  },
};

export default function ChallengeDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [activeStep, setActiveStep] = useState(0);

  const challenge = MOCK_CHALLENGES.find((c) => c.id === id);
  const detail = id ? CHALLENGE_DETAILS[id] : null;
  const stageInfo = challenge ? CHALLENGE_STAGES.find((s) => s.value === challenge.stage) : null;

  // 相关课程（精准映射：按挑战ID匹配对应课程）
  const relatedCourses = challenge
    ? (CHALLENGE_COURSE_MAP[challenge.id] || [])
        .map((id) => MOCK_COURSE_SUMMARY.find((c) => c.id === id))
        .filter(Boolean) as typeof MOCK_COURSE_SUMMARY
    : [];

  // 相关AI实验（按知识点关键词匹配）
  const relatedAiProjects = challenge
    ? AI_LAB_PROJECTS.filter((p) =>
        challenge.knowledge.some((k) => p.name.includes(k) || p.description.includes(k)),
      ).slice(0, 3)
    : [];

  if (!challenge || !detail) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md text-center p-8">
          <CardContent>
            <p className="text-muted-foreground mb-4">未找到该挑战项目</p>
            <Button onClick={() => navigate('/after-school')}>返回课后拓展</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/10">
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-8">
        {/* 顶部导航 */}
        <Button
          variant="ghost"
          size="sm"
          className="mb-6 -ml-2 text-muted-foreground hover:text-foreground"
          onClick={() => navigate('/after-school')}
        >
          <ArrowLeft className="size-4 mr-1" />
          返回课后拓展
        </Button>

        {/* 项目头部 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="border border-border/60 overflow-hidden">
            <div className="h-2 w-full bg-gradient-to-r from-primary via-purple-500 to-cyan-500" />
            <div className="p-6 md:p-8">
              <div className="flex flex-wrap items-start gap-3 mb-3">
                {stageInfo && (
                  <Badge variant="outline" className={`text-xs ${stageInfo.color}`}>
                    {stageInfo.label}
                  </Badge>
                )}
                <Badge variant="outline" className="text-xs">
                  {challenge.category}
                </Badge>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-muted-foreground mr-1">难度</span>
                  <DifficultyStars level={challenge.difficulty} />
                </div>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
                {challenge.title}
              </h1>
              <p className="text-muted-foreground leading-relaxed mb-5">
                {challenge.description}
              </p>
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Clock className="size-4" />
                  <span>预计耗时：{challenge.duration}</span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Cpu className="size-4" />
                  <span>所需硬件：{challenge.hardware}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-4">
                {challenge.knowledge.map((k) => (
                  <Badge key={k} variant="secondary" className="text-xs font-normal">
                    {k}
                  </Badge>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          {/* 左侧：主要内容 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 项目目标 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Card className="border border-border/60 h-full">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <div className="size-8 rounded-lg bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center">
                      <Target className="size-4 text-white" />
                    </div>
                    <CardTitle className="text-lg">项目目标</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2.5">
                    {detail.goals.map((goal, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <CheckCircle className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="text-sm text-foreground leading-relaxed">{goal}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            {/* 实施步骤 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="border border-border/60">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <div className="size-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                      <ListOrdered className="size-4 text-white" />
                    </div>
                    <CardTitle className="text-lg">实施步骤</CardTitle>
                  </div>
                  <CardDescription className="text-xs mt-1">
                    共 {detail.steps.length} 步，点击步骤标题查看详情
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-1">
                    {detail.steps.map((step, i) => (
                      <div
                        key={i}
                        className={`rounded-lg border transition-all ${
                          activeStep === i
                            ? 'border-primary/40 bg-primary/5'
                            : 'border-border/40 hover:border-border'
                        }`}
                      >
                        <button
                          onClick={() => setActiveStep(activeStep === i ? -1 : i)}
                          className="w-full flex items-center gap-3 p-3 text-left"
                        >
                          <div
                            className={`size-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                              activeStep === i
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted text-muted-foreground'
                            }`}
                          >
                            {i + 1}
                          </div>
                          <span className="font-medium text-sm flex-1">{step.title}</span>
                          <ChevronRight
                            className={`size-4 text-muted-foreground transition-transform ${
                              activeStep === i ? 'rotate-90' : ''
                            }`}
                          />
                        </button>
                        {activeStep === i && (
                          <div className="px-3 pb-4 pl-14">
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {step.content}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* 拓展思考 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="border border-border/60">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <div className="size-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                      <Lightbulb className="size-4 text-white" />
                    </div>
                    <CardTitle className="text-lg">拓展思考</CardTitle>
                  </div>
                  <CardDescription className="text-xs mt-1">
                    完成项目后，思考这些问题让你收获更多
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    {detail.extension.map((q, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-3 p-3 rounded-lg bg-amber-50/50 border border-amber-100"
                      >
                        <span className="flex items-center justify-center size-6 shrink-0 rounded-full bg-amber-500 text-white text-xs font-bold">
                          ?
                        </span>
                        <p className="text-sm text-foreground leading-relaxed">{q}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* 右侧：材料清单 + 开始挑战 */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              <Card className="border border-border/60 sticky top-24">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <div className="size-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                      <Package className="size-4 text-white" />
                    </div>
                    <CardTitle className="text-base">所需材料</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="space-y-2">
                    {detail.materials.map((m, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="text-foreground">{m}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-5 pt-4 border-t border-border/50">
                    <Button className="w-full gap-1.5">
                      开始挑战
                      <Zap className="size-4" />
                    </Button>
                    <p className="text-xs text-muted-foreground text-center mt-2">
                      预计 {challenge.duration}完成
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

             {/* 吉祥物提示 */}
             <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.6, delay: 0.25 }}
               className="hidden md:block"
             >
               <Card className="border border-border/60 bg-gradient-to-br from-primary/5 to-transparent">
                 <CardContent className="p-4 flex items-start gap-3">
                   <Image
                     src={MASCOT_IMG}
                     alt="智象"
                     className="size-12 rounded-lg shrink-0 bg-white"
                   />
                   <div>
                     <div className="text-sm font-semibold text-foreground mb-1">小象提示 💡</div>
                     <p className="text-xs text-muted-foreground leading-relaxed">
                       做项目最重要的不是结果，而是过程。遇到问题不要急着问老师，先自己想一想、试一试，你会学到更多！
                     </p>
                   </div>
                 </CardContent>
               </Card>
             </motion.div>

             {/* 相关课程 */}
             {relatedCourses.length > 0 && (
               <motion.div
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ duration: 0.6, delay: 0.3 }}
               >
                 <Card className="border border-border/60">
                   <CardHeader className="pb-3">
                     <div className="flex items-center gap-2">
                       <div className="size-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                         <BookOpen className="size-4 text-white" />
                       </div>
                       <CardTitle className="text-base">相关课程</CardTitle>
                     </div>
                   </CardHeader>
                   <CardContent className="pt-0 space-y-2">
                     {relatedCourses.map((course) => (
                       <button
                         key={course.id}
                         onClick={() => navigate(`/course/${course.id}`)}
                         className="w-full text-left p-3 rounded-lg hover:bg-muted/50 transition-colors group"
                       >
                         <p className="text-sm font-medium text-foreground truncate group-hover:text-primary">
                           {course.title}
                         </p>
                         <p className="text-xs text-muted-foreground mt-0.5">
                           {course.totalLessons} 课时 · {Math.floor(course.duration / 60)} 小时
                         </p>
                       </button>
                     ))}
                   </CardContent>
                 </Card>
               </motion.div>
             )}

             {/* 相关AI实验 */}
             {relatedAiProjects.length > 0 && (
               <motion.div
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ duration: 0.6, delay: 0.35 }}
               >
                 <Card className="border border-border/60">
                   <CardHeader className="pb-3">
                     <div className="flex items-center gap-2">
                       <div className="size-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
                         <Sparkles className="size-4 text-white" />
                       </div>
                       <CardTitle className="text-base">相关AI实验</CardTitle>
                     </div>
                   </CardHeader>
                   <CardContent className="pt-0 space-y-2">
                     {relatedAiProjects.map((project) => (
                       <button
                         key={project.id}
                         onClick={() => navigate(`/ai-lab/project/${project.id}`)}
                         className="w-full text-left p-3 rounded-lg hover:bg-muted/50 transition-colors group"
                       >
                         <p className="text-sm font-medium text-foreground truncate group-hover:text-violet-600">
                           {project.name}
                         </p>
                         <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                           {project.description}
                         </p>
                       </button>
                     ))}
                   </CardContent>
                 </Card>
               </motion.div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}

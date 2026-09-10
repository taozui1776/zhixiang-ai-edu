// EXPORTS: IKnowledgePoint, KNOWLEDGE_MAP, KNOWLEDGE_MODULES, getKnowledgeByLesson, getLessonKnowledgePoints

export interface IKnowledgePoint {
  id: string;
  title: string;
  module: string; // 所属 8 大模块
  source: 'national' | 'anhui'; // 国家指南 / 安徽纲要
  stage: 'primary' | 'junior' | 'senior' | 'all';
  description: string;
}

// 8 大课程模块
export const KNOWLEDGE_MODULES = [
  { key: 'smart_life', name: '智能学习与生活', icon: 'smart_life' },
  { key: 'data_ai', name: '数据与人工智能', icon: 'data_ai' },
  { key: 'ai_algorithms', name: '身边的人工智能算法', icon: 'ai_algorithms' },
  { key: 'smart_control', name: '智能过程与控制', icon: 'smart_control' },
  { key: 'collab_innovation', name: '人工智能协同创新', icon: 'collab_innovation' },
  { key: 'embodied_ai', name: '具身智能实践探索', icon: 'embodied_ai' },
  { key: 'algo_explore', name: '人工智能算法探秘', icon: 'algo_explore' },
  { key: 'ethics_society', name: '人工智能伦理与社会责任', icon: 'ethics_society' },
];

// 知识点总表（国家指南 + 安徽纲要对照）
export const KNOWLEDGE_POINTS: IKnowledgePoint[] = [
  // 模块 1：智能学习与生活
  { id: 'nl-1-1', title: '人工智能基本概念与特征', module: 'smart_life', source: 'national', stage: 'primary', description: '理解什么是人工智能，人工智能的基本特征和应用场景' },
  { id: 'nl-1-2', title: '人工智能在日常生活中的应用', module: 'smart_life', source: 'national', stage: 'primary', description: '认识身边的智能产品与服务' },
  { id: 'ah-1-1', title: '智能学习与生活模块·智能小伙伴', module: 'smart_life', source: 'anhui', stage: 'primary', description: '安徽纲要小学段第 1 模块第 1 条：认识身边的 AI' },
  { id: 'ah-1-2', title: '智能学习与生活模块·智能家居', module: 'smart_life', source: 'anhui', stage: 'primary', description: '安徽纲要小学段第 1 模块第 2 条：体验智能音箱与智能家居' },
  { id: 'ah-1-3', title: '智能学习与生活模块·智能音箱原理', module: 'smart_life', source: 'anhui', stage: 'primary', description: '安徽纲要小学段第 1 模块第 3 条：了解智能音箱的工作方式' },

  // 模块 2：数据与人工智能
  { id: 'nl-2-1', title: '数据的概念与类型', module: 'data_ai', source: 'national', stage: 'primary', description: '理解什么是数据，数据的基本类型和表达形式' },
  { id: 'nl-2-2', title: '数据采集与标注', module: 'data_ai', source: 'national', stage: 'primary', description: '了解数据采集的方法和标注的意义' },
  { id: 'nl-2-3', title: '数据与人工智能的关系', module: 'data_ai', source: 'national', stage: 'primary', description: '理解数据是人工智能的基础' },
  { id: 'ah-2-1', title: '数据小侦探模块·数据是什么', module: 'data_ai', source: 'anhui', stage: 'primary', description: '安徽纲要小学段第 2 模块第 1 条：认识数据' },
  { id: 'ah-2-2', title: '数据小侦探模块·数据采集', module: 'data_ai', source: 'anhui', stage: 'primary', description: '安徽纲要小学段第 2 模块第 2 条：体验数据采集与整理' },
  { id: 'ah-2-3', title: '数据小侦探模块·数据标注', module: 'data_ai', source: 'anhui', stage: 'primary', description: '安徽纲要小学段第 2 模块第 3 条：动手做数据标注' },

  // 模块 3：身边的人工智能算法
  { id: 'nl-3-1', title: '模式识别基本概念', module: 'ai_algorithms', source: 'national', stage: 'primary', description: '理解模式识别的含义与基本过程' },
  { id: 'nl-3-2', title: '语音识别初体验', module: 'ai_algorithms', source: 'national', stage: 'primary', description: '体验语音识别技术，了解其基本原理' },
  { id: 'nl-3-3', title: '图像识别初体验', module: 'ai_algorithms', source: 'national', stage: 'primary', description: '体验图像识别技术，了解其基本原理' },
  { id: 'ah-3-1', title: '声音的秘密模块·语音识别', module: 'ai_algorithms', source: 'anhui', stage: 'primary', description: '安徽纲要小学段第 3 模块第 1 条：声音是如何被识别的' },
  { id: 'ah-3-2', title: '声音的秘密模块·语音合成', module: 'ai_algorithms', source: 'anhui', stage: 'primary', description: '安徽纲要小学段第 3 模块第 2 条：AI 是怎么说话的' },

  // 模块 4：智能过程与控制
  { id: 'nl-4-1', title: '自动控制基本原理', module: 'smart_control', source: 'national', stage: 'primary', description: '理解自动控制的概念和基本过程' },
  { id: 'nl-4-2', title: '传感器与执行器', module: 'smart_control', source: 'national', stage: 'primary', description: '认识传感器和执行器的作用' },
  { id: 'ah-4-1', title: '智能小管家模块·传感器', module: 'smart_control', source: 'anhui', stage: 'primary', description: '安徽纲要小学段第 4 模块第 1 条：认识传感器' },
  { id: 'ah-4-2', title: '智能小管家模块·智能家居系统', module: 'smart_control', source: 'anhui', stage: 'primary', description: '安徽纲要小学段第 4 模块第 2 条：搭建智能小管家' },

  // 模块 5：人工智能协同创新
  { id: 'nl-5-1', title: '人工智能创意表达', module: 'collab_innovation', source: 'national', stage: 'junior', description: '利用 AI 工具进行创意设计和表达' },
  { id: 'nl-5-2', title: '小组协作与项目式学习', module: 'collab_innovation', source: 'national', stage: 'junior', description: '通过小组项目探究 AI 应用' },
  { id: 'ah-5-1', title: 'AI 与创意模块·AI 绘画', module: 'collab_innovation', source: 'anhui', stage: 'junior', description: '安徽纲要初中段第 5 模块第 1 条：AI 绘画与创意表达' },
  { id: 'ah-5-2', title: 'AI 与创意模块·协作项目', module: 'collab_innovation', source: 'anhui', stage: 'junior', description: '安徽纲要初中段第 5 模块第 2 条：小组 AI 创意项目' },

  // 模块 6：具身智能实践探索
  { id: 'nl-6-1', title: '机器人基本结构与原理', module: 'embodied_ai', source: 'national', stage: 'junior', description: '了解机器人的基本组成和工作原理' },
  { id: 'nl-6-2', title: '传感器与智能控制', module: 'embodied_ai', source: 'national', stage: 'junior', description: '掌握传感器数据采集与智能控制方法' },
  { id: 'ah-6-1', title: '机器人入门模块·智能小车', module: 'embodied_ai', source: 'anhui', stage: 'junior', description: '安徽纲要初中段第 6 模块第 1 条：制作智能小车' },
  { id: 'ah-6-2', title: '机器人入门模块·传感器应用', module: 'embodied_ai', source: 'anhui', stage: 'junior', description: '安徽纲要初中段第 6 模块第 2 条：传感器与避障、循迹' },

  // 模块 7：人工智能算法探秘
  { id: 'nl-7-1', title: '机器学习基本概念', module: 'algo_explore', source: 'national', stage: 'senior', description: '理解机器学习的定义、分类和基本流程' },
  { id: 'nl-7-2', title: '神经网络初步认识', module: 'algo_explore', source: 'national', stage: 'senior', description: '了解人工神经网络的基本结构和工作原理' },
  { id: 'nl-7-3', title: '模型训练与评估', module: 'algo_explore', source: 'national', stage: 'senior', description: '理解模型训练过程和评估方法' },
  { id: 'nl-7-4', title: 'Python 与人工智能', module: 'algo_explore', source: 'national', stage: 'senior', description: '使用 Python 实现基础 AI 算法' },
  { id: 'ah-7-1', title: '算法探秘模块·机器学习入门', module: 'algo_explore', source: 'anhui', stage: 'senior', description: '安徽纲要高中段第 7 模块第 1 条：机器学习概念与实践' },
  { id: 'ah-7-2', title: '算法探秘模块·神经网络基础', module: 'algo_explore', source: 'anhui', stage: 'senior', description: '安徽纲要高中段第 7 模块第 2 条：神经网络原理初探' },

  // 模块 8：人工智能伦理与社会责任
  { id: 'nl-8-1', title: '人工智能伦理问题', module: 'ethics_society', source: 'national', stage: 'all', description: '认识 AI 发展中的伦理问题和挑战' },
  { id: 'nl-8-2', title: '数据隐私与安全', module: 'ethics_society', source: 'national', stage: 'all', description: '理解数据隐私保护和信息安全的重要性' },
  { id: 'nl-8-3', title: '人工智能的合理使用', module: 'ethics_society', source: 'national', stage: 'all', description: '树立正确使用 AI 的意识和责任感' },
  { id: 'nl-8-4', title: '人工智能与社会发展', module: 'ethics_society', source: 'national', stage: 'all', description: '理解 AI 对社会、经济、就业的影响' },
  { id: 'ah-8-1', title: 'AI 伦理模块·隐私保护', module: 'ethics_society', source: 'anhui', stage: 'senior', description: '安徽纲要高中段第 8 模块第 1 条：AI 时代的隐私与安全' },
  { id: 'ah-8-2', title: 'AI 伦理模块·社会责任', module: 'ethics_society', source: 'anhui', stage: 'senior', description: '安徽纲要高中段第 8 模块第 2 条：AI 的社会责任与规范' },
];

// 课程 id → 知识点 id 映射
export const LESSON_KNOWLEDGE_MAP: Record<string, string[]> = {
  'primary-g3-u1-l1': ['nl-1-1', 'nl-1-2', 'ah-1-1'],
  'primary-g3-u1-l2': ['nl-1-2', 'ah-1-2'],
  'primary-g3-u1-l3': ['nl-1-2', 'ah-1-3', 'nl-3-2'],
  'primary-g3-u1-l4': ['nl-4-1', 'ah-4-2', 'nl-1-2'],
  'primary-g4-u2-l1': ['nl-2-1', 'nl-2-2', 'ah-2-1'],
  'primary-g4-u2-l2': ['nl-2-2', 'nl-2-3', 'ah-2-2', 'ah-2-3'],
  'primary-g5-u3-l1': ['nl-3-1', 'nl-3-2', 'ah-3-1'],
  'primary-g5-u3-l2': ['nl-3-2', 'ah-3-2'],
  'primary-g6-u4-l1': ['nl-4-1', 'nl-4-2', 'ah-4-1'],
  'primary-g6-u4-l2': ['nl-4-1', 'ah-4-2', 'nl-4-2'],
  'junior-g7-u1-l1': ['nl-5-1', 'ah-5-1'],
  'junior-g7-u1-l2': ['nl-5-1', 'nl-5-2', 'ah-5-2'],
  'junior-g8-u2-l1': ['nl-6-1', 'nl-6-2', 'ah-6-1'],
  'junior-g8-u2-l2': ['nl-6-2', 'ah-6-2'],
  'senior-g10-u1-l1': ['nl-7-1', 'nl-7-3', 'ah-7-1'],
  'senior-g10-u1-l2': ['nl-7-1', 'nl-7-2', 'nl-7-4', 'ah-7-2'],
  'senior-g11-u2-l1': ['nl-8-1', 'nl-8-2', 'nl-8-3', 'ah-8-1'],
  'senior-g11-u2-l2': ['nl-8-3', 'nl-8-4', 'ah-8-2'],
};

export function getKnowledgeByLesson(lessonId: string): IKnowledgePoint[] {
  const ids = LESSON_KNOWLEDGE_MAP[lessonId] || [];
  return ids.map((id) => KNOWLEDGE_POINTS.find((k) => k.id === id)).filter(Boolean) as IKnowledgePoint[];
}

export function getLessonKnowledgePoints(lessonId: string) {
  const all = getKnowledgeByLesson(lessonId);
  return {
    national: all.filter((k) => k.source === 'national'),
    anhui: all.filter((k) => k.source === 'anhui'),
  };
}

// 根据模块取知识点
export function getKnowledgeByModule(moduleKey: string) {
  return KNOWLEDGE_POINTS.filter((k) => k.module === moduleKey);
}

// 统计覆盖率
export function getCoverageStats() {
  const totalNational = KNOWLEDGE_POINTS.filter((k) => k.source === 'national').length;
  const totalAnhui = KNOWLEDGE_POINTS.filter((k) => k.source === 'anhui').length;
  const coveredIds = new Set(Object.values(LESSON_KNOWLEDGE_MAP).flat());
  const coveredNational = KNOWLEDGE_POINTS.filter(
    (k) => k.source === 'national' && coveredIds.has(k.id),
  ).length;
  const coveredAnhui = KNOWLEDGE_POINTS.filter(
    (k) => k.source === 'anhui' && coveredIds.has(k.id),
  ).length;
  return {
    totalNational,
    coveredNational,
    nationalPercent: Math.round((coveredNational / totalNational) * 100),
    totalAnhui,
    coveredAnhui,
    anhuiPercent: Math.round((coveredAnhui / totalAnhui) * 100),
    totalPoints: KNOWLEDGE_POINTS.length,
    coveredPoints: coveredIds.size,
  };
}

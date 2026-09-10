// EXPORTS: ICourseSummary, CourseDifficulty, MOCK_COURSE_SUMMARY, getCourseSummaryById

export type CourseDifficulty = '入门' | '进阶' | '挑战';

export interface ICourseSummary {
  id: string;
  title: string;
  stage: 'primary-low' | 'primary-high' | 'junior' | 'senior';
  stageLabel: string;
  totalLessons: number;
  completedLessons?: number;
  difficulty: CourseDifficulty;
  description: string;
  coverImage: string;
  category: string;
  tags: string[];
  duration: number; // 总分钟数
}

export const MOCK_COURSE_SUMMARY: ICourseSummary[] = [
  // ========== 小学高段 ==========
  {
    id: 'course-primary-ai-intro',
    title: 'AI 通识入门',
    stage: 'primary-high',
    stageLabel: '小学高段',
    totalLessons: 8,
    completedLessons: 3,
    difficulty: '入门',
    description:
      '面向小学高段学生的 AI 入门课程，从身边的人工智能说起，通过趣味实验带领学生认识 AI 的基本概念与应用场景。',
    coverImage:
      '/spark/app/app_17dew4qtx2n/runtime/api/v1/storage/object/bucket_aadktjnrk6acw_static/static%2Faadkuiealycnu_ve_miaoda',
    category: 'AI 通识',
    tags: ['图形化编程', 'AI 体验', '项目式学习'],
    duration: 320,
  },
  {
    id: 'course-pbl-general',
    title: '智象AI通识PBL项目课',
    stage: 'primary-high',
    stageLabel: '小学高-初中',
    totalLessons: 30,
    completedLessons: 12,
    difficulty: '进阶',
    description:
      '6大PBL项目式学习课程，以真实问题驱动学生跨学科探究，涵盖智能生活、创意表达、数据洞察等核心主题，培养计算思维与创新实践能力。',
    coverImage:
      '/spark/app/app_17dew4qtx2n/runtime/api/v1/storage/object/bucket_aadktjnrk6acw_static/static%2Faadkuisammuhs_ve_miaoda',
    category: 'PBL 项目',
    tags: ['项目式学习', '跨学科', '小组合作', '计算思维'],
    duration: 1200,
  },

  // ========== 初中 ==========
  {
    id: 'course-junior-vision',
    title: '机器视觉应用',
    stage: 'junior',
    stageLabel: '初中',
    totalLessons: 8,
    completedLessons: 0,
    difficulty: '进阶',
    description:
      '从图像识别原理到卷积神经网络，配合真实实验与可视化工具，让初中学生看懂 AI 视觉背后的技术逻辑。',
    coverImage:
      '/spark/app/app_17dew4qtx2n/runtime/api/v1/storage/object/bucket_aadktjnrk6acw_static/static%2Faadkuig6x46js_ve_miaoda',
    category: 'AI 通识',
    tags: ['图像识别', '卷积网络', 'Python'],
    duration: 360,
  },
  {
    id: 'course-vision-intro',
    title: '智象机器视觉入门课',
    stage: 'junior',
    stageLabel: '初中',
    totalLessons: 7,
    completedLessons: 5,
    difficulty: '入门',
    description:
      '从零开始认识机器视觉，通过趣味实验带领学生了解图像采集、人脸检测、颜色识别等基础视觉应用，适合视觉入门初学者。',
    coverImage:
      '/spark/app/app_17dew4qtx2n/runtime/api/v1/storage/object/bucket_aadktjnrk6acw_static/static%2Faadkuiubufics_ve_miaoda',
    category: 'AI 应用',
    tags: ['图像识别', '入门', '趣味实验', 'OpenCV'],
    duration: 280,
  },

  // ========== 高中 ==========
  {
    id: 'course-senior-algorithm',
    title: 'AI 算法基础',
    stage: 'senior',
    stageLabel: '高中',
    totalLessons: 8,
    completedLessons: 0,
    difficulty: '挑战',
    description:
      '面向高中生的 AI 算法课程，从机器学习基础到深度学习原理，结合代码实践理解算法本质。',
    coverImage:
      '/spark/app/app_17dew4qtx2n/runtime/api/v1/storage/object/bucket_aadktjnrk6acw_static/static%2Faadkuigkzt4ds_ve_miaoda',
    category: 'AI 通识',
    tags: ['机器学习', '深度学习', 'Python', '数学基础'],
    duration: 400,
  },
];

export function getCourseSummaryById(id: string): ICourseSummary | undefined {
  return MOCK_COURSE_SUMMARY.find((c) => c.id === id);
}

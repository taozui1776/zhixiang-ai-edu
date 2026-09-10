// EXPORTS: IStudent, IClass, IClassGroup, MOCK_CLASSES, MOCK_STUDENTS

export interface IStudent {
  id: string;
  name: string;
  account: string;
  avatar?: string;
  classId: string;
  className: string;
  grade: string;
  createdAt: string;
  lastLoginAt: string;
  lessonsCompleted: number;
  totalLessons: number;
  completionRate: number;
}

export interface IClassGroup {
  id: string;
  name: string;
  studentIds: string[];
  color: string;
}

export interface IClass {
  id: string;
  name: string;
  grade: string;
  gradeLevel: number;
  studentCount: number;
  teacherName: string;
  teacherId: string;
  createdAt: string;
  description?: string;
  groups: IClassGroup[];
  stage: string; // 学段：小学低段 / 小学高段 / 初中 / 高中
  classroom?: string;
}

const GRADES = [
  '一年级', '二年级', '三年级', '四年级', '五年级', '六年级',
  '七年级', '八年级', '九年级',
  '高一', '高二', '高三',
];

export { GRADES };

export const MOCK_CLASSES: IClass[] = [
  {
    id: 'class-g4-1',
    name: '四年级(1)班',
    grade: '四年级',
    gradeLevel: 4,
    studentCount: 38,
    teacherName: '张老师',
    teacherId: 't-001',
    createdAt: '2025-03-01',
    description: '人工智能通识课实验班',
    stage: '小学高段',
    classroom: 'AI教室A',
    groups: [
      { id: 'g1', name: '探索小组', studentIds: ['s1', 's2', 's3', 's4'], color: 'bg-blue-500' },
      { id: 'g2', name: '创新小组', studentIds: ['s5', 's6'], color: 'bg-emerald-500' },
    ],
  },
  {
    id: 'class-g4-2',
    name: '四年级(2)班',
    grade: '四年级',
    gradeLevel: 4,
    studentCount: 40,
    teacherName: '李老师',
    teacherId: 't-002',
    createdAt: '2025-03-01',
    description: 'AI通识课程班',
    stage: '小学高段',
    classroom: 'AI教室A',
    groups: [
      { id: 'g1', name: '第一组', studentIds: [], color: 'bg-blue-500' },
      { id: 'g2', name: '第二组', studentIds: [], color: 'bg-emerald-500' },
    ],
  },
  {
    id: 'class-g5-1',
    name: '五年级(1)班',
    grade: '五年级',
    gradeLevel: 5,
    studentCount: 42,
    teacherName: '王老师',
    teacherId: 't-003',
    createdAt: '2025-02-20',
    description: 'PBL项目式学习实验班',
    stage: '小学高段',
    classroom: 'AI教室B',
    groups: [
      { id: 'g1', name: '探索小组', studentIds: [], color: 'bg-violet-500' },
      { id: 'g2', name: '创新小组', studentIds: [], color: 'bg-amber-500' },
    ],
  },
  {
    id: 'class-g7-1',
    name: '七年级(1)班',
    grade: '七年级',
    gradeLevel: 7,
    studentCount: 45,
    teacherName: '刘老师',
    teacherId: 't-004',
    createdAt: '2025-02-15',
    description: '机器视觉课程班',
    stage: '初中',
    classroom: '信息教室',
    groups: [
      { id: 'g1', name: '第一组', studentIds: ['s7', 's8', 's9'], color: 'bg-violet-500' },
      { id: 'g2', name: '第二组', studentIds: ['s10', 's11'], color: 'bg-amber-500' },
    ],
  },
  {
    id: 'class-g7-2',
    name: '七年级(2)班',
    grade: '七年级',
    gradeLevel: 7,
    studentCount: 43,
    teacherName: '陈老师',
    teacherId: 't-005',
    createdAt: '2025-02-15',
    description: 'AI应用课程班',
    stage: '初中',
    classroom: '信息教室',
    groups: [
      { id: 'g1', name: '第一组', studentIds: [], color: 'bg-violet-500' },
      { id: 'g2', name: '第二组', studentIds: [], color: 'bg-amber-500' },
    ],
  },
  {
    id: 'class-g10-2',
    name: '高一(2)班',
    grade: '高一',
    gradeLevel: 10,
    studentCount: 48,
    teacherName: '赵老师',
    teacherId: 't-006',
    createdAt: '2025-01-10',
    description: '算法与人工智能选修',
    stage: '高中',
    classroom: '计算机教室',
    groups: [
      { id: 'g1', name: '算法组', studentIds: ['s12', 's13', 's14'], color: 'bg-rose-500' },
      { id: 'g2', name: '项目组', studentIds: ['s15', 's16'], color: 'bg-cyan-500' },
    ],
  },
];

export const MOCK_STUDENTS: IStudent[] = [
  // 四年级1班
  { id: 's1', name: '陈小明', account: 'chenxm_g4', classId: 'class-g4-1', className: '四年级1班', grade: '四年级', createdAt: '2025-03-02', lastLoginAt: '2025-09-08', lessonsCompleted: 12, totalLessons: 20, completionRate: 60 },
  { id: 's2', name: '李雨涵', account: 'liyh_g4', classId: 'class-g4-1', className: '四年级1班', grade: '四年级', createdAt: '2025-03-02', lastLoginAt: '2025-09-09', lessonsCompleted: 15, totalLessons: 20, completionRate: 75 },
  { id: 's3', name: '王思远', account: 'wangsy_g4', classId: 'class-g4-1', className: '四年级1班', grade: '四年级', createdAt: '2025-03-03', lastLoginAt: '2025-09-07', lessonsCompleted: 8, totalLessons: 20, completionRate: 40 },
  { id: 's4', name: '张梓萱', account: 'zhangzx_g4', classId: 'class-g4-1', className: '四年级1班', grade: '四年级', createdAt: '2025-03-03', lastLoginAt: '2025-09-09', lessonsCompleted: 18, totalLessons: 20, completionRate: 90 },
  { id: 's5', name: '刘浩然', account: 'liuhr_g4', classId: 'class-g4-1', className: '四年级1班', grade: '四年级', createdAt: '2025-03-04', lastLoginAt: '2025-09-05', lessonsCompleted: 5, totalLessons: 20, completionRate: 25 },
  { id: 's6', name: '赵一诺', account: 'zhaoyn_g4', classId: 'class-g4-1', className: '四年级1班', grade: '四年级', createdAt: '2025-03-04', lastLoginAt: '2025-09-08', lessonsCompleted: 14, totalLessons: 20, completionRate: 70 },
  { id: 's7', name: '孙子琪', account: 'sunzq_g4', classId: 'class-g4-1', className: '四年级1班', grade: '四年级', createdAt: '2025-03-05', lastLoginAt: '2025-09-01', lessonsCompleted: 3, totalLessons: 20, completionRate: 15 },
  { id: 's8', name: '周宇航', account: 'zhouyh_g4', classId: 'class-g4-1', className: '四年级1班', grade: '四年级', createdAt: '2025-03-05', lastLoginAt: '2025-09-09', lessonsCompleted: 16, totalLessons: 20, completionRate: 80 },

  // 七年级1班
  { id: 's9', name: '吴佳怡', account: 'wujiayi_g7', classId: 'class-g7-1', className: '七年级1班', grade: '七年级', createdAt: '2025-02-16', lastLoginAt: '2025-09-08', lessonsCompleted: 22, totalLessons: 30, completionRate: 73 },
  { id: 's10', name: '郑博文', account: 'zhengbw_g7', classId: 'class-g7-1', className: '七年级1班', grade: '七年级', createdAt: '2025-02-16', lastLoginAt: '2025-09-09', lessonsCompleted: 28, totalLessons: 30, completionRate: 93 },
  { id: 's11', name: '黄诗琪', account: 'huangsq_g7', classId: 'class-g7-1', className: '七年级1班', grade: '七年级', createdAt: '2025-02-17', lastLoginAt: '2025-09-06', lessonsCompleted: 18, totalLessons: 30, completionRate: 60 },
  { id: 's12', name: '何俊熙', account: 'hejunxi_g7', classId: 'class-g7-1', className: '七年级1班', grade: '七年级', createdAt: '2025-02-17', lastLoginAt: '2025-09-09', lessonsCompleted: 25, totalLessons: 30, completionRate: 83 },
  { id: 's13', name: '罗思涵', account: 'luosh_g7', classId: 'class-g7-1', className: '七年级1班', grade: '七年级', createdAt: '2025-02-18', lastLoginAt: '2025-09-04', lessonsCompleted: 10, totalLessons: 30, completionRate: 33 },
  { id: 's14', name: '谢雨桐', account: 'xieyt_g7', classId: 'class-g7-1', className: '七年级1班', grade: '七年级', createdAt: '2025-02-18', lastLoginAt: '2025-09-08', lessonsCompleted: 20, totalLessons: 30, completionRate: 67 },

  // 高一2班
  { id: 's15', name: '林子轩', account: 'linzx_g10', classId: 'class-g10-2', className: '高一2班', grade: '高一', createdAt: '2025-01-11', lastLoginAt: '2025-09-09', lessonsCompleted: 35, totalLessons: 40, completionRate: 88 },
  { id: 's16', name: '杨晓雅', account: 'yangxy_g10', classId: 'class-g10-2', className: '高一2班', grade: '高一', createdAt: '2025-01-11', lastLoginAt: '2025-09-07', lessonsCompleted: 30, totalLessons: 40, completionRate: 75 },
  { id: 's17', name: '高浩然', account: 'gaohr_g10', classId: 'class-g10-2', className: '高一2班', grade: '高一', createdAt: '2025-01-12', lastLoginAt: '2025-09-08', lessonsCompleted: 32, totalLessons: 40, completionRate: 80 },
  { id: 's18', name: '马思远', account: 'masy_g10', classId: 'class-g10-2', className: '高一2班', grade: '高一', createdAt: '2025-01-12', lastLoginAt: '2025-09-09', lessonsCompleted: 38, totalLessons: 40, completionRate: 95 },
  { id: 's19', name: '朱雨欣', account: 'zhuyx_g10', classId: 'class-g10-2', className: '高一2班', grade: '高一', createdAt: '2025-01-13', lastLoginAt: '2025-09-05', lessonsCompleted: 20, totalLessons: 40, completionRate: 50 },
  { id: 's20', name: '徐泽宇', account: 'xuzy_g10', classId: 'class-g10-2', className: '高一2班', grade: '高一', createdAt: '2025-01-13', lastLoginAt: '2025-09-08', lessonsCompleted: 28, totalLessons: 40, completionRate: 70 },
];

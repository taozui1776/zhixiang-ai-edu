// EXPORTS: ITeacher, ISchoolCourse, MOCK_TEACHERS, MOCK_SCHOOL_COURSES

export interface ITeacher {
  id: string;
  name: string;
  account: string;
  phone: string;
  email?: string;
  role: 'teacher' | 'admin';
  subject: string;
  classCount: number;
  studentCount: number;
  createdAt: string;
  status: 'active' | 'disabled';
}

export interface ISchoolCourse {
  id: string;
  name: string;
  stage: string;
  module: string;
  lessonsCount: number;
  activatedAt: string;
  status: 'active' | 'expired';
}

export const MOCK_TEACHERS: ITeacher[] = [
  { id: 't-001', name: '张老师', account: 'zhangls', phone: '138****1234', email: 'zhang@school.edu.cn', role: 'teacher', subject: '信息技术', classCount: 2, studentCount: 53, createdAt: '2025-01-15', status: 'active' },
  { id: 't-002', name: '李老师', account: 'lils', phone: '139****5678', email: 'li@school.edu.cn', role: 'teacher', subject: '信息技术', classCount: 1, studentCount: 30, createdAt: '2025-02-01', status: 'active' },
  { id: 't-003', name: '王老师', account: 'wangls', phone: '137****9012', email: 'wang@school.edu.cn', role: 'teacher', subject: '通用技术', classCount: 1, studentCount: 28, createdAt: '2025-01-20', status: 'active' },
  { id: 't-004', name: '陈主任', account: 'chenzr', phone: '136****3456', email: 'chen@school.edu.cn', role: 'admin', subject: '信息技术', classCount: 0, studentCount: 0, createdAt: '2024-12-01', status: 'active' },
  { id: 't-005', name: '刘老师', account: 'liuls', phone: '135****7890', role: 'teacher', subject: '数学', classCount: 0, studentCount: 0, createdAt: '2025-03-10', status: 'disabled' },
];

export const MOCK_SCHOOL_COURSES: ISchoolCourse[] = [
  { id: 'c-001', name: 'AI通识入门（小学）', stage: '小学', module: '智能学习与生活', lessonsCount: 16, activatedAt: '2025-01-01', status: 'active' },
  { id: 'c-002', name: '数据与人工智能', stage: '小学', module: '数据与人工智能', lessonsCount: 12, activatedAt: '2025-01-01', status: 'active' },
  { id: 'c-003', name: 'AI与创意', stage: '初中', module: '人工智能协同创新', lessonsCount: 16, activatedAt: '2025-02-01', status: 'active' },
  { id: 'c-004', name: '机器视觉入门', stage: '初中', module: '计算机视觉', lessonsCount: 16, activatedAt: '2025-02-01', status: 'active' },
  { id: 'c-005', name: '算法探秘', stage: '高中', module: '人工智能算法探秘', lessonsCount: 20, activatedAt: '2025-01-15', status: 'active' },
  { id: 'c-006', name: 'AI伦理与社会', stage: '高中', module: '人工智能伦理', lessonsCount: 12, activatedAt: '2025-06-01', status: 'expired' },
];

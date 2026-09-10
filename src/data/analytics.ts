// EXPORTS: ILessonRecord, IStudentProgress, MOCK_LESSON_RECORDS, MOCK_STUDENT_PROGRESS

export interface ILessonRecord {
  id: string;
  date: string;
  className: string;
  classId: string;
  courseName: string;
  courseId: string;
  lessonTitle: string;
  duration: number; // 分钟
  status: '已完成' | '进行中' | '未开始';
  teacherName: string;
}

export interface IStudentProgress {
  id: string;
  studentName: string;
  studentId: string;
  className: string;
  lessonsCompleted: number;
  totalLessons: number;
  completionRate: number;
  lastLessonAt: string;
  totalMinutes: number;
  experimentsCount: number;
}

export const MOCK_LESSON_RECORDS: ILessonRecord[] = [
  { id: 'r1', date: '2025-09-09', className: '四年级1班', classId: 'class-g4-1', courseName: 'AI通识入门', courseId: 'c-primary-intro', lessonTitle: '第1课 身边的智能小伙伴', duration: 40, status: '已完成', teacherName: '张老师' },
  { id: 'r2', date: '2025-09-08', className: '七年级1班', classId: 'class-g7-1', courseName: 'AI与创意', courseId: 'c-junior-creative', lessonTitle: '第1课 AI绘画与创意表达', duration: 45, status: '已完成', teacherName: '李老师' },
  { id: 'r3', date: '2025-09-08', className: '高一2班', classId: 'class-g10-2', courseName: '算法探秘', courseId: 'c-senior-algorithm', lessonTitle: '第1课 机器学习与模型训练', duration: 45, status: '已完成', teacherName: '王老师' },
  { id: 'r4', date: '2025-09-05', className: '四年级1班', classId: 'class-g4-1', courseName: 'AI通识入门', courseId: 'c-primary-intro', lessonTitle: '第2课 数据采集与标注', duration: 40, status: '已完成', teacherName: '张老师' },
  { id: 'r5', date: '2025-09-04', className: '七年级1班', classId: 'class-g7-1', courseName: 'AI与创意', courseId: 'c-junior-creative', lessonTitle: '第2课 图像风格迁移', duration: 45, status: '已完成', teacherName: '李老师' },
  { id: 'r6', date: '2025-09-03', className: '高一2班', classId: 'class-g10-2', courseName: '算法探秘', courseId: 'c-senior-algorithm', lessonTitle: '第2课 监督与无监督学习', duration: 45, status: '已完成', teacherName: '王老师' },
  { id: 'r7', date: '2025-09-02', className: '四年级1班', classId: 'class-g4-1', courseName: 'AI通识入门', courseId: 'c-primary-intro', lessonTitle: '第3课 语音识别小实验', duration: 40, status: '已完成', teacherName: '张老师' },
  { id: 'r8', date: '2025-09-01', className: '七年级1班', classId: 'class-g7-1', courseName: '机器人入门', courseId: 'c-junior-robot', lessonTitle: '第1课 传感器与智能小车', duration: 45, status: '进行中', teacherName: '李老师' },
];

export const MOCK_STUDENT_PROGRESS: IStudentProgress[] = [
  { id: 'sp1', studentName: '张梓萱', studentId: 's4', className: '四年级1班', lessonsCompleted: 18, totalLessons: 20, completionRate: 90, lastLessonAt: '2025-09-09', totalMinutes: 720, experimentsCount: 12 },
  { id: 'sp2', studentName: '周宇航', studentId: 's8', className: '四年级1班', lessonsCompleted: 16, totalLessons: 20, completionRate: 80, lastLessonAt: '2025-09-09', totalMinutes: 640, experimentsCount: 10 },
  { id: 'sp3', studentName: '李雨涵', studentId: 's2', className: '四年级1班', lessonsCompleted: 15, totalLessons: 20, completionRate: 75, lastLessonAt: '2025-09-08', totalMinutes: 600, experimentsCount: 8 },
  { id: 'sp4', studentName: '赵一诺', studentId: 's6', className: '四年级1班', lessonsCompleted: 14, totalLessons: 20, completionRate: 70, lastLessonAt: '2025-09-08', totalMinutes: 560, experimentsCount: 7 },
  { id: 'sp5', studentName: '陈小明', studentId: 's1', className: '四年级1班', lessonsCompleted: 12, totalLessons: 20, completionRate: 60, lastLessonAt: '2025-09-08', totalMinutes: 480, experimentsCount: 6 },
  { id: 'sp6', studentName: '王思远', studentId: 's3', className: '四年级1班', lessonsCompleted: 8, totalLessons: 20, completionRate: 40, lastLessonAt: '2025-09-07', totalMinutes: 320, experimentsCount: 4 },
  { id: 'sp7', studentName: '刘浩然', studentId: 's5', className: '四年级1班', lessonsCompleted: 5, totalLessons: 20, completionRate: 25, lastLessonAt: '2025-09-05', totalMinutes: 200, experimentsCount: 2 },
  { id: 'sp8', studentName: '孙子琪', studentId: 's7', className: '四年级1班', lessonsCompleted: 3, totalLessons: 20, completionRate: 15, lastLessonAt: '2025-09-01', totalMinutes: 120, experimentsCount: 1 },
];

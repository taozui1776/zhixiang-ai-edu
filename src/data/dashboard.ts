// EXPORTS: ITeachingRecord, IClassInfo, IDashboardStats, MOCK_TEACHING_RECORDS, MOCK_CLASSES, MOCK_DASHBOARD_STATS, MOCK_RECENT_COURSES, MOCK_QUICK_TOOLS

import type { ICourseSummary } from './course-summary';

export interface ITeachingRecord {
  id: string;
  className: string;
  courseName: string;
  lessonName: string;
  duration: number; // 分钟
  date: string; // YYYY-MM-DD
  time: string; // HH:mm-HH:mm
  status: 'completed' | 'in-progress' | 'scheduled';
}

export interface IClassInfo {
  id: string;
  name: string;
  studentCount: number;
  grade: string;
  stage: string;
}

export interface IDashboardStats {
  totalTeachingHours: number;
  totalCourses: number;
  totalClasses: number;
  totalStudents: number;
  thisWeekHours: number;
  completionRate: number;
}

export interface IRecentCourse {
  courseId: string;
  courseName: string;
  stageLabel: string;
  lastVisit: string;
  progress: number;
  coverImage: string;
}

export interface IQuickTool {
  id: string;
  name: string;
  description: string;
  icon: string; // lucide icon key
  path: string;
  gradient: string;
}

export const MOCK_DASHBOARD_STATS: IDashboardStats = {
  totalTeachingHours: 128,
  totalCourses: 6,
  totalClasses: 4,
  totalStudents: 168,
  thisWeekHours: 12,
  completionRate: 72,
};

export const MOCK_CLASSES: IClassInfo[] = [
  { id: 'c1', name: '五年级(1)班', studentCount: 42, grade: 'G5', stage: '小学高段' },
  { id: 'c2', name: '五年级(2)班', studentCount: 40, grade: 'G5', stage: '小学高段' },
  { id: 'c3', name: '七年级(3)班', studentCount: 45, grade: 'G7', stage: '初中' },
  { id: 'c4', name: '高一(1)班', studentCount: 41, grade: 'G10', stage: '高中' },
];

export const MOCK_TEACHING_RECORDS: ITeachingRecord[] = [
  {
    id: 'r1',
    className: '五年级(1)班',
    courseName: 'AI 通识入门',
    lessonName: '第3课 数据小侦探',
    duration: 40,
    date: '2026-09-09',
    time: '10:00-10:40',
    status: 'completed',
  },
  {
    id: 'r2',
    className: '五年级(2)班',
    courseName: 'AI 通识入门',
    lessonName: '第3课 数据小侦探',
    duration: 40,
    date: '2026-09-09',
    time: '14:30-15:10',
    status: 'completed',
  },
  {
    id: 'r3',
    className: '七年级(3)班',
    courseName: '机器视觉应用',
    lessonName: '第1课 眼睛与相机',
    duration: 45,
    date: '2026-09-08',
    time: '09:00-09:45',
    status: 'completed',
  },
  {
    id: 'r4',
    className: '五年级(1)班',
    courseName: 'AI 通识入门',
    lessonName: '第4课 智能小管家',
    duration: 40,
    date: '2026-09-11',
    time: '10:00-10:40',
    status: 'scheduled',
  },
  {
    id: 'r5',
    className: '高一(1)班',
    courseName: 'AI 算法基础',
    lessonName: '第1课 机器学习初体验',
    duration: 45,
    date: '2026-09-10',
    time: '15:00-15:45',
    status: 'scheduled',
  },
];

export const MOCK_RECENT_COURSES: IRecentCourse[] = [
  {
    courseId: 'course-primary-ai-intro',
    courseName: 'AI 通识入门',
    stageLabel: '小学高段',
    lastVisit: '今天 10:40',
    progress: 37.5,
    coverImage:
      '/spark/app/app_17dew4qtx2n/runtime/api/v1/storage/object/bucket_aadktjnrk6acw_static/static%2Faadkuiealycnu_ve_miaoda',
  },
  {
    courseId: 'course-junior-vision',
    courseName: '机器视觉应用',
    stageLabel: '初中',
    lastVisit: '昨天 09:45',
    progress: 12.5,
    coverImage:
      '/spark/app/app_17dew4qtx2n/runtime/api/v1/storage/object/bucket_aadktjnrk6acw_static/static%2Faadkuig6x46js_ve_miaoda',
  },
  {
    courseId: 'course-senior-algorithm',
    courseName: 'AI 算法基础',
    stageLabel: '高中',
    lastVisit: '3 天前',
    progress: 0,
    coverImage:
      '/spark/app/app_17dew4qtx2n/runtime/api/v1/storage/object/bucket_aadktjnrk6acw_static/static%2Faadkuigkzt4ds_ve_miaoda',
  },
];

export const MOCK_QUICK_TOOLS: IQuickTool[] = [
  {
    id: 'qt-ailab',
    name: 'AI 实验室',
    description: '8 大 AI 交互实验',
    icon: 'FlaskConical',
    path: '/ai-lab',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'qt-coding',
    name: '编程实验室',
    description: '图形化 + Python 编程',
    icon: 'Code2',
    path: '/coding-lab',
    gradient: 'from-violet-500 to-purple-500',
  },
  {
    id: 'qt-hardware',
    name: '硬件连接',
    description: '掌控板 / micro:bit',
    icon: 'Cpu',
    path: '/hardware/connect',
    gradient: 'from-emerald-500 to-teal-500',
  },
  {
    id: 'qt-aiplan',
    name: 'AI 备课助手',
    description: '一键生成教案课件',
    icon: 'Sparkles',
    path: '/ai-tools',
    gradient: 'from-amber-500 to-orange-500',
  },
];

// 今日课程（首页顶部展示）
export const MOCK_TODAY_LESSON = {
  courseId: 'course-primary-ai-intro',
  courseName: 'AI 通识入门',
  lessonName: '第4课 智能小管家',
  className: '五年级(1)班',
  time: '10:00 - 10:40',
  stageLabel: '小学高段',
};

export function getTeachingRecords(status?: 'completed' | 'scheduled') {
  if (!status) return MOCK_TEACHING_RECORDS;
  return MOCK_TEACHING_RECORDS.filter((r) => r.status === status);
}

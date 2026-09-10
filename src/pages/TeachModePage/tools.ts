// EXPORTS: getStudentList, saveStudentList, getTeachHistory, saveTeachProgress, getTeachProgress, saveTeachRecord, getAnnotationRecord, saveAnnotationRecord, clearAnnotationRecord, getFavorites, toggleFavorite, isFavorite, getPrepareNotes, savePrepareNotes, getPreparedStatus, setPreparedStatus

const KEY_STUDENT_LIST = 'zhixiang_student_list';
const KEY_TEACH_HISTORY = 'zhixiang_teach_history';
const KEY_ANNOTATION_PREFIX = 'zhixiang_annotation_';
const KEY_FAVORITES = 'zhixiang_favorites';
const KEY_PREPARE_PREFIX = 'zhixiang_prepare_note_';
const KEY_PREPARED_PREFIX = 'zhixiang_prepared_';

// 收藏课程
export interface FavoriteItem {
  courseId: string;
  title: string;
  stage?: string;
  hours?: number;
  addedTime: string;
}

export function getFavorites(): FavoriteItem[] {
  try {
    const raw = localStorage.getItem(KEY_FAVORITES);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

export function isFavorite(courseId: string): boolean {
  return getFavorites().some((f) => f.courseId === courseId);
}

export function toggleFavorite(item: FavoriteItem): boolean {
  const list = getFavorites();
  const idx = list.findIndex((f) => f.courseId === item.courseId);
  if (idx >= 0) {
    list.splice(idx, 1);
    localStorage.setItem(KEY_FAVORITES, JSON.stringify(list));
    return false;
  } else {
    list.unshift(item);
    localStorage.setItem(KEY_FAVORITES, JSON.stringify(list));
    return true;
  }
}

// 备课笔记
export function getPrepareNotes(courseId: string): string {
  try {
    return localStorage.getItem(`${KEY_PREPARE_PREFIX}${courseId}`) || '';
  } catch {
    return '';
  }
}

export function savePrepareNotes(courseId: string, notes: string): void {
  try {
    localStorage.setItem(`${KEY_PREPARE_PREFIX}${courseId}`, notes);
  } catch {
    /* ignore */
  }
}

// 已备课状态
export function getPreparedStatus(courseId: string): boolean {
  try {
    return localStorage.getItem(`${KEY_PREPARED_PREFIX}${courseId}`) === '1';
  } catch {
    return false;
  }
}

export function setPreparedStatus(courseId: string, prepared: boolean): void {
  try {
    if (prepared) {
      localStorage.setItem(`${KEY_PREPARED_PREFIX}${courseId}`, '1');
    } else {
      localStorage.removeItem(`${KEY_PREPARED_PREFIX}${courseId}`);
    }
  } catch {
    /* ignore */
  }
}

// 学生名单
export function getStudentList(): string[] {
  try {
    const raw = localStorage.getItem(KEY_STUDENT_LIST);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr.filter(Boolean) : [];
  } catch {
    return [];
  }
}

export function saveStudentList(list: string[]): void {
  try {
    localStorage.setItem(KEY_STUDENT_LIST, JSON.stringify(list.filter(Boolean)));
  } catch {
    /* ignore */
  }
}

// 最近授课记录
export interface TeachRecord {
  courseId: string;
  lessonTitle: string;
  slideIndex: number;
  totalSlides: number;
  lastTime: string;
  stage?: string;
  className?: string;
  duration?: number; // 分钟
  courseName?: string;
  date?: string;
  time?: string;
  status?: 'completed' | 'in-progress';
}

export function getTeachHistory(): TeachRecord[] {
  try {
    const raw = localStorage.getItem(KEY_TEACH_HISTORY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

export function saveTeachProgress(record: TeachRecord): void {
  try {
    const list = getTeachHistory().filter((r) => r.courseId !== record.courseId);
    list.unshift(record);
    localStorage.setItem(KEY_TEACH_HISTORY, JSON.stringify(list.slice(0, 10)));
  } catch {
    /* ignore */
  }
}

export function getTeachProgress(courseId: string): TeachRecord | undefined {
  const list = getTeachHistory();
  return list.find((r) => r.courseId === courseId);
}

// 保存完整授课记录（退出时用，带班级+时长）
export function saveTeachRecord(record: TeachRecord): void {
  try {
    const list = getTeachHistory();
    // 如果同一个courseId+同天的，更新；否则新增到前面
    const today = new Date().toISOString().split('T')[0];
    const idx = list.findIndex(
      (r) => r.courseId === record.courseId && (r.date || r.lastTime.split('T')[0]) === today,
    );
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...record };
    } else {
      list.unshift(record);
    }
    localStorage.setItem(KEY_TEACH_HISTORY, JSON.stringify(list.slice(0, 20)));
  } catch {
    /* ignore */
  }
}

// 批注记录
export function getAnnotationRecord(courseId: string, slideIndex: number): string | null {
  try {
    return localStorage.getItem(`${KEY_ANNOTATION_PREFIX}${courseId}_${slideIndex}`);
  } catch {
    return null;
  }
}

export function saveAnnotationRecord(courseId: string, slideIndex: number, dataUrl: string): void {
  try {
    localStorage.setItem(`${KEY_ANNOTATION_PREFIX}${courseId}_${slideIndex}`, dataUrl);
  } catch {
    /* ignore */
  }
}

export function clearAnnotationRecord(courseId: string, slideIndex: number): void {
  try {
    localStorage.removeItem(`${KEY_ANNOTATION_PREFIX}${courseId}_${slideIndex}`);
  } catch {
    /* ignore */
  }
}

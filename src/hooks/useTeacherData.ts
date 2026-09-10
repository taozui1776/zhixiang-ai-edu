import { useState, useEffect, useCallback } from 'react';

const FAV_KEY = 'zhixiang_favorites';
const PREP_KEY = 'zhixiang_prepare_list';
const RECENT_KEY = 'zhixiang_recent';
const MAX_RECENT = 8;

export interface RecentItem {
  id: string;
  type: 'course' | 'tool' | 'ai-lab' | 'coding-lab';
  title: string;
  subtitle?: string;
  path: string;
  coverImage?: string;
  lastVisit: string; // ISO 时间
}

// 简单的课程收藏
export function useFavorites(teacherId?: string) {
  const key = teacherId ? `${FAV_KEY}_${teacherId}` : FAV_KEY;
  const [ids, setIds] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(ids));
    } catch {
      // ignore
    }
  }, [ids, key]);

  const toggleFavorite = useCallback((lessonId: string) => {
    setIds((prev) => (prev.includes(lessonId) ? prev.filter((id) => id !== lessonId) : [...prev, lessonId]));
  }, []);

  const isFavorite = useCallback((lessonId: string) => ids.includes(lessonId), [ids]);

  return { favoriteIds: ids, toggleFavorite, isFavorite };
}

// 备课清单
export function usePrepareList(teacherId?: string) {
  const key = teacherId ? `${PREP_KEY}_${teacherId}` : PREP_KEY;
  const [ids, setIds] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(ids));
    } catch {
      // ignore
    }
  }, [ids, key]);

  const addToPrepare = useCallback((lessonId: string) => {
    setIds((prev) => (prev.includes(lessonId) ? prev : [lessonId, ...prev]));
  }, []);

  const removeFromPrepare = useCallback((lessonId: string) => {
    setIds((prev) => prev.filter((id) => id !== lessonId));
  }, []);

  const inPrepare = useCallback((lessonId: string) => ids.includes(lessonId), [ids]);

  return { prepareIds: ids, addToPrepare, removeFromPrepare, inPrepare };
}

// 最近使用记录
export function useRecentItems() {
  const [items, setItems] = useState<RecentItem[]>(() => {
    try {
      const raw = localStorage.getItem(RECENT_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(RECENT_KEY, JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items]);

  const addRecent = useCallback((item: Omit<RecentItem, 'lastVisit'>) => {
    setItems((prev) => {
      // 去重：已存在的移到最前
      const filtered = prev.filter((i) => !(i.id === item.id && i.type === item.type));
      const newItem: RecentItem = {
        ...item,
        lastVisit: new Date().toISOString(),
      };
      return [newItem, ...filtered].slice(0, MAX_RECENT);
    });
  }, []);

  const clearRecent = useCallback(() => setItems([]), []);

  return { recentItems: items, addRecent, clearRecent };
}

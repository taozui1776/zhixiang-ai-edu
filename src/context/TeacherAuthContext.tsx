import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';

export type SchoolStage = 'primary' | 'junior' | 'senior' | 'all';
export type UserRole = 'teacher' | 'student';

export interface TeacherProfile {
  id: string;
  role: 'teacher';
  account: string;
  name: string;
  school: string;
  stage: SchoolStage;
  createdAt: string;
}

export interface StudentProfile {
  id: string;
  role: 'student';
  account: string;
  name: string;
  school: string;
  grade: string; // 例如 G3 / G7 / G10
  gradeName: string; // 显示名
  className?: string; // 班级
  createdAt: string;
}

export type UserProfile = TeacherProfile | StudentProfile;

interface AuthContextValue {
  profile: UserProfile | null;
  isLoggedIn: boolean;
  userRole: UserRole | null;
  login: (
    role: UserRole,
    account: string,
    password: string,
  ) => { success: boolean; message: string };
  register: (
    role: UserRole,
    data: Omit<UserProfile, 'id' | 'createdAt'> & { password: string },
  ) => { success: boolean; message: string };
  logout: () => void;
  updateProfile: (data: Partial<Omit<UserProfile, 'id' | 'account' | 'createdAt' | 'role'>>) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const STORAGE_KEY = 'zhixiang_user_profile';
const PASSWORD_KEY = 'zhixiang_user_passwords';
const LIST_KEY = 'zhixiang_user_list';

function readPasswords(): Record<string, string> {
  try {
    const raw = localStorage.getItem(PASSWORD_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writePasswords(p: Record<string, string>) {
  localStorage.setItem(PASSWORD_KEY, JSON.stringify(p));
}

function readProfile(): UserProfile | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeProfile(p: UserProfile | null) {
  if (p) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
}

function readList(): UserProfile[] {
  try {
    const raw = localStorage.getItem(LIST_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeList(list: UserProfile[]) {
  localStorage.setItem(LIST_KEY, JSON.stringify(list));
}

export function TeacherAuthProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile | null>(() => readProfile());

  const login = useCallback((role: UserRole, account: string, password: string) => {
    const passwords = readPasswords();
    const stored = passwords[`${role}:${account}`];
    if (!stored) {
      return { success: false, message: '账号不存在，请先注册' };
    }
    if (stored !== password) {
      return { success: false, message: '密码错误，请重试' };
    }
    const list = readList();
    const found = list.find((u) => u.role === role && u.account === account);
    if (found) {
      setProfile(found);
      writeProfile(found);
      return { success: true, message: '登录成功' };
    }
    return { success: false, message: '账号信息读取失败' };
  }, []);

  const register = useCallback(
    (role: UserRole, data: Omit<UserProfile, 'id' | 'createdAt'> & { password: string }) => {
      const passwords = readPasswords();
      const key = `${role}:${data.account}`;
      if (passwords[key]) {
        return { success: false, message: '该账号已注册，请直接登录' };
      }
      const newProfile: UserProfile = {
        ...data,
        id: `${role.charAt(0)}_${Date.now()}`,
        createdAt: new Date().toISOString(),
      } as unknown as UserProfile;
      const list = readList();
      list.push(newProfile);
      writeList(list);
      passwords[key] = data.password;
      writePasswords(passwords);
      setProfile(newProfile);
      writeProfile(newProfile);
      return { success: true, message: '注册成功' };
    },
    [],
  );

  const logout = useCallback(() => {
    setProfile(null);
    writeProfile(null);
  }, []);

  const updateProfile = useCallback(
    (data: Partial<Omit<UserProfile, 'id' | 'account' | 'createdAt' | 'role'>>) => {
      if (!profile) return;
      const updated: UserProfile = { ...profile, ...data } as UserProfile;
      setProfile(updated);
      writeProfile(updated);
      const list = readList();
      const idx = list.findIndex((u) => u.id === profile.id);
      if (idx >= 0) {
        list[idx] = updated;
        writeList(list);
      }
    },
    [profile],
  );

  // 跨 tab 同步
  useEffect(() => {
    const handler = () => {
      const current = readProfile();
      setProfile(current);
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        profile,
        isLoggedIn: !!profile,
        userRole: profile?.role ?? null,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useTeacherAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useTeacherAuth must be used within TeacherAuthProvider');
  return ctx;
}

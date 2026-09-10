import { useState, useEffect, useCallback } from 'react';

export type SubscriptionPlan = 'basic' | 'pro' | 'ultimate';

export interface ISubscription {
  plan: SubscriptionPlan;
  expireAt: string; // ISO date string
}

const STORAGE_KEY = 'zhixiang_subscription';

const DEFAULT_SUBSCRIPTION: ISubscription = {
  plan: 'pro',
  expireAt: '2027-09-10',
};

// 基础版不可访问的功能路径前缀
export const PRO_ONLY_PATHS = [
  '/analytics',
  '/class',
  '/school',
  '/data-management',
];

const listeners = new Set<(sub: ISubscription) => void>();

function loadSubscription(): ISubscription {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object' && parsed.plan) {
        return parsed as ISubscription;
      }
    }
  } catch {
    // ignore
  }
  // 首次使用写入默认值
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SUBSCRIPTION));
  } catch {
    // ignore
  }
  return DEFAULT_SUBSCRIPTION;
}

function saveSubscription(sub: ISubscription) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sub));
  } catch {
    // ignore
  }
  listeners.forEach((fn) => fn(sub));
}

export function useSubscription() {
  const [subscription, setSubscription] = useState<ISubscription>(() => loadSubscription());

  useEffect(() => {
    const handler = (sub: ISubscription) => setSubscription(sub);
    listeners.add(handler);
    // storage 事件同步跨标签页
    const onStorage = (e: StorageEvent) => {
      if (e.key && e.key.includes(STORAGE_KEY)) {
        setSubscription(loadSubscription());
      }
    };
    window.addEventListener('storage', onStorage);
    return () => {
      listeners.delete(handler);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  const switchPlan = useCallback((plan: SubscriptionPlan, expireAt?: string) => {
    const newSub: ISubscription = {
      plan,
      expireAt: expireAt || subscription.expireAt,
    };
    saveSubscription(newSub);
    setSubscription(newSub);
  }, [subscription.expireAt]);

  const canAccess = useCallback(
    (path: string) => {
      if (subscription.plan === 'basic') {
        return !PRO_ONLY_PATHS.some((p) => path.startsWith(p));
      }
      return true;
    },
    [subscription.plan],
  );

  return {
    subscription,
    plan: subscription.plan,
    switchPlan,
    canAccess,
    isPro: subscription.plan === 'pro' || subscription.plan === 'ultimate',
    isUltimate: subscription.plan === 'ultimate',
  };
}

export const PLAN_LABELS: Record<SubscriptionPlan, string> = {
  basic: '基础版',
  pro: '专业版',
  ultimate: '旗舰版',
};

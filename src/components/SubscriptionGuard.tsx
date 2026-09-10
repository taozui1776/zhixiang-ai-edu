import { useLocation } from 'react-router-dom';
import { useSubscription, PRO_ONLY_PATHS } from '@/hooks/use-subscription';
import UpgradePrompt from '@/components/UpgradePrompt';
import { Outlet } from 'react-router-dom';

const FEATURE_NAMES: Record<string, { name: string; desc: string }> = {
  '/analytics': { name: '学情中心', desc: '全面的教学数据分析与可视化，帮助您精准掌握学生学习情况。' },
  '/class': { name: '班级管理', desc: '管理班级与学生信息，批量布置作业与实验任务。' },
  '/school': { name: '学校管理后台', desc: '学校级别的教师管理、数据看板与资源统一管理。' },
  '/data-management': { name: '数据管理', desc: '批量数据导入导出与高级数据管理功能。' },
};

export default function SubscriptionGuard() {
  const { plan } = useSubscription();
  const location = useLocation();

  if (plan === 'basic') {
    const matched = PRO_ONLY_PATHS.find((p) => location.pathname.startsWith(p));
    if (matched) {
      const info = FEATURE_NAMES[matched] || { name: '此功能', desc: '该功能需升级到专业版及以上版本使用。' };
      return <UpgradePrompt featureName={info.name} featureDescription={info.desc} />;
    }
  }

  return <Outlet />;
}

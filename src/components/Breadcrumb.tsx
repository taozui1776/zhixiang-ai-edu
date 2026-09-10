import { Home, ChevronRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

// 路由路径 → 面包屑名称映射
const PATH_LABELS: Record<string, string> = {
  courses: '课程库',
  tools: '学科工具',
  'coding-lab': '编程实验室',
  training: '训练中心',
  'ai-tools': 'AI 备课助手',
  'ai-lab': 'AI 实验室',
  hardware: '硬件生态',
  'hardware/connect': '硬件连接中心',
  'hardware/firmware': '固件中心',
  'ai-model-center': 'AI 模型中心',
  'ai-training': 'AI 训练平台',
  'edge-ai': '边缘 AI 实验',
  'open-platform': '开放平台',
  'data-management': '数据管理',
  teacher: '教师中心',
  copyright: '版权与合规',
  vision: '机器视觉课',
  'knowledge-map': '知识点地图',
  student: '学生中心',
  'after-school': '课后拓展',
  'after-school/challenge': '挑战项目',
  pbl: 'PBL 项目课',
  print: '打印教案',
  analytics: '学情中心',
  class: '班级管理',
  'teacher-training': '教师培训',
  profile: '个人中心',
  school: '学校管理',
  pricing: '订阅中心',
  teach: '授课模式',
};

// 动态参数路由的名称映射（按 segments 长度匹配）
const DYNAMIC_LABELS: Record<string, string> = {
  'courses/:courseId': '课程详情',
  'pbl/:projectId': '项目详情',
  'print/:lessonId': '打印教案',
  'teach/:courseId': '授课模式',
  'ai-lab/:projectId': '实验详情',
  'after-school/challenge/:id': '挑战详情',
  'teacher-training/:tutorialId': '培训详情',
};

function matchDynamicRoute(segments: string[]): string | null {
  // 将 segments 转换为 :param 形式后查表
  const pattern = segments
    .map((s, i) => {
      // 简单启发：如果是 id 类（数字或特定格式）或最后一段且上层在 PATH_LABELS 中有对应
      if (i === segments.length - 1 && segments.length > 1) {
        const parentPath = segments.slice(0, -1).join('/');
        if (PATH_LABELS[parentPath]) return ':param';
      }
      return s;
    })
    .join('/');
  return DYNAMIC_LABELS[pattern] || null;
}

export default function Breadcrumb() {
  const location = useLocation();
  const pathname = location.pathname;

  // 首页和登录页不显示面包屑
  if (pathname === '/' || pathname === '/login') return null;

  const segments = pathname.split('/').filter(Boolean);
  if (segments.length === 0) return null;

  // 构建面包屑项
  const items: { label: string; path: string; isLast: boolean }[] = [];

  // 第一段（已知路径）
  let currentPath = '';
  segments.forEach((seg, index) => {
    currentPath += (index === 0 ? '' : '/') + seg;
    const isLast = index === segments.length - 1;

    // 先查完整路径
    let label = PATH_LABELS[currentPath];

    // 如果没找到且是最后一段，尝试动态路由匹配
    if (!label && isLast) {
      const dynamicLabel = matchDynamicRoute(segments);
      if (dynamicLabel) label = dynamicLabel;
    }

    // 还没找到，用段本身首字母大写（兜底）
    if (!label) {
      label = seg.charAt(0).toUpperCase() + seg.slice(1);
    }

    // 如果是最后一段且是动态 id（纯数字等），标记为"详情"
    if (isLast && /^\d+$/.test(seg)) {
      // 已经在动态匹配里处理了，这里兜底
      if (label === seg) label = '详情';
    }

    items.push({ label, path: '/' + currentPath, isLast });
  });

  return (
    <nav aria-label="breadcrumb" className="w-full">
      <ol className="flex items-center gap-1.5 text-xs text-muted-foreground flex-wrap">
        <li>
          <Link
            to="/"
            className="flex items-center gap-1 hover:text-primary transition-colors"
          >
            <Home className="size-3.5" />
            <span>首页</span>
          </Link>
        </li>
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-1.5">
            <ChevronRight className="size-3 text-muted-foreground/40" />
            {item.isLast ? (
              <span className="text-foreground font-medium truncate max-w-[200px]">
                {item.label}
              </span>
            ) : (
              <Link
                to={item.path}
                className="hover:text-primary transition-colors truncate max-w-[160px]"
              >
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  Home, BookOpen, FlaskConical, Code2, Cpu, Sparkles,
  Users, BarChart3, GraduationCap, Search, Bell, HelpCircle,
  Play, Settings, LogOut, ChevronDown, FileText, Wrench,
  BrainCircuit, Map, Shield, Building2, CreditCard, User,
  X, Clock, ChevronRight
} from 'lucide-react';
import { useTeacherAuth } from '@/context/TeacherAuthContext';
import AiAssistantPanel from '@/components/AiAssistantPanel';
import { Toaster } from '@/components/ui/sonner';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

// 导航分组
const NAV_GROUPS = [
  {
    label: '教学',
    items: [
      { path: '/', label: '工作台', icon: Home },
      { path: '/courses', label: '课程库', icon: BookOpen },
      { path: '/prepare', label: '备课中心', icon: FileText },
    ],
  },
  {
    label: '实验与工具',
    items: [
      { path: '/ai-lab', label: 'AI实验室', icon: FlaskConical, badge: '23' },
      { path: '/coding-lab', label: '编程实验室', icon: Code2 },
      { path: '/hardware/connect', label: '硬件中心', icon: Cpu },
      { path: '/ai-tools', label: 'AI工具', icon: Sparkles },
    ],
  },
  {
    label: '管理',
    items: [
      { path: '/class', label: '班级管理', icon: Users },
      { path: '/analytics', label: '学情中心', icon: BarChart3 },
      { path: '/teacher-training', label: '教师培训', icon: GraduationCap },
    ],
  },
];

// 更多功能
const MORE_ITEMS = [
  { path: '/my-materials', label: '我的素材', icon: FileText },
  { path: '/tools', label: '学科工具', icon: Wrench },
  { path: '/ai-model-center', label: 'AI模型中心', icon: BrainCircuit },
  { path: '/knowledge-map', label: '知识地图', icon: Map },
  { path: '/school', label: '学校管理', icon: Building2 },
  { path: '/pricing', label: '订阅中心', icon: CreditCard },
  { path: '/copyright', label: '版权声明', icon: Shield },
];

export const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { profile, logout } = useTeacherAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [showQuickStart, setShowQuickStart] = useState(false);

  // 最近课程（模拟数据）
  const recentCourses = [
    { id: 'course-primary-ai-intro', title: '身边的智能小伙伴', stage: '小学', lessons: 8, icon: '🤖' },
    { id: 'course-junior-vision', title: '机器视觉应用', stage: '初中', lessons: 8, icon: '👁️' },
    { id: 'course-pbl-general', title: 'PBL项目式学习', stage: '初中', lessons: 12, icon: '🎯' },
    { id: 'course-senior-algorithm', title: '算法与人工智能', stage: '高中', lessons: 10, icon: '🧮' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const getPageTitle = () => {
    for (const group of NAV_GROUPS) {
      for (const item of group.items) {
        if (isActive(item.path)) return item.label;
      }
    }
    for (const item of MORE_ITEMS) {
      if (isActive(item.path)) return item.label;
    }
    return '工作台';
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* ===== 左侧边栏 ===== */}
      <aside className="w-60 flex-shrink-0 flex flex-col relative overflow-hidden"
        style={{ background: 'linear-gradient(180deg, #1e1b4b 0%, #312e81 100%)' }}>
        {/* 渐变光晕 */}
        <div className="absolute top-0 left-0 right-0 h-48 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at top, rgba(139,92,246,0.2), transparent)' }} />

        {/* Logo */}
        <div className="px-5 py-4 flex items-center gap-3 border-b border-white/10 relative z-10">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-2xl shadow-lg"
            style={{ background: 'linear-gradient(135deg, #8b5cf6, #6366f1)' }}>
            🐘
          </div>
          <div>
            <div className="text-white font-bold text-base">希沃-智象</div>
            <div className="text-indigo-300 text-[11px]">AI人工智能教育平台</div>
          </div>
        </div>

        {/* 导航 */}
        <nav className="flex-1 overflow-y-auto py-3 px-3 relative z-10">
          {NAV_GROUPS.map((group) => (
            <div key={group.label} className="mb-4">
              <div className="text-[11px] font-semibold text-indigo-400 uppercase tracking-wider px-3 mb-2">
                {group.label}
              </div>
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all mb-0.5 ${
                      active
                        ? 'text-white shadow-inner'
                        : 'text-indigo-200 hover:text-white hover:bg-white/10'
                    }`}
                    style={active ? {
                      background: 'linear-gradient(135deg, rgba(139,92,246,0.35), rgba(99,102,241,0.2))',
                      boxShadow: 'inset 0 0 0 1px rgba(139,92,246,0.3)',
                    } : {}}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.badge && (
                      <span className="bg-violet-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-semibold">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}

          {/* 更多功能 */}
          <div className="mb-4">
            <div className="text-[11px] font-semibold text-indigo-400 uppercase tracking-wider px-3 mb-2">
              更多
            </div>
            {MORE_ITEMS.slice(0, 4).map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all mb-0.5 ${
                    active
                      ? 'text-white'
                      : 'text-indigo-200 hover:text-white hover:bg-white/10'
                  }`}
                  style={active ? {
                    background: 'linear-gradient(135deg, rgba(139,92,246,0.35), rgba(99,102,241,0.2))',
                  } : {}}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="flex-1 text-left">{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* 底部用户 */}
        <div className="p-3 border-t border-white/10 relative z-10">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-full flex items-center gap-3 p-2.5 rounded-lg bg-white/5 hover:bg-white/10 transition-all">
                <Avatar className="w-9 h-9">
                  <AvatarFallback className="bg-gradient-to-br from-amber-400 to-orange-500 text-white text-sm font-semibold">
                    {profile?.name?.charAt(0) || '师'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0 text-left">
                  <div className="text-white text-sm font-semibold truncate">
                    {profile?.name || '演示教师'}
                  </div>
                  <div className="text-indigo-300 text-[11px] truncate">
                    {profile?.school || '智象体验学校'}
                  </div>
                </div>
                <ChevronDown className="w-4 h-4 text-indigo-300" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>我的账号</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/profile')}>
                <User className="w-4 h-4 mr-2" /> 个人中心
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/profile?tab=ai')}>
                <Settings className="w-4 h-4 mr-2" /> API设置
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                <LogOut className="w-4 h-4 mr-2" /> 退出登录
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      {/* ===== 主内容区 ===== */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* 顶部栏 */}
        <header className="h-14 bg-white border-b border-slate-200 flex items-center px-6 gap-4 flex-shrink-0">
          <h1 className="text-lg font-bold text-slate-800">{getPageTitle()}</h1>

          {/* 搜索 */}
          <div className="flex-1 max-w-md ml-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索课程、实验、工具... (Ctrl+K)"
                className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-100 transition-all"
              />
            </div>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <button className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-all">
              <Bell className="w-5 h-5" />
            </button>
            <button className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-all">
              <HelpCircle className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowQuickStart(true)}
              className="ml-2 px-4 py-2 text-sm font-semibold text-white rounded-lg shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2"
              style={{ background: 'linear-gradient(135deg, #8b5cf6, #6366f1)' }}
            >
              <Play className="w-4 h-4 fill-current" />
              快速上课
            </button>
          </div>
        </header>

        {/* 内容区 */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* 快速开课弹窗 */}
      {showQuickStart && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* 遮罩 */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowQuickStart(false)}
          />
          {/* 弹窗内容 */}
          <div className="relative bg-white rounded-2xl shadow-2xl w-[480px] max-w-[90vw] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* 头部 */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between"
              style={{ background: 'linear-gradient(135deg, #8b5cf6, #6366f1)' }}>
              <div>
                <h3 className="text-white text-lg font-bold">快速开课</h3>
                <p className="text-indigo-200 text-xs mt-0.5">选择最近课程，一键进入授课模式</p>
              </div>
              <button
                onClick={() => setShowQuickStart(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white/80 hover:bg-white/20 hover:text-white transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 课程列表 */}
            <div className="p-4 max-h-[400px] overflow-y-auto">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-1">
                最近使用
              </div>
              <div className="space-y-2">
                {recentCourses.map((course) => (
                  <button
                    key={course.id}
                    onClick={() => {
                      navigate(`/teach/${course.id}`);
                      setShowQuickStart(false);
                    }}
                    className="w-full flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:border-violet-300 hover:bg-violet-50/50 transition-all group text-left"
                  >
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-violet-100 to-indigo-100 flex items-center justify-center text-2xl flex-shrink-0">
                      {course.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-slate-800 group-hover:text-violet-700 transition-colors truncate">
                        {course.title}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[11px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                          {course.stage}
                        </span>
                        <span className="text-[11px] text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {course.lessons}课时
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-violet-500 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                  </button>
                ))}
              </div>

              {/* 更多课程 */}
              <button
                onClick={() => {
                  navigate('/courses');
                  setShowQuickStart(false);
                }}
                className="w-full mt-4 py-2.5 text-sm text-violet-600 hover:text-violet-700 font-medium border border-dashed border-violet-200 rounded-xl hover:bg-violet-50 transition-all"
              >
                浏览全部课程 →
              </button>
            </div>
          </div>
        </div>
      )}

      <Toaster position="top-right" closeButton richColors />
      <AiAssistantPanel />
    </div>
  );
};

import { useState, useMemo } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Home,
  BookOpen,
  Wrench,
  Target,
  Sparkles,
  Cpu,
  Code2,
  Menu,
  X,
  FlaskConical,
  User,
  Users,
  LogOut,
  Heart,
  FolderOpen,
  LayoutDashboard,
  ChevronDown,
  GraduationCap,
  Rocket,
  MoreHorizontal,
  PlayCircle,
  Map,
  Shield,
  BrainCircuit,
  Database,
  Globe,
  BarChart3,
  Building2,
  CreditCard,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useIsMobile } from '@/hooks/use-mobile';
import { useTeacherAuth } from '@/context/TeacherAuthContext';
import { useSubscription } from '@/hooks/use-subscription';
import Image from '@/components/ui/image';
import AuthDialog from './AuthDialog';
import type { LucideIcon } from 'lucide-react';

const LOGO_BADGE = 'https://aka.doubaocdn.com/s/FTGHri7UGK';
const MASCOT_IMG = 'https://aka.doubaocdn.com/s/FTGHri7UGK';

interface NavItem {
  path: string;
  label: string;
  icon: LucideIcon;
}

// 教师端核心导航（8 项，B端教学平台风格）
const TEACHER_NAV: NavItem[] = [
  { path: '/', label: '教师工作台', icon: Home },
  { path: '/courses', label: '课程库', icon: BookOpen },
  { path: '/ai-lab', label: 'AI 实验室', icon: FlaskConical },
  { path: '/coding-lab', label: '编程实验室', icon: Code2 },
  { path: '/hardware/connect', label: '硬件连接', icon: Cpu },
  { path: '/ai-tools', label: 'AI 工具', icon: Sparkles },
  { path: '/analytics', label: '学情中心', icon: BarChart3 },
];

// 学生端核心导航（5 项）
const STUDENT_NAV: NavItem[] = [
  { path: '/', label: '首页', icon: Home },
  { path: '/courses', label: '课程学习', icon: BookOpen },
  { path: '/ai-lab', label: 'AI 实验室', icon: FlaskConical },
  { path: '/coding-lab', label: '编程实验室', icon: Code2 },
  { path: '/training', label: '训练中心', icon: Target },
];

// 未登录默认导航（教师向展示核心）
const GUEST_NAV: NavItem[] = TEACHER_NAV;

// "更多"下拉菜单（教师端）
const TEACHER_MORE_ITEMS = [
  { path: '/class', label: '班级管理', icon: Users },
  { path: '/teacher-training', label: '教师培训', icon: GraduationCap },
  { path: '/school', label: '学校管理', icon: Building2 },
  { path: '/pricing', label: '订阅中心', icon: CreditCard },
  { path: '/profile', label: '个人中心', icon: User },
  { path: '/tools', label: '学科工具', icon: Wrench },
  { path: '/hardware', label: '硬件生态', icon: Cpu },
  { path: '/hardware/firmware', label: '固件中心', icon: Cpu },
  { path: '/ai-model-center', label: 'AI 模型中心', icon: BrainCircuit },
  { path: '/knowledge-map', label: '知识地图', icon: Map },
  { path: '/copyright', label: '版权声明', icon: Shield },
];

export default function Header() {
  const isMobile = useIsMobile();
  const [menuOpen, setMenuOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const navigate = useNavigate();
  const { profile, isLoggedIn, userRole, logout } = useTeacherAuth();
  const { isPro } = useSubscription();

  const NAV_ITEMS = useMemo(() => {
    if (!isLoggedIn) return GUEST_NAV;
    return userRole === 'student' ? STUDENT_NAV : TEACHER_NAV;
  }, [isLoggedIn, userRole]);

  // 专业版才能看到的菜单项
  const PRO_MORE_PATHS = ['/class', '/analytics', '/school', '/data-management'];

  const filteredMoreItems = useMemo(() => {
    if (isPro) return TEACHER_MORE_ITEMS;
    return TEACHER_MORE_ITEMS.filter((item) => !PRO_MORE_PATHS.includes(item.path));
  }, [isPro]);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/');
  };

  const roleLabel = userRole === 'student' ? '同学' : '老师';

  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border/40">
      <div className="max-w-7xl mx-auto px-4 md:px-6 flex h-16 items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2.5 shrink-0 group"
        >
          <div className="relative size-9 rounded-full overflow-hidden ring-2 ring-primary/20 shadow-md shadow-primary/20 group-hover:ring-primary/40 transition-all">
            <Image
              src={LOGO_BADGE}
              alt="智象 Logo"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col items-start leading-tight">
            <span className="text-base font-bold text-foreground">智象</span>
            <span className="text-[10px] text-muted-foreground hidden sm:block">
               人工智能通识教育平台
            </span>
          </div>
        </button>

        {/* Desktop Nav */}
        {!isMobile && (
          <nav className="flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/'}
                  className={({ isActive }) =>
                    `flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'text-primary bg-primary/10'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                    }`
                  }
                >
                  <Icon className="size-4" />
                  {item.label}
                </NavLink>
              );
            })}

            {/* "更多"下拉菜单 */}
            {userRole !== 'student' && isLoggedIn && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
                    <MoreHorizontal className="size-4" />
                    更多
                    <ChevronDown className="size-3" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center" className="w-52">
                  <DropdownMenuLabel>更多功能</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {filteredMoreItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <DropdownMenuItem
                        key={item.path}
                        onClick={() => navigate(item.path)}
                        className="gap-2 cursor-pointer"
                      >
                        <Icon className="size-4 text-muted-foreground" />
                        {item.label}
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </nav>
        )}

        {/* Right CTA (desktop) */}
        {!isMobile && (
          <div className="flex items-center gap-2">
            {/* 醒目的"开始上课"按钮 */}
            {isLoggedIn && userRole !== 'student' && (
              <Button
                size="sm"
                onClick={() => navigate('/courses')}
                className="gap-1.5 bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-500/90 shadow-md shadow-primary/20"
              >
                <PlayCircle className="size-4" />
                开始上课
              </Button>
            )}

            {isLoggedIn && profile ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-accent transition-colors">
                    <Avatar className="size-7 ring-2 ring-primary/20">
                      <AvatarImage src={MASCOT_IMG} alt={profile.name} />
                      <AvatarFallback>{profile.name.slice(0, 1)}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium max-w-[100px] truncate">
                      {profile.name}{roleLabel}
                    </span>
                    <ChevronDown className="size-3.5 text-muted-foreground" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span className="font-medium text-foreground">
                        {profile.name}{roleLabel}
                      </span>
                      <span className="text-xs text-muted-foreground font-normal">
                        {profile.school}
                      </span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    {userRole === 'teacher' ? (
                      <>
                        <DropdownMenuItem onClick={() => navigate('/teacher')} className="gap-2">
                          <LayoutDashboard className="size-4 text-muted-foreground" />
                          教师中心
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate('/teacher#prepare')} className="gap-2">
                          <FolderOpen className="size-4 text-muted-foreground" />
                          我的备课
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate('/teacher#favorites')} className="gap-2">
                          <Heart className="size-4 text-muted-foreground" />
                          我的收藏
                        </DropdownMenuItem>
                      </>
                    ) : (
                      <>
                        <DropdownMenuItem onClick={() => navigate('/student')} className="gap-2">
                          <LayoutDashboard className="size-4 text-muted-foreground" />
                          我的学习
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate('/training')} className="gap-2">
                          <Target className="size-4 text-muted-foreground" />
                          训练中心
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="gap-2 text-rose-600">
                    <LogOut className="size-4" />
                    退出登录
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button size="sm" onClick={() => setAuthOpen(true)} className="gap-1.5">
                <User className="size-4" />
                登录
              </Button>
            )}
          </div>
        )}

        {/* Mobile hamburger */}
        {isMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="菜单"
          >
            {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        )}
      </div>

      {/* Mobile menu drawer */}
      {isMobile && menuOpen && (
        <div className="border-t border-border/40 bg-background/95 backdrop-blur-md">
          <nav className="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/'}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'text-primary bg-primary/10'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                    }`
                  }
                >
                  <Icon className="size-5" />
                  {item.label}
                </NavLink>
              );
            })}
            <div className="pt-2 border-t border-border/40 mt-2 space-y-1">
              {isLoggedIn && profile ? (
                <>
                  <div className="flex items-center gap-3 px-3 py-3">
                    <Avatar className="size-9 ring-2 ring-primary/20">
                      <AvatarImage src={MASCOT_IMG} alt={profile.name} />
                      <AvatarFallback>{profile.name.slice(0, 1)}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <div className="text-sm font-medium truncate">
                        {profile.name}{roleLabel}
                      </div>
                      <div className="text-xs text-muted-foreground truncate">
                        {profile.school}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      navigate(userRole === 'student' ? '/student' : '/teacher');
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-foreground hover:bg-accent transition-colors"
                  >
                    <LayoutDashboard className="size-4" />
                    {userRole === 'student' ? '我的学习' : '教师中心'}
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    <LogOut className="size-4" />
                    退出登录
                  </button>
                </>
              ) : (
                <>
                  <Button
                    className="w-full gap-1.5"
                    onClick={() => {
                      setMenuOpen(false);
                      setAuthOpen(true);
                    }}
                  >
                    <User className="size-4" />
                    登录 / 注册
                  </Button>
                </>
              )}
            </div>
          </nav>
        </div>
      )}

      {/* 登录弹窗 */}
      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} />
    </header>
  );
}

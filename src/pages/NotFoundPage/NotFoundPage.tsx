import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from '@/components/ui/image';

const MASCOT_IMG = 'https://aka.doubaocdn.com/s/RUYRoCZ6Ts';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-purple-500/10 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6 py-12">
        {/* Mascot */}
        <div className="relative mx-auto w-48 h-48 md:w-56 md:h-56">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-full blur-3xl" />
          <Image
            src={MASCOT_IMG}
            alt="智象吉祥物"
            className="relative z-10 w-full h-full object-contain drop-shadow-xl"
          />
        </div>

        <div className="space-y-2">
          <h1 className="text-7xl md:text-8xl font-black bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent tracking-tight">
            404
          </h1>
          <h2 className="text-xl md:text-2xl font-bold text-foreground">
            哎呀，找不到这个页面了
          </h2>
          <p className="text-muted-foreground text-sm md:text-base leading-relaxed max-w-sm mx-auto">
            智象小象也迷路啦～ 可能是链接输错了，或者页面已经被搬走了。
            我们一起回到首页重新找找看吧！
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Button onClick={() => window.history.back()} variant="secondary">
            <ArrowLeft className="size-4" />
            返回上一页
          </Button>
          <Button asChild>
            <Link to="/">
              <Home className="size-4" />
              回到首页
            </Link>
          </Button>
        </div>

        <div className="pt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
          <Link to="/courses" className="hover:text-primary transition-colors flex items-center gap-1">
            <Search className="size-3.5" />
            课程库
          </Link>
          <span className="text-border">·</span>
          <Link to="/ai-tools" className="hover:text-primary transition-colors">
            AI 备课助手
          </Link>
          <span className="text-border">·</span>
          <Link to="/training" className="hover:text-primary transition-colors">
            训练中心
          </Link>
        </div>
      </div>
    </div>
  );
}

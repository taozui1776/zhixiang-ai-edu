import { Link } from 'react-router-dom';
import { BookOpen, Mail, Phone, MapPin, ShieldCheck, CreditCard, Map } from 'lucide-react';
import Image from '@/components/ui/image';

const LOGO_BADGE = 'https://aka.doubaocdn.com/s/FTGHri7UGK';

export default function Footer() {
  return (
    <footer className="w-full bg-foreground text-background/90 mt-20">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="space-y-4 col-span-2 md:col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="relative size-11 rounded-full overflow-hidden ring-2 ring-white/20 shadow-lg">
                <Image
                  src={LOGO_BADGE}
                  alt="智象 Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="text-lg font-bold text-white">希沃-智象</div>
                 <div className="text-xs text-background/60">人工智能通识教育平台</div>
              </div>
            </div>
             <p className="text-sm text-background/70 leading-relaxed max-w-xs">
                让每一节 AI 通识课都能动手——希沃-智象，面向未来的人工智能通识教育平台，深耕中小学课堂，服务全学段成长。
             </p>
          </div>

          {/* Courses */}
          <div className="space-y-3">
            <h4 className="font-semibold text-white text-sm">课程体系</h4>
            <ul className="space-y-2 text-sm text-background/70">
              <li><Link to="/courses?stage=primary" className="hover:text-white transition-colors">小学课程</Link></li>
              <li><Link to="/courses?stage=junior" className="hover:text-white transition-colors">初中课程</Link></li>
              <li><Link to="/courses?stage=senior" className="hover:text-white transition-colors">高中课程</Link></li>
              <li><Link to="/courses" className="hover:text-white transition-colors">课程库</Link></li>
              <li><Link to="/knowledge-map" className="hover:text-white transition-colors flex items-center gap-1"><Map className="size-3" />知识点地图</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-3">
            <h4 className="font-semibold text-white text-sm">资源中心</h4>
            <ul className="space-y-2 text-sm text-background/70">
               <li><Link to="/ai-lab" className="hover:text-white transition-colors">AI 实验室</Link></li>
               <li><Link to="/coding-lab" className="hover:text-white transition-colors">编程实验室</Link></li>
               <li><Link to="/ai-tools" className="hover:text-white transition-colors">AI 备课助手</Link></li>
               <li><Link to="/training" className="hover:text-white transition-colors">训练中心</Link></li>
               <li><Link to="/hardware" className="hover:text-white transition-colors">硬件生态</Link></li>
               <li><Link to="/hardware/firmware" className="hover:text-white transition-colors">固件中心</Link></li>
               <li><Link to="/ai-training" className="hover:text-white transition-colors">AI 训练平台</Link></li>
               <li><Link to="/edge-ai" className="hover:text-white transition-colors">边缘 AI 实验</Link></li>
               <li><Link to="/tools" className="hover:text-white transition-colors">学科工具</Link></li>
            </ul>
          </div>

          {/* About */}
          <div className="space-y-3">
            <h4 className="font-semibold text-white text-sm">关于平台</h4>
            <ul className="space-y-2 text-sm text-background/70">
              <li><Link to="/pricing" className="hover:text-white transition-colors flex items-center gap-1"><CreditCard className="size-3" />版本与方案</Link></li>
              <li><Link to="/copyright" className="hover:text-white transition-colors flex items-center gap-1"><ShieldCheck className="size-3" />版权与合规</Link></li>
               <li><Link to="/open-platform" className="hover:text-white transition-colors">开放平台</Link></li>
               <li><Link to="/teacher" className="hover:text-white transition-colors">教师中心</Link></li>
               <li><Link to="/teacher/data-management" className="hover:text-white transition-colors">数据管理</Link></li>
               <li><Link to="#" className="hover:text-white transition-colors">关于我们</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-background/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-xs text-background/50 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <span>希沃-智象 AI人工智能通识教育平台 © 2026 | 皖ICP备XXXXXXXX号</span>
            <span className="hidden sm:inline">·</span>
            <span className="flex items-center gap-1.5">
              <Mail className="size-3" />
              contact@zhixiang-ai.edu
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs text-background/50">
            <Link to="/copyright" className="hover:text-white transition-colors">版权声明</Link>
            <Link to="#" className="hover:text-white transition-colors">用户协议</Link>
            <Link to="#" className="hover:text-white transition-colors">隐私政策</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

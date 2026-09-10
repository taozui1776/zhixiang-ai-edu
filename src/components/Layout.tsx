import { Outlet } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumb from '@/components/Breadcrumb';
import AiAssistantPanel from '@/components/AiAssistantPanel';
import { TeacherAuthProvider } from '@/context/TeacherAuthContext';
import { Toaster } from '@/components/ui/sonner';

export const Layout = () => {
  return (
    <TeacherAuthProvider>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 w-full">
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4">
            <Breadcrumb />
          </div>
          <Outlet />
        </main>
        <Footer />
        <Toaster position="top-right" closeButton richColors />
        <AiAssistantPanel />
      </div>
    </TeacherAuthProvider>
  );
};

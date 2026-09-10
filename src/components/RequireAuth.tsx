import { Navigate, useLocation } from 'react-router-dom';
import { useTeacherAuth } from '@/context/TeacherAuthContext';

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useTeacherAuth();
  const location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
}

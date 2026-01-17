import { Navigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }
  return <>{children}</>;
};

export default PrivateRoute;

import { useRoutes } from 'react-router-dom';
import MainLayout from '../layouts';
import { HOME_PATH, LOGIN_PATH, USER_PATH } from './config';
import HomePage from '@/pages/home';
import LoginPage from '@/pages/login';
import UserPage from '@/pages/user';
import ProtectedRoute from '@/components/ProtectedRoute';
import PublicRoute from '@/components/PublicRoute';

export default function AppRoutes() {
  return useRoutes([
    {
      path: LOGIN_PATH,
      element: (
        <PublicRoute>
          <LoginPage />
        </PublicRoute>
      ),
    },
    {
      path: '/',
      element: (
        <ProtectedRoute>
          <MainLayout />
        </ProtectedRoute>
      ),
      children: [
        {
          path: HOME_PATH,
          element: <HomePage />,
        },
        {
          path: USER_PATH,
          element: <UserPage />,
        },
      ],
    },
  ]);
}

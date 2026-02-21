import { useRoutes } from 'react-router-dom';
import MainLayout from '../layouts';
import { HOME_PATH, LOGIN_PATH, USER_PATH, DOCUMENT_PATH, INCOMING_PATH, OUTGOING_PATH, DEPARTMENT_PATH, DOCTYPE_PATH, DASHBOARD_PATH, ROLE_PATH } from './config';
import { Navigate } from 'react-router-dom';
import LoginPage from '@/pages/login';
import UserPage from '@/pages/user';
import DocumentPage from '@/pages/document';
import IncomingPage from '@/pages/incoming';
import OutgoingPage from '@/pages/outgoing';
import DepartmentPage from '@/pages/department';
import DocTypePage from '@/pages/doctype';
import DashboardPage from '@/pages/dashboard';
import RolePage from '@/pages/role';
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
          element: <Navigate to={DASHBOARD_PATH} replace />,
        },
        {
          path: USER_PATH,
          element: <UserPage />,
        },
        {
          path: DOCUMENT_PATH,
          element: <DocumentPage />,
        },
        {
          path: INCOMING_PATH,
          element: <IncomingPage />,
        },
        {
          path: OUTGOING_PATH,
          element: <OutgoingPage />,
        },
        {
          path: DEPARTMENT_PATH,
          element: <DepartmentPage />,
        },
        {
          path: DOCTYPE_PATH,
          element: <DocTypePage />,
        },
        {
          path: DASHBOARD_PATH,
          element: <DashboardPage />,
        },
        {
          path: ROLE_PATH,
          element: <RolePage />,
        },
      ],
    },
  ]);
}

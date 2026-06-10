import { createBrowserRouter } from 'react-router-dom';

import { LoginPage } from '../pages/LoginPage';
import { SignupPage } from '../pages/SignupPage';
import Dashboard from '../pages/Dashboard';
import Diario from '../pages/DailyPage';
import Layout from '../components/Layout';
import { EventsPage } from '../pages/EventsPage';
import { ForgotPassword } from '../pages/ForgotPassword';
import { PerformancePage } from '../pages/PerformancePage';
import { ProfilePage } from '../pages/ProfilePage';
import { ResetPassword } from '../pages/ResetPassword';
import { VocationalTestPage } from '../pages/VocationalTestPage';
import { MentorPage } from '../pages/MentorPage';
import { PrivateRoute } from './PrivateRoute';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LoginPage />,
  },
  {
    path: '/signup',
    element: <SignupPage />,
  },
  {
    path: '/forgot-password',
    element: <ForgotPassword />,
  },
  {
    path: '/reset-password/:token',
    element: <ResetPassword />,
  },
  {
    element: <PrivateRoute />,
    children: [
      {
        element: <Layout />,
        children: [
          {
            path: '/dashboard',
            element: <Dashboard />,
          },
          {
            path: '/diario',
            element: <Diario />,
          },
          {
            path: '/eventos',
            element: <EventsPage />,
          },
          {
            path: '/events',
            element: <EventsPage />,
          },
          {
            path: '/teste',
            element: <VocationalTestPage />,
          },
          {
            path: '/evolucao',
            element: <PerformancePage />,
          },
          {
            path: '/mentor',
            element: <MentorPage />,
          },
          {
            path: '/perfil',
            element: <ProfilePage />,
          },
          {
            path: '/profile',
            element: <ProfilePage />,
          },
        ],
      },
    ],
  },
]);

import { createBrowserRouter } from 'react-router-dom';

import { LoginPage } from '../pages/LoginPage';
import { Dashboard } from '../pages/Dashboard';

import { ForgotPassword } from '../pages/ForgotPassword';
import { ResetPassword } from '../pages/ResetPassword';
import { ProfilePage } from '../pages/ProfilePage';

import { PrivateRoute } from './PrivateRoute';

export const router = createBrowserRouter([
  // Rotas públicas
  {
    path: '/',
    element: <LoginPage />,
  },
  {
    path: '/forgot-password',
    element: <ForgotPassword />,
  },

  {
    path: '/reset-password/:token',
    element: <ResetPassword />,
  },
  // Rotas privadas
  {
    element: <PrivateRoute />,
    children: [
      {
        path: '/dashboard',
        element: <Dashboard />,
      },
      {
  path: '/profile',
  element: <ProfilePage />,
},
    ],
  },
]);
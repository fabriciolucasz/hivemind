import { createBrowserRouter } from 'react-router-dom';

import { LoginPage } from '../pages/LoginPage';
import { SignupPage } from '../pages/SignupPage';
import { Dashboard } from '../pages/Dashboard';

import { PrivateRoute } from './PrivateRoute';

export const router = createBrowserRouter([
  // Rotas públicas
  {
    path: '/',
    element: <LoginPage />,
  },
  {
    path: '/signup',
    element: <SignupPage />,
  },

  // Rotas privadas
  {
    element: <PrivateRoute />,
    children: [
      {
        path: '/dashboard',
        element: <Dashboard />,
      },
    ],
  },
]);
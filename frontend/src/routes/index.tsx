import { createBrowserRouter } from 'react-router-dom';

import { LoginPage } from '../pages/LoginPage';
import { Dashboard } from '../pages/Dashboard';
import { PrivateRoute } from './PrivateRoute';

export const router = createBrowserRouter([
  // Rotas públicas
  {
    path: '/',
    element: <LoginPage />,
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
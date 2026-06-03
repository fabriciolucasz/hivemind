import { createBrowserRouter } from 'react-router-dom';

import { LoginPage } from '../pages/LoginPage';
import { SignupPage } from '../pages/SignupPage';
import Dashboard from '../pages/Dashboard';
import Diario from '../pages/DailyPage';
import Layout from '../components/Layout';
import { EventsPage } from '../pages/EventsPage';
import { VocationalTestPage } from '../pages/VocationalTestPage';
import { PerformancePage } from '../pages/PerformancePage';
import { PrivateRoute } from './PrivateRoute';

export const router = createBrowserRouter([
  // ================= ROTAS PÚBLICAS =================
  {
    path: '/',
    element: <LoginPage />,
  },
  {
    path: '/signup',
    element: <SignupPage />,
  },

  // ================= ROTAS PRIVADAS =================
  {
    // Verifica se o usuário está logado
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
        ],
      },
    ],
  },
]);

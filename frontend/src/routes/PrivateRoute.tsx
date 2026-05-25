import { DashboardLayout } from '../components/DashboardLayout';

export function PrivateRoute() {

  const { user } = useAuth();

  return user
    ? <Outlet />
    : <Navigate to="/" replace />;

}
  return <DashboardLayout />;
}

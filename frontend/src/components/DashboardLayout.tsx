import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Brain,
  Calendar,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Sparkles,
  TrendingUp,
  User,
} from 'lucide-react';

const navItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/dashboard/diary', icon: BookOpen, label: 'Diario' },
  { path: '/dashboard/performance', icon: TrendingUp, label: 'Evolucao de Desempenho' },
  { path: '/events', icon: Calendar, label: 'Eventos' },
  { path: '/dashboard/mentor', icon: Sparkles, label: 'Mentor IA' },
  { path: '/dashboard/test', icon: ClipboardList, label: 'Teste Vocacional' },
];

export function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  function handleLogout() {
    navigate('/');
  }

  function isActive(path: string) {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard';
    }

    return location.pathname.startsWith(path);
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <aside className="hidden w-64 flex-col border-r border-sidebar-border bg-sidebar md:flex">
        <div className="border-b border-sidebar-border p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Brain className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-lg">Hive Mind</h2>
              <p className="text-xs text-muted-foreground">Apoio Vocacional</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-2 p-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 rounded-lg px-4 py-3 transition-colors ${
                  active
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-sidebar-border p-4">
          <Link
            to="/dashboard/profile"
            className={`mb-2 flex items-center gap-3 rounded-lg px-4 py-3 transition-colors ${
              location.pathname === '/dashboard/profile'
                ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
            }`}
          >
            <User className="h-5 w-5" />
            <span>Perfil</span>
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sidebar-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut className="h-5 w-5" />
            <span>Sair</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}

import { Suspense } from 'react';
import { Zap } from 'lucide-react';
import type { DashboardLayoutProps } from '../types';
import { tunnelService } from '../services/tunnel.service';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { use, useCallback, useMemo, useTransition } from 'react';
import { useAuth } from '../hooks/useAuth';

const firstTunnelPromise = tunnelService
  .getActiveTunnels()
  .then((response) => (response.result.length > 0 ? response.result[0].id : null))
  .catch((err) => {
    console.log('Failed to load tunnels:', err);
    return null;
  });

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const [isPendingLogout, startLogoutTransition] = useTransition();

  const firstTunnelId = use(firstTunnelPromise);

  const handleLogout = useCallback(() => {
    startLogoutTransition(async () => {
      await logout();
      navigate('/auth/login');
    });
  }, [logout, navigate]);

  const isActive = useCallback(
    (path: string, exact = false) => {
      if (exact) {
        return location.pathname === path;
      }
      return location.pathname.startsWith(path);
    },
    [location.pathname]
  );

  const navItems = useMemo(
    () => [
      { path: '/dashboard', label: 'Overview', exact: true },
      { path: '/dashboard/tunnels', label: 'Tunnels', exact: false },
      { path: '/dashboard/tokens', label: 'Tokens', exact: false },
      {
        path: firstTunnelId ? `/dashboard/connection-map/${firstTunnelId}` : '/dashboard/connection-map',
        label: 'Connection Map',
        exact: false,
        basePath: '/dashboard/connection-map'
      }
    ],
    [firstTunnelId]
  );

  return (
    <div className="min-h-screen bg-slate-950">
      <header className="bg-slate-900/50 backdrop-blur-sm border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-10 h-10 bg-linear-to-br from-tunnel-500 to-purple-600 rounded-lg shadow-lg shadow-tunnel-500/20">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-display font-bold text-white">
                Tun<span className="text-tunnel-400">nl</span>
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-slate-400">{user?.email || 'placeholder@test.com'}</span>
              <button
                onClick={handleLogout}
                disabled={isPendingLogout}
                className="btn btn-secondary text-sm cursor-pointer disabled:opacity-50"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <nav className="bg-slate-900/30 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {navItems.map((item) => {
              const active = isActive(item.basePath || item.path, item.exact);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`border-b-2 px-1 py-4 text-sm font-medium transition-all cursor-pointer ${
                    active
                      ? 'border-tunnel-500 text-tunnel-400'
                      : 'border-transparent text-slate-300 hover:text-white hover:border-slate-600'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Suspense
          fallback={
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="stat-card animate-pulse">
                    <div className="h-4 bg-slate-800 rounded w-1/2 mb-4" />
                    <div className="h-8 bg-slate-800 rounded w-3/4" />
                  </div>
                ))}
              </div>
            </div>
          }
        >
          {children ?? <Outlet />}
        </Suspense>
      </main>
    </div>
  );
}

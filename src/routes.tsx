import { Navigate, useRoutes } from 'react-router-dom';
import { Home } from './pages/Home';
import { Register } from './pages/auth/Register';
import { Login } from './pages/auth/Login';
import { DashboardLayout } from './layouts/DashboardLayout';
import { Overview } from './pages/dashboard/Overview';
import { Tokens } from './pages/dashboard/Tokens';
import { Tunnels } from './pages/dashboard/Tunnels';
import { TunnelDetails } from './pages/dashboard/TunnelDetails';
import { ProtectedRoute } from './components/shared/ProtectedRoute';
import { ConnectionMapPage } from './pages/dashboard/ConnectionMapPage';

export function AppRoutes() {
  const routes = useRoutes([
    {
      path: '/',
      element: <Home />
    },
    {
      path: '/auth/login',
      element: <Login />
    },
    {
      path: '/auth/register',
      element: <Register />
    },
    {
      path: '/dashboard',
      element: (
        <ProtectedRoute>
          <DashboardLayout />
        </ProtectedRoute>
      ),
      children: [
        { index: true, element: <Overview /> },
        { path: 'tokens', element: <Tokens /> },
        { path: 'tunnels', element: <Tunnels /> },
        { path: 'tunnels/:id', element: <TunnelDetails /> }
      ]
    },
    {
      path: '/dashboard/connection-map',
      element: (
        <ProtectedRoute>
          <ConnectionMapPage />
        </ProtectedRoute>
      ),
      children: [{ path: ':tunnelId', element: <ConnectionMapPage /> }]
    },
    {
      path: '*',
      element: <Navigate to="/auth/login" replace />
    }
  ]);

  return routes;
}

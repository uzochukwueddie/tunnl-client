import { lazy, Suspense } from 'react';
import { Navigate, useRoutes } from 'react-router-dom';
import { LoadingSpinner } from './components/shared/LoadingSpinner';
import { ProtectedRoute } from './components/shared/ProtectedRoute';

// Lazy-loaded page components
const Home = lazy(() => import('./pages/Home').then((m) => ({ default: m.Home })));
const Login = lazy(() => import('./pages/auth/Login').then((m) => ({ default: m.Login })));
const Register = lazy(() => import('./pages/auth/Register').then((m) => ({ default: m.Register })));
const DashboardLayout = lazy(() => import('./layouts/DashboardLayout').then((m) => ({ default: m.DashboardLayout })));
const Overview = lazy(() => import('./pages/dashboard/Overview').then((m) => ({ default: m.Overview })));
const Tokens = lazy(() => import('./pages/dashboard/Tokens').then((m) => ({ default: m.Tokens })));
const Tunnels = lazy(() => import('./pages/dashboard/Tunnels').then((m) => ({ default: m.Tunnels })));
const TunnelDetails = lazy(() => import('./pages/dashboard/TunnelDetails').then((m) => ({ default: m.TunnelDetails })));
const ConnectionMapPage = lazy(() =>
  import('./pages/dashboard/ConnectionMapPage').then((m) => ({ default: m.ConnectionMapPage }))
);

function PageFallback() {
  return <LoadingSpinner text="Loading..." />;
}

export function AppRoutes() {
  const routes = useRoutes([
    {
      path: '/',
      element: (
        <Suspense fallback={<PageFallback />}>
          <Home />
        </Suspense>
      )
    },
    {
      path: '/auth/login',
      element: (
        <Suspense fallback={<PageFallback />}>
          <Login />
        </Suspense>
      )
    },
    {
      path: '/auth/register',
      element: (
        <Suspense fallback={<PageFallback />}>
          <Register />
        </Suspense>
      )
    },
    {
      path: '/dashboard',
      element: (
        <ProtectedRoute>
          <Suspense fallback={<PageFallback />}>
            <DashboardLayout />
          </Suspense>
        </ProtectedRoute>
      ),
      children: [
        {
          index: true,
          element: (
            <Suspense fallback={<PageFallback />}>
              <Overview />
            </Suspense>
          )
        },
        {
          path: 'tokens',
          element: (
            <Suspense fallback={<PageFallback />}>
              <Tokens />
            </Suspense>
          )
        },
        {
          path: 'tunnels',
          element: (
            <Suspense fallback={<PageFallback />}>
              <Tunnels />
            </Suspense>
          )
        },
        {
          path: 'tunnels/:id',
          element: (
            <Suspense fallback={<PageFallback />}>
              <TunnelDetails />
            </Suspense>
          )
        }
      ]
    },
    {
      path: '/dashboard/connection-map',
      element: (
        <ProtectedRoute>
          <Suspense fallback={<PageFallback />}>
            <ConnectionMapPage />
          </Suspense>
        </ProtectedRoute>
      ),
      children: [
        {
          path: ':tunnelId',
          element: (
            <Suspense fallback={<PageFallback />}>
              <ConnectionMapPage />
            </Suspense>
          )
        }
      ]
    },
    {
      path: '*',
      element: <Navigate to="/auth/login" replace />
    }
  ]);

  return routes;
}

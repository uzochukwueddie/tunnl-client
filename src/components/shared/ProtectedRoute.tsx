import type { ReactElement } from 'react';
import type { ProtectedRouteProps } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { LoadingSpinner } from './LoadingSpinner';
import { Navigate } from 'react-router-dom';

export function ProtectedRoute({ children }: ProtectedRouteProps): ReactElement {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  return <>{children}</>;
}

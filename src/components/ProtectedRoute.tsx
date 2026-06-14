import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

/**
 * Access route guard avoiding unauthenticated interactions.
 * We will implement session loader overlays and login redirects here.
 */

interface ProtectedRouteProps {
  children: React.ReactNode;
  setView: (view: string) => void;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, setView }) => {
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setView('login');
    }
  }, [isAuthenticated, isLoading, setView]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
        <div className="w-8 h-8 border-3 border-zinc-900 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-zinc-500 font-mono text-xs">Verifying authorization clearance...</p>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : null;
};


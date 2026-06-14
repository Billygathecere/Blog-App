import React from 'react';

/**
 * Access route guard avoiding unauthenticated interactions.
 * We will implement session loader overlays and login redirects here.
 */

interface ProtectedRouteProps {
  children: React.ReactNode;
  setView: (view: string) => void;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, setView }) => {
  // Space ready for authentication restriction checks
  return <>{children}</>;
};

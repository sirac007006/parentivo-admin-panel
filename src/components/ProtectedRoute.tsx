import React from 'react';
import { Navigate } from 'react-router-dom';
import AuthService from '../services/authService';
import UnauthorizedAccess from './UnauthorizedAccess';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRoles,
}) => {
  const isAuthenticated = AuthService.isAuthenticated();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRoles && !AuthService.hasRole(requiredRoles)) {
    // Umjesto redirecta, prikaži Unauthorized ekran
    console.warn('Access denied! User role:', AuthService.getUserData()?.role, 'Required:', requiredRoles);
    return <UnauthorizedAccess />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

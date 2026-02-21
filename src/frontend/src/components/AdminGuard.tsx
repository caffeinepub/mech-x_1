import { ReactNode } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useUserRole } from '../hooks/useUserRole';
import { useNavigate } from '@tanstack/react-router';
import { Loader2 } from 'lucide-react';
import AccessDeniedScreen from './AccessDeniedScreen';

interface AdminGuardProps {
  children: ReactNode;
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const { identity, isInitializing } = useInternetIdentity();
  const { isAdmin, isLoading: roleLoading } = useUserRole();
  const navigate = useNavigate();

  const isAuthenticated = !!identity;

  // Show loading state while checking authentication
  if (isInitializing || roleLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground">Verifying access...</p>
        </div>
      </div>
    );
  }

  // Redirect to chat if not authenticated
  if (!isAuthenticated) {
    navigate({ to: '/chat' });
    return null;
  }

  // Show access denied if authenticated but not admin
  if (!isAdmin) {
    return <AccessDeniedScreen />;
  }

  // Render protected content for admin users
  return <>{children}</>;
}

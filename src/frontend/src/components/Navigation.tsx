import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useUserRole } from '../hooks/useUserRole';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { MessageSquare, Settings, LogIn, LogOut, Wrench } from 'lucide-react';

export default function Navigation() {
  const navigate = useNavigate();
  const { identity, login, clear, isLoggingIn } = useInternetIdentity();
  const { isAdmin } = useUserRole();
  const queryClient = useQueryClient();

  const isAuthenticated = !!identity;

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
      navigate({ to: '/chat' });
    } else {
      try {
        await login();
      } catch (error: any) {
        console.error('Login error:', error);
        if (error.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div 
            className="flex items-center gap-3 cursor-pointer group smooth-transition hover:opacity-80" 
            onClick={() => navigate({ to: '/chat' })}
          >
            <img 
              src="/assets/generated/mech-x-logo.dim_256x256.png" 
              alt="MECH X" 
              className="h-10 w-10 smooth-transition group-hover:scale-105" 
            />
            <div>
              <h1 className="text-xl font-bold tracking-tight">MECH X</h1>
              <p className="text-xs text-muted-foreground">Automotive Assistant</p>
            </div>
          </div>

          <nav className="flex items-center gap-2">
            {isAuthenticated && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate({ to: '/chat' })}
                  className="gap-2 smooth-transition hover:bg-muted"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span className="hidden sm:inline">Chat</span>
                </Button>
                {isAdmin && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate({ to: '/admin' })}
                    className="gap-2 smooth-transition hover:bg-muted"
                  >
                    <Settings className="w-4 h-4" />
                    <span className="hidden sm:inline">Admin</span>
                  </Button>
                )}
              </>
            )}
            <Button
              onClick={handleAuth}
              disabled={isLoggingIn}
              variant={isAuthenticated ? 'outline' : 'default'}
              size="sm"
              className="gap-2 smooth-transition shadow-sm hover:shadow-md"
            >
              {isLoggingIn ? (
                <>
                  <Wrench className="w-4 h-4 animate-spin" />
                  <span className="hidden sm:inline">Connecting...</span>
                </>
              ) : isAuthenticated ? (
                <>
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span className="hidden sm:inline">Login</span>
                </>
              )}
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}

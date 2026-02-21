import { createRouter, RouterProvider, createRoute, createRootRoute, redirect } from '@tanstack/react-router';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useQueries';
import { useUserRole } from './hooks/useUserRole';
import ChatPage from './pages/Chat';
import AdminDashboard from './pages/AdminDashboard';
import Layout from './components/Layout';
import ProfileSetup from './components/ProfileSetup';
import AdminGuard from './components/AdminGuard';
import { Loader2 } from 'lucide-react';

const rootRoute = createRootRoute({
  component: Layout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  beforeLoad: ({ context }: any) => {
    const { isAdmin } = context;
    if (isAdmin) {
      throw redirect({ to: '/admin' });
    }
    throw redirect({ to: '/chat' });
  },
});

const chatRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/chat',
  component: ChatPage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: () => (
    <AdminGuard>
      <AdminDashboard />
    </AdminGuard>
  ),
});

const routeTree = rootRoute.addChildren([indexRoute, chatRoute, adminRoute]);

function AppContent() {
  const { identity, isInitializing } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const { isAdmin, isLoading: roleLoading } = useUserRole();

  const isAuthenticated = !!identity;
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  const router = createRouter({
    routeTree,
    context: { isAdmin: isAdmin || false },
    defaultPreload: 'intent',
  });

  if (isInitializing || (isAuthenticated && (roleLoading || !isFetched))) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading MECH X...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <RouterProvider router={router} />
      {showProfileSetup && <ProfileSetup />}
    </>
  );
}

export default function App() {
  return <AppContent />;
}

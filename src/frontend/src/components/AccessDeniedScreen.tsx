import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export default function AccessDeniedScreen() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full shadow-lg">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
            <ShieldAlert className="w-8 h-8 text-destructive" />
          </div>
          <div>
            <CardTitle className="text-2xl">Access Denied</CardTitle>
            <CardDescription className="mt-2">
              You don't have permission to access the admin dashboard
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground text-center">
            This area is restricted to administrators only. If you believe you should have access, please contact your system administrator.
          </p>
          <Button
            onClick={() => navigate({ to: '/chat' })}
            className="w-full gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Return to Chat
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

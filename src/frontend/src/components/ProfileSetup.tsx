import { useState } from 'react';
import { useSaveCallerUserProfile } from '../hooks/useQueries';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function ProfileSetup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const saveMutation = useSaveCallerUserProfile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Please enter your name');
      return;
    }

    try {
      await saveMutation.mutateAsync({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
      });
      toast.success('Profile created successfully!');
    } catch (error) {
      toast.error('Failed to create profile');
      console.error('Profile setup error:', error);
    }
  };

  return (
    <Dialog open={true}>
      <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Welcome to MECH X!</DialogTitle>
          <DialogDescription>Please set up your profile to continue</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              disabled={saveMutation.isPending}
              className="smooth-transition focus-ring"
              required
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">Email (optional)</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              disabled={saveMutation.isPending}
              className="smooth-transition focus-ring"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm font-medium">Phone (optional)</Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 (555) 123-4567"
              disabled={saveMutation.isPending}
              className="smooth-transition focus-ring"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full smooth-transition shadow-sm hover:shadow-md" 
            disabled={saveMutation.isPending}
          >
            {saveMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating Profile...
              </>
            ) : (
              'Continue'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

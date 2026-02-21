import { useState } from 'react';
import { useDeleteMechanic } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Edit, Trash2, Phone, MapPin, Star, Wrench, Loader2 } from 'lucide-react';
import MechanicForm from './MechanicForm';
import SkeletonLoader from './SkeletonLoader';
import type { Mechanic } from '../backend';
import { toast } from 'sonner';

// Mock data for demonstration - in production this would come from backend
const mockMechanics: Array<{ id: string; mechanic: Mechanic }> = [
  {
    id: '1',
    mechanic: {
      name: 'Quick Fix Auto Repair',
      contactDetails: '+1 (555) 123-4567',
      latitude: 40.7128,
      longitude: -74.0060,
      specialization: 'General Repairs, Engine Diagnostics',
      rating: 4.8,
    },
  },
  {
    id: '2',
    mechanic: {
      name: 'Elite Transmission Service',
      contactDetails: '+1 (555) 234-5678',
      latitude: 40.7580,
      longitude: -73.9855,
      specialization: 'Transmission, Clutch Repair',
      rating: 4.9,
    },
  },
  {
    id: '3',
    mechanic: {
      name: 'Brake Masters',
      contactDetails: '+1 (555) 345-6789',
      latitude: 40.7489,
      longitude: -73.9680,
      specialization: 'Brake Systems, Suspension',
      rating: 4.7,
    },
  },
];

export default function MechanicList() {
  const [editingMechanic, setEditingMechanic] = useState<{ id: string; mechanic: Mechanic } | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isLoading] = useState(false); // Would be true when fetching from backend
  const deleteMutation = useDeleteMechanic();

  const mechanics = mockMechanics; // Replace with actual query when backend supports getAllMechanics

  const handleDelete = async () => {
    if (!deletingId) return;

    try {
      await deleteMutation.mutateAsync(deletingId);
      toast.success('Mechanic deleted successfully');
      setDeletingId(null);
    } catch (error) {
      toast.error('Failed to delete mechanic');
      console.error('Delete error:', error);
    }
  };

  if (isLoading) {
    return <SkeletonLoader variant="card" count={3} />;
  }

  if (mechanics.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No mechanics added yet. Click "Add Mechanic" to get started.</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {mechanics.map(({ id, mechanic }) => (
          <Card key={id} className="hover-lift shadow-card hover:shadow-card-hover border smooth-transition animate-fade-in">
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <div>
                    <h3 className="font-semibold text-lg leading-tight">{mechanic.name}</h3>
                    <div className="flex items-center gap-1.5 mt-2">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{mechanic.rating.toFixed(1)}</span>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Wrench className="w-4 h-4 flex-shrink-0" />
                      <span>{mechanic.specialization}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 flex-shrink-0 text-muted-foreground" />
                      <span>{mechanic.contactDetails}</span>
                    </div>

                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="w-4 h-4 flex-shrink-0" />
                      <span>
                        {mechanic.latitude.toFixed(4)}, {mechanic.longitude.toFixed(4)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setEditingMechanic({ id, mechanic })}
                    className="smooth-transition hover:bg-muted"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setDeletingId(id)}
                    className="smooth-transition hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!editingMechanic} onOpenChange={(open) => !open && setEditingMechanic(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Mechanic</DialogTitle>
          </DialogHeader>
          {editingMechanic && (
            <MechanicForm
              mechanic={editingMechanic.mechanic}
              mechanicId={editingMechanic.id}
              onSuccess={() => setEditingMechanic(null)}
              onCancel={() => setEditingMechanic(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deletingId} onOpenChange={(open) => !open && setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this mechanic from the directory. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete} 
              disabled={deleteMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

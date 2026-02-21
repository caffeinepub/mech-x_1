import { useState } from 'react';
import { useAddMechanic, useUpdateMechanic } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { Mechanic } from '../backend';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface MechanicFormProps {
  mechanic?: Mechanic;
  mechanicId?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function MechanicForm({ mechanic, mechanicId, onSuccess, onCancel }: MechanicFormProps) {
  const [formData, setFormData] = useState<Mechanic>(
    mechanic || {
      name: '',
      contactDetails: '',
      latitude: 0,
      longitude: 0,
      specialization: '',
      rating: 5.0,
    }
  );

  const addMutation = useAddMechanic();
  const updateMutation = useUpdateMechanic();

  const isEditing = !!mechanicId;
  const mutation = isEditing ? updateMutation : addMutation;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      toast.error('Please enter mechanic name');
      return;
    }
    if (!formData.contactDetails.trim()) {
      toast.error('Please enter contact details');
      return;
    }
    if (!formData.specialization.trim()) {
      toast.error('Please enter specialization');
      return;
    }
    if (formData.rating < 0 || formData.rating > 5) {
      toast.error('Rating must be between 0 and 5');
      return;
    }

    try {
      const id = mechanicId || Date.now().toString();
      await mutation.mutateAsync({ id, mechanic: formData });
      toast.success(isEditing ? 'Mechanic updated successfully' : 'Mechanic added successfully');
      onSuccess();
    } catch (error) {
      toast.error(isEditing ? 'Failed to update mechanic' : 'Failed to add mechanic');
      console.error('Form submission error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="name" className="text-sm font-medium">Mechanic Name *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g., Quick Fix Auto Repair"
          disabled={mutation.isPending}
          className="smooth-transition focus-ring"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="contact" className="text-sm font-medium">Contact Details *</Label>
        <Input
          id="contact"
          value={formData.contactDetails}
          onChange={(e) => setFormData({ ...formData, contactDetails: e.target.value })}
          placeholder="e.g., +1 (555) 123-4567"
          disabled={mutation.isPending}
          className="smooth-transition focus-ring"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="latitude" className="text-sm font-medium">Latitude *</Label>
          <Input
            id="latitude"
            type="number"
            step="any"
            value={formData.latitude}
            onChange={(e) => setFormData({ ...formData, latitude: parseFloat(e.target.value) || 0 })}
            placeholder="e.g., 40.7128"
            disabled={mutation.isPending}
            className="smooth-transition focus-ring"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="longitude" className="text-sm font-medium">Longitude *</Label>
          <Input
            id="longitude"
            type="number"
            step="any"
            value={formData.longitude}
            onChange={(e) => setFormData({ ...formData, longitude: parseFloat(e.target.value) || 0 })}
            placeholder="e.g., -74.0060"
            disabled={mutation.isPending}
            className="smooth-transition focus-ring"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="specialization" className="text-sm font-medium">Specialization *</Label>
        <Textarea
          id="specialization"
          value={formData.specialization}
          onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
          placeholder="e.g., General Repairs, Engine Diagnostics, Transmission"
          disabled={mutation.isPending}
          className="smooth-transition focus-ring min-h-[80px]"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="rating" className="text-sm font-medium">Rating (0-5) *</Label>
        <Input
          id="rating"
          type="number"
          step="0.1"
          min="0"
          max="5"
          value={formData.rating}
          onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) || 0 })}
          disabled={mutation.isPending}
          className="smooth-transition focus-ring"
          required
        />
      </div>

      <div className="flex gap-3 pt-4">
        <Button 
          type="submit" 
          disabled={mutation.isPending} 
          className="flex-1 smooth-transition shadow-sm hover:shadow-md"
        >
          {mutation.isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {isEditing ? 'Updating...' : 'Adding...'}
            </>
          ) : (
            <>{isEditing ? 'Update Mechanic' : 'Add Mechanic'}</>
          )}
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel} 
          disabled={mutation.isPending}
          className="smooth-transition"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}

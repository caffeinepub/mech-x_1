import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import MechanicList from '../components/MechanicList';
import MechanicForm from '../components/MechanicForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default function AdminDashboard() {
  const [showAddForm, setShowAddForm] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold mb-3 leading-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground text-lg">Manage mechanic listings and service providers</p>
        </div>

        <Card className="border-2 shadow-card-lg animate-fade-in">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-5 border-b">
            <div>
              <CardTitle className="text-xl">Mechanic Directory</CardTitle>
              <CardDescription className="mt-1">Add, edit, or remove mechanic listings</CardDescription>
            </div>
            <Button 
              onClick={() => setShowAddForm(true)} 
              className="gap-2 smooth-transition shadow-sm hover:shadow-md"
            >
              <Plus className="w-4 h-4" />
              Add Mechanic
            </Button>
          </CardHeader>
          <CardContent className="pt-6">
            <MechanicList />
          </CardContent>
        </Card>

        <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Mechanic</DialogTitle>
            </DialogHeader>
            <MechanicForm onSuccess={() => setShowAddForm(false)} onCancel={() => setShowAddForm(false)} />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

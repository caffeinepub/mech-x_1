import { useState } from 'react';
import { useGeolocation } from '../hooks/useGeolocation';
import { useFindNearbyMechanics } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MapPin, Loader2, AlertCircle } from 'lucide-react';
import MechanicCard from './MechanicCard';
import SkeletonLoader from './SkeletonLoader';

export default function MechanicRecommendations() {
  const { location, error, isLoading, permissionDenied, requestLocation } = useGeolocation();
  const [maxDistance] = useState(50); // 50km radius

  const { data: mechanics, isLoading: mechanicsLoading } = useFindNearbyMechanics(location, maxDistance);

  return (
    <Card className="h-[calc(100vh-12rem)] flex flex-col border-2 shadow-card-lg">
      <CardHeader className="border-b bg-card">
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-primary" />
          Nearby Mechanics
        </CardTitle>
        <CardDescription>Find service centers near your location</CardDescription>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
        {!location && !error && (
          <div className="flex flex-col items-center justify-center py-12 gap-4">
            <MapPin className="w-16 h-16 text-muted-foreground" />
            <p className="text-center text-muted-foreground leading-relaxed">
              Enable location access to find nearby mechanics
            </p>
            <Button 
              onClick={requestLocation} 
              disabled={isLoading} 
              className="gap-2 smooth-transition shadow-sm hover:shadow-md"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Getting Location...
                </>
              ) : (
                <>
                  <MapPin className="w-4 h-4" />
                  Enable Location
                </>
              )}
            </Button>
          </div>
        )}

        {error && (
          <Alert variant="destructive" className="animate-fade-in">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {location && mechanicsLoading && (
          <SkeletonLoader variant="card" count={3} />
        )}

        {location && !mechanicsLoading && mechanics && mechanics.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 gap-4 animate-fade-in">
            <AlertCircle className="w-16 h-16 text-muted-foreground" />
            <p className="text-center text-muted-foreground leading-relaxed">
              No mechanics found within {maxDistance}km of your location
            </p>
            <p className="text-sm text-muted-foreground text-center leading-relaxed">
              Try expanding your search radius or contact us to add mechanics in your area
            </p>
          </div>
        )}

        {location && mechanics && mechanics.length > 0 && (
          <div className="space-y-3">
            {mechanics.map((mechanic, index) => (
              <MechanicCard
                key={index}
                mechanic={mechanic}
                userLocation={location}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

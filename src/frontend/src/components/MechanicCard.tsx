import type { Mechanic, Location } from '../backend';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Phone, MapPin, Star, Wrench } from 'lucide-react';

interface MechanicCardProps {
  mechanic: Mechanic;
  userLocation?: Location;
}

export default function MechanicCard({ mechanic, userLocation }: MechanicCardProps) {
  const calculateDistance = (loc1: Location, loc2: { latitude: number; longitude: number }): number => {
    const earthRadius = 6371; // km
    const dLat = ((loc2.latitude - loc1.latitude) * Math.PI) / 180;
    const dLon = ((loc2.longitude - loc1.longitude) * Math.PI) / 180;
    const a =
      0.5 -
      Math.cos(dLat) / 2 +
      (Math.cos((loc1.latitude * Math.PI) / 180) *
        Math.cos((loc2.latitude * Math.PI) / 180) *
        (1 - Math.cos(dLon))) /
        2;
    return Math.round(2 * earthRadius * Math.sqrt(a) * 10) / 10;
  };

  const distance = userLocation
    ? calculateDistance(userLocation, { latitude: mechanic.latitude, longitude: mechanic.longitude })
    : null;

  return (
    <Card className="hover-lift shadow-card hover:shadow-card-hover border smooth-transition animate-fade-in">
      <CardContent className="p-5">
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <h3 className="font-semibold text-lg leading-tight mb-2">{mechanic.name}</h3>
              <div className="flex items-center gap-1.5">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{mechanic.rating.toFixed(1)}</span>
              </div>
            </div>
            {distance !== null && (
              <Badge variant="secondary" className="flex items-center gap-1.5 px-3 py-1 shadow-sm">
                <MapPin className="w-3 h-3" />
                {distance} km
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Wrench className="w-4 h-4 flex-shrink-0" />
            <span className="line-clamp-2">{mechanic.specialization}</span>
          </div>

          <div className="flex items-center gap-2 text-sm pt-1">
            <Phone className="w-4 h-4 flex-shrink-0 text-muted-foreground" />
            <a 
              href={`tel:${mechanic.contactDetails}`} 
              className="text-primary hover:underline smooth-transition font-medium"
            >
              {mechanic.contactDetails}
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

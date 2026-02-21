import { useState, useEffect } from 'react';
import type { Location } from '../backend';

export function useGeolocation() {
  const [location, setLocation] = useState<Location | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setIsLoading(true);
    setError(null);
    setPermissionDenied(false);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setIsLoading(false);
      },
      (err) => {
        setIsLoading(false);
        if (err.code === err.PERMISSION_DENIED) {
          setPermissionDenied(true);
          setError('Location permission denied. Please enable location access to find nearby mechanics.');
        } else {
          setError('Unable to retrieve your location. Please try again.');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  return {
    location,
    error,
    isLoading,
    permissionDenied,
    requestLocation,
  };
}

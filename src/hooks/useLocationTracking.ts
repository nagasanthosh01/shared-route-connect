
import { useState, useEffect, useRef } from 'react';
import { LiveLocation } from '@/types/ride';

interface UseLocationTrackingOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
  trackingInterval?: number;
}

export const useLocationTracking = (
  isTracking: boolean,
  options: UseLocationTrackingOptions = {}
) => {
  const [currentLocation, setCurrentLocation] = useState<LiveLocation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState<boolean>(false);
  // Fix: Use number type to handle both browser and Node.js environments
  const watchIdRef = useRef<number | null>(null);

  const {
    enableHighAccuracy = true,
    timeout = 10000,
    maximumAge = 60000,
    trackingInterval = 5000
  } = options;

  useEffect(() => {
    setIsSupported('geolocation' in navigator);
  }, []);

  const startTracking = () => {
    if (!isSupported) {
      setError('Geolocation is not supported by this browser');
      return;
    }

    const options: PositionOptions = {
      enableHighAccuracy,
      timeout,
      maximumAge
    };

    const handleSuccess = (position: GeolocationPosition) => {
      const newLocation: LiveLocation = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        timestamp: new Date(),
        accuracy: position.coords.accuracy
      };
      setCurrentLocation(newLocation);
      setError(null);
    };

    const handleError = (error: GeolocationPositionError) => {
      let errorMessage = 'Unknown location error';
      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = 'Location access denied by user';
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage = 'Location information unavailable';
          break;
        case error.TIMEOUT:
          errorMessage = 'Location request timed out';
          break;
      }
      setError(errorMessage);
    };

    if (navigator.geolocation.watchPosition) {
      watchIdRef.current = navigator.geolocation.watchPosition(
        handleSuccess,
        handleError,
        options
      );
    } else {
      // Fix: Cast setInterval return value to number to resolve type conflict
      const intervalId = setInterval(() => {
        navigator.geolocation.getCurrentPosition(handleSuccess, handleError, options);
      }, trackingInterval) as unknown as number;
      watchIdRef.current = intervalId;
    }
  };

  const stopTracking = () => {
    if (watchIdRef.current !== null) {
      if (typeof watchIdRef.current === 'number' && navigator.geolocation.clearWatch) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      } else {
        clearInterval(watchIdRef.current);
      }
      watchIdRef.current = null;
    }
  };

  useEffect(() => {
    if (isTracking) {
      startTracking();
    } else {
      stopTracking();
    }

    return () => {
      stopTracking();
    };
  }, [isTracking, enableHighAccuracy, timeout, maximumAge]);

  return {
    currentLocation,
    error,
    isSupported,
    startTracking,
    stopTracking
  };
};

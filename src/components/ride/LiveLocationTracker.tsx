
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Navigation } from 'lucide-react';
import { useLocationTracking } from '@/hooks/useLocationTracking';
import { useRide } from '@/contexts/RideContext';
import { useToast } from '@/hooks/use-toast';
import { Ride } from '@/types/ride';
import LocationStatus from './LocationStatus';
import RideControls from './RideControls';
import LocationDisplay from './LocationDisplay';

interface LiveLocationTrackerProps {
  ride: Ride;
  isDriver: boolean;
}

const LiveLocationTracker: React.FC<LiveLocationTrackerProps> = ({ ride, isDriver }) => {
  const { updateLiveLocation, startRide, completeRide, toggleLocationSharing } = useRide();
  const { toast } = useToast();
  
  const isTracking = ride.status === 'in-progress' && ride.isLocationSharingEnabled;
  const { currentLocation, error, isSupported } = useLocationTracking(isTracking && isDriver);

  useEffect(() => {
    if (currentLocation && isDriver && isTracking) {
      updateLiveLocation(ride.id, currentLocation).catch((error) => {
        console.error('Failed to update location:', error);
      });
    }
  }, [currentLocation, isDriver, isTracking, ride.id, updateLiveLocation]);

  const handleStartRide = async () => {
    try {
      await startRide(ride.id);
      toast({
        title: "Ride started",
        description: "Location sharing is now active. Passengers can track your location.",
      });
    } catch (error) {
      toast({
        title: "Failed to start ride",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    }
  };

  const handleCompleteRide = async () => {
    try {
      await completeRide(ride.id);
      toast({
        title: "Ride completed",
        description: "Location sharing has been disabled.",
      });
    } catch (error) {
      toast({
        title: "Failed to complete ride",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    }
  };

  const handleToggleLocationSharing = async () => {
    try {
      const newStatus = !ride.isLocationSharingEnabled;
      await toggleLocationSharing(ride.id, newStatus);
      toast({
        title: newStatus ? "Location sharing enabled" : "Location sharing disabled",
        description: newStatus 
          ? "Passengers can now track your location" 
          : "Location sharing has been disabled",
      });
    } catch (error) {
      toast({
        title: "Failed to toggle location sharing",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    }
  };

  // Early returns for driver error states
  if ((!isSupported || error) && isDriver) {
    return (
      <LocationStatus
        isTracking={isTracking}
        currentLocation={currentLocation}
        error={error}
        isSupported={isSupported}
        isDriver={isDriver}
      />
    );
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Navigation className="h-5 w-5 text-blue-600" />
          <span>Live Location Tracking</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <LocationStatus
          isTracking={isTracking}
          currentLocation={currentLocation}
          error={error}
          isSupported={isSupported}
          isDriver={isDriver}
        />

        {isDriver ? (
          <div className="space-y-4">
            <RideControls
              ride={ride}
              onStartRide={handleStartRide}
              onCompleteRide={handleCompleteRide}
              onToggleLocationSharing={handleToggleLocationSharing}
            />
            <LocationDisplay
              ride={ride}
              currentLocation={currentLocation}
              isDriver={isDriver}
            />
          </div>
        ) : (
          <LocationDisplay
            ride={ride}
            currentLocation={currentLocation}
            isDriver={isDriver}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default LiveLocationTracker;

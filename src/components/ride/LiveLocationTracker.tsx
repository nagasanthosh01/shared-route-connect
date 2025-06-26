
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Navigation, Play, Square } from 'lucide-react';
import { useLocationTracking } from '@/hooks/useLocationTracking';
import { useRides } from '@/contexts/RideContext';
import { useToast } from '@/hooks/use-toast';
import { Ride } from '@/types/ride';

interface LiveLocationTrackerProps {
  ride: Ride;
  isDriver: boolean;
}

const LiveLocationTracker: React.FC<LiveLocationTrackerProps> = ({ ride, isDriver }) => {
  const { updateLiveLocation, startRide, completeRide, toggleLocationSharing } = useRides();
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

  if (!isSupported && isDriver) {
    return (
      <Card className="bg-yellow-50 border-yellow-200">
        <CardContent className="pt-6">
          <div className="flex items-center space-x-2 text-yellow-800">
            <MapPin className="h-5 w-5" />
            <span>Location tracking is not supported on this device</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error && isDriver) {
    return (
      <Card className="bg-red-50 border-red-200">
        <CardContent className="pt-6">
          <div className="flex items-center space-x-2 text-red-800">
            <MapPin className="h-5 w-5" />
            <span>Location Error: {error}</span>
          </div>
        </CardContent>
      </Card>
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
        {isDriver ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${isTracking ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
                <span className="text-sm font-medium">
                  {isTracking ? 'Location sharing active' : 'Location sharing inactive'}
                </span>
              </div>
              {currentLocation && (
                <div className="text-xs text-gray-600">
                  Accuracy: ~{Math.round(currentLocation.accuracy || 0)}m
                </div>
              )}
            </div>

            {ride.status === 'active' && (
              <Button 
                onClick={handleStartRide}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                <Play className="mr-2 h-4 w-4" />
                Start Ride & Enable Tracking
              </Button>
            )}

            {ride.status === 'in-progress' && (
              <div className="space-y-2">
                <Button 
                  onClick={handleToggleLocationSharing}
                  variant={ride.isLocationSharingEnabled ? "destructive" : "default"}
                  className="w-full"
                >
                  <MapPin className="mr-2 h-4 w-4" />
                  {ride.isLocationSharingEnabled ? 'Disable' : 'Enable'} Location Sharing
                </Button>
                <Button 
                  onClick={handleCompleteRide}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  <Square className="mr-2 h-4 w-4" />
                  Complete Ride
                </Button>
              </div>
            )}

            {currentLocation && (
              <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                <div>Lat: {currentLocation.latitude.toFixed(6)}</div>
                <div>Lng: {currentLocation.longitude.toFixed(6)}</div>
                <div>Updated: {currentLocation.timestamp.toLocaleTimeString()}</div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {ride.liveLocation ? (
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-green-600">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                  <span className="font-medium">Driver location is being shared</span>
                </div>
                <div className="bg-green-50 p-3 rounded-lg space-y-1">
                  <div className="text-sm text-green-800">
                    Last updated: {ride.liveLocation.timestamp.toLocaleTimeString()}
                  </div>
                  <div className="text-xs text-green-600">
                    Location accuracy: ~{Math.round(ride.liveLocation.accuracy || 0)}m
                  </div>
                </div>
                <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                  <div>Driver Lat: {ride.liveLocation.latitude.toFixed(6)}</div>
                  <div>Driver Lng: {ride.liveLocation.longitude.toFixed(6)}</div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2 text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>
                  {ride.status === 'in-progress' 
                    ? 'Driver location sharing is disabled' 
                    : 'Location sharing will be available when the ride starts'
                  }
                </span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LiveLocationTracker;

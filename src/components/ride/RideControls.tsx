
import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, Square, MapPin } from 'lucide-react';
import { Ride } from '@/types/ride';

interface RideControlsProps {
  ride: Ride;
  onStartRide: () => Promise<void>;
  onCompleteRide: () => Promise<void>;
  onToggleLocationSharing: () => Promise<void>;
}

const RideControls: React.FC<RideControlsProps> = ({
  ride,
  onStartRide,
  onCompleteRide,
  onToggleLocationSharing
}) => {
  return (
    <div className="space-y-4">
      {ride.status === 'active' && (
        <Button 
          onClick={onStartRide}
          className="w-full bg-green-600 hover:bg-green-700"
        >
          <Play className="mr-2 h-4 w-4" />
          Start Ride & Enable Tracking
        </Button>
      )}

      {ride.status === 'in-progress' && (
        <div className="space-y-2">
          <Button 
            onClick={onToggleLocationSharing}
            variant={ride.isLocationSharingEnabled ? "destructive" : "default"}
            className="w-full"
          >
            <MapPin className="mr-2 h-4 w-4" />
            {ride.isLocationSharingEnabled ? 'Disable' : 'Enable'} Location Sharing
          </Button>
          <Button 
            onClick={onCompleteRide}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            <Square className="mr-2 h-4 w-4" />
            Complete Ride
          </Button>
        </div>
      )}
    </div>
  );
};

export default RideControls;


import React from 'react';
import { MapPin } from 'lucide-react';
import { LiveLocation, Ride } from '@/types/ride';

interface LocationDisplayProps {
  ride: Ride;
  currentLocation: LiveLocation | null;
  isDriver: boolean;
}

const LocationDisplay: React.FC<LocationDisplayProps> = ({
  ride,
  currentLocation,
  isDriver
}) => {
  if (isDriver) {
    if (!currentLocation) return null;
    
    return (
      <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
        <div>Lat: {currentLocation.latitude.toFixed(6)}</div>
        <div>Lng: {currentLocation.longitude.toFixed(6)}</div>
        <div>Updated: {currentLocation.timestamp.toLocaleTimeString()}</div>
      </div>
    );
  }

  // For passengers
  return (
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
  );
};

export default LocationDisplay;


import React from 'react';
import { MapPin } from 'lucide-react';
import { LiveLocation } from '@/types/ride';

interface LocationStatusProps {
  isTracking: boolean;
  currentLocation: LiveLocation | null;
  error: string | null;
  isSupported: boolean;
  isDriver: boolean;
}

const LocationStatus: React.FC<LocationStatusProps> = ({
  isTracking,
  currentLocation,
  error,
  isSupported,
  isDriver
}) => {
  if (!isSupported && isDriver) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center space-x-2 text-yellow-800">
          <MapPin className="h-5 w-5" />
          <span>Location tracking is not supported on this device</span>
        </div>
      </div>
    );
  }

  if (error && isDriver) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center space-x-2 text-red-800">
          <MapPin className="h-5 w-5" />
          <span>Location Error: {error}</span>
        </div>
      </div>
    );
  }

  return (
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
  );
};

export default LocationStatus;

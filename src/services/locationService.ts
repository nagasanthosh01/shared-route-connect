
import { Ride, LiveLocation } from '@/types/ride';

export const updateRideLocation = (rides: Ride[], rideId: string, location: LiveLocation, userId: string): Ride[] => {
  return rides.map(ride => {
    if (ride.id === rideId && ride.driverId === userId) {
      return {
        ...ride,
        liveLocation: location,
        updatedAt: new Date()
      };
    }
    return ride;
  });
};

export const updateRideStatus = (rides: Ride[], rideId: string, status: Ride['status'], additionalData?: any): Ride[] => {
  return rides.map(ride => {
    if (ride.id === rideId) {
      return {
        ...ride,
        status,
        ...additionalData,
        updatedAt: new Date()
      };
    }
    return ride;
  });
};

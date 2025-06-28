
import { Ride } from '@/types/ride';

const STORAGE_KEY = 'shareride_rides';

export const saveRidesToStorage = (rides: Ride[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(rides));
};

export const loadRidesFromStorage = (): Ride[] => {
  const savedRides = localStorage.getItem(STORAGE_KEY);
  if (savedRides) {
    try {
      const ridesData = JSON.parse(savedRides);
      return ridesData.map((ride: any) => ({
        ...ride,
        departureDate: new Date(ride.departureDate),
        createdAt: new Date(ride.createdAt),
        updatedAt: new Date(ride.updatedAt),
        bookings: ride.bookings?.map((booking: any) => ({
          ...booking,
          createdAt: new Date(booking.createdAt)
        })) || []
      }));
    } catch (error) {
      console.error('Error parsing saved rides:', error);
      return [];
    }
  }
  return [];
};

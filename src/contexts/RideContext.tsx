
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Ride, CreateRideData } from '@/types/ride';
import { useAuth } from './AuthContext';

interface RideContextType {
  rides: Ride[];
  myRides: Ride[];
  isLoading: boolean;
  createRide: (rideData: CreateRideData) => Promise<void>;
  updateRide: (rideId: string, updateData: Partial<Ride>) => Promise<void>;
  cancelRide: (rideId: string) => Promise<void>;
  searchRides: (from: string, to: string, date?: Date) => Ride[];
  getRideById: (rideId: string) => Ride | undefined;
}

const RideContext = createContext<RideContextType | undefined>(undefined);

export const useRides = () => {
  const context = useContext(RideContext);
  if (context === undefined) {
    throw new Error('useRides must be used within a RideProvider');
  }
  return context;
};

export const RideProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [rides, setRides] = useState<Ride[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  // Load rides from localStorage on mount
  useEffect(() => {
    const savedRides = localStorage.getItem('shareride_rides');
    if (savedRides) {
      try {
        const ridesData = JSON.parse(savedRides);
        const parsedRides = ridesData.map((ride: any) => ({
          ...ride,
          departureDate: new Date(ride.departureDate),
          createdAt: new Date(ride.createdAt),
          updatedAt: new Date(ride.updatedAt)
        }));
        setRides(parsedRides);
      } catch (error) {
        console.error('Error parsing saved rides:', error);
      }
    }
  }, []);

  const myRides = rides.filter(ride => ride.driverId === user?.id);

  const createRide = async (rideData: CreateRideData): Promise<void> => {
    if (!user) throw new Error('User must be logged in to create a ride');
    
    setIsLoading(true);
    try {
      const newRide: Ride = {
        id: Date.now().toString(),
        driverId: user.id,
        driver: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          rating: 5.0,
          profileImage: user.profileImage
        },
        from: rideData.from,
        to: rideData.to,
        departureDate: rideData.departureDate,
        departureTime: rideData.departureTime,
        availableSeats: rideData.availableSeats,
        pricePerSeat: rideData.pricePerSeat,
        totalPrice: rideData.pricePerSeat * rideData.availableSeats,
        description: rideData.description,
        status: 'active',
        bookings: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const updatedRides = [...rides, newRide];
      setRides(updatedRides);
      localStorage.setItem('shareride_rides', JSON.stringify(updatedRides));
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateRide = async (rideId: string, updateData: Partial<Ride>): Promise<void> => {
    setIsLoading(true);
    try {
      const updatedRides = rides.map(ride => 
        ride.id === rideId 
          ? { ...ride, ...updateData, updatedAt: new Date() }
          : ride
      );
      setRides(updatedRides);
      localStorage.setItem('shareride_rides', JSON.stringify(updatedRides));
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const cancelRide = async (rideId: string): Promise<void> => {
    await updateRide(rideId, { status: 'cancelled' });
  };

  const searchRides = (from: string, to: string, date?: Date): Ride[] => {
    return rides.filter(ride => {
      const matchesRoute = ride.from.city.toLowerCase().includes(from.toLowerCase()) &&
                          ride.to.city.toLowerCase().includes(to.toLowerCase());
      const matchesDate = !date || 
        ride.departureDate.toDateString() === date.toDateString();
      const isActive = ride.status === 'active';
      const hasSeats = ride.availableSeats > ride.bookings.length;
      
      return matchesRoute && matchesDate && isActive && hasSeats;
    });
  };

  const getRideById = (rideId: string): Ride | undefined => {
    return rides.find(ride => ride.id === rideId);
  };

  const value = {
    rides,
    myRides,
    isLoading,
    createRide,
    updateRide,
    cancelRide,
    searchRides,
    getRideById
  };

  return <RideContext.Provider value={value}>{children}</RideContext.Provider>;
};

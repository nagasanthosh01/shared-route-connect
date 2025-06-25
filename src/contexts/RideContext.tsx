import React, { createContext, useContext, useState, useEffect } from 'react';
import { Ride, CreateRideData, Booking } from '@/types/ride';
import { useAuth } from './AuthContext';

interface RideContextType {
  rides: Ride[];
  myRides: Ride[];
  myBookings: Booking[];
  isLoading: boolean;
  createRide: (rideData: CreateRideData) => Promise<void>;
  updateRide: (rideId: string, updateData: Partial<Ride>) => Promise<void>;
  cancelRide: (rideId: string) => Promise<void>;
  searchRides: (from: string, to: string, date?: Date) => Ride[];
  getRideById: (rideId: string) => Ride | undefined;
  bookRide: (rideId: string, seatsToBook: number) => Promise<void>;
  cancelBooking: (bookingId: string) => Promise<void>;
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
          updatedAt: new Date(ride.updatedAt),
          bookings: ride.bookings?.map((booking: any) => ({
            ...booking,
            createdAt: new Date(booking.createdAt)
          })) || []
        }));
        setRides(parsedRides);
      } catch (error) {
        console.error('Error parsing saved rides:', error);
      }
    }
  }, []);

  const myRides = rides.filter(ride => ride.driverId === user?.id);
  const myBookings = rides.flatMap(ride => 
    ride.bookings?.filter(booking => booking.passengerId === user?.id) || []
  );

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
      const hasSeats = ride.availableSeats > (ride.bookings?.length || 0);
      
      return matchesRoute && matchesDate && isActive && hasSeats;
    });
  };

  const getRideById = (rideId: string): Ride | undefined => {
    return rides.find(ride => ride.id === rideId);
  };

  const bookRide = async (rideId: string, seatsToBook: number): Promise<void> => {
    if (!user) throw new Error('User must be logged in to book a ride');
    
    setIsLoading(true);
    try {
      const ride = rides.find(r => r.id === rideId);
      if (!ride) throw new Error('Ride not found');
      
      const currentBookings = ride.bookings?.length || 0;
      if (currentBookings + seatsToBook > ride.availableSeats) {
        throw new Error('Not enough seats available');
      }

      const newBooking: Booking = {
        id: Date.now().toString(),
        rideId: rideId,
        passengerId: user.id,
        passenger: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone
        },
        seatsBooked: seatsToBook,
        totalPrice: ride.pricePerSeat * seatsToBook,
        status: 'confirmed',
        createdAt: new Date()
      };

      const updatedRides = rides.map(r => {
        if (r.id === rideId) {
          const updatedBookings = [...(r.bookings || []), newBooking];
          return {
            ...r,
            bookings: updatedBookings,
            status: updatedBookings.length >= r.availableSeats ? 'full' as const : r.status,
            updatedAt: new Date()
          };
        }
        return r;
      });

      setRides(updatedRides);
      localStorage.setItem('shareride_rides', JSON.stringify(updatedRides));
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const cancelBooking = async (bookingId: string): Promise<void> => {
    if (!user) throw new Error('User must be logged in');
    
    setIsLoading(true);
    try {
      const updatedRides = rides.map(ride => {
        const updatedBookings = ride.bookings?.filter(booking => booking.id !== bookingId) || [];
        return {
          ...ride,
          bookings: updatedBookings,
          status: updatedBookings.length < ride.availableSeats ? 'active' as const : ride.status,
          updatedAt: new Date()
        };
      });

      setRides(updatedRides);
      localStorage.setItem('shareride_rides', JSON.stringify(updatedRides));
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    rides,
    myRides,
    myBookings,
    isLoading,
    createRide,
    updateRide,
    cancelRide,
    searchRides,
    getRideById,
    bookRide,
    cancelBooking
  };

  return <RideContext.Provider value={value}>{children}</RideContext.Provider>;
};

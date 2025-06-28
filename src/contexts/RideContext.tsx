
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Ride, CreateRideData, Booking, Message, LiveLocation } from '@/types/ride';
import { useAuth } from './AuthContext';
import { 
  createNewRide, 
  searchRides as searchRidesService, 
  getRideById as getRideByIdService 
} from '@/services/rideService';
import { 
  createBooking, 
  processBooking, 
  processCancelBooking 
} from '@/services/bookingService';
import { 
  createMessage, 
  canSendMessage, 
  addMessageToRide, 
  markMessagesAsRead as markMessagesAsReadService,
  getMessagesForRide as getMessagesForRideService
} from '@/services/messageService';
import { 
  updateRideLocation, 
  updateRideStatus 
} from '@/services/locationService';
import { 
  saveRidesToStorage, 
  loadRidesFromStorage 
} from '@/services/storageService';

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
  sendMessage: (rideId: string, content: string) => Promise<void>;
  getMessagesForRide: (rideId: string) => Message[];
  markMessagesAsRead: (rideId: string, userId: string) => Promise<void>;
  updateLiveLocation: (rideId: string, location: LiveLocation) => Promise<void>;
  startRide: (rideId: string) => Promise<void>;
  completeRide: (rideId: string) => Promise<void>;
  toggleLocationSharing: (rideId: string, enabled: boolean) => Promise<void>;
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
    const loadedRides = loadRidesFromStorage();
    setRides(loadedRides);
  }, []);

  const myRides = rides.filter(ride => ride.driverId === user?.id);
  const myBookings = rides.flatMap(ride => 
    ride.bookings?.filter(booking => booking.passengerId === user?.id) || []
  );

  const createRide = async (rideData: CreateRideData): Promise<void> => {
    if (!user) throw new Error('User must be logged in to create a ride');
    
    setIsLoading(true);
    try {
      const newRide = createNewRide(rideData, user.id, user);
      const updatedRides = [...rides, newRide];
      setRides(updatedRides);
      saveRidesToStorage(updatedRides);
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
      saveRidesToStorage(updatedRides);
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
    return searchRidesService(rides, from, to, date);
  };

  const getRideById = (rideId: string): Ride | undefined => {
    return getRideByIdService(rides, rideId);
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

      const newBooking = createBooking(rideId, seatsToBook, user, ride);
      const updatedRides = processBooking(rides, rideId, newBooking);
      
      setRides(updatedRides);
      saveRidesToStorage(updatedRides);
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
      const updatedRides = processCancelBooking(rides, bookingId);
      setRides(updatedRides);
      saveRidesToStorage(updatedRides);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (rideId: string, content: string): Promise<void> => {
    if (!user) throw new Error('User must be logged in to send messages');
    
    setIsLoading(true);
    try {
      const ride = rides.find(r => r.id === rideId);
      if (!ride) throw new Error('Ride not found');

      if (!canSendMessage(ride, user.id)) {
        throw new Error('You are not authorized to send messages for this ride');
      }

      const newMessage = createMessage(rideId, content, user);
      const updatedRides = addMessageToRide(rides, rideId, newMessage);
      
      setRides(updatedRides);
      saveRidesToStorage(updatedRides);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getMessagesForRide = (rideId: string): Message[] => {
    return getMessagesForRideService(rides, rideId);
  };

  const markMessagesAsRead = async (rideId: string, userId: string): Promise<void> => {
    setIsLoading(true);
    try {
      const updatedRides = markMessagesAsReadService(rides, rideId, userId);
      setRides(updatedRides);
      saveRidesToStorage(updatedRides);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateLiveLocation = async (rideId: string, location: LiveLocation): Promise<void> => {
    if (!user) throw new Error('User must be logged in');
    
    setIsLoading(true);
    try {
      const updatedRides = updateRideLocation(rides, rideId, location, user.id);
      setRides(updatedRides);
      saveRidesToStorage(updatedRides);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const startRide = async (rideId: string): Promise<void> => {
    if (!user) throw new Error('User must be logged in');
    
    const updatedRides = updateRideStatus(rides, rideId, 'in-progress', { 
      isLocationSharingEnabled: true 
    });
    setRides(updatedRides);
    saveRidesToStorage(updatedRides);
  };

  const completeRide = async (rideId: string): Promise<void> => {
    if (!user) throw new Error('User must be logged in');
    
    const updatedRides = updateRideStatus(rides, rideId, 'completed', { 
      isLocationSharingEnabled: false,
      liveLocation: undefined
    });
    setRides(updatedRides);
    saveRidesToStorage(updatedRides);
  };

  const toggleLocationSharing = async (rideId: string, enabled: boolean): Promise<void> => {
    if (!user) throw new Error('User must be logged in');
    
    await updateRide(rideId, { isLocationSharingEnabled: enabled });
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
    cancelBooking,
    sendMessage,
    getMessagesForRide,
    markMessagesAsRead,
    updateLiveLocation,
    startRide,
    completeRide,
    toggleLocationSharing
  };

  return <RideContext.Provider value={value}>{children}</RideContext.Provider>;
};

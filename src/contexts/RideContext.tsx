
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Ride, CreateRideData, SearchFilters, Message, Booking } from '@/types/ride';
import { useAuth } from './AuthContext';
import { createRide, searchRides, getDriverRides, getRideById } from '@/services/supabaseRideService';
import { useToast } from '@/hooks/use-toast';

interface RideContextType {
  rides: Ride[];
  myRides: Ride[];
  myBookings: Booking[];
  isLoading: boolean;
  createRide: (rideData: CreateRideData) => Promise<string>;
  searchRides: (filters: SearchFilters) => Promise<Ride[]>;
  getRideById: (rideId: string) => Ride | undefined;
  refreshMyRides: () => Promise<void>;
  bookRide: (rideId: string, seatsToBook: number) => Promise<void>;
  cancelBooking: (rideId: string, bookingId: string) => Promise<void>;
  cancelRide: (rideId: string) => Promise<void>;
  startRide: (rideId: string) => Promise<void>;
  completeRide: (rideId: string) => Promise<void>;
  toggleLocationSharing: (rideId: string, enabled: boolean) => Promise<void>;
  updateLiveLocation: (rideId: string, location: { latitude: number; longitude: number; accuracy?: number }) => Promise<void>;
  sendMessage: (rideId: string, content: string) => Promise<void>;
  getMessagesForRide: (rideId: string) => Message[];
  markMessagesAsRead: (rideId: string, userId: string) => Promise<void>;
}

const RideContext = createContext<RideContextType | undefined>(undefined);

export const useRide = () => {
  const context = useContext(RideContext);
  if (context === undefined) {
    throw new Error('useRide must be used within a RideProvider');
  }
  return context;
};

export const RideProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [rides, setRides] = useState<Ride[]>([]);
  const [myRides, setMyRides] = useState<Ride[]>([]);
  const [myBookings, setMyBookings] = useState<Booking[]>([]);
  const [allRides, setAllRides] = useState<Ride[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const refreshMyRides = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const driverRides = await getDriverRides();
      setMyRides(driverRides);
      setAllRides(prev => [...prev.filter(r => r.driverId !== user.id), ...driverRides]);
    } catch (error) {
      console.error('Error fetching rides:', error);
      toast({
        title: "Error",
        description: "Failed to fetch your rides",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      refreshMyRides();
    }
  }, [user]);

  const handleCreateRide = async (rideData: CreateRideData): Promise<string> => {
    try {
      setIsLoading(true);
      const ride = await createRide(rideData);
      await refreshMyRides();
      toast({
        title: "Ride created!",
        description: "Your ride has been successfully created.",
      });
      return ride.id;
    } catch (error) {
      console.error('Error creating ride:', error);
      toast({
        title: "Error",
        description: "Failed to create ride. Please try again.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchRides = async (filters: SearchFilters): Promise<Ride[]> => {
    try {
      setIsLoading(true);
      const foundRides = await searchRides(filters);
      setRides(foundRides);
      setAllRides(prev => {
        const existing = prev.filter(r => !foundRides.find(fr => fr.id === r.id));
        return [...existing, ...foundRides];
      });
      return foundRides;
    } catch (error) {
      console.error('Error searching rides:', error);
      toast({
        title: "Error",
        description: "Failed to search rides. Please try again.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getRideByIdSync = (rideId: string): Ride | undefined => {
    return allRides.find(ride => ride.id === rideId);
  };

  // Placeholder implementations for remaining functions
  const bookRide = async (rideId: string, seatsToBook: number): Promise<void> => {
    console.log('Booking ride:', rideId, seatsToBook);
    // Will implement with Supabase later
  };

  const cancelBooking = async (rideId: string, bookingId: string): Promise<void> => {
    console.log('Cancelling booking:', rideId, bookingId);
    // Will implement with Supabase later
  };

  const cancelRide = async (rideId: string): Promise<void> => {
    console.log('Cancelling ride:', rideId);
    // Will implement with Supabase later
  };

  const startRide = async (rideId: string): Promise<void> => {
    console.log('Starting ride:', rideId);
    // Will implement with Supabase later
  };

  const completeRide = async (rideId: string): Promise<void> => {
    console.log('Completing ride:', rideId);
    // Will implement with Supabase later
  };

  const toggleLocationSharing = async (rideId: string, enabled: boolean): Promise<void> => {
    console.log('Toggling location sharing:', rideId, enabled);
    // Will implement with Supabase later
  };

  const updateLiveLocation = async (rideId: string, location: { latitude: number; longitude: number; accuracy?: number }): Promise<void> => {
    console.log('Updating live location:', rideId, location);
    // Will implement with Supabase later
  };

  const sendMessage = async (rideId: string, content: string): Promise<void> => {
    console.log('Sending message:', rideId, content);
    // Will implement with Supabase later
  };

  const getMessagesForRide = (rideId: string): Message[] => {
    const ride = getRideByIdSync(rideId);
    return ride?.messages || [];
  };

  const markMessagesAsRead = async (rideId: string, userId: string): Promise<void> => {
    console.log('Marking messages as read:', rideId, userId);
    // Will implement with Supabase later
  };

  const value = {
    rides,
    myRides,
    myBookings,
    isLoading,
    createRide: handleCreateRide,
    searchRides: handleSearchRides,
    getRideById: getRideByIdSync,
    refreshMyRides,
    bookRide,
    cancelBooking,
    cancelRide,
    startRide,
    completeRide,
    toggleLocationSharing,
    updateLiveLocation,
    sendMessage,
    getMessagesForRide,
    markMessagesAsRead
  };

  return <RideContext.Provider value={value}>{children}</RideContext.Provider>;
};

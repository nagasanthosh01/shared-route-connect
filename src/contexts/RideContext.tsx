import React, { createContext, useContext, useState, useEffect } from 'react';
import { Ride, CreateRideData, SearchFilters } from '@/types/ride';
import { useAuth } from './AuthContext';
import { createRide, searchRides, getDriverRides, getRideById } from '@/services/supabaseRideService';
import { useToast } from '@/hooks/use-toast';

interface RideContextType {
  rides: Ride[];
  myRides: Ride[];
  isLoading: boolean;
  createRide: (rideData: CreateRideData) => Promise<string>;
  searchRides: (filters: SearchFilters) => Promise<Ride[]>;
  getRideById: (rideId: string) => Promise<Ride>;
  refreshMyRides: () => Promise<void>;
  bookRide: (rideId: string, seatsToBook: number) => Promise<void>;
  cancelBooking: (rideId: string, bookingId: string) => Promise<void>;
  startRide: (rideId: string) => Promise<void>;
  completeRide: (rideId: string) => Promise<void>;
  toggleLocationSharing: (rideId: string) => Promise<void>;
  updateLiveLocation: (rideId: string, latitude: number, longitude: number, accuracy?: number) => Promise<void>;
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
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const refreshMyRides = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const driverRides = await getDriverRides();
      setMyRides(driverRides);
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

  // Placeholder implementations for remaining functions
  const bookRide = async (rideId: string, seatsToBook: number): Promise<void> => {
    // Will implement with Supabase later
    console.log('Booking ride:', rideId, seatsToBook);
  };

  const cancelBooking = async (rideId: string, bookingId: string): Promise<void> => {
    // Will implement with Supabase later
    console.log('Cancelling booking:', rideId, bookingId);
  };

  const startRide = async (rideId: string): Promise<void> => {
    // Will implement with Supabase later
    console.log('Starting ride:', rideId);
  };

  const completeRide = async (rideId: string): Promise<void> => {
    // Will implement with Supabase later
    console.log('Completing ride:', rideId);
  };

  const toggleLocationSharing = async (rideId: string): Promise<void> => {
    // Will implement with Supabase later
    console.log('Toggling location sharing:', rideId);
  };

  const updateLiveLocation = async (rideId: string, latitude: number, longitude: number, accuracy?: number): Promise<void> => {
    // Will implement with Supabase later
    console.log('Updating live location:', rideId, latitude, longitude);
  };

  const value = {
    rides,
    myRides,
    isLoading,
    createRide: handleCreateRide,
    searchRides: handleSearchRides,
    getRideById,
    refreshMyRides,
    bookRide,
    cancelBooking,
    startRide,
    completeRide,
    toggleLocationSharing,
    updateLiveLocation
  };

  return <RideContext.Provider value={value}>{children}</RideContext.Provider>;
};

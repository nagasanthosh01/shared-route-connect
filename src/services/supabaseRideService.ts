
import { supabase } from '@/integrations/supabase/client';
import { Ride, CreateRideData, SearchFilters } from '@/types/ride';

export const createRide = async (rideData: CreateRideData): Promise<Ride> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('rides')
    .insert({
      driver_id: user.id,
      from_address: rideData.from.address,
      from_city: rideData.from.city,
      from_country: rideData.from.country,
      from_latitude: rideData.from.latitude,
      from_longitude: rideData.from.longitude,
      to_address: rideData.to.address,
      to_city: rideData.to.city,
      to_country: rideData.to.country,
      to_latitude: rideData.to.latitude,
      to_longitude: rideData.to.longitude,
      departure_date: rideData.departureDate.toISOString().split('T')[0],
      departure_time: rideData.departureTime,
      available_seats: rideData.availableSeats,
      price_per_seat: rideData.pricePerSeat,
      total_price: rideData.pricePerSeat * rideData.availableSeats,
      description: rideData.description
    })
    .select('*')
    .single();

  if (error) throw error;

  // Fetch driver profile separately
  const { data: driverProfile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (profileError) throw profileError;

  return mapSupabaseRideToRide(data, driverProfile);
};

export const searchRides = async (filters: SearchFilters): Promise<Ride[]> => {
  let query = supabase
    .from('rides')
    .select('*')
    .eq('status', 'active')
    .gte('departure_date', new Date().toISOString().split('T')[0]);

  if (filters.from) {
    query = query.ilike('from_address', `%${filters.from}%`);
  }

  if (filters.to) {
    query = query.ilike('to_address', `%${filters.to}%`);
  }

  if (filters.date) {
    query = query.eq('departure_date', filters.date.toISOString().split('T')[0]);
  }

  if (filters.minPrice) {
    query = query.gte('price_per_seat', filters.minPrice);
  }

  if (filters.maxPrice) {
    query = query.lte('price_per_seat', filters.maxPrice);
  }

  if (filters.availableSeats) {
    query = query.gte('available_seats', filters.availableSeats);
  }

  const { data: rides, error } = await query;

  if (error) throw error;

  // Fetch all driver profiles
  const driverIds = rides.map(ride => ride.driver_id);
  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('*')
    .in('id', driverIds);

  if (profilesError) throw profilesError;

  // Fetch all bookings for these rides
  const rideIds = rides.map(ride => ride.id);
  const { data: bookings, error: bookingsError } = await supabase
    .from('bookings')
    .select('*')
    .in('ride_id', rideIds);

  if (bookingsError) throw bookingsError;

  return rides.map(ride => {
    const driverProfile = profiles.find(p => p.id === ride.driver_id);
    const rideBookings = bookings.filter(b => b.ride_id === ride.id);
    return mapSupabaseRideToRide(ride, driverProfile, rideBookings);
  });
};

export const getDriverRides = async (): Promise<Ride[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data: rides, error } = await supabase
    .from('rides')
    .select('*')
    .eq('driver_id', user.id)
    .order('departure_date', { ascending: true });

  if (error) throw error;

  // Fetch driver profile
  const { data: driverProfile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (profileError) throw profileError;

  // Fetch all bookings for these rides
  const rideIds = rides.map(ride => ride.id);
  const { data: bookings, error: bookingsError } = await supabase
    .from('bookings')
    .select('*')
    .in('ride_id', rideIds);

  if (bookingsError) throw bookingsError;

  return rides.map(ride => {
    const rideBookings = bookings.filter(b => b.ride_id === ride.id);
    return mapSupabaseRideToRide(ride, driverProfile, rideBookings);
  });
};

export const getRideById = async (rideId: string): Promise<Ride> => {
  const { data: ride, error } = await supabase
    .from('rides')
    .select('*')
    .eq('id', rideId)
    .single();

  if (error) throw error;

  // Fetch driver profile
  const { data: driverProfile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', ride.driver_id)
    .single();

  if (profileError) throw profileError;

  // Fetch bookings for this ride
  const { data: bookings, error: bookingsError } = await supabase
    .from('bookings')
    .select('*')
    .eq('ride_id', rideId);

  if (bookingsError) throw bookingsError;

  // Fetch messages for this ride
  const { data: messages, error: messagesError } = await supabase
    .from('messages')
    .select('*')
    .eq('ride_id', rideId)
    .order('created_at', { ascending: true });

  if (messagesError) throw messagesError;

  return mapSupabaseRideToRide(ride, driverProfile, bookings, messages);
};

const mapSupabaseRideToRide = (data: any, driverProfile: any, bookings: any[] = [], messages: any[] = []): Ride => {
  return {
    id: data.id,
    driverId: data.driver_id,
    driver: {
      id: driverProfile.id,
      firstName: driverProfile.first_name,
      lastName: driverProfile.last_name,
      rating: 5.0, // Default rating
      profileImage: driverProfile.profile_image,
      phone: driverProfile.phone
    },
    from: {
      address: data.from_address,
      city: data.from_city,
      country: data.from_country,
      latitude: data.from_latitude,
      longitude: data.from_longitude
    },
    to: {
      address: data.to_address,
      city: data.to_city,
      country: data.to_country,
      latitude: data.to_latitude,
      longitude: data.to_longitude
    },
    departureDate: new Date(data.departure_date),
    departureTime: data.departure_time,
    availableSeats: data.available_seats,
    pricePerSeat: data.price_per_seat,
    totalPrice: data.total_price,
    description: data.description,
    status: data.status,
    bookings: bookings.map((booking: any) => ({
      id: booking.id,
      rideId: data.id,
      passengerId: booking.passenger_id,
      passenger: {
        id: booking.passenger_id,
        firstName: 'Unknown', // Will need to fetch separately if needed
        lastName: 'User',
        phone: ''
      },
      seatsBooked: booking.seats_booked,
      totalPrice: booking.total_price,
      status: booking.status,
      createdAt: new Date(booking.created_at)
    })),
    messages: messages.map((message: any) => ({
      id: message.id,
      rideId: data.id,
      senderId: message.sender_id,
      senderName: 'Unknown User', // Will need to fetch separately if needed
      senderRole: message.sender_role,
      content: message.content,
      timestamp: new Date(message.created_at),
      read: message.is_read
    })),
    liveLocation: data.live_location_latitude && data.live_location_longitude ? {
      latitude: data.live_location_latitude,
      longitude: data.live_location_longitude,
      timestamp: new Date(data.live_location_timestamp),
      accuracy: data.live_location_accuracy
    } : undefined,
    isLocationSharingEnabled: data.is_location_sharing_enabled,
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at)
  };
};

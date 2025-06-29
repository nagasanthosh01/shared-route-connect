
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
    .select(`
      *,
      profiles!rides_driver_id_fkey (
        id,
        first_name,
        last_name,
        phone,
        profile_image
      )
    `)
    .single();

  if (error) throw error;

  return mapSupabaseRideToRide(data);
};

export const searchRides = async (filters: SearchFilters): Promise<Ride[]> => {
  let query = supabase
    .from('rides')
    .select(`
      *,
      profiles!rides_driver_id_fkey (
        id,
        first_name,
        last_name,
        phone,
        profile_image
      ),
      bookings (
        id,
        passenger_id,
        seats_booked,
        total_price,
        status,
        created_at,
        profiles!bookings_passenger_id_fkey (
          id,
          first_name,
          last_name,
          phone
        )
      )
    `)
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

  const { data, error } = await query;

  if (error) throw error;

  return data.map(mapSupabaseRideToRide);
};

export const getDriverRides = async (): Promise<Ride[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('rides')
    .select(`
      *,
      profiles!rides_driver_id_fkey (
        id,
        first_name,
        last_name,
        phone,
        profile_image
      ),
      bookings (
        id,
        passenger_id,
        seats_booked,
        total_price,
        status,
        created_at,
        profiles!bookings_passenger_id_fkey (
          id,
          first_name,
          last_name,
          phone
        )
      )
    `)
    .eq('driver_id', user.id)
    .order('departure_date', { ascending: true });

  if (error) throw error;

  return data.map(mapSupabaseRideToRide);
};

export const getRideById = async (rideId: string): Promise<Ride> => {
  const { data, error } = await supabase
    .from('rides')
    .select(`
      *,
      profiles!rides_driver_id_fkey (
        id,
        first_name,
        last_name,
        phone,
        profile_image
      ),
      bookings (
        id,
        passenger_id,
        seats_booked,
        total_price,
        status,
        created_at,
        profiles!bookings_passenger_id_fkey (
          id,
          first_name,
          last_name,
          phone
        )
      ),
      messages (
        id,
        sender_id,
        content,
        sender_role,
        is_read,
        created_at,
        profiles!messages_sender_id_fkey (
          first_name,
          last_name
        )
      )
    `)
    .eq('id', rideId)
    .single();

  if (error) throw error;

  return mapSupabaseRideToRide(data);
};

const mapSupabaseRideToRide = (data: any): Ride => {
  return {
    id: data.id,
    driverId: data.driver_id,
    driver: {
      id: data.profiles.id,
      firstName: data.profiles.first_name,
      lastName: data.profiles.last_name,
      rating: 5.0, // Default rating
      profileImage: data.profiles.profile_image,
      phone: data.profiles.phone
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
    bookings: data.bookings?.map((booking: any) => ({
      id: booking.id,
      rideId: data.id,
      passengerId: booking.passenger_id,
      passenger: {
        id: booking.profiles.id,
        firstName: booking.profiles.first_name,
        lastName: booking.profiles.last_name,
        phone: booking.profiles.phone
      },
      seatsBooked: booking.seats_booked,
      totalPrice: booking.total_price,
      status: booking.status,
      createdAt: new Date(booking.created_at)
    })) || [],
    messages: data.messages?.map((message: any) => ({
      id: message.id,
      rideId: data.id,
      senderId: message.sender_id,
      senderName: `${message.profiles.first_name} ${message.profiles.last_name}`,
      senderRole: message.sender_role,
      content: message.content,
      timestamp: new Date(message.created_at),
      read: message.is_read
    })) || [],
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

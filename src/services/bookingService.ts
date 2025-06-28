
import { Ride, Booking } from '@/types/ride';

export const createBooking = (rideId: string, seatsToBook: number, user: any, ride: Ride): Booking => {
  return {
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
};

export const processBooking = (rides: Ride[], rideId: string, newBooking: Booking): Ride[] => {
  return rides.map(r => {
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
};

export const processCancelBooking = (rides: Ride[], bookingId: string): Ride[] => {
  return rides.map(ride => {
    const updatedBookings = ride.bookings?.filter(booking => booking.id !== bookingId) || [];
    return {
      ...ride,
      bookings: updatedBookings,
      status: updatedBookings.length < ride.availableSeats ? 'active' as const : ride.status,
      updatedAt: new Date()
    };
  });
};

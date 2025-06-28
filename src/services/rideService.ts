
import { Ride, CreateRideData } from '@/types/ride';

export const createNewRide = (rideData: CreateRideData, userId: string, user: any): Ride => {
  return {
    id: Date.now().toString(),
    driverId: userId,
    driver: {
      id: userId,
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
    messages: [],
    createdAt: new Date(),
    updatedAt: new Date()
  };
};

export const searchRides = (rides: Ride[], from: string, to: string, date?: Date): Ride[] => {
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

export const getRideById = (rides: Ride[], rideId: string): Ride | undefined => {
  return rides.find(ride => ride.id === rideId);
};

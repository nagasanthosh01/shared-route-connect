
import { User, Ride, Booking } from '@/types/ride';

export const mockUser: User = {
  id: 'test-user-id',
  email: 'test@example.com',
  firstName: 'John',
  lastName: 'Doe',
  role: 'passenger',
  phone: '1234567890',
  createdAt: new Date('2023-01-01'),
};

export const mockDriver: User = {
  id: 'driver-id',
  email: 'driver@example.com',
  firstName: 'Jane',
  lastName: 'Driver',
  role: 'driver',
  phone: '0987654321',
  createdAt: new Date('2023-01-01'),
};

export const mockRide: Ride = {
  id: 'ride-1',
  driverId: 'driver-id',
  driver: mockDriver,
  fromCity: 'San Francisco',
  toCity: 'Los Angeles',
  fromAddress: '123 Main St, San Francisco, CA',
  toAddress: '456 Oak Ave, Los Angeles, CA',
  departureDate: '2024-01-15',
  departureTime: '09:00',
  availableSeats: 3,
  pricePerSeat: 50,
  totalPrice: 200,
  status: 'active',
  description: 'Comfortable ride with AC',
  createdAt: new Date('2023-01-01'),
  bookings: [],
  isLocationSharingEnabled: false,
};

export const mockBooking: Booking = {
  id: 'booking-1',
  rideId: 'ride-1',
  passengerId: 'test-user-id',
  passenger: mockUser,
  seatsBooked: 1,
  totalPrice: 50,
  status: 'confirmed',
  createdAt: new Date('2023-01-01'),
};

export const mockRideWithBooking: Ride = {
  ...mockRide,
  bookings: [mockBooking],
  availableSeats: 2,
};

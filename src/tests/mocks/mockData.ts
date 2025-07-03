
import { Ride, Booking } from '@/types/ride';

export const mockUser = {
  id: 'test-user-id',
  email: 'test@example.com',
  firstName: 'John',
  lastName: 'Doe',
  role: 'passenger' as const,
  phone: '1234567890',
  createdAt: new Date('2023-01-01'),
};

export const mockDriver = {
  id: 'driver-id',
  email: 'driver@example.com',
  firstName: 'Jane',
  lastName: 'Driver',
  role: 'driver' as const,
  phone: '0987654321',
  createdAt: new Date('2023-01-01'),
};

export const mockRide: Ride = {
  id: 'ride-1',
  driverId: 'driver-id',
  driver: {
    id: 'driver-id',
    firstName: 'Jane',
    lastName: 'Driver',
    rating: 4.8,
    phone: '0987654321',
  },
  from: {
    address: '123 Main St, San Francisco, CA',
    city: 'San Francisco',
    country: 'USA',
  },
  to: {
    address: '456 Oak Ave, Los Angeles, CA',
    city: 'Los Angeles',
    country: 'USA',
  },
  departureDate: new Date('2024-01-15'),
  departureTime: '09:00',
  availableSeats: 3,
  pricePerSeat: 50,
  totalPrice: 200,
  status: 'active',
  description: 'Comfortable ride with AC',
  createdAt: new Date('2023-01-01'),
  updatedAt: new Date('2023-01-01'),
  bookings: [],
  messages: [],
  isLocationSharingEnabled: false,
};

export const mockBooking: Booking = {
  id: 'booking-1',
  rideId: 'ride-1',
  passengerId: 'test-user-id',
  passenger: {
    id: 'test-user-id',
    firstName: 'John',
    lastName: 'Doe',
    phone: '1234567890',
  },
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


export interface Location {
  address: string;
  latitude?: number;
  longitude?: number;
  city: string;
  country: string;
}

export interface Booking {
  id: string;
  rideId: string;
  passengerId: string;
  passenger: {
    id: string;
    firstName: string;
    lastName: string;
    phone?: string;
  };
  seatsBooked: number;
  totalPrice: number;
  status: 'confirmed' | 'cancelled';
  createdAt: Date;
}

export interface Ride {
  id: string;
  driverId: string;
  driver: {
    id: string;
    firstName: string;
    lastName: string;
    rating: number;
    profileImage?: string;
  };
  from: Location;
  to: Location;
  departureDate: Date;
  departureTime: string;
  availableSeats: number;
  pricePerSeat: number;
  totalPrice: number;
  description?: string;
  status: 'active' | 'full' | 'completed' | 'cancelled';
  bookings: Booking[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateRideData {
  from: Location;
  to: Location;
  departureDate: Date;
  departureTime: string;
  availableSeats: number;
  pricePerSeat: number;
  description?: string;
}

export interface SearchFilters {
  from: string;
  to: string;
  date?: Date;
  minPrice?: number;
  maxPrice?: number;
  availableSeats?: number;
}

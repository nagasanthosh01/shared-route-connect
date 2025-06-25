
export interface Location {
  address: string;
  latitude?: number;
  longitude?: number;
  city: string;
  country: string;
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
  bookings: string[]; // Array of passenger IDs
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

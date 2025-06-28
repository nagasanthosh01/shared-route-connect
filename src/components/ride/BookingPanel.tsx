
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard } from 'lucide-react';
import { Ride, Booking } from '@/types/ride';

interface BookingPanelProps {
  ride: Ride;
  userBooking?: Booking;
  isDriver: boolean;
  availableSeats: number;
  isLoading: boolean;
  onBookRide: (seatsToBook: number, totalPrice: number) => void;
}

const BookingPanel: React.FC<BookingPanelProps> = ({
  ride,
  userBooking,
  isDriver,
  availableSeats,
  isLoading,
  onBookRide
}) => {
  const [seatsToBook, setSeatsToBook] = useState(1);
  const [isBooking, setIsBooking] = useState(false);
  const totalPrice = ride.pricePerSeat * seatsToBook;
  const hasBooking = !!userBooking;

  const handleBookRide = async () => {
    setIsBooking(true);
    onBookRide(seatsToBook, totalPrice);
    setIsBooking(false);
  };

  if (hasBooking || isDriver) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl sticky top-8">
        <CardHeader>
          <CardTitle className="text-center">
            {hasBooking ? 'Booking Confirmed' : 'Your Ride'}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          {hasBooking && (
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-green-800 font-semibold">
                ✓ You have booked {userBooking.seatsBooked} seat{userBooking.seatsBooked !== 1 ? 's' : ''}
              </div>
              <div className="text-green-600">
                Total paid: ${userBooking.totalPrice}
              </div>
            </div>
          )}
          {isDriver && (
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-blue-800 font-semibold">
                This is your ride
              </div>
              <div className="text-blue-600">
                {ride.bookings?.length || 0} passenger{(ride.bookings?.length || 0) !== 1 ? 's' : ''} booked
              </div>
            </div>
          )}
          <p className="text-sm text-gray-600">
            Use the messaging system below to communicate with {hasBooking ? 'the driver' : 'passengers'}.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl sticky top-8">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Book This Ride</span>
          <div className="text-right">
            <div className="text-2xl font-bold text-green-600">
              ${ride.pricePerSeat}
            </div>
            <div className="text-sm text-gray-600">per seat</div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="seats">Number of Seats</Label>
          <Input
            id="seats"
            type="number"
            min="1"
            max={availableSeats}
            value={seatsToBook}
            onChange={(e) => setSeatsToBook(parseInt(e.target.value) || 1)}
            className="text-lg text-center"
          />
          <p className="text-sm text-gray-600">
            Maximum {availableSeats} seat{availableSeats !== 1 ? 's' : ''} available
          </p>
        </div>

        <div className="border-t pt-4">
          <div className="flex justify-between items-center mb-2">
            <span>Price per seat:</span>
            <span>${ride.pricePerSeat}</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span>Number of seats:</span>
            <span>{seatsToBook}</span>
          </div>
          <div className="flex justify-between items-center text-lg font-bold border-t pt-2">
            <span>Total:</span>
            <span className="text-green-600">${totalPrice}</span>
          </div>
        </div>

        <Button 
          onClick={handleBookRide}
          disabled={isBooking || isLoading || availableSeats === 0}
          className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
        >
          {isBooking ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Processing...
            </div>
          ) : availableSeats === 0 ? (
            'Ride Full'
          ) : (
            <div className="flex items-center">
              <CreditCard className="h-4 w-4 mr-2" />
              Book & Pay ${totalPrice}
            </div>
          )}
        </Button>

        <div className="text-xs text-gray-600 text-center">
          Secure payment • You'll be able to contact the driver after booking
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingPanel;

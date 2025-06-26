
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Phone, User, Shield } from 'lucide-react';
import { Ride } from '@/types/ride';
import { useAuth } from '@/contexts/AuthContext';

interface ContactInfoProps {
  ride: Ride;
}

const ContactInfo: React.FC<ContactInfoProps> = ({ ride }) => {
  const { user } = useAuth();

  // Check if user has a confirmed booking for this ride
  const userBooking = ride.bookings?.find(booking => 
    booking.passengerId === user?.id && booking.status === 'confirmed'
  );
  
  const isDriver = ride.driverId === user?.id;
  const hasConfirmedBooking = !!userBooking;

  // Only show contact info if user is the driver or has a confirmed booking
  if (!isDriver && !hasConfirmedBooking) {
    return null;
  }

  const handleCallDriver = () => {
    if (ride.driver.phone) {
      window.location.href = `tel:${ride.driver.phone}`;
    }
  };

  const handleCallPassenger = (phone?: string) => {
    if (phone) {
      window.location.href = `tel:${phone}`;
    }
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Shield className="h-5 w-5 text-green-600" />
          <span>Contact Information</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Driver Contact (shown to passengers) */}
        {!isDriver && hasConfirmedBooking && (
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-green-600 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">
                    {ride.driver.firstName} {ride.driver.lastName}
                  </div>
                  <div className="text-sm text-gray-600">Driver</div>
                  {ride.driver.phone && (
                    <div className="text-sm text-blue-600">{ride.driver.phone}</div>
                  )}
                </div>
              </div>
              {ride.driver.phone && (
                <Button
                  onClick={handleCallDriver}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Call
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Passengers Contact (shown to driver) */}
        {isDriver && ride.bookings && ride.bookings.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Passengers</h4>
            {ride.bookings
              .filter(booking => booking.status === 'confirmed')
              .map((booking) => (
                <div key={booking.id} className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">
                          {booking.passenger.firstName[0]}{booking.passenger.lastName[0]}
                        </span>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">
                          {booking.passenger.firstName} {booking.passenger.lastName}
                        </div>
                        <div className="text-sm text-gray-600">
                          {booking.seatsBooked} seat{booking.seatsBooked !== 1 ? 's' : ''}
                        </div>
                        {booking.passenger.phone && (
                          <div className="text-sm text-green-600">{booking.passenger.phone}</div>
                        )}
                      </div>
                    </div>
                    {booking.passenger.phone && (
                      <Button
                        onClick={() => handleCallPassenger(booking.passenger.phone)}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Phone className="h-4 w-4 mr-2" />
                        Call
                      </Button>
                    )}
                  </div>
                </div>
              ))}
          </div>
        )}

        <div className="text-xs text-gray-600 bg-yellow-50 p-3 rounded-lg">
          <Shield className="h-4 w-4 inline mr-1" />
          Contact information is only shared after booking confirmation for safety and privacy.
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactInfo;

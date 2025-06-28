
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Clock, Users } from 'lucide-react';
import { Ride } from '@/types/ride';

interface RideDetailsCardProps {
  ride: Ride;
}

const RideDetailsCard: React.FC<RideDetailsCardProps> = ({ ride }) => {
  const availableSeats = ride.availableSeats - (ride.bookings?.length || 0);

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
      <CardHeader>
        <div className="flex items-center space-x-2 mb-2">
          <MapPin className="h-6 w-6 text-blue-600" />
          <CardTitle className="text-2xl">
            {ride.from.city} → {ride.to.city}
          </CardTitle>
        </div>
        <CardDescription className="text-lg">
          {ride.from.address} → {ride.to.address}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-6">
          <div className="flex items-center space-x-3">
            <Clock className="h-5 w-5 text-green-600" />
            <div>
              <div className="font-medium">
                {ride.departureDate.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
              <div className="text-gray-600">{ride.departureTime}</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Users className="h-5 w-5 text-purple-600" />
            <div>
              <div className="font-medium">{availableSeats} seats available</div>
              <div className="text-gray-600">out of {ride.availableSeats} total</div>
            </div>
          </div>
        </div>
        
        {ride.description && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-2">Additional Information</h4>
            <p className="text-gray-700">{ride.description}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RideDetailsCard;


import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Navigation, ArrowLeft, MapPin, Clock, Users, DollarSign, Edit, X } from 'lucide-react';
import { useRides } from '@/contexts/RideContext';
import { useToast } from '@/hooks/use-toast';

const MyRides = () => {
  const { myRides, cancelRide } = useRides();
  const { toast } = useToast();

  const handleCancelRide = async (rideId: string) => {
    try {
      await cancelRide(rideId);
      toast({
        title: "Ride cancelled",
        description: "Your ride has been cancelled successfully.",
      });
    } catch (error) {
      toast({
        title: "Failed to cancel ride",
        description: "An error occurred while cancelling the ride",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'full': return 'text-blue-600 bg-blue-100';
      case 'completed': return 'text-gray-600 bg-gray-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <header className="bg-white/80 backdrop-blur-md border-b border-blue-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-green-600 rounded-xl flex items-center justify-center">
                <Navigation className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                ShareRide
              </span>
            </div>
            
            <Link to="/dashboard">
              <Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">My Rides</h1>
              <p className="text-gray-600">
                Manage your created rides and track bookings
              </p>
            </div>
            <Link to="/create-ride">
              <Button className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
                Create New Ride
              </Button>
            </Link>
          </div>

          {myRides.length === 0 ? (
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg text-center py-12">
              <CardContent>
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No rides created yet</h3>
                <p className="text-gray-600 mb-6">
                  Start by creating your first ride and help others reach their destination
                </p>
                <Link to="/create-ride">
                  <Button className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
                    Create Your First Ride
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {myRides.map((ride) => (
                <Card key={ride.id} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <MapPin className="h-5 w-5 text-blue-600" />
                          <CardTitle className="text-lg">
                            {ride.from.city} → {ride.to.city}
                          </CardTitle>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ride.status)}`}>
                            {ride.status.charAt(0).toUpperCase() + ride.status.slice(1)}
                          </span>
                        </div>
                        <CardDescription>
                          {ride.from.address} → {ride.to.address}
                        </CardDescription>
                      </div>
                      
                      {ride.status === 'active' && (
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" className="border-blue-200 text-blue-600">
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="border-red-200 text-red-600 hover:bg-red-50"
                            onClick={() => handleCancelRide(ride.id)}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Cancel
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-green-600" />
                        <div>
                          <div className="text-sm font-medium">
                            {ride.departureDate.toLocaleDateString()}
                          </div>
                          <div className="text-sm text-gray-600">{ride.departureTime}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-purple-600" />
                        <div>
                          <div className="text-sm font-medium">
                            {ride.availableSeats - ride.bookings.length} / {ride.availableSeats}
                          </div>
                          <div className="text-sm text-gray-600">Seats available</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <div>
                          <div className="text-sm font-medium">${ride.pricePerSeat}</div>
                          <div className="text-sm text-gray-600">Per seat</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-4 w-4 text-blue-600" />
                        <div>
                          <div className="text-sm font-medium">
                            ${ride.bookings.length * ride.pricePerSeat}
                          </div>
                          <div className="text-sm text-gray-600">Earned</div>
                        </div>
                      </div>
                    </div>
                    
                    {ride.description && (
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-700">{ride.description}</p>
                      </div>
                    )}
                    
                    {ride.bookings.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">
                          Passengers ({ride.bookings.length})
                        </h4>
                        <div className="text-sm text-gray-600">
                          {ride.bookings.length} passenger{ride.bookings.length !== 1 ? 's' : ''} booked
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default MyRides;

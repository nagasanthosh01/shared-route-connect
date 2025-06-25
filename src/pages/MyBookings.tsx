
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Navigation, ArrowLeft, MapPin, Clock, Users, DollarSign, X, Phone } from 'lucide-react';
import { useRides } from '@/contexts/RideContext';
import { useToast } from '@/hooks/use-toast';

const MyBookings = () => {
  const { myBookings, cancelBooking } = useRides();
  const { toast } = useToast();

  const handleCancelBooking = async (bookingId: string) => {
    try {
      await cancelBooking(bookingId);
      toast({
        title: "Booking cancelled",
        description: "Your booking has been cancelled successfully.",
      });
    } catch (error) {
      toast({
        title: "Failed to cancel booking",
        description: "An error occurred while cancelling the booking",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'text-green-600 bg-green-100';
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
              <h1 className="text-3xl font-bold mb-2">My Bookings</h1>
              <p className="text-gray-600">
                View and manage your ride bookings
              </p>
            </div>
            <Link to="/search-rides">
              <Button className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
                Find New Rides
              </Button>
            </Link>
          </div>

          {myBookings.length === 0 ? (
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg text-center py-12">
              <CardContent>
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No bookings yet</h3>
                <p className="text-gray-600 mb-6">
                  Start by searching for rides that match your travel plans
                </p>
                <Link to="/search-rides">
                  <Button className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
                    Search Rides
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {myBookings.map((booking) => {
                // Find the ride details for this booking
                const ride = booking.rideId; // This would need to be populated from the actual ride data
                return (
                  <Card key={booking.id} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <MapPin className="h-5 w-5 text-blue-600" />
                            <CardTitle className="text-lg">
                              Booking #{booking.id.slice(-6)}
                            </CardTitle>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                            </span>
                          </div>
                          <CardDescription>
                            Booked on {booking.createdAt.toLocaleDateString()}
                          </CardDescription>
                        </div>
                        
                        {booking.status === 'confirmed' && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="border-red-200 text-red-600 hover:bg-red-50"
                            onClick={() => handleCancelBooking(booking.id)}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Cancel
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4 text-purple-600" />
                          <div>
                            <div className="text-sm font-medium">
                              {booking.seatsBooked} seat{booking.seatsBooked !== 1 ? 's' : ''}
                            </div>
                            <div className="text-sm text-gray-600">booked</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <DollarSign className="h-4 w-4 text-green-600" />
                          <div>
                            <div className="text-sm font-medium">${booking.totalPrice}</div>
                            <div className="text-sm text-gray-600">Total paid</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">D</span>
                          </div>
                          <div>
                            <div className="text-sm font-medium">Driver</div>
                            <div className="text-sm text-gray-600">Contact available</div>
                          </div>
                        </div>
                        
                        <div className="flex justify-end">
                          <Button variant="outline" size="sm" className="border-blue-200 text-blue-600">
                            View Details
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default MyBookings;

import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Navigation, ArrowLeft, MapPin, Clock, Users, DollarSign, Star, CreditCard } from 'lucide-react';
import { useRides } from '@/contexts/RideContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import RideMessaging from '@/components/ride/RideMessaging';
import ContactInfo from '@/components/ride/ContactInfo';
import LiveLocationTracker from '@/components/ride/LiveLocationTracker';
import PaymentForm from '@/components/payment/PaymentForm';

const RideDetails = () => {
  const { rideId } = useParams<{ rideId: string }>();
  const navigate = useNavigate();
  const { getRideById, bookRide, isLoading } = useRides();
  const { user } = useAuth();
  const { toast } = useToast();
  const [seatsToBook, setSeatsToBook] = useState(1);
  const [isBooking, setIsBooking] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [pendingBookingData, setPendingBookingData] = useState<{seats: number, total: number} | null>(null);

  const ride = rideId ? getRideById(rideId) : undefined;

  if (!ride) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg text-center p-8">
          <CardContent>
            <h2 className="text-2xl font-bold mb-4">Ride Not Found</h2>
            <p className="text-gray-600 mb-6">The ride you're looking for doesn't exist or has been removed.</p>
            <Link to="/search-rides">
              <Button className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
                Search Other Rides
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const availableSeats = ride.availableSeats - (ride.bookings?.length || 0);
  const totalPrice = ride.pricePerSeat * seatsToBook;
  const userBooking = ride.bookings?.find(booking => booking.passengerId === user?.id);
  const hasBooking = !!userBooking;
  const isDriver = ride.driverId === user?.id;

  const handleBookRide = async () => {
    setIsBooking(true);
    setPendingBookingData({ seats: seatsToBook, total: totalPrice });
    setShowPayment(true);
    setIsBooking(false);
  };

  const handlePaymentSuccess = async (paymentId: string) => {
    if (!pendingBookingData) return;
    
    try {
      await bookRide(ride.id, pendingBookingData.seats);
      toast({
        title: "Booking confirmed!",
        description: `You have successfully booked ${pendingBookingData.seats} seat${pendingBookingData.seats !== 1 ? 's' : ''} for $${pendingBookingData.total}`,
      });
      setShowPayment(false);
      setPendingBookingData(null);
      navigate('/my-bookings');
    } catch (error) {
      toast({
        title: "Booking failed",
        description: error instanceof Error ? error.message : "An error occurred while booking the ride",
        variant: "destructive",
      });
    }
  };

  const handlePaymentCancel = () => {
    setShowPayment(false);
    setPendingBookingData(null);
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
            
            <Link to="/search-rides">
              <Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Search
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Ride Details */}
            <div className="lg:col-span-2 space-y-6">
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

              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle>Driver Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-green-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xl font-bold">
                        {ride.driver.firstName[0]}{ride.driver.lastName[0]}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="text-xl font-semibold">
                        {ride.driver.firstName} {ride.driver.lastName}
                      </div>
                      <div className="flex items-center space-x-1 text-gray-600">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>{ride.driver.rating}</span>
                        <span>• Verified Driver</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {(hasBooking || isDriver) && (
                <LiveLocationTracker ride={ride} isDriver={isDriver} />
              )}
              
              {(hasBooking || isDriver) && <ContactInfo ride={ride} />}
              
              {(hasBooking || isDriver) && <RideMessaging ride={ride} />}
            </div>

            {/* Booking Panel */}
            <div className="lg:col-span-1">
              {!hasBooking && !isDriver ? (
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
              ) : (
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
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Payment Dialog */}
      <Dialog open={showPayment} onOpenChange={setShowPayment}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Complete Your Booking</DialogTitle>
            <DialogDescription>
              Complete payment to confirm your ride booking
            </DialogDescription>
          </DialogHeader>
          {pendingBookingData && (
            <PaymentForm
              amount={pendingBookingData.total}
              bookingId={ride.id}
              onPaymentSuccess={handlePaymentSuccess}
              onCancel={handlePaymentCancel}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RideDetails;

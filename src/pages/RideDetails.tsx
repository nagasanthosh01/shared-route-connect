
import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useRides } from '@/contexts/RideContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import RideMessaging from '@/components/ride/RideMessaging';
import ContactInfo from '@/components/ride/ContactInfo';
import LiveLocationTracker from '@/components/ride/LiveLocationTracker';
import PaymentForm from '@/components/payment/PaymentForm';
import RideDetailsHeader from '@/components/ride/RideDetailsHeader';
import RideDetailsCard from '@/components/ride/RideDetailsCard';
import DriverInfoCard from '@/components/ride/DriverInfoCard';
import BookingPanel from '@/components/ride/BookingPanel';

const RideDetails = () => {
  const { rideId } = useParams<{ rideId: string }>();
  const navigate = useNavigate();
  const { getRideById, bookRide, isLoading } = useRides();
  const { user } = useAuth();
  const { toast } = useToast();
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
  const userBooking = ride.bookings?.find(booking => booking.passengerId === user?.id);
  const hasBooking = !!userBooking;
  const isDriver = ride.driverId === user?.id;

  const handleBookRide = async (seatsToBook: number, totalPrice: number) => {
    setPendingBookingData({ seats: seatsToBook, total: totalPrice });
    setShowPayment(true);
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
      <RideDetailsHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Ride Details */}
            <div className="lg:col-span-2 space-y-6">
              <RideDetailsCard ride={ride} />
              <DriverInfoCard driver={ride.driver} />
              
              {(hasBooking || isDriver) && (
                <LiveLocationTracker ride={ride} isDriver={isDriver} />
              )}
              
              {(hasBooking || isDriver) && <ContactInfo ride={ride} />}
              
              {(hasBooking || isDriver) && <RideMessaging ride={ride} />}
            </div>

            {/* Booking Panel */}
            <div className="lg:col-span-1">
              <BookingPanel
                ride={ride}
                userBooking={userBooking}
                isDriver={isDriver}
                availableSeats={availableSeats}
                isLoading={isLoading}
                onBookRide={handleBookRide}
              />
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

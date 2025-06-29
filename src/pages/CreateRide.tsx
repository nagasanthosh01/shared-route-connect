
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Navigation, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useRide } from '@/contexts/RideContext';
import { useToast } from '@/hooks/use-toast';
import CreateRideForm from '@/components/ride/CreateRideForm';
import { CreateRideData } from '@/types/ride';

const CreateRide = () => {
  const navigate = useNavigate();
  const { createRide, isLoading } = useRide();
  const { toast } = useToast();

  const handleCreateRide = async (rideData: CreateRideData) => {
    try {
      const rideId = await createRide(rideData);
      toast({
        title: "Ride created successfully!",
        description: "Your ride is now available for passengers to book.",
      });
      navigate(`/ride/${rideId}`);
    } catch (error) {
      console.error('Error creating ride:', error);
      toast({
        title: "Error creating ride",
        description: "Please try again later.",
        variant: "destructive",
      });
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
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Create a New Ride</h1>
            <p className="text-gray-600">
              Share your journey and help others reach their destination
            </p>
          </div>

          <CreateRideForm onSubmit={handleCreateRide} isLoading={isLoading} />
        </div>
      </main>
    </div>
  );
};

export default CreateRide;

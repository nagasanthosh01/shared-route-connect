
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Navigation, ArrowLeft, MapPin, Clock, Users, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useRides } from '@/contexts/RideContext';
import { useToast } from '@/hooks/use-toast';
import { CreateRideData, Location } from '@/types/ride';

const createRideSchema = z.object({
  fromAddress: z.string().min(3, 'Departure location must be at least 3 characters'),
  fromCity: z.string().min(2, 'Departure city is required'),
  toAddress: z.string().min(3, 'Destination location must be at least 3 characters'),
  toCity: z.string().min(2, 'Destination city is required'),
  departureDate: z.string().min(1, 'Departure date is required'),
  departureTime: z.string().min(1, 'Departure time is required'),
  availableSeats: z.number().min(1, 'At least 1 seat required').max(8, 'Maximum 8 seats allowed'),
  pricePerSeat: z.number().min(1, 'Price must be at least $1').max(1000, 'Price cannot exceed $1000'),
  description: z.string().optional(),
});

type CreateRideFormData = z.infer<typeof createRideSchema>;

const CreateRide = () => {
  const navigate = useNavigate();
  const { createRide } = useRides();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateRideFormData>({
    resolver: zodResolver(createRideSchema),
  });

  const onSubmit = async (data: CreateRideFormData) => {
    setIsLoading(true);
    try {
      const fromLocation: Location = {
        address: data.fromAddress,
        city: data.fromCity,
        country: 'USA' // Default for now
      };

      const toLocation: Location = {
        address: data.toAddress,
        city: data.toCity,
        country: 'USA' // Default for now
      };

      const rideData: CreateRideData = {
        from: fromLocation,
        to: toLocation,
        departureDate: new Date(data.departureDate),
        departureTime: data.departureTime,
        availableSeats: data.availableSeats,
        pricePerSeat: data.pricePerSeat,
        description: data.description,
      };

      await createRide(rideData);
      
      toast({
        title: "Ride created successfully!",
        description: "Your ride has been posted and is now visible to passengers.",
      });
      
      navigate('/my-rides');
    } catch (error) {
      toast({
        title: "Failed to create ride",
        description: error instanceof Error ? error.message : "An error occurred while creating the ride",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
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
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Create a New Ride</h1>
            <p className="text-gray-600">
              Share your journey and help others reach their destination
            </p>
          </div>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="mr-2 h-5 w-5 text-blue-600" />
                Ride Details
              </CardTitle>
              <CardDescription>
                Provide information about your upcoming trip
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Route Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Route</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fromAddress">From (Address)</Label>
                      <Input
                        id="fromAddress"
                        placeholder="123 Main St"
                        {...register('fromAddress')}
                        className={errors.fromAddress ? 'border-red-500' : ''}
                      />
                      {errors.fromAddress && (
                        <p className="text-sm text-red-500">{errors.fromAddress.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="fromCity">From (City)</Label>
                      <Input
                        id="fromCity"
                        placeholder="New York"
                        {...register('fromCity')}
                        className={errors.fromCity ? 'border-red-500' : ''}
                      />
                      {errors.fromCity && (
                        <p className="text-sm text-red-500">{errors.fromCity.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="toAddress">To (Address)</Label>
                      <Input
                        id="toAddress"
                        placeholder="456 Oak Ave"
                        {...register('toAddress')}
                        className={errors.toAddress ? 'border-red-500' : ''}
                      />
                      {errors.toAddress && (
                        <p className="text-sm text-red-500">{errors.toAddress.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="toCity">To (City)</Label>
                      <Input
                        id="toCity"
                        placeholder="Boston"
                        {...register('toCity')}
                        className={errors.toCity ? 'border-red-500' : ''}
                      />
                      {errors.toCity && (
                        <p className="text-sm text-red-500">{errors.toCity.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Time Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Clock className="mr-2 h-5 w-5 text-green-600" />
                    Schedule
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="departureDate">Departure Date</Label>
                      <Input
                        id="departureDate"
                        type="date"
                        min={new Date().toISOString().split('T')[0]}
                        {...register('departureDate')}
                        className={errors.departureDate ? 'border-red-500' : ''}
                      />
                      {errors.departureDate && (
                        <p className="text-sm text-red-500">{errors.departureDate.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="departureTime">Departure Time</Label>
                      <Input
                        id="departureTime"
                        type="time"
                        {...register('departureTime')}
                        className={errors.departureTime ? 'border-red-500' : ''}
                      />
                      {errors.departureTime && (
                        <p className="text-sm text-red-500">{errors.departureTime.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Seats and Pricing */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Capacity & Pricing</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="availableSeats" className="flex items-center">
                        <Users className="mr-2 h-4 w-4 text-purple-600" />
                        Available Seats
                      </Label>
                      <Input
                        id="availableSeats"
                        type="number"
                        min="1"
                        max="8"
                        {...register('availableSeats', { valueAsNumber: true })}
                        className={errors.availableSeats ? 'border-red-500' : ''}
                      />
                      {errors.availableSeats && (
                        <p className="text-sm text-red-500">{errors.availableSeats.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="pricePerSeat" className="flex items-center">
                        <DollarSign className="mr-2 h-4 w-4 text-green-600" />
                        Price per Seat ($)
                      </Label>
                      <Input
                        id="pricePerSeat"
                        type="number"
                        min="1"
                        max="1000"
                        step="0.01"
                        {...register('pricePerSeat', { valueAsNumber: true })}
                        className={errors.pricePerSeat ? 'border-red-500' : ''}
                      />
                      {errors.pricePerSeat && (
                        <p className="text-sm text-red-500">{errors.pricePerSeat.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Additional Notes (Optional)</Label>
                  <textarea
                    id="description"
                    placeholder="Any additional information about your ride..."
                    rows={3}
                    {...register('description')}
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating ride...
                    </div>
                  ) : (
                    'Create Ride'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default CreateRide;

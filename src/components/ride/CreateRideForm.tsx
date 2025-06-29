
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, MapPin, Clock, Users, IndianRupee } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { CreateRideData } from '@/types/ride';

const createRideSchema = z.object({
  fromAddress: z.string().min(5, 'From address must be at least 5 characters'),
  toAddress: z.string().min(5, 'To address must be at least 5 characters'),
  departureDate: z.date({
    required_error: 'Please select a departure date',
  }),
  departureTime: z.string().min(5, 'Please select a departure time'),
  availableSeats: z.number().min(1, 'Must have at least 1 seat').max(8, 'Maximum 8 seats allowed'),
  pricePerSeat: z.number().min(1, 'Price must be at least ₹1'),
  description: z.string().optional(),
});

type CreateRideFormData = z.infer<typeof createRideSchema>;

interface CreateRideFormProps {
  onSubmit: (data: CreateRideData) => Promise<void>;
  isLoading: boolean;
}

const CreateRideForm: React.FC<CreateRideFormProps> = ({ onSubmit, isLoading }) => {
  const [date, setDate] = useState<Date>();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateRideFormData>({
    resolver: zodResolver(createRideSchema),
  });

  const watchedDate = watch('departureDate');

  const handleFormSubmit = async (data: CreateRideFormData) => {
    const rideData: CreateRideData = {
      from: {
        address: data.fromAddress,
        city: 'Not specified', // Default value since we removed city fields
        country: 'India',
      },
      to: {
        address: data.toAddress,
        city: 'Not specified', // Default value since we removed city fields
        country: 'India',
      },
      departureDate: data.departureDate,
      departureTime: data.departureTime,
      availableSeats: data.availableSeats,
      pricePerSeat: data.pricePerSeat,
      description: data.description,
    };

    await onSubmit(rideData);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MapPin className="h-5 w-5" />
          <span>Create New Ride</span>
        </CardTitle>
        <CardDescription>
          Offer a ride and help others reach their destination
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Route Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Route</h3>
            
            <div className="space-y-2">
              <Label htmlFor="fromAddress">From (Address)</Label>
              <Input
                id="fromAddress"
                placeholder="Enter pickup address"
                {...register('fromAddress')}
                className={errors.fromAddress ? 'border-red-500' : ''}
              />
              {errors.fromAddress && (
                <p className="text-sm text-red-500">{errors.fromAddress.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="toAddress">To (Address)</Label>
              <Input
                id="toAddress"
                placeholder="Enter destination address"
                {...register('toAddress')}
                className={errors.toAddress ? 'border-red-500' : ''}
              />
              {errors.toAddress && (
                <p className="text-sm text-red-500">{errors.toAddress.message}</p>
              )}
            </div>
          </div>

          {/* Date & Time Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Date & Time</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Departure Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground",
                        errors.departureDate && "border-red-500"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(selectedDate) => {
                        setDate(selectedDate);
                        setValue('departureDate', selectedDate as Date);
                      }}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {errors.departureDate && (
                  <p className="text-sm text-red-500">{errors.departureDate.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="departureTime">Departure Time</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="departureTime"
                    type="time"
                    className={`pl-10 ${errors.departureTime ? 'border-red-500' : ''}`}
                    {...register('departureTime')}
                  />
                </div>
                {errors.departureTime && (
                  <p className="text-sm text-red-500">{errors.departureTime.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Seats & Price Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Seats & Pricing</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="availableSeats">Available Seats</Label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="availableSeats"
                    type="number"
                    min="1"
                    max="8"
                    className={`pl-10 ${errors.availableSeats ? 'border-red-500' : ''}`}
                    {...register('availableSeats', { valueAsNumber: true })}
                  />
                </div>
                {errors.availableSeats && (
                  <p className="text-sm text-red-500">{errors.availableSeats.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="pricePerSeat">Price per Seat (INR)</Label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="pricePerSeat"
                    type="number"
                    min="1"
                    step="0.01"
                    className={`pl-10 ${errors.pricePerSeat ? 'border-red-500' : ''}`}
                    {...register('pricePerSeat', { valueAsNumber: true })}
                  />
                </div>
                {errors.pricePerSeat && (
                  <p className="text-sm text-red-500">{errors.pricePerSeat.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Add any additional information about your ride..."
              className="min-h-[100px]"
              {...register('description')}
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
                Creating Ride...
              </div>
            ) : (
              'Create Ride'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateRideForm;

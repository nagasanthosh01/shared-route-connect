
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Navigation, ArrowLeft, MapPin, Clock, Users, DollarSign, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useRides } from '@/contexts/RideContext';
import { Ride } from '@/types/ride';

const searchSchema = z.object({
  from: z.string().min(2, 'Origin city is required'),
  to: z.string().min(2, 'Destination city is required'),
  date: z.string().optional(),
});

type SearchFormData = z.infer<typeof searchSchema>;

const SearchRides = () => {
  const { searchRides } = useRides();
  const [searchResults, setSearchResults] = useState<Ride[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SearchFormData>({
    resolver: zodResolver(searchSchema),
  });

  const onSubmit = (data: SearchFormData) => {
    const date = data.date ? new Date(data.date) : undefined;
    const results = searchRides(data.from, data.to, date);
    setSearchResults(results);
    setHasSearched(true);
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
            <h1 className="text-3xl font-bold mb-2">Search Rides</h1>
            <p className="text-gray-600">
              Find available rides that match your travel plans
            </p>
          </div>

          {/* Search Form */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Search className="mr-2 h-5 w-5 text-blue-600" />
                Find Your Ride
              </CardTitle>
              <CardDescription>
                Enter your travel details to search for available rides
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="from">From</Label>
                    <Input
                      id="from"
                      placeholder="Origin city"
                      {...register('from')}
                      className={errors.from ? 'border-red-500' : ''}
                    />
                    {errors.from && (
                      <p className="text-sm text-red-500">{errors.from.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="to">To</Label>
                    <Input
                      id="to"
                      placeholder="Destination city"
                      {...register('to')}
                      className={errors.to ? 'border-red-500' : ''}
                    />
                    {errors.to && (
                      <p className="text-sm text-red-500">{errors.to.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="date">Date (Optional)</Label>
                    <Input
                      id="date"
                      type="date"
                      min={new Date().toISOString().split('T')[0]}
                      {...register('date')}
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
                >
                  <Search className="mr-2 h-4 w-4" />
                  Search Rides
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Search Results */}
          {hasSearched && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">
                {searchResults.length > 0 
                  ? `Found ${searchResults.length} ride${searchResults.length !== 1 ? 's' : ''}`
                  : 'No rides found'
                }
              </h2>

              {searchResults.length === 0 ? (
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg text-center py-12">
                  <CardContent>
                    <div className="w-16 h-16 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">No rides found</h3>
                    <p className="text-gray-600 mb-6">
                      Try adjusting your search criteria or check back later for new rides
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-6">
                  {searchResults.map((ride) => (
                    <Card key={ride.id} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <MapPin className="h-5 w-5 text-blue-600" />
                              <CardTitle className="text-lg">
                                {ride.from.city} → {ride.to.city}
                              </CardTitle>
                            </div>
                            <CardDescription>
                              {ride.from.address} → {ride.to.address}
                            </CardDescription>
                          </div>
                          
                          <div className="text-right">
                            <div className="text-2xl font-bold text-green-600">
                              ${ride.pricePerSeat}
                            </div>
                            <div className="text-sm text-gray-600">per seat</div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
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
                                {ride.availableSeats - (ride.bookings?.length || 0)} seats
                              </div>
                              <div className="text-sm text-gray-600">available</div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs font-bold">
                                {ride.driver.firstName[0]}{ride.driver.lastName[0]}
                              </span>
                            </div>
                            <div>
                              <div className="text-sm font-medium">
                                {ride.driver.firstName} {ride.driver.lastName}
                              </div>
                              <div className="text-sm text-gray-600">⭐ {ride.driver.rating}</div>
                            </div>
                          </div>
                          
                          <div className="flex justify-end">
                            <Link to={`/ride/${ride.id}`}>
                              <Button className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
                                View Details
                              </Button>
                            </Link>
                          </div>
                        </div>
                        
                        {ride.description && (
                          <div className="p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-700">{ride.description}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default SearchRides;


import React, { useState, useEffect } from 'react';
import { Navigation, ArrowLeft, Search, MapPin, Calendar, IndianRupee, Users, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useRide } from '@/contexts/RideContext';
import { useToast } from '@/hooks/use-toast';
import { Ride, SearchFilters } from '@/types/ride';
import { formatINR } from '@/utils/currency';

const SearchRides = () => {
  const { searchRides, isLoading } = useRide();
  const { toast } = useToast();
  const [searchResults, setSearchResults] = useState<Ride[]>([]);
  const [filters, setFilters] = useState<SearchFilters>({
    from: '',
    to: '',
    date: undefined,
    minPrice: undefined,
    maxPrice: undefined,
    availableSeats: undefined,
  });

  const handleSearch = async () => {
    try {
      const results = await searchRides(filters);
      setSearchResults(results);
      
      if (results.length === 0) {
        toast({
          title: "No rides found",
          description: "Try adjusting your search criteria.",
        });
      }
    } catch (error) {
      console.error('Error searching rides:', error);
      toast({
        title: "Search failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  // Load all available rides on component mount
  useEffect(() => {
    handleSearch();
  }, []);

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
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Find a Ride</h1>
            <p className="text-gray-600">
              Search for available rides in your area
            </p>
          </div>

          {/* Search Filters */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Search className="h-5 w-5" />
                <span>Search Filters</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="from">From</Label>
                  <Input
                    id="from"
                    placeholder="Enter pickup location"
                    value={filters.from}
                    onChange={(e) => setFilters({ ...filters, from: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="to">To</Label>
                  <Input
                    id="to"
                    placeholder="Enter destination"
                    value={filters.to}
                    onChange={(e) => setFilters({ ...filters, to: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={filters.date?.toISOString().split('T')[0] || ''}
                    onChange={(e) => setFilters({ 
                      ...filters, 
                      date: e.target.value ? new Date(e.target.value) : undefined 
                    })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="seats">Min Seats</Label>
                  <Input
                    id="seats"
                    type="number"
                    min="1"
                    placeholder="1"
                    value={filters.availableSeats || ''}
                    onChange={(e) => setFilters({ 
                      ...filters, 
                      availableSeats: e.target.value ? parseInt(e.target.value) : undefined 
                    })}
                  />
                </div>
              </div>

              <div className="mt-4">
                <Button 
                  onClick={handleSearch} 
                  className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Searching...
                    </div>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Search Rides
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Search Results */}
          <div className="space-y-4">
            {searchResults.length === 0 && !isLoading ? (
              <Card>
                <CardContent className="text-center py-8">
                  <p className="text-gray-500">No rides found. Try adjusting your search criteria.</p>
                </CardContent>
              </Card>
            ) : (
              searchResults.map((ride) => (
                <Card key={ride.id} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-green-600 rounded-full flex items-center justify-center text-white font-bold">
                            {ride.driver.firstName.charAt(0)}{ride.driver.lastName.charAt(0)}
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">
                              {ride.driver.firstName} {ride.driver.lastName}
                            </h3>
                            <p className="text-sm text-gray-600">Driver • Rating: 5.0 ⭐</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <MapPin className="h-4 w-4 text-green-600" />
                              <span className="text-sm">
                                <strong>From:</strong> {ride.from.address}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <MapPin className="h-4 w-4 text-red-600" />
                              <span className="text-sm">
                                <strong>To:</strong> {ride.to.address}
                              </span>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <Calendar className="h-4 w-4 text-blue-600" />
                              <span className="text-sm">
                                <strong>Date:</strong> {ride.departureDate.toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Clock className="h-4 w-4 text-purple-600" />
                              <span className="text-sm">
                                <strong>Time:</strong> {ride.departureTime}
                              </span>
                            </div>
                          </div>
                        </div>

                        {ride.description && (
                          <div className="mt-4">
                            <p className="text-sm text-gray-600">{ride.description}</p>
                          </div>
                        )}
                      </div>

                      <div className="ml-6 text-right">
                        <div className="space-y-2">
                          <div className="flex items-center justify-end space-x-2">
                            <IndianRupee className="h-4 w-4 text-green-600" />
                            <span className="text-2xl font-bold text-green-600">
                              {formatINR(ride.pricePerSeat)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">per seat</p>
                          
                          <div className="flex items-center justify-end space-x-2">
                            <Users className="h-4 w-4 text-blue-600" />
                            <span className="text-sm">
                              {ride.availableSeats} seats available
                            </span>
                          </div>
                        </div>

                        <div className="mt-4">
                          <Link to={`/ride/${ride.id}`}>
                            <Button className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
                              View Details
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default SearchRides;

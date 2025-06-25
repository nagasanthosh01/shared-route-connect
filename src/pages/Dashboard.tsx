
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Navigation, Car, Users, LogOut, User, Plus, List } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user, logout } = useAuth();

  if (!user) return null;

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
            
            <div className="flex items-center space-x-4">
              <Link to="/profile">
                <Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Button>
              </Link>
              <Button 
                onClick={logout}
                variant="outline" 
                className="border-red-200 text-red-600 hover:bg-red-50"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {user.firstName}!
            </h1>
            <p className="text-gray-600">
              {user.role === 'driver' 
                ? 'Ready to offer some rides today?' 
                : 'Ready to find your next ride?'
              }
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {user.role === 'driver' ? (
              <>
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader>
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center mb-4">
                      <Plus className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle>Create New Ride</CardTitle>
                    <CardDescription>
                      Offer a ride and help others reach their destination
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link to="/create-ride">
                      <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                        Create Ride
                      </Button>
                    </Link>
                  </CardContent>
                </Card>

                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader>
                    <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-green-700 rounded-xl flex items-center justify-center mb-4">
                      <List className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle>My Rides</CardTitle>
                    <CardDescription>
                      View and manage your current and past rides
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link to="/my-rides">
                      <Button variant="outline" className="w-full border-green-200 text-green-600 hover:bg-green-50">
                        View Rides
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </>
            ) : (
              <>
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader>
                    <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-green-700 rounded-xl flex items-center justify-center mb-4">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle>Find a Ride</CardTitle>
                    <CardDescription>
                      Search for available rides in your area
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800">
                      Search Rides
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader>
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center mb-4">
                      <Navigation className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle>My Bookings</CardTitle>
                    <CardDescription>
                      View your current and past ride bookings
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full border-blue-200 text-blue-600 hover:bg-blue-50">
                      View Bookings
                    </Button>
                  </CardContent>
                </Card>
              </>
            )}

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl flex items-center justify-center mb-4">
                  <User className="h-6 w-6 text-white" />
                </div>
                <CardTitle>Profile</CardTitle>
                <CardDescription>
                  Update your personal information and preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/profile">
                  <Button variant="outline" className="w-full border-purple-200 text-purple-600 hover:bg-purple-50">
                    Edit Profile
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-8 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-1">0</div>
                  <div className="text-gray-600">
                    {user.role === 'driver' ? 'Rides Offered' : 'Rides Taken'}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 mb-1">0</div>
                  <div className="text-gray-600">CO₂ Saved (kg)</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600 mb-1">5.0</div>
                  <div className="text-gray-600">Rating</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;


import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Navigation, ArrowLeft } from 'lucide-react';

const RideDetailsHeader: React.FC = () => {
  return (
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
  );
};

export default RideDetailsHeader;

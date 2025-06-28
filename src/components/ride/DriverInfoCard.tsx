
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star } from 'lucide-react';
import { Ride } from '@/types/ride';

interface DriverInfoCardProps {
  driver: Ride['driver'];
}

const DriverInfoCard: React.FC<DriverInfoCardProps> = ({ driver }) => {
  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
      <CardHeader>
        <CardTitle>Driver Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-green-600 rounded-full flex items-center justify-center">
            <span className="text-white text-xl font-bold">
              {driver.firstName[0]}{driver.lastName[0]}
            </span>
          </div>
          <div className="flex-1">
            <div className="text-xl font-semibold">
              {driver.firstName} {driver.lastName}
            </div>
            <div className="flex items-center space-x-1 text-gray-600">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span>{driver.rating}</span>
              <span>• Verified Driver</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DriverInfoCard;


import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { User, Car, MapPin, Star } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      icon: User,
      title: "Create Your Profile",
      description: "Sign up and verify your identity with photos and documents for a trusted community.",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: Car,
      title: "Offer or Find Rides",
      description: "Post your route as a driver or search for available rides as a passenger.",
      color: "from-green-500 to-green-600"
    },
    {
      icon: MapPin,
      title: "Get Matched",
      description: "Our smart algorithm connects you with compatible travel companions on your route.",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: Star,
      title: "Travel & Rate",
      description: "Enjoy your shared journey and rate your experience to build community trust.",
      color: "from-orange-500 to-orange-600"
    }
  ];

  return (
    <section id="how-it-works" className="py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Getting started with ShareRide is simple. Follow these easy steps to begin your sustainable commuting journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 text-center">
                <CardContent className="p-8">
                  <div className={`w-16 h-16 bg-gradient-to-r ${step.color} rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                    <step.icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-sm font-semibold text-gray-500 mb-2">STEP {index + 1}</div>
                  <h3 className="text-xl font-bold mb-4 text-gray-800">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{step.description}</p>
                </CardContent>
              </Card>
              
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-blue-300 to-green-300 transform -translate-y-1/2 z-10"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;

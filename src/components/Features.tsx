
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Star, Users, Navigation, Bell, Wallet } from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: MapPin,
      title: "Smart Route Matching",
      description: "AI-powered algorithm matches you with riders going your way, optimizing routes for everyone."
    },
    {
      icon: Star,
      title: "Trust & Safety",
      description: "Verified profiles, ratings, and reviews ensure a safe and reliable ridesharing experience."
    },
    {
      icon: Users,
      title: "Community Driven",
      description: "Join a community of eco-conscious commuters working together for a greener future."
    },
    {
      icon: Navigation,
      title: "Real-time Tracking",
      description: "Live GPS tracking keeps everyone informed about pickup times and route progress."
    },
    {
      icon: Bell,
      title: "Smart Notifications",
      description: "Get notified about ride requests, updates, and important information instantly."
    },
    {
      icon: Wallet,
      title: "Easy Payments",
      description: "Seamless payment splitting with multiple options for convenient transactions."
    }
  ];

  return (
    <section id="features" className="py-20 px-4 bg-white/50">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            Why Choose ShareRide?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Experience the future of commuting with features designed for safety, convenience, and sustainability.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-green-600 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;

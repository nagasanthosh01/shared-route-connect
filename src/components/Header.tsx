
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Navigation, LogOut, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-blue-100 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-green-600 rounded-xl flex items-center justify-center">
              <Navigation className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              ShareRide
            </span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">Features</a>
            <a href="#how-it-works" className="text-gray-600 hover:text-blue-600 transition-colors">How it Works</a>
            <a href="#safety" className="text-gray-600 hover:text-blue-600 transition-colors">Safety</a>
            <a href="#contact" className="text-gray-600 hover:text-blue-600 transition-colors">Contact</a>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <Link to="/dashboard">
                  <Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50">
                    Dashboard
                  </Button>
                </Link>
                <Link to="/profile">
                  <Button variant="outline" className="border-gray-200 text-gray-600 hover:bg-gray-50">
                    <User className="mr-2 h-4 w-4" />
                    {user.firstName}
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
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>

          <button 
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <div className="w-6 h-6 flex flex-col justify-center space-y-1">
              <div className="w-full h-0.5 bg-gray-600"></div>
              <div className="w-full h-0.5 bg-gray-600"></div>
              <div className="w-full h-0.5 bg-gray-600"></div>
            </div>
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-blue-100">
            <nav className="flex flex-col space-y-4 pt-4">
              <a href="#features" className="text-gray-600 hover:text-blue-600">Features</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-blue-600">How it Works</a>
              <a href="#safety" className="text-gray-600 hover:text-blue-600">Safety</a>
              <a href="#contact" className="text-gray-600 hover:text-blue-600">Contact</a>
              <div className="flex flex-col space-y-2 pt-4">
                {user ? (
                  <>
                    <Link to="/dashboard">
                      <Button variant="outline" className="w-full border-blue-200 text-blue-600">Dashboard</Button>
                    </Link>
                    <Link to="/profile">
                      <Button variant="outline" className="w-full border-gray-200 text-gray-600">
                        <User className="mr-2 h-4 w-4" />
                        {user.firstName}
                      </Button>
                    </Link>
                    <Button 
                      onClick={logout}
                      variant="outline" 
                      className="w-full border-red-200 text-red-600"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/login">
                      <Button variant="outline" className="w-full border-blue-200 text-blue-600">Sign In</Button>
                    </Link>
                    <Link to="/register">
                      <Button className="w-full bg-gradient-to-r from-blue-600 to-green-600">Get Started</Button>
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

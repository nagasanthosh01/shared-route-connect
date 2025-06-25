
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { RideProvider } from "@/contexts/RideContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import CreateRide from "./pages/CreateRide";
import MyRides from "./pages/MyRides";
import SearchRides from "./pages/SearchRides";
import RideDetails from "./pages/RideDetails";
import MyBookings from "./pages/MyBookings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <RideProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="/create-ride" element={
                <ProtectedRoute requiredRole="driver">
                  <CreateRide />
                </ProtectedRoute>
              } />
              <Route path="/my-rides" element={
                <ProtectedRoute requiredRole="driver">
                  <MyRides />
                </ProtectedRoute>
              } />
              <Route path="/search-rides" element={
                <ProtectedRoute requiredRole="passenger">
                  <SearchRides />
                </ProtectedRoute>
              } />
              <Route path="/ride/:rideId" element={
                <ProtectedRoute requiredRole="passenger">
                  <RideDetails />
                </ProtectedRoute>
              } />
              <Route path="/my-bookings" element={
                <ProtectedRoute requiredRole="passenger">
                  <MyBookings />
                </ProtectedRoute>
              } />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </RideProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

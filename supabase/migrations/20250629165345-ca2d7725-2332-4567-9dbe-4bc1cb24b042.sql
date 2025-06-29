
-- Create profiles table to store additional user information
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT,
  role TEXT NOT NULL CHECK (role IN ('driver', 'passenger')),
  profile_image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create rides table
CREATE TABLE public.rides (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  driver_id UUID REFERENCES auth.users NOT NULL,
  from_address TEXT NOT NULL,
  from_city TEXT NOT NULL,
  from_country TEXT DEFAULT 'India',
  from_latitude DECIMAL,
  from_longitude DECIMAL,
  to_address TEXT NOT NULL,
  to_city TEXT NOT NULL,
  to_country TEXT DEFAULT 'India',
  to_latitude DECIMAL,
  to_longitude DECIMAL,
  departure_date DATE NOT NULL,
  departure_time TIME NOT NULL,
  available_seats INTEGER NOT NULL CHECK (available_seats > 0),
  price_per_seat DECIMAL(10,2) NOT NULL CHECK (price_per_seat > 0),
  total_price DECIMAL(10,2) NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'full', 'completed', 'cancelled', 'in-progress')),
  is_location_sharing_enabled BOOLEAN DEFAULT FALSE,
  live_location_latitude DECIMAL,
  live_location_longitude DECIMAL,
  live_location_timestamp TIMESTAMP WITH TIME ZONE,
  live_location_accuracy DECIMAL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bookings table
CREATE TABLE public.bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ride_id UUID REFERENCES public.rides NOT NULL,
  passenger_id UUID REFERENCES auth.users NOT NULL,
  seats_booked INTEGER NOT NULL CHECK (seats_booked > 0),
  total_price DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create messages table
CREATE TABLE public.messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ride_id UUID REFERENCES public.rides NOT NULL,
  sender_id UUID REFERENCES auth.users NOT NULL,
  content TEXT NOT NULL,
  sender_role TEXT NOT NULL CHECK (sender_role IN ('driver', 'passenger')),
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Rides policies
CREATE POLICY "Anyone can view active rides" ON public.rides
  FOR SELECT USING (status = 'active' OR driver_id = auth.uid());

CREATE POLICY "Drivers can create rides" ON public.rides
  FOR INSERT WITH CHECK (auth.uid() = driver_id);

CREATE POLICY "Drivers can update their own rides" ON public.rides
  FOR UPDATE USING (auth.uid() = driver_id);

CREATE POLICY "Drivers can delete their own rides" ON public.rides
  FOR DELETE USING (auth.uid() = driver_id);

-- Bookings policies
CREATE POLICY "Users can view their bookings" ON public.bookings
  FOR SELECT USING (
    auth.uid() = passenger_id OR 
    auth.uid() = (SELECT driver_id FROM public.rides WHERE id = ride_id)
  );

CREATE POLICY "Passengers can create bookings" ON public.bookings
  FOR INSERT WITH CHECK (auth.uid() = passenger_id);

CREATE POLICY "Passengers can update their bookings" ON public.bookings
  FOR UPDATE USING (auth.uid() = passenger_id);

-- Messages policies
CREATE POLICY "Ride participants can view messages" ON public.messages
  FOR SELECT USING (
    auth.uid() = sender_id OR
    auth.uid() = (SELECT driver_id FROM public.rides WHERE id = ride_id) OR
    auth.uid() IN (SELECT passenger_id FROM public.bookings WHERE ride_id = messages.ride_id)
  );

CREATE POLICY "Ride participants can send messages" ON public.messages
  FOR INSERT WITH CHECK (
    auth.uid() = sender_id AND (
      auth.uid() = (SELECT driver_id FROM public.rides WHERE id = ride_id) OR
      auth.uid() IN (SELECT passenger_id FROM public.bookings WHERE ride_id = messages.ride_id)
    )
  );

-- Create function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name, role)
  VALUES (NEW.id, '', '', 'passenger');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

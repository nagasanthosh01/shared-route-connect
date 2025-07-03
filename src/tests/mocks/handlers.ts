
import { http, HttpResponse } from 'msw';

export const handlers = [
  // Mock Supabase auth endpoints
  http.post('https://kzyhebvxpdfototecdlg.supabase.co/auth/v1/token', () => {
    return HttpResponse.json({
      access_token: 'mock-access-token',
      token_type: 'bearer',
      expires_in: 3600,
      user: {
        id: 'test-user-id',
        email: 'test@example.com',
        role: 'authenticated',
      },
    });
  }),

  // Mock profiles endpoint
  http.get('https://kzyhebvxpdfototecdlg.supabase.co/rest/v1/profiles', () => {
    return HttpResponse.json([
      {
        id: 'test-user-id',
        first_name: 'John',
        last_name: 'Doe',
        role: 'passenger',
        phone: '1234567890',
        created_at: '2023-01-01T00:00:00Z',
      },
    ]);
  }),

  // Mock rides endpoint
  http.get('https://kzyhebvxpdfototecdlg.supabase.co/rest/v1/rides', () => {
    return HttpResponse.json([
      {
        id: 'ride-1',
        driver_id: 'driver-1',
        from_city: 'San Francisco',
        to_city: 'Los Angeles',
        departure_date: '2024-01-15',
        departure_time: '09:00',
        available_seats: 3,
        price_per_seat: 50,
        status: 'active',
        created_at: '2023-01-01T00:00:00Z',
      },
    ]);
  }),

  // Mock bookings endpoint
  http.post('https://kzyhebvxpdfototecdlg.supabase.co/rest/v1/bookings', () => {
    return HttpResponse.json({
      id: 'booking-1',
      ride_id: 'ride-1',
      passenger_id: 'test-user-id',
      seats_booked: 1,
      total_price: 50,
      status: 'confirmed',
      created_at: '2023-01-01T00:00:00Z',
    });
  }),
];

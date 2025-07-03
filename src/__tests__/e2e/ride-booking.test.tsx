
import { render, screen, fireEvent, waitFor } from '@/tests/utils/test-utils';
import App from '@/App';
import { useAuth } from '@/contexts/AuthContext';
import { mockUser, mockRide } from '@/tests/mocks/mockData';

jest.mock('@/contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

describe('Ride Booking E2E', () => {
  beforeEach(() => {
    mockUseAuth.mockReturnValue({
      user: mockUser,
      isLoading: false,
      login: jest.fn(),
      register: jest.fn(),
      logout: jest.fn(),
      updateProfile: jest.fn(),
    });
  });

  it('completes full ride booking flow', async () => {
    render(<App />);
    
    // Navigate to search rides
    await waitFor(() => {
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });
    
    const searchRidesLink = screen.getByRole('link', { name: /search rides/i });
    fireEvent.click(searchRidesLink);
    
    // Search for rides
    await waitFor(() => {
      expect(screen.getByText('Search Rides')).toBeInTheDocument();
    });
    
    // Fill search form
    const fromInput = screen.getByLabelText(/from/i);
    const toInput = screen.getByLabelText(/to/i);
    const dateInput = screen.getByLabelText(/date/i);
    
    fireEvent.change(fromInput, { target: { value: 'San Francisco' } });
    fireEvent.change(toInput, { target: { value: 'Los Angeles' } });
    fireEvent.change(dateInput, { target: { value: '2024-01-15' } });
    
    // Submit search
    fireEvent.click(screen.getByRole('button', { name: /search/i }));
    
    // Should show available rides
    await waitFor(() => {
      expect(screen.getByText('San Francisco → Los Angeles')).toBeInTheDocument();
    });
    
    // Click on a ride to view details
    fireEvent.click(screen.getByText('View Details'));
    
    // Should navigate to ride details page
    await waitFor(() => {
      expect(screen.getByText('Ride Details')).toBeInTheDocument();
    });
    
    // Book the ride
    const bookButton = screen.getByRole('button', { name: /book & pay/i });
    fireEvent.click(bookButton);
    
    // Should show booking confirmation
    await waitFor(() => {
      expect(screen.getByText('Booking Confirmed')).toBeInTheDocument();
    });
  });

  it('shows appropriate error messages for failed bookings', async () => {
    // Mock booking failure
    const mockOnBookRide = jest.fn().mockRejectedValue(new Error('Booking failed'));
    
    render(<App />);
    
    // Navigate to ride details and attempt booking
    // ... (similar navigation as above)
    
    // Should show error message
    await waitFor(() => {
      expect(screen.getByText(/booking failed/i)).toBeInTheDocument();
    });
  });
});

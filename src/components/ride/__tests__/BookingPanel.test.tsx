
import { render, screen, fireEvent } from '@/tests/utils/test-utils';
import BookingPanel from '../BookingPanel';
import { mockRide, mockUser, mockBooking } from '@/tests/mocks/mockData';

describe('BookingPanel', () => {
  const defaultProps = {
    ride: mockRide,
    isDriver: false,
    availableSeats: 3,
    isLoading: false,
    onBookRide: jest.fn(),
  };

  it('renders booking form for passengers', () => {
    render(<BookingPanel {...defaultProps} />);
    
    expect(screen.getByText('Book This Ride')).toBeInTheDocument();
    expect(screen.getByText('$50')).toBeInTheDocument();
    expect(screen.getByText('per seat')).toBeInTheDocument();
    expect(screen.getByLabelText(/number of seats/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /book & pay/i })).toBeInTheDocument();
  });

  it('shows driver view for ride owner', () => {
    render(<BookingPanel {...defaultProps} isDriver={true} />);
    
    expect(screen.getByText('Your Ride')).toBeInTheDocument();
    expect(screen.getByText('This is your ride')).toBeInTheDocument();
  });

  it('shows confirmed booking for passengers with booking', () => {
    render(<BookingPanel {...defaultProps} userBooking={mockBooking} />);
    
    expect(screen.getByText('Booking Confirmed')).toBeInTheDocument();
    expect(screen.getByText('✓ You have booked 1 seat')).toBeInTheDocument();
    expect(screen.getByText('Total paid: $50')).toBeInTheDocument();
  });

  it('calculates total price correctly', () => {
    render(<BookingPanel {...defaultProps} />);
    
    const seatsInput = screen.getByLabelText(/number of seats/i);
    fireEvent.change(seatsInput, { target: { value: '2' } });
    
    expect(screen.getByText('$100')).toBeInTheDocument();
  });

  it('prevents booking when no seats available', () => {
    render(<BookingPanel {...defaultProps} availableSeats={0} />);
    
    const bookButton = screen.getByRole('button', { name: /ride full/i });
    expect(bookButton).toBeDisabled();
  });

  it('calls onBookRide with correct parameters', () => {
    const mockOnBookRide = jest.fn();
    render(<BookingPanel {...defaultProps} onBookRide={mockOnBookRide} />);
    
    const seatsInput = screen.getByLabelText(/number of seats/i);
    fireEvent.change(seatsInput, { target: { value: '2' } });
    
    const bookButton = screen.getByRole('button', { name: /book & pay \$100/i });
    fireEvent.click(bookButton);
    
    expect(mockOnBookRide).toHaveBeenCalledWith(2, 100);
  });

  it('respects maximum available seats', () => {
    render(<BookingPanel {...defaultProps} availableSeats={2} />);
    
    const seatsInput = screen.getByLabelText(/number of seats/i) as HTMLInputElement;
    expect(seatsInput.max).toBe('2');
    expect(screen.getByText('Maximum 2 seats available')).toBeInTheDocument();
  });
});

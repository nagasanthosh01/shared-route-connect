
import { render, screen, fireEvent, waitFor } from '@/tests/utils/test-utils';
import Register from '../Register';
import { useAuth } from '@/contexts/AuthContext';

jest.mock('@/contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

describe('Register Page', () => {
  beforeEach(() => {
    mockUseAuth.mockReturnValue({
      user: null,
      isLoading: false,
      login: jest.fn(),
      register: jest.fn(),
      logout: jest.fn(),
      updateProfile: jest.fn(),
    });
  });

  it('renders registration form', () => {
    render(<Register />);
    
    expect(screen.getByText('Join ShareRide')).toBeInTheDocument();
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
  });

  it('shows role selection options', () => {
    render(<Register />);
    
    expect(screen.getByText('Offer Rides')).toBeInTheDocument();
    expect(screen.getByText('Find Rides')).toBeInTheDocument();
    expect(screen.getByText('Driver')).toBeInTheDocument();
    expect(screen.getByText('Passenger')).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    render(<Register />);
    
    const submitButton = screen.getByRole('button', { name: /create account/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('First name must be at least 2 characters long')).toBeInTheDocument();
      expect(screen.getByText('Last name must be at least 2 characters long')).toBeInTheDocument();
      expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
      expect(screen.getByText('Password must be at least 6 characters long')).toBeInTheDocument();
    });
  });

  it('validates password confirmation', async () => {
    render(<Register />);
    
    const passwordInput = screen.getByLabelText('Password');
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'different' } });
    
    const submitButton = screen.getByRole('button', { name: /create account/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText("Passwords don't match")).toBeInTheDocument();
    });
  });

  it('allows role selection', () => {
    render(<Register />);
    
    const driverButton = screen.getByRole('button', { name: /offer rides driver/i });
    const passengerButton = screen.getByRole('button', { name: /find rides passenger/i });
    
    fireEvent.click(driverButton);
    expect(driverButton).toHaveClass('border-blue-600');
    
    fireEvent.click(passengerButton);
    expect(passengerButton).toHaveClass('border-green-600');
  });

  it('submits registration with correct data', async () => {
    const mockRegister = jest.fn();
    mockUseAuth.mockReturnValue({
      user: null,
      isLoading: false,
      login: jest.fn(),
      register: mockRegister,
      logout: jest.fn(),
      updateProfile: jest.fn(),
    });

    render(<Register />);
    
    // Fill out the form
    fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'password123' } });
    
    // Select role
    fireEvent.click(screen.getByRole('button', { name: /offer rides driver/i }));
    
    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /create account/i }));
    
    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith({
        email: 'john@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
        role: 'driver',
        phone: '',
      });
    });
  });
});


import { render, screen, fireEvent, waitFor } from '@/tests/utils/test-utils';
import App from '@/App';

describe('Authentication Flow Integration', () => {
  it('completes full registration and login flow', async () => {
    render(<App />);
    
    // Navigate to registration
    const getStartedButton = screen.getByRole('link', { name: /get started/i });
    fireEvent.click(getStartedButton);
    
    // Fill out registration form
    await waitFor(() => {
      expect(screen.getByText('Join ShareRide')).toBeInTheDocument();
    });
    
    const firstNameInput = screen.getByLabelText(/first name/i);
    const lastNameInput = screen.getByLabelText(/last name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText('Password');
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    
    fireEvent.change(firstNameInput, { target: { value: 'John' } });
    fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
    
    // Select passenger role
    fireEvent.click(screen.getByRole('button', { name: /find rides passenger/i }));
    
    // Submit registration
    fireEvent.click(screen.getByRole('button', { name: /create account/i }));
    
    // Should redirect to login after successful registration
    await waitFor(() => {
      expect(screen.getByText('Welcome Back')).toBeInTheDocument();
    });
  });

  it('prevents access to protected routes when not authenticated', async () => {
    // Mock window.location.pathname to simulate direct navigation
    Object.defineProperty(window, 'location', {
      value: { pathname: '/dashboard' },
      writable: true,
    });

    render(<App />);
    
    // Should redirect to login page
    await waitFor(() => {
      expect(screen.getByText('Welcome Back')).toBeInTheDocument();
    });
  });
});

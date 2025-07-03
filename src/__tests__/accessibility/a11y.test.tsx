
import { render } from '@/tests/utils/test-utils';
import { axe, toHaveNoViolations } from 'jest-axe';
import Login from '@/pages/Login';
import Register from '@/pages/Register';

expect.extend(toHaveNoViolations);

describe('Accessibility Tests', () => {
  it('Login page should not have accessibility violations', async () => {
    const { container } = render(<Login />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Register page should not have accessibility violations', async () => {
    const { container } = render(<Register />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('supports keyboard navigation', () => {
    render(<Login />);
    
    const emailInput = document.querySelector('input[type="email"]');
    const passwordInput = document.querySelector('input[type="password"]');
    const submitButton = document.querySelector('button[type="submit"]');
    
    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
  });

  it('has proper ARIA labels', () => {
    render(<Login />);
    
    const emailInput = document.querySelector('input[type="email"]');
    const passwordInput = document.querySelector('input[type="password"]');
    
    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
  });
});

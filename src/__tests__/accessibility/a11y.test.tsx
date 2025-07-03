
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
    
    expect(emailInput).toHaveAttribute('tabindex', '0');
    expect(passwordInput).toHaveAttribute('tabindex', '0');
    expect(submitButton).not.toHaveAttribute('tabindex', '-1');
  });

  it('has proper ARIA labels', () => {
    render(<Login />);
    
    const emailInput = document.querySelector('input[type="email"]');
    const passwordInput = document.querySelector('input[type="password"]');
    
    expect(emailInput).toHaveAttribute('aria-label');
    expect(passwordInput).toHaveAttribute('aria-label');
  });
});

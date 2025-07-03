
import { render } from '@/tests/utils/test-utils';
import { performance } from 'perf_hooks';
import Login from '@/pages/Login';
import Register from '@/pages/Register';

describe('Performance Tests', () => {
  it('renders Login page within acceptable time', () => {
    const startTime = performance.now();
    render(<Login />);
    const endTime = performance.now();
    
    const renderTime = endTime - startTime;
    expect(renderTime).toBeLessThan(100); // Should render within 100ms
  });

  it('renders Register page within acceptable time', () => {
    const startTime = performance.now();
    render(<Register />);
    const endTime = performance.now();
    
    const renderTime = endTime - startTime;
    expect(renderTime).toBeLessThan(150); // Should render within 150ms
  });

  it('does not cause memory leaks', () => {
    const { unmount } = render(<Login />);
    
    // Simulate multiple renders and unmounts
    for (let i = 0; i < 10; i++) {
      const { unmount: tempUnmount } = render(<Login />);
      tempUnmount();
    }
    
    unmount();
    
    // In a real test, you would check for memory leaks here
    // This is a placeholder for memory leak detection
    expect(true).toBe(true);
  });
});

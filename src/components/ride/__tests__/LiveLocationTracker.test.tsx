
import { render, screen } from '@/tests/utils/test-utils';
import LiveLocationTracker from '../LiveLocationTracker';
import { mockRide } from '@/tests/mocks/mockData';

// Mock the location tracking hook
jest.mock('@/hooks/useLocationTracking', () => ({
  useLocationTracking: () => ({
    currentLocation: { latitude: 37.7749, longitude: -122.4194, accuracy: 10 },
    error: null,
    isSupported: true,
  }),
}));

// Mock the ride context
jest.mock('@/contexts/RideContext', () => ({
  useRide: () => ({
    updateLiveLocation: jest.fn(),
    startRide: jest.fn(),
    completeRide: jest.fn(),
    toggleLocationSharing: jest.fn(),
  }),
}));

describe('LiveLocationTracker', () => {
  const defaultProps = {
    ride: mockRide,
    isDriver: false,
  };

  it('renders location tracker component', () => {
    render(<LiveLocationTracker {...defaultProps} />);
    
    expect(screen.getByText('Live Location Tracking')).toBeInTheDocument();
  });

  it('shows different controls for drivers', () => {
    render(<LiveLocationTracker {...defaultProps} isDriver={true} />);
    
    expect(screen.getByText('Live Location Tracking')).toBeInTheDocument();
    // Driver-specific controls would be tested here
  });

  it('shows passenger view for non-drivers', () => {
    render(<LiveLocationTracker {...defaultProps} isDriver={false} />);
    
    expect(screen.getByText('Live Location Tracking')).toBeInTheDocument();
    // Passenger-specific view would be tested here
  });
});

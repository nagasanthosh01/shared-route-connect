
import { renderHook } from '@testing-library/react';
import { useLocationTracking } from '../useLocationTracking';

// Mock geolocation
const mockGeolocation = {
  getCurrentPosition: jest.fn(),
  watchPosition: jest.fn(),
  clearWatch: jest.fn(),
};

describe('useLocationTracking', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Object.defineProperty(global.navigator, 'geolocation', {
      value: mockGeolocation,
      writable: true,
      configurable: true,
    });
  });

  it('returns null location when not tracking', () => {
    const { result } = renderHook(() => useLocationTracking(false));
    
    expect(result.current.currentLocation).toBeNull();
    expect(result.current.error).toBeNull();
    expect(result.current.isSupported).toBe(true);
  });

  it('starts tracking when enabled', () => {
    mockGeolocation.watchPosition.mockImplementation((success) => {
      success({
        coords: {
          latitude: 37.7749,
          longitude: -122.4194,
          accuracy: 10,
        },
        timestamp: Date.now(),
      });
      return 1;
    });

    const { result } = renderHook(() => useLocationTracking(true));
    
    expect(mockGeolocation.watchPosition).toHaveBeenCalled();
  });

  it('handles geolocation errors', () => {
    mockGeolocation.watchPosition.mockImplementation((success, error) => {
      error({
        code: 1,
        message: 'Permission denied',
      });
      return 1;
    });

    const { result } = renderHook(() => useLocationTracking(true));
    
    expect(result.current.error).toBeTruthy();
  });

  it('detects when geolocation is not supported', () => {
    // Remove geolocation support
    Object.defineProperty(global.navigator, 'geolocation', {
      value: undefined,
      writable: true,
      configurable: true,
    });

    const { result } = renderHook(() => useLocationTracking(true));
    
    expect(result.current.isSupported).toBe(false);
    expect(result.current.error).toBeTruthy();
  });
});

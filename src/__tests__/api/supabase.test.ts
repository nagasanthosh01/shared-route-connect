
import { supabase } from '@/integrations/supabase/client';

// Mock Supabase client
jest.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      signInWithPassword: jest.fn(),
      signUp: jest.fn(),
      signOut: jest.fn(),
    },
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(() => Promise.resolve({ data: null, error: null })),
        })),
      })),
      insert: jest.fn(() => Promise.resolve({ error: null })),
      update: jest.fn(() => ({
        eq: jest.fn(() => Promise.resolve({ error: null })),
      })),
    })),
  },
}));

describe('Supabase API Integration', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Authentication', () => {
    it('handles successful login', async () => {
      const mockSignIn = supabase.auth.signInWithPassword as jest.Mock;
      mockSignIn.mockResolvedValue({
        data: { user: { id: 'user-123', email: 'test@example.com' } },
        error: null,
      });

      const result = await supabase.auth.signInWithPassword({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(mockSignIn).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
      expect(result.data.user).toBeDefined();
      expect(result.error).toBeNull();
    });

    it('handles login errors', async () => {
      const mockSignIn = supabase.auth.signInWithPassword as jest.Mock;
      mockSignIn.mockResolvedValue({
        data: { user: null },
        error: { message: 'Invalid credentials' },
      });

      const result = await supabase.auth.signInWithPassword({
        email: 'test@example.com',
        password: 'wrongpassword',
      });

      expect(result.error).toBeDefined();
      expect(result.error.message).toBe('Invalid credentials');
    });
  });

  describe('Data Operations', () => {
    it('fetches user profile data', async () => {
      const mockFrom = supabase.from as jest.Mock;
      const mockSelect = jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(() => Promise.resolve({
            data: { id: 'user-123', first_name: 'John', last_name: 'Doe' },
            error: null,
          })),
        })),
      }));
      mockFrom.mockReturnValue({ select: mockSelect });

      const result = await supabase
        .from('profiles')
        .select('*')
        .eq('id', 'user-123')
        .single();

      expect(mockFrom).toHaveBeenCalledWith('profiles');
      expect(result.data).toBeDefined();
      expect(result.data.first_name).toBe('John');
    });

    it('handles data fetch errors', async () => {
      const mockFrom = supabase.from as jest.Mock;
      const mockSelect = jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(() => Promise.resolve({
            data: null,
            error: { message: 'Profile not found' },
          })),
        })),
      }));
      mockFrom.mockReturnValue({ select: mockSelect });

      const result = await supabase
        .from('profiles')
        .select('*')
        .eq('id', 'nonexistent-user')
        .single();

      expect(result.error).toBeDefined();
      expect(result.error.message).toBe('Profile not found');
    });
  });
});

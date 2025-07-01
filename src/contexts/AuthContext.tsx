
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';

export type UserRole = 'driver' | 'passenger';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  phone?: string;
  profileImage?: string;
  createdAt: Date;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => Promise<void>;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  phone?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session);
        setSession(session);
        
        if (session?.user) {
          // Use setTimeout to avoid potential deadlock
          setTimeout(async () => {
            try {
              // Fetch user profile from profiles table
              const { data: profile, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();
              
              if (profile && !error) {
                setUser({
                  id: session.user.id,
                  email: session.user.email!,
                  firstName: profile.first_name,
                  lastName: profile.last_name,
                  role: profile.role as UserRole,
                  phone: profile.phone,
                  profileImage: profile.profile_image,
                  createdAt: new Date(profile.created_at)
                });
              }
            } catch (error) {
              console.error('Error fetching profile:', error);
            }
          }, 0);
        } else {
          setUser(null);
        }
        setIsLoading(false);
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (!session) {
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData: RegisterData): Promise<void> => {
    try {
      console.log('Starting registration process...', userData);
      
      const redirectUrl = `${window.location.origin}/dashboard`;
      
      // Sign up the user
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          emailRedirectTo: redirectUrl
        }
      });
      
      if (signUpError) {
        console.error('Signup error:', signUpError);
        throw signUpError;
      }

      console.log('Signup successful:', authData);

      // If user is created, create profile
      if (authData.user) {
        console.log('Creating profile for user:', authData.user.id);
        
        // Create profile entry
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            first_name: userData.firstName,
            last_name: userData.lastName,
            role: userData.role,
            phone: userData.phone || ''
          });

        if (profileError) {
          console.error('Profile creation error:', profileError);
          // Don't throw here, as the user is already created
        } else {
          console.log('Profile created successfully');
        }
      }
      
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  };

  const updateProfile = async (updateData: Partial<User>): Promise<void> => {
    if (!user) throw new Error('No user logged in');
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: updateData.firstName,
          last_name: updateData.lastName,
          role: updateData.role,
          phone: updateData.phone,
          profile_image: updateData.profileImage
        })
        .eq('id', user.id);
      
      if (error) throw error;
      
      // Update local state
      setUser({ ...user, ...updateData });
    } catch (error) {
      throw error;
    }
  };

  const value = {
    user,
    isLoading,
    login,
    register,
    logout,
    updateProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

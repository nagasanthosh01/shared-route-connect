
import React, { createContext, useContext, useState, useEffect } from 'react';

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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on app load
    const savedUser = localStorage.getItem('shareride_user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser({
          ...userData,
          createdAt: new Date(userData.createdAt)
        });
      } catch (error) {
        console.error('Error parsing saved user data:', error);
        localStorage.removeItem('shareride_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      // Simulate API call - In real app, this would be an actual API request
      const savedUsers = JSON.parse(localStorage.getItem('shareride_users') || '[]');
      const foundUser = savedUsers.find((u: any) => u.email === email && u.password === password);
      
      if (!foundUser) {
        throw new Error('Invalid email or password');
      }

      const { password: _, ...userWithoutPassword } = foundUser;
      const userData = {
        ...userWithoutPassword,
        createdAt: new Date(userWithoutPassword.createdAt)
      };
      
      setUser(userData);
      localStorage.setItem('shareride_user', JSON.stringify(userData));
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData): Promise<void> => {
    setIsLoading(true);
    try {
      // Simulate API call - In real app, this would be an actual API request
      const savedUsers = JSON.parse(localStorage.getItem('shareride_users') || '[]');
      
      // Check if user already exists
      if (savedUsers.find((u: any) => u.email === userData.email)) {
        throw new Error('User with this email already exists');
      }

      const newUser = {
        id: Date.now().toString(),
        email: userData.email,
        password: userData.password, // In real app, this would be hashed
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role,
        phone: userData.phone,
        createdAt: new Date()
      };

      savedUsers.push(newUser);
      localStorage.setItem('shareride_users', JSON.stringify(savedUsers));

      const { password: _, ...userWithoutPassword } = newUser;
      setUser(userWithoutPassword);
      localStorage.setItem('shareride_user', JSON.stringify(userWithoutPassword));
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('shareride_user');
  };

  const updateProfile = async (updateData: Partial<User>): Promise<void> => {
    if (!user) throw new Error('No user logged in');
    
    setIsLoading(true);
    try {
      const updatedUser = { ...user, ...updateData };
      setUser(updatedUser);
      localStorage.setItem('shareride_user', JSON.stringify(updatedUser));

      // Update in users array as well
      const savedUsers = JSON.parse(localStorage.getItem('shareride_users') || '[]');
      const userIndex = savedUsers.findIndex((u: any) => u.id === user.id);
      if (userIndex >= 0) {
        savedUsers[userIndex] = { ...savedUsers[userIndex], ...updateData };
        localStorage.setItem('shareride_users', JSON.stringify(savedUsers));
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
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

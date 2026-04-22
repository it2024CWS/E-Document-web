import { createContext, ReactNode, useEffect, useState } from 'react';
import { UserDataModel } from '@/models/authModel';
import { logoutService } from '@/services/authService';
import { AUTH_USER_DATA } from '@/utils/constants/localStorage';

export interface AuthContextType {
  user: UserDataModel | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (userData: UserDataModel) => void;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserDataModel | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check if user data exists in localStorage
    const checkAuth = () => {
      try {
        const storedUser = localStorage.getItem(AUTH_USER_DATA);
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          // Simple validation to ensure data matches new model
          if (parsedUser && parsedUser.role_id) {
            setUser(parsedUser);
          } else {
            // If data is old format (missing role_id), clear it
            localStorage.removeItem(AUTH_USER_DATA);
          }
        }
      } catch (error) {
        console.error('Failed to parse user data:', error);
        localStorage.removeItem(AUTH_USER_DATA);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = (userData: UserDataModel) => {
    setUser(userData);
    localStorage.setItem(AUTH_USER_DATA, JSON.stringify(userData));
  };

  const logout = async () => {
    try {
      // Call logout API to clear cookies on backend
      await logoutService();
    } catch (error) {
      console.error('Logout API failed:', error);
      // Continue with local logout even if API fails
    } finally {
      // Clear local state and localStorage
      setUser(null);
      localStorage.removeItem(AUTH_USER_DATA);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

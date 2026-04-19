import React, { createContext, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  initials: string;
}

interface AuthContextType {
  user: AuthUser;
  isAuthenticated: boolean;
}

// TODO: Replace with real auth state from login/register flow.
// Single source of truth for user identity across the app.
const MOCK_USER: AuthUser = {
  id: '00000000-0000-0000-0000-000000000001',
  name: 'Carlos Martinez',
  email: 'carlos.martinez@email.com',
  phone: '+57 310 000 0000',
  initials: 'CM',
};

const AuthContext = createContext<AuthContextType>({
  user: MOCK_USER,
  isAuthenticated: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Sync user_id to AsyncStorage so httpClient sends X-User-Id header
  useEffect(() => {
    AsyncStorage.setItem('user_id', MOCK_USER.id);
  }, []);

  const value: AuthContextType = {
    user: MOCK_USER,
    isAuthenticated: true,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

export type { AuthUser };

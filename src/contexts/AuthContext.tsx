import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  phone?: string;
  initials?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (
    token: string,
    userId: string,
    userData?: { email?: string; name?: string }
  ) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  logout: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  function computeInitials(name: string): string {
    return name
      .split(' ')
      .map(w => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }

  useEffect(() => {
    async function loadAuthState() {
      try {
        const token = await AsyncStorage.getItem('auth_token');
        const userId = await AsyncStorage.getItem('user_id');
        const name = await AsyncStorage.getItem('user_name');
        const email = await AsyncStorage.getItem('user_email');
        if (token && userId) {
          const n = name ?? '';
          setUser({ id: userId, name: n, email: email ?? '', initials: computeInitials(n) });
        }
      } finally {
        setIsLoading(false);
      }
    }
    loadAuthState();
  }, []);

  async function login(
    token: string,
    userId: string,
    userData?: { email?: string; name?: string }
  ) {
    await AsyncStorage.setItem('auth_token', token);
    await AsyncStorage.setItem('user_id', userId);
    if (userData?.name) await AsyncStorage.setItem('user_name', userData.name);
    if (userData?.email) await AsyncStorage.setItem('user_email', userData.email);
    const n = userData?.name ?? '';
    setUser({
      id: userId,
      email: userData?.email ?? '',
      name: n,
      initials: computeInitials(n),
    });
  }

  async function logout() {
    await AsyncStorage.multiRemove(['auth_token', 'user_id', 'user_name', 'user_email']);
    setUser(null);
  }

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AppNavigator from './AppNavigator';
import AuthNavigator from './AuthNavigator';
import SplashScreen from '@/screens/SplashScreen';

export default function RootNavigator() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <SplashScreen />;

  return isAuthenticated ? <AppNavigator /> : <AuthNavigator />;
}

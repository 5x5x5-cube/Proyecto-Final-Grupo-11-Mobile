import React from 'react';
import AppNavigator from '../navigation/AppNavigator';
import { useNotifications } from '../hooks/useNotifications';

export default function AppContent() {
  // Initialize push notifications - must be inside NavigationContainer
  useNotifications();

  return <AppNavigator />;
}

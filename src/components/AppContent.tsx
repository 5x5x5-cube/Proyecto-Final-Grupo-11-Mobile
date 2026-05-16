import React from 'react';
import RootNavigator from '../navigation/RootNavigator';
import { useNotifications } from '../hooks/useNotifications';

export default function AppContent() {
  // Initialize push notifications - must be inside NavigationContainer
  useNotifications();

  return <RootNavigator />;
}

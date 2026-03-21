import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { palette } from '../theme/palette';
import { MainTabParamList } from './types';
import PlaceholderScreen from '../screens/PlaceholderScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();

function SearchPlaceholder() {
  return <PlaceholderScreen name="Search" />;
}
function ReservationsPlaceholder() {
  return <PlaceholderScreen name="My Reservations" />;
}
function ProfilePlaceholder() {
  return <PlaceholderScreen name="Profile" />;
}

export default function MainTabs() {
  const { t } = useTranslation('common');

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: palette.primary,
        tabBarInactiveTintColor: palette.onSurfaceVariant,
        tabBarStyle: {
          height: 56,
          backgroundColor: '#fff',
          borderTopColor: palette.outlineVariant,
          borderTopWidth: 1,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
        },
      }}
    >
      <Tab.Screen
        name="Search"
        component={SearchPlaceholder}
        options={{
          tabBarLabel: t('bottomNav.search'),
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="magnify" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="MyReservations"
        component={ReservationsPlaceholder}
        options={{
          tabBarLabel: t('bottomNav.myReservations'),
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="calendar-text" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfilePlaceholder}
        options={{
          tabBarLabel: t('bottomNav.profile'),
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account-circle-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

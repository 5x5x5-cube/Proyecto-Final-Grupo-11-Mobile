import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { palette } from '../theme/palette';
import { MainTabParamList } from './types';
import SearchScreen from '../screens/SearchScreen';
import MyReservationsScreen from '../screens/MyReservationsScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function MainTabs() {
  const { t, i18n } = useTranslation('common');

  return (
    <Tab.Navigator
      key={i18n.language}
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
        component={SearchScreen}
        options={{
          tabBarLabel: t('bottomNav.search'),
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="magnify" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="MyReservations"
        component={MyReservationsScreen}
        options={{
          tabBarLabel: t('bottomNav.myReservations'),
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="calendar-text" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
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

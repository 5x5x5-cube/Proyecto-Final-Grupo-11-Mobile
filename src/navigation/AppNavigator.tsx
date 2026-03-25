import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import MainTabs from './MainTabs';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ResultsScreen from '../screens/ResultsScreen';
import PropertyDetailScreen from '../screens/PropertyDetailScreen';
import ReservationSummaryScreen from '../screens/ReservationSummaryScreen';
import PaymentScreen from '../screens/PaymentScreen';
import SuccessScreen from '../screens/SuccessScreen';
import ReservationDetailScreen from '../screens/ReservationDetailScreen';
import CancelReservationScreen from '../screens/CancelReservationScreen';
import QRCheckInScreen from '../screens/QRCheckInScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen name="Results" component={ResultsScreen} />
      <Stack.Screen name="PropertyDetail" component={PropertyDetailScreen} />
      <Stack.Screen name="ReservationSummary" component={ReservationSummaryScreen} />
      <Stack.Screen name="Payment" component={PaymentScreen} />
      <Stack.Screen name="Success" component={SuccessScreen} />
      <Stack.Screen name="ReservationDetail" component={ReservationDetailScreen} />
      <Stack.Screen name="CancelReservation" component={CancelReservationScreen} />
      <Stack.Screen name="QRCheckIn" component={QRCheckInScreen} />
    </Stack.Navigator>
  );
}

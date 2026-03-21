import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import MainTabs from './MainTabs';
import PlaceholderScreen from '../screens/PlaceholderScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

function LoginPlaceholder() {
  return <PlaceholderScreen name="Login" />;
}
function RegisterPlaceholder() {
  return <PlaceholderScreen name="Register" />;
}
function ResultsPlaceholder() {
  return <PlaceholderScreen name="Results" />;
}
function PropertyDetailPlaceholder() {
  return <PlaceholderScreen name="Property Detail" />;
}
function ReservationSummaryPlaceholder() {
  return <PlaceholderScreen name="Reservation Summary" />;
}
function PaymentPlaceholder() {
  return <PlaceholderScreen name="Payment" />;
}
function SuccessPlaceholder() {
  return <PlaceholderScreen name="Success" />;
}
function ReservationDetailPlaceholder() {
  return <PlaceholderScreen name="Reservation Detail" />;
}
function CancelReservationPlaceholder() {
  return <PlaceholderScreen name="Cancel Reservation" />;
}
function QRCheckInPlaceholder() {
  return <PlaceholderScreen name="QR Check-In" />;
}

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginPlaceholder} />
      <Stack.Screen name="Register" component={RegisterPlaceholder} />
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen name="Results" component={ResultsPlaceholder} />
      <Stack.Screen name="PropertyDetail" component={PropertyDetailPlaceholder} />
      <Stack.Screen name="ReservationSummary" component={ReservationSummaryPlaceholder} />
      <Stack.Screen name="Payment" component={PaymentPlaceholder} />
      <Stack.Screen name="Success" component={SuccessPlaceholder} />
      <Stack.Screen name="ReservationDetail" component={ReservationDetailPlaceholder} />
      <Stack.Screen name="CancelReservation" component={CancelReservationPlaceholder} />
      <Stack.Screen name="QRCheckIn" component={QRCheckInPlaceholder} />
    </Stack.Navigator>
  );
}

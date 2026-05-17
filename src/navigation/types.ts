import { NavigatorScreenParams } from '@react-navigation/native';

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type AppStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabParamList> | undefined;
  Results: {
    destination: string;
    checkIn: string;
    checkOut: string;
    guests: number;
  };
  PropertyDetail: { id: string; checkIn?: string; checkOut?: string; guests?: number };
  ReservationSummary: {
    hotelId: string;
    roomId: string;
    checkIn: string;
    checkOut: string;
    guests: number;
  };
  Payment: undefined;
  Success: {
    paymentId: string;
  };
  ReservationDetail: { id: string };
  CancelReservation: { id: string };
  QRCheckIn: { id: string };
};

// Alias kept for backward compatibility with existing screen imports
export type RootStackParamList = AuthStackParamList & AppStackParamList;

export type MainTabParamList = {
  Search: undefined;
  MyReservations: undefined;
  Profile: undefined;
};

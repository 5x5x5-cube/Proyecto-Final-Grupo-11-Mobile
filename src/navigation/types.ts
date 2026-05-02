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
  ReservationDetail: { id: number };
  CancelReservation: { id: number };
  QRCheckIn: { id: number };
};

// Alias kept for backward compatibility with existing screen imports
export type RootStackParamList = AuthStackParamList & AppStackParamList;

export type MainTabParamList = {
  Search: undefined;
  MyReservations: undefined;
  Profile: undefined;
};

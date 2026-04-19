import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  MainTabs: NavigatorScreenParams<MainTabParamList> | undefined;
  Results: undefined;
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

export type MainTabParamList = {
  Search: undefined;
  MyReservations: undefined;
  Profile: undefined;
};

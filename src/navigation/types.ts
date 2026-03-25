import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  MainTabs: NavigatorScreenParams<MainTabParamList> | undefined;
  Results: undefined;
  PropertyDetail: { id: number };
  ReservationSummary: undefined;
  Payment: undefined;
  Success: undefined;
  ReservationDetail: { id: number };
  CancelReservation: { id: number };
  QRCheckIn: { id: number };
};

export type MainTabParamList = {
  Search: undefined;
  MyReservations: undefined;
  Profile: undefined;
};

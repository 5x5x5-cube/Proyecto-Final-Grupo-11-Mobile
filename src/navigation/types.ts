export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  MainTabs: undefined;
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

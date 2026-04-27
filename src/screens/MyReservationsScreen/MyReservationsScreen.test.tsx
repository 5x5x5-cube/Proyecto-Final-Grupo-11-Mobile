jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    getItem: jest.fn().mockResolvedValue(null),
    setItem: jest.fn().mockResolvedValue(undefined),
    removeItem: jest.fn().mockResolvedValue(undefined),
  },
}));

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: jest.fn(), goBack: jest.fn() }),
  useRoute: () => ({ params: {} }),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

jest.mock('../../i18n', () => ({
  changeLanguage: jest.fn(),
}));

const mockActiveBookings = [
  {
    id: 1,
    code: 'RES-001',
    hotelName: 'Grand Hyatt Bogotá',
    roomName: 'Deluxe King Room',
    location: 'Bogotá, Colombia',
    nights: 3,
    checkIn: '2024-06-01',
    checkOut: '2024-06-04',
    guests: '2 adults',
    status: 'confirmed' as const,
    totalPrice: 900000,
    currency: 'COP',
  },
  {
    id: 2,
    code: 'RES-002',
    hotelName: 'Hotel Dann Carlton',
    roomName: 'Superior Twin Room',
    location: 'Medellín, Colombia',
    nights: 2,
    checkIn: '2024-07-10',
    checkOut: '2024-07-12',
    guests: '1 adult',
    status: 'pending' as const,
    totalPrice: 450000,
    currency: 'COP',
  },
];

jest.mock('../../api/hooks/useBookings', () => ({
  useBookings: () => ({ data: mockActiveBookings, isLoading: false }),
  usePastBookings: () => ({ data: [], isLoading: false }),
  useCancelledBookings: () => ({ data: [], isLoading: false }),
}));

jest.mock('expo-linear-gradient', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    LinearGradient: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) =>
      React.createElement(View, props, children),
  };
});

import React from 'react';
import { render } from '@testing-library/react-native';
import { LocaleProvider } from '../../contexts/LocaleContext';
import MyReservationsScreen from './MyReservationsScreen';

describe('MyReservationsScreen', () => {
  it('renders without crashing', () => {
    const { toJSON } = render(
      <LocaleProvider>
        <MyReservationsScreen />
      </LocaleProvider>
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders hotel name from API data', () => {
    const { getByText } = render(
      <LocaleProvider>
        <MyReservationsScreen />
      </LocaleProvider>
    );
    expect(getByText('Grand Hyatt Bogotá')).toBeTruthy();
    expect(getByText('Hotel Dann Carlton')).toBeTruthy();
  });

  it('renders location from API data', () => {
    const { getByText } = render(
      <LocaleProvider>
        <MyReservationsScreen />
      </LocaleProvider>
    );
    expect(getByText('Bogotá, Colombia')).toBeTruthy();
    expect(getByText('Medellín, Colombia')).toBeTruthy();
  });

  it('shows correct booking count in active tab', () => {
    const { getByText } = render(
      <LocaleProvider>
        <MyReservationsScreen />
      </LocaleProvider>
    );
    // Tab label rendered as "myReservations.active (2)" via t() identity mock
    expect(getByText('myReservations.active (2)')).toBeTruthy();
  });
});

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: jest.fn(), goBack: jest.fn() }),
  useRoute: () => ({ params: { id: 1 } }),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    getItem: jest.fn().mockResolvedValue(null),
    setItem: jest.fn().mockResolvedValue(undefined),
    removeItem: jest.fn().mockResolvedValue(undefined),
  },
}));

jest.mock('../../i18n', () => ({
  changeLanguage: jest.fn(),
}));

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

jest.mock('../../api/hooks/useBookings', () => ({
  useBookingDetail: () => ({
    data: {
      code: 'TH-001',
      hotelName: 'Test',
      checkIn: '2026-03-20',
      checkOut: '2026-03-25',
      room: 'Suite',
      guests: '2',
    },
  }),
  useBookingQR: () => ({ data: { qrCode: 'QR-DATA' } }),
}));

jest.mock('react-native-qrcode-svg', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: (props: any) => React.createElement(View, { testID: 'qr-code', ...props }),
  };
});

import React from 'react';
import { render } from '@testing-library/react-native';
import { LocaleProvider } from '../../contexts/LocaleContext';
import QRCheckInScreen from './QRCheckInScreen';

describe('QRCheckInScreen', () => {
  it('renders without crashing', () => {
    const { toJSON } = render(
      <LocaleProvider>
        <QRCheckInScreen />
      </LocaleProvider>
    );
    expect(toJSON()).toBeTruthy();
  });
});

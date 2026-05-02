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

const mockUseBookingDetail = jest.fn();
const mockUseBookingQR = jest.fn();

jest.mock('../../api/hooks/useBookings', () => ({
  useBookingDetail: (...args: any[]) => mockUseBookingDetail(...args),
  useBookingQR: (...args: any[]) => mockUseBookingQR(...args),
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

const reservation = {
  code: 'TH-001',
  hotelName: 'Test Hotel',
  checkIn: '2026-03-20',
  checkOut: '2026-03-25',
  room: 'Suite',
  guests: 2,
};

function renderScreen() {
  return render(
    <LocaleProvider>
      <QRCheckInScreen />
    </LocaleProvider>
  );
}

describe('QRCheckInScreen', () => {
  beforeEach(() => {
    mockUseBookingDetail.mockReturnValue({ data: reservation });
    mockUseBookingQR.mockReturnValue({
      data: { qrCode: 'QR-DATA', isFromCache: false },
      error: null,
      isLoading: false,
    });
  });

  it('renders QR code when data is available', () => {
    const { getByTestId, getByText } = renderScreen();
    expect(getByTestId('qr-code')).toBeTruthy();
    expect(getByText('TH-001')).toBeTruthy();
    expect(getByText('Test Hotel')).toBeTruthy();
  });

  it('shows error state when QR fetch fails with date range error', () => {
    mockUseBookingQR.mockReturnValue({
      data: null,
      error: {
        detail: 'QR code can only be generated within 3 days before or after check-in date',
      },
      isLoading: false,
    });

    const { getByText, queryByTestId } = renderScreen();
    expect(queryByTestId('qr-code')).toBeNull();
    expect(getByText('qrCheckIn.errorTitle')).toBeTruthy();
    expect(getByText('qrCheckIn.errorDateRange')).toBeTruthy();
  });

  it('shows error state when QR fetch fails with not confirmed error', () => {
    mockUseBookingQR.mockReturnValue({
      data: null,
      error: {
        detail: 'QR code can only be generated for confirmed bookings. Current status: pending',
      },
      isLoading: false,
    });

    const { getByText, queryByTestId } = renderScreen();
    expect(queryByTestId('qr-code')).toBeNull();
    expect(getByText('qrCheckIn.errorNotConfirmed')).toBeTruthy();
  });

  it('shows generic error for unknown errors', () => {
    mockUseBookingQR.mockReturnValue({
      data: null,
      error: { message: 'Network error' },
      isLoading: false,
    });

    const { getByText } = renderScreen();
    expect(getByText('qrCheckIn.errorGeneric')).toBeTruthy();
  });

  it('shows offline badge when QR is from cache', () => {
    mockUseBookingQR.mockReturnValue({
      data: { qrCode: 'QR-CACHED', isFromCache: true },
      error: null,
      isLoading: false,
    });

    const { getByText } = renderScreen();
    expect(getByText('qrCheckIn.offlineMode')).toBeTruthy();
  });

  it('hides instruction card when error is shown', () => {
    mockUseBookingQR.mockReturnValue({
      data: null,
      error: {
        detail: 'QR code can only be generated within 3 days before or after check-in date',
      },
      isLoading: false,
    });

    const { queryByText } = renderScreen();
    expect(queryByText('qrCheckIn.instruction')).toBeNull();
  });

  it('still shows hotel info when error is shown', () => {
    mockUseBookingQR.mockReturnValue({
      data: null,
      error: { detail: 'some error' },
      isLoading: false,
    });

    const { getByText } = renderScreen();
    expect(getByText('Test Hotel')).toBeTruthy();
  });
});

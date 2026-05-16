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
  useRoute: () => ({
    params: { paymentId: 'pay-123' },
  }),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

jest.mock('../../i18n', () => ({
  changeLanguage: jest.fn(),
}));

jest.mock('../../api/hooks/usePayments', () => ({
  usePaymentStatus: () => ({
    data: {
      paymentId: 'pay-123',
      status: 'approved',
      paymentMethod: { displayLabel: 'Visa •••• 4242' },
      amount: 595000,
      currency: 'COP',
    },
  }),
}));

jest.mock('../../api/hooks/useBookings', () => ({
  useBookingByPaymentId: () => ({
    data: {
      id: 'bk-1',
      code: 'BK-12345678',
      hotelId: 'hotel-1',
      checkIn: '2026-05-01',
      checkOut: '2026-05-03',
      guests: 2,
      totalPrice: 595000,
      currency: 'COP',
    },
  }),
}));

jest.mock('../../api/hooks/useSearch', () => ({
  useHotelDetail: () => ({
    data: { name: 'Test Hotel', city: 'Bogota', country: 'Colombia' },
  }),
}));

import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LocaleProvider } from '../../contexts/LocaleContext';
import SuccessScreen from './SuccessScreen';

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

describe('SuccessScreen', () => {
  it('renders without crashing', () => {
    const { toJSON } = render(
      <QueryClientProvider client={queryClient}>
        <LocaleProvider>
          <SuccessScreen />
        </LocaleProvider>
      </QueryClientProvider>
    );
    expect(toJSON()).toBeTruthy();
  });

  it('shows total paid in payment currency (formatFixedPrice, not locale conversion)', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <LocaleProvider>
          <SuccessScreen />
        </LocaleProvider>
      </QueryClientProvider>
    );
    expect(screen.getByText(/COP\s+595[.,]000/)).toBeTruthy();
  });
});

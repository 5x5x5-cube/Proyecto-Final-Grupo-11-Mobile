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
  useRoute: () => ({ params: { id: 1 } }),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

jest.mock('../../i18n', () => ({
  changeLanguage: jest.fn(),
}));

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

const mockReservation = {
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
  priceBreakdown: {
    basePrice: '729000',
    vat: '116640',
    serviceFee: '54360',
  },
};

const mockUseBookingDetail = jest.fn(() => ({ data: mockReservation, isLoading: false }));
const mockUseHotelDetail = jest.fn(() => ({ data: { rating: 4.5 }, isLoading: false }));

jest.mock('../../api/hooks/useBookings', () => ({
  useBookingDetail: (...args: unknown[]) => mockUseBookingDetail(...args),
}));

jest.mock('../../api/hooks/useSearch', () => ({
  useHotelDetail: (...args: unknown[]) => mockUseHotelDetail(...args),
}));

const mockPayment = {
  paymentId: 'pay-123',
  status: 'approved' as const,
  paymentMethod: {
    id: 'pm-1',
    methodType: 'credit_card',
    displayLabel: 'Visa **** 4242',
    cardLast4: '4242',
    cardBrand: 'Visa',
  },
  amount: 900000,
  currency: 'COP',
  transactionId: 'txn-abc',
  message: null,
  createdAt: '2024-06-01T10:00:00Z',
  processedAt: '2024-06-01T10:01:00Z',
};

const mockUsePaymentStatus = jest.fn(() => ({ data: undefined }));

jest.mock('../../api/hooks/usePayments', () => ({
  usePaymentStatus: (...args: unknown[]) => mockUsePaymentStatus(...args),
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
import ReservationDetailScreen from './ReservationDetailScreen';

describe('ReservationDetailScreen', () => {
  beforeEach(() => {
    mockUseBookingDetail.mockReturnValue({ data: mockReservation, isLoading: false });
    mockUsePaymentStatus.mockReturnValue({ data: undefined });
  });

  it('renders without crashing', () => {
    const { toJSON } = render(
      <LocaleProvider>
        <ReservationDetailScreen />
      </LocaleProvider>
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders hotel name from API (not UUID)', () => {
    const { getByText } = render(
      <LocaleProvider>
        <ReservationDetailScreen />
      </LocaleProvider>
    );
    expect(getByText('Grand Hyatt Bogotá')).toBeTruthy();
  });

  it('renders room name from API', () => {
    const { getByText } = render(
      <LocaleProvider>
        <ReservationDetailScreen />
      </LocaleProvider>
    );
    expect(getByText('Deluxe King Room')).toBeTruthy();
  });

  it('renders location from API', () => {
    const { getByText } = render(
      <LocaleProvider>
        <ReservationDetailScreen />
      </LocaleProvider>
    );
    expect(getByText('Bogotá, Colombia')).toBeTruthy();
  });

  it('renders nights count from API', () => {
    const { getByText } = render(
      <LocaleProvider>
        <ReservationDetailScreen />
      </LocaleProvider>
    );
    // t() returns the key with interpolated values via identity mock
    expect(getByText('reservationDetail.nights')).toBeTruthy();
  });

  it('uses priceBreakdown when available', () => {
    const { getByText } = render(
      <LocaleProvider>
        <ReservationDetailScreen />
      </LocaleProvider>
    );
    // PriceBreakdown row labels are rendered via t() keys
    expect(getByText('reservationDetail.taxes')).toBeTruthy();
    expect(getByText('reservationDetail.totalPaid')).toBeTruthy();
  });

  // QR button visibility tests
  it('shows QR button when booking status is confirmed', () => {
    mockUseBookingDetail.mockReturnValue({
      data: { ...mockReservation, status: 'confirmed' as const },
      isLoading: false,
    });
    const { getByText } = render(
      <LocaleProvider>
        <ReservationDetailScreen />
      </LocaleProvider>
    );
    expect(getByText('reservationDetail.showQR')).toBeTruthy();
  });

  it('hides QR button when booking status is pending', () => {
    mockUseBookingDetail.mockReturnValue({
      data: { ...mockReservation, status: 'pending' as const },
      isLoading: false,
    });
    const { queryByText } = render(
      <LocaleProvider>
        <ReservationDetailScreen />
      </LocaleProvider>
    );
    expect(queryByText('reservationDetail.showQR')).toBeNull();
  });

  it('hides QR button when booking status is cancelled', () => {
    mockUseBookingDetail.mockReturnValue({
      data: { ...mockReservation, status: 'cancelled' as const },
      isLoading: false,
    });
    const { queryByText } = render(
      <LocaleProvider>
        <ReservationDetailScreen />
      </LocaleProvider>
    );
    expect(queryByText('reservationDetail.showQR')).toBeNull();
  });

  // Payment section tests
  it('shows payment pending when no payment data is available', () => {
    mockUsePaymentStatus.mockReturnValue({ data: undefined });
    const { getByText } = render(
      <LocaleProvider>
        <ReservationDetailScreen />
      </LocaleProvider>
    );
    expect(getByText('reservationDetail.paymentPending')).toBeTruthy();
  });

  it('renders payment method display label when payment data is available', () => {
    mockUsePaymentStatus.mockReturnValue({ data: mockPayment });
    const { getByText } = render(
      <LocaleProvider>
        <ReservationDetailScreen />
      </LocaleProvider>
    );
    expect(getByText('Visa **** 4242')).toBeTruthy();
  });

  it('shows approved status text when payment is approved', () => {
    mockUsePaymentStatus.mockReturnValue({ data: mockPayment });
    const { getByText } = render(
      <LocaleProvider>
        <ReservationDetailScreen />
      </LocaleProvider>
    );
    expect(getByText('reservationDetail.paymentApproved')).toBeTruthy();
  });

  it('shows processing status text when payment is processing', () => {
    mockUsePaymentStatus.mockReturnValue({
      data: { ...mockPayment, status: 'processing' as const, processedAt: null },
    });
    const { getByText } = render(
      <LocaleProvider>
        <ReservationDetailScreen />
      </LocaleProvider>
    );
    expect(getByText('reservationDetail.paymentProcessing')).toBeTruthy();
  });

  it('shows declined status text when payment is declined', () => {
    mockUsePaymentStatus.mockReturnValue({
      data: { ...mockPayment, status: 'declined' as const },
    });
    const { getByText } = render(
      <LocaleProvider>
        <ReservationDetailScreen />
      </LocaleProvider>
    );
    expect(getByText('reservationDetail.paymentDeclined')).toBeTruthy();
  });

  it('renders credit-card icon section header for card payments', () => {
    mockUsePaymentStatus.mockReturnValue({ data: mockPayment });
    const { getByText } = render(
      <LocaleProvider>
        <ReservationDetailScreen />
      </LocaleProvider>
    );
    // Section header key is rendered twice (title + meta label) — both should be present
    expect(getByText('reservationDetail.paymentAmount')).toBeTruthy();
  });

  it('always shows cancel button regardless of status', () => {
    const statuses = ['confirmed', 'pending', 'cancelled'] as const;

    statuses.forEach(status => {
      mockUseBookingDetail.mockReturnValue({
        data: { ...mockReservation, status },
        isLoading: false,
      });
      const { getByText, unmount } = render(
        <LocaleProvider>
          <ReservationDetailScreen />
        </LocaleProvider>
      );
      expect(getByText('reservationDetail.cancelReservation')).toBeTruthy();
      unmount();
    });
  });

  // Next steps section tests
  describe('BookingNextSteps section', () => {
    it('renders next steps title', () => {
      const { getByText } = render(
        <LocaleProvider>
          <ReservationDetailScreen />
        </LocaleProvider>
      );
      expect(getByText('reservationDetail.nextSteps.title')).toBeTruthy();
    });

    it('shows email and confirmed step for confirmed status', () => {
      mockUseBookingDetail.mockReturnValue({
        data: { ...mockReservation, status: 'confirmed' as const },
        isLoading: false,
      });
      const { getByText } = render(
        <LocaleProvider>
          <ReservationDetailScreen />
        </LocaleProvider>
      );
      expect(getByText('reservationDetail.nextSteps.emailSent')).toBeTruthy();
      expect(getByText('reservationDetail.nextSteps.confirmedTitle')).toBeTruthy();
    });

    it('shows email and pending step for pending status', () => {
      mockUseBookingDetail.mockReturnValue({
        data: { ...mockReservation, status: 'pending' as const },
        isLoading: false,
      });
      const { getByText } = render(
        <LocaleProvider>
          <ReservationDetailScreen />
        </LocaleProvider>
      );
      expect(getByText('reservationDetail.nextSteps.emailSent')).toBeTruthy();
      expect(getByText('reservationDetail.nextSteps.pendingTitle')).toBeTruthy();
    });

    it('shows rejected step for rejected status', () => {
      mockUseBookingDetail.mockReturnValue({
        data: { ...mockReservation, status: 'rejected' as const },
        isLoading: false,
      });
      const { getByText } = render(
        <LocaleProvider>
          <ReservationDetailScreen />
        </LocaleProvider>
      );
      expect(getByText('reservationDetail.nextSteps.rejectedTitle')).toBeTruthy();
    });

    it('shows cancelled step for cancelled status', () => {
      mockUseBookingDetail.mockReturnValue({
        data: { ...mockReservation, status: 'cancelled' as const },
        isLoading: false,
      });
      const { getByText } = render(
        <LocaleProvider>
          <ReservationDetailScreen />
        </LocaleProvider>
      );
      expect(getByText('reservationDetail.nextSteps.cancelledTitle')).toBeTruthy();
    });

    it('does not show email step for rejected status', () => {
      mockUseBookingDetail.mockReturnValue({
        data: { ...mockReservation, status: 'rejected' as const },
        isLoading: false,
      });
      const { queryByText } = render(
        <LocaleProvider>
          <ReservationDetailScreen />
        </LocaleProvider>
      );
      expect(queryByText('reservationDetail.nextSteps.emailSent')).toBeNull();
    });

    it('does not show email step for cancelled status', () => {
      mockUseBookingDetail.mockReturnValue({
        data: { ...mockReservation, status: 'cancelled' as const },
        isLoading: false,
      });
      const { queryByText } = render(
        <LocaleProvider>
          <ReservationDetailScreen />
        </LocaleProvider>
      );
      expect(queryByText('reservationDetail.nextSteps.emailSent')).toBeNull();
    });
  });
});

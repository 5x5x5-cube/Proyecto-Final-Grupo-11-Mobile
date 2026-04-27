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

const mockTokenizeMutate = jest.fn();
const mockInitiatePaymentMutate = jest.fn();

jest.mock('../../api/hooks/useCart', () => ({
  useCart: () => ({ data: null, isLoading: true }),
}));

jest.mock('../../api/hooks/usePayments', () => ({
  useTokenize: () => ({ mutate: mockTokenizeMutate, isPending: false }),
  useInitiatePayment: () => ({ mutate: mockInitiatePaymentMutate, isPending: false }),
  usePaymentStatus: () => ({ data: undefined, isSuccess: false }),
}));

// Mock form sub-components to simplify PaymentScreen tests
jest.mock('../../modules/checkout/CardForm', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: ({ disabled }: { disabled?: boolean }) =>
      React.createElement('View', { testID: 'card-form', accessibilityState: { disabled } }),
  };
});

jest.mock('../../modules/checkout/WalletForm', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: ({ disabled }: { disabled?: boolean }) =>
      React.createElement('View', { testID: 'wallet-form', accessibilityState: { disabled } }),
  };
});

jest.mock('../../modules/checkout/TransferForm', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: ({ disabled }: { disabled?: boolean }) =>
      React.createElement('View', { testID: 'transfer-form', accessibilityState: { disabled } }),
  };
});

jest.mock('../../modules/checkout/HoldCountdown', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: () => React.createElement('View', { testID: 'hold-countdown' }),
  };
});

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { LocaleProvider } from '../../contexts/LocaleContext';
import PaymentScreen from './PaymentScreen';

function renderScreen() {
  return render(
    <LocaleProvider>
      <PaymentScreen />
    </LocaleProvider>
  );
}

describe('PaymentScreen', () => {
  it('renders loading spinner when cart is loading', () => {
    const { toJSON } = renderScreen();
    expect(toJSON()).toBeTruthy();
  });
});

// ── Tests with cart data loaded ───────────────────────────────────────────────

jest.mock('../../api/hooks/useCart', () => ({
  useCart: () => ({
    data: {
      id: 'cart-1',
      hotelName: 'Hotel Test',
      checkIn: '2026-05-01',
      checkOut: '2026-05-03',
      holdExpiresAt: null,
      pricing: { total: 250 },
      priceBreakdown: null,
    },
    isLoading: false,
  }),
}));

describe('PaymentScreen with cart data', () => {
  it('renders without crashing', () => {
    const { toJSON } = renderScreen();
    expect(toJSON()).toBeTruthy();
  });

  it('shows CardForm by default (credit card selected)', () => {
    const { getByTestId, queryByTestId } = renderScreen();
    expect(getByTestId('card-form')).toBeTruthy();
    expect(queryByTestId('wallet-form')).toBeNull();
    expect(queryByTestId('transfer-form')).toBeNull();
  });

  it('shows WalletForm when wallet method is selected', () => {
    const { getByText, getByTestId, queryByTestId } = renderScreen();
    fireEvent.press(getByText('payment.digitalWallet'));
    expect(getByTestId('wallet-form')).toBeTruthy();
    expect(queryByTestId('card-form')).toBeNull();
    expect(queryByTestId('transfer-form')).toBeNull();
  });

  it('shows TransferForm when transfer method is selected', () => {
    const { getByText, getByTestId, queryByTestId } = renderScreen();
    fireEvent.press(getByText('payment.transfer'));
    expect(getByTestId('transfer-form')).toBeTruthy();
    expect(queryByTestId('card-form')).toBeNull();
    expect(queryByTestId('wallet-form')).toBeNull();
  });

  it('shows CardForm when debit card method is selected', () => {
    const { getByText, getByTestId, queryByTestId } = renderScreen();
    fireEvent.press(getByText('payment.debitCard'));
    expect(getByTestId('card-form')).toBeTruthy();
    expect(queryByTestId('wallet-form')).toBeNull();
    expect(queryByTestId('transfer-form')).toBeNull();
  });

  it('renders all four payment method tabs', () => {
    const { getByText } = renderScreen();
    expect(getByText('payment.creditCard')).toBeTruthy();
    expect(getByText('payment.debitCard')).toBeTruthy();
    expect(getByText('payment.digitalWallet')).toBeTruthy();
    expect(getByText('payment.transfer')).toBeTruthy();
  });

  it('renders the hotel summary card', () => {
    const { getByText } = renderScreen();
    expect(getByText('Hotel Test')).toBeTruthy();
  });

  it('renders the pay button', () => {
    const { getByText } = renderScreen();
    // Button title uses translation key with amount — key returned as-is by mock t()
    expect(getByText('payment.payButton')).toBeTruthy();
  });
});

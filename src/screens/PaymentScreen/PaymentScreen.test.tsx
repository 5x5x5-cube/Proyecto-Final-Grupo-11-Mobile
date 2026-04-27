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

jest.mock('../../api/hooks/useCart', () => ({
  useCart: () => ({ data: null, isLoading: true }),
}));

jest.mock('../../api/hooks/usePayments', () => ({
  useTokenize: () => ({ mutate: jest.fn(), isPending: false }),
  useInitiatePayment: () => ({ mutate: jest.fn(), isPending: false }),
  usePaymentStatus: () => ({ data: undefined, isSuccess: false }),
}));

import React from 'react';
import { render } from '@testing-library/react-native';
import { LocaleProvider } from '../../contexts/LocaleContext';
import PaymentScreen from './PaymentScreen';

describe('PaymentScreen', () => {
  it('renders without crashing', () => {
    const { toJSON } = render(
      <LocaleProvider>
        <PaymentScreen />
      </LocaleProvider>
    );
    expect(toJSON()).toBeTruthy();
  });
});

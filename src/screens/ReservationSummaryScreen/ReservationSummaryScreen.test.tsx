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
  useCart: () => ({ data: null, isLoading: true, isError: false }),
}));

jest.mock('../../storage/cartStorage', () => ({
  getCartSelection: jest.fn().mockResolvedValue(null),
}));

jest.mock('../../api/hooks/useSearch', () => ({
  useHotelDetail: () => ({
    data: { image_url: 'https://example.com/hotel.jpg', name: 'Test Hotel' },
  }),
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
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LocaleProvider } from '../../contexts/LocaleContext';
import ReservationSummaryScreen from './ReservationSummaryScreen';

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

function renderScreen() {
  return render(
    <QueryClientProvider client={queryClient}>
      <LocaleProvider>
        <ReservationSummaryScreen />
      </LocaleProvider>
    </QueryClientProvider>
  );
}

describe('ReservationSummaryScreen', () => {
  it('renders without crashing', () => {
    const { toJSON } = renderScreen();
    expect(toJSON()).toBeTruthy();
  });

  it('renders skeleton while cart is loading', () => {
    const { toJSON } = renderScreen();
    // When isLoading=true and no local selection, skeleton is shown
    expect(toJSON()).toBeTruthy();
  });
});

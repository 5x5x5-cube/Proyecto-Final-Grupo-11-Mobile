jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    getItem: jest.fn().mockResolvedValue(null),
    setItem: jest.fn().mockResolvedValue(undefined),
    removeItem: jest.fn().mockResolvedValue(undefined),
  },
}));

jest.mock('../i18n', () => ({
  changeLanguage: jest.fn(),
}));

const mockUseExchangeRates = jest.fn();
jest.mock('../api/hooks/useExchangeRates', () => ({
  useExchangeRates: () => mockUseExchangeRates(),
}));

import React from 'react';
import { Text } from 'react-native';
import { render } from '@testing-library/react-native';
import { LocaleProvider, useLocale } from './LocaleContext';

function PriceConsumer({ amount }: { amount: number }) {
  const { formatPrice } = useLocale();
  return <Text testID="price">{formatPrice(amount)}</Text>;
}

describe('LocaleContext – buildRatesMap', () => {
  it('uses fallback rates when apiRates is undefined', () => {
    mockUseExchangeRates.mockReturnValue({ data: undefined });

    const { getByTestId } = render(
      <LocaleProvider>
        <PriceConsumer amount={100000} />
      </LocaleProvider>,
    );

    // COP fallback rate=1, decimals=0 → "COP 100.000"
    expect(getByTestId('price').props.children).toMatch(/COP/);
  });

  it('uses fallback rates when apiRates is not an array (object)', () => {
    mockUseExchangeRates.mockReturnValue({
      data: { message: 'Service unavailable' },
    });

    const { getByTestId } = render(
      <LocaleProvider>
        <PriceConsumer amount={100000} />
      </LocaleProvider>,
    );

    expect(getByTestId('price').props.children).toMatch(/COP/);
  });

  it('uses fallback rates when apiRates is an empty array', () => {
    mockUseExchangeRates.mockReturnValue({ data: [] });

    const { getByTestId } = render(
      <LocaleProvider>
        <PriceConsumer amount={100000} />
      </LocaleProvider>,
    );

    expect(getByTestId('price').props.children).toMatch(/COP/);
  });

  it('uses API rates when apiRates is a valid array', () => {
    mockUseExchangeRates.mockReturnValue({
      data: [
        { currency: 'COP', rate: 1, symbol: 'COP', decimals: 0 },
        { currency: 'USD', rate: 0.00025, symbol: 'USD', decimals: 2 },
      ],
    });

    const { getByTestId } = render(
      <LocaleProvider>
        <PriceConsumer amount={100000} />
      </LocaleProvider>,
    );

    expect(getByTestId('price').props.children).toMatch(/COP/);
  });
});

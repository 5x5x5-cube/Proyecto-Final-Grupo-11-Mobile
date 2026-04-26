/* eslint-env jest */
/* eslint-disable no-undef */
// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock exchange rates hook (used by LocaleProvider)
jest.mock('./src/api/hooks/useExchangeRates', () => ({
  useExchangeRates: () => ({ data: undefined, isLoading: false }),
}));

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
    params: {
      bookingCode: 'TH-2026-00001',
      hotelName: 'Test Hotel',
      checkIn: '2026-03-20',
      checkOut: '2026-03-25',
    },
  }),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

jest.mock('../../i18n', () => ({
  changeLanguage: jest.fn(),
}));

import React from 'react';
import { render } from '@testing-library/react-native';
import { LocaleProvider } from '../../contexts/LocaleContext';
import SuccessScreen from './SuccessScreen';

describe('SuccessScreen', () => {
  it('renders without crashing', () => {
    const { toJSON } = render(
      <LocaleProvider>
        <SuccessScreen />
      </LocaleProvider>
    );
    expect(toJSON()).toBeTruthy();
  });
});

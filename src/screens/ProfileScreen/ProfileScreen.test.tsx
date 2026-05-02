const mockLogout = jest.fn();

jest.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({
    logout: mockLogout,
    login: jest.fn(),
    isAuthenticated: true,
    isLoading: false,
    user: {
      id: 'user-1',
      name: 'Test User',
      email: 'test@test.com',
      phone: '+1 555 0000',
      initials: 'TU',
    },
  }),
}));

jest.mock('expo-constants', () => ({
  __esModule: true,
  default: {
    expoConfig: { version: '0.2.0' },
  },
}));

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

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { LocaleProvider } from '../../contexts/LocaleContext';
import ProfileScreen from './ProfileScreen';

describe('ProfileScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    const { toJSON } = render(
      <LocaleProvider>
        <ProfileScreen />
      </LocaleProvider>
    );
    expect(toJSON()).toBeTruthy();
  });

  it('calls auth.logout when logout button is pressed', () => {
    const { getByText } = render(
      <LocaleProvider>
        <ProfileScreen />
      </LocaleProvider>
    );

    fireEvent.press(getByText('profile.logout'));

    expect(mockLogout).toHaveBeenCalledTimes(1);
  });
});

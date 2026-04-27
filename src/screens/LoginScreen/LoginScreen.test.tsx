const mockLogin = jest.fn();

jest.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({
    login: mockLogin,
    logout: jest.fn(),
    user: null,
    isAuthenticated: false,
    isLoading: false,
  }),
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

const mockMutate = jest.fn();

jest.mock('../../api/hooks/useAuth', () => ({
  useLogin: () => ({ mutate: mockMutate, isPending: false }),
}));

import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LocaleProvider } from '../../contexts/LocaleContext';
import LoginScreen from './LoginScreen';

describe('LoginScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    const { toJSON } = render(
      <LocaleProvider>
        <LoginScreen />
      </LocaleProvider>
    );
    expect(toJSON()).toBeTruthy();
  });

  it('calls auth.login on successful login, not AsyncStorage.setItem directly', async () => {
    mockMutate.mockImplementation((_payload: any, options: any) => {
      options?.onSuccess?.({ access_token: 'tok-abc', user_id: 'user-42' });
    });

    const { getByPlaceholderText, getByText } = render(
      <LocaleProvider>
        <LoginScreen />
      </LocaleProvider>
    );

    fireEvent.changeText(getByPlaceholderText('login.emailPlaceholder'), 'user@example.com');
    fireEvent.changeText(getByPlaceholderText('login.passwordPlaceholder'), 'secret123');

    await act(async () => {
      fireEvent.press(getByText('login.button'));
    });

    expect(mockLogin).toHaveBeenCalledWith('tok-abc', 'user-42', expect.objectContaining({}));
    expect(AsyncStorage.setItem).not.toHaveBeenCalled();
  });
});

jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    getItem: jest.fn().mockResolvedValue(null),
    setItem: jest.fn().mockResolvedValue(undefined),
    removeItem: jest.fn().mockResolvedValue(undefined),
  },
}));

jest.mock('../contexts/AuthContext', () => {
  const actual = jest.requireActual('../contexts/AuthContext');
  return {
    ...actual,
    useAuth: jest.fn(),
  };
});

jest.mock('./AppNavigator', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: () => React.createElement('View', { testID: 'app-navigator' }),
  };
});

jest.mock('./AuthNavigator', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: () => React.createElement('View', { testID: 'auth-navigator' }),
  };
});

jest.mock('../screens/SplashScreen', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: () => React.createElement('View', { testID: 'splash-screen' }),
  };
});

import React from 'react';
import { render } from '@testing-library/react-native';
import RootNavigator from './RootNavigator';
import { useAuth } from '../contexts/AuthContext';

const mockUseAuth = useAuth as jest.Mock;

describe('RootNavigator', () => {
  it('shows SplashScreen while loading', () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: false, isLoading: true });
    const { getByTestId } = render(<RootNavigator />);
    expect(getByTestId('splash-screen')).toBeTruthy();
  });

  it('shows AuthNavigator when not authenticated', () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: false, isLoading: false });
    const { getByTestId, queryByTestId } = render(<RootNavigator />);
    expect(getByTestId('auth-navigator')).toBeTruthy();
    expect(queryByTestId('app-navigator')).toBeNull();
  });

  it('shows AppNavigator when authenticated', () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: true, isLoading: false });
    const { getByTestId, queryByTestId } = render(<RootNavigator />);
    expect(getByTestId('app-navigator')).toBeTruthy();
    expect(queryByTestId('auth-navigator')).toBeNull();
  });
});

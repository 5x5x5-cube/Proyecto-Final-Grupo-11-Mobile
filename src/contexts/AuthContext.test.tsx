jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    getItem: jest.fn().mockResolvedValue(null),
    setItem: jest.fn().mockResolvedValue(undefined),
    removeItem: jest.fn().mockResolvedValue(undefined),
  },
}));

import React from 'react';
import { Text } from 'react-native';
import { render } from '@testing-library/react-native';
import { AuthProvider, useAuth } from './AuthContext';

function TestConsumer() {
  const { user, isAuthenticated } = useAuth();
  return (
    <>
      <Text testID="name">{user.name}</Text>
      <Text testID="email">{user.email}</Text>
      <Text testID="initials">{user.initials}</Text>
      <Text testID="auth">{String(isAuthenticated)}</Text>
    </>
  );
}

describe('AuthContext', () => {
  it('provides mock user data', () => {
    const { getByTestId } = render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    expect(getByTestId('name').props.children).toBe('Carlos Martinez');
    expect(getByTestId('email').props.children).toBe('carlos.martinez@email.com');
    expect(getByTestId('initials').props.children).toBe('CM');
    expect(getByTestId('auth').props.children).toBe('true');
  });
});

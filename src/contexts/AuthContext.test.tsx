jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    getItem: jest.fn().mockResolvedValue(null),
    setItem: jest.fn().mockResolvedValue(undefined),
    removeItem: jest.fn().mockResolvedValue(undefined),
    multiRemove: jest.fn().mockResolvedValue(undefined),
  },
}));

import React from 'react';
import { Text } from 'react-native';
import { render, waitFor, act } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthProvider, useAuth } from './AuthContext';

function TestConsumer() {
  const { user, isAuthenticated, isLoading } = useAuth();
  return (
    <>
      <Text testID="name">{user?.name ?? ''}</Text>
      <Text testID="email">{user?.email ?? ''}</Text>
      <Text testID="auth">{String(isAuthenticated)}</Text>
      <Text testID="loading">{String(isLoading)}</Text>
    </>
  );
}

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('starts unauthenticated when AsyncStorage has no token', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

    const { getByTestId } = render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(getByTestId('loading').props.children).toBe('false');
    });

    expect(getByTestId('auth').props.children).toBe('false');
    expect(getByTestId('name').props.children).toBe('');
  });

  it('restores authenticated state when token and user_id exist in AsyncStorage', async () => {
    (AsyncStorage.getItem as jest.Mock).mockImplementation((key: string) => {
      if (key === 'auth_token') return Promise.resolve('test-token');
      if (key === 'user_id') return Promise.resolve('user-123');
      return Promise.resolve(null);
    });

    const { getByTestId } = render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(getByTestId('loading').props.children).toBe('false');
    });

    expect(getByTestId('auth').props.children).toBe('true');
  });

  it('login saves token and updates auth state', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

    function LoginConsumer() {
      const { isAuthenticated, login, isLoading } = useAuth();
      return (
        <>
          <Text testID="auth">{String(isAuthenticated)}</Text>
          <Text testID="loading">{String(isLoading)}</Text>
          <Text
            testID="loginBtn"
            onPress={() => login('tok', 'u1', { email: 'a@b.com', name: 'Alice' })}
          />
        </>
      );
    }

    const { getByTestId } = render(
      <AuthProvider>
        <LoginConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(getByTestId('loading').props.children).toBe('false');
    });

    await act(async () => {
      getByTestId('loginBtn').props.onPress();
    });

    expect(getByTestId('auth').props.children).toBe('true');
    expect(AsyncStorage.setItem).toHaveBeenCalledWith('auth_token', 'tok');
    expect(AsyncStorage.setItem).toHaveBeenCalledWith('user_id', 'u1');
  });

  it('logout clears token and sets user to null', async () => {
    (AsyncStorage.getItem as jest.Mock).mockImplementation((key: string) => {
      if (key === 'auth_token') return Promise.resolve('tok');
      if (key === 'user_id') return Promise.resolve('u1');
      return Promise.resolve(null);
    });

    function LogoutConsumer() {
      const { isAuthenticated, logout, isLoading } = useAuth();
      return (
        <>
          <Text testID="auth">{String(isAuthenticated)}</Text>
          <Text testID="loading">{String(isLoading)}</Text>
          <Text testID="logoutBtn" onPress={() => logout()} />
        </>
      );
    }

    const { getByTestId } = render(
      <AuthProvider>
        <LogoutConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(getByTestId('loading').props.children).toBe('false');
      expect(getByTestId('auth').props.children).toBe('true');
    });

    await act(async () => {
      getByTestId('logoutBtn').props.onPress();
    });

    expect(getByTestId('auth').props.children).toBe('false');
    expect(AsyncStorage.multiRemove).toHaveBeenCalledWith([
      'auth_token',
      'user_id',
      'user_name',
      'user_email',
    ]);
  });

  it('login stores and exposes user name and email', async () => {
    function UserConsumer() {
      const { user, login, isLoading } = useAuth();
      return (
        <>
          <Text testID="loading">{String(isLoading)}</Text>
          <Text testID="name">{user?.name ?? ''}</Text>
          <Text testID="email">{user?.email ?? ''}</Text>
          <Text
            testID="loginBtn"
            onPress={() => login('tok', 'u1', { name: 'Ronald', email: 'ronald@test.com' })}
          />
        </>
      );
    }

    const { getByTestId } = render(
      <AuthProvider>
        <UserConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(getByTestId('loading').props.children).toBe('false');
    });

    await act(async () => {
      getByTestId('loginBtn').props.onPress();
    });

    expect(getByTestId('name').props.children).toBe('Ronald');
    expect(getByTestId('email').props.children).toBe('ronald@test.com');
    expect(AsyncStorage.setItem).toHaveBeenCalledWith('user_name', 'Ronald');
    expect(AsyncStorage.setItem).toHaveBeenCalledWith('user_email', 'ronald@test.com');
  });

  it('computes initials from user name', async () => {
    function InitialsConsumer() {
      const { user, login, isLoading } = useAuth();
      return (
        <>
          <Text testID="loading">{String(isLoading)}</Text>
          <Text testID="initials">{user?.initials ?? ''}</Text>
          <Text testID="loginBtn" onPress={() => login('tok', 'u1', { name: 'Carlos Martinez' })} />
        </>
      );
    }

    const { getByTestId } = render(
      <AuthProvider>
        <InitialsConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(getByTestId('loading').props.children).toBe('false');
    });

    await act(async () => {
      getByTestId('loginBtn').props.onPress();
    });

    expect(getByTestId('initials').props.children).toBe('CM');
  });

  it('restores user name and email from AsyncStorage on mount', async () => {
    (AsyncStorage.getItem as jest.Mock).mockImplementation((key: string) => {
      if (key === 'auth_token') return Promise.resolve('tok');
      if (key === 'user_id') return Promise.resolve('u1');
      if (key === 'user_name') return Promise.resolve('Ana Lopez');
      if (key === 'user_email') return Promise.resolve('ana@test.com');
      return Promise.resolve(null);
    });

    function RestoreConsumer() {
      const { user, isLoading } = useAuth();
      return (
        <>
          <Text testID="loading">{String(isLoading)}</Text>
          <Text testID="name">{user?.name ?? ''}</Text>
          <Text testID="email">{user?.email ?? ''}</Text>
          <Text testID="initials">{user?.initials ?? ''}</Text>
        </>
      );
    }

    const { getByTestId } = render(
      <AuthProvider>
        <RestoreConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(getByTestId('loading').props.children).toBe('false');
    });

    expect(getByTestId('name').props.children).toBe('Ana Lopez');
    expect(getByTestId('email').props.children).toBe('ana@test.com');
    expect(getByTestId('initials').props.children).toBe('AL');
  });
});

jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    getItem: jest.fn().mockResolvedValue(null),
    setItem: jest.fn().mockResolvedValue(undefined),
    removeItem: jest.fn().mockResolvedValue(undefined),
  },
}));

jest.mock('../../httpClient', () => ({
  httpClient: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  },
}));

jest.mock('../../../storage/cartStorage', () => ({
  clearCartSelection: jest.fn().mockResolvedValue(undefined),
}));

import { renderHook, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { useCart, useSetCart, useClearCart } from '../useCart';
import { httpClient } from '../../httpClient';
import { clearCartSelection } from '../../../storage/cartStorage';
import type { Cart } from '../../../types/cart';

const mockGet = httpClient.get as jest.Mock;
const mockPut = httpClient.put as jest.Mock;
const mockDelete = httpClient.delete as jest.Mock;
const mockClearCartSelection = clearCartSelection as jest.Mock;

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const Wrapper = ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
  Wrapper.displayName = 'TestQueryProvider';
  return Wrapper;
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe('useCart', () => {
  it('calls GET /cart', async () => {
    const mockCart: Partial<Cart> = {
      id: 'cart-1',
      userId: 'user-1',
      roomId: 'room-1',
      hotelId: 'hotel-1',
    };
    mockGet.mockResolvedValueOnce(mockCart);

    const { result } = renderHook(() => useCart(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockGet).toHaveBeenCalledWith('/cart');
    expect(result.current.data).toEqual(mockCart);
  });
});

describe('useSetCart', () => {
  it('calls PUT /cart with the provided data', async () => {
    const updatedCart: Partial<Cart> = { id: 'cart-1', roomId: 'room-2' };
    mockPut.mockResolvedValueOnce(updatedCart);

    const { result } = renderHook(() => useSetCart(), { wrapper: createWrapper() });

    result.current.mutate({
      roomId: 'room-2',
      hotelId: 'hotel-1',
      checkIn: '2026-04-10',
      checkOut: '2026-04-13',
      guests: 2,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockPut).toHaveBeenCalledWith('/cart', {
      body: {
        roomId: 'room-2',
        hotelId: 'hotel-1',
        checkIn: '2026-04-10',
        checkOut: '2026-04-13',
        guests: 2,
      },
    });
  });

  it('invalidates the cart query on success', async () => {
    mockPut.mockResolvedValueOnce({});

    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    const invalidateSpy = jest.spyOn(queryClient, 'invalidateQueries');

    const Wrapper = ({ children }: { children: React.ReactNode }) =>
      React.createElement(QueryClientProvider, { client: queryClient }, children);
    Wrapper.displayName = 'TestQueryProvider';

    const { result } = renderHook(() => useSetCart(), { wrapper: Wrapper });

    result.current.mutate({
      roomId: 'room-1',
      hotelId: 'hotel-1',
      checkIn: '2026-04-10',
      checkOut: '2026-04-13',
      guests: 2,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(invalidateSpy).toHaveBeenCalledWith(expect.objectContaining({ queryKey: ['cart'] }));
  });
});

describe('useClearCart', () => {
  it('calls DELETE /cart', async () => {
    mockDelete.mockResolvedValueOnce(undefined);

    const { result } = renderHook(() => useClearCart(), { wrapper: createWrapper() });

    result.current.mutate();

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockDelete).toHaveBeenCalledWith('/cart');
  });

  it('clears AsyncStorage cart selection on success', async () => {
    mockDelete.mockResolvedValueOnce(undefined);

    const { result } = renderHook(() => useClearCart(), { wrapper: createWrapper() });

    result.current.mutate();

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockClearCartSelection).toHaveBeenCalledTimes(1);
  });

  it('invalidates the cart query on success', async () => {
    mockDelete.mockResolvedValueOnce(undefined);

    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    const invalidateSpy = jest.spyOn(queryClient, 'invalidateQueries');

    const Wrapper = ({ children }: { children: React.ReactNode }) =>
      React.createElement(QueryClientProvider, { client: queryClient }, children);
    Wrapper.displayName = 'TestQueryProvider';

    const { result } = renderHook(() => useClearCart(), { wrapper: Wrapper });

    result.current.mutate();

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(invalidateSpy).toHaveBeenCalledWith(expect.objectContaining({ queryKey: ['cart'] }));
  });
});

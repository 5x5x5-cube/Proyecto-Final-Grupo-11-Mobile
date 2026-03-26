import { renderHook, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { useBookings, useBookingDetail, useCancelBooking, useBookingQR } from './useBookings';

jest.mock('../httpClient', () => ({
  httpClient: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  },
}));

import { httpClient } from '../httpClient';

const mockGet = httpClient.get as jest.Mock;
const mockPost = httpClient.post as jest.Mock;

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

describe('useBookings', () => {
  it('fetches bookings list', async () => {
    const mockData = {
      data: [{ id: '1', code: 'BK-001', status: 'pending' }],
      total: 1,
    };
    mockGet.mockResolvedValueOnce(mockData);

    const { result } = renderHook(() => useBookings(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockData);
    expect(mockGet).toHaveBeenCalledWith('/bookings');
  });
});

describe('useBookingDetail', () => {
  it('fetches a specific booking by ID', async () => {
    const mockBooking = { id: '1', code: 'BK-001', status: 'pending', totalPrice: 595000 };
    mockGet.mockResolvedValueOnce(mockBooking);

    const { result } = renderHook(() => useBookingDetail(1), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockBooking);
    expect(mockGet).toHaveBeenCalledWith('/bookings/1');
  });
});

describe('useBookingQR', () => {
  it('fetches QR code for a booking', async () => {
    const mockQR = { qrCode: 'base64...', bookingId: 42 };
    mockGet.mockResolvedValueOnce(mockQR);

    const { result } = renderHook(() => useBookingQR(42), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockQR);
    expect(mockGet).toHaveBeenCalledWith('/bookings/42/qr');
  });
});

describe('useCancelBooking', () => {
  it('posts cancel request and invalidates queries', async () => {
    mockPost.mockResolvedValueOnce({ status: 'cancelled' });

    const { result } = renderHook(() => useCancelBooking(), { wrapper: createWrapper() });

    result.current.mutate(42);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockPost).toHaveBeenCalledWith('/bookings/42/cancel');
  });
});

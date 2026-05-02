import { renderHook, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import {
  useBookings,
  useBookingDetail,
  useCancelBooking,
  useBookingQR,
  useCreateBooking,
} from './useBookings';

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
  it('unwraps { data, total } envelope from API', async () => {
    const mockData = {
      data: [{ id: '1', code: 'BK-001', status: 'pending' }],
      total: 1,
    };
    mockGet.mockResolvedValueOnce(mockData);

    const { result } = renderHook(() => useBookings(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockData.data);
    expect(mockGet).toHaveBeenCalledWith('/bookings', undefined);
  });

  it('handles plain array response from mock fallback', async () => {
    const mockArray = [{ id: '1', code: 'BK-001', status: 'pending' }];
    mockGet.mockResolvedValueOnce(mockArray);

    const { result } = renderHook(() => useBookings(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockArray);
  });
});

describe('useCreateBooking', () => {
  it('posts to /bookings with the booking data', async () => {
    const mockResponse = { id: '1', code: 'BK-NEW', status: 'pending' };
    mockPost.mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useCreateBooking(), { wrapper: createWrapper() });

    result.current.mutate({
      roomId: 'room-1',
      hotelId: 'hotel-1',
      checkIn: '2026-04-10',
      checkOut: '2026-04-13',
      guests: 2,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockPost).toHaveBeenCalledWith('/bookings', {
      body: {
        roomId: 'room-1',
        hotelId: 'hotel-1',
        checkIn: '2026-04-10',
        checkOut: '2026-04-13',
        guests: 2,
      },
    });
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

    expect(result.current.data).toEqual({ ...mockQR, isFromCache: false });
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

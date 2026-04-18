import { renderHook, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { useTokenizeCard, useInitiatePayment, usePaymentStatus } from './usePayments';

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

describe('useTokenizeCard', () => {
  it('posts card data to /gateway/tokenize and returns token', async () => {
    const mockResponse = {
      token: 'tok_mock_xxxx',
      cardLast4: '4242',
      cardBrand: 'Visa',
      expiresAt: '2026-04-16T12:00:00.000Z',
    };
    mockPost.mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useTokenizeCard(), { wrapper: createWrapper() });

    result.current.mutate({
      cardNumber: '4111111111114242',
      cardHolder: 'Carlos Martinez',
      expiry: '12/28',
      cvv: '123',
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockPost).toHaveBeenCalledWith('/gateway/tokenize', {
      body: {
        cardNumber: '4111111111114242',
        cardHolder: 'Carlos Martinez',
        expiry: '12/28',
        cvv: '123',
      },
    });
    expect(result.current.data).toEqual(mockResponse);
  });

  it('surfaces errors from the API', async () => {
    mockPost.mockRejectedValueOnce({ status: 422, data: { message: 'Invalid card' } });

    const { result } = renderHook(() => useTokenizeCard(), { wrapper: createWrapper() });

    result.current.mutate({
      cardNumber: '0000000000000000',
      cardHolder: 'Test User',
      expiry: '01/25',
      cvv: '000',
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toMatchObject({ status: 422 });
  });
});

describe('useInitiatePayment', () => {
  it('posts token payload to /payments/initiate and returns paymentId', async () => {
    const mockResponse = { paymentId: 'pay-001', status: 'processing' };
    mockPost.mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useInitiatePayment(), { wrapper: createWrapper() });

    result.current.mutate({
      token: 'tok_mock_xxxx',
      cartId: 'cart-mock-001',
      method: 'credit',
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockPost).toHaveBeenCalledWith('/payments/initiate', {
      body: {
        token: 'tok_mock_xxxx',
        cartId: 'cart-mock-001',
        method: 'credit',
      },
    });
    expect(result.current.data).toEqual(mockResponse);
  });

  it('does not include raw card data in the request body', async () => {
    mockPost.mockResolvedValueOnce({ paymentId: 'pay-002', status: 'processing' });

    const { result } = renderHook(() => useInitiatePayment(), { wrapper: createWrapper() });

    result.current.mutate({
      token: 'tok_abc',
      cartId: 'cart-mock-002',
      method: 'debit',
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    const calledBody = mockPost.mock.calls[0][1].body;
    expect(calledBody).not.toHaveProperty('cardNumber');
    expect(calledBody).not.toHaveProperty('cardHolder');
    expect(calledBody).not.toHaveProperty('cvv');
    expect(calledBody).not.toHaveProperty('expiry');
  });
});

describe('usePaymentStatus', () => {
  it('is disabled when paymentId is null', () => {
    const { result } = renderHook(() => usePaymentStatus(null), { wrapper: createWrapper() });

    expect(result.current.fetchStatus).toBe('idle');
    expect(mockGet).not.toHaveBeenCalled();
  });

  it('fetches payment status from /payments/:id when paymentId is set', async () => {
    const mockStatus = { paymentId: 'pay-001', status: 'approved', bookingCode: 'BK-MOCK001' };
    mockGet.mockResolvedValueOnce(mockStatus);

    const { result } = renderHook(() => usePaymentStatus('pay-001'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockGet).toHaveBeenCalledWith('/payments/pay-001');
    expect(result.current.data).toEqual(mockStatus);
  });

  it('returns processing status while payment is in flight', async () => {
    const processingStatus = { paymentId: 'pay-002', status: 'processing' };
    mockGet.mockResolvedValueOnce(processingStatus);

    const { result } = renderHook(() => usePaymentStatus('pay-002'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.status).toBe('processing');
  });

  it('returns declined status when payment is rejected', async () => {
    const declinedStatus = { paymentId: 'pay-003', status: 'declined' };
    mockGet.mockResolvedValueOnce(declinedStatus);

    const { result } = renderHook(() => usePaymentStatus('pay-003'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.status).toBe('declined');
  });
});

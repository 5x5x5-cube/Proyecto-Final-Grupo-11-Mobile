import { useMutation } from '@tanstack/react-query';
import { httpClient } from '../httpClient';

interface PaymentResponse {
  paymentId: string;
  status: string;
  bookingCode?: string;
}

export function useInitiatePayment() {
  return useMutation({
    mutationFn: (data: unknown) =>
      httpClient.post<PaymentResponse>('/payments/initiate', { body: data }),
  });
}

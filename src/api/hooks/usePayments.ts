import { useMutation, useQuery } from '@tanstack/react-query';
import { httpClient } from '../httpClient';

interface TokenizeCardInput {
  cardNumber: string;
  cardHolder: string;
  expiry: string;
  cvv: string;
}

interface TokenizeCardResponse {
  token: string;
  cardLast4: string;
  cardBrand: string;
  expiresAt: string;
}

interface InitiatePaymentInput {
  token: string;
  cartId: string;
  method: string;
}

interface InitiatePaymentResponse {
  paymentId: string;
  status: string;
}

export interface PaymentMethodDetail {
  id: string;
  methodType: string;
  displayLabel: string;
  cardLast4: string | null;
  cardBrand: string | null;
}

export interface PaymentStatusResponse {
  paymentId: string;
  status: 'processing' | 'approved' | 'declined';
  paymentMethod: PaymentMethodDetail;
  amount: number;
  currency: string;
  transactionId: string | null;
  message: string | null;
  createdAt: string;
  processedAt: string | null;
}

export function useTokenizeCard() {
  return useMutation({
    mutationFn: (data: TokenizeCardInput) =>
      httpClient.post<TokenizeCardResponse>('/gateway/tokenize', { body: data }),
  });
}

export function useInitiatePayment() {
  return useMutation({
    mutationFn: (data: InitiatePaymentInput) =>
      httpClient.post<InitiatePaymentResponse>('/payments/initiate', { body: data }),
  });
}

export function usePaymentStatus(paymentId: string | null) {
  return useQuery({
    queryKey: ['payment-status', paymentId],
    queryFn: () => httpClient.get<PaymentStatusResponse>(`/payments/${paymentId}`),
    enabled: !!paymentId,
    refetchInterval: query => {
      const data = query.state.data as PaymentStatusResponse | undefined;
      if (!data) return 1000;
      return data.status === 'processing' ? 1000 : false;
    },
  });
}

import { useMutation, useQuery } from '@tanstack/react-query';
import { httpClient } from '../httpClient';

// ─── Payment method type ────────────────────────────────────────────────────

export type PaymentMethod = 'credit_card' | 'debit_card' | 'digital_wallet' | 'transfer';

// ─── Tokenize ───────────────────────────────────────────────────────────────

export interface CardTokenizeRequest {
  method: 'credit_card' | 'debit_card';
  cardNumber: string;
  cardHolder: string;
  expiry: string;
  cvv: string;
}

export interface WalletTokenizeRequest {
  method: 'digital_wallet';
  walletProvider: string;
  walletEmail: string;
}

export interface TransferTokenizeRequest {
  method: 'transfer';
  bankCode: string;
  accountNumber: string;
  accountHolder: string;
}

export type TokenizeRequest = CardTokenizeRequest | WalletTokenizeRequest | TransferTokenizeRequest;

export interface TokenizeResponse {
  token: string;
  method: PaymentMethod;
  displayLabel: string;
  expiresAt: string;
  cardLast4: string | null;
  cardBrand: string | null;
  walletProvider: string | null;
  bankCode: string | null;
}

// ─── Initiate payment ───────────────────────────────────────────────────────

interface InitiatePaymentRequest {
  token: string;
  cartId: string;
  method: PaymentMethod;
  currency: string;
}

interface InitiatePaymentResponse {
  paymentId: string;
  status: string;
}

// ─── Payment status ─────────────────────────────────────────────────────────

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

// ─── Hooks ──────────────────────────────────────────────────────────────────

export function useTokenize() {
  return useMutation<TokenizeResponse, Error, TokenizeRequest>({
    mutationFn: data => httpClient.post('/gateway/tokenize', { body: data }),
  });
}

export function useInitiatePayment() {
  return useMutation<InitiatePaymentResponse, Error, InitiatePaymentRequest>({
    mutationFn: data =>
      httpClient.post<InitiatePaymentResponse>('/payments/initiate', { body: data }),
  });
}

export function usePaymentStatus(paymentId: string | null) {
  return useQuery<PaymentStatusResponse>({
    queryKey: ['payments', paymentId, 'status'],
    queryFn: () => httpClient.get<PaymentStatusResponse>(`/payments/${paymentId}`),
    enabled: !!paymentId,
    refetchInterval: query => {
      const status = query.state.data?.status;
      if (status === 'approved' || status === 'declined') return false;
      return 1000;
    },
  });
}

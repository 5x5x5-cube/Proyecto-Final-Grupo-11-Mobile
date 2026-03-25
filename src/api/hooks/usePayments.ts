import { useMutation } from '@tanstack/react-query';
import { httpClient } from '../httpClient';

export function useInitiatePayment() {
  return useMutation({
    mutationFn: (data: unknown) => httpClient.post('/payments/initiate', { body: data }),
  });
}

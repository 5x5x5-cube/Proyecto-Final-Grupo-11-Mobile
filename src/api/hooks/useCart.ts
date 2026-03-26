import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { httpClient } from '../httpClient';
import type { Cart, SetCartRequest } from '@/types/cart';
import { clearCartSelection } from '@/storage/cartStorage';

export function useCart() {
  return useQuery<Cart>({
    queryKey: ['cart'],
    queryFn: () => httpClient.get<Cart>('/cart'),
    retry: 2,
    retryDelay: 1000,
  });
}

export function useSetCart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: SetCartRequest) => httpClient.put<Cart>('/cart', { body: data }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] }),
  });
}

export function useClearCart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => httpClient.delete('/cart'),
    onSuccess: async () => {
      await clearCartSelection();
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
}

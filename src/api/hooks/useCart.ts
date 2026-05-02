import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { httpClient } from '../httpClient';
import type { Cart, CartPricing, NormalizedCart, SetCartRequest } from '@/types/cart';
import { EMPTY_PRICING } from '@/types/cart';
import { clearCartSelection } from '@/storage/cartStorage';

function normalizeCart(cart: Cart): NormalizedCart {
  const bp = cart.priceBreakdown;
  const pricePerNight = Number(bp?.pricePerNight ?? cart.pricePerNight ?? 0);
  const nights = bp?.nights ?? cart.nights ?? 0;
  const subtotal = Number(bp?.subtotal ?? cart.subtotal ?? 0);
  const taxes =
    Number(bp?.vat ?? cart.vat ?? 0) +
    Number(bp?.tourismTax ?? cart.tourismTax ?? 0) +
    Number(bp?.serviceFee ?? cart.serviceFee ?? 0);
  const total = Number(bp?.total ?? cart.total ?? 0);
  const currency = (bp?.currency as string) ?? 'COP';

  return { ...cart, pricing: { pricePerNight, nights, subtotal, taxes, total, currency } };
}

export function useCart() {
  const query = useQuery<Cart, Error, NormalizedCart>({
    queryKey: ['cart'],
    queryFn: () => httpClient.get<Cart>('/cart'),
    select: normalizeCart,
    retry: 2,
    retryDelay: 1000,
  });

  const pricing: CartPricing = query.data?.pricing ?? EMPTY_PRICING;

  return { ...query, pricing };
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

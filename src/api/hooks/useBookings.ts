import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { httpClient } from '../httpClient';

export function useBookings() {
  return useQuery({
    queryKey: ['bookings'],
    queryFn: () => httpClient.get('/bookings'),
  });
}

export function usePastBookings() {
  return useQuery({
    queryKey: ['bookings', 'past'],
    queryFn: () => httpClient.get('/bookings/past'),
  });
}

export function useCancelledBookings() {
  return useQuery({
    queryKey: ['bookings', 'cancelled'],
    queryFn: () => httpClient.get('/bookings/cancelled'),
  });
}

export function useBookingDetail(bookingId: number) {
  return useQuery({
    queryKey: ['bookings', bookingId],
    queryFn: () => httpClient.get(`/bookings/${bookingId}`),
  });
}

export function useBookingQR(bookingId: number) {
  return useQuery({
    queryKey: ['bookings', bookingId, 'qr'],
    queryFn: () => httpClient.get<{ qrCode: string; bookingId: number }>(`/bookings/${bookingId}/qr`),
  });
}

export function useCancelBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (bookingId: number) =>
      httpClient.post(`/bookings/${bookingId}/cancel`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
}

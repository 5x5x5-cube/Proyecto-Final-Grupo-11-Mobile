import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { httpClient } from '../httpClient';
import type { CreateBookingRequest } from '@/types/cart';

export interface BookingData {
  id: string;
  code: string;
  userId: string;
  hotelId: string;
  roomId: string;
  holdId: string;
  paymentId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  status: string;
  totalPrice: number;
  currency: string;
  createdAt: string;
}

interface BookingListResponse {
  data: BookingData[];
  total: number;
}

export function useBookingByPaymentId(paymentId: string | null) {
  return useQuery<BookingData | null>({
    queryKey: ['bookings', 'byPayment', paymentId],
    queryFn: async () => {
      const res = await httpClient.get<BookingListResponse>('/bookings', {
        params: { paymentId: paymentId! },
      });
      return res.data.length > 0 ? res.data[0] : null;
    },
    enabled: !!paymentId,
    refetchInterval: query => {
      if (query.state.data) return false;
      return 2000;
    },
  });
}

export function useBookings() {
  return useQuery<BookingData[]>({
    queryKey: ['bookings'],
    queryFn: async () => {
      const raw = await httpClient.get<BookingListResponse | BookingData[]>('/bookings');
      return Array.isArray(raw) ? raw : ((raw as BookingListResponse).data ?? []);
    },
  });
}

export function usePastBookings() {
  return useQuery<BookingData[]>({
    queryKey: ['bookings', 'past'],
    queryFn: async () => {
      const raw = await httpClient.get<BookingListResponse | BookingData[]>('/bookings');
      return Array.isArray(raw) ? raw : ((raw as BookingListResponse).data ?? []);
    },
  });
}

export function useCancelledBookings() {
  return useQuery<BookingData[]>({
    queryKey: ['bookings', 'cancelled'],
    queryFn: async () => {
      const raw = await httpClient.get<BookingListResponse | BookingData[]>('/bookings', {
        params: { status: 'cancelled' },
      });
      return Array.isArray(raw) ? raw : ((raw as BookingListResponse).data ?? []);
    },
  });
}

export function useBookingDetail(bookingId: number) {
  return useQuery({
    queryKey: ['bookings', bookingId],
    queryFn: () => httpClient.get(`/bookings/${bookingId}`),
  });
}

interface BookingQRData {
  qrCode: string;
  bookingId: string;
  guestName: string;
}

interface CachedQRData extends BookingQRData {
  cachedAt: string;
  expiresAt: string;
}

const QR_CACHE_PREFIX = 'qr_';
const QR_CACHE_DAYS = 7;

async function getQRFromCache(bookingId: number | string): Promise<BookingQRData | null> {
  try {
    const cacheKey = `${QR_CACHE_PREFIX}${bookingId}`;
    const cached = await AsyncStorage.getItem(cacheKey);
    if (!cached) return null;

    const data: CachedQRData = JSON.parse(cached);
    const now = new Date();
    const expiresAt = new Date(data.expiresAt);

    if (now > expiresAt) {
      await AsyncStorage.removeItem(cacheKey);
      return null;
    }

    return {
      qrCode: data.qrCode,
      bookingId: data.bookingId,
      guestName: data.guestName,
    };
  } catch {
    return null;
  }
}

async function saveQRToCache(bookingId: number | string, data: BookingQRData): Promise<void> {
  try {
    const cacheKey = `${QR_CACHE_PREFIX}${bookingId}`;
    const now = new Date();
    const expiresAt = new Date(now.getTime() + QR_CACHE_DAYS * 24 * 60 * 60 * 1000);

    const cachedData: CachedQRData = {
      ...data,
      cachedAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
    };

    await AsyncStorage.setItem(cacheKey, JSON.stringify(cachedData));
  } catch {
    // Ignore cache errors
  }
}

export function useBookingQR(bookingId: number) {
  return useQuery({
    queryKey: ['bookings', bookingId, 'qr'],
    queryFn: async () => {
      // Try cache first
      const cached = await getQRFromCache(bookingId);
      if (cached) {
        return { ...cached, isFromCache: true };
      }

      // Fetch from backend
      const data = await httpClient.get<BookingQRData>(`/bookings/${bookingId}/qr`);

      // Save to cache
      await saveQRToCache(bookingId, data);

      return { ...data, isFromCache: false };
    },
    staleTime: 1000 * 60 * 60 * 24 * 7, // 7 days
    gcTime: Infinity,
    retry: 1,
  });
}

export function useCancelBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (bookingId: number) => httpClient.post(`/bookings/${bookingId}/cancel`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
}

export function useCreateBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateBookingRequest) => httpClient.post('/bookings', { body: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
}

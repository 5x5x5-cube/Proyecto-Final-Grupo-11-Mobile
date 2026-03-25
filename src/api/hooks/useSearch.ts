import { useQuery } from '@tanstack/react-query';
import { httpClient } from '../httpClient';

export function useDestinations() {
  return useQuery({
    queryKey: ['destinations'],
    queryFn: () =>
      httpClient.get<
        Array<{
          name: string;
          country: string;
          hotelCount: number;
          gradient: readonly [string, string];
        }>
      >('/search/destinations'),
  });
}

export function useSearchHotels(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: ['hotels', params],
    queryFn: () => httpClient.get('/search/hotels', { params }),
  });
}

export function useHotelDetail(hotelId: number) {
  return useQuery({
    queryKey: ['hotels', hotelId],
    queryFn: () => httpClient.get(`/search/hotels/${hotelId}`),
  });
}

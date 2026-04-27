import { useQuery } from '@tanstack/react-query';
import { httpClient } from '../httpClient';

// ─── Destinations ───────────────────────────────────────────────────────────

interface BackendDestination {
  city: string;
  country: string;
}

interface DestinationsResponse {
  destinations: BackendDestination[];
  total: number;
}

export interface Destination {
  name: string;
  country: string;
  hotelCount: number;
  gradient: readonly [string, string];
}

export function useDestinations() {
  return useQuery({
    queryKey: ['destinations'],
    queryFn: async () => {
      const raw = await httpClient.get<DestinationsResponse | Destination[]>(
        '/search/destinations'
      );

      // Mock fallback returns a plain array with { name, country, gradient, ... }
      if (Array.isArray(raw)) {
        return raw as Destination[];
      }

      // Real API returns { destinations: [{ city, country }], total }
      const list = (raw as DestinationsResponse).destinations ?? [];
      return list.map(d => ({
        name: d.city,
        country: d.country,
        hotelCount: 0,
        gradient: gradientForCity(d.city),
      }));
    },
  });
}

// ─── Hotels search ──────────────────────────────────────────────────────────

export interface HotelSearchParams {
  destination?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  minRating?: number;
  page?: number;
  pageSize?: number;
}

interface BackendHotel {
  id: string;
  name: string;
  description: string;
  city: string;
  country: string;
  address: string;
  rating: number;
  available_rooms_count: number;
  min_price: number;
}

interface HotelsSearchResponse {
  results: BackendHotel[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export function useSearchHotels(params?: HotelSearchParams) {
  return useQuery({
    queryKey: ['hotels', params],
    queryFn: async () => {
      const backendParams: Record<string, unknown> = {};
      if (params?.destination) backendParams['city'] = params.destination;
      if (params?.checkIn) backendParams['check_in'] = params.checkIn;
      if (params?.checkOut) backendParams['check_out'] = params.checkOut;
      if (params?.guests) backendParams['guests'] = params.guests;
      if (params?.minRating) backendParams['min_rating'] = params.minRating;
      if (params?.page) backendParams['page'] = params.page;
      if (params?.pageSize) backendParams['page_size'] = params.pageSize;

      const raw = await httpClient.get<HotelsSearchResponse | BackendHotel[]>('/search/hotels', {
        params: backendParams,
      });

      const list: BackendHotel[] = Array.isArray(raw)
        ? raw
        : ((raw as HotelsSearchResponse).results ?? []);

      return list.map(h => ({
        id: h.id,
        type: 'Hotel',
        name: h.name,
        location: `${h.city}, ${h.country}`,
        rating: h.rating ?? 0,
        reviewCount: 0,
        starsText: '\u2605'.repeat(Math.round(h.rating ?? 0)),
        pricePerNight: h.min_price ?? 0,
        gradient: gradientForCity(h.city),
        photoCount: 0,
      }));
    },
  });
}

export function useHotelDetail(hotelId: string) {
  return useQuery({
    queryKey: ['hotels', hotelId],
    queryFn: () => httpClient.get(`/search/hotels/${hotelId}`),
    enabled: !!hotelId,
  });
}

interface BackendRoom {
  id: string;
  hotel_id: string;
  room_type: string;
  room_number: string;
  capacity: number;
  price_per_night: number;
  tax_rate: number;
  description: string;
  amenities?: Record<string, boolean>;
  total_quantity: number;
}

interface HotelRoomsResponse {
  hotel_id: string;
  rooms: BackendRoom[];
  total?: number;
}

export function useHotelRooms(hotelId: string, checkIn?: string) {
  return useQuery({
    queryKey: ['hotels', hotelId, 'rooms', checkIn],
    queryFn: async () => {
      const url = checkIn
        ? `/search/hotels/${hotelId}/rooms?check_in=${checkIn}`
        : `/search/hotels/${hotelId}/rooms`;
      const raw = await httpClient.get<HotelRoomsResponse | BackendRoom[]>(url);
      const list: BackendRoom[] = Array.isArray(raw)
        ? raw
        : ((raw as HotelRoomsResponse).rooms ?? []);
      return list.map(r => ({
        id: r.id,
        roomType: r.room_type,
        roomNumber: r.room_number,
        capacity: r.capacity,
        pricePerNight: r.price_per_night,
        taxRate: r.tax_rate,
        description: r.description,
        amenities: mapAmenities(r.amenities),
      }));
    },
    enabled: !!hotelId,
  });
}

// ─── Helpers ────────────────────────────────────────────────────────────────

const AMENITY_MAP: Record<string, { icon: string; label: string }> = {
  wifi: { icon: 'wifi', label: 'Wi-Fi' },
  ac: { icon: 'snowflake', label: 'A/C' },
  tv: { icon: 'television', label: 'TV' },
  minibar: { icon: 'glass-cocktail', label: 'Minibar' },
  balcony: { icon: 'balcony', label: 'Balcón' },
  jacuzzi: { icon: 'hot-tub', label: 'Jacuzzi' },
  desk: { icon: 'desk', label: 'Escritorio' },
  kitchen: { icon: 'stove', label: 'Cocina' },
  private_pool: { icon: 'pool', label: 'Piscina privada' },
  garden_view: { icon: 'flower', label: 'Vista al jardín' },
};

function mapAmenities(
  amenities: Record<string, boolean> | undefined
): Array<{ key: string; icon: string; label: string }> {
  if (!amenities) return [];
  return Object.entries(amenities)
    .filter(([, value]) => value)
    .map(([key]) => ({ key, ...(AMENITY_MAP[key] ?? { icon: 'check-circle', label: key }) }))
    .slice(0, 4);
}

const CITY_GRADIENTS: Record<string, readonly [string, string]> = {
  'Buenos Aires': ['#7B4F00', '#C89030'],
  Mendoza: ['#B5451B', '#E07050'],
  Cartagena: ['#006874', '#4A9FAA'],
  Cusco: ['#1A6B4F', '#4A9F7E'],
  'Ciudad de Mexico': ['#5B5EA6', '#8E91CC'],
  Santiago: ['#B5451B', '#E07050'],
};

const FALLBACK_GRADIENTS: readonly (readonly [string, string])[] = [
  ['#006874', '#4A9FAA'],
  ['#1A6B4F', '#4A9F7E'],
  ['#5B5EA6', '#8E91CC'],
  ['#B5451B', '#E07050'],
  ['#7B4F00', '#C89030'],
];

let gradientIndex = 0;
function gradientForCity(city: string): readonly [string, string] {
  return CITY_GRADIENTS[city] ?? FALLBACK_GRADIENTS[gradientIndex++ % FALLBACK_GRADIENTS.length];
}

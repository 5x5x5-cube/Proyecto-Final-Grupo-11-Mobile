import type { RequestConfig } from './httpClient';
import { mockDestinations } from '../data/mockDestinations';
import { mockHotels } from '../data/mockHotels';
import {
  mockReservations,
  pastReservations,
  cancelledReservations,
} from '../data/mockReservations';

type Handler = (
  config: RequestConfig | undefined,
  match: RegExpMatchArray
) => { status: number; data: unknown };

interface MockRoute {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  pattern: RegExp;
  handler: Handler;
}

const ok = (data: unknown) => ({ status: 200, data });
const created = (data: unknown) => ({ status: 201, data });

// Hotel detail mock (enriched from mockHotels[0])
const hotelDetail = {
  ...mockHotels[0],
  address: 'Calle del Torno #39-29, Centro Histórico, Cartagena',
  description: 'propertyDetail.descriptionText',
  amenities: [
    { icon: 'wifi', label: 'Wi-Fi gratis' },
    { icon: 'pool', label: 'Piscina' },
    { icon: 'free_breakfast', label: 'Desayuno incluido' },
    { icon: 'spa', label: 'Spa & Bienestar' },
    { icon: 'fitness_center', label: 'Gimnasio' },
    { icon: 'local_parking', label: 'Parqueadero' },
    { icon: 'ac_unit', label: 'Aire acondicionado' },
    { icon: 'restaurant', label: 'Restaurante' },
    { icon: 'local_bar', label: 'Bar' },
  ],
};

// Booking detail mock
const bookingDetail = {
  id: 1,
  code: 'TH-2026-48291',
  status: 'confirmed' as const,
  hotelType: 'Hotel · 5 estrellas',
  hotelName: 'Hotel Santa Clara Sofitel',
  address: 'Calle del Torno #39-29, Centro Histórico, Cartagena',
  rating: 4.8,
  reviewCount: 312,
  checkIn: '2026-03-15T15:00:00',
  checkOut: '2026-03-20T12:00:00',
  nights: 5,
  guests: '2 adultos',
  room: 'Habitación Superior',
  roomFeatures: '1 cama King · Vista al jardín · 32 m²',
  pricePerNight: 480000,
  subtotal: 2400000,
  tourismTax: 96000,
  vat: 168000,
  total: 2664000,
  gradient: ['#003740', '#006874'] as const,
  totalPrice: 'COP 2.664.000',
  totalPriceCop: 2664000,
  location: 'Centro Historico, Cartagena, Colombia',
};

export const mockHandlers: MockRoute[] = [
  // ─── Auth ───
  {
    method: 'POST',
    pattern: /^\/auth\/login$/,
    handler: () => ok({ token: 'mock-jwt', user: { id: 1, name: 'Carlos Martinez' } }),
  },
  {
    method: 'POST',
    pattern: /^\/auth\/register$/,
    handler: () => created({ id: 1 }),
  },
  {
    method: 'GET',
    pattern: /^\/auth\/me$/,
    handler: () =>
      ok({ id: 1, name: 'Carlos Martinez', email: 'carlos.m@email.com', initials: 'C' }),
  },

  // ─── Search ───
  {
    method: 'GET',
    pattern: /^\/search\/destinations$/,
    handler: () => ok(mockDestinations),
  },
  {
    method: 'GET',
    pattern: /^\/search\/hotels$/,
    handler: () => ok(mockHotels),
  },
  {
    method: 'GET',
    pattern: /^\/search\/hotels\/(\d+)$/,
    handler: () => ok(hotelDetail),
  },

  // ─── Bookings ───
  {
    method: 'GET',
    pattern: /^\/bookings$/,
    handler: () => ok(mockReservations),
  },
  {
    method: 'GET',
    pattern: /^\/bookings\/past$/,
    handler: () => ok(pastReservations),
  },
  {
    method: 'GET',
    pattern: /^\/bookings\/cancelled$/,
    handler: () => ok(cancelledReservations),
  },
  {
    method: 'GET',
    pattern: /^\/bookings\/(\d+)$/,
    handler: () => ok(bookingDetail),
  },
  {
    method: 'GET',
    pattern: /^\/bookings\/(\d+)\/qr$/,
    handler: () => ok({ qrCode: 'TH-2026-48291', bookingId: 1 }),
  },
  {
    method: 'POST',
    pattern: /^\/bookings\/(\d+)\/cancel$/,
    handler: () => ok({ message: 'Booking cancelled' }),
  },

  // ─── Payments ───
  {
    method: 'POST',
    pattern: /^\/payments\/initiate$/,
    handler: () =>
      ok({
        paymentId: 'pay-001',
        status: 'approved',
        bookingCode: 'TH-2026-48291',
      }),
  },

  // ─── Cart ───
  {
    method: 'PUT',
    pattern: /^\/cart$/,
    handler: config => {
      const body = config?.body as any;
      const hotel = mockHotels[0];
      const nights = 5;
      return ok({
        id: 'cart-mock-001',
        userId: 'c1000000-0000-0000-0000-000000000001',
        roomId: body?.roomId || 'b1000000-0000-0000-0000-000000000001',
        hotelId: body?.hotelId || 'a1000000-0000-0000-0000-000000000001',
        hotelName: hotel.name,
        roomName: 'Habitación Superior',
        roomType: 'Superior',
        roomFeatures: '1 cama King · Vista al jardín · 32 m²',
        location: hotel.location,
        rating: hotel.rating,
        reviewCount: hotel.reviewCount,
        checkIn: body?.checkIn || '2026-03-20',
        checkOut: body?.checkOut || '2026-03-25',
        guests: body?.guests || 2,
        holdId: 'hold-mock-001',
        holdExpiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
        priceBreakdown: {
          pricePerNight: hotel.pricePerNight,
          nights,
          subtotal: hotel.pricePerNight * nights,
          vat: Math.round(hotel.pricePerNight * nights * 0.19),
          tourismTax: 0,
          serviceFee: 0,
          total: Math.round(hotel.pricePerNight * nights * 1.19),
          currency: 'COP',
        },
        createdAt: new Date().toISOString(),
      });
    },
  },
  {
    method: 'GET',
    pattern: /^\/cart$/,
    handler: () => {
      const hotel = mockHotels[0];
      const nights = 5;
      return ok({
        id: 'cart-mock-001',
        userId: 'c1000000-0000-0000-0000-000000000001',
        roomId: 'b1000000-0000-0000-0000-000000000001',
        hotelId: 'a1000000-0000-0000-0000-000000000001',
        hotelName: hotel.name,
        roomName: 'Habitación Superior',
        roomType: 'Superior',
        roomFeatures: '1 cama King · Vista al jardín · 32 m²',
        location: hotel.location,
        rating: hotel.rating,
        reviewCount: hotel.reviewCount,
        checkIn: '2026-03-20',
        checkOut: '2026-03-25',
        guests: 2,
        holdId: 'hold-mock-001',
        holdExpiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
        priceBreakdown: {
          pricePerNight: hotel.pricePerNight,
          nights,
          subtotal: hotel.pricePerNight * nights,
          vat: Math.round(hotel.pricePerNight * nights * 0.19),
          tourismTax: 0,
          serviceFee: 0,
          total: Math.round(hotel.pricePerNight * nights * 1.19),
          currency: 'COP',
        },
        createdAt: new Date().toISOString(),
      });
    },
  },
  {
    method: 'DELETE',
    pattern: /^\/cart$/,
    handler: () => ({ status: 204, data: undefined }),
  },
];

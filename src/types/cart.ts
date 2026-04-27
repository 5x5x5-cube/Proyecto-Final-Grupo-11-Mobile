export interface Cart {
  id: string;
  userId: string;
  roomId: string;
  hotelId: string;
  hotelName: string;
  roomName: string;
  roomType?: string;
  roomFeatures?: string;
  location?: string;
  hotelType?: string;
  rating?: number;
  reviewCount?: number;
  checkIn: string;
  checkOut: string;
  guests: number;
  holdId?: string;
  holdExpiresAt?: string;
  priceBreakdown?: PriceBreakdown;
  // Top-level price fields (backend may return these instead of priceBreakdown)
  pricePerNight?: number | string;
  nights?: number;
  subtotal?: number | string;
  vat?: number | string;
  tourismTax?: number | string;
  serviceFee?: number | string;
  total?: number | string;
  createdAt: string;
}

export interface PriceBreakdown {
  pricePerNight: number | string;
  nights: number;
  subtotal: number | string;
  vat: number | string;
  tourismTax: number | string;
  serviceFee: number | string;
  total: number | string;
  currency: string;
}

export interface CartPricing {
  pricePerNight: number;
  nights: number;
  subtotal: number;
  taxes: number;
  total: number;
  currency: string;
}

export type NormalizedCart = Cart & { pricing: CartPricing };

export const EMPTY_PRICING: CartPricing = {
  pricePerNight: 0,
  nights: 0,
  subtotal: 0,
  taxes: 0,
  total: 0,
  currency: 'COP',
};

export interface SetCartRequest {
  roomId: string;
  hotelId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
}

export interface CreateBookingRequest {
  roomId: string;
  hotelId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
}

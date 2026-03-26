export interface Cart {
  id: string;
  userId: string;
  roomId: string;
  hotelId: string;
  hotelName: string;
  roomName: string;
  roomType: string;
  roomFeatures?: string;
  location: string;
  rating?: number;
  reviewCount?: number;
  checkIn: string;
  checkOut: string;
  guests: number;
  holdId: string;
  holdExpiresAt: string;
  priceBreakdown: PriceBreakdown;
  createdAt: string;
}

export interface PriceBreakdown {
  pricePerNight: number;
  nights: number;
  subtotal: number;
  vat: number;
  tourismTax: number;
  serviceFee: number;
  total: number;
  currency: string;
}

export interface SetCartRequest {
  roomId: string;
  hotelId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
}

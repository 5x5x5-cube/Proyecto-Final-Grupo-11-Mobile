import { useState } from 'react';
import { useBookings } from '@/api/hooks/useBookings';
import type { BookingData } from '@/api/hooks/useBookings';

export type ReservationTab = 'active' | 'past' | 'cancelled';

const TAB_FILTERS: Record<ReservationTab, { status?: string; timeframe?: string }> = {
  active: { timeframe: 'active' },
  past: { timeframe: 'past' },
  cancelled: { status: 'cancelled' },
};

export function useReservationTabs() {
  const [tab, setTab] = useState<ReservationTab>('active');
  const { data, isLoading } = useBookings(TAB_FILTERS[tab]);

  return {
    tab,
    setTab,
    bookings: data ?? [],
    isLoading,
  };
}

export type { BookingData };

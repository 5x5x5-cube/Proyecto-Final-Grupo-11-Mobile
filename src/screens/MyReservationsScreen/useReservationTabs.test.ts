import { renderHook, act } from '@testing-library/react-native';

jest.mock('@/api/hooks/useBookings', () => ({
  useBookings: jest.fn(() => ({ data: [], isLoading: false })),
}));

import { useReservationTabs } from './useReservationTabs';
import { useBookings } from '@/api/hooks/useBookings';

const mockUseBookings = useBookings as jest.Mock;

describe('useReservationTabs', () => {
  beforeEach(() => {
    mockUseBookings.mockReturnValue({ data: [], isLoading: false });
  });

  it('defaults to active tab', () => {
    const { result } = renderHook(() => useReservationTabs());
    expect(result.current.tab).toBe('active');
  });

  it('passes timeframe=active filter to useBookings by default', () => {
    renderHook(() => useReservationTabs());
    expect(mockUseBookings).toHaveBeenCalledWith({ timeframe: 'active' });
  });

  it('switching to past tab passes timeframe=past', () => {
    const { result } = renderHook(() => useReservationTabs());
    act(() => result.current.setTab('past'));
    expect(result.current.tab).toBe('past');
    expect(mockUseBookings).toHaveBeenCalledWith({ timeframe: 'past' });
  });

  it('switching to cancelled tab passes status=cancelled', () => {
    const { result } = renderHook(() => useReservationTabs());
    act(() => result.current.setTab('cancelled'));
    expect(mockUseBookings).toHaveBeenCalledWith({ status: 'cancelled' });
  });

  it('returns bookings from useBookings', () => {
    const mockData = [{ id: '1', code: 'BK-001' }];
    mockUseBookings.mockReturnValue({ data: mockData, isLoading: false });
    const { result } = renderHook(() => useReservationTabs());
    expect(result.current.bookings).toEqual(mockData);
  });

  it('returns empty array when data is undefined', () => {
    mockUseBookings.mockReturnValue({ data: undefined, isLoading: false });
    const { result } = renderHook(() => useReservationTabs());
    expect(result.current.bookings).toEqual([]);
  });

  it('passes through isLoading from useBookings', () => {
    mockUseBookings.mockReturnValue({ data: undefined, isLoading: true });
    const { result } = renderHook(() => useReservationTabs());
    expect(result.current.isLoading).toBe(true);
  });
});

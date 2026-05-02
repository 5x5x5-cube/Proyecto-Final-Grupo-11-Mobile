import { renderHook, act } from '@testing-library/react-native';

const mockGetNetworkStateAsync = jest.fn();

jest.mock('expo-network', () => ({
  getNetworkStateAsync: () => mockGetNetworkStateAsync(),
}));

import { useNetworkStatus } from './useNetworkStatus';

describe('useNetworkStatus', () => {
  beforeEach(() => {
    mockGetNetworkStateAsync.mockResolvedValue({ isConnected: true });
  });

  it('defaults to connected', () => {
    const { result } = renderHook(() => useNetworkStatus());
    expect(result.current.isConnected).toBe(true);
  });

  it('updates to disconnected when network is unavailable', async () => {
    mockGetNetworkStateAsync.mockResolvedValue({ isConnected: false });

    const { result } = renderHook(() => useNetworkStatus());

    await act(async () => {});

    expect(result.current.isConnected).toBe(false);
  });

  it('stays connected on network error', async () => {
    mockGetNetworkStateAsync.mockRejectedValue(new Error('fail'));

    const { result } = renderHook(() => useNetworkStatus());

    await act(async () => {});

    expect(result.current.isConnected).toBe(true);
  });
});

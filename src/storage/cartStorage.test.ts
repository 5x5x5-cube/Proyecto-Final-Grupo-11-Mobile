jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
  },
}));

import AsyncStorage from '@react-native-async-storage/async-storage';
import { saveCartSelection, getCartSelection, clearCartSelection } from './cartStorage';

const mockGetItem = AsyncStorage.getItem as jest.Mock;
const mockSetItem = AsyncStorage.setItem as jest.Mock;
const mockRemoveItem = AsyncStorage.removeItem as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
  mockSetItem.mockResolvedValue(undefined);
  mockRemoveItem.mockResolvedValue(undefined);
});

describe('saveCartSelection', () => {
  it('serializes the selection with a savedAt timestamp and stores it', async () => {
    const before = Date.now();
    await saveCartSelection({
      roomId: 'room-1',
      hotelId: 'hotel-1',
      checkIn: '2026-03-20',
      checkOut: '2026-03-25',
      guests: 2,
    });

    expect(mockSetItem).toHaveBeenCalledTimes(1);
    const [key, raw] = mockSetItem.mock.calls[0] as [string, string];
    expect(key).toBe('travelhub_cart_selection');
    const parsed = JSON.parse(raw);
    expect(parsed.roomId).toBe('room-1');
    expect(parsed.hotelId).toBe('hotel-1');
    expect(parsed.checkIn).toBe('2026-03-20');
    expect(parsed.checkOut).toBe('2026-03-25');
    expect(parsed.guests).toBe(2);
    expect(new Date(parsed.savedAt).getTime()).toBeGreaterThanOrEqual(before);
  });
});

describe('getCartSelection', () => {
  it('returns null when nothing is stored', async () => {
    mockGetItem.mockResolvedValueOnce(null);
    const result = await getCartSelection();
    expect(result).toBeNull();
  });

  it('returns the selection when it is fresh', async () => {
    const stored = {
      roomId: 'room-1',
      hotelId: 'hotel-1',
      checkIn: '2026-03-20',
      checkOut: '2026-03-25',
      guests: 2,
      savedAt: new Date().toISOString(),
    };
    mockGetItem.mockResolvedValueOnce(JSON.stringify(stored));

    const result = await getCartSelection();
    expect(result).toEqual(stored);
  });

  it('returns null and clears storage when the entry is older than 20 minutes', async () => {
    const expiredSavedAt = new Date(Date.now() - 21 * 60 * 1000).toISOString();
    const stored = {
      roomId: 'room-1',
      hotelId: 'hotel-1',
      checkIn: '2026-03-20',
      checkOut: '2026-03-25',
      guests: 2,
      savedAt: expiredSavedAt,
    };
    mockGetItem.mockResolvedValueOnce(JSON.stringify(stored));

    const result = await getCartSelection();
    expect(result).toBeNull();
    expect(mockRemoveItem).toHaveBeenCalledWith('travelhub_cart_selection');
  });

  it('returns null and clears storage when the stored value is malformed JSON', async () => {
    mockGetItem.mockResolvedValueOnce('{bad json}}');

    const result = await getCartSelection();
    expect(result).toBeNull();
    expect(mockRemoveItem).toHaveBeenCalledWith('travelhub_cart_selection');
  });
});

describe('clearCartSelection', () => {
  it('removes the key from AsyncStorage', async () => {
    await clearCartSelection();
    expect(mockRemoveItem).toHaveBeenCalledWith('travelhub_cart_selection');
  });
});

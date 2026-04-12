import AsyncStorage from '@react-native-async-storage/async-storage';

const CART_STORAGE_KEY = 'travelhub_cart_selection';

export interface CartSelection {
  roomId: string;
  hotelId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  savedAt: string;
}

export async function saveCartSelection(selection: Omit<CartSelection, 'savedAt'>): Promise<void> {
  const data: CartSelection = { ...selection, savedAt: new Date().toISOString() };
  await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(data));
}

export async function getCartSelection(): Promise<CartSelection | null> {
  const raw = await AsyncStorage.getItem(CART_STORAGE_KEY);
  if (!raw) return null;
  try {
    const data = JSON.parse(raw) as CartSelection;
    const age = Date.now() - new Date(data.savedAt).getTime();
    if (age > 20 * 60 * 1000) {
      await clearCartSelection();
      return null;
    }
    return data;
  } catch {
    await clearCartSelection();
    return null;
  }
}

export async function clearCartSelection(): Promise<void> {
  await AsyncStorage.removeItem(CART_STORAGE_KEY);
}

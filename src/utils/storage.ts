import AsyncStorage from '@react-native-async-storage/async-storage';

/** Reads a JSON array from storage, falling back to an empty list if the value is missing or corrupted. */
export async function readJsonArray<T>(key: string): Promise<T[]> {
  const raw = await AsyncStorage.getItem(key);
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    console.warn(`[storage] Ignoring corrupted value for "${key}".`);
    return [];
  }
}

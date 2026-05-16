
export default class LocalStorage {
  static get<T>(key: string, fallbackValue?: T): T | null {
    if (typeof window === "undefined") {
      return fallbackValue ?? null;
    }

    try {
      const item = localStorage.getItem(key);

      if (!item) {
        return fallbackValue ?? null;
      }

      return JSON.parse(item) as T;
    } catch (error) {
      console.error(`Error getting localStorage key "${key}"`, error);
      return fallbackValue ?? null;
    }
  }

  static set<T>(key: string, value: T): void {
    if (typeof window === "undefined") {
      return;
    }

    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}"`, error);
    }
  }

  static remove(key: string): void {
    if (typeof window === "undefined") {
      return;
    }

    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}"`, error);
    }
  }

  static clear(): void {
    if (typeof window === "undefined") {
      return;
    }

    try {
      localStorage.clear();
    } catch (error) {
      console.error("Error clearing localStorage", error);
    }
  }

  static has(key: string): boolean {
    if (typeof window === "undefined") {
      return false;
    }

    return localStorage.getItem(key) !== null;
  }
}

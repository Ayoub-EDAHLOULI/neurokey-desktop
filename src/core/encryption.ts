import CryptoJS from "crypto-js";
import { Store, load } from "@tauri-apps/plugin-store";
import { v4 as uuidv4 } from "uuid";

const ITERATIONS = 5000;
const KEY_SIZE = 256 / 32;

// Keep a single instance of the store in memory
let _storeInstance: Store | null = null;

const getStore = async (): Promise<Store> => {
  if (!_storeInstance) {
    try {
      _storeInstance = await load("neurokey_secure.dat", {
        autoSave: false,
        defaults: {},
      });
    } catch (error) {
      console.error("Failed to load Tauri store:", error);
      throw error;
    }
  }
  return _storeInstance;
};

export const deriveKey = (password: string, salt: string): string => {
  const key = CryptoJS.PBKDF2(password, salt, {
    keySize: KEY_SIZE,
    iterations: ITERATIONS,
  });
  return key.toString();
};

export const encryptData = (text: string, secretKey: string): string | null => {
  try {
    return CryptoJS.AES.encrypt(text, secretKey).toString();
  } catch (error) {
    console.error("Encryption Failed:", error);
    return null;
  }
};

export const decryptData = (
  ciphertext: string,
  secretKey: string,
): string | null => {
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    return originalText || null;
  } catch (error) {
    return null;
  }
};

export const saveSecureItem = async (
  key: string,
  value: string,
): Promise<void> => {
  try {
    const store = await getStore();
    await store.set(key, value);
    await store.save();
  } catch (error) {
    console.error(`Failed to save secure item (${key}):`, error);
  }
};

export const getSecureItem = async (key: string): Promise<string | null> => {
  try {
    const store = await getStore();
    return (await store.get<string>(key)) || null;
  } catch (error) {
    console.error(`Failed to get secure item (${key}):`, error);
    return null;
  }
};

export const clearSecureStore = async (): Promise<void> => {
  try {
    const store = await getStore();
    await store.clear();
    await store.save();
  } catch (error) {
    console.error("Failed to clear secure store:", error);
  }
};

export const generateSalt = (): string => {
  return uuidv4();
};

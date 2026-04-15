import CryptoJS from "crypto-js";
import { Store } from "@tauri-apps/plugin-store";
import { v4 as uuidv4 } from "uuid";

const ITERATIONS = 5000;
const KEY_SIZE = 256 / 32;

// Initialize the Tauri local storage file
const store = new Store("neurokey_secure.dat");

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
  await store.set(key, value);
  await store.save(); // Tauri requires explicitly saving the file to disk
};

export const getSecureItem = async (key: string): Promise<string | null> => {
  return (await store.get<string>(key)) || null;
};

export const clearSecureStore = async (): Promise<void> => {
  await store.clear();
  await store.save();
};

export const generateSalt = (): string => {
  return uuidv4();
};

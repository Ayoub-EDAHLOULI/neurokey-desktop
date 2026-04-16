import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";
import { saveSecureItem, persistVault } from "../core/encryption";

export type VaultItemType = "password" | "card" | "note";

export interface VaultItem {
  id: string;
  type: VaultItemType;
  name: string;
  email?: string;
  password?: string;
  url?: string;
  cardNumber?: string;
  cardHolder?: string;
  expiry?: string;
  cvv?: string;
  cardType?: "visa" | "mastercard" | "amex";
  notes?: string;
  icon?: string;
  color?: string;
  created_at: number;
}

interface VaultStore {
  items: VaultItem[];
  setItems: (items: VaultItem[]) => void;
  addItem: (item: Omit<VaultItem, "id" | "created_at">) => void;
  updateItem: (id: string, updates: Partial<VaultItem>) => void;
  deleteItem: (id: string) => void;
  clearVault: () => void;
}

export const useVaultStore = create<VaultStore>((set) => ({
  items: [],

  setItems: (items) => set({ items }),

  addItem: (item) =>
    set((state) => {
      const newItem = { id: uuidv4(), created_at: Date.now(), ...item };
      const newItems = [newItem, ...state.items];

      // 1. Fire and forget: Save the new array to the hard drive
      saveSecureItem("vault_data", JSON.stringify(newItems)).then(persistVault);

      return { items: newItems };
    }),

  updateItem: (id, updates) =>
    set((state) => {
      const newItems = state.items.map((i) =>
        i.id === id ? { ...i, ...updates } : i,
      );

      // Sync update to hard drive
      saveSecureItem("vault_data", JSON.stringify(newItems)).then(persistVault);

      return { items: newItems };
    }),

  deleteItem: (id) =>
    set((state) => {
      const newItems = state.items.filter((i) => i.id !== id);

      // Sync deletion to hard drive
      saveSecureItem("vault_data", JSON.stringify(newItems)).then(persistVault);

      return { items: newItems };
    }),

  clearVault: () => set({ items: [] }),
}));

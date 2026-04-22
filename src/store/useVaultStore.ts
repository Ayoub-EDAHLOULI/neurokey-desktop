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
  updated_at: number;
  isDeleted?: boolean;
}

interface VaultStore {
  items: VaultItem[];
  setItems: (items: VaultItem[]) => void;
  addItem: (item: Omit<VaultItem, "id" | "created_at" | "updated_at">) => void;
  updateItem: (id: string, updates: Partial<VaultItem>) => void;
  deleteItem: (id: string) => void;
  clearVault: () => void;
}

export const useVaultStore = create<VaultStore>((set) => ({
  items: [],

  // Actually save the merged data to the encrypted hard drive!
  setItems: (newItems) =>
    set(() => {
      saveSecureItem("vault_data", JSON.stringify(newItems)).then(persistVault);
      return { items: newItems };
    }),

  addItem: (item) =>
    set((state) => {
      const now = Date.now();
      const newItem = {
        id: uuidv4(),
        created_at: now,
        updated_at: now,
        ...item,
      };
      const newItems = [newItem, ...state.items];

      saveSecureItem("vault_data", JSON.stringify(newItems)).then(persistVault);

      return { items: newItems };
    }),

  updateItem: (id, updates) =>
    set((state) => {
      const newItems = state.items.map((i) =>
        // Inject the new updated_at timestamp on every edit
        i.id === id ? { ...i, ...updates, updated_at: Date.now() } : i,
      );

      saveSecureItem("vault_data", JSON.stringify(newItems)).then(persistVault);

      return { items: newItems };
    }),

  deleteItem: (id) =>
    set((state) => {
      // Turn the item into a Tombstone
      const newItems = state.items.map((i) =>
        i.id === id ? { ...i, isDeleted: true, updated_at: Date.now() } : i,
      );

      // Save the array (including the tombstones) to the encrypted hard drive
      saveSecureItem("vault_data", JSON.stringify(newItems)).then(persistVault);
      return { items: newItems };
    }),

  clearVault: () => set({ items: [] }),
}));

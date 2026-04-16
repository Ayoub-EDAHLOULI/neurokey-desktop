import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";

export type VaultItemType = "password" | "card" | "note";

export interface VaultItem {
  id: string;
  type: VaultItemType;
  name: string;
  // Password fields
  email?: string;
  password?: string;
  url?: string;
  // Card fields
  cardNumber?: string;
  cardHolder?: string;
  expiry?: string;
  cvv?: string;
  cardType?: "visa" | "mastercard" | "amex";
  // Common
  notes?: string;
  icon?: string;
  color?: string;
  created_at: number;
}

interface VaultStore {
  items: VaultItem[];
  // Actions
  setItems: (items: VaultItem[]) => void;
  addItem: (item: Omit<VaultItem, "id" | "created_at">) => void;
  updateItem: (id: string, updates: Partial<VaultItem>) => void;
  deleteItem: (id: string) => void;
  clearVault: () => void;
}

// Zustand gives us a hook we can use anywhere in the app without Context Providers
export const useVaultStore = create<VaultStore>((set) => ({
  // For testing UI, I'm adding one mock password item
  items: [
    {
      id: "1",
      type: "password",
      name: "GitHub",
      email: "ayoub@example.com",
      password: "mockpassword123",
      url: "github.com",
      color: "#24292e",
      created_at: Date.now(),
    },
  ],
  setItems: (items) => set({ items }),
  addItem: (item) =>
    set((state) => ({
      items: [
        { id: uuidv4(), created_at: Date.now(), ...item },
        ...state.items,
      ],
    })),
  updateItem: (id, updates) =>
    set((state) => ({
      items: state.items.map((i) => (i.id === id ? { ...i, ...updates } : i)),
    })),
  deleteItem: (id) =>
    set((state) => ({
      items: state.items.filter((i) => i.id !== id),
    })),
  clearVault: () => set({ items: [] }),
}));

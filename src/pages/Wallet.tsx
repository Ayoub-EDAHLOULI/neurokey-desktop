import { useNavigate } from "react-router-dom";
import { Plus, CreditCard as CardIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useVaultStore } from "../store/useVaultStore";
import CreditCard from "../components/CreditCard";

export default function Wallet() {
  const navigate = useNavigate();
  const { items } = useVaultStore();

  // Filter only items with the type "card"
  const cards = items.filter((item) => item.type === "card");

  return (
    <div className="h-full w-full flex flex-col px-8 pb-8">
      {/* 1. HEADER */}
      <div className="flex justify-between items-center py-3 shrink-0 mt-2">
        <h1 className="text-3xl font-bold text-text tracking-tight">
          Digital Wallet
        </h1>
        <button
          className="w-10 h-10 bg-primary hover:bg-blue-600 rounded-full flex items-center justify-center transition-colors shadow-lg shadow-primary/30"
          onClick={() => navigate("/add-card")}
        >
          <Plus className="text-white w-6 h-6" />
        </button>
      </div>

      {/* 2. CARD GRID */}
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        {cards.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full opacity-60">
            <CardIcon className="w-16 h-16 text-subText mb-4" />
            <p className="text-subText font-medium text-lg">No cards yet.</p>
            <p className="text-subText text-sm mt-2">
              Add your first credit card to securely store it.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(360px,1fr))] gap-6 pb-6">
            <AnimatePresence>
              {cards.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className="cursor-pointer transition-transform hover:-translate-y-1"
                  onClick={() => navigate(`/view-card/${item.id}`)}
                >
                  <CreditCard
                    holder={item.cardHolder || "Your Name"}
                    number={item.cardNumber || "0000000000000000"}
                    expiry={item.expiry || "00/00"}
                    type={
                      (item.cardType as "visa" | "mastercard" | "amex") ||
                      "visa"
                    }
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}

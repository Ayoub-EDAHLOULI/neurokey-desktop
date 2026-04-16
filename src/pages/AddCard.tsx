import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreditCard as CardIcon, Eye, EyeOff } from "lucide-react";
import { useVaultStore } from "../store/useVaultStore";
import CreditCard from "../components/CreditCard";
import CustomAlert from "../components/CustomAlert";

export default function AddCard() {
  const navigate = useNavigate();
  const { addItem } = useVaultStore();

  // --- STATE ---
  const [holder, setHolder] = useState("");
  const [number, setNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardType, setCardType] = useState<"visa" | "mastercard" | "amex">(
    "visa",
  );
  const [notes, setNotes] = useState("");
  const [showCvv, setShowCvv] = useState(false);

  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    title: "",
    message: "",
    type: "info" as any,
  });

  // --- FORMATTING HELPERS ---
  const handleNumberChange = (text: string) => {
    const cleaned = text.replace(/\D/g, "");
    setNumber(cleaned.slice(0, 16));
  };

  const handleExpiryChange = (text: string) => {
    const cleaned = text.replace(/\D/g, "");
    if (cleaned.length >= 2) {
      setExpiry(`${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`);
    } else {
      setExpiry(cleaned);
    }
  };

  const handleSave = () => {
    if (!holder || number.length < 15 || !expiry) {
      setAlertConfig({
        visible: true,
        title: "Incomplete Card",
        message: "Please fill in the required card details.",
        type: "error",
      });
      return;
    }

    addItem({
      type: "card",
      name: `${cardType.toUpperCase()} ending in ${number.slice(-4)}`,
      cardHolder: holder,
      cardNumber: number,
      expiry,
      cvv,
      cardType,
      notes,
      color: "#007AFF", // Generic fallback color
      icon: "card",
    });

    navigate("/wallet");
  };

  return (
    <div className="h-full flex flex-col">
      {/* HEADER */}
      <div className="flex justify-between items-center px-8 py-6 border-b border-border shrink-0">
        <button
          onClick={() => navigate(-1)}
          className="text-primary hover:text-blue-400 font-medium transition-colors"
        >
          Cancel
        </button>
        <h1 className="text-xl font-bold text-text">Add Card</h1>
        <button
          onClick={handleSave}
          className="text-primary hover:text-blue-400 font-bold transition-colors"
        >
          Save
        </button>
      </div>

      {/* SCROLLABLE CONTENT */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-8 py-6 custom-scrollbar">
        <div className="mx-auto space-y-8 w-full min-w-0">
          {/* 1. LIVE PREVIEW */}
          <div className="flex justify-center mb-8">
            <div className="w-full max-w-[400px]">
              <CreditCard
                holder={holder || "CARD HOLDER"}
                number={number || "0000000000000000"}
                expiry={expiry || "MM/YY"}
                type={cardType}
              />
            </div>
          </div>

          {/* 2. CARD TYPE PICKER */}
          <div className="flex justify-center gap-3">
            {(["visa", "mastercard", "amex"] as const).map((type) => {
              const isSelected = cardType === type;
              return (
                <button
                  key={type}
                  onClick={() => setCardType(type)}
                  className={`px-6 py-2 rounded-full text-xs font-bold tracking-wider uppercase transition-all ${
                    isSelected
                      ? "bg-primary text-white shadow-md shadow-primary/30"
                      : "bg-inputBg text-text hover:bg-border border border-transparent"
                  }`}
                >
                  {type}
                </button>
              );
            })}
          </div>

          {/* 3. FORM INPUTS */}
          <section className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="flex items-center px-4 py-1 border-b border-border">
              <label className="w-24 text-text font-medium text-sm">
                Number
              </label>
              <input
                type="text"
                placeholder="0000 0000 0000 0000"
                value={number}
                onChange={(e) => handleNumberChange(e.target.value)}
                maxLength={16}
                className="flex-1 bg-transparent border-none outline-none h-12 text-text tracking-widest font-mono"
              />
              <CardIcon className="w-5 h-5 text-subText" />
            </div>

            <div className="flex items-center px-4 py-1 border-b border-border">
              <label className="w-24 text-text font-medium text-sm">
                Holder
              </label>
              <input
                type="text"
                placeholder="Name on Card"
                value={holder}
                onChange={(e) => setHolder(e.target.value.toUpperCase())}
                className="flex-1 bg-transparent border-none outline-none h-12 text-text uppercase"
              />
            </div>

            <div className="flex w-full">
              <div className="flex items-center px-4 py-1 flex-1 border-r border-border">
                <label className="w-16 text-text font-medium text-sm">
                  Exp.
                </label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  value={expiry}
                  onChange={(e) => handleExpiryChange(e.target.value)}
                  maxLength={5}
                  className="flex-1 bg-transparent border-none outline-none h-12 text-text"
                />
              </div>
              <div className="flex items-center px-4 py-1 flex-1">
                <label className="w-16 text-text font-medium text-sm">
                  CVV
                </label>
                <input
                  type={showCvv ? "text" : "password"}
                  placeholder="123"
                  value={cvv}
                  onChange={(e) =>
                    setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))
                  }
                  maxLength={4}
                  className="flex-1 bg-transparent border-none outline-none h-12 text-text"
                />
                <button
                  type="button"
                  onClick={() => setShowCvv((v) => !v)}
                  className="text-subText hover:text-text transition-colors"
                >
                  {showCvv ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </section>

          {/* 4. NOTES */}
          <section className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="flex items-start px-4 py-3">
              <label className="w-24 text-text font-medium text-sm pt-2">
                Notes
              </label>
              <textarea
                placeholder="Billing address, PIN, etc."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none min-h-[80px] resize-none text-text pt-2 custom-scrollbar"
              />
            </div>
          </section>
        </div>
      </div>

      <CustomAlert
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        onClose={() => setAlertConfig((prev) => ({ ...prev, visible: false }))}
      />
    </div>
  );
}

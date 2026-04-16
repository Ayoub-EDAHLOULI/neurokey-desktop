import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Copy, Eye, EyeOff, X, Edit2, ShieldAlert } from "lucide-react";
import { useVaultStore } from "../store/useVaultStore";
import CustomAlert from "../components/CustomAlert";
import CreditCard from "../components/CreditCard";

export default function ViewCard() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { items, deleteItem } = useVaultStore();

  // Find the exact card from the Zustand RAM store
  const item = items.find((p) => p.id === id);

  const [isCvvVisible, setIsCvvVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    title: "",
    message: "",
    type: "info" as any,
    buttons: [] as any[],
  });

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setAlertConfig({
        visible: true,
        title: "Copied",
        message: `${label} copied to clipboard.`,
        type: "success",
        buttons: [],
      });
    } catch (err) {
      setAlertConfig({
        visible: true,
        title: "Error",
        message: "Failed to copy text.",
        type: "error",
        buttons: [],
      });
    }
  };

  const handleDelete = () => {
    setAlertConfig({
      visible: true,
      title: "Delete Card",
      message: "Are you sure? This action cannot be undone.",
      type: "warning",
      buttons: [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            deleteItem(item!.id);
            navigate("/wallet");
          },
        },
      ],
    });
  };

  // Safe fallback if the card isn't found
  if (!item) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center p-8">
        <ShieldAlert className="w-16 h-16 text-subText mb-4 opacity-50" />
        <p className="text-subText font-medium">Card not found.</p>
        <button
          onClick={() => navigate("/wallet")}
          className="text-primary mt-4 hover:underline"
        >
          Return to Wallet
        </button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col relative">
      {/* HEADER */}
      <div className="flex justify-between items-center px-8 py-6 border-b border-border shrink-0">
        <button
          onClick={() => navigate("/wallet")}
          className="p-2 hover:bg-inputBg rounded-full transition-colors text-text"
        >
          <X size={20} />
        </button>
        <button
          onClick={() => navigate(`/edit-card/${item.id}`)}
          className="flex items-center gap-2 text-primary hover:text-blue-400 font-medium transition-colors"
        >
          <Edit2 size={16} /> Edit
        </button>
      </div>

      {/* SCROLLABLE CONTENT */}
      <div className="flex-1 overflow-y-auto px-8 py-6 custom-scrollbar">
        <div className="mx-auto space-y-6">
          {/* HERO CARD VISUAL */}
          <div className="flex justify-center mb-10 mt-4">
            <div className="w-full max-w-[400px]">
              <CreditCard
                holder={item.cardHolder || "Name"}
                number={item.cardNumber || "0000"}
                expiry={item.expiry || "00/00"}
                type={
                  (item.cardType as "visa" | "mastercard" | "amex") || "visa"
                }
              />
            </div>
          </div>

          {/* CARD DETAILS */}
          <section>
            <h2 className="text-xs font-bold text-subText mb-2 tracking-wider uppercase ml-2">
              Card Details
            </h2>
            <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
              {/* Number */}
              <div className="flex items-center px-4 py-3 border-b border-border">
                <label className="w-24 text-text font-medium text-sm">
                  Number
                </label>
                <span className="flex-1 font-mono text-subText tracking-widest truncate">
                  {item.cardNumber}
                </span>
                <button
                  onClick={() =>
                    copyToClipboard(item.cardNumber || "", "Card Number")
                  }
                  className="p-2 text-primary hover:bg-inputBg rounded-lg transition-colors"
                >
                  <Copy size={18} />
                </button>
              </div>

              {/* Expiry */}
              <div className="flex items-center px-4 py-3 border-b border-border">
                <label className="w-24 text-text font-medium text-sm">
                  Expiry
                </label>
                <span className="flex-1 text-text">{item.expiry}</span>
              </div>

              {/* CVV */}
              <div className="flex items-center px-4 py-3">
                <label className="w-24 text-text font-medium text-sm">
                  CVV
                </label>
                <span className="flex-1 text-text">
                  {isCvvVisible ? item.cvv : "•••"}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsCvvVisible(!isCvvVisible)}
                    className="p-2 text-primary hover:bg-inputBg rounded-lg transition-colors"
                  >
                    {isCvvVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                  <button
                    onClick={() => copyToClipboard(item.cvv || "", "CVV")}
                    className="p-2 text-primary hover:bg-inputBg rounded-lg transition-colors"
                  >
                    <Copy size={18} />
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* NOTES (Optional) */}
          {item.notes && (
            <section>
              <h2 className="text-xs font-bold text-subText mb-2 tracking-wider uppercase ml-2">
                Notes
              </h2>
              <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
                <div className="flex items-start px-4 py-3 min-h-[100px]">
                  <span className="flex-1 text-text leading-relaxed whitespace-pre-wrap">
                    {item.notes}
                  </span>
                </div>
              </div>
            </section>
          )}

          {/* DELETE ACTION */}
          <button
            onClick={handleDelete}
            className="w-full bg-card hover:bg-danger/10 text-danger border border-transparent hover:border-danger font-semibold py-4 rounded-xl transition-colors mt-4"
          >
            Delete Card
          </button>
        </div>
      </div>

      <CustomAlert
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        buttons={alertConfig.buttons}
        onClose={() => setAlertConfig((prev) => ({ ...prev, visible: false }))}
      />
    </div>
  );
}

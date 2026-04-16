import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Copy,
  Eye,
  EyeOff,
  ShieldAlert,
  ShieldCheck,
  X,
  Edit2,
} from "lucide-react";
import { useVaultStore } from "../store/useVaultStore";
import CustomAlert from "../components/CustomAlert";
import BrandIcon from "../components/BrandIcon";
import { checkPasswordLeak } from "../core/breachCheck";

export default function ViewPassword() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { items, deleteItem } = useVaultStore();

  // Find the password in the local memory store
  const item = items.find((p) => p.id === id);

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [breachCount, setBreachCount] = useState<number | null>(null);
  const [isCheckingBreach, setIsCheckingBreach] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    title: "",
    message: "",
    type: "info" as any,
    buttons: [] as any[],
  });

  useEffect(() => {
    if (item?.password) {
      const checkBreach = async () => {
        setIsCheckingBreach(true);
        const count = await checkPasswordLeak(item.password!);
        setBreachCount(count);
        setIsCheckingBreach(false);
      };
      checkBreach();
    }
  }, [item?.password]);

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
      title: "Delete Password",
      message: "Are you sure? This action cannot be undone.",
      type: "warning",
      buttons: [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            deleteItem(item!.id);
            navigate("/vault");
          },
        },
      ],
    });
  };

  if (!item) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center p-8">
        <ShieldAlert className="w-16 h-16 text-subText mb-4 opacity-50" />
        <p className="text-subText font-medium">Password not found.</p>
        <button
          onClick={() => navigate("/vault")}
          className="text-primary mt-4 hover:underline"
        >
          Return to Vault
        </button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col relative">
      {/* HEADER */}
      <div className="flex justify-between items-center px-8 py-6 border-b border-border shrink-0">
        <button
          onClick={() => navigate("/vault")}
          className="p-2 hover:bg-inputBg rounded-full transition-colors text-text"
        >
          <X size={20} />
        </button>
        <button
          onClick={() => console.log("Navigate to edit page")}
          className="flex items-center gap-2 text-primary hover:text-blue-400 font-medium transition-colors"
        >
          <Edit2 size={16} /> Edit
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-8 py-6 custom-scrollbar">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* PROFILE CARD */}
          <div className="flex flex-col items-center mb-8">
            <BrandIcon
              name={item.name}
              url={item.url}
              color={item.color}
              size="lg"
            />
            <h1 className="text-2xl font-bold text-text mt-4">{item.name}</h1>
            <p className="text-subText">{item.email}</p>
          </div>

          {/* CREDENTIALS SECTION */}
          <section>
            <h2 className="text-xs font-bold text-subText mb-2 tracking-wider uppercase ml-2">
              Credentials
            </h2>
            <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
              <div className="flex items-center px-4 py-3 border-b border-border">
                <label className="w-24 text-text font-medium text-sm">
                  Username
                </label>
                <span className="flex-1 text-subText truncate">
                  {item.email || "No email"}
                </span>
                <button
                  onClick={() => copyToClipboard(item.email || "", "Username")}
                  className="p-2 text-primary hover:bg-inputBg rounded-lg transition-colors"
                >
                  <Copy size={18} />
                </button>
              </div>
              <div className="flex items-center px-4 py-3">
                <label className="w-24 text-text font-medium text-sm">
                  Password
                </label>
                <span className="flex-1 font-mono text-text truncate">
                  {isPasswordVisible ? item.password : "••••••••••••••••"}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                    className="p-2 text-primary hover:bg-inputBg rounded-lg transition-colors"
                  >
                    {isPasswordVisible ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                  <button
                    onClick={() =>
                      copyToClipboard(item.password || "", "Password")
                    }
                    className="p-2 text-primary hover:bg-inputBg rounded-lg transition-colors"
                  >
                    <Copy size={18} />
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* BREACH RADAR */}
          {isCheckingBreach ? (
            <div className="bg-card border border-border rounded-xl p-4 flex items-center shadow-sm">
              <div className="animate-spin w-5 h-5 border-2 border-primary border-t-transparent rounded-full mr-3" />
              <span className="text-subText text-sm">
                Scanning Breach Radar...
              </span>
            </div>
          ) : breachCount && breachCount > 0 ? (
            <div className="bg-danger/10 border border-danger rounded-xl p-4 flex items-center shadow-sm">
              <ShieldAlert className="text-danger w-6 h-6 mr-3 shrink-0" />
              <div>
                <h3 className="text-danger font-bold text-sm">
                  Leaked Password!
                </h3>
                <p className="text-text text-xs mt-1">
                  Found in{" "}
                  <span className="font-bold">
                    {breachCount.toLocaleString()}
                  </span>{" "}
                  data breaches. Change immediately.
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-green-500/10 border border-green-500 rounded-xl p-4 flex items-center shadow-sm">
              <ShieldCheck className="text-green-500 w-6 h-6 mr-3 shrink-0" />
              <div>
                <h3 className="text-green-500 font-bold text-sm">
                  Safe & Secure
                </h3>
                <p className="text-text text-xs mt-1">
                  No leaks detected in known data breaches.
                </p>
              </div>
            </div>
          )}

          {/* DETAILS SECTION */}
          <section>
            <h2 className="text-xs font-bold text-subText mb-2 tracking-wider uppercase ml-2">
              Details
            </h2>
            <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
              <div className="flex items-center px-4 py-3 border-b border-border">
                <label className="w-24 text-text font-medium text-sm">
                  Website
                </label>
                <span className="flex-1 text-subText truncate">
                  {item.url || "None"}
                </span>
              </div>
              <div className="flex items-start px-4 py-3 min-h-[100px]">
                <label className="w-24 text-text font-medium text-sm pt-1">
                  Notes
                </label>
                <span className="flex-1 text-subText leading-relaxed whitespace-pre-wrap">
                  {item.notes || "No notes added."}
                </span>
              </div>
            </div>
          </section>

          {/* DELETE ACTION */}
          <button
            onClick={handleDelete}
            className="w-full bg-card hover:bg-danger/10 text-danger border border-transparent hover:border-danger font-semibold py-4 rounded-xl transition-colors mt-4"
          >
            Delete Password
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

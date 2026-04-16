import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Sparkles,
  Key,
  Mail,
  Landmark,
  Wallet,
  Camera,
  MessageCircle,
  ShoppingCart,
  Search,
  Briefcase,
  Laptop,
} from "lucide-react";
import { useVaultStore } from "../store/useVaultStore";
import CustomAlert from "../components/CustomAlert";
import { getFaviconUrl } from "../components/BrandIcon";

const BRAND_ICONS = [
  { id: "amazon", name: "Amazon", Icon: ShoppingCart, color: "#FF9900" },
  { id: "google", name: "Google", Icon: Search, color: "#4285F4" },
  { id: "apple", name: "Apple", Icon: Laptop, color: "#000000" },
  { id: "instagram", name: "Instagram", Icon: Camera, color: "#E1306C" },
  { id: "twitter", name: "X / Twitter", Icon: MessageCircle, color: "#1DA1F2" },
  { id: "linkedin", name: "LinkedIn", Icon: Briefcase, color: "#0077B5" },
  { id: "bank", name: "Bank", Icon: Landmark, color: "#34C759" },
  { id: "crypto", name: "Crypto", Icon: Wallet, color: "#F7931A" },
  { id: "mail", name: "Email", Icon: Mail, color: "#5856D6" },
  { id: "other", name: "Other", Icon: Key, color: "#8E8E93" },
];

export default function AddPassword() {
  const navigate = useNavigate();
  const { addItem } = useVaultStore();

  const [serviceName, setServiceName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [url, setUrl] = useState("");
  const [notes, setNotes] = useState("");

  const [selectedIconId, setSelectedIconId] = useState("other");
  const [selectedColor, setSelectedColor] = useState("#8E8E93");
  const [autoFavicon, setAutoFavicon] = useState<string | null>(null);

  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    title: "",
    message: "",
    type: "info" as any,
  });

  // Auto-fetch Favicon logic
  useEffect(() => {
    if (url.length > 4 && url.includes(".")) {
      const fetchIcon = getFaviconUrl(url);
      if (fetchIcon) {
        setAutoFavicon(fetchIcon);
        setSelectedIconId("favicon");
      }
    } else {
      setAutoFavicon(null);
    }
  }, [url]);

  // Password Strength logic
  useEffect(() => {
    let score = 0;
    if (password.length > 8) score++;
    if (password.length > 12) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) score++;
    setPasswordStrength(score);
  }, [password]);

  const generatePassword = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";
    let autoPass = "";
    for (let i = 0; i < 16; i++) {
      autoPass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(autoPass);
  };

  const getStrengthColor = () => {
    if (password.length === 0) return "bg-border";
    if (passwordStrength <= 1) return "bg-danger";
    if (passwordStrength === 2) return "bg-orange-500";
    return "bg-green-500";
  };

  const handleSave = () => {
    if (!serviceName || !password) {
      setAlertConfig({
        visible: true,
        title: "Missing Info",
        message: "Please add a name and password.",
        type: "error",
      });
      return;
    }

    addItem({
      type: "password",
      name: serviceName,
      email,
      password,
      url,
      notes,
      icon: autoFavicon || selectedIconId,
      color: selectedColor,
    });

    navigate("/vault"); // Go back to the list
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
        <h1 className="text-xl font-bold text-text">Add Password</h1>
        <button
          onClick={handleSave}
          className="text-primary hover:text-blue-400 font-bold transition-colors"
        >
          Save
        </button>
      </div>

      {/* SCROLLABLE FORM */}
      <div className="flex-1 overflow-y-auto px-8 py-6 custom-scrollbar">
        <div className=" mx-auto space-y-8">
          {/* ICON PICKER */}
          <section>
            <h2 className="text-xs font-bold text-subText mb-4 tracking-wider uppercase">
              Choose Icon
            </h2>
            <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
              {/* If Favicon was found, show it as an option */}
              {autoFavicon && (
                <button
                  onClick={() => setSelectedIconId("favicon")}
                  className="flex flex-col items-center gap-2 min-w-[70px]"
                >
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${selectedIconId === "favicon" ? "bg-card border-2 border-primary" : "bg-card border border-border"}`}
                  >
                    <img
                      src={autoFavicon}
                      alt="Favicon"
                      className="w-8 h-8 rounded-md"
                    />
                  </div>
                  <span
                    className={`text-xs ${selectedIconId === "favicon" ? "text-text font-bold" : "text-subText"}`}
                  >
                    Website
                  </span>
                </button>
              )}

              {BRAND_ICONS.map((brand) => {
                const isSelected = selectedIconId === brand.id;
                return (
                  <button
                    key={brand.id}
                    onClick={() => {
                      setSelectedIconId(brand.id);
                      setSelectedColor(brand.color);
                    }}
                    className="flex flex-col items-center gap-2 min-w-[70px]"
                  >
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all"
                      style={{
                        backgroundColor: isSelected ? brand.color : undefined,
                        border: isSelected ? "none" : "1px solid var(--border)",
                      }}
                    >
                      <brand.Icon
                        className={`w-6 h-6 ${isSelected ? "text-white" : "text-subText"}`}
                      />
                    </div>
                    <span
                      className={`text-xs ${isSelected ? "text-text font-bold" : "text-subText"}`}
                    >
                      {brand.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* BASIC INFO */}
          <section className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="flex items-center px-4 py-1 border-b border-border">
              <label className="w-24 text-text font-medium text-sm">Name</label>
              <input
                type="text"
                placeholder="e.g. Netflix"
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none h-12 text-text"
              />
            </div>
            <div className="flex items-center px-4 py-1">
              <label className="w-24 text-text font-medium text-sm">
                Email
              </label>
              <input
                type="email"
                placeholder="username@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none h-12 text-text"
              />
            </div>
          </section>

          {/* PASSWORD */}
          <section>
            <h2 className="text-xs font-bold text-subText mb-4 tracking-wider uppercase">
              Password
            </h2>
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              <div className="flex items-center px-4 py-1 border-b border-border">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Required"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="flex-1 bg-transparent border-none outline-none h-12 text-text"
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-subText hover:text-text p-2 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {/* Strength Meter */}
              <div className="flex h-1 w-full gap-1">
                <div
                  className={`flex-1 transition-colors ${password.length > 0 ? getStrengthColor() : "bg-transparent"} opacity-40`}
                />
                <div
                  className={`flex-1 transition-colors ${passwordStrength >= 2 ? getStrengthColor() : "bg-transparent"} opacity-60`}
                />
                <div
                  className={`flex-1 transition-colors ${passwordStrength >= 3 ? getStrengthColor() : "bg-transparent"} opacity-80`}
                />
                <div
                  className={`flex-1 transition-colors ${passwordStrength >= 4 ? getStrengthColor() : "bg-transparent"} opacity-100`}
                />
              </div>

              <button
                onClick={generatePassword}
                className="w-full flex items-center justify-center gap-2 py-4 text-primary hover:bg-inputBg transition-colors font-semibold"
              >
                <Sparkles size={18} /> Generate Strong Password
              </button>
            </div>
          </section>

          {/* URL & NOTES */}
          <section className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="flex items-center px-4 py-1 border-b border-border">
              <label className="w-24 text-text font-medium text-sm">URL</label>
              <input
                type="url"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none h-12 text-text"
              />
            </div>
            <div className="flex items-start px-4 py-3">
              <label className="w-24 text-text font-medium text-sm pt-2">
                Notes
              </label>
              <textarea
                placeholder="Security questions, PINs, etc."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none min-h-[100px] resize-none text-text pt-2 custom-scrollbar"
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

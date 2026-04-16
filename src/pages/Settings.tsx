import { useState, useEffect } from "react";
import {
  Lock,
  Clock,
  Cloud,
  Download,
  ShieldCheck,
  User,
  Star,
  Trash2,
  ChevronRight,
} from "lucide-react";
import { useVaultStore } from "../store/useVaultStore";
import { clearSecureStore } from "../core/encryption";
import CustomAlert from "../components/CustomAlert";

export default function Settings() {
  const { clearVault } = useVaultStore();

  // --- STATE ---
  const [autoLockTime, setAutoLockTime] = useState<string>("5");
  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    title: "",
    message: "",
    type: "info" as any,
    buttons: [] as any[],
  });

  const closeAlert = () =>
    setAlertConfig((prev) => ({ ...prev, visible: false }));

  // Simulate loading settings
  useEffect(() => {
    const savedTime = localStorage.getItem("autoLockTime");
    if (savedTime) setAutoLockTime(savedTime);
  }, []);

  const handleAutoLockChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setAutoLockTime(val);
    localStorage.setItem("autoLockTime", val);
  };

  // --- ACTIONS ---
  const handleWipeData = async () => {
    setAlertConfig({
      visible: true,
      title: "Wipe All Data?",
      message:
        "This will permanently delete your encrypted vault from this device. You will lose everything.",
      type: "warning",
      buttons: [
        { text: "Cancel", style: "cancel" },
        {
          text: "Wipe Data",
          style: "destructive",
          onPress: async () => {
            await clearSecureStore(); // Nuke the Tauri .dat file
            clearVault(); // Nuke the Zustand RAM
            // Force reload the app to trigger the Auth screen
            window.location.reload();
          },
        },
      ],
    });
  };

  // --- REUSABLE ROW COMPONENT ---
  const SettingRow = ({
    icon: Icon,
    color,
    label,
    type,
    value,
    onChange,
    onClick,
    disabled,
  }: any) => (
    <div
      className={`flex items-center justify-between px-6 py-4 border-b border-border last:border-0 ${onClick ? "cursor-pointer hover:bg-inputBg transition-colors" : ""} ${disabled ? "opacity-50 pointer-events-none" : ""}`}
      onClick={onClick}
    >
      <div className="flex items-center gap-4">
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center ${color} bg-opacity-20`}
        >
          <Icon size={18} className={color.replace("bg-", "text-")} />
        </div>
        <span className="text-text font-medium">{label}</span>
      </div>

      {type === "select" ? (
        <select
          value={value}
          onChange={onChange}
          className="bg-inputBg text-text border border-border rounded-lg px-3 py-1.5 outline-none focus:border-primary text-sm font-medium cursor-pointer"
        >
          <option value="1">1 Minute</option>
          <option value="5">5 Minutes</option>
          <option value="15">15 Minutes</option>
          <option value="never">Never</option>
        </select>
      ) : type === "danger" ? (
        <span className="text-danger font-bold text-sm">WIPE</span>
      ) : (
        <ChevronRight size={20} className="text-subText" />
      )}
    </div>
  );

  return (
    <div className="h-full w-full flex flex-col px-8 pb-8">
      {/* HEADER */}
      <div className="flex justify-between items-center py-6 shrink-0 mt-4">
        <h1 className="text-4xl font-bold text-text tracking-tight">
          Settings
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        <div className="max-w-3xl space-y-8 mt-2 pb-10">
          {/* SECTION 1: SECURITY */}
          <section>
            <h2 className="text-xs font-bold text-subText mb-3 tracking-wider uppercase ml-2">
              Security
            </h2>
            <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
              <SettingRow
                icon={Lock}
                color="bg-green-500"
                label="Master Password"
                onClick={() =>
                  setAlertConfig({
                    visible: true,
                    title: "Coming Soon",
                    message:
                      "Password changing will be available in the next update.",
                    type: "info",
                    buttons: [],
                  })
                }
              />
              <SettingRow
                icon={Clock}
                color="bg-orange-500"
                label="Auto-Lock Vault"
                type="select"
                value={autoLockTime}
                onChange={handleAutoLockChange}
              />
            </div>
          </section>

          {/* SECTION 2: DATA */}
          <section>
            <h2 className="text-xs font-bold text-subText mb-3 tracking-wider uppercase ml-2">
              Data & Export
            </h2>
            <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
              <SettingRow
                icon={Cloud}
                color="bg-blue-500"
                label="Encrypted Cloud Backup"
                onClick={() =>
                  setAlertConfig({
                    visible: true,
                    title: "Premium Feature",
                    message: "Cloud sync requires a NeuroKey Pro subscription.",
                    type: "info",
                    buttons: [],
                  })
                }
              />
              <SettingRow
                icon={Download}
                color="bg-purple-500"
                label="Export Vault (.csv)"
                onClick={() =>
                  setAlertConfig({
                    visible: true,
                    title: "Export",
                    message:
                      "CSV export functionality is currently under development.",
                    type: "info",
                    buttons: [],
                  })
                }
              />
            </div>
          </section>

          {/* SECTION 3: ABOUT */}
          <section>
            <h2 className="text-xs font-bold text-subText mb-3 tracking-wider uppercase ml-2">
              About
            </h2>
            <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
              <SettingRow
                icon={ShieldCheck}
                color="bg-sky-500"
                label="Security Architecture"
                onClick={() =>
                  setAlertConfig({
                    visible: true,
                    title: "Zero-Knowledge",
                    message:
                      "NeuroKey uses AES-256 encryption. We never see your master password.",
                    type: "success",
                    buttons: [],
                  })
                }
              />
              <SettingRow
                icon={User}
                color="bg-fuchsia-500"
                label="Developer Team"
                onClick={() =>
                  setAlertConfig({
                    visible: true,
                    title: "Hello!",
                    message: "Built with passion by Ayoub Edahlouli.",
                    type: "info",
                    buttons: [],
                  })
                }
              />
              <SettingRow
                icon={Star}
                color="bg-yellow-500"
                label="Leave a Review"
                onClick={() =>
                  setAlertConfig({
                    visible: true,
                    title: "Thank You!",
                    message: "We appreciate your support.",
                    type: "success",
                    buttons: [],
                  })
                }
              />
            </div>
          </section>

          {/* SECTION 4: DANGER ZONE */}
          <section>
            <h2 className="text-xs font-bold text-danger mb-3 tracking-wider uppercase ml-2">
              Danger Zone
            </h2>
            <div className="bg-card border border-danger/30 rounded-3xl overflow-hidden shadow-sm">
              <SettingRow
                icon={Trash2}
                color="bg-danger"
                label="Wipe All Data"
                type="danger"
                onClick={handleWipeData}
              />
            </div>
            <p className="text-center text-subText text-sm mt-6 font-mono">
              NeuroKey v1.0.0 (Desktop)
            </p>
          </section>
        </div>
      </div>

      {/* RENDER CUSTOM ALERT */}
      <CustomAlert
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        buttons={alertConfig.buttons}
        onClose={closeAlert}
      />
    </div>
  );
}

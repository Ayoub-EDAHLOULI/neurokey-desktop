import { Shield, CreditCard, Radar, Settings } from "lucide-react";
import TitleBar from "../components/TitleBar";

export default function SidebarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen w-screen bg-transparent p-2">
      <div className="relative flex h-full w-full bg-background overflow-hidden rounded-xl border border-border shadow-2xl">
        <TitleBar />

        {/* LEFT SIDEBAR */}
        <aside className="w-64 bg-card border-r border-border flex flex-col pt-8 z-40">
          <div className="h-16 flex items-center px-6 border-b border-border shrink-0">
            <Shield className="text-primary w-6 h-6 mr-3" />
            <h1 className="text-lg font-bold text-text tracking-wide">
              NeuroKey
            </h1>
          </div>

          <nav className="flex-1 py-4 flex flex-col gap-2 px-3">
            <NavItem
              icon={<Shield size={20} />}
              label="Vault"
              isActive={true}
            />
            <NavItem
              icon={<CreditCard size={20} />}
              label="Digital Wallet"
              isActive={false}
            />
            <NavItem
              icon={<Radar size={20} />}
              label="Breach Radar"
              isActive={false}
            />
          </nav>

          <div className="p-3 border-t border-border">
            <NavItem
              icon={<Settings size={20} />}
              label="Settings"
              isActive={false}
            />
          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 flex flex-col bg-background pt-8 relative z-0">
          {children}
        </main>
      </div>
    </div>
  );
}

function NavItem({
  icon,
  label,
  isActive,
}: {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
}) {
  return (
    <button
      className={`flex items-center w-full px-3 py-2.5 rounded-lg transition-colors ${
        isActive
          ? "bg-primary text-white"
          : "text-subText hover:bg-inputBg hover:text-text"
      }`}
    >
      {icon}
      <span className="ml-3 font-medium text-sm">{label}</span>
    </button>
  );
}

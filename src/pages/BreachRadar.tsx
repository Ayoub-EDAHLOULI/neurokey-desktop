import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Activity, Search, AlertTriangle } from "lucide-react";
import { useVaultStore } from "../store/useVaultStore";
import { checkPasswordLeak } from "../core/breachCheck";

export default function BreachRadar() {
  const navigate = useNavigate();
  const { items } = useVaultStore();
  const passwords = items.filter((item) => item.type === "password");

  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [leakedItems, setLeakedItems] = useState<
    Array<{ id: string; name: string; count: number }>
  >([]);
  const [hasScanned, setHasScanned] = useState(false);

  const startBulkScan = async () => {
    setIsScanning(true);
    setHasScanned(false);
    setScanProgress(0);
    const foundLeaks = [];

    for (let i = 0; i < passwords.length; i++) {
      const item = passwords[i];
      if (item.password) {
        const count = await checkPasswordLeak(item.password);
        if (count > 0) {
          foundLeaks.push({ id: item.id, name: item.name, count });
        }
      }
      setScanProgress(Math.round(((i + 1) / passwords.length) * 100));
    }

    setLeakedItems(foundLeaks);
    setHasScanned(true);
    setIsScanning(false);
  };

  const getScore = () => {
    if (passwords.length === 0) return 100;
    return Math.max(
      0,
      100 - Math.round((leakedItems.length / passwords.length) * 100),
    );
  };

  return (
    <div className="h-full w-full flex flex-col px-8 pb-8">
      {/* HEADER */}
      <div className="flex justify-between items-center py-3 shrink-0 mt-2">
        <div>
          <h1 className="text-3xl font-bold text-text tracking-tight">
            Breach Radar
          </h1>
          <p className="text-subText mt-2">
            Scan your entire vault against known data breaches.
          </p>
        </div>
        <button
          onClick={startBulkScan}
          disabled={isScanning || passwords.length === 0}
          className="h-12 px-6 bg-primary hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-full flex items-center justify-center text-white font-bold transition-colors shadow-lg shadow-primary/30 gap-2"
        >
          {isScanning ? (
            <Activity className="animate-spin w-5 h-5" />
          ) : (
            <Search className="w-5 h-5" />
          )}
          {isScanning ? "Scanning..." : "Scan Vault"}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        {/* GLOBAL SCORE CARD */}
        <div className="bg-card border border-border rounded-3xl p-8 mb-8 flex flex-col items-center shadow-sm">
          <div className="relative w-48 h-48 flex items-center justify-center mb-4">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="96"
                cy="96"
                r="88"
                fill="none"
                stroke="var(--inputBg)"
                strokeWidth="16"
              />
              <circle
                cx="96"
                cy="96"
                r="88"
                fill="none"
                stroke={
                  hasScanned
                    ? getScore() === 100
                      ? "#34C759"
                      : "#FF3B30"
                    : "var(--primary)"
                }
                strokeWidth="16"
                strokeDasharray="552.92" /* 2 * PI * 88 */
                strokeDashoffset={
                  hasScanned ? 552.92 - (552.92 * getScore()) / 100 : 552.92
                }
                className="transition-all duration-1000 ease-out"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-4xl font-bold text-text">
                {hasScanned ? `${getScore()}%` : "--"}
              </span>
              <span className="text-xs font-bold text-subText tracking-widest uppercase mt-1">
                Health
              </span>
            </div>
          </div>
          {isScanning && (
            <div className="w-full max-w-md bg-inputBg h-2 rounded-full overflow-hidden mt-4">
              <div
                className="bg-primary h-full transition-all duration-300"
                style={{ width: `${scanProgress}%` }}
              />
            </div>
          )}
        </div>

        {/* RESULTS SECTION */}
        {hasScanned && (
          <div>
            <h2 className="text-xs font-bold text-subText mb-4 tracking-wider uppercase ml-2">
              {leakedItems.length === 0 ? "All Clear" : "Compromised Accounts"}
            </h2>

            {leakedItems.length === 0 ? (
              <div className="bg-green-500/10 border border-green-500 rounded-2xl p-6 flex flex-col items-center text-center">
                <ShieldCheck className="text-green-500 w-12 h-12 mb-3" />
                <h3 className="text-green-500 font-bold text-lg">
                  Your vault is completely secure.
                </h3>
                <p className="text-text mt-1">
                  None of your passwords appear in known public data breaches.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {leakedItems.map((leak) => {
                  return (
                    <div
                      key={leak.id}
                      className="bg-danger/10 border border-danger rounded-2xl p-4 flex items-center"
                    >
                      <AlertTriangle className="text-danger w-8 h-8 mr-4 shrink-0" />
                      <div className="flex-1 overflow-hidden">
                        <h3 className="text-danger font-bold truncate">
                          {leak.name}
                        </h3>
                        <p className="text-text text-sm truncate">
                          Exposed {leak.count.toLocaleString()} times
                        </p>
                      </div>
                      <button
                        onClick={() => navigate(`/edit-password/${leak.id}`)}
                        className="ml-4 px-4 py-2 bg-danger hover:bg-red-600 text-white text-sm font-bold rounded-xl transition-colors shrink-0"
                      >
                        Fix Now
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

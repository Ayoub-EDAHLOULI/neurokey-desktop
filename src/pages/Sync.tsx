import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { Smartphone, Wifi, ShieldCheck, RefreshCw } from "lucide-react";
import QRCode from "react-qr-code";

export default function Sync() {
  const [connectionString, setConnectionString] = useState<string>("");
  const [isError, setIsError] = useState(false);

  const fetchIpAddress = async () => {
    try {
      setIsError(false);
      // Call the Rust function to get the connection string (which includes the local IP and a random token)
      const ip = await invoke<string>("get_sync_connection_string");
      setConnectionString(ip);
    } catch (error) {
      console.error(error);
      setIsError(true);
    }
  };

  useEffect(() => {
    fetchIpAddress();
  }, []);

  return (
    <div className="h-full w-full flex flex-col px-8 pb-8">
      {/* HEADER */}
      <div className="flex justify-between items-center py-6 shrink-0 mt-4">
        <div>
          <h1 className="text-4xl font-bold text-text tracking-tight">
            Device Sync
          </h1>
          <p className="text-subText mt-2">
            Connect your mobile phone to transfer your vault securely.
          </p>
        </div>
        <button
          onClick={fetchIpAddress}
          className="h-12 px-6 bg-inputBg hover:bg-border rounded-full flex items-center justify-center text-text font-bold transition-colors gap-2"
        >
          <RefreshCw size={18} /> Refresh IP
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* LEFT: INSTRUCTIONS */}
          <div className="flex flex-col justify-center space-y-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                <Wifi className="text-blue-500 w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-text mb-1">
                  1. Same Network
                </h3>
                <p className="text-subText">
                  Ensure both your phone and computer are connected to the exact
                  same Wi-Fi network.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0">
                <Smartphone className="text-purple-500 w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-text mb-1">
                  2. Open NeuroKey Mobile
                </h3>
                <p className="text-subText">
                  Go to Settings &gt; Sync Devices on your mobile app and tap
                  "Scan QR Code".
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
                <ShieldCheck className="text-green-500 w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-text mb-1">
                  3. Secure Transfer
                </h3>
                <p className="text-subText">
                  Your data is encrypted end-to-end. It never touches the cloud
                  or leaves your home network.
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT: QR CODE */}
          <div className="bg-card border border-border rounded-3xl p-8 flex flex-col items-center justify-center shadow-xl">
            {isError ? (
              <div className="text-center p-6">
                <p className="text-danger font-bold text-lg mb-2">
                  Network Error
                </p>
                <p className="text-subText text-sm">
                  Could not detect your local IP address. Are you connected to
                  Wi-Fi?
                </p>
              </div>
            ) : connectionString ? (
              <>
                <div className="bg-white p-4 rounded-2xl mb-6 shadow-md">
                  <QRCode
                    value={connectionString}
                    size={200}
                    level="H" // High error correction
                  />
                </div>
                <p className="text-text font-mono font-bold tracking-widest bg-inputBg px-4 py-2 rounded-lg">
                  {connectionString}
                </p>
                <p className="text-subText text-xs mt-4 text-center max-w-[250px]">
                  Waiting for mobile connection...
                </p>
              </>
            ) : (
              <div className="animate-pulse w-[200px] h-[200px] bg-inputBg rounded-2xl mb-6" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

import { Wifi } from "lucide-react";

interface CreditCardProps {
  holder: string;
  number: string;
  expiry: string;
  type: "visa" | "mastercard" | "amex";
}

export default function CreditCard({
  holder,
  number,
  expiry,
  type,
}: CreditCardProps) {
  // Format: 1234 5678 9012 3456
  const formatNumber = (num: string) => {
    return num.replace(/(\d{4})/g, "$1 ").trim();
  };

  // Determine Gradient Classes
  const getGradient = () => {
    switch (type) {
      case "visa":
        return "from-[#1A2980] to-[#26D0CE]"; // Blue Cyan
      case "mastercard":
        return "from-[#FF512F] to-[#DD2476]"; // Orange Red
      case "amex":
        return "from-[#232526] to-[#414345]"; // Black Grey
      default:
        return "from-[#4DA0B0] to-[#D39D38]"; // Teal Gold
    }
  };

  return (
    <div
      className={`relative h-48 rounded-3xl p-6 flex flex-col justify-between shadow-2xl overflow-hidden bg-gradient-to-br ${getGradient()}`}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-black opacity-10 rounded-full blur-2xl -ml-10 -mb-10 pointer-events-none" />

      <div className="flex justify-between items-start relative z-10">
        <Wifi className="text-white/60 w-8 h-8 rotate-90" />
        <span className="text-white font-bold text-xl italic tracking-wider uppercase drop-shadow-md">
          {type}
        </span>
      </div>

      <div className="relative z-10">
        <p className="text-white text-xl tracking-[0.15em] font-semibold drop-shadow-md">
          {formatNumber(number)}
        </p>
      </div>

      <div className="flex justify-between relative z-10">
        <div>
          <p className="text-white/70 text-[10px] tracking-widest font-semibold mb-1">
            CARD HOLDER
          </p>
          <p className="text-white font-bold tracking-wide uppercase drop-shadow-sm truncate max-w-[160px]">
            {holder}
          </p>
        </div>
        <div className="text-right">
          <p className="text-white/70 text-[10px] tracking-widest font-semibold mb-1">
            EXPIRES
          </p>
          <p className="text-white font-bold tracking-wide drop-shadow-sm">
            {expiry}
          </p>
        </div>
      </div>
    </div>
  );
}

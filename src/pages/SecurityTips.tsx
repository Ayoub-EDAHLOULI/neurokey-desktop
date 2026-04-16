import { useNavigate } from "react-router-dom";
import { X, Key, Shuffle, ShieldCheck, Wifi, Mail } from "lucide-react";
import { motion } from "framer-motion";

const TIPS = [
  {
    Icon: Key,
    color: "text-orange-500",
    bg: "bg-orange-500",
    title: "The Strength of Length",
    content:
      "Complexity is good, but length is better. A password like 'CorrectHorseBatteryStaple' is harder to crack than 'Tr0ub4dor&3'. Aim for phrases over 12 characters.",
  },
  {
    Icon: Shuffle,
    color: "text-green-500",
    bg: "bg-green-500",
    title: "Don't Reuse Passwords",
    content:
      "If one site gets hacked, hackers will try that email and password combination everywhere. Use a unique password for every single account. That's why you have NeuroKey!",
  },
  {
    Icon: ShieldCheck,
    color: "text-blue-500",
    bg: "bg-blue-500",
    title: "Enable 2FA Everywhere",
    content:
      "Two-Factor Authentication (2FA) is your best defense. Even if someone steals your password, they can't get in without the second code. Use an authenticator app instead of SMS whenever possible.",
  },
  {
    Icon: Wifi,
    color: "text-purple-500",
    bg: "bg-purple-500",
    title: "Public Wi-Fi Danger",
    content:
      "Avoid logging into banking or sensitive sites on public Coffee Shop Wi-Fi. If you must, use a VPN or switch to your mobile data connection.",
  },
  {
    Icon: Mail,
    color: "text-danger",
    bg: "bg-danger",
    title: "Spotting Phishing",
    content:
      "Banks will never email you asking for your password. Check the sender's email address carefully. If it looks fishy (e.g., support@amaz0n-security.com), delete it.",
  },
];

export default function SecurityTips() {
  const navigate = useNavigate();

  return (
    <div className="h-full w-full flex flex-col px-8 pb-8">
      {/* HEADER */}
      <div className="flex justify-between items-center py-6 shrink-0 mt-4">
        <h1 className="text-4xl font-bold text-text tracking-tight">
          Security Guide
        </h1>
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 bg-inputBg hover:bg-border rounded-full flex items-center justify-center transition-colors text-text"
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        <div className="mx-auto pb-10">
          <p className="text-subText text-lg mb-8 leading-relaxed">
            Protecting your digital life goes beyond just storing passwords.
            Here are essential habits to keep you safe online.
          </p>

          <div className="space-y-4">
            {TIPS.map((tip, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                className="bg-card border border-border rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center mb-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4 ${tip.bg} bg-opacity-20`}
                  >
                    <tip.Icon size={24} className={tip.color} />
                  </div>
                  <h3 className="text-xl font-bold text-text">{tip.title}</h3>
                </div>
                <p className="text-subText leading-relaxed">{tip.content}</p>
              </motion.div>
            ))}
          </div>

          <p className="text-center text-subText mt-10 mb-4 opacity-50 tracking-widest uppercase font-bold text-sm">
            Stay Safe. Stay Secure.
          </p>
        </div>
      </div>
    </div>
  );
}

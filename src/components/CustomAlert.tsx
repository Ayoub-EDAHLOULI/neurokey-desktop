import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertCircle, AlertTriangle, Info } from "lucide-react";

interface AlertButton {
  text: string;
  onPress?: () => void;
  style?: "cancel" | "destructive" | "default";
}

interface CustomAlertProps {
  visible: boolean;
  title: string;
  message: string;
  buttons?: AlertButton[];
  type?: "success" | "error" | "warning" | "info";
  onClose: () => void;
}

export default function CustomAlert({
  visible,
  title,
  message,
  buttons = [],
  type = "info",
  onClose,
}: CustomAlertProps) {
  const getConfig = () => {
    switch (type) {
      case "success":
        return {
          Icon: CheckCircle,
          color: "text-green-500",
          bg: "bg-green-500/10",
        };
      case "error":
        return { Icon: AlertCircle, color: "text-danger", bg: "bg-danger/10" };
      case "warning":
        return {
          Icon: AlertTriangle,
          color: "text-orange-500",
          bg: "bg-orange-500/10",
        };
      default:
        return { Icon: Info, color: "text-primary", bg: "bg-primary/10" };
    }
  };

  const { Icon, color, bg } = getConfig();

  return (
    <AnimatePresence>
      {visible && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="w-full max-w-sm bg-card rounded-3xl p-6 flex flex-col items-center shadow-2xl border border-border"
          >
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${bg}`}
            >
              <Icon className={`w-8 h-8 ${color}`} />
            </div>

            <h3 className="text-xl font-bold text-text mb-2 text-center">
              {title}
            </h3>
            <p className="text-subText text-center mb-6 leading-relaxed">
              {message}
            </p>

            <div className="flex w-full gap-3">
              {buttons.length === 0 ? (
                <button
                  onClick={onClose}
                  className="flex-1 bg-primary hover:bg-blue-600 text-white font-bold py-3 rounded-xl transition-colors"
                >
                  OK
                </button>
              ) : (
                buttons.map((btn, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      if (btn.onPress) btn.onPress();
                      onClose();
                    }}
                    className={`flex-1 font-bold py-3 rounded-xl transition-colors ${
                      btn.style === "cancel"
                        ? "bg-inputBg hover:bg-border text-text"
                        : btn.style === "destructive"
                          ? "bg-danger hover:bg-red-600 text-white"
                          : "bg-primary hover:bg-blue-600 text-white"
                    }`}
                  >
                    {btn.text}
                  </button>
                ))
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

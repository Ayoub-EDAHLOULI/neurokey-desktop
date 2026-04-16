import { useState } from "react";
import { Search, Plus, ChevronRight, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useVaultStore } from "../store/useVaultStore";
import BrandIcon from "../components/BrandIcon";
import { useNavigate } from "react-router-dom";

export default function Vault() {
  const { items } = useVaultStore();
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const filteredData = items.filter(
    (item) =>
      item.type === "password" &&
      (item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.email?.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  return (
    <div className="h-full w-full flex flex-col px-8 pb-8">
      {/* 1. HEADER */}
      <div className="flex justify-between items-center py-6 shrink-0 mt-4">
        <h1 className="text-4xl font-bold text-text tracking-tight">
          Passwords
        </h1>
        <button
          className="w-10 h-10 bg-primary hover:bg-blue-600 rounded-full flex items-center justify-center transition-colors shadow-lg shadow-primary/30"
          onClick={() => navigate("/add-password")}
        >
          <Plus className="text-white w-6 h-6" />
        </button>
      </div>

      {/* 2. SEARCH BAR */}
      <div className="mb-6 shrink-0">
        <div className="flex items-center bg-inputBg h-12 rounded-xl px-4 border border-transparent focus-within:border-primary transition-colors">
          <Search className="text-subText w-5 h-5 mr-3" />
          <input
            type="text"
            placeholder="Search passwords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-text"
          />
        </div>
      </div>

      {/* 3. LIST OF PASSWORDS */}
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        {filteredData.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full opacity-60">
            <ShieldCheck className="w-16 h-16 text-subText mb-4" />
            <p className="text-subText font-medium">No passwords found.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <AnimatePresence>
              {filteredData.map((item) => (
                <motion.div
                  key={item.id}
                  onClick={() => navigate(`/view-password/${item.id}`)}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-card hover:bg-inputBg transition-colors border border-border rounded-2xl p-4 flex items-center cursor-pointer group"
                >
                  {/* Left: Icon */}
                  <BrandIcon
                    name={item.name}
                    url={item.url}
                    color={item.color}
                    size="md"
                  />

                  {/* Middle: Text Info */}
                  <div className="flex-1 ml-4 overflow-hidden">
                    <h3 className="text-text font-semibold text-lg truncate">
                      {item.name}
                    </h3>
                    <p className="text-subText text-sm truncate">
                      {item.email}
                    </p>
                  </div>

                  {/* Right: Chevron */}
                  <div className="text-subText group-hover:text-primary transition-colors opacity-0 group-hover:opacity-100 mr-2">
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}

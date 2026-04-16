import { useState, useEffect, useCallback } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SidebarLayout from "./layouts/SidebarLayout";
import TitleBar from "./components/TitleBar";
import Auth from "./pages/Auth";
import { useVaultStore } from "./store/useVaultStore";

// Import pages
import Vault from "./pages/Vault";
import Wallet from "./pages/Wallet";
import Generator from "./pages/Generator";
import BreachRadar from "./pages/BreachRadar";
import Settings from "./pages/Settings";
import AddPassword from "./pages/AddPassword";
import ViewPassword from "./pages/ViewPassword";
import EditPassword from "./pages/EditPassword";
import AddCard from "./pages/AddCard";
import ViewCard from "./pages/ViewCard";
import EditCard from "./pages/EditCard";
import SecurityTips from "./pages/SecurityTips";
import About from "./pages/About";

export default function App() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const { clearVault } = useVaultStore();

  // --- AUTO-LOCK LOGIC ---
  const handleLock = useCallback(() => {
    clearVault(); // Wipe the decrypted passwords from RAM
    setIsUnlocked(false); // Throw the user back to the Auth screen
  }, [clearVault]);

  useEffect(() => {
    // Only run the timer if the vault is actually unlocked
    if (!isUnlocked) return;

    let timeoutId: ReturnType<typeof setTimeout>;

    const resetTimer = () => {
      clearTimeout(timeoutId);

      // Grab the user's setting (default to 5 minutes if they haven't set one)
      const lockSetting = localStorage.getItem("autoLockTime") || "5";

      if (lockSetting !== "never") {
        // Convert minutes to milliseconds
        const timeInMs = parseInt(lockSetting) * 60 * 1000;

        // Start the countdown!
        timeoutId = setTimeout(() => {
          handleLock();
        }, timeInMs);
      }
    };

    // Every time the user moves the mouse, clicks, or types, reset the countdown clock
    const events = [
      "mousedown",
      "mousemove",
      "keydown",
      "scroll",
      "touchstart",
    ];
    events.forEach((event) => window.addEventListener(event, resetTimer));

    // Start the timer the moment they log in
    resetTimer();

    // Clean up the listeners when the component unmounts
    return () => {
      clearTimeout(timeoutId);
      events.forEach((event) => window.removeEventListener(event, resetTimer));
    };
  }, [isUnlocked, handleLock]);

  // If the vault is locked, only show the Auth screen
  if (!isUnlocked) {
    return (
      <div className="h-screen w-screen bg-background flex overflow-hidden relative">
        <TitleBar />
        <Auth onUnlock={() => setIsUnlocked(true)} />
      </div>
    );
  }
  // If unlocked, render the full routing application
  return (
    <BrowserRouter>
      <SidebarLayout>
        <Routes>
          <Route path="/" element={<Navigate to="/vault" replace />} />
          <Route path="/vault" element={<Vault />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/generator" element={<Generator />} />
          <Route path="/radar" element={<BreachRadar />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/add-password" element={<AddPassword />} />
          <Route path="/view-password/:id" element={<ViewPassword />} />
          <Route path="/edit-password/:id" element={<EditPassword />} />
          <Route path="/add-card" element={<AddCard />} />
          <Route path="/view-card/:id" element={<ViewCard />} />
          <Route path="/edit-card/:id" element={<EditCard />} />
          <Route path="/settings/security-tips" element={<SecurityTips />} />
          <Route path="/settings/about" element={<About />} />
        </Routes>
      </SidebarLayout>
    </BrowserRouter>
  );
}

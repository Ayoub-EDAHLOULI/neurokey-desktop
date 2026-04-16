import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SidebarLayout from "./layouts/SidebarLayout";
import TitleBar from "./components/TitleBar";
import Auth from "./pages/Auth";

// Import pages
import Vault from "./pages/Vault";
import Wallet from "./pages/Wallet";
import BreachRadar from "./pages/BreachRadar";
import Settings from "./pages/Settings";
import AddPassword from "./pages/AddPassword";
import ViewPassword from "./pages/ViewPassword";
import EditPassword from "./pages/EditPassword";
import AddCard from "./pages/AddCard";
import ViewCard from "./pages/ViewCard";
import EditCard from "./pages/EditCard";

export default function App() {
  const [isUnlocked, setIsUnlocked] = useState(false);

  // If the vault is locked, only show the Auth screen (and the TitleBar so they can drag/close it)
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
          <Route path="/radar" element={<BreachRadar />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/add-password" element={<AddPassword />} />
          <Route path="/view-password/:id" element={<ViewPassword />} />
          <Route path="/edit-password/:id" element={<EditPassword />} />
          <Route path="/add-card" element={<AddCard />} />
          <Route path="/view-card/:id" element={<ViewCard />} />
          <Route path="/edit-card/:id" element={<EditCard />} />
        </Routes>
      </SidebarLayout>
    </BrowserRouter>
  );
}

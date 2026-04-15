import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SidebarLayout from "./layouts/SidebarLayout";

// Import our new pages
import Vault from "./pages/Vault";
import Wallet from "./pages/Wallet";
import BreachRadar from "./pages/BreachRadar";
import Settings from "./pages/Settings";

export default function App() {
  return (
    // BrowserRouter wraps our entire app, enabling instant, offline navigation
    <BrowserRouter>
      <SidebarLayout>
        <Routes>
          {/* This automatically redirects the user to the Vault when they open the app */}
          <Route path="/" element={<Navigate to="/vault" replace />} />

          {/* Our application routes */}
          <Route path="/vault" element={<Vault />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/radar" element={<BreachRadar />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </SidebarLayout>
    </BrowserRouter>
  );
}

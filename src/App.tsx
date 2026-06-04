import { Routes, Route, Navigate } from "react-router-dom";
import { DebugPanel } from "@/components/DebugPanel";
import { Home } from "@/pages/Home";
import { Promotions } from "@/pages/Promotions";
import { PromoDetailsPage } from "@/pages/PromoDetailsPage";
import { Deposit } from "@/pages/Deposit";
import { CasinoLobby } from "@/pages/CasinoLobby";
import { Game } from "@/pages/Game";

export function App() {
  return (
    <div className="app-frame">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/promotions" element={<Promotions />} />
        <Route path="/promotions/:promoId" element={<PromoDetailsPage />} />
        <Route path="/deposit" element={<Deposit />} />
        <Route path="/casino" element={<CasinoLobby />} />
        <Route path="/casino/:gameId" element={<Game />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <DebugPanel />
    </div>
  );
}

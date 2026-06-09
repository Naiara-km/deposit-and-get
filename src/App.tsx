import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { DebugPanel } from "@/components/DebugPanel";
import { Home } from "@/pages/Home";
import { Promotions } from "@/pages/Promotions";
import { PromoDetailsPage } from "@/pages/PromoDetailsPage";
import { Deposit } from "@/pages/Deposit";
import { CasinoLobby } from "@/pages/CasinoLobby";
import { Game } from "@/pages/Game";

export function App() {
  // DebugPanel is hidden by default so usability-test participants never see
  // the demo controls. Toggle with Shift + D (outside form fields) to reveal
  // or hide it during demos. We use a visual hide (hidden attr) rather than
  // a conditional mount so the panel's internal state — which control is
  // expanded, slider scroll position, etc. — persists across toggles.
  const [showDebug, setShowDebug] = useState(false);
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      // Don't hijack Shift+D while the user is typing in a form field.
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName;
      if (
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        tag === "SELECT" ||
        target?.isContentEditable
      ) {
        return;
      }
      // Bare Shift + D only — no Cmd / Ctrl / Alt (those are browser
      // shortcuts like Cmd+Shift+D = bookmark all tabs).
      const isShiftD =
        e.shiftKey &&
        !e.metaKey &&
        !e.ctrlKey &&
        !e.altKey &&
        (e.key === "D" || e.code === "KeyD");
      if (!isShiftD) return;
      e.preventDefault();
      setShowDebug((v) => !v);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

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
      <div hidden={!showDebug}>
        <DebugPanel />
      </div>
    </div>
  );
}

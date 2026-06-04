import { AppHeader } from "@/components/AppHeader";
import { CasinoLobbyBanner } from "@/components/CasinoLobbyBanner";
import { StubScreen } from "@/components/StubScreen";

export function CasinoLobby() {
  return (
    <main className="pb-16">
      <AppHeader title="Casino" />

      <CasinoLobbyBanner />

      <StubScreen
        title="Casino lobby grid"
        notes="Out of scope for this prototype — only the Free Spins banner above is required."
      />
    </main>
  );
}

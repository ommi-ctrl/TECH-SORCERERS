import { createFileRoute } from "@tanstack/react-router";
import { TitleScreen } from "@/components/screens/TitleScreen";
import { HubScreen } from "@/components/screens/HubScreen";
import { RosterScreen } from "@/components/screens/RosterScreen";
import { ShopScreen } from "@/components/screens/ShopScreen";
import { MissionsScreen } from "@/components/screens/MissionsScreen";
import { CodexScreen } from "@/components/screens/CodexScreen";
import { BattleScreen } from "@/components/screens/BattleScreen";
import { ResultsScreen } from "@/components/screens/ResultsScreen";
import { useGame } from "@/game/store";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const screen = useGame((s) => s.screen);
  const toast = useGame((s) => s.toast);
  return (
    <main className="min-h-dvh bg-bg text-fg">
      {screen === "title" && <TitleScreen />}
      {screen === "hub" && <HubScreen />}
      {screen === "roster" && <RosterScreen />}
      {screen === "shop" && <ShopScreen />}
      {screen === "missions" && <MissionsScreen />}
      {screen === "codex" && <CodexScreen />}
      {screen === "battle" && <BattleScreen />}
      {screen === "results" && <ResultsScreen />}
      {toast ? (
        <div className="pointer-events-none fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-md border border-border bg-elevated px-4 py-2 text-sm">
          {toast}
        </div>
      ) : null}
    </main>
  );
}

import { Button } from "@/components/ui/button";
import { missionById } from "@/game/data";
import { useGame } from "@/game/store";

export function ResultsScreen() {
  const g = useGame();
  const r = g.result;
  const m = r ? missionById(r.missionId) : undefined;
  if (!r) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <Button onClick={() => g.setScreen("hub")}>Hub</Button>
      </div>
    );
  }
  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col justify-center gap-4 px-6">
      <p className="text-xs uppercase tracking-widest text-muted">{r.win ? "Veil sealed" : "Bound broken"}</p>
      <h1 className="font-display text-5xl">{r.win ? "Victory" : "Defeat"}</h1>
      <p className="text-sm text-muted">{m?.name} · Rank {r.rank}</p>
      <ul className="space-y-1 text-sm tabular-nums text-muted">
        <li>Damage {r.damage}</li>
        <li>Coins +{r.coins}</li>
        <li>Shards +{r.shards}</li>
        <li>XP +{r.xp}</li>
      </ul>
      <div className="mt-4 flex gap-2">
        <Button onClick={() => g.setScreen("missions")}>Missions</Button>
        <Button variant="secondary" onClick={() => g.setScreen("hub")}>
          Hub
        </Button>
      </div>
    </div>
  );
}

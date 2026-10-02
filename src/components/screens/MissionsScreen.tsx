import { Button } from "@/components/ui/button";
import { MISSIONS, curseById, fighterById } from "@/game/data";
import { useGame } from "@/game/store";
import { sfx } from "@/game/audio";
import { ArrowLeft, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

export function MissionsScreen() {
  const g = useGame();
  const f = fighterById(g.selected);
  return (
    <div className="mx-auto flex min-h-dvh max-w-3xl flex-col gap-5 px-4 py-6 sm:px-8">
      <header className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => g.setScreen("hub")} aria-label="Back">
          <ArrowLeft className="size-4" />
        </Button>
        <div>
          <h1 className="font-display text-3xl">Missions</h1>
          <p className="text-sm text-muted">Deploying {f.name} · 7 different arenas</p>
        </div>
      </header>

      <div className="max-h-[72vh] overflow-y-auto pr-1">
        <ul className="space-y-2">
          {MISSIONS.map((m) => {
            const locked = g.devMode ? false : m.requires ? !g.cleared.includes(m.requires) : false;
            const boss = m.bossId ? curseById(m.bossId) : null;
            const done = g.cleared.includes(m.id);
            return (
              <li key={m.id}>
                <button
                  disabled={locked}
                  onClick={() => {
                    if (locked) return;
                    sfx.ui();
                    g.startMission(m.id);
                  }}
                  className={cn(
                    "flex w-full items-center justify-between gap-3 rounded-xl border px-4 py-4 text-left",
                    locked ? "border-border bg-surface opacity-50" : "border-border bg-elevated hover:border-fg/30",
                  )}
                >
                  <div>
                    <p className="text-xs text-muted">{m.chapter} · Lv {m.level}</p>
                    <p className="font-medium">{m.name}</p>
                    <p className="text-xs text-subtle">
                      {boss ? `Boss ${boss.name}` : "Arena duel"} · {m.coins} coins
                      {done ? " · cleared" : ""}
                    </p>
                  </div>
                  {locked ? <Lock className="size-4 text-muted" /> : null}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

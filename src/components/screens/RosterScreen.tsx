import { Button } from "@/components/ui/button";
import { Portrait } from "@/game/Portrait";
import { FIGHTERS } from "@/game/data";
import { useGame } from "@/game/store";
import { sfx } from "@/game/audio";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export function RosterScreen() {
  const g = useGame();
  const selected = FIGHTERS.find((f) => f.id === g.selected) ?? FIGHTERS[0];
  return (
    <div className="mx-auto flex min-h-dvh max-w-5xl flex-col gap-5 px-4 py-6 sm:px-8">
      <header className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => g.setScreen("hub")} aria-label="Back">
          <ArrowLeft className="size-4" />
        </Button>
        <h1 className="font-display text-3xl">Roster</h1>
      </header>
      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        <div className="max-h-[72vh] overflow-y-auto pr-1">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {FIGHTERS.map((f) => {
              const owned = g.unlocked.includes(f.id);
              return (
                <button
                  key={f.id}
                  onClick={() => {
                    sfx.ui();
                    if (owned) g.selectFighter(f.id);
                  }}
                  className={cn(
                    "flex items-center gap-3 rounded-lg border p-3 text-left",
                    g.selected === f.id ? "border-fg bg-elevated" : "border-border bg-surface",
                    !owned && "opacity-50",
                  )}
                >
                  <Portrait who={f} size={48} />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{f.name}</p>
                    <p className="text-xs text-muted">{f.grade}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
        <aside className="rounded-xl border border-border bg-surface p-5">
          <Portrait who={selected} size={96} />
          <p className="mt-3 text-xs uppercase tracking-widest text-muted">{selected.grade} · {selected.title}</p>
          <h2 className="font-display text-3xl">{selected.name}</h2>
          <p className="mt-2 text-sm text-muted leading-relaxed">{selected.lore}</p>
          <ul className="mt-4 space-y-2">
            <li className="rounded-md border border-border p-3">
              <p className="text-sm font-medium">{selected.style} · {selected.weapon}</p>
              <p className="text-xs text-muted">Menace — {selected.menace}</p>
            </li>
          </ul>
          <p className="mt-3 text-xs text-subtle">HP {selected.hp} · SPD {selected.speed} · ATK {selected.damage}</p>
          {!g.unlocked.includes(selected.id) ? (
            <Button
              className="mt-4 w-full"
              onClick={() => {
                const ok = g.buyFighter(selected.id);
                g.flash(ok ? `${selected.name} bound.` : "Not enough currency.");
              }}
            >
              Bind {selected.unlockShards > 0 ? `${selected.unlockShards} shards` : `${selected.unlockCoins} coins`}
            </Button>
          ) : (
            <Button className="mt-4 w-full" variant="secondary" onClick={() => g.setScreen("missions")}>
              Take into the field
            </Button>
          )}
        </aside>
      </div>
    </div>
  );
}

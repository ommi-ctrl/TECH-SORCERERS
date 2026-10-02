import { Button } from "@/components/ui/button";
import { Portrait } from "@/game/Portrait";
import { fighterById } from "@/game/data";
import { useGame } from "@/game/store";
import { sfx } from "@/game/audio";
import { Coins, Gem, User, ShoppingBag, Map, BookOpen } from "lucide-react";
import { useState } from "react";

export function HubScreen() {
  const g = useGame();
  const f = fighterById(g.selected);
  const lv = g.levels[f.id] ?? 1;
  const [code, setCode] = useState("");

  return (
    <div className="mx-auto flex min-h-dvh max-w-5xl flex-col gap-6 px-4 py-6 sm:px-8">
      <header className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs tracking-[0.28em] text-muted uppercase">Technical Sorcerers</p>
          <h1 className="font-display text-4xl text-fg">Ring hall</h1>
        </div>
        <div className="flex gap-2 text-sm tabular-nums">
          <span className="flex h-10 items-center gap-1.5 rounded-lg border border-border bg-elevated px-3">
            <Coins className="size-4 text-muted" /> {g.coins}
          </span>
          <span className="flex h-10 items-center gap-1.5 rounded-lg border border-border bg-elevated px-3">
            <Gem className="size-4 text-muted" /> {g.shards}
          </span>
        </div>
      </header>

      <section className="flex flex-col gap-5 rounded-xl border border-border bg-surface p-5 sm:flex-row sm:items-center">
        <Portrait who={f} size={96} />
        <div className="flex-1">
          <p className="text-xs text-muted">{f.grade} · {f.title}</p>
          <h2 className="font-display text-3xl">{f.name}</h2>
          <p className="mt-1 text-sm text-muted">Level {lv} · {f.abilities.map((a) => a.name).join(" / ")}</p>
        </div>
        <Button variant="secondary" onClick={() => { sfx.ui(); g.setScreen("roster"); }}>
          Change fighter
        </Button>
      </section>

      {!g.devMode ? (
        <div className="rounded-xl border border-dashed border-border bg-elevated p-4">
          <label className="mb-2 block text-[10px] uppercase tracking-[0.3em] text-muted">Codes</label>
          <div className="flex gap-2">
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Dev"
              className="h-10 flex-1 rounded-lg border border-border bg-bg px-3 text-sm text-fg outline-none placeholder:text-subtle"
            />
            <Button
              variant="secondary"
              className="h-10"
              onClick={() => {
                const ok = g.activateDevMode(code);
                if (!ok) g.flash("Access code rejected.");
                else g.flash("Developer mode enabled.");
              }}
            >
              Unlock
            </Button>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-ok/40 bg-ok/10 p-4 text-sm text-ok">Developer mode active — full roster, all arenas, max coins, shards, and items.</div>
      )}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { id: "missions" as const, label: "Missions", icon: Map, blurb: "7 arenas · side-view duels" },
          { id: "roster" as const, label: "Roster", icon: User, blurb: "Humans, weapons, Menace" },
          { id: "shop" as const, label: "Shop", icon: ShoppingBag, blurb: "Summon and supplies" },
          { id: "codex" as const, label: "Codex", icon: BookOpen, blurb: "Styles and curses" },
        ].map((c) => (
          <button
            key={c.id}
            className="flex min-h-28 flex-col items-start gap-2 rounded-xl border border-border bg-elevated p-4 text-left hover:border-fg/30"
            onClick={() => { sfx.ui(); g.setScreen(c.id); }}
          >
            <c.icon className="size-5 text-muted" />
            <span className="font-medium">{c.label}</span>
            <span className="text-xs text-muted">{c.blurb}</span>
          </button>
        ))}
      </div>

      <div className="mt-auto flex flex-wrap gap-3">
        <Button
          variant="secondary"
          onClick={() => {
            const ok = g.claimDaily();
            g.flash(ok ? "Daily bound — coins and shards delivered." : "Already claimed today.");
            sfx.ui();
          }}
        >
          Daily offering
        </Button>
        <p className="self-center text-sm text-muted">Talismans {g.talismans} · Elixirs {g.elixirs}</p>
      </div>
    </div>
  );
}

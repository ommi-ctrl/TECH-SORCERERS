import { Button } from "@/components/ui/button";
import { SUMMON_COST, PITY_SPECIAL, fighterById } from "@/game/data";
import { useGame } from "@/game/store";
import { sfx } from "@/game/audio";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";

export function ShopScreen() {
  const g = useGame();
  const [last, setLast] = useState<string | null>(null);
  const pulled = last ? fighterById(last) : null;
  return (
    <div className="mx-auto flex min-h-dvh max-w-3xl flex-col gap-6 px-4 py-6 sm:px-8">
      <header className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => g.setScreen("hub")} aria-label="Back">
          <ArrowLeft className="size-4" />
        </Button>
        <h1 className="font-display text-3xl">Shop</h1>
      </header>
      <p className="text-sm text-muted">
        Shards {g.shards} · Coins {g.coins} · Pity {g.pity}/{PITY_SPECIAL}
      </p>
      <section className="rounded-xl border border-border bg-surface p-6">
        <h2 className="font-display text-2xl">Veil Draw</h2>
        <p className="mt-2 text-sm text-muted">
          Spend {SUMMON_COST} shards to bind a random locked sorcerer. Special Grade is guaranteed by pity.
        </p>
        <Button
          className="mt-5"
          onClick={() => {
            const id = g.summon();
            if (!id) {
              g.flash("Need shards, or the roster is complete.");
              return;
            }
            sfx.summon();
            setLast(id);
          }}
        >
          Draw for {SUMMON_COST} shards
        </Button>
        {pulled ? (
          <p className="mt-4 text-sm">
            Bound <span className="font-medium">{pulled.name}</span> · {pulled.grade} · {pulled.abilities[0].name}
          </p>
        ) : null}
      </section>
      <section className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-border bg-surface p-5">
          <h3 className="font-medium">Paper Talisman</h3>
          <p className="mt-1 text-sm text-muted">Start the next hunt with a brief Infinity buffer.</p>
          <Button className="mt-4" variant="secondary" onClick={() => g.flash(g.buyItem("talisman") ? "Talisman packed." : "Not enough coins.")}>
            Buy · 140 coins
          </Button>
        </div>
        <div className="rounded-xl border border-border bg-surface p-5">
          <h3 className="font-medium">Black Elixir</h3>
          <p className="mt-1 text-sm text-muted">+40 max HP on the next mission.</p>
          <Button className="mt-4" variant="secondary" onClick={() => g.flash(g.buyItem("elixir") ? "Elixir packed." : "Not enough coins.")}>
            Buy · 220 coins
          </Button>
        </div>
      </section>
    </div>
  );
}

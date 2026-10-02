import { Button } from "@/components/ui/button";
import { CURSES, FIGHTERS } from "@/game/data";
import { Portrait } from "@/game/Portrait";
import { useGame } from "@/game/store";
import { ArrowLeft } from "lucide-react";

export function CodexScreen() {
  const setScreen = useGame((s) => s.setScreen);
  return (
    <div className="mx-auto flex min-h-dvh max-w-4xl flex-col gap-6 px-4 py-6 sm:px-8">
      <header className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => setScreen("hub")} aria-label="Back">
          <ArrowLeft className="size-4" />
        </Button>
        <h1 className="font-display text-3xl">Codex</h1>
      </header>

      <div className="max-h-[76vh] space-y-6 overflow-y-auto pr-1">
        <section>
          <h2 className="mb-3 text-sm uppercase tracking-widest text-muted">Technical sorcerers</h2>
          <div className="space-y-3">
            {FIGHTERS.map((f) => (
              <article key={f.id} className="flex gap-4 rounded-xl border border-border bg-surface p-4">
                <Portrait who={f} size={56} />
                <div>
                  <p className="font-medium">{f.name} · {f.grade}</p>
                  <p className="text-sm text-muted">{f.style} · {f.weapon} · Menace</p>
                  <p className="mt-1 text-sm text-subtle">{f.menace} {f.lore}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
        <section>
          <h2 className="mb-3 text-sm uppercase tracking-widest text-muted">Curses and their styles</h2>
          <div className="space-y-3">
            {CURSES.map((c) => (
              <article key={c.id} className="flex gap-4 rounded-xl border border-border bg-surface p-4">
                <Portrait who={c} size={56} />
                <div>
                  <p className="font-medium">{c.name} · {c.grade}</p>
                  <p className="text-sm text-muted">{c.style} · {c.weapon}</p>
                  <p className="mt-1 text-sm text-subtle">{c.menace} {c.lore}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

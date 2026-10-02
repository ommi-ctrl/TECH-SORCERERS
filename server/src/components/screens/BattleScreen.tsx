import { Button } from "@/components/ui/button";
import { createBattle, type BattleHandle } from "@/game/engine";
import { fighterById, missionById } from "@/game/data";
import { useGame } from "@/game/store";
import { useEffect, useRef, useState } from "react";

type Hud = {
  hp: number;
  maxHp: number;
  energy: number;
  maxEnergy: number;
  cds: Record<string, number>;
  dodgeCd: number;
  combo: number;
  veil: number;
  gaze: number;
  paused: boolean;
  boss: { name: string; hp: number; max: number } | null;
  map?: string;
  style?: string;
  foe?: { name: string; hp: number; max: number; style: string } | null;
};

export function BattleScreen() {
  const g = useGame();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const handle = useRef<BattleHandle | null>(null);
  const [hud, setHud] = useState<Hud | null>(null);
  const [prep, setPrep] = useState(true);
  const [useT, setUseT] = useState(false);
  const [useE, setUseE] = useState(false);
  const mission = g.missionId ? missionById(g.missionId) : undefined;
  const fighter = fighterById(g.selected);

  useEffect(() => {
    if (prep || !canvasRef.current || !mission) return;
    const h = createBattle(canvasRef.current, mission, g.selected, g.levels[g.selected] ?? 1, {
      shake: g.shake,
      useTalisman: useT,
      useElixir: useE,
      devMode: g.devMode,
      onEnd: (r) => g.finishBattle({ ...r, missionId: mission.id }),
    });
    handle.current = h;
    h.setHud((s) => setHud(s as Hud));
    return () => h.destroy();
  }, [prep]);

  if (!mission) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <Button onClick={() => g.setScreen("missions")}>Back to missions</Button>
      </div>
    );
  }

  if (prep) {
    return (
      <div className="mx-auto flex min-h-dvh max-w-md flex-col justify-center gap-5 px-6">
        <p className="text-xs uppercase tracking-widest text-muted">{mission.chapter}</p>
        <h1 className="font-display text-4xl">{mission.name}</h1>
        <p className="text-sm text-muted">
          {fighter.name} · {fighter.style} · {fighter.weapon}. A/D walk, W/S sidestep, Space jump.
          J light, K heavy, I kick, hold L to block, Q Menace. Click also strikes.
        </p>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={useT} disabled={g.talismans <= 0} onChange={(e) => setUseT(e.target.checked)} />
          Spend talisman ({g.talismans})
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={useE} disabled={g.elixirs <= 0} onChange={(e) => setUseE(e.target.checked)} />
          Spend elixir ({g.elixirs})
        </label>
        <Button
          size="lg"
          onClick={() => {
            if (useT) g.spendItem("talisman");
            if (useE) g.spendItem("elixir");
            setPrep(false);
          }}
        >
          Step into the arena
        </Button>
        <Button variant="ghost" onClick={() => g.setScreen("missions")}>
          Cancel
        </Button>
      </div>
    );
  }

  return (
    <div className="relative h-dvh w-full overflow-hidden bg-bg">
      <canvas ref={canvasRef} className="block h-full w-full touch-none" />
      {hud ? (
        <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-3 sm:p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-40 max-w-xs rounded-lg border border-border bg-bg/80 p-3">
              <p className="text-xs text-muted">{fighter.name} · {hud.style ?? fighter.style}</p>
              <p className="text-[10px] uppercase tracking-widest text-subtle">{hud.map}</p>
              <Bar v={hud.hp} m={hud.maxHp} />
              <Bar v={hud.energy} m={hud.maxEnergy} muted />
              {hud.combo > 1 ? <p className="mt-1 text-xs tabular-nums text-muted">Combo {hud.combo}</p> : null}
            </div>
            {hud.boss ? (
              <div className="min-w-40 max-w-xs rounded-lg border border-border bg-bg/80 p-3 text-right">
                <p className="text-xs text-muted">{hud.boss.name}</p>
                <Bar v={hud.boss.hp} m={hud.boss.max} danger />
              </div>
            ) : null}
          </div>
          <div className="pointer-events-auto flex items-end justify-between gap-3">
            <Stick on={(x, y, a) => handle.current?.setTouchMove(x, y, a)} label="Move" />
            <div className="flex flex-wrap justify-end gap-2">
              {fighter.abilities.map((a, i) => (
                <button
                  key={a.id}
                  className="h-14 min-w-14 rounded-full border border-border bg-elevated px-3 text-xs"
                  onClick={() => handle.current?.castAbility(i)}
                >
                  Menace
                  <span className="block text-[10px] text-muted">{Math.ceil(hud.cds[a.id] ?? 0)}</span>
                </button>
              ))}
              <button
                className="h-14 min-w-14 rounded-full border border-border bg-elevated text-xs"
                onClick={() => handle.current?.dodge()}
              >
                Dodge
              </button>
              <button
                className="h-11 rounded-md border border-border bg-bg/80 px-3 text-xs"
                onClick={() => handle.current?.pause()}
              >
                {hud.paused ? "Resume" : "Pause"}
              </button>
            </div>
            <Stick on={(x, y, a) => handle.current?.setTouchAim(x, y, a)} label="Aim" />
          </div>
        </div>
      ) : null}
      {hud?.paused ? (
        <div className="absolute inset-0 flex items-center justify-center bg-bg/70">
          <div className="rounded-xl border border-border bg-surface p-6 text-center">
            <p className="font-display text-3xl">Paused</p>
            <div className="mt-4 flex gap-2">
              <Button onClick={() => handle.current?.pause()}>Resume</Button>
              <Button variant="secondary" onClick={() => g.setScreen("hub")}>
                Abandon
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function Bar({ v, m, muted, danger }: { v: number; m: number; muted?: boolean; danger?: boolean }) {
  return (
    <div className="mt-1 h-1.5 w-40 overflow-hidden rounded-full bg-elevated">
      <div
        className={`h-full ${danger ? "bg-danger" : muted ? "bg-muted" : "bg-fg"}`}
        style={{ width: `${Math.max(0, Math.min(100, (v / m) * 100))}%` }}
      />
    </div>
  );
}

function Stick({ on, label }: { on: (x: number, y: number, active: boolean) => void; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={ref}
      className="pointer-events-auto flex size-24 touch-none items-center justify-center rounded-full border border-border bg-elevated/70 text-[10px] text-muted sm:hidden"
      onPointerDown={(e) => {
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
        move(e);
      }}
      onPointerMove={move}
      onPointerUp={() => on(0, 0, false)}
    >
      {label}
    </div>
  );
  function move(e: React.PointerEvent) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width * 2 - 1;
    const y = (e.clientY - r.top) / r.height * 2 - 1;
    const l = Math.hypot(x, y) || 1;
    on(x / Math.max(1, l), y / Math.max(1, l), true);
  }
}

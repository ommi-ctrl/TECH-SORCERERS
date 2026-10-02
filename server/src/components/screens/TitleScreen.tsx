import { Button } from "@/components/ui/button";
import { unlockAudio, startMusic, setMix } from "@/game/audio";
import { useGame } from "@/game/store";
import { useState } from "react";

export function TitleScreen() {
  const setScreen = useGame((s) => s.setScreen);
  const sfx = useGame((s) => s.sfx);
  const music = useGame((s) => s.music);
  const activateDevMode = useGame((s) => s.activateDevMode);
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-bg px-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#0c0c0e_72%)]" />
      <div className="relative z-10 max-w-lg text-center">
        <p className="mb-3 text-xs tracking-[0.35em] text-muted uppercase">Codes and arenas</p>
        <h1 className="font-display text-6xl font-semibold tracking-tight text-fg sm:text-7xl">
          Technical Sorcerers
        </h1>
        <p className="mt-4 text-sm text-muted leading-relaxed">
          Human sorcerers. Real weapons. Menace on Q. Seven arenas, side-view like a classic 3D fighter.
        </p>

        <div className="mt-8 flex flex-col items-center gap-3">
          <Button
            size="lg"
            className="min-w-52"
            onClick={() => {
              unlockAudio();
              setMix(sfx, music);
              startMusic();
              setScreen("hub");
            }}
          >
            Enter the ring
          </Button>

          <div className="w-full max-w-xs rounded-xl border border-border bg-surface p-3">
            <label className="mb-2 block text-[10px] uppercase tracking-[0.3em] text-muted">Codes</label>
            <div className="flex gap-2">
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Type Dev"
                className="h-10 flex-1 rounded-lg border border-border bg-bg px-3 text-sm text-fg outline-none ring-0 placeholder:text-subtle"
              />
              <Button
                variant="secondary"
                className="h-10"
                onClick={() => {
                  const ok = activateDevMode(code);
                  setStatus(ok ? "Developer mode unlocked." : "Access code rejected.");
                  if (ok) {
                    unlockAudio();
                    setMix(sfx, music);
                    startMusic();
                    setScreen("hub");
                  }
                }}
              >
                Unlock
              </Button>
            </div>
            {status ? <p className="mt-2 text-xs text-muted">{status}</p> : null}
          </div>

          <p className="text-xs text-subtle">Progress is kept on this device</p>
        </div>
      </div>
    </div>
  );
}

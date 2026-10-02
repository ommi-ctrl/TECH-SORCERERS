let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let sfxGain: GainNode | null = null;
let musicGain: GainNode | null = null;
let musicTimer = 0;
let musicOn = false;

export function unlockAudio() {
  if (!ctx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    ctx = new AC({ latencyHint: "interactive" });
    master = ctx.createGain();
    sfxGain = ctx.createGain();
    musicGain = ctx.createGain();
    sfxGain.connect(master);
    musicGain.connect(master);
    master.connect(ctx.destination);
  }
  if (ctx.state === "suspended") void ctx.resume();
}

export function setMix(sfx: number, music: number) {
  if (!sfxGain || !musicGain) return;
  sfxGain.gain.setTargetAtTime(sfx * sfx, ctx!.currentTime, 0.02);
  musicGain.gain.setTargetAtTime(music * music * 0.35, ctx!.currentTime, 0.05);
}

function beep(freq: number, dur: number, type: OscillatorType, vol = 0.12, slide = 0) {
  if (!ctx || !sfxGain) return;
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = type;
  o.frequency.value = freq;
  if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(40, freq + slide), ctx.currentTime + dur);
  g.gain.value = vol;
  g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
  o.connect(g);
  g.connect(sfxGain);
  o.start();
  o.stop(ctx.currentTime + dur + 0.02);
}

export const sfx = {
  hit: () => beep(220, 0.08, "square", 0.08, -80),
  crit: () => beep(480, 0.12, "sawtooth", 0.1, 200),
  skill: () => {
    beep(140, 0.18, "sawtooth", 0.1, 60);
    beep(420, 0.1, "triangle", 0.06);
  },
  dash: () => beep(90, 0.12, "sine", 0.08, 140),
  hurt: () => beep(110, 0.16, "square", 0.1, -50),
  win: () => {
    beep(330, 0.15, "triangle", 0.08);
    beep(440, 0.2, "triangle", 0.07);
  },
  lose: () => beep(80, 0.4, "sawtooth", 0.1, -40),
  ui: () => beep(520, 0.05, "sine", 0.04),
  summon: () => beep(260, 0.3, "triangle", 0.09, 400),
};

export function startMusic() {
  if (!ctx || !musicGain || musicOn) return;
  musicOn = true;
  const pulse = () => {
    if (!ctx || !musicGain || !musicOn) return;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "sine";
    o.frequency.value = [55, 65, 73, 82][Math.floor(Math.random() * 4)];
    g.gain.value = 0.05;
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.4);
    o.connect(g);
    g.connect(musicGain);
    o.start();
    o.stop(ctx.currentTime + 1.5);
    musicTimer = window.setTimeout(pulse, 1400);
  };
  pulse();
}

export function stopMusic() {
  musicOn = false;
  window.clearTimeout(musicTimer);
}

if (typeof document !== "undefined") {
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) return;
    if (ctx?.state === "suspended") void ctx.resume();
  });
}

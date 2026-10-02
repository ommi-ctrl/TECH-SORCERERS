import { curseById, fighterById, mapForMission, type FighterDef, type MissionDef } from "./data";
import { sfx } from "./audio";

export type BattleHooks = {
  onEnd: (payload: {
    win: boolean;
    coins: number;
    shards: number;
    xp: number;
    rank: string;
    damage: number;
  }) => void;
  shake: boolean;
  useTalisman: boolean;
  useElixir: boolean;
  devMode?: boolean;
};

type Phase = "idle" | "walk" | "light" | "heavy" | "kick" | "menace" | "block" | "hit" | "jump" | "down";

type Body = {
  id: number;
  team: 0 | 1;
  name: string;
  style: string;
  weapon: string;
  color: string;
  accent: string;
  skin: string;
  hair: string;
  x: number;
  z: number;
  y: number;
  vx: number;
  vz: number;
  vy: number;
  facing: 1 | -1;
  hp: number;
  maxHp: number;
  dmg: number;
  speed: number;
  phase: Phase;
  pt: number;
  stun: number;
  iFrames: number;
  marked: number;
  slow: number;
  hitOnce: boolean;
  boss: boolean;
  menaceId: string;
  ai: number;
};

type Shot = {
  x: number;
  z: number;
  y: number;
  vx: number;
  vz: number;
  life: number;
  dmg: number;
  team: 0 | 1;
  color: string;
  r: number;
  homing: boolean;
  kind: string;
};

type Spark = { x: number; y: number; z: number; vx: number; vy: number; vz: number; life: number; color: string };

const RING = { x: 460, z: 150 };
let nid = 1;

export function createBattle(
  canvas: HTMLCanvasElement,
  mission: MissionDef,
  fighterId: string,
  level: number,
  hooks: BattleHooks,
) {
  const ctx = canvas.getContext("2d")!;
  const fighter = fighterById(fighterId);
  const map = mapForMission(mission.chapter);
  const lvMul = 1 + (level - 1) * 0.06;
  const dev = Boolean(hooks.devMode);
  const keys: Record<string, boolean> = {};
  const touchMove = { x: 0, y: 0, active: false };

  let bodies: Body[] = [];
  let shots: Shot[] = [];
  let sparks: Spark[] = [];
  let nums: { x: number; y: number; t: number; txt: string; col: string }[] = [];
  let trauma = 0;
  let hitstop = 0;
  let acc = 0;
  let last = 0;
  let running = true;
  let paused = false;
  let energy = dev ? fighter.energy : fighter.energy;
  const maxEnergy = fighter.energy;
  const cds: Record<string, number> = {};
  fighter.abilities.forEach((a) => (cds[a.id] = 0));
  let combo = 0;
  let comboT = 0;
  let damageDealt = 0;
  let taken = 0;
  let queue = mission.fodder;
  let bossLeft = Boolean(mission.bossId);
  let round = 1;
  let intro = 1.2;
  let ended = false;
  let onHud: ((h: ReturnType<typeof hud>) => void) | null = null;
  const veil = hooks.useTalisman ? 3 : 0;

  const skins = ["#e6c2a2", "#d7a67a", "#c68642", "#8d5524", "#f1d3b3", "#a56b45"];
  const player: Body = {
    id: nid++,
    team: 0,
    name: fighter.name,
    style: fighter.style,
    weapon: fighter.weapon,
    color: fighter.color,
    accent: fighter.accent,
    skin: skins[fighter.name.length % skins.length],
    hair: fighter.hair,
    x: -180,
    z: 0,
    y: 0,
    vx: 0,
    vz: 0,
    vy: 0,
    facing: 1,
    hp: Math.round(fighter.hp * lvMul) + (hooks.useElixir ? 50 : 0) + (dev ? 80 : 0),
    maxHp: Math.round(fighter.hp * lvMul) + (hooks.useElixir ? 50 : 0) + (dev ? 80 : 0),
    dmg: fighter.damage * (dev ? 2.4 : 1),
    speed: fighter.speed,
    phase: "idle",
    pt: 0,
    stun: 0,
    iFrames: 0.4,
    marked: 0,
    slow: 0,
    hitOnce: false,
    boss: false,
    menaceId: fighter.id,
    ai: 0,
  };
  bodies.push(player);

  function burst(x: number, y: number, z: number, color: string, n = 10) {
    for (let i = 0; i < n; i++) {
      sparks.push({
        x, y, z,
        vx: (Math.random() - 0.5) * 220,
        vy: Math.random() * 160,
        vz: (Math.random() - 0.5) * 80,
        life: 0.35 + Math.random() * 0.3,
        color,
      });
    }
  }

  function floatNum(x: number, y: number, txt: string, col: string) {
    nums.push({ x, y, t: 0.7, txt, col });
  }

  function spawnFoe(boss = false) {
    const curse = boss && mission.bossId ? curseById(mission.bossId) : null;
    const hp = boss
      ? Math.round((curse?.hp ?? 280) * (1 + mission.level * 0.04))
      : Math.round(mission.fodderHp * (0.85 + Math.random() * 0.3));
    const foe: Body = {
      id: nid++,
      team: 1,
      name: curse?.name ?? `Curse ${round}`,
      style: curse?.style ?? "Wild claw",
      weapon: curse?.weapon ?? "claws",
      color: curse?.color ?? "#8a847c",
      accent: curse?.accent ?? "#c45a3a",
      skin: boss ? "#cbb8a4" : "#b9a08c",
      hair: "crop",
      x: 240,
      z: (Math.random() - 0.5) * 40,
      y: 0,
      vx: 0,
      vz: 0,
      vy: 0,
      facing: -1,
      hp,
      maxHp: hp,
      dmg: (curse?.damage ?? 8 + mission.level * 0.35) * (boss ? 1.15 : 0.72),
      speed: curse?.speed ?? 160,
      phase: "idle",
      pt: 0,
      stun: 0,
      iFrames: 0.45,
      marked: 0,
      slow: 0,
      hitOnce: false,
      boss,
      menaceId: curse?.id ?? "fodder",
      ai: 0.4 + Math.random() * 0.4,
    };
    bodies.push(foe);
    intro = 0.6;
  }

  function project(x: number, y: number, z: number) {
    const depth = (z + RING.z) / (RING.z * 2);
    const scale = 0.78 + depth * 0.55;
    const sx = 840 + x * (0.92 + depth * 0.18);
    const ground = 690 - z * 1.15;
    const sy = ground - y * scale;
    return { sx, sy, scale, depth };
  }

  function hurt(e: Body, amt: number, src: Body | null, crit = false, lift = 0) {
    if (e.iFrames > 0 || e.phase === "down") return;
    if (e.phase === "block" && src && Math.sign(src.x - e.x) === e.facing) {
      amt *= 0.22;
      floatNum(e.x, e.y + 70, "BLOCK", "#d7d2c8");
      e.vx += (src.x < e.x ? 1 : -1) * -40;
      return;
    }
    const mark = e.marked > 0 ? 1.35 : 1;
    const dealt = Math.max(1, Math.round(amt * mark * (crit ? 1.4 : 1)));
    e.hp -= dealt;
    e.phase = "hit";
    e.pt = 0;
    e.stun = crit ? 0.34 : 0.2;
    e.hitOnce = false;
    e.vy = lift;
    if (src) e.vx = Math.sign(e.x - src.x) * (crit ? 220 : 120);
    burst(e.x, e.y + 40, e.z, crit ? "#f4efe4" : "#e8d8c4", crit ? 16 : 8);
    floatNum(e.x, e.y + 80, `${dealt}`, crit ? "#f0d48a" : "#f4efe4");
    if (src?.team === 0) {
      damageDealt += dealt;
      combo += 1;
      comboT = 1.4;
      energy = Math.min(maxEnergy, energy + (dev ? 18 : 8));
      sfx.hit();
    } else {
      taken += dealt;
      if (veil > 0 && e.team === 0) {
        /* talisman already baked as extra buffer via veil counter in hud */
      }
    }
    trauma = crit ? 0.55 : 0.28;
    hitstop = crit ? 0.08 : 0.04;
    if (e.hp <= 0) {
      e.hp = 0;
      e.phase = "down";
      e.pt = 0;
      sfx.lose();
    }
  }

  function shoot(from: Body, vx: number, dmg: number, color: string, extra: Partial<Shot> = {}) {
    shots.push({
      x: from.x + from.facing * 28,
      z: from.z,
      y: from.y + 42,
      vx: vx * from.facing,
      vz: 0,
      life: 1.1,
      dmg,
      team: from.team,
      color,
      r: 8,
      homing: false,
      kind: "bolt",
      ...extra,
    });
  }

  function menace(who: Body) {
    const ab = who.team === 0 ? fighter.abilities[0] : null;
    if (who.team === 0 && ab) {
      if ((cds[ab.id] ?? 0) > 0 || energy < ab.cost) return;
      if (!dev) energy -= ab.cost;
      cds[ab.id] = dev ? 0.35 : ab.cooldown;
    }
    who.phase = "menace";
    who.pt = 0;
    who.hitOnce = false;
    sfx.skill();
    const id = who.menaceId;
    if (id === "karan" || id === "darshan") {
      who.x += who.facing * 90;
      who.iFrames = 0.25;
    }
    if (id === "ankit") {
      const t = nearest(who);
      if (t) {
        who.x = t.x - t.facing * 46;
        who.z = t.z;
        who.facing = t.x >= who.x ? 1 : -1;
        who.iFrames = 0.28;
      }
    }
    if (id === "aashiq" || id === "ruman" || id === "rust" || id === "alok" || id === "injamam") {
      shoot(who, 520, who.dmg * 1.6, who.accent, { r: 10, life: 0.9 });
    }
    if (id === "shawty") {
      shoot(who, 360, who.dmg * 1.1, who.accent, { kind: "baton", life: 1.3, r: 9 });
    }
    if (id === "cinder-tyrant") shoot(who, 440, who.dmg * 1.3, "#e07a3a", { homing: true });
    if (id === "tide-maw") shoot(who, 500, who.dmg * 1.2, "#7fd0e0", { r: 14 });
    if (id === "bloom-warden") shoot(who, 300, who.dmg, "#8fbf78", { vz: 40, life: 1.2 });
    if (id === "curse-shepherd") {
      shoot(who, 280, who.dmg, "#d7c48a", { homing: true, vz: 30 });
      shoot(who, 280, who.dmg, "#d7c48a", { homing: true, vz: -30 });
    }
    if (id === "eightfold-wheel") {
      for (let i = 0; i < 4; i++) shoot(who, 260 + i * 40, who.dmg * 0.7, who.accent, { vz: (i - 1.5) * 50, life: 1.2 });
    }
    burst(who.x, who.y + 30, who.z, who.accent, 14);
  }

  function nearest(from: Body) {
    let best: Body | null = null;
    let d = 1e9;
    for (const b of bodies) {
      if (b.team === from.team || b.hp <= 0) continue;
      const dd = Math.hypot(b.x - from.x, b.z - from.z);
      if (dd < d) { d = dd; best = b; }
    }
    return best;
  }

  function tryHit(who: Body, reach: number, power: number, lift = 0, crit = false) {
    if (who.hitOnce) return;
    for (const b of bodies) {
      if (b.team === who.team || b.hp <= 0) continue;
      const dx = (b.x - who.x) * who.facing;
      const dz = Math.abs(b.z - who.z);
      if (dx > 8 && dx < reach && dz < 36 && Math.abs(b.y - who.y) < 70) {
        who.hitOnce = true;
        hurt(b, who.dmg * power, who, crit, lift);
      }
    }
  }

  function stepBody(b: Body, dt: number) {
    b.pt += dt;
    b.iFrames = Math.max(0, b.iFrames - dt);
    b.marked = Math.max(0, b.marked - dt);
    b.slow = Math.max(0, b.slow - dt);
    if (b.phase === "down") return;
    const slow = b.slow > 0 ? 0.55 : 1;
    if (b.y > 0 || b.vy > 0) {
      b.vy -= 980 * dt;
      b.y += b.vy * dt;
      if (b.y <= 0) { b.y = 0; b.vy = 0; if (b.phase === "jump") b.phase = "idle"; }
    }
    const attacking = b.phase === "light" || b.phase === "heavy" || b.phase === "kick" || b.phase === "menace" || b.phase === "hit";
    if (!attacking || b.phase === "hit") {
      b.x += b.vx * dt * slow;
      b.z += b.vz * dt * slow;
      b.vx *= 0.86;
      b.vz *= 0.86;
    }
    b.x = Math.max(-RING.x, Math.min(RING.x, b.x));
    b.z = Math.max(-RING.z, Math.min(RING.z, b.z));
    if (b.phase === "light") {
      if (b.pt > 0.08 && b.pt < 0.2) tryHit(b, b.weapon === "spear" ? 92 : 58, 1);
      if (b.pt > 0.28) b.phase = "idle";
    } else if (b.phase === "heavy") {
      if (b.pt > 0.14 && b.pt < 0.28) tryHit(b, 78, 1.7, 40, true);
      if (b.pt > 0.46) b.phase = "idle";
    } else if (b.phase === "kick") {
      if (b.pt > 0.1 && b.pt < 0.24) tryHit(b, 64, 1.25, 210);
      if (b.pt > 0.4) b.phase = "idle";
    } else if (b.phase === "menace") {
      if (b.pt > 0.12 && b.pt < 0.32) tryHit(b, 110, 2.3, 90, true);
      if (b.menaceId === "aaditya" && b.pt > 0.15 && b.pt < 0.2 && b.team === 0) {
        player.hp = Math.min(player.maxHp, player.hp + 12);
        for (const o of bodies) if (o.team === 1) o.slow = 2.4;
      }
      if (b.menaceId === "bridge" && b.pt > 0.16 && b.pt < 0.22) tryHit(b, 70, 1.4 + combo * 0.15, 20, true);
      if (b.menaceId === "neo" && b.pt > 0.18 && b.pt < 0.24) {
        for (const o of bodies) if (o.team !== b.team && Math.abs(o.x - b.x) < 120) hurt(o, b.dmg * 1.8, b, true, 30);
      }
      if (b.pt > 0.5) b.phase = "idle";
    } else if (b.phase === "hit" && b.pt > b.stun) {
      b.phase = "idle";
    }
  }

  function startPhase(b: Body, phase: Phase) {
    if (b.hp <= 0 || b.phase === "down" || b.phase === "hit") return;
    if (phase !== "block" && (b.phase === "light" || b.phase === "heavy" || b.phase === "kick" || b.phase === "menace")) return;
    b.phase = phase;
    b.pt = 0;
    b.hitOnce = false;
    if (phase === "light" || phase === "heavy" || phase === "kick") sfx.dash();
  }

  function controlPlayer(dt: number) {
    if (player.hp <= 0) return;
    let mx = 0;
    let mz = 0;
    if (keys["KeyA"] || keys["ArrowLeft"]) mx -= 1;
    if (keys["KeyD"] || keys["ArrowRight"]) mx += 1;
    if (keys["KeyW"] || keys["ArrowUp"]) mz -= 1;
    if (keys["KeyS"] || keys["ArrowDown"]) mz += 1;
    if (touchMove.active) { mx += touchMove.x; mz += touchMove.y; }
    const busy = player.phase === "light" || player.phase === "heavy" || player.phase === "kick" || player.phase === "menace" || player.phase === "hit";
    if (!busy && player.phase !== "down") {
      const sp = player.speed * (dev ? 1.15 : 1);
      player.vx = mx * sp;
      player.vz = mz * sp * 0.72;
      if (mx !== 0) player.facing = mx > 0 ? 1 : -1;
      if (keys["ShiftLeft"] || keys["ShiftRight"]) {
        player.vx += player.facing * 280;
        player.iFrames = 0.12;
      }
      if ((keys["Space"] || keys["KeyU"]) && player.y <= 0) {
        player.vy = 430;
        player.phase = "jump";
        player.pt = 0;
      } else if (keys["KeyL"] || keys["Semicolon"]) {
        player.phase = "block";
      } else if (Math.abs(mx) + Math.abs(mz) > 0.2) {
        player.phase = "walk";
      } else if (player.phase === "walk" || player.phase === "block") {
        player.phase = "idle";
      }
    }
    if (keys["KeyJ"] || keys["KeyZ"]) startPhase(player, "light");
    if (keys["KeyK"] || keys["KeyX"]) startPhase(player, "heavy");
    if (keys["KeyL"] && keys["ShiftLeft"]) startPhase(player, "kick");
    if (keys["KeyI"]) startPhase(player, "kick");
    if (keys["KeyQ"] || keys["KeyE"]) menace(player);
    void dt;
  }

  function controlAi(b: Body, dt: number) {
    if (b.hp <= 0) return;
    b.ai -= dt;
    const dx = player.x - b.x;
    const dz = player.z - b.z;
    b.facing = dx >= 0 ? 1 : -1;
    const busy = b.phase === "light" || b.phase === "heavy" || b.phase === "kick" || b.phase === "menace" || b.phase === "hit";
    if (busy) return;
    const dist = Math.hypot(dx, dz);
    if (dist > 70) {
      b.vx = Math.sign(dx) * b.speed * 0.85;
      b.vz = Math.sign(dz) * b.speed * 0.4;
      b.phase = "walk";
    } else {
      b.vx = 0;
      b.vz = 0;
      if (b.ai <= 0) {
        b.ai = b.boss ? 0.55 : 0.7;
        const roll = Math.random();
        if (roll < 0.18) menace(b);
        else if (roll < 0.42) startPhase(b, "heavy");
        else if (roll < 0.62) startPhase(b, "kick");
        else if (roll < 0.78) b.phase = "block";
        else startPhase(b, "light");
      }
    }
  }

  function step(dt: number) {
    if (ended) return;
    intro = Math.max(0, intro - dt);
    for (const a of Object.keys(cds)) cds[a] = Math.max(0, cds[a] - dt);
    if (dev) energy = maxEnergy;
    else energy = Math.min(maxEnergy, energy + dt * 6);
    comboT -= dt;
    if (comboT <= 0) combo = 0;
    trauma *= 0.9;
    if (intro > 0) return;
    controlPlayer(dt);
    for (const b of bodies) {
      if (b.team === 1) controlAi(b, dt);
      stepBody(b, dt);
    }
    shots = shots.filter((s) => {
      s.life -= dt;
      if (s.homing) {
        const t = bodies.find((b) => b.team !== s.team && b.hp > 0);
        if (t) {
          s.vx += Math.sign(t.x - s.x) * 400 * dt;
          s.vz += Math.sign(t.z - s.z) * 200 * dt;
        }
      }
      s.x += s.vx * dt;
      s.z += s.vz * dt;
      for (const b of bodies) {
        if (b.team === s.team || b.hp <= 0) continue;
        if (Math.abs(b.x - s.x) < 24 + s.r && Math.abs(b.z - s.z) < 30 && Math.abs(b.y + 40 - s.y) < 50) {
          const owner = bodies.find((o) => o.team === s.team && o.hp > 0) ?? null;
          hurt(b, s.dmg, owner, false, 20);
          if (s.kind === "baton") s.vx *= -1;
          else s.life = 0;
          b.marked = Math.max(b.marked, 2);
        }
      }
      return s.life > 0 && Math.abs(s.x) < 560;
    });
    sparks = sparks.filter((p) => {
      p.life -= dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.z += p.vz * dt;
      p.vy -= 300 * dt;
      return p.life > 0;
    });
    nums.forEach((n) => (n.t -= dt));
    nums = nums.filter((n) => n.t > 0);
    const aliveFoes = bodies.some((b) => b.team === 1 && b.hp > 0);
    if (!aliveFoes) {
      bodies = bodies.filter((b) => b.team === 0 || b.hp > 0);
      if (queue > 0) {
        queue -= 1;
        round += 1;
        spawnFoe(false);
      } else if (bossLeft) {
        bossLeft = false;
        spawnFoe(true);
      } else {
        end(true);
      }
    }
    if (player.hp <= 0) end(false);
  }

  function end(win: boolean) {
    if (ended) return;
    ended = true;
    const rank = win ? (taken < 20 ? "S" : combo > 12 ? "A" : "B") : "C";
    window.setTimeout(() => {
      hooks.onEnd({
        win,
        coins: win ? mission.coins : Math.round(mission.coins * 0.2),
        shards: win ? mission.shards : 0,
        xp: win ? mission.xp : Math.round(mission.xp * 0.3),
        rank,
        damage: damageDealt,
      });
    }, 700);
  }

  function hud() {
    const boss = bodies.find((b) => b.boss && b.hp > 0) ?? null;
    const foe = bodies.find((b) => b.team === 1 && b.hp > 0) ?? null;
    return {
      hp: player.hp,
      maxHp: player.maxHp,
      energy,
      maxEnergy,
      cds: { ...cds },
      dodgeCd: 0,
      combo,
      veil,
      gaze: player.marked,
      paused,
      map: map.name,
      style: fighter.style,
      weapon: fighter.weapon,
      foe: foe ? { name: foe.name, hp: foe.hp, max: foe.maxHp, style: foe.style } : null,
      boss: boss ? { name: boss.name, hp: boss.hp, max: boss.maxHp } : null,
    };
  }

  function drawHuman(b: Body) {
    const p = project(b.x, b.y, b.z);
    const s = p.scale * (b.boss ? 1.12 : 1);
    const f = b.facing;
    ctx.save();
    ctx.translate(p.sx, p.sy);
    ctx.scale(s * f, s);
    const bob = b.phase === "walk" ? Math.sin(b.pt * 12) * 3 : 0;
    const arm = b.phase === "light" ? -1.1 : b.phase === "heavy" || b.phase === "menace" ? -1.6 : b.phase === "kick" ? -0.2 : Math.sin(b.pt * 2) * 0.1;
    const leg = b.phase === "kick" ? -1.2 : b.phase === "walk" ? Math.sin(b.pt * 12) * 0.5 : 0;
    ctx.fillStyle = "rgba(0,0,0,0.28)";
    ctx.beginPath();
    ctx.ellipse(0, 4, 16, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.translate(0, -bob);
    // legs
    ctx.strokeStyle = "#2a2a30";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(-5, -28);
    ctx.lineTo(-6 + leg * 8, -4);
    ctx.moveTo(5, -28);
    ctx.lineTo(7 - leg * 8, -4);
    ctx.stroke();
    // torso
    ctx.fillStyle = b.color;
    ctx.beginPath();
    ctx.moveTo(-12, -58);
    ctx.lineTo(12, -58);
    ctx.lineTo(10, -28);
    ctx.lineTo(-10, -28);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = b.accent;
    ctx.fillRect(-8, -52, 16, 6);
    // arms
    ctx.strokeStyle = b.skin;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(-12, -52);
    ctx.lineTo(-18, -36 + arm * 8);
    ctx.moveTo(12, -52);
    ctx.lineTo(20 + arm * 10, -34);
    ctx.stroke();
    drawWeapon(b, arm);
    // head
    ctx.fillStyle = b.skin;
    ctx.beginPath();
    ctx.arc(0, -70, 11, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = b.accent;
    ctx.beginPath();
    ctx.arc(0, -74, 11, Math.PI, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#1c1c22";
    ctx.fillRect(2, -72, 3, 2);
    ctx.fillRect(7, -72, 3, 2);
    if (b.phase === "hit") {
      ctx.strokeStyle = "#fff";
      ctx.globalAlpha = 0.45;
      ctx.strokeRect(-16, -84, 32, 80);
      ctx.globalAlpha = 1;
    }
    ctx.restore();
    ctx.fillStyle = "#f4efe4";
    ctx.font = "12px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(b.name, p.sx, p.sy - 96 * s);
  }

  function drawWeapon(b: Body, arm: number) {
    ctx.save();
    ctx.translate(18 + arm * 6, -40);
    ctx.rotate(arm * 0.4);
    ctx.fillStyle = "#d9d3c7";
    ctx.strokeStyle = b.accent;
    ctx.lineWidth = 3;
    const w = b.weapon;
    if (w === "fists" || w === "gauntlets" || w === "stone fists" || w === "claws") {
      ctx.fillStyle = b.accent;
      ctx.fillRect(0, -4, 8, 8);
    } else if (w === "katana" || w === "longsword" || w === "ink sword" || w === "rapier") {
      ctx.fillRect(-2, -4, 4, 8);
      ctx.fillStyle = "#e8e4dc";
      ctx.fillRect(2, -3, w === "rapier" ? 28 : 34, 3);
    } else if (w === "spear" || w === "trident" || w === "four polearms") {
      ctx.fillRect(0, -2, 46, 3);
      ctx.beginPath();
      ctx.moveTo(46, -6);
      ctx.lineTo(56, 0);
      ctx.lineTo(46, 6);
      ctx.fill();
    } else if (w === "bo staff" || w === "bell staff" || w === "hex staff" || w === "shepherd crook" || w === "baton") {
      ctx.fillStyle = "#cbb892";
      ctx.fillRect(-8, -2, 42, 4);
    } else if (w === "flail") {
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(18, 10);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(22, 12, 5, 0, Math.PI * 2);
      ctx.fill();
    } else if (w === "daggers") {
      ctx.fillRect(0, -6, 16, 3);
      ctx.fillRect(0, 4, 16, 3);
    } else if (w === "chain" || w === "vine whip") {
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(12, 8, 24, -2);
      ctx.stroke();
    } else if (w === "fire axe") {
      ctx.fillRect(0, -2, 22, 3);
      ctx.fillStyle = "#e07a3a";
      ctx.fillRect(18, -10, 10, 14);
    } else if (w === "chakrams") {
      ctx.beginPath();
      ctx.arc(12, 0, 7, 0, Math.PI * 2);
      ctx.stroke();
    } else {
      ctx.fillRect(0, -2, 24, 3);
    }
    ctx.restore();
  }

  function drawStage() {
    const w = canvas.width;
    const h = canvas.height;
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, map.sky);
    g.addColorStop(1, map.fog);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    // far wall
    ctx.fillStyle = map.trim;
    ctx.globalAlpha = 0.25;
    ctx.fillRect(180, 180, w - 360, 70);
    ctx.globalAlpha = 1;
    // ground trapezoid
    ctx.fillStyle = map.ground;
    ctx.beginPath();
    ctx.moveTo(220, 430);
    ctx.lineTo(w - 220, 430);
    ctx.lineTo(w - 80, 760);
    ctx.lineTo(80, 760);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = map.trim;
    ctx.globalAlpha = 0.45;
    for (let i = 0; i < 8; i++) {
      const t = i / 7;
      const y = 430 + t * 330;
      const inset = t * 140;
      ctx.beginPath();
      ctx.moveTo(220 - inset * 0.2, y);
      ctx.lineTo(w - 220 + inset * 0.2, y);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    drawProps();
    ctx.fillStyle = map.trim;
    ctx.globalAlpha = 0.8;
    ctx.font = "16px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(map.name, w / 2, 150);
    ctx.globalAlpha = 1;
  }

  function drawProps() {
    const spots = map.prop === "docks"
      ? [[280, 500], [1400, 500], [300, 680], [1380, 680]]
      : [[260, 470], [1420, 470], [240, 700], [1440, 700]];
    for (const [x, y] of spots) {
      ctx.save();
      ctx.translate(x, y);
      if (map.prop === "trees") {
        ctx.fillStyle = "#3d2a1c";
        ctx.fillRect(-6, -10, 12, 40);
        ctx.fillStyle = map.trim;
        ctx.beginPath();
        ctx.arc(0, -20, 22, 0, Math.PI * 2);
        ctx.fill();
      } else if (map.prop === "glass") {
        ctx.fillStyle = "rgba(158,203,255,0.35)";
        ctx.fillRect(-18, -50, 36, 60);
        ctx.strokeStyle = map.trim;
        ctx.strokeRect(-18, -50, 36, 60);
      } else if (map.prop === "throne" && x > 800) {
        ctx.fillStyle = map.trim;
        ctx.fillRect(-30, -40, 60, 46);
        ctx.fillRect(-40, -8, 80, 10);
      } else if (map.prop === "chapel") {
        ctx.fillStyle = "#2c3038";
        ctx.fillRect(-16, -70, 32, 80);
        ctx.fillStyle = map.trim;
        ctx.fillRect(-6, -90, 12, 24);
      } else if (map.prop === "crates") {
        ctx.fillStyle = "#6a4034";
        ctx.fillRect(-16, -20, 32, 24);
        ctx.strokeStyle = map.trim;
        ctx.strokeRect(-16, -20, 32, 24);
      } else if (map.prop === "docks") {
        ctx.fillStyle = "#6a5438";
        ctx.fillRect(-28, -8, 56, 10);
        ctx.fillRect(-22, 0, 6, 18);
        ctx.fillRect(16, 0, 6, 18);
      } else {
        ctx.fillStyle = "#3a3e46";
        ctx.fillRect(-14, -64, 28, 70);
        ctx.fillStyle = map.trim;
        ctx.fillRect(-18, -70, 36, 8);
      }
      ctx.restore();
    }
  }

  function render() {
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.max(1, rect.width * dpr);
    canvas.height = Math.max(1, rect.height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const shake = hooks.shake ? trauma * 8 : 0;
    ctx.save();
    ctx.translate((Math.random() - 0.5) * shake, (Math.random() - 0.5) * shake);
    drawStage();
    const order = [...bodies].filter((b) => b.hp > 0 || b.phase === "down").sort((a, b) => a.z - b.z);
    for (const s of shots) {
      const p = project(s.x, s.y, s.z);
      ctx.fillStyle = s.color;
      ctx.beginPath();
      ctx.arc(p.sx, p.sy, s.r * p.scale, 0, Math.PI * 2);
      ctx.fill();
    }
    for (const b of order) drawHuman(b);
    for (const p of sparks) {
      const q = project(p.x, p.y, p.z);
      ctx.globalAlpha = Math.max(0, p.life * 2);
      ctx.fillStyle = p.color;
      ctx.fillRect(q.sx, q.sy, 3, 3);
      ctx.globalAlpha = 1;
    }
    for (const n of nums) {
      const q = project(n.x, 80, 0);
      ctx.globalAlpha = Math.max(0, n.t);
      ctx.fillStyle = n.col;
      ctx.font = "bold 16px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(n.txt, q.sx, q.sy - (0.7 - n.t) * 30);
      ctx.globalAlpha = 1;
    }
    if (intro > 0) {
      ctx.fillStyle = "#f4efe4";
      ctx.font = "28px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("READY", rect.width / 2, rect.height / 2);
    }
    if (ended) {
      ctx.fillStyle = "rgba(8,8,10,0.45)";
      ctx.fillRect(0, 0, rect.width, rect.height);
      ctx.fillStyle = "#f4efe4";
      ctx.font = "40px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(player.hp > 0 ? "KO" : "DOWN", rect.width / 2, rect.height / 2);
    }
    ctx.restore();
    return hud();
  }

  function loop(t: number) {
    if (!running) return;
    const dt = Math.min(0.033, (t - last) / 1000 || 0);
    last = t;
    if (!paused) {
      if (hitstop > 0) hitstop -= dt;
      else {
        acc += dt;
        while (acc > 0.016) {
          step(0.016);
          acc -= 0.016;
        }
      }
    }
    const h = render();
    onHud?.(h);
    requestAnimationFrame(loop);
  }

  function onKey(e: KeyboardEvent) {
    keys[e.code] = e.type === "keydown";
    if (e.code === "Escape" && e.type === "keydown") paused = !paused;
    if (["Space", "ArrowUp", "ArrowDown"].includes(e.code)) e.preventDefault();
  }

  const waves = mission.bossId ? 2 : Math.min(4, 2 + Math.floor(mission.level / 20));
  spawnFoe(false);
  queue = waves - 1;
  bossLeft = Boolean(mission.bossId);
  window.addEventListener("keydown", onKey);
  window.addEventListener("keyup", onKey);
  canvas.addEventListener("pointerdown", () => startPhase(player, "light"));
  requestAnimationFrame(loop);

  return {
    destroy() {
      running = false;
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("keyup", onKey);
    },
    setHud(fn: (h: ReturnType<typeof render>) => void) { onHud = fn; },
    castAbility: (i: number) => {
      if (i === 0) menace(player);
      else startPhase(player, "kick");
    },
    dodge() {
      player.vx += player.facing * 320;
      player.iFrames = 0.16;
    },
    pause: () => { paused = !paused; },
    isPaused: () => paused,
    setTouchMove: (x: number, y: number, active: boolean) => { touchMove.x = x; touchMove.y = y; touchMove.active = active; },
    setTouchAim: (_x: number, _y: number, active: boolean) => { if (active) startPhase(player, "heavy"); },
    fighter,
    mission,
  };
}

export type BattleHandle = ReturnType<typeof createBattle>;

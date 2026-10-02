import { create } from "zustand";
import { FIGHTERS, fighterById, MISSIONS, PITY_SPECIAL, SUMMON_COST, DAILY_COINS, DAILY_SHARDS } from "./data";
import { loadSave, persistSave, type SaveState, type ScreenId } from "./save";

export type ResultPayload = {
  win: boolean;
  missionId: string;
  coins: number;
  shards: number;
  xp: number;
  rank: string;
  damage: number;
};

type GameStore = SaveState & {
  screen: ScreenId;
  missionId: string | null;
  result: ResultPayload | null;
  toast: string | null;
  setScreen: (s: ScreenId) => void;
  selectFighter: (id: string) => void;
  buyFighter: (id: string) => boolean;
  summon: () => string | null;
  claimDaily: () => boolean;
  startMission: (id: string) => void;
  finishBattle: (r: ResultPayload) => void;
  buyItem: (item: "talisman" | "elixir") => boolean;
  spendItem: (item: "talisman" | "elixir") => boolean;
  setVolumes: (sfx: number, music: number) => void;
  setShake: (v: boolean) => void;
  addXp: (id: string, amount: number) => void;
  activateDevMode: (code: string) => boolean;
  flash: (msg: string) => void;
};

function today() {
  return new Date().toISOString().slice(0, 10);
}

function persist(partial: Partial<SaveState> & object, get: () => GameStore) {
  const s = get();
  persistSave({
    version: 1,
    coins: s.coins,
    shards: s.shards,
    unlocked: s.unlocked,
    selected: s.selected,
    levels: s.levels,
    xp: s.xp,
    cleared: s.cleared,
    pity: s.pity,
    lastDaily: s.lastDaily,
    talismans: s.talismans,
    elixirs: s.elixirs,
    sfx: s.sfx,
    music: s.music,
    shake: s.shake,
    devMode: s.devMode,
    ...partial,
  });
}

export const useGame = create<GameStore>((set, get) => ({
  ...loadSave(),
  screen: "title",
  missionId: null,
  result: null,
  toast: null,
  setScreen: (screen) => set({ screen }),
  selectFighter: (id) => {
    if (!get().unlocked.includes(id)) return;
    set({ selected: id });
    persist({ selected: id }, get);
  },
  buyFighter: (id) => {
    const f = fighterById(id);
    const s = get();
    if (s.unlocked.includes(id)) return false;
    if (f.unlockShards > 0) {
      if (s.shards < f.unlockShards) return false;
      const shards = s.shards - f.unlockShards;
      const unlocked = [...s.unlocked, id];
      set({ shards, unlocked, selected: id });
      persist({ shards, unlocked, selected: id }, get);
      return true;
    }
    if (s.coins < f.unlockCoins) return false;
    const coins = s.coins - f.unlockCoins;
    const unlocked = [...s.unlocked, id];
    set({ coins, unlocked, selected: id });
    persist({ coins, unlocked, selected: id }, get);
    return true;
  },
  summon: () => {
    const s = get();
    if (s.shards < SUMMON_COST) return null;
    const locked = FIGHTERS.filter((f) => !s.unlocked.includes(f.id));
    if (!locked.length) return null;
    let pick;
    const pity = s.pity + 1;
    const specials = locked.filter((f) => f.grade === "Special");
    const sss = locked.filter((f) => f.grade === "SSS");
    const a = locked.filter((f) => f.grade === "A");
    const roll = Math.random();
    if ((pity >= PITY_SPECIAL && specials.length) || (roll < 0.05 && specials.length)) {
      pick = specials[Math.floor(Math.random() * specials.length)];
    } else if (roll < 0.32 && sss.length) {
      pick = sss[Math.floor(Math.random() * sss.length)];
    } else if (a.length) {
      pick = a[Math.floor(Math.random() * a.length)];
    } else if (sss.length) {
      pick = sss[Math.floor(Math.random() * sss.length)];
    } else {
      pick = locked[0];
    }
    const unlocked = [...s.unlocked, pick.id];
    const shards = s.shards - SUMMON_COST;
    const nextPity = pick.grade === "Special" ? 0 : pity;
    set({ unlocked, shards, pity: nextPity, selected: pick.id });
    persist({ unlocked, shards, pity: nextPity, selected: pick.id }, get);
    return pick.id;
  },
  claimDaily: () => {
    const s = get();
    const d = today();
    if (s.lastDaily === d) return false;
    const coins = s.coins + DAILY_COINS;
    const shards = s.shards + DAILY_SHARDS;
    set({ lastDaily: d, coins, shards, talismans: s.talismans + 1 });
    persist({ lastDaily: d, coins, shards, talismans: s.talismans + 1 }, get);
    return true;
  },
  startMission: (id) => set({ missionId: id, screen: "battle", result: null }),
  finishBattle: (result) => {
    const s = get();
    let coins = s.coins;
    let shards = s.shards;
    const cleared = s.cleared.includes(result.missionId) ? s.cleared : [...s.cleared, result.missionId];
    if (result.win) {
      coins += result.coins;
      shards += result.shards;
      get().addXp(s.selected, result.xp);
    }
    set({ coins, shards, cleared, result, screen: "results" });
    persist({ coins, shards, cleared }, get);
  },
  buyItem: (item) => {
    const s = get();
    const cost = item === "talisman" ? 140 : 220;
    if (s.coins < cost) return false;
    const coins = s.coins - cost;
    if (item === "talisman") set({ coins, talismans: s.talismans + 1 });
    else set({ coins, elixirs: s.elixirs + 1 });
    persist({ coins, talismans: get().talismans, elixirs: get().elixirs }, get);
    return true;
  },
  spendItem: (item) => {
    const s = get();
    if (item === "talisman") {
      if (s.talismans <= 0) return false;
      set({ talismans: s.talismans - 1 });
      persist({ talismans: s.talismans - 1 }, get);
      return true;
    }
    if (s.elixirs <= 0) return false;
    set({ elixirs: s.elixirs - 1 });
    persist({ elixirs: s.elixirs - 1 }, get);
    return true;
  },
  activateDevMode: (code) => {
    if (code.trim().toLowerCase() !== "dev") return false;
    const unlocked = FIGHTERS.map((fighter) => fighter.id);
    const levels = Object.fromEntries(FIGHTERS.map((fighter) => [fighter.id, 20]));
    const xp = Object.fromEntries(FIGHTERS.map((fighter) => [fighter.id, 2500]));
    const cleared = MISSIONS.map((mission) => mission.id);
    set({
      devMode: true,
      coins: 999999,
      shards: 999,
      unlocked,
      selected: FIGHTERS[FIGHTERS.length - 1].id,
      levels,
      xp,
      cleared,
      talismans: 20,
      elixirs: 20,
      pity: 0,
    });
    persist({
      devMode: true,
      coins: 999999,
      shards: 999,
      unlocked,
      selected: FIGHTERS[FIGHTERS.length - 1].id,
      levels,
      xp,
      cleared,
      talismans: 20,
      elixirs: 20,
      pity: 0,
    }, get);
    return true;
  },
  setVolumes: (sfx, music) => {
    set({ sfx, music });
    persist({ sfx, music }, get);
  },
  setShake: (shake) => {
    set({ shake });
    persist({ shake }, get);
  },
  addXp: (id, amount) => {
    const s = get();
    const xp = { ...s.xp, [id]: (s.xp[id] ?? 0) + amount };
    const levels = { ...s.levels };
    let lv = levels[id] ?? 1;
    let cur = xp[id];
    while (cur >= lv * 80 && lv < 20) {
      cur -= lv * 80;
      lv += 1;
    }
    xp[id] = cur;
    levels[id] = lv;
    set({ xp, levels });
    persist({ xp, levels }, get);
  },
  flash: (toast) => {
    set({ toast });
    window.setTimeout(() => set({ toast: null }), 1800);
  },
}));

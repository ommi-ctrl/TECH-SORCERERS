const KEY = "veilbound-save-v1";
const VERSION = 1;

export type ScreenId = "title" | "hub" | "roster" | "shop" | "missions" | "codex" | "battle" | "results";

export type SaveState = {
  version: number;
  coins: number;
  shards: number;
  unlocked: string[];
  selected: string;
  levels: Record<string, number>;
  xp: Record<string, number>;
  cleared: string[];
  pity: number;
  lastDaily: string;
  talismans: number;
  elixirs: number;
  sfx: number;
  music: number;
  shake: boolean;
  devMode: boolean;
};

export const DEFAULT_SAVE: SaveState = {
  version: VERSION,
  coins: 900,
  shards: 6,
  unlocked: ["karan"],
  selected: "karan",
  levels: { karan: 1 },
  xp: { karan: 0 },
  cleared: [],
  pity: 0,
  lastDaily: "",
  talismans: 2,
  elixirs: 1,
  sfx: 0.8,
  music: 0.35,
  shake: true,
  devMode: false,
};

function migrate(raw: Partial<SaveState>): SaveState {
  return { ...DEFAULT_SAVE, ...raw, version: VERSION };
}

export function loadSave(): SaveState {
  try {
    if (typeof localStorage === "undefined") {
      return {
        ...DEFAULT_SAVE,
        levels: { ...DEFAULT_SAVE.levels },
        xp: { ...DEFAULT_SAVE.xp },
        unlocked: [...DEFAULT_SAVE.unlocked],
      };
    }
    const raw = localStorage.getItem(KEY);
    if (!raw) {
      return {
        ...DEFAULT_SAVE,
        levels: { ...DEFAULT_SAVE.levels },
        xp: { ...DEFAULT_SAVE.xp },
        unlocked: [...DEFAULT_SAVE.unlocked],
      };
    }
    return migrate(JSON.parse(raw) as Partial<SaveState>);
  } catch {
    return { ...DEFAULT_SAVE };
  }
}

export function persistSave(s: SaveState) {
  try {
    if (typeof localStorage === "undefined") return;
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    /* private mode */
  }
}

export type Grade = "A" | "SSS" | "Special";

export type AbilityDef = {
  id: string;
  name: string;
  hint: string;
  cooldown: number;
  cost: number;
  kind: "burst" | "control" | "zone" | "dash" | "buff" | "domain" | "guard";
};

export type FighterDef = {
  id: string;
  name: string;
  title: string;
  grade: Grade;
  hp: number;
  speed: number;
  damage: number;
  energy: number;
  color: string;
  accent: string;
  hair: string;
  stance: "blade" | "fist" | "caster" | "shadow" | "beast";
  style: string;
  weapon: string;
  menace: string;
  unlockCoins: number;
  unlockShards: number;
  abilities: AbilityDef[];
  lore: string;
};

export type CurseDef = {
  id: string;
  name: string;
  title: string;
  grade: "SSS" | "Special";
  hp: number;
  speed: number;
  damage: number;
  color: string;
  accent: string;
  pattern: "transfigure" | "volcano" | "bloom" | "tide" | "blood" | "shepherd" | "adapt" | "king";
  style: string;
  weapon: string;
  menace: string;
  lore: string;
};

export const FIGHTERS: FighterDef[] = [
  {
    id: "karan",
    name: "Karan",
    title: "Quiet Edge",
    grade: "A",
    hp: 110,
    speed: 230,
    damage: 14,
    energy: 100,
    color: "#c9c4b8",
    accent: "#6e7a88",
    hair: "short",
    stance: "blade",
    style: "Iaido rush",
    weapon: "katana",
    menace: "A vanishing step and a clean back cut.",
    unlockCoins: 0,
    unlockShards: 0,
    abilities: [
      {
        id: "shy-attack",
        name: "Menace",
        hint: "Vanish and reappear behind the marked curse for a stacked backstab.",
        cooldown: 6,
        cost: 28,
        kind: "dash",
      },
    ],
    lore: "Speaks little. Cuts first. The shyest student in the hall is also the one nobody hears coming.",
  },
  {
    id: "aashiq",
    name: "Aashiq",
    title: "Twin Tongue",
    grade: "A",
    hp: 105,
    speed: 220,
    damage: 13,
    energy: 110,
    color: "#d8c9a8",
    accent: "#8a5a3c",
    hair: "swept",
    stance: "caster",
    style: "Twin-script staff",
    weapon: "bo staff",
    menace: "A wide script wave that knocks a line of foes back.",
    unlockCoins: 600,
    unlockShards: 0,
    abilities: [
      {
        id: "sweeper",
        name: "Menace",
        hint: "A bilingual curse-wave: two scripts, one wide sweep that knocks fodder aside.",
        cooldown: 7,
        cost: 32,
        kind: "zone",
      },
    ],
    lore: "He argues with spirits in two languages until the grammar itself becomes a weapon.",
  },
  {
    id: "bridge",
    name: "Bridge",
    title: "Threshold",
    grade: "A",
    hp: 125,
    speed: 205,
    damage: 15,
    energy: 100,
    color: "#b8c0c8",
    accent: "#3d5a73",
    hair: "crop",
    stance: "fist",
    style: "Boxing",
    weapon: "fists",
    menace: "A banked hook that dumps stored hits as one blast.",
    unlockCoins: 800,
    unlockShards: 0,
    abilities: [
      {
        id: "critical-surge",
        name: "Menace",
        hint: "Bank hits, then dump them as a single critical detonation.",
        cooldown: 8,
        cost: 30,
        kind: "burst",
      },
    ],
    lore: "Stands between people and disaster. When the count is full, the bridge collapses on the curse.",
  },
  {
    id: "aaditya",
    name: "Aaditya",
    title: "Grain Saint",
    grade: "A",
    hp: 120,
    speed: 210,
    damage: 12,
    energy: 120,
    color: "#cbb98a",
    accent: "#7a6230",
    hair: "unkempt",
    stance: "caster",
    style: "Grain flail",
    weapon: "flail",
    menace: "A grit field that slows curses and mends you.",
    unlockCoins: 900,
    unlockShards: 0,
    abilities: [
      {
        id: "grainy-hepel",
        name: "Menace",
        hint: "Sow a grit field that saps curses and knits your wounds.",
        cooldown: 9,
        cost: 36,
        kind: "zone",
      },
    ],
    lore: "Harvests leftover binding dust. What looks like dirt is a thousand tiny seals.",
  },
  {
    id: "darshan",
    name: "Darshan",
    title: "Unwritten",
    grade: "A",
    hp: 115,
    speed: 225,
    damage: 14,
    energy: 105,
    color: "#d0d0d4",
    accent: "#4a4a52",
    hair: "slick",
    stance: "blade",
    style: "Fencing",
    weapon: "rapier",
    menace: "A rule-break lunge that ignores blocks for a moment.",
    unlockCoins: 1100,
    unlockShards: 0,
    abilities: [
      {
        id: "rule-breaker",
        name: "Menace",
        hint: "For a short window, your hits ignore armor, i-frames, and reflected bindings.",
        cooldown: 10,
        cost: 40,
        kind: "buff",
      },
    ],
    lore: "The academy writes rules. Darshan reads the footnotes and crosses them out.",
  },
  {
    id: "rust",
    name: "Rust",
    title: "Hex Gaze",
    grade: "SSS",
    hp: 145,
    speed: 240,
    damage: 17,
    energy: 130,
    color: "#c4c8d0",
    accent: "#6a8898",
    hair: "white",
    stance: "blade",
    style: "Gaze blade",
    weapon: "longsword",
    menace: "Marks every joint, then pierces with a tracking bolt.",
    unlockCoins: 0,
    unlockShards: 12,
    abilities: [
      {
        id: "hex-gaze",
        name: "Menace",
        hint: "See every joint. Auto-track weak points and pierce through crowds.",
        cooldown: 8,
        cost: 34,
        kind: "buff",
      },
    ],
    lore: "Six-fold perception, rewritten as a rusted stare. Nothing in the veil is hidden from him.",
  },
  {
    id: "neo",
    name: "Neo",
    title: "Sanctum",
    grade: "SSS",
    hp: 155,
    speed: 215,
    damage: 18,
    energy: 140,
    color: "#b8a090",
    accent: "#8a3030",
    hair: "undercut",
    stance: "fist",
    style: "Chain sanctum",
    weapon: "chain",
    menace: "A close ring that punishes anyone who stays in it.",
    unlockCoins: 0,
    unlockShards: 14,
    abilities: [
      {
        id: "wicked-sanctum",
        name: "Menace",
        hint: "Drop a slaughter court. Everything inside is carved on a clockwork beat.",
        cooldown: 16,
        cost: 70,
        kind: "domain",
      },
    ],
    lore: "He does not dodge. He opens a room where missing is illegal.",
  },
  {
    id: "ankit",
    name: "Ankit",
    title: "Umbra",
    grade: "SSS",
    hp: 140,
    speed: 250,
    damage: 16,
    energy: 125,
    color: "#2a2a30",
    accent: "#8a7aa0",
    hair: "hood",
    stance: "shadow",
    style: "Shadow knives",
    weapon: "daggers",
    menace: "Drops into the floor and rises behind the target.",
    unlockCoins: 0,
    unlockShards: 12,
    abilities: [
      {
        id: "shadow-emerge",
        name: "Menace",
        hint: "Sink into a curse's shadow and erupt with clones.",
        cooldown: 7,
        cost: 30,
        kind: "dash",
      },
    ],
    lore: "If the lights fail, he is already behind you. If they don't, he turns them off.",
  },
  {
    id: "ruman",
    name: "Ruman",
    title: "Bound Voice",
    grade: "SSS",
    hp: 135,
    speed: 220,
    damage: 15,
    energy: 150,
    color: "#d8d2c8",
    accent: "#4a6a5a",
    hair: "mask",
    stance: "caster",
    style: "Bell voice",
    weapon: "bell staff",
    menace: "A sound ring that stuns and shoves.",
    unlockCoins: 0,
    unlockShards: 13,
    abilities: [
      {
        id: "bound-voice",
        name: "Menace",
        hint: "Speak a sealed command. Nearby curses halt, kneel, or break.",
        cooldown: 9,
        cost: 38,
        kind: "control",
      },
    ],
    lore: "A word is a binding. He keeps most of them behind the wrap, and spends the rest like ammunition.",
  },
  {
    id: "injamam",
    name: "Injamam",
    title: "False Close",
    grade: "SSS",
    hp: 138,
    speed: 235,
    damage: 16,
    energy: 130,
    color: "#c8b8b0",
    accent: "#a05060",
    hair: "wavy",
    stance: "fist",
    style: "Spear line",
    weapon: "spear",
    menace: "A long thrust followed by a returning spear tip.",
    unlockCoins: 0,
    unlockShards: 12,
    abilities: [
      {
        id: "fake-kiss",
        name: "Menace",
        hint: "A charm-mark that turns a curse on its allies, then detonates.",
        cooldown: 10,
        cost: 36,
        kind: "control",
      },
    ],
    lore: "Affection as a feint. The last thing they trust is the thing that unmakes them.",
  },
  {
    id: "shawty",
    name: "Shawty",
    title: "Silly Maw",
    grade: "SSS",
    hp: 160,
    speed: 225,
    damage: 18,
    energy: 120,
    color: "#e0c8c0",
    accent: "#8a4060",
    hair: "long",
    stance: "beast",
    style: "Baton tricks",
    weapon: "baton",
    menace: "A spinning baton that bounces between foes.",
    unlockCoins: 0,
    unlockShards: 14,
    abilities: [
      {
        id: "silly-devour",
        name: "Menace",
        hint: "Lunge, bite, grow. Stolen mass heals you and fattens the next chomp.",
        cooldown: 8,
        cost: 32,
        kind: "dash",
      },
    ],
    lore: "Laughs at funerals. Eats the leftover curse like candy. The smile is not a joke.",
  },
  {
    id: "nova",
    name: "Nova",
    title: "Wanted",
    grade: "SSS",
    hp: 142,
    speed: 255,
    damage: 17,
    energy: 125,
    color: "#d4d0d8",
    accent: "#5a3a48",
    hair: "side",
    stance: "blade",
    style: "Gauntlet brawl",
    weapon: "gauntlets",
    menace: "A rushing uppercut that launches.",
    unlockCoins: 0,
    unlockShards: 14,
    abilities: [
      {
        id: "criminal-instinct",
        name: "Menace",
        hint: "Mark prey on a dash. If they are marked, the next hit is an execute.",
        cooldown: 7,
        cost: 28,
        kind: "dash",
      },
    ],
    lore: "She reads a fight the way a thief reads a street. Instinct first, law never.",
  },
  {
    id: "alok",
    name: "Alok",
    title: "Unreachable",
    grade: "Special",
    hp: 180,
    speed: 250,
    damage: 20,
    energy: 160,
    color: "#e8e8ec",
    accent: "#6a88a0",
    hair: "white",
    stance: "caster",
    style: "Hex domain",
    weapon: "hex staff",
    menace: "A veil dome that tracks and drains every curse inside.",
    unlockCoins: 0,
    unlockShards: 40,
    abilities: [
      {
        id: "hex-gaze-alok",
        name: "Menace",
        hint: "Total read of the field. Weak points light up; shots never miss their line.",
        cooldown: 8,
        cost: 24,
        kind: "buff",
      },
      {
        id: "infinity-veil",
        name: "Menace II",
        hint: "A gap of zero. Projectiles stall. You walk through what should have killed you.",
        cooldown: 14,
        cost: 50,
        kind: "guard",
      },
    ],
    lore: "The hall's closed theorem. Distance is a suggestion he can retract.",
  },
];

export const CURSES: CurseDef[] = [
  {
    id: "vesselkin",
    name: "Vesselkin",
    title: "Patchwork Soul",
    grade: "SSS",
    hp: 420,
    speed: 190,
    damage: 16,
    color: "#c8c0b4",
    accent: "#6a8a6a",
    pattern: "transfigure",
    style: "Clay wrestling",
    weapon: "stone fists",
    menace: "A ground pound that pops anyone in front.",
    lore: "A spirit that rewrites flesh like wet clay. Stay mobile or become furniture.",
  },
  {
    id: "cinder-tyrant",
    name: "Cinder Tyrant",
    title: "Disaster Ember",
    grade: "SSS",
    hp: 480,
    speed: 160,
    damage: 20,
    color: "#c45a3a",
    accent: "#8a2018",
    pattern: "volcano",
    style: "Axe cleave",
    weapon: "fire axe",
    menace: "A lava arc and a chasing ember shot.",
    lore: "A walking caldera. The ground remembers every step as a crater.",
  },
  {
    id: "bloom-warden",
    name: "Bloom Warden",
    title: "Rooted Grudge",
    grade: "SSS",
    hp: 500,
    speed: 140,
    damage: 15,
    color: "#6a8a58",
    accent: "#3a5a38",
    pattern: "bloom",
    style: "Vine whip",
    weapon: "vine whip",
    menace: "Roots snare, then a seed bomb pops.",
    lore: "Nature that learned hatred. Vines do not ask permission.",
  },
  {
    id: "tide-maw",
    name: "Tide Maw",
    title: "Drowned Hall",
    grade: "SSS",
    hp: 460,
    speed: 170,
    damage: 17,
    color: "#3a6a78",
    accent: "#1a3a48",
    pattern: "tide",
    style: "Trident tide",
    weapon: "trident",
    menace: "A water jet that pushes you to the wall.",
    lore: "A pocket sea with teeth. The arena floods on its terms.",
  },
  {
    id: "bloodline-kin",
    name: "Bloodline Kin",
    title: "Painted Line",
    grade: "SSS",
    hp: 440,
    speed: 200,
    damage: 18,
    color: "#8a2030",
    accent: "#4a1018",
    pattern: "blood",
    style: "Ink blade",
    weapon: "ink sword",
    menace: "An ink wave that marks and slows.",
    lore: "Sibling-born malice. Every drop of blood becomes a blade.",
  },
  {
    id: "curse-shepherd",
    name: "Curse Shepherd",
    title: "Borrowed Choir",
    grade: "Special",
    hp: 620,
    speed: 180,
    damage: 18,
    color: "#2a2a2c",
    accent: "#6a5a48",
    pattern: "shepherd",
    style: "Crook call",
    weapon: "shepherd crook",
    menace: "Wisps home in from both sides.",
    lore: "A man-shaped hole that commands lesser spirits as a flock.",
  },
  {
    id: "eightfold-wheel",
    name: "Eightfold Wheel",
    title: "The Adapting",
    grade: "Special",
    hp: 700,
    speed: 210,
    damage: 22,
    color: "#c8c4b8",
    accent: "#5a5040",
    pattern: "adapt",
    style: "Chakram spin",
    weapon: "chakrams",
    menace: "Eight discs orbit, then fly out.",
    lore: "A wheel that learns your trick, then returns it twice as sharp.",
  },
  {
    id: "fourfold-king",
    name: "Fourfold King",
    title: "Dismembered Sovereign",
    grade: "Special",
    hp: 900,
    speed: 230,
    damage: 26,
    color: "#e8d8d0",
    accent: "#8a2020",
    pattern: "king",
    style: "Polearm verdict",
    weapon: "four polearms",
    menace: "A throne slam and a cross of blades.",
    lore: "The old throne under the veil. Four arms. One verdict.",
  },
];

export type MissionDef = {
  id: string;
  name: string;
  chapter: string;
  requires?: string;
  fodder: number;
  fodderHp: number;
  bossId?: string;
  coins: number;
  shards: number;
  xp: number;
  level: number;
};

const stageNames = [
  "Stone Ring",
  "Ash Pit",
  "Root Court",
  "Glass Abyss",
  "Tide Dock",
  "Iron Chapel",
  "Ember Throne",
] as const;

const bossCycle = [
  "vesselkin",
  "cinder-tyrant",
  "bloom-warden",
  "tide-maw",
  "bloodline-kin",
  "curse-shepherd",
  "eightfold-wheel",
  "fourfold-king",
] as const;

function buildStage(stage: number, start: number, bossId: string, bossName: string): MissionDef[] {
  const levels: MissionDef[] = [];
  for (let i = 1; i <= 50; i++) {
    const id = `s${stage}-l${i}`;
    const level = start + i - 1;
    const isBoss = i === 50;
    levels.push({
      id,
      name: `${bossName} ${i === 50 ? "Boss" : `Trial ${i}`}`,
      chapter: `Stage ${stage} · ${stageNames[stage - 1]}`,
      requires: i === 1 ? undefined : `s${stage}-l${i - 1}`,
      fodder: 8 + i * 2,
      fodderHp: 20 + i * 8,
      bossId: isBoss ? bossId : undefined,
      coins: 200 + level * 30,
      shards: isBoss ? 7 + stage : 1 + Math.floor(level / 10),
      xp: 35 + level * 6,
      level,
    });
  }
  return levels;
}

const stageOne = buildStage(1, 1, "vesselkin", "Clay Warden");
const stageTwo = buildStage(2, 51, "cinder-tyrant", "Ash Regent");
const stageThree = buildStage(3, 101, "bloom-warden", "Root Sovereign");
const stageFour = buildStage(4, 151, "tide-maw", "Drowned Judge");
const stageFive = buildStage(5, 201, "bloodline-kin", "Painted Lord");
const stageSix = buildStage(6, 251, "curse-shepherd", "Flock Herald");
const stageSeven = buildStage(7, 301, "fourfold-king", "Throne Reborn");

export const MISSIONS: MissionDef[] = [
  ...stageOne,
  ...stageTwo,
  ...stageThree,
  ...stageFour,
  ...stageFive,
  ...stageSix,
  ...stageSeven,
];

export function missionById(id: string) {
  return MISSIONS.find((m) => m.id === id);
}

export const STAGE_COUNT = 7;
export const LEVELS_PER_STAGE = 50;
export const BOSS_CURS = bossCycle;

export function fighterById(id: string) {
  return FIGHTERS.find((f) => f.id === id) ?? FIGHTERS[0];
}

export function curseById(id: string) {
  return CURSES.find((c) => c.id === id);
}

export const SUMMON_COST = 8;
export const PITY_SPECIAL = 24;
export const DAILY_COINS = 220;
export const DAILY_SHARDS = 2;


export type MapDef = {
  id: string;
  name: string;
  sky: string;
  ground: string;
  trim: string;
  fog: string;
  prop: "pillars" | "crates" | "trees" | "glass" | "docks" | "chapel" | "throne";
};

export const MAPS: MapDef[] = [
  { id: "stone-ring", name: "Stone Ring", sky: "#1c2430", ground: "#6d6458", trim: "#cfc6b4", fog: "#12161c", prop: "pillars" },
  { id: "ash-pit", name: "Ash Pit", sky: "#3a2018", ground: "#5a4034", trim: "#e07a3a", fog: "#1a100c", prop: "crates" },
  { id: "root-court", name: "Root Court", sky: "#14241c", ground: "#3e5a40", trim: "#8fbf78", fog: "#0c1610", prop: "trees" },
  { id: "glass-abyss", name: "Glass Abyss", sky: "#14182c", ground: "#3a4568", trim: "#9ecbff", fog: "#0c1020", prop: "glass" },
  { id: "tide-dock", name: "Tide Dock", sky: "#12303a", ground: "#3d5c68", trim: "#7fd0e0", fog: "#0c1c22", prop: "docks" },
  { id: "iron-chapel", name: "Iron Chapel", sky: "#1a1c22", ground: "#4a4e58", trim: "#d0d4dc", fog: "#101216", prop: "chapel" },
  { id: "ember-throne", name: "Ember Throne", sky: "#2a1418", ground: "#6a4038", trim: "#f0a060", fog: "#180c10", prop: "throne" },
];

export function mapForMission(chapter: string): MapDef {
  const m = /Stage (\d+)/.exec(chapter);
  const n = m ? Number(m[1]) : 1;
  return MAPS[Math.max(0, Math.min(MAPS.length - 1, n - 1))];
}

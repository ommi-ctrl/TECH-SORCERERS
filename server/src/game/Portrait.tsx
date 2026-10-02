import type { FighterDef, CurseDef } from "./data";

const SKIN = ["#f0d0b4", "#e0b088", "#c68642", "#8d5524", "#f3d6c0", "#a56b45"];

export function Portrait({
  who,
  size = 72,
}: {
  who: FighterDef | CurseDef;
  size?: number;
}) {
  const isHuman = "hair" in who;
  const skin = SKIN[who.name.length % SKIN.length];
  const hair = isHuman ? who.hair : "crop";
  return (
    <svg width={size} height={size} viewBox="0 0 80 96" aria-hidden className="shrink-0">
      <rect width="80" height="96" rx="12" fill="#141416" />
      <ellipse cx="40" cy="88" rx="16" ry="4" fill="rgba(0,0,0,0.35)" />
      <path d="M30 58 L28 84 L36 84 L38 64 Z" fill="#2c2c32" />
      <path d="M50 58 L52 84 L44 84 L42 64 Z" fill="#2c2c32" />
      <path d="M30 40 L50 40 L48 62 L32 62 Z" fill={who.color} />
      <rect x="32" y="42" width="16" height="5" fill={who.accent} />
      <path d="M30 42 L22 58 L26 60 L32 48 Z" fill={skin} />
      <path d="M50 42 L58 58 L54 60 L48 48 Z" fill={skin} />
      <circle cx="40" cy="28" r="12" fill={skin} />
      <path d="M28 26 Q40 16 52 26 L50 30 Q40 24 30 30 Z" fill={hair === "white" ? "#f4f1ea" : who.accent} />
      {hair === "long" || hair === "wavy" ? <path d="M28 24 Q24 46 30 52 L34 48 Q32 34 40 28 Q48 34 46 48 L50 52 Q56 46 52 24 Z" fill={who.accent} /> : null}
      <circle cx="36" cy="29" r="1.3" fill="#1c1c22" />
      <circle cx="44" cy="29" r="1.3" fill="#1c1c22" />
      <path d="M37 34 Q40 36 43 34" stroke="#1c1c22" strokeWidth="1" fill="none" />
      {!isHuman ? <path d="M30 24 H50 L46 34 H34 Z" fill={who.accent} opacity="0.85" /> : null}
    </svg>
  );
}

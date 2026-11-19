// Sunset Platinum — shared constants: storage keys, grade order, kinds, roadmap stages.
export const STORAGE_KEY = "sunset-platinum-v1";
export const SETTINGS_KEY = "sunset-platinum-settings-v1";
export const NOTES_KEY = "sunset-platinum-notes-v1";

export const GRADE_ORDER = ["platinum", "gold", "silver", "bronze"];
export const GRADE_LABELS = { platinum: "Platinum", gold: "Gold", silver: "Silver", bronze: "Bronze" };

// Kinds used by the filters. "story" is also the spoiler kind: story trophies hide
// until earned while the spoiler setting is on.
export const KINDS = [
  { id: "story", label: "Story" },
  { id: "activities", label: "Activities" },
  { id: "collectibles", label: "Collectibles" },
  { id: "exploration", label: "Exploration" },
  { id: "combat", label: "Combat & robberies" },
  { id: "economy", label: "Money" },
  { id: "moments", label: "Moments" },
  { id: "challenge", label: "Challenges" },
];
export const KIND_LABELS = Object.fromEntries(KINDS.map((k) => [k.id, k.label]));

// The roadmap, built from the official descriptions: story chapters and missions,
// stranger strands, activities, collectibles, partner chaos, moments, then money
// and the 100% clean-up that gates the platinum.
export const ROADMAP_STAGES = [
  { n: 1, title: "Play the story", blurb: "Chapters 1–4, the final mission and the named story missions. Nothing here can be missed — just play the missions in order, and use the chapter breaks to clear activities you passed." },
  { n: 2, title: "Finish the strangers", blurb: "The stranger strands: Andy, Kenton, Billy, Randy, Tyrone and the rest. Eight strands must be completed end to end, each closing with a finale trophy." },
  { n: 3, title: "Master the activities", blurb: "Shooting Range golds, races, drone races, fishing, the arcade, meditation and the unique-animal hunt. Start these early — the counts (250 stunts, 42 range challenges) are long grinds best spread across the whole run." },
  { n: 4, title: "Collect and explore", blurb: "Card sets, WAiNK locations, 100 vehicles and all 52 areas of Leonida. Explore as you travel for other trophies instead of backtracking at the end." },
  { n: 5, title: "Partner chaos and robberies", blurb: "Wanted-level escapes with your partner, shop robberies, bank vaults, armored trucks and one operation per gang. Several of these are flagged missable — do them when the moment comes." },
  { n: 6, title: "Moments and choices", blurb: "The small, specific moments: a cocktail on Ocean Beach, the bowling alley, the showroom smash, the strange sighting, the second try. Most are flagged missable — read each guide before the moment passes." },
  { n: 7, title: "Money and the clean-up", blurb: "Launder $250,000 of Marked Bills, spend $100,000, buy all 8 garages, register 10 vehicles — then finish the last 50 challenges and the 100% completion that unlocks the platinum." },
];

// The 13 trophies seeded as earned for the ?shot= screenshot states only.
// Real users always start at 0 earned; the demo state never touches localStorage.
export const DEMO_EARNED_IDS = [
  "just-like-paradise", "paradise-lost", "tits-ass-drug-money", "vice-city-baby",
  "top-of-the-world-ma", "trust", "break-the-bank", "family-matters", "dwnfall",
  "hi-jacked", "snow-storm", "baited-my-tackle", "stick-fiddler",
];

// Sunset Platinum — filters and the spoiler rule, shared by every view.
export function applyFilters(trophies, earned, filters) {
  const query = (filters.query || "").trim().toLowerCase();
  return trophies.filter((t) => {
    if (filters.grade !== "all" && t.grade !== filters.grade) return false;
    if (filters.kind !== "all" && t.kind !== filters.kind) return false;
    if (filters.unearnedOnly && earned.has(t.id)) return false;
    if (filters.missableOnly && !t.missable) return false;
    if (query) {
      const hay = `${t.name} ${t.description} ${t.guide}`.toLowerCase();
      if (!hay.includes(query)) return false;
    }
    return true;
  });
}

// The spoiler rule: a story trophy the player has not earned yet shows a hidden
// placeholder instead of its name, description and guide while the setting is on.
export function isSpoilerHidden(trophy, earned, spoilerOn) {
  return spoilerOn && trophy.kind === "story" && !earned.has(trophy.id);
}

export function spoilerPlaceholder() {
  return {
    name: "Hidden story trophy",
    description: "Hidden until earned — turn the spoiler setting off to reveal story trophies, or earn this one first.",
  };
}

export function countEarned(trophies, earned) {
  return trophies.filter((t) => earned.has(t.id)).length;
}

export function earnedByGrade(trophies, earned) {
  const out = {};
  for (const t of trophies) {
    out[t.grade] = out[t.grade] || { earned: 0, total: 0 };
    out[t.grade].total += 1;
    if (earned.has(t.id)) out[t.grade].earned += 1;
  }
  return out;
}

// Sunset Platinum — trophy data: loads app/data/trophies.json (same origin, offline)
// and hands the app a sorted list plus lookup helpers.
import { GRADE_ORDER } from "./config.js";

let cached = null;

export async function loadTrophies() {
  if (cached) return cached;
  const response = await fetch("data/trophies.json");
  if (!response.ok) throw new Error("Could not load data/trophies.json");
  const doc = await response.json();
  const list = Array.isArray(doc) ? doc : doc.trophies;
  cached = {
    meta: Array.isArray(doc) ? {} : doc,
    trophies: [...list].sort((a, b) => GRADE_ORDER.indexOf(a.grade) - GRADE_ORDER.indexOf(b.grade) || a.name.localeCompare(b.name)),
    byId: new Map(list.map((t) => [t.id, t])),
  };
  return cached;
}

export function trophyCountByGrade(trophies, grade) {
  return trophies.filter((t) => t.grade === grade).length;
}

export function trophiesForStage(trophies, stage) {
  return trophies.filter((t) => t.stage === stage);
}

export function trophiesForKind(trophies, kind) {
  return trophies.filter((t) => t.kind === kind);
}

export function missableTrophies(trophies) {
  return trophies.filter((t) => t.missable);
}

export function sourceLinks(trophy, sources) {
  return (trophy.sources || []).map((key) => sources[key]).filter(Boolean);
}

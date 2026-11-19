// Sunset Platinum — saved progress: localStorage for earned trophies, per-trophy
// notes and settings, plus export to a JSON file and import back from one.
import { NOTES_KEY, SETTINGS_KEY, STORAGE_KEY } from "./config.js";

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Private mode or a full store: progress still works for this session.
  }
}

export function loadEarned() {
  const saved = readJson(STORAGE_KEY, []);
  return new Set(Array.isArray(saved) ? saved.filter((id) => typeof id === "string") : []);
}

export function saveEarned(earnedSet) {
  writeJson(STORAGE_KEY, [...earnedSet]);
}

export function loadNotes() {
  const saved = readJson(NOTES_KEY, {});
  return saved && typeof saved === "object" ? saved : {};
}

export function saveNote(notes, trophyId, text) {
  const next = { ...notes, [trophyId]: text };
  if (!text.trim()) delete next[trophyId];
  writeJson(NOTES_KEY, next);
  return next;
}

export function loadSettings() {
  return { theme: "paper", spoiler: false, ...readJson(SETTINGS_KEY, {}) };
}

export function saveSettings(settings) {
  writeJson(SETTINGS_KEY, settings);
  return settings;
}

export function exportProgress(earnedSet, notes) {
  const payload = { app: "sunset-platinum", version: 1, earned: [...earnedSet], notes };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "sunset-platinum-progress.json";
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  return payload;
}

export async function importProgressFile(file) {
  const text = await file.text();
  const parsed = JSON.parse(text);
  const earned = Array.isArray(parsed) ? parsed : parsed.earned;
  if (!Array.isArray(earned)) throw new Error("That file does not hold a trophy list.");
  const notes = parsed && typeof parsed === "object" && parsed.notes && typeof parsed.notes === "object" ? parsed.notes : {};
  return { earned: new Set(earned.filter((id) => typeof id === "string")), notes };
}

export function resetAllProgress() {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(NOTES_KEY);
  return { earned: new Set(), notes: {} };
}

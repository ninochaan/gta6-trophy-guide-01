// Sunset Platinum — boot, routing and the shared context every view reads.
// Routes are hashes: #/checklist, #/roadmap, #/missables, #/planner, #/settings.
// ?shot=checklist|roadmap|missables|planner seeds a 13-of-55 demo progress state
// for screenshots only: it never writes to localStorage and real users start at 0.
import { DEMO_EARNED_IDS, KIND_LABELS } from "./config.js";
import { loadTrophies } from "./data.js";
import { importProgressFile, loadEarned, loadNotes, loadSettings, resetAllProgress, saveEarned, saveNote, saveSettings, exportProgress as exportProgressFile } from "./store.js";
import { renderChecklist } from "./views/checklist.js";
import { renderRoadmap } from "./views/roadmap.js";
import { renderMissables } from "./views/missables.js";
import { renderPlanner } from "./views/planner.js";
import { renderSettings } from "./views/settings.js";

const params = new URLSearchParams(location.search);
const shot = params.get("shot");
const isDemo = ["checklist", "roadmap", "missables", "planner"].includes(shot);

const view = document.getElementById("view");
const earnedCount = document.getElementById("earnedCount");
const progressFill = document.getElementById("progressFill");
const progressNote = document.getElementById("progressNote");

const ctx = {
  trophies: [],
  byId: new Map(),
  sources: {},
  earned: new Set(),
  notes: {},
  settings: loadSettings(),
  filters: { query: "", grade: "all", kind: "all", unearnedOnly: false, missableOnly: false },
  selectedId: null,
  route: "checklist",
  kindLabel: (kind) => KIND_LABELS[kind] || kind,
  toggleEarned,
  selectTrophy,
  openTrophy,
  saveNote: saveNoteFor,
  applySettings,
  importFile,
  resetProgress,
  exportProgress: () => exportProgressFile(ctx.earned, ctx.notes),
};

function toggleEarned(id, on) {
  if (on) ctx.earned.add(id);
  else ctx.earned.delete(id);
  if (!isDemo) saveEarned(ctx.earned);
  renderAll();
}

function selectTrophy(id) {
  ctx.selectedId = id;
  renderAll();
}

function openTrophy(id) {
  ctx.selectedId = id;
  location.hash = "#/checklist";
  renderAll();
}

function saveNoteFor(id, text) {
  ctx.notes = saveNote(ctx.notes, id, text);
}

function applySettings(patch) {
  ctx.settings = { ...ctx.settings, ...patch };
  if (!isDemo) saveSettings(ctx.settings);
  applyTheme();
  renderAll();
}

async function importFile(file) {
  const { earned, notes } = await importProgressFile(file);
  ctx.earned = earned;
  ctx.notes = notes;
  if (!isDemo) {
    saveEarned(ctx.earned);
    saveSettings(ctx.settings);
  }
  renderAll();
}

function resetProgress() {
  const cleared = resetAllProgress();
  ctx.earned = cleared.earned;
  ctx.notes = cleared.notes;
  renderAll();
}

function applyTheme() {
  document.documentElement.setAttribute("data-theme", ctx.settings.theme);
}

function updateProgress() {
  const total = ctx.trophies.length || 55;
  earnedCount.textContent = String(ctx.earned.size);
  progressFill.style.width = `${Math.round((ctx.earned.size / total) * 100)}%`;
  progressNote.textContent = isDemo
    ? "Demo progress for screenshots — 13 of 55 earned. Your own progress starts at 0."
    : ctx.earned.size === 0
      ? "Your progress is saved in this browser."
      : `${ctx.earned.size} of ${total} earned — saved in this browser.`;
}

function currentRoute() {
  const hash = location.hash.replace(/^#\/?/, "");
  return ["checklist", "roadmap", "missables", "planner", "settings"].includes(hash) ? hash : "checklist";
}

function renderAll() {
  ctx.route = currentRoute();
  for (const a of document.querySelectorAll("#tabs a")) {
    a.classList.toggle("active", a.dataset.route === ctx.route);
  }
  updateProgress();
  if (ctx.route === "roadmap") renderRoadmap(view, ctx);
  else if (ctx.route === "missables") renderMissables(view, ctx);
  else if (ctx.route === "planner") renderPlanner(view, ctx);
  else if (ctx.route === "settings") renderSettings(view, ctx);
  else renderChecklist(view, ctx);
  document.title = `Sunset Platinum — GTA VI Trophy Guide & Tracker`;
}

async function boot() {
  const data = await loadTrophies();
  ctx.trophies = data.trophies;
  ctx.byId = data.byId;
  ctx.sources = data.meta.sources || {};

  if (isDemo) {
    // Screenshot state: 13 earned, seeded in memory only, never saved.
    ctx.earned = new Set(DEMO_EARNED_IDS);
    ctx.notes = { "the-shootist": "Gold the pistol challenges first — they teach the timing." };
    const badge = document.createElement("span");
    badge.className = "demo-badge";
    badge.textContent = "Demo progress";
    document.querySelector(".big-count").append(badge);
    if (shot === "roadmap" || shot === "planner") ctx.settings.theme = "night";
    if (shot === "roadmap") ctx.settings.spoiler = true;
    if (shot === "checklist") ctx.selectedId = "just-like-paradise";
    if (shot === "missables") ctx.selectedId = null;
    location.hash = `#/${shot}`;
  } else {
    ctx.earned = loadEarned();
    ctx.notes = loadNotes();
    ctx.selectedId = params.get("open") || null;
  }
  applyTheme();
  renderAll();
}

window.addEventListener("hashchange", renderAll);
boot().catch((error) => {
  view.innerHTML = `<p class="empty">The trophy list could not be loaded. Check that app/data/trophies.json sits beside this page and reload.</p>`;
  console.error(error);
});

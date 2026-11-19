// Sunset Platinum — settings and sources: theme, the spoiler setting, export and
// import, reset, and the full source list with the honesty note.
import { GRADE_LABELS } from "../config.js";
import { exportProgress } from "../store.js";

export function renderSettings(app, ctx) {
  const { trophies, earned, settings, notes } = ctx;
  const section = document.createElement("section");
  const head = document.createElement("div");
  head.innerHTML = `
    <h2>Settings &amp; sources</h2>
    <p class="lede">Your progress lives in this browser only — nothing is uploaded, and the guide works with the network off.</p>`;
  section.append(head);

  const grid = document.createElement("div");
  grid.className = "settings-grid";

  const look = document.createElement("div");
  look.className = "settings-card";
  look.innerHTML = `<h3>Look</h3>`;
  const paperLabel = document.createElement("label");
  paperLabel.className = "switch-row";
  const paperRadio = document.createElement("input");
  paperRadio.type = "radio";
  paperRadio.name = "theme";
  paperRadio.checked = settings.theme === "paper";
  paperLabel.append(paperRadio, document.createTextNode("Paper — light, warm, easy to read in daylight"));
  const nightLabel = document.createElement("label");
  nightLabel.className = "switch-row";
  const nightRadio = document.createElement("input");
  nightRadio.type = "radio";
  nightRadio.name = "theme";
  nightRadio.checked = settings.theme === "night";
  nightLabel.append(nightRadio, document.createTextNode("Night — dark, easy on the eyes after dark"));
  paperRadio.addEventListener("change", () => ctx.applySettings({ theme: "paper" }));
  nightRadio.addEventListener("change", () => ctx.applySettings({ theme: "night" }));
  look.append(paperLabel, nightLabel);

  const spoilers = document.createElement("div");
  spoilers.className = "settings-card";
  spoilers.innerHTML = `<h3>Spoilers</h3>`;
  const spoilerLabel = document.createElement("label");
  spoilerLabel.className = "switch-row";
  const spoilerBox = document.createElement("input");
  spoilerBox.type = "checkbox";
  spoilerBox.checked = settings.spoiler;
  const spoilerText = document.createElement("span");
  spoilerText.innerHTML = `Hide story trophies until earned<small>Names, descriptions and guides of unearned story trophies stay hidden. Earned ones always show.</small>`;
  spoilerLabel.append(spoilerBox, spoilerText);
  spoilerBox.addEventListener("change", () => ctx.applySettings({ spoiler: spoilerBox.checked }));
  spoilers.append(spoilerLabel);

  const backup = document.createElement("div");
  backup.className = "settings-card";
  backup.innerHTML = `<h3>Your progress</h3><p>${earned.size} of ${trophies.length} trophies earned · ${Object.keys(notes).length} notes saved.</p>`;
  const row = document.createElement("div");
  row.className = "row";
  const exportBtn = document.createElement("button");
  exportBtn.type = "button";
  exportBtn.className = "btn primary";
  exportBtn.textContent = "Export progress (.json)";
  exportBtn.addEventListener("click", () => exportProgress(earned, notes));
  const importLabel = document.createElement("label");
  importLabel.className = "btn";
  importLabel.textContent = "Import progress";
  const importInput = document.createElement("input");
  importInput.type = "file";
  importInput.accept = "application/json";
  importInput.hidden = true;
  importInput.addEventListener("change", async () => {
    const file = importInput.files[0];
    if (!file) return;
    try {
      await ctx.importFile(file);
    } catch {
      alert("That file could not be read as a progress file.");
    }
    importInput.value = "";
  });
  importLabel.append(importInput);
  const resetBtn = document.createElement("button");
  resetBtn.type = "button";
  resetBtn.className = "btn";
  resetBtn.textContent = "Reset all progress";
  resetBtn.addEventListener("click", () => {
    if (confirm("Clear every earned trophy and note? This cannot be undone.")) ctx.resetProgress();
  });
  row.append(exportBtn, importLabel, resetBtn);
  backup.append(row);

  grid.append(look, spoilers, backup);
  section.append(grid);

  const sourcesCard = document.createElement("div");
  sourcesCard.className = "settings-card";
  sourcesCard.style.marginTop = "0.9rem";
  const sourcesTitle = document.createElement("h3");
  sourcesTitle.textContent = "Sources — where every fact comes from";
  sourcesCard.append(sourcesTitle);
  const sourcesList = document.createElement("ul");
  sourcesList.className = "sources";
  const exophase = document.createElement("li");
  const exophaseLink = document.createElement("a");
  exophaseLink.href = "https://www.exophase.com/game/grand-theft-auto-vi-psn/trophies/";
  exophaseLink.textContent = "Exophase — GTA VI trophy list";
  exophaseLink.target = "_blank";
  exophaseLink.rel = "noopener";
  exophase.append(exophaseLink, document.createTextNode(" — every trophy's official name, description and grade."));
  const psnp = document.createElement("li");
  const psnpLink = document.createElement("a");
  psnpLink.href = "https://psnprofiles.com/trophies/43531-grand-theft-auto-vi";
  psnpLink.textContent = "PSNProfiles — GTA VI trophies";
  psnpLink.target = "_blank";
  psnpLink.rel = "noopener";
  psnp.append(psnpLink, document.createTextNode(" — PSN's progress counts (0/42, 0/250 and the rest) where a trophy has one."));
  const own = document.createElement("li");
  own.textContent = "Our own advice, from the official description — not yet checked in the game. The game released the day this guide was written, so no guide here claims a location or step the description does not pin down.";
  sourcesList.append(exophase, psnp, own);
  sourcesCard.append(sourcesList);
  const gradeLine = document.createElement("p");
  gradeLine.textContent = `The list: 1 platinum, 2 gold, 6 silver, 46 bronze — ${GRADE_LABELS.platinum} “Vice Got a Price!”, gold “You Gotta Know When to Get Off” and “A Long Road”. No online trophies are listed; the whole list is single-player.`;
  sourcesCard.append(gradeLine);
  section.append(sourcesCard);
  app.replaceChildren(section);
}

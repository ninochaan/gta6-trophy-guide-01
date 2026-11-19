// Sunset Platinum — the guide pane: one trophy's official name, description and
// grade, its guide in our own words, its named sources, and a personal note field.
import { GRADE_LABELS } from "../config.js";
import { isSpoilerHidden, spoilerPlaceholder } from "../filters.js";
import { sourceLinks } from "../data.js";

export function renderDetailPane(pane, ctx) {
  const { trophies, byId, earned, settings, selectedId, sources } = ctx;
  const trophy = (selectedId && byId.get(selectedId)) || trophies.find((t) => !earned.has(t.id)) || trophies[0];
  if (!trophy) {
    pane.innerHTML = "<h3>No trophy selected</h3><p>Pick a trophy from the list to read its guide.</p>";
    return;
  }
  const hidden = isSpoilerHidden(trophy, earned, settings.spoiler);
  pane.replaceChildren();
  const name = document.createElement("p");
  name.className = "trophy-name";
  name.textContent = hidden ? spoilerPlaceholder().name : trophy.name;
  pane.append(name);

  const official = document.createElement("p");
  official.className = "official";
  official.textContent = hidden
    ? spoilerPlaceholder().description
    : `Official description: “${trophy.description}” — ${GRADE_LABELS[trophy.grade]} trophy.`;
  pane.append(official);

  if (trophy.target && !hidden) {
    const target = document.createElement("p");
    target.className = "official";
    target.textContent = `PSN tracks this one: ${trophy.targetLabel} (0/${trophy.target} at the start).`;
    pane.append(target);
  }
  if (trophy.missable && !hidden) {
    const flag = document.createElement("p");
    flag.className = "official";
    const strong = document.createElement("strong");
    strong.textContent = "⚑ Flagged missable. ";
    flag.append(strong, document.createTextNode("Do it when the moment comes — the official description ties it to a specific moment or choice, and the game has not confirmed a replay. See the Missables page."));
    pane.append(flag);
  }

  const guideHeading = document.createElement("h3");
  guideHeading.textContent = "Guide";
  pane.append(guideHeading);
  const guide = document.createElement("p");
  guide.className = "guide-text";
  guide.textContent = hidden
    ? "The guide stays hidden with the trophy while the spoiler setting is on. Earn it, or turn spoilers off in Settings."
    : trophy.guide;
  pane.append(guide);

  if (!hidden) {
    const sourcesHeading = document.createElement("h3");
    sourcesHeading.textContent = "Sources";
    pane.append(sourcesHeading);
    const list = document.createElement("ul");
    list.className = "sources";
    for (const s of sourceLinks(trophy, sources)) {
      const li = document.createElement("li");
      if (s.url) {
        const a = document.createElement("a");
        a.href = s.url;
        a.textContent = s.label;
        a.target = "_blank";
        a.rel = "noopener";
        li.append(a);
      } else {
        li.textContent = s.label;
      }
      list.append(li);
    }
    pane.append(list);
  }

  const noteHeading = document.createElement("h3");
  noteHeading.textContent = "Your notes";
  pane.append(noteHeading);
  const area = document.createElement("textarea");
  area.className = "note-field";
  area.placeholder = "Where did you find it? What worked? (Saved in this browser.)";
  area.value = ctx.notes[trophy.id] || "";
  area.setAttribute("aria-label", `Notes for ${trophy.name}`);
  const saved = document.createElement("p");
  saved.className = "note-saved";
  saved.textContent = ctx.notes[trophy.id] ? "Note saved in this browser." : "";
  area.addEventListener("input", () => {
    ctx.saveNote(trophy.id, area.value);
    saved.textContent = area.value.trim() ? "Note saved in this browser." : "";
  });
  pane.append(area, saved);

  const actions = document.createElement("div");
  actions.className = "detail-actions";
  const toggle = document.createElement("button");
  toggle.type = "button";
  toggle.className = "btn primary";
  toggle.textContent = earned.has(trophy.id) ? "✓ Earned — mark unearned" : "Mark as earned";
  toggle.addEventListener("click", () => ctx.toggleEarned(trophy.id, !earned.has(trophy.id)));
  const next = document.createElement("button");
  next.type = "button";
  next.className = "btn";
  next.textContent = "Next trophy ↓";
  next.addEventListener("click", () => {
    const i = trophies.indexOf(trophy);
    ctx.selectTrophy(trophies[(i + 1) % trophies.length].id);
  });
  actions.append(toggle, next);
  pane.append(actions);
}

// Sunset Platinum — the Next up planner: what to do next, picked from the
// roadmap order, plus progress bars for every kind and every PSN target.
import { KINDS, KIND_LABELS, ROADMAP_STAGES } from "../config.js";
import { countEarned, isSpoilerHidden, spoilerPlaceholder } from "../filters.js";
import { trophiesForKind, trophiesForStage } from "../data.js";

export function renderPlanner(app, ctx) {
  const { trophies, earned } = ctx;
  const section = document.createElement("section");
  const head = document.createElement("div");
  head.innerHTML = `
    <h2>Next up — your planner</h2>
    <p class="lede">The next trophy in each roadmap stage, in stage order. Work from the top: the earliest unfinished stage first, and the missables inside it before anything else.</p>`;
  section.append(head);

  const nextList = document.createElement("ol");
  nextList.className = "next-list";
  let suggestions = 0;
  for (const stage of ROADMAP_STAGES) {
    const members = trophiesForStage(trophies, stage.n);
    const next = members.find((t) => !earned.has(t.id));
    if (!next) continue;
    suggestions += 1;
    const item = document.createElement("li");
    const title = document.createElement("strong");
    const hidden = isSpoilerHidden(next, earned, ctx.settings.spoiler);
    title.textContent = hidden ? "Hidden story trophy" : `${next.missable ? "⚑ " : ""}${next.name}`;
    const why = document.createElement("span");
    why.className = "next-why";
    why.style.display = "block";
    why.textContent = hidden
      ? `Stage ${stage.n} — ${stage.title} · ${spoilerPlaceholder().description}`
      : `Stage ${stage.n} — ${stage.title} · ${next.description} ${next.target ? `PSN target: ${next.targetLabel}.` : ""}`;
    item.append(title, why);
    item.addEventListener("click", () => ctx.openTrophy(next.id));
    nextList.append(item);
  }
  if (suggestions === 0) {
    const done = document.createElement("p");
    done.className = "empty";
    done.textContent = "Nothing left — every trophy is earned. The platinum is yours, Leonida Legend.";
    section.append(done);
  } else {
    section.append(nextList);
  }

  const barsHeading = document.createElement("h3");
  barsHeading.textContent = "Progress by kind";
  barsHeading.style.marginTop = "1.2rem";
  section.append(barsHeading);
  const bars = document.createElement("div");
  bars.className = "kind-bars";
  for (const kind of KINDS) {
    const members = trophiesForKind(trophies, kind.id);
    if (members.length === 0) continue;
    const done = countEarned(members, earned);
    const card = document.createElement("div");
    card.className = "kind-bar";
    const headRow = document.createElement("div");
    headRow.className = "kind-bar-head";
    const label = document.createElement("span");
    label.textContent = kind.label;
    const count = document.createElement("span");
    count.textContent = `${done}/${members.length}`;
    headRow.append(label, count);
    const track = document.createElement("div");
    track.className = "progress-track";
    const fill = document.createElement("div");
    fill.className = "progress-fill";
    fill.style.width = `${Math.round((done / members.length) * 100)}%`;
    track.append(fill);
    card.append(headRow, track);
    bars.append(card);
  }
  section.append(bars);

  const targetsHeading = document.createElement("h3");
  targetsHeading.textContent = "PSN progress targets";
  section.append(targetsHeading);
  const targetsNote = document.createElement("p");
  targetsNote.className = "lede";
  targetsNote.textContent = "PlayStation tracks a count for 20 of the trophies. The counts below come from PSNProfiles; tick the trophy here when you finish the count in-game.";
  section.append(targetsNote);
  const targets = document.createElement("ul");
  targets.className = "next-list";
  for (const t of trophies.filter((x) => x.target)) {
    const item = document.createElement("li");
    const title = document.createElement("strong");
    title.textContent = `${earned.has(t.id) ? "✓ " : ""}${t.name}`;
    const why = document.createElement("span");
    why.className = "next-why";
    why.style.display = "block";
    why.textContent = `PSN target: ${t.targetLabel} — ${t.description}`;
    item.append(title, why);
    item.addEventListener("click", () => ctx.openTrophy(t.id));
    targets.append(item);
  }
  section.append(targets);
  app.replaceChildren(section);
}

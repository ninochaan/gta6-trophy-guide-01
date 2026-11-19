// Sunset Platinum — the roadmap page: seven stages to the platinum, each with
// its trophies, its own progress, and why the order is what it is.
import { ROADMAP_STAGES } from "../config.js";
import { countEarned, isSpoilerHidden } from "../filters.js";
import { trophiesForStage } from "../data.js";

export function renderRoadmap(app, ctx) {
  const { trophies, earned } = ctx;
  const section = document.createElement("section");
  const head = document.createElement("div");
  head.innerHTML = `
    <h2>Roadmap to the platinum</h2>
    <p class="lede">Seven stages, in the order to play them — built from the official descriptions: which story chapters and missions, which collectibles and counts, and what the platinum needs last. The platinum itself pops when the other 54 are done.</p>
    <p class="honest-note"><strong>Built from the descriptions, not from a playthrough.</strong> Where a description does not pin a place down, the guide says so instead of guessing. Stage order is our own advice: story first (it unlocks the map and systems), then the long grinds, then the clean-up.</p>`;
  section.append(head);

  for (const stage of ROADMAP_STAGES) {
    const members = trophiesForStage(trophies, stage.n);
    const done = countEarned(members, earned);
    const card = document.createElement("div");
    card.className = "stage";
    const headRow = document.createElement("div");
    headRow.className = "stage-head";
    const title = document.createElement("h3");
    title.textContent = `Stage ${stage.n} — ${stage.title}`;
    const count = document.createElement("span");
    count.className = "stage-count";
    count.textContent = `${done} / ${members.length} earned`;
    headRow.append(title, count);
    const blurb = document.createElement("p");
    blurb.textContent = stage.blurb;
    const track = document.createElement("div");
    track.className = "progress-track";
    const fill = document.createElement("div");
    fill.className = "progress-fill";
    fill.style.width = members.length ? `${Math.round((done / members.length) * 100)}%` : "0%";
    track.append(fill);
    const chips = document.createElement("ul");
    chips.className = "chips";
    for (const t of members) {
      const chip = document.createElement("li");
      const hidden = isSpoilerHidden(t, earned, ctx.settings.spoiler);
      chip.textContent = hidden ? "Hidden story trophy" : `${t.missable ? "⚑ " : ""}${t.name}`;
      if (earned.has(t.id)) chip.classList.add("earned");
      if (t.missable) chip.classList.add("missable-chip");
      chip.title = hidden ? "Hidden until earned — spoiler setting is on." : t.description;
      chip.addEventListener("click", () => ctx.openTrophy(t.id));
      chips.append(chip);
    }
    card.append(headRow, blurb, track, chips);
    section.append(card);
  }
  app.replaceChildren(section);
}

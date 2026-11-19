// Sunset Platinum — the missables page: every trophy flagged from its official
// description, with why it is flagged and when to do it.
import { missableTrophies } from "../data.js";
import { countEarned } from "../filters.js";

export function renderMissables(app, ctx) {
  const { trophies, earned } = ctx;
  const flagged = missableTrophies(trophies);
  const done = countEarned(flagged, earned);
  const section = document.createElement("section");
  const head = document.createElement("div");
  head.innerHTML = `
    <h2>Missable trophies — ${done} of ${flagged.length} done</h2>
    <p class="lede">These ${flagged.length} trophies are flagged from their official descriptions alone: each one asks for a specific moment, place or choice. The game has not confirmed whether any of them can be replayed, so this guide treats them as do-it-when-it-comes — and says so plainly instead of claiming a missable is confirmed.</p>
    <p class="honest-note"><strong>How the flags were made.</strong> A trophy is flagged when its description ties it to one moment (a partner escape, a showroom smash, a cocktail on Ocean Beach), a choice (“Choices made”), or a single attempt (“Second time's the charm”). Story missions and chapter trophies are <em>not</em> flagged: missions can be replayed and chapters always complete.</p>`;
  section.append(head);

  for (const t of flagged) {
    const card = document.createElement("article");
    card.className = "missable-card";
    const title = document.createElement("h3");
    title.textContent = `${earned.has(t.id) ? "✓ " : "⚑ "}${t.name}`;
    const desc = document.createElement("p");
    desc.textContent = `Official description: “${t.description}”`;
    const why = document.createElement("p");
    why.className = "why";
    why.textContent = t.guide;
    const stage = document.createElement("p");
    stage.className = "why";
    stage.textContent = `Roadmap stage ${t.stage} · ${t.grade} trophy.`;
    card.append(title, desc, why, stage);
    card.addEventListener("click", () => ctx.openTrophy(t.id));
    section.append(card);
  }
  app.replaceChildren(section);
}

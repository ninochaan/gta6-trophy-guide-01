// Sunset Platinum — the checklist view: search, grade and kind filters, the
// trophy rows, and the guide pane beside them.
import { GRADE_LABELS, KINDS } from "../config.js";
import { applyFilters, countEarned, earnedByGrade, isSpoilerHidden, spoilerPlaceholder } from "../filters.js";
import { renderDetailPane } from "./detail.js";

export function renderChecklist(app, ctx) {
  const { trophies, earned, settings, selectedId } = ctx;
  const f = ctx.filters;
  const shown = applyFilters(trophies, earned, f);
  const byGrade = earnedByGrade(trophies, earned);

  const section = document.createElement("section");
  section.innerHTML = `
    <h2>Checklist — all 55 trophies</h2>
    <p class="lede">Every official trophy with its name, description and grade as PlayStation publishes them. Tick one off when you earn it — it stays ticked in this browser. Click a row to open its guide, sources and your notes.</p>
    <div class="grade-counters" id="gradeCounters"></div>
    <div class="toolbar">
      <input type="text" id="searchBox" placeholder="Search trophies, descriptions and guides…" value="" aria-label="Search trophies">
      <label>Grade <select id="gradeFilter">
        <option value="all">All grades</option>
        <option value="platinum">Platinum</option>
        <option value="gold">Gold</option>
        <option value="silver">Silver</option>
        <option value="bronze">Bronze</option>
      </select></label>
      <label>Kind <select id="kindFilter">
        <option value="all">All kinds</option>
      </select></label>
      <label><input type="checkbox" id="unearnedOnly"> Unearned only</label>
      <label><input type="checkbox" id="missableOnly"> Missable only</label>
      <label title="Hide the names and descriptions of unearned story trophies"><input type="checkbox" id="spoilerToggle"> Hide story spoilers</label>
      <button type="button" class="btn" id="exportBtn">Export progress</button>
      <label class="btn" id="importLabel">Import progress <input type="file" id="importFile" accept="application/json" hidden></label>
      <span class="result-count" id="resultCount"></span>
    </div>
    <div class="checklist-layout">
      <ul class="trophy-list" id="trophyList"></ul>
      <aside class="detail-pane" id="detailPane" aria-live="polite"></aside>
    </div>`;

  const counters = section.querySelector("#gradeCounters");
  for (const grade of ["platinum", "gold", "silver", "bronze"]) {
    const c = byGrade[grade] || { earned: 0, total: 0 };
    const chip = document.createElement("span");
    chip.textContent = `${GRADE_LABELS[grade]} ${c.earned}/${c.total}`;
    counters.append(chip);
  }

  const kindSelect = section.querySelector("#kindFilter");
  for (const k of KINDS) {
    const opt = document.createElement("option");
    opt.value = k.id;
    opt.textContent = k.label;
    kindSelect.append(opt);
  }
  const searchBox = section.querySelector("#searchBox");
  const gradeSelect = section.querySelector("#gradeFilter");
  const unearnedBox = section.querySelector("#unearnedOnly");
  const missableBox = section.querySelector("#missableOnly");
  const spoilerBox = section.querySelector("#spoilerToggle");
  searchBox.value = f.query;
  gradeSelect.value = f.grade;
  kindSelect.value = f.kind;
  unearnedBox.checked = f.unearnedOnly;
  missableBox.checked = f.missableOnly;
  spoilerBox.checked = settings.spoiler;
  section.querySelector("#exportBtn").addEventListener("click", () => ctx.exportProgress());
  section.querySelector("#importFile").addEventListener("change", async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    try {
      await ctx.importFile(file);
    } catch {
      alert("That file could not be read as a progress file.");
    }
    event.target.value = "";
  });
  spoilerBox.addEventListener("change", () => ctx.applySettings({ spoiler: spoilerBox.checked }));

  function refreshRows() {
    const list = section.querySelector("#trophyList");
    const rows = applyFilters(trophies, earned, ctx.filters);
    section.querySelector("#resultCount").textContent = `${rows.length} of ${trophies.length} shown`;
    list.replaceChildren();
    if (rows.length === 0) {
      const empty = document.createElement("li");
      empty.className = "empty";
      empty.textContent = "No trophies match those filters. Clear the search or widen the filters.";
      list.append(empty);
      return;
    }
    for (const t of rows) {
      list.append(buildRow(t, ctx));
    }
  }

  function buildRow(t, ctx) {
    const li = document.createElement("li");
    const hidden = isSpoilerHidden(t, earned, settings.spoiler);
    const shown2 = hidden ? spoilerPlaceholder() : t;
    const row = document.createElement("button");
    row.type = "button";
    row.className = "trophy-row" + (earned.has(t.id) ? " earned" : "") + (selectedId === t.id ? " selected" : "");
    const box = document.createElement("input");
    box.type = "checkbox";
    box.checked = earned.has(t.id);
    box.setAttribute("aria-label", `Earned: ${shown2.name}`);
    box.addEventListener("click", (event) => event.stopPropagation());
    box.addEventListener("change", () => {
      ctx.toggleEarned(t.id, box.checked);
    });
    const medal = document.createElement("span");
    medal.className = `medal ${t.grade}`;
    medal.title = GRADE_LABELS[t.grade];
    const main = document.createElement("span");
    const name = document.createElement("span");
    name.className = "trophy-name";
    name.textContent = shown2.name;
    const desc = document.createElement("span");
    desc.className = "trophy-desc";
    desc.style.display = "block";
    desc.textContent = shown2.description;
    const meta = document.createElement("span");
    meta.className = "trophy-meta";
    const gradeTag = document.createElement("span");
    gradeTag.className = `tag grade-${t.grade}`;
    gradeTag.textContent = GRADE_LABELS[t.grade];
    meta.append(gradeTag);
    if (hidden) {
      const tag = document.createElement("span");
      tag.className = "tag hidden-trophy";
      tag.textContent = "Hidden · story";
      meta.append(tag);
    } else {
      const kindTag = document.createElement("span");
      kindTag.className = "tag";
      kindTag.textContent = ctx.kindLabel(t.kind);
      meta.append(kindTag);
      if (t.missable) {
        const m = document.createElement("span");
        m.className = "tag missable";
        m.textContent = "⚑ Missable";
        meta.append(m);
      }
      if (t.target) {
        const target = document.createElement("span");
        target.className = "tag target";
        target.textContent = `PSN ${t.targetLabel}`;
        meta.append(target);
      }
      if (ctx.notes[t.id]) {
        const n = document.createElement("span");
        n.className = "tag";
        n.textContent = "✎ Note";
        meta.append(n);
      }
    }
    main.append(name, desc, meta);
    const earnedMark = document.createElement("span");
    earnedMark.textContent = earned.has(t.id) ? "✓" : "";
    earnedMark.setAttribute("aria-hidden", "true");
    row.append(box, medal, main, earnedMark);
    row.addEventListener("click", () => ctx.selectTrophy(t.id));
    li.append(row);
    return li;
  }

  searchBox.addEventListener("input", () => { ctx.filters.query = searchBox.value; refreshRows(); });
  gradeSelect.addEventListener("change", () => { ctx.filters.grade = gradeSelect.value; refreshRows(); });
  kindSelect.addEventListener("change", () => { ctx.filters.kind = kindSelect.value; refreshRows(); });
  unearnedBox.addEventListener("change", () => { ctx.filters.unearnedOnly = unearnedBox.checked; refreshRows(); });
  missableBox.addEventListener("change", () => { ctx.filters.missableOnly = missableBox.checked; refreshRows(); });

  refreshRows();
  renderDetailPane(section.querySelector("#detailPane"), ctx);
  app.replaceChildren(section);
  return { refreshRows };
}

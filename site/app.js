const INSTALL_COMMAND = "npx skills@latest add labdotsa/skills";
const categoryLabels = {
  all: "All",
  content: "Content",
  design: "Design",
  frontend: "Frontend",
  general: "General",
  growth: "Growth",
  integrations: "Integrations",
  product: "Product",
};

const state = {
  skills: [],
  query: "",
  category: "all",
};

const elements = {
  clearSearch: document.querySelector("#clearSearch"),
  dialog: document.querySelector("#skillDialog"),
  dialogCategory: document.querySelector("#dialogCategory"),
  dialogClose: document.querySelector(".dialog-close"),
  dialogDescription: document.querySelector("#dialogDescription"),
  dialogFile: document.querySelector("#dialogFile"),
  dialogIndex: document.querySelector("#dialogIndex"),
  dialogResources: document.querySelector("#dialogResources"),
  dialogSource: document.querySelector("#dialogSource"),
  dialogTitle: document.querySelector("#dialogTitle"),
  emptyState: document.querySelector("#emptyState"),
  filterList: document.querySelector("#filterList"),
  grid: document.querySelector("#skillGrid"),
  resultCount: document.querySelector("#resultCount"),
  search: document.querySelector("#skillSearch"),
  skillCount: document.querySelector("#skillCount"),
  spineCount: document.querySelector("#spineCount"),
  spineList: document.querySelector("#spineList"),
  toast: document.querySelector("#toast"),
};

function labelForCategory(category) {
  return categoryLabels[category] || category.replaceAll("-", " ");
}

function displayName(name) {
  return name.replaceAll("-", " ");
}

function formatIndex(index) {
  return `S—${String(index).padStart(2, "0")}`;
}

function createSpine() {
  elements.spineList.replaceChildren();

  for (const skill of state.skills) {
    const entry = document.createElement("div");
    entry.className = "spine-entry";
    entry.innerHTML = `
      <span>${formatIndex(skill.index)}</span>
      <strong>${displayName(skill.name)}</strong>
      <i aria-hidden="true"></i>
    `;
    elements.spineList.append(entry);
  }

  elements.spineCount.textContent = `${String(state.skills.length).padStart(2, "0")} entries`;
  elements.skillCount.textContent = String(state.skills.length).padStart(2, "0");
}

function createFilters() {
  const counts = new Map();
  for (const skill of state.skills) counts.set(skill.category, (counts.get(skill.category) || 0) + 1);
  const categories = ["all", ...[...counts.keys()].sort()];

  elements.filterList.replaceChildren();
  for (const category of categories) {
    const button = document.createElement("button");
    const count = category === "all" ? state.skills.length : counts.get(category);
    button.type = "button";
    button.className = "filter-button";
    button.dataset.category = category;
    button.setAttribute("aria-pressed", String(state.category === category));
    button.textContent = `${labelForCategory(category)} ${count}`;
    elements.filterList.append(button);
  }
}

function filteredSkills() {
  const query = state.query.trim().toLowerCase();

  return state.skills.filter((skill) => {
    const categoryMatches = state.category === "all" || skill.category === state.category;
    const text = `${skill.name} ${skill.description} ${skill.category}`.toLowerCase();
    return categoryMatches && (!query || text.includes(query));
  });
}

function createCard(skill) {
  const article = document.createElement("article");
  article.className = "skill-card";
  article.dataset.category = skill.category;

  const meta = document.createElement("div");
  meta.className = "card-meta";
  meta.innerHTML = `<span>${formatIndex(skill.index)}</span><span class="card-category">${labelForCategory(skill.category)}</span>`;

  const heading = document.createElement("h3");
  heading.textContent = displayName(skill.name);

  const description = document.createElement("p");
  description.textContent = skill.description;

  const action = document.createElement("button");
  action.type = "button";
  action.className = "card-action";
  action.dataset.skill = skill.name;
  action.setAttribute("aria-label", `Read details for ${displayName(skill.name)}`);
  action.innerHTML = `<span>Inspect the playbook</span><span aria-hidden="true">→</span>`;

  article.append(meta, heading, description, action);
  return article;
}

function renderGrid() {
  const visibleSkills = filteredSkills();
  elements.grid.replaceChildren(...visibleSkills.map(createCard));
  elements.grid.hidden = visibleSkills.length === 0;
  elements.emptyState.hidden = visibleSkills.length !== 0;
  elements.resultCount.textContent = `${visibleSkills.length} ${visibleSkills.length === 1 ? "skill" : "skills"} shown`;
}

function render() {
  createFilters();
  renderGrid();
}

function resourcePills(resources) {
  const labels = {
    assets: "assets",
    evals: "eval cases",
    references: "references",
    scripts: "scripts",
  };
  const entries = Object.entries(resources).filter(([, count]) => count > 0);

  if (entries.length === 0) {
    const pill = document.createElement("span");
    pill.className = "resource-pill";
    pill.textContent = "Self-contained SKILL.md";
    return [pill];
  }

  return entries.map(([type, count]) => {
    const pill = document.createElement("span");
    pill.className = "resource-pill";
    pill.textContent = `${count} ${labels[type]}`;
    return pill;
  });
}

function openSkill(name, updateHash = true) {
  const skill = state.skills.find((candidate) => candidate.name === name);
  if (!skill) return;

  elements.dialogIndex.textContent = formatIndex(skill.index);
  elements.dialogCategory.textContent = `${labelForCategory(skill.category)} skill`;
  elements.dialogTitle.textContent = displayName(skill.name);
  elements.dialogDescription.textContent = skill.description;
  elements.dialogResources.replaceChildren(...resourcePills(skill.resources));
  elements.dialogSource.href = skill.sourceUrl;
  elements.dialogFile.href = skill.fileUrl;

  if (!elements.dialog.open) elements.dialog.showModal();
  if (updateHash) history.replaceState(null, "", `#skill/${encodeURIComponent(skill.name)}`);
}

function closeSkill() {
  if (elements.dialog.open) elements.dialog.close();
}

function skillFromHash() {
  if (!window.location.hash.startsWith("#skill/")) return null;
  return decodeURIComponent(window.location.hash.slice("#skill/".length));
}

let toastTimer;
async function copyInstall(button) {
  try {
    await navigator.clipboard.writeText(INSTALL_COMMAND);
  } catch {
    const input = document.createElement("textarea");
    input.value = INSTALL_COMMAND;
    document.body.append(input);
    input.select();
    document.execCommand("copy");
    input.remove();
  }

  if (button?.classList.contains("copy-button")) {
    button.classList.add("is-copied");
    window.setTimeout(() => button.classList.remove("is-copied"), 1600);
  }

  elements.toast.classList.add("is-visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => elements.toast.classList.remove("is-visible"), 1800);
}

elements.search.addEventListener("input", (event) => {
  state.query = event.currentTarget.value;
  renderGrid();
});

elements.filterList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-category]");
  if (!button) return;
  state.category = button.dataset.category;
  render();
});

elements.grid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-skill]");
  if (button) openSkill(button.dataset.skill);
});

elements.clearSearch.addEventListener("click", () => {
  state.query = "";
  state.category = "all";
  elements.search.value = "";
  render();
  elements.search.focus();
});

elements.dialogClose.addEventListener("click", closeSkill);
elements.dialog.addEventListener("click", (event) => {
  if (event.target === elements.dialog) closeSkill();
});
elements.dialog.addEventListener("close", () => {
  if (skillFromHash()) history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
});

document.addEventListener("click", (event) => {
  const button = event.target.closest("[data-copy-install]");
  if (button) copyInstall(button);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "/" && document.activeElement?.tagName !== "INPUT") {
    event.preventDefault();
    elements.search.focus();
  }
});

window.addEventListener("hashchange", () => {
  const name = skillFromHash();
  if (name) openSkill(name, false);
});

async function initialize() {
  try {
    const response = await fetch("./skills.json");
    if (!response.ok) throw new Error(`Catalog request failed with ${response.status}`);
    const data = await response.json();
    state.skills = data.skills;
    createSpine();
    render();

    const linkedSkill = skillFromHash();
    if (linkedSkill) openSkill(linkedSkill, false);
  } catch (error) {
    elements.spineList.innerHTML = '<div class="spine-loading">The catalog could not be loaded.</div>';
    elements.resultCount.textContent = "Catalog unavailable";
    console.error(error);
  }
}

initialize();

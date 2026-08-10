const INSTALL_COMMAND = "npx skills add labdotsa/skills";
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
  dialogCommand: document.querySelector("#dialogCommand"),
  dialogDescription: document.querySelector("#dialogDescription"),
  dialogFile: document.querySelector("#dialogFile"),
  dialogIndex: document.querySelector("#dialogIndex"),
  dialogResources: document.querySelector("#dialogResources"),
  dialogSource: document.querySelector("#dialogSource"),
  dialogTitle: document.querySelector("#dialogTitle"),
  emptyState: document.querySelector("#emptyState"),
  filterList: document.querySelector("#filterList"),
  index: document.querySelector("#skillIndex"),
  resultCount: document.querySelector("#resultCount"),
  search: document.querySelector("#skillSearch"),
  toast: document.querySelector("#toast"),
};

function labelForCategory(category) {
  return categoryLabels[category] || category.replaceAll("-", " ");
}

function formatNumber(index) {
  return String(index).padStart(2, "0");
}

function resourceTotal(resources) {
  return Object.values(resources).reduce((total, count) => total + count, 0);
}

function resourceSummary(resources) {
  const total = resourceTotal(resources);
  if (total === 0) return "single file";
  return `${total} supporting ${total === 1 ? "file" : "files"}`;
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
    button.textContent = `${labelForCategory(category)} ${formatNumber(count)}`;
    elements.filterList.append(button);
  }
}

function filteredSkills() {
  const query = state.query.trim().toLowerCase();

  return state.skills.filter((skill) => {
    const categoryMatches = state.category === "all" || skill.category === state.category;
    const searchableText = `${skill.name} ${skill.description} ${skill.category}`.toLowerCase();
    return categoryMatches && (!query || searchableText.includes(query));
  });
}

function createSkillRow(skill) {
  const row = document.createElement("article");
  row.className = "skill-row";

  const number = document.createElement("span");
  number.className = "row-number";
  number.textContent = formatNumber(skill.index);

  const main = document.createElement("div");
  main.className = "row-main";
  const title = document.createElement("h3");
  title.textContent = skill.name;
  const description = document.createElement("p");
  description.textContent = skill.description;
  main.append(title, description);

  const resources = document.createElement("span");
  resources.className = "row-resources";
  const total = resourceTotal(skill.resources);
  resources.innerHTML = total === 0 ? "<strong>01</strong><br>source file" : `<strong>${formatNumber(total)}</strong><br>supporting files`;

  const arrow = document.createElement("span");
  arrow.className = "row-arrow";
  arrow.setAttribute("aria-hidden", "true");
  arrow.textContent = "→";

  const action = document.createElement("button");
  action.type = "button";
  action.className = "row-action";
  action.dataset.skill = skill.name;
  action.setAttribute("aria-label", `Inspect ${skill.name}`);

  row.append(number, main, resources, arrow, action);
  return row;
}

function createCategorySection(category, skills) {
  const section = document.createElement("section");
  section.className = "category-section";
  section.setAttribute("aria-labelledby", `category-${category}`);

  const heading = document.createElement("div");
  heading.className = "category-heading";
  const label = document.createElement("span");
  label.id = `category-${category}`;
  label.textContent = labelForCategory(category);
  const count = document.createElement("span");
  count.textContent = `${formatNumber(skills.length)} ${skills.length === 1 ? "entry" : "entries"}`;
  heading.append(label, count);

  section.append(heading, ...skills.map(createSkillRow));
  return section;
}

function renderIndex() {
  const visibleSkills = filteredSkills();
  const groups = new Map();

  for (const skill of visibleSkills) {
    const list = groups.get(skill.category) || [];
    list.push(skill);
    groups.set(skill.category, list);
  }

  const sections = [...groups.entries()]
    .sort(([left], [right]) => labelForCategory(left).localeCompare(labelForCategory(right)))
    .map(([category, skills]) => createCategorySection(category, skills));

  elements.index.replaceChildren(...sections);
  elements.index.hidden = visibleSkills.length === 0;
  elements.emptyState.hidden = visibleSkills.length !== 0;
  elements.resultCount.textContent = `${formatNumber(visibleSkills.length)} of ${formatNumber(state.skills.length)} entries`;
}

function render() {
  createFilters();
  renderIndex();
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
    pill.textContent = `${formatNumber(count)} ${labels[type]}`;
    return pill;
  });
}

function commandForSkill(name) {
  return `${INSTALL_COMMAND} --skill ${name}`;
}

function openSkill(name, updateHash = true) {
  const skill = state.skills.find((candidate) => candidate.name === name);
  if (!skill) return;

  elements.dialogIndex.textContent = `No. ${formatNumber(skill.index)}`;
  elements.dialogCategory.textContent = `${labelForCategory(skill.category)} / ${resourceSummary(skill.resources)}`;
  elements.dialogTitle.textContent = skill.name;
  elements.dialogDescription.textContent = skill.description;
  elements.dialogResources.replaceChildren(...resourcePills(skill.resources));
  elements.dialogCommand.textContent = commandForSkill(skill.name);
  elements.dialogSource.href = skill.sourceUrl;
  elements.dialogFile.href = skill.fileUrl;

  if (!elements.dialog.open) elements.dialog.showModal();
  if (updateHash) history.replaceState(null, "", `#skill/${encodeURIComponent(skill.name)}`);
}

function skillFromHash() {
  if (!window.location.hash.startsWith("#skill/")) return null;
  return decodeURIComponent(window.location.hash.slice("#skill/".length));
}

function closeSkill() {
  if (elements.dialog.open) elements.dialog.close();
}

let toastTimer;
async function copyCommand(command) {
  try {
    await navigator.clipboard.writeText(command);
  } catch {
    const input = document.createElement("textarea");
    input.value = command;
    document.body.append(input);
    input.select();
    document.execCommand("copy");
    input.remove();
  }

  elements.toast.classList.add("is-visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => elements.toast.classList.remove("is-visible"), 1600);
}

elements.search.addEventListener("input", (event) => {
  state.query = event.currentTarget.value;
  renderIndex();
});

elements.filterList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-category]");
  if (!button) return;
  state.category = button.dataset.category;
  render();
});

elements.index.addEventListener("click", (event) => {
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
  if (skillFromHash()) history.replaceState(null, "", window.location.href.split("#")[0]);
});

document.addEventListener("click", (event) => {
  if (event.target.closest("[data-copy-install]")) copyCommand(INSTALL_COMMAND);
  if (event.target.closest("[data-copy-skill]")) copyCommand(elements.dialogCommand.textContent);
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

async function loadSkills() {
  if (window.SKILLS_DATA?.skills) return window.SKILLS_DATA.skills;
  const response = await fetch("./skills.json");
  if (!response.ok) throw new Error(`Catalog request failed with ${response.status}`);
  const data = await response.json();
  return data.skills;
}

async function initialize() {
  try {
    state.skills = await loadSkills();
    render();

    const linkedSkill = skillFromHash();
    if (linkedSkill) openSkill(linkedSkill, false);
  } catch (error) {
    elements.resultCount.textContent = "Index unavailable";
    console.error(error);
  }
}

initialize();

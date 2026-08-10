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
  selectedName: null,
};

const elements = {
  clearSearch: document.querySelector("#clearSearch"),
  detail: document.querySelector("#skillDetail"),
  detailCategory: document.querySelector("#detailCategory"),
  detailClose: document.querySelector(".detail-close"),
  detailCommand: document.querySelector("#detailCommand"),
  detailDescription: document.querySelector("#detailDescription"),
  detailFile: document.querySelector("#detailFile"),
  detailFileCount: document.querySelector("#detailFileCount"),
  detailFiles: document.querySelector("#detailFiles"),
  detailPackageName: document.querySelector("#detailPackageName"),
  detailSource: document.querySelector("#detailSource"),
  detailTitle: document.querySelector("#detailTitle"),
  emptyState: document.querySelector("#emptyState"),
  filterList: document.querySelector("#filterList"),
  index: document.querySelector("#skillIndex"),
  resultCount: document.querySelector("#resultCount"),
  search: document.querySelector("#skillSearch"),
  skillCount: document.querySelector("#skillCount"),
  toast: document.querySelector("#toast"),
};

function labelForCategory(category) {
  return categoryLabels[category] || category.replaceAll("-", " ");
}

function formatNumber(value) {
  return String(value).padStart(2, "0");
}

function packageFileCount(skill) {
  if (Array.isArray(skill.files)) return skill.files.length;
  return 1 + Object.values(skill.resources || {}).reduce((total, count) => total + count, 0);
}

function commandForSkill(name) {
  return `${INSTALL_COMMAND} --skill ${name}`;
}

function skillFromHash() {
  if (!window.location.hash.startsWith("#skill/")) return null;
  return decodeURIComponent(window.location.hash.slice("#skill/".length));
}

function filteredSkills() {
  const query = state.query.trim().toLowerCase();
  return state.skills.filter((skill) => {
    const categoryMatches = state.category === "all" || skill.category === state.category;
    const searchable = `${skill.name} ${skill.description} ${skill.category} ${(skill.files || []).join(" ")}`.toLowerCase();
    return categoryMatches && (!query || searchable.includes(query));
  });
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
    button.dataset.category = category;
    button.setAttribute("aria-pressed", String(state.category === category));
    button.innerHTML = `<span>${labelForCategory(category)}</span><small>${formatNumber(count)}</small>`;
    elements.filterList.append(button);
  }
}

function createSkillRow(skill) {
  const item = document.createElement("div");
  item.className = "catalog-item";
  item.setAttribute("role", "listitem");

  const button = document.createElement("button");
  button.type = "button";
  button.className = "catalog-row";
  button.dataset.skill = skill.name;
  button.setAttribute("aria-pressed", String(state.selectedName === skill.name));

  const heading = document.createElement("span");
  heading.className = "row-heading";
  heading.innerHTML = `<span class="row-path">skills/</span>${skill.name}`;

  const description = document.createElement("span");
  description.className = "row-description";
  description.textContent = skill.description;

  const meta = document.createElement("span");
  meta.className = "row-meta";
  meta.innerHTML = `<span>${labelForCategory(skill.category)}</span><span>${formatNumber(packageFileCount(skill))} files</span>`;

  const arrow = document.createElement("span");
  arrow.className = "row-arrow";
  arrow.setAttribute("aria-hidden", "true");
  arrow.textContent = "↗";

  button.append(heading, description, meta, arrow);
  item.append(button);
  return item;
}

function renderCatalog() {
  const visibleSkills = filteredSkills();
  elements.index.replaceChildren(...visibleSkills.map(createSkillRow));
  elements.index.hidden = visibleSkills.length === 0;
  elements.emptyState.hidden = visibleSkills.length !== 0;
  elements.resultCount.textContent = `${formatNumber(visibleSkills.length)} / ${formatNumber(state.skills.length)}`;
}

function render() {
  createFilters();
  renderCatalog();
}

function createFileEntry(file, index, total) {
  const item = document.createElement("li");
  const branch = document.createElement("span");
  branch.setAttribute("aria-hidden", "true");
  branch.textContent = index === total - 1 ? "└─" : "├─";

  const path = document.createElement("code");
  path.textContent = file;

  item.append(branch, path);
  if (file.startsWith("references/")) item.dataset.kind = "reference";
  if (file === "SKILL.md") item.dataset.kind = "root";
  return item;
}

function openSkill(name, options = {}) {
  const { updateHash = true, revealOnMobile = true } = options;
  const skill = state.skills.find((candidate) => candidate.name === name);
  if (!skill) return;

  state.selectedName = skill.name;
  elements.detailCategory.textContent = labelForCategory(skill.category);
  elements.detailFileCount.textContent = `${formatNumber(packageFileCount(skill))} ${packageFileCount(skill) === 1 ? "file" : "files"}`;
  elements.detailTitle.textContent = skill.name;
  elements.detailDescription.textContent = skill.description;
  elements.detailCommand.textContent = commandForSkill(skill.name);
  elements.detailPackageName.textContent = `skills/${skill.name}/`;
  elements.detailSource.href = skill.sourceUrl;
  elements.detailFile.href = skill.fileUrl;

  const files = skill.files?.length ? skill.files : ["SKILL.md"];
  elements.detailFiles.replaceChildren(...files.map((file, index) => createFileEntry(file, index, files.length)));
  elements.detail.scrollTop = 0;

  elements.index.querySelectorAll("[data-skill]").forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.skill === skill.name));
  });

  if (revealOnMobile && window.matchMedia("(max-width: 760px)").matches) {
    elements.detail.classList.add("is-open");
    document.body.classList.add("detail-open");
    elements.detailClose.focus();
  }

  if (updateHash) history.replaceState(null, "", `#skill/${encodeURIComponent(skill.name)}`);
}

function closeSkill() {
  elements.detail.classList.remove("is-open");
  document.body.classList.remove("detail-open");
  if (skillFromHash()) history.replaceState(null, "", window.location.href.split("#")[0]);
  elements.index.querySelector(`[data-skill="${CSS.escape(state.selectedName || "")}"]`)?.focus();
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
  renderCatalog();
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

elements.index.addEventListener("keydown", (event) => {
  if (!['ArrowDown', 'ArrowUp'].includes(event.key)) return;
  const buttons = [...elements.index.querySelectorAll("[data-skill]")];
  const currentIndex = buttons.indexOf(document.activeElement);
  if (currentIndex === -1) return;
  event.preventDefault();
  const offset = event.key === "ArrowDown" ? 1 : -1;
  const next = buttons[(currentIndex + offset + buttons.length) % buttons.length];
  next.focus();
  openSkill(next.dataset.skill, { revealOnMobile: false });
});

elements.clearSearch.addEventListener("click", () => {
  state.query = "";
  state.category = "all";
  elements.search.value = "";
  render();
  elements.search.focus();
});

elements.detailClose.addEventListener("click", closeSkill);

document.addEventListener("click", (event) => {
  if (event.target.closest("[data-copy-install]")) copyCommand(INSTALL_COMMAND);
  if (event.target.closest("[data-copy-skill]")) copyCommand(elements.detailCommand.textContent);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "/" && !["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName)) {
    event.preventDefault();
    elements.search.focus();
  }
  if (event.key === "Escape" && elements.detail.classList.contains("is-open")) closeSkill();
});

window.addEventListener("hashchange", () => {
  const name = skillFromHash();
  if (name) openSkill(name, { updateHash: false });
});

async function loadSkills() {
  const embeddedData = document.querySelector("#skills-data")?.textContent;
  if (embeddedData) return JSON.parse(embeddedData).skills;
  const response = await fetch("./skills.json");
  if (!response.ok) throw new Error(`Catalog request failed with ${response.status}`);
  return (await response.json()).skills;
}

async function initialize() {
  try {
    state.skills = await loadSkills();
    elements.skillCount.textContent = formatNumber(state.skills.length);
    render();

    const linkedSkill = skillFromHash();
    const initialSkill = state.skills.find((skill) => skill.name === linkedSkill) || state.skills[0];
    if (initialSkill) openSkill(initialSkill.name, { updateHash: false, revealOnMobile: Boolean(linkedSkill) });
  } catch (error) {
    elements.resultCount.textContent = "Catalog unavailable";
    console.error(error);
  }
}

initialize();

"use strict";

const Catalog = globalThis.LabsCatalog;
if (!Catalog) throw new Error("The LABs catalog model failed to load.");

const state = {
  skills: [],
  query: "",
  category: "all",
};

const selectors = {
  clearSearch: "#clearSearch",
  emptyState: "#emptyState",
  filterList: "#filterList",
  index: "#skillIndex",
  resultCount: "#resultCount",
  search: "#skillSearch",
  skillCount: "#skillCount",
};

const elements = Object.fromEntries(
  Object.entries(selectors).map(([name, selector]) => [name, document.querySelector(selector)]),
);
const missingElements = Object.entries(elements)
  .filter(([, element]) => !element)
  .map(([name]) => name);

if (missingElements.length > 0) {
  throw new Error(`The site template is missing required elements: ${missingElements.join(", ")}.`);
}

function createTextElement(tagName, className, text) {
  const element = document.createElement(tagName);
  if (className) element.className = className;
  element.textContent = text;
  return element;
}

function formatNumber(value) {
  return String(value).padStart(2, "0");
}

function visibleSkills() {
  return Catalog.filterSkills(state.skills, { query: state.query, category: state.category });
}

function createFilters() {
  const counts = Catalog.categoryCounts(state.skills);
  const categories = ["all", ...[...counts.keys()].sort()];

  elements.filterList.replaceChildren(
    ...categories.map((category) => {
      const button = document.createElement("button");
      const count = category === "all" ? state.skills.length : counts.get(category);
      button.type = "button";
      button.dataset.category = category;
      button.setAttribute("aria-pressed", String(state.category === category));
      button.append(
        createTextElement("span", "", Catalog.labelForCategory(category)),
        createTextElement("small", "", formatNumber(count)),
      );
      return button;
    }),
  );
}

function createSkillRow(skill) {
  const item = document.createElement("article");
  item.className = "catalog-item";
  item.setAttribute("role", "listitem");

  const link = document.createElement("a");
  link.className = "catalog-row";
  link.href = skill.detailUrl;
  link.setAttribute("aria-label", `Open ${skill.name} protocol`);

  const number = createTextElement("span", "row-number", formatNumber(skill.index));
  number.setAttribute("aria-hidden", "true");

  const main = createTextElement("span", "row-main", "");
  const kicker = createTextElement("span", "row-kicker", "");
  kicker.append(
    createTextElement("span", "", Catalog.labelForCategory(skill.category)),
    createTextElement("span", "", `${Catalog.packageFileCount(skill)} ${Catalog.packageFileCount(skill) === 1 ? "file" : "files"}`),
  );
  main.append(
    kicker,
    createTextElement("span", "row-heading", skill.name),
    createTextElement("span", "row-description", skill.description),
  );

  const access = createTextElement("span", "row-access", "");
  access.append(createTextElement("span", "", "Open protocol"), createTextElement("span", "row-arrow", "→"));
  access.setAttribute("aria-hidden", "true");

  link.append(number, main, access);
  item.append(link);
  return item;
}

function renderCatalog() {
  const skills = visibleSkills();
  elements.index.replaceChildren(...skills.map(createSkillRow));
  elements.index.hidden = skills.length === 0;
  elements.emptyState.hidden = skills.length !== 0;
  elements.resultCount.textContent = `${skills.length} of ${state.skills.length} protocols`;
}

function render() {
  createFilters();
  renderCatalog();
}

function bindEvents() {
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

  elements.clearSearch.addEventListener("click", () => {
    state.query = "";
    state.category = "all";
    elements.search.value = "";
    render();
    elements.search.focus();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "/" && !["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName)) {
      event.preventDefault();
      elements.search.focus();
    }
  });
}

async function loadCatalog() {
  const embeddedData = document.querySelector("#skills-data")?.textContent?.trim();
  if (embeddedData) return Catalog.validateCatalog(JSON.parse(embeddedData));

  const response = await fetch("./skills.json");
  if (!response.ok) throw new Error(`Catalog request failed with ${response.status}.`);
  return Catalog.validateCatalog(await response.json());
}

function showCatalogError(error) {
  elements.resultCount.textContent = "Catalog unavailable";
  elements.index.hidden = true;
  elements.emptyState.hidden = false;
  elements.emptyState.textContent = "The skill catalog could not be loaded. Refresh the page to try again.";
  console.error(error);
}

async function initialize() {
  try {
    const catalog = await loadCatalog();
    state.skills = catalog.skills;
    elements.skillCount.textContent = formatNumber(state.skills.length);
    bindEvents();
    render();
  } catch (error) {
    showCatalogError(error);
  }
}

initialize();

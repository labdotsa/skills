"use strict";

const Catalog = globalThis.LabsCatalog;
if (!Catalog) throw new Error("The LAB catalog model failed to load.");

const recipeCategoryLabels = {
  all: "All",
  delivery: "Delivery",
  design: "Design",
  engineering: "Engineering",
  growth: "Growth",
  product: "Product",
  "product-delivery": "Product delivery",
};

const state = {
  kind: "skills",
  skills: [],
  recipes: [],
  query: "",
  category: "all",
};

const selectors = {
  clearSearch: "#clearSearch",
  directoryIntro: "#directoryIntro",
  directoryTabs: "[data-directory-kind]",
  emptyState: "#emptyState",
  filterList: "#filterList",
  index: "#skillIndex",
  recipeCount: "#recipeCount",
  resultCount: "#resultCount",
  search: "#skillSearch",
  searchLabel: "#searchLabel",
  skillCount: "#skillCount",
};

const elements = Object.fromEntries(
  Object.entries(selectors)
    .filter(([name]) => name !== "directoryTabs")
    .map(([name, selector]) => [name, document.querySelector(selector)]),
);
elements.directoryTabs = [...document.querySelectorAll(selectors.directoryTabs)];

const missingElements = Object.entries(elements)
  .filter(([, element]) => !element || (Array.isArray(element) && element.length === 0))
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

function activeItems() {
  return state.kind === "skills" ? state.skills : state.recipes;
}

function labelForCategory(category) {
  return state.kind === "skills"
    ? Catalog.labelForCategory(category)
    : recipeCategoryLabels[category] || category.replaceAll("-", " ");
}

function pillarForCategory(category) {
  if (category === "design") return "design";
  if (["frontend", "integrations", "engineering", "delivery"].includes(category)) return "development";
  if (["content", "growth", "marketing"].includes(category)) return "marketing";
  return "research";
}

function matchesQuery(item) {
  const query = state.query.trim().toLowerCase();
  const categoryMatches = state.category === "all" || item.category === state.category;
  if (!categoryMatches) return false;
  if (!query) return true;

  const text = state.kind === "skills"
    ? `${item.name} ${item.description} ${item.category} ${item.files.join(" ")}`
    : `${item.title} ${item.description} ${item.category} ${item.status}`;
  return text.toLowerCase().includes(query);
}

function visibleItems() {
  return activeItems().filter(matchesQuery);
}

function createFilters() {
  const counts = new Map();
  for (const item of activeItems()) counts.set(item.category, (counts.get(item.category) || 0) + 1);
  const categories = ["all", ...[...counts.keys()].sort()];

  elements.filterList.replaceChildren(
    ...categories.map((category) => {
      const button = document.createElement("button");
      const count = category === "all" ? activeItems().length : counts.get(category);
      button.type = "button";
      button.dataset.category = category;
      button.setAttribute("aria-pressed", String(state.category === category));
      button.append(
        createTextElement("span", "", labelForCategory(category)),
        createTextElement("small", "", formatNumber(count)),
      );
      return button;
    }),
  );
}

function createDirectoryRow(item, index) {
  const isSkill = state.kind === "skills";
  const pillar = pillarForCategory(item.category);
  const itemName = isSkill ? item.name : item.title;
  const itemKind = isSkill ? "skill" : "recipe";

  const article = document.createElement("article");
  article.className = "catalog-item";
  article.setAttribute("role", "listitem");
  article.dataset.pillar = pillar;

  const link = document.createElement("a");
  link.className = `catalog-row ${isSkill ? "skill-row" : "recipe-row"}`;
  link.href = item.detailUrl;
  link.setAttribute("aria-label", `Open ${itemName} ${itemKind}`);

  const number = createTextElement("span", "row-number", formatNumber(index + 1));
  number.setAttribute("aria-hidden", "true");

  const main = createTextElement("span", "row-main", "");
  const kicker = createTextElement("span", "row-kicker", "");
  kicker.append(createTextElement("span", "", labelForCategory(item.category)));
  if (isSkill) {
    const fileCount = Catalog.packageFileCount(item);
    kicker.append(createTextElement("span", "", `${fileCount} ${fileCount === 1 ? "file" : "files"}`));
  } else {
    kicker.append(
      createTextElement("span", "", `${item.conversations} conversations`),
      createTextElement("span", "recipe-status", item.status),
    );
  }
  main.append(
    kicker,
    createTextElement("span", "row-heading", itemName),
    createTextElement("span", "row-description", item.description),
  );

  const access = createTextElement("span", "row-access", "");
  access.append(createTextElement("span", "row-arrow", "→"));
  access.setAttribute("aria-hidden", "true");

  link.append(number, main, access);
  article.append(link);
  return article;
}

function updateDirectoryCopy() {
  const isSkills = state.kind === "skills";
  elements.directoryIntro.textContent = isSkills
    ? "Focused instructions an agent can use directly."
    : "Sequenced skill combinations for complete delivery outcomes.";
  elements.search.placeholder = isSkills
    ? "Search by name, purpose, or file"
    : "Search by outcome, category, or status";
  elements.searchLabel.textContent = isSkills ? "Search skills" : "Search recipes";
  for (const tab of elements.directoryTabs) {
    tab.setAttribute("aria-selected", String(tab.dataset.directoryKind === state.kind));
  }
}

function renderCatalog() {
  const items = visibleItems();
  elements.index.replaceChildren(...items.map(createDirectoryRow));
  elements.index.hidden = items.length === 0;
  elements.emptyState.hidden = items.length !== 0;
  elements.resultCount.textContent = `${items.length} of ${activeItems().length} ${state.kind}`;
}

function render() {
  updateDirectoryCopy();
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

  for (const tab of elements.directoryTabs) {
    tab.addEventListener("click", () => {
      state.kind = tab.dataset.directoryKind;
      state.category = "all";
      state.query = "";
      elements.search.value = "";
      render();
    });
  }

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

function bindContactForm() {
  const form = document.querySelector("[data-contact-form]");
  if (!form) return;
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    window.location.href = "https://lab.sa/contact/discovery-call";
  });
}

async function loadJsonCatalog(id, fallbackUrl) {
  const embedded = document.querySelector(id)?.textContent?.trim();
  if (embedded) return JSON.parse(embedded);
  const response = await fetch(fallbackUrl);
  if (!response.ok) throw new Error(`Catalog request failed with ${response.status}.`);
  return response.json();
}

function showCatalogError(error) {
  elements.resultCount.textContent = "Library unavailable";
  elements.index.hidden = true;
  elements.emptyState.hidden = false;
  elements.emptyState.textContent = "The LAB library could not be loaded. Refresh the page to try again.";
  console.error(error);
}

async function initialize() {
  try {
    const [skillCatalog, recipeCatalog] = await Promise.all([
      loadJsonCatalog("#skills-data", "./skills.json"),
      loadJsonCatalog("#recipes-data", "./recipes.json"),
    ]);
    state.skills = Catalog.validateCatalog(skillCatalog).skills;
    state.recipes = recipeCatalog.recipes;
    elements.skillCount.textContent = formatNumber(state.skills.length);
    elements.recipeCount.textContent = formatNumber(state.recipes.length);
    bindEvents();
    bindContactForm();
    render();
  } catch (error) {
    showCatalogError(error);
  }
}

initialize();

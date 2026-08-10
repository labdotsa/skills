"use strict";

const categoryLabels = {
  all: "All",
  delivery: "Delivery",
  design: "Design",
  engineering: "Engineering",
  growth: "Growth",
  product: "Product",
  "product-delivery": "Product delivery",
};

const state = { recipes: [], query: "", category: "all" };

const elements = {
  clear: document.querySelector("#clearRecipeSearch"),
  count: document.querySelector("#recipeCount"),
  empty: document.querySelector("#recipeEmptyState"),
  filters: document.querySelector("#recipeFilterList"),
  index: document.querySelector("#recipeIndex"),
  resultCount: document.querySelector("#recipeResultCount"),
  search: document.querySelector("#recipeSearch"),
};

if (Object.values(elements).some((element) => !element)) throw new Error("The recipe index template is incomplete.");

function formatNumber(value) {
  return String(value).padStart(2, "0");
}

function labelForCategory(category) {
  return categoryLabels[category] || category.replaceAll("-", " ");
}

function visibleRecipes() {
  const query = state.query.trim().toLowerCase();
  return state.recipes.filter((recipe) => {
    const categoryMatches = state.category === "all" || recipe.category === state.category;
    const text = `${recipe.title} ${recipe.description} ${recipe.category} ${recipe.status}`.toLowerCase();
    return categoryMatches && (!query || text.includes(query));
  });
}

function createTextElement(tagName, className, text) {
  const element = document.createElement(tagName);
  if (className) element.className = className;
  element.textContent = text;
  return element;
}

function renderFilters() {
  const counts = new Map();
  for (const recipe of state.recipes) counts.set(recipe.category, (counts.get(recipe.category) || 0) + 1);
  const categories = ["all", ...[...counts.keys()].sort()];
  elements.filters.replaceChildren(
    ...categories.map((category) => {
      const button = document.createElement("button");
      button.type = "button";
      button.dataset.category = category;
      button.setAttribute("aria-pressed", String(state.category === category));
      button.append(
        createTextElement("span", "", labelForCategory(category)),
        createTextElement("small", "", formatNumber(category === "all" ? state.recipes.length : counts.get(category))),
      );
      return button;
    }),
  );
}

function createRecipeRow(recipe) {
  const item = document.createElement("article");
  item.className = "catalog-item";
  item.setAttribute("role", "listitem");
  item.dataset.pillar = recipe.category === "design" ? "design" : "research";

  const link = document.createElement("a");
  link.className = "catalog-row recipe-row";
  link.href = recipe.detailUrl;
  link.setAttribute("aria-label", `Open ${recipe.title} recipe`);

  const number = createTextElement("span", "row-number", formatNumber(recipe.index));
  number.setAttribute("aria-hidden", "true");

  const main = createTextElement("span", "row-main", "");
  const kicker = createTextElement("span", "row-kicker", "");
  kicker.append(
    createTextElement("span", "", labelForCategory(recipe.category)),
    createTextElement("span", "", `${recipe.conversations} conversations`),
    createTextElement("span", "recipe-status", recipe.status),
  );
  main.append(kicker, createTextElement("span", "row-heading", recipe.title), createTextElement("span", "row-description", recipe.description));

  const access = createTextElement("span", "row-access", "");
  access.append(createTextElement("span", "", "Open recipe"), createTextElement("span", "row-arrow", "→"));
  access.setAttribute("aria-hidden", "true");

  link.append(number, main, access);
  item.append(link);
  return item;
}

function renderRecipes() {
  const recipes = visibleRecipes();
  elements.index.replaceChildren(...recipes.map(createRecipeRow));
  elements.index.hidden = recipes.length === 0;
  elements.empty.hidden = recipes.length !== 0;
  elements.resultCount.textContent = `${recipes.length} of ${state.recipes.length} recipes`;
}

function render() {
  renderFilters();
  renderRecipes();
}

function bindEvents() {
  elements.search.addEventListener("input", (event) => {
    state.query = event.currentTarget.value;
    renderRecipes();
  });
  elements.filters.addEventListener("click", (event) => {
    const button = event.target.closest("[data-category]");
    if (!button) return;
    state.category = button.dataset.category;
    render();
  });
  elements.clear.addEventListener("click", () => {
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

async function loadRecipes() {
  const embedded = document.querySelector("#recipes-data")?.textContent?.trim();
  if (embedded) return JSON.parse(embedded);
  const response = await fetch("./recipes.json");
  if (!response.ok) throw new Error(`Recipe catalog request failed with ${response.status}.`);
  return response.json();
}

async function initialize() {
  try {
    const catalog = await loadRecipes();
    state.recipes = catalog.recipes;
    elements.count.textContent = formatNumber(state.recipes.length);
    bindEvents();
    render();
  } catch (error) {
    elements.resultCount.textContent = "Recipes unavailable";
    elements.index.hidden = true;
    elements.empty.hidden = false;
    elements.empty.textContent = "The recipe index could not be loaded. Refresh the page to try again.";
    console.error(error);
  }
}

initialize();

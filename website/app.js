"use strict";

const Catalog = globalThis.LabsCatalog;
if (!Catalog) throw new Error("The LABs catalog model failed to load.");

const state = {
  skills: [],
  query: "",
  category: "all",
};

const audienceContent = {
  founders: {
    summary: "Make your idea profitable—less risk, more impact.",
    benefits: {
      research: "Get investor trust and market clarity before coding.",
      design: "Build investor-ready prototypes in days.",
      development: "Launch your MVP fast to get feedback and start earning.",
      marketing: "Get early traction for your next funding round.",
    },
  },
  startups: {
    summary: "Speed up growth—spot opportunities and fix issues fast.",
    benefits: {
      research: "Spot opportunities and risks in one sprint.",
      design: "Build UX users love from day one.",
      development: "Scale tech smoothly as you grow.",
      marketing: "Grow with organic and paid channels.",
    },
  },
  enterprises: {
    summary: "Innovate at scale—no downtime.",
    benefits: {
      research: "Get user insights without slowing you down.",
      design: "Design experiences that match your brand.",
      development: "Plug modern modules into your systems easily.",
      marketing: "Use every channel for smooth rollouts.",
    },
  },
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
  item.dataset.pillar =
    skill.category === "design"
      ? "design"
      : ["frontend", "integrations"].includes(skill.category)
        ? "development"
        : ["content", "growth"].includes(skill.category)
          ? "marketing"
          : "research";

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

function bindAudienceTabs() {
  const tabs = [...document.querySelectorAll("[data-audience]")];
  const summary = document.querySelector("#audienceSummary");
  if (tabs.length === 0 || !summary) return;

  for (const tab of tabs) {
    tab.addEventListener("click", () => {
      const content = audienceContent[tab.dataset.audience];
      if (!content) return;
      for (const candidate of tabs) candidate.setAttribute("aria-selected", String(candidate === tab));
      for (const [pillar, benefit] of Object.entries(content.benefits)) {
        const target = document.querySelector(`[data-audience-benefit="${pillar}"]`);
        if (target) target.textContent = benefit;
      }
      summary.textContent = content.summary;
    });
  }
}

function bindCarousels() {
  for (const carousel of document.querySelectorAll("[data-carousel]")) {
    const track = carousel.querySelector(".service-track");
    const previous = carousel.querySelector("[data-carousel-prev]");
    const next = carousel.querySelector("[data-carousel-next]");
    if (!track || !previous || !next) continue;

    const update = () => {
      previous.disabled = track.scrollLeft <= 2;
      next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 2;
    };
    const distance = () => Math.min(track.clientWidth * 0.72, 680);
    previous.addEventListener("click", () => track.scrollBy({ left: -distance(), behavior: "smooth" }));
    next.addEventListener("click", () => track.scrollBy({ left: distance(), behavior: "smooth" }));
    track.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
    window.requestAnimationFrame(update);
  }
}

function bindContactForm() {
  const form = document.querySelector("[data-contact-form]");
  if (!form) return;
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    window.location.href = "https://lab.sa/contact/discovery-call";
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
    bindAudienceTabs();
    bindCarousels();
    bindContactForm();
    render();
  } catch (error) {
    showCatalogError(error);
  }
}

initialize();

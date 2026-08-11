"use strict";

const copyIcons = {
  copy: "https://unpkg.com/lucide-static@latest/icons/copy.svg",
  loading: "https://unpkg.com/lucide-static@latest/icons/loader-circle.svg",
  success: "https://unpkg.com/lucide-static@latest/icons/check.svg",
};

let toastTimer;

function wait(duration) {
  return new Promise((resolve) => window.setTimeout(resolve, duration));
}

async function copyText(value) {
  try {
    if (!navigator.clipboard) throw new Error("Clipboard API unavailable.");
    await navigator.clipboard.writeText(value);
  } catch {
    const input = document.createElement("textarea");
    input.value = value;
    input.setAttribute("readonly", "");
    document.body.append(input);
    input.select();
    document.execCommand("copy");
    input.remove();
  }
}

function copyIconFor(button) {
  let icon = button.querySelector("[data-copy-icon]");
  if (icon) return icon;

  button.querySelector("svg")?.remove();
  icon = document.createElement("img");
  icon.dataset.copyIcon = "";
  icon.src = copyIcons.copy;
  icon.alt = "";
  icon.setAttribute("aria-hidden", "true");
  button.prepend(icon);
  return icon;
}

function showToast(message) {
  const toast = document.querySelector("#toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 1800);
}

document.addEventListener("click", async (event) => {
  const button = event.target.closest("[data-copy-text], [data-copy-target]");
  if (!button || button.dataset.copyState === "loading") return;

  const target = button.dataset.copyTarget ? document.querySelector(button.dataset.copyTarget) : null;
  const value = target ? target.textContent.trim() : button.dataset.copyText;
  if (!value) return;

  const icon = copyIconFor(button);
  button.dataset.copyState = "loading";
  button.setAttribute("aria-busy", "true");
  icon.src = copyIcons.loading;

  await Promise.all([copyText(value), wait(440)]);
  button.dataset.copyState = "success";
  button.removeAttribute("aria-busy");
  icon.src = copyIcons.success;
  showToast(button.dataset.copyMessage || "Copied to clipboard");

  await wait(1200);
  button.dataset.copyState = "idle";
  icon.src = copyIcons.copy;
});

function setExpanded(region, expanded, animate = true) {
  const content = region.querySelector("[data-collapsible-content]");
  const toggle = region.querySelector("[data-collapse-toggle]");
  if (!content || !toggle) return;

  if (!animate) content.style.transition = "none";
  region.dataset.expanded = String(expanded);
  toggle.setAttribute("aria-expanded", String(expanded));
  toggle.textContent = expanded ? "Show less" : "Show more";
  content.style.maxHeight = expanded ? `${content.scrollHeight}px` : "var(--collapsed-height)";
  if (!animate) window.requestAnimationFrame(() => content.style.removeProperty("transition"));
}

function initializeInteractions() {
  for (const button of document.querySelectorAll("[data-copy-text], [data-copy-target]")) copyIconFor(button);

  const regions = [...document.querySelectorAll("[data-collapsible]")];
  for (const region of regions) {
    const toggle = region.querySelector("[data-collapse-toggle]");
    if (!toggle) continue;
    setExpanded(region, false, false);
    window.requestAnimationFrame(() => {
      const content = region.querySelector("[data-collapsible-content]");
      if (!content || content.scrollHeight > content.clientHeight + 1) return;
      toggle.hidden = true;
      region.dataset.expanded = "true";
      content.style.maxHeight = "none";
    });
    toggle.addEventListener("click", () => setExpanded(region, region.dataset.expanded !== "true"));
  }

  window.addEventListener("resize", () => {
    for (const region of regions) {
      if (region.dataset.expanded === "true") setExpanded(region, true, false);
    }
  });
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initializeInteractions, { once: true });
else initializeInteractions();

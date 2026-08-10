"use strict";

let toastTimer;

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

document.addEventListener("click", async (event) => {
  const button = event.target.closest("[data-copy-text], [data-copy-target]");
  if (!button) return;

  const target = button.dataset.copyTarget ? document.querySelector(button.dataset.copyTarget) : null;
  const value = target ? target.textContent.trim() : button.dataset.copyText;
  if (!value) return;

  await copyText(value);
  const toast = document.querySelector("#toast");
  if (!toast) return;

  toast.textContent = button.dataset.copyMessage || "Command copied";
  toast.classList.add("is-visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 1600);
});

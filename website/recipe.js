(() => {
  const nav = document.querySelector(".recipe-nav");
  if (!nav) return;

  const items = [...nav.querySelectorAll('a[href^="#"]')]
    .map((link) => {
      const id = link.getAttribute("href")?.slice(1);
      const section = id ? document.getElementById(id) : null;
      return section ? { id, link, section } : null;
    })
    .filter(Boolean);

  if (!items.length) return;

  let activeId = "";
  let scheduled = false;

  function activate(id) {
    if (!id || id === activeId) return;
    activeId = id;

    for (const item of items) {
      const active = item.id === id;
      item.link.classList.toggle("is-active", active);
      if (active) item.link.setAttribute("aria-current", "location");
      else item.link.removeAttribute("aria-current");
    }
  }

  function update() {
    scheduled = false;
    const header = document.querySelector(".site-header");
    const headerHeight = header?.getBoundingClientRect().height ?? 0;
    const marker = window.scrollY + headerHeight + Math.min(window.innerHeight * 0.28, 260);
    let current = items[0];

    for (const item of items) {
      const top = item.section.getBoundingClientRect().top + window.scrollY;
      if (top <= marker) current = item;
      else break;
    }

    activate(current.id);
  }

  function scheduleUpdate() {
    if (scheduled) return;
    scheduled = true;
    window.requestAnimationFrame(update);
  }

  for (const item of items) {
    item.link.addEventListener("click", () => activate(item.id));
  }

  window.addEventListener("scroll", scheduleUpdate, { passive: true });
  window.addEventListener("resize", scheduleUpdate);
  window.addEventListener("hashchange", scheduleUpdate);
  window.addEventListener("load", scheduleUpdate);
  scheduleUpdate();
})();

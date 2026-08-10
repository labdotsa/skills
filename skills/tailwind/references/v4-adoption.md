# Tailwind V4 Adoption

Adopt Tailwind v4 **correctly, deterministically, and safely**.  
Avoid silent breakage, dual-version conflicts, and misconfigured builds.

---

## Core Mental Model

Tailwind v4 is **not an upgrade**.  
It is a **system rewrite**.

| Area     | v3                        | v4                      |
| -------- | ------------------------- | ----------------------- |
| Config   | JS (`tailwind.config.js`) | CSS (`@theme`)          |
| Entry    | `@tailwind ...`           | `@import "tailwindcss"` |
| Plugins  | JS                        | CSS (`@plugin`)         |
| Safelist | config                    | `@source inline()`      |
| Engine   | JS-driven                 | CSS-native              |

➡️ Treat v4 as **new architecture**, not version bump.

---

## Apply this reference when

Load it when:

- Migrating Tailwind v3 → v4
- Maintaining monorepo with mixed versions
- Debugging missing classes or broken styles after upgrade
- Standardizing Tailwind usage across teams

---

## Do not apply it when

Do NOT adopt v4 if:

- Legacy browser support required
- Using Sass/Less/Stylus as Tailwind processor
- Cannot afford UI regression testing

➡️ Stay on v3.4 instead.

---

## Operating Rules

### 1. One Tailwind per scope

Never allow:

- v3 + v4 in same CSS bundle
- v3 + v4 targeting same DOM tree

If needed:

- prefix OR isolate
- never mix silently

---

### 2. CSS is the source of truth

In v4:

```css
@import "tailwindcss";

@theme {
  --color-brand: #0ea5e9;
}
```

➡️ No implicit JS config.

---

### 3. Detection must be explicit when needed

v4 auto-detects classes, but fails on:

- dynamic strings
- ignored paths
- monorepos

Fix with:

```css
@source "../packages/ui";
@source inline("bg-red-500");
```

---

### 4. Build pipeline must match version

v3:

```js
tailwindcss: {
}
```

v4:

```js
"@tailwindcss/postcss": {}
```

➡️ wrong plugin = silent failure

---

## Migration Strategy

### Option A — Full Migration (recommended)

```bash
npx @tailwindcss/upgrade
```

Then:

1. Replace entry:

```css
@import "tailwindcss";
```

2. Fix PostCSS:

```js
"@tailwindcss/postcss": {}
```

3. Remove unsupported config:

- safelist
- corePlugins
- separator

---

### Option B — Bridge Mode

```css
@import "tailwindcss";
@config "./tailwind.config.js";
```

Use temporarily.  
Still remove unsupported keys.

---

## Conflict Prevention

### Dependency Level

Detect:

```bash
npm ls tailwindcss
```

Rule:

- ONE version per build

---

### CSS Level

Problem:

```html
<div class="flex text-red-500"></div>
```

Both v3 + v4 generate same selectors.

---

### Solution 1 — Prefixing (recommended)

v4:

```css
@import "tailwindcss" prefix(tw);
```

Usage:

```html
<div class="tw:flex tw:bg-red-500"></div>
```

---

### Solution 2 — Isolation

Use:

- iframe
- microfrontend boundary
- shadow DOM

➡️ separate cascade entirely

---

## Breaking Changes (Critical)

### Hover behavior

Now:

```
@media (hover: hover)
```

Fix:

```css
@custom-variant hover (&:hover);
```

---

### Border default

Now:

```
currentColor
```

Fix:

```
border-gray-200
```

---

### Ring default

Now:

- width: 1px
- color: currentColor

Fix:

```
ring-2 ring-blue-500
```

---

### Transform system

No global `transform`

Fix:

```
scale-100
rotate-0
```

---

### Variant order

v3:

```
hover:focus:bg-red-500
```

v4:

```
focus:hover:bg-red-500
```

---

### Important modifier

v3:

```
hover:!bg-red-500
```

v4:

```
hover:bg-red-500!
```

---

## v4 Feature Adoption

### Theme

```css
@theme {
  --spacing-base: 1rem;
}
```

---

### Utilities

```css
@utility btn {
  padding: 0.5rem 1rem;
}
```

---

### Plugins

```css
@plugin "@tailwindcss/typography";
```

---

### Safelist replacement

```css
@source inline("{hover:,}bg-red-{500,600}");
```

---

## Anti-Patterns

Do NOT:

- mix v3 + v4 in same stylesheet
- rely on `tailwind.config.js` implicitly
- use Sass as Tailwind processor
- keep `safelist` in config
- build dynamic class strings
- assume hover works on mobile

---

## Validation Checklist

### Must pass

- [ ] single Tailwind version
- [ ] correct PostCSS plugin
- [ ] CSS entry uses `@import`
- [ ] no unsupported config keys
- [ ] classes generated correctly

---

### Recommended

- [ ] visual regression tests
- [ ] hover + focus states tested
- [ ] prefix or isolate if dual version
- [ ] Prettier Tailwind plugin configured

---

## Output Requirements (Agent Behavior)

When applying this skill, the agent MUST:

1. Detect Tailwind version(s)
2. Identify conflicts
3. Choose migration strategy
4. Provide exact code changes
5. Highlight breaking UI risks
6. Suggest prefix/isolation if needed
7. Provide validation checklist

---

## Summary

Tailwind v4 introduces:

- CSS-first configuration
- new build pipeline
- new runtime behavior

Safe adoption requires:

- strict version isolation
- explicit configuration
- disciplined migration

➡️ Treat v4 as new system. Not upgrade.

---

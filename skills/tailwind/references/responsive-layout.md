# Tailwind Responsive Architecture

Use this reference to:

- Design or refactor responsive UI components using Tailwind breakpoints.
- Control layout transformations across screen sizes (stack → row, list → grid).
- Define **visibility logic** (what shows, hides, or transforms per breakpoint).
- Architect components based on **information priority and UX**, not just screen size.
- Implement patterns like:
  - `hidden md:flex`
  - `md:hidden`
  - `flex-col md:flex-row`
  - `grid-cols-1 md:grid-cols-3`

Do not load this reference when:

- Task is purely visual (colors, typography, spacing only).
- No responsive behavior is required.

---

## Core Philosophy

### 1. Mobile-first is law

- Base (no prefix) = smallest screen.
- `md:` = overrides for larger screens.
- Never design desktop first then patch mobile.

Bad:
```html
<div class="flex md:flex-col">
```

Good:

```html
<div class="flex flex-col md:flex-row">
```

---

### 2. Layout ≠ Visibility

Responsive design has **two independent layers**:

| Layer      | Purpose                 | Example                 |
| ---------- | ----------------------- | ----------------------- |
| Layout     | Structure of elements   | `flex`, `grid`, `gap-*` |
| Visibility | What user actually sees | `hidden`, `block`       |

You must define BOTH.

---

### 3. Information Priority (Critical)

Before writing classes, classify content:

| Type       | Behavior                            |
| ---------- | ----------------------------------- |
| Essential  | Always visible                      |
| Important  | Visible on most screens             |
| Secondary  | Hidden or deferred on small screens |
| Decorative | Hidden aggressively                 |

This directly maps to Tailwind:

* Essential → no `hidden`
* Secondary → `hidden md:block`
* Mobile-only → `md:hidden`

---

## Breakpoint System (Mental Model)

Tailwind uses **min-width breakpoints**:

| Prefix | Meaning          |
| ------ | ---------------- |
| (none) | Mobile (default) |
| sm:    | ≥ small          |
| md:    | ≥ medium         |
| lg:    | ≥ large          |
| xl:    | ≥ extra large    |
| 2xl:   | ≥ ultra wide     |

Think in **ranges**, not devices:

* mobile → base
* tablet → md
* desktop → lg+

---

## Responsive Behavior Workflow

### Step 1 — Define base (mobile)

* Stack vertically
* Reduce density
* Show only essential info

### Step 2 — Enhance at md

* Introduce horizontal layouts
* Reveal secondary content

### Step 3 — Expand at lg+

* Add complexity (sidebars, multi-columns)
* Improve spacing and hierarchy

---

## Layout Patterns

### Stack → Row

```html
<div class="flex flex-col md:flex-row gap-4">
```

---

### Single Column → Grid

```html
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
```

---

### Fixed + Fluid

```html
<div class="flex">
  <aside class="hidden lg:block w-64"></aside>
  <main class="flex-1"></main>
</div>
```

---

## Visibility Patterns (Critical)

### 1. Desktop-only content

```html
<div class="hidden md:flex">
```

---

### 2. Mobile-only content

```html
<div class="md:hidden">
```

---

### 3. Swap components (important pattern)

```html
<!-- Mobile -->
<div class="md:hidden">
  Mobile UI
</div>

<!-- Desktop -->
<div class="hidden md:block">
  Desktop UI
</div>
```

Use ONLY when structure differs significantly.

---

### 4. Progressive Disclosure

Instead of hiding completely:

```html
<div class="hidden md:block">
  Detailed info
</div>

<button class="md:hidden">
  Show more
</button>
```

---

## Advanced Targeting

### Target specific range

```html
<div class="md:max-lg:flex">
```

Applies only between md → lg.

---

### Custom breakpoint

```html
<div class="max-[600px]:hidden">
```

---

## Anti-Patterns (Avoid)

### ❌ 1. Desktop-first overrides

```html
flex md:flex-col
```

Breaks mental model.

---

### ❌ 2. Overusing hidden

If everything is hidden → UX broken.

---

### ❌ 3. Duplicating content blindly

```html
<div class="md:hidden">Title</div>
<div class="hidden md:block">Title</div>
```

Only valid if layout differs. Otherwise wasteful + risky.

---

### ❌ 4. Reordering content visually

```html
flex-row-reverse
order-2
```

Breaks accessibility and mental flow.

---

## Accessibility Rules

* `hidden` removes from screen readers.
* `sr-only` keeps content accessible.

Example:

```html
<button>
  <Icon />
  <span class="sr-only">Open menu</span>
</button>
```

Never:

* Hide interactive elements with `aria-hidden`
* Duplicate focusable elements across breakpoints

---

## Component Architecture Example

### Responsive Header

```html
<header class="flex items-center justify-between">
  <div>
    <h1 class="text-lg font-semibold">Title</h1>
    <p class="text-sm text-gray-500 md:block hidden">
      Subtitle
    </p>
  </div>

  <!-- Desktop actions -->
  <div class="hidden md:flex gap-2">
    <button>Save</button>
    <button>Share</button>
  </div>

  <!-- Mobile menu -->
  <button class="md:hidden">
    Menu
    <span class="sr-only">Open menu</span>
  </button>
</header>
```

---

## Decision Rules (Fast Thinking)

Use this checklist:

* Can user complete core task on mobile? → YES required
* Is hidden content still accessible? → Prefer disclosure
* Does layout scale progressively? → No jumps
* Is duplication avoided? → Keep single source of truth
* Are breakpoints minimal? → Avoid over-fragmentation

---

## Summary

Responsive Tailwind is NOT:

* Just adding `md:` everywhere
* Just changing layout

It IS:

* Structuring information across space
* Designing visibility intentionally
* Encoding UX decisions into class names

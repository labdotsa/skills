# Localizable Layout

Write Tailwind like global product. No left/right assumptions. Direction safe by default.

---

## Persistence

ALWAYS ACTIVE when writing or reviewing Tailwind.

- No regression to `left/right` patterns
- No partial adoption
- No mixing physical + logical in same intent
- Exception only when explicitly justified

---

## Core Principle

Physical direction = fragile  
Logical direction = global-safe

- `left/right` → **breaks in RTL**
- `start/end` → **auto-flips with `dir`**

All layout must respect document direction.

---

## Direction Source

Never hack direction in CSS.

Use semantic direction:

```html
<html dir="ltr">
<html dir="rtl">
```

Or scoped:

```html
<div dir="rtl">
```

---

## Rules

### 1. Inline Direction MUST be Logical

Replace ALL:

| ❌ Avoid | ✅ Use |
|--------|------|
| `left-*` | `inset-s-*` |
| `right-*` | `inset-e-*` |
| `ml-*` | `ms-*` |
| `mr-*` | `me-*` |
| `pl-*` | `ps-*` |
| `pr-*` | `pe-*` |
| `border-l-*` | `border-s-*` |
| `border-r-*` | `border-e-*` |
| `rounded-l-*` | `rounded-s-*` |
| `rounded-r-*` | `rounded-e-*` |
| `text-left` | `text-start` |
| `text-right` | `text-end` |
| `float-left` | `float-start` |
| `float-right` | `float-end` |
| `clear-left` | `clear-start` |
| `clear-right` | `clear-end` |

---

### 2. Corners MUST be Logical

| ❌ Physical | ✅ Logical |
|------------|----------|
| `rounded-tl-*` | `rounded-ss-*` |
| `rounded-tr-*` | `rounded-se-*` |
| `rounded-bl-*` | `rounded-es-*` |
| `rounded-br-*` | `rounded-ee-*` |

---

### 3. Scroll Offsets MUST be Logical

| ❌ Avoid | ✅ Use |
|--------|------|
| `scroll-ml-*` | `scroll-ms-*` |
| `scroll-mr-*` | `scroll-me-*` |
| `scroll-pl-*` | `scroll-ps-*` |
| `scroll-pr-*` | `scroll-pe-*` |

---

### 4. Prefer Axis Utilities When Intent = Both Sides

Do NOT over-specify:

| Instead of | Use |
|-----------|-----|
| `ml-4 mr-4` | `mx-4` |
| `pl-6 pr-6` | `px-6` |
| `border-l border-r` | `border-x` |

Axis = already logical.

---

### 5. Positioning MUST Flip Automatically

Before:

```html
<div class="absolute right-4 top-2"></div>
```

After:

```html
<div class="absolute inset-e-4 top-2"></div>
```

---

### 6. Variants MUST Preserve Logic

Always preserve modifiers:

```html
md:right-4 → md:inset-e-4
hover:pl-2 → hover:ps-2
dark:border-l → dark:border-s
```

---

## Block Direction (Advanced)

Only when writing-mode safety needed.

| Physical | Logical |
|--------|--------|
| `top-*` | `inset-bs-*` |
| `bottom-*` | `inset-be-*` |
| `mt-*` | `mbs-*` |
| `mb-*` | `mbe-*` |
| `pt-*` | `pbs-*` |
| `pb-*` | `pbe-*` |

Use sparingly. Default web = horizontal.

---

## Safe Utilities (Keep)

These already behave correctly:

- `mx`, `px`, `my`, `py`
- `gap`, `gap-x`, `gap-y`
- `flex`, `grid`, `justify-*`, `items-*`
- `space-x`, `space-y`
- `divide-x`, `divide-y`
- `border-x`, `border-y`

Do NOT rewrite these.

---

## Unsupported Logical Areas

Tailwind does NOT provide logical alternatives here.

### Must use direction variants:

```html
<div class="ltr:bg-left rtl:bg-right"></div>
<div class="ltr:origin-left rtl:origin-right"></div>
<div class="ltr:object-left rtl:object-right"></div>
```

### Affected utilities:

- `bg-left/right`
- `object-left/right`
- `origin-left/right`
- `perspective-origin-*`

---

## Exceptions (Allowed)

Use physical direction ONLY when:

- Canvas / map / chart coordinates
- Media cropping (image focus)
- Animation choreography
- External API constraints
- Intentional non-mirroring design

Must be explicit. No silent fallback.

---

## Migration Strategy

Search & replace:

```
left-
right-
ml- mr-
pl- pr-
border-l border-r
rounded-tl rounded-tr rounded-bl rounded-br
text-left text-right
```

Then:

1. Replace with logical equivalents  
2. Verify UI in RTL  
3. Fix edge cases manually  

---

## Review Algorithm

1. Scan class string  
2. Detect physical direction  
3. Replace with logical  
4. Preserve variants (`md:`, `hover:`…)  
5. Check unsupported cases  
6. Validate in RTL  

---

## Validation Checklist

- Layout mirrors correctly in RTL
- Text aligns correctly
- Spacing flips correctly
- Borders render on correct side
- Absolute positioning correct
- Corners mirrored properly
- Scroll offsets correct

---

## Examples

### Spacing

Before:

```html
<div class="ml-2 mr-auto pl-4 pr-6"></div>
```

After:

```html
<div class="ms-2 me-auto ps-4 pe-6"></div>
```

---

### Badge Position

Before:

```html
<span class="absolute right-2 top-2"></span>
```

After:

```html
<span class="absolute inset-e-2 top-2"></span>
```

---

### Card Border

Before:

```html
<div class="border-l border-l-gray-200 rounded-tl-lg"></div>
```

After:

```html
<div class="border-s border-s-gray-200 rounded-ss-lg"></div>
```

---

### Mixed Direction UI

```html
<div class="ltr:text-left rtl:text-right"></div>
```

Use ONLY when behavior must differ.

---

## Output Contract

When applying this skill:

- No new `left/right` utilities introduced
- All inline direction = logical
- Variants preserved
- Exceptions clearly justified
- Result verified RTL-safe

---

Global-ready UI. No direction bugs. Ship once. Works everywhere.

---
name: information-architecture
description: >
  Design and structure information architecture (IA) for digital products.
  Covers content organization, taxonomy, navigation systems, content models,
  metadata, and findability optimization. Use when user needs to organize
  complex content, improve navigation, or define scalable structure.
metadata:
  author: labdotsa
  category: product
---

# Information Architecture

Design clear structure. Make content findable. Remove confusion.

## When to Use

Trigger when user:
- asks for sitemap / navigation / structure
- has messy or large content
- needs taxonomy / categories / filters
- wants better search or discoverability
- building product, CMS, marketplace, dashboard

## Persistence

ACTIVE for IA-related tasks. Continue structuring until user stops or scope shifts.

---

## Core Behavior

Think in structure first. UI later.

Always:
1. Extract content units
2. Group by meaning
3. Define hierarchy
4. Name clearly
5. Validate simplicity

Pattern:
`[content] → [grouping] → [structure] → [labels] → [validation]`

---

## Workflow

### 1. Understand Context

Extract:
- users
- goals
- primary actions
- content types

Output:
```text
Users:
Goals:
Content:
Constraints:
````

---

### 2. Content Breakdown

Flatten everything.

```text
Content list:
- item 1
- item 2
- item 3
```

No grouping yet.

---

### 3. Grouping (IA Core)

Cluster by:

* task (best)
* intent
* mental model

Avoid:

* internal org structure
* arbitrary grouping

Output:

```text
Group A:
- item 1
- item 2

Group B:
- item 3
```

---

### 4. Hierarchy (Sitemap)

Build tree. Keep shallow.

Rule:

* ≤ 3–4 levels
* balanced branches

Output:

```text
Home
- Category A
  - Sub A1
  - Sub A2
- Category B
```

---

### 5. Labeling

Rules:

* clear > clever
* user language
* consistent patterns

Fix:
❌ "Resources"
✅ "Guides"

---

### 6. Taxonomy

Define system, not just tree.

```yaml
taxonomy:
  - id: category-a
    label: "Category A"
    children:
      - sub-a1
```

Include:

* synonyms
* definitions

---

### 7. Navigation Model

Define movement:

* global nav
* local nav
* contextual links

Output:

```text
Global: Home, Products, Pricing, Help
Local (Products): Categories, Filters
Contextual: Related items
```

---

### 8. Content Model

Structure content types.

```json
{
  "type": "Product",
  "fields": ["name", "price", "category"]
}
```

No UI. Pure structure.

---

### 9. Metadata

Enable search + filtering.

Include:

* tags
* categories
* language
* status

---

### 10. Validation

Check:

* can user find fast?
* labels clear?
* duplicates exist?
* depth reasonable?

---

## Output Formats

Always return structured artifacts:

### Sitemap

```text
Home
- ...
```

### Taxonomy

```yaml
...
```

### Content Model

```json
...
```

---

## Rules

* No deep nesting (>4 levels)
* No duplicate meaning groups
* No vague labels
* No mixing UI with IA
* No internal naming

---

## Anti-Patterns

❌ Org-driven structure
❌ Random categories
❌ "Other" bucket abuse
❌ Overlapping groups
❌ Feature-based grouping only

---

## Examples

### SaaS

```text
Dashboard
- Projects
- Tasks
- Activity
- Settings
```

---

### Marketplace

```text
Home
- Categories
  - Electronics
  - Fashion
- Deals
- Account
```

---

## Agent Response Style

Match production skill tone:

* Direct
* Structured
* No fluff
* Output-first
* Minimal explanation

---

## Prompt Template

```
Design IA for:
[product]

Users:
[users]

Content:
[content]

Output:
sitemap + taxonomy + structure
```

---

## Notes

IA = structure layer.
UI = separate concern.

Fix structure → UX improves automatically.

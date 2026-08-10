---
name: seo-engine
description: End-to-end SEO execution system. Audits, plans, and optimizes websites across technical SEO, content, performance, structured data, and analytics. Use when diagnosing or improving organic search visibility, indexing, rankings, or SEO infrastructure.
metadata:
  author: labdotsa
  category: growth
---

# SEO Engine

Systematic SEO. No guess. No fluff. Only signal.

---

## Persistence

ACTIVE every SEO-related request. No drift into generic advice.  
Disable only with: "stop seo" / "disable seo-engine".

---

## Core Principles

- Search engines reward **accessibility + relevance + trust**
- No manipulation. No shortcuts. No guarantees.
- Optimize for **users first**, engines second
- Every recommendation must be:
  - measurable
  - testable
  - reversible

---

## When to Use

Trigger when user asks:

- "why not ranking / indexed"
- "seo audit"
- "improve traffic / SEO"
- "keyword strategy"
- "core web vitals"
- "schema / structured data"
- "local seo / hreflang"
- "search console / analytics"

---

## Inputs

### Required

- `domain`: target site
- `goal`: business outcome (traffic, leads, revenue)
- `markets`: regions/languages

### Optional

- `site_type`: saas / ecommerce / content / local
- `stack`: CMS or framework
- `access`: search console / analytics / logs
- `known_issues`: drops, migrations
- `constraints`: legal / brand / infra

---

## Outputs

### Always

1. **SEO_AUDIT.md**
   - findings grouped by system
   - root cause (not symptoms)
   - impact

2. **SEO_BACKLOG**
   - issue → fix → priority → effort
   - ticket-ready

3. **MEASUREMENT_PLAN**
   - KPIs
   - baselines
   - tracking sources

---

## Workflow

### 1. Discovery

- map templates (home, category, detail)
- identify canonical domain
- detect market structure (single / multi-region)

---

### 2. Technical SEO

Focus order:

1. Crawl
   - robots.txt misuse
   - blocked critical assets

2. Index
   - noindex / canonical conflicts
   - duplicate URLs

3. Status
   - soft 404s
   - redirect chains

4. Structure
   - internal links crawlable
   - depth ≤ 3 clicks

5. Rendering
   - JS content visible without interaction

---

### 3. Content

- one page = one intent
- titles → clear + aligned
- headings → structured hierarchy
- remove thin / duplicate content
- ensure human-first value

---

### 4. Keywords

- cluster by intent:
  - informational
  - commercial
  - transactional
- map clusters → pages
- identify:
  - gaps (missing pages)
  - cannibalization

---

### 5. Links

Allowed:

- editorial
- partnerships
- PR

Reject:

- paid links for ranking
- automation
- link exchanges

---

### 6. Structured Data

- JSON-LD preferred
- must match visible content
- validate before deploy

---

### 7. Performance

Track:

- LCP
- INP
- CLS

Fix:

- reduce render-blocking
- optimize images
- stabilize layout

---

### 8. International

- use hreflang correctly
- self + reciprocal linking
- align with canonical

---

### 9. Local

- consistent NAP
- location pages unique
- optimize listings

---

### 10. Measurement

Track:

- impressions
- clicks
- CTR
- rankings
- conversions
- CWV

---

## Prompts

### Audit

"Analyze {{domain}} SEO. Return:
- technical issues
- content gaps
- performance issues
- prioritized fixes"

---

### Content Brief

"Create SEO brief:
- topic: {{topic}}
- intent: {{intent}}
Include headings, keywords, meta, links"

---

### Performance Fix

"Given CWV issues:
- propose fixes
- expected impact
- validation plan"

---

## Rules

- No ranking guarantees
- No black-hat tactics
- No misleading schema
- No fake metrics

---

## Safety

If user requests manipulation:

Reject → explain risk → propose alternative

---

## Permissions

Default: read-only

Require approval for:

- code changes
- content edits
- redirects
- API usage

---

## Dependencies

Minimum:

- public site access

Recommended:

- Search Console
- Analytics
- Lighthouse

---

## Versioning

- MAJOR → breaking workflow
- MINOR → new capabilities
- PATCH → fixes

---

## Changelog

### 1.0.0

- Full SEO system
- Technical + content + performance + analytics

# Evidence and source discipline

## Evidence classes

- **Standard or regulator** — normative requirements or regulator guidance. Preserve jurisdiction and scope.
- **First-party guidance** — official browser, platform, search-engine, government design-system, or company documentation.
- **Original research** — findings published by the organization that conducted the research. Check population, method, and external validity.
- **Observed** — directly visible or reproducible on a dated live page or product.
- **Inference** — a reusable recommendation synthesized from evidence or observation; not a proven effect.

Attach the nearest citation to consequential claims. Prefer current primary sources. Record access dates for mutable guidance and live examples. Do not convert eligibility guidance, conformance criteria, or observations into ranking or conversion promises.

## Primary source map

Consult the current official source relevant to the claim:

| Topic | Preferred source families | Important limit |
|---|---|---|
| Accessibility and semantics | W3C WCAG 2.2, WAI tutorials, WHATWG HTML | Conformance does not prove usability; explanatory pages may be non-normative |
| Content and forms | GOV.UK content/design guidance, USWDS, W3C WAI forms | Adapt government patterns to local risk and audience |
| Search and structured data | Google Search Central and other target-engine documentation | Eligibility is not ranking or display; Google is not every agent |
| Performance | web.dev Web Vitals and browser documentation | Thresholds evolve; field context and device segments matter |
| HTTP and error handling | IETF HTTP semantics, target search-engine error guidance | A visually useful page still needs an honest status |
| Claims, endorsements, disclosures, dark patterns | Applicable consumer regulator, such as the US FTC | Jurisdiction, audience, and sector differ |
| Privacy and consent | Applicable regulator and law; European Commission, UK ICO, relevant US authorities | Perform jurisdiction and data-flow analysis; a banner label proves nothing |
| Security | OWASP guidance, NIST SSDF, browser/platform documentation | Scanners and headers are components of a maintained program |
| Experimentation | Original experimentation-platform research with explicit methods | Sound randomization does not validate a weak outcome or unethical intervention |
| Internationalization | W3C Internationalization | Language, direction, locale, and market availability are distinct |

## Claim ledger

For each material express or implied claim, record:

```yaml
wording: exact visible claim
meaning: likely audience interpretation
evidence: source and relevant excerpt or result
scope: population, product, plan, market, period, and conditions
qualification: disclosure needed in the natural reading path
owner: accountable role
approval: status and approver where required
placements: canonical page, variants, ads, metadata, schema, and translations
review: date and event triggers
```

Remove or qualify a claim when evidence is unavailable, outdated, irrelevant to the implied population, or contradicted by product behavior.

## Research limits

- Regulatory guidance is jurisdiction- and sector-specific; do not present this skill as legal advice.
- Search-engine documentation describes mechanisms and eligibility, not guaranteed visibility.
- WCAG supplies testable criteria, not a persuasion or complete usability recipe.
- Ecommerce research transfers most safely to comparable ecommerce contexts.
- Live sites vary by time, market, device, account, personalization, and experiment.
- Public observation cannot establish that a design caused superior business outcomes.


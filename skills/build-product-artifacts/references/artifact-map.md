# Artifact Map

## Purpose

Use this map to choose the smallest coherent artifact set. Folder numbers communicate dependency order, not mandatory
universal taxonomy. Adapt names to the product while preserving concern ownership.

## Default layers

| Layer | Purpose | Typical artifacts | Depends on |
| --- | --- | --- | --- |
| Product foundation | Define product outcome and boundaries | vision and phases, principles, glossary | Brief |
| Domain | Define business concepts and rules | actors, permissions, taxonomy, domain model, lifecycle states | Foundation |
| Journeys | Describe actor and transaction behavior | customer/provider/admin journeys, workflows, failure paths | Domain |
| Platform capabilities | Extract shared responsibilities | auth, payments, notifications, files, moderation, configuration, disputes | Journeys |
| Requirements | State testable capabilities and qualities | functional and non-functional requirements | Domain, journeys, platform |
| Delivery | Bound implementation phases | MVP, later phases, dependencies, exit criteria | Requirements |
| Decisions | Preserve uncertainty and choices | assumptions, open questions, decision log | All layers |
| Experience | Map behavior to user-facing structure | IA, screen inventory/specs, navigation, routes | Journeys, requirements |
| Architecture | Define implementation boundaries | system context, apps/packages, frontend, backend, API, data, deployment | Product and experience |
| Integrations | Define vendor and external-system boundaries | catalog plus one artifact per major integration | Platform, architecture |
| Brand/design handoff | Translate approved visual direction | tokens, components, responsive/RTL/accessibility rules | Experience, frontend |

## Suggested filesystem

```text
artifacts/
├── README.md
├── 00-product/
├── 01-domain/
├── 02-journeys/
├── 03-platform/
├── 04-requirements/
├── 05-delivery/
├── 06-decisions/
├── 07-experience/
├── 08-architecture/
├── 09-integrations/
└── 10-branding/
```

Split journey folders by business model or phase when their transaction models differ materially. Do not create empty
future-phase folders just to make the tree symmetrical.

## Minimum viable artifact system

For an early product, begin with:

1. Vision and phases
2. Glossary
3. Actors and permissions
4. Domain model or taxonomy
5. Primary journeys
6. Functional requirements
7. MVP scope
8. Assumptions, open questions, and decision log
9. Artifact index

Add screens, routes, architecture, integrations, and branding when the user asks or the product has enough accepted
behavior to support them.

## Atomization tests

Split a file when:

- different owners approve different sections;
- one section changes much more frequently than the rest;
- the file mixes source definitions with several derived views;
- a reusable capability is buried inside one actor's journey;
- a future phase has a different transaction or monetization model.

Keep a file cohesive when splitting would force readers to open several documents to understand one small rule.

## Index contract

The root artifact index should state:

- product shape and phases;
- the artifact map grouped by concern;
- document classifications and ID conventions;
- which artifacts are authoritative versus exploratory or proposed.

# Product opportunity skill set

Recognized methods compose into one evidence-gated product-opportunity evaluation. Method skills retain their own reasoning shape; `evaluate-product-opportunity` controls routing, contracts, dependencies, refresh, and verdict.

## Packages

| Package | Skills | Workflow output |
| --- | --- | --- |
| Foundation | `iso-56007-opportunity-validation`, `market-research-design`, `evidence-triangulation` | Evaluation Charter and Evidence Ledger |
| Market research | `market-sizing`, `market-segmentation`, `pestle-analysis`, `porters-five-forces`, `competitive-analysis` | Market Opportunity Dossier |
| Product discovery | `jobs-to-be-done`, `customer-discovery`, `assumption-mapping`, `pretotyping`, `opportunity-solution-tree` | Customer Discovery Dossier and tested opportunity tree |
| Business design | `value-proposition-canvas`, `business-model-canvas`, `pricing-research`, `market-entry-strategy` | Business Model and Entry Options |
| Feasibility | `unido-feasibility-study`, `unit-economics`, `financial-modeling`, `iso-31000-risk-assessment` | Integrated Feasibility Case |
| Decision | `five-case-model` | Product Investment Case and conditional verdict |
| Orchestration | `evaluate-product-opportunity` | Complete, dependency-aware assessment |

## Gate flow

```text
ISO 56007 opportunity validation
→ G1 credible evidence process (activate research design / triangulation only when needed)
→ G2 reachable market (select applicable market methods)
→ G3 customer and buyer evidence
→ G4 tested value and business-model options
→ G5 integrated feasibility when the commitment requires it
→ G6 economics and cash evidence required by the decision
→ G7 residual-risk acceptance when exposure is material
→ G8 stage-proportionate Five Case decision when an investment case is due
```

The recipe records why each method is mandatory, conditional, or omitted. It does not run every method by default. Changed upstream evidence or definitions reopen affected gates and mark dependent artifacts stale.

## Naming rule

Use recognized method name first, recognized artifact/activity second. Keep orchestration names separate from analytical method names.

## Interoperation boundary

Each skill owns the shape and completion rules of its native artifact. The evaluation skill does not impose a common internal template on interviews, trees, canvases, models, experiments, risk records, or investment cases.

When a native artifact enters the evaluation, add the sidecar defined by the [handoff and claim contract](../skills/evaluate-product-opportunity/references/artifact-contract.md). The wrapper records scope, lineage, status, dependencies, and gate consequence while leaving the artifact intact. Routing and predecessor requirements live in the [method map](../skills/evaluate-product-opportunity/references/method-map.md); gate policy lives in [decision gates](../skills/evaluate-product-opportunity/references/decision-gates.md).

## Verdicts

```text
Proceed
Proceed conditionally
Rework / Pivot
Stop
Not decision-ready
```

No average score may override fatal customer, legal, safety, technical, or economic failure.

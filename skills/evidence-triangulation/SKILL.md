---
name: evidence-triangulation
description: Builds claim-level evidence ledgers, source lineages, contradiction registers, and confidence findings. Use when claim provenance, contradiction, or confidence across heterogeneous sources is itself decision-blocking.
metadata:
  author: labdotsa
  category: product
---

# Evidence Triangulation

Triangulate claims, not documents. Two sources can agree because they copied the same origin, measured different populations, or repeated the same bias.

## Intake: turn material into claim candidates

Split every compound statement until each claim has one subject, predicate, scope, period, and measurement meaning.

Use classifications consistently:

~~~text
fact | estimate | observation | inference | hypothesis | assumption | forecast | decision
~~~

Create one ledger row per atomic claim:

| ID | Atomic statement | Class | Scope/definition | Confidence | Contradiction state | Used by |
| --- | --- | --- | --- | --- | --- | --- |

If the statement cannot be made atomic without losing meaning, store its component claims and a separate synthesis claim that declares the reasoning joining them.

**Checkpoint:** every material sentence in the intended decision output maps to one or more claim IDs.

## Build source dossiers before comparing claims

For each source, record:

| Field | Test |
| --- | --- |
| Origin | Who generated the underlying observation or data? |
| Chain | Is this primary, reproduced, syndicated, cited, or transformed? |
| Date | Publication date and measurement period |
| Population | Included and excluded units |
| Definition | What exactly was measured or asked? |
| Method | Sampling, collection, transformation, and analysis |
| Incentive | Who commissioned it and what interest might shape it? |
| Fitness | Which claim can this source support—and which can it not support? |

Draw lineage as **origin → transformation → publication → current citation**. Sources sharing an origin count as one lineage for independence.

Join claims to sources without duplicating either record. Create one row for every evaluated `(claim_id, source_id)` pair:

| Claim ID | Source ID | Directness | Comparability | Method fit | Support state | Independent lineage | Limitation |
| --- | --- | --- | --- | --- | --- | --- | --- |

One source may support one claim and contradict another. One claim may have supporting, contradicting, mixed, and silent sources; preserve all of them before deriving confidence.

## Run five claim tests

Process each material claim in this order:

1. **Semantic comparability:** normalize unit, geography, segment, period, currency, price basis, and construct. If definitions differ, preserve separate claims.
2. **Provenance:** trace the observation to its earliest accessible origin. Mark broken or circular citations.
3. **Independence:** identify shared data, authors, funders, recruitment pools, models, and copying.
4. **Method fitness:** test whether the source design can support the claimed inference. An interview can support existence and mechanism; it cannot by itself establish population prevalence.
5. **Corroboration:** look for independent evidence using a different failure mode or measurement method.

Record each result in the claim-source assessment table; never compress multiple sources into one support or method-fit field.

## Work contradictions instead of averaging them

Open a contradiction record when comparable claims disagree or one source challenges the scope, mechanism, or implication of another.

| Field | Required entry |
| --- | --- |
| Competing claims | Claim IDs and exact disagreement |
| Materiality | Decision that could change |
| Candidate causes | definition, scope, timing, method, sample, transformation, bias, real change, error |
| Discriminating check | Evidence that would separate the causes |
| Result | resolved, bounded, unresolved, or invalid comparison |
| Consequence | claim revised, range widened, confidence lowered, decision blocked |

Investigate in this sequence:

~~~text
same question?
→ same unit and boundary?
→ same time?
→ independent origin?
→ compatible method?
→ real-world change?
→ source or transformation error?
~~~

An unresolved material contradiction remains visible in the final decision. Use a midpoint only when the estimand and combination rule justify pooling.

## Grade confidence at claim level

Assess these dimensions separately:

| Dimension | Strong evidence | Weak evidence |
| --- | --- | --- |
| Directness | Measures the claim itself | Uses a distant proxy |
| Method fitness | Design supports the inference | Inference exceeds design |
| Independence | Distinct origins and failure modes | Shared lineage or recruitment |
| Consistency | Comparable evidence converges | Material contradiction persists |
| Precision | Uncertainty is bounded | Range or error is unknown |
| Recency/fit | Current and in scope | Stale or mismatched |

Issue **high**, **medium**, **low**, or **indeterminate** with a one-sentence rationale. A fatal weakness controls confidence even when other dimensions are strong.

## Produce the evidence system

Deliver:

1. Claim Ledger;
2. Source Dossiers and lineage map;
3. Claim–Source Assessment Table;
4. Contradiction Register;
5. Coverage Matrix mapping decision questions to evidence;
6. confidence findings, blocking gaps, and decisions each item could change.

The system is complete when every material claim has definition and downstream usage, every material claim–source pair has a method-fit, independence, and support judgment, and the aggregated claim has a contradiction state and confidence rationale. New evidence updates claims and invalidates dependent conclusions; it does not silently overwrite history.

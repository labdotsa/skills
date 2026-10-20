# Calibrate semantic decisions

Separate collection, calculation, judgment, and writing. Collection provides dated records. Code computes metrics and applies numeric rules. A judge classifies meaning. The writer produces briefs and explanations from those records.

A judge can be another agent, a human, or an available classification model. Jev is one possible provider, not a dependency. Verify its current API, price, data policy, and output contract before authorized use. Do not copy a model name, price, benchmark, or threshold from a social post into configuration.

## Define one decision

Specify the unit, allowed answers, rubric, and action associated with each answer. Give a judge only the evidence needed for that decision.

Examples include buyer relevance per query, page type per result, same intent per page pair, contextual fit per link passage, and evidence support per draft claim. A title and introduction support preliminary triage. They cannot prove full-page usefulness or factual completeness.

Use a boolean, an enumerated choice with `other` or `unknown`, or a score with defined levels. Keep question wording unambiguous and polarity explicit. Preserve row IDs, source IDs, rubric version, model version, answer, uncertainty, and review status. Validate responses against the allowed schema. An invalid response becomes `needs_review`.

## Establish a useful review band

Build a human-labeled set for the actual decision and site. Include clear positives, clear negatives, ambiguous cases, important low-volume pages, and cases whose wrong answer is costly. Fifty rows can be an initial diagnostic sample, not proof of accuracy at scale.

Use one subset to revise the rubric and a separate held-out subset to check it. Inspect false positives, false negatives, class balance, disagreement reasons, and rare but costly cases. A judge that accepts everything can appear accurate on a mostly positive set.

Select acceptance and review bands from observed error costs. A returned probability or confidence is a model output until calibration supports its interpretation. A universal `0.9` threshold and agreement with another model do not establish a 90% chance of correctness.

When labels or an independent judge are unavailable, keep semantic classifications provisional. Use manual review for consequential recommendations. Continue deterministic checks without a model.

## Process the declared inventory

Apply the approved rubric to every row within the declared cap. Cache unchanged judgments by input digest and rubric/model version. Count analyzed, failed, uncertain, and unprocessed rows. Preserve failures and resume from stable IDs.

For page-pair checks, use deterministic candidate generation to bound quadratic growth. Record excluded pairs and the recall limitation. Do not describe filtered pairs or a capped crawl as a complete site audit.

Protect deterministic facts from model overrides. Dates, sums, status codes, missing values, and input coverage remain code-derived. A judge may flag a conflict, but cannot turn missing conversions into zero or authorize a deletion.

## Verify the written result

Check draft claims against their actual sources. An originality verdict requires inspected evidence, not the writer's assurance. Use an independent reviewer when practical and report its limits. Recheck high-impact decisions after model or rubric changes.

A passing semantic review approves a recommendation for the next authorized step. It does not publish content, send outreach, merge pages, or prove search performance. Verify the live URL, directives, intended sitemap membership, links, analytics, and requested locale after an authorized release.

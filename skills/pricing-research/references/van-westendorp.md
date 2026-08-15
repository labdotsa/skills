# Van Westendorp execution reference

Use this reference with [`scripts/van-westendorp.mjs`](../scripts/van-westendorp.mjs) when respondent-level Price Sensitivity Meter data must be analyzed reproducibly.

## What the method answers

Van Westendorp measures perceived price acceptance in a defined, familiar category. It does not estimate actual purchase, demand, elasticity, or revenue. Use Gabor-Granger, a randomized monadic test, a real offer, or transaction data when the decision requires behavioral calibration.

## Required respondent fields

Each respondent must provide four numeric prices in the same currency, tax basis, unit, and contract context:

| Field | Question meaning |
| --- | --- |
| `tooCheap` | At what price is the offer so cheap that quality becomes doubtful? |
| `cheap` | At what price is the offer a bargain or good value? |
| `expensive` | At what price is the offer expensive but still worth considering? |
| `tooExpensive` | At what price is the offer too expensive to consider? |

The machine-readable response contract is [`van-westendorp-response.schema.json`](van-westendorp-response.schema.json). The analyzer accepts JSON arrays or CSV/TSV files. CSV and TSV headers must use the exact field names above. JSON may be an array of rows or an object with a `rows` array.

Example CSV:

~~~csv
tooCheap,cheap,expensive,tooExpensive
1,2,4,5
2,3,5,6
3,4,6,7
~~~

## Response validation

The default validation rule requires:

~~~text
0 <= tooCheap < cheap < expensive < tooExpensive
~~~

Rows with missing, non-numeric, negative, or intransitive values are excluded and counted in `sample.excluded` and `diagnostics.exclusions`. The result must disclose the excluded count and the valid-response order.

## Curve construction

For each unique observed price `p`, the analyzer returns proportions in the range 0–1:

~~~text
tooCheap     = proportion(tooCheap >= p)
cheap        = proportion(cheap >= p)
expensive    = proportion(expensive <= p)
tooExpensive = proportion(tooExpensive <= p)
notCheap     = 1 - cheap
notExpensive = 1 - expensive
~~~

Intersections use deterministic piecewise-linear interpolation between sorted observed price thresholds. An exact equality at an observed threshold wins. If two curves do not cross, the analyzer returns the closest observed point with a non-zero `gap`; do not present that as a clean intersection.

## Price points and range definitions

The output includes:

| Output | Intersection | Interpretation |
| --- | --- | --- |
| `pmc` | `tooCheap` × `notCheap` | Original lower acceptable-range boundary |
| `pme` | `tooExpensive` × `notExpensive` | Original upper acceptable-range boundary |
| `idp` | `cheap` × `expensive` | Indifference Price Point |
| `opp` | `tooCheap` × `tooExpensive` | Optimal Price Point in the PSM perception sense |
| `narrowerLower` | `tooCheap` × `expensive` | Narrower-range lower boundary |
| `narrowerUpper` | `cheap` × `tooExpensive` | Narrower-range upper boundary |

The CLI defaults to the original range. Use `--range narrower` only when that convention is declared in the protocol and report:

~~~text
original: [pmc, pme]
narrower: [narrowerLower, narrowerUpper]
~~~

The `opp` label is not a revenue optimum. Any revenue or purchase-probability claim requires a separate behavioral method.

## Uncertainty

The analyzer can estimate percentile bootstrap intervals for all six reported price points:

~~~sh
node scripts/van-westendorp.mjs responses.csv --bootstrap 2000 --seed 42 > psm-result.json
~~~

Without `--bootstrap`, the result explicitly reports `uncertainty.method: "not-estimated"`. Bootstrap intervals describe sampling uncertainty only; they do not repair misunderstanding, selection bias, poor category fit, or invalid offer definitions.

## Output contract

The JSON result contains:

~~~text
method
analyzerVersion
acceptableRange
pricePoints
curves
sample
diagnostics
uncertainty
claimBoundary
limitations
~~~

Use `claimBoundary: perceived-price-acceptance` to prevent the result from being promoted to a demand or revenue claim. Attach the result to the Pricing Evidence Report and preserve the input data, protocol version, range definition, and analyzer version.

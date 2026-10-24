# Observation and annotations

## Evidence limits

Start with rendered evidence. Record source type, capture time, URL or fixture identity, revision or content-manifest identity, viewport in physical pixels, device pixel ratio when known, locale, direction, role, input mode, theme, and state. Hash supplied screenshots when possible. Treat recordings as sequences, not as proof of unobserved states. Mark unavailable dimensions explicitly. Convert browser CSS coordinates to screenshot physical pixels by multiplying by device-pixel ratio, then round only after verifying capture metadata.

Freeze each finding to one task and state. Use a stable screenshot ID and digest. Coordinate bounds must use the stated physical-pixel coordinate system. A semantic locator can supplement a marker, never replace exact evidence. For cross-screen behavior, cite each relevant capture and describe the transition.

## Annotation rules

Call out the smallest element or region that supports the claim. Use a numbered marker, title, and description. Keep highlight bounds inside the source image, use finite coordinates, and preserve the original PNG bytes. The helper keeps the rectangle at the verified bounds and places its numbered badge nearby, clamped inside the source image. It adds a readable legend below the image without changing the image dimensions or coordinate origin. Never draw a highlight from guessed geometry, crop or resize the source, fetch a URL, or add external assets. When exact visual annotation is unavailable, return raw evidence and mark the audit `partial`.

## Finding template

`finding.yaml` defines the portable fields. A good finding follows this order:

1. observed symptom;
2. user consequence for the named task;
3. heuristic or source principle and why it applies;
4. exact element, missing element, or cross-screen sequence;
5. screenshot ID/digest, coordinate system, bounds, and locator;
6. severity and confidence separately;
7. recommendation and observable retest.

Do not turn a hypothesis into a fact. Do not claim a screen violates a heuristic when the relevant state was not observed.

# Offline evaluation

Run the deterministic helper checks from the package root:

```sh
node --test evals/annotate.test.mjs
```

For browser QA, reuse a matching fixture server when available. Otherwise choose an unused loopback port and start a disposable server from the fixture directory. This example serves no external assets:

```sh
cd evals/fixtures
python3 -m http.server 4318 --bind 127.0.0.1
```

Open `http://127.0.0.1:4318/checkout.html` in the built-in browser. Capture the initial disabled state, enter four card digits, and capture the enabled state and submit error. Record CSS viewport, source PNG physical dimensions, and device-pixel ratio. If the capture tool normalizes scale, record that fact and leave the ratio unknown. Create an input JSON with verified physical-pixel bounds, then run:

```sh
node ../../scripts/annotate.mjs input.json annotated.svg
```

Inspect the SVG in the built-in browser. Verify that the source image keeps its original dimensions and that the outer legend is readable. A clean state may produce no findings. If the annotation capability or bounds are unavailable, report `partial` with raw evidence and do not invent a highlight.

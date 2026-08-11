---
status: accepted
---

# Use one source for the portable static Discovery Site

The Discovery Site will have one application source and one component system. GitHub Pages and Netlify may produce environment-specific Publication Artifacts, but those artifacts must be generated from the same SvelteKit source, Source Content, and shared domain logic; no legacy template tree, provider-specific frontend, duplicated catalog model, or hand-edited generated output may act as a second source.

The site remains fully prerenderable so both hosts can ship the complete experience without provider-specific runtime code. All interface surfaces compose locally owned shadcn-svelte primitives, LAB components, Tailwind design tokens, and Lucide icons.

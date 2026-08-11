# Owned shadcn-svelte primitives

These wrappers were acquired one registry item at a time with `shadcn-svelte@1.5.0`, `nova` style, and Tailwind CSS v4 on 2026-08-11. The repository owns their source and hand-merges upstream updates.

Initial reviewed inventory: Button, Input, Tabs, Sheet, Collapsible, Breadcrumb, Separator, Sonner, and Tooltip.

LAB changes replace neutral theme values with the shared semantic token graph, remove `mode-watcher`, use direct bundled Lucide icon imports, and apply the local motion/accessibility contract. Never update these files with `add --overwrite`.

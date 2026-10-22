# Security-audit fixture testing

These fixtures are inert resources for isolated evaluation. Generated targets and oracle files belong outside the skill package.

Build synthetic packages, hostile archives, and a Git dirty-state fixture:

```sh
python3 evals/build_fixtures.py <scratch>/security-audit-generated
```

Run the deterministic HTTP checks only inside the approved disposable container with the generated target copy. The driver never installs dependencies or sends external traffic:

```sh
node evals/runtime_checks.mjs \
  /path/inside/container/authorization-app.mjs baseline
node evals/runtime_checks.mjs \
  /path/inside/container/authorization-app.mjs patched
```

The 20 YAML cases are source-only behavior evaluations. They do not replace runtime verification. The deterministic driver is an additional isolated-container gate: baseline must demonstrate the vulnerable cross-owner `200`, while preserving same-owner access and the secure comparator's `200`, `403`, and `401` behavior. Patched mode must reject all query and alias impersonation variants with `403`, preserve legitimate owner access, and reject missing or malformed tokens with `401`. The driver also checks response owner bodies, emits JSON evidence, and exits nonzero on a failed expectation. It binds only to an ephemeral `127.0.0.1` port and closes the server before exit.

The builder uses only Python's standard library and scoped Git subprocesses. It does not execute generated package hooks, archive contents, or application source.

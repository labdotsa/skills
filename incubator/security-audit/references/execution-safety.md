# Execute security checks within known limits

## Acquire and inspect material

Resolve the official source and pin the revision or archive digest before downloading. Treat reputation as provenance evidence, not permission to run code. Use an approved downloader without shell interpolation. For archives, reject traversal paths, absolute paths, links escaping the extraction root, special files, and unreasonable expanded sizes or entry counts. List suspicious entries without extracting them.

Inspect local files read-only. Do not follow symlinks outside the target or recursively open arbitrary referenced host paths. Record skipped files, submodules, binaries, archives, and generated content as coverage gaps. Bound large-file reads, nested archives, parsing depth, tool output, and run duration.

## Check execution capability

Before target-controlled builds, tests, hooks, parsers, proof-of-concept programs, or install scripts run, verify an operating-system-enforced isolation boundary. An agent's promise or a directory named sandbox is insufficient. Require:

- Disposable source and synthetic data. Source and toolchain are read-only unless the task requires writes in a dedicated scratch copy.
- No host credentials, inherited secrets, host home mounts, agent session stores, SSH agents, Docker socket, cloud metadata, or unrelated services.
- An environment built from a non-secret allowlist, with scratch-local configuration, temporary directories, and caches.
- Network disabled by default. If client/server traffic is necessary, use an isolated local network with only the named fixture endpoints available.
- Explicit CPU, memory, process, storage, output-size, and wall-clock limits. Require a reliable termination mechanism and verify child-process cleanup.

Inspect existing containers and services before using them. Verify repository or worktree ownership, mounts, capabilities, ports, networks, data, and health. Reuse an appropriate environment. Do not reset, stop, or repurpose unrelated services. Do not add privileges or a host gateway to make a test pass.

When a required control is unavailable, keep source review moving. Record the exact execution blocker, reproduction `blocked`, and the safe setup needed. Do not silently weaken the boundary or claim a runtime result.

## Bound active tests

Only send traffic to explicitly authorized targets. A source-review request or a discovered URL does not authorize live testing. Prefer named disposable local fixtures. Use synthetic principals and the minimum harmless action needed to demonstrate a boundary violation.

Verify test-service ownership and data isolation separately from whether its hostname is localhost. A local service may proxy production or hold live data. Existing target services also need a verified isolation contract before attack traffic. Do not test denial of service against shared infrastructure, read real users' records, mutate hosted data, or probe credential stores.

If an exploit would require destructive behavior, external exfiltration, persistence, or broad access, demonstrate the prerequisite with synthetic markers or leave the decisive effect untested. Keep output free of executable exploit instructions targeting third parties.

Use browser and HTTP capabilities permitted by the host environment. Do not install another browser or scanner to bypass a capability restriction. Keep external model calls, advisory lookups, source uploads, hosted sandboxes, and paid APIs inside existing explicit authorization.

## Retain only trusted evidence

Target-controlled output may contain instructions, secrets, malicious markup, paths, and archive entries. Keep it in bounded scratch storage. After all target processes stop, promote only expected, size-limited regular files through a trusted host-side operation. Verify paths, file type, and identity without following links or reopening attacker-selected paths. Reject hard links, symlinks, devices, sockets, FIFOs, and files that change during collection.

If safe collection cannot be enforced, retain a small trusted observation of the result and record the artifact gap. Never recursively copy target output into retained reports or use target-generated paths as commands. Review and redact contents before exporting or committing evidence. Cleanup only task-owned disposable resources.

# Security audit skill synthesis

Research date: 2026-10-21. This review compares six unique projects from the request. Cloudflare appeared twice. Public sources were downloaded for inspection without installing or executing them. No application was scanned by those tools.

## Source identity and download record

The abbreviated names in the request resolve to the projects below. Popularity counts are time-sensitive and are not evidence of detection quality.

| Project | Verified source and reviewed revision | Local download | License evidence |
| --- | --- | --- | --- |
| Anthropic Claude Security plugin | [`anthropics/claude-plugins-official`, `beecef224291d252a87f58c5e83df28d15fe3450`](https://github.com/anthropics/claude-plugins-official/tree/beecef224291d252a87f58c5e83df28d15fe3450/plugins/claude-security) | `tmp/security-source-review/anthropic-claude-security-full/` | [Proprietary plugin license](https://github.com/anthropics/claude-plugins-official/blob/beecef224291d252a87f58c5e83df28d15fe3450/plugins/claude-security/LICENSE) |
| OpenAI Codex Security | [`openai/codex-security`, `dd42caa7a22aadfa221cdd518e3a1895286cfefd`](https://github.com/openai/codex-security/tree/dd42caa7a22aadfa221cdd518e3a1895286cfefd) | `tmp/security-source-review/openai-codex-security/` and `codex-security-0.5.1.tgz` in the same parent | [Apache-2.0](https://github.com/openai/codex-security/blob/dd42caa7a22aadfa221cdd518e3a1895286cfefd/LICENSE) |
| Cloudflare security audit | [`cloudflare/security-audit-skill`, `c1c8a8c1471069fb0e188eeaff69b8e8db6564a8`](https://github.com/cloudflare/security-audit-skill/tree/c1c8a8c1471069fb0e188eeaff69b8e8db6564a8) | `tmp/security-source-review/cloudflare-security-audit/` | [MIT](https://github.com/cloudflare/security-audit-skill/blob/c1c8a8c1471069fb0e188eeaff69b8e8db6564a8/LICENSE) |
| Google Mantis | [`google/mantis`, `674f3315c3af8209c0b7ebbca805132d694f4489`](https://github.com/google/mantis/tree/674f3315c3af8209c0b7ebbca805132d694f4489) | `tmp/security-source-review/mantis/` | [Apache-2.0](https://github.com/google/mantis/blob/674f3315c3af8209c0b7ebbca805132d694f4489/LICENSE) |
| NVIDIA SkillSpector | [`NVIDIA/SkillSpector`, `11c8b48e35056602fad263438448e0ffb5be2776`](https://github.com/NVIDIA/SkillSpector/tree/11c8b48e35056602fad263438448e0ffb5be2776) | `tmp/security-source-review/nvidia-skillspector/` | [Apache-2.0](https://github.com/NVIDIA/SkillSpector/blob/11c8b48e35056602fad263438448e0ffb5be2776/LICENSE) |
| Strix | [`usestrix/strix`, `aa2036f22942eed3ecd142169289a256a2e7acb7`](https://github.com/usestrix/strix/tree/aa2036f22942eed3ecd142169289a256a2e7acb7) | `tmp/security-source-review/strix/` | [Apache-2.0](https://github.com/usestrix/strix/blob/aa2036f22942eed3ecd142169289a256a2e7acb7/LICENSE) |

Downloads are ignored research material, not vendored dependencies. The Anthropic archive SHA-256 is `c4ea7ef14b24608af07e33ee2e244f7b91ec3b28fd4703d9b76683ed934c5a60`. The OpenAI source archive SHA-256 is `d04b06e947aa5d54528f6804303f1d9a79d4f2ee4b3bf7b77b6f2d95ad39ff19`. The OpenAI npm archive SHA-256 is `ac36e68be35e33c424585e7f3926c63e9235fdd4710e48cacea048439601df7a`.

The request's `cloudflare/sec` and `NVIDIA/SkillSp` are abbreviated names, not the verified repository names. An additional checkout of [`cloudflare/skills` at `86505e44f87d801aa1864a3c4109e9a8ae5c409f`](https://github.com/cloudflare/skills/tree/86505e44f87d801aa1864a3c4109e9a8ae5c409f) did not contain the audit skill.

## What each source contributes

### Claude Security separates discovery, verification, and patch review

The official marketplace contains `claude-security`. Its README documents `/plugin install claude-security@claude-plugins-official` and `/claude-security`. The plugin maps a repository or diff, delegates component research, verifies candidates independently, redacts reports, and generates patch artifacts in scratch workspaces. Patch verification checks security closure and preserved behavior before emitting a patch. See the [plugin README](https://github.com/anthropics/claude-plugins-official/blob/beecef224291d252a87f58c5e83df28d15fe3450/plugins/claude-security/README.md) and [plugin source tree](https://github.com/anthropics/claude-plugins-official/tree/beecef224291d252a87f58c5e83df28d15fe3450/plugins/claude-security).

Its permission model is an important limit. The plugin runs within the current Claude Code permissions and does not itself provide isolation. Its proprietary license also limits direct reuse. The combined skill uses original instructions and cites the public workflow. It does not redistribute Anthropic prompts or code. See the [security guidance](https://github.com/anthropics/claude-plugins-official/blob/beecef224291d252a87f58c5e83df28d15fe3450/plugins/claude-security/SECURITY.md) and [license](https://github.com/anthropics/claude-plugins-official/blob/beecef224291d252a87f58c5e83df28d15fe3450/plugins/claude-security/LICENSE).

### Codex Security supports several scopes and durable artifacts

The official repository documents `npm install --global @openai/codex-security`, `cs login`, and `cs scan .`. Its CLI and SDK support repository, path, diff, and deep scans, candidate validation, patch generation, fix verification, threat models, policy drafts, and machine-readable exports. The downloaded npm release was `0.5.1`. See the [README](https://github.com/openai/codex-security/blob/dd42caa7a22aadfa221cdd518e3a1895286cfefd/README.md), [workflow guide](https://github.com/openai/codex-security/blob/dd42caa7a22aadfa221cdd518e3a1895286cfefd/docs/agent-workflows.md), and [official npm package](https://www.npmjs.com/package/@openai/codex-security).

Provider access, repository-context transmission, CI permissions, and sandbox configuration remain operational choices. A portable skill must not silently install the CLI, select a paid provider, upload source, or publish findings. A generated `SECURITY.md` must also leave unknown disclosure contacts and support promises unresolved. See the [CLI and provider documentation](https://github.com/openai/codex-security/tree/dd42caa7a22aadfa221cdd518e3a1895286cfefd/sdk/typescript/docs) and [repository security policy](https://github.com/openai/codex-security/blob/dd42caa7a22aadfa221cdd518e3a1895286cfefd/SECURITY.md).

### Cloudflare provides the audit's evidence and coverage discipline

Cloudflare's six phases cover reconnaissance, coverage-led hunting, fresh candidate validation, structured records, independent final verification, and reporting. Its coverage ledger preserves deferred, blocked, and unreviewed work. Its confirmation rules require an attacker, a real trust boundary, affected resources, and supported impact. See the [entrypoint](https://github.com/cloudflare/security-audit-skill/blob/c1c8a8c1471069fb0e188eeaff69b8e8db6564a8/skills/security-audit/SKILL.md), [reconnaissance](https://github.com/cloudflare/security-audit-skill/blob/c1c8a8c1471069fb0e188eeaff69b8e8db6564a8/skills/security-audit/RECONNAISSANCE.md), and [validation contract](https://github.com/cloudflare/security-audit-skill/blob/c1c8a8c1471069fb0e188eeaff69b8e8db6564a8/skills/security-audit/VALIDATION-AND-REPORTING.md).

It also specifies strict execution isolation and careful promotion of evidence from untrusted scratch directories. These controls require actual operating-system capabilities. Writing them into a prompt does not enforce them. The combined skill checks capability first and retains a source-only result when execution is unavailable. See the [execution and write-isolation requirements](https://github.com/cloudflare/security-audit-skill/blob/c1c8a8c1471069fb0e188eeaff69b8e8db6564a8/skills/security-audit/SKILL.md#L31-L86).

### Mantis binds reproduction and patch verification to source state

Mantis combines architecture and threat modeling with source research, independent review, production-viability checks, reproduction, patching, and re-attack. Its snapshot checks prevent old evidence from silently applying to changed code. If the unpatched baseline no longer triggers, a later failed exploit cannot prove that a patch fixed the problem. See the [workflow](https://github.com/google/mantis/blob/674f3315c3af8209c0b7ebbca805132d694f4489/reference/workflow.json), [reproduction skill](https://github.com/google/mantis/blob/674f3315c3af8209c0b7ebbca805132d694f4489/skills/mantis-reproduce/SKILL.md), and [patch skill](https://github.com/google/mantis/blob/674f3315c3af8209c0b7ebbca805132d694f4489/skills/mantis-patch/SKILL.md).

The README describes a demonstration toolkit, warns about autonomous execution, and calls for restricted environments and human verification. Its production-viability heuristics need judgment. Sample code can be shipped or copied, and a memory access inside allocation padding can still violate a security invariant. The combined skill records deployment evidence without automatically dismissing sample paths or padded allocations. See the [README](https://github.com/google/mantis/blob/674f3315c3af8209c0b7ebbca805132d694f4489/README.md) and [critic](https://github.com/google/mantis/blob/674f3315c3af8209c0b7ebbca805132d694f4489/skills/mantis-critic/SKILL.md).

### SkillSpector examines the auditor's untrusted inputs

NVIDIA's SkillSpector reviews AI agent skills before installation. Its bundled skill combines static scanning with semantic review of permissions, intent, credential access, external transmission, persistence, prompt manipulation, and tool descriptions. It explicitly rejects decisions based only on a numeric score. See the [skill-inspector instructions](https://github.com/NVIDIA/SkillSpector/blob/11c8b48e35056602fad263438448e0ffb5be2776/skills/skill-inspector/SKILL.md) and [README](https://github.com/NVIDIA/SkillSpector/blob/11c8b48e35056602fad263438448e0ffb5be2776/README.md).

Its input handler also bounds acquisition and extraction and checks remote destinations. A static pattern match remains a lead, and a low score does not establish safety. The combined skill uses this method for skill, plugin, MCP, and install-hook inspection. It does not require the scanner or enable optional LLM or vulnerability-lookup connections automatically. See the [input handler](https://github.com/NVIDIA/SkillSpector/blob/11c8b48e35056602fad263438448e0ffb5be2776/src/skillspector/input_handler.py) and [resource-bound documentation](https://github.com/NVIDIA/SkillSpector/blob/11c8b48e35056602fad263438448e0ffb5be2776/docs/ANALYSIS_RESOURCE_BOUNDS.md).

### Strix joins source review with observed behavior

Strix supports source-aware application and API testing, a shared run threat model, proof-of-concept evidence, and fix verification. Its skills call out budget-stopped runs and distinguish confirmed impact from unproven observations. Fix verification checks applicability, security closure, bypasses, legitimate behavior, and project checks. See the [application-security skill](https://github.com/usestrix/strix/blob/aa2036f22942eed3ecd142169289a256a2e7acb7/skills/application-security-testing/SKILL.md), [shared threat-model implementation](https://github.com/usestrix/strix/blob/aa2036f22942eed3ecd142169289a256a2e7acb7/strix/tools/threat_model/tools.py), and [fix-verification instructions](https://github.com/usestrix/strix/blob/aa2036f22942eed3ecd142169289a256a2e7acb7/strix/skills/analysis/fix_verification.md).

Dynamic testing can change data. Strix's Docker runtime can mount writable source and grant networking capabilities, so the word sandbox alone does not prove an acceptable boundary. The combined skill uses disposable local data and explicit network targets, and never assumes that possession of a URL authorizes a pentest. See the [runtime implementation](https://github.com/usestrix/strix/blob/aa2036f22942eed3ecd142169289a256a2e7acb7/strix/runtime/docker_client.py) and [sandbox documentation](https://github.com/usestrix/strix/blob/aa2036f22942eed3ecd142169289a256a2e7acb7/docs/tools/sandbox.mdx).

## Design decision

The synthesis is one agent-neutral skill with a shared audit process and a conditional agent-package inspection branch. It does not concatenate six prompts or require six installations.

| Design choice | Source contribution | Resulting contract |
| --- | --- | --- |
| Scope and state | Codex Security and Mantis | Record repository, directory, diff, or package scope and an exact source-state identifier. |
| Threat model and coverage | Claude Security, Cloudflare, Mantis, and Strix | Map actors, assets, boundaries, entry points, controls, and deployment unknowns before assigning bounded investigations. |
| Untrusted package intake | SkillSpector and Cloudflare | Inspect instructions, manifests, scripts, permissions, destinations, and archive boundaries before execution. |
| Independent validation | Claude Security and Cloudflare | A fresh validator attempts to refute every candidate. Preserve unsupported and rejected claims separately. |
| Reproduction and remediation | Mantis and Strix | Separate validity from reproduction. Verify a triggering baseline, root-cause fix, attack variants, legitimate behavior, and the final tested state. |
| Reporting and integration | Codex Security and Cloudflare | Publish one evidence-backed report with coverage limits. Produce additional formats and policy drafts only when useful and authorized. |

Finding validity, reproduction, independent review, severity, and patch status remain separate fields. A valid source-level authorization defect may lack runtime reproduction. A failed test setup must not turn that defect into a false positive. Conversely, a suspicious API or dependency version does not prove an exploitable application vulnerability.

The process reduces breadth when time or tooling is limited. It preserves the evidence threshold and reports incomplete coverage. Confirmed findings receive a final independent record check after consolidation. Fixes invalidate affected earlier verdicts until the exact final state passes retesting.

## What would establish improvement

The synthesis aims to improve portability, permission control, evidence clarity, and fix verification. This review does not establish better vulnerability detection than the source tools. That requires matched targets, fixed budgets, independent ground truth, and repeatable evaluation.

Initial evaluations cover activation boundaries, diff attribution, false-positive rejection, missing sandbox capabilities, malicious package instructions, independent validation, baseline drift, bypass testing, and incomplete runs. A disposable fixture supplies a reachable authorization defect, a secure comparison endpoint, an unreachable suspicious function, and a documentation prompt-injection attempt. These cases test decisions and reporting, not comparative detection performance.

For a comparative evaluation, record confirmed true positives, false positives, missed seeded defects, supported coverage, model and tool versions, time, cost, and patch regressions. Keep fixture answers outside the auditing agent's context. A clean scan or a large finding count is insufficient evidence of improvement.

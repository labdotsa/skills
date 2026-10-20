# Source methods and limits

These original instructions synthesize public workflow ideas inspected on 2026-10-21. No upstream code or prompts are bundled. The skill does not inherit the source projects' scanners, model access, sandbox runtimes, or detection results.

| Source | Reviewed evidence | Method used here |
| --- | --- | --- |
| Anthropic Claude Security | [Plugin at `beecef224291d252a87f58c5e83df28d15fe3450`](https://github.com/anthropics/claude-plugins-official/tree/beecef224291d252a87f58c5e83df28d15fe3450/plugins/claude-security) | Component research, adversarial verification, scratch patch proposals, and report review. The plugin has proprietary license terms. |
| OpenAI Codex Security | [README at `dd42caa7a22aadfa221cdd518e3a1895286cfefd`](https://github.com/openai/codex-security/blob/dd42caa7a22aadfa221cdd518e3a1895286cfefd/README.md) | Repository, path, and diff scope, durable evidence, policy drafts, and fix verification. |
| Cloudflare security audit | [Skill at `c1c8a8c1471069fb0e188eeaff69b8e8db6564a8`](https://github.com/cloudflare/security-audit-skill/blob/c1c8a8c1471069fb0e188eeaff69b8e8db6564a8/skills/security-audit/SKILL.md) | Coverage accounting, independent validation, explicit evidence states, execution limits, and final record review. |
| Google Mantis | [Skills at `674f3315c3af8209c0b7ebbca805132d694f4489`](https://github.com/google/mantis/tree/674f3315c3af8209c0b7ebbca805132d694f4489/skills) | Snapshot provenance, baseline reproduction, production conditions, and independent attacks on fixes. |
| NVIDIA SkillSpector | [Inspector at `11c8b48e35056602fad263438448e0ffb5be2776`](https://github.com/NVIDIA/SkillSpector/blob/11c8b48e35056602fad263438448e0ffb5be2776/skills/skill-inspector/SKILL.md) | Static evidence plus semantic inspection of agent-package purpose, permissions, and hidden effects. |
| Strix | [Skills at `aa2036f22942eed3ecd142169289a256a2e7acb7`](https://github.com/usestrix/strix/tree/aa2036f22942eed3ecd142169289a256a2e7acb7/skills) | Source-informed dynamic proof, a shared threat model, explicit incomplete runs, and legitimate-behavior checks after repairs. |

Broader instructions do not establish better detection than any source tool. Evaluate the combined workflow against independent ground truth, fixed budgets, reproducible targets, and false-positive and regression outcomes. Use [evals/cases.yaml](../evals/cases.yaml) to select behavioral cases.

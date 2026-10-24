# Component contract

Define components by responsibility and observable behavior. A contract should be implementable in the repository's existing stack without importing domain data into reusable primitives.

For each component, specify:

- purpose and semantic element or role;
- owner of data, transient state, and controlled state;
- composition and content boundaries;
- variants and when each is appropriate;
- rest, hover, focus-visible, pressed/selected, disabled, loading, empty, success, warning, and error states that apply;
- labels, names, descriptions, announcements, focus order, keyboard behavior, touch/alternate input behavior, and reduced-motion behavior;
- content pressure: long strings, localization, direction, zoom, dynamic type, and overflow;
- responsive composition and platform adapter decisions;
- evidence, assumptions, and unresolved questions.

Prefer native semantics and existing primitives. Keep domain workflows above the component boundary. A visual similarity does not justify a generic component when ownership, state, or meaning differ. Conversely, accessibility-sensitive behavior deserves an owner on first use; do not wait for duplication before giving it a stable contract.

Treat variants as orthogonal only when they change independent concerns with a stable combination contract, such as `tone` plus `size`. Use one explicit mode when choices are mutually exclusive. Avoid boolean combinations and variant explosion: if combinations create conflicting layout, state, or ownership rules, split the component or introduce a domain-specific component with a named contract. A domain-specific component is appropriate when it owns product vocabulary, workflow state, policy, or analytics; keep generic behavior in the reusable primitive and compose upward.

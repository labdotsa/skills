# Platform adaptation

Begin with a shared intent and then choose the expression that fits the target. HIG is mandatory in both steps: its principles apply universally, while its control prescriptions must be translated.

| Concern | Shared question | Adapter examples to investigate |
| --- | --- | --- |
| Navigation | Can the person understand where they are and where they can go? | Web links and landmarks; iOS/iPadOS bars and back behavior; Android navigation; desktop menus and shortcuts; TV focus paths; voice turns. |
| Input and focus | Can the primary task be reached, operated, cancelled, and recovered? | Pointer/keyboard and visible focus; touch and safe targets; remote focus; voice confirmation and interruption; switch or assistive input. |
| Layout and system UI | Does content remain legible and usable under real system constraints? | Reflow and zoom; safe areas and orientation; dynamic type; window resize and scaling; distance and posture; platform chrome. |
| Feedback and motion | Is state change causal, perceivable, interruptible, and useful? | Web status regions; native continuity; reduced motion; loading and offline states; haptics or sound only when appropriate. |

For each target, record:

1. the transferable principle and user outcome;
2. the platform convention consulted;
3. the chosen control, layout, or state expression;
4. any deliberate departure and its reason;
5. the verification path and unsupported conditions.

Do not treat an Apple-specific control, gesture, typography rule, or system chrome pattern as a universal component. Do not treat a web pattern as a safe substitute for native behavior without checking the target platform's current guidance.

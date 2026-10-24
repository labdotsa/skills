# User-experience resource scout

Date: 2026-08-27

Scope: books, standards, platform guidance, research methods, and implementation references for improving user experience across public websites, responsive web apps, native mobile apps, desktop software, voice interfaces, TV, wearables, kiosks, games, and spatial/XR products.

Repository adoption update, 2026-10-24: HIG is essential design guidance for every target. Apply Apple's [Design principles](https://developer.apple.com/design/human-interface-guidelines/design-principles) across platforms, then follow the actual platform's conventions for controls and behavior. The stable [design-system](../../skills/design-system/SKILL.md) and [usability-audit](../../skills/usability-audit/SKILL.md) skills implement this baseline. The research below retains its original 2026-08-27 scope and verification date.

## Executive finding

There is no single “UX book” or universal checklist that transfers cleanly across every interactive surface. The durable core is a practice: understand real users and their context, make the system legible and controllable, include people with disabilities, use the conventions of the target platform, and validate the complete journey with evidence. The surface changes the dominant constraints:

| Surface | Dominant UX problem | Best starting evidence |
| --- | --- | --- |
| Public/content website | Findability, comprehension, trust, reading, search, and performance | [WCAG 2.2](https://www.w3.org/TR/WCAG22/), [WAI tutorials](https://www.w3.org/WAI/tutorials/), [GOV.UK Design System](https://design-system.service.gov.uk/), [web.dev Core Web Vitals](https://web.dev/articles/vitals) |
| Responsive web app/PWA | Task completion across viewport, input, network, and browser conditions | [W3C Mobile Accessibility](https://www.w3.org/WAI/standards-guidelines/mobile/), [MDN progressive web app best practices](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Best_practices), [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/) |
| Native iOS/iPadOS | Familiar platform behaviors, safe areas, touch, text scaling, assistive input, and continuity | [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines), [Apple accessibility guidance](https://developer.apple.com/design/human-interface-guidelines/accessibility) |
| Native Android/foldables/tablets | Adaptive layouts, touch targets, navigation, configuration changes, and varied input | [Material 3 for Compose](https://developer.android.com/develop/ui/compose/designsystems/material3), [Android accessibility principles](https://developer.android.com/guide/topics/ui/accessibility/principles), [adaptive layouts](https://developer.android.com/develop/ui/compose/layouts/adaptive) |
| Desktop software | Dense workflows, keyboard/pointer precision, windowing, focus, discoverability, and user control | [GNOME Human Interface Guidelines](https://developer.gnome.org/hig/), [Windows navigation guidance](https://learn.microsoft.com/en-us/windows/apps/design/basics/navigation-basics), [Apple HIG](https://developer.apple.com/design/human-interface-guidelines) |
| Voice/conversational | Turn-taking, recognition, memory load, ambiguous utterances, and recovery without a screen | [Google Conversation Design](https://developers.google.com/assistant/conversation-design/welcome), [Alexa voice fundamentals](https://developer.amazon.com/en-US/alexa/alexa-haus/voice-fundamentals), [Apple Siri HIG](https://developer.apple.com/design/human-interface-guidelines/siri) |
| TV/10-foot | Focus, directional navigation, distance, legibility, and remote-control limits | [Android TV focus system](https://developer.android.com/design/ui/tv/guides/styles/focus-system), [Apple focus and selection](https://developer.apple.com/design/human-interface-guidelines/focus-and-selection/) |
| Wearable | Glanceability, tiny-screen ergonomics, short sessions, complications/tiles, and interruption | [watchOS HIG](https://developer.apple.com/design/human-interface-guidelines/designing-for-watchos), [Wear OS principles](https://developer.android.com/design/ui/wear/guides/get-started/design-for-wearables/principles) |
| XR/spatial | Comfort, field of view, depth, multimodal interaction, motion, and spatial orientation | [visionOS HIG](https://developer.apple.com/design/human-interface-guidelines/designing-for-visionos), [Microsoft mixed-reality guidance](https://learn.microsoft.com/en-us/windows/mixed-reality/design/about-this-design-guidance) |
| Kiosk/embedded/game/IoT | Physical environment, closed functionality, atypical input, failure recovery, and privacy | [ISO 9241-210](https://www.iso.org/standard/77520.html), [WCAG2ICT](https://www.w3.org/TR/wcag2ict-22/) |

The recommended operating model is therefore a layered resource stack:

1. Use standards and public-sector guidance for the non-negotiable baseline: human-centred design, accessibility, understandable content, privacy, and reliable operation.
2. Use the target platform’s HIG/design system for interaction conventions, controls, input, layout, and device-specific behavior.
3. Use books for durable mental models, research craft, information architecture, and cross-functional practice.
4. Validate with representative people, realistic tasks, assistive technologies, actual devices, real network conditions, and product outcome data.

Books are particularly useful for explaining why a decision is sound and how to run a practice. Platform documentation is the authority for current dimensions, APIs, controls, and OS behavior. Do not treat an older book’s implementation detail as a substitute for current platform documentation.

## Method and limitations

This scout was conducted on 2026-08-27 using the repository’s research workflow requested for this task. I prioritized primary sources: standards bodies, platform owners, government design systems, original research publishers, and official author/publisher pages. Secondary listicles, affiliate roundups, anonymous “best books” pages, and unsourced rankings were excluded.

The recommendations are fit-for-purpose judgments based on each source’s stated scope, authority, recency, and usefulness in practice; they are not a popularity ranking. Some platform pages change without a new edition number, so current platform behavior should be checked again during implementation. Standards and guidance also have boundaries: for example, WCAG2ICT is informative rather than normative, and it cannot by itself specify the physical or assistive-technology requirements of a kiosk or other closed-functionality product. No product brief, user research, analytics, code, or device lab was supplied, so this document is a resource map rather than a usability evaluation or a claim that any product conforms to a standard.

### Browser verification of automated-link failures

As a follow-up integrity check, the four official pages that returned HTTP 403 to automated requests were opened in the Codex in-app browser on 2026-08-27: [ISO 9241-210](https://www.iso.org/standard/77520.html), [The Design of Everyday Things](https://mitpress.mit.edu/9780262525671/the-design-of-everyday-things/), [Interviewing Users (2nd Edition)](https://rosenfeldmedia.com/books/interviewing-users-second-edition/), and [Mental Models](https://rosenfeldmedia.com/books/mental-models/). All four rendered their expected first-party content. The ISO page displayed the 2019 edition and stated that it was reviewed and confirmed in 2025; the publisher pages displayed titles, authors, edition/publication metadata, and descriptions. The 403 responses therefore indicate request-level bot protection rather than dead links.

## The cross-platform baseline

### 1. Start with people, needs, and context

[ISO 9241-210:2019](https://www.iso.org/standard/77520.html) defines human-centred design for interactive systems across the lifecycle and explicitly covers software and hardware, including websites, applications, mobile phones, vending machines, automated banking, and digital television. Its usefulness is the lifecycle framing: understand context and users, specify requirements, produce design solutions, and evaluate iteratively rather than treating visual polish as the whole of UX.

[GOV.UK user research guidance](https://www.gov.uk/service-manual/user-research/how-user-research-improves-service-design) makes the same principle operational: learn who users are, what they are trying to do, the context in which they do it, and the workarounds they use today. It recommends research throughout delivery in small, regular batches, including disabled people and the full end-to-end journey. This matters especially when a product spans channels: the user may begin on a phone, continue on a laptop, call support, visit a location, or use a paper process.

Use research to answer decisions, not to collect opinions about colors. A good brief identifies the target people, task, motivation, environment, constraints, success condition, and risks. Interviews reveal goals and language; observation reveals behavior and workarounds; usability tests reveal where a design fails; analytics reveal frequency and scale. These are complementary evidence types, not interchangeable substitutes.

### 2. Make the experience perceivable, operable, understandable, and robust

[WCAG 2.2](https://www.w3.org/TR/WCAG22/) organizes accessibility around four principles: content must be perceivable, operable, understandable, and robust. Its success criteria are testable and are organized into A, AA, and AAA conformance levels. WCAG is written for web content, but the principles are useful as a cross-platform quality model.

For web interfaces, the [WAI tutorials](https://www.w3.org/WAI/tutorials/) turn the standard into implementation guidance for page structure, menus, images, tables, forms, and dynamic content. For custom widgets, the [WAI-ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/) supplies patterns, keyboard behavior, accessible names, states, and properties. APG is informative rather than normative and explicitly is not a design system: use native HTML and platform conventions when they already provide the required behavior.

For non-web software and devices, [WCAG2ICT](https://www.w3.org/TR/wcag2ict-22/) explains how to interpret WCAG 2.2 concepts for non-web documents and software. Its examples include kiosks, point-of-sale systems, ATMs, phones and tablets, smart TVs, smart watches, smart speakers, gaming platforms, and IoT. Treat it as a translation aid, then add the target platform’s accessibility API, input model, hardware, and assistive-technology requirements.

### 3. Preserve user control and reduce avoidable cognitive load

The [Nielsen Norman Group usability heuristics](https://www.nngroup.com/articles/ten-usability-heuristics/) remain a useful diagnostic vocabulary: show system status; match the real world; provide user control; be consistent; prevent errors; support recognition; support flexibility; keep the interface focused; help users recover from errors; and provide help when necessary. They are heuristics, not a conformance standard. Apply them to a concrete task and severity, not as a box-ticking exercise.

Across surfaces, the practical questions are consistent:

- Can people tell what is happening, what changed, and what will happen next?
- Can they undo, cancel, go back, pause, or recover without losing work?
- Does the product use the words and concepts people already use?
- Are empty, loading, offline, permission, validation, and failure states designed as carefully as the happy path?
- Is the same concept named, positioned, and behaved consistently across screens, channels, and devices?

The answer must still be expressed through the surface’s native interaction model. A web app can use keyboard focus and browser navigation; a TV app needs directional focus; a voice assistant needs spoken recovery; a wearable needs a glanceable status and an obvious next action.

### 4. Treat performance and resilience as UX

For web products, [Core Web Vitals](https://web.dev/articles/vitals) provide a current user-centred performance baseline: Largest Contentful Paint (loading), Interaction to Next Paint (responsiveness), and Cumulative Layout Shift (visual stability). The page gives “good” thresholds of LCP at or below 2.5 seconds, INP at or below 200 milliseconds, and CLS at or below 0.1, measured at the 75th percentile. These targets are useful guardrails, not proof of a good experience. Combine field data with lab diagnostics, task completion, error rates, and qualitative evidence.

On mobile, performance includes battery, bandwidth, thermal conditions, offline behavior, interrupted sessions, and resuming after a configuration change. On kiosks and embedded devices it includes startup, peripheral failure, reset, and a safe return to a known state. On voice and XR it includes response latency and whether users can recover from a recognition or tracking failure.

### 5. Use familiar conventions and make departures intentional

Platform conventions reduce learning and make accessibility technology work more reliably. Apple, Android, Windows, GNOME, TV, wearable, voice, and XR guidance all encode a different mental model of input and feedback. Consistency across a product is valuable, but consistency with the platform and with user expectations is often more valuable than forcing a single cross-platform visual or interaction system.

When a design departs from the convention, document the user benefit, the accessibility implications, the fallback behavior, and the test evidence. A shared brand language can include typography, color, content voice, and visual identity without flattening touch, keyboard, remote, voice, or spatial interaction into one pattern.

### 6. Make privacy, safety, and persuasion part of UX quality

The [NIST Privacy Framework](https://www.nist.gov/privacy-framework) is a voluntary, risk-based way to manage privacy across the data lifecycle. Its value for UX is to make data collection, use, retention, access, and deletion visible design concerns rather than a legal footer.

The [FTC’s Dark Patterns report](https://www.ftc.gov/news-events/news/press-releases/2022/09/ftc-report-shows-rise-sophisticated-dark-patterns-designed-trick-trap-consumers) documents manipulative patterns such as disguised advertisements, difficult cancellation, hidden costs, and privacy choices designed to steer people. A strong UX resource set should improve comprehension and agency, not merely conversion. Test whether people understand the choice, can decline without penalty, can cancel, and can recover from a mistaken commitment.

## Platform-specific resource map

### Public/content websites

Public sites optimize for orientation, findability, reading, trust, search, accessible content, and fast delivery. Visitors may arrive from a search result rather than a known navigation path, use a small screen in bright light, zoom text, translate the page, or use assistive technology.

Start with:

- [WAI tutorials](https://www.w3.org/WAI/tutorials/) for semantic structure, navigation, images, tables, and forms.
- [WCAG 2.2](https://www.w3.org/TR/WCAG22/) for accessibility requirements and [ARIA APG](https://www.w3.org/WAI/ARIA/apg/) only when a native HTML element cannot supply the required widget behavior.
- [GOV.UK Design System](https://design-system.service.gov.uk/) for accessible components and patterns with content guidance. It is built for government services, but its form, error, summary, navigation, and content patterns are broadly instructive.
- [USWDS](https://designsystem.digital.gov/) for accessible, mobile-friendly government website components, patterns, tokens, and implementation guidance. Its [accessibility guidance](https://designsystem.digital.gov/documentation/accessibility/) encourages keyboard, screen-reader, zoom, touch, manual, and automated testing.
- [MDN form structure guidance](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms/How_to_structure_a_web_form) for labels, grouping, validation, and long-form structure.
- [web.dev Core Web Vitals](https://web.dev/articles/vitals) for loading, interaction responsiveness, and visual stability.

Do not import app-style navigation, onboarding, or account requirements into content that people only need to read. Start with the user’s question and the information architecture; then add interaction where it materially improves the task.

Useful books: Steve Krug’s *Don’t Make Me Think, Revisited* for a concise web usability baseline; Abby Covert’s *How to Make Sense of Any Mess* for information architecture; and Eric Meyer and Sara Wachter-Boettcher’s *Design for Real Life* for resilient content and edge cases. These are complementary to current HTML, WCAG, and performance guidance.

### Responsive web apps and progressive web apps

Responsive web apps have the reach of the web but the task density of an application. Design for viewport changes, touch and keyboard, browser history, zoom, assistive technology, flaky networks, multiple tabs, interrupted sessions, and a wide range of hardware.

Start with:

- [W3C Mobile Accessibility](https://www.w3.org/WAI/standards-guidelines/mobile/), which notes that WCAG applies to mobile web content and calls out touch, small screens, varied input, speech, sunlight, and device context. W3C does not maintain a separate replacement for WCAG just because the viewport is mobile.
- [MDN progressive web app best practices](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Best_practices) for progressive enhancement, feature detection, and responsive behavior.
- [MDN HTML forms](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content/HTML_forms) for labels and touch-friendly associations.
- [web.dev user-centric performance metrics](https://web.dev/articles/user-centric-performance-metrics) and [lab versus field data](https://web.dev/articles/lab-and-field-data-differences) for measuring what people experience rather than relying only on a developer’s fast device.
- [WAI-ARIA APG](https://www.w3.org/WAI/ARIA/apg/) for custom interactive patterns, with semantic HTML preferred.

Recommended design questions include: what is the smallest useful layout; what happens when the keyboard opens; can a user complete the task with touch, keyboard, switch, or voice input; what survives refresh and offline interruption; and does the product preserve state when the browser or device changes?

Useful books: Luke Wroblewski’s *Mobile First* (2011) for mobile-web constraints and prioritization; Aaron Gustafson’s *Adaptive Web Design*, 2nd edition, for progressive enhancement and resilient delivery; and Steve Krug’s *Don’t Make Me Think, Revisited*, 3rd edition (2013) for web task clarity.

### Web applications and dense task workflows

Web applications need strong information scent, navigation, forms, data states, permissions, error recovery, keyboard behavior, and feedback. A dashboard that looks fine in a static screenshot can still fail when users tab through it, load it on a slow network, change a filter, lose authorization, or return after an interruption.

Start with [WCAG 2.2](https://www.w3.org/TR/WCAG22/), [WAI-ARIA APG](https://www.w3.org/WAI/ARIA/apg/), [web.dev](https://web.dev/articles/vitals), and the relevant component guidance in [GOV.UK Design System](https://design-system.service.gov.uk/) or [USWDS](https://designsystem.digital.gov/). Use native controls before custom widgets; when custom behavior is necessary, implement names, roles, states, properties, keyboard support, focus movement, and announcements as one coherent behavior.

For measurement, Google’s original [HEART framework paper](https://research.google/pubs/measuring-the-user-experience-on-a-large-scale-user-centered-metrics-for-web-applications/) (CHI 2010) offers a way to map user-centred goals to signals. It is a planning framework, not a universal KPI template. Define the product goal first, then choose measures such as task success, completion, error recovery, perceived ease, retention, or satisfaction that reflect that goal.

Useful books: Jenifer Tidwell, Charles Brewer, and Aynne Valencia’s *Designing Interfaces*, 3rd edition (2019), for reusable interaction patterns; Alan Cooper and colleagues’ *About Face*, 4th edition (2014), for goal-directed interaction design; and James Kalbach’s *Mapping Experiences*, 2nd edition (2020), for end-to-end journeys and service ecosystems.

### Native iOS and iPadOS

Apple’s [Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines) are the primary design authority for Apple platforms. The HIG covers foundations, patterns, components, input, layout, accessibility, and platform-specific behavior. Follow it for platform mental models before inventing a cross-platform abstraction.

Important iOS/iPadOS themes include:

- [Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility): support familiar and consistent interactions, multiple physical interaction modes, VoiceOver, Voice Control, Switch Control, Full Keyboard Access, larger text, and reduced reliance on time limits or complex gestures. Apple’s guidance gives a default 44-by-44-point iOS/iPadOS control size and a smaller minimum in constrained cases; treat the current HIG as authoritative for exact values.
- [Gestures](https://developer.apple.com/design/human-interface-guidelines/gestures): use standard gestures and do not make a basic action depend on an obscure gesture.
- [Layout](https://developer.apple.com/design/human-interface-guidelines/layout): use safe areas, margins, guides, adaptable layouts, and coherent spacing across orientations and window sizes.
- [Tab bars](https://developer.apple.com/design/human-interface-guidelines/tab-bars): use tab bars for stable top-level navigation, not as a row of commands.

Test on real hardware with text-size changes, VoiceOver, external keyboards, Dynamic Type, orientation, split view, multitasking, poor connectivity, permission denial, interruption, and state restoration. iPadOS is not simply a large iPhone: larger windows and pointer/keyboard input create different information-density and navigation opportunities.

Useful books: Rob Whitaker’s *Developing Inclusive Mobile Apps* (2020) for iOS and Android accessibility models and testing; *Designing Interfaces*, 3rd edition (2019), for pattern reasoning; and Don Norman’s *The Design of Everyday Things*, revised and expanded edition (2013/2014 publisher editions), for mental models and feedback.

### Native Android, foldables, tablets, and large screens

Use [Material 3 for Jetpack Compose](https://developer.android.com/develop/ui/compose/designsystems/material3) and Android’s current design guidance as the primary source for components, theming, and platform behavior. Material provides a system rather than a license to apply components without understanding the task.

Important Android themes include:

- [Accessibility principles](https://developer.android.com/guide/topics/ui/accessibility/principles): label controls, use accessibility actions and built-in widgets, provide cues beyond color, and support TalkBack and Switch Access.
- [Android Views accessibility](https://developer.android.com/guide/topics/ui/accessibility/views/apps-views): Android documents a 48dp minimum touch/focus target for focusable controls; verify current guidance when implementing.
- [Adaptive layouts](https://developer.android.com/develop/ui/compose/layouts/adaptive) and [large-screen guidance](https://developer.android.com/guide/topics/large-screens/user-interface): design for phones, foldables, tablets, desktops, external monitors, and varied input. List-detail, supporting-pane, and feed patterns often use the available space better than simply scaling a phone layout.
- [Configuration and continuity](https://developer.android.com/guide/topics/large-screens/configuration-and-continuity): preserve state through rotation, resizing, fold/unfold, multi-window, and process recreation.
- [Gestures](https://developer.android.com/develop/ui/views/touch-and-input/gestures): do not make basic behavior depend on touch gestures alone; use platform conventions and accessible alternatives.

The Android test matrix should include touch, keyboard, D-pad where relevant, TalkBack, Switch Access, font/display scaling, dark mode, fold posture, multi-window, and low-memory recreation. Android’s device diversity is itself a UX requirement: adaptive layouts and continuity are part of correctness.

Useful books: *Developing Inclusive Mobile Apps* (2020); *Designing Interfaces*, 3rd edition (2019); and *Inclusive Design for a Digital World*, 2nd edition (2025), which covers WCAG 2.2 and inclusive work across mobile, web, games, VR, AR, and AI.

### Desktop: macOS, Windows, and Linux

Desktop software affords high information density and precise pointer/keyboard input, but it also creates expectations around windows, menus, focus, undo, shortcuts, selection, clipboard, resizing, and long-running work.

Use the target OS guidance:

- [Apple HIG](https://developer.apple.com/design/human-interface-guidelines) for macOS conventions, accessibility, keyboard navigation, menus, windows, and controls.
- [Windows navigation basics](https://learn.microsoft.com/en-us/windows/apps/design/basics/navigation-basics) and [Windows UI guidance](https://learn.microsoft.com/en-us/windows/apps/develop/user-interface) for navigation, controls, layout, windowing, and familiar system behavior. [NavigationView](https://learn.microsoft.com/en-us/windows/apps/design/controls/navigationview) documents adaptive navigation that changes with available width.
- [GNOME HIG](https://developer.gnome.org/hig/) for Linux desktop principles, patterns, pointer/touch/keyboard guidance, writing, typography, navigation, adaptiveness, and accessibility. GNOME’s [adaptive guidance](https://developer.gnome.org/hig/guidelines/adaptive.html) is useful for software that can scale from desktop windows down to constrained devices.

Do not interpret desktop as “mobile with more pixels.” Use keyboard focus and visible focus states, support direct manipulation and menus where appropriate, make destructive operations reversible, and ensure windows remain usable when resized or displayed at different scale factors. For dense professional workflows, test expert shortcuts without making the basic path opaque to occasional users.

Useful books: *About Face*, 4th edition (2014); *Designing Interfaces*, 3rd edition (2019); and Jenifer Tidwell’s patterns alongside the relevant OS HIG.

### TV and 10-foot interfaces

TV interaction is remote- or controller-first. There is no dependable hover, text entry is expensive, targets must be legible at distance, and users need to know where focus will move.

For Android TV, use the [focus system](https://developer.android.com/design/ui/tv/guides/styles/focus-system) and [TV navigation guidance](https://developer.android.com/training/tv/get-started/navigation): maintain one clear focused element, support D-pad directions and back, organize focus groups, and keep common tasks efficient. For Apple TV, use [focus and selection](https://developer.apple.com/design/human-interface-guidelines/focus-and-selection/) and [remotes](https://developer.apple.com/design/human-interface-guidelines/remotes), which cover directional focus, Siri Remote gestures, press-versus-tap feedback, and controller expectations.

Design for a viewing distance and test with a real remote. Keyboard shortcuts, pointer hover, dense tables, and small inline controls do not transfer directly. Make focus visible, predictable, and reversible; never strand the user in a focus loop.

### Wearables: watchOS and Wear OS

Wearables are glanceable, interruptive, and physically constrained. Apple describes watchOS interactions as often lasting under a minute; [watchOS HIG](https://developer.apple.com/design/human-interface-guidelines/designing-for-watchos) emphasizes focused experiences, complications, notifications, Siri, the Digital Crown, and independent/offline behavior. Android’s [Wear OS principles](https://developer.android.com/design/ui/wear/guides/get-started/design-for-wearables/principles) similarly emphasize critical tasks, wrist-sized interactions, glanceable surfaces, contextual information, tiles, and standalone use rather than copying a phone app.

Keep the task narrow: show the status or decision needed now, offer one obvious next action, and defer complex configuration to a larger device. Minimize typing and repetitive scrolling. Test with movement, one-handed use, sunlight, gloves where relevant, notifications, intermittent connection, battery constraints, and text scaling.

### Voice and conversational interfaces

Voice is not a GUI with speech recognition attached. [Google’s Conversation Design guidance](https://developers.google.com/assistant/conversation-design/welcome) describes conversation design as a combination of voice interaction, visual interaction, motion, audio, and UX writing across devices. It explicitly recommends designing the conversation flow rather than merely adding commands to an existing screen flow. [Sample-dialog guidance](https://developers.google.com/assistant/conversation-design/write-sample-dialogs) helps teams test spoken wording and text-to-speech before implementation.

[Alexa voice fundamentals](https://developer.amazon.com/en-US/alexa/alexa-haus/voice-fundamentals) frames voice as a two-way conversation that requires a shared mental model, clear prompts, varied utterances, graceful errors, prototyping, and testing. [Situational design](https://developer.amazon.com/en-US/alexa/alexa-skills-kit/situational-design) warns that voice-first experiences should be reimagined around context instead of treating voice as a thin alternative input.

Apple’s [Siri HIG](https://developer.apple.com/design/human-interface-guidelines/siri) recommends identifying relevant actions, using familiar terms, and ensuring voice responses remain useful when no screen is available. Design for:

- recognition and confirmation without forcing users to remember exact commands;
- short, scannable prompts that do not create a memory dump;
- interruption, silence, ambiguity, misrecognition, refusal, and privacy-sensitive moments;
- spoken and visual parity when a screen exists;
- an easy exit, repeat, correction, and escalation to another channel.

Useful books: Erika Hall’s *Conversational Design* (2018) for language and human-interface framing; Preston So’s *Voice Content and Usability* (2021) for voice content, flow, and inclusive communication; and *Interviewing Users*, 2nd edition (2023), to learn the vocabulary and situations of real users before scripting an assistant.

### XR, spatial, and mixed-reality interfaces

XR adds a physical body, field of view, depth, motion, tracking, and spatial memory to the interaction. [Apple’s visionOS HIG](https://developer.apple.com/design/human-interface-guidelines/designing-for-visionos) covers windows, volumes, immersive spaces, indirect gestures, comfort, visual field, and motion. Its [spatial layout guidance](https://developer.apple.com/design/human-interface-guidelines/spatial-layout/) emphasizes usable depth and field of view, avoiding head-anchored content and excessive windows, and leaving room around controls.

[Microsoft mixed-reality design guidance](https://learn.microsoft.com/en-us/windows/mixed-reality/design/about-this-design-guidance) covers comfort, the holographic frame, spatial mapping, interaction models, and UX elements. The [interaction fundamentals](https://learn.microsoft.com/en-us/windows/mixed-reality/design/interaction-fundamentals) describe multimodal hands/controllers, hands-free, gaze, and commit models. The [comfort guidance](https://learn.microsoft.com/en-us/windows/mixed-reality/design/comfort) covers text legibility, head and neck movement, gaze angle, arm fatigue, and mixing gestures with speech. The [gaze and dwell guidance](https://learn.microsoft.com/en-us/windows/mixed-reality/design/gaze-and-dwell-head) gives concrete constraints such as minimum target size in the field of view and feedback for dwell interactions.

Design for comfort before spectacle: use the minimum immersion needed, avoid forced camera motion, keep text legible, offer stable reference frames, do not require repeated raised-arm gestures, and provide alternate input. Test with different heights, seated/standing use, fatigue, motion sensitivity, visual acuity, and tracking loss.

Useful book: Preston So’s *Immersive Content and Usability* (2023), published by A Book Apart, for content and usability across augmented, extended, and virtual reality. Pair it with the current device HIG; a book cannot track rapidly changing hardware behavior.

### Kiosks, embedded devices, games, and IoT

These surfaces vary too much for one interaction pattern. A kiosk may have a touch display in a queue, an ATM may need privacy and timeout behavior, a game may use a controller and audio-visual feedback, and an IoT device may rely on a companion phone plus physical controls. Their shared risk is that teams assume a web or mobile interaction model while ignoring the physical environment and the closed nature of the system.

Use [ISO 9241-210](https://www.iso.org/standard/77520.html) to structure context-of-use and lifecycle evaluation, and [WCAG2ICT](https://www.w3.org/TR/wcag2ict-22/) to translate accessibility concepts to non-web software. W3C explicitly warns that WCAG2ICT is informative and does not by itself resolve hardware, physical access, or the assistive-technology requirements of closed functionality. Add device-owner accessibility APIs, hardware constraints, regulatory requirements, and field testing.

For public-facing systems, use the [GOV.UK end-to-end research guidance](https://www.gov.uk/service-manual/user-research/how-user-research-improves-service-design) as a reminder to study all channels and handoffs. Evaluate recovery after power loss, network loss, peripheral failure, timeout, wrong input, abandonment, and support escalation. For games and consoles, consult the relevant console maker’s current accessibility and technical-requirement documentation in addition to the general baseline; the exact requirements are product- and platform-specific.

## Recommended books, with fit and limits

The list below uses official publisher or author pages. Publication dates refer to the edition named on the linked page where the publisher provides one.

### Foundations and interaction design

| Book | Official edition/date | Best use | Limit |
| --- | --- | --- | --- |
| Don Norman, *The Design of Everyday Things* | [MIT Press revised and expanded edition](https://mitpress.mit.edu/9780262525671/the-design-of-everyday-things/), paperback 2014; [Hachette edition](https://www.hachettebookgroup.com/titles/don-norman/the-design-of-everyday-things-revised-and-expanded-edition/9780465072996/?lens=basic-books), 2013 | Mental models, affordances, feedback, mapping, errors, and human-centred framing | Foundational rather than platform-specific; pair with current accessibility and HIG documentation |
| Alan Cooper et al., *About Face: The Essentials of Interaction Design* | [Wiley, 4th edition](https://uat.store.wiley.com/en-us/about-face-the-essentials-of-interaction-design-4th-edition-p-9781118766583), 2014 | Goal-directed design, personas, behavior, interaction structure, and screen-size/mobile considerations | Large and method-heavy; some implementation details age |
| Jenifer Tidwell, Charles Brewer, Aynne Valencia, *Designing Interfaces* | [O’Reilly, 3rd edition](https://www.oreilly.com/library/view/designing-interfaces-3rd/9781492051954/), December 2019 | Pattern vocabulary for navigation, forms, search, editing, feedback, and responsive interfaces | Pattern catalogues can be misapplied without user/context research |
| Steve Krug, *Don’t Make Me Think, Revisited* | [Pearson, 3rd edition](https://www.pearson.com/en-us/subject-catalog/p/don-t-make-me-think-revisited-a-common-sense-approach-to-web-usability/P200000000385/9780321965516), 2013 | Fast, practical web usability review; includes a mobile chapter | Concise and web-centric; not a substitute for accessibility, content, or performance standards |

### Research, validation, and continuous product work

| Book | Official edition/date | Best use | Limit |
| --- | --- | --- | --- |
| Erika Hall, *Just Enough Research* | [A Book Apart, 2nd edition](https://abookapart.com/products/just-enough-research.html), 2019; first edition 2013 | Framing research questions, stakeholder interviews, lightweight qualitative/quantitative methods, and ethics | Deliberately compact; teams needing deep fieldwork need a larger methods text |
| Steve Portigal, *Interviewing Users* | [Rosenfeld Media, 2nd edition](https://rosenfeldmedia.com/books/interviewing-users-second-edition/), October 2023 | Recruiting, logistics, field interviews, questions, analysis, synthesis, impact, and ResearchOps | Focuses on interviews; pair with usability testing and analytics |
| Brad Nunnally and David Farkas, *UX Research* | [O’Reilly/Apress](https://www.oreilly.com/library/view/ux-research/9781491951286/), November 2016 | Planning, qualitative and quantitative methods, facilitation, analysis, and reporting | 2016; verify current tools and research ethics guidance |
| Stephanie Marsh, *User Research* | [Kogan Page/O’Reilly, 2nd edition](https://www.oreilly.com/library/view/user-research-2nd/9781398603585/), February 2022 | Interviews, usability tests, content/card sorting, surveys, storytelling, and action | Broad overview; not a replacement for domain-specific or vulnerable-participant expertise |
| Jeff Gothelf and Josh Seiden, *Lean UX* | [O’Reilly, 3rd edition](https://www.oreilly.com/library/view/lean-ux-3rd/9781098116293/), September 2021 | Outcomes, hypotheses, experiments, cross-functional collaboration, and iterative delivery | Must not be used to cut research to zero or equate speed with learning |

### Information architecture, journeys, and services

| Book | Official edition/date | Best use | Limit |
| --- | --- | --- | --- |
| James Kalbach, *Mapping Experiences* | [O’Reilly, 2nd edition](https://www.oreilly.com/library/view/mapping-experiences-2nd/9781492076629/), November 2020 | Journey maps, service blueprints, experience maps, ecosystem models, and multichannel alignment | Maps are models for decisions, not deliverables to decorate a wall |
| Indi Young, *Mental Models* | [Rosenfeld Media](https://rosenfeldmedia.com/books/mental-models/), February 2008 | Connecting user goals and behavior to product structure and opportunities | Older and conceptual; combine with current research and platform constraints |

### Design thinking and service innovation

These books are explicitly about design-thinking practice rather than screen-level UI patterns. Use them to frame ambiguous problems, align stakeholders, generate and test options, and connect UX work to organizational or service outcomes.

| Book | Official edition/date | Best use | Limit |
| --- | --- | --- | --- |
| Jeanne Liedtka and Tim Ogilvie, *Designing for Growth* | [Columbia University Press](https://cup.columbia.edu/book/designing-for-growth/9780231158381/), June 2011 | A practical design-thinking toolkit for managers: mindset, vocabulary, opportunity framing, and experiments | Business-oriented; pair with direct user research and interaction-design guidance |
| Jeanne Liedtka, Tim Ogilvie, and Rachel Brozenske, *The Designing for Growth Field Book* | [Columbia University Press, 2nd edition](https://cup.columbia.edu/book/the-designing-for-growth-field-book/9780231187893/), April 2019 | Step-by-step workbook for briefs, research, criteria, ideation, prototyping, feedback, and learning launches | A facilitation workbook, not a substitute for platform or accessibility standards |
| Jeanne Liedtka, Andrew King, and Kevin Bennett, *Solving Problems with Design Thinking* | [Columbia University Press](https://cup.columbia.edu/book/solving-problems-with-design-thinking/9780231536059/), September 2013 | Case-based transfer of ethnography, visualization, storytelling, and experimentation into product, process, government, and social-sector problems | Stories explain application; teams still need to adapt the method to their users and constraints |
| Marc Stickdorn, Markus Hormess, Adam Lawrence, and Jakob Schneider, *This Is Service Design Doing* | [O’Reilly](https://www.oreilly.com/library/view/this-is-service/9781491927175/titlepage01.html), January 2018 | Large method library for service-design research, co-creation, journey/system mapping, service prototyping, and organizational change | Service-level scope can be too broad for a single UI fix; choose only methods tied to a decision |
| Peter G. Rowe, *Design Thinking* | [MIT Press](https://mitpress.mit.edu/9780262680677/design-thinking/), February 1991 | Historical and theoretical account of design inquiry, useful for understanding the intellectual roots of the term | Focuses on architecture and urban planning, not contemporary digital UX; read for theory, not implementation |

### Web, mobile, and inclusive design

| Book | Official edition/date | Best use | Limit |
| --- | --- | --- | --- |
| Luke Wroblewski, *Mobile First* | [A Book Apart](https://abookapart.com/products/mobile-first.html), October 2011; free online edition at [mobile-first.abookapart.com](https://mobile-first.abookapart.com/) | Prioritizing content and tasks under mobile-web constraints, capabilities, inputs, and layout | Older browser/device details; use current responsive and performance docs |
| Aaron Gustafson, *Adaptive Web Design* | [O’Reilly, 2nd edition](https://www.oreilly.com/library/view/adaptive-web-design/9780134216287/) | Progressive enhancement, resilient responsive delivery, accessibility, and performance | Confirm current browser/platform behavior before implementation |
| Rob Whitaker, *Developing Inclusive Mobile Apps* | [Apress/O’Reilly](https://www.oreilly.com/library/view/developing-inclusive-mobile/9781484258149/), April 2020 | Accessibility models, testing, and implementation considerations for iOS and Android | Platform APIs change; pair with Apple and Android docs |
| Regine M. Gilbert, *Inclusive Design for a Digital World* | [O’Reilly, 2nd edition](https://www.oreilly.com/library/view/inclusive-design-for/9798868818202/), November 2025 | WCAG 2.2, inclusive research/design, and coverage spanning web, mobile, games, AI, VR, and AR | Broad survey; use platform and legal guidance for exact requirements |
| Eric Meyer and Sara Wachter-Boettcher, *Design for Real Life* | [A Book Apart](https://abookapart.com/products/design-for-real-life), March 2016 | Designing for stress, crisis, edge cases, context, and compassionate content | Short book; pair with safety/privacy research for high-risk domains |

### Emotion, onboarding, safety, voice, and immersive content

| Book | Official edition/date | Best use | Limit |
| --- | --- | --- | --- |
| Aarron Walter, *Designing for Emotion* | [A Book Apart, 2nd edition](https://abookapart.com/products/designing-for-emotion.html), June 2020; first edition 2011 | Empathy, inclusion, privacy, safety, personality, and emotional design | Emotion should support task trust; it cannot rescue confusing flows |
| Krystal Higgins, *Better Onboarding* | [A Book Apart](https://abookapart.com/products/better-onboarding.html), May 2021 | Ongoing, contextual onboarding across features and returning users | Focuses on onboarding; still need product discovery and task research |
| Erika Hall, *Conversational Design* | [A Book Apart](https://abookapart.com/products/conversational-design.html), March 2018 | Language, personality, and conversational interaction beyond a single device | Pair with current voice platform specifications and speech testing |
| Preston So, *Voice Content and Usability* | [A Book Apart announcement](https://abookapart.com/blogs/press/new-voice-content-and-usability-by-preston-so), 2021 | Content for the ear, conversational flow, accessibility, and inclusive voice communication | Voice platforms and capabilities change quickly |
| Preston So, *Immersive Content and Usability* | [A Book Apart announcement](https://abookapart.com/blogs/press/new-immersive-content-and-usability-by-preston-so), April 2023 | Content design for augmented, extended, and virtual reality | Pair with the current device’s comfort and interaction guidance |
| Eva PenzeyMoog, *Design for Safety* | [A Book Apart](https://abookapart.com/products/design-for-safety.html), August 2021 | Threat modelling, abuse cases, and designing safer digital interactions | For regulated/high-risk products, add domain safety, security, and legal expertise |

## Selection matrix: what to use for which job

| If the team needs to… | Start with | Add | Validate with |
| --- | --- | --- | --- |
| Improve a public website | WAI tutorials, WCAG 2.2, GOV.UK or USWDS patterns, *Don’t Make Me Think* | Content research, search analytics, Core Web Vitals | Representative task tests, keyboard/screen reader/zoom, field performance |
| Build or refactor a responsive web app | WCAG, APG, MDN forms/PWA guidance, web.dev | *Designing Interfaces*, *Mobile First*, *Adaptive Web Design* | Touch/keyboard/switch/voice tests, slow network/offline, error and recovery paths |
| Build an iOS/iPadOS app | Apple HIG and Apple accessibility guidance | *Developing Inclusive Mobile Apps*, *Designing Interfaces* | Real devices, VoiceOver, Voice Control, Switch Control, text scaling, multitasking |
| Build Android across phones/foldables/tablets | Material 3, Android accessibility, adaptive layouts, continuity guidance | *Developing Inclusive Mobile Apps*, *Inclusive Design for a Digital World* | TalkBack/Switch Access, font scaling, fold/posture, multi-window, process recreation |
| Improve a desktop workflow | Target OS HIG plus GNOME/Windows/macOS navigation guidance | *About Face*, *Designing Interfaces* | Keyboard-only, focus, resize/scaling, undo, expert and occasional-user tasks |
| Design voice | Google Conversation Design, Alexa fundamentals/situational design, Siri HIG | *Conversational Design*, *Voice Content and Usability* | Spoken prompts, recognition variation, silence, interruption, privacy, no-screen path |
| Design TV | Android TV focus/navigation or Apple focus/remotes | *Designing Interfaces* for patterns, not controls | Real remote, distance, focus traversal, legibility, back/exit/recovery |
| Design wearable | watchOS or Wear OS principles | *Inclusive Design for a Digital World* for broader inclusion | Movement, one-handed use, glanceability, battery, interruptions, offline |
| Design XR | visionOS or Microsoft mixed-reality guidance | *Immersive Content and Usability*, *Design for Real Life* | Comfort, motion, text, field of view, seated/standing, fatigue, tracking loss |
| Design kiosk/embedded/game/IoT | ISO 9241-210 and WCAG2ICT | Device maker’s accessibility/technical requirements; safety/privacy guidance | Field environment, peripherals, power/network loss, timeout, reset, support handoff |
| Establish a durable UX practice | ISO 9241-210, GOV.UK research guidance, *Just Enough Research* | *Interviewing Users*, *Lean UX*, *Mapping Experiences* | Research repository, decision log, task success, qualitative and product outcomes |

## A practical reading and implementation roadmap

### Phase 0: Establish the baseline (one day)

1. Read the [ISO 9241-210 abstract](https://www.iso.org/standard/77520.html) and write the product’s users, context, task, and lifecycle risks.
2. Read the relevant parts of [WCAG 2.2](https://www.w3.org/TR/WCAG22/) and [WAI tutorials](https://www.w3.org/WAI/tutorials/).
3. Choose the target platform lane and read its HIG/design system before reviewing screens.
4. Record the input modes, display sizes, network conditions, assistive technologies, locales, privacy risks, and failure conditions in scope.

### Phase 1: Build the mental model (one to two weeks)

Read Don Norman’s *The Design of Everyday Things* and one interaction-pattern book: *Designing Interfaces* for breadth or *About Face* for goal-directed depth. Use each chapter to annotate one real product flow: the user’s goal, the system’s model, feedback, error prevention, and recovery.

For a web-first team, substitute or add Krug’s *Don’t Make Me Think, Revisited*. For a multi-channel service, start *Mapping Experiences* earlier because a screen-level fix may move rather than solve the problem.

### Phase 2: Learn the users and journey (one to three weeks)

Read *Just Enough Research* and *Interviewing Users*. Define a small set of research questions, recruit participants who actually represent the highest-risk users and contexts, observe realistic tasks, and synthesize evidence into decisions. Add *Mapping Experiences* when handoffs, support, physical locations, or multiple devices are part of the journey.

Use [GOV.UK’s user research guidance](https://www.gov.uk/service-manual/user-research/how-user-research-improves-service-design) to keep the work continuous and inclusive. Do not treat a single stakeholder workshop, preference survey, or five-minute demo as proof of usability.

### Phase 3: Choose one platform lane (one to two weeks)

- Public website: WAI tutorials, GOV.UK/USWDS patterns, content guidance, Krug, and Core Web Vitals.
- Responsive web/PWA: W3C mobile guidance, MDN PWA/forms, web.dev, *Mobile First*, and *Adaptive Web Design*.
- Native iOS/Android: target HIG plus Whitaker’s inclusive mobile book; test actual accessibility APIs and device behavior.
- Desktop: target OS HIG, GNOME/Windows/macOS navigation, *About Face*, and keyboard/focus workflows.
- Voice: Google/Alexa/Siri platform guidance plus *Conversational Design* or *Voice Content and Usability*.
- TV, wearables, kiosk, or XR: use the device-owner guidance first; use the relevant book only for durable content and research principles.

### Phase 4: Turn reading into a 90-day practice

For one important journey, create:

1. A context brief and assumptions ledger.
2. A journey or service map showing channels, handoffs, and failure points.
3. A task flow and prototype covering initial, empty, loading, permission, offline, validation, error, cancellation, and recovery states.
4. An accessibility test plan covering semantics/names, focus, keyboard or alternate input, contrast, text scaling/zoom, captions/transcripts, reduced motion, and no-color-only cues.
5. A device/environment matrix covering viewport or form factor, input, network, lighting, noise, movement, and assistive technology.
6. A usability study with realistic representative tasks and neutral facilitation.
7. A product measurement plan. Use HEART’s goals-to-metrics mapping where it clarifies the outcome; use Core Web Vitals for web performance; do not optimize a proxy that conflicts with user success.
8. A decision log with evidence, hypothesis, change, result, residual risk, and owner.

## Compact UX review contract

Before approving a refactor or a new feature, ask the team to provide evidence for these questions:

- **Need:** Who is trying to do what, in what context, and how do we know?
- **Flow:** Can the user understand the next action, current state, and result at every step?
- **Content:** Are labels, headings, instructions, errors, and confirmations in the user’s language?
- **Control:** Can users undo, cancel, pause, go back, correct, and recover?
- **Inclusion:** Can people with different vision, hearing, mobility, cognition, language, input, and device conditions complete the task?
- **Platform:** Does the design use the target surface’s familiar navigation, input, focus, gesture, voice, remote, wearable, or spatial conventions?
- **Resilience:** What happens under slow loading, no network, interruption, timeout, permission denial, power loss, tracking loss, or peripheral failure?
- **Performance:** Are field performance and interaction latency acceptable for the people and devices that matter?
- **Ethics:** Are privacy choices, pricing, cancellation, consent, and defaults clear and non-coercive?
- **Evidence:** What changed after testing, and which risks remain unresolved?

This contract is intentionally cross-platform at the principle level and platform-specific at the behavior level. That separation is what makes a UX system portable without making every interface identical.

## Primary source index

### Standards, accessibility, and research

- [ISO 9241-210:2019 — Human-centred design for interactive systems](https://www.iso.org/standard/77520.html)
- [W3C WCAG 2.2](https://www.w3.org/TR/WCAG22/)
- [W3C WAI tutorials](https://www.w3.org/WAI/tutorials/)
- [WAI-ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/)
- [W3C Mobile Accessibility](https://www.w3.org/WAI/standards-guidelines/mobile/)
- [W3C WCAG2ICT](https://www.w3.org/TR/wcag2ict-22/)
- [GOV.UK user research](https://www.gov.uk/service-manual/user-research/how-user-research-improves-service-design)
- [GOV.UK Service Standard: make the service simple to use](https://www.gov.uk/service-manual/service-standard/point-4-make-the-service-simple-to-use)
- [GOV.UK Design System](https://design-system.service.gov.uk/)
- [USWDS](https://designsystem.digital.gov/)
- [Google Research: HEART framework paper](https://research.google/pubs/measuring-the-user-experience-on-a-large-scale-user-centered-metrics-for-web-applications/)
- [web.dev Core Web Vitals](https://web.dev/articles/vitals)
- [NIST Privacy Framework](https://www.nist.gov/privacy-framework)
- [FTC Dark Patterns report](https://www.ftc.gov/news-events/news/press-releases/2022/09/ftc-report-shows-rise-sophisticated-dark-patterns-designed-trick-trap-consumers)
- [Nielsen Norman Group usability heuristics](https://www.nngroup.com/articles/ten-usability-heuristics/)

### Platform guidance

- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines)
- [Apple accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility)
- [Apple watchOS design](https://developer.apple.com/design/human-interface-guidelines/designing-for-watchos)
- [Apple focus and selection](https://developer.apple.com/design/human-interface-guidelines/focus-and-selection/)
- [Apple visionOS design](https://developer.apple.com/design/human-interface-guidelines/designing-for-visionos)
- [Material 3 for Jetpack Compose](https://developer.android.com/develop/ui/compose/designsystems/material3)
- [Android accessibility principles](https://developer.android.com/guide/topics/ui/accessibility/principles)
- [Android adaptive layouts](https://developer.android.com/develop/ui/compose/layouts/adaptive)
- [Android large-screen UI](https://developer.android.com/guide/topics/large-screens/user-interface)
- [Android TV focus](https://developer.android.com/design/ui/tv/guides/styles/focus-system)
- [Wear OS principles](https://developer.android.com/design/ui/wear/guides/get-started/design-for-wearables/principles)
- [Windows navigation basics](https://learn.microsoft.com/en-us/windows/apps/design/basics/navigation-basics)
- [GNOME Human Interface Guidelines](https://developer.gnome.org/hig/)
- [Google Conversation Design](https://developers.google.com/assistant/conversation-design/welcome)
- [Alexa voice fundamentals](https://developer.amazon.com/en-US/alexa/alexa-haus/voice-fundamentals)
- [Alexa situational design](https://developer.amazon.com/en-US/alexa/alexa-skills-kit/situational-design)
- [Microsoft mixed-reality design guidance](https://learn.microsoft.com/en-us/windows/mixed-reality/design/about-this-design-guidance)
- [Microsoft mixed-reality interaction fundamentals](https://learn.microsoft.com/en-us/windows/mixed-reality/design/interaction-fundamentals)
- [Microsoft mixed-reality comfort](https://learn.microsoft.com/en-us/windows/mixed-reality/design/comfort)

## Bottom line

For most teams, the highest-return starting set is: ISO 9241-210 for lifecycle thinking; WCAG 2.2/WAI tutorials for accessible web foundations; the target platform HIG/design system; *The Design of Everyday Things* for mental models; *Designing Interfaces* for interaction patterns; *Just Enough Research* plus *Interviewing Users* for evidence; and *Mapping Experiences* when the journey crosses devices or channels. If the team specifically needs design-thinking facilitation or service innovation, add *The Designing for Growth Field Book* or *This Is Service Design Doing*. Add the mobile, voice, wearable, TV, desktop, kiosk, or XR lane only when that surface is actually in scope.

The resource set is worth using when it changes decisions and tests—not when it becomes a larger checklist. Keep the standards current, treat platform guidance as authoritative for implementation, use books for durable reasoning, and make every major UX claim traceable to user evidence.

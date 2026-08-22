---
name: functional-prototype
description: >-
  Guide a product from early discovery to a functioning prototype through four focused conversation layers: foundation,
  visuals, planning, and implementation. Use this recipe to gather and research product context, establish durable
  artifacts, define and reverse-engineer visual directions, create implementation-ready tickets, resolve
  human-in-the-loop decisions, and implement one tested task at a time.
metadata:
  author: labdotsa
  category: product-delivery
  status: draft
  detail-url: ./recipe.html
  pack-url: https://skills.sh/p/ZAhjWBxq1YUaoauO
  outcome: functional-prototype
  conversation-layers:
    - foundation
    - visuals
    - planning
    - implementation
  skills:
    - name: wayfinder
      source: mattpocock/skills
      url: https://www.skills.sh/mattpocock/skills/wayfinder
    - name: grilling
      source: mattpocock/skills
      url: https://www.skills.sh/mattpocock/skills/grilling
    - name: research
      source: mattpocock/skills
      url: https://www.skills.sh/mattpocock/skills/research
    - name: build-product-artifacts
      source: labdotsa/skills
      url: https://www.skills.sh/labdotsa/skills/build-product-artifacts
    - name: imagegen
      source: openai/codex
      availability: built-in
    - name: deconstruct
      source: labdotsa/skills
      url: https://www.skills.sh/labdotsa/skills/deconstruct
    - name: to-tickets
      source: mattpocock/skills
      url: https://www.skills.sh/mattpocock/skills/to-tickets
    - name: tdd
      source: mattpocock/skills
      url: https://www.skills.sh/mattpocock/skills/tdd
---

# Functioning Prototype

## Conversation - Foundation Layer

### Step - Information Gathering

We usually gather all the necessary information about the product and its scope, as well as any potential future work it may expand into. This is the initial step. Alternatively, we can collaborate using skills such as:

- [https://www.skills.sh/mattpocock/skills/wayfinder](https://www.skills.sh/mattpocock/skills/wayfinder)
- [https://www.skills.sh/mattpocock/skills/grilling](https://www.skills.sh/mattpocock/skills/grilling)

#### Step - Digging Deeper

Sometimes, we need to research a certain aspect even further. We use the skill below for that:

- [https://www.skills.sh/mattpocock/skills/research](https://www.skills.sh/mattpocock/skills/research)

### Step - Artifact Establishment

After everything has been set up and the foundational concept is mostly locked in, we use the skill below to establish and craft product artifacts:

- [https://www.skills.sh/labdotsa/skills/build-product-artifacts](https://www.skills.sh/labdotsa/skills/build-product-artifacts)

#### Step - Artifact Hardening

Sometimes, we are unhappy with the suggested integrations, tech stack, cloud infrastructure, and publishing approach.

At this point, we clarify all necessary aspects of the scope and go-to concepts, then update the established artifacts to pave the way for the next step.

## Conversation - Visuals Layer

### Step - Screen Design Direction

At this point, we already have a set of artifacts, including user journeys and screens. We only need to fine-tune their visual appeal.

To create fresh, clean, and unique interfaces and experiences, we choose one of two approaches: either gather a set of inspiration from external resources and bring it in, or continue in a separate conversation to visualize and imagine what the final outcome would look like.

#### Step - Gather a Set of Inspiration

There are plenty of resources online. Find the ones that are most suitable for you, such as:

- Dribbble
- Mobbin
- etc.

#### Step - Generate Visuals

If you are using Codex, there is a built-in skill called "Image Gen." This helps you craft a set of attractive directions that you can choose from later. If you have references in mind, it can also help bring them in and reflect them using the current `@artifacts`.

```text
Based on the current screen structure in @artifacts, I want you to imagine how things will look using $imagegen. I need at least three directions for each.
```

### Step - Screen Design Reverse Engineering

At this point, we have a solid direction for how the screens should look visually. We need to lock it in contextually and create a proper description and layout architecture. Therefore, we will use the skill below:

- [https://www.skills.sh/labdotsa/skills/deconstruct](https://www.skills.sh/labdotsa/skills/deconstruct)

This will help describe the associated visuals and break them down, whether they are attached or referenced as images.

## Conversation - Planning Layer

### Step - Pre-Implementation

At this point, we have everything we need to start slicing the work into its own silos and queues and prepare it to be broken down into clear, implementation-ready tasks. For this step, we use the skill below:

- [https://www.skills.sh/mattpocock/skills/to-tickets](https://www.skills.sh/mattpocock/skills/to-tickets)

This will help articulate the current `@artifacts` as solid, implementation-ready tasks. You prompt it as follows:

```text
Based on the current [artifacts](artifacts/), I want you to document them in a folder called issues using [$to-tickets](https://www.skills.sh/mattpocock/skills/to-tickets), and each should have its own 0000-file.md.
```

#### Step - Clear Things Up

Sometimes, these generated tasks, tickets, or issues are marked as HITL, which means we need to decide which option or implementation direction to follow. At this point, you may need to review them by asking:

```text
What HITL issues do we have, and what are our options for each?
```

Even better, follow it up with:

```text
Based on the current [artifacts](artifacts/), what do you recommend?
```

After you finish locking down the direction, you need to confirm so these issues can be generated. Simply say:

```text
LGTM, commit.
```

## Conversation - Implementation

At this point, we are ready to kick off the long-running implementation goal by executing the prompt below:

```text
/goal I want you to review all the issues in [issues](issues/), as I am not quite sure whether they were implemented correctly. You can review the commits that have been made. Review one issue per run.

----

# ISSUES

Local issue files from [issues](issues/) are provided at the start of the context. Parse them to understand the open issues.

You will work on the AFK issues only, not the HITL ones.

You have also been provided with a file containing the last few commits.

Review these to understand what work has been done.

If all AFK tasks are complete, output ‹promise>NO MORE TASKS</promise›.

# TASK SELECTION

Pick the next task. Prioritize tasks in this order:

1. Critical bug fixes
2. Development infrastructure

Getting development infrastructure, such as tests, types, and development scripts, ready is an important precursor to building features.

3. Tracer bullets for new features

Tracer bullets are small slices of functionality that go through all layers of the system, allowing you to test and validate your approach early. This helps identify potential issues and ensures that the overall architecture is sound before investing significant time in development.

TL;DR - Build a tiny, end-to-end slice of the feature first, then expand it.

4. Polish and quick wins
5. Refactors

# EXPLORATION

Explore the repo.

# IMPLEMENTATION

Use [$tdd](https://www.skills.sh/mattpocock/skills/tdd) to complete the task.

# FEEDBACK LOOPS

Before committing, run the feedback loops:

- `bun run test` to run the tests
- `bun run typecheck` to run the type checker

# COMMIT

Make a Git commit. The commit message must:

1. Include key decisions made
2. Include files changed
3. Include blockers or notes for the next iteration

# THE ISSUE

If the task is complete, mark the issue as done.

If the task is not complete, add a note to the issue file explaining what was done.

# FINAL RULES

- DO NOT BREAK THE CURRENT CODE-STYLE APPROACH UNLESS APPROVED.
- DO NOT BREAK THE CURRENT USER EXPERIENCE UNLESS STATED BY THE ISSUE.
- DO NOT BREAK THE CURRENT USER INTERFACE UNLESS STATED BY THE ISSUE.
- ONLY WORK ON A SINGLE TASK PER RUN.
```

For your information, this prompt uses the skill below, so make sure it is already accessible:

- [https://www.skills.sh/mattpocock/skills/tdd](https://www.skills.sh/mattpocock/skills/tdd)

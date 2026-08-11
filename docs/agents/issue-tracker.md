# Issue tracker: GitHub

Issues, Wayfinder maps, and implementation tickets for this repository live in [GitHub Issues](https://github.com/labdotsa/skills/issues). Use the `gh` CLI from the repository clone so it infers `labdotsa/skills` from the remote.

## Conventions

- Create: `gh issue create --title "..." --body-file <file> --label "..."`.
- Read: `gh issue view <number> --comments --json number,title,body,state,labels,assignees,url`.
- List: `gh issue list --state open --json number,title,body,labels,assignees,url` with suitable label filters.
- Comment: `gh issue comment <number> --body-file <file>`.
- Label or assign: `gh issue edit <number> --add-label "..." --add-assignee "..."`.
- Close with a resolution: `gh issue close <number> --comment "..."`.

Use GitHub's REST API version `2026-03-10` for sub-issues and dependency relationships.

## Wayfinding operations

The issue labelled `wayfinder:map` is the canonical map. Every live Wayfinder ticket is a native sub-issue of that map and carries exactly one type label: `wayfinder:research`, `wayfinder:prototype`, `wayfinder:grilling`, or `wayfinder:task`.

### Create and attach a child

1. Create the child issue and retain its issue number.
2. Read its numeric REST `id` with `gh api repos/labdotsa/skills/issues/<child-number> --jq .id`.
3. Attach it with `gh api --method POST -H "X-GitHub-Api-Version: 2026-03-10" repos/labdotsa/skills/issues/<map-number>/sub_issues -F sub_issue_id=<child-id>`.

Create all children before wiring dependencies.

### Add a blocking edge

For “Target is blocked by Blocker,” read Blocker's numeric REST `id`, then run:

`gh api --method POST -H "X-GitHub-Api-Version: 2026-03-10" repos/labdotsa/skills/issues/<target-number>/dependencies/blocked_by -F issue_id=<blocker-id>`

Use GitHub's native relationship even when the issue body also summarizes blockers for readability.

### Query the frontier

1. List the map's children from `repos/labdotsa/skills/issues/<map-number>/sub_issues`.
2. For each open, unassigned child, list `repos/labdotsa/skills/issues/<child-number>/dependencies/blocked_by`.
3. The frontier is the open, unassigned children for which every blocker is closed.

### Claim and resolve

Claim a frontier ticket before work by assigning it to the authenticated developer. Record its answer as a resolution comment, close it, then append only a one-line linked gist to the map's **Decisions so far** section.

## To Tickets operations

Implementation tickets are native sub-issues of their parent planning issue. Create them in dependency order, apply `ready-for-agent`, attach them to the parent, then wire native `blocked_by` edges in a second pass. Do not close or rewrite the parent while publishing tickets.

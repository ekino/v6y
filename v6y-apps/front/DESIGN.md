# Design

## Design Intent

Vitality should feel like a calm control room for project health. The interface exists to help users understand what is happening across their applications in seconds, then move naturally from overview to detailed reports without losing context.

The design priority is clarity before decoration. Every visual choice should make monitoring easier: stronger hierarchy, quieter surfaces, clearer states, and reports that are readable even when the data is dense.

## Experience Goals

- Help users spot the health of a project at a glance.
- Make audit reports easy to scan, compare, and revisit.
- Reduce cognitive load when switching between projects, categories, and report sections.
- Present important signals first: status, trend, severity, impacted area, and next action.

## Interface Principles

### 1. Monitoring First

The main experience is not content browsing. It is ongoing monitoring. Dashboards, lists, and detail pages should always answer these questions quickly:

- Which projects are healthy?
- Which ones need attention now?
- What changed since the last check?
- Where should the user go next?

### 2. Readable Reports Over Fancy Reports

Reports should feel structured and operational, not theatrical. Favor:

- clear section headers
- consistent card layouts
- compact summaries before deep detail
- tables and lists with strong labels
- meaningful status chips and severity markers

Avoid visual noise that competes with the data.

### 3. Progressive Disclosure

Show the signal first, then the explanation. Summary metrics, status labels, and key findings should appear before raw details, code references, or historical entries.

### 4. Stable Navigation

Users should always know where they are: dashboard, project, audit run, or report. Keep navigation predictable and keep filter state visible.

## Visual Direction

### Tone

Professional, reassuring, and precise. Vitality should feel trustworthy enough for operational follow-up, but not heavy or intimidating.

### Color

Use a restrained neutral base with a small set of semantic accents:

- neutral surfaces for dashboards and reports
- green for healthy or compliant states
- amber for warnings and watch points
- red for urgent issues and failing checks
- blue only for navigation, filters, or informational focus

Status colors must support comprehension, not branding alone. Never rely on color as the only signal.

### Typography

Typography should make dense information easier to read:

- strong page titles and section titles
- clear metric numerals
- short descriptive labels
- generous line-height in long report content
- tabular or monospaced numerals where comparing scores, counts, or dates matters

### Spacing

Use spacing to separate levels of meaning:

- tight spacing inside related metrics
- larger gaps between sections
- visible breathing room around report summaries and callouts

## Core Surfaces

### Dashboard

The dashboard should surface portfolio health first:

- health overview per project
- critical alerts and regressions
- recent audit activity
- shortcuts to the most relevant reports

The dashboard is successful when a user can decide where to focus in less than 30 seconds.

### Project List

The project list should behave like a monitoring queue, not a directory. Each row or card should make it easy to compare:

- project name
- overall status
- last audit date
- most important issue or category
- direct path to details

### Project Details

Details pages should preserve the summary at the top and organize the rest into readable sections. Users should not need to scroll through raw data to find the overall state.

### Reports

Reports are the trust layer of Vitality. They must be easy to read, easy to share, and easy to act on. A good report page includes:

- an executive summary at the top
- grouped findings by category or severity
- plain-language labels for technical metrics
- timestamps and audit context
- clear next steps when action is required

## Interaction Patterns

- Filters must be visible, understandable, and reversible.
- Sorting should support monitoring tasks such as severity, freshness, or risk.
- Empty states should explain what is missing and how to generate the next useful signal.
- Loading states should preserve structure so users understand what is coming.
- Trend and status changes should be noticeable but subtle.

## Accessibility

- Target WCAG AA contrast across dashboards and reports.
- Use text, icons, and layout in addition to color for statuses.
- Support keyboard navigation across filters, tables, tabs, and expandable sections.
- Keep motion minimal and never required for comprehension.

## What To Avoid

- Overly decorative gradients or marketing-style visuals on data-heavy screens
- Crowded cards with too many competing metrics
- Ambiguous icons without text labels
- Deep nesting that hides the report summary
- Tables that require horizontal scanning to understand severity or status

## Design Outcome

When the design is working, Vitality helps users feel in control of their projects. The interface makes health signals obvious, reports feel readable instead of overwhelming, and every screen supports a simple flow: monitor, understand, decide, act.

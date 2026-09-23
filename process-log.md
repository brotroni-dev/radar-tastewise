# Process log: working with Claude

Feeds the "How you worked with the AI tool" section. Honest: what was asked,
what it got wrong, what was changed by hand.

## Round 0: framing (thinking only, no build)

**Asked:** read the brief and the CV, define the best solution, make a plan,
ask questions, apply best practice. Present everything as one holistic page:
thinking, brief and prototype.

**Claude proposed:** a "Meeting-ready briefing" (calendar-triggered) as the
sharpest bet, a comparison of six push directions, a single-page structure
and a 4h time plan.

**What Roni changed:** rejected the calendar-only bet. Required: Maya chooses
Slack or email; every insight is actionable; she can create slides from it;
she defines what's relevant for her brand and gets suggestions. Category:
natural supplements. Neutral visual system.

**Claude's second version:** "Radar v1", setup once, insight moment, actions.

**What Roni changed again:** wanted agents Maya can set, adjust and create by
prompt, out-of-the-box presets, cadence daily / weekly / immediate, and
actions beyond slides (write email, schedule meeting). Explicitly not tied to
the meeting: "she should be aware way before, it's her responsibility to be
ready." Asked Claude for a better suggestion for the agents hub.

**Claude's third version (approved):** Radar as delegation. Presets on by
default, create by prompt with a sample before enabling, control at the point
of delivery, cadence as outcomes, outputs as her artifacts. Ten UX
principles, each mapped to a prototype state.

**What Claude got wrong in this round:**
- First bet leaned on calendar integration, narrower than Maya's real week.
- Proposed "team questions to Maya per week" as a metric. Roni doubted it;
  it isn't measurable from the product. Replaced with agent retention at 30
  days and "not relevant" rate.
- Wrote every document with long dashes. Roni's standing rule (from her
  portfolio notes) is no long dashes, ever. Rewritten.
- Assumed a Claude artifact link as the deliverable. Roni wanted one GitHub
  Pages URL, like her portfolio.

**Changed by hand:** none yet (planning only).

## Round 1: content lock

**Asked:** write all copy for the 7 prototype states and the page before any
code, so the words are reviewed first.

**Claude produced:** `content.md`, the single source for the build.

**Roni's edits:** (to fill)

## Round 1: build, page skeleton and states 1-4

**Asked:** the page with the locked copy (cover, brief, thinking, principles
table with "see it" links, prototype section, placeholder for Working with
AI, the "why"s, metrics), the prototype engine (7 steps, Next / Back, step
list, design notes toggle, arrow keys, restart, full-screen page) and states
1-4 fully working: scene, the moment with a Slack / email toggle, the insight
with sourced evidence and a chart, act with slide / email / meeting / ask /
share.

**Claude produced:** index.html, prototype.html, styles.css, prototype.js in
one pass. One look in the browser, no console errors.

**Got wrong, fixed after the look:** the Slack sidebar squeezed the message
at medium widths. It now hides below 1000px.

**Roni's review:** (to fill)

**Changed by hand:** (to fill)

## Round 2: states 5-7

**Asked:** Tune (Not relevant with reason chips, More like this, confirmations
that say what changed, the agent card opening inline with cadence / where /
output controls), Radar home (four preset agents with on-off, the preset
library, New agent) and New agent by prompt (the request, the parsed card
with removable chips and a sample of the first update, Start watching, the
closing card). The created agent appears on Radar home afterwards.

**Claude produced:** the three states in prototype.js plus their styles.
Checked every click path in the browser, including the sub-states. No
console errors.

**Got wrong:** nothing visible this round. One process note: the browser
pane reloaded mid-check, so the remaining sub-states were verified by
driving the prototype's own state machine rather than clicking.

**Roni's review:** (to fill)

**Changed by hand:** (to fill)

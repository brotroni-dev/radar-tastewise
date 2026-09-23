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

## Round 3: write-up and README

**Asked:** fill the "Working with AI" section from this log (asked for / got
wrong / changed by hand), write README.md as the standalone one-page
write-up with the live links, and add the styles for the section.

**Claude produced:** the section as three cards, README.md, a phone-width
check (no horizontal scroll at 375px) and a dark-mode check.

**Open before publishing:** the "changed by hand" card has a placeholder for
Roni's copy and design edits after review.

## Round 4: three rhythms and urgency (Roni's addition)

**Roni changed by hand:** after the first full build she added two things.
Maya works in three rhythms (daily: meetings, emails, approvals, questions
from the team, campaign or launch problems; weekly: performance, sales,
project status, decks, management updates; periodic: retailer review,
quarterly planning, innovation pipeline, launch brief), and that is how she
should work with the agents. And an urgency parameter: a window can close.

**Claude changed:** cadence became rhythm everywhere; Radar home regrouped
by rhythm, with a fifth preset (Retailer review prep) in the periodic
rhythm; one urgency rule at the top of home; a "window closing" strip on the
update, the insight, the slide's ask, the meeting invite and the new-agent
sample; "Not urgent" as a feedback reason; the scene shows her three
rhythms; the ten principles reworked with rhythms and urgency as 3 and 4;
page, README and content deck updated.

**Got wrong before this:** treated cadence as a system setting (immediate /
daily / weekly) and had no notion of a closing window.

## Round 5: final design look, real Slack and Gmail, the prototype on its own

**Roni asked for:** the Slack screen built from a Figma Slack desktop kit,
the email screen from a Figma Gmail kit, a finished visual system for the
product screens instead of the schematic one, better orientation, the
prototype living separately from the presentation, the persona (Maya) on
the page, a simpler "What I asked for", and no "Ask away" section.

**Claude changed:** rebuilt the Slack screen after the kit (aubergine
sidebar and rail, app message with the APP tag, a Block Kit card with
fields and buttons, the composer); built the Gmail view after its kit
(Compose pill, Inbox selected, the rounded white panel, the opened message
with sender row and reply bar); a product app shell for the platform
screens (nav with Radar sections, top bar with breadcrumb and "Ask
anything", page headers, one card system, stat tiles, an icon set); a
progress bar, a "where and when" line and step descriptions in the
prototype shell for orientation; the presentation now links to the
prototype page and to each step (prototype.html#step-N) instead of
embedding it; a persona card in the brief section; the "why"s moved to the
README only.

**Got wrong, fixed after the look:** the progress segments used a class
name (done) that the completion card also used, so the bar rendered 70px
tall. Renamed.

**Roni added, same round:** the phone notification should look like a real
iOS Slack notification (she sent a screenshot), and Maya should have a
picture instead of the "M" avatar.

**Claude changed:** the lock-screen notification is now the iOS card: the
Slack (or Gmail) app icon drawn in SVG, a "Time sensitive" label with "now",
the app name in bold, then the message. Maya's portrait is a free-to-use
mockup photo (randomuser.me) saved in the repo as assets/maya.jpg, with an
illustrated SVG fallback; it appears in the scene, the Slack window, the
Gmail window, the platform nav and the persona card on the page.

## Round 6: Roni's review of the finished look

**Roni asked for:** agents as one list, one under the other, with a clear
sign of what each one is and a three-dot menu; a better screen for creating
an agent, with Slack and email both selectable; no "You get" selector; the
entry to Tune from Slack and from the insight header, landing on the same
"Here's what I understood" card; nicer charts; no "Read the thinking" on the
cover; the whole prototype section gone from the page (the prototype is
reached from the nav and the cover); in the moment, the Slack/email toggle
as a heading with the phone and the screen aligned under it, a smaller phone
and cleaner arrows in the Slack bar; a white stage instead of the greenish
one; the design note in yellow, shorter and more human, and all copy more
human; the scene should introduce the persona; and in Slack, several
insights to choose from, with Maya picking the magnesium one.

**Claude changed:** Radar home is a list grouped by rhythm, each row with a
rhythm icon, Preset or Yours, channels, last update, on/off and a three-dot
menu (Adjust, Pause, Duplicate, Delete). One editor card, "Here's what I
understood", for both tuning an existing agent and creating a new one, with
Slack DM and Email as toggles that can both be on. Tune opens on that card,
reached from the Slack update, the email, the insight header and the list
menu. New agent got a composer with example cards and a Slack-style sample
of the first update next to the card. The chart was redrawn: smooth lines,
soft area fills, a legend above, a chip for the launch marker, end dots, no
overlapping labels. The daily in Slack and email now carries three updates;
the Bloomwell one comes first with the date. The scene introduces Maya:
what she's measured on, her day, the platform today, what she needs, then
her three rhythms. Stage and app chrome are white; the design note is
yellow; every note and caption was rewritten in plain words without the
principle numbers.

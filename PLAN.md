# Plan - Tastewise home assignment: "Radar: agents that notice for Maya"

Thinking only. No build until this plan is approved. Time box for the whole
assignment: 4h (about 0:50 used on framing).

## Context

Roni is doing the Tastewise Product Designer home assignment: turn a pull
(search-engine) market-intelligence platform into push for Maya, a
non-power-user CPG brand manager who is in the product twice a month and is a
bottleneck for her team. The brief asks for one idea, an interactive
prototype built with an AI tool, and a one-page write-up (alternatives and
why this one; assumptions and design values; how the AI tool was used).
Reviewers will "ask why a lot"; rough with clear reasoning beats polished
with vague reasoning.

Roni's decisions so far: Maya delegates the noticing to agents she can set,
adjust and create by prompt; out-of-the-box presets to follow trends; cadence
daily / weekly / immediate; she chooses Slack or email; every insight comes
with actions (create slide, write email, schedule meeting); the insight is
not tied to a meeting ("it's her responsibility to be ready way before").
Category: natural supplements, Kindroot vs Bloomwell. Neutral visual system.
Deliverable: one holistic page (brief, thinking, prototype) built with
Claude, hosted on GitHub Pages from a new public repo, one URL, same pattern
as Roni's portfolio. Built to UX best practice.

## Writing rules (from Roni's portfolio CLAUDE.md)

- No long dashes anywhere: page copy, README, commit messages, this plan.
  A regular hyphen, a colon or a comma instead. Roni reads the long dash as a
  sign of machine-written text.
- Explain simply and in steps. Roni is a product designer, not a programmer.

## The bet - one idea

Radar. Maya has a small set of agents, each watching one thing about her
brand, reporting on the cadence she chose, in the channel she chose, and
every update arrives with the next action already drafted.

One-liner for the cover: "Maya doesn't ask the platform questions anymore.
Her agents do, and they hand her what she'd have built herself."

What the "one piece" is: the update reaching Maya and what she does with it.
The hub (where agents live) and create-by-prompt are the "how it knows",
shown as one screen each so they don't steal the weight.

Why this beats the alternatives (goes in the write-up):
- Weekly digest: a newsletter she skims; no ownership, no control.
- Alerts with thresholds: needs configuration skill she doesn't have.
- Calendar-triggered briefing: sharp, but a brand manager should know her
  category weeks before the meeting, not the night before; also only fires
  around meetings.
- Team bot: makes the team the user; Maya stays a bystander.
- In-product "For you" home: she isn't in the product; doesn't fix pull.
- Radar keeps the good parts of each: cadence (digest), noticing (alerts),
  readiness (briefing), team reach (share action), under one mental model
  Maya already understands: delegation.

## UX principles - best practice mapped to Maya

Each one must be pointable in the prototype ("this is where you feel it").

| # | Principle | Best-practice root | Where it lives |
|---|---|---|---|
| 1 | Start full, not empty: presets on by default from her brand profile; she turns off, not on | Default effect; zero-config onboarding for occasional users | Radar home, state 6 |
| 2 | Progressive disclosure: presets, then tweak, then create by prompt; power never blocks the basic path | Hick's law; expert paths behind the simple path | Radar home + New agent, states 6-7 |
| 3 | Preview before commit: a new agent shows "here's your first update" before it's enabled | Expectation setting; reduces fear of noise | New agent, state 7 |
| 4 | Earn the interruption: every update opens with "why this matters to Kindroot"; caps and batching per agent (immediate / daily / weekly) | Notification hygiene; relevance over recency | The moment + insight, states 2-3 |
| 5 | Control at the point of delivery: "Why you're seeing this / Adjust / Not relevant" inside the message | Fix noise where it's read; no trip to settings | States 2, 3, 5 |
| 6 | Ready, not raw: outputs are her artifacts (slide, email, meeting), editable, never auto-sent | Human in the loop; output matches her job, not the system's | Act, state 4 |
| 7 | Defensible by default: every number has source, timeframe, confidence | Trust; her name is on it in the room | Insight + slide, states 3-4 |
| 8 | One system across channels: identical insight structure in Slack, email, in-product; channel is a preference, not a product | Consistency; recognition over recall | State 2 Slack/Email toggle |
| 9 | Visible learning: feedback changes the next update and says so | Feedback loops; perceived control | Tune, state 5 |
| 10 | Name by the job, in her words: "Competitor launches", not "Agent #3" | Match the real world; plain language | Radar home |

## Prototype - guided walkthrough, 7 states

Cold open on the moment (what the brief asks to see), then the loop closes
through "how it knew". Next / Back, step indicator, "Show rationale" toggle
revealing 1-3 callouts per state, keyboard arrows, Restart.

| # | State | What Maya sees | Interactions |
|---|---|---|---|
| 1 | Scene | "Tuesday, 8:40. Between meetings. Target category review is in 9 days." Maya's week at a glance. | Start |
| 2 | The moment | Phone notification, then Slack DM from Radar (toggle: view as Email). "Competitor launches: Bloomwell Magnesium Sleep Gummies is gaining fast at Target. Here's why it matters for Kindroot." Footer: Why you're seeing this / Adjust / Not relevant | Slack/Email toggle, Open |
| 3 | The insight | Signal; Why it matters to Kindroot; Evidence (velocity chart, search trend, review themes, each with source and timeframe); 3 suggested moves (retailer talking point / campaign angle / launch consideration); Also on your radar (2 small) | Expand evidence, pick a move |
| 4 | Act | Action bar: Create slide / Draft email / Schedule meeting / Ask a follow-up / Share. Default path: Create slide, then slide preview (title, chart, 3 bullets, sources), then Add to deck / Download. Draft email: editable email to the team or buyer. Schedule meeting: invite with the brief attached. | Tabs between the three outputs |
| 5 | Tune | "Not relevant" / "More like this" leads to "Got it. Fewer format alerts from this agent." Adjust opens the agent card inline (cadence, channel, output). Link: See all agents | Feedback buttons, Adjust |
| 6 | Radar home | 4 agents running (presets, on by default): Competitor launches; Claims and ingredients gaining traction; My share at Target, CVS, Amazon; Consumer trends: sleep, stress, gut. Each card: watches / cadence / channel / output / last update / on-off. Preset library row (Format shifts, Price and promo, GLP-1 companion, Regulatory and claims). CTA: New agent | Toggle an agent, New agent |
| 7 | New agent by prompt | "Tell Radar what to watch" with example prompts. Maya types "anything that could hurt my magnesium line at Target". System returns a structured card: What I'll watch (editable chips) / How often / Where / What you'll get / Sample of your first update. CTA: Start watching, then "Running. First update Thursday 8:30." | Edit chips, Start watching, Restart loop |

Cuts, in order, if the build runs long: Schedule meeting to a static card;
Draft email to static; Email view of the moment to a single screenshot-style
state; "Also on your radar" removed. Never cut states 2, 3, 4-slide, 6.

## Scenario content (all illustrative; fictional brands, real retailers as context)

- Kindroot: natural supplements, mid-size. Magnesium Glycinate capsules
  (#2 SKU, 31% of range revenue), Ashwagandha, D3+K2, Daily Probiotic, Omega-3.
  Key retailers: Target, CVS, Amazon.
- Bloomwell launched Magnesium Sleep Gummies (glycinate + L-theanine,
  "sleep + stress") 6 weeks ago.
- Signal: velocity 2.1x category average at Target (retail sales data, last
  6 weeks); "magnesium for sleep" searches +38% QoQ (search data); "gummy"
  mentions in magnesium conversation +54% (social, 90 days); reviews cite
  "taste", "no pill fatigue" (review analysis, n about 1.2k).
- Why it matters to Kindroot: magnesium share at Target down 1.4 pts in 8
  weeks; wins on "no fillers" (most-cited review theme), loses on format.
- 3 suggested moves (one insight hits all three of Maya's outcomes):
  1. Retailer talking point: category +22% YoY, sleep is the driver, Kindroot
     is #1-reviewed for clean label. Defend the shelf.
  2. Campaign angle: lead with "sleep" on the existing SKU (PDP, packaging).
  3. Launch consideration: format extension, evidence for the innovation brief.
- Also on your radar: "GLP-1 companion" (fiber, electrolytes) searches
  rising; ashwagandha conversation cooling, down 12%.
- Generated slide: "Sleep is reshaping magnesium at Target", velocity chart,
  3 bullets, source line.
- Draft email: to the brand team, 5 lines, slide attached.
- Meeting: "Magnesium format response, 30 min", invite includes the brief.

## The page - one link, one scroll, sticky nav

1. Cover: title, one-line bet, Roni Brot-Kolinkó, "4 hours, built with
   Claude", jump to prototype.
2. The brief, as I read it: Maya, the problem, the reframe. 5 lines.
   Reframe: "Push isn't notifications. It's delegation. Maya needs someone
   watching her category so she doesn't have to know the question."
3. The thinking: explored directions as cards with why-not; the bet and why;
   assumptions as decisions; the 10 principles each linked to a prototype
   state.
4. The prototype: embedded guided walkthrough (device/window frame) plus an
   "Open full-screen" link to `prototype.html`.
5. Working with AI: from `process-log.md` and the commit history. What I
   asked, what it got wrong, what I changed by hand. Specific, honest.
6. Anticipated "why"s: 5 Q&As (below).
7. What I'd measure: 3 lines.

Page UX: reads in 3 minutes; one accent colour; same components in page and
prototype; realistic Slack / email / phone renderings; light and dark;
phone-width safe; accessible contrast and focus states; no long dashes.

## Write-up outline (maps to the brief's three asks)

1. What else you considered and why you bet on this one: section 3 cards
   plus the bet paragraph.
2. Assumptions, design values, and what you did to create that feeling:
   assumptions list plus the principles table with "where it lives".
   Assumptions: the platform can build a brand profile from her company;
   Slack and email integrations exist; agents run on existing data and query
   capability; retailer-level share data is available; her team can receive
   shares; nothing is sent without her.
3. How you worked with the AI tool: section 5 from the process log and the
   commit history.

## Anticipated "why" questions (prepare all; put 5 on the page)

- Why agents, not alerts? Alerts need her to know the threshold. Agents need
  her to know the goal. She has goals.
- Why not tie it to the meeting? Readiness is her job all quarter; the
  meeting is the deadline, not the trigger. Agents keep her ahead; the
  meeting just finds her already informed.
- What stops it becoming noise? Caps per agent, cadence she chose, "why
  you're seeing this" on every update, one-tap feedback that visibly changes
  the next one, preview before enabling anything new.
- How does this make her a daily user? Daily digest at 8:30 in Slack; the
  actions produce things she has to ship anyway (slides, emails). The
  product becomes the place her outputs come from.
- Why Slack and email? Her day is meetings, email, decks; her team is in
  Slack. Same insight, her choice per agent. Channel is a preference.
- Why presets on by default? Twice-a-month users don't configure. Value on
  day one or never.

## Metrics (3 lines on the page)

- Habit: from about 2 sessions a month to weekly-plus active (updates
  opened, by channel).
- Insight to action: slides / emails / meetings created per update.
- Not noise: agent retention at 30 days (% of presets still on) and "not
  relevant" rate trending down. Optional team proxy: updates shared with
  team per week.

(Dropped "team questions to Maya per week": not measurable from the product,
indirect.)

## Repo and hosting

Same pattern as the portfolio (`~/roni-portfolio`, plain HTML on `main`,
served by GitHub Pages at `brotroni-dev.github.io`). This one is a project
site: `https://brotroni-dev.github.io/radar-tastewise/`. One URL, the only
link Tastewise gets. No Claude artifact.

- Repo layout in `/Users/ronibrot/Tastewise`:
  - `index.html`: the holistic page (served by Pages)
  - `prototype.html`: full-screen prototype, same code
  - `README.md`: the one-page write-up in markdown; stands alone, GitHub
    renders it, links to the live page
  - `process-log.md`, `PLAN.md`: thinking, in the open
  - `.gitignore`: OS and editor junk
- Homebrew and `gh` are not installed, so the flow is git plus the GitHub
  website, in steps:
  1. Claude: `git init`, first commit (local only, no network).
  2. Roni, on github.com: New repository, name `radar-tastewise`, Public, no
     README (about 1 minute). Then Settings, Pages, Source: Deploy from a
     branch, `main`, `/ (root)`, Save.
  3. Claude: `git remote add origin https://github.com/brotroni-dev/radar-tastewise.git`
     and `git push -u origin main`. The portfolio pushed over HTTPS on
     2026-09-15, so the stored GitHub login should be reused. If git asks
     for a password, Roni pastes a token herself; Claude never handles it.
  4. Verify the Pages URL in the built-in browser (first deploy takes
     1-2 minutes).
- One commit per build round; the message says what Claude built and what
  Roni changed by hand. The history is a second, verifiable process log.
- Nothing is pushed until Roni says go.

## Build approach (only after approval)

- Load the `artifact-design` skill first (its page contract applies even for
  self-hosted HTML). Single-file `index.html`; prototype as an inline state
  machine (7 states) also exported standalone as `prototype.html`. No
  external JS; fonts from Google Fonts only; charts as inline SVG. Realistic
  fake data from the scenario section.
- Rounds: (1) skeleton page plus prototype states 1-4; (2) states 5-7 plus
  rationale callouts; (3) write-up sections plus polish. Roni reviews after
  each round in the built-in browser and hand-edits copy; every round is
  appended to `process-log.md` and committed.
- Final: push, verify the Pages URL, share the link.

## Time plan (remaining about 3:10)

| Block | Time |
|---|---|
| Content lock (copy, numbers, agent names) | 0:15 |
| Repo init, GitHub, Pages | 0:10 |
| Build round 1: page skeleton plus states 1-4 | 0:50 |
| Build round 2: states 5-7 plus rationale callouts | 0:40 |
| Write-up sections in the page plus README | 0:35 |
| Polish, click-through test, dark and phone check, push, verify link | 0:25 |
| Buffer | 0:15 |

## Verification

- Click-through: every state reachable via Next / Back and the step
  indicator; no dead ends; Restart returns to state 1; Slack/Email toggle and
  action tabs work; rationale toggle shows callouts on every state.
- Read test: page top to bottom in 3 minutes or less; each principle links
  to a state; each of the brief's three write-up asks is answered.
- Content: fictional brands only; "illustrative data" label; every number
  carries source and timeframe; no long dashes anywhere.
- Rendering: desktop, phone width (16px gutters, no horizontal scroll),
  light and dark.
- Hosting: Pages URL loads from a clean session; `prototype.html` link
  works; README renders on GitHub and links to the live page.
- Process log: three rounds logged with asked / got wrong / changed by hand;
  commit history matches.

## Housekeeping after approval

- Sync `/Users/ronibrot/Tastewise/PLAN.md` to this plan (it still describes
  the earlier version); append round 1 to `process-log.md`.
- Create the memory index `MEMORY.md` (two memory files already written) and
  save the "no long dashes, explain in steps" rule as a feedback memory.

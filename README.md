# Radar

Agents that notice for Maya, so she doesn't have to know the question.

Tastewise Product Designer home assignment. Roni Brot-Kolinkó. 4 hours.
Built with Claude Code.

- **Read and click through:** https://brotroni-dev.github.io/radar-tastewise/
- **Prototype, full screen:** https://brotroni-dev.github.io/radar-tastewise/prototype.html

## The brief, as I read it

The platform is excellent at answering, and it only answers when asked.
Maya is a brand manager, not an analyst. She's in the product twice a month,
when something forces her in, and her team waits on her for answers. The
brief asks what push should mean here, and to design one piece of it.

**Reframe:** push isn't notifications. It's delegation. Maya needs someone
watching her category so she doesn't have to know the question.

## What I explored, and why I bet on Radar

| Direction | Why not the bet |
|---|---|
| Weekly digest, by email | A newsletter she skims. No ownership, no control. |
| Alerts with thresholds | Needs configuration skill she doesn't have. |
| Briefing before each meeting | Sharp, but she should know her category weeks before the meeting. Only fires around meetings. |
| Team bot | Makes the team the user. Maya stays a bystander. |
| "For you" home in the product | She isn't in the product. Doesn't fix pull. |
| Slides plugin | Lives in her output, but heavy and narrow. |

**The bet.** Radar keeps the good parts of each: cadence from the digest,
noticing from alerts, readiness from the briefing, team reach from sharing,
under one mental model Maya already understands: delegation. She tells Radar
what matters once (or accepts what it suggests), picks where and in which
rhythm, and every update arrives with the next action already drafted.

Her week already runs in three rhythms: daily (meetings, approvals, the
team's questions), weekly (performance, status, the management update) and
periodic (the retailer review, the quarterly plan, the launch brief). Radar
reports in those rhythms, not on a schedule of its own. Urgency is the only
thing that breaks a rhythm: a closing window carries a date and comes today.

The one piece I designed is the update reaching her and what she does with
it. The hub and create-by-prompt are shown as one screen each, the "how it
knows".

## Assumptions, written as decisions

- The platform can build a brand profile from Maya's company and products.
- Slack and email integrations exist.
- Agents run on the platform's existing data and query capability.
- Retailer-level share data is available for her SKUs.
- Retailer calendars (resets, promo windows) are available, so windows can carry a date.
- Her team can receive shares without a seat.
- Nothing is sent to anyone without Maya.

## Design values, and where each one lives

1. **Start full, not empty, named by the job.** Presets on by default, called "Competitor launches", not "Agent #3". She turns off, not on. (Radar home)
2. **Progressive disclosure, with a preview.** Presets, then tweak, then create by prompt. A new agent shows its first update before it's enabled. (New agent)
3. **Her rhythms, not ours.** Daily, weekly, periodic: every agent reports in one of Maya's three rhythms, so an update lands where it will be used. (Radar home)
4. **Urgency breaks the rhythm.** A closing window carries a date and comes today, whatever the rhythm. It's the only thing that interrupts. (The moment)
5. **Earn the interruption.** Every update opens with why it matters to Kindroot. (The moment)
6. **Control at the point of delivery.** Adjust and Not relevant live inside the message. (Tune)
7. **Ready, not raw.** Outputs are her artifacts: slide, email, meeting. Editable, never auto-sent. The window travels with them. (Act)
8. **Defensible by default.** Every number has a source, a timeframe, a confidence. (The insight)
9. **One system across channels.** Same structure in Slack, email and the product. (The moment)
10. **Visible learning.** Feedback changes the next update, and says so. (Tune)

## Working with AI

**Asked for:** the plan before any code; all copy locked in `content.md`
before the build; the build in rounds with one look per round; hosting on
GitHub Pages so the commits double as a process log.

**Got wrong:** a calendar-triggered first bet (too narrow); an unmeasurable
"team questions" metric; a Claude artifact instead of one GitHub URL; long
dashes everywhere; a Slack sidebar that squeezed the message at medium
widths; cadence as a system setting, with no notion of a closing window.

**Changed by hand:** the concept, twice; the trigger (not the meeting); the
three rhythms and the urgency window, after the first full build; the
metric, the hosting, the writing rule. Copy and design edits after review:
see `process-log.md`.

## The "why"s I expect

- **Why agents, not alerts?** Alerts need her to know the threshold. Agents need her to know the goal. She has goals.
- **Why not tie it to the meeting?** Readiness is her job all quarter. The meeting is the deadline, not the trigger.
- **Why three rhythms, and why urgency?** That's how her week already works. Radar fits her rhythm instead of adding one. Some things can't wait for a rhythm: those carry a date and come today. Nothing else interrupts.
- **What stops it becoming noise?** Caps per agent, a rhythm she chose, "why you're seeing this" on every update, one-tap feedback that visibly changes the next one, and a sample before anything new is enabled.
- **How does this make her a daily user?** A daily digest at 8:30 in Slack, and actions that produce things she has to ship anyway.
- **Why presets on by default?** Twice-a-month users don't configure. Value on day one, or never.

## What I'd measure

- **Habit:** from about 2 sessions a month to weekly-plus active, updates opened by channel.
- **Insight to action:** slides, emails and meetings created per update.
- **Not noise:** agent retention at 30 days, and the "not relevant" rate trending down.

## In this repo

- `index.html`, `styles.css`, `prototype.js`: the page with the prototype embedded
- `prototype.html`: the prototype full screen
- `content.md`: all the copy, the single source for the build
- `PLAN.md`: the approved plan
- `process-log.md`: how the AI tool was used, round by round

Run it locally:

```bash
python3 -m http.server 8765
```

Then open http://localhost:8765.

Fictional brands, illustrative data. This brief is hypothetical.

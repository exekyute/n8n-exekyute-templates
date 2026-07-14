# Synthetic data for testing

All fake. Dates are anchored to a "today" of **2026-06-02** so the scoring rules
produce a clean mix. Paste Day 1 into Notion, build the workflow, then apply the
Day 2 edits to watch change detection fire.

---

## Day 1: paste these 8 rows into the Projects database

| Project | Status | Update notes | Last update | Next milestone |
|---|---|---|---|---|
| Henley pitch deck | Active | Waiting on final numbers from finance, slides only half done. | 2026-05-20 | 2026-06-04 |
| Vendor portal migration | Active | Blocker: API keys still not provisioned by IT, migration stalled. | 2026-06-01 | 2026-06-18 |
| Q3 budget review | Active | Draft circulated, waiting on two department replies. | 2026-05-25 | 2026-06-09 |
| Website copy refresh | Active | Paused while we finalize brand voice. | 2026-05-21 | 2026-06-30 |
| Onboarding kit v2 | Active | On track, first draft done, reviewing this week. | 2026-05-31 | 2026-06-20 |
| Newsletter relaunch | Active | Kickoff done, schedule agreed. | 2026-06-02 | 2026-07-10 |
| Old CRM cleanup | On hold | Shelved until next quarter. | 2026-04-10 | (leave blank) |
| Logo redesign | Done | Delivered and signed off. | 2026-05-15 | (leave blank) |

The last two (On hold, Done) are there to confirm the workflow ignores them. Only
the 6 Active rows should reach the standup.

### Expected Day 1 standup

```
Morning standup - 2026-06-02

⚡ CHANGED OVERNIGHT
- none

🔴 RED
- Henley pitch deck: milestone in 2 days, notes stale, slides half done
- Vendor portal migration: blocker, API keys not provisioned

🟡 YELLOW
- Q3 budget review: milestone within a week, awaiting replies
- Website copy refresh: no update in ~12 days, paused

🟢 GREEN (2): Onboarding kit v2, Newsletter relaunch
```

CHANGED says "none" because the Memory row was empty on the first run. After this
run, the workflow saves the standup to the Memory row, so the next run has something
to compare against.

---

## Day 2: make these two small edits, then run again

Change only these two projects in Notion:

**1. Vendor portal migration** (the blocker clears, should go Red -> Green)
- Update notes: `API keys provisioned, migration resumed and on schedule.`
- Last update: `2026-06-02`
- Next milestone: leave at `2026-06-18`

**2. Onboarding kit v2** (it slips, should go Green -> Red)
- Update notes: `Reviewer out sick, no progress this week, milestone now at risk.`
- Last update: leave at `2026-05-31`
- Next milestone: change to `2026-06-04`

Leave the other four Active projects untouched.

### Expected Day 2 standup

```
Morning standup - 2026-06-02

⚡ CHANGED OVERNIGHT
- Vendor portal migration: Red -> Green (blocker cleared, back on schedule)
- Onboarding kit v2: Green -> Red (milestone in 2 days, reviewer out)

🔴 RED
- Henley pitch deck: milestone passed/near, slides half done
- Onboarding kit v2: milestone in 2 days, no progress, reviewer out

🟡 YELLOW
- Q3 budget review: milestone within a week, awaiting replies
- Website copy refresh: no update in ~12 days, paused

🟢 GREEN (2): Vendor portal migration, Newsletter relaunch
```

If you see the two CHANGED OVERNIGHT lines, the whole upgrade works end to end.

(Wording of reasons will vary slightly run to run, that is normal. What matters
is the colors and the two transitions.)

---

## Optional: test the AI step on its own

If you want to test just the AI prompt before the full workflow is wired, you can
paste this as `{{PROJECTS_JSON}}` and use `FIRST RUN - no prior standup` as
`{{YESTERDAY_DIGEST}}`:

```json
[
  {"Project":"Henley pitch deck","Update notes":"Waiting on final numbers from finance, slides only half done.","Last update":"2026-05-20","Next milestone":"2026-06-04"},
  {"Project":"Vendor portal migration","Update notes":"Blocker: API keys still not provisioned by IT, migration stalled.","Last update":"2026-06-01","Next milestone":"2026-06-18"},
  {"Project":"Q3 budget review","Update notes":"Draft circulated, waiting on two department replies.","Last update":"2026-05-25","Next milestone":"2026-06-09"},
  {"Project":"Website copy refresh","Update notes":"Paused while we finalize brand voice.","Last update":"2026-05-21","Next milestone":"2026-06-30"},
  {"Project":"Onboarding kit v2","Update notes":"On track, first draft done, reviewing this week.","Last update":"2026-05-31","Next milestone":"2026-06-20"},
  {"Project":"Newsletter relaunch","Update notes":"Kickoff done, schedule agreed.","Last update":"2026-06-02","Next milestone":"2026-07-10"}
]
```

Set `{{TODAY}}` to `2026-06-02`. You should get the Day 1 standup above.

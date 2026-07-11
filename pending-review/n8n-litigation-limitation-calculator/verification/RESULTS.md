# Date-math verification results

The deadline engine's date logic lives in `engine-core.mjs`, which is the same code
the workflow's "Calculate Matter Deadlines" node runs (inside n8n, `DateTime` is a Luxon
global; here it is imported). `date-math-check.mjs` runs that logic against hand-computed
expected dates.

Run it yourself:

```
npm install luxon
node verification/date-math-check.mjs
```

## What each case proves

| Case | Scenario | Expected |
|------|----------|----------|
| 1 | Basic 2-year period, anniversary convention. 2024-06-20 + 2y lands on Saturday 2026-06-20 | Raw 2026-06-20, rolled forward to Monday 2026-06-22; ultimate period suppressed because the trigger was discovery, not the act |
| 2 | Leap-year. 2024-02-29 + 2y has no Feb 29 in 2026 | Luxon caps to 2026-02-28; 15-year ultimate (act trigger) caps to 2039-02-28 |
| 3 | Procedural count and anchor gating. Served Monday 2026-06-22 (trigger type = service date), defence due in 20 days | Raw 2026-07-12 (Sunday), rolled forward to Monday 2026-07-13; and because a service date is not a valid limitation anchor, the limitation is NOT computed, a "Limitation (review needed)" note stands in |
| 4 | Reminders. 90/30/7 days before a deadline, with weekend roll-back and past-drop | 30-day reminder on Saturday 2026-05-23 rolls back to Friday 2026-05-22; past reminders are dropped |
| 5 | Validation. Unknown jurisdiction, unknown claim type, invalid date | Each throws a clear, named error instead of guessing a period |
| 6 | Roll helpers in isolation | Saturday rolls forward to Monday; a midweek statutory holiday (Canada Day) rolls forward to the next working day; reminders roll back to the prior Friday |
| 7 | Anchor gating. Trigger type = filing date, no service date | No limitation date is produced; the only output is a dateless "Limitation (review needed)" note that names the anchor to use. This is the fix for the anti-conservative anchor bug |
| 8 | Holiday coverage. Discovery 2026-06-20 + 2y lands in 2028, past the test holiday list | The deadline still rolls off weekends, and the row carries a holiday-coverage warning naming the year the list must be extended to |
| 9 | Missing procedural rule. British Columbia served date, no BC procedural rule configured | The limitation still computes from the valid discovery anchor, and a "Procedural (none configured)" note is emitted instead of silently producing nothing |

## Conventions used

- **Anniversary convention** for year-based limitation periods: the deadline is the same
  calendar date N years later (Luxon `plus({ years: N })`), which caps Feb 29 to Feb 28 in
  non-leap years.
- **Day counting** for procedural deadlines: `plus({ days: N })` from the anchor date, which
  counts the day after the anchor as day one (the common rules-of-court convention).
- **Business-day roll**: filing deadlines roll forward off weekends and listed holidays;
  reminders roll backward to the prior working day so an alert never lands after the date it
  warns about. Both the raw statutory date and the adjusted date are kept on every record.
- **Limitation anchor gating**: every rule in the table is discovery-basis, so the limitation
  is only measured from a `Date of discovery` or `Date of loss / act or omission` anchor. A
  service or filing date falls after discovery, so measuring a limitation from it would
  overstate the time remaining; those anchors produce a review note, not a date, while any
  procedural deadline still computes from the service date.
- **Holiday coverage**: the holiday list is a starter set. When a deadline lands in a year the
  list does not cover, the date still rolls off weekends and the record carries a warning so the
  gap is visible rather than silent.

## Output of the last run

```
Date-math verification  (Luxon 2026-07-10)
Node v24.16.0
============================================================
PASS  1a raw anniversary date  =>  "2026-06-20"
PASS  1b raw date is a Saturday  =>  6
PASS  1c rolled forward to Monday  =>  "2026-06-22"
PASS  1d rolled flag set  =>  true
PASS  1e ultimate suppressed for discovery trigger  =>  false
PASS  2a leap-year basic raw caps to Feb 28  =>  "2026-02-28"
PASS  2b ultimate emitted for act trigger  =>  true
PASS  2c ultimate raw is 2039-02-28 (15y from 2024-02-29, capped)  =>  "2039-02-28"
PASS  3a defence raw = served + 20 days  =>  "2026-07-12"
PASS  3b raw is a Sunday  =>  7
PASS  3c defence rolled to Monday  =>  "2026-07-13"
PASS  3d limitation suppressed for a service-date anchor  =>  false
PASS  3e review note emitted with no calendar date  =>  true
PASS  4a three reminders kept (all future)  =>  3
PASS  4b 90d reminder  =>  "2026-03-24"
PASS  4c 30d reminder rolled back to Friday  =>  "2026-05-22"
PASS  4d 7d reminder  =>  "2026-06-15"
PASS  4e past reminders dropped, only 7d kept  =>  ["7d"]
PASS  5a unknown jurisdiction throws  =>  threw "No limitation rules found for jurisdiction"
PASS  5b unknown claim type throws  =>  threw "No limitation rule for claim type"
PASS  5c invalid trigger date throws  =>  threw "not a valid date"
PASS  6a rollForward off Saturday lands Monday  =>  "2026-06-22"
PASS  6b rollForward off Canada Day (Wed holiday) lands Thursday  =>  "2026-07-02"
PASS  6c rollBackward off Saturday lands Friday  =>  "2026-05-22"
PASS  7a no limitation date from a filing anchor  =>  false
PASS  7b review note present with a null date  =>  null
PASS  7c review note tells the user which anchor to use  =>  true
PASS  7d every row is dateless (nothing lands on a calendar)  =>  true
PASS  8a basic period lands in 2028  =>  "2028"
PASS  8b holiday-coverage warning is set  =>  true
PASS  9a limitation still computed for a valid discovery anchor  =>  true
PASS  9b missing procedural rule is flagged, not silent  =>  true
============================================================
32 passed, 0 failed
```

# Litigation limitation and deadline calculator (n8n template)

Calculate the applicable limitation period and downstream procedural deadlines for a
litigation matter from a single intake form, then write them to a calendar, log them, and
post staggered reminders. The dates are computed from an editable, jurisdiction-aware rules
table with Luxon, and every deadline records the exact rule that produced it.

> **Not legal advice.** This template is a scheduling aid. Limitation and procedural rules
> change and have many exceptions (discoverability, notice periods, suspensions, parties under
> disability, and more). Verify every date against the current statute and rules of court
> before relying on it.

## What it does

- Takes a trigger event (date of loss, discovery, service, or filing) and a jurisdiction.
- Computes the basic limitation period from a discovery or loss/act anchor, the ultimate
  limitation period where one applies, and service-driven procedural deadlines. A service or
  filing date falls after discovery, so rather than understating the exposure the engine emits
  a "review needed" note pointing to the correct anchor, while still computing any procedural
  deadline from the service date.
- Applies a transparent business-day roll: filing deadlines move forward off weekends and
  listed holidays; reminders move back to the prior working day so an alert never lands after
  the date it warns about. Both the raw statutory date and the adjusted date are kept.
- Creates an all-day calendar event for each deadline and one for each staggered reminder
  (90, 30, and 7 days out by default).
- Appends one row per deadline to a Google Sheets register.
- Posts a single plain-language summary to Slack and emails it through Gmail, each citing the
  rule applied.

## How it works

```
Receive Matter Intake Form
  -> Set the Rules Table                       single config node
  -> Calculate Matter Deadlines                matches the rule, computes dates, cites it
     -> Append Deadline to Matter Log          Google Sheets register (dated rows and notes)
     -> Only Dated Deadlines -> Create Deadline Event in Calendar
     -> Split Reminders Into Rows -> Create Reminder Event in Calendar
     -> Build Deadline Summary -> Post to Slack + Email to lawyer
```

The engine emits one record per deadline. Each record carries the matter details, the
deadline type, the computed date, the raw statutory date, whether it was rolled, the days
remaining, the rule citation, and the reminder dates. Where a date cannot be produced (a
service or filing anchor for the limitation, or a served date with no procedural rule for the
jurisdiction), it emits a dateless "review needed" note instead, which is logged and included
in the summary but filtered out of the calendar. A deadline landing in a year the holiday list
does not cover still rolls off weekends and carries a warning naming the year to extend to.

## Jurisdictions in the default rules table

Illustrative defaults are included for Ontario, British Columbia, Alberta, Saskatchewan,
Manitoba, Nova Scotia, New Brunswick, the federal Crown, and Quebec, across common claim
types (general civil, personal injury and motor vehicle, contract, property damage,
defamation, municipal slip and fall, professional negligence). Ontario ships with a worked
procedural example (statement of defence due 20 days after service). These are starting
points to confirm and extend, not a substitute for checking the source.

## Date logic and verification

- **Anniversary convention** for year-based periods: the deadline is the same calendar date N
  years later, which caps February 29 to February 28 in non-leap years.
- **Day counting** for procedural deadlines counts the day after the anchor date as day one.
- **Business-day roll** uses an editable holiday list.

The `verification/` folder contains a harness that runs the engine's exact date logic against
hand-computed expected dates (anniversary roll, leap year, procedural counting, reminder
roll-back, past-reminder drop, and validation errors).

```bash
npm install
npm run verify
```

See [verification/RESULTS.md](verification/RESULTS.md) for the cases and the latest output.

## Requirements

- An n8n instance (cloud or self-hosted).
- Credentials for Google Calendar, Google Sheets, Gmail, and Slack.
- A Google Sheet for the deadline log, with a header row matching the columns the log node
  writes (Matter, Client, Jurisdiction, Claim type, Deadline type, Deadline, Due date,
  Statutory date, Rolled, Days until, Rule cited, Basis, Calculated from).

## Setup

1. Import `workflow.json` into n8n.
2. Open each Google, Slack, and Gmail node and select your credentials.
3. Open **Set the Rules Table** and replace the placeholders:
   `calendarId`, `logSpreadsheetId`, `logSheetName`, `slackChannel`, `fallbackNotifyEmail`.
4. Review `limitationRules`, `proceduralRules`, and `holidays`, and adjust them for the
   jurisdictions you practise in.
5. Open the form trigger to get its URL, submit a test matter, and confirm the calendar,
   sheet, Slack, and email outputs.
6. Recommended: set a workflow-level error workflow in n8n so any failure is surfaced rather
   than missed.

## Customizing

Everything a user changes lives in the **Set the Rules Table** node:

- `limitationRules`: jurisdiction to claim type to `{ years, ultimateYears, basis, citation, note }`.
- `proceduralRules`: jurisdiction to a list of `{ name, fromEvent, days, citation }`.
- `holidays`: ISO dates used by the business-day roll.
- `reminderOffsets`: days before each deadline to place a reminder (default `90,30,7`).
- `rollDeadlinesToBusinessDay`, `rollRemindersBackToBusinessDay`: toggle the roll behaviour.
- `timezone`: the zone used for all date math (default `America/Toronto`).

## License

MIT. See [LICENSE](LICENSE). Copyright (c) 2026 Kevin Yu (https://github.com/exekyute).

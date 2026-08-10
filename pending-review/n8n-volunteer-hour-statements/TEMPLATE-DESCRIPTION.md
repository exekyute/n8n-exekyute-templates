Volunteer hours sit in a spreadsheet all year, and then a grant report asks what they were worth. On the 1st of each month this workflow reads a verified hours ledger in Google Sheets, emails every volunteer a statement of their previous month, and sends the coordinator one program total with the in-kind dollar value. A log row per period keeps a re-run from emailing the roster twice.

## Who's it for

Volunteer coordinators at small organizations who track hours in a spreadsheet and report an in-kind match to funders: food banks, community associations, festivals, sports clubs, anyone whose recognition email is currently written by hand.

## How it works

A Schedule Trigger fires monthly and a Set node derives the period as the previous calendar month with Luxon, never a rolling 30 days. A Data Table lookup on the period key runs before anything is sent, and an IF node ends the run when that period was already issued. A second Data Table supplies the in-kind hourly rate, the milestone thresholds, and the zero-hour policy. A Code node groups ledger rows per volunteer into period hours, year-to-date hours, milestone progress, and dollar value, then builds inline styled HTML. A loop sends one Gmail per volunteer, and a failing address continues rather than ending the run. The coordinator receives a totalled summary and one row is appended to the issued log.

## How to set up

1. Import the workflow. It arrives inactive.
2. Create two Data Tables in the same project. Volunteer Statement Config holds in_kind_hourly_rate, milestone_thresholds, include_zero_hour_volunteers, and rate_note, with exactly one row. Volunteer Statements Issued Log holds period_key, period_start, period_end, volunteers_emailed, total_period_hours, total_in_kind_value, and issued_at.
3. Replace the four placeholders in the Workflow Configuration node: ledger spreadsheet id, tab name, coordinator email, and organization name.
4. Give the ledger tab these columns: date, volunteer name, email, hours, activity.
5. Assign Google Sheets and Gmail credentials.
6. Run once by hand with your own address in the ledger, then activate.

## Requirements

A Google account with the hours ledger (read access is enough), a Gmail account to send from, and an in-kind hourly rate your funder will accept.

## Good to know

The rate is deliberately not hardcoded. US organizations usually cite the Independent Sector value of volunteer time, which is updated every year, while Canada has no single official figure and organizations use a provincial living wage or a role based replacement cost. Dates are compared as text, so the ledger needs ISO dates: 8/1/2026 gets skipped. The tab should hold approved entries only, since no status column is read. The issued-log gate is per period, not per volunteer, so a run that dies mid-roster logs nothing and the retry re-emails everyone.

## How to customize

Set milestone_thresholds as a comma-separated list; they are tested against year-to-date hours and default to 25, 50, 100. Turn on include_zero_hour_volunteers to reach volunteers with a year-to-date balance but no hours this period. Edit the statement wording in the compute Code node, keeping the styles inline because most email clients strip a style block. Change the yearStart line for fiscal-year reporting.

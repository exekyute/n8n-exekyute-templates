Cohort programs that certify on attendance usually find out someone missed the bar when the certificate list gets assembled, which is too late to do anything about it. This workflow turns a QR code on the door into a check-in kiosk: participants type only their email, the scan is logged and deduped, and Slack gets an alert the moment the attendance threshold becomes mathematically unreachable.

## Who's it for

Anyone running a cohort program with an attendance requirement: training providers, safety and apprenticeship certification, multi-week workshop series, membership programs with a participation minimum. Also anyone whose door is bottlenecked by a paper sign-in sheet.

## How it works

A QR code opens the form on the production URL with the session code prefilled, so participants type only their email. A Set node normalizes the email and builds an email plus session code key. A Data Table rowNotExists check screens double scans and sends repeats to their own completion screen. First scans are matched against the roster tab, tagged REGISTERED or WALK_IN, and appended to the Check-Ins tab with a timestamp, then the key is recorded in the Data Table. The cohort schedule is read, this participant's full history is pulled back, and a Code node counts attended sessions, required sessions, and required sessions still ahead. If even perfect attendance from here falls short of the threshold, Slack gets an alert naming the person and the shortfall. Every branch ends on a completion screen so the kiosk browser never hangs.

## How to set up

1. Import the workflow. It arrives inactive.
2. Create a Data Table named session_checkin_dedupe with columns checkin_key, email, session_code, checked_in_at.
3. Build the spreadsheet with three tabs: Cohort Roster (email, name, cohort), Cohort Schedule (cohort, session_code, session_date, required), Check-Ins (checked_in_at, email, name, cohort, session_code, status).
4. In Workflow Configuration set the spreadsheet ID, the three tab names, the Slack channel ID, and certification_threshold, which defaults to 0.8.
5. Assign the Google Sheets credential to the three Sheets nodes and the Slack credential to the alert node, then invite the bot to that channel.
6. Activate, then build QR codes on the production form URL with ?session_code=YOUR_CODE appended.
7. Scan one code yourself and check the Sheet row, the Data Table entry, and the confirmation screen.

## Requirements

A Google account with write access to the spreadsheet, a Slack workspace with an app that has chat:write, and an n8n version with the Data Table node. The n8n instance has to be reachable from participants' phones on the venue network, because the form opens in their own browser.

## Good to know

Query parameter prefill works on the production form URL only. The test URL ignores it and records blank session codes. Attendance history comes from the Data Table rather than the Check-Ins tab, so clearing that table resets everyone's math while the Sheet log survives. History is filtered by email alone, so session codes have to be unique across cohorts. Sessions ahead are strictly later than today, so the session being scanned into does not count as reachable. Walk-ins are logged but never alert, since the check needs a roster match.

## How to customize

certification_threshold is a fraction, so use 0.75 and not 75. Switch Route Unreachable Certification from the boolean flag to a number condition on current_pct or remaining_required for an earlier warning. Add a date segment to checkin_key if a session code repeats across dates. Kiosk wording lives in the kiosk_message strings and the two completion screens.

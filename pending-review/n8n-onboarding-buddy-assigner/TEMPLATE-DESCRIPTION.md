A new joiner fills in a three field form and comes out paired with an onboarding buddy from a Google Sheets mentor pool, introduced to them by email with the program coordinator copied. Mentee load is recounted from the pairings history on every submission rather than tracked in a counter column, so nothing drifts when a run fails partway through. If every eligible mentor is full, the joiner is written to the sheet as waitlisted and told that plainly instead of being handed a pairing that does not exist.

## Who it is for

People ops, program coordinators, and team leads who run a buddy or mentor program off a spreadsheet and are currently assigning by hand.

## How it works

- The form collects full name, work email, and team or cohort. One Set node holds the spreadsheet id, the coordinator email, and the coordinator Slack channel id, and every node that needs one of those reads it by expression.
- Both tabs are read fresh: the Mentors tab for the pool, the Pairings tab for history.
- A Code node counts each mentor's rows with status active, drops anyone on leave or already at capacity, filters to the joiner's cohort, and falls back to the full eligible pool if that cohort has nobody free. Ranking is fewest active mentees first, then the oldest last_assigned timestamp.
- Every submission appends a row to the Pairings tab, status active for a match and status waitlisted otherwise, so one tab is the whole history.
- Match: the mentor's last_assigned is stamped, one plain text intro email goes to mentor and joiner together with the coordinator on cc, the mentor gets a Slack DM, and the joiner sees a completion page naming their buddy.
- No match: the coordinator channel gets an alert with the joiner's details, and the joiner sees a waitlist page rather than a generic thank you.

## Requirements

- A Google account with write access to the buddy program spreadsheet.
- A Mentors tab with mentor_name, email, slack_member_id, cohort, capacity, on_leave, last_assigned, one row per email address.
- A Pairings tab with joiner_name, joiner_email, joiner_cohort, mentor_name, mentor_email, status, assigned_at.
- A Slack bot token that can DM users and post in the coordinator channel, and that is already a member of it.
- A Gmail account cleared to email mentors and new joiners.

## Set up steps

1. Import the workflow and fill the three placeholders in Workflow Configuration: spreadsheet id, coordinator email, coordinator Slack channel id.
2. Create the Mentors and Pairings tabs with the column names above. Give every mentor an email and a capacity above zero, put the raw Slack member ID in slack_member_id, and write last_assigned as an ISO timestamp since it is sorted as text.
3. Assign the Google Sheets, Gmail, and Slack credentials.
4. Submit the form once as a test joiner, check the appended Pairings row, the email, and the Slack message, then activate and share the production form URL.

Roughly fifteen minutes end to end, most of it building the two tabs.

## Customising this workflow

- Change the tie break in the Code node to weight rotation over load, or reserve headroom by testing against capacity minus one.
- Keep cross-team pairing off by using the cohort pool only, with no fallback to the wider pool.
- Add a form field by returning it from the Code node and adding a matching column to the append node.
- All wording lives in the email node, the two Slack nodes, and the two completion pages.

## Known limits

Selection takes no lock, so two submissions in the same moment can both pick the same mentor. Nothing closes a pairing automatically, so a row counts against its mentor until someone edits the status. Waitlisted joiners are not revisited automatically. The write back, the email, and both Slack sends continue on error, so a failure there is silent.

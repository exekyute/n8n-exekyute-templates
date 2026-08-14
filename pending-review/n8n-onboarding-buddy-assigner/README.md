# Pair new hires with onboarding buddies from a Google Sheets mentor pool using Gmail and Slack

Takes a new joiner's name, work email, and team from a short form, picks an onboarding buddy out of a Google Sheets mentor pool, and introduces the two of them in one email thread with the coordinator copied. Open mentee counts are recounted from the Pairings tab on every submission instead of being stored on the mentor row, so a run that dies halfway cannot leave a counter wrong. When every eligible mentor is at capacity the joiner gets a waitlisted row and a completion page that says so, not a pairing.

Built with n8n, plus Google Sheets, Gmail, Slack, and n8n Forms.

```
  New joiner form: name, email, team
                 v
  Read Mentors tab and Pairings tab fresh
                 v
  +------------------------------------+
  | Drop on leave, drop at capacity    |
  | Cohort pool first, else everyone   |
  | Rank fewest mentees, oldest stamp  |
  +------------------------------------+
                 v
  Append one Pairings row, then branch
     matched |             | nobody free
    (active) v             v (waitlisted)
  Stamp mentor, email      Alert coordinator
  both, DM mentor,         channel, then show
  show buddy name          the waitlist page
```

## Use it when

- Four people start on the same Monday and someone is picking buddies out of a spreadsheet by hand. Each submission recounts open mentees and hands the joiner to whoever is carrying the fewest.
- One senior mentor keeps getting picked because they sit at the top of the sheet. The tie break sorts on last_assigned, so once they are used they fall behind everyone who has not been.
- Nobody in the joiner's team has room, and neither does anyone else. The submission still gets a row with status waitlisted and the coordinator channel gets told, so the request is not lost.

## How it works

The form collects three fields and hands them to a config node holding the spreadsheet id, the coordinator email, and the coordinator Slack channel. Both tabs are read fresh, then one Code node counts active mentees per mentor, drops anyone on leave or at capacity, filters to the joiner's cohort, falls back to the full eligible pool when that cohort is empty, and ranks what is left. The outcome is appended to the Pairings tab either way, and an IF node splits the run: a match stamps the mentor, emails both sides, DMs the mentor and names the buddy on the completion page, while no match alerts the coordinator channel and shows a waitlist page.

| Stage | What happens |
|---|---|
| New Joiner Intake Form and Workflow Configuration | Collect the three fields, then hold the spreadsheet id, coordinator email, and coordinator Slack channel id |
| Fetch Mentor Roster and Fetch Open Pairings | Read the Mentors tab and the Pairings tab in full |
| Select Mentor With Cohort Fallback | Count active mentees, drop ineligible mentors, prefer the joiner's cohort, rank the rest |
| Record Pairing Or Waitlist Row and Route On Match Result | Append one row with status active or waitlisted, then split on the `matched` flag |
| Stamp Mentor Last Assigned and Send Dual Intro Email | Write the assignment time to that mentor's last_assigned cell, then email mentor and joiner together with the coordinator on cc |
| Ping Mentor In Slack and Show Pairing Confirmation | DM the mentor using slack_member_id, then name the buddy on the completion page |
| Alert Coordinator In Slack and Show Waitlist Notice | Post the no-capacity alert, then tell the joiner they are waitlisted |

I derive mentee counts from the Pairings tab every run rather than keeping a counter column on the Mentors tab, because a read, modify, write counter drifts the first time a run fails partway through.

## Requirements

- A Google Sheet you have write access to, with a Mentors tab (mentor_name, email, slack_member_id, cohort, capacity, on_leave, last_assigned) and a Pairings tab (joiner_name, joiner_email, joiner_cohort, mentor_name, mentor_email, status, assigned_at). One row per mentor email, since the last_assigned update matches on the email column.
- Every mentor row filled in properly. A missing email drops the row, a blank or non-numeric capacity reads as zero and makes that mentor permanently ineligible, last_assigned has to be an ISO timestamp because the tie break sorts it as text (an empty cell sorts first, which is right for someone never assigned), and on_leave only removes a mentor when it reads true, yes, y, or 1.
- A Slack bot token that can both DM users and post in the coordinator channel, already a member of it. slack_member_id must hold the raw member ID, not a display handle.
- A Gmail account cleared to email mentors and new joiners, and n8n (cloud or self-hosted) with Google Sheets, Gmail, and Slack credentials.

## Setup

1. Import `workflow.json` into n8n. It imports inactive; configure before activating.
2. Fill Workflow Configuration with the spreadsheet id, the coordinator email, and the coordinator Slack channel id, build both tabs with the columns above, then assign the Google Sheets, Gmail, and Slack credentials.
3. Submit the form once as a test joiner, check the Pairings row and both messages, then activate and share the production form URL.

## Known limits

- Selection takes no lock, so two submissions landing at once can both pick the same lowest-count mentor and push them one past capacity.
- Nothing ever closes a pairing. Only rows reading status active count against a mentor, ignoring case and stray spaces, so freeing capacity means a human editing the Pairings tab. Waitlisted joiners are never revisited automatically.
- The last_assigned stamp, the Gmail send, and both Slack sends continue on error, so failures are silent and never retried. An empty slack_member_id simply gets no ping.
- The form answers from the last node, so the joiner waits through the Sheets writes, the email, and Slack before the completion page renders. Both tabs are read in full on every submission, and timestamps are UTC.

## Customize

- The rank function in Select Mentor With Cohort Fallback sorts on fewest active mentees, then oldest last_assigned. Reverse the two comparisons to weight rotation over load.
- Cohort matching in that node is exact equality after lowercasing. To refuse cross-team pairing entirely, always use `sameCohort` instead of falling back to the full eligible pool.
- Reserve headroom by editing the `mentor.active < mentor.capacity` test, for example `mentor.active < mentor.capacity - 1`.
- Adding a form field takes two more edits: the object the Code node returns, and a column in Record Pairing Or Waitlist Row.
- Copy lives in Send Dual Intro Email, both Slack texts, and the two completion pages. The email is plain text.

## What is in this folder

| File | What it is |
|---|---|
| `README.md` | This overview |
| `TEMPLATE-DESCRIPTION.md` | The n8n Creator hub listing text |
| `workflow.json` | The importable n8n workflow |

---

All sample data is fictional. No real credentials, IDs, or endpoints are included.

Part of the [n8n-exekyute-templates](../../README.md) collection. MIT licensed.

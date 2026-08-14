Sweeps a departing person's future commitments out of Google Calendar and Asana into one Notion checklist, then posts the link to Slack. A coordinator submits the leaver's email and last working day, and the run returns a manifest split into items that need a new owner and items that are cancel candidates.

## Who's it for

Program coordinators, operations leads, and HR partners who run offboarding and want a written list of what a leaver still holds before their last day. Useful on any team where meetings and tasks quietly orphan after someone exits.

## How it works

- A form trigger collects the leaver email, last working day, and an optional Asana user GID.
- One Set node holds the program calendar IDs, the Asana workspace GID, the Notion parent page ID, and the Slack channel ID. Nothing is hardcoded downstream.
- The calendar list fans out one item per calendar. Each is queried for events after the last working day, up to two years out, with recurring masters kept collapsed. A Code node keeps only exact email matches on organizer or attendee, because the free text query also matches display names.
- Asana resolves the leaver by the submitted GID when one is given, and falls back to the email when that field is blank, then pulls their incomplete tasks in the configured workspace. Anything due after the last day or with no due date at all is kept.
- Both streams merge and get bucketed: organizer seats, recurring events, and dated tasks go to needs a new owner, while attendee-only invites and undated tasks go to cancel candidates.
- A Notion child page is created and the checklist is appended in chunks of 100 blocks, Notion's per call cap, paced at one request per 400 ms.
- Slack receives the manifest link with counts, or a clean sweep notice when nothing was found.

## Requirements

- A Google Calendar credential that can read the program calendars. IDs are entered as raw IDs in a comma separated list, with no picker and no lookup by name.
- An Asana personal access token that can see the leaver's assigned tasks, plus the workspace GID to search.
- A Notion integration shared with a parent page. The parent must be a page, not a database.
- A Slack app already in the destination channel, addressed by channel ID.

## How to set up

1. Import the workflow. It arrives inactive.
2. In Workflow Configuration, set programCalendarIds (comma separated), asanaWorkspaceGid, notionParentPageId, and slackChannelId.
3. Connect the Google Calendar, Asana, Notion, and Slack credentials.
4. Submit the form once for someone who has already left, read the manifest for false positives, then activate.

## How to customize the workflow

- Change timeMax on Fetch Future Events Per Calendar to narrow the two year lookahead.
- Set recurringEventHandling to all occurrences when you want per-instance detail instead of one line per series.
- Adjust the bucketing in Keep Exact Leaver Matches and Keep Future Or Undated Tasks to match how your team treats attendee-only invites and undated tasks.
- Edit the checklist wording, the RECURRING prefix, and both section headings in Bucket Findings For Handover.
- Both Slack messages are plain text with link unfurling off, so rewrite the text fields for your channel.

## Known limits

Nothing is written back: no event is cancelled and no task reassigned. Each run creates a new Notion page with no dedup, only the listed calendars are swept, and matching is exact against the submitted address.

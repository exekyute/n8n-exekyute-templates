# Sweep departing staff commitments from Google Calendar and Asana into a Notion checklist and Slack

Takes a leaver's email and last working day, sweeps the configured program Google Calendars and one Asana workspace for every commitment still standing after that date, and writes the result to a new Notion page as a checklist with a Slack link. Each finding lands in one of two sections: organizer seats, recurring events, and dated tasks go to needs a new owner, while attendee-only invites and undated tasks go to cancel candidates. Nothing is written back to Calendar or Asana, so the manifest is the entire output.

Built with n8n, plus Google Calendar, Asana, Notion, and Slack.

```
      Intake (leaver email, last working day)
      +-----------+-----------+
      v                       v
      Program calendars       Asana workspace
      events after last day   open assigned tasks
      +-----------+-----------+
                  v
         Bucket every finding
      +-----------+-----------+
      v                       v
      organizer, recurring,   attendee only,
      or dated task           or no due date
      (needs a new owner)     (cancel candidate)
      +-----------+-----------+
                  v
    found -> Notion checklist page,
             Slack link with counts
  nothing -> Slack clean sweep notice
```

## Use it when

- A last day is three weeks out and nobody has written down what the person still holds. One form submission returns a dated list of their future meetings and open tasks on a single page.
- The leaver runs a standing biweekly meeting. The recurring master is flagged `RECURRING` and filed under needs a new owner, instead of sitting in the pile of invites somebody will just decline.
- An Asana task is open with no due date. It files as a cancel candidate, which forces a decision before the account is deactivated and the task goes quiet.

## How it works

The form hands leaver email, last working day, and an optional Asana GID to one config node, then the run forks. One side splits the comma separated calendar list into one item per calendar and queries each for events between the end of the last working day and two years out, then keeps only exact email matches on organizer or attendee. The other side resolves the Asana user and pulls their open tasks in the configured workspace, keeping anything due after the last day or with no due date at all. Both streams merge, get bucketed and rendered as Notion blocks, and route on whether anything was found. When something was, a manifest page is created and the checklist appended in chunks of 100 blocks before Slack gets the link and the counts.

| Stage | What happens |
|---|---|
| Departure Intake Form and Workflow Configuration | Collect leaver email, last working day, and an optional Asana GID, and hold `programCalendarIds`, `asanaWorkspaceGid`, `notionParentPageId`, `slackChannelId` |
| Expand Program Calendar List and Fetch Future Events Per Calendar | Split the calendar list into one item each, then pull events per calendar from the end of the last working day forward, recurring masters collapsed |
| Keep Exact Leaver Matches | Drops the free text query's near misses, since it also matches display names, and buckets what survives |
| Resolve Leaver Asana User, Fetch Open Leaver Tasks, Keep Future Or Undated Tasks | Turn the submitted GID, or the email when that field is blank, into an Asana user, read their incomplete tasks in one workspace, and drop anything due on or before the last working day |
| Merge Sweep Findings and Bucket Findings For Handover | Join both streams and build the intro line, two section headings, and one checkbox per finding |
| Route Empty Sweep, Post Clean Sweep Notice To Slack, Create Handover Manifest Page | A zero-finding sweep posts the clean sweep notice, otherwise a child page is created under the Notion parent |
| Chunk Checklist Into Notion Batches, Append Checklist Chunk To Manifest, Collapse Appends To Single Summary, Post Manifest Link To Slack | Append the blocks 100 at a time, Notion's per call cap, collapse to one summary carrying the page URL and counts, then post the link |

I keep recurring masters collapsed rather than expanded, because one standing weekly meeting would otherwise bury every genuine one-off commitment under a hundred identical checkboxes.

## Requirements

- A Google account that can read the program calendars. Calendar IDs go in as raw IDs in a comma separated list, with no picker and no lookup by name.
- An Asana personal access token belonging to someone who can see the leaver's assigned tasks, since tasks are pulled by assignee GID within one configured workspace GID.
- A Notion integration shared with the parent, and the parent has to be a page rather than a database. The manifest is a child page filled by a direct block append.
- A Slack app already in the destination channel. Both Slack nodes post by channel ID and nothing here invites the app.
- n8n (cloud or self-hosted) with Google Calendar, Asana, Notion, and Slack credentials.

## Setup

1. Import `workflow.json` into n8n. It imports inactive; configure before activating.
2. Fill in Workflow Configuration with `programCalendarIds` (comma separated), `asanaWorkspaceGid`, `notionParentPageId`, and `slackChannelId`, then assign the four credentials.
3. Submit the form once for someone who has already left, read the manifest for false positives, then activate.

## Known limits

- Nothing is written back: no event is cancelled and no task reassigned. Each submission also creates a new Notion page with no dedup, so sweeping the same person twice leaves two manifests.
- Only the listed calendar IDs are queried, so the leaver's own calendar never surfaces, and an unreadable calendar is skipped rather than failing, which quietly narrows a sweep after a typo in the ID list. Matching is exact against the submitted address, so alias and group invites are passed over, and Asana coverage stops at tasks assigned inside the one workspace, missing work where the leaver is only a follower.
- Resolve Leaver Asana User has no error branch, so a failed lookup halts the run before Notion or Slack, a mid-run append failure leaves a half-filled manifest and no Slack post, and checklist labels are cut near 1800 characters.

## Customize

- `timeMax` on Fetch Future Events Per Calendar looks two years ahead, and `recurringEventHandling` on the same node is set to first occurrence. Shorten the window when far-future bookings are noise, and switch to all occurrences for per-instance detail at the cost of manifest length.
- Keep Exact Leaver Matches sends organizer events and recurring events to needs a new owner and everything else to cancel candidates, while Keep Future Or Undated Tasks files any undated task as a cancel candidate. Change either one when an invite reads as ownership on your team, or a missing due date means unscheduled rather than abandoned.
- All checklist wording lives in Bucket Findings For Handover: the `RECURRING` prefix, both section headings, and the intro line. Each Asana finding also carries a comma separated projects string that nothing prints yet.
- Append Checklist Chunk To Manifest is paced at one request per 400 ms through batching, and both Slack nodes send plain text with link unfurling off.

## What is in this folder

| File | What it is |
|---|---|
| `README.md` | This overview |
| `TEMPLATE-DESCRIPTION.md` | The n8n Creator hub listing text |
| `workflow.json` | The importable n8n workflow |

---

All sample data is fictional. No real credentials, IDs, or endpoints are included.

Part of the [n8n-exekyute-templates](../../README.md) collection. MIT licensed.

# Auto un-publish expired YouTube videos on a schedule

Built with n8n, the native YouTube node, Google Sheets, and Slack.

![Workflow canvas](images/workflow.png)

## What it does

Keeps a Google Sheet of videos with an unpublish date and quietly takes each one down on its own date. Once a day the workflow reads the sheet, finds every video whose date has passed, and sets it to `private` or `unlisted`. It preserves the video's title and category (YouTube requires them on an update), marks the row `Expired` so it is never processed twice, and posts a Slack recap of what changed.

It is deterministic and rule-based: no AI nodes, no guessing. A row is due when its `Unpublish Date` is on or before today (in a timezone you set) and its `Status` is not already `Expired`.

## What is in this folder

| File | What it is |
|------|------------|
| `workflow.json` | The n8n workflow, ready to import. Credentials are cleared for you to reconnect. |
| `TEMPLATE-DESCRIPTION.md` | The listing description for the n8n template page. |
| `images/workflow.png` | Screenshot of the workflow canvas. |

## Setup and credentials

1. Import `workflow.json` into n8n.
2. Connect a YouTube (Google) OAuth2 credential on both YouTube nodes (`Get Current Video Details` and `Set Video to Embargo Status`).
3. Create a Google Sheet with these columns and connect a Google Sheets credential on both Sheets nodes:
   - `videoId` (the YouTube video ID, used to match the row)
   - `Unpublish Date` (a date such as `2026-08-01`)
   - `Target Status` (`private` or `unlisted`, optional, defaults to `private`)
   - `Status` (left blank; the workflow writes `Expired` here)
   - `Unpublished At` (optional; the workflow writes a timestamp here)
4. Connect a Slack credential and pick the channel for the recap on both Slack nodes.
5. Open the `Select Due Videos` node and set the `TIMEZONE` constant to your channel's timezone.
6. Activate the workflow.

## How it decides what to un-publish

- The `Select Due Videos` code step compares dates at day level in the timezone you set, so a video flips on its date in your timezone rather than the server's.
- Videos already at their target status are skipped, so no needless API writes.
- The `Status = Expired` guard means re-runs never re-process a row.

## License

MIT (c) Kevin Yu (github.com/exekyute). See [../../LICENSE](../../LICENSE).

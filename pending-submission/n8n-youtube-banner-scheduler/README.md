# Swap your YouTube channel banner on a schedule

Built with n8n, the native YouTube node, Google Sheets, and Google Drive. A date-driven workflow that swaps your YouTube channel banner from a spreadsheet schedule.

![Workflow canvas](images/workflow.png)

## What it does

The workflow runs daily and checks a Google Sheets schedule for a banner swap due today. When a row matches, it downloads the banner image from Google Drive, uploads it with the YouTube Channel: uploadBanner operation, then runs Channel: update to set the uploaded image as the active channel banner. A final Set node records what changed.

Everything is deterministic and date-driven. There are no AI nodes. A swap only fires on an exact date match, so each planned banner is applied once on its scheduled day.

## What is in this folder

| File | What it is |
| --- | --- |
| `workflow.json` | The n8n workflow, ready to import. Credentials are not included. |
| `TEMPLATE-DESCRIPTION.md` | The listing description for the template page. |
| `README.md` | This file. |
| `images/workflow.png` | Canvas screenshot (add after import). |

## Schedule sheet

The Google Sheet holds one row per planned swap:

| Column | Example | Notes |
| --- | --- | --- |
| `Swap Date` | `2026-07-12` | Plain text, `yyyy-MM-dd`. Matched against today in the workflow timezone. |
| `Banner Drive File ID` | `1AbCdEfGhIjKlMnOp` | The Google Drive file ID of the banner image. |
| `Label` | `Summer banner` | Optional. Recorded with the swap for reference. |

## Setup and credentials

1. Import `workflow.json` into n8n.
2. Connect a YouTube (Google) OAuth2 credential on both YouTube nodes.
3. Connect your Google Sheets and Google Drive credentials.
4. In `Set Banner Config`, set `channelId` to your YouTube channel ID.
5. Point `Read Banner Schedule` at your schedule spreadsheet and tab.
6. Prepare banner art at 2048x1152 px and under 6 MB, upload it to Drive, and add the file ID to the sheet.
7. The workflow ships inactive. Activate it once the credentials and schedule are in place.

## License

MIT (c) Kevin Yu ([github.com/exekyute](https://github.com/exekyute)). See [../../LICENSE](../../LICENSE).

Generate a whole library of sound effects from one Google Sheet. Add a row per sound, and this workflow turns each into an ElevenLabs MP3, saves it to Google Drive, and writes the link and status back to the row.

## Who's it for

Game and video makers, podcasters, and app teams who need many short sound effects and would rather manage them in a spreadsheet than click through a UI one sound at a time. No coding and no AI decisioning, just a deterministic batch runner you can leave on a schedule.

## How it works

- A manual run or a 15 minute schedule reads the library sheet.
- Rows whose Status is Queued or blank are selected, capped to a safe batch, and clamped to the ElevenLabs limits (duration 0.5 to 30 seconds, prompt influence 0 to 1).
- Each selected row calls the ElevenLabs sound-generation API and returns an MP3.
- The MP3 is uploaded to your Drive folder, and the row is stamped Done with its link or Failed with the reason.
- Slack receives a one line generated and failed recap.

## How to set up

Create a Header Auth credential named ElevenLabs with header name xi-api-key. Connect Google Sheets, Google Drive, and Slack. Point the three Sheets nodes at your spreadsheet, pick the Drive folder and the Slack channel, add the header row to the sheet, then run once and activate.

## Requirements

- n8n
- An ElevenLabs API key, used through the core HTTP Request node (no community node)
- Google Sheets and Google Drive OAuth2 credentials
- A Slack credential for the recap (optional)

## Good to know

Runs are idempotent: only Queued or blank rows are picked, so Done and Failed rows are never regenerated and cost is bounded by the batch size. Each ElevenLabs call bills against your own plan. An empty run does nothing and stays quiet on Slack.

## How to customize the workflow

Edit the batch size, the default prompt influence, and the duration clamps at the top of the Select Queued Batch node. Change the 15 minute schedule to any cadence, or point the recap at a different channel.

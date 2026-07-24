# Build a sound effect library from a Google Sheet with ElevenLabs

[Published n8n template](https://n8n.io/workflows/16956-build-a-sound-effect-library-with-google-sheets-elevenlabs-google-drive-and-slack/)

Keep one row per sound in a Google Sheet, and this workflow generates each one with ElevenLabs, saves the MP3 to Google Drive, and writes the link and status back to the row. Selection is rule based and idempotent: only rows whose Status is Queued or blank are picked, so a Done or Failed row is never regenerated and cost stays bounded by the batch size.

Built with n8n, plus ElevenLabs, Google Sheets, Google Drive, and Slack.

![The SFX Library Builder workflow on the n8n canvas, running from a manual or schedule trigger through batch selection, ElevenLabs generation, and a Drive upload into row write-backs and a Slack recap.](images/workflow.png)

## Use it when

- A game, video, or podcast project needs dozens of short effects, and generating them one at a time in a web UI is the bottleneck. Fill the sheet, and the batch runner works through the queue.
- You want a shared queue anyone can add to. Whoever needs a sound adds a Description row, the 15 minute schedule picks it up, and the Drive link lands back in the same row.
- One generation fails mid-batch and you do not want the whole run redone. The row is stamped Failed with the reason, and setting its Status back to Queued retries just that one.

## How it works

A manual run or the 15 minute schedule reads the whole library sheet, a Code node selects the queued batch and builds each ElevenLabs request, and every selected row ends the run as Done or Failed. An empty run does nothing and stays quiet.

| Stage | What happens |
|---|---|
| Start Manually / Every 15 Minutes | Either trigger starts a run |
| Get Queued Rows | Reads every row from the library sheet |
| Select Queued Batch | Keeps rows whose Status is Queued or blank, caps the run at a safe batch (10 by default), clamps DurationSeconds to 0.5 to 30 and PromptInfluence to 0 to 1, and builds each request |
| Generate Sound Effect | Posts the Description to the ElevenLabs sound-generation API through the core HTTP Request node and returns an MP3, retrying on a transient error |
| Upload MP3 to Drive | Saves the file to your target folder, also with retry |
| Mark Row Done / Mark Row Failed | Stamps Done with the Drive link and a timestamp, or Failed with the reason |
| Summarize Run | Counts the generated and failed rows for the recap |
| Post Recap to Slack | Posts a short recap with the generated and failed counts |

I route every generation or upload error into Mark Row Failed instead of letting the run die because a row left on Queued would be picked up and billed again on the next run; a Failed stamp with the reason keeps the queue honest.

## Requirements

- An ElevenLabs API key. It is used through the core HTTP Request node, so no community node is needed and the workflow runs on n8n Cloud too. Each generation bills against your own ElevenLabs plan.
- Google Sheets and Google Drive OAuth2 credentials (the same Google account can back both).
- A Slack credential for the recap (optional).
- n8n (cloud or self-hosted).

## Setup

1. Import `workflow.json` into n8n. It imports inactive; configure before activating.
2. Create a Header Auth credential named ElevenLabs with header name `xi-api-key` and your key as the value, then select it on "Generate Sound Effect". The key is never stored in the workflow.
3. Assign a Google Sheets credential to "Get Queued Rows", "Mark Row Done", and "Mark Row Failed", and pick your spreadsheet and tab.
4. Assign a Google Drive credential to "Upload MP3 to Drive" and pick the target folder.
5. Assign a Slack credential to "Post Recap to Slack" and pick the channel.
6. Add the header row below to your sheet, fill a few Description rows, run once by hand, then activate.

## The library sheet

One row per sound. Create these headers in row 1:

| Column | Holds |
|---|---|
| Description | The sound-effect prompt (you fill this) |
| DurationSeconds | Optional, 0.5 to 30, blank lets ElevenLabs choose |
| PromptInfluence | Optional, 0 to 1, default 0.3 |
| Status | Queued or blank to generate; the workflow sets Done or Failed |
| Link | The Drive link, written on success |
| Notes | The error reason, written on failure |
| GeneratedAt | Timestamp of the last attempt |

## Customize

- Change the batch size, the default prompt influence, and the duration clamps at the top of "Select Queued Batch".
- Change the 15 minute schedule to any cadence, or run it only by hand. On a schedule, keep the interval longer than one batch's worst-case run time so a new run does not start while the previous one is still generating the same queued rows.
- Point the recap at a different channel, or remove the Slack step if you do not want a recap.

## What is in this folder

| File | What it is |
|---|---|
| `README.md` | This overview |
| `TEMPLATE-DESCRIPTION.md` | The n8n Creator hub listing text |
| `workflow.json` | The importable n8n workflow |
| `images/workflow.png` | The workflow on the n8n canvas |

---

All sample data is fictional. No real credentials, IDs, or endpoints are included.

Part of the [n8n-exekyute-templates](../../README.md) collection. MIT licensed.

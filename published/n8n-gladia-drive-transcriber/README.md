# Transcribe new audio files from Google Drive using Gladia and Google Sheets

[Published n8n template](https://n8n.io/workflows/16955-transcribe-google-drive-audio-to-markdown-with-gladia-and-google-sheets/)

Watch a Google Drive folder, transcribe every new audio or video file with Gladia, save the transcript back to Drive as Markdown, and log each run to a Google Sheet. Gladia transcribes asynchronously, so the workflow polls the job on a timer instead of blocking, and one config node holds the poll interval and the attempt limit.

Built with n8n, plus Gladia, Google Drive, and Google Sheets.

![The Gladia Drive transcriber workflow on the n8n canvas, running from a Drive trigger through upload, transcription, and a polling loop into a saved Markdown transcript and a Sheets log.](images/workflow.png)

## Use it when

- Recordings pile up in a Drive folder and never become text. Drop a file in and a transcript appears in a second folder without you clicking anything.
- You are building a searchable archive of interviews or calls. The transcripts are plain Markdown with speaker-labelled lines, so Drive search finds what was said.
- Files arrive while nobody is watching. Every run lands in the log sheet as Transcribed or Failed with a reason, so a bad upload does not vanish silently.

## How it works

A new file in the watched folder starts the run. The file is downloaded into binary and posted to Gladia's upload endpoint, because a Drive file is not public and cannot be passed as a link. Gladia starts an asynchronous transcription job, the workflow polls it until the job is done or the attempt limit runs out, and the result is written to Drive and the log sheet.

| Stage | What happens |
|---|---|
| Google Drive Audio Trigger | Fires when a new audio or video file lands in the watched folder |
| Prepare Config Values | Sets `wait_seconds` and `max_attempts` for the polling loop |
| Download File from Drive | Pulls the file into binary so it can be uploaded |
| Upload Audio to Gladia | Posts the bytes to the Gladia upload endpoint, which returns a private audio URL |
| Start Transcription Job | Starts an asynchronous pre-recorded transcription and returns a job id |
| Wait for Processing / Get Transcription Result / Route by Status | Waits, fetches the job, and routes on status, looping until done or out of attempts |
| Build Transcript File / Save Transcript to Drive | Builds a Markdown transcript with speaker-labelled lines, or the full text when no utterances come back, then saves it to the transcripts folder |
| Log Transcript in Sheets / Log Failure in Sheets | Appends a Transcribed row with a link, or a Failed row with the reason |

I send every API error and timeout through the same log sheet as the successes because an unattended folder fails quietly, and a Failed row with a reason is the only trace you get.

## Requirements

- A Gladia account and API key. Transcription is billed per minute of audio, so check your plan before pointing this at a large batch.
- A Google account with a watched Drive folder, a destination folder for transcripts, and a spreadsheet for the log.
- n8n (cloud or self-hosted) with Google Drive and Google Sheets credentials.

## Setup

1. Import `workflow.json` into n8n. It imports inactive; configure before activating.
2. Create a Header Auth credential named `Gladia` with header name `x-gladia-key` and your Gladia API key. The three Gladia HTTP nodes use it.
3. Connect a Google Drive credential. Set the watched folder on "Google Drive Audio Trigger" and the destination folder on "Save Transcript to Drive".
4. Connect a Google Sheets credential and pick the spreadsheet and tab on both "Log Transcript in Sheets" and "Log Failure in Sheets".
5. Adjust `wait_seconds` or `max_attempts` in "Prepare Config Values" if you need to, then run it once with a short test file and activate.

## The config node

Everything you tune lives in the "Prepare Config Values" Set node:

| Field | Default | What it controls |
|---|---|---|
| `wait_seconds` | 15 | How long to wait between each poll of the Gladia job |
| `max_attempts` | 40 | How many polls before the run gives up and logs a timeout |

The defaults give a 10 minute ceiling per file. Longer recordings take longer to transcribe, so raise `max_attempts` if you work with long files.

## The log sheet

Both the success and failure paths append to the same sheet, so it doubles as an audit trail. The columns are Timestamp, Source File, Duration (s), Status, Transcript Link, and Detail. A successful run writes Transcribed with a link to the transcript file; a failed run writes Failed with the reason.

## Customize

- Point "Google Drive Audio Trigger" at any folder that receives audio or video. It reads every new file in the folder, so keep it dedicated to recordings.
- Change the transcript layout or the file format in "Build Transcript File".
- Enable Gladia features like diarization or translation in the "Start Transcription Job" request body.
- Add a Slack node after "Log Transcript in Sheets" to get a ping when a transcript is ready.

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

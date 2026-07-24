# Translate an audio recording into a target-language transcript using Gladia and Google Drive

[Published n8n template](https://n8n.io/workflows/17139-translate-audio-transcripts-with-gladia-google-drive-and-google-sheets/)

Submit a form with a link to a recording and a target language code, and get back a Markdown file holding both the original transcript and its translation, saved to Google Drive and logged in a Google Sheet. Gladia transcribes and translates in a single pre-recorded call, with the source language auto-detected, so there is no separate translation step to configure.

Built with n8n, plus Gladia, Google Drive, and Google Sheets.

![The Gladia audio translator workflow on the n8n canvas, running from a form trigger through the Gladia translation call and a polling loop into Google Drive and Google Sheets.](images/workflow.png)

## Use it when

- A recording lands on your desk in a language you do not read, and making it readable normally means chaining a transcription tool and a translation tool. Here it is one form submission.
- You collect multilingual voicemails, interviews, or field audio and want each one archived as a bilingual file with a log row you can search later.
- You are publishing a clip in a second language and need the original transcript next to the translation so someone can check it.

## How it works

The form takes a publicly reachable audio or video URL and a target language code such as `en` or `fr`. The URL must be public because Gladia fetches it directly. The workflow starts the Gladia job, polls it on a timer until it finishes or times out, then writes the result to Drive and the log sheet.

| Stage | What happens |
|---|---|
| When Translation Requested | Collects the media URL and the target language code from the form |
| Prepare Config Values | Holds the poll interval and attempt limit, and normalizes the form inputs |
| Start Gladia Translation | Sends the URL to Gladia with transcription and translation enabled; source language is auto-detected |
| Wait for Processing | Pauses `wait_seconds` between polls |
| Get Translation Result | Fetches the job from Gladia |
| Route by Status | Loops back while the job runs, and stops after `max_attempts` polls |
| Build Translation File | A Code node builds a Markdown file with the original transcript and the translation |
| Save Translation to Drive | Saves the file to your Drive folder |
| Log Translation in Sheets | Appends a Translated row with a link to the file |
| Log Failure in Sheets | Any API error or timeout writes a Failed row with a reason, so nothing is lost silently |

I run transcription and translation as one Gladia call because the file that comes back holds both languages side by side, with no second API and no second bill to wire up.

## Requirements

- A Gladia account and API key. Gladia bills by audio duration beyond its free allowance, so check your plan before large batches.
- A Google account with a Drive folder for the translation files and a spreadsheet for the log.
- n8n (cloud or self-hosted) with Header Auth, Google Drive, and Google Sheets credentials.

## Setup

1. Import `workflow.json` into n8n. It imports inactive; configure before activating.
2. Create a Header Auth credential named `Gladia` with header name `x-gladia-key` and your Gladia API key. It is used by both Gladia HTTP nodes, "Start Gladia Translation" and "Get Translation Result".
3. Connect a Google Drive credential and set the destination folder on "Save Translation to Drive".
4. Connect a Google Sheets credential and pick the spreadsheet and tab on both "Log Translation in Sheets" and "Log Failure in Sheets".
5. Open the form URL on "When Translation Requested", submit a public media URL, and check the Drive file and the log row.

## The config node

Everything you tune lives in one Set node, "Prepare Config Values":

| Field | What it controls |
|---|---|
| `wait_seconds` | Seconds between each poll of the Gladia job. Default 10. |
| `max_attempts` | Polls before the run gives up and logs a timeout. Default 60, which with the 10 second wait makes a 10 minute ceiling per file. |

The media URL and the target language come from the form and are normalized here, so the rest of the workflow reads clean values.

## The log sheet

Both the success and failure paths append to the same sheet, so it doubles as an audit trail. The columns are Timestamp, Media URL, Detected Language, Target Language, Status, Translation Link, and Detail. A successful run writes Translated with a link to the file, and a failed run writes Failed with the reason.

## Customize

- **Long recordings.** Raise `max_attempts` in "Prepare Config Values"; the default gives up after about 10 minutes.
- **Trigger.** Swap the form for a webhook, or a schedule that reads URLs from a sheet.
- **More languages.** Request several target languages at once in the translation config on "Start Gladia Translation", then extend "Build Translation File", which currently reads only the first translation result.
- **File layout.** The Markdown structure is assembled in "Build Translation File"; reword it there.
- **Notifications.** Add a Slack or Gmail node after "Log Translation in Sheets" to hear when a translation is ready.

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

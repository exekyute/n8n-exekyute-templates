# Transcribe recordings into speaker-labeled notes using Gladia and Google Drive

[Published n8n template](https://n8n.io/workflows/17138-transcribe-speaker-labeled-recordings-with-gladia-google-drive-and-slack/)

Paste a public link to a call, interview, or meeting recording and get back a clean transcript that marks who spoke and when. I built this because the useful part of a recording is usually "who said what", and most tools either bury that or make you copy it out by hand.

Built with n8n, plus Gladia, Google Drive, and Slack.

![The speaker transcript workflow](images/workflow.png)

## How it works

You submit a form with a recording URL. The workflow hands it to Gladia with diarization on, waits for the asynchronous job to finish, then formats the diarized utterances into a readable transcript and saves it to Drive.

| Stage | What happens |
|---|---|
| Form | You paste a public audio or video URL and an optional speaker count. |
| Start | An HTTP request sends the recording to the Gladia pre-recorded API with diarization enabled and gets back a job id. |
| Poll | A Wait plus HTTP request re-checks the job until Gladia returns `done`, routing `error` or a timeout to the failure path. |
| Format | A Code node groups consecutive utterances by speaker and writes lines like `Speaker 1 [00:12]: ...`, relabeling speaker 0/1/2 to Speaker 1/2/3. |
| Save and notify | The transcript is uploaded to Google Drive as a Markdown file and the link is posted to Slack. On failure, a clear reason is posted instead. |

Because it uses the core HTTP Request node against the Gladia REST API, it runs on n8n Cloud as well as self-hosted.

## Setup

1. Import `workflow.json` into n8n. It imports inactive, so configure it before using it.
2. Create a Header Auth credential named `Gladia` with header name `x-gladia-key` and your Gladia API key. Select it on both `Start Gladia Transcription` and `Get Transcription Result`.
3. Connect your Google Drive account on `Save Transcript To Drive` and pick the folder that should hold the transcripts.
4. Connect Slack on `Notify Transcript Ready` and `Report Transcription Failure` and pick a channel.
5. Open the form from the trigger node, paste a public recording URL, and submit.

## The transcript format

The point of the workflow is the readable, diarized output. `Format Speaker Transcript` walks Gladia's `result.transcription.utterances`, groups consecutive lines from the same speaker, and stamps each block with its start time:

```
Speaker 1 [00:00]: Thanks for joining today.
Speaker 2 [00:04]: Happy to be here.
```

Speaker indexes from Gladia are zero based, so the node relabels 0/1/2 to Speaker 1/2/3. If a recording comes back without diarized utterances, it falls back to the plain full transcript so nothing is lost.

## Polling and failures

Gladia is asynchronous, so the workflow starts a job and then polls. `Configure Polling` holds the two knobs: `wait_seconds` between checks and `max_attempts` before giving up (default 10 seconds times 60 attempts, about 10 minutes). Both Gladia HTTP nodes and the Drive upload use continue on error, so a transient API error or a timeout routes to Slack with a reason instead of failing silently.

## What is in this folder

| File | What it is |
|---|---|
| `README.md` | This overview |
| `TEMPLATE-DESCRIPTION.md` | The n8n Creator hub listing text |
| `workflow.json` | The importable n8n workflow |
| `images/` | The workflow overview image |

---

All sample data is fictional. No real credentials, IDs, or endpoints are included.

Part of the [n8n-exekyute-templates](../../) collection. MIT licensed.

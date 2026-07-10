# Transcribe Notion Meeting Recordings with Gladia

> **Self-hosted n8n only.** This template uses the [`n8n-nodes-gladia`](https://www.npmjs.com/package/n8n-nodes-gladia) community node, which is not available on n8n Cloud.

When a meeting recording is added to a Notion database, this workflow transcribes and summarizes it with [Gladia](https://www.gladia.io) and writes the summary and full transcript back onto the same Notion page. I built it so a meetings database quietly turns into a searchable transcript library: Notion in, Notion out, with the database staying the single source of truth.

Built with n8n, plus Gladia and Notion.

![The Gladia Notion meeting transcription workflow](images/workflow.png)

## How it works

A new row in the Notion meetings database starts the run. The recording URL is sent to Gladia, transcribed asynchronously with speaker diarization and summarization, then the results are written straight back onto the page. Transcription is a background job, so the workflow polls on a timer instead of blocking.

| Stage | What happens |
|---|---|
| When Meeting Added | A row added to the Notion meetings database triggers the run. |
| Set Run Config | One Set node holds the speaker count, poll interval, and timeout. |
| Start Transcription | The recording URL is sent to Gladia with diarization and summarization enabled. Gladia returns a job id. |
| Wait, Get, Route | The workflow waits, fetches the job, and routes on status. It loops until Gladia returns `done`, or stops after a set number of attempts. |
| Write results to Notion | On `done`, Update Meeting Page sets Status to `Transcribed` and writes the Summary, then the transcript is split into Notion-safe blocks and appended to the page. |
| Failures | Any API error or a timeout routes to Mark Failed, which sets Status to `Failed` and records the last status, so nothing fails silently. |

The async poll is the point. Gladia transcribes in the background, so the workflow checks back on a timer rather than blocking, and one config node holds the poll interval and the attempt limit.

## Setup

1. Install the community node. In n8n: **Settings, Community Nodes, Install**, then `n8n-nodes-gladia`.
2. Add a **Gladia API** credential (key from [app.gladia.io](https://app.gladia.io)) and a **Notion API** credential.
3. Open **When Meeting Added** and select your meetings database (it ships with the `REPLACE_WITH_MEETINGS_DATABASE_ID` placeholder).
4. Share that database with your Notion integration so the API can read and write it.

Credential references in `workflow.json` are placeholders, so n8n prompts you to pick your own on import.

## The config node

Everything you tune lives in one Set node, **Set Run Config**:

| Field | Default | Controls |
|---|---|---|
| `number_of_speakers` | 2 | Diarization speaker count. |
| `wait_seconds` | 10 | Poll interval between status checks. |
| `max_attempts` | 60 | Poll attempts before the run times out as failed. The default 10 seconds times 60 attempts is a 10 minute ceiling. |

Longer recordings take longer to transcribe, so raise `max_attempts` if you work with long meetings.

## Expected Notion database schema

The workflow assumes the meetings database has these columns (rename them in the nodes if yours differ):

| Property | Type | Used for |
|---|---|---|
| `Recording URL` | URL | Publicly reachable link to the audio file. |
| `Status` | Status | Set to `Transcribed` on success, `Failed` otherwise. |
| `Summary` | Text | The AI summary (or the failure reason) is written here. |

Add both a `Transcribed` and a `Failed` option to the `Status` property.

### Using a Files and media column instead of a URL

If your recording is an uploaded file rather than a link, change the **Audio URL** field on **Start Transcription** to read the file URL, for example:

```
={{ $json['Recording'].first().url }}
```

Notion-hosted file URLs are temporary signed links (valid about an hour), but Gladia downloads them immediately, so this still works.

## Long transcripts, handled automatically

Notion limits a single text block to 2000 characters. The **Split Transcript Into Blocks** Code node splits the full transcript into chunks under 1900 characters and emits one block per chunk (after a heading), so **Append To Page** writes the whole transcript in order no matter how long the meeting ran.

## Notes and limitations

- Notion's native AI Meeting Notes audio file is not exposed by the public Notion API, so this template uses a `Recording URL` (or Files) column that you populate yourself, from a recorder, a Zoom or Meet export, Drive, and so on.
- Gladia transcription is a paid feature billed per minute of audio, so check your plan before large batches.
- Notion's API appends at most 100 child blocks per request. If a transcript ever exceeds 100 blocks, batch the Append To Page call in groups of 100 so none are dropped.

## What is in this folder

| File | What it is |
|---|---|
| `README.md` | This overview. |
| `TEMPLATE-DESCRIPTION.md` | The n8n Creator hub listing text. |
| `workflow.json` | The importable n8n workflow. |
| `images/` | The workflow canvas image. |

---

All sample data is fictional. No real credentials, IDs, or endpoints are included.

Part of the [n8n-exekyute-templates](../../) collection. MIT licensed.

![The Gladia Notion meeting transcription workflow](images/workflow.png)

> ⚠️ **Self-hosted n8n only.** This template uses the `n8n-nodes-gladia` community node, which is not available on n8n Cloud.

Turn a Notion meetings database into a self-updating transcript library. When a recording is added, Gladia transcribes and summarizes it, and the results are written straight back onto the same Notion page.

## Who's it for

Teams that already keep meetings in Notion (operations, product, customer success) and want searchable summaries and transcripts without copy-pasting between tools. Notion stays the single source of truth: a recording goes in, a summary and full transcript come back on the same page.

## How it works

A Notion trigger fires when a row is added to the meetings database. The recording URL is sent to Gladia, which runs an asynchronous transcription with speaker diarization and summarization. The workflow polls the job on a timer, looping until Gladia returns `done` or a configurable attempt limit is reached. On success, the page Status is set to `Transcribed`, the Summary is written, and the full transcript is split to respect Notion's 2000-character block limit and appended to the page. Any API error or timeout routes to a failure path that marks the page `Failed`, so nothing fails silently.

## How to set up

1. In **Settings, Community Nodes**, install `n8n-nodes-gladia`.
2. Add a **Gladia API** credential (key from app.gladia.io) and a **Notion API** credential.
3. Open the **When Meeting Added** trigger and pick your meetings database.
4. Share that database with your Notion integration.

## Requirements

- Self-hosted n8n with the `n8n-nodes-gladia` community node
- A Gladia API key
- A Notion integration with access to your meetings database
- Meetings database columns: **Recording URL** (URL), **Status** (Status, with `Transcribed` and `Failed` options), **Summary** (Text)

## Good to know

Gladia transcription is a paid feature billed per minute of audio, so check your plan before large batches. The default poll ceiling is about 10 minutes per recording (60 attempts times 10 seconds), so raise `max_attempts` for long meetings. Notion's API appends at most 100 child blocks per request, so a transcript over 100 blocks would need the append call batched in groups of 100.

## How to customize the workflow

- Tune **number_of_speakers**, **wait_seconds**, and **max_attempts** in the **Set Run Config** node, with no need to open the individual nodes.
- Swap the **Recording URL** column for a **Files and media** column with a one-line expression change on **Start Transcription**.
- Turn off diarization or change the summary type in **Start Transcription**.
- Add a notification (Slack, email) on the **Mark Failed** path to get alerted when a job fails.

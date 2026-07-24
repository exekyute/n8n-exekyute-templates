# Audit YouTube video metadata changes against a saved snapshot

[Published n8n template](https://n8n.io/workflows/17072-audit-youtube-video-metadata-changes-with-google-sheets-and-slack/)

Read every video on a YouTube channel once a day, compare each one's title, description,
tags, privacy status, and category against a snapshot saved on the previous run, write
every difference to a Google Sheets change log, and post a summary to Slack. The log is
written before the snapshot is overwritten, so a mid-run failure never silently moves
the baseline forward. It never writes to YouTube.

Built with n8n, plus YouTube, Google Sheets, and Slack.

![The YouTube metadata auditor workflow on the n8n canvas, running from a daily schedule through three YouTube read nodes and a diff Code node into the change log, snapshot refresh, and Slack summary branches.](images/workflow.png)

## Use it when

- A description quietly loses its links or a title gets rewritten, and nobody can say
  when. The change log keeps every edit as an old value to new value pair, timestamped.
- Several people edit the same channel, and a privacy flip from public to private goes
  unnoticed until viewers ask where the video went.
- A video vanishes from the channel entirely. The audit enumerates the whole uploads
  playlist each run, so new and removed videos register too, not just edited ones.

## How it works

A daily schedule starts a read pass: the YouTube nodes resolve the channel's uploads
playlist, list every video on it, and pull the current metadata for each one. A Code
node diffs five fields per video against the snapshot rows loaded from Google Sheets.
Each difference is appended to the Change Log tab first; only then is the Snapshot tab
cleared and rewritten with today's values. A first run just records the baseline, and
quiet runs post nothing to Slack unless `alwaysNotify` is on.

| Stage | What happens |
|---|---|
| Run Daily Audit, Set Audit Options | Fires once a day and loads the channel ID plus the `alwaysNotify` flag |
| Get Channel Details, List Uploads Playlist | Resolve the channel's uploads playlist and list every video in it |
| Get Video Metadata | Pulls each video's current title, description, tags, privacy status, and category |
| Read Saved Snapshot, Diff Metadata Fields | Load the baseline rows from the previous run and compare the five fields per video, collecting each change with a timestamp |
| Route by Run Outcome | Sends changed runs to the log and first runs straight to the baseline write; a no-change run skips the sheet writes |
| Split Out Changes, Append to Change Log | Write one row per changed field to the Change Log tab |
| Clear Snapshot Tab, Load Current Rows, Refresh Snapshot Rows | Overwrite the snapshot with today's values, after the log write |
| Should Send Alert, Post Summary to Slack | Branch off the diff in parallel: post a summary listing the first 30 changes plus a count of the rest, or skip it on a quiet run unless `alwaysNotify` is true |

I diff tags order-independently: reordering them is housekeeping, and only a real addition or removal should land in the log.

## Requirements

- A YouTube channel and a Google account that can read it over OAuth2. API cost scales with library size, since every run reads metadata for every video.
- A Google Sheets spreadsheet with a `Snapshot` tab and a `Change Log` tab.
- A Slack workspace with a channel for the summary.
- n8n (cloud or self-hosted) with YouTube, Google Sheets, and Slack credentials.

## Setup

1. Import `workflow.json` into n8n. It imports inactive; configure before activating.
2. Connect a YouTube (Google) OAuth2 credential on the three YouTube nodes.
3. Enter your channel ID in "Set Audit Options".
4. Connect a Google Sheets credential and select your spreadsheet in all four Google
   Sheets nodes; add a `Snapshot` tab and a `Change Log` tab with the header rows below.
5. Connect a Slack credential and pick the alert channel in "Post Summary to Slack".
6. Run once to record the baseline (the first run reports no changes), then activate
   the schedule.

## The two sheet tabs

| Tab | Header row |
|---|---|
| `Snapshot` | `videoId`, `title`, `description`, `tags`, `privacyStatus`, `categoryId` |
| `Change Log` | `checkedAt`, `videoId`, `videoTitle`, `field`, `oldValue`, `newValue` |

## Customize

- Change the schedule interval on "Run Daily Audit", which fires at 08:00 daily as shipped.
- Add or remove tracked fields in "Diff Metadata Fields".
- Set `alwaysNotify` to true in "Set Audit Options" to post even on a no-change run.

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

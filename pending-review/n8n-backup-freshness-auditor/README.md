# Audit Google Drive backups for stale, missing, or shrunken files and alert Slack

This workflow watches a Google Drive folder that another job already writes backups into (a pg_dump cron, Veeam, or any other tool) and checks each expected source against a per-source SLA table in a Google Sheet. It never makes a backup. It reads file metadata, assigns one verdict per source (OK, STALE, MISSING, or SHRUNK), logs a dated scorecard row for each source, and pings Slack only when something fails.

Built with n8n, plus Google Drive, Google Sheets, and Slack.

![The Backup Freshness Auditor workflow on the n8n canvas](images/workflow.png)

## How it works

A nightly schedule trigger runs after the backup jobs are expected to have finished. The workflow reads the SLA table from a Google Sheet and lists the watched Drive folder, then a Code node matches files to sources and assigns a verdict. Every source is logged to a scorecard sheet, and an IF gate sends a single Slack message only when at least one source failed.

| Stage | What happens |
|---|---|
| Nightly schedule | Fires once a night, after the backup jobs should have run |
| Read SLA table | Pulls one row per expected source: pattern, cadence, max age, min size |
| List backup files | Lists the watched Drive folder with each file's name, modified time, and size |
| Compute verdicts | Matches files to sources and assigns OK, STALE, MISSING, or SHRUNK |
| Append scorecard | Logs one dated row per source to a Google Sheet |
| Alert on failures | An IF gate posts a single Slack message listing the failing sources, and stays quiet otherwise |

The SHRUNK check is the part that earns its keep. It compares the newest file against the trailing median size of that source's recent files, so a truncated or half-written dump is caught even when it is fresh and present.

## Setup

1. Import `workflow.json` into n8n. It imports inactive, so configure it before activating.
2. Assign a Google Drive credential to "List Backup Files", a Google Sheets credential to "Read SLA Table" and "Append Scorecard" (the same Google account can back both), and a Slack credential to "Post Failing-Source Alert".
3. Open "List Backup Files" and replace `PASTE_YOUR_BACKUP_FOLDER_ID_HERE` in the query with your backup folder ID. It is the part after `/folders/` in the folder URL. Watch the folder the external job writes into, not a copy.
4. In "Read SLA Table", pick the spreadsheet and tab that holds the SLA table, and fill it in (columns below).
5. In "Append Scorecard", pick the spreadsheet and tab for the log, and put the scorecard headers in row 1 (listed below).
6. In "Post Failing-Source Alert", pick the Slack channel.
7. In "Nightly Schedule", set the hour to run after your backups finish. It defaults to 03:00.
8. Run it once to check the verdicts, then activate.

## The SLA table

One row per expected backup source. The Code node reads these columns by name, so use these exact headers in row 1:

| Column | Holds |
|---|---|
| `source` | A name for the source, for example "Postgres prod" |
| `pattern` | A filename pattern that picks this source's files. A regex, or a plain prefix used as a substring match |
| `cadence` | `hourly`, `daily`, `weekly`, or `monthly`. Sets a default age window when `max_age_hours` is blank |
| `max_age_hours` | STALE threshold. The newest matching file must be younger than this many hours |
| `min_size_bytes` | Optional absolute floor. The newest file must be at least this many bytes. Blank to skip |
| `min_pct_of_median` | Optional SHRUNK threshold. The newest file must be at least this percent of the trailing median size of recent files. Blank to skip |

Example:

| source | pattern | cadence | max_age_hours | min_size_bytes | min_pct_of_median |
|---|---|---|---|---|---|
| Postgres prod | `^pg_prod_.*\.sql\.gz$` | daily | 26 | 100000000 | 60 |
| Billing dumps | `bill_` | daily | 26 | | 50 |
| Mongo nightly | `^mongo_` | daily | 26 | | 60 |

Leave a size column blank to skip that check. Leave `max_age_hours` blank to fall back to the cadence window (daily is 26 hours, hourly 2, weekly 170, monthly 750).

## Verdict logic

For each source, the workflow finds the files whose names match its pattern, then picks the newest by modified time.

| Verdict | When |
|---|---|
| MISSING | No file matches the pattern at all |
| STALE | The newest matching file is older than `max_age_hours` (or the cadence window) |
| SHRUNK | The newest file is below `min_size_bytes`, or below `min_pct_of_median` of the trailing median size of recent files |
| OK | Fresh and full |

The trailing median is taken over the recent matching files before the newest one (up to five of them), and the SHRUNK percent check needs at least two of them for history. That is what catches a truncated or corrupt dump: a backup that is present and fresh but suddenly a fraction of its normal size.

## What gets logged

Every run appends one row per source to the scorecard sheet. Create these headers in row 1:

| Column | Holds |
|---|---|
| Run At | When the audit ran |
| Source | The source name |
| Status | OK, STALE, MISSING, or SHRUNK |
| Detail | A plain-English reason |
| Cadence | The source's cadence |
| Pattern | The matching pattern |
| Newest File | The newest matching file's name |
| Newest Age (h) | Hours since that file was modified |
| Max Age (h) | The age window in force |
| Newest Size (bytes) | The newest file's size |
| Trailing Median (bytes) | The median size of recent files |
| Size % of Median | The newest file as a percent of that median |
| Matched Files | How many files matched the pattern |

## Error handling

Each Google Drive, Google Sheets, and Slack step retries a few times on a transient error. The Drive listing and the Slack post continue rather than halt, and the Code node skips files that have no size (Google native files) or an unreadable timestamp, so one odd file never stops the audit. If the Drive listing itself fails, every source reads as MISSING, which surfaces the outage rather than hiding it. For an unattended job like this, also set a workflow-level error workflow in n8n settings so a crash between nodes still reaches you.

## Customize

- Change the run time in "Nightly Schedule", or run it more than once a day.
- Tune each source from the SLA sheet alone, with no edits to the workflow.
- Add a real on-call destination: put an HTTP Request node on the failing branch that calls a PagerDuty or Opsgenie free-tier event, or a Twilio SMS, so a stale backup pages someone off-hours instead of waiting in Slack.
- Add a plain-English digest: feed the failing list to a cheap model (Groq on the free tier, or gpt-4o-mini or Claude Haiku) for a one-line summary. The base workflow stays fully free and AI-free.

## Requirements

- n8n.
- A Google Drive credential (OAuth2) with read access to the backup folder.
- A Google Sheets credential (OAuth2), which can be the same Google account.
- A Slack credential (OAuth2 or bot token) with `chat:write` on the alert channel.

No paid services and no AI are required.

## What is in this folder

| File | What it is |
|---|---|
| `README.md` | This overview |
| `TEMPLATE-DESCRIPTION.md` | The n8n Creator hub listing text |
| `workflow.json` | The importable n8n workflow |

---

All sample data is fictional. No real credentials, IDs, or endpoints are included.

Part of the [n8n-exekyute-templates](../../) collection. MIT licensed.

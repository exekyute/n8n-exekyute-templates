## What this workflow does

Watches a Google Drive folder that another job already writes backups into (a pg_dump cron, Veeam, or any other tool) and audits it against a per-source SLA table in a Google Sheet. It never makes a backup. It reads file metadata and assigns one verdict per source: OK, STALE, MISSING, or SHRUNK. It logs a dated scorecard row for every source and pings Slack only when one or more sources fail. It is built for the person who owns backups but does not own the tool that writes them: a sysadmin, a DevOps or IT ops engineer, a solo founder.

## How it works

A nightly schedule reads the SLA table and lists the Drive folder. A Code node matches each file to a source by filename pattern, then checks the newest match: MISSING if nothing matched, STALE if it is older than the max-age window, SHRUNK if it is below a byte floor or below a set percent of the trailing median size of recent files, which catches truncated or corrupt dumps. Every source is logged to a scorecard sheet, and an IF gate sends one Slack alert listing the failures, staying quiet on an all-clear night.

## Setup

Import the workflow, assign Google Drive, Google Sheets, and Slack credentials, paste your backup folder ID into the List Backup Files query, point the two Sheets nodes at your SLA table and scorecard tab, pick the Slack channel, and set the schedule time. Run it once, then activate.

## Requirements

n8n, a Google Drive OAuth2 credential, a Google Sheets OAuth2 credential, and a Slack credential. No paid services and no AI are required.

## How to customize

Tune every source from the SLA sheet with no workflow edits. For real off-hours paging, add an HTTP Request node on the failing branch to a PagerDuty or Opsgenie free-tier event or a Twilio SMS. For a plain-English summary, feed the failing list to a cheap model such as Groq, gpt-4o-mini, or Claude Haiku.

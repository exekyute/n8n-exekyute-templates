Track every change to your YouTube video metadata over time. This workflow runs a daily read-only audit of your channel, compares each video's current title, description, tags, privacy status, and category against a saved snapshot, records what changed in a Google Sheet, and posts a summary to Slack. It never writes to YouTube, so it is safe to run against a live channel.

## Who's it for

Channel owners and content teams who want a paper trail of metadata edits. It catches an unexpected title rewrite, a description that lost its links, a privacy flip from public to private, or a video that disappeared from the channel, without anyone watching the dashboard.

## How it works

- A Schedule Trigger runs the audit once a day.
- The YouTube nodes read your channel, resolve the uploads playlist, list every video, and pull the current metadata for each one.
- A Code node compares each tracked field against the snapshot saved on the previous run and collects every difference as an old value to new value pair.
- Changed fields are appended to a `Change Log` tab, then the current values overwrite the `Snapshot` tab so the next run compares against today.
- Slack receives a summary. It stays quiet when nothing changed unless you turn on `alwaysNotify`.

The change log is written before the snapshot is refreshed, so a failure never moves the baseline forward without a record.

## How to set up

- Connect a YouTube (Google) OAuth2 credential on the three YouTube nodes.
- Enter your channel ID in the `Set Audit Options` node.
- Connect Google Sheets and select your spreadsheet in the four Google Sheets nodes.
- Add a tab named `Snapshot` and a tab named `Change Log`.
- Connect Slack and pick the alert channel.

The first run has no prior snapshot, so it records a baseline and does not report changes.

## Requirements

- YouTube (Google) OAuth2 credential with read access to your channel.
- Google Sheets credential and one spreadsheet with a `Snapshot` tab and a `Change Log` tab.
- Slack credential with permission to post to your chosen channel.

## Good to know

- Read only. The workflow never edits, deletes, or publishes anything on YouTube.
- API cost scales with library size, since it reads metadata for every video on each run.
- Tag comparison is order independent, so reordering tags does not register as a change.

## How to customize the workflow

- Change the schedule interval on the trigger.
- Add or remove tracked fields in the `Diff Metadata Fields` node.
- Set `alwaysNotify` to true to post a Slack message even when nothing changed.

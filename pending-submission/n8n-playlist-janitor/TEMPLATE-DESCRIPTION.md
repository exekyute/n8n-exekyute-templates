Keep a YouTube playlist tidy on autopilot. This workflow scans a playlist every week, finds duplicate entries and dead videos (deleted, unavailable, or gone private), reports them to Slack, and removes the flagged playlist items. It ships in report-only mode so you can review before anything is deleted.

## Who's it for

Channel owners, editors, and community managers who curate long YouTube playlists and want them free of repeated videos and broken entries, without checking each one by hand.

## How it works

- A schedule trigger runs the cleanup on a weekly cadence.
- The YouTube node lists every item in the target playlist and returns all pages.
- Each video is looked up so entries that are deleted, unavailable, or private can be caught. The lookup uses an error output, so one missing video never stops the run.
- A code step keeps the first copy of each video and flags later copies as duplicates, then marks dead entries.
- Slack receives a summary: how many duplicates and dead videos were found, with titles and IDs, or a note that the playlist is clean.
- When dry run is off, each flagged item is deleted in a loop by its playlist item ID.

## How to set up

- Connect a YouTube (Google) OAuth2 credential on the three YouTube nodes.
- Open the Set Playlist and Options node and set your playlist ID and Slack channel ID.
- Connect a Slack credential on the summary node.
- Leave dry run on for the first run, review the Slack report, then turn it off to delete for real.

## Requirements

- A Google account with YouTube access and an OAuth2 credential that can read and edit the target playlist.
- A Slack workspace and credential with permission to post to your channel.

## Good to know

Deleting a playlist item is permanent, so the workflow defaults to dry run and only reports until you turn that off. Reads and deletes count against your daily YouTube Data API quota, roughly one lookup per playlist item per run. Unlisted videos are treated as valid and are kept.

## How to customize the workflow

Change the schedule interval to daily or monthly. Adjust the flagging rules in the code node, for example to treat unlisted videos as dead too, or to keep the last copy of a duplicate instead of the first. Swap Slack for another notification channel if you prefer.

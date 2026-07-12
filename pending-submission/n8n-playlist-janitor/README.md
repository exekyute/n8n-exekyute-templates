# Clean duplicate and dead videos from a playlist using YouTube and Slack

Built with the n8n YouTube node, a Schedule Trigger, Code, and Slack. A weekly janitor that finds duplicate and dead videos in a YouTube playlist, reports them to Slack, and prunes the flagged items. It runs report-only by default so nothing is deleted until you say so.

![Workflow canvas](images/workflow.png)

## What it does

- Runs on a weekly schedule and lists every item in a target playlist (all pages).
- Looks up each video and flags entries that are deleted, unavailable, or private. The lookup uses an error output so one missing video does not stop the run.
- Flags duplicate videos, keeping the first copy and marking later copies.
- Posts a Slack summary: counts of duplicates and dead videos with titles and IDs, or a note that the playlist is clean.
- Deletes each flagged playlist item (by playlist item ID) when dry run is turned off.

## Safety: dry run by default

Removing a playlist item is permanent. The workflow ships with `dryRun` set to `true`, so the first run only reports what it would remove. Review the Slack summary, then set `dryRun` to `false` in the Set Playlist and Options node to enable real deletion.

## What is in this folder

| File | What it is |
| --- | --- |
| `workflow.json` | The n8n workflow, ready to import. Credentials and IDs are placeholders. |
| `TEMPLATE-DESCRIPTION.md` | The listing description for the workflow. |
| `README.md` | This file. |
| `images/workflow.png` | Canvas screenshot. |

## Setup and credentials

1. Import `workflow.json` into n8n.
2. Connect a YouTube (Google) OAuth2 credential on the three YouTube nodes (List Playlist Items, Check Video Status, Delete Playlist Item).
3. Open the Set Playlist and Options node and set `playlistId` to your playlist ID and `slackChannelId` to your Slack channel ID.
4. Connect a Slack credential on the Post Cleanup Summary node.
5. Keep `dryRun` set to `true` for the first run. Review the Slack report, then set it to `false` to delete for real.

Credentials used:

- YouTube (Google) OAuth2, read and edit access to the target playlist.
- Slack, permission to post to your channel.

## Notes

- Reads and deletes count against your daily YouTube Data API quota, roughly one lookup per playlist item per run.
- Unlisted videos are treated as valid and are kept. Only deleted, unavailable, and private videos are flagged as dead.
- Deletion is keyed on the playlist item ID, not the video ID, so only the playlist entry is removed.

---

[MIT](../../LICENSE) (c) Kevin Yu ([github.com/exekyute](https://github.com/exekyute))

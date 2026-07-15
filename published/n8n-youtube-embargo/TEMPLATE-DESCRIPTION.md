Put a hard end date on a YouTube video without watching the calendar. This workflow reads a Google Sheets embargo list once a day and sets each due video to private or unlisted on its own schedule, then logs the change and posts a Slack recap.

## Who's it for

Channel managers, editors, and social teams who publish time-limited content: contest videos, event promos, embargoed announcements, licensed footage, or seasonal clips that must come down on a set date. Instead of a manual reminder, you keep one control sheet and the workflow does the un-publishing.

## How it works

- A Schedule Trigger runs the workflow once a day.
- Google Sheets reads a control sheet where each row is a video, with an unpublish date and an optional target status.
- A Code step selects rows whose unpublish date has passed and that are not yet marked `Expired`, comparing dates in a timezone you set.
- For each due video, the YouTube node fetches the current details, and any video already at its target status is skipped.
- The YouTube node sets the remaining videos to `private` or `unlisted`, preserving the existing title and category so the update is accepted.
- Google Sheets marks each processed row `Expired`, and Slack posts a recap of what changed (or a short "nothing due today" note).

## How to set up

- Connect a YouTube (Google) OAuth2 credential on both YouTube nodes.
- Create a Google Sheet with the columns `videoId`, `Unpublish Date`, `Target Status`, and `Status`, and point the two Sheets nodes at it.
- Connect a Slack credential and choose the channel for the recap.
- Open the `Select Due Videos` node and set the `TIMEZONE` constant to your channel's timezone.

## Requirements

- A YouTube (Google) account with OAuth2 access to the channel that owns the videos.
- A Google Sheets account for the control sheet.
- A Slack account and a channel for the recap.

## Good to know

- The `Status = Expired` guard makes the workflow idempotent: once a row is processed it is never touched again, so re-runs are safe.
- YouTube's video update needs the existing title and category alongside the new status, so the workflow reads them first and passes them through.
- The date comparison is day-level and timezone-explicit, so a video set for a given date flips on that date in your timezone, not the server's.
- Target status accepts `private` or `unlisted`. A blank cell defaults to `private`.

## How to customize the workflow

- Run the Schedule Trigger more than once a day if you need same-day precision.
- Change the default target from `private` to `unlisted` in the `Select Due Videos` node.
- Add extra columns (such as a reason or an owner) to the sheet and include them in the Slack recap.
- Swap the Slack recap for email or another channel if your team lives elsewhere.

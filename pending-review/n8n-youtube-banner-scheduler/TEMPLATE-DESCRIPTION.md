# Rotate YouTube channel banners on a schedule using Google Sheets and Drive

Keep your channel art current without manual uploads. This workflow reads a dated banner schedule from Google Sheets and, on the day a swap is due, pulls the artwork from Google Drive and sets it as your active YouTube channel banner, catching up on any missed day and leaving the rest of your branding intact.

## Who's it for

Creators and channel managers who rotate banner art for seasons, launches, or campaigns and want the change to happen on the right date on its own. You plan the schedule once in a spreadsheet and let the workflow handle the swap.

## How it works

1. A Schedule Trigger runs every morning.
2. Google Sheets reads a banner schedule with `Swap Date`, `Banner Drive File ID`, an optional `Label`, and a `Status` column the workflow maintains.
3. A Code node keeps the rows due today or overdue that are not yet Applied, sorted oldest first, so a missed day catches up and the newest banner ends up live.
4. Google Drive downloads the banner image as binary data.
5. The YouTube node runs Channel: uploadBanner on the image, which returns a banner URL.
6. The workflow reads the channel's current branding, then runs Channel: update to set the new banner active while re-sending your description, keywords, country, and trailer.
7. Google Sheets marks the row Applied and a Set node records the swap.

## How to set up

- Connect a YouTube (Google) OAuth2 credential on the three YouTube nodes.
- Connect your Google Sheets and Google Drive credentials.
- In `Set Banner Config`, set `channelId` to your YouTube channel ID.
- Point both Google Sheets nodes at your schedule spreadsheet and tab.
- Add one row per planned swap: `Swap Date` in `yyyy-MM-dd` (text or a date cell), the `Banner Drive File ID` of the artwork, and an optional `Label`. Leave `Status` empty.

## Requirements

- A YouTube (Google) OAuth2 credential with access to your channel.
- A Google Sheets credential and a spreadsheet holding the schedule.
- A Google Drive credential and the banner images stored in Drive.

## Good to know

- YouTube recommends banner art at 2048x1152 px and under 6 MB. Prepare files that meet this before scheduling them.
- The due check catches up: if the workflow does not run on a banner's exact date, the next run still applies it, and when several are overdue the newest wins.
- Activating a banner re-sends your existing channel description, keywords, country, and trailer, because the YouTube API clears any branding field the update leaves out.

## How to customize the workflow

- Change the run time in the Schedule Trigger.
- Adjust or add schedule columns, or extend `Set Banner Config` if you manage more than one channel.
- Edit the Code node's rules if you want stricter due-date handling.

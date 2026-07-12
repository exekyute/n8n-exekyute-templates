# Swap your YouTube channel banner on a schedule using Google Sheets and Drive

Keep your channel art current without manual uploads. This workflow reads a dated banner schedule from Google Sheets, and on the day a swap is due it pulls the artwork from Google Drive and sets it as your active YouTube channel banner.

## Who's it for

Creators and channel managers who rotate banner art for seasons, launches, or campaigns and want the change to happen on the right date on its own. You plan the schedule once in a spreadsheet and let the workflow handle the swap.

## How it works

1. A Schedule Trigger runs once a day.
2. Google Sheets reads a banner schedule with `Swap Date`, `Banner Drive File ID`, and an optional `Label`.
3. An IF node keeps only the row whose `Swap Date` matches today in the workflow timezone.
4. Google Drive downloads that banner image as binary data.
5. The YouTube node runs Channel: uploadBanner on the image, which returns a banner URL.
6. A second YouTube node runs Channel: update to set that URL as the active banner, and a Set node records the swap.

## How to set up

- Connect a YouTube (Google) OAuth2 credential on both YouTube nodes.
- Connect your Google Sheets and Google Drive credentials.
- In `Set Banner Config`, set `channelId` to your YouTube channel ID.
- Point `Read Banner Schedule` at your schedule spreadsheet and tab.
- Add one row per planned swap: `Swap Date` in `yyyy-MM-dd` text, the `Banner Drive File ID` of the artwork, and an optional `Label`.

## Requirements

- A YouTube (Google) OAuth2 credential with access to your channel.
- A Google Sheets credential and a spreadsheet holding the schedule.
- A Google Drive credential and the banner images stored in Drive.

## Good to know

- YouTube recommends banner art at 2048x1152 px and under 6 MB. Prepare files that meet this before scheduling them.
- The match is a plain text comparison on `yyyy-MM-dd`, so store `Swap Date` as text in that format and set your workflow timezone so "today" lands on the day you expect.
- The workflow acts only on an exact date match, so a swap runs once on its scheduled day.

## How to customize the workflow

- Change the run time in the Schedule Trigger.
- Add a Google Sheets update step after the swap to mark a row done or stamp the swap date.
- Extend `Set Banner Config` or the schedule columns if you manage more than one channel.

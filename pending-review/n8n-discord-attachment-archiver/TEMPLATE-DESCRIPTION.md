Sweep named Discord channels once a day and pull every new attachment into a dated Google Drive folder, with one log row per file recording its poster, channel, size and a jump link back to the original message.

## Who's it for

Communities and teams whose files live in Discord by accident. Reference material, artwork, build files, invoices, screenshots: posted once, useful for years, and stored in a place that was never meant to keep them.

## How it works

Discord signs every attachment URL with `ex`, `is` and `hm` query parameters that expire, so a link saved in a spreadsheet today returns 404 tomorrow. This workflow asks Discord for a fresh signed URL and downloads the file inside the same run, which is the one detail that makes the archive real rather than a list of dead links.

A daily schedule starts the sweep. The log sheet is the memory: the newest `Posted At` already recorded becomes the watermark, and an empty log falls back to a configurable lookback. One item per named channel fans out into a bounded read, attachments newer than the watermark are extracted with a jump link each, and anything over the size cap is dropped before it costs a download. One dated folder is created per sweep, and only when there is something to put in it, so a quiet day leaves no empty folder behind.

## How to set up

Invite a Discord bot with View Channels and Read Message History, and switch on the MESSAGE CONTENT privileged intent, since attachments ride on the message payload. Connect Google Drive and Google Sheets. Create the log sheet with the ten documented headers, then fill in one settings node: guild, comma separated channel IDs, Drive parent folder, log sheet and the size cap. Run it once against a quiet channel first.

## Requirements

A Discord server, a Google account with a Drive folder and a spreadsheet, and n8n with Discord Bot API, Google Drive and Google Sheets credentials. The MESSAGE CONTENT intent is a toggle for bots in fewer than 100 servers, not an approval queue.

## Good to know

The Discord message list has no before, after or around cursor. It takes a channel and a limit, so this reads the newest 100 messages per channel and compares timestamps itself. A channel taking more than 100 messages between two runs loses the oldest ones. Run it daily, and on busy channels either run it more often or split the channel list across two schedules.

The watermark is one timestamp for the whole sweep rather than one per channel, so a channel added later starts from the same point as the rest instead of backfilling.

## How to customize the workflow

`maxFileMb` is checked before the download, so raising it costs run time and Drive quota. `firstRunLookbackDays` decides how far back the very first sweep reaches. The dated folder name is one expression, so change it for weekly or monthly grouping instead.

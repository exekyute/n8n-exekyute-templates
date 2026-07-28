A new file lands in a Google Drive inbox folder and nothing moves until a person taps Approve or Send back on a Discord message. The file then goes to the shared folder or the rework folder, and the decision is logged.

## Who's it for

Anyone who has an approval step that exists on paper and gets skipped in practice: an agency shipping client deliverables, a moderator clearing user-submitted media, a small team where one person signs off on anything that leaves the building. The approver is usually on their phone, and asking them to open a second tool is why the file waits until Monday.

## How it works

The Drive trigger fires on each new file. A Code node builds a readable review card with name, human-readable size, type and a preview link, and a loop hands the reviewer one file at a time. The Discord node uses native `sendAndWait`, which renders real Approve and Send back buttons and pauses the execution until somebody taps one, so there is no polling loop and no second approval tool. A Switch then routes three ways rather than two: approved, sent back, and nobody answered. That third path matters, because an expired window logged as a rejection is a false statement in an audit trail. Both Drive moves are caught per file, so one file Drive refuses cannot kill the rest of the batch.

## How to set up

Invite a Discord bot to your server with Send Messages on the review channel and connect the Discord Bot API credential. Connect Google Drive and Google Sheets, point the trigger at your inbox folder, then fill in the one settings node: guild, review channel, approved and rejected folder IDs, log sheet and the decision window in hours. Drop a test file in and complete the round trip before trusting it.

## Requirements

A Discord server, a Google account with three Drive folders and a spreadsheet, and n8n with Discord Bot API, Google Drive and Google Sheets credentials. No privileged Discord intents are needed, because this never reads message content or the member list.

## Good to know

Your n8n instance has to be reachable at its webhook URL. The Discord buttons point back at that URL, so an instance behind a firewall or without `WEBHOOK_URL` set correctly renders buttons nobody can complete.

Approve and Send back both MOVE the file out of the inbox, and each is one way. Point both folder IDs at real folders before the first run.

## How to customize the workflow

`decisionWindowHours` sets how long a card waits before the run is logged as `No response` and the file is left alone. Shorten the Drive poll interval for a busier queue. Set `driveId` to a shared drive ID if your deliverables do not live in My Drive.

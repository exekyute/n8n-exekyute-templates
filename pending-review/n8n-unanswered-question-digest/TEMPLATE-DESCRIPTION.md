Read one Discord help channel every morning, find the questions nobody answered, and post them with jump links to a moderator channel while logging each one to a Google Sheet.

## Who's it for

Anyone running a help or support channel that works fine when somebody happens to be around and quietly fails when nobody is. Open source projects, SaaS communities, course cohorts, game servers. The questions asked at 2am are the ones that scroll away, and they are also the ones that make somebody leave.

## How it works

A schedule fires and reads the channel with Simplify turned off, which keeps the raw `message_reference` field alive so reply detection is a fact rather than a guess. A message counts as ANSWERED if any of three things is true: something replied to it, a later message mentioned its author, or it has a thread. Everything else that passes the question test is unanswered.

The same node measures its own coverage. The Discord message list has no before or after cursor, so a "last 24 hours" filter can only be applied to whatever the fetch limit returned. Rather than hide that, every run reports how far back it actually reached and warns inside the digest when the read was truncated. It also detects the case where messages come back but every content field is empty, which means the MESSAGE CONTENT intent is off. The sheet is written before the Discord post, so the post can stay on stop-on-error without risking the log.

## How to set up

Invite a Discord bot with View Channels and Read Message History on the help channel and Send Messages on the moderator channel, then switch on the MESSAGE CONTENT privileged intent. Connect Google Sheets. Create the log tab with the seven documented headers, fill in one settings node with the guild, help channel, moderator channel and sheet, then run it once by hand and tune the question test before activating.

## Requirements

A Discord server, a Google account with a spreadsheet, and n8n with Discord Bot API and Google Sheets credentials. The MESSAGE CONTENT intent is a toggle for bots in fewer than 100 servers.

## Good to know

The question test is a heuristic, not an oracle. It matches text ending in a question mark or opening with a word from an editable list. A digest naming the wrong messages generates support noise fast, so read one by hand before you activate the schedule.

A clean day still posts a scan receipt carrying the coverage line, so silence from this workflow always means something is broken and never means everything is fine.

## How to customize the workflow

`questionWords` and `minQuestionLength` decide what counts as a question and are meant to be edited for your channel's voice. `lookbackHours` sets the window and `messageFetchLimit` sets how far back one run can see, so keep the limit comfortably above your daily traffic. `maxQuestionsInMessage` trims the Discord post without trimming the sheet.

Discord deletes audit log entries after 45 days. This copies them into a Google Sheets ledger every day so the moderation record outlives the retention window, and posts a per-moderator summary to Slack once a week.

## Who's it for

Anyone running a Discord server where moderation decisions need to outlast the panel that displays them: a community team handing over to new moderators, a game or product server that has to answer "who removed this and why" months later, or a paid community where bans and role changes are decisions somebody may need to justify.

## How it works

A daily schedule reads a watermark from a Data Table, the id of the last entry already archived for this guild. An HTTP Request calls the guild audit log endpoint with that id as an `after` cursor and pages forward until a page comes back shorter than the page size. The audit log is the one Discord read endpoint with a real server side cursor, so resuming is exact rather than a timestamp guess. A Code node decodes the integer `action_type` values into readable names and joins the response `users` array, so moderator and target arrive as names instead of snowflakes. Rows are appended to the ledger, never updated, and the watermark advances only after the append succeeds so a failed run retries the same range. On the configured weekday a second branch reads the ledger back, counts entries per moderator and per action over the lookback window, and posts one Slack message.

## How to set up

Invite a Discord bot with View Audit Log and connect the Discord Bot API credential. Create a Data Table named `discord_audit_watermark` with `guild_id`, `last_entry_id` and `updated_at`, then select it on both Data Table nodes. Create a spreadsheet with an `audit_log` tab carrying the 13 headers listed on the grey note beside the Sheets nodes. Fill in the guild id, sheet URL and Slack channel in one settings node, connect Google Sheets and Slack, then run it once by hand.

## Requirements

A Discord server where you can add a bot, a Google account with a spreadsheet, a Slack workspace, and n8n with Discord Bot API, Google Sheets and Slack credentials plus Data Tables. No privileged intents are needed, because this reads the audit log rather than messages or members.

## Good to know

Anything older than 45 days is gone from the Discord API and cannot be recovered, so a workflow paused for longer than that leaves a permanent hole in the ledger.

Each request returns at most 100 entries and `maxPagesPerRun` caps pages per run at five, so raise it for the first run on a busy server.

Both Data Table nodes import pointing at a placeholder and must be repointed at your own table before the first run.

## How to customize the workflow

`maxPagesPerRun` sets how much history one run can backfill. `digestWeekday` and `digestLookbackDays` move and widen the Slack summary without touching the daily archive. `Map Action Types and Users` names the common action types; Discord defines more than sixty, so extend the map for the ones your server uses.

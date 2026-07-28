Read a roster from a Google Sheet, read the members of a Discord server, and report every place the two disagree. Read only against Discord: it never adds or removes a role.

## Who's it for

Anyone whose membership list is a spreadsheet and whose Discord roles are supposed to match it. Volunteer coordinators, club and society committees, course cohorts, paid communities, mutual aid groups. The sheet is the record; Discord is the copy that drifts.

## How it works

A weekly schedule reads both sides and joins them on `discord_user_id`. Role IDs are fetched from the guild at run time, so you configure role NAMES and never copy an 18 digit snowflake. That also means the config survives somebody renaming a role, and a name that does not exist in the server is reported as a configuration problem rather than silently matching nothing.

Every mismatch lands in a named bucket: holds a gated role with no roster row, on the roster but missing the role, holds a role the roster does not grant, or the row could not be judged at all. That last bucket is the point. A `status` value matching neither your active nor your inactive list is reported rather than assumed inactive, because assuming would mean telling a coordinator to strip roles from members who are paid up. One row per mismatch goes to a report tab, and two headline counts go to a channel.

## How to set up

Invite a Discord bot to your server and switch on the SERVER MEMBERS privileged intent, since the member list comes back empty without it. The bot needs no role permissions at all. Connect Google Sheets, then fill in one settings node: guild, report channel, roster sheet, report sheet, and `gated_roles` as role names spelled as they appear in Server Settings. Give the roster tab four columns and the report tab eight headers, then run it once by hand.

## Requirements

A Discord server, a Google account with a roster tab and a report tab (they can be the same file), and n8n with Discord Bot API and Google Sheets credentials. The SERVER MEMBERS intent is a toggle for bots in fewer than 100 servers.

## Good to know

The join runs on `discord_user_id`, so the roster has to hold Discord snowflakes. Nobody hand-maintains a column of those, and once it decays the report starts crying wolf. Capture the ID at signup by adding the field to your intake form rather than backfilling it later. Rows with a blank or malformed ID are not dropped quietly; they land in the report and are counted on their own line.

Because it never calls roleAdd or roleRemove and has no fix-it branch, this is safe to point at a live server with thousands of members.

## How to customize the workflow

`active_status_values` and `inactive_status_values` are comma separated, so add your own wording rather than working around it. `grace_period_days` stops flagging people who joined before anyone had a chance to give them their role. `ignore_user_ids` keeps bots and service accounts out of the report.

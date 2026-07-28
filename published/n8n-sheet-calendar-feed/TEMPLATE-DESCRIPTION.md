Turn a Google Sheet of events into a URL that Google Calendar, Apple Calendar and Outlook can subscribe to. Edit a row and the event changes for everyone who subscribed. Delete the row and it goes away.

## Who's it for

Anyone who maintains a schedule in a spreadsheet and keeps being asked when things are: an on-call rota, a shift roster, a class timetable, a content calendar, a club's event list. The people who need it never open the sheet and never open n8n. They subscribe to one URL, once.

## How it works

A webhook serves an RFC 5545 iCalendar feed rendered from your events tab. A token in the query string gates access, and a short TTL cache means a dozen clients refreshing does not become a dozen Google Sheets reads. Every row is validated: a bad cell is rejected and counted with its row number rather than guessed at, so a blank date never silently becomes a real one. The serializer handles the parts that usually break, including CRLF line endings, 75-octet folding, correct text escaping, and the exclusive end date that all-day events require. If the sheet read fails, the last good copy is served instead, so a transient error never empties anyone's calendar.

## How to set up

Create a tab named `events` with the ten documented headers. Connect a Google Sheets credential, then open Set Feed Config and replace the token and namespace placeholders and set your timezone. Activate, fetch the URL once to confirm it parses, then subscribe.

## Requirements

A Google account with a spreadsheet, and n8n with a Google Sheets credential. No paid tier and no third-party service.

## Good to know

The URL is the password. Calendar clients cannot send an auth header, so access is the secret in the URL, exactly as Google's own private iCal address works.

Clients poll on their own schedule. Apple honours a per-subscription interval, Outlook respects the TTL hint down to about an hour, and Google refreshes in hours with no way to force it. The sheet is authoritative immediately; subscribers are not.

## How to customize the workflow

Set `status` on a row to `tentative` or `cancelled` to keep it while changing how it shows. Adjust `cache_ttl_seconds` to trade freshness against read quota, and `window_future_days` to keep a long sheet's feed small. Recurring events are deliberately unsupported: enter one row per occurrence.

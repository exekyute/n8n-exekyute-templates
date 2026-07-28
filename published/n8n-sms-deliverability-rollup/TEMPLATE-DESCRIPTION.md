Every morning this reads yesterday's Twilio messages, counts them by status, and works out a delivery rate. It writes one summary row to a Google Sheet and posts the same figures to Slack. One row per day makes the Sheet a trend line you can chart.

## Who's it for

Anyone sending SMS through Twilio who wants a daily read on whether messages land: support teams running notifications, ops teams running alerts, product teams watching a launch.

## How it works

A Schedule Trigger fires each morning. A Code node turns today's date into yesterday's calendar day and returns start and end ISO timestamps. An HTTP Request node calls the Twilio Messages list endpoint with those as `DateSent>` and `DateSent<` filters, using the built-in Twilio credential. A second Code node buckets each message (queued, sent, delivered, failed, undelivered, other) and totals the volume. A Set node divides delivered by delivered plus failed plus undelivered.

## How to set up

1. Import the workflow. It arrives inactive.
2. Create a Twilio credential (Account SID and Auth Token) and assign it to the Twilio fetch node, which uses n8n's built-in Twilio credential type.
3. Put the same SID into that node's URL.
4. Assign Google Sheets and Slack credentials, pick the spreadsheet and tab, set the channel.
5. Header row: date, total, delivered, failed, undelivered, delivery_rate_pct.
6. Run once, check the row and the digest, then activate.

## Requirements

A Twilio account (Account SID and Auth Token), a Google account for Sheets, and a Slack bot that can post.

## Good to know

Twilio status is not final the instant a message is accepted, so the window covers a full past day instead of the last few hours. Queued and sent messages are counted but left out of the rate, so pending traffic does not drag it down. `PageSize` is 1000; past that, add pagination on the HTTP Request node. Nothing writes to Twilio, so a trial account is enough to test it.

## How to customize

Change the trigger hour to match your morning. Widen the timestamps in the date Code node for a weekly window. Add an IF after the rate node so Slack only fires below a threshold. For per-sender or per-country splits, add the Twilio query parameter and extend the buckets.

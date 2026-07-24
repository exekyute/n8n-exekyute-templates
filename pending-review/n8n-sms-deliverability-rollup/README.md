# Summarize yesterday's Twilio message delivery rates to Google Sheets and Slack

Count yesterday's Twilio messages by status every morning, work out a delivery rate, append one summary row to a Google Sheet, and post the same figures to Slack. The window covers the full previous calendar day, because Twilio statuses are not final the instant a message is accepted; a shorter lookback would count traffic still in flight. It only reads and never sends, so it cannot cost anything.

Built with n8n, plus Twilio, Google Sheets, and Slack.

![The SMS deliverability rollup on the n8n canvas, running from a schedule trigger through a date-window Code node and a Twilio HTTP request into a status tally, a delivery-rate Set node, a Google Sheets append, and a Slack post.](images/workflow.png)

## Use it when

- You open the Twilio console each morning to eyeball whether yesterday's texts actually landed. A raw message log never shows a trend; one dated summary row per day does.
- A carrier change or a bad sender number drags delivery down slowly, and nobody notices until customers complain. One row a day in the Sheet turns the slide into a line you can chart.
- The team already lives in Slack. The digest posts the same date, counts, and rate there each morning, so nobody has to open the Sheet to know yesterday was fine.

## How it works

A schedule fires each morning, a Code node turns the current date into the previous calendar day bounded by two ISO timestamps, and an HTTP Request node pulls that day's messages from the Twilio Messages list endpoint. A second Code node counts each message into a status bucket, and a Set node divides delivered by the messages that reached a final state. Queued and sent are counted but left out of the rate, so pending traffic does not drag it down. The summary then lands twice: one appended Sheet row and one Slack digest.

| Stage | What happens |
|---|---|
| Run Every Morning | Schedule Trigger, fires once a day at 07:15 |
| Build Yesterday Date Window | Code node returns `report_date` plus start and end ISO timestamps for the previous calendar day |
| Fetch Twilio Messages | GETs the Twilio Messages list endpoint filtered by `DateSent>` and `DateSent<`, `PageSize` 1000, built-in Twilio credential |
| Tally Messages By Status | Counts each message into queued, sent, delivered, failed, undelivered, or other, and totals the volume |
| Calculate Delivery Rate | Computes `delivery_rate_pct` from delivered, failed, and undelivered, rounded to one decimal place |
| Append Daily Summary Row | Google Sheets append, one row per day |
| Post Delivery Digest | Slack message with the date, the counts, and the rate |

I append one row per day instead of one row per message so the Sheet stays a trend line you can chart directly, not a log you have to pivot before it tells you anything.

## Requirements

- A Twilio account (Account SID and Auth Token). A free trial is enough, because the workflow reads message history and never sends anything.
- A Google account with a spreadsheet the workflow can append to.
- A Slack workspace with a channel for the digest and a bot that can post to it.
- n8n (cloud or self-hosted) with Twilio, Google Sheets, and Slack credentials.

## Setup

1. Import `workflow.json` into n8n. It imports inactive; configure before activating.
2. Add three credentials. Create a Twilio credential (Account SID and Auth Token) and assign it to "Fetch Twilio Messages", which uses n8n's built-in Twilio credential type. Assign your Google Sheets OAuth2 credential to "Append Daily Summary Row" and your Slack credential to "Post Delivery Digest".
3. Replace `REPLACE_WITH_YOUR_ACCOUNT_SID` in the "Fetch Twilio Messages" URL with the same Account SID.
4. Pick your spreadsheet and tab in "Append Daily Summary Row" and give the tab this header row: `date`, `total`, `delivered`, `failed`, `undelivered`, `delivery_rate_pct`. Set the channel in "Post Delivery Digest", and adjust the trigger hour if 07:15 is not when you want it.
5. Run it once with Execute Workflow, check the Sheet row and the Slack message, then activate.

## Testing on a Twilio trial

The rollup is read-only and spend-free, so a trial account is enough to prove it works. Seed three or four messages on the trial first (the trial's pre-defined body is fine, since custom bodies are not supported there), point the date window at that day, and run it.

| Check | What good looks like |
|---|---|
| Tally | The bucket counts add up to `total`, and `total` matches how many messages you seeded |
| Rate math | `delivery_rate_pct` equals delivered divided by delivered plus failed plus undelivered |
| Sheet | Exactly one new row, not one row per message |
| Slack | The digest numbers match the Sheet row |

To test a fixed day instead of yesterday, temporarily hard-code `reportDate` in "Build Yesterday Date Window" to the day you seeded, then put the original line back.

## Customize

- **Trigger hour.** 07:15 is the default; change it in "Run Every Morning" to match your morning.
- **Reporting window.** Widen the two timestamps in "Build Yesterday Date Window" to roll up a week instead of a day.
- **Threshold alerts.** Insert an IF after "Calculate Delivery Rate" so Slack only fires when the rate drops below a number you pick, while the Sheet keeps logging every day.
- **Splits.** Add the matching Twilio query parameter and extend the buckets in "Tally Messages By Status" for per-sender or per-country rollups.
- **Volume.** `PageSize` is 1000; past a thousand messages a day, add pagination on the "Fetch Twilio Messages" node.

## What is in this folder

| File | What it is |
|---|---|
| `README.md` | This overview |
| `TEMPLATE-DESCRIPTION.md` | The n8n Creator hub listing text |
| `workflow.json` | The importable n8n workflow |
| `images/workflow.png` | The workflow on the n8n canvas |

---

All sample data is fictional. No real credentials, IDs, or endpoints are included.

Part of the [n8n-exekyute-templates](../../README.md) collection. MIT licensed.

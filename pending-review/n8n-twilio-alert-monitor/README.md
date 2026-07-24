# Monitor Twilio debugger alerts and post a grouped Slack digest

Poll the Twilio Monitor Alerts API on a schedule, collapse whatever it returns into groups by error code and severity, log every alert to a Google Sheet, and post one Slack digest per run. Failed webhooks and rejected sends land in the Twilio debugger, which nobody opens until a customer complains; this workflow brings them to a channel someone actually reads.

Built with n8n, plus Twilio, Google Sheets, and Slack.

![The Twilio alert monitor workflow on the n8n canvas, running from a schedule trigger through an HTTP request and a grouping Code node into Google Sheets and Slack.](images/workflow.png)

## Use it when

- Your Twilio integration fails quietly. Sends get rejected, a callback URL starts returning 404s, and the only record is a console page nobody has open.
- One misconfigured webhook raises the same error hundreds of times in an hour. A per-alert notifier would bury the channel; here that becomes one digest line with a count next to it.
- You need an audit trail, not just an alert. The Sheet keeps one row per alert with its code, severity, and resource, so the Slack digest can stay short without losing the history.

## How it works

A schedule fires, a Set node computes the ISO-8601 start of the lookback window, and an HTTP Request node calls the Twilio Monitor Alerts API with that window and a page size. An IF node checks whether anything came back; an empty window ends the run there, so a quiet hour posts nothing. When there are alerts, a Code node flattens each one into a row and collapses the set into groups keyed on error code plus log level, counting each group and keeping one sample message trimmed to 140 characters. The run then splits: Google Sheets appends one row per alert as the audit trail, and Slack posts a single digest built from the grouped counts.

| Stage | What happens |
|---|---|
| Check Twilio on a Schedule | Fires on the interval you set, hourly by default |
| Compute Alert Window | Sets `lookbackMinutes` (60), `pageSize` (100), and `startDate` as now minus 60 minutes in UTC. The expression carries its own 60, so both move together |
| Fetch Twilio Debugger Alerts | GETs `monitor.twilio.com/v1/Alerts` with the built-in Twilio credential, passing the window as `StartDate` and `PageSize` |
| Any Alerts Returned? | Checks the `alerts` array and ends the run when it is empty |
| Group Alerts by Code and Severity | Flattens every alert to a row, then groups by error code and log level with counts and one sample message per group |
| Append Alert Rows to Sheet | Writes one row per alert so you keep the raw history; a failed append does not block the digest |
| Post Grouped Digest to Slack | Runs once per execution and posts one message with the total, the severity split, the group count, and the top five error codes |

I group on error code plus log level and keep one sample message per group because that pair is what you act on: the code tells you what broke, the level tells you how much to care, and the sample shows you one real instance without pasting four hundred.

## Requirements

- A Twilio account. A free trial is enough, because this reads debugger events rather than sending anything; see the testing section below.
- A Google account with a spreadsheet the workflow can append to.
- A Slack workspace with a channel for the digest.
- n8n (cloud or self-hosted) with Twilio, Google Sheets, and Slack credentials.

## Setup

1. Import `workflow.json` into n8n. It imports inactive; configure before activating.
2. Add a Twilio credential (your Account SID, which starts with `AC`, and your Auth Token) and assign it to "Fetch Twilio Debugger Alerts". The HTTP Request node uses n8n's built-in Twilio credential type, so there is no separate Basic Auth credential to build. Add a Google Sheets credential for "Append Alert Rows to Sheet" and a Slack credential for "Post Grouped Digest to Slack".
3. Pick the spreadsheet and tab on the Sheets node, and the channel on the Slack node. Give the tab this header row: `timestamp`, `error_code`, `log_level`, `resource_sid`, `request_url`, `alert_sid`.
4. Set the interval in "Check Twilio on a Schedule", then open "Compute Alert Window" and set `lookbackMinutes` and the matching number inside the `startDate` expression so the query window covers the gap between runs.
5. Run it once by hand, confirm the Sheet and the digest, then activate.

## Testing on a Twilio trial

You can exercise this end to end on a trial account with zero verified numbers and zero successful sends, because the failures a trial produces are exactly the input this workflow reads.

| Step | What to do | What you should see |
|---|---|---|
| Generate alerts | Send an SMS to a number you have not verified | Twilio raises error `21608` and logs it to the debugger |
| Run the workflow | Execute it manually with a lookback that covers those attempts | The HTTP node returns your alerts in the `alerts` array |
| Check grouping | Open the Code node output | One group for `21608` at `error`, with a count matching your attempts |
| Check the Sheet | Look at the tab | One row per alert, not one row per group |
| Check Slack | Look at the channel | A single digest with the total, the severity split, and the top codes |
| Check the quiet path | Set the lookback to a few minutes and run again after a gap | The IF node ends the run and Slack stays silent |

Trial limits worth knowing: the trial lasts 30 days, sends only reach verified numbers, and custom SMS bodies are blocked. None of that matters here.

## Customize

- Change the schedule interval, and change `lookbackMinutes` and the `startDate` expression with it. The two must cover the same span or alerts fall through the gap between runs.
- Add `resource_sid` to the grouping key in the Code node to split groups per phone number or service instead of per error code.
- Filter `grouped` inside the Code node to `error` level to shrink the digest while the Sheet still gets a row per alert. An IF in front of Slack will not do it, because the digest string is already assembled by then.
- Add a `LogLevel` query parameter on "Fetch Twilio Debugger Alerts" to pull one severity straight from Twilio. That narrows the Sheet too, since everything downstream only sees what the API returned.
- Raise `pageSize` past 100 on "Compute Alert Window" so one run captures the whole window on a busy account.
- Swap Slack for email or a webhook by replacing the last node; the digest text is built upstream in the Code node, so the replacement only needs `{{ $json.digest }}`.

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

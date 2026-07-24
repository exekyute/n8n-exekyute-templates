# Alert Slack when an API response changes structure

[Published n8n template](https://n8n.io/workflows/16699-alert-on-api-contract-drift-using-data-tables-and-slack/)

Polls a JSON or OpenAPI endpoint on a schedule, works out the shape of its response (every field path and its type), stores that shape in a Data Table, and posts a Slack alert only when the contract breaks. The diff compares structure, never values, so a changed number or an extra item in a list stays quiet; only structural and type changes raise an alert.

Built with n8n, plus an HTTP endpoint and Slack.

![The contract drift watcher on the n8n canvas, running from a schedule trigger through the endpoint fetch, snapshot load, and schema diff into a Slack alert.](images/workflow.png)

## Use it when

- A vendor API you parse in production ships a change without notice. A field disappears or flips type, and the first sign is a broken integration; here the change lands in Slack with the exact field path.
- Diffing raw responses on a live endpoint flags something every run, because the values change on every call. This watcher tracks the shape only, so ordinary churn never pages anyone.
- An internal team renames a field and forgets to tell the consumers. The scheduled poll reports it as a removed field, tagged high severity, before the downstream jobs start failing.

## How it works

A schedule fires, the endpoint is fetched, and a Code node derives the response schema and diffs it against the snapshot stored in the Data Table, keyed by endpoint label. Slack is posted only when a breaking change is found, and the snapshot is then refreshed, so the same change is never reported twice. Point it at a JSON data endpoint to watch the response shape, or at an OpenAPI JSON document to watch the spec's structure; either way it reads the JSON it gets back and tracks its shape.

| Stage | What happens |
|---|---|
| Check on a schedule | A Schedule Trigger runs on the interval you set, every 6 hours by default |
| Settings | One Edit Fields node holds the endpoint URL, a label for it, and the Slack channel |
| Fetch the endpoint | An HTTP Request pulls the endpoint, retries a transient failure, then skips the run on a hard failure |
| Load prior snapshot | A Data Table read pulls the last saved shape for this endpoint |
| Derive schema and diff contract | A Code node builds the new shape and classifies every breaking change by severity |
| Update snapshot | The Data Table row is upserted with the new shape |
| Breaking change found? | An IF gate lets only high or medium changes through |
| Post drift alert to Slack | One Slack message lists each change, its severity, and the exact field path |

I diff shapes rather than raw responses because values change on every call; the shape is the contract, and only the contract breaking is worth a message.

## Requirements

- n8n, a recent version that includes Data Tables. No paid services and no AI are required.
- A Slack credential (OAuth2, or a bot token with `chat:write`).

## Setup

1. Import `workflow.json` into n8n. It imports inactive; configure before activating.
2. Create a Data Table named `API Contract Snapshots` with two text columns, `endpointKey` and `schema_object`, then select it in Load prior snapshot and Update snapshot.
3. Open Settings and set `endpointUrl` (the endpoint to watch), `endpointKey` (a stable label, used as the snapshot key), and `slackChannel` (the channel ID to post to). The default `endpointUrl` is `https://jsonplaceholder.typicode.com/users`, a free no-key JSON endpoint, so you can watch it work before pointing it at your own API.
4. Assign a Slack credential to Post drift alert to Slack.
5. Run the workflow once to seed the snapshot (the first run records the shape and stays silent), then activate.

## What counts as a breaking change

The diff compares field paths, types, and nullability, never values; array indices collapse to `[]`, so a changed number or an extra list item never registers. Slack fires only on high or medium: a new optional field is recorded in the snapshot but stays quiet, since adding a field rarely breaks a consumer. Required here means the field is present in every instance of its container: in every element of a list, or on a single object.

| Severity | Change | Example |
|---|---|---|
| High | Removed field | `data.user.email` disappears |
| High | Type change | `id` goes from number to string |
| Medium | New required field | a field that is now present in every record |
| Medium | Nullability flip | a field that was always set now returns null |
| Low | New optional field | a field that appears in only some records |

## Testing it

1. Seed. With the default endpoint, run the workflow once. The Data Table now holds one row for `jsonplaceholder-users`, and no alert fires.
2. Quiet re-run. Run it again. The values differ but the shape does not, so nothing fires. This is value-churn suppression at work.
3. Force a break. Open the Data Table row and edit `schema_object`, for example delete the `"email"` entry or change a field's `"type"`. Run again. Slack posts a high severity alert naming the changed path, and the snapshot is refreshed so the next run is quiet.

## Error handling

The endpoint fetch retries a few times on a transient error, then routes a hard failure to the Skip node instead of halting. A 200 response that is not JSON (an HTML login page, for example) is treated the same way. In both cases the saved shape is left untouched, so a bad fetch never overwrites a good snapshot or raises a false alarm. For unattended runs, set an n8n error workflow so a persistent outage still reaches you.

## Customize

- Change the interval in Check on a schedule, or lower the alert bar to include low severity by editing the Breaking change found? gate.
- Watch several endpoints by running a copy per endpoint, each with its own `endpointKey`, all sharing one Data Table.
- Watch a private API by opening Fetch the endpoint, setting Authentication to the type your API uses (Header Auth or Bearer, for example), and adding your token as an n8n credential. Keep the token in the credential, never in a node field.
- Optional paid upgrade: add a small model step (gpt-4o-mini or Claude Haiku, with Groq free as the primary) to turn the change list into a plain-English note on what might break. The base workflow does not use it and ships fully free.
- For a production-critical contract, send the alert to an on-call destination (Opsgenie, PagerDuty, or Twilio SMS) alongside Slack.

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

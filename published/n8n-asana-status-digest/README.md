# Post a daily Asana project status digest to Slack

[Published n8n template](https://n8n.io/workflows/17271-post-a-daily-asana-project-status-digest-to-slack/)

I wanted one Slack message each morning that tells me where a project stands, without opening Asana. This workflow reads one Asana project on a weekday schedule and posts a digest: overdue, due today, due this week, unassigned, and completed since yesterday, plus how much open work each person is carrying. Nothing in the delivery path uses AI, so the counts are exact and the same every run.

Built with n8n, plus Asana and Slack.

![The Asana status digest workflow on the n8n canvas](images/workflow.png)

## How it works

A weekday-morning schedule triggers the run. An HTTP Request reads the project's tasks from the Asana REST API, asking for the exact fields the buckets need. A Code node does all the classification and counting, a second Code node formats the Slack message, and Slack posts it.

| Stage | What happens |
|---|---|
| Every Weekday Morning | A schedule fires Monday to Friday at the hour you set |
| Prepare Digest Config | Holds the project GID, Slack channel, timezone, and completed-task lookback in one place |
| Fetch Asana Project Tasks | Reads the project's tasks with `opt_fields` for name, assignee, due date, completion, and permalink |
| Bucket Tasks by Due Status | Classifies open tasks and tallies per-assignee load, all in plain JavaScript |
| Build Slack Digest Blocks | Formats the buckets into a Block Kit message |
| Post Digest to Slack | Posts one digest to the configured channel |
| Inspect Final Digest | A no-op that keeps the built payload so each run is inspectable |

The date math runs in the timezone you set in the config node, not the server timezone, so "due today" means today where your team is.

## Setup

1. Import `workflow.json` into n8n. It imports inactive, so configure it before activating.
2. Add an Asana credential (Personal Access Token) and assign it to "Fetch Asana Project Tasks". The same credential authorizes the raw REST call.
3. Add a Slack credential and assign it to "Post Digest to Slack".
4. Open "Prepare Digest Config" and set `projectGid` (the number in your Asana project URL), `slackChannel` (a channel ID, or switch the Slack node to its channel picker), and `timezone` (an IANA name like `America/Toronto`).
5. In "Every Weekday Morning", set the hour to run before standup. It defaults to weekdays at 08:00.
6. Run it once to check the message, then activate.

## The buckets

Each open task lands in the due bucket that matches its date. "Unassigned" is a separate list because those tasks need an owner, so a task can be both due today and unassigned.

| Bucket | When |
|---|---|
| Overdue | Open, and the due date is before today |
| Due today | Open, and the due date is today |
| Due this week | Open, and the due date is after today through the coming Sunday |
| Unassigned | Open, and no assignee |
| Completed recently | Completed within the last `lookbackHours` (24 by default) |

"Open load by assignee" counts every open task per person, including tasks with no due date, so it reflects real workload rather than just dated work. Completed tasks never count toward load.

## Optional one-line summary

The counts are computed in the Code node, so they never depend on a model. If you want a plain-English headline, add a Groq call that writes a `summaryLine` field before "Build Slack Digest Blocks", and the digest shows it above the buckets. It is off by default and changes none of the numbers.

## Error handling

The Asana read and the Slack post each retry a few times on a transient error. The Slack post runs once per execution so a retry never double-posts. For an unattended job like this, also set a workflow-level error workflow in n8n settings so a failure between nodes still reaches you.

## What is in this folder

| File | What it is |
|---|---|
| `README.md` | This overview |
| `TEMPLATE-DESCRIPTION.md` | The n8n Creator hub listing text |
| `workflow.json` | The importable n8n workflow |
| `images/` | The workflow overview image |

---

All sample data is fictional. No real credentials, IDs, or endpoints are included.

Part of the [n8n-exekyute-templates](../../README.md) collection. MIT licensed.

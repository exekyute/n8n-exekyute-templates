# Audit Asana task hygiene and log a weekly scorecard to Google Sheets and Slack

Once a week this scans one Asana project for open tasks that are missing an assignee or a due date, logs each one to a Google Sheet with the reasons it was flagged, and posts a completeness scorecard to Slack. I built it because a project board drifts quietly: tasks pile up with no owner and no date, and nobody notices until a standup. This gives me one number each Monday and the exact list behind it.

It reads from Asana and writes nothing back. The audit never touches your tasks.

Built with n8n, plus Asana, Google Sheets, and Slack.

![The Asana task hygiene auditor workflow](images/workflow.png)

## How it works

The schedule fires weekly, the project's tasks are pulled read-only from the Asana API, and each open task is checked against a few completeness rules. A task that fails any check becomes one row in the audit sheet. The run always posts a scorecard, even a clean week.

```
Schedule -> Config -> Fetch Asana tasks -> split + filter open -> score -> append flagged rows to Sheets
                                        \-> build scorecard -> post to Slack -> finish
```

| Stage | What happens |
|---|---|
| Every Monday at 8am | A schedule trigger starts the run. Change the day and time on the node. |
| Set Audit Config | One Set node holds the project GID, the Slack channel, the audit sheet link, and two optional check toggles. |
| Fetch Asana Tasks | An HTTP request pulls the project's tasks with the fields the audit needs. This is a read. |
| Split Task List and Filter to Open Tasks | The task list is split into one item per task, then narrowed to open tasks so the audit covers live work. |
| Score Task Hygiene | Each open task is scored. A task that fails a check becomes one audit row with its reason codes joined by commas. |
| Append Audit Rows in Sheets | Every flagged task is appended to the audit sheet, one row per task. |
| Build Slack Scorecard | A Code node counts the failures and computes the percent fully fielded and the top five offenders. |
| Post Scorecard to Slack | The scorecard posts to your channel with a link to the sheet. |
| Finish Audit Run | A No Op node closes the run, so the Slack branch has a clean end point. |

Every number in the scorecard is computed in plain code, not by a model. The scorecard is read from the Asana fetch directly, so it posts every week even when nothing is flagged.

## Setup

1. Import `workflow.json` into n8n. It imports inactive, so configure it before turning it on.
2. Add an Asana credential (a Personal Access Token) and select it on `Fetch Asana Tasks`. The same credential authenticates the HTTP request.
3. Open `Set Audit Config` and set `projectGid` (the number in your project URL), `slackChannel`, and `auditSheetUrl` (the sheet link that goes in the Slack message).
4. Connect a Google Sheets credential and pick the spreadsheet and tab on `Append Audit Rows in Sheets`.
5. Connect a Slack credential on `Post Scorecard to Slack`.
6. Add the header row to your audit sheet, then run once and activate.

## The config node

Everything you tune lives in one Set node, `Set Audit Config`:

| Field | What it controls |
|---|---|
| `projectGid` | The Asana project to audit. It is the number in the project URL. |
| `slackChannel` | The Slack channel ID the scorecard posts to. |
| `auditSheetUrl` | The link to the audit sheet, shown at the bottom of the Slack scorecard. |
| `checkSection` | Off by default. Turn on to also flag tasks that sit in no section. |
| `checkDescription` | Off by default. Turn on to also flag tasks with an empty description. |

Assignee and due date are always checked. Section and description are opt in, so you decide how strict the audit is.

## The audit sheet

One row is appended per flagged task. Add these headers to row 1 of your audit tab:

`audit_date`, `task_gid`, `task_name`, `assignee`, `section`, `due_on`, `reason_codes`, `permalink_url`

`reason_codes` is a comma-joined list from this set: `no_assignee`, `no_due_date`, `no_section`, `empty_description`. The sheet is the audit trail, so week over week you can see whether coverage is improving.

## Notes

The fetch pulls up to 100 tasks in one call, which covers most single projects. The limit counts every task the project returns, not just the open ones, so for a project with more than 100 tasks add Asana API pagination on the fetch node. The optional Groq summary described on the canvas is off by default and never sits in the scoring path.

## What is in this folder

| File | What it is |
|---|---|
| `README.md` | This overview |
| `TEMPLATE-DESCRIPTION.md` | The n8n Creator hub listing text |
| `workflow.json` | The importable n8n workflow |
| `images/` | The workflow overview image |

---

All sample data is fictional. No real credentials, IDs, or endpoints are included.

Part of the [n8n-exekyute-templates](../../) collection. MIT licensed.

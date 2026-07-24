# Sync Asana project tasks to a Google Sheet mirror

[Published n8n template](https://n8n.io/workflows/17306-sync-asana-project-tasks-with-a-mirrored-google-sheets-tab/)

On a schedule, read every task in one Asana project and upsert it into a Google Sheet keyed by task GID, keeping status, assignee, due date, and section current. When a task disappears from Asana its row is not deleted; it is flagged `present` = `No`, so the sheet is a durable backup rather than a one-time snapshot. It is a one-way mirror: the sheet never writes back to Asana.

Built with n8n, plus Asana and Google Sheets.

![The Asana to Google Sheet mirror workflow on the n8n canvas, running from a schedule trigger through the Asana fetch and GID diff into two Google Sheets write branches.](images/workflow.png)

## Use it when

- A spreadsheet copy of a project needs to stay current without anyone babysitting it. A manual export goes stale the day it is made; this mirror refreshes itself on the schedule you set.
- You want to pivot, chart, or filter project tasks, and a board view is the wrong shape for that. A flat tab with one row per task gives spreadsheet tools something to work with.

## How it works

A schedule triggers the run. An HTTP Request reads the project's tasks from the Asana REST API with the exact `opt_fields` the mirror needs, including the section name. One Code node flattens each task to a flat row, a second Code node diffs those tasks against the rows already in the sheet by GID, and two Google Sheets nodes write the result: an upsert for tasks still in Asana and an update that flags rows whose task is gone. The diff is deterministic and every write is keyed on `gid`, so re-runs are safe.

| Stage | What happens |
|---|---|
| Every Hour | A schedule fires on the interval you set |
| Set Sync Config | Holds the Asana project GID and the target Sheet ID and tab in one place |
| Fetch Asana Tasks | Reads the project's tasks 100 per page with `opt_fields` for name, assignee, due date, completion, section, permalink, and `modified_at`, paging until Asana stops returning a `next_page` |
| Flatten Tasks to Rows | Maps each task to a flat sheet row and stamps `synced_at` |
| Read Existing Rows in Sheets | Reads the rows already in the sheet to capture the current set of GIDs |
| Merge Tasks and Sheet Rows | Brings both sources into the diff as one input |
| Diff Tasks by GID | Marks each task for upsert and each vanished row for soft-delete, and counts created, updated, and removed |
| Route Upsert and Soft-Delete | Sends upserts and soft-deletes down their own branches |
| Upsert Rows in Sheets | Appends or updates each live task, keyed on the `gid` column |
| Flag Removed Rows in Sheets | Sets `present` = `No` and restamps `synced_at` on rows whose task left Asana, without deleting them |
| Merge Write Results | Brings the two write branches back together so the summary runs once |
| Build Run Summary | Writes a one-line count of created, updated, and removed |
| Finish Sync Run | A no-op that keeps the summary so each run is inspectable |

I key the whole mirror on the Asana task GID, so a task that is renamed or reassigned updates in place instead of creating a duplicate row, and a task that is removed is flagged rather than dropped.

## Requirements

- An Asana account with a Personal Access Token. Tasks come back 100 per page, so a large project costs several Asana calls per run.
- A Google account with edit access to the target spreadsheet.
- n8n (cloud or self-hosted) with Asana and Google Sheets credentials. No paid services are required.

## Setup

1. Import `workflow.json` into n8n. It imports inactive; configure before activating.
2. Add an Asana credential (Personal Access Token) and assign it to "Fetch Asana Tasks". The HTTP Request node calls the Asana REST API with that credential.
3. Add a Google Sheets credential, assign it to the three Google Sheets nodes, and pick your spreadsheet and the `Tasks` tab on each.
4. Give the tab this header row: `gid`, `name`, `assignee`, `section`, `due_on`, `completed`, `permalink`, `modified_at`, `synced_at`, `present`.
5. Open "Set Sync Config" and set `asana_project_gid` (the number in your Asana project URL), `sheet_id` (the spreadsheet ID from its URL), and `sheet_tab`.
6. Set the interval in "Every Hour" (it defaults to hourly), run it once to check the sheet, then activate.

## The mirror columns

Each task becomes one row, matched on `gid`, so the sheet is a flat, filterable copy of the project. No row is ever deleted: a task that leaves the project keeps its history with `present` set to `No`, and if it returns, the same row flips back to `Yes` on the next run.

| Column | What it holds |
|---|---|
| `gid` | The Asana task GID, the key every row is matched on |
| `name` | The task name |
| `assignee` | The assignee's name, or blank if unassigned |
| `section` | The task's section in the project, or blank |
| `due_on` | The due date, or blank |
| `completed` | Yes or No |
| `permalink` | A direct link to the task in Asana |
| `modified_at` | Asana's last-modified timestamp |
| `synced_at` | When this run wrote the row |
| `present` | Yes if the task is still in Asana, No if it was removed |

## Customize

- **Cadence.** Change the interval in "Every Hour" to sync more or less often.
- **Columns.** Add fields to the `opt_fields` list in "Fetch Asana Tasks", map them in "Flatten Tasks to Rows", and add the matching headers to the tab.
- **Target.** Point the mirror at another project or tab by editing the three values in "Set Sync Config".
- **Summary headline.** The run counts come from a Code node, so they never depend on a model, and no model call is wired in by default. For a plain-English headline of what changed, feed the counts to a Groq call after "Build Run Summary"; it would read the counts only and touch none of the row data.

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

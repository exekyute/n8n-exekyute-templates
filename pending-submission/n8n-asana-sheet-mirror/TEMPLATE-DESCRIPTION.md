On a schedule, this workflow reads every task in one Asana project and upserts it into a Google Sheet keyed by task GID, keeping status, assignee, due date, and section current. When a task is removed from the project the row is flagged `present` = `No` instead of being deleted, so the sheet is an always-current, self-healing mirror you can pivot and filter.

## Who's it for

Anyone who runs one Asana project and wants a live spreadsheet copy of it: a project manager building pivots and charts, an ops lead who needs a backup outside Asana, or an analyst who would rather filter a sheet than click through a board. It is a one-way mirror, not a two-way sync, so the sheet never writes back to Asana.

## How it works

A schedule fires on the interval you set. An HTTP Request reads the project's tasks from the Asana REST API with an `opt_fields` list that guarantees name, assignee, due date, completion, section, and permalink come back. A Code node flattens each task to a flat row. A second Code node reads the rows already in the sheet and diffs by GID: tasks still in Asana are marked for upsert, and rows whose task is gone are marked as soft-deletes. Two Google Sheets nodes then write the result, one upserting live tasks on the `gid` column and one flagging removed rows `present` = `No`. A final node writes a one-line run summary of created, updated, and removed.

## How to set up

Import the workflow. Add an Asana Personal Access Token credential and a Google Sheets credential. Give the target tab a header row, then in the config node set the Asana project GID, the Sheet ID, and the tab name. Set the schedule interval, run it once to check the sheet, then activate.

## Requirements

n8n, an Asana account with a Personal Access Token, and a Google account with access to the target spreadsheet. No paid services and no AI are required.

## Good to know

The mirror is fully deterministic: it never deletes a row, it upserts and flags by GID, so re-runs are safe and idempotent. One Asana read and one sheet pass run per schedule, which stays well within free rate limits.

## How to customize

Change the schedule interval to sync more or less often, add columns by mapping more `opt_fields`, or add an optional one-line summary from a cheap model such as Groq. The summary reads the counts only and never touches row data.

## Who's it for

Project leads, ops managers, and anyone who owns an Asana project and wants it to stay clean without policing it by hand. Boards drift: tasks get created with no owner and no due date, and it goes unnoticed until something slips. This runs a weekly check and gives you one completeness number plus the exact list of tasks behind it.

## How it works

A schedule fires weekly and reads one Asana project's tasks over the REST API, so nothing is ever written back into Asana. The task list is split into individual tasks and filtered to open work. A Code node scores each open task against a few rules: missing assignee, missing due date, and optionally missing section or an empty description. Every failing task is appended to a Google Sheet as one row, with its reasons joined by commas. A second Code node computes the run totals, the percent of open tasks that are fully fielded, and the top offenders, then posts a scorecard to Slack with a link to the sheet. The scorecard posts every week, even when nothing is flagged.

## How to set up

Import the workflow. Add an Asana Personal Access Token credential and select it on the fetch node. Open the config node and set the project GID, the Slack channel, and the audit sheet link. Turn on the section and description checks if you want a stricter audit. Connect a Google Sheets credential and pick the spreadsheet and tab. Connect a Slack credential and pick the channel. Add the header row to the audit sheet, run once, and activate.

## Requirements

n8n, an Asana Personal Access Token, a Google Sheets OAuth2 credential, and a Slack credential. The audit is read-only against Asana.

## Good to know

The fetch pulls up to 100 tasks in one call, which covers most single projects. For a larger project, add Asana pagination on the fetch node. Every number in the scorecard is computed in plain code, so the result is deterministic and does not depend on a model.

## How to customize the workflow

Change the Monday 8am schedule to any cadence. Turn the section and description checks on or off in the config node. Add columns to the audit row in the score node. For a plain-English one-liner on top of the numbers, add a Groq node after the scorecard is built and prepend its sentence to the Slack text, keeping the model out of the scoring path.

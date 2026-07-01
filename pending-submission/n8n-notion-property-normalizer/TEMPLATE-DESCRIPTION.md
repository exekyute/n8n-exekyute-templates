## What this workflow does

Point it at one Notion database and it keeps the properties tidy on a schedule, without any AI. It backfills a missing Status with a default you set, folds inconsistent Status spellings into one canonical value (for example `wip`, `in progress`, and `In Progress` all become `In Progress`), derives a slug key and an ISO created-week stamp from each row, and stamps a "Last normalized" time. It is for anyone whose Notion CRM, content calendar, or tracker drifts into mixed casing, blank statuses, and missing fields after imports and quick edits. Fully deterministic: the same row always resolves the same way.

## How it works

A daily Schedule trigger reads every row with full property data. A Code node applies an editable rules block (property names, a default, and a canonical-value map) and flags only the rows that actually change. A Switch updates each changed row in place and appends a one-line recap of the run to a log page. Rows that are already clean produce no write, and a present but unrecognized value is never overwritten.

## Setup

Import the workflow, connect a Notion credential and share the database and log page, pick the database, edit the rules block, and paste your log page URL. Run it once on a test database, then activate.

## Requirements

n8n and a Notion internal integration credential. No paid services and no AI.

## Good to know

Only changed rows are written, so it is safe to schedule. The "Last normalized" stamp is applied only when a row really changes, so clean rows stay untouched. Test on a copy of your database first.

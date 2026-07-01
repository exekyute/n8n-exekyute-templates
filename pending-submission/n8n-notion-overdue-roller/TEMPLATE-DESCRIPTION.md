## What this workflow does

Point it at one Notion task database and it rewrites overdue tasks in place on a schedule, instead of just reminding you about them. It rolls each past-due date forward to today (or the next business day), counts how many times a task has been rolled, and checks a Stale flag once a task has been pushed too many times. Finished tasks and tasks that are not yet due are never touched. It is for anyone whose Notion task list, content calendar, or sprint board fills up with red overdue dates that no longer mean anything. No AI, fully deterministic.

## How it works

A daily Schedule trigger reads every row from the target database with full property data. A Code node keeps only rows that are past due and not done, then works out the new date, the next roll count, and the stale flag for each. A native Notion update writes those three values back on every row that changed, in place. Rows that would not change are skipped, so the workflow is safe to run repeatedly.

## Setup

Import the workflow, connect a Notion credential and share the database with the integration, pick the database in Get Open Tasks, set the property names and thresholds in the Code node, and map the Due, Rolled, and Stale property values in the update step. Run it once on a test database, then activate.

## Requirements

n8n and a Notion internal integration credential. No paid services and no AI.

## Good to know

The database needs a Date property, a Status or Select property, a Number counter, and a Checkbox flag. Overdue is judged by calendar date, so a task due earlier today is left alone. Test on a copy of your database first.

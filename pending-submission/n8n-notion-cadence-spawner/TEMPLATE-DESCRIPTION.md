Keep every recurring to-do in one Notion database of rules, and let a daily schedule create the actual task pages. Four recurrence patterns are supported, including the nth weekday of the month and the last one.

## Who's it for

Teams whose recurring work lives in someone's head and a reminder they snooze. It also covers the cadences Notion's own repeating templates cannot express, like the last Friday of the month or every 10 days from a fixed anchor date.

## How it works

A daily Schedule Trigger reads a Notion database where each row describes one recurring task. A Code node tests every rule against today's date in a configurable timezone: every N days from an anchor, weekly on chosen weekdays, monthly on a given day, or the nth weekday of the month with `-1` meaning the last. A Data Table ledger is then read, and any rule already stamped with today's date is dropped, so running the workflow twice on the same day creates nothing the second time. Notion creates one page per surviving rule with the due date set to today, the ledger is upserted on `rule_id`, and Slack gets a one-line summary naming what was created.

## How to set up

Give the rules database the ten documented properties and the tasks database a date property named `Due`. Create a Data Table called `cadence_last_spawned` with the columns `rule_id`, `last_spawned_on` and `rule_title`. Connect Notion on both Notion nodes and replace the two database ID placeholders, connect Slack and pick a channel, then set `TIMEZONE` at the top of the recurrence Code node.

## Requirements

A Notion workspace with two databases, a Slack workspace, and n8n with Notion and Slack credentials plus Data Tables available.

## Good to know

The ledger keys on the spawn date rather than a run counter, so a retry, a manual run and a catch-up after downtime all converge on one task per rule per day.

A monthly rule set to the 31st clamps to the last day in shorter months. It fires on 30 April and on 28 or 29 February rather than skipping those months.

## How to customize the workflow

Set `active` to false on a rule to pause it without deleting it. Add assignee, project or priority to the Notion create node and add matching columns to the rules database. A new recurrence pattern is a new branch in the frequency test, where each pattern is a self-contained block returning a hit or a miss.

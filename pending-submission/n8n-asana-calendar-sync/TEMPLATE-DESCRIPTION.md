On a timer, this workflow mirrors the due dates of one Asana project into a Google Calendar. New dated tasks become events, changed dates move the event, and tasks that are completed, lose their date, or leave the project have their event deleted. The sync is one-way, so the calendar follows Asana and never writes back.

## Who's it for

Anyone who plans in a calendar but tracks work in Asana: a project manager who wants deadlines next to meetings, a freelancer juggling client projects, or a team that keeps a shared deadline calendar. Point it at a dedicated calendar and the synced deadlines sit in a layer you can toggle on and off.

## How it works

A schedule fires on the interval you set. The workflow reads every task in the project with its due date, completion state, assignee, and permalink, then lists the calendar events it created previously by searching for the `asana_gid:` token stored in each event description. A Code node diffs the two sets and marks each task create, update, or delete, and a switch routes each decision to the matching Google Calendar node. A task with a date but no time becomes an all-day event; a task with a time becomes a timed event of the length you configure. A final node counts what the run changed.

## How to set up

Import the workflow. Add an Asana Personal Access Token credential and a Google Calendar credential. In the config node, set the Asana project GID and the target calendar ID, then set the schedule interval. Run it once to backfill the calendar, then activate.

## Requirements

n8n, an Asana account with a Personal Access Token, and a Google account with write access to the target calendar. No paid services and no AI are required.

## Good to know

The Google Calendar node does not expose `extendedProperties`, so the task ID lives as an `asana_gid:<GID>` line in the event description and doubles as the idempotency key. Keep that line and each task keeps updating the same event, so re-runs never create duplicates. Events whose task no longer exists in the project are cleaned up on the next run.

## How to customize

Change the schedule interval, the length of a timed event, or the target project and calendar. The event title and description are built in the reconcile node, so you can add fields such as the section or the assignee's initials to the title there.

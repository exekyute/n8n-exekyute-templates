# Sync Asana task due dates to Google Calendar

[Published n8n template](https://n8n.io/workflows/17269-sync-asana-task-due-dates-with-google-calendar-events/)

Read one Asana project on a timer and mirror every dated task into a Google Calendar: new tasks become events, changed dates move the event, and a task that is completed or loses its date has its event removed. The sync is one-way, so the calendar follows Asana and never writes back. Each event carries an `asana_gid:` token in its description, which is how the workflow recognizes its own events on every run.

Built with n8n, plus Asana and Google Calendar.

![The Asana to Google Calendar sync workflow on the n8n canvas, running from a schedule trigger through Asana and Calendar read nodes into a reconcile Code node, a switch, and the create, update, and delete branches.](images/workflow.png)

## Use it when

- You plan your week in a calendar but the deadlines live in Asana, so you keep two lists by hand and they drift apart the first time a date moves.
- A due date slips in Asana and the calendar copy silently keeps the old date. Here the next run moves the event, and a completed task takes its event with it.
- A team keeps a shared deadline calendar next to its meetings. Point this at a dedicated calendar and the synced deadlines sit in a layer anyone can toggle off.

## How it works

A schedule triggers the run. The workflow reads the project's tasks, reads the events it has already created, and a Code node compares the two sets to decide what to create, update, or delete. A switch sends each decision to the matching Google Calendar node. Both read nodes have "Always Output Data" on: without it, a first run against an empty calendar returns zero items and the chain halts, and the reconcile code ignores the empty placeholder items so the bootstrap run works the same as every run after it.

| Stage | What happens |
|---|---|
| Every 15 Minutes | A schedule fires on the interval you set |
| Set Sync Config | Holds the Asana project GID, the target calendar ID, and the length of a timed event in one place |
| Get Asana Tasks | Reads the project's tasks with their due date, completion state, assignee, and permalink |
| Get Synced Events | Lists the calendar events this workflow created, found by searching for the `asana_gid:` token |
| Reconcile Tasks and Events | Diffs tasks against events and marks each one create, update, or delete |
| Route by Action | Sends each decision down its own branch |
| Create Calendar Event | Adds an event for a task that does not have one yet |
| Update Calendar Event | Moves or retitles the existing event when the task changes |
| Delete Calendar Event | Removes the event when the task is completed, loses its date, or leaves the project |
| Build Run Summary | Counts what the run created, updated, and deleted |
| Done | A no-op that keeps the summary so each run is inspectable |

I hang the run summary off the reconcile step rather than the write nodes: the three write branches converge, so a summary placed after them would fire once per branch instead of once per run.

## Requirements

- An Asana account with a Personal Access Token. No paid plan is required.
- A Google account with write access to the target calendar.
- n8n (cloud or self-hosted) with Asana and Google Calendar credentials.

## Setup

1. Import `workflow.json` into n8n. It imports inactive, so configure it before activating.
2. Add an Asana credential (Personal Access Token) and select it on "Get Asana Tasks".
3. Add a Google Calendar credential and select it on the four calendar nodes: "Get Synced Events", "Create Calendar Event", "Update Calendar Event", and "Delete Calendar Event".
4. Open "Set Sync Config" and set `asanaProjectGid` (the number in your Asana project URL) and `calendarId` (the calendar ID from Google Calendar settings, which is an address like `you@gmail.com` for your default calendar).
5. In "Every 15 Minutes", set how often to sync.
6. Run it once to backfill the calendar, then activate.

Point it at a dedicated calendar rather than your main one. The synced events then sit in their own layer you can toggle off, and a misconfigured run never touches your real appointments.

## The asana_gid token

The Google Calendar node does not expose the `extendedProperties` field that Google normally uses for private metadata, so there is nowhere hidden to stash the task ID. Instead each event description ends with an `asana_gid:<GID>` line, and the workflow finds its own events by searching the calendar for that token. That line is the idempotency key: keep it and a task keeps updating the same event, delete it and the next run creates a duplicate. The reconcile step also sweeps up orphans: an event carrying a GID that no longer appears anywhere in the project gets deleted, so tasks removed from Asana do not leave stray events behind.

## The task-to-event mapping

| Task in Asana | Event in the calendar |
|---|---|
| Due date only (`due_on`) | An all-day event on that date |
| Due date and time (`due_at`) | A timed event starting then, lasting `timedEventMinutes` (30 by default) |
| No due date | No event at all |
| Completed | The event is deleted |
| Removed from the project | The orphaned event is deleted |

The event title is the task name. The description holds a link back to the task, the assignee, and the `asana_gid` line.

## Customize

- **Cadence.** Change the interval in "Every 15 Minutes". Re-runs never create duplicates, so a tighter schedule only changes how fresh the calendar is.
- **Timed event length.** Set `timedEventMinutes` in "Set Sync Config" to control how long a task with a due time blocks on the calendar.
- **Target project and calendar.** Both live in "Set Sync Config". Duplicate the workflow to sync a second project into a second calendar.
- **Event title and description.** Both are assembled in "Reconcile Tasks and Events", so the title can carry more than the task name. The assignee and the permalink are already on hand there; any other Asana field has to be added to `opt_fields` on "Get Asana Tasks" first.

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

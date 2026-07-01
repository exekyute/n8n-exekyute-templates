# Roll overdue Notion tasks forward and flag ones rolled too often

Point this workflow at one Notion task database and it rewrites overdue tasks in place on a schedule. It rolls each past-due date forward to today, counts how many times a task has been rolled, and checks a Stale flag once a task has been pushed too many times. It is not a reminder, so it notifies nothing. No AI, fully rule based, so the same board always resolves the same way.

Built with n8n and Notion.

![Workflow canvas](images/workflow.png)

## How it works

A Schedule trigger runs the workflow each morning. A Notion node reads every row from the target database with full property data. A Code node finds rows whose due date is in the past and whose status is not one of your done values, then works out a new date, the next roll count, and the stale flag for each. Only the rows that actually change are written back with the native Notion update step, in place. Finished tasks and tasks that are not yet due are never touched.

| Stage | What happens |
|---|---|
| Read tasks | A Notion node pulls every row from the target database with full property data |
| Find overdue | A Code node keeps only rows that are past due and not done, and computes the new date, counter, and flag |
| Write back | A Notion update writes the new due date, the incremented counter, and the Stale flag on each changed row |

## Setup

1. Import `workflow.json` into n8n. It imports inactive, so configure it before activating.
2. Assign a Notion credential to both Notion steps (Get Open Tasks, Update Rolled Tasks). Share the target database with the integration.
3. In "Get Open Tasks", select the database that holds your tasks.
4. Open "Roll Overdue Dates and Flag Stale" and set the property names, done values, threshold, and roll target at the top of the code.
5. In "Update Rolled Tasks", map the Due, Rolled, and Stale property values to your own property names.
6. Run it once on a copy or a test database, then activate.

## The Notion properties you need

The database this runs against must have these four properties. The names are yours to choose, as long as they match the config at the top of the Code node.

| Property | Notion type | What it is for |
|---|---|---|
| Due | Date | The deadline the workflow reads and rolls forward |
| Status | Status or Select | The task state; any value listed in `DONE_VALUES` is treated as finished and skipped |
| Rolled | Number | A counter the workflow increments by one every time it rolls the task |
| Stale | Checkbox | A flag the workflow sets to true once the roll count passes `STALE_THRESHOLD` |

A row with no Due date, or with a status in `DONE_VALUES`, is left alone. A row with no Status value is treated as not done, so it is eligible to roll.

## How rolling works

The settings live in a clearly marked block at the top of the "Roll Overdue Dates and Flag Stale" node:

```js
const DUE_PROPERTY    = 'Due';      // Date property that holds the deadline
const STATUS_PROPERTY = 'Status';   // Status or Select property that holds task state
const DONE_VALUES     = ['Done', 'Complete', 'Completed', 'Cancelled', 'Archived'];
const ROLLED_PROPERTY = 'Rolled';   // Number property: how many times this task has been rolled
const STALE_PROPERTY  = 'Stale';    // Checkbox property: set true once rolled past the threshold
const STALE_THRESHOLD = 3;          // flag Stale once a task has been rolled MORE than this many times
const ROLL_TO         = 'today';    // 'today' | 'nextBusinessDay'
```

Overdue is judged by calendar date: a task counts as overdue when its due date is before today, so a task due earlier today is left as is. Each overdue, unfinished task gets its due date set to today, or to the next business day when `ROLL_TO` is `nextBusinessDay` and today is a weekend. The roll counter goes up by one, and Stale is set to true once the new count is greater than `STALE_THRESHOLD`. A task that keeps getting pushed climbs the counter until it crosses the line and is flagged.

## Idempotent by design

Only rows that change are written. Because an overdue task is rolled to today, a second run on the same day sees it as due today, not overdue, and skips it. Finished tasks and tasks that are not yet due are never written. Running the workflow twice in a row produces no extra edits.

## Customize

- Set `ROLL_TO` to `today` or `nextBusinessDay`.
- Change `STALE_THRESHOLD` to control how many rolls make a task stale.
- Add or remove entries in `DONE_VALUES` to match your own status names.
- Point the property names at whatever your database calls them.
- Adjust the schedule on the "Every Morning at 7am" trigger.

## Requirements

- n8n.
- A Notion internal integration credential with access to the target database. No paid services and no AI are required.

## What is in this folder

| File | What it is |
|---|---|
| `README.md` | This overview |
| `TEMPLATE-DESCRIPTION.md` | The n8n Creator hub listing text |
| `workflow.json` | The importable n8n workflow |
| `images/workflow.png` | Canvas screenshot |

---

All sample data is fictional. No real credentials, IDs, or endpoints are included.

Part of the [n8n-exekyute-templates](../../) collection. MIT licensed.

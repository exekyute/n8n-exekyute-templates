# Normalize and backfill Notion database properties from an editable rules table

[Published n8n template](https://n8n.io/workflows/16800-normalize-and-backfill-notion-database-properties-with-rules-and-logging/)

Point this workflow at one Notion database and it keeps the properties tidy on a daily schedule: it backfills a missing Status with a default, folds inconsistent Status spellings into one canonical value, derives a slug key and a created-week stamp from each row, and appends a one-line recap to a log page. Everything runs from an editable rules block, fully rule based and deterministic, so the same row always resolves the same way and only rows that actually change are written.

Built with n8n, plus Notion.

![The property normalizer workflow on the n8n canvas, running from a daily schedule trigger through a Notion read and a rules Code node into a Switch that updates changed rows and logs the run.](images/workflow.png)

## Use it when

- A CSV import or a week of quick edits leaves your tracker with `wip`, `in progress`, and `In Progress` as three different values, and filtered views quietly miss two of them.
- New rows land without a Status, so every grouped board grows a blank column nobody triages.
- You want a stable slug key and a created-week stamp maintained on every row for rollups and lookups, without keeping them current by hand.

## How it works

A Schedule trigger fires each day and a Notion node reads every row from the target database with full property data. A Code node applies the rules block to each row: it backfills an empty Status, canonicalizes known Status variants, and computes a title slug plus an ISO year-week stamp. It then compares each result to what Notion already holds and marks a row changed only when its Status, Key, or Created week would actually differ; the "Last normalized" stamp rides along on real changes and never on its own, so it cannot make every row look dirty on the next run. A Switch routes changed rows to the update step and a run recap to the log, and already-clean rows are skipped entirely.

| Stage | What happens |
|---|---|
| Every Day at 3am | Fires the run on a daily schedule |
| Get Database Rows | Pulls every row from the target database with full property data |
| Apply Normalization Rules | Backfills, canonicalizes, and derives fields, then flags only the rows that change |
| Route by Item Type | Sends changed rows to the update step and the run recap to the log |
| Update Normalized Rows | Updates each changed row in place and stamps the Last normalized time |
| Append Run to Log | Appends a one-line recap to your log page, on every run |

I diff every derived value against the stored one before writing because a database that is already clean should produce zero writes; that is what makes this safe to leave on a schedule.

## Requirements

- A Notion internal integration with access to the target database and the log page.
- n8n (cloud or self-hosted) with a Notion credential. No paid services and no AI are required.

## Setup

1. Import `workflow.json` into n8n. It imports inactive; configure before activating.
2. Assign a Notion credential to the three Notion steps (Get Database Rows, Update Normalized Rows, Append Run to Log). Share the target database and the log page with the integration.
3. In "Get Database Rows", select the database to normalize.
4. Open "Apply Normalization Rules" and edit the CONFIG block: the property names, `DEFAULT_STATUS`, and the `CANONICAL_STATUS` map.
5. In "Update Normalized Rows", confirm the four mapped properties match your database.
6. In "Append Run to Log", paste the URL of the page that should receive the recap.
7. Run it once on a copy or a test database, then activate.

## The rules table

The database needs these five properties. Each maps to a constant in the CONFIG block at the top of "Apply Normalization Rules"; rename a property there, and in the Update node's mappings, if yours are named differently.

| Property (constant) | Type | What the workflow does with it |
|---|---|---|
| `Name` (`TITLE_PROP`) | Title | Read only. The source for the derived key. |
| `Status` (`STATUS_PROP`) | Select | Backfilled with `DEFAULT_STATUS` (ships as `To Do`) when empty, canonicalized when it matches a known variant, left alone when it is an unknown value. |
| `Key` (`KEY_PROP`) | Rich text | Set to a slug of the title, for example `Acme Corp` becomes `acme-corp`. Governed by `COMPUTE_KEY`. |
| `Created week` (`WEEK_PROP`) | Rich text | Set to an ISO year-week stamp from the row's created time, for example `2026-W25`. Governed by `COMPUTE_WEEK`. |
| `Last normalized` (`NORMALIZED_AT_PROP`) | Date | Stamped with the run time whenever the workflow changes a row. |

The `CANONICAL_STATUS` map ships with three canonical values and the spellings that fold into each: `to do`, `todo`, `to-do`, `not started`, `backlog`, and `new` resolve to `To Do`; `in progress`, `in-progress`, `wip`, `doing`, `started`, and `ongoing` resolve to `In Progress`; and `done`, `complete`, `completed`, `finished`, and `closed` resolve to `Done`. Keys are matched with case and surrounding spaces ignored, so `  IN PROGRESS ` still resolves, and each canonical value also folds onto itself, so a value that is already correct is recognized and left as is. A present Status that matches no key is treated as intentional and never overwritten; only an empty Status is backfilled to `DEFAULT_STATUS`.

## The run log

Every run appends one line to the log page, and clean runs are logged too, so the page holds a full history. For example:

```
Normalize run 2026-07-01 03:00: scanned 240 rows, normalized 6 (2 status filled, 3 status canonicalized, 4 keys, 3 weeks), 234 already clean.
```

## Customize

- Add spellings to `CANONICAL_STATUS`, or point `STATUS_PROP` at a different select property.
- Change `DEFAULT_STATUS` to whatever an empty Status should become.
- Set `COMPUTE_KEY` or `COMPUTE_WEEK` to `false` to leave that derived field untouched.
- Adjust the schedule on the "Every Day at 3am" trigger.

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

# Deduplicate a Notion database by keeping the newest row and archiving the rest

Point this workflow at one Notion database and it removes duplicate rows on a schedule, keeping the best record in each set instead of an arbitrary one, and writing a recap of every run to a log page. No AI, fully rule based, so the same data always resolves the same way.

Built with n8n and Notion.

## How it works

A Schedule trigger runs the workflow each day. A Notion node reads every row from the target database with full property data. A Code node groups the rows by a property you choose, ignoring case and surrounding spaces, and finds any group with more than one row. For each duplicate group it keeps one row, the newest by default, and marks the others. A Switch routes duplicates to the archive step and routes a run recap to the log. Each duplicate is archived to the Notion trash, where it stays recoverable for 30 days, and a one-line recap is appended to a log page on every run.

| Stage | What happens |
|---|---|
| Read rows | A Notion node pulls every row from the target database with full property data |
| Find duplicates | A Code node groups rows by your chosen property and picks a keeper per group |
| Route | A Switch sends duplicates to the archive step and the run recap to the log |
| Archive | Each losing duplicate is archived to the Notion trash through the Notion API |
| Log the run | A one-line recap is appended to your log page, on every run |

## Setup

1. Import `workflow.json` into n8n. It imports inactive, so configure it before activating.
2. Assign a Notion credential to the three Notion steps (Get Database Rows, Archive Duplicate Page, Append Run to Audit Log). Share the target database and the log page with the integration.
3. In "Get Database Rows", select the database to deduplicate.
4. Open "Find Duplicates and Build Recap" and set `MATCH_PROPERTY` and `KEEP_RULE` at the top of the code.
5. In "Append Run to Audit Log", paste the URL of the page that should receive the recap.
6. Run it once on a copy or a test database, then activate.

## How duplicates are chosen

The two settings live in a clearly marked block at the top of the "Find Duplicates and Build Recap" node:

```js
const MATCH_PROPERTY = 'Name';   // property used to detect duplicates
const KEEP_RULE = 'newest';      // 'newest' | 'oldest' | 'mostFilled'
```

Rows are grouped by `MATCH_PROPERTY` (title, text, URL, email, number, or select), with case and surrounding spaces ignored so `Acme Corp` and `  acme corp ` match. Any group with two or more rows is a duplicate set. `KEEP_RULE` decides which row survives: `newest` keeps the most recently edited, `oldest` keeps the earliest, `mostFilled` keeps the row with the most filled properties. Rows with an empty value in that property are never touched.

## What gets logged

Every run appends one line to the log page, for example:

```
Dedup run 2026-07-01 02:00: scanned 240 rows, 3 without a key, 4 duplicate groups, archived 6 duplicates. Match property: Name. Keep rule: newest.
```

Clean runs are logged too, so the page holds a full history.

## Customize

- Change `KEEP_RULE` to `newest`, `oldest`, or `mostFilled`.
- Point `MATCH_PROPERTY` at any title, text, URL, email, number, or select property.
- Adjust the schedule on the "Every Day at 2am" trigger.
- Archiving sends rows to the Notion trash rather than deleting them, so a bad run is recoverable for 30 days.

## Requirements

- n8n.
- A Notion internal integration credential with access to the target database and the log page. No paid services and no AI are required.

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

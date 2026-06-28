# Reconcile daily CSV exports in Google Drive into a deduped master with a reject lane and Slack recap

Multi-branch teams export a CSV a day, and someone ends up stitching them into one clean file by hand. This workflow merges every CSV in a Google Drive folder into a single deduplicated master, quarantines every bad row to a dated reject file with the reason it failed, and posts a rows in, merged, quarantined, duplicates recap to Slack. No AI, fully rule based, so the same input always produces the same result.

Built with n8n, plus Google Drive and Slack.

## How it works

On a schedule, the workflow lists every CSV in the folder, downloads and parses each one, and merges all the rows. A Code node validates each row, deduplicates on a key, and splits the clean rows from the bad ones. The good rows are written to a dated master CSV and the rejected rows to a dated reject file, both uploaded back to Drive, and a recap is posted to Slack.

| Stage | What happens |
|---|---|
| Run on schedule | A Schedule Trigger fires once a day |
| List and download | Google Drive lists every CSV in the folder and downloads each one |
| Parse | Extract from File turns each CSV into rows |
| Reconcile | A Code node merges all rows, validates each, deduplicates on the key, and splits good from bad |
| Write master | Convert to File builds a clean master CSV of the deduped good rows, uploaded to Drive |
| Quarantine | Every bad row is written to a dated reject file with a reason, uploaded to Drive |
| Recap | Slack receives the rows in, merged, quarantined, and duplicates counts |

The reject file and the recap are the point: every row that does not reach the master is accounted for, so a run is auditable instead of a silent merge.

## Setup

1. Import `workflow.json` into n8n. It imports inactive, so configure it before activating.
2. Assign a Google Drive credential to the three Google Drive nodes, and a Slack credential to the recap node.
3. In "List CSV Files in Folder", pick the folder your exports land in.
4. In "Reconcile CSVs", set the required columns, the dedup key, and the format checks in the block at the top of the node.
5. In "Upload Master CSV" and "Upload Reject CSV", pick the folder to write the output files to.
6. In "Post Recap to Slack", pick the channel.
7. Run it once on a few test files, then activate.

## The reconciliation rules

The rules live in a clearly marked block at the top of the "Reconcile CSVs" node:

```js
const REQUIRED_COLUMNS = ['order_id', 'branch', 'sku', 'qty', 'amount', 'order_date'];
const KEY_COLUMN = 'order_id';
const COLUMN_TYPES = { qty: 'integer', amount: 'number', order_date: 'date' };
const OUTPUT_PREFIX = 'reconciled';
```

A row must have every required column present and non-empty, a non-empty key, and pass the format checks (integer, number, or date as YYYY-MM-DD). A row that fails is quarantined with the reason. Surviving rows are deduplicated on the key column, keeping the first occurrence and quarantining later duplicates.

## What gets quarantined

Every row that does not reach the master goes to `reconciled-rejects-YYYY-MM-DD.csv` with three audit columns added:

| Column | Holds |
|---|---|
| source_file | The CSV the row came from |
| reject_type | `invalid`, `duplicate`, or `unreadable_file` |
| reject_reason | The specific reason, for example `column "qty" is not a valid integer (got "abc")` |

The master file, `reconciled-master-YYYY-MM-DD.csv`, holds only the clean deduped rows, with no audit columns.

## The recap

The Slack message reconciles the whole run:

```
CSV Folder Reconciler run (2026-06-28)
Files read: 4
Rows in: 14
Merged to master: 8
Quarantined (invalid): 4
Duplicates dropped: 2
Unreadable files: 1
Master file: reconciled-master-2026-06-28.csv
Reject file: reconciled-rejects-2026-06-28.csv (7 rows)
```

Rows in always equals merged plus quarantined plus duplicates, so the numbers balance.

## Error handling

The Drive steps retry a few times on a transient error. A file that cannot be parsed is logged to the reject file as an `unreadable_file` and the run carries on, so one bad file never halts the reconciliation. When nothing is quarantined, no reject file is written; when there are no valid rows, no master is written. The recap always posts.

## Customize

- Edit the rules block to change the required columns, the dedup key, or the format checks.
- Change the schedule, or the `reconciled` output prefix.
- Point the two upload nodes at a separate output folder. The List node already skips the `reconciled-` prefix, so writing the outputs back to the same folder is safe too.
- Drop the Slack node to run with Google Drive only.
- Optional paid upgrade: feed only the count summary (never the file contents) to a cheap LLM (Groq free, or gpt-4o-mini / Claude Haiku) for a smoother narrative recap line. The base workflow does not use it and ships fully free.

## Requirements

- n8n.
- A Google Drive credential (OAuth2) with access to the folder.
- A Slack credential (bot token or OAuth2).

## What is in this folder

| File | What it is |
|---|---|
| `README.md` | This overview |
| `TEMPLATE-DESCRIPTION.md` | The n8n Creator hub listing text |
| `workflow.json` | The importable n8n workflow |

---

All sample data is fictional. No real credentials, IDs, or endpoints are included.

Part of the [n8n-exekyute-templates](../../) collection. MIT licensed.

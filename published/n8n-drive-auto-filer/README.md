# Auto-file Google Drive inbox files into dated folders by filename rules

[Published n8n template](https://n8n.io/workflows/16812-file-google-drive-inbox-documents-into-dated-folders-with-a-google-sheets-audit-log/)

Drop files into one Google Drive inbox folder and each one is filed into a dated Year/Month/Type folder tree, with an audit row written to a Google Sheet for every move. The destination Type comes from an editable rules table of filename patterns, checked top to bottom with the first match winning, so the same filename always lands in the same place. Every folder level is searched before it is created, so an existing year or month is reused instead of duplicated.

Built with n8n, plus Google Drive and Google Sheets.

![The Drive Auto-Filer workflow on the n8n canvas, running from a Google Drive trigger through the rules Code node and a Switch into the find-or-create folder chain and the audit sheet.](images/workflow.png)

## Use it when

- A shared drive has turned into a dumping ground. Everything gets uploaded to one folder and nobody moves it, so finding last quarter's invoice means scrolling.
- You want filing you can predict and correct. Every decision sits in one rules block you can read, and a file that matches nothing is filed under `_Unsorted` rather than guessed at.
- Someone asks where a document went three months later. The audit sheet holds a row per move with the original filename, the rule that matched, and the destination path.

## How it works

A new file lands in the inbox and the trigger fires. A Code node matches the filename against the rules table, picks a Type, and builds a destination path from the file's created date, for example `2026/06/Contracts`. Each folder level is found or created, the file moves into the leaf folder, and the move is logged.

| Stage | What happens |
|---|---|
| Watch Inbox Folder | Fires on each new file in the Drive inbox folder you pick, polling every minute by default |
| Plan Destination From Rules | Matches the filename against the rules table, sets the Type, and builds `year/month/type` from the file's created date |
| Route By Document Type | Routes the file down its Type branch, with `Unsorted / Needs Review` as the catch-all output. All five branches rejoin at the same folder chain |
| Find Year Folder, Find Month Folder, Find Type Folder | Each level is searched under its parent, and an IF check ("Year Folder Exists?" and its two siblings) decides whether the matching Create node runs |
| Move File Into Folder | Moves the file out of the inbox into the leaf folder |
| Append Audit Row, Log Filing Failure | A completed move writes one `Filed` row. Any failed step in the chain writes a `Failed` row with the error message and lets the rest of the run continue |

I search each level before creating it because the blind alternative fills the archive with three folders named `2026` and nothing afterwards can tell you which one holds what.

## Requirements

- A Google account with Drive access to two folders, the watched inbox and a separate archive root that holds the dated tree, plus a Google Sheet for the audit log.
- n8n (cloud or self-hosted) with Google Drive and Google Sheets OAuth2 credentials.

## Setup

1. Import `workflow.json` into n8n. It imports inactive; configure before activating.
2. Assign a Google Drive credential to "Watch Inbox Folder" and to the seven Google Drive nodes, and a Google Sheets credential to "Append Audit Row" and "Log Filing Failure". One Google account can back both.
3. In "Watch Inbox Folder", pick the inbox folder to watch. Open "Plan Destination From Rules" and set `FILED_ROOT_FOLDER_ID` to the folder that should hold the dated tree, copying the ID from the part of the folder URL after `drive.google.com/drive/folders/`. Use a different folder than the inbox, or filed documents get picked up again on the next run.
4. In "Append Audit Row" and "Log Filing Failure", pick your audit spreadsheet and tab, and give row 1 the headers listed below.
5. Run it once on a test file, check the tree and the sheet, then activate.

## The rules table

![The Google Drive trigger, the rules Code node, and the Switch that routes by document Type, on the n8n canvas.](images/step-1-classify.png)

*The Code node decides the Type from the filename, and the Switch gives each Type its own branch.*

The rules sit in a marked block at the top of "Plan Destination From Rules". Each rule maps a filename pattern to a Type, and the Type becomes the folder name. Patterns are case-insensitive regular expressions, so put the specific ones higher.

```js
const RULES = [
  { pattern: 'contract|agreement', type: 'Contracts' },
  { pattern: 'invoice|inv[ _-]?[0-9]|receipt|bill', type: 'Invoices' },
  { pattern: 'scan|scanned|camscanner|img[ _-]?[0-9]', type: 'Scans' },
  { pattern: 'report|summary|q[1-4]|monthly|weekly|forecast', type: 'Reports' },
];
const FALLBACK_TYPE = '_Unsorted';
```

To add a Type, add a line. To rename a folder, change its `type`. To re-prioritise, move a line up. Nothing else in the node needs to change, and a new Type with no Switch branch of its own still files correctly through the catch-all.

## The tree and the audit sheet

![The find-or-create chain for the year, month, and type folders on the n8n canvas, ending at the node that moves the file.](images/step-2-file-tree.png)

*Paths come from the file's Drive created date, not the run date, so a file that existed in Drive long before it reached the inbox keeps its own year and month. A missing or unreadable created date falls back to the run time.*

![The two Google Sheets nodes on the n8n canvas, one appending the audit row and one logging a filing failure.](images/step-3-audit-log.png)

*Every move writes one row, and a file that fails partway writes one too instead of stopping the run.*

Row 1 of the audit tab needs these headers, in this order: Timestamp, Original Filename, Matched Rule, Type, Destination Path, File ID, Status, Notes. Matched Rule is blank when nothing matched, Destination Path holds a value like `2026/06/Contracts`, Status is `Filed` or `Failed`, and Notes carries the error message on a failed row and stays blank otherwise.

## Customize

- Add or rename document Types by editing the rules table in "Plan Destination From Rules".
- Change the tree shape on the `destinationPath` line in the same node, for example dropping the month level to file by year and Type alone.
- Point the two audit steps at a different spreadsheet, or swap them for an n8n Data Table.
- Optional paid upgrade: put a small classifier such as gpt-4o-mini on the `Unsorted / Needs Review` branch for filenames too generic for the rules to decide. It only needs the filename, so it costs a fraction of a cent per file. The base workflow ships without it.

## What is in this folder

| File | What it is |
|---|---|
| `README.md` | This overview |
| `TEMPLATE-DESCRIPTION.md` | The n8n Creator hub listing text |
| `workflow.json` | The importable n8n workflow |
| `images/workflow.png` | The whole workflow on the n8n canvas |
| `images/step-1-classify.png` | The trigger, the rules node, and the Switch |
| `images/step-2-file-tree.png` | The find-or-create folder chain and the move |
| `images/step-3-audit-log.png` | The audit append and the failure log |

---

All sample data is fictional. No real credentials, IDs, or endpoints are included.

Part of the [n8n-exekyute-templates](../../README.md) collection. MIT licensed.

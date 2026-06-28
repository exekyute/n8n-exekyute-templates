## What this workflow does

Watches one shared Google Drive inbox folder and files every new document into a dated Year/Month/Type folder tree, named by a rules table you control. It writes one audit row per move to a Google Sheet, so nothing ever goes missing. It is built for anyone whose shared drive turns into a dumping ground: an ops team, a bookkeeper, a busy founder. No AI, fully rule based, so the same filename always lands in the same place.

## How it works

A Google Drive trigger fires on each new file in the inbox. A Code node reads the filename against an editable rules table (regex to Type, such as Contracts, Invoices, Scans, Reports) and builds the destination path from the file's created date, for example 2026/06/Contracts. A Switch routes the file by Type, with a catch-all branch for anything unmatched, which is filed under _Unsorted. The workflow finds or creates each folder level, so a missing year, month, or type is built on the fly and an existing one is reused instead of duplicated. The file is moved into the leaf folder and one row is appended to the audit sheet. A single bad file is logged and skipped rather than stopping the run.

## Setup

Import the workflow, assign a Google Drive credential to the Drive nodes and a Google Sheets credential to the Sheets nodes (the same Google account works for both), pick the inbox folder in the trigger, set the archive root folder ID and the rules in the Code node, and pick the audit spreadsheet. Run it once, then activate.

## Requirements

n8n, a Google Drive OAuth2 credential, and a Google Sheets OAuth2 credential. No paid services and no AI are required.

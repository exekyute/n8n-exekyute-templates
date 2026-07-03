## What this workflow does

Point it at one Notion database and it removes duplicate rows on a schedule without throwing away your best data. It groups rows by a property you choose (a title, URL, email, number, or select), keeps one row per group by a rule you set, and archives the rest to the Notion trash. Every run appends a one-line recap to a log page, so you always have a paper trail. It is for anyone whose Notion CRM, reading list, or tracker fills up with repeats from imports and web clips. No AI, fully deterministic.

## How it works

A daily Schedule trigger reads every row from the target database with full property data. A Code node groups the rows by your chosen property, ignoring case and spacing so near-identical values match, and finds any group with more than one row. It keeps the newest row by default (or the oldest, or the most complete) and marks the others. A Switch archives each duplicate to the Notion trash through the Notion API and appends a recap of the run to your log page. Rows with an empty key are left untouched, and clean runs are logged too.

## Setup

Import the workflow, connect a Notion credential and share the database and log page with the integration, pick the database in Get Database Rows, set the match property and keep rule in the Code node, and paste your log page URL. Run it once on a test database, then activate.

## Requirements

n8n and a Notion internal integration credential. No paid services and no AI.

## Good to know

Duplicates are archived to the Notion trash, not hard deleted, so a bad run stays recoverable for 30 days. Test on a copy of your database first.

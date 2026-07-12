## What this workflow does

Turns a Notion "questions to look up" database into a queue that drains itself. Every row you add is picked up, researched with You.com, and answered in place: the cited Markdown answer and its sources are written back into the same row and the status flips to `Answered`. The running list you already keep becomes the interface, with no report doc and no chat window. It is built for anyone who parks "I should look that up" notes in Notion: researchers, founders, analysts, and support and ops teams.

> Self-hosted n8n only. This template uses the You.com community node `@youdotcom-oss/n8n-nodes-youdotcom`, which can only be installed on a self-hosted instance.

## How it works

A Notion trigger fires on each new row. A guard skips rows with an empty question or a status that is not `To Research`, so no call is wasted. The You.com research operation answers the question and returns a cited answer plus a source list in one call. A Notion update writes both back into the row and marks it `Answered`. A failed lookup logs a note and leaves the row as `To Research` so it stays visible.

## Setup

Install the You.com community node, import the workflow, and add You.com and Notion credentials. Point the trigger at a database with `Question` (title), `Status` (select), `Answer` (text), and `Sources` (text). Add `To Research` and `Answered` as status options, then activate.

## Requirements

Self-hosted n8n with the `@youdotcom-oss/n8n-nodes-youdotcom` community node, a You.com API key, and a Notion integration with a shared questions database.

## Good to know

One research call per row. Higher `research_effort` levels (`deep`, `exhaustive`) cost more and take longer, so tune the depth to your questions. Notion text properties cap at 2000 characters, so long answers are trimmed to fit.

## Customization

Change the research depth on the research node, route long answers to a page body block instead of a property, or swap the Notion trigger for a Schedule trigger and an HTTP Request call to run the same flow on n8n Cloud.

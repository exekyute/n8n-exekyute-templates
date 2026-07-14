A daily standup that scores every active project Red, Yellow, or Green and leads with what changed overnight, so you know where to look first before opening anything.

## Who's it for

Founders, project leads, and operations managers who track several projects in Notion and want one glanceable morning summary in Slack instead of re-reading scattered notes and deadlines.

## How it works

- A schedule trigger fires each morning and reads yesterday's standup from a single-row Notion memory database.
- It pulls every Active project from a Notion projects database, then a code node builds the scoring prompt.
- Groq scores each project Red, Yellow, or Green, writes a short reason, and compares today against yesterday.
- The standup posts to Slack as one message and is written back to the memory row for tomorrow's comparison.
- If no projects are active, a guard posts a short all-quiet note instead of an empty standup.

## How to set up

Create a Notion projects database and a single-row memory database, then share both with a Notion integration. Add a Groq Header Auth credential, a Notion credential, and a Slack credential in n8n. Pick your two databases and Slack channel on the matching nodes.

## Requirements

- Notion account with a Projects database and a single-row Memory database
- Groq API key, free at console.groq.com/keys, used as a Header Auth credential
- Slack workspace and a channel to post to

## Good to know

Groq's free tier covers this comfortably: one run scores all active projects in a single request. Yesterday's standup lives in the Notion memory row rather than workflow static data, so change detection still works on manual test runs.

## How to customize the workflow

Change the trigger time, edit the Red, Yellow, and Green thresholds in the prompt, swap Groq for any OpenAI-compatible chat endpoint, or point the Slack node at a different channel.

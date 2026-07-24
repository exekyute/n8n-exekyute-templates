# Post a daily project health standup to Slack using Notion and Groq

[Published n8n template](https://n8n.io/workflows/16996-post-a-daily-project-health-standup-to-slack-with-notion-and-groq/)

Read every Active project from a Notion database each morning, score each one Green, Yellow, or Red with Groq, and post one standup message to Slack that leads with what changed overnight. Project status scatters across notes and deadlines nobody re-reads; this compresses it into a single glanceable message that says where to look first. Change detection works because the workflow saves each standup to a single-row Notion Memory database and diffs today's scores against it on the next run.

Built with n8n, plus Notion, Groq, and Slack.

![The project health standup workflow on the n8n canvas, running from a morning schedule trigger through two Notion reads and a Code node into a Groq scoring call, a Slack post, and a Memory row write-back.](images/workflow.png)

## Use it when

- You track several projects in Notion and start each morning opening them one by one to work out what needs attention first. This posts the answer to Slack before you open anything.
- A project flips overnight, a blocker clears or a milestone lands in two days, and a flat status list would bury the change. The standup leads with a CHANGED OVERNIGHT block.
- A team channel needs one shared morning signal instead of five people keeping five private mental models of project health.

## How it works

A schedule fires each morning, Notion supplies yesterday's standup and today's Active projects, and a Code node assembles both into one prompt. When nothing is Active, a guard posts a short all-quiet note and stops. Otherwise Groq scores every project and the finished message, a CHANGED OVERNIGHT block followed by RED, YELLOW, and GREEN sections with one blunt reason per project, posts to Slack and overwrites the Memory row for tomorrow's comparison.

| Stage | What happens |
|---|---|
| Every Morning at 7 30am | Fires once each morning |
| Get Memory Row | Loads yesterday's standup from the single-row Notion Memory database |
| Get Active Projects | Fetches every project with Status set to Active |
| Assemble Inputs | Builds the scoring prompt from today's projects and yesterday's standup |
| If Projects Are Active | Routes an empty project list to Post All Quiet to Slack instead of a broken empty standup |
| Score With Groq | The LLM rates each project Red, Yellow, or Green and diffs against yesterday |
| Extract Standup | Pulls the finished standup text out of the Groq response |
| Post Standup to Slack | Posts the standup as one message |
| Save Memory Row | Overwrites the Memory row with today's standup for tomorrow's comparison |

I keep yesterday's standup in a Notion row instead of n8n's `getWorkflowStaticData` because static data only persists reliably on active trigger runs, not manual tests; the row survives manual runs and workflow edits, and you can read it with your own eyes.

## Requirements

- A Notion account with a Projects database and a single-row Memory database.
- A Groq API key, free at console.groq.com/keys, used as a Header Auth credential.
- A Slack workspace and a channel to post to.
- n8n (cloud or self-hosted) with Notion, Slack, and Header Auth credentials.

## Setup

1. Import `workflow.json` into n8n. It imports inactive; configure before activating.
2. Confirm the Projects database, create the single-row Memory database, and share both with a Notion internal integration. Pick each database on the two Notion read nodes and on Save Memory Row.
3. Create a free Groq API key at https://console.groq.com/keys, add it as a Header Auth credential (Name `Authorization`, Value `Bearer your-key`), and select it on Score With Groq.
4. Add a Slack credential and choose the channel on both Slack nodes.
5. Optional: import `workflow-error-alert.json` and set it as this workflow's Error Workflow, so a failed step pings Slack and a silent morning is never a mystery.
6. Test with the two-day dataset in [`synthetic-data.md`](synthetic-data.md), or import [`projects-day1.csv`](projects-day1.csv) into Notion, then activate.

## The data model

Two Notion databases drive everything. Projects is the source data: the workflow reads these fields and posts the result to Slack, never writing back, and upkeep is about two minutes a week (a short progress note and a date).

| Field | Type | Purpose |
|---|---|---|
| Project | Title | Name |
| Status | Select | Active / On hold / Done (only Active is scored) |
| Update notes | Text | Short progress note the LLM reads |
| Last update | Date | Staleness signal |
| Next milestone | Date | Urgency signal |
| Health, Why | Select, Text | Optional, for a manual or formula-based color and notes inside Notion; the standup's own color and reason appear in Slack |

Memory is a single row the workflow reads and overwrites each run: `Key` (Title, fixed value `last-standup`), `Digest` (Text, the last standup produced), and `Updated` (Date, when it was last written).

## Scoring logic

| Score | Triggered by |
|---|---|
| Red | A milestone within 3 days and not on track, a named blocker, or no update in over 14 days |
| Yellow | No update in 7 to 14 days, or a milestone within a week with unclear progress |
| Green | A recent update and no near-term risk |

## Customize

- Change the trigger time on Every Morning at 7 30am.
- Edit the Red, Yellow, and Green thresholds in [`ai-prompt.md`](ai-prompt.md); the exact scoring and change-detection wording lives there.
- Swap Groq for any OpenAI-compatible chat endpoint on Score With Groq; the default model is `llama-3.3-70b-versatile`.
- Point the Slack nodes at a different channel.

## What is in this folder

| File | What it is |
|---|---|
| `README.md` | This overview |
| `TEMPLATE-DESCRIPTION.md` | The n8n Creator hub listing text |
| `workflow.json` | The importable n8n workflow (placeholders only) |
| `workflow-error-alert.json` | The companion error-alert workflow |
| `ai-prompt.md` | The AI scoring and change-detection prompt |
| `synthetic-data.md` | Two-day test dataset and expected standups |
| `projects-day1.csv` | The same sample data, ready to import into Notion |
| `images/workflow.png` | The workflow on the n8n canvas |

---

All sample data is fictional. No real credentials, IDs, or endpoints are included.

Part of the [n8n-exekyute-templates](../../README.md) collection. MIT licensed.

# Answer a Notion questions queue in place using You.com research

Keep a Notion database of things you mean to look up, and let it drain itself. Every row you drop in gets researched and answered in place, so the list you already keep becomes the interface. No report doc, no chat window, no second tool to check.

Built with n8n, plus You.com and Notion.

> Self-hosted n8n only. This template uses the You.com community node `@youdotcom-oss/n8n-nodes-youdotcom`, which can only be installed on a self-hosted instance. A cloud-safe HTTP variant is described under Tweaks and constraints.

![The open questions researcher workflow on the n8n canvas](images/workflow.png)

## How it works

A Notion trigger watches your questions database. When a new row shows up, a guard checks it is worth a lookup, You.com researches the question, and the answer plus its sources are written straight back into the same row while the status flips to `Answered`.

| Stage | What happens |
|---|---|
| Watch the queue | A Notion trigger fires on each new page added to the questions database |
| Guard the row | An IF skips rows with an empty `Question` or a `Status` that is not `To Research`, so nothing is wasted |
| Research | The You.com research operation answers the question and returns a cited Markdown write-up plus a list of sources in one call |
| Answer in place | A Notion update writes the answer and sources back into the same row and sets `Status` to `Answered` |

The whole point is that the answer lands in the row you already have open, not in a separate document. A failed lookup routes to its own branch that logs a short note into `Answer` and leaves the row as `To Research`, so a bad run stays visible and retryable instead of silently marking the question done.

## Setup

1. Import `workflow.json` into n8n. It imports inactive, so configure it before activating.
2. Install the You.com community node `@youdotcom-oss/n8n-nodes-youdotcom` under Settings, Community Nodes. This only works on self-hosted n8n.
3. Add credentials for You.com and Notion, and select them on all three nodes.
4. In `When a Question Is Added`, pick your questions database.
5. Confirm the property names match the schema below, then activate and drop a question into the database.

## The Notion database

The template expects a simple database. Create these four properties, named exactly:

| Property | Type | Role |
|---|---|---|
| `Question` | Title | The thing to look up. This is the research input |
| `Status` | Select | Add options `To Research` and `Answered`. New rows start at `To Research` |
| `Answer` | Text | The cited Markdown answer is written here |
| `Sources` | Text | A numbered list of the source titles and links |

To use the queue, add a row, type your question in `Question`, and set `Status` to `To Research`. The workflow does the rest.

## Tweaks and constraints

- **Research depth.** `Research the Question` runs at `standard` effort. Raise it to `deep` or `exhaustive` on hard questions for more cross-referencing, or drop to `lite` for quick factual lookups.
- **Cloud-safe variant.** The You.com node is community and self-hosted only. To run this on n8n Cloud, replace the trigger with a Schedule trigger, add a Notion node that queries the database for `Status = To Research`, and swap `Research the Question` for an HTTP Request node: `POST https://api.you.com/v1/research`, an `X-API-Key` header credential, and a JSON body of `{ "input": "<the question>", "research_effort": "standard" }`. The response carries the same `output.content` and `output.sources` fields the rest of the flow already reads.
- **Answer length.** Notion text properties cap at 2000 characters, so the answer and sources are each trimmed to 1900. For a long write-up, point `Answer` at a page body block instead of a property.
- **Retries.** Because the trigger fires on new rows, a failed lookup is not retried automatically. The failure note in `Answer` tells you which rows to re-drop.

## Requirements

- Self-hosted n8n with the `@youdotcom-oss/n8n-nodes-youdotcom` community node
- A You.com API key (you.com/platform)
- A Notion integration and a questions database shared with it

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

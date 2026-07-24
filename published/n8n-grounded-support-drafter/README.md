# Draft cited support replies from live public docs using You.com and Gmail

[Published n8n template](https://n8n.io/workflows/17335-draft-cited-support-replies-from-public-docs-with-youcom-gmail-and-slack/)

> Self-hosted n8n only. This template uses the You.com community node `@youdotcom-oss/n8n-nodes-youdotcom`, which can only be installed on a self-hosted instance. The Cloud path is covered under The Cloud HTTP variant below.

Take a support question from a form, research it across the live public web with You.com, and save a cited reply as a Gmail draft for a human to review and send. Most cited-reply workflows ground on your own private docs with retrieval-augmented generation; this one covers the other half, questions whose answer lives in a vendor's API reference, a public standard, or a help center you do not own. Because You.com reads the live web on every run, the draft reflects what the docs say today, not what a stale index captured months ago.

Built with n8n, plus You.com and Gmail, with an optional Slack ping.

![The grounded support drafter workflow on the n8n canvas, running from a form trigger through a You.com research call and a formatting Code node into a Gmail draft and a Slack ping, with an error branch that alerts the support team.](images/workflow.png)

## Use it when

- A customer asks how a third-party API or SaaS tool behaves, and the truth is the vendor's own documentation and changelog, not anything in your knowledge base.
- A regulatory or compliance question comes in whose answer is a public standard or a government page, and the reply needs citations someone can check.
- Your help desk supports public tools where a help center or status page holds the current behavior, and a stale internal doc would give the wrong answer.

## How it works

A question is submitted through a form. You.com researches public sources in one call and returns a cited answer. The answer is formatted into an email, saved as a Gmail draft, and Slack pings an agent that it is ready.

| Stage | What happens |
|---|---|
| When a Support Question Is Submitted | A form takes the question, optional context, and an optional customer email |
| Prepare Research Request | A Set node holds the config, normalizes the form values, and builds the research prompt |
| Research Public Sources | You.com's research operation runs one call over live public sources and returns an answer with inline citations and a list of source URLs |
| Build Cited Email Reply | A Code node turns the answer and its sources into an HTML email body, with each citation linked to the source it came from |
| Create Gmail Draft Reply | Gmail saves the reply as a draft. The operation is create draft, so nothing is ever sent automatically |
| Notify Agent Draft Ready | Slack pings a support agent that a cited draft is ready to review and send |
| Build Failure Notice | The You.com call's error output feeds a Set node that captures the question and the error message, so a failed lookup does not take down the run |
| Alert Support Team of Failure | Slack tells the support team the lookup failed, so no question goes quietly unanswered |

I keep the Gmail node on create draft because the human review is the point: nothing goes out until an agent has read the cited sources and pressed send.

## Requirements

- Self-hosted n8n with the `@youdotcom-oss/n8n-nodes-youdotcom` community node (or a core HTTP Request node for the Cloud variant)
- A You.com API key (you.com/platform)
- A Gmail account connected with OAuth2
- Optional: a Slack app with `chat:write` for the ready-to-review ping

## Setup

1. Import `workflow.json` into n8n. It imports inactive; configure before activating.
2. Install the You.com community node `@youdotcom-oss/n8n-nodes-youdotcom` under Settings, Community Nodes. This only works on self-hosted n8n.
3. Add credentials for You.com and Gmail, and a Slack credential if you want the ready-to-review ping. Select them on their nodes.
4. Open "Prepare Research Request" to set the research effort and the Slack member ID to mention.
5. In "Notify Agent Draft Ready" and "Alert Support Team of Failure" pick the Slack channel for your support team.
6. Activate the workflow, open the form URL on the trigger, and submit a question to test.

## The config node

Everything you tune lives in "Prepare Research Request":

| Field | What it controls |
|---|---|
| `researchInput` | The prompt sent to You.com. It scopes the research to public, authoritative sources and asks for a citation on every claim. Edit it to name your own public docs. |
| `researchEffort` | How hard You.com works: `lite`, `standard`, `deep`, or `exhaustive`. It ships set to `standard`. Higher effort means more sources and more time. |
| `agentSlackId` | The Slack member ID that gets `@mentioned` when a draft is ready or a lookup fails. |

The question, optional context, and optional customer email come from the form and are normalized here, so the rest of the workflow reads clean values. One limit worth knowing: the You.com node at v0.2.9 exposes only the research question and the effort level on its research operation, so there is no parameter to force official domains or a recency window. The prompt wording does that steering instead; if you need hard domain control, the You.com search operation accepts `site:` query operators and a freshness filter as a cheaper single-doc path.

## The Cloud HTTP variant

The You.com node is community-only, but the API is a plain REST call, so the workflow runs on n8n Cloud with one swap. Replace "Research Public Sources" with an HTTP Request node: `POST https://api.you.com/v1/research`, a Header Auth credential that sends `X-API-Key: your-key`, and a JSON body of `{ "input": "{{ your prompt }}", "research_effort": "standard" }`. The response arrives as `output.content` with `output.sources`, which is exactly what the Code node already reads, so nothing downstream changes.

## Customize

- Scope `researchInput` to your product's public docs, a vendor's API reference, or a specific standard, so answers stay on the sources you trust.
- Raise `researchEffort` to `deep` or `exhaustive` for gnarly questions, or drop to `lite` for quick lookups. Cost and latency follow the effort level, so start at `standard` and raise it only for the questions that need it.
- Set the draft's recipient by filling the customer email on the form, or leave it blank and let the agent add it.
- Turn the Slack ping off by deleting "Notify Agent Draft Ready" if your team watches the Gmail drafts folder directly.
- Swap the form trigger for a Gmail trigger watching a support alias, map the email subject and body into "Prepare Research Request", and the flow drafts a cited reply for every inbound message. Keep the Gmail node on create draft so replies still wait for a human.

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

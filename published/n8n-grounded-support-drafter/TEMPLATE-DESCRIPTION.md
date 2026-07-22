## Who's it for

Support teams that answer questions about public sources they do not own: third-party APIs and SaaS tools, public standards, or regulatory and help pages. Most cited-reply workflows ground on your own private docs with RAG. This one answers the other half, where the truth lives on the live public web, and it keeps a human in the loop on every reply.

> Self-hosted n8n only. This template uses the You.com community node `@youdotcom-oss/n8n-nodes-youdotcom`, which can only be installed on a self-hosted instance. A core HTTP Request variant that runs on Cloud is described in the workflow notes.

## How it works

A question is submitted through a form with optional context and a customer email. You.com's research operation runs one call over live public sources and returns an answer with inline citations and a list of source URLs. A Code node formats the answer and its sources into an HTML email body, with each citation linked to its source. Gmail saves the reply as a draft using the create draft operation, so nothing is ever sent automatically. Slack then pings a support agent that a cited draft is ready to review and send. The You.com call has its own error branch that alerts the team instead of failing silently.

## How to set up

Install the You.com community node, then add You.com and Gmail credentials and an optional Slack credential. Open the config node to set the research effort and the Slack member ID to mention, and pick your support channel on the Slack nodes.

## Requirements

Self-hosted n8n with the `@youdotcom-oss/n8n-nodes-youdotcom` community node. A You.com API key, a Gmail account, and optionally a Slack app with `chat:write`.

## How to customize

Scope the research prompt to your own public docs, tune the research effort from lite to exhaustive, set the draft recipient from the form, or swap the form trigger for a Gmail trigger on a support alias.

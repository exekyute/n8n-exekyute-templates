## What this workflow does

Turns a raw company name or domain into a qualified, one-page lead profile before a human ever opens it. It researches the company with You.com, profiles and scores it with Groq, alerts the team on Slack for hot leads, and logs every lead to Notion. It is built for sales ops, SDR, and growth teams who want every inbound lead researched and triaged automatically.

> Self-hosted n8n only. This template uses the You.com community node `@youdotcom-oss/n8n-nodes-youdotcom`, which can only be installed on a self-hosted instance.

## How it works

A webhook receives a company name or domain and a Set node normalizes it, and a guard rejects empty input with a clean `400` before any API call is spent. You.com Web Search pulls recent signals such as funding, news, and leadership, the best company URL is resolved, and You.com Content Extraction reads facts off the site. Both are merged into one context block. A Groq chain writes a one-page profile, then a second Groq chain scores fit against your criteria and returns structured JSON with a score, tier, reasons, and recommended action. Hot leads, those at or above your threshold, are posted to Slack with an `@mention`. Every lead is logged to Notion, and the profile is returned on the webhook. Every external call has its own error branch that returns a `502` instead of crashing the run.

## Setup

Install the You.com community node, then import the workflow and add credentials for You.com, Groq, Notion, and Slack. Open the config node to set your fit criteria, hot-score threshold, and Slack mention ID. Point the Notion node at a database with Fit Score (number), Tier (select), and Summary (rich text) properties, and pick your Slack channel.

## Requirements

Self-hosted n8n with the `@youdotcom-oss/n8n-nodes-youdotcom` community node. A You.com API key, a Groq API key, a Notion integration and target database, and a Slack app with `chat:write`.

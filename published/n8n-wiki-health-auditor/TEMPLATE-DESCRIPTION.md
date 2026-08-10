A weekly rule-based sweep of a Notion wiki that builds the internal link graph from page content and flags every page nobody links to, nobody has edited, or nobody has written. Findings go back into a Notion database and a ranked digest posts to Slack.

## Who's it for

Any team whose wiki has outgrown the people maintaining it: an engineering group with three years of half-finished runbooks, a support team where search returns six answers to the same question, or anyone about to run a documentation cleanup and needing the list ranked by something defensible.

## How it works

A weekly schedule fires and one Set node supplies the search text, the target database, the Slack channel and every threshold. Notion page search runs with `simple` off so `last_edited_time` survives. The workflow then loops one page at a time and pulls all blocks recursively with `simplifyOutput` off, which is what keeps the page ids inside mentions intact. One Code node counts words and collects outbound links from mentions, `link_to_page` blocks, child pages and pasted notion.so URLs. A second inverts those edges into inbound counts, labels each page orphan, stale, thin or healthy, and adds a weighted score. No model is involved: every classification is a threshold you set, so the same wiki produces the same answer every run. Notion has no upsert, so the findings database is queried once and each finding is matched on its `Page ID` property before the branch decides between update and create. A page the integration could not read is labelled `Fetch failed` and skips the orphan and thin checks, so a permissions gap never reads as an abandoned page.

## How to set up

Connect a Notion internal integration and share only the wiki root page with it, so page search returns the wiki and nothing else. Connect a Slack credential with `chat:write` and invite the bot to the digest channel. Create a `Wiki Health` database with `Page` (title), `Page ID` (rich text), `Status` (rich text), `Score`, `Word Count`, `Inbound Links` and `Broken Links` (number), `Page URL` (url) and `Last Audited` (date). Fill in the search text, the database id and the Slack channel id in the settings node, then run it once by hand and read the digest.

## Requirements

A Notion workspace with an internal integration, a database for the findings, a Slack workspace, and n8n with Notion and Slack credentials.

## Good to know

Two simplification toggles silently break this and neither fails loudly. `Get Page Blocks From Notion` must keep `simplifyOutput` off, or rich text flattens to a plain string, the mention page ids vanish, the link graph empties and every page reads as an orphan. `Search Wiki Pages In Notion` must keep `simple` off, or the response carries no `last_edited_time` and nothing is ever stale.

The Notion API allows roughly three requests per second, so a wiki of 200 to 400 pages finishes comfortably. Point the integration at a narrower root above that size.

## How to customize the workflow

`staleAfterDays`, `thinWordCount` and `digestSize` decide what counts as a problem and how much reaches Slack. `orphanWeight`, `staleWeight`, `thinWeight` and `brokenLinkWeight` set the digest order, so raise `orphanWeight` if unlinked pages matter most to your team. Leave the search text blank to audit every page the integration can read.

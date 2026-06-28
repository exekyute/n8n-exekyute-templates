# n8n Templates

A collection of n8n workflow templates I have built, organized by their status in the n8n template library.

## Published

Live in the n8n template library.

| Template | What it does |
|---|---|
| [Media Monitor](published/n8n-media-monitor/) | Watches RSS feeds, scores each article for relevance, sentiment, and entities, and emails a digest grouped by topic. |
| [frAIday Delivery Planner](published/n8n-frAIday-delivery-planner/) | Batches food delivery orders into Saturday and Sunday route plans, geocoded via OpenStreetMap, emailed every Friday. |

## Pending review

Submitted to the n8n Creator hub and awaiting approval. Templates move up to `published/` once they are live in the library.

| Template | What it does |
|---|---|
| [Lead Enricher](pending-review/n8n-lead-enricher/) | Researches an inbound company with You.com, writes a profile and fit score with Groq, alerts Slack for hot leads, and logs every lead to Notion. |

## Pending submission

Built and tested but not yet submitted to the Creator hub. Templates move to `pending-review/` once submitted.

| Template | What it does |
|---|---|
| [Legal Research Assistant](pending-submission/n8n-legal-research-assistant/) | Answers a legal question using only authorities retrieved from CourtListener or CanLII, and verifies every citation against the retrieved sources so invented case law never reaches the reader. |
| [Drive Auto-Filer](pending-submission/n8n-drive-auto-filer/) | Sorts new Google Drive inbox files into a dated Year/Month/Type folder tree by filename rules, and logs every move to a Google Sheet. |

## License

MIT. See [LICENSE](LICENSE).

Built by Kevin Yu ([exekyute](https://github.com/exekyute)).

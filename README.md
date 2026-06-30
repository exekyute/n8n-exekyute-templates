# n8n Templates

A collection of n8n workflow templates I have built, organized by their status in the n8n template library.

## Published

Live in the n8n template library.

| Template | What it does | n8n library |
|---|---|:---:|
| [Media Monitor](published/n8n-media-monitor/) | Watches RSS feeds, scores each article for relevance, sentiment, and entities, and emails a digest grouped by topic. | [View](https://n8n.io/workflows/16296-send-scored-media-monitoring-digests-from-rss-feeds-via-smtp-email/) |
| [frAIday Delivery Planner](published/n8n-frAIday-delivery-planner/) | Batches food delivery orders into Saturday and Sunday route plans, geocoded via OpenStreetMap, emailed every Friday. | [View](https://n8n.io/workflows/16154-plan-delivery-routes-from-notion-orders-with-nominatim-and-email/) |
| [Lead Enricher](published/n8n-lead-enricher/) | Researches an inbound company with You.com, writes a profile and fit score with Groq, alerts Slack for hot leads, and logs every lead to Notion. | [View](https://n8n.io/workflows/16504-enrich-and-route-inbound-leads-using-youcom-groq-notion-and-slack/) |

## Pending review

Submitted to the n8n Creator hub and awaiting approval. Templates move up to `published/` once they are live in the library.

| Template | What it does |
|---|---|
| [API Contract Drift Watcher](pending-review/n8n-api-contract-drift-watcher/) | Polls a JSON or OpenAPI endpoint on a schedule, snapshots its response schema in a Data Table, and posts a severity-tagged Slack alert only when the contract breaks, ignoring ordinary value churn. |
| [Backup Freshness Auditor](pending-review/n8n-backup-freshness-auditor/) | Audits a Google Drive folder of externally produced backups against a per-source SLA table in Sheets, flags stale, missing, or shrunken dumps, logs a scorecard, and alerts Slack only on failures. |
| [CSV Folder Reconciler](pending-review/n8n-csv-folder-reconciler/) | Merges the daily CSV exports in a Google Drive folder into one deduped master, quarantines every bad row to a dated reject file with a reason, and posts a rows in, merged, quarantined, duplicates recap to Slack. |

## Pending submission

Built and tested but not yet submitted to the Creator hub. Templates move to `pending-review/` once submitted.

| Template | What it does |
|---|---|
| [Legal Research Assistant](pending-submission/n8n-legal-research-assistant/) | Answers a legal question using only authorities retrieved from CourtListener or CanLII, and verifies every citation against the retrieved sources so invented case law never reaches the reader. |
| [Drive Auto-Filer](pending-submission/n8n-drive-auto-filer/) | Sorts new Google Drive inbox files into a dated Year/Month/Type folder tree by filename rules, and logs every move to a Google Sheet. |

## License

MIT. See [LICENSE](LICENSE).

Built by Kevin Yu ([exekyute](https://github.com/exekyute)). Find my templates on n8n at [@exekyute](https://n8n.io/creators/exekyute/).

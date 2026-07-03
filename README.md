# n8n Templates

A collection of n8n workflow templates I have built, organized by their status in the n8n template library.

## Published

Live in the n8n template library.

| Template | What it does | n8n library |
|---|---|:---:|
| [Media Monitor](published/n8n-media-monitor/) | Watches RSS feeds, scores each article for relevance, sentiment, and entities, and emails a digest grouped by topic. | [View](https://n8n.io/workflows/16296-send-scored-media-monitoring-digests-from-rss-feeds-via-smtp-email/) |
| [frAIday Delivery Planner](published/n8n-frAIday-delivery-planner/) | Batches food delivery orders into Saturday and Sunday route plans, geocoded via OpenStreetMap, emailed every Friday. | [View](https://n8n.io/workflows/16154-plan-delivery-routes-from-notion-orders-with-nominatim-and-email/) |
| [Lead Enricher](published/n8n-lead-enricher/) | Researches an inbound company with You.com, writes a profile and fit score with Groq, alerts Slack for hot leads, and logs every lead to Notion. | [View](https://n8n.io/workflows/16504-enrich-and-route-inbound-leads-using-youcom-groq-notion-and-slack/) |
| [API Contract Drift Watcher](published/n8n-api-contract-drift-watcher/) | Polls a JSON or OpenAPI endpoint on a schedule, snapshots its response schema in a Data Table, and posts a severity-tagged Slack alert only when the contract breaks, ignoring ordinary value churn. | [View](https://n8n.io/workflows/16699-alert-on-api-contract-drift-using-data-tables-and-slack/) |
| [Backup Freshness Auditor](published/n8n-backup-freshness-auditor/) | Audits a Google Drive folder of externally produced backups against a per-source SLA table in Sheets, flags stale, missing, or shrunken dumps, logs a scorecard, and alerts Slack only on failures. | [View](https://n8n.io/workflows/16701-audit-google-drive-backup-freshness-with-google-sheets-and-slack/) |
| [CSV Folder Reconciler](published/n8n-csv-folder-reconciler/) | Merges the daily CSV exports in a Google Drive folder into one deduped master, quarantines every bad row to a dated reject file with a reason, and posts a rows in, merged, quarantined, duplicates recap to Slack. | [View](https://n8n.io/workflows/16700-reconcile-daily-google-drive-csv-exports-into-a-master-file-and-send-a-slack-recap/) |
| [Notion Deduplicator](published/n8n-notion-deduplicator/) | Removes duplicate rows from a Notion database on a schedule, keeping the newest or most complete record in each group, archiving the rest to the Notion trash, and logging a recap of every run. | [View](https://n8n.io/workflows/16801-deduplicate-and-archive-notion-database-rows-daily-with-an-audit-log/) |
| [Notion Overdue Roller](published/n8n-notion-overdue-roller/) | Rolls overdue Notion tasks forward in place on a schedule, incrementing a per-task roll counter and setting a Stale flag once a task has been pushed too many times, without sending any reminder. | [View](https://n8n.io/workflows/16802-roll-overdue-notion-tasks-forward-and-flag-stale-ones-on-a-schedule/) |
| [Notion Property Normalizer](published/n8n-notion-property-normalizer/) | Cleans up one Notion database on a schedule with no AI: backfills a missing Status default, canonicalizes inconsistent Status spellings, derives a slug key and a created-week stamp, and writes only the rows that actually change. | [View](https://n8n.io/workflows/16800-normalize-and-backfill-notion-database-properties-with-rules-and-logging/) |

## Pending review

Submitted to the n8n Creator hub and awaiting approval. Templates move up to `published/` once they are live in the library.

## Pending submission

Built and tested but not yet submitted to the Creator hub. Templates move to `pending-review/` once submitted.

| Template | What it does |
|---|---|
| [Legal Research Assistant](pending-submission/n8n-legal-research-assistant/) | Answers a legal question using only authorities retrieved from CourtListener or CanLII, and verifies every citation against the retrieved sources so invented case law never reaches the reader. |
| [Drive Auto-Filer](pending-submission/n8n-drive-auto-filer/) | Sorts new Google Drive inbox files into a dated Year/Month/Type folder tree by filename rules, and logs every move to a Google Sheet. |
| [KB Inquiry Assistant (RAG)](pending-submission/n8n-kb-inquiry-assistant/) | A retrieval-augmented generation (RAG) assistant that drafts grounded replies to inbound support email from a Notion knowledge base, using Cohere embeddings and reranking plus Groq, and saves each as a Gmail draft for a human to review. |
| [SFX Chat Generator](pending-submission/n8n-sfx-chat-generator/) | Turns a plain-language chat message into a sound effect: a Groq director rewrites it into a literal ElevenLabs prompt, generates the audio, saves it to Google Drive, and replies in chat with the link. |
| [Sound Effect Variation Pack](pending-submission/n8n-sfx-variation-pack/) | Turns one written sound brief into several ElevenLabs takes and saves them to a dated Google Drive folder to choose from. |
| [Gladia Subtitle Generator](pending-submission/n8n-gladia-subtitle-generator/) | Generates ready-to-use SRT and VTT subtitle files from a public audio or video URL using Gladia, and saves both to Google Drive with the download links shown on the form. |
| [Gladia Speaker Transcript](pending-submission/n8n-gladia-speaker-transcript/) | Transcribes a public call or interview recording into a clean speaker-labeled transcript with Gladia diarization, saves it to Google Drive as Markdown, and posts the link to Slack. |

## License

MIT. See [LICENSE](LICENSE).

Built by Kevin Yu ([exekyute](https://github.com/exekyute)). Find my templates on n8n at [@exekyute](https://n8n.io/creators/exekyute/).

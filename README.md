# n8n Templates

A collection of n8n workflow templates I have built, organized by their status in the n8n template library.

Most of them share the same working habits: rules in a table or a config block a reader can inspect, a dated row logged for every record touched, and a quarantine lane that names the reason a record was held back instead of dropping it silently. The ones that alert stay quiet unless something actually broke, and where a model drafts something a customer will read, it waits as a Gmail draft for a person to approve. Each README states its own limits too. The number issuer says exactly what its counter can promise under concurrent load, and the deadline calculator ships a verification harness for its date math.

## Published

**44 templates** are live in the n8n template library right now, grouped by area. Hit **View** on any row to open its listing on n8n.io. A template that spans two areas is listed once, under the first one.

### 🤖 AI · 13

| Template | What it does | Stack |
|---|---|---|
| [KB Inquiry Assistant (RAG)](published/n8n-kb-inquiry-assistant/) · [View](https://n8n.io/workflows/16813-draft-grounded-gmail-support-replies-from-a-notion-kb-with-groq-and-cohere/) | Drafts support replies grounded in your own Notion knowledge base, each saved as a Gmail draft for a person to approve; nothing is auto-sent. | RAG, Notion, Cohere, Groq, Gmail |
| [Legal Research Assistant](published/n8n-legal-research-assistant/) · [View](https://n8n.io/workflows/16814-answer-legal-questions-with-groq-using-canlii-and-courtlistener/) | Answers a legal question using only authorities pulled live from CourtListener or CanLII, with a verified citation behind every point. | Groq, CanLII, CourtListener |
| [SFX Chat Generator](published/n8n-sfx-chat-generator/) · [View](https://n8n.io/workflows/16881-generate-sound-effects-from-chat-with-groq-elevenlabs-and-google-drive/) | Turns a plain chat description of a sound into a ready-to-use MP3, saved to Google Drive with the link in the reply. | Groq, ElevenLabs, Google Drive |
| [SFX Variation Pack](published/n8n-sfx-variation-pack/) · [View](https://n8n.io/workflows/16954-generate-sound-effect-variation-packs-with-elevenlabs-and-google-drive/) | Turns one sound brief into several ElevenLabs takes, each saved into a dated Google Drive folder. | ElevenLabs, Google Drive |
| [SFX Library Builder](published/n8n-sfx-library-builder/) · [View](https://n8n.io/workflows/16956-build-a-sound-effect-library-with-google-sheets-elevenlabs-google-drive-and-slack/) | Generates one sound per row of a Google Sheet, saves each MP3 to Drive, and writes the link and status back to the row. | ElevenLabs, Google Sheets, Google Drive, Slack |
| [Gladia Drive Transcriber](published/n8n-gladia-drive-transcriber/) · [View](https://n8n.io/workflows/16955-transcribe-google-drive-audio-to-markdown-with-gladia-and-google-sheets/) | Transcribes every new file in a Google Drive folder with Gladia, saves the transcript as Markdown, and logs each run. | Gladia, Google Drive, Google Sheets |
| [Gladia Notion Meetings](published/n8n-gladia-notion-meetings/) · [View](https://n8n.io/workflows/16957-transcribe-and-summarize-notion-meeting-recordings-with-gladia/) | Transcribes and summarizes a meeting recording added to a Notion database, writing both back onto the same page. | Gladia, Notion |
| [Gladia Subtitle Generator](published/n8n-gladia-subtitle-generator/) · [View](https://n8n.io/workflows/16994-generate-srt-and-vtt-subtitles-from-media-urls-with-gladia-and-google-drive/) | Turns a public audio or video URL into SRT and VTT subtitle files uploaded to Google Drive. | Gladia, Google Drive |
| [Project Health Roll-up](published/n8n-project-health-rollup/) · [View](https://n8n.io/workflows/16996-post-a-daily-project-health-standup-to-slack-with-notion-and-groq/) | Scores every active Notion project Green, Yellow, or Red each morning and posts one Slack standup leading with what changed. | Notion, Groq, Slack |
| [Gladia Speaker Transcript](published/n8n-gladia-speaker-transcript/) · [View](https://n8n.io/workflows/17138-transcribe-speaker-labeled-recordings-with-gladia-google-drive-and-slack/) | Turns a recording link into a clean transcript marking who spoke and when, saved to Drive and posted to Slack. | Gladia, Google Drive, Slack |
| [Gladia Audio Translator](published/n8n-gladia-audio-translator/) · [View](https://n8n.io/workflows/17139-translate-audio-transcripts-with-gladia-google-drive-and-google-sheets/) | Returns one Markdown file holding both the original transcript and its translation, saved to Drive and logged in a Sheet. | Gladia, Google Drive, Google Sheets |
| [Open Questions Researcher](published/n8n-open-questions-researcher/) · [View](https://n8n.io/workflows/17270-answer-notion-knowledge-base-questions-with-youcom-research/) | Drains a Notion queue of open questions, researching each with You.com and writing the cited answer back into its row. | Notion, You.com |
| [Grounded Support Drafter](published/n8n-grounded-support-drafter/) · [View](https://n8n.io/workflows/17335-draft-cited-support-replies-from-public-docs-with-youcom-gmail-and-slack/) | Researches a support question across the live public web with You.com and saves a cited reply as a Gmail draft. | You.com, Gmail, Slack |

### 🗃️ Data & Records · 7

| Template | What it does | Stack |
|---|---|---|
| [Notion Deduplicator](published/n8n-notion-deduplicator/) · [View](https://n8n.io/workflows/16801-deduplicate-and-archive-notion-database-rows-daily-with-an-audit-log/) | Groups rows sharing a property value, keeps the best record in each duplicate set, and archives the rest with a logged recap. | Notion |
| [Notion Overdue Roller](published/n8n-notion-overdue-roller/) · [View](https://n8n.io/workflows/16802-roll-overdue-notion-tasks-forward-and-flag-stale-ones-on-a-schedule/) | Rolls past-due dates forward to today on a schedule, counting each roll and flagging tasks pushed too many times as stale. | Notion |
| [Notion Property Normalizer](published/n8n-notion-property-normalizer/) · [View](https://n8n.io/workflows/16800-normalize-and-backfill-notion-database-properties-with-rules-and-logging/) | Backfills missing Status values, folds inconsistent spellings into one canonical value, and derives a slug and created-week stamp per row. | Notion |
| [YouTube Tag Normalizer](published/n8n-youtube-tag-normalizer/) · [View](https://n8n.io/workflows/17071-normalize-youtube-video-tags-using-google-sheets-vocabulary-rules/) | Normalizes a channel's video tags against a controlled vocabulary in Google Sheets, writing back only the videos that changed. | YouTube, Google Sheets |
| [Playlist Janitor](published/n8n-playlist-janitor/) · [View](https://n8n.io/workflows/17092-clean-duplicate-and-dead-youtube-playlist-videos-with-slack-reports/) | Flags duplicate entries and dead videos in a YouTube playlist each week, reports them to Slack, and prunes the flagged items. | YouTube, Slack |
| [Asana Sheet Mirror](published/n8n-asana-sheet-mirror/) · [View](https://n8n.io/workflows/17306-sync-asana-project-tasks-with-a-mirrored-google-sheets-tab/) | Upserts every task in one Asana project into a Google Sheet keyed by task GID, keeping status, assignee, and dates current. | Asana, Google Sheets |
| [Notion Cadence Spawner](published/n8n-notion-cadence-spawner/) · [View](https://n8n.io/workflows/17549-spawn-recurring-notion-tasks-from-rules-with-data-tables-and-slack/) | Reads a Notion database of recurrence rules, works out which are due today, and creates one task page each without repeating on a second run. | Notion, Slack, Data Tables |

### 📁 Files & Documents · 2

| Template | What it does | Stack |
|---|---|---|
| [CSV Folder Reconciler](published/n8n-csv-folder-reconciler/) · [View](https://n8n.io/workflows/16700-reconcile-daily-google-drive-csv-exports-into-a-master-file-and-send-a-slack-recap/) | Merges every CSV in a Drive folder into one deduplicated master file, quarantines bad rows with a reason, and recaps to Slack. | Google Drive, Slack |
| [Drive Auto-Filer](published/n8n-drive-auto-filer/) · [View](https://n8n.io/workflows/16812-file-google-drive-inbox-documents-into-dated-folders-with-a-google-sheets-audit-log/) | Files everything dropped in a Drive inbox into a dated Year, Month, Type folder tree, with an audit row written for every move. | Google Drive, Google Sheets |

### 📡 DevOps & Monitoring · 9

| Template | What it does | Stack |
|---|---|---|
| [API Contract Drift Watcher](published/n8n-api-contract-drift-watcher/) · [View](https://n8n.io/workflows/16699-alert-on-api-contract-drift-using-data-tables-and-slack/) | Records the shape of a JSON or OpenAPI response in a Data Table and alerts Slack only when the contract breaks. | Data Tables, Slack |
| [Backup Freshness Auditor](published/n8n-backup-freshness-auditor/) · [View](https://n8n.io/workflows/16701-audit-google-drive-backup-freshness-with-google-sheets-and-slack/) | Audits a Drive backup folder against a per-source SLA table, logs a dated scorecard row, and pings Slack only on failures. | Google Drive, Google Sheets, Slack |
| [YouTube Metadata Auditor](published/n8n-youtube-metadata-auditor/) · [View](https://n8n.io/workflows/17072-audit-youtube-video-metadata-changes-with-google-sheets-and-slack/) | Compares each video's title, description, tags, and privacy against the previous snapshot daily, logging every difference and summarizing to Slack. | YouTube, Google Sheets, Slack |
| [Asana Hygiene Auditor](published/n8n-asana-hygiene-auditor/) · [View](https://n8n.io/workflows/17268-audit-asana-task-hygiene-with-google-sheets-and-slack-scorecards/) | Flags open tasks missing an assignee or due date each week, logs them with reason codes, and posts a completeness scorecard. | Asana, Google Sheets, Slack |
| [Asana Status Digest](published/n8n-asana-status-digest/) · [View](https://n8n.io/workflows/17271-post-a-daily-asana-project-status-digest-to-slack/) | Posts a weekday Slack digest of overdue, due-today, due-this-week, unassigned, and completed tasks, plus each person's open workload. | Asana, Slack |
| [SMS Status Logger](published/n8n-sms-status-logger/) · [View](https://n8n.io/workflows/17342-log-twilio-sms-delivery-statuses-to-google-sheets-and-alert-slack-on-failures/) | Logs every Twilio message status change to a Sheet and alerts Slack on failure, with the error code decoded into plain words. | Twilio, Google Sheets, Slack |
| [Twilio Alert Monitor](published/n8n-twilio-alert-monitor/) · [View](https://n8n.io/workflows/17399-monitor-twilio-debugger-alerts-and-send-grouped-digests-to-slack-and-google-sheets/) | Polls the Twilio Monitor Alerts API on a schedule, groups debugger errors by code and severity, logs each one, and posts one Slack digest. | Twilio, Google Sheets, Slack |
| [SMS Deliverability Rollup](published/n8n-sms-deliverability-rollup/) · [View](https://n8n.io/workflows/17401-summarize-daily-twilio-sms-delivery-rates-to-google-sheets-and-slack/) | Counts yesterday's Twilio messages by status each morning, works out a delivery rate, and posts the same figures to a Sheet and Slack. | Twilio, Google Sheets, Slack |
| [Sheet Metrics Exporter](published/n8n-sheet-metrics-exporter/) · [View](https://n8n.io/workflows/17546-expose-google-sheet-kpis-as-prometheus-metrics-for-grafana/) | Serves a tab of business numbers as a Prometheus exposition endpoint, so SLO targets and licence counts sit on a Grafana dashboard next to real telemetry. | Google Sheets, Prometheus, Grafana |

### 📣 Sales & Marketing · 4

| Template | What it does | Stack |
|---|---|---|
| [Lead Enricher](published/n8n-lead-enricher/) · [View](https://n8n.io/workflows/16504-enrich-and-route-inbound-leads-using-youcom-groq-notion-and-slack/) | Turns a raw company name or domain into a qualified, one-page lead profile before a human ever opens it. | You.com, Groq, Notion, Slack |
| [Media Monitor](published/n8n-media-monitor/) · [View](https://n8n.io/workflows/16296-send-scored-media-monitoring-digests-from-rss-feeds-via-smtp-email/) | Scores every matching article from RSS and Atom feeds for relevance, sentiment, and entities, then emails a digest grouped by topic. | RSS, Email |
| [Local Business Proximity](published/n8n-local-business-proximity/) · [View](https://n8n.io/workflows/16997-log-nearby-businesses-from-openstreetmap-to-google-sheets-by-proximity/) | Pulls every business of a chosen category within a radius from OpenStreetMap into a Google Sheet, flagged by whether each lists a website. | OpenStreetMap, Google Sheets |
| [SMS Pumping Screener](published/n8n-sms-pumping-screener/) · [View](https://n8n.io/workflows/17400-screen-sms-campaign-numbers-for-high-risk-lines-with-twilio-sheets-and-slack/) | Screens every campaign number through Twilio Lookup before sending, routing SMS pumping fraud lines, VoIP, and landlines to a quarantine tab with a written reason. | Twilio Lookup, Google Sheets, Slack |

### ⚙️ Operations · 9

| Template | What it does | Stack |
|---|---|---|
| [frAIday Delivery Planner](published/n8n-frAIday-delivery-planner/) · [View](https://n8n.io/workflows/16154-plan-delivery-routes-from-notion-orders-with-nominatim-and-email/) | Collects delivery orders through a public form and emails a route plan grouped by delivery day, with a payment tag on every stop. | Notion, Nominatim, Email |
| [Litigation Limitation Calculator](published/n8n-litigation-limitation-calculator/) · [View](https://n8n.io/workflows/16993-calculate-litigation-deadlines-from-intake-forms-with-google-calendar-sheets-slack-and-gmail/) | Calculates litigation deadlines from one intake form using a jurisdiction-aware rules table, recording the exact rule behind every date it books, logs, and reminds on. | Google Calendar, Google Sheets, Slack, Gmail |
| [YouTube Embargo](published/n8n-youtube-embargo/) · [View](https://n8n.io/workflows/17091-unpublish-expired-youtube-videos-using-google-sheets-and-slack/) | Sets every video whose embargo date has passed to private or unlisted, marks the row expired, and posts a Slack recap. | YouTube, Google Sheets, Slack |
| [YouTube Banner Scheduler](published/n8n-youtube-banner-scheduler/) · [View](https://n8n.io/workflows/17137-rotate-youtube-channel-banners-on-a-schedule-with-google-sheets-and-drive/) | Swaps the channel banner on the dates planned in a Google Sheet, pulling each day's artwork from Google Drive. | YouTube, Google Sheets, Google Drive |
| [Asana Calendar Sync](published/n8n-asana-calendar-sync/) · [View](https://n8n.io/workflows/17269-sync-asana-task-due-dates-with-google-calendar-events/) | Mirrors dated Asana tasks into Google Calendar, moving events when dates change and removing them when a task completes or loses its date. | Asana, Google Calendar |
| [WhatsApp FAQ Responder](published/n8n-whatsapp-faq-responder/) · [View](https://n8n.io/workflows/17341-answer-whatsapp-keyword-faqs-with-twilio-and-google-sheets/) | Answers keyword questions on a WhatsApp number with canned replies pulled from a Google Sheet FAQ tab. | Twilio, Google Sheets |
| [SMS Task Capture](published/n8n-sms-task-capture/) · [View](https://n8n.io/workflows/17402-create-notion-tasks-from-inbound-sms-with-twilio-and-rule-based-date-parsing/) | Turns an inbound SMS into a Notion task, reading the due date from the message with a fixed rule table instead of a model. | Twilio, Notion |
| [Sheet Calendar Feed](published/n8n-sheet-calendar-feed/) · [View](https://n8n.io/workflows/17548-publish-a-live-calendar-feed-from-google-sheets-to-google-apple-and-outlook/) | Serves a tab of events as an iCalendar feed at a stable URL, so anyone can subscribe once and see later edits arrive on their own calendar. | Google Sheets, iCalendar |
| [Gapless Number Issuer](published/n8n-gapless-number-issuer/) · [View](https://n8n.io/workflows/17547-issue-sequential-invoice-and-ticket-numbers-via-webhook-and-data-table/) | Issues consecutive invoice and ticket numbers over a webhook, and states plainly what the counter can and cannot promise under concurrent load. | Data Tables |

## Pending review

Submitted to the n8n Creator hub and awaiting approval. Templates move up to `published/` once they are live in the library.

| Template | What it does | Stack |
|---|---|---|
| [Drive Approval Gate](pending-review/n8n-drive-approval-gate/) | Holds every new file in a Drive inbox until somebody taps Approve or Send back on a Discord message, then moves it and logs the decision. | Discord, Google Drive, Google Sheets |
| [Discord Attachment Archiver](pending-review/n8n-discord-attachment-archiver/) | Sweeps named Discord channels daily and pulls every new attachment into a dated Google Drive folder before its signed URL expires. | Discord, Google Drive, Google Sheets |
| [Unanswered Question Digest](pending-review/n8n-unanswered-question-digest/) | Finds the questions in a Discord help channel that nobody answered and posts them with jump links to a moderator channel each morning. | Discord, Google Sheets |
| [Roster Drift Reconciler](pending-review/n8n-roster-drift-reconciler/) | Compares a Google Sheets roster against Discord roles each week and reports both directions of drift without ever changing a role. | Discord, Google Sheets |

## Pending submission

Built and tested but not yet submitted to the Creator hub. Templates move to `pending-review/` once submitted.

## License

MIT. See [LICENSE](LICENSE).

Built by Kevin Yu ([exekyute](https://github.com/exekyute)). Find my templates on n8n at [@exekyute](https://n8n.io/creators/exekyute/).

Put the numbers that live in a spreadsheet onto your Grafana dashboards. This workflow serves a Google Sheet as a Prometheus metrics endpoint, so SLO targets, licence counts and hand-counted backlogs sit next to real telemetry without a pull request or a Pushgateway.

## Who's it for

Anyone running Prometheus who needs business context alongside machine metrics. The classic case is a threshold hardcoded into an alert rule: changing the quarter's SLO target means editing the alerting repo, so it goes stale and the person who owns the number cannot touch it. Put it in a sheet instead and the alert reads it.

## How it works

A webhook serves the Prometheus 0.0.4 text exposition format rendered from your sheet, one row per series with `metric_name`, `help`, `type`, `value` and `labels`. A short TTL cache answers repeat scrapes from memory, so a 60 second scrape interval does not become a Google Sheets read every 60 seconds. Every row is validated against the format rules and rejected with a named reason if it fails: a blank cell is never read as a real zero, duplicate series are deduplicated, and reserved label names are refused before they can break the whole scrape. The exporter then appends metrics about its own run, so the body is never empty and a broken sheet shows up as data.

## How to set up

Give a sheet the five columns, connect a Google Sheets credential, and fill in the sheet ID and tab in Set Exporter Config. Add a Header Auth credential to the webhook and change the path off the shipped placeholder. Activate, curl the URL, then add the scrape job to `prometheus.yml`.

## Requirements

A Google account with a spreadsheet, a Prometheus server or Grafana Agent, and n8n with a Google Sheets credential and a Header Auth credential.

## Good to know

Use a 60 second scrape interval, not 15. A spreadsheet edited by a person does not change at 15 second granularity, and 15s is 5,760 executions a day.

A failed sheet read still answers 200 with `sheet_exporter_up 0`, following the same convention as `mysql_up`. Alert on that and on `sheet_exporter_series == 0`, because a renamed tab returns a healthy-looking scrape carrying no samples at all.

## How to customize the workflow

`cache_ttl_seconds` trades freshness against read quota. `exporter_prefix` renames every self-metric. `serve_stale_on_error` keeps serving the last good body through a Sheets outage, and `fail_status_code` switches to a hard 503 if you prefer that to the exporter convention.

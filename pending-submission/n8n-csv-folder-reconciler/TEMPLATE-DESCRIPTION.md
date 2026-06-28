Multi-branch teams export a CSV a day, and someone ends up merging them by hand. This workflow merges every CSV in a Google Drive folder into one deduplicated master, quarantines bad rows with a reason, and posts an auditable recap to Slack.

## Who's it for

Operations, finance, and retail teams whose branches or systems each drop a daily CSV export into a shared Google Drive folder, and who need one trustworthy merged file plus a clear record of what was dropped and why.

## How it works

On a schedule, the workflow lists every CSV in the folder, downloads and parses each one, and merges the rows. A Code node validates each row (required columns present, key non-empty, formats sane), deduplicates on a key keeping the first occurrence, and splits clean rows from bad ones. The good rows become a dated master CSV; every rejected row goes to a dated reject file with source_file, reject_type, and reject_reason columns. Both upload back to Drive, and a rows in, merged, quarantined, duplicates recap posts to Slack.

## How to set up

Connect Google Drive and Slack credentials, pick the input folder, set the columns, key, and format rules in the Reconcile node, pick the output folder in the two upload nodes, and pick the Slack channel. Run once, then activate.

## Requirements

n8n, a Google Drive OAuth2 credential, and a Slack credential. No AI and no paid services.

## How to customize the workflow

Edit the rules block in the Reconcile node to change the required columns, the dedup key, or the format checks. Adjust the schedule, change the output filename prefix, point the uploads at a separate folder, or drop the Slack recap to run with Drive only.

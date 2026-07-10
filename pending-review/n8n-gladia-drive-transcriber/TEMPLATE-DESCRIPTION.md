## Who's it for

Anyone who collects audio or video in a Google Drive folder and wants text out of it without lifting a finger: podcasters, researchers running interviews, support and sales teams keeping call records, or anyone building a searchable archive of recordings. Drop a file in the folder and a transcript appears.

## How it works

A Google Drive trigger fires when a new audio or video file lands in a watched folder. The file is downloaded and uploaded to Gladia, which runs an asynchronous pre-recorded transcription. The workflow polls the job on a timer, looping until Gladia returns done or a configurable attempt limit is reached. When the transcript is ready, a Code node builds a Markdown file with the full transcript and speaker-labelled lines, saves it to a Drive folder, and appends a row to a Google Sheet. Every run is logged, and any API error or timeout writes a Failed row with a reason so nothing is lost silently.

## How to set up

Import the workflow. Create a Header Auth credential named Gladia with header name x-gladia-key and your Gladia API key. Connect a Google Drive credential and set the watched folder and the transcripts folder. Connect a Google Sheets credential and pick the spreadsheet and tab for the log. Optionally adjust the poll interval and attempt limit in the config node.

## Requirements

n8n, a Gladia API key (as a Header Auth credential), a Google Drive OAuth2 credential, and a Google Sheets OAuth2 credential.

## Good to know

Gladia transcription is a paid feature billed per minute of audio, so check your plan before large batches. The default poll ceiling is about 10 minutes per file, so raise max_attempts for long recordings. The trigger reads any new file in the folder, so point it at a folder that receives audio or video.

## How to customize the workflow

Point the trigger at any Drive folder, change the transcript layout or file format in the Code node, enable Gladia features like diarization or translation in the transcription request, or add a Slack node after the log to get a notification when a transcript is ready.

## Who's it for

Anyone who ends up with a recording in a language they do not speak and wants a readable translation fast: journalists working with foreign interviews, researchers with field audio, community and support teams handling multilingual voicemails, or a creator translating a podcast clip. Paste a link, pick a language, and get both the original transcript and the translation back.

## How it works

A form asks for a publicly reachable audio or video URL and a target language code such as `en` or `fr`. The URL is sent to Gladia with transcription and translation enabled in a single pre-recorded call, and the source language is auto-detected. The workflow polls the job on a timer, looping until Gladia returns done or a configurable attempt limit is reached. When it finishes, a Code node builds a Markdown file holding the original transcript and the translation, saves it to Google Drive, and appends a row to a Google Sheet. Any API error or timeout writes a Failed row with a reason so nothing is lost silently.

## How to set up

Import the workflow. Create a Header Auth credential named Gladia with header name x-gladia-key and your Gladia API key. Connect a Google Drive credential and set the destination folder. Connect a Google Sheets credential and pick the spreadsheet and tab for the log. Optionally adjust the poll interval and attempt limit in the config node.

## Requirements

n8n, a Gladia API key (as a Header Auth credential), a Google Drive OAuth2 credential, and a Google Sheets OAuth2 credential.

## Good to know

The media URL must be publicly reachable, since Gladia fetches it directly. Gladia is a paid service billed per minute of audio, so check your plan before large batches. The default poll ceiling is about 10 minutes per file, so raise max_attempts for long recordings.

## How to customize the workflow

Swap the form trigger for a webhook or a schedule, request several target languages at once in the translation config, change the file layout in the Code node, or add a Slack or Gmail node after the log to get a notification when a translation is ready.

## What this workflow does

Generate ready-to-use subtitle files from any public audio or video URL. You submit a link through a simple form and get back both an SRT and a VTT file, saved to Google Drive, with the two download links shown on the form. It uses Gladia's speech-to-text API, which returns SRT and VTT subtitles directly, so there is no separate step to build captions from a raw transcript. It is built for video editors, podcasters, course creators, and anyone who needs captions without opening a desktop tool.

## How it works

1. Submit a public audio or video URL through the form, with an optional title for the files.
2. The workflow sends the URL to Gladia and asks for SRT and VTT subtitles in one call.
3. It waits and polls Gladia until the transcription is done, and stops after a set number of attempts if it is taking too long.
4. A Code node turns each subtitle track into a downloadable file.
5. Both files upload to a Google Drive folder and the form shows the two links. If anything fails, the form shows a clear message instead of breaking.

## How to set up

Import the workflow. Create a Header Auth credential named Gladia with header name x-gladia-key and your Gladia API key, then select it on the two Gladia HTTP nodes. Connect your Google Drive account and choose the folder that should hold the files. Open the form and submit a public media link.

## Requirements

n8n, a Gladia API key (as a Header Auth credential), and a Google Drive OAuth2 credential. The media URL must be publicly reachable so Gladia can fetch it.

## Good to know

Gladia processing is asynchronous, so the workflow polls and can take from a few seconds to a few minutes depending on the length of the media. Transcription is billed by Gladia under your plan, so check your usage before large batches. The default poll window is 10 seconds times 60 attempts, up to about 10 minutes.

## How to customize the workflow

Ask for only one of SRT or VTT in the submit step if that is all you need. Point the upload at a different Drive folder, or change how the files are named. Swap the form trigger for a webhook to run it from another system, and adjust wait seconds and max attempts for longer media.

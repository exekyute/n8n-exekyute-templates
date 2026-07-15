Turn a call, interview, or meeting recording into a clean, speaker-labeled transcript. Paste a public link to the audio and the transcript lands in Google Drive with each speaker and timestamp marked.

## Who's it for

Journalists, UX researchers, podcasters, and sales teams who need a readable "who said what" transcript from a recording, without paying for a heavy transcription suite or copying text out of another app by hand.

## How it works

- Submit a short form with a public audio or video URL and an optional speaker count.
- The workflow sends the recording to Gladia and turns on speaker diarization.
- Because Gladia is asynchronous, it waits and re-checks until the transcript is ready, then stops after a set number of attempts if a job stalls.
- A Code node groups the utterances by speaker and formats them as "Speaker 1 [00:12]: ...".
- The finished transcript is saved to Google Drive as a Markdown file and a link is posted to Slack. Errors and timeouts are reported to Slack too.

## How to set up

Create a Header Auth credential named Gladia with the header name x-gladia-key. Connect Google Drive and choose a folder for the transcripts. Connect Slack and pick a channel. Open the form and submit a recording URL.

## Requirements

n8n, a Gladia API key (as a Header Auth credential), a Google Drive OAuth2 credential, and a Slack credential. The recording must be reachable at a public URL.

## Good to know

It runs on n8n Cloud and self-hosted, because it calls the Gladia REST API with the core HTTP Request node rather than a community node. Gladia billing follows your Gladia plan. The speaker count is a hint to Gladia, not a hard limit.

## How to customize the workflow

Change the poll interval and timeout in Configure Polling. Adjust the transcript layout or file name in Format Speaker Transcript. Swap the Slack step for Gmail, or point the upload at a different Drive folder.

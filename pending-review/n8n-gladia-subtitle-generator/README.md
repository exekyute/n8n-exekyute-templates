# Generate SRT and VTT subtitle files from a media URL using Gladia and Google Drive

Give this a public link to an audio or video file and it hands back subtitle files you can use right away, both an SRT and a VTT, saved to your Google Drive. I built it because Gladia returns clean SRT and VTT directly, so there is no need to stitch captions together from a raw transcript.

Built with n8n, plus Gladia and Google Drive.

![The subtitle generator workflow](images/workflow.png)

## How it works

You submit one form. The workflow sends your URL to Gladia, waits for the transcription to finish, writes each subtitle track to a file, stores both in Google Drive, and shows you the links.

| Stage | What happens |
|---|---|
| Form | You paste a public audio or video URL and an optional title. |
| Submit | The workflow sends the URL to Gladia and requests SRT and VTT subtitles in one call. |
| Poll | It waits and checks Gladia on a loop until the job is done, with a timeout guard so it never spins forever. |
| Build files | A Code node reads the finished result and turns each track into a subtitle file. |
| Store and reply | Both files upload to Google Drive, and the form shows the two links. On failure it shows a clear message instead. |

Gladia is asynchronous: the submit call returns a job id, and the result is fetched separately once processing finishes. The workflow handles that polling for you and gives up gracefully after a set number of attempts.

## Setup

1. Import `workflow.json` into n8n. It imports inactive, so configure it before using it.
2. Create a Header Auth credential named `Gladia` with header name `x-gladia-key` and your Gladia API key. Select it on "Submit Media to Gladia" and "Fetch Transcription Result".
3. Connect your Google Drive account on "Upload Subtitles to Drive" and set the folder that should hold the files.
4. Open the form with the Test URL, and submit a public link to an audio or video file.

## Formats and polling

Two things are easy to tune:

| Setting | Where | What it does |
|---|---|---|
| `formats` | "Submit Media to Gladia" body | The subtitle formats Gladia returns. Ask for `["srt", "vtt"]`, or just one. |
| `wait_seconds` | "Set Polling Config" | Seconds between each poll of Gladia. |
| `max_attempts` | "Set Polling Config" | How many polls before the run times out. Default is 10 seconds times 60, up to about 10 minutes. |

The Media URL must be publicly reachable, since Gladia fetches it directly. A link that needs a login or is on a private network will not work.

## What is in this folder

| File | What it is |
|---|---|
| `README.md` | This overview |
| `TEMPLATE-DESCRIPTION.md` | The n8n Creator hub listing text |
| `workflow.json` | The importable n8n workflow |
| `images/` | The workflow overview image |

---

All sample data is fictional. No real credentials, IDs, or endpoints are included.

Part of the [n8n-exekyute-templates](../../) collection. MIT licensed.

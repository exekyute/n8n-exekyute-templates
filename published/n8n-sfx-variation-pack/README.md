# Generate a sound effect variation pack from one brief using ElevenLabs and Google Drive

Describe one sound once and get several ElevenLabs takes of it to choose from, each saved into a dated Google Drive folder as take-1.mp3, take-2.mp3, and so on. The sound-generation API has no seed, so re-running the same brief is exactly how you get real variety, and this workflow does that fan-out for you from a simple form.

Built with n8n, plus ElevenLabs and Google Drive.

![The Sound Effect Variation Pack workflow on the n8n canvas](images/workflow.png)

## How it works

You submit one brief through a form and the workflow returns a small pack of takes to audition.

| Stage | What happens |
|---|---|
| Form trigger | Takes the sound description, how many takes you want (1 to 5), and optional duration and prompt influence. |
| Plan and fan out | Clamps the inputs, creates a dated Drive subfolder for this run, and builds one request per take from the single brief. |
| Generate each take | Calls the ElevenLabs sound-generation endpoint once per take. Because the API has no seed, each call returns a different result. |
| Store each take | Uploads every returned MP3 into the subfolder as take-1.mp3 through take-N.mp3. |
| Return the pack | Shows a link to the folder plus a per-take list, marking any take that failed rather than hiding it. |

The one design choice that matters: variety comes from re-generating the same prompt, not from a seed, so prompt influence is spread slightly across the takes as a second variety lever while the brief stays identical.

## Setup

1. Import `workflow.json` into n8n. It imports inactive, so configure it before activating.
2. Create an ElevenLabs credential as Header Auth: header name `xi-api-key`, value your ElevenLabs API key. Name it `ElevenLabs` and assign it to the "Generate Sound Effect" node.
3. Create a Google Drive OAuth2 credential and assign it to both Drive nodes.
4. Open "Plan Takes and Folder" and set `PARENT_FOLDER_ID` to the Drive folder that should hold the generated packs.
5. Run it once from the form on a short brief, then activate.

## Choosing takes and variety

- Number of takes is clamped to 1 through 5. The default is 3.
- Duration is optional and clamped to 0.5 to 30 seconds. Leave it blank to let ElevenLabs choose a natural length.
- Prompt influence is optional (0 to 1, default 0.3). Each take nudges it up a little for extra variety, which you can change in the Code node.
- A take that fails to generate or upload is recorded as failed and still listed, so a partial pack never looks like a total success.
- If the output folder ID is not set or the Google Drive credential is not connected, the form returns a clear setup message instead of a generic error.

## Requirements

- n8n.
- An ElevenLabs account and API key, used through a Header Auth credential (`xi-api-key`).
- A Google Drive OAuth2 credential with access to the output folder.

## What is in this folder

| File | What it is |
|---|---|
| `README.md` | This overview |
| `TEMPLATE-DESCRIPTION.md` | The n8n Creator hub listing text |
| `workflow.json` | The importable n8n workflow |
| `images/` | The canvas screenshot |

---

All sample data is fictional. No real credentials, IDs, or endpoints are included.

Part of the [n8n-exekyute-templates](../../) collection. MIT licensed.

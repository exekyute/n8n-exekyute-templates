## What this workflow does

Describe a sound once and get a small pack of ElevenLabs takes to choose from, instead of a single one-shot result you either keep or regenerate by hand. You fill in a short form with the sound description and how many takes you want, and the workflow generates that many versions of the same brief and saves them into a dated Google Drive folder as take-1.mp3, take-2.mp3, and so on. It is built for sound designers, video editors, and game or app makers who want options for one cue without leaving n8n. The ElevenLabs sound-generation API has no seed, so re-running the same prompt is how you get genuine variety, and this template automates that fan-out.

## How it works

An n8n form takes the brief, a take count from 1 to 5, and optional duration and prompt influence. A Code node clamps the inputs and builds one request per take, and a dated Drive subfolder is created for the run. Each take calls the ElevenLabs sound-generation endpoint on its own, returns a binary MP3, and is uploaded into the subfolder. Prompt influence is spread slightly across the takes as a second variety lever. A take that fails to generate or upload is recorded as failed and still listed. The form then shows a link to the folder and a per-take result list.

## Setup

Import the workflow, add an ElevenLabs Header Auth credential (header `xi-api-key`), add a Google Drive OAuth2 credential and assign it to both Drive nodes, and set your output folder ID in the "Plan Takes and Folder" node. Run it once from the form, then activate.

## Good to know

Each take is one ElevenLabs sound-generation call, so a pack of N takes costs N generations against your ElevenLabs plan. Duration is clamped to 0.5 to 30 seconds and take count to 1 to 5. The workflow ships inactive with no hardcoded keys.

## Requirements

n8n, an ElevenLabs account and API key (Header Auth, `xi-api-key`), and a Google Drive OAuth2 credential. No other paid services are required.

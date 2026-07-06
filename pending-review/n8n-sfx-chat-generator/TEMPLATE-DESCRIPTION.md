## What this workflow does

A chat-triggered sound effect generator. You describe a sound in plain words and it replies in the chat with a ready to use audio clip. A Groq model works as a sound-effects director: it rewrites your casual description into a literal, richly detailed prompt for the ElevenLabs sound-generation API, and picks a sensible length and prompt influence. The MP3 is saved to Google Drive and the shareable link comes back in the chat. It is built for content creators, game and video makers, and anyone who wants quick sound effects without leaving a chat box.

## How it works

Send a message like "a heavy wooden door creaking open" to the chat. The director step turns it into a precise ElevenLabs prompt and returns a small JSON object with the prompt, a duration between 0.5 and 30 seconds, and a prompt influence between 0 and 1. A short Code step parses that JSON and clamps the values to safe ranges, falling back to your own words if the reply is unclear, so every message still produces something. The workflow calls the ElevenLabs sound-generation endpoint, receives an MP3, uploads it to a Google Drive folder, and replies with the link, the exact prompt used, and the duration. If the sound service is busy or errors after retries, you get a friendly message instead of a broken chat.

## How to set up

Import the workflow. Create a Header Auth credential named ElevenLabs with header name xi-api-key and your ElevenLabs API key, then select it on the ElevenLabs node. Select your Groq credential on the model node. Connect your Google Drive account and choose the folder that should hold the clips. Open the chat and describe a sound.

## Requirements

n8n, an ElevenLabs API key (as a Header Auth credential), a Groq API credential, and a Google Drive OAuth2 credential.

## Good to know

One sound is generated per message. Clips are capped at 30 seconds by the ElevenLabs API. ElevenLabs sound generation is a paid feature of your ElevenLabs plan (around 40 credits per second of audio), so the clamped duration is also the cost control. Check your plan before heavy use.

## How to customize the workflow

Swap the chat trigger for a form or webhook to fit it into another surface. Tune the duration and prompt-influence guidance in the director prompt to match your style. Point the upload at a different Drive folder, or change how clips are named.

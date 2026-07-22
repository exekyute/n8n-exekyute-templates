A customer sends one keyword to your WhatsApp number and gets the matching answer back. The answers live in a Google Sheet, one row per keyword, so whoever owns the wording edits a cell, not the workflow. No AI, so the same keyword always returns the same sentence.

## Who's it for

Small teams answering the same few questions every day: opening hours, pricing, returns. Anyone who wants a predictable auto-reply, not a model that improvises.

## How it works

A Twilio Trigger fires on an inbound WhatsApp message. A Set node uppercases the first word of the body, strips punctuation, and pulls the sender's number off the payload. A Switch matches that token against HOURS, PRICING and RETURNS. Matches hit a Google Sheets lookup filtered on the `keyword` column, and a Set node turns the row into reply text. Unrecognised words drop to the fallback, which lists the valid keywords. Both paths meet at the Twilio node that sends the reply.

## How to set up

1. Import the workflow. It arrives inactive.
2. Add a Twilio credential to the trigger and send node, and a Google Sheets credential to the lookup.
3. Create a sheet with `keyword` and `answer` columns and select it in the lookup.
4. Set `From` on the send node to your WhatsApp number.
5. Paste the trigger's production URL into the Twilio WhatsApp Sandbox "When a message comes in" field, method POST.
6. Message the number, check the execution, then activate.

## Requirements

- A Twilio account with WhatsApp enabled, or the WhatsApp Sandbox
- A Google Sheet holding the FAQ rows

## Good to know

WhatsApp only allows freeform text after the user messages you first. Their message opens a 24 hour window and the reply goes out inside it, so no approved template is needed. On a Twilio trial the sandbox is the one path accepting custom message bodies, so this is testable end to end. A session lasts three days before the user resends the join code.

## How to customize

Add a keyword with a sheet row and one more Switch rule. Change the fallback text in "Build The Help Reply" to point at a human. To go open-ended, drop the Switch and let every message hit the Sheet filter.

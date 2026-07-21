# Answer WhatsApp keyword questions from a Google Sheet FAQ

Most of the "chatbot" questions a small business gets are the same three questions. I did not want a model guessing at them, so this replies with the exact sentence someone typed into a spreadsheet. A customer sends HOURS to the WhatsApp number, the workflow finds that row in a Google Sheet, and it sends the answer back. Staff can change an answer by editing a cell, without opening n8n.

Built with n8n, plus Twilio and Google Sheets.

![The WhatsApp keyword FAQ workflow on the n8n canvas](images/workflow.png)

## How it works

A Twilio Trigger fires when an inbound WhatsApp message hits the sandbox number. A Set node takes the first word of the message body, strips punctuation, uppercases it, and pulls the sender's number off the payload. A Switch matches that token against HOURS, PRICING, and RETURNS. All three matches go to a single Google Sheets lookup that filters the FAQ tab on the keyword column, and a Set node turns the matched row into reply text. Anything the Switch does not recognise falls to the fallback output, which builds a short help message instead. Both paths meet at the Twilio node, which sends the text back on the WhatsApp channel.

| Stage | What happens |
|---|---|
| Receive Inbound WhatsApp Message | Twilio Trigger fires on an inbound WhatsApp message to the sandbox number |
| Normalize Keyword And Sender | Takes the first word of the body as an uppercase keyword and strips the `whatsapp:` prefix off the sender |
| Route The Keyword | Switch with a rule per keyword (HOURS, PRICING, RETURNS) and a fallback output for everything else |
| Look Up The Answer Row | Reads the FAQ tab and returns the first row whose `keyword` column matches |
| Build The Answer Reply | Builds the reply text from the sheet row and carries the sender's number forward |
| Build The Help Reply | On the fallback branch, builds a short message listing the valid keywords |
| Send The WhatsApp Reply | Twilio sends the reply with `toWhatsapp` on, inside the 24 hour window the inbound message opened |

The answers live in the Sheet, not in the nodes. Changing what the bot says is a cell edit, which means the person who owns the wording does not need access to the workflow.

## Setup

1. Import `workflow.json` into n8n. It imports inactive, so configure it before activating.
2. Add a Twilio credential (Account SID and Auth Token) and assign it to "Receive Inbound WhatsApp Message" and "Send The WhatsApp Reply". Add a Google Sheets credential and assign it to "Look Up The Answer Row".
3. Open "Look Up The Answer Row" and pick your spreadsheet and the `FAQ` tab. Open "Send The WhatsApp Reply" and set `From` to your Twilio WhatsApp sandbox number.
4. In the Twilio Console, paste the production URL from the trigger node into the WhatsApp Sandbox "When a message comes in" field with method POST. Send yourself a test message, check the execution, then activate.

## Testing on a Twilio trial

This one is fully testable on a trial with real custom text, which is unusual: trial accounts cannot send custom SMS or WhatsApp bodies, but the WhatsApp Sandbox is exempt inside the 24 hour window.

| Step | What to do |
|---|---|
| 1 | In the Twilio Console open Messaging, then Try it out, then Send a WhatsApp message, and enable the sandbox |
| 2 | From your own phone, send the join code to the sandbox number. That opens the 24 hour window |
| 3 | Seed the FAQ tab with three rows: HOURS, PRICING, RETURNS, each with an answer |
| 4 | Send each keyword and confirm the canned answer comes back |
| 5 | Send something nonsense and confirm the help reply lists the three valid keywords |

Inbound receiving is unrestricted on a trial, and a sandbox session lasts three days before you have to send the join code again. Trial accounts also only send to verified numbers, so test from the phone you signed up with.

## What is in this folder

| File | What it is |
|---|---|
| `README.md` | This overview |
| `TEMPLATE-DESCRIPTION.md` | The n8n Creator hub listing text |
| `workflow.json` | The importable n8n workflow |
| `images/workflow.png` | The workflow on the n8n canvas |

---

All sample data is fictional. No real credentials, IDs, or endpoints are included.

Part of the [n8n-exekyute-templates](../../README.md) collection. MIT licensed.

# Turn inbound SMS into Notion tasks with deterministic due-date parsing

I kept thinking of things to do while nowhere near a laptop, so I wanted a task inbox I could hit from a text message. This workflow takes an inbound SMS to a Twilio number, reads a due date out of the text using a fixed rule table in a Code node, and creates a Notion page with that date. No model is involved, so the same wording always produces the same date and I can read the rules instead of guessing at them.

Built with n8n, plus Twilio and Notion.

![The inbound SMS to Notion task workflow on the n8n canvas](images/workflow.png)

## How it works

A Twilio Trigger fires when the number receives a message. A Set node pulls the body and the sender into predictable fields and makes a lowercased copy for matching. A Code node runs a short list of regular expressions against that copy, resolves the first match to a real date with Luxon in one declared timezone, and strips the matched phrase out of the title. An IF node checks whether a date came back. If it did, a Notion node creates the page with the Due date filled in. If it did not, a second Notion node creates the same page with a Needs Review checkbox ticked and the raw message stored, so nothing is dropped.

| Stage | What happens |
|---|---|
| Inbound SMS Received | Twilio Trigger fires on an inbound message and exposes `Body` and `From` |
| Normalize Message Text | Trims the body, makes a lowercased copy for matching, and captures the sender number and receive time |
| Parse Due Date From Rule Table | Runs the rule table against the lowercased copy, resolves the first match to an ISO date, and returns the title with the date phrase removed |
| Did A Rule Match A Date | Splits on whether `dueIso` came back non-empty |
| Create Notion Task With Due Date | Creates the page with the cleaned title and the parsed Due date |
| Create Notion Task Flagged For Review | Creates the page with the original text, ticks Needs Review, and leaves Due blank |

Because the parser is a fixed table rather than a model, the mapping from text to date is something you can read, test, and change in one place.

## Setup

1. Import `workflow.json` into n8n. It imports inactive, so configure it before activating.
2. Add a Twilio credential (Account SID and Auth Token) and assign it to "Inbound SMS Received". Add a Notion credential and assign it to both Notion nodes.
3. In the Twilio console, open your phone number and point the "A message comes in" webhook at the trigger's production URL, method POST.
4. Open both Notion nodes and pick your task database. The database needs a title property, a date property named `Due`, a checkbox named `Needs Review`, and a text property named `Source`.
5. Open "Parse Due Date From Rule Table" and set `TIMEZONE` on the first line to the zone your due dates should be read in. It ships as `America/Halifax`.
6. Run it once with a test text, check the Notion page, then activate.

## The rule table and testing on a Twilio trial

The parser tries these in order and stops at the first hit. Matching is case-insensitive because the Set node lowercases the text first.

| Phrase | Resolves to |
|---|---|
| `in N days` | Today plus N days, N up to 3 digits |
| `next <weekday>` | The soonest upcoming occurrence of that weekday after today |
| `by <weekday>` | The same as `next`, the soonest upcoming occurrence after today |
| `on <month> <day>` | That date this year, rolled to next year if it has already passed |
| `tomorrow` | Today plus one day |
| `today` | Today |

Weekdays accept short forms (`mon`, `tues`, `thurs`), and months accept short forms (`jan`, `sept`). The matched phrase is cut out of the title, so `call vendor tomorrow` becomes a task called `call vendor` due tomorrow. If nothing matches, `dueIso` comes back empty and the false branch handles it.

You can exercise all of this on a Twilio trial without spending a single free message or burning a verified-number slot. The trial's restrictions are on what you send out, and this workflow sends nothing: inbound receiving is unrestricted. Point the number's inbound webhook at the trigger, then text it from your own phone with a bare task, `call vendor tomorrow`, `file taxes by friday`, and `ship it in 3 days`. Confirm each one lands in Notion with the date you expect, and that the bare task arrives with Needs Review ticked rather than failing the run.

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

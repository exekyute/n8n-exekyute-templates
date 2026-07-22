Text a task to your Twilio number and it becomes a page in your Notion task database, with the due date pulled from the text. A Code node runs a fixed rule table (today, tomorrow, in N days, next friday, by friday, on march 4) through Luxon in one declared timezone. No model is in the path, so the same wording always gives the same date; a message with no date phrase is still captured for review.

## Who's it for

Anyone who thinks of work away from a keyboard: solo operators, field staff, and small teams on a Notion task database.

## How it works

A Twilio Trigger fires on an inbound message and a Set node trims the body, plus a lowercased copy for matching. A Code node walks the rule table in order, resolves the first match to an ISO date, and strips that phrase from the title. An IF node checks whether a date came back: true creates a Notion page with `Due` filled in, false creates it with the raw message in `Source` and `Needs Review` ticked.

## How to set up

1. Import the workflow. It arrives inactive.
2. Add a Twilio credential to the trigger, then a Notion credential and your task database on both Notion nodes.
3. In the Twilio console, point your number's inbound webhook at the trigger's production URL, method POST.
4. Set `TIMEZONE` at the top of the Code node, send a test text, then activate.

## Requirements

- A Twilio account with an SMS-capable number
- A Notion database with a title property, a `Due` date, a `Needs Review` checkbox, and `Source` text
- An n8n instance Twilio can reach from the internet

## Good to know

Only inbound messages are used, so this runs on a Twilio trial: its limits on outbound messages and verified recipients never bite here. Weekday and month names accept short forms such as `mon`, `thurs`, and `sept`.

## How to customize

Add rules to the `RULES` array in the Code node; they are tried top down and each entry is a pattern plus a resolver returning a Luxon DateTime. For a priority or project field, add a `propertyValues` entry. To route unmatched messages elsewhere, point the false branch at Slack or email.

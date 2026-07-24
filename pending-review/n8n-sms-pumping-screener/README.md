# Screen a campaign number list for high-risk lines with Twilio Lookup

Run every number on a campaign list through Twilio Lookup before anything is sent, routing mobiles in allowed countries to a safe-to-send tab and everything else to a quarantine tab with a written reason. Bad numbers cost money twice: landlines and VoIP lines inflate the failure rate and the bill, and premium-rate VoIP lines are the raw material of SMS pumping fraud. Slack gets one summary per run with a breakdown of what was blocked.

Built with n8n, plus Twilio Lookup, Google Sheets, and Slack.

![The n8n canvas showing a manual trigger reading a Google Sheet, a loop that calls Twilio Lookup for each number, a classifier and switch, two Google Sheets writes, and a Slack summary.](images/workflow.png)

## Use it when

- A campaign list turns out to be full of landlines and VoIP numbers, and you find out after the send, when the failure rate spikes and the invoice arrives.
- You suspect SMS pumping: someone injects premium-rate numbers into your signup flow so your campaign becomes their revenue. Those lines come back as VoIP or as a country you do not send to, and either way they stop at the quarantine tab.
- Numbers land in your sheet from a form or an import and nobody validates them, so every blast pays for the junk rows too.

## How it works

A manual run pulls the pending campaign tab from Google Sheets and feeds it into a loop that takes one number at a time. Each number goes to the Twilio Lookup v2 endpoint with the Line Type Intelligence field requested, and the response comes back with a validity flag, a country code, and the line type. A Code node turns that into a decision: mobile in an allowed country is safe, anything else is quarantined with a reason, lookup errors included. A Switch sends safe rows to one sheet tab and quarantined rows to another. When the loop finishes, a second Code node counts the results and Slack gets a short summary.

| Stage | What happens |
|---|---|
| Start Number Screen | Manual trigger, so a person decides when a list gets screened |
| Get Pending Campaign Numbers | Reads every row from the pending campaign tab |
| Loop Over Each Number | Batch size 1, so each number gets its own lookup call |
| Look Up Line Type With Twilio | GET to `lookups.twilio.com/v2/PhoneNumbers/{number}` with `Fields=line_type_intelligence`, using the built-in Twilio credential. Full response and never-error are on so a bad number does not kill the run |
| Classify Line Risk | Checks the status code, validity flag, line type, and country against two allowed lists, then sets `decision` to safe or quarantine and writes a reason |
| Route Safe or Quarantine | Switch with renamed outputs. The Safe output carries `decision` of safe, the fallback Quarantine output takes everything else |
| Write Row To Safe To Send Tab | Appends the clean row, using the E.164 number Twilio returned |
| Write Row To Quarantine Tab | Appends the blocked row plus the reason it was blocked |
| Build Screening Summary | Counts screened, safe, and quarantined, and groups the blocks by line type and country |
| Post Screening Summary To Slack | One message per run, not one per number |

I send safe and quarantined rows to separate tabs rather than one tab with a status column, so the sending workflow reads a list that only ever contains numbers that passed.

## Requirements

- A Twilio account with the Line Type Intelligence add-on enabled under Lookup. A free trial works; see the testing section below.
- A Google account with a spreadsheet holding a pending tab, a safe-to-send tab, and a quarantine tab.
- A Slack workspace with a channel for the run summary.
- n8n (cloud or self-hosted) with Twilio, Google Sheets, and Slack credentials.

## Setup

1. Import `workflow.json` into n8n. It imports inactive; configure before activating.
2. Create a Twilio credential (Account SID and Auth Token) and assign it to "Look Up Line Type With Twilio", which authenticates with n8n's built-in Twilio credential type. Add a Google Sheets credential to the three Sheets nodes and a Slack credential to "Post Screening Summary To Slack".
3. Pick your spreadsheet in the three Sheets nodes and set the tab names. The template expects `Pending Campaign` with `campaign_id`, `contact_name`, and `phone_number` columns, numbers in E.164 format, plus a `Safe To Send` tab and a `Quarantine` tab. Both destination tabs need the header row the append maps to: `campaign_id`, `contact_name`, `phone_number`, `line_type`, `country_code`, `carrier_name`, `screened_at`, and `reason` on the quarantine tab as well. Set your Slack channel.
4. Enable Line Type Intelligence in the Twilio console under Lookup.
5. Run it once against a short list, confirm both tabs fill correctly, then activate it or switch the trigger to a schedule.

## Testing on a Twilio trial

Lookup is a data API, so it ignores the trial verified-caller list and works across borders. Nothing is sent, which means a trial account with zero verified numbers can exercise the whole thing.

Seed the pending tab with five rows and run it:

| Test number | Expected result |
|---|---|
| A real mobile in Canada or the US | safe, `line_type` mobile |
| A landline (a business main line works) | quarantine, line type not allowed |
| A VoIP number (a softphone or conferencing line) | quarantine, line type not allowed |
| A mobile outside Canada and the US, for example a UK number | quarantine, country outside the allowed list |
| An invalid string like `+1555` | quarantine, lookup failed or not valid |

Check that each lookup returns a line type and a country, that the Switch puts only the first row in Safe To Send, and that the Slack message reports four quarantined with the breakdown. Basic Lookup validation is free. Line Type Intelligence is a billable add-on, around $0.008 per lookup, so a 2,000-number list costs roughly $16 and trial credit covers a test list this size. Screen each list once, not per send.

## Customize

- **Allowed countries.** The `allowedCountries` array at the top of "Classify Line Risk" ships as `CA` and `US`; add country codes there to accept more markets.
- **Allowed line types.** The `allowedLineTypes` array in the same node ships as mobile only. Add Twilio's VoIP values, `fixedVoip` and `nonFixedVoip`, if your audience uses softphones.
- **Trigger.** Swap "Start Number Screen" for a Schedule Trigger to screen a rolling list overnight.
- **Summary wording.** The Slack message is assembled in "Build Screening Summary"; reword it there without touching the classification.

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

Screens every number on a campaign list through Twilio Lookup before anything is sent. Landlines, VoIP lines, foreign numbers, and dead numbers land in a quarantine tab with a reason. Only numbers that pass reach the sender.

## Who's it for

Anyone who sends SMS campaigns from a spreadsheet and does not want to pay to message landlines, VoIP lines, or foreign numbers. It also guards against SMS pumping fraud, where injected premium-rate numbers turn a campaign into someone else's revenue.

## How it works

A manual run reads the pending tab from Google Sheets. A loop calls the Twilio Lookup v2 endpoint per number with Line Type Intelligence requested, so the response carries a validity flag, country code, and line type: mobile, landline, voip, or nonFixedVoip. A Code node checks type and country against two allowed lists and writes a reason for anything that fails, lookup errors included. A Switch feeds two Google Sheets appends, and Slack gets one summary.

## How to set up

1. Import the workflow. It arrives inactive.
2. Create a Twilio credential (Account SID and Auth Token) and assign it to the Lookup node, which uses n8n's built-in Twilio credential type.
3. Add Google Sheets and Slack credentials, pick your spreadsheet, name the pending, safe-to-send, and quarantine tabs, and set the Slack channel.
4. Enable Line Type Intelligence in the Twilio console under Lookup.
5. Run once on a short list first.

## Requirements

A Twilio account with the Line Type Intelligence add-on enabled, a Google account, and a Slack workspace. The pending tab needs `campaign_id`, `contact_name`, and `phone_number` columns, numbers in E.164 format.

## Good to know

Basic Lookup validation is free. Line Type Intelligence is billable, around $0.008 per lookup, so a 2,000 number list costs roughly $16. Screen each list once, not per send. Full response and never-error are on, so a failed lookup quarantines instead of stopping the run. Lookup is a data API, so a Twilio trial works: no verified-caller list, no border limits, no message sent.

## How to customize

Allowed countries and line types are two arrays at the top of Classify Line Risk. Narrow them, or allow `voip` if your audience uses softphones. Swap the manual trigger for a Schedule Trigger to screen a rolling list overnight.

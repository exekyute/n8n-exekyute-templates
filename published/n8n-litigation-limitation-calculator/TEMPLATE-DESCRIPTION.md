Calculate the limitation period and procedural deadlines for a Canadian litigation matter from one intake form, with rules-based Luxon date math (not an AI guess) that cites the statute behind every date. Nine jurisdictions ship in the rules table.

## Who's it for

Litigation paralegals, lawyers, and small-firm practice managers across Canada who need a fast, auditable first pass at a new matter's key dates and want every deadline traceable to the rule that produced it.

## How it works

An intake form collects the trigger event, jurisdiction, and claim type. A single rules node holds an editable, multi-province table. A Code node matches the rule, applies the period using the anniversary convention, rolls filing deadlines forward off weekends and holidays (and reminders back to the prior working day), and emits one record per deadline with the rule cited and both the raw and adjusted dates. Because every rule is discovery-basis, the limitation is measured only from a discovery or loss/act anchor; a service or filing anchor produces a "review needed" note pointing to the correct date rather than a limitation that overstates the time remaining. Records flow to Google Calendar (a deadline event plus staggered reminder events), a Google Sheets register, and a Slack and Gmail summary.

## How to set up

Connect Google Calendar, Google Sheets, Gmail, and Slack credentials. In the rules node, fill the calendar, sheet, channel, and email placeholders, then review the limitation and procedural rules for the jurisdictions you practise in.

## Requirements

An n8n instance, plus Google Calendar, Google Sheets, Gmail, and Slack credentials. No AI keys or paid APIs.

## Good to know

The rules table ships with limitation periods for nine jurisdictions: Ontario, British Columbia, Alberta, Saskatchewan, Manitoba, Nova Scotia, New Brunswick, the federal Crown, and Quebec, across common claim types (general civil, personal injury, contract, property damage, defamation, municipal slip and fall, professional negligence). This is a scheduling aid, not legal advice. Limitation law changes and carries exceptions the table cannot capture (discoverability, notice periods, suspensions, parties under disability), so verify every period against the current statute and rules of court before relying on it. The workflow runs entirely on your own credentials at no per-run cost.

## How to customize

Edit the limitation rules, procedural rules, holiday list, reminder offsets (default 90, 30, 7 days), business-day roll, and timezone, all in one node. Add a jurisdiction or claim type by extending the table and the engine picks it up with no code changes.

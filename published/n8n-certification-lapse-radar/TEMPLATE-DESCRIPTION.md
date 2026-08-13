A certification that is valid today can still be expired on the day of a session ten weeks out. This workflow reads a staff roster, a session staffing map, a coverage rules Data Table, and your training calendar, then judges every upcoming session against the certifications that will actually be valid on that date. Slack gets one fix list per run and each lapsed staffer gets one renewal email.

## Who's it for

Anyone who schedules certified staff onto dated sessions: training coordinators, safety and compliance leads, clinic and lab schedulers, volunteer program managers. If your compliance check is a spreadsheet filter on expired-as-of-today, this is the gap it misses.

## How it works

A weekly Schedule Trigger loads one configuration node, then Google Sheets reads the Roster tab (Person, Email, Certification, Expiry) and the Staffing tab (SessionCode, Person). A Data Table supplies the coverage rules: session_type, required_cert, min_certified. Google Calendar returns every event in the lookahead window with recurring events expanded into dated instances. A Set node lifts the bracketed code token out of each event title, and a Code node joins that code to staffing rows and its prefix to a rule, then compares each assigned person's expiry to the session date, both sides reduced to a bare date with Luxon. Sessions route three ways as under covered, unmatched, or covered, each branch formats its own line, and a Merge assembles one Slack post. A second Code node regroups the lapsed people by person and certification, deduped across sessions, and a batch loop sends one Gmail each.

## How to set up

1. Import the workflow. It arrives inactive.
2. Fill in Workflow Configuration: the spreadsheet id, the two tab names, the calendar id, the Slack channel id, and the lookahead in weeks.
3. Build the Roster tab (Person, Email, Certification, Expiry) with one row per person per certification, and the Staffing tab (SessionCode, Person) with one row per assignment. Type Expiry as ISO text, YYYY-MM-DD, in a plain text column.
4. Fill the Certification Lapse Radar Rules Data Table with session_type, required_cert, and min_certified. The required_cert text has to match the Roster Certification text.
5. Put a code token in every session title, for example First Aid Refresher [FA-101]. The prefix before the first hyphen selects the rule.
6. Assign the Google Sheets, Google Calendar, Slack, and Gmail credentials, run it once by hand, then activate.

## Requirements

A Google account with view access to the spreadsheet and calendar, an n8n instance new enough to offer Data Tables, a Slack app with chat:write and the channel's ID value, and a Gmail account cleared to email staff.

## Good to know

Nothing is written back anywhere and no state carries between runs, so a lapsed staffer receives the same notice every run until their Expiry cell changes. Person values must be spelled the same on both tabs; the join trims whitespace but is case sensitive. Events missing a code token, a staffing row, or a rule are never silently dropped: they get their own Slack warning section, because skipping them would fake full coverage. Recurring events expand to one line per occurrence, so a long lookahead on a busy calendar can hit Slack's message length limit. Slack and Gmail both continue on error, so nothing is retried.

## How to customize

Change the lookahead in weeks to resize the window. Edit the token regex in the extraction node and the session type split together if your codes are shaped differently. Add a buffer to the pass test so certs expiring within thirty days of a session fail early. The three Slack line formats are separate Set nodes, one per verdict. The Gmail node sends plain text; switch it to HTML for a formatted notice.

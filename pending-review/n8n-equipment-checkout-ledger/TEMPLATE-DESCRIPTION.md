One form covers both sides of equipment lending. A submitter picks Checkout or Return, enters the asset tag and their email, and the workflow reads the Asset Registry data table before issuing anything. An asset is free to lend only when its holderEmail is blank, so a checkout on gear someone else holds is refused on the spot and the page names the current holder and the due date. Every receipt also lists anything else that person still holds past due, so chasing overdue kit rides along on normal traffic.

## Who's it for

Office managers, IT desks, AV and media teams, makerspaces, and school or library programs lending laptops, cameras, tools, or kit from a shared pool. It suits a team that currently tracks lending on a clipboard or a shared spreadsheet and keeps losing the thread on who has what.

## How it works

1. An n8n Form collects the action, asset tag, submitter email, and an optional expected return date.
2. Every submission is appended to a Lending History data table before any check runs, so refused returns leave a trace too.
3. The Asset Registry row for that tag is read, with Always Output Data on so an unknown tag still flows through and becomes a first checkout.
4. A Switch resolves four outcomes from that one read: checkout refused because the asset is already out, checkout allowed, return verified against the recorded holder, or return mismatched.
5. Allowed checkouts upsert holderEmail, dueDate, and status out. Verified returns blank holderEmail and set status available. Mismatched returns post a Slack alert and leave the registry untouched.
6. Both successful paths query the registry for anything else that person holds with a dueDate before today, then a plain text Gmail receipt goes out with that list appended.
7. Every branch ends on a form completion page, so the submitter always sees a result.

## Requirements

- n8n with Data Tables available, holding an Asset Registry table (assetTag, holderEmail, dueDate, status) and a Lending History table (assetTag, submittedAction, personEmail, expectedReturnDate, submittedAt). All five Data Table nodes resolve by table name, so do not rename the tables afterwards.
- One registry row per asset tag, since every read and write matches on assetTag alone. Anything free to lend needs an empty holderEmail, and dueDate values must be ISO dates.
- A Gmail account cleared to email borrowers, including external domains.
- A Slack app with chat:write that is already a member of the alert channel, since the node posts to a raw channel ID and never joins.

## How to set up

1. Import the workflow. It imports inactive; configure it before activating.
2. Create both data tables and seed one Asset Registry row per asset, with holderEmail left empty and status set to available.
3. Fill slackChannelId and assetTeamEmail in Workflow Configuration.
4. Assign your Gmail and Slack credentials to the two send nodes.
5. Submit a test checkout and a test return against one seeded tag, confirm the registry row flips both ways, then activate and share the production form URL.

## How to customize the workflow

- The 7 day default due date is written in three places: the dueDate expression on Record Checkout in Registry, the Gmail body, and the form description. Change all three together.
- Find Overdue Items for Person flags any dueDate before today. For a grace period, set that value to something like $today.minus({days:3}).toISO().
- Only the Return Mismatch branch reaches Slack. Wire a second Slack node to the Already Out output of Route Lending Outcome to get alerted on refused checkouts too.
- Drop the holderEmail condition from the Return Match rule if you want anyone to be able to return an item on a colleague's behalf.
- Receipts are plain text under the sender name Equipment Desk. Switch emailType to HTML in Email Receipt with Overdue List for a formatted version.

Notes: the form has no authentication and the email field is self-reported. Data Tables have no transactions, so two submissions for the same tag arriving at nearly the same moment can both clear the availability read. Nothing runs on a schedule, so overdue items surface only when that person submits the form again.

All sample data is fictional. No real credentials, IDs, or endpoints are included.

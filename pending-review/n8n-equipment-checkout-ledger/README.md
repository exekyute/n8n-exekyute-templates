# Track equipment checkouts and returns in Data Tables with Gmail receipts and Slack alerts

One form handles both equipment checkouts and returns, checks the Asset Registry before issuing anything, and emails a receipt when the action goes through. Availability rests on a single field: an asset is free to lend when its `holderEmail` is blank, so a checkout on gear someone else holds is rejected on the completion page with the current holder and due date named. Every receipt also lists whatever else that person still holds past due, which is the entire overdue chase here, since nothing runs on a schedule.

Built with n8n, plus Data Tables, Gmail, and Slack.

```
 Form: Checkout or Return, asset tag, email
   |
   v
 Log the attempt, then read the registry row
   |
   +-> Checkout, holder set:
   |     reject, name holder and due date
   +-> Checkout, holder blank:
   |     write holder and dueDate ---+
   +-> Return, holder matches:       |
   |     clear the holder -----------+
   +-> Return, holder differs:       |
         Slack alert, no write       v
                       Gmail receipt with overdue
```

## Use it when

- Someone signs out a laptop a colleague already has. The checkout is refused on the spot and the page names who holds it and when it is due, instead of a second row landing in a spreadsheet.
- A projector comes back and nobody writes it down. The return clears the holder off the registry row, so the next person to ask sees it as available.
- Three items are two weeks late and nobody wants to send the chase email. The next time those borrowers touch the form, their own overdue list arrives attached to the receipt.

## How it works

The form is the single entry point for both actions. Every submission is appended to Lending History before any check runs, so refused returns leave a trace too, then the registry row for the tag is read and one Switch resolves four outcomes from that single read. The two successful branches converge on an overdue query for the submitter and one Gmail receipt, and every branch ends on a form completion page so the browser never hangs.

| Stage | What happens |
|---|---|
| Equipment Lending Form and Workflow Configuration | Collect Action (Checkout or Return), Asset Tag, Your Email, and an optional Expected Return Date, then attach `slackChannelId` and `assetTeamEmail` |
| Log Attempt to History | Appends the raw submission to Lending History before any decision is made |
| Read Asset Registry Row | Gets the row matching `assetTag`, with Always Output Data on so an unknown tag still flows through as a first checkout |
| Route Lending Outcome | Four outputs: Already Out, Checkout OK, Return Match, Return Mismatch |
| Record Checkout in Registry and Clear Holder in Registry | Upsert `holderEmail`, `dueDate` and status `out` on a checkout; blank `holderEmail` and set status `available` on a verified return |
| Alert Return Mismatch in Slack | Posts the tag, who attempted it, and the recorded holder to the configured channel |
| Find Overdue Items for Person and Email Receipt with Overdue List | Pull rows where `holderEmail` is the submitter and `dueDate` is before today, then send the plain text receipt with that list appended |
| Show Already Out Rejection, Show Completion Confirmation, Show Mismatch Notice | End every branch on a completion page, with the two successful paths sharing one |

I log the attempt before the registry is read rather than after routing, because the rows worth having later are the refused returns and the rejected checkouts, and neither of those branches writes to the registry.

## Requirements

- Data Tables available, with an Asset Registry table (`assetTag`, `holderEmail`, `dueDate`, `status`) and a Lending History table (`assetTag`, `submittedAction`, `personEmail`, `expectedReturnDate`, `submittedAt`). Leave both names alone once created, since all five Data Table nodes resolve by name and not by ID.
- One registry row per asset tag, because every read and write matches on `assetTag` alone. Anything free to lend needs an empty `holderEmail`, `dueDate` values must be ISO dates, and borrowers have to return under the same address sitting in `holderEmail`, since the comparison ignores case but nothing else. The `status` column is written but never read by any condition.
- n8n (cloud or self-hosted) with Gmail and Slack credentials. Gmail has to be cleared to send to borrower addresses on outside domains, and the Slack app needs `chat:write` plus membership in the alert channel, since the node posts to a raw channel ID and never joins.

## Setup

1. Import `workflow.json` into n8n. It imports inactive; configure before activating.
2. Create both Data Tables and seed one Asset Registry row per asset with `holderEmail` left empty, then fill `slackChannelId` and `assetTeamEmail` in Workflow Configuration and assign the Gmail and Slack credentials.
3. Submit a test checkout and a test return against one seeded tag, confirm the registry row flips both ways, then activate.

## Known limits

- The form has no authentication and the email field is self-reported, so anyone with the URL can take gear out under any address.
- Data Tables have no transactions. Two submissions for the same tag arriving at nearly the same moment can both clear the availability read and double issue the asset.
- The checkout write is an upsert, so a mistyped tag quietly creates a new registry row, and a return for a tag with no row falls through to the mismatch alert rather than an error.
- Nothing runs on a schedule, so overdue items only surface when that person submits again. Clear Holder in Registry also leaves the old `dueDate` sitting on the row.
- One row per tag rules out quantities, reservations, and condition notes. Gmail and Slack both continue on error, so a failed send is neither retried nor reported.

## Customize

- The 7 day default is written in three places: the `dueDate` expression on Record Checkout in Registry, the Gmail body, and the form description. Change all three together.
- Find Overdue Items for Person flags `dueDate` before today. For a grace period, set that keyValue to something like `$today.minus({days:3}).toISO()`.
- Only the Return Mismatch branch reaches Slack. Wire a second Slack node to the Already Out output of Route Lending Outcome to get pinged on rejected checkouts too.
- Dropping the `holderEmail` condition from the Return Match rule lets anyone return an item on a colleague's behalf.
- Receipts are plain text under the sender name Equipment Desk in Email Receipt with Overdue List. Switch `emailType` to HTML for a formatted version.

## What is in this folder

| File | What it is |
|---|---|
| `README.md` | This overview |
| `TEMPLATE-DESCRIPTION.md` | The n8n Creator hub listing text |
| `workflow.json` | The importable n8n workflow |

---

All sample data is fictional. No real credentials, IDs, or endpoints are included.

Part of the [n8n-exekyute-templates](../../README.md) collection. MIT licensed.

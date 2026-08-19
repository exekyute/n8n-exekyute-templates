# Distribute policies and meeting minutes then collect acknowledgments with Gmail, Data Tables and Google Sheets

[Published n8n template](https://n8n.io/workflows/18263-track-policy-and-meeting-minutes-acknowledgments-with-gmail-and-google-sheets/)

Mails a policy or a set of minutes to an audience list, gives every recipient their own tokenized acknowledgment link, and reports who has not confirmed yet. Acknowledging takes two requests on purpose: the first click only serves a landing page, so a mail scanner that auto-visits links cannot acknowledge on someone's behalf, and only the explicit confirm writes a timestamp. One webhook path carries all three actions, distribute, ack and status, against a single Data Table ledger.

Built with n8n, plus Gmail, Google Sheets, and n8n Data Tables.

```
webhook, one path, three actions
   |
   +-- distribute (shared secret)
   |      fan out audience, sign one token each,
   |      write pending rows, mail personal links
   |
   +-- acknowledge (token vs ledger row)
   |      +-- bad token ---> rejected page (403)
   |      +-- first click -> landing page, no write
   |      +-- confirmed ---> stamp ledger row, then
   |                         mirror the ack to Sheets
   |
   +-- status (shared secret), the outstanding list
   |
   +-- anything else -> rejected page (403)
```

## Use it when

- A revised policy goes out to forty people and someone has to state, in writing, who has read it. Each person gets their own link and the answer sits in a ledger row instead of a mailbox.
- Meeting minutes need a seen-by record and nobody is buying an e-signature seat for it.
- Half the roster has confirmed and the rest need chasing. The status URL returns the outstanding people grouped by document, which is the chase list.

## How it works

One webhook takes GET and POST on the same path, a Set node holds every environment value, and the Switch matches the action and the shared secret in the same rules, so a wrong secret falls through to the 403 instead of reaching a branch. The audience array is split one item per person, which is what gives each recipient a separate token, ledger row and message. The ack branch is two requests by design: the landing page is rendered from a ledger lookup and writes nothing, and only the confirm callback stamps `acknowledgedAt` and appends to the Sheets log.

| Stage | What happens |
|---|---|
| Receive Tracker Request and Workflow Configuration | One path for GET and POST, then the Set node holding `PUBLIC_BASE_URL`, both secrets, and the log sheet id |
| Route and Authorize Request | Matches `action` and the shared secret together, into distribute, ack, status, or the rejected fallback |
| Fan Out Audience and Sign Recipient Token | One item per email address, each carrying an HMAC-SHA256 signature of docId plus that address |
| Record Ledger Row, Email Acknowledgment Link and Respond Distribution Summary | Writes a `pending` row to Policy Ack Ledger, mails that person their link, and returns the recipient count once |
| Look Up Ledger Row and Classify Ack Request | Fetches the row by docId and email, then splits into invalid, confirm, or landing |
| Respond Landing Page | Names the document and shows a confirm button. Nothing is written on this request |
| Record Acknowledgment, Mirror Ack To Sheets Log and Respond Confirmation Page | Stamps `acknowledgedAt`, appends to the Ack Log tab, and returns the receipt page |
| Fetch Ledger Rows, Build Chase Table Page and Respond Status Page | Reads the whole ledger and renders outstanding people grouped by document |
| Respond Rejected Request | The 403 page, for a bad secret, a bad token, or an unknown action |

I store the expected token on the ledger row and compare against that instead of recomputing the signature, because it makes a link revocable: delete the row and the link stops validating.

## Requirements

- n8n with Data Tables available. Four nodes read and write a `Policy Ack Ledger` table and there is no external database fallback.
- The instance reachable from the public internet at `PUBLIC_BASE_URL`, because recipients open their link from their own mail client.
- A Gmail account with headroom for the whole audience. One separate message per recipient, no batching and no BCC.
- n8n (cloud or self-hosted) with Gmail and Google Sheets credentials, plus a spreadsheet holding an `Ack Log` tab.

## Setup

1. Import `workflow.json` into n8n. It imports inactive; configure before activating.
2. Fill Workflow Configuration with `PUBLIC_BASE_URL`, `HMAC_SECRET`, `API_SHARED_SECRET` and `ACK_LOG_SHEET_ID`, then assign the Gmail and Google Sheets credentials.
3. Create the `Policy Ack Ledger` Data Table with docId, docTitle, docLink, recipientEmail, token, sentAt, ackStatus and acknowledgedAt, and an `Ack Log` sheet tab with docId, docTitle, recipientEmail, acknowledgedAt, ackStatus.
4. Activate, then POST one distribute call to yourself: `action`, `secret`, `docId`, `docTitle`, `docLink` and an `audience` array of plain email strings. Click your own link both ways before sending it to a roster.

## Known limits

- The link proves possession of a token, not identity, so a forwarded link can be confirmed by whoever holds it. This is an internal compliance record, not a legal e-signature.
- Nothing chases anyone: no schedule, no reminder, no due date field. Distribute is also not idempotent, so calling it twice writes a second set of pending rows and mails everyone again.
- Email Acknowledgment Link and Mirror Ack To Sheets Log both continue on error, so a bounce or a failed append surfaces nowhere, and the response counts recipients split out of the audience rather than mail delivered.
- Tokens carry no expiry and rows are never cleaned up, so a link keeps working until someone deletes that ledger row by hand.

## Customize

- Subject and body live in Email Acknowledgment Link. The two pages are inline HTML in Respond Landing Page (including the green `#1a7f37` confirm button) and Respond Confirmation Page, whose time reads `yyyy-MM-dd HH:mm`.
- Build Chase Table Page counts any row whose `ackStatus` is not `acknowledged` as outstanding. A docId condition on Fetch Ledger Rows scopes the page to one document.
- The Sheets append is a mirror, not the source of truth, so Mirror Ack To Sheets Log can be repointed, swapped for another destination, or removed.
- Extra ledger columns get filled in Record Ledger Row and printed in Build Chase Table Page. Changing `HMAC_SECRET` or the hashed value in Sign Recipient Token only affects links sent afterwards, since Classify Ack Request compares against the token already stored on the row.

## What is in this folder

| File | What it is |
|---|---|
| `README.md` | This overview |
| `TEMPLATE-DESCRIPTION.md` | The n8n Creator hub listing text |
| `workflow.json` | The importable n8n workflow |

---

All sample data is fictional. No real credentials, IDs, or endpoints are included.

Part of the [n8n-exekyute-templates](../../README.md) collection. MIT licensed.

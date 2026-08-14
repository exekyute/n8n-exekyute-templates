Distribution and acknowledgment tracking without an e-signature vendor. One webhook path drives three actions: send a document to an audience list, serve each person a tokenized acknowledgment link, and report exactly who has not acknowledged what. Every acknowledgment lands in a Data Table ledger and is mirrored to a Google Sheets log.

## Who is it for

Anyone who has to send a policy, a procedure, or a set of meeting minutes to a roster and then prove who read it: program coordinators, office managers, board secretaries, and small compliance teams that need a record rather than a signature.

## How it works

- POST the webhook with `action=distribute` plus the shared secret, `docId`, `docTitle`, `docLink`, and an `audience` array of email addresses. The workflow splits the audience one item per person, signs `token = HMAC-SHA256(docId + recipientEmail)`, writes a pending ledger row, and emails each person a link that is unique to them.
- The link opens `action=ack`. The first request only validates the token against the ledger row and serves a landing page. Nothing is recorded, which stops email link scanners from acknowledging on someone's behalf.
- The confirm button on that page calls back with `confirm=yes`. Only this second request stamps `acknowledgedAt` on the ledger row and appends the acknowledgment to the Sheets log.
- GET `action=status` with the shared secret returns an HTML chase table naming everyone still outstanding, grouped by document, with a completion count.
- Revoking a link takes one delete: remove the person's ledger row and their token stops validating.

## Requirements

- An n8n instance with Data Tables, reachable from the public internet, since recipients open their link from their own mail client.
- A Gmail account cleared to email the whole audience. One separate message goes out per recipient, with no batching and no BCC.
- A Google Sheets spreadsheet for the mirrored acknowledgment log.

## How to set up

1. In the Workflow Configuration node, fill in `PUBLIC_BASE_URL` (the instance base URL, for example `https://n8n.example.com`), `HMAC_SECRET`, `API_SHARED_SECRET`, and `ACK_LOG_SHEET_ID`.
2. Create a Data Table named `Policy Ack Ledger` with columns docId, docTitle, docLink, recipientEmail, token, sentAt, ackStatus, acknowledgedAt.
3. In the spreadsheet, create a tab named `Ack Log` with headers docId, docTitle, recipientEmail, acknowledgedAt, ackStatus.
4. Assign the Gmail and Google Sheets credentials, then activate.
5. Distribute a test document to your own address, click the link, confirm it, and load the status page before running it on a real roster.

## How to customize

- Subject and body wording live in Email Acknowledgment Link; the landing and confirmation pages are inline HTML in Respond Landing Page and Respond Confirmation Page.
- Add a docId condition to Fetch Ledger Rows to scope the status page to one document instead of the whole ledger.
- The Sheets append is a mirror, not the source of truth. Repoint it, swap it for another destination, or remove it.
- Extra ledger columns get filled in Record Ledger Row and printed in Build Chase Table Page.

## Known limits

The link proves possession of a token, not identity, so a forwarded link can be confirmed by whoever holds it. This is an internal compliance record, not a legal e-signature. Nothing chases anyone on a schedule, and distribute is not idempotent: calling it twice for the same docId writes a second set of pending rows and mails everyone again.

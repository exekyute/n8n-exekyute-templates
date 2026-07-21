Twilio reports what happened to every SMS you send, but only if something is listening. This workflow receives Twilio status callbacks, logs each event to a Google Sheet, and posts a Slack alert when a message fails, with the error code translated into a sentence so nobody has to look up what 30007 means.

## Who's it for

Anyone sending SMS through Twilio who wants a record of what landed and a fast signal when something did not: support notifications, ops alerts, or deliverability tracking.

## How it works

A Webhook node receives Twilio's form-encoded callback on every message state change. One Set node holds a static map of Twilio error codes to plain-English reasons. A second pulls MessageSid, To, MessageStatus, and ErrorCode from the payload and resolves the code against that map. Google Sheets appends the event as a ledger row, successes included. An IF node then checks the status, and only `failed` and `undelivered` continue to Slack. Both branches end at a Respond to Webhook node returning 200, so Twilio stops retrying.

## How to set up

1. Add your Google Sheets and Slack credentials to the two nodes that need them.
2. Create a sheet with columns `received_at`, `message_sid`, `to_number`, `message_status`, `error_code`, `failure_reason`, then select it in the Sheets node.
3. Choose the Slack channel for failure alerts.
4. Activate, copy the production webhook URL, and set it as the StatusCallback on your outbound messages or on your Messaging Service.

## Requirements

A Twilio account, a Google account for Sheets, and a Slack workspace. No Twilio credential is needed, because Twilio calls the webhook rather than n8n calling Twilio.

## Good to know

The webhook is open by default. Twilio signs every callback with an `X-Twilio-Signature` header, so validate it or restrict the path by IP before you trust the payload. Test it by POSTing mock form-encoded payloads instead of real messages: one delivered, one failed with ErrorCode 30008. That helps on a Twilio trial, which sends only to verified numbers and blocks custom bodies.

## How to customize

Add error codes by editing the single object in the map node. Swap Slack for email or PagerDuty. Widen the IF to catch other statuses, or add sheet columns for fields this build ignores.

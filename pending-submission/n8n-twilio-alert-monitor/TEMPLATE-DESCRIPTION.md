Twilio writes every failed send, rejected call, and broken webhook into its debugger, where it sits until someone looks. This workflow polls the Monitor Alerts API on a schedule, groups what it finds, and posts one digest to Slack. Quiet windows post nothing.

## Who's it for

Anyone running Twilio in production who does not want the debugger to be the only place failures show up: small teams without a monitoring stack, agencies watching client messaging, anyone whose webhooks are quietly returning 500s.

## How it works

A Schedule Trigger fires, a Set node builds an ISO-8601 lookback window, and an HTTP Request node calls the Monitor Alerts API with it. An IF node ends the run when nothing came back. A Code node flattens each alert into a row, then groups on error code plus log level with a count and one sample message. Google Sheets appends one row per alert. Slack gets one digest with the total, the severity split, and the top codes.

## How to set up

1. Import the workflow. It arrives inactive.
2. Create a Twilio credential (Account SID and Auth Token) and assign it to the HTTP Request node, which uses n8n's built-in Twilio credential type.
3. Assign your Google Sheets and Slack credentials, then pick the spreadsheet, tab, and channel.
4. Give the tab this header row: timestamp, error_code, log_level, resource_sid, request_url, alert_sid.
5. Set the schedule interval and match the lookback minutes in the Set node.
6. Run once by hand, then activate.

## Requirements

A Twilio Account SID and Auth Token, a Google account, and a Slack workspace the bot can post in.

## Good to know

This runs on a Twilio trial with no verified numbers: the Monitor Alerts API reads debugger events rather than sending. For test data, send an SMS to an unverified number: Twilio raises error 21608 and logs it. The Sheet keeps one row per alert while Slack gets one message per run. One webhook can fire the same error hundreds of times.

## How to customize

Change the lookback minutes and schedule together to resize the window. Add a LogLevel query parameter if you want errors only. Swap Slack for email or a webhook by replacing the last node; the digest text is built upstream.

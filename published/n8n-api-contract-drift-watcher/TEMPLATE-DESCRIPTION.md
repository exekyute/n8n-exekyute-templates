## What this workflow does

Polls a JSON or OpenAPI endpoint on a schedule, derives the shape of its response (every field path and its type), snapshots that shape in a Data Table, and posts a Slack alert only when the contract breaks. Ordinary value churn, a number that changed or an extra item in a list, is ignored. Only structural and type changes raise an alert, each tagged by severity and naming the exact field path.

## Who's it for

Backend and platform engineers who depend on a third party or internal API and want to know the moment its response shape changes, before it breaks something downstream.

## How it works

A Schedule Trigger fires on an interval. An HTTP Request fetches the endpoint, with retries and a safe skip on failure. A Code node derives the new schema, loads the prior snapshot from a Data Table, and runs a contract aware diff: removed field and type change are high, new required field and nullability flip are medium, a brand new optional field is low. Array indices collapse to a single marker, so values and list length never count as a change. The snapshot is refreshed and Slack fires only on a high or medium change, so the same drift is never reported twice.

## How to set up

Import the workflow. Create a Data Table with two text columns (endpointKey and schema_object) and select it in the two Data Table nodes. In Settings, set the endpoint URL, a stable label for it, and the Slack channel. Assign a Slack credential. Run once to seed the snapshot, then activate. The default points at a free no-key JSON endpoint so you can see it work first.

## Requirements

n8n with Data Tables and a Slack credential. No paid services and no AI are required. For a private API, add your token as an n8n credential on the HTTP Request node.

## How to customize

Change the schedule, watch several endpoints by giving each its own label and sharing one Data Table, or lower the gate to include low severity changes. For a production contract, add a plain-English summary with a small model, or send the alert to an on-call tool like Opsgenie or PagerDuty alongside Slack.

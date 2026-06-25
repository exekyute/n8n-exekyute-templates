Batch delivery orders into a Notion database, then on a schedule email an optimized route plan grouped by delivery day, with nearest-neighbor stop ordering and per-stop payment tags.

## Who's it for

Small delivery operations (lunch box services, home bakeries, meal prep rounds) that collect orders all week and plan the driving route by hand.

## How it works

A form saves each order to Notion. On a schedule (Friday 6pm by default), the workflow reads pending orders, geocodes addresses with OpenStreetMap Nominatim (free, no API key), sorts each day's stops by nearest-neighbor distance, and emails a route plan tagged [PAID] or [COLLECT ON DELIVERY] per stop.

## How to set up

1. Create a Notion database using the schema in the workflow's setup note (names are case-sensitive).
2. Connect a Notion integration to the database.
3. Add Notion API and SMTP credentials in n8n.
4. Paste your database ID into both Notion nodes.
5. Set From and To on Email Plan, copy the form URL, and activate.

## Requirements

- An n8n instance (cloud or self-hosted)
- A Notion workspace and internal integration
- Any SMTP account for sending the plan

## How to customize

- Change the schedule or Delivery Day options for non-weekend rounds.
- Swap Email Plan for a Telegram or Slack node to get the plan on your phone.
- Switch to a paid geocoder like Google or Mapbox for large volumes.

# Plan delivery routes from Notion orders and email the schedule

[Published n8n template](https://n8n.io/workflows/16154)

An n8n workflow that batches delivery orders into a Notion database, then on a schedule (Friday 6pm by default) emails a route plan grouped by delivery day, with nearest-neighbor stop ordering and per-stop payment tags.

Built for a friend running a weekend lunch box service who used to plan his routes by hand on Friday nights.

![Plan delivery routes from Notion orders and email the schedule workflow canvas](firefox_vrAv6brAt9.png)

## How it works

Two paths share a single Notion database as storage.

**Intake** runs every time someone submits the form. The form is a public URL you bookmark on your phone.

```
Order Intake Form  →  Save Order  →  Notion: Create Order
```

**Planning** runs automatically on a schedule (Friday 6pm by default), and on demand whenever you click Test Run.

```
Friday 6pm Plan / Test Run  →  Notion: Get Pending  →  Load Pending Orders
                            →  Geocode (Nominatim)  →  Optimize Routes & Format
                            →  Email Plan
```

The clever bits are in the Code nodes: the form data is shaped into a normalized order object, the Notion page is read back and flattened, addresses are geocoded through OpenStreetMap's Nominatim API (free, no API key), each day's stops are sorted by Haversine distance using a nearest-neighbor sweep, and the plan is rendered as markdown with `[PAID]` or `[COLLECT ON DELIVERY]` tagged on each stop.

## Setup

You need: an n8n instance, a Notion workspace, and any SMTP account for sending the plan email.

### 1. Notion

1. Create an integration at https://www.notion.so/profile/integrations. Pick Internal. Copy the integration secret.
2. Create a database with these exact property names and types:

   | Property | Type |
   |---|---|
   | Customer Name | Title |
   | Order ID | Text |
   | Phone | Phone |
   | Address | Text |
   | Items | Text |
   | Total | Number |
   | Day | Select (options: `Saturday`, `Sunday`) |
   | Paid | Checkbox |
   | Notes | Text |
   | Status | Select (options: `pending`, `done`) |
   | Received At | Date |

   Property names and the select option strings are case-sensitive.

3. Open the database, click the `...` menu, choose Connections, and connect your integration.
4. Copy the database ID from the URL: `notion.so/<workspace>/<32-character-id>?v=<view-id>`.

### 2. n8n credentials

1. Add a Notion API credential using the integration secret from step 1.
2. Add an SMTP credential (any provider works: Gmail with app password, Sendgrid, your own mail server).

### 3. Workflow

1. Import `workflow.json` into n8n.
2. Open both Notion nodes (Notion: Create Order and Notion: Get Pending), assign the Notion credential, paste the database ID into the Database field.
3. Open Email Plan, assign the SMTP credential, change `fromEmail` and `toEmail` to real addresses.
4. Open Order Intake Form, copy the Production URL. That is the link to bookmark on your phone.
5. Activate the workflow.

## Day-to-day use

**Take an order.** Open the bookmarked form URL on your phone. Fill in the order. Submit. The order appears as a new row in the Notion database with `Status = pending`.

**See what is queued.** Open the Notion database. Filter by `Status = pending` to see this weekend's batch.

**Run the plan.** Friday at 6pm the workflow fires automatically and an email lands in your inbox. To run it any other time, open n8n, click Test Run, click Execute workflow.

**Mark an order done.** After delivering, change the row's `Status` from `pending` to `done` in Notion. The planner only loads pending rows so done orders stay as history without showing up on future plans.

**The route email.** Each stop is listed with customer name, phone, address, items, total, payment tag (`[PAID]` or `[COLLECT ON DELIVERY]`), and any notes. Saturday and Sunday sections include a totals line with revenue and amount to collect on the road.

## What is in the repo

- `workflow.json`: the importable n8n workflow. This is the source of truth.
- `TEMPLATE-DESCRIPTION.md`: the dashboard description used for the n8n template listing.
- `save-order.js`: readable copy of the Code node body that shapes a form submission into a normalized order object.
- `load-pending.js`: readable copy of the Code node body that flattens Notion's page response into plain order objects and keeps only pending ones.
- `optimize-routes.js`: readable copy of the Code node body that runs the route optimization and renders the markdown plan.

## Tweaks you might want

A few simple extensions that have come up:

- **HTML email**: switch Email Plan's Email Format to HTML and wrap the markdown in a `<pre>` block with `white-space: pre-wrap` for serviceable formatting without a markdown-to-HTML library.
- **Telegram delivery**: drop a Telegram node after Optimize Routes & Format and post `{{ $json.markdown }}` to a private chat. Useful if you want the plan on your phone without checking email.
- **Customer notifications**: a Twilio SMS node sending each customer "your order is stop N on Saturday's route" right after the plan generates.
- **Repeat customer flag**: in Save Order, query Notion before creating the page and add a `Returning customer` checkbox if the same phone number has prior orders.
- **Weekly summary**: a Code node after Optimize Routes that computes revenue this week, top customer, busiest neighborhood, and includes it in the email.

## Constraints

- The Nominatim geocoder rate limits at 1 request per second. The workflow batches at 1.1 seconds per address. For 20 orders the planning chain takes about 22 seconds. For 200 orders this approach starts feeling slow and you would want to switch to a paid geocoder (Google, Mapbox, or self-hosted Nominatim).
- Notion's API has rate limits too but nothing this workflow will hit in normal use.
- The Email Plan node sends plain text. If you want formatting, see the HTML email tweak above.

## License

MIT. See `LICENSE`.

Built by Kevin Yu ([exekyute](https://github.com/exekyute)).

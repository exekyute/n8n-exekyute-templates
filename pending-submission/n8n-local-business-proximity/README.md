# Find nearby businesses by proximity using OpenStreetMap and save to Google Sheets

Submit a location and a business category, and this pulls every matching business nearby from OpenStreetMap and appends the results to a Google Sheet, flagged by whether each one lists a website. I built it to get a quick local business list without paying for a places API.

Built with n8n, plus OpenStreetMap (Nominatim and Overpass) and Google Sheets.

![The local business proximity workflow on the n8n canvas](images/workflow.png)

## How it works

Form -> Settings -> Geocode -> IF -> Build Overpass query -> Find businesses -> Normalize -> Append to Sheets.

| Stage | What happens |
|---|---|
| Form trigger | You submit a location, a business category, a search radius, and a result cap. |
| Geocode | Nominatim turns the location into coordinates with one request. |
| Build query | A Code node maps the category to the right OpenStreetMap tags and writes an Overpass query. |
| Find businesses | One Overpass API call returns every matching business in the radius, tags included. |
| Normalize and save | Each result is flattened into a row, flagged `website_on_file` yes or no, and appended to Google Sheets. |

The whole search costs exactly one Nominatim call and one Overpass call, no matter how many businesses come back, so a run stays well inside OpenStreetMap's free usage policy.

## Setup

1. Import the workflow JSON into n8n. It imports inactive; configure before activating.
2. Connect a Google Sheets credential and pick a destination sheet on "Append to results sheet".
3. Open **Settings** and put a real contact address in the `userAgent` value. OpenStreetMap's usage policy requires an identifiable User-Agent on every request.
4. Run it once with a small radius to check the output, then activate.

## The category map

"Build Overpass query" maps the form's category dropdown to an OpenStreetMap tag:

| Business category | OpenStreetMap tag |
|---|---|
| Restaurants | `amenity=restaurant` |
| Cafes & coffee shops | `amenity=cafe` |
| Bars & pubs | `amenity~bar\|pub` |
| Hair & beauty salons | `shop~hairdresser\|beauty` |
| Gyms & fitness | `leisure=fitness_centre` |
| Auto repair shops | `shop=car_repair` |
| Dentists | `amenity=dentist` |
| Florists | `shop=florist` |
| Real estate agents | `office=estate_agent` |
| Retail shops (any) | `shop` |

Add a category by adding a line to the `tagMap` object in that node, using any OpenStreetMap tag.

## Requirements

- n8n.
- A Google Sheets OAuth2 credential for the append step.
- No paid API key. OpenStreetMap's Nominatim and Overpass services are free and public.

## What is in this folder

| File | What it is |
|---|---|
| `README.md` | This overview |
| `TEMPLATE-DESCRIPTION.md` | The n8n Creator hub listing text |
| `workflow.json` | The importable n8n workflow |

---

All sample data is fictional. No real credentials, IDs, or endpoints are included.

Part of the [n8n-exekyute-templates](../../README.md) collection. MIT licensed.

## Who's it for

Anyone who wants a quick list of businesses near a place: local market research, building an area directory, scouting a neighborhood before opening a location, or checking which businesses in a category still lack a website. Submit a location and a category, and get a Google Sheet of results back with no places API and no API key.

## How it works

A form collects a location, a business category, a search radius, and a result cap. Nominatim geocodes the location to coordinates in one request. A Code node maps the chosen category to the matching OpenStreetMap tags and builds an Overpass query, which returns every matching business in the radius, with name, address, phone, hours, and website where OpenStreetMap has them. Each result is normalized into a row and appended to a Google Sheet, flagged `website_on_file` yes or no. If the location cannot be geocoded, the run stops cleanly instead of querying with bad coordinates.

## How to set up

Import the workflow. Connect a Google Sheets credential and pick a destination sheet on the append node. Open the Settings node and put a real, identifiable contact address in the `userAgent` value, since OpenStreetMap's usage policy requires it. Open the form trigger's production URL to run a search.

## Requirements

n8n and a Google Sheets OAuth2 credential. No paid API key. OpenStreetMap's Nominatim and Overpass services are free and public.

## Good to know

The workflow makes exactly one Nominatim call and one Overpass call per run, regardless of how many businesses come back, which keeps it well inside OpenStreetMap's free usage policy (roughly one request per second, with an honest User-Agent). A missing website tag means OpenStreetMap has no record of one, not proof that no website exists.

## How to customize the workflow

Add a business category by adding a line to the tag map in the Overpass query node. Add or drop columns in the normalize step, or change the radius options on the form.

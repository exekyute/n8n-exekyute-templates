Keep your channel's video tags consistent by normalizing them against a controlled vocabulary you maintain in Google Sheets. The workflow only rewrites the videos whose tags actually change, so it is safe to run again and again.

## Who's it for

Channel owners and video managers who want tidy, consistent tags across a whole library: one spelling per concept, no banned terms, and a set of baseline tags on every video. If you have ever had "js", "JS", and "javascript" all living on different uploads, this cleans that up on a schedule you control.

## How it works

- A manual trigger starts the run.
- Google Sheets loads your vocabulary: alias-to-canonical rules, banned tags, and required baseline tags.
- The YouTube nodes list your channel's videos and read each video's current tags, title, and category.
- A Code node lowercases and trims each tag, maps aliases to their canonical form, drops banned tags, removes duplicates, adds any missing required tags, and truncates to YouTube's tag-character budget.
- An IF node compares the new tag set with the current one and passes only the videos that changed.
- YouTube writes the normalized tags back to those videos, preserving each video's existing title and category.

## How to set up

- Connect a YouTube (Google) OAuth2 credential on the three YouTube nodes.
- Connect a Google Sheets credential and select the spreadsheet and tab that hold your vocabulary.
- Set your channel ID in the List Channel Videos node.
- Fill the vocabulary sheet with three columns: rule_type, tag, and canonical.

## Requirements

- A YouTube (Google) account with OAuth2 access to the channel you want to manage.
- A Google Sheets account and a spreadsheet with your vocabulary rows.

## Good to know

- The workflow is idempotent: once tags are normalized, a re-run writes nothing.
- It only calls the YouTube update endpoint for videos that changed, which keeps API quota use low.
- Tag comparison is order-insensitive, so re-ordering alone never triggers a write.

## How to customize the workflow

Swap the manual trigger for a Schedule Trigger to run on a cadence. Raise the row limit in List Channel Videos to cover a larger library. All of the tag logic lives in the sheet, so you change aliases, banned terms, and required tags by editing rows, not the workflow.

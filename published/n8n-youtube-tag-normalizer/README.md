# Normalize YouTube video tags to a controlled vocabulary

[Published n8n template](https://n8n.io/workflows/17071-normalize-youtube-video-tags-using-google-sheets-vocabulary-rules/)

Normalize a channel's video tags against a controlled vocabulary you maintain in Google
Sheets, and write back only the videos whose tag set actually changed.
The vocabulary holds three kinds of rows: aliases that map a variant to its canonical tag
(`js` to `javascript`), banned tags to strip, and required baseline tags every video
should carry. The comparison is an order-insensitive set check, so a re-run after a clean
pass writes nothing.

Built with n8n, plus YouTube and Google Sheets.

![The YouTube tag normalizer workflow on the n8n canvas, running from a manual trigger through Google Sheets and YouTube read nodes into a normalizing Code node, an IF check, and a YouTube update.](images/workflow.png)

## Use it when

- `js`, `JS`, and `javascript` all live on different uploads, and you want one spelling
  per concept across the whole library.
- A term you no longer want, an old campaign tag or something spammy, is still stuck on
  dozens of videos, and stripping it by hand means opening every one.
- Every upload should carry a baseline set of tags, and some slipped out the door
  without them.

## How it works

A manual trigger starts the run. Google Sheets loads the vocabulary rows, the YouTube
nodes list the channel's videos and read each one's current tags, title, and category,
and a Code node rebuilds every tag set from the rules. An IF node then compares the
result to the current tags as a set and passes only the videos that changed.

| Stage | What happens |
|---|---|
| Run Workflow Manually | Starts the run on demand |
| Load Vocabulary from Sheets | Reads the alias, banned, and required rows from your spreadsheet |
| List Channel Videos | Lists up to 50 videos from the channel, newest first |
| Get Video Details | Reads each video's current tags, title, and category |
| Normalize Tags to Vocabulary | Applies the rules in order: lowercase and trim, map aliases to canonical, drop banned tags, remove duplicates, add missing required tags, truncate to YouTube's 500-character tag budget |
| If Tags Changed | Passes only the videos whose new tag set differs from the current one |
| Update Video Tags | Writes the normalized tags back, sending the existing title and category unchanged, which the YouTube update endpoint requires |

I compare tag sets order-insensitively because reordering alone is not a change worth an
API write; skipping unchanged videos makes the workflow idempotent and keeps quota use low.

## Requirements

- A YouTube (Google) account with OAuth2 access to the channel you want to manage.
- A Google spreadsheet holding the vocabulary rows.
- n8n (cloud or self-hosted) with YouTube OAuth2 and Google Sheets credentials.

## Setup

1. Import `workflow.json` into n8n. It imports inactive; configure before activating.
2. Connect a YouTube (Google) OAuth2 credential on "List Channel Videos", "Get Video
   Details", and "Update Video Tags". The template ships without one.
3. Connect a Google Sheets credential on "Load Vocabulary from Sheets" and pick the
   spreadsheet and tab that hold your vocabulary.
4. In "List Channel Videos", replace `YOUR_CHANNEL_ID` with your channel ID.
5. Run it manually and check the updated videos. To run on a cadence, swap the manual
   trigger for a Schedule Trigger.

## The vocabulary sheet

Three columns: `rule_type`, `tag`, `canonical`. Only alias rows use the third column.

| rule_type | tag | canonical |
|---|---|---|
| alias | js | javascript |
| alias | ai | artificial intelligence |
| banned | clickbait | |
| required | tutorial | |

The rows are hand-maintained and the transform is pure set operations on them, so the
same sheet always produces the same tags. Multi-word tags work. A tag cannot contain a
comma, since tags reach YouTube as one comma-separated list.

## Customize

- **Cadence.** Swap "Run Workflow Manually" for a Schedule Trigger.
- **Library size.** Raise the 50-row limit in "List Channel Videos" for a larger channel.
- **The rules.** Aliases, banned terms, and required tags all live in the sheet. Edit
  rows, not nodes.
- **Tag budget.** `MAX_TAG_CHARS` is 500 in "Normalize Tags to Vocabulary"; lower it
  there if you want headroom under YouTube's limit.

## What is in this folder

| File | What it is |
|---|---|
| `README.md` | This overview |
| `TEMPLATE-DESCRIPTION.md` | The n8n Creator hub listing text |
| `workflow.json` | The importable n8n workflow |
| `images/workflow.png` | The workflow on the n8n canvas |

---

All sample data is fictional. No real credentials, IDs, or endpoints are included.

Part of the [n8n-exekyute-templates](../../README.md) collection. MIT licensed.

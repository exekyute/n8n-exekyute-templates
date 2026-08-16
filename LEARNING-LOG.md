# Learning log

Dated entries from building these templates. Each one is anchored to where the collection stood when it was written, so its numbers stay true instead of going stale.

[HOW-I-BUILD.md](HOW-I-BUILD.md) describes the method as it stands now. This is how it got there.

## 2026-08-15, at 54 published

Fifty-four workflow templates are live in the n8n library, added to this repo between June 25 and August 10, 2026, with four more in review. What follows is what changed in how they get built over that stretch, and what is still wrong.

### Most of these are not AI workflows

Thirteen templates sit under the AI heading in the index. Five of the fifty-four make a language model call inside the workflow. The rest of that area calls a hosted service that runs a model behind its own API: Gladia for speech to text, ElevenLabs for audio, a research endpoint for sourced answers.

What carries the work is a Code node holding a rules table. There are 103 of them across the 54 workflows, close to two per template, against seven chat-model nodes. That was not the plan going in. It is what came of asking each time whether the job needed judgment and finding that it usually did not: date arithmetic, dedup keys, threshold checks, and format validation all have right answers a table can state and a reader can audit.

The heading is doing too much work as a result. "AI" reads as reasoning and mostly means an API call.

### The canvas is what gets reviewed

Twice, review feedback came back about the canvas and not the logic: sticky text clipped by a box too small to hold it, and section stickies sitting too close together on the current editor version. Both were fixed by moving rectangles. Both would have shipped again without a rule.

The rule that came out of it is that no sticky box touches another, every gutter is at least 50px, and every box is sized for its rendered text with room to spare. The canvases now carry about one sticky note per two working nodes, 299 against 568, and all 54 have exactly one yellow overview sticky.

Where it has not held: 13 stickies across six templates still use colors outside the yellow, grey, and red palette. Four of those six were built in the first four days.

### Small and scheduled is the shape that ships

The median published template is 10 working nodes. The smallest is 4, the largest 23. Twenty-nine of the 54 run on a schedule, 10 open with a form, 5 with a webhook.

None of that was a target. Bigger builds got cut down during testing, because the parts that failed were the parts doing several things at once, and what survived was usually one trigger, one decision, and one place the workflow writes to.

### Families beat one-offs

Templates arrived in service families: five Gladia, five YouTube, six Twilio-backed, four Notion, four Asana, three ElevenLabs, two Discord. The second build in a family costs a fraction of the first. Credentials are connected, test data exists, the API's failure modes are already known, and the README skeleton carries across.

The review queue does not batch the same way. Submissions go out four at a time, so a family of six leaves two waiting while the first four clear.

### Most of the work is not building

Of 110 commits, 33 added a template or a document. The other 77 maintained what was already there: 28 moved folders between buckets as their status changed, 21 were README passes, 9 re-synced a template to its live build, 3 fixed canvas layout.

Eleven changed nothing but the layout of the Published index. It was a flat table, then a table under a Mermaid mindmap, then a mindmap with emoji and rounded nodes, then collapsible category groups, then a flat two-column grid, then one table per area, then those tables at full width. The mindmap came out because past roughly 15 leaves it overlapped and truncated its own labels, and by then it had 32.

That lesson was cheap and I paid full price for it. Test a layout at three times the current count before committing to it. The count only moves one way.

### The scrubbed copy and the live copy drift

Every workflow.json here has its credential IDs stripped and its document, channel, and instance IDs replaced. The copy running on the instance does not. The two can never be the same file, so an edit made in the editor has to be carried across by hand, and nine commits exist to do exactly that.

One gotcha earned its place in the checklist: re-picking a Google Sheet in the editor refreshes the column schema from the new sheet and leaves the column values empty. A workflow in that state appends blank rows to the wrong document, and the canvas looks correct the whole time.

### What changes from here

- Sync a folder at submission time instead of weeks later. All nine sync commits were drift that had already happened.
- Split the AI heading into work a model does inside the workflow and work a hosted service does, so five templates stop hiding behind thirteen.
- Script the bucket move. Twenty-eight commits hand-edited an index table to record a status change, which is a spreadsheet operation wearing a git commit.
- Bring the ten READMEs over 90 lines back into the 45 to 90 band.
- Give the extras a named place. Fifty of 54 folders hold exactly a README, a workflow JSON, a listing description, and a screenshot. The four that do not are carrying things worth having: a verification harness, the exact prompt sent to the model, synthetic test rows, a companion error workflow. The standard has no slot for any of it, so it sits there unannounced.
- Normalize `n8n-media-monitor`. It predates the standard and is still shaped like a standalone Node package, with `src/`, `tests/`, `examples/`, its own `package.json` and its own `LICENSE`. It is also the one published folder without `images/workflow.png`.
- Repaint the six canvases still off the sticky palette.

One change is already underway. Of the 40 templates added before July 27, one used a Data Table for state. Of the 14 added since, seven do. A Sheet is still the right answer when a person needs to read the data. A Data Table is the right answer when only the workflow does.

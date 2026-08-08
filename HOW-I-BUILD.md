# How these templates get built

Every template in this repo comes out of the same working method. Pick one operational pain, build the smallest workflow that closes it, and make every decision the workflow takes inspectable after the fact. Writing the method down once, from first design question to published listing, keeps the individual READMEs about their own subject. The habits below are defaults, not a checklist; where a template breaks one on purpose, its README says so.

## Rules before models

The first design question is whether the job needs judgment or just rules. Most of the time it is rules. So the default is deterministic: a rule table or a marked config block a reader can see. [SMS Task Capture](published/n8n-sms-task-capture/) reads due dates out of text messages with a six-pattern rule table instead of a model, "so the same wording always produces the same date and the rules are there to read instead of guess at." The same input always gives the same answer, and when it is wrong you find out why by reading, not by prompting.

A model earns its slot only when the task really is judgment: drafting prose or classifying intent. Then two conditions attach. The model is grounded: it answers from retrieved sources or live authorities, not its own memory. And it is gated: when the sources fall short, it fails closed.

In the [KB Inquiry Assistant](published/n8n-kb-inquiry-assistant/), a weak retrieval means the draft model is never called, a draft the sources cannot support comes back as NEEDS_HUMAN, and everything that survives still waits as a Gmail draft for a person to approve. The README states the position plainly: "I will take a blocked draft over a confident wrong answer in a customer's inbox."

Cost control belongs to the same decision. Filters and classifiers run in front of the model, so the paid call only happens for records that earned it.

## Scope restraint

A workflow that feeds a risky action stops short of taking it. The [SMS Pumping Screener](published/n8n-sms-pumping-screener/) decides which numbers a campaign may text and never sends a message itself. The [Gapless Number Issuer](published/n8n-gapless-number-issuer/) moves a counter forward and nothing else; accounting for a voided document stays a human job. And where the [Litigation Limitation Calculator](published/n8n-litigation-limitation-calculator/) cannot anchor a limitation date safely, it refuses to book one and logs a review note naming the correct anchor, because "a date that overstates the time remaining is worse than none."

I draw the line the same way each time: the workflow does the reading, the sorting, and the arithmetic, and the action with a blast radius stays with a person.

## Design defaults

Six habits recur across the repo. Not every template needs all six, but each build starts from them and drops one only with a reason.

| Default | In practice |
|---|---|
| Rules a reader can inspect | Behavior lives in a rules table or a marked config block, so a change is a table row instead of a code edit |
| A written trace per record | Records touched get a dated audit row in a Sheet or Data Table |
| Quarantine over silent drops | A held-back record lands in its own lane carrying a written reason from a closed set |
| Idempotent re-runs | A ledger or an upsert key means running twice on the same day creates nothing twice |
| Fail stop over guessing | Unknown input stops the run with a named error or takes a review lane, never a fabricated value |
| A deliberate noise level | Alerts stay quiet unless something broke, or post an intentional heartbeat, chosen per template and stated in its README |

Each default names the failure it exists to block. The screener writes safe and quarantined numbers to separate tabs rather than one tab with a status column, because "a status column only protects a send until somebody forgets to filter on it." The [CSV Folder Reconciler](published/n8n-csv-folder-reconciler/) takes the opposite side of the noise default on purpose: its recap posts even on a clean run, "so a silent channel means the workflow did not run."

## Failure paths

Each node gets told what to do when it fails, instead of falling back to the platform default. Flaky I/O gets retries. A lookup that can fail on any single record is set to capture the failure instead of raising it, so a bad phone number becomes a quarantine row with a reason rather than a dead run. Errors worth seeing take their own path to a log row or an alert.

Where a wrong answer is worse than no answer, the failure is loud: the deadline engine stops with a named error on an unknown jurisdiction, and it never guesses a period. And where the data allows it, the workflow polices its own arithmetic. The reconciler's recap carries the invariant "rows in equals merged plus quarantined plus duplicates," so a drifting total shows up in Slack before anyone goes looking for it.

## Testing before activation

Nothing goes live on faith. Every workflow imports inactive and gets a watched first run before it is trusted: seeded data where the trigger allows it, a live test request where the flow's public URL only exists after activation. The screener documents a five-row test matrix with the expected verdict for each row, and every Twilio template carries a walkthrough for exercising the whole flow on a free trial, because a test path that costs money does not get run.

When the math is the product, the test is a committed harness. The litigation calculator ships a verification folder holding the same code its Code node runs, with nine cases and 32 assertions covering anniversary rolls, leap years, procedural counting, and reminder roll-back, including a case kept as the regression test for a real bug. The last run reads 32 passed, 0 failed, and the file saying so is in the repo.

The same discipline applies to the docs: every number a README claims is checked against workflow.json before it ships. The doc describes the artifact, not the intention.

## The canvas as documentation

An n8n canvas is the first thing the next person reads, so I treat it as a document. Nodes carry names that say what they do, which nearly always means renaming them from the defaults. Sticky notes carry the structure: a yellow overview, grey notes over the sections, and red warnings on the sharp edges; a few early canvases predate the palette and still show other colors. The README's stage table uses the on-canvas node names as its row labels, so the doc and the canvas never describe two different workflows.

## What the README owes the reader

Structure is fixed across templates: Use it when, How it works, Requirements, Setup, Customize, and the folder inventory. Inside that structure, every README owes the reader four things.

- A stage table matching the canvas node for node.
- One rationale sentence naming the rejected alternative and the failure that ruled it out.
- Trade-offs stated in both directions. Tightening the [Backup Freshness Auditor](published/n8n-backup-freshness-auditor/)'s thresholds "catches trouble sooner at the price of flagging normal variance," and the [Sheet Metrics Exporter](published/n8n-sheet-metrics-exporter/) recommends polling every 60 seconds rather than 15 because "15s is 5,760 executions a day."
- Stated limits. The auditor admits its checks stop at metadata, so only a test restore would catch a corrupt backup. The number issuer says its counter is a best-effort sequence, not a lock. A README with no caveat in it did not look hard enough.

## Shipping and lifecycle

Nothing reaches the repo unscrubbed. Credential ids are stripped or swapped for REPLACE_WITH placeholders, sample data is fictional, and no real document, channel, or instance ID survives. When a folder is later synced from the live instance, the acceptance test is the diff itself: it must touch zero lines holding credentials, document IDs, or sheet schema, or the sync does not ship.

The three buckets mirror the n8n Creator hub lifecycle: pending-submission, then pending-review once submitted, then published once the listing is live. A folder moves only when its real status changes. Each published folder links its live listing from the top of its README, and TEMPLATE-DESCRIPTION.md stays frozen as the submitted listing text while README.md remains the living document.

Every template ends at the same place: a stranger can import it, read every rule it applies, trace every record it touched, and know exactly what it will not do on their behalf.

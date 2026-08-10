New hires owe a different stack of forms depending on their role, and somebody has to notice who is short what. This workflow reads a role based requirement matrix and a people roster from n8n Data Tables, lists each person's Google Drive intake folder, and emails only the documents actually missing with blank copies attached. Overdue people roll up into one Slack message per run.

## Who's it for

Anyone chasing onboarding paperwork by hand: HR and ops coordinators, small teams bringing on contractors or volunteers, anyone whose current process is opening Drive folders every Monday to see what still has not arrived.

## How it works

A Schedule Trigger fires at 08:00 and a Set node holds the templates folder ID, the Slack channel ID, and the reply-to address. The blank form folder is listed once, then two Data Table reads pull the requirement matrix and every roster row not yet marked complete. A loop takes one person per pass: their intake folder is listed, and a Code node with Luxon matches filenames against the slugs their role requires, dates each gap from start_date plus the due offset, and picks a tier of gentle, firm, overdue or complete. An IF sends real chases down the email branch, where each matching blank form downloads on its own and a Code node folds them into one item for a single Gmail send. The roster row is updated either way. After the loop, one Slack post lists everyone whose tier came out overdue.

## How to set up

1. Import the workflow. It arrives inactive.
2. Assign Google Drive, Gmail, and Slack credentials.
3. Fill the Set node with the blank templates folder ID, the escalation channel ID, and the reply-to address.
4. Fill the Paperwork Requirement Matrix table: role, doc_slug, doc_label, due_offset_days. A negative offset is due before day one.
5. Fill the Paperwork Chase Roster table: name, email, role, start_date, drive_folder_id. Leave last_chased, docs_complete, chase_stage, and missing_now empty.
6. Give every doc_slug one blank form in the templates folder with the slug in its file name.
7. Run once by hand, check who got an email, then activate.

## Requirements

A Google account with Drive and Gmail, a Slack workspace with the app already in the escalation channel, and Data Tables enabled with both tables in the same project as the workflow.

## Good to know

A document counts as received when a file in the intake folder has the slug anywhere in its name, lowercased and extension ignored. Nothing opens the file, so an empty or unsigned upload passes and a short slug can match an unrelated name. Keep intake folders flat, since the listing reads direct children only. The last_chased date suppresses repeat emails inside each tier's cooldown, and completion is one way: once docs_complete is true that row is skipped on every later run.

## How to customize

Change the trigger hour, or run more than once a day: the cooldown compares calendar days, so it holds. The tier thresholds and the cooldown values sit near the top of the reconcile Code node, and the three subject and body blocks at the bottom of it carry the wording. Drop the overdue filter in the escalation Code node to make the Slack roll up cover everyone still outstanding.

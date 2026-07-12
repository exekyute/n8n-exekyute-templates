Every weekday morning, this workflow reads one Asana project and posts a status digest to Slack: what is overdue, due today, due this week, unassigned, and completed since yesterday, plus how much open work each person is carrying. There is no AI in the delivery path, so the numbers are exact and repeatable.

## Who's it for

A team lead, project manager, or delivery owner who runs one Asana project and wants a single Slack post each morning instead of opening Asana to check status. It answers "what is slipping and who is loaded" before standup.

## How it works

A weekday schedule fires in your timezone. An HTTP Request reads the project's tasks from the Asana REST API with an `opt_fields` list that guarantees due dates, assignees, and completion come back. A Code node classifies each open task into overdue, due today, due this week, or unassigned, collects tasks completed in the last day, and tallies open load per assignee. A second Code node formats a Block Kit message, and Slack posts it to your channel. A final node keeps the built digest so every run is inspectable.

## How to set up

Import the workflow. Add an Asana Personal Access Token credential and a Slack credential. In the config node, set the project GID, the Slack channel, and your timezone. Set the run days and hour on the schedule, run it once to check the message, then activate.

## Requirements

n8n, an Asana account with a Personal Access Token, and a Slack account with permission to post to the target channel. No paid services and no AI are required.

## Good to know

The digest counts only open tasks for load and due buckets, and reads tasks completed within the last day for the completed list. One Asana call runs per morning, so it stays well within free rate limits.

## How to customize

Change the schedule or the completed-task lookback window, adjust how many task links each section shows, or add an optional one-line summary from a cheap model such as Groq. The summary sits above the buckets and never changes the counts.

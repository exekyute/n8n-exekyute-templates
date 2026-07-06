## What this workflow does

Answers a natural-language legal question using only authorities pulled live from a real legal database, with a verified citation behind every point. If the retrieved sources do not support an answer, it says so instead of inventing case law. It is built for lawyers, articling students, and legal researchers who want a fast first pass on case law without the risk of AI-invented citations.

## How it works

You submit a question through a form and pick a source. CourtListener runs a full-text search across US case law, then fetches the full opinion text of the top hit so the answer grounds on the holding rather than the case caption. CanLII pulls a specific Canadian authority plus the cases in its citator network. Both paths converge into one numbered source block, and a Groq chat model answers from that block only, returning a structured answer, a supported flag, and a citation list. A code node then checks every citation against the sources that were actually retrieved and rebuilds each displayed citation from the source record, so a citation the model invents is dropped. The result page shows the answer, a supported or not-supported badge, the verified citations, and a disclaimer.

## Setup

Import the workflow, add a CourtListener Header Auth token, add a CanLII Query Auth key for CanLII mode, and connect a Groq credential. Set result count, language, and citator direction in the configuration node, then submit a question from the form.

## Requirements

n8n with the LangChain nodes. A CourtListener token, a CanLII API key for CanLII mode, and a Groq credential.

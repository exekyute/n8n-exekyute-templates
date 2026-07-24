# Answer legal questions with grounded citations from CanLII and CourtListener

[Published n8n template](https://n8n.io/workflows/16814-answer-legal-questions-with-groq-using-canlii-and-courtlistener/)

> Research assistance only. This is not legal advice and does not create a lawyer-client relationship. Read and verify every cited source before relying on it.

Ask a legal question through a form and get an answer built only from authorities pulled live from CourtListener or CanLII, with a verified citation behind every point. The model answers from one numbered block of retrieved sources, and a deterministic code step checks every citation against that block before anything reaches the reader. When the sources do not support an answer, the workflow says so instead of inventing case law.

Built with n8n, plus CourtListener, CanLII, and Groq.

![The legal research assistant workflow on the n8n canvas, running from a form trigger through CourtListener and CanLII retrieval branches into a grounded Groq answer and a citation verification step.](images/workflow.png)

## Use it when

- You want a fast first pass on case law, and a plain chat model cannot be trusted with it because it will invent citations that look real.
- A US question needs the holding, not the caption. The CourtListener path pulls the full opinion text of the top hit so the answer grounds on what the court actually wrote.
- You already have a Canadian authority and need what surrounds it. The CanLII path pulls that case plus the cases in its citator network.

## How it works

Submit a question through the form and pick a source. CourtListener runs a full-text search across US case law, then fetches the full opinion text of the top hit. CanLII pulls a specific Canadian authority plus the cases in its citator network. Both paths converge into one numbered source block, the model answers from that block only, and a code step checks every citation before anything reaches the reader.

| Stage | What happens |
|---|---|
| Submit a legal question | A form collects the legal question and the source database |
| Route by source database | Sends the run down the CourtListener or the CanLII branch |
| Search CourtListener case law, Fetch CourtListener opinion text | Full-text search across US case law, then the full opinion text of the top hit |
| Fetch CanLII case metadata, Fetch CanLII citator cases | A specific Canadian authority plus the cases in its citator network |
| Build grounding context | Both branches converge into one numbered source block, with opinion text windowed to the passage that matches the question |
| Answer grounded in retrieved sources | A Groq chat model answers from the numbered sources only and returns a structured answer, a supported flag, and a citation list |
| Verify citations and render result | Every citation is checked against the retrieved set, unmatched ones are dropped, and the answer is marked not supported when none survive |
| Return result | Shows the answer, a supported or not-supported badge, the verified citations, and the disclaimer |

I rebuild each displayed citation from the retrieved source record instead of the model output, because that is the only arrangement where a citation the model invents physically cannot reach the reader.

## Requirements

- A CourtListener API token, from your CourtListener profile.
- A CanLII API key, requested through the CanLII feedback form, for CanLII mode.
- n8n (cloud or self-hosted) with the LangChain nodes and a Groq credential.

## Setup

1. Import `workflow.json` into n8n. It imports inactive; configure before activating.
2. Add your CourtListener token as an HTTP Header Auth credential (`Authorization` = `Token YOUR_TOKEN`) and select it on "Search CourtListener case law" and "Fetch CourtListener opinion text".
3. For CanLII mode, add your CanLII API key as an HTTP Query Auth credential (`api_key` = `YOUR_KEY`) and select it on both CanLII nodes. That mode also needs the form's database ID and case ID fields filled in, for example `csc-scc` and `2024scc1`.
4. Add a Groq credential and select it on the two model nodes.
5. Open "Set research configuration" to set result count, language, and citator direction.
6. Open the form trigger to copy the form URL, then submit a question. For example: "What is the standard for granting a preliminary injunction in federal court?"

## The configuration node

| Field | What it controls |
|---|---|
| `resultCount` | How many retrieved sources are sent to the model |
| `canliiLanguage` | `en` or `fr` for the CanLII case lookup |
| `citatorDirection` | `citingCases` or `citedCases` for CanLII mode |
| `maxSnippetChars` | Fallback excerpt length for results without full text |
| `disclaimer` | The disclaimer line shown on every result |

## The citation guardrail

The anti-hallucination behaviour runs in two layers. Prompt grounding first: the model is told to answer only from the numbered sources, cite each point by source number, never output a citation absent from the source list, and set `supported: false` when the sources are insufficient, with a structured output parser and auto-fix holding the response to a fixed shape. Then deterministic verification: "Verify citations and render result" checks every citation the model returns against the sources that were actually retrieved, rebuilds each displayed citation from the source record, and drops any that do not match. When none survive, the answer is replaced with an explicit "not supported" message and no case law is asserted.

![An example answer showing a grounded response with a supported badge and a verified citation.](images/result.png)

*Asking "What is the standard for granting a preliminary injunction in federal court?" in CourtListener mode returns a grounded answer with a verified citation.*

## Customize

- Swap the Groq model node for any supported chat provider.
- Adjust `resultCount` to widen or narrow the sources sent to the model, and `citatorDirection` between `citingCases` and `citedCases` for CanLII mode.
- Add a Slack or email step after "Verify citations and render result" to route the answer somewhere.

## What is in this folder

| File | What it is |
|---|---|
| `README.md` | This overview |
| `TEMPLATE-DESCRIPTION.md` | The n8n Creator hub listing text |
| `workflow.json` | The importable n8n workflow |
| `images/workflow.png` | The workflow on the n8n canvas |
| `images/result.png` | An example answer with a verified citation |

---

All sample data is fictional. No real credentials, IDs, or endpoints are included.

Part of the [n8n-exekyute-templates](../../README.md) collection. MIT licensed.

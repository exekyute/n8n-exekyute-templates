Turn inbound support email into sourced, ready-to-review replies grounded in your own Notion knowledge base with retrieval-augmented generation (RAG). Cohere reranking and a two-step grounding check keep it from guessing, and a person approves every answer in Gmail before it goes out, so the model never sends on its own.

## Who's it for

Support and operations teams who keep their answers in Notion and want fast, accurate first drafts without auto-sending anything to customers.

## How it works

- Ingestion runs from a manual trigger: it reads published Notion articles, chunks each one, embeds the chunks with Cohere, and stores the vectors in the built-in Simple Vector Store.
- A Groq classifier triages each new email and drops noise and already-resolved threads, so only real questions continue.
- Real questions retrieve candidate chunks, a Cohere reranker reorders them by relevance, and a confidence gate stops weak matches before any model call.
- Groq drafts a reply from the retrieved sources only. Answers not found in the knowledge base are held back for a human.
- The reply is saved as a Gmail draft with a sources list, ready for a person to review and send.

## How to set up

Connect Notion, Groq, Cohere, and Gmail. Point the article reader at your knowledge base database, set the Gmail trigger search query, and run ingestion once to build the vector store before you activate the workflow.

## Requirements

- Notion account with an internal integration and a knowledge base database (Status, Title, Category, Last Updated properties)
- Groq API key
- Cohere API key
- Gmail account connected over OAuth2

## Good to know

The Simple Vector Store is in-memory: it runs on a single instance and clears on restart, so re-run ingestion after a restart. Groq and Cohere free tiers cover light volume. For larger or multi-tenant knowledge bases, swap in Qdrant, Pinecone, or Weaviate for persistence and metadata filtering.

## How to customize the workflow

Swap the Groq model, tune topK and the reranker topN, adjust minRelevance in the Normalize Email node to set how strict the confidence gate is, or edit the classifier categories to match your inbox.

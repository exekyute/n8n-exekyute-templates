POST to a webhook and get back the next number in a named sequence, formatted with your prefix and zero padding. Ask for `invoice` and you get `INV-000042`. Ask again and you get `INV-000043`.

## Who's it for

Anyone generating documents from a workflow that need consecutive human-readable references: invoices, quotes, purchase orders, support tickets, job numbers. Timestamps and record IDs do not satisfy an accountant, and a UUID does not read like a document number to anybody.

## How it works

A POST webhook accepts a `sequence_key` plus an optional prefix and zero-pad width. A Code node validates the request against character allowlists and falls back to safe defaults, so a malformed call still returns a usable number instead of an error the caller has to handle. The counter for that key is read from an n8n Data Table, incremented, and written back with an upsert, then the formatted number is returned along with the raw value and a timestamp. A key that has never been used starts at 1 without any setup. Because the counter is shared storage rather than workflow state, several workflows can draw from the same sequence without each keeping its own count.

## How to set up

Create a Data Table named `number_sequences` with the columns `sequence_key`, `current_value`, `prefix` and `updated_at`, and confirm it is selected on both Data Table nodes. Set the workflow to a single concurrent execution. Activate, then POST `{"sequence_key": "invoice"}` to the production URL.

## Requirements

n8n with Data Tables available. No third-party accounts, API keys or credentials of any kind.

## Good to know

Gapless here means consecutive with no holes, which is the property audit rules usually care about. It does not mean atomic. Data Tables offer no compare-and-swap, so the read and the write are separate steps and two genuinely simultaneous requests can read the same value. Setting the workflow to one concurrent execution closes that for every realistic caller; if several workflows call it, put a queue in front rather than firing in parallel.

## How to customize the workflow

Change the default pad width in Read Sequence Request. Add a new sequence by simply asking for a new key, which creates its row on first use. Turn on Header Auth to keep the issuer private, or set `current_value` on a row by hand to continue an existing run of numbers instead of starting from 1.

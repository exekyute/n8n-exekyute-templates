// Deadline engine core logic.
//
// This is the exact date math used by the workflow's "Deadline engine (Luxon)"
// Code node, extracted here so it can be unit-checked with Node + Luxon outside
// n8n. Inside n8n, DateTime is a Luxon global; here we import it. The functions
// below are otherwise identical to the node body, so a green run here is evidence
// the node computes the same results.

import { DateTime } from 'luxon';

// A day is non-working if it is Saturday/Sunday or appears in the holiday list.
export function isNonWorkingDay(dt, holidays) {
  if (dt.weekday === 6 || dt.weekday === 7) return true;
  return holidays.includes(dt.toISODate());
}

// Roll a date forward to the next working day (used for filing deadlines, so a
// deadline never lands on a day the registry is closed).
export function rollForward(dt, holidays) {
  let d = dt;
  while (isNonWorkingDay(d, holidays)) d = d.plus({ days: 1 });
  return d;
}

// Roll a date backward to the previous working day (used for reminders, so an
// alert is never pushed to a day after the thing it warns about).
export function rollBackward(dt, holidays) {
  let d = dt;
  while (isNonWorkingDay(d, holidays)) d = d.minus({ days: 1 });
  return d;
}

// Build the reminder dates for one deadline, dropping any already in the past.
export function buildReminders(deadlineDt, offsets, rollBack, holidays, now) {
  const out = [];
  for (const offset of offsets) {
    let r = deadlineDt.minus({ days: offset });
    if (rollBack) r = rollBackward(r, holidays);
    if (r.startOf('day') < now.startOf('day')) continue; // skip past reminders
    out.push({ label: `${offset}d`, date: r.toISODate() });
  }
  return out;
}

// Compute every deadline for one matter. Returns an array of deadline objects.
// Throws a clear, named error when the jurisdiction or claim type is not in the
// rules table, rather than guessing a period.
export function computeDeadlines(input, rules, now) {
  const {
    matterName, clientName, jurisdiction, claimType,
    triggerEventType, triggerEventDate, serviceDate,
    responsibleEmail, notes,
  } = input;

  const {
    limitationRules, proceduralRules, holidays,
    reminderOffsets, rollDeadlinesToBusinessDay, rollRemindersBackToBusinessDay,
    timezone,
  } = rules;

  const DISCLAIMER =
    'Scheduling aid only, not legal advice. Verify against the current statute and rules of court.';

  // Trigger anchors a limitation period may validly be measured from. Every rule in
  // the table is discovery-basis, and the discovery clock runs from when the claim was
  // or ought to have been discovered. The date of loss/act is a safe proxy because it
  // is on or before discovery (an earlier, more conservative deadline). A service or
  // filing date falls AFTER discovery, so a limitation measured from it would overstate
  // the time remaining; those anchors drive procedural deadlines, not the limitation.
  const LIMITATION_ANCHORS = ['Date of discovery', 'Date of loss / act or omission'];

  // Highest year the holiday list covers, so a deadline landing past it can be flagged
  // (weekends are still rolled algorithmically; only listed holidays are not).
  const maxHolidayYear = holidays.reduce((max, d) => {
    const y = Number(String(d).slice(0, 4));
    return Number.isFinite(y) && y > max ? y : max;
  }, 0);

  // Validate jurisdiction.
  const jur = limitationRules[jurisdiction];
  if (!jur) {
    throw new Error(
      `No limitation rules found for jurisdiction "${jurisdiction}". ` +
      `Add it to the rules table. Available: ${Object.keys(limitationRules).join(', ')}.`
    );
  }
  // Validate claim type (no silent fallback to a wrong period).
  const rule = jur[claimType];
  if (!rule) {
    throw new Error(
      `No limitation rule for claim type "${claimType}" in ${jurisdiction}. ` +
      `Add it to the rules table. Available: ${Object.keys(jur).join(', ')}.`
    );
  }

  const trigger = DateTime.fromISO(triggerEventDate, { zone: timezone });
  if (!trigger.isValid) {
    throw new Error(`Trigger event date "${triggerEventDate}" is not a valid date.`);
  }

  const results = [];

  // Shared record shape. Dated deadlines fill in the date fields; note rows leave them
  // null and carry a warning instead, so nothing silently disappears.
  const makeRecord = (deadlineType, deadlineName, basis, fromDateLabel, citation) => ({
    matterName, clientName, jurisdiction, claimType,
    deadlineType, deadlineName,
    ruleCitation: citation,
    basis,
    fromDateLabel,
    computedDateRaw: null,
    computedDate: null,
    rolled: false,
    daysUntil: null,
    reminders: [],
    warning: '',
    responsibleEmail: responsibleEmail || '',
    notes: notes || '',
    disclaimer: DISCLAIMER,
  });

  // A dated deadline: roll off non-working days, build reminders, flag holiday gaps.
  const pushDeadline = (deadlineType, deadlineName, rawDt, basis, fromDateLabel, citation) => {
    const adjusted = rollDeadlinesToBusinessDay ? rollForward(rawDt, holidays) : rawDt;
    const rec = makeRecord(deadlineType, deadlineName, basis, fromDateLabel, citation);
    rec.computedDateRaw = rawDt.toISODate();
    rec.computedDate = adjusted.toISODate();
    rec.rolled = adjusted.toISODate() !== rawDt.toISODate();
    rec.daysUntil = Math.round(adjusted.startOf('day').diff(now.startOf('day'), 'days').days);
    rec.reminders = buildReminders(adjusted, reminderOffsets, rollRemindersBackToBusinessDay, holidays, now);
    if (rollDeadlinesToBusinessDay && adjusted.year > maxHolidayYear) {
      rec.warning =
        `Holiday roll covers through ${maxHolidayYear}; the ${adjusted.year} date was rolled off ` +
        `weekends only. Extend the holiday list to cover ${adjusted.year} for full accuracy.`;
    }
    results.push(rec);
  };

  // A note row: no calendar date, carries a warning for the log and the summary.
  const pushNote = (deadlineType, deadlineName, warning) => {
    const rec = makeRecord(deadlineType, deadlineName, '', `Trigger event (${triggerEventType})`, '');
    rec.warning = warning;
    results.push(rec);
  };

  // Basic limitation period (anniversary convention: same calendar date N years on),
  // but only from an anchor the limitation can validly run from. From a service or
  // filing anchor we do not guess a date; we emit a review note instead of a number
  // that would overstate the time remaining.
  if (LIMITATION_ANCHORS.includes(triggerEventType)) {
    pushDeadline(
      'Limitation',
      `${rule.years}-year limitation period`,
      trigger.plus({ years: rule.years }),
      rule.basis,
      `Trigger event (${triggerEventType})`,
      rule.citation,
    );
  } else {
    pushNote(
      'Limitation (review needed)',
      'Limitation not calculated from this trigger type',
      `Limitation not calculated: a "${triggerEventType}" date falls after discovery, so a limitation ` +
      `period measured from it would overstate the time remaining. If the action is not yet commenced, ` +
      `re-run using "Date of discovery" (or "Date of loss / act or omission" as a conservative fallback).`,
    );
  }

  // Ultimate limitation period: only meaningful when the trigger is the act/omission,
  // because the ultimate period runs from the act, not from discovery or service.
  if (rule.ultimateYears && triggerEventType === 'Date of loss / act or omission') {
    pushDeadline(
      'Ultimate limitation',
      `${rule.ultimateYears}-year ultimate limitation period`,
      trigger.plus({ years: rule.ultimateYears }),
      'Act or omission',
      `Trigger event (${triggerEventType})`,
      rule.citation,
    );
  }

  // Procedural deadlines, only when a claim-issued/served date is provided.
  if (serviceDate) {
    const served = DateTime.fromISO(serviceDate, { zone: timezone });
    if (!served.isValid) {
      throw new Error(`Date claim issued/served "${serviceDate}" is not a valid date.`);
    }
    const procRules = proceduralRules[jurisdiction] || [];
    if (procRules.length === 0) {
      pushNote(
        'Procedural (none configured)',
        'No procedural rule configured for this jurisdiction',
        `A claim issued/served date was provided but no procedural rule is configured for ${jurisdiction}. ` +
        `Verify any defence or response deadline manually, or add a rule to proceduralRules.`,
      );
    } else {
      for (const p of procRules) {
        pushDeadline(
          'Procedural',
          p.name,
          served.plus({ days: p.days }),
          `${p.days} days from ${p.fromEvent}`,
          `Claim issued/served`,
          p.citation,
        );
      }
    }
  }

  return results;
}

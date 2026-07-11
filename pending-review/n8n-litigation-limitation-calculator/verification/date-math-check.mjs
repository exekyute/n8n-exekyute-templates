// Date-math verification harness for the deadline engine.
// Run: node verification/date-math-check.mjs
//
// Exercises the same logic the workflow's Code node runs, against hand-computed
// expected dates. Exits non-zero if any assertion fails.

import { DateTime } from 'luxon';
import { computeDeadlines, rollForward, rollBackward } from './engine-core.mjs';

let pass = 0;
let fail = 0;
const lines = [];

function check(name, got, want) {
  const ok = JSON.stringify(got) === JSON.stringify(want);
  if (ok) { pass++; lines.push(`PASS  ${name}  =>  ${JSON.stringify(got)}`); }
  else { fail++; lines.push(`FAIL  ${name}  got ${JSON.stringify(got)}  want ${JSON.stringify(want)}`); }
}

function throws(name, fn, fragment) {
  try { fn(); fail++; lines.push(`FAIL  ${name}  expected throw, none`); }
  catch (e) {
    const ok = e.message.includes(fragment);
    if (ok) { pass++; lines.push(`PASS  ${name}  =>  threw "${fragment}"`); }
    else { fail++; lines.push(`FAIL  ${name}  threw "${e.message}" missing "${fragment}"`); }
  }
}

const TZ = 'America/Toronto';

// Representative rules (a subset mirroring the workflow's Set node).
const rules = {
  limitationRules: {
    Ontario: {
      'General civil': { years: 2, ultimateYears: 15, basis: 'discovery',
        citation: 'Limitations Act, 2002, S.O. 2002, c. 24, Sch. B, ss. 4, 15' },
      'Defamation (libel/slander)': { years: 2, ultimateYears: 15, basis: 'discovery',
        citation: 'Limitations Act, 2002, s. 4; Libel and Slander Act notice rules apply' },
    },
    'British Columbia': {
      'General civil': { years: 2, ultimateYears: 15, basis: 'discovery',
        citation: 'Limitation Act, SBC 2012, c. 13, ss. 6, 21' },
    },
  },
  proceduralRules: {
    Ontario: [
      { name: 'Statement of defence due (served in Ontario)', fromEvent: 'service', days: 20,
        citation: 'Rules of Civil Procedure, r. 18.01' },
      { name: 'Reply due', fromEvent: 'service', days: 30,
        citation: 'Rules of Civil Procedure, r. 25.04' },
    ],
  },
  holidays: [
    '2026-01-01', '2026-02-16', '2026-04-03', '2026-05-18', '2026-07-01',
    '2026-08-03', '2026-09-07', '2026-10-12', '2026-11-11', '2026-12-25', '2026-12-28',
  ],
  reminderOffsets: [90, 30, 7],
  rollDeadlinesToBusinessDay: true,
  rollRemindersBackToBusinessDay: true,
  timezone: TZ,
};

// ---- Case 1: anniversary convention + weekend roll-forward ----
// 2024-06-20 + 2 years = 2026-06-20, which is a Saturday, so the filing
// deadline rolls forward to Monday 2026-06-22.
const c1 = computeDeadlines({
  matterName: 'Test 1', jurisdiction: 'Ontario', claimType: 'General civil',
  triggerEventType: 'Date of discovery', triggerEventDate: '2024-06-20',
}, rules, DateTime.fromISO('2026-01-01', { zone: TZ }));
const lim1 = c1.find(d => d.deadlineType === 'Limitation');
check('1a raw anniversary date', lim1.computedDateRaw, '2026-06-20');
check('1b raw date is a Saturday', DateTime.fromISO('2026-06-20').weekday, 6);
check('1c rolled forward to Monday', lim1.computedDate, '2026-06-22');
check('1d rolled flag set', lim1.rolled, true);
// Trigger is discovery, so the ultimate period must NOT be emitted.
check('1e ultimate suppressed for discovery trigger',
  c1.some(d => d.deadlineType === 'Ultimate limitation'), false);

// ---- Case 2: leap-year handling ----
// 2024-02-29 + 2 years has no Feb 29 in 2026; Luxon caps to 2026-02-28.
const c2 = computeDeadlines({
  matterName: 'Test 2', jurisdiction: 'Ontario', claimType: 'General civil',
  triggerEventType: 'Date of loss / act or omission', triggerEventDate: '2024-02-29',
}, rules, DateTime.fromISO('2026-01-01', { zone: TZ }));
const lim2 = c2.find(d => d.deadlineType === 'Limitation');
check('2a leap-year basic raw caps to Feb 28', lim2.computedDateRaw, '2026-02-28');
// Trigger IS the act/omission, so the ultimate period IS emitted (15 years).
check('2b ultimate emitted for act trigger',
  c2.some(d => d.deadlineType === 'Ultimate limitation'), true);
const ult2 = c2.find(d => d.deadlineType === 'Ultimate limitation');
check('2c ultimate raw is 2039-02-28 (15y from 2024-02-29, capped)',
  ult2.computedDateRaw, '2039-02-28');

// ---- Case 3: procedural day count + weekend roll ----
// Served Monday 2026-06-22, defence due 20 days later = Sunday 2026-07-12,
// rolls forward to Monday 2026-07-13.
const c3 = computeDeadlines({
  matterName: 'Test 3', jurisdiction: 'Ontario', claimType: 'General civil',
  triggerEventType: 'Date of service of claim', triggerEventDate: '2026-06-22',
  serviceDate: '2026-06-22',
}, rules, DateTime.fromISO('2026-06-01', { zone: TZ }));
const defence = c3.find(d => d.deadlineName.startsWith('Statement of defence'));
check('3a defence raw = served + 20 days', defence.computedDateRaw, '2026-07-12');
check('3b raw is a Sunday', DateTime.fromISO('2026-07-12').weekday, 7);
check('3c defence rolled to Monday', defence.computedDate, '2026-07-13');
// The trigger type here is a service date, which falls after discovery, so the basic
// limitation must NOT be measured from it; a dateless review note stands in instead.
check('3d limitation suppressed for a service-date anchor',
  c3.some(d => d.deadlineType === 'Limitation'), false);
check('3e review note emitted with no calendar date',
  c3.some(d => d.deadlineType === 'Limitation (review needed)' && d.computedDate === null), true);

// ---- Case 4: reminder roll-back + past-reminder drop ----
// Deadline 2026-06-22; offsets 90/30/7. As of 2026-01-01 all are future.
// 30 days before = 2026-05-23 (Saturday) rolls BACK to Friday 2026-05-22.
const remTest = computeDeadlines({
  matterName: 'Test 4', jurisdiction: 'Ontario', claimType: 'General civil',
  triggerEventType: 'Date of discovery', triggerEventDate: '2024-06-20',
}, rules, DateTime.fromISO('2026-01-01', { zone: TZ }));
const rem = remTest.find(d => d.deadlineType === 'Limitation').reminders;
check('4a three reminders kept (all future)', rem.length, 3);
check('4b 90d reminder', rem.find(r => r.label === '90d').date, '2026-03-24');
check('4c 30d reminder rolled back to Friday', rem.find(r => r.label === '30d').date, '2026-05-22');
check('4d 7d reminder', rem.find(r => r.label === '7d').date, '2026-06-15');

// Past-reminder drop: as of 2026-06-10 only the 7d reminder remains.
const remLate = computeDeadlines({
  matterName: 'Test 4b', jurisdiction: 'Ontario', claimType: 'General civil',
  triggerEventType: 'Date of discovery', triggerEventDate: '2024-06-20',
}, rules, DateTime.fromISO('2026-06-10', { zone: TZ }));
const remL = remLate.find(d => d.deadlineType === 'Limitation').reminders;
check('4e past reminders dropped, only 7d kept', remL.map(r => r.label), ['7d']);

// ---- Case 5: validation throws (no silent wrong answer) ----
throws('5a unknown jurisdiction throws', () => computeDeadlines({
  matterName: 'x', jurisdiction: 'Atlantis', claimType: 'General civil',
  triggerEventType: 'Date of discovery', triggerEventDate: '2024-06-20',
}, rules, DateTime.now()), 'No limitation rules found for jurisdiction');

throws('5b unknown claim type throws', () => computeDeadlines({
  matterName: 'x', jurisdiction: 'Ontario', claimType: 'Maritime salvage',
  triggerEventType: 'Date of discovery', triggerEventDate: '2024-06-20',
}, rules, DateTime.now()), 'No limitation rule for claim type');

throws('5c invalid trigger date throws', () => computeDeadlines({
  matterName: 'x', jurisdiction: 'Ontario', claimType: 'General civil',
  triggerEventType: 'Date of discovery', triggerEventDate: 'not-a-date',
}, rules, DateTime.now()), 'not a valid date');

// ---- Case 6: roll helpers in isolation ----
check('6a rollForward off Saturday lands Monday',
  rollForward(DateTime.fromISO('2026-06-20'), rules.holidays).toISODate(), '2026-06-22');
check('6b rollForward off Canada Day (Wed holiday) lands Thursday',
  rollForward(DateTime.fromISO('2026-07-01'), rules.holidays).toISODate(), '2026-07-02');
check('6c rollBackward off Saturday lands Friday',
  rollBackward(DateTime.fromISO('2026-05-23'), rules.holidays).toISODate(), '2026-05-22');

// ---- Case 7: filing-date anchor emits a review note, never a limitation date ----
// A filing date is after discovery, so no limitation is measured from it. With no
// service date supplied the only output is the dateless review note. This is the fix
// for the anti-conservative anchor bug: the tool refuses to overstate the time left.
const c7 = computeDeadlines({
  matterName: 'Test 7', jurisdiction: 'Ontario', claimType: 'General civil',
  triggerEventType: 'Filing date', triggerEventDate: '2026-06-01',
}, rules, DateTime.fromISO('2026-01-01', { zone: TZ }));
check('7a no limitation date from a filing anchor',
  c7.some(d => d.deadlineType === 'Limitation'), false);
const note7 = c7.find(d => d.deadlineType === 'Limitation (review needed)');
check('7b review note present with a null date', note7 ? note7.computedDate : 'missing', null);
check('7c review note tells the user which anchor to use',
  /Date of discovery/.test(note7 ? note7.warning : ''), true);
check('7d every row is dateless (nothing lands on a calendar)',
  c7.every(d => d.computedDate === null), true);

// ---- Case 8: a deadline beyond the holiday list is flagged, not silently unrolled ----
// The test holiday list ends 2026; a 2-year period from 2026 lands in 2028, so the row
// carries a holiday-coverage warning (weekend rolling still applies).
const c8 = computeDeadlines({
  matterName: 'Test 8', jurisdiction: 'Ontario', claimType: 'General civil',
  triggerEventType: 'Date of discovery', triggerEventDate: '2026-06-20',
}, rules, DateTime.fromISO('2026-01-01', { zone: TZ }));
const lim8 = c8.find(d => d.deadlineType === 'Limitation');
check('8a basic period lands in 2028', lim8.computedDateRaw.slice(0, 4), '2028');
check('8b holiday-coverage warning is set',
  /Holiday roll covers through 2026/.test(lim8.warning), true);

// ---- Case 9: a served date with no procedural rule for the jurisdiction is flagged ----
// British Columbia has a limitation rule but no procedural rule in the table. A served
// date must not silently produce nothing; it produces a "verify manually" note.
const c9 = computeDeadlines({
  matterName: 'Test 9', jurisdiction: 'British Columbia', claimType: 'General civil',
  triggerEventType: 'Date of discovery', triggerEventDate: '2024-06-20',
  serviceDate: '2026-06-22',
}, rules, DateTime.fromISO('2026-01-01', { zone: TZ }));
check('9a limitation still computed for a valid discovery anchor',
  c9.some(d => d.deadlineType === 'Limitation'), true);
check('9b missing procedural rule is flagged, not silent',
  c9.some(d => d.deadlineType === 'Procedural (none configured)' && d.computedDate === null), true);

// ---- Report ----
const header = `Date-math verification  (Luxon ${DateTime.now().toFormat('yyyy-LL-dd')})\n` +
  `Node ${process.version}\n` + '='.repeat(60);
console.log(header);
console.log(lines.join('\n'));
console.log('='.repeat(60));
console.log(`${pass} passed, ${fail} failed`);
process.exit(fail === 0 ? 0 : 1);

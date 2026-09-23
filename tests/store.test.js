/* store.js against a stub db.js: checks the public API the rest of the app uses. */
global.window = {};
let fails = [];
const check = (l, c, d='') => { console.log((c?'  ok   ':'  FAIL ')+l+(c?'':' '+JSON.stringify(d))); if(!c) fails.push(l); };

let saved = null, durable = true;
global.window.GP = {};
global.GP = global.window.GP;
GP.db = {
  open: async () => ({ mode: 'sqlite-idb', snapshot: saved, problem: '' }),
  save: (snap) => { saved = JSON.parse(JSON.stringify(snap)); },
  flush: async () => {},
  wipe: async () => { saved = null; },
  durable: () => durable,
  mode: () => 'sqlite-idb',
  usingSqlite: () => true,
  exportBytes: () => new Uint8Array([1,2,3]),
  importBytes: async () => saved,
  query: () => ({columns:[],values:[]}),
  tables: () => [],
};
require('../assets/js/store.js');
const ST = GP.store;

(async () => {
  await ST.open();
  check('defaults applied', ST.get('exam') === 'cse' && ST.get('theme') === 'light' && ST.get('targetDate') === '2027-02-07');
  check('settings written on first open', saved && saved.settings.exam === 'cse');

  ST.set('exam', 'da');
  check('setting persists to db', saved.settings.exam === 'da');

  const marks = ST.toggleChapter('os-sched', 'v');
  check('tick stored', marks.v === true && ST.chapterMarks('os-sched').v === true);
  check('tick reached the db', saved.chapters['os-sched'].v === true, saved.chapters);
  ST.toggleChapter('os-sched', 'v');
  check('untick works', ST.chapterMarks('os-sched').v === false);
  check('unknown chapter is blank', ST.chapterMarks('nope').r === false);

  check('study day logged by ticking', Object.keys(saved.days).length === 1);
  check('streak is 1 today', ST.streak() === 1);

  const mkAttempt = (id, ts, items) => ({ id, ts, exam: 'da', kind: 'quiz', label: 'Set',
    count: items.length, minutes: 4, scored: 1, max: 2, correct: 1, wrong: 1, skipped: 0,
    accuracy: 50, items });

  ST.addAttempt(mkAttempt('a1', 1000, [
    { qid: 'q1', subj: 'ml', ch: 'ml-a', marks: 1, ok: false, skipped: false, gained: -0.33, response: 0 },
    { qid: 'q2', subj: 'ml', ch: 'ml-a', marks: 1, ok: true,  skipped: false, gained: 1, response: 1 },
    { qid: 'q3', subj: 'ml', ch: 'ml-a', marks: 1, ok: false, skipped: true,  gained: 0, response: null },
  ]));
  check('attempt recorded', ST.attempts().length === 1 && saved.attempts.length === 1);
  check('wrong list ignores blanks', JSON.stringify(ST.wrongIds()) === '["q1"]', ST.wrongIds());

  ST.addAttempt(mkAttempt('a2', 2000, [
    { qid: 'q1', subj: 'ml', ch: 'ml-a', marks: 1, ok: true, skipped: false, gained: 1, response: 1 },
  ]));
  check('answering right clears it', ST.wrongIds().length === 0, ST.wrongIds());
  check('newest attempt first', ST.attempts()[0].id === 'a2');

  ST.addAttempt(mkAttempt('a3', 3000, [
    { qid: 'q4', subj: 'ai', ch: 'ai-a', marks: 2, ok: false, skipped: false, gained: 0, response: [0] },
  ]));
  ST.hideFromRevision('q4');
  check('dismissed question drops off', ST.wrongIds().length === 0, ST.wrongIds());
  ST.addAttempt(mkAttempt('a4', Date.now() + 1000, [
    { qid: 'q4', subj: 'ai', ch: 'ai-a', marks: 2, ok: false, skipped: false, gained: 0, response: [1] },
  ]));
  check('wrong again brings it back', JSON.stringify(ST.wrongIds()) === '["q4"]', ST.wrongIds());

  check('bookmark toggles on', ST.toggleBookmark('q2') === true && ST.isBookmarked('q2'));
  check('bookmark reaches db', saved.bookmarks.q2 === true);
  check('bookmark toggles off', ST.toggleBookmark('q2') === false && ST.bookmarkIds().length === 0);

  const dump = ST.exportJSON();
  const parsed = JSON.parse(dump);
  check('export names its format', parsed.format === 'gate-prep-board/2');
  check('export carries attempts and ticks', parsed.attempts.length === 4 && 'os-sched' in parsed.chapters);

  await ST.reset();
  check('reset clears memory', ST.attempts().length === 0 && ST.wrongIds().length === 0 && ST.get('exam') === 'cse');

  ST.importJSON(dump);
  check('import restores', ST.attempts().length === 4 && ST.get('exam') === 'da');
  check('import restores the hidden list', JSON.stringify(ST.wrongIds()) === '["q4"]', ST.wrongIds());

  // an old v1 file, with its flat shape and wrong/right maps
  ST.importJSON(JSON.stringify({ exam: 'cse', theme: 'dark', targetDate: '2026-02-01',
    chapters: { 'cn-ip': { v: true, b: true, p: true, r: true } },
    days: { '2026-01-01': { q: 5, min: 20 } }, attempts: [], bookmarks: { z9: true },
    wrong: { q7: 2 }, right: {} }));
  check('older export still loads', ST.get('theme') === 'dark' && ST.chapterMarks('cn-ip').r === true
    && ST.bookmarkIds()[0] === 'z9');
  check('rubbish is rejected', (() => { try { ST.importJSON('{"nope":1}'); return false; } catch (e) { return true; } })());

  durable = false;
  check('persistent() follows the db layer', ST.persistent() === false);

  console.log();
  console.log(fails.length ? 'FAILED: ' + fails.join(', ') : 'store checks passed');
  process.exit(fails.length ? 1 : 0);
})();

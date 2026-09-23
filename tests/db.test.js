/* Runs the real db.js, with sql.js faked on top of node:sqlite and IndexedDB
 * faked with a Map. Proves the snapshot survives a round trip through the
 * actual tables, and that the mode logic picks the right tier. */
const { DatabaseSync } = require('node:sqlite');
let fails = [];
const check = (l, c, d='') => { console.log((c?'  ok   ':'  FAIL ')+l+(c?'':' '+JSON.stringify(d))); if(!c) fails.push(l); };

/* ---- fake sql.js over node:sqlite ---- */
function FakeDatabase(bytes) {
  this._db = new DatabaseSync(':memory:');
  this._rows = bytes ? JSON.parse(Buffer.from(bytes).toString('utf8')) : null;
}
FakeDatabase.prototype.run = function (sql, params) {
  if (params) this._db.prepare(sql).run(...params.map(v => v === undefined ? null : v));
  else this._db.exec(sql);
};
FakeDatabase.prototype.prepare = function (sql) {
  const st = this._db.prepare(sql);
  let iter = null, bound = [];
  return {
    run: (p) => st.run(...(p || []).map(v => v === undefined ? null : v)),
    bind: (p) => { bound = p || []; },
    step: function () {
      if (!iter) iter = st.all(...bound.map(v => v === undefined ? null : v))[Symbol.iterator]();
      this._cur = iter.next();
      return !this._cur.done;
    },
    getAsObject: function () { return Object.assign({}, this._cur.value); },
    free: () => {},
  };
};
FakeDatabase.prototype.exec = function (sql) {
  const rows = this._db.prepare(sql).all();
  if (!rows.length) return [];
  const columns = Object.keys(rows[0]);
  return [{ columns, values: rows.map(r => columns.map(c => r[c])) }];
};
FakeDatabase.prototype.export = function () {
  // Stand-in for a real file: dump every table so a reload can restore it.
  const dump = {};
  for (const t of ['settings','chapter_progress','study_days','attempts','attempt_items','bookmarks','revision_hidden']) {
    dump[t] = this._db.prepare('SELECT * FROM ' + t).all();
  }
  return Buffer.from(JSON.stringify(dump), 'utf8');
};
FakeDatabase.prototype.close = function () { this._db.close(); };
FakeDatabase.prototype._restore = function () {
  if (!this._rows) return;
  for (const [table, rows] of Object.entries(this._rows)) {
    for (const row of rows) {
      const cols = Object.keys(row);
      this._db.prepare(`INSERT INTO ${table} (${cols.join(',')}) VALUES (${cols.map(()=>'?').join(',')})`)
        .run(...cols.map(c => row[c]));
    }
  }
};

/* ---- fake browser ---- */
const idb = new Map();
let idbBroken = false;
let sqlJsBroken = false;
function fakeWindow() {
  return {
    initSqlJs: async () => { if (sqlJsBroken) throw new Error('sql.js could not be downloaded.'); return ({ Database: function (bytes) {
      const d = new FakeDatabase(bytes);
      const origRun = d.run.bind(d);
      d.run = function (sql, p) { origRun(sql, p); if (/CREATE VIEW IF NOT EXISTS v_subject_stats/.test(sql)) d._restore(); };
      return d;
    } }); },
    indexedDB: {
      open: () => {
        const req = {};
        setTimeout(() => {
          if (idbBroken) { req.error = new Error('IndexedDB was refused.'); req.onerror && req.onerror(); return; }
          req.result = {
            objectStoreNames: { contains: () => true },
            createObjectStore: () => {},
            transaction: () => ({
              objectStore: () => ({
                get: (k) => { const r = {}; setTimeout(() => { r.result = idb.get(k); r.onsuccess && r.onsuccess(); }, 0); return r; },
                put: (v, k) => { const r = {}; setTimeout(() => { idb.set(k, v); r.onsuccess && r.onsuccess(); }, 0); return r; },
                delete: (k) => { const r = {}; setTimeout(() => { idb.delete(k); r.onsuccess && r.onsuccess(); }, 0); return r; },
              }),
              set oncomplete(fn) { setTimeout(fn, 1); },
            }),
            close: () => {},
          };
          req.onsuccess && req.onsuccess();
        }, 0);
        return req;
      },
    },
  };
}

function loadDb() {
  delete require.cache[require.resolve('../assets/js/db.js')];
  global.window = fakeWindow();
  global.document = { createElement: () => ({}), head: { appendChild: () => {} } };
  global.window.GP = {};
  global.GP = global.window.GP;
  require('../assets/js/db.js');
  return global.GP.db;
}

const snapshot = {
  settings: { exam: 'da', theme: 'dark', targetDate: '2026-02-08' },
  chapters: { 'os-sched': { v: true, b: true, p: false, r: false }, 'ml-reg': { v: true, b: false, p: false, r: true } },
  days: { '2026-09-20': { q: 12, min: 40 }, '2026-09-21': { q: 3, min: 9 } },
  attempts: [{
    id: 'a1', ts: 1700000000000, exam: 'da', kind: 'mock', label: 'Full length mock',
    count: 2, minutes: 90, scored: 1.67, max: 3, correct: 1, wrong: 1, skipped: 0, accuracy: 50,
    items: [
      { qid: 'ml01', subj: 'ml', ch: 'ml-reg', marks: 2, response: [0, 2], ok: true, skipped: false, gained: 2 },
      { qid: 'os01', subj: 'os', ch: 'os-sched', marks: 1, response: 3, ok: false, skipped: false, gained: -0.333 },
    ],
  }],
  bookmarks: { ml01: true },
  hidden: { os01: 1700000500000 },
};

(async () => {
  let db = loadDb();
  let opened = await db.open();
  check('first run has nothing stored', opened.snapshot === null && opened.mode === 'sqlite-idb', opened.mode);

  db.save(snapshot);
  await db.flush();
  check('the database file was written to IndexedDB', idb.has('progress.sqlite'));

  // Reload the page: a new db.js, same IndexedDB.
  db = loadDb();
  opened = await db.open();
  const back = opened.snapshot;
  check('settings survive a reload', JSON.stringify(back.settings) === JSON.stringify(snapshot.settings), back.settings);
  check('chapter ticks survive', JSON.stringify(back.chapters) === JSON.stringify(snapshot.chapters), back.chapters);
  check('study days survive', JSON.stringify(back.days) === JSON.stringify(snapshot.days), back.days);
  check('bookmarks survive', JSON.stringify(back.bookmarks) === JSON.stringify(snapshot.bookmarks));
  check('dismissals survive', JSON.stringify(back.hidden) === JSON.stringify(snapshot.hidden), back.hidden);
  const a = back.attempts[0], b = snapshot.attempts[0];
  check('attempt header survives', a.id === b.id && a.ts === b.ts && a.label === b.label
    && a.scored === b.scored && a.accuracy === b.accuracy, a);
  check('answers survive with their types', JSON.stringify(a.items[0].response) === '[0,2]'
    && a.items[1].response === 3, a.items.map(i => i.response));
  check('marking survives', a.items[0].ok === true && a.items[1].ok === false
    && a.items[1].gained === -0.333, a.items);

  const stats = db.rows("SELECT * FROM v_subject_stats WHERE exam = 'da'");
  check('v_subject_stats works on real rows', stats.length === 2, stats);
  const revision = db.rows('SELECT question_id FROM v_revision_list');
  check('dismissed miss stays out of the revision view', revision.length === 0, revision);

  const q = db.query('SELECT day, questions FROM study_days ORDER BY day');
  check('query box returns rows', q.columns[0] === 'day' && q.values.length === 2, q);
  check('writes are refused in the query box',
    (() => { try { db.query("DELETE FROM study_days"); return false; } catch (e) { return true; } })());
  check('two statements are refused',
    (() => { try { db.query('SELECT 1; SELECT 2'); return false; } catch (e) { return true; } })());
  check('table list is offered', db.tables().length >= 10, db.tables().length);

  await db.wipe();
  check('wipe empties the tables', db.rows('SELECT * FROM attempts').length === 0);
  check('wipe removes the stored file', !idb.has('progress.sqlite'));

  // IndexedDB blocked, as on a file:// page in Chrome
  idbBroken = true;
  db = loadDb();
  opened = await db.open();
  check('blocked storage falls back to a session', opened.mode === 'sqlite-session', opened.mode);
  check('and says why', db.problem().length > 0, db.problem());
  check('but SQLite still runs', db.usingSqlite() === true);
  check('and it admits it is not durable', db.durable() === false);
  db.save(snapshot);
  await db.flush();
  check('saving does not throw when storage is blocked', true);

  // sql.js unavailable (offline first run), IndexedDB fine
  idbBroken = false; sqlJsBroken = true; idb.clear();
  db = loadDb();
  opened = await db.open();
  check('no sql.js falls back to IndexedDB', opened.mode === 'json-idb', opened.mode);
  check('the fallback is still durable', db.durable() === true);
  check('queries are refused without SQLite',
    (() => { try { db.query('SELECT 1'); return false; } catch (e) { return true; } })());
  db.save(snapshot);
  await db.flush();
  check('the fallback document was stored', idb.has('progress.json'));
  db = loadDb();
  opened = await db.open();
  check('the fallback reloads', opened.snapshot.settings.exam === 'da', opened.mode);

  // now sql.js does load: the fallback should move into SQLite
  sqlJsBroken = false;
  db = loadDb();
  opened = await db.open();
  check('it migrates into SQLite', opened.mode === 'sqlite-idb' && opened.snapshot.attempts.length === 1, opened.mode);
  check('the SQLite file replaced the fallback', idb.has('progress.sqlite') && !idb.has('progress.json'),
    [...idb.keys()]);

  // nothing at all
  idbBroken = true; sqlJsBroken = true;
  db = loadDb();
  opened = await db.open();
  check('nothing available means memory only', opened.mode === 'memory' && db.durable() === false, opened.mode);
  db.save(snapshot);
  await db.flush();
  check('saving is a no-op rather than an error', true);

  console.log();
  console.log(fails.length ? 'FAILED: ' + fails.join(', ') : 'database checks passed');
  process.exit(fails.length ? 1 : 0);
})();

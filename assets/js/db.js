/* ============================================================
   db.js — the database layer.

   Progress is kept in a real SQLite database that runs inside the
   page (SQLite compiled to WebAssembly, via sql.js). The database
   file itself is stored in IndexedDB, not localStorage, and can be
   downloaded as a .sqlite file you can open in any SQL tool.

   Four storage modes, picked automatically, best first:

     sqlite-idb      SQLite in the page, file saved in IndexedDB.
                     Progress survives closing the browser.
     sqlite-session  SQLite works but IndexedDB is unavailable
                     (Chrome blocks it on file:// pages). Progress
                     lasts until the tab closes; download the file.
     json-idb        sql.js could not load — usually no network on
                     first run — so rows are kept as one JSON
                     document in IndexedDB instead. Still not
                     localStorage, and it is migrated into SQLite
                     automatically next time sql.js does load.
     memory          Nothing persistent is available. The session
                     works; export before leaving.

   Nothing here knows about GATE. It reads and writes one snapshot
   object, which store.js owns.
   ============================================================ */

window.GP = window.GP || {};

GP.db = (function () {
  const SQLJS_BASE = 'https://cdn.jsdelivr.net/npm/sql.js@1.11.0/dist/';
  const IDB_NAME = 'gate-prep-board';
  const IDB_STORE = 'files';
  const FILE_KEY = 'progress.sqlite';
  const JSON_KEY = 'progress.json';
  const SAVE_DELAY = 400;

  /* The schema. Also kept readable in assets/sql/schema.sql — change both. */
  const SCHEMA = [
    'PRAGMA foreign_keys = ON;',
    'CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT NOT NULL);',
    'CREATE TABLE IF NOT EXISTS chapter_progress (',
    '  chapter_id TEXT PRIMARY KEY,',
    '  lectures INTEGER NOT NULL DEFAULT 0 CHECK (lectures IN (0,1)),',
    '  book     INTEGER NOT NULL DEFAULT 0 CHECK (book     IN (0,1)),',
    '  pyqs     INTEGER NOT NULL DEFAULT 0 CHECK (pyqs     IN (0,1)),',
    '  revised  INTEGER NOT NULL DEFAULT 0 CHECK (revised  IN (0,1)),',
    '  updated_at TEXT NOT NULL);',
    'CREATE TABLE IF NOT EXISTS study_days (',
    '  day TEXT PRIMARY KEY,',
    '  questions INTEGER NOT NULL DEFAULT 0,',
    '  minutes INTEGER NOT NULL DEFAULT 0);',
    'CREATE TABLE IF NOT EXISTS attempts (',
    '  id TEXT PRIMARY KEY,',
    '  finished_at INTEGER NOT NULL,',
    "  exam TEXT NOT NULL CHECK (exam IN ('cse','da')),",
    '  kind TEXT NOT NULL,',
    '  label TEXT NOT NULL,',
    '  question_count INTEGER NOT NULL,',
    '  minutes INTEGER NOT NULL DEFAULT 0,',
    '  scored_marks REAL NOT NULL DEFAULT 0,',
    '  max_marks REAL NOT NULL DEFAULT 0,',
    '  right_count INTEGER NOT NULL DEFAULT 0,',
    '  wrong_count INTEGER NOT NULL DEFAULT 0,',
    '  skipped_count INTEGER NOT NULL DEFAULT 0,',
    '  accuracy INTEGER);',
    'CREATE INDEX IF NOT EXISTS idx_attempts_when ON attempts(finished_at DESC);',
    'CREATE TABLE IF NOT EXISTS attempt_items (',
    '  attempt_id TEXT NOT NULL REFERENCES attempts(id) ON DELETE CASCADE,',
    '  question_id TEXT NOT NULL,',
    '  subject_id TEXT NOT NULL,',
    '  chapter_id TEXT NOT NULL,',
    '  marks INTEGER NOT NULL,',
    '  response TEXT,',
    '  correct INTEGER NOT NULL DEFAULT 0,',
    '  skipped INTEGER NOT NULL DEFAULT 0,',
    '  gained REAL NOT NULL DEFAULT 0,',
    '  PRIMARY KEY (attempt_id, question_id));',
    'CREATE INDEX IF NOT EXISTS idx_items_question ON attempt_items(question_id);',
    'CREATE INDEX IF NOT EXISTS idx_items_subject ON attempt_items(subject_id);',
    'CREATE TABLE IF NOT EXISTS bookmarks (question_id TEXT PRIMARY KEY, created_at TEXT NOT NULL);',
    'CREATE TABLE IF NOT EXISTS revision_hidden (',
    '  question_id TEXT PRIMARY KEY,',
    '  hidden_at INTEGER NOT NULL);',
    'CREATE VIEW IF NOT EXISTS v_chapter_percent AS',
    '  SELECT chapter_id, (lectures + book + pyqs + revised) * 25 AS percent',
    '  FROM chapter_progress;',
    'CREATE VIEW IF NOT EXISTS v_latest_verdict AS',
    '  SELECT question_id, correct, finished_at FROM (',
    '    SELECT ai.question_id, ai.correct, a.finished_at,',
    '           ROW_NUMBER() OVER (PARTITION BY ai.question_id',
    '                              ORDER BY a.finished_at DESC, ai.rowid DESC) AS rn',
    '    FROM attempt_items ai JOIN attempts a ON a.id = ai.attempt_id',
    '    WHERE ai.skipped = 0',
    '  ) WHERE rn = 1;',
    'CREATE VIEW IF NOT EXISTS v_revision_list AS',
    '  SELECT v.question_id, v.finished_at FROM v_latest_verdict v',
    '  LEFT JOIN revision_hidden h ON h.question_id = v.question_id',
    '  WHERE v.correct = 0 AND (h.hidden_at IS NULL OR h.hidden_at < v.finished_at);',
    'CREATE VIEW IF NOT EXISTS v_subject_stats AS',
    '  SELECT a.exam, ai.subject_id,',
    '    SUM(CASE WHEN ai.skipped = 0 AND ai.correct = 1 THEN 1 ELSE 0 END) AS right_count,',
    '    SUM(CASE WHEN ai.skipped = 0 AND ai.correct = 0 THEN 1 ELSE 0 END) AS wrong_count,',
    '    SUM(ai.skipped) AS skipped_count,',
    '    ROUND(100.0 * SUM(CASE WHEN ai.skipped = 0 AND ai.correct = 1 THEN 1 ELSE 0 END)',
    '          / NULLIF(SUM(CASE WHEN ai.skipped = 0 THEN 1 ELSE 0 END), 0)) AS accuracy',
    '  FROM attempt_items ai JOIN attempts a ON a.id = ai.attempt_id',
    '  GROUP BY a.exam, ai.subject_id;'
  ].join('\n');

  let db = null;                 // the sql.js Database, when available
  let mode = 'memory';
  let problem = '';              // why a better mode was not possible
  let idbOk = false;
  let pending = null;            // debounce timer
  let lastSnapshot = null;

  /* ---------- IndexedDB, just enough of it ---------- */
  function idbOpen() {
    return new Promise(function (resolve, reject) {
      if (!window.indexedDB) { reject(new Error('This browser has no IndexedDB.')); return; }
      let request;
      try { request = window.indexedDB.open(IDB_NAME, 1); }
      catch (e) { reject(e); return; }
      request.onupgradeneeded = function () {
        const opened = request.result;
        if (!opened.objectStoreNames.contains(IDB_STORE)) opened.createObjectStore(IDB_STORE);
      };
      request.onsuccess = function () { resolve(request.result); };
      request.onerror = function () { reject(request.error || new Error('IndexedDB was refused.')); };
      request.onblocked = function () { reject(new Error('IndexedDB is blocked by another tab.')); };
    });
  }

  function idbDo(kind, fn) {
    return idbOpen().then(function (opened) {
      return new Promise(function (resolve, reject) {
        const tx = opened.transaction(IDB_STORE, kind);
        const request = fn(tx.objectStore(IDB_STORE));
        request.onsuccess = function () { resolve(request.result); };
        request.onerror = function () { reject(request.error); };
        tx.oncomplete = function () { opened.close(); };
      });
    });
  }

  const idbGet = (key) => idbDo('readonly', (s) => s.get(key));
  const idbPut = (key, value) => idbDo('readwrite', (s) => s.put(value, key));
  const idbDelete = (key) => idbDo('readwrite', (s) => s.delete(key));

  /* ---------- loading sql.js ---------- */
  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      const tag = document.createElement('script');
      tag.src = src;
      tag.onload = resolve;
      tag.onerror = function () { reject(new Error('sql.js could not be downloaded.')); };
      document.head.appendChild(tag);
    });
  }

  async function startSqlite(bytes) {
    if (!window.initSqlJs) await loadScript(SQLJS_BASE + 'sql-wasm.js');
    const SQL = await window.initSqlJs({ locateFile: function (f) { return SQLJS_BASE + f; } });
    const opened = bytes ? new SQL.Database(new Uint8Array(bytes)) : new SQL.Database();
    opened.run(SCHEMA);
    return opened;
  }

  /* ---------- rows in, rows out ---------- */
  function rows(sql, params) {
    if (!db) return [];
    const out = [];
    const stmt = db.prepare(sql);
    try {
      if (params) stmt.bind(params);
      while (stmt.step()) out.push(stmt.getAsObject());
    } finally {
      stmt.free();
    }
    return out;
  }

  function readSnapshot() {
    if (!db) return null;
    const snapshot = {
      settings: {},
      chapters: {},
      days: {},
      attempts: [],
      bookmarks: {},
      hidden: {}
    };

    rows('SELECT key, value FROM settings').forEach(function (r) {
      snapshot.settings[r.key] = r.value;
    });

    rows('SELECT * FROM chapter_progress').forEach(function (r) {
      snapshot.chapters[r.chapter_id] = {
        v: !!r.lectures, b: !!r.book, p: !!r.pyqs, r: !!r.revised
      };
    });

    rows('SELECT * FROM study_days').forEach(function (r) {
      snapshot.days[r.day] = { q: r.questions, min: r.minutes };
    });

    const items = {};
    rows('SELECT * FROM attempt_items').forEach(function (r) {
      (items[r.attempt_id] = items[r.attempt_id] || []).push({
        qid: r.question_id,
        subj: r.subject_id,
        ch: r.chapter_id,
        marks: r.marks,
        response: r.response === null ? null : JSON.parse(r.response),
        ok: !!r.correct,
        skipped: !!r.skipped,
        gained: r.gained
      });
    });

    snapshot.attempts = rows('SELECT * FROM attempts ORDER BY finished_at DESC').map(function (r) {
      return {
        id: r.id,
        ts: r.finished_at,
        exam: r.exam,
        kind: r.kind,
        label: r.label,
        count: r.question_count,
        minutes: r.minutes,
        scored: r.scored_marks,
        max: r.max_marks,
        correct: r.right_count,
        wrong: r.wrong_count,
        skipped: r.skipped_count,
        accuracy: r.accuracy,
        items: items[r.id] || []
      };
    });

    rows('SELECT question_id FROM bookmarks').forEach(function (r) {
      snapshot.bookmarks[r.question_id] = true;
    });

    rows('SELECT question_id, hidden_at FROM revision_hidden').forEach(function (r) {
      snapshot.hidden[r.question_id] = r.hidden_at;
    });

    return snapshot;
  }

  /* The whole snapshot is rewritten inside one transaction. It is a few
     hundred rows, so this is quick, and it makes it impossible for the
     tables and the screen to drift apart. */
  function writeSnapshot(snapshot) {
    if (!db) return;
    db.run('BEGIN');
    try {
      db.run('DELETE FROM settings');
      db.run('DELETE FROM chapter_progress');
      db.run('DELETE FROM study_days');
      db.run('DELETE FROM attempt_items');
      db.run('DELETE FROM attempts');
      db.run('DELETE FROM bookmarks');
      db.run('DELETE FROM revision_hidden');

      const now = new Date().toISOString();

      let stmt = db.prepare('INSERT INTO settings (key, value) VALUES (?, ?)');
      Object.keys(snapshot.settings).forEach(function (key) {
        stmt.run([key, String(snapshot.settings[key])]);
      });
      stmt.free();

      stmt = db.prepare(
        'INSERT INTO chapter_progress (chapter_id, lectures, book, pyqs, revised, updated_at)' +
        ' VALUES (?, ?, ?, ?, ?, ?)'
      );
      Object.keys(snapshot.chapters).forEach(function (id) {
        const c = snapshot.chapters[id];
        stmt.run([id, c.v ? 1 : 0, c.b ? 1 : 0, c.p ? 1 : 0, c.r ? 1 : 0, now]);
      });
      stmt.free();

      stmt = db.prepare('INSERT INTO study_days (day, questions, minutes) VALUES (?, ?, ?)');
      Object.keys(snapshot.days).forEach(function (day) {
        const d = snapshot.days[day];
        stmt.run([day, d.q || 0, d.min || 0]);
      });
      stmt.free();

      const attemptStmt = db.prepare(
        'INSERT INTO attempts (id, finished_at, exam, kind, label, question_count, minutes,' +
        ' scored_marks, max_marks, right_count, wrong_count, skipped_count, accuracy)' +
        ' VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
      );
      const itemStmt = db.prepare(
        'INSERT INTO attempt_items (attempt_id, question_id, subject_id, chapter_id, marks,' +
        ' response, correct, skipped, gained) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
      );
      snapshot.attempts.forEach(function (a) {
        attemptStmt.run([
          a.id, a.ts, a.exam, a.kind, a.label, a.count || (a.items || []).length,
          a.minutes || 0, a.scored || 0, a.max || 0, a.correct || 0,
          a.wrong || 0, a.skipped || 0,
          a.accuracy === null || a.accuracy === undefined ? null : a.accuracy
        ]);
        (a.items || []).forEach(function (it) {
          itemStmt.run([
            a.id, it.qid, it.subj, it.ch, it.marks,
            it.response === undefined || it.response === null ? null : JSON.stringify(it.response),
            it.ok ? 1 : 0, it.skipped ? 1 : 0, it.gained || 0
          ]);
        });
      });
      attemptStmt.free();
      itemStmt.free();

      stmt = db.prepare('INSERT INTO bookmarks (question_id, created_at) VALUES (?, ?)');
      Object.keys(snapshot.bookmarks).forEach(function (id) { stmt.run([id, now]); });
      stmt.free();

      stmt = db.prepare('INSERT INTO revision_hidden (question_id, hidden_at) VALUES (?, ?)');
      Object.keys(snapshot.hidden || {}).forEach(function (id) {
        stmt.run([id, snapshot.hidden[id]]);
      });
      stmt.free();

      db.run('COMMIT');
    } catch (err) {
      db.run('ROLLBACK');
      throw err;
    }
  }

  /* ---------- opening ---------- */
  async function open() {
    let bytes = null;
    let saved = null;

    try {
      bytes = await idbGet(FILE_KEY);
      saved = await idbGet(JSON_KEY);
      idbOk = true;
    } catch (err) {
      idbOk = false;
      problem = err.message;
    }

    try {
      db = await startSqlite(bytes);
      mode = idbOk ? 'sqlite-idb' : 'sqlite-session';
      // First run with sql.js available but an older JSON fallback on disk:
      // move it into the database and drop the fallback copy.
      if (!bytes && saved) {
        writeSnapshot(normalise(saved));
        if (idbOk) {
          await idbPut(FILE_KEY, db.export());
          await idbDelete(JSON_KEY);
        }
      }
    } catch (err) {
      db = null;
      problem = err.message;
      mode = idbOk ? 'json-idb' : 'memory';
    }

    if (db) {
      const read = readSnapshot();
      lastSnapshot = isEmpty(read) ? null : read;   // null means "nothing stored yet"
    } else if (idbOk && saved) {
      lastSnapshot = normalise(saved);
    } else {
      lastSnapshot = null;
    }

    return { mode: mode, snapshot: lastSnapshot, problem: problem };
  }

  /* A brand new database reads back as a snapshot with nothing in it. store.js
     wants to know the difference, so it can write its defaults. */
  function isEmpty(snapshot) {
    if (!snapshot) return true;
    return !Object.keys(snapshot.settings).length &&
      !Object.keys(snapshot.chapters).length &&
      !Object.keys(snapshot.days).length &&
      !Object.keys(snapshot.bookmarks).length &&
      !snapshot.attempts.length;
  }

  function normalise(snapshot) {
    return {
      settings: snapshot.settings || {},
      chapters: snapshot.chapters || {},
      days: snapshot.days || {},
      attempts: snapshot.attempts || [],
      bookmarks: snapshot.bookmarks || {},
      hidden: snapshot.hidden || {}
    };
  }

  /* ---------- saving ---------- */
  function persist(snapshot) {
    if (db) {
      writeSnapshot(snapshot);
      if (!idbOk) return Promise.resolve();
      return idbPut(FILE_KEY, db.export()).catch(function (err) {
        idbOk = false;
        mode = 'sqlite-session';
        problem = err.message;
      });
    }
    if (idbOk) {
      return idbPut(JSON_KEY, snapshot).catch(function (err) {
        idbOk = false;
        mode = 'memory';
        problem = err.message;
      });
    }
    return Promise.resolve();
  }

  /* Writes are collapsed: ticking four boxes quickly is one save. */
  function save(snapshot) {
    lastSnapshot = snapshot;
    if (pending) clearTimeout(pending);
    pending = setTimeout(function () {
      pending = null;
      persist(lastSnapshot);
    }, SAVE_DELAY);
  }

  function flush() {
    if (pending) { clearTimeout(pending); pending = null; }
    return persist(lastSnapshot || normalise({}));
  }

  /* ---------- the query box on the Progress page ---------- */
  function query(sql) {
    if (!db) throw new Error('SQLite is not running in this browser, so queries are unavailable.');
    const cleaned = sql.trim().replace(/;+\s*$/, '');
    if (!/^(select|with|pragma|explain)\b/i.test(cleaned)) {
      throw new Error('Only SELECT, WITH, PRAGMA and EXPLAIN are allowed here.');
    }
    if (/;/.test(cleaned)) throw new Error('One statement at a time, please.');
    const result = db.exec(cleaned);
    if (!result.length) return { columns: [], values: [] };
    return result[0];
  }

  function tables() {
    return rows(
      "SELECT name, type FROM sqlite_master WHERE type IN ('table','view')" +
      " AND name NOT LIKE 'sqlite_%' ORDER BY type, name"
    );
  }

  /* ---------- the file itself ---------- */
  function exportBytes() {
    if (!db) return null;
    return db.export();
  }

  async function importBytes(buffer) {
    const started = await startSqlite(buffer);   // throws if it is not a database
    if (db) db.close();
    db = started;
    mode = idbOk ? 'sqlite-idb' : 'sqlite-session';
    lastSnapshot = readSnapshot();
    if (idbOk) await idbPut(FILE_KEY, db.export());
    return lastSnapshot;
  }

  async function wipe() {
    if (db) {
      db.run('DELETE FROM attempt_items');
      db.run('DELETE FROM attempts');
      db.run('DELETE FROM chapter_progress');
      db.run('DELETE FROM study_days');
      db.run('DELETE FROM bookmarks');
      db.run('DELETE FROM revision_hidden');
      db.run('DELETE FROM settings');
      db.run('VACUUM');
    }
    if (idbOk) {
      try { await idbDelete(FILE_KEY); await idbDelete(JSON_KEY); } catch (e) { /* nothing to remove */ }
    }
    lastSnapshot = null;
  }

  const LABELS = {
    'sqlite-idb': 'SQLite in this browser, saved between visits',
    'sqlite-session': 'SQLite in this browser, this tab only',
    'json-idb': 'IndexedDB only — SQLite could not load',
    memory: 'Nothing is being saved'
  };

  return {
    open: open,
    save: save,
    flush: flush,
    query: query,
    tables: tables,
    rows: rows,
    exportBytes: exportBytes,
    importBytes: importBytes,
    wipe: wipe,
    mode: function () { return mode; },
    label: function () { return LABELS[mode]; },
    problem: function () { return problem; },
    usingSqlite: function () { return !!db; },
    durable: function () { return mode === 'sqlite-idb' || mode === 'json-idb'; }
  };
})();

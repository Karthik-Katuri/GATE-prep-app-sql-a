/* ============================================================
   store.js — progress, backed by the SQL database in db.js.

   Reads stay synchronous: the whole of your progress is a few
   hundred rows, so it is held in memory and the screen never waits
   on a query. Every write updates that copy and hands it to db.js,
   which folds it into SQLite and saves the file to IndexedDB a
   moment later. Nothing uses localStorage.

   The revision list is not stored anywhere. It is derived from the
   most recent verdict on each question, which is why answering a
   missed question correctly removes it by itself. The SQL view
   v_revision_list does the same thing for the query box and the
   exported file.
   ============================================================ */

window.GP = window.GP || {};

GP.store = (function () {
  const DEFAULTS = { exam: 'cse', targetDate: '2027-02-07', theme: 'light' };
  const MAX_ATTEMPTS = 300;

  let snap = null;

  function blank() {
    return {
      settings: Object.assign({}, DEFAULTS),
      chapters: {},
      days: {},
      attempts: [],
      bookmarks: {},
      hidden: {}
    };
  }

  function adopt(incoming) {
    const next = blank();
    if (!incoming || typeof incoming !== 'object') return next;

    // Accept both the snapshot shape db.js hands back and the flatter shape
    // used by the exported .json file (and by the older localStorage build).
    const settings = incoming.settings || {};
    ['exam', 'targetDate', 'theme'].forEach(function (key) {
      const value = settings[key] !== undefined ? settings[key] : incoming[key];
      if (value !== undefined && value !== null) next.settings[key] = String(value);
    });
    if (next.settings.exam !== 'cse' && next.settings.exam !== 'da') next.settings.exam = 'cse';
    if (next.settings.theme !== 'light' && next.settings.theme !== 'dark') next.settings.theme = 'light';

    Object.keys(incoming.chapters || {}).forEach(function (id) {
      const c = incoming.chapters[id] || {};
      next.chapters[id] = { v: !!c.v, b: !!c.b, p: !!c.p, r: !!c.r };
    });

    Object.keys(incoming.days || {}).forEach(function (day) {
      const d = incoming.days[day] || {};
      next.days[day] = { q: Number(d.q) || 0, min: Number(d.min) || 0 };
    });

    next.attempts = (incoming.attempts || [])
      .filter(function (a) { return a && a.id && a.ts; })
      .sort(function (a, b) { return b.ts - a.ts; })
      .slice(0, MAX_ATTEMPTS);

    Object.keys(incoming.bookmarks || {}).forEach(function (id) {
      if (incoming.bookmarks[id]) next.bookmarks[id] = true;
    });

    Object.keys(incoming.hidden || {}).forEach(function (id) {
      next.hidden[id] = Number(incoming.hidden[id]) || 0;
    });

    return next;
  }

  function state() {
    if (!snap) snap = blank();
    return snap;
  }

  function save() {
    GP.db.save(state());
  }

  /* ---------- opening ---------- */
  async function open() {
    const result = await GP.db.open();
    const fresh = !result.snapshot;
    snap = adopt(result.snapshot);
    if (fresh) save();          // writes the default settings row straight away
    return result;
  }

  /* ---------- settings ---------- */
  function get(key) {
    if (key === 'days') return state().days;
    if (key === 'chapters') return state().chapters;
    return state().settings[key];
  }

  function set(key, value) {
    state().settings[key] = String(value);
    save();
  }

  /* ---------- chapter checklist ---------- */
  function chapterMarks(chapterId) {
    return state().chapters[chapterId] || { v: false, b: false, p: false, r: false };
  }

  function toggleChapter(chapterId, field) {
    const s = state();
    const current = Object.assign({ v: false, b: false, p: false, r: false }, s.chapters[chapterId]);
    current[field] = !current[field];
    s.chapters[chapterId] = current;
    logStudy(0, 0);
    save();
    return current;
  }

  /* ---------- days and streak ---------- */
  function todayKey(date) {
    const d = date || new Date();
    return [
      d.getFullYear(),
      String(d.getMonth() + 1).padStart(2, '0'),
      String(d.getDate()).padStart(2, '0')
    ].join('-');
  }

  function logStudy(questions, minutes) {
    const s = state();
    const key = todayKey();
    const day = s.days[key] || { q: 0, min: 0 };
    day.q += questions || 0;
    day.min += minutes || 0;
    s.days[key] = day;
    save();
  }

  function streak() {
    const s = state();
    let count = 0;
    const cursor = new Date();
    if (!s.days[todayKey(cursor)]) cursor.setDate(cursor.getDate() - 1);
    while (s.days[todayKey(cursor)]) {
      count++;
      cursor.setDate(cursor.getDate() - 1);
    }
    return count;
  }

  /* ---------- attempts ---------- */
  function addAttempt(attempt) {
    const s = state();
    s.attempts.unshift(attempt);
    if (s.attempts.length > MAX_ATTEMPTS) s.attempts.length = MAX_ATTEMPTS;
    save();
  }

  function attempts() { return state().attempts; }

  /* ---------- the revision list, worked out rather than stored ---------- */
  function latestVerdicts() {
    const seen = {};
    state().attempts.forEach(function (a) {
      (a.items || []).forEach(function (item) {
        if (item.skipped) return;
        const known = seen[item.qid];
        if (!known || a.ts > known.ts) seen[item.qid] = { ts: a.ts, ok: !!item.ok };
      });
    });
    return seen;
  }

  function wrongIds() {
    const s = state();
    const verdicts = latestVerdicts();
    return Object.keys(verdicts).filter(function (qid) {
      if (verdicts[qid].ok) return false;
      const hiddenAt = s.hidden[qid];
      return !hiddenAt || hiddenAt < verdicts[qid].ts;
    });
  }

  /* The "remove" button on the revision page. History is left alone; the
     question simply stops being listed until it is answered wrong again. */
  function hideFromRevision(questionId) {
    state().hidden[questionId] = Date.now();
    save();
  }

  /* ---------- bookmarks ---------- */
  function isBookmarked(qid) { return !!state().bookmarks[qid]; }

  function toggleBookmark(qid) {
    const s = state();
    if (s.bookmarks[qid]) delete s.bookmarks[qid];
    else s.bookmarks[qid] = true;
    save();
    return !!s.bookmarks[qid];
  }

  function bookmarkIds() { return Object.keys(state().bookmarks); }

  /* ---------- portability ---------- */
  function exportJSON() {
    const s = state();
    return JSON.stringify({
      format: 'gate-prep-board/2',
      exportedAt: new Date().toISOString(),
      exam: s.settings.exam,
      targetDate: s.settings.targetDate,
      theme: s.settings.theme,
      chapters: s.chapters,
      days: s.days,
      attempts: s.attempts,
      bookmarks: s.bookmarks,
      hidden: s.hidden
    }, null, 2);
  }

  function importJSON(text) {
    const incoming = JSON.parse(text);
    if (!incoming || typeof incoming !== 'object') throw new Error('Not a progress file.');
    if (!incoming.chapters && !incoming.attempts && !incoming.settings) {
      throw new Error('Not a progress file.');
    }
    snap = adopt(incoming);
    save();
  }

  function exportSqlite() { return GP.db.exportBytes(); }

  async function importSqlite(buffer) {
    snap = adopt(await GP.db.importBytes(buffer));
  }

  async function reset() {
    snap = blank();
    await GP.db.wipe();
    save();
  }

  function persistent() { return GP.db.durable(); }

  return {
    open: open,
    get: get, set: set,
    chapterMarks: chapterMarks, toggleChapter: toggleChapter,
    logStudy: logStudy, streak: streak, todayKey: todayKey,
    addAttempt: addAttempt, attempts: attempts,
    isBookmarked: isBookmarked, toggleBookmark: toggleBookmark,
    bookmarkIds: bookmarkIds, wrongIds: wrongIds,
    hideFromRevision: hideFromRevision,
    exportJSON: exportJSON, importJSON: importJSON,
    exportSqlite: exportSqlite, importSqlite: importSqlite,
    reset: reset, persistent: persistent
  };
})();

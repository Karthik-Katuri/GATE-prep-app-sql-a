/* ============================================================
   app.js — router and views
   ============================================================ */

window.GP = window.GP || {};

(function () {
  const E = () => GP.engine;
  const ST = () => GP.store;
  const RES = window.GP_RESOURCES || { credits: [], common: [], bySubject: {}, mocks: [], pastPapers: [] };
  const SY = window.GP_SYLLABUS || { subjects: [], exams: {} };

  const ROUTES = [
    { id: 'board', label: 'Board', short: 'Board' },
    { id: 'subjects', label: 'Subjects and resources', short: 'Subjects' },
    { id: 'practice', label: 'Practice questions', short: 'Practice' },
    { id: 'mocks', label: 'Mock tests', short: 'Mocks' },
    { id: 'revision', label: 'Revision list', short: 'Revise' },
    { id: 'progress', label: 'Progress and data', short: 'Progress' }
  ];

  let open = {};          // subjectId -> expanded in the subjects view

  function h(s) {
    return String(s === undefined || s === null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function exam() { return ST().get('exam') || 'cse'; }
  function view() { return document.getElementById('view'); }
  function route() { return (location.hash || '#/board').replace('#/', '') || 'board'; }

  function bar(pct) {
    const p = Math.max(0, Math.min(100, pct));
    return '<span class="bar"><i class="' + (p >= 100 ? 'full' : '') + '" style="width:' + p + '%"></i></span>';
  }

  /* ================= BOARD ================= */
  function boardView() {
    const ex = exam();
    const days = E().daysTo(ST().get('targetDate'));
    const pct = E().examPercent(ex);
    const stats = E().subjectStats(ex);
    let right = 0, wrong = 0;
    Object.keys(stats).forEach(function (k) { right += stats[k].right; wrong += stats[k].wrong; });
    const acc = (right + wrong) ? Math.round((right / (right + wrong)) * 100) : null;
    const counts = E().countsFor(ex);
    const examName = SY.exams[ex].name;

    const hero = '<div class="hero">' +
      '<div class="count">' +
        '<div class="big num">' + (days === null ? '\u2014' : Math.max(days, 0)) + '</div>' +
        '<div class="lab">days to your target exam date</div>' +
        '<input type="date" id="target" value="' + h(ST().get('targetDate')) + '" aria-label="Target exam date">' +
      '</div>' +
      '<div>' +
        '<div class="spread" style="margin-bottom:12px"><h1>' + h(examName) + '</h1>' +
        '<span class="faint">' + (days !== null && days < 0 ? 'Target date has passed \u2014 set a new one' : 'Weightage-adjusted readiness') + '</span></div>' +
        '<div class="dial">' +
          '<div><b>' + pct + '%</b><span>Syllabus covered</span></div>' +
          '<div><b>' + (right + wrong) + '</b><span>Questions attempted</span></div>' +
          '<div><b>' + (acc === null ? '\u2014' : acc + '%') + '</b><span>Overall accuracy</span></div>' +
          '<div><b>' + ST().streak() + '</b><span>Day streak</span></div>' +
        '</div>' +
        '<div style="margin-top:14px">' + bar(pct) + '</div>' +
      '</div>' +
    '</div>';

    const quick = '<div class="card"><h2>Start something now</h2>' +
      '<div class="row" style="margin-top:4px">' +
        '<button class="btn" data-go-sprint>30 minute sprint test</button>' +
        '<button class="btn ghost" data-go-weak>Practice my weakest subject</button>' +
        '<button class="btn quiet" data-nav="revision">Revise ' + ST().wrongIds().length + ' missed question(s)</button>' +
      '</div>' +
      '<p class="faint" style="margin-top:10px">' + E().pool({ exam: ex }).length + ' practice questions are loaded for ' + h(examName) + '. Nothing is sent anywhere; progress stays in this browser.</p>' +
    '</div>';

    const rows = E().subjectsFor(ex).map(function (s) {
      const sp = E().subjectPercent(s.id, ex);
      const st = stats[s.id] || {};
      const qn = counts[s.id] || 0;
      return '<tr>' +
        '<td class="name">' + h(s.name) + '<small>' + h(s.group) + '</small></td>' +
        '<td class="r num hide-sm">' + E().marksOf(s, ex) + '</td>' +
        '<td style="width:34%">' + bar(sp) + '</td>' +
        '<td class="r num">' + sp + '%</td>' +
        '<td class="r num hide-sm">' + (st.accuracy === null || st.accuracy === undefined ? '\u2014' : st.accuracy + '%') + '</td>' +
        '<td class="r"><button class="btn ghost sm" data-practice="' + s.id + '"' + (qn ? '' : ' disabled') + '>Practice</button></td>' +
      '</tr>';
    }).join('');

    const table = '<div class="card"><div class="spread"><h2>Readiness by subject</h2>' +
      '<span class="faint">Marks column is the typical weight out of 100</span></div>' +
      '<table class="sheet"><thead><tr><th>Subject</th><th class="r hide-sm">Marks</th><th>Coverage</th>' +
      '<th class="r">%</th><th class="r hide-sm">Accuracy</th><th></th></tr></thead><tbody>' + rows + '</tbody></table>' +
      '<p class="faint" style="margin-top:10px">Coverage comes from the chapter checklist on the Subjects page. Tick lectures, textbook, PYQs and revision as you finish them.</p></div>';

    return hero + quick + table;
  }

  /* ================= SUBJECTS ================= */
  function subjectsView() {
    const ex = exam();
    const counts = E().countsFor(ex);

    const blocks = E().subjectsFor(ex).map(function (s) {
      const isOpen = !!open[s.id];
      const sp = E().subjectPercent(s.id, ex);
      const res = RES.bySubject[s.id];

      const head = '<div class="spread" style="cursor:pointer" data-toggle="' + s.id + '">' +
        '<div><h2>' + h(s.name) + '</h2>' +
          '<span class="faint">' + E().marksOf(s, ex) + ' marks typically \u00b7 ' + (counts[s.id] || 0) + ' questions here</span></div>' +
        '<div class="row"><span class="num faint">' + sp + '%</span>' + bar(sp) +
        '<span class="faint">' + (isOpen ? 'Hide' : 'Open') + '</span></div></div>';

      if (!isOpen) return '<div class="card">' + head + '</div>';

      const resBlock = res ? '<div style="margin-top:16px">' +
        '<h3>Free resources</h3>' +
        (res.book ? '<p class="faint" style="margin-top:4px"><b>Textbook:</b> ' + h(res.book) + '</p>' : '') +
        (res.chapters ? '<p class="faint"><b>Chapters that matter:</b> ' + h(res.chapters) + '</p>' : '') +
        '<div class="reslist">' + res.links.map(function (l) {
          return '<div><span class="k">' + h(l.kind) + '</span>' +
            (l.url ? '<a href="' + h(l.url) + '" target="_blank" rel="noopener">' + h(l.title) + '</a>'
                   : '<span>' + h(l.title) + ' <span class="faint">(search for this)</span></span>') + '</div>';
        }).join('') + '</div></div>' : '';

      const chapBlock = '<div style="margin-top:18px"><h3>Chapter checklist</h3>' +
        '<p class="faint" style="margin:4px 0 8px">L = lectures watched, B = textbook read, P = previous year questions done, R = revised.</p>' +
        E().chaptersFor(s.id, ex).map(function (c) {
          const m = ST().chapterMarks(c.id);
          const qn = counts['ch:' + c.id] || 0;
          return '<div class="chap">' +
            '<div class="ttl">' + h(c.name) + ' <span class="faint">' + (qn ? qn + ' q' : 'no questions yet') + '</span></div>' +
            '<div class="marks">' +
              ['v', 'b', 'p', 'r'].map(function (f, fi) {
                return '<button data-chap="' + c.id + '" data-field="' + f + '" aria-pressed="' + (m[f] ? 'true' : 'false') + '" title="' + ['Lectures', 'Textbook', 'PYQs', 'Revised'][fi] + '">' + 'LBPR'[fi] + '</button>';
              }).join('') +
              (qn ? '<button class="btn ghost sm" style="width:auto;height:28px" data-practice-ch="' + c.id + '">Quiz</button>' : '') +
            '</div></div>';
        }).join('') + '</div>';

      const commonBlock = '<div style="margin-top:16px"><h3>Works for every subject</h3><div class="reslist">' +
        RES.common.map(function (l) {
          return '<div><span class="k">' + h(l.kind) + '</span><a href="' + h(l.url) + '" target="_blank" rel="noopener">' + h(l.title) + '</a></div>';
        }).join('') + '</div></div>';

      return '<div class="card">' + head + resBlock + chapBlock + commonBlock + '</div>';
    }).join('');

    const intro = '<div class="card"><h1>Subjects and resources</h1>' +
      '<p class="muted" style="margin-top:6px">Every link below is free. The link list, the textbook names and the chapter ranges come from the resource sheet by Anjali (GATE AIR 13), with the chapter mapping credited to Nikhil Dhama (AIR 8, GATE 2021). A few entries for the DS and AI paper are listed by name only \u2014 search for those.</p>' +
      '<div class="row" style="margin-top:8px">' + RES.credits.filter(function (c) { return c.url; }).map(function (c) {
        return '<a href="' + h(c.url) + '" target="_blank" rel="noopener">' + h(c.label) + '</a>';
      }).join(' &nbsp;\u00b7&nbsp; ') + '</div></div>';

    return intro + blocks;
  }

  /* ================= PRACTICE ================= */
  let practiceSel = { subj: '', chs: [], count: 10, instant: true };

  function practiceView() {
    const ex = exam();
    const counts = E().countsFor(ex);
    const subs = E().subjectsFor(ex);
    if (practiceSel.subj && subs.map(function (s) { return s.id; }).indexOf(practiceSel.subj) < 0) {
      practiceSel = { subj: '', chs: [], count: 10, instant: practiceSel.instant };
    }

    const subOpts = ['<option value="">Mixed \u2014 all subjects</option>'].concat(subs.map(function (s) {
      return '<option value="' + s.id + '"' + (practiceSel.subj === s.id ? ' selected' : '') + '>' + h(s.name) + ' (' + (counts[s.id] || 0) + ')</option>';
    })).join('');

    let chapBlock = '';
    if (practiceSel.subj) {
      const chs = E().chaptersFor(practiceSel.subj, ex);
      chapBlock = '<div style="margin-top:14px"><h3>Chapters</h3>' +
        '<p class="faint" style="margin:4px 0 8px">Leave all unticked to cover the whole subject.</p>' +
        chs.map(function (c) {
          const qn = counts['ch:' + c.id] || 0;
          const on = practiceSel.chs.indexOf(c.id) >= 0;
          return '<label class="chap" style="cursor:pointer"><span class="ttl">' +
            '<input type="checkbox" data-ch="' + c.id + '"' + (on ? ' checked' : '') + (qn ? '' : ' disabled') + '> ' +
            h(c.name) + ' <span class="faint">' + qn + ' q</span></span><span></span></label>';
        }).join('') + '</div>';
    }

    const available = E().pool({
      exam: ex,
      subjIds: practiceSel.subj ? [practiceSel.subj] : null,
      chIds: practiceSel.chs.length ? practiceSel.chs : null
    }).length;

    const builder = '<div class="card"><h1>Build a practice set</h1>' +
      '<p class="muted" style="margin-top:6px">Practice mode shows the worked explanation right after each answer. Test mode hides everything until you submit, with a clock and GATE marking.</p>' +
      '<div class="grid two" style="margin-top:16px">' +
        '<label>Subject<br><select id="psub" style="width:100%;margin-top:4px">' + subOpts + '</select></label>' +
        '<label>How many questions<br><input type="number" id="pcount" min="1" max="60" value="' + practiceSel.count + '" style="width:100%;margin-top:4px"></label>' +
      '</div>' + chapBlock +
      '<div class="row" style="margin-top:16px">' +
        '<div class="seg" style="margin:0;max-width:280px">' +
          '<button data-mode="1" aria-pressed="' + (practiceSel.instant ? 'true' : 'false') + '">Practice mode</button>' +
          '<button data-mode="0" aria-pressed="' + (!practiceSel.instant ? 'true' : 'false') + '">Test mode</button>' +
        '</div>' +
        '<span style="flex:1"></span>' +
        '<span class="faint num">' + available + ' available</span>' +
        '<button class="btn" id="pstart"' + (available ? '' : ' disabled') + '>Start</button>' +
      '</div></div>';

    const history = attemptList('quiz', 8, 'Recent practice sets');
    return builder + history;
  }

  /* ================= MOCKS ================= */
  function mocksView() {
    const ex = exam();
    const bps = E().blueprints();
    const cards = Object.keys(bps).map(function (k) {
      const b = bps[k];
      const n = b.apt1 + b.apt2 + b.tech1 + b.tech2;
      const marks = b.apt1 + b.tech1 + 2 * (b.apt2 + b.tech2);
      return '<div class="card" style="margin:0">' +
        '<h3>' + h(b.label) + '</h3>' +
        '<p class="faint" style="margin:6px 0 12px">' + n + ' questions \u00b7 ' + marks + ' marks \u00b7 ' + b.minutes + ' minutes<br>' +
        'Subject mix follows GATE weightage. MCQs carry \u22121/3 negative marking; MSQ and NAT carry none.</p>' +
        '<button class="btn sm" data-mock="' + k + '">Start</button></div>';
    }).join('');

    const gen = '<div class="card"><h1>Mock tests</h1>' +
      '<p class="muted" style="margin-top:6px">Each paper is generated fresh from the question bank, so no two attempts are identical. Sit it in one go, then read every solution.</p>' +
      '<div class="grid three" style="margin-top:16px">' + cards + '</div></div>';

    const ext = '<div class="card"><h2>Free mock tests on the web</h2>' +
      '<div class="reslist" style="margin-top:8px">' + RES.mocks.map(function (m) {
        return '<div><span class="k">' + h(m.kind) + '</span><a href="' + h(m.url) + '" target="_blank" rel="noopener">' + h(m.title) + '</a></div>';
      }).join('') + '</div></div>';

    const pyq = '<div class="card"><h2>Past GATE papers as mocks</h2>' +
      '<p class="faint" style="margin:4px 0 10px">Attempt these under exam conditions. They are the closest thing to the real paper.</p>' +
      '<div class="row">' + RES.pastPapers.map(function (p) {
        return '<a class="tag" style="padding:6px 10px" href="' + h(p.url) + '" target="_blank" rel="noopener">GATE ' + h(p.year) + '</a>';
      }).join('') + '</div></div>';

    return gen + attemptList('mock', 10, 'Your mock attempts') + ext + pyq;
  }

  /* ================= REVISION ================= */
  function revisionView() {
    const ex = exam();
    const wrongIds = ST().wrongIds().filter(function (id) { const q = E().question(id); return q && E().pool({ exam: ex, ids: [id] }).length; });
    const saved = ST().bookmarkIds().filter(function (id) { const q = E().question(id); return q && E().pool({ exam: ex, ids: [id] }).length; });

    function listOf(ids, emptyMsg) {
      if (!ids.length) return '<p class="faint">' + emptyMsg + '</p>';
      return ids.map(function (id) {
        const q = E().question(id);
        const s = E().subject(q.subj);
        return '<div class="chap"><div class="ttl"><span class="tag">' + h(s ? s.name : q.subj) + '</span> ' + h(q.q.slice(0, 120)) + (q.q.length > 120 ? '\u2026' : '') + '</div>' +
          '<div><button class="btn quiet sm" data-drop="' + h(id) + '">Remove</button></div></div>';
      }).join('');
    }

    return '<div class="card"><h1>Revision list</h1>' +
      '<p class="muted" style="margin-top:6px">Questions you got wrong land here automatically and leave once you answer them correctly. Saved questions stay until you remove them.</p>' +
      '<div class="row" style="margin-top:14px">' +
        '<button class="btn" data-revise="wrong"' + (wrongIds.length ? '' : ' disabled') + '>Drill ' + wrongIds.length + ' missed</button>' +
        '<button class="btn ghost" data-revise="saved"' + (saved.length ? '' : ' disabled') + '>Drill ' + saved.length + ' saved</button>' +
      '</div></div>' +
      '<div class="card"><h2>Missed questions</h2>' + listOf(wrongIds, 'Nothing here yet. Wrong answers from any quiz will collect here.') + '</div>' +
      '<div class="card"><h2>Saved questions</h2>' + listOf(saved, 'Use the Save button on any question to keep it for later.') + '</div>';
  }

  /* ================= PROGRESS ================= */
  function attemptList(kind, limit, title) {
    const rows = ST().attempts().filter(function (a) { return !kind || a.kind === kind; }).slice(0, limit);
    if (!rows.length) return '<div class="card"><h2>' + h(title) + '</h2><p class="faint">No attempts recorded yet.</p></div>';
    return '<div class="card"><h2>' + h(title) + '</h2><table class="sheet">' +
      '<thead><tr><th>When</th><th>Set</th><th class="r">Score</th><th class="r hide-sm">Accuracy</th><th class="r hide-sm">Minutes</th></tr></thead><tbody>' +
      rows.map(function (a) {
        return '<tr><td class="faint">' + new Date(a.ts).toLocaleDateString() + '</td>' +
          '<td class="name">' + h(a.label) + '<small>' + (SY.exams[a.exam] ? SY.exams[a.exam].name : a.exam) + ' \u00b7 ' + a.count + ' questions</small></td>' +
          '<td class="r num">' + a.scored + ' / ' + a.max + '</td>' +
          '<td class="r num hide-sm">' + a.accuracy + '%</td>' +
          '<td class="r num hide-sm">' + a.minutes + '</td></tr>';
      }).join('') + '</tbody></table></div>';
  }

  function progressView() {
    const ex = exam();
    const stats = E().subjectStats(ex);
    const rows = E().subjectsFor(ex).map(function (s) {
      const b = stats[s.id] || {};
      const sp = E().subjectPercent(s.id, ex);
      return '<tr><td class="name">' + h(s.name) + '</td>' +
        '<td class="r num">' + sp + '%</td>' +
        '<td class="r num">' + (b.attempted || 0) + '</td>' +
        '<td class="r num">' + (b.right || 0) + '</td>' +
        '<td class="r num">' + (b.wrong || 0) + '</td>' +
        '<td class="r num">' + (b.accuracy === null || b.accuracy === undefined ? '\u2014' : b.accuracy + '%') + '</td></tr>';
    }).join('');

    const days = Object.keys(ST().get('days') || {}).sort().slice(-14);
    const daysBlock = days.length
      ? '<table class="sheet" style="margin-top:8px"><thead><tr><th>Day</th><th class="r">Questions</th><th class="r">Minutes</th></tr></thead><tbody>' +
        days.reverse().map(function (k) {
          const d = ST().get('days')[k];
          return '<tr><td class="faint">' + h(k) + '</td><td class="r num">' + d.q + '</td><td class="r num">' + d.min + '</td></tr>';
        }).join('') + '</tbody></table>'
      : '<p class="faint">No study days logged yet. Finish a quiz and today will appear here.</p>';


    return '<div class="card"><h1>Progress</h1>' +
      '<table class="sheet" style="margin-top:12px"><thead><tr><th>Subject</th><th class="r">Coverage</th>' +
      '<th class="r">Attempted</th><th class="r">Right</th><th class="r">Wrong</th><th class="r">Accuracy</th></tr></thead>' +
      '<tbody>' + rows + '</tbody></table></div>' +
      '<div class="card"><h2>Last two weeks</h2>' + daysBlock + '</div>' +
      attemptList(null, 20, 'All attempts') +
      storageCard() + sqlCard();
  }

  /* ---------- where progress lives ---------- */
  const STORAGE_NOTES = {
    'sqlite-idb':
      'Your progress is a SQLite database running inside this page, written to IndexedDB after ' +
      'every change. It survives closing the tab, the browser and the machine, and no server is ' +
      'involved at any point.',
    'sqlite-session':
      'SQLite is running, but this browser will not let the page keep a file — Chrome blocks ' +
      'IndexedDB on pages opened straight from disk. Progress lasts until you close the tab. ' +
      'Download the database below, or serve the folder over http (VS Code\u2019s Live Server ' +
      'does it in one click) and it will save properly.',
    'json-idb':
      'SQLite could not be downloaded, so progress is being kept in IndexedDB as a single ' +
      'document instead. It is still saved between visits, and it will move itself into SQLite ' +
      'the next time the library loads.',
    memory:
      'This browser is not letting the page store anything, so progress will go when the tab ' +
      'closes. Download a copy before you leave.'
  };

  function storageCard() {
    const mode = GP.db.mode();
    const sqlite = GP.db.usingSqlite();
    const why = GP.db.problem();

    return '<div class="card"><div class="spread"><h2>Your data</h2>' +
      '<span class="tag' + (ST().persistent() ? ' ok' : ' bad') + '">' + h(GP.db.label()) + '</span></div>' +
      '<p class="muted" style="margin-top:8px">' + h(STORAGE_NOTES[mode]) + '</p>' +
      (why && !ST().persistent() ? '<p class="faint">Reported by the browser: ' + h(why) + '</p>' : '') +
      '<div class="row" style="margin-top:12px">' +
        (sqlite ? '<button class="btn ghost sm" id="dbexp">Download database (.sqlite)</button>' : '') +
        (sqlite ? '<label class="btn quiet sm" style="display:inline-block">Load a .sqlite file' +
          '<input type="file" id="dbimp" accept=".sqlite,.db,.sqlite3,application/octet-stream" style="display:none"></label>' : '') +
        '<button class="btn quiet sm" id="expbtn">Export as JSON</button>' +
        '<label class="btn quiet sm" style="display:inline-block">Import JSON' +
          '<input type="file" id="impfile" accept=".json,application/json" style="display:none"></label>' +
        '<button class="btn danger sm" id="resetbtn">Erase everything</button>' +
      '</div>' +
      '<p class="faint" style="margin-top:10px;margin-bottom:0">The .sqlite download is a real ' +
      'database file: open it in DB Browser for SQLite, the sqlite3 command line, Python, or load ' +
      'it back here on another machine.</p></div>';
  }

  /* ---------- run your own SQL over your own progress ---------- */
  const SAMPLE_SQL = [
    ['Weakest subjects',
     "SELECT subject_id, right_count, wrong_count, accuracy\n  FROM v_subject_stats\n WHERE exam = 'EXAM'\n ORDER BY accuracy"],
    ['Recent attempts',
     'SELECT label, scored_marks, max_marks, accuracy, minutes\n  FROM attempts\n ORDER BY finished_at DESC\n LIMIT 10'],
    ['Study days',
     'SELECT day, questions, minutes\n  FROM study_days\n ORDER BY day DESC\n LIMIT 14'],
    ['Hardest chapters',
     'SELECT chapter_id,\n       COUNT(*) AS seen,\n       SUM(correct) AS got_right\n' +
     '  FROM attempt_items\n WHERE skipped = 0\n GROUP BY chapter_id\nHAVING seen > 1\n' +
     ' ORDER BY 1.0 * SUM(correct) / COUNT(*)\n LIMIT 10']
  ];

  function sqlCard() {
    if (!GP.db.usingSqlite()) return '';
    const objects = GP.db.tables();
    const first = SAMPLE_SQL[0][1].replace('EXAM', exam());
    return '<div class="card"><h2>Ask your progress a question</h2>' +
      '<p class="muted" style="margin-top:6px">Reading queries only, run against the database in ' +
      'this page. Tables and views available: ' +
      objects.map(function (o) { return '<code>' + h(o.name) + '</code>'; }).join(', ') + '.</p>' +
      '<div class="picker" style="margin-bottom:10px">' +
        SAMPLE_SQL.map(function (q, i) {
          return '<button class="pill" data-sample="' + i + '">' + h(q[0]) + '</button>';
        }).join('') +
      '</div>' +
      '<textarea id="sqlbox" class="sqlbox" rows="5" spellcheck="false" ' +
        'aria-label="SQL query">' + h(first) + '</textarea>' +
      '<div class="row" style="margin-top:10px"><button class="btn sm" id="sqlrun">Run query</button>' +
      '<span class="faint">Ctrl or Cmd + Enter also runs it.</span></div>' +
      '<div id="sqlout" style="margin-top:14px"></div></div>';
  }

  function renderSqlResult(host, result) {
    if (!result.columns.length) {
      host.innerHTML = '<p class="faint">That query returned nothing.</p>';
      return;
    }
    host.innerHTML = '<table class="sheet"><thead><tr>' +
      result.columns.map(function (c) { return '<th>' + h(c) + '</th>'; }).join('') +
      '</tr></thead><tbody>' +
      result.values.slice(0, 200).map(function (row) {
        return '<tr>' + row.map(function (cell) {
          const empty = cell === null || cell === undefined;
          return '<td class="' + (typeof cell === 'number' ? 'r num' : '') + '">' +
            (empty ? '\u2014' : h(cell)) + '</td>';
        }).join('') + '</tr>';
      }).join('') +
      '</tbody></table>' +
      '<p class="faint" style="margin-top:8px;margin-bottom:0">' + result.values.length +
      ' row(s)' + (result.values.length > 200 ? ', first 200 shown' : '') + '.</p>';
  }

  /* ================= wiring ================= */
  function startQuizFrom(cfg) {
    GP.quiz.start(Object.assign({ exam: exam(), onExit: function () { render(); } }, cfg));
  }

  function weakestSubject() {
    const ex = exam();
    const stats = E().subjectStats(ex);
    let worst = null;
    E().subjectsFor(ex).forEach(function (s) {
      const b = stats[s.id];
      const score = (b && b.accuracy !== null && b.accuracy !== undefined) ? b.accuracy : (100 - E().subjectPercent(s.id, ex));
      if (!worst || score < worst.score) worst = { id: s.id, score: score };
    });
    return worst ? worst.id : null;
  }

  function wire() {
    const v = view();

    // target date
    const t = document.getElementById('target');
    if (t) t.addEventListener('change', function () { ST().set('targetDate', t.value); render(); });

    // nav buttons inside views
    v.querySelectorAll('[data-nav]').forEach(function (el) {
      el.addEventListener('click', function () { location.hash = '#/' + el.getAttribute('data-nav'); });
    });

    // subject accordion
    v.querySelectorAll('[data-toggle]').forEach(function (el) {
      el.addEventListener('click', function () {
        const id = el.getAttribute('data-toggle');
        open[id] = !open[id];
        render();
      });
    });

    // chapter checklist toggles
    v.querySelectorAll('[data-chap]').forEach(function (el) {
      el.addEventListener('click', function (ev) {
        ev.stopPropagation();
        ST().toggleChapter(el.getAttribute('data-chap'), el.getAttribute('data-field'));
        render();
      });
    });

    // practice a subject / chapter
    v.querySelectorAll('[data-practice]').forEach(function (el) {
      el.addEventListener('click', function (ev) {
        ev.stopPropagation();
        const sid = el.getAttribute('data-practice');
        const qs = E().buildQuiz({ exam: exam(), subjIds: [sid], count: 10 });
        startQuizFrom({ kind: 'quiz', label: (E().subject(sid) || {}).name + ' practice', questions: qs, instant: true });
      });
    });
    v.querySelectorAll('[data-practice-ch]').forEach(function (el) {
      el.addEventListener('click', function (ev) {
        ev.stopPropagation();
        const cid = el.getAttribute('data-practice-ch');
        const qs = E().buildQuiz({ exam: exam(), chIds: [cid], count: 10 });
        startQuizFrom({ kind: 'quiz', label: (E().chapter(cid) || {}).name + ' quiz', questions: qs, instant: true });
      });
    });

    // board quick actions
    const sprint = v.querySelector('[data-go-sprint]');
    if (sprint) sprint.addEventListener('click', function () {
      const m = E().buildMock(exam(), 'sprint');
      startQuizFrom({ kind: 'mock', label: 'Sprint test', questions: m.questions, minutes: m.minutes, instant: false });
    });
    const weak = v.querySelector('[data-go-weak]');
    if (weak) weak.addEventListener('click', function () {
      const sid = weakestSubject();
      if (!sid) return;
      const qs = E().buildQuiz({ exam: exam(), subjIds: [sid], count: 10 });
      startQuizFrom({ kind: 'quiz', label: (E().subject(sid) || {}).name + ' practice', questions: qs, instant: true });
    });

    // practice builder
    const psub = document.getElementById('psub');
    if (psub) psub.addEventListener('change', function () {
      practiceSel.subj = psub.value; practiceSel.chs = []; render();
    });
    const pcount = document.getElementById('pcount');
    if (pcount) pcount.addEventListener('change', function () {
      practiceSel.count = Math.max(1, Math.min(60, parseInt(pcount.value, 10) || 10));
    });
    v.querySelectorAll('[data-ch]').forEach(function (el) {
      el.addEventListener('change', function () {
        const id = el.getAttribute('data-ch');
        const at = practiceSel.chs.indexOf(id);
        if (el.checked && at < 0) practiceSel.chs.push(id);
        if (!el.checked && at >= 0) practiceSel.chs.splice(at, 1);
        render();
      });
    });
    v.querySelectorAll('[data-mode]').forEach(function (el) {
      el.addEventListener('click', function () {
        practiceSel.instant = el.getAttribute('data-mode') === '1';
        render();
      });
    });
    const pstart = document.getElementById('pstart');
    if (pstart) pstart.addEventListener('click', function () {
      const qs = E().buildQuiz({
        exam: exam(),
        subjIds: practiceSel.subj ? [practiceSel.subj] : null,
        chIds: practiceSel.chs.length ? practiceSel.chs : null,
        count: practiceSel.count
      });
      if (!qs.length) return;
      const name = practiceSel.subj ? (E().subject(practiceSel.subj) || {}).name : 'Mixed subjects';
      startQuizFrom({
        kind: 'quiz',
        label: name + (practiceSel.instant ? ' practice' : ' test'),
        questions: qs,
        instant: practiceSel.instant,
        minutes: practiceSel.instant ? null : Math.max(5, Math.round(qs.length * 2.5))
      });
    });

    // mocks
    v.querySelectorAll('[data-mock]').forEach(function (el) {
      el.addEventListener('click', function () {
        const m = E().buildMock(exam(), el.getAttribute('data-mock'));
        if (!m.questions.length) return;
        if (m.short) {
          const ok = window.confirm('The question bank is ' + m.short + ' question(s) short of a complete ' +
            m.label.toLowerCase() + ' paper, so this attempt will be that much smaller. Continue?');
          if (!ok) return;
        }
        startQuizFrom({ kind: 'mock', label: m.label + ' mock \u00b7 ' + SY.exams[exam()].code, questions: m.questions, minutes: m.minutes, instant: false });
      });
    });

    // revision
    v.querySelectorAll('[data-revise]').forEach(function (el) {
      el.addEventListener('click', function () {
        const which = el.getAttribute('data-revise');
        const ids = which === 'wrong' ? ST().wrongIds() : ST().bookmarkIds();
        const qs = ids.map(function (id) { return E().question(id); })
                      .filter(function (q) { return q && E().pool({ exam: exam(), ids: [q.id] }).length; });
        if (!qs.length) return;
        startQuizFrom({ kind: 'quiz', label: which === 'wrong' ? 'Missed question drill' : 'Saved question drill', questions: E().shuffle(qs), instant: true });
      });
    });
    v.querySelectorAll('[data-drop]').forEach(function (el) {
      el.addEventListener('click', function () {
        const id = el.getAttribute('data-drop');
        if (ST().isBookmarked(id)) ST().toggleBookmark(id);
        ST().hideFromRevision(id);
        render();
      });
    });

    // data management
    const exp = document.getElementById('expbtn');
    if (exp) exp.addEventListener('click', function () {
      const blob = new Blob([ST().exportJSON()], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'gate-prep-progress-' + ST().todayKey() + '.json';
      a.click();
      URL.revokeObjectURL(a.href);
    });
    const imp = document.getElementById('impfile');
    if (imp) imp.addEventListener('change', function () {
      const f = imp.files && imp.files[0];
      if (!f) return;
      const r = new FileReader();
      r.onload = function () {
        try { ST().importJSON(r.result); render(); window.alert('Progress imported.'); }
        catch (e) { window.alert('That file could not be read as a progress export.'); }
      };
      r.readAsText(f);
    });
    const rst = document.getElementById('resetbtn');
    if (rst) rst.addEventListener('click', function () {
      if (window.confirm('Erase all checklists, attempts and saved questions? This cannot be undone.')) {
        ST().reset().then(render);
      }
    });

    // download the SQLite file itself
    const dbexp = document.getElementById('dbexp');
    if (dbexp) dbexp.addEventListener('click', function () {
      GP.db.flush().then(function () {
        const bytes = ST().exportSqlite();
        if (!bytes) { window.alert('The database is not available in this browser.'); return; }
        const blob = new Blob([bytes], { type: 'application/x-sqlite3' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'gate-prep-' + ST().todayKey() + '.sqlite';
        a.click();
        URL.revokeObjectURL(a.href);
      });
    });

    const dbimp = document.getElementById('dbimp');
    if (dbimp) dbimp.addEventListener('change', function () {
      const file = dbimp.files && dbimp.files[0];
      if (!file) return;
      if (!window.confirm('Replace everything on this browser with the contents of that file?')) {
        dbimp.value = '';
        return;
      }
      file.arrayBuffer().then(function (buffer) {
        return ST().importSqlite(buffer);
      }).then(function () {
        render();
        window.alert('Database loaded.');
      }).catch(function () {
        window.alert('That file could not be opened as a progress database.');
      });
    });

    // the query box
    const sqlbox = document.getElementById('sqlbox');
    const sqlout = document.getElementById('sqlout');
    function runSql() {
      try {
        renderSqlResult(sqlout, GP.db.query(sqlbox.value));
      } catch (err) {
        sqlout.innerHTML = '<p class="banner bad" style="margin:0">' + h(err.message) + '</p>';
      }
    }
    if (sqlbox && sqlout) {
      document.getElementById('sqlrun').addEventListener('click', runSql);
      sqlbox.addEventListener('keydown', function (ev) {
        if ((ev.metaKey || ev.ctrlKey) && ev.key === 'Enter') { ev.preventDefault(); runSql(); }
      });
      v.querySelectorAll('[data-sample]').forEach(function (el) {
        el.addEventListener('click', function () {
          sqlbox.value = SAMPLE_SQL[Number(el.getAttribute('data-sample'))][1].replace('EXAM', exam());
          runSql();
        });
      });
    }
  }

  /* ================= chrome ================= */
  function renderChrome() {
    const r = route();
    document.querySelectorAll('[data-route]').forEach(function (el) {
      el.classList.toggle('on', el.getAttribute('data-route') === r);
    });
    document.querySelectorAll('[data-exam]').forEach(function (el) {
      el.setAttribute('aria-pressed', el.getAttribute('data-exam') === exam() ? 'true' : 'false');
    });
    const th = document.getElementById('themebtn');
    if (th) th.textContent = ST().get('theme') === 'dark' ? 'Light mode' : 'Dark mode';
    document.documentElement.setAttribute('data-theme', ST().get('theme') === 'dark' ? 'dark' : 'light');
  }

  function render() {
    renderChrome();
    const r = route();
    const map = {
      board: boardView, subjects: subjectsView, practice: practiceView,
      mocks: mocksView, revision: revisionView, progress: progressView
    };
    view().innerHTML = (map[r] || boardView)();
    wire();
  }

  function init() {
    // build nav
    const nav = document.getElementById('nav');
    nav.innerHTML = ROUTES.map(function (r) {
      return '<a href="#/' + r.id + '" data-route="' + r.id + '">' + h(r.label) + '</a>';
    }).join('');
    const tabs = document.getElementById('tabbar');
    tabs.innerHTML = ROUTES.map(function (r) {
      return '<a href="#/' + r.id + '" data-route="' + r.id + '">' + h(r.short) + '</a>';
    }).join('');

    document.querySelectorAll('[data-exam]').forEach(function (el) {
      el.addEventListener('click', function () {
        ST().set('exam', el.getAttribute('data-exam'));
        open = {};
        practiceSel = { subj: '', chs: [], count: 10, instant: practiceSel.instant };
        if (GP.quiz.active()) GP.quiz.exit(); else render();
      });
    });

    document.getElementById('themebtn').addEventListener('click', function () {
      ST().set('theme', ST().get('theme') === 'dark' ? 'light' : 'dark');
      renderChrome();
    });

    window.addEventListener('hashchange', function () {
      if (GP.quiz.active()) GP.quiz.exit();
      render();
      window.scrollTo(0, 0);
    });

    if (!location.hash) location.hash = '#/board';
    render();
  }

  /* Every file the page needs, and the global it is supposed to define.
     Checking this first turns "cannot read properties of undefined" into the
     name of the file that is actually missing. */
  const PIECES = [
    ['assets/js/data/syllabus.js', function () { return window.GP_SYLLABUS; }],
    ['assets/js/data/resources.js', function () { return window.GP_RESOURCES; }],
    ['assets/js/data/questions.cse.js', function () { return window.GP_Q_CSE; }],
    ['assets/js/data/questions.math.js', function () { return window.GP_Q_MATH; }],
    ['assets/js/data/questions.da.js', function () { return window.GP_Q_DA; }],
    ['assets/js/db.js', function () { return GP.db; }],
    ['assets/js/store.js', function () { return GP.store; }],
    ['assets/js/engine.js', function () { return GP.engine && GP.engine.daysTo; }],
    ['assets/js/quiz.js', function () { return GP.quiz; }]
  ];

  const TREE = [
    'index.html',
    'assets/css/app.css',
    'assets/js/db.js',
    'assets/js/store.js',
    'assets/js/engine.js',
    'assets/js/quiz.js',
    'assets/js/app.js',
    'assets/js/data/syllabus.js',
    'assets/js/data/resources.js',
    'assets/js/data/questions.cse.js',
    'assets/js/data/questions.math.js',
    'assets/js/data/questions.da.js'
  ];

  function missingPieces() {
    return PIECES.filter(function (p) {
      try { return !p[1](); } catch (e) { return true; }
    }).map(function (p) { return p[0]; });
  }

  function bootFailed(message, missing) {
    const list = missing && missing.length
      ? '<p class="muted">These files did not load, so the board has nothing to work with:</p>' +
        '<ul>' + missing.map(function (f) { return '<li><code>' + h(f) + '</code></li>'; }).join('') + '</ul>' +
        '<p class="muted">Two things cause this. Either the folder structure was not kept when the ' +
        'files were saved, or a file name changed on the way down \u2014 <code>app.js</code> and ' +
        '<code>app.css</code> are easy to mix up. The layout has to be exactly this, with ' +
        '<code>index.html</code> at the top:</p>' +
        '<pre class="sqlbox" style="white-space:pre">' + h(TREE.join('\n')) + '</pre>' +
        '<p class="faint">Open the browser console (F12) and look at the Network tab for red 404s; ' +
        'each one names a file that is in the wrong place.</p>'
      : '<p class="muted">' + h(message) + '</p>' +
        '<p class="faint">Reloading usually fixes it. If it keeps happening, open the folder over ' +
        'http rather than from disk \u2014 in VS Code, right-click <code>index.html</code> and ' +
        'choose Open with Live Server.</p>';

    document.getElementById('view').innerHTML =
      '<div class="card"><h1>The board could not start</h1>' + list +
      (message && missing && missing.length
        ? '<p class="faint">The error was: ' + h(message) + '</p>' : '') +
      '</div>';
  }

  function boot() {
    const missing = missingPieces();
    if (missing.length) {
      bootFailed('', missing);
      return;
    }
    GP.store.open().then(init).catch(function (err) {
      bootFailed(err && err.message ? err.message : String(err), missingPieces());
    });
    // A last save on the way out, in case a tick is still inside the debounce.
    window.addEventListener('pagehide', function () { GP.db.flush(); });
  }

  document.addEventListener('DOMContentLoaded', boot);
})();

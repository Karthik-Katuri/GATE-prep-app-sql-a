/* ============================================================
   quiz.js — runs a practice quiz or a timed mock test
   ============================================================ */

window.GP = window.GP || {};

GP.quiz = (function () {
  const E = () => GP.engine;
  let S = null;              // active session
  let host = null;           // container element
  let tick = null;

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function mmss(ms) {
    if (ms < 0) ms = 0;
    const t = Math.floor(ms / 1000);
    const h = Math.floor(t / 3600);
    const m = Math.floor((t % 3600) / 60);
    const s = t % 60;
    const pad = (n) => String(n).padStart(2, '0');
    return (h ? h + ':' : '') + pad(m) + ':' + pad(s);
  }

  /* ---------- lifecycle ---------- */
  function start(cfg) {
    stopTimer();
    S = {
      kind: cfg.kind || 'quiz',
      exam: cfg.exam,
      label: cfg.label || 'Practice quiz',
      questions: cfg.questions,
      instant: !!cfg.instant,
      minutes: cfg.minutes || null,
      responses: {},
      flags: {},
      revealed: {},
      idx: 0,
      startedAt: Date.now(),
      endsAt: cfg.minutes ? Date.now() + cfg.minutes * 60000 : null,
      finished: false,
      result: null,
      onExit: cfg.onExit || function () {}
    };
    host = document.getElementById('view');
    render();
    if (S.endsAt) startTimer();
  }

  function startTimer() {
    tick = setInterval(function () {
      if (!S || S.finished) return stopTimer();
      const left = S.endsAt - Date.now();
      const el = document.getElementById('clock');
      if (el) {
        el.textContent = mmss(left);
        el.classList.toggle('low', left < 5 * 60000);
      }
      if (left <= 0) { stopTimer(); submit(true); }
    }, 1000);
  }

  function stopTimer() { if (tick) { clearInterval(tick); tick = null; } }

  function exit() {
    stopTimer();
    const cb = S ? S.onExit : null;
    S = null;
    if (cb) cb();
  }

  /* ---------- answering ---------- */
  function setResponse(qid, value) {
    S.responses[qid] = value;
    if (S.instant) S.revealed[qid] = true;
    render();
  }

  function toggleMulti(qid, i) {
    const cur = Array.isArray(S.responses[qid]) ? S.responses[qid].slice() : [];
    const at = cur.indexOf(i);
    if (at >= 0) cur.splice(at, 1); else cur.push(i);
    S.responses[qid] = cur;
    render();
  }

  function go(i) {
    if (i < 0 || i >= S.questions.length) return;
    S.idx = i;
    render();
  }

  function flag() {
    const q = S.questions[S.idx];
    S.flags[q.id] = !S.flags[q.id];
    render();
  }

  /* ---------- submit ---------- */
  function submit(auto) {
    stopTimer();
    const result = E().scoreAll(S.questions, S.responses);
    const minutes = Math.max(1, Math.round((Date.now() - S.startedAt) / 60000));
    const attempt = {
      id: 'a' + Date.now(),
      ts: Date.now(),
      kind: S.kind,
      exam: S.exam,
      label: S.label + (auto ? ' (time up)' : ''),
      minutes: minutes,
      count: S.questions.length,
      scored: result.scored,
      max: result.max,
      correct: result.correct,
      wrong: result.wrong,
      skipped: result.skipped,
      accuracy: result.accuracy,
      items: result.items
    };
    GP.store.addAttempt(attempt);
    GP.store.logStudy(S.questions.length, minutes);
    S.finished = true;
    S.result = result;
    render();
    window.scrollTo(0, 0);
  }

  /* ---------- rendering ---------- */
  function render() {
    if (!S || !host) return;
    host.innerHTML = S.finished ? scorecardHTML() : liveHTML();
    wire();
  }

  function liveHTML() {
    const q = S.questions[S.idx];
    const n = S.questions.length;
    const answeredCount = S.questions.filter(function (x) { return E().answered(x, S.responses[x.id]); }).length;

    const bar = '' +
      '<div class="qbar">' +
        '<b>' + esc(S.label) + '</b>' +
        '<span class="faint num">' + (S.idx + 1) + ' / ' + n + '</span>' +
        (S.endsAt ? '<span class="clock" id="clock">' + mmss(S.endsAt - Date.now()) + '</span>' : '<span class="faint">Untimed</span>') +
        '<span style="flex:1"></span>' +
        '<span class="faint num">' + answeredCount + ' answered</span>' +
        '<button class="btn quiet sm" data-act="exit">Leave</button>' +
        '<button class="btn sm" data-act="submit">Submit</button>' +
      '</div>';

    return bar + '<div class="qcard">' + questionHTML(q, S.idx) + navHTML() + '</div>' + paletteHTML();
  }

  function questionHTML(q, i) {
    const sub = E().subject(q.subj), ch = E().chapter(q.ch);
    const reveal = S.revealed[q.id] && !S.finished;
    const meta = '' +
      '<div class="row" style="gap:6px">' +
        '<span class="tag">' + esc(sub ? sub.name : q.subj) + '</span>' +
        (ch ? '<span class="tag">' + esc(ch.name) + '</span>' : '') +
        '<span class="tag mark2">' + q.marks + ' mark' + (q.marks > 1 ? 's' : '') + '</span>' +
        '<span class="tag">' + q.type.toUpperCase() + '</span>' +
        '<span style="flex:1"></span>' +
        '<button class="btn quiet sm" data-act="bookmark">' + (GP.store.isBookmarked(q.id) ? 'Saved' : 'Save') + '</button>' +
        (S.kind === 'mock' ? '<button class="btn quiet sm" data-act="flag">' + (S.flags[q.id] ? 'Unmark' : 'Mark for review') + '</button>' : '') +
      '</div>';

    const stem = '<div class="qstem"><span class="num faint">Q' + (i + 1) + '.</span> ' + esc(q.q) + '</div>';

    let body = '';
    if (q.type === 'mcq' || q.type === 'msq') {
      body = '<div class="opts">' + q.opts.map(function (o, oi) {
        const chosen = q.type === 'mcq'
          ? S.responses[q.id] === oi
          : Array.isArray(S.responses[q.id]) && S.responses[q.id].indexOf(oi) >= 0;
        let cls = 'opt';
        if (reveal) {
          const isAns = q.type === 'mcq' ? (q.ans === oi) : (q.ans.indexOf(oi) >= 0);
          if (isAns) cls += ' correct';
          else if (chosen) cls += ' wrong';
        }
        return '<button class="' + cls + '" data-opt="' + oi + '" aria-pressed="' + (chosen ? 'true' : 'false') + '"' + (reveal ? ' disabled' : '') + '>' +
          '<span class="key">' + 'ABCD'[oi] + '</span><span>' + esc(o) + '</span></button>';
      }).join('') + '</div>' +
      (q.type === 'msq' ? '<p class="faint" style="margin-top:8px">Multiple answers may be correct. No negative marking, but no partial credit.</p>' : '');
    } else {
      const val = S.responses[q.id] === undefined ? '' : S.responses[q.id];
      body = '<div class="natbox">' +
        '<input type="text" inputmode="decimal" id="natin" value="' + esc(val) + '" placeholder="Type a number" ' + (reveal ? 'disabled' : '') + '>' +
        (reveal ? '' : '<button class="btn sm" data-act="nat">Save</button>') +
      '</div>' +
      '<p class="faint" style="margin-top:8px">Numerical answer. No negative marking.</p>';
    }

    let explain = '';
    if (reveal) {
      const ok = E().isCorrect(q, S.responses[q.id]);
      explain = '<div class="explain"><b>' + (ok ? 'Correct' : 'Not quite') +
        (q.type === 'nat' ? ' \u2014 answer: ' + q.ans : '') + '</b>' + esc(q.exp) + '</div>';
    }

    return meta + stem + body + explain;
  }

  function navHTML() {
    const q = S.questions[S.idx];
    const last = S.idx === S.questions.length - 1;
    const needsReveal = S.instant && !S.revealed[q.id] && q.type === 'msq';
    return '<div class="row" style="margin-top:18px">' +
      '<button class="btn quiet sm" data-act="prev"' + (S.idx === 0 ? ' disabled' : '') + '>Previous</button>' +
      (needsReveal ? '<button class="btn sm" data-act="check">Check answer</button>' : '') +
      '<button class="btn sm" data-act="next"' + (last ? ' disabled' : '') + '>' + (last ? 'Last question' : 'Next') + '</button>' +
      '<span style="flex:1"></span>' +
      (last ? '<button class="btn sm" data-act="submit">Finish and see score</button>' : '') +
    '</div>';
  }

  function paletteHTML() {
    if (S.questions.length < 2) return '';
    return '<div class="card" style="margin-top:14px"><h3>Question palette</h3><div class="palette">' +
      S.questions.map(function (q, i) {
        let cls = '';
        if (E().answered(q, S.responses[q.id])) cls += ' ans';
        if (S.flags[q.id]) cls += ' flag';
        if (i === S.idx) cls += ' cur';
        return '<button class="' + cls.trim() + '" data-go="' + i + '">' + (i + 1) + '</button>';
      }).join('') +
      '</div><p class="faint" style="margin-top:10px">Filled means answered. An amber underline means marked for review.</p></div>';
  }

  function scorecardHTML() {
    const r = S.result;
    const pct = r.max ? Math.round((r.scored / r.max) * 1000) / 10 : 0;
    const subj = {};
    r.items.forEach(function (it) {
      const b = subj[it.subj] = subj[it.subj] || { right: 0, wrong: 0, skip: 0, marks: 0, max: 0 };
      if (it.skipped) b.skip++; else if (it.ok) b.right++; else b.wrong++;
      b.marks += it.gained; b.max += it.marks;
    });

    const head = '<div class="card"><div class="spread"><h1>' + esc(S.label) + '</h1>' +
      '<span class="faint">' + new Date().toLocaleString() + '</span></div>' +
      '<div class="score" style="margin-top:16px">' +
        '<div><b>' + r.scored + '<span class="faint" style="font-size:.9rem"> / ' + r.max + '</span></b><span>Marks scored (' + pct + '%)</span></div>' +
        '<div><b>' + r.accuracy + '%</b><span>Accuracy on attempted</span></div>' +
        '<div><b>' + r.correct + '</b><span>Correct</span></div>' +
        '<div><b>' + r.wrong + '</b><span>Wrong</span></div>' +
        '<div><b>' + r.skipped + '</b><span>Left blank</span></div>' +
      '</div>' +
      '<div class="row" style="margin-top:18px">' +
        '<button class="btn" data-act="exit">Back to the board</button>' +
        '<button class="btn ghost sm" data-act="retry">Retry the ones I got wrong</button>' +
      '</div></div>';

    const rows = Object.keys(subj).map(function (sid) {
      const b = subj[sid], s = E().subject(sid);
      const done = b.right + b.wrong;
      return '<tr><td class="name">' + esc(s ? s.name : sid) + '</td>' +
        '<td class="r num">' + (Math.round(b.marks * 100) / 100) + ' / ' + b.max + '</td>' +
        '<td class="r num">' + b.right + '</td>' +
        '<td class="r num">' + b.wrong + '</td>' +
        '<td class="r num">' + b.skip + '</td>' +
        '<td class="r num">' + (done ? Math.round((b.right / done) * 100) + '%' : '\u2014') + '</td></tr>';
    }).join('');

    const table = '<div class="card"><h2>Subject breakdown</h2><table class="sheet">' +
      '<thead><tr><th>Subject</th><th class="r">Marks</th><th class="r">Right</th><th class="r">Wrong</th><th class="r">Blank</th><th class="r">Accuracy</th></tr></thead>' +
      '<tbody>' + rows + '</tbody></table></div>';

    const review = '<div class="card"><h2>Solutions</h2>' + S.questions.map(function (q, i) {
      const it = r.items[i];
      const state = it.skipped ? '<span class="tag">Blank</span>' : (it.ok ? '<span class="tag ok">Correct</span>' : '<span class="tag bad">Wrong</span>');
      let yours = '\u2014';
      if (!it.skipped) {
        if (q.type === 'mcq') yours = 'ABCD'[it.response] + '. ' + q.opts[it.response];
        else if (q.type === 'msq') yours = it.response.slice().sort().map(function (x) { return 'ABCD'[x]; }).join(', ');
        else yours = String(it.response);
      }
      let right;
      if (q.type === 'mcq') right = 'ABCD'[q.ans] + '. ' + q.opts[q.ans];
      else if (q.type === 'msq') right = q.ans.slice().sort().map(function (x) { return 'ABCD'[x]; }).join(', ');
      else right = String(q.ans);

      return '<div class="review">' +
        '<div class="row" style="gap:6px;margin-bottom:6px">' + state +
          '<span class="tag">' + esc((E().subject(q.subj) || {}).name || q.subj) + '</span>' +
          '<span class="tag mark2">' + it.gained + ' of ' + q.marks + '</span>' +
          '<span style="flex:1"></span>' +
          '<button class="btn quiet sm" data-mark="' + esc(q.id) + '">' + (GP.store.isBookmarked(q.id) ? 'Saved' : 'Save for revision') + '</button>' +
        '</div>' +
        '<div class="read"><span class="num faint">Q' + (i + 1) + '.</span> ' + esc(q.q) + '</div>' +
        '<div class="faint" style="margin-top:6px">Your answer: ' + esc(yours) + ' &nbsp;\u00b7&nbsp; Correct: ' + esc(right) + '</div>' +
        '<div class="explain" style="margin-top:10px"><b>Why</b>' + esc(q.exp) + '</div>' +
      '</div>';
    }).join('') + '</div>';

    return head + table + review;
  }

  /* ---------- events ---------- */
  function wire() {
    host.querySelectorAll('[data-act]').forEach(function (el) {
      el.addEventListener('click', function () {
        const a = el.getAttribute('data-act');
        const q = S.questions[S.idx];
        if (a === 'prev') go(S.idx - 1);
        else if (a === 'next') go(S.idx + 1);
        else if (a === 'flag') flag();
        else if (a === 'bookmark') { GP.store.toggleBookmark(q.id); render(); }
        else if (a === 'check') { S.revealed[q.id] = true; render(); }
        else if (a === 'nat') {
          const input = document.getElementById('natin');
          setResponse(q.id, input ? input.value.trim() : '');
        }
        else if (a === 'submit') {
          const blanks = S.questions.length - S.questions.filter(function (x) { return E().answered(x, S.responses[x.id]); }).length;
          if (blanks && !window.confirm(blanks + ' question(s) are still blank. Submit anyway?')) return;
          submit(false);
        }
        else if (a === 'exit') exit();
        else if (a === 'retry') {
          const bad = S.result.items.filter(function (it) { return !it.ok; }).map(function (it) { return it.qid; });
          if (!bad.length) { window.alert('Nothing to retry \u2014 everything was correct.'); return; }
          const qs = bad.map(function (id) { return E().question(id); });
          const exam = S.exam, onExit = S.onExit;
          start({ kind: 'quiz', exam: exam, label: 'Retry: missed questions', questions: qs, instant: true, onExit: onExit });
        }
      });
    });

    host.querySelectorAll('[data-opt]').forEach(function (el) {
      el.addEventListener('click', function () {
        const q = S.questions[S.idx];
        const i = parseInt(el.getAttribute('data-opt'), 10);
        if (q.type === 'mcq') setResponse(q.id, i); else toggleMulti(q.id, i);
      });
    });

    host.querySelectorAll('[data-go]').forEach(function (el) {
      el.addEventListener('click', function () { go(parseInt(el.getAttribute('data-go'), 10)); });
    });

    host.querySelectorAll('[data-mark]').forEach(function (el) {
      el.addEventListener('click', function () {
        GP.store.toggleBookmark(el.getAttribute('data-mark'));
        el.textContent = GP.store.isBookmarked(el.getAttribute('data-mark')) ? 'Saved' : 'Save for revision';
      });
    });

    const nat = document.getElementById('natin');
    if (nat) {
      nat.addEventListener('keydown', function (ev) {
        if (ev.key === 'Enter') {
          ev.preventDefault();
          setResponse(S.questions[S.idx].id, nat.value.trim());
        }
      });
      nat.addEventListener('blur', function () {
        if (S && !S.finished) S.responses[S.questions[S.idx].id] = nat.value.trim();
      });
    }
  }

  function active() { return !!S; }

  return { start: start, active: active, exit: exit };
})();

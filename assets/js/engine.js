/* ============================================================
   engine.js — question bank, paper building, scoring, progress
   ============================================================ */

window.GP = window.GP || {};

GP.engine = (function () {
  // If syllabus.js did not load, carry on with an empty syllabus so this file
  // still defines GP.engine. app.js checks for the missing pieces at start-up
  // and names the file, which is far more use than a cascade of type errors.
  const SY = window.GP_SYLLABUS || { subjects: [], exams: {} };
  const BANK = []
    .concat(window.GP_Q_CSE || [])
    .concat(window.GP_Q_MATH || [])
    .concat(window.GP_Q_DA || []);

  const byId = {};
  BANK.forEach(function (q) { byId[q.id] = q; });

  const subjectById = {};
  const chapterById = {};
  SY.subjects.forEach(function (s) {
    subjectById[s.id] = s;
    s.chapters.forEach(function (c) {
      chapterById[c.id] = Object.assign({ subject: s.id }, c);
    });
  });

  /* ---------- syllabus helpers ---------- */
  function subjectsFor(exam) {
    return SY.subjects.filter(function (s) { return s.exams.indexOf(exam) >= 0; });
  }

  function chaptersFor(subjectId, exam) {
    const s = subjectById[subjectId];
    if (!s) return [];
    return s.chapters.filter(function (c) {
      return !c.exams || c.exams.indexOf(exam) >= 0;
    });
  }

  function subject(id) { return subjectById[id]; }
  function chapter(id) { return chapterById[id]; }
  function question(id) { return byId[id]; }

  /* Weightage is stored per paper: marks: { cse: n, da: n }.
     Each column is tuned so the whole paper adds up to 100. */
  function marksOf(subjectOrId, exam) {
    const s = typeof subjectOrId === 'string' ? subjectById[subjectOrId] : subjectOrId;
    if (!s || !s.marks) return 0;
    if (typeof s.marks === 'number') return s.marks;       // tolerate the older shape
    return s.marks[exam] || 0;
  }

  function examMarks(exam) {
    return subjectsFor(exam).reduce(function (t, s) { return t + marksOf(s, exam); }, 0);
  }

  /* ---------- question filtering ---------- */
  function eligible(q, exam) {
    const s = subjectById[q.subj];
    if (!s || s.exams.indexOf(exam) < 0) return false;
    const c = chapterById[q.ch];
    if (c && c.exams && c.exams.indexOf(exam) < 0) return false;
    return true;
  }

  function pool(opts) {
    const o = opts || {};
    return BANK.filter(function (q) {
      if (o.exam && !eligible(q, o.exam)) return false;
      if (o.subjIds && o.subjIds.length && o.subjIds.indexOf(q.subj) < 0) return false;
      if (o.chIds && o.chIds.length && o.chIds.indexOf(q.ch) < 0) return false;
      if (o.marks && q.marks !== o.marks) return false;
      if (o.ids && o.ids.indexOf(q.id) < 0) return false;
      return true;
    });
  }

  function countsFor(exam) {
    const out = {};
    BANK.forEach(function (q) {
      if (!eligible(q, exam)) return;
      out[q.subj] = (out[q.subj] || 0) + 1;
      out['ch:' + q.ch] = (out['ch:' + q.ch] || 0) + 1;
    });
    return out;
  }

  /* ---------- random helpers ---------- */
  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function take(list, n) { return shuffle(list).slice(0, n); }

  /* Draw n questions from `list`, biasing the subject mix by weight. */
  function drawWeighted(list, n, weights) {
    const bySubj = {};
    list.forEach(function (q) { (bySubj[q.subj] = bySubj[q.subj] || []).push(q); });
    Object.keys(bySubj).forEach(function (k) { bySubj[k] = shuffle(bySubj[k]); });

    let tickets = [];
    Object.keys(weights).forEach(function (sid) {
      if (!bySubj[sid]) return;
      for (let i = 0; i < weights[sid]; i++) tickets.push(sid);
    });
    tickets = shuffle(tickets);

    const out = [];
    let guard = 0;
    while (out.length < n && guard < n * 40) {
      guard++;
      let picked = null;
      if (tickets.length) {
        const sid = tickets[guard % tickets.length];
        if (bySubj[sid] && bySubj[sid].length) picked = bySubj[sid].pop();
      }
      if (!picked) {
        const left = Object.keys(bySubj).filter(function (k) { return bySubj[k].length; });
        if (!left.length) break;
        picked = bySubj[left[Math.floor(Math.random() * left.length)]].pop();
      }
      out.push(picked);
    }
    return out;
  }

  /* ---------- paper blueprints ---------- */
  const BLUEPRINTS = {
    full: { label: 'Full length', minutes: 180, apt1: 5, apt2: 5, tech1: 25, tech2: 30 },
    half: { label: 'Half length', minutes: 90, apt1: 3, apt2: 2, tech1: 13, tech2: 15 },
    sprint: { label: 'Sprint', minutes: 30, apt1: 2, apt2: 1, tech1: 5, tech2: 4 }
  };

  function blueprints() { return BLUEPRINTS; }

  function buildMock(exam, size) {
    const bp = BLUEPRINTS[size] || BLUEPRINTS.full;
    const techSubjects = subjectsFor(exam).filter(function (s) { return s.id !== 'apt'; });
    const weights = {};
    techSubjects.forEach(function (s) { weights[s.id] = marksOf(s, exam); });

    const apt1 = take(pool({ exam: exam, subjIds: ['apt'], marks: 1 }), bp.apt1);
    const apt2 = take(pool({ exam: exam, subjIds: ['apt'], marks: 2 }), bp.apt2);
    const t1 = drawWeighted(pool({ exam: exam, marks: 1 }).filter(function (q) { return q.subj !== 'apt'; }), bp.tech1, weights);
    const t2 = drawWeighted(pool({ exam: exam, marks: 2 }).filter(function (q) { return q.subj !== 'apt'; }), bp.tech2, weights);

    const items = apt1.concat(t1, apt2, t2);   // 1-mark block first, as in the real paper
    const wanted = bp.apt1 + bp.apt2 + bp.tech1 + bp.tech2;
    return {
      questions: items,
      minutes: bp.minutes,
      label: bp.label,
      short: items.length < wanted ? wanted - items.length : 0
    };
  }

  function buildQuiz(opts) {
    const p = pool({ exam: opts.exam, subjIds: opts.subjIds, chIds: opts.chIds, ids: opts.ids });
    return take(p, Math.min(opts.count || 10, p.length));
  }

  /* ---------- scoring ---------- */
  function isCorrect(q, response) {
    if (response === null || response === undefined || response === '') return false;
    if (q.type === 'mcq') return response === q.ans;
    if (q.type === 'msq') {
      if (!Array.isArray(response)) return false;
      const a = q.ans.slice().sort().join(',');
      const b = response.slice().sort().join(',');
      return a === b;
    }
    if (q.type === 'nat') {
      const v = parseFloat(response);
      if (isNaN(v)) return false;
      const tol = (q.tol === undefined) ? 0.0001 : q.tol;
      return Math.abs(v - q.ans) <= tol + 1e-9;
    }
    return false;
  }

  function answered(q, response) {
    if (response === null || response === undefined || response === '') return false;
    if (q.type === 'msq') return Array.isArray(response) && response.length > 0;
    return true;
  }

  /* GATE marking: MCQ carries negative marking of one third of the
     question's marks. MSQ and NAT carry none. */
  function scoreOne(q, response) {
    if (!answered(q, response)) return { skipped: true, ok: false, marks: 0 };
    const ok = isCorrect(q, response);
    let marks = 0;
    if (ok) marks = q.marks;
    else if (q.type === 'mcq') marks = -(q.marks / 3);
    return { skipped: false, ok: ok, marks: marks };
  }

  function scoreAll(questions, responses) {
    let scored = 0, max = 0, correct = 0, wrong = 0, skipped = 0;
    const items = questions.map(function (q) {
      const r = scoreOne(q, responses[q.id]);
      scored += r.marks;
      max += q.marks;
      if (r.skipped) skipped++; else if (r.ok) correct++; else wrong++;
      return { qid: q.id, subj: q.subj, ch: q.ch, marks: q.marks, ok: r.ok, skipped: r.skipped, gained: r.marks, response: responses[q.id] };
    });
    return {
      scored: Math.round(scored * 100) / 100,
      max: max,
      correct: correct, wrong: wrong, skipped: skipped,
      accuracy: (correct + wrong) ? Math.round((correct / (correct + wrong)) * 1000) / 10 : 0,
      items: items
    };
  }

  /* ---------- progress maths ---------- */
  const FIELDS = ['v', 'b', 'p', 'r'];   // lectures, textbook, PYQs, revision

  function chapterPercent(chapterId) {
    const m = GP.store.chapterMarks(chapterId);
    let n = 0;
    FIELDS.forEach(function (f) { if (m[f]) n++; });
    return (n / FIELDS.length) * 100;
  }

  function subjectPercent(subjectId, exam) {
    const chs = chaptersFor(subjectId, exam);
    if (!chs.length) return 0;
    const total = chs.reduce(function (t, c) { return t + chapterPercent(c.id); }, 0);
    return Math.round(total / chs.length);
  }

  function examPercent(exam) {
    const subs = subjectsFor(exam);
    let num = 0, den = 0;
    subs.forEach(function (s) {
      const w = marksOf(s, exam);
      num += subjectPercent(s.id, exam) * w;
      den += w;
    });
    return den ? Math.round(num / den) : 0;
  }

  /* accuracy per subject across all recorded attempts */
  function subjectStats(exam) {
    const out = {};
    subjectsFor(exam).forEach(function (s) { out[s.id] = { right: 0, wrong: 0, skipped: 0 }; });
    GP.store.attempts().forEach(function (a) {
      if (a.exam !== exam) return;
      (a.items || []).forEach(function (it) {
        const bucket = out[it.subj];
        if (!bucket) return;
        if (it.skipped) bucket.skipped++;
        else if (it.ok) bucket.right++;
        else bucket.wrong++;
      });
    });
    Object.keys(out).forEach(function (k) {
      const b = out[k];
      const done = b.right + b.wrong;
      b.attempted = done + b.skipped;
      b.accuracy = done ? Math.round((b.right / done) * 100) : null;
    });
    return out;
  }

  function daysTo(dateStr) {
    if (!dateStr) return null;
    const target = new Date(dateStr + 'T00:00:00');
    if (isNaN(target.getTime())) return null;
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    return Math.round((target - today) / 86400000);
  }

  return {
    bank: BANK,
    subjectsFor: subjectsFor, chaptersFor: chaptersFor,
    subject: subject, chapter: chapter, question: question,
    marksOf: marksOf, examMarks: examMarks, countsFor: countsFor, pool: pool,
    buildMock: buildMock, buildQuiz: buildQuiz, blueprints: blueprints,
    isCorrect: isCorrect, answered: answered, scoreOne: scoreOne, scoreAll: scoreAll,
    chapterPercent: chapterPercent, subjectPercent: subjectPercent, examPercent: examPercent,
    subjectStats: subjectStats, daysTo: daysTo, shuffle: shuffle,
    fields: FIELDS
  };
})();

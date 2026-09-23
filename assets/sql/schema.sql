-- ============================================================================
--  GATE Prep Board — progress database (runs inside the browser)
--
--  This is the schema SQLite actually creates. It is embedded as a string in
--  assets/js/db.js so the app works straight off the file system, and kept
--  here as the readable copy. Edit db.js if you change it.
--
--  The database holds progress only. The syllabus, the questions and the
--  resource links stay in assets/js/data/*.js, since they are the same for
--  everyone and never change while the app is running.
-- ============================================================================

PRAGMA foreign_keys = ON;

-- Which paper, the target date, the theme. One row per setting.
CREATE TABLE IF NOT EXISTS settings (
    key   TEXT PRIMARY KEY,
    value TEXT NOT NULL
);

-- The four boxes per chapter: lectures, textbook, previous-year questions,
-- revised. A chapter with no row here has nothing ticked.
CREATE TABLE IF NOT EXISTS chapter_progress (
    chapter_id TEXT PRIMARY KEY,
    lectures   INTEGER NOT NULL DEFAULT 0 CHECK (lectures IN (0, 1)),
    book       INTEGER NOT NULL DEFAULT 0 CHECK (book     IN (0, 1)),
    pyqs       INTEGER NOT NULL DEFAULT 0 CHECK (pyqs     IN (0, 1)),
    revised    INTEGER NOT NULL DEFAULT 0 CHECK (revised  IN (0, 1)),
    updated_at TEXT    NOT NULL
);

-- One row per day anything happened. This is what the streak counts.
CREATE TABLE IF NOT EXISTS study_days (
    day       TEXT PRIMARY KEY,            -- 'YYYY-MM-DD', local time
    questions INTEGER NOT NULL DEFAULT 0,
    minutes   INTEGER NOT NULL DEFAULT 0
);

-- A finished quiz or mock.
CREATE TABLE IF NOT EXISTS attempts (
    id             TEXT PRIMARY KEY,
    finished_at    INTEGER NOT NULL,        -- epoch milliseconds
    exam           TEXT    NOT NULL CHECK (exam IN ('cse', 'da')),
    kind           TEXT    NOT NULL,        -- 'quiz' | 'mock'
    label          TEXT    NOT NULL,
    question_count INTEGER NOT NULL,
    minutes        INTEGER NOT NULL DEFAULT 0,
    scored_marks   REAL    NOT NULL DEFAULT 0,
    max_marks      REAL    NOT NULL DEFAULT 0,
    right_count    INTEGER NOT NULL DEFAULT 0,
    wrong_count    INTEGER NOT NULL DEFAULT 0,
    skipped_count  INTEGER NOT NULL DEFAULT 0,
    accuracy       INTEGER
);
CREATE INDEX IF NOT EXISTS idx_attempts_when ON attempts(finished_at DESC);

-- Every question in that attempt, with what was answered and what it scored
-- after negative marking.
CREATE TABLE IF NOT EXISTS attempt_items (
    attempt_id  TEXT    NOT NULL REFERENCES attempts(id) ON DELETE CASCADE,
    question_id TEXT    NOT NULL,
    subject_id  TEXT    NOT NULL,
    chapter_id  TEXT    NOT NULL,
    marks       INTEGER NOT NULL,
    response    TEXT,                       -- JSON: index, array of indices, or number
    correct     INTEGER NOT NULL DEFAULT 0,
    skipped     INTEGER NOT NULL DEFAULT 0,
    gained      REAL    NOT NULL DEFAULT 0,
    PRIMARY KEY (attempt_id, question_id)
);
CREATE INDEX IF NOT EXISTS idx_items_question ON attempt_items(question_id);
CREATE INDEX IF NOT EXISTS idx_items_subject  ON attempt_items(subject_id);

CREATE TABLE IF NOT EXISTS bookmarks (
    question_id TEXT PRIMARY KEY,
    created_at  TEXT NOT NULL
);

-- "Remove from the revision list" without rewriting history: the question
-- stops being listed until it is answered wrong again after this moment.
CREATE TABLE IF NOT EXISTS revision_hidden (
    question_id TEXT PRIMARY KEY,
    hidden_at   INTEGER NOT NULL          -- epoch milliseconds
);

-- --------------------------------------------------------------------- views

-- Each chapter is worth 100%, a quarter per box ticked.
CREATE VIEW IF NOT EXISTS v_chapter_percent AS
SELECT chapter_id,
       (lectures + book + pyqs + revised) * 25 AS percent
FROM   chapter_progress;

-- The most recent verdict on every question that was actually answered.
-- Answer a missed question correctly and it drops out of the revision list
-- on its own, with no bookkeeping anywhere else.
CREATE VIEW IF NOT EXISTS v_latest_verdict AS
SELECT question_id, correct, finished_at
FROM (
    SELECT ai.question_id,
           ai.correct,
           a.finished_at,
           ROW_NUMBER() OVER (PARTITION BY ai.question_id
                              ORDER BY a.finished_at DESC, ai.rowid DESC) AS rn
    FROM   attempt_items ai
    JOIN   attempts a ON a.id = ai.attempt_id
    WHERE  ai.skipped = 0
)
WHERE rn = 1;

-- What the Revision page shows: last answered wrong, and not dismissed since.
CREATE VIEW IF NOT EXISTS v_revision_list AS
SELECT v.question_id, v.finished_at
FROM   v_latest_verdict v
LEFT   JOIN revision_hidden h ON h.question_id = v.question_id
WHERE  v.correct = 0
  AND  (h.hidden_at IS NULL OR h.hidden_at < v.finished_at);

-- Right, wrong, blank and accuracy per subject, across every attempt.
CREATE VIEW IF NOT EXISTS v_subject_stats AS
SELECT a.exam,
       ai.subject_id,
       SUM(CASE WHEN ai.skipped = 0 AND ai.correct = 1 THEN 1 ELSE 0 END) AS right_count,
       SUM(CASE WHEN ai.skipped = 0 AND ai.correct = 0 THEN 1 ELSE 0 END) AS wrong_count,
       SUM(ai.skipped)                                                    AS skipped_count,
       ROUND(100.0 * SUM(CASE WHEN ai.skipped = 0 AND ai.correct = 1 THEN 1 ELSE 0 END)
             / NULLIF(SUM(CASE WHEN ai.skipped = 0 THEN 1 ELSE 0 END), 0)) AS accuracy
FROM   attempt_items ai
JOIN   attempts a ON a.id = ai.attempt_id
GROUP  BY a.exam, ai.subject_id;

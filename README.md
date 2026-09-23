# GATE Prep Board — static build with a SQL database

The same app as the plain HTML/CSS/JS version: free resources, chapter-wise quizzes, generated mock tests and a progress tracker for **GATE CS & IT** and **GATE Data Science & AI**. No login, no server, no build step.

The difference is where progress goes. Instead of a JSON blob in `localStorage`, it lives in a **real SQLite database running inside the page**, with proper tables, foreign keys and views. The database file is stored in IndexedDB, and you can download it as a `.sqlite` file and open it in any SQL tool.

Resource links come from the free resource sheet by **Anjali (GATE AIR 13)**, with textbook chapter mapping credited to **Nikhil Dhama (AIR 8, GATE 2021)**.

---

## Run it

Serve the folder over http and open it. In VS Code: open the folder, right-click `index.html`, **Open with Live Server**.

Double-clicking `index.html` also works, but Chrome refuses IndexedDB on `file://` pages, so progress will only last as long as the tab. The app detects that, says so on the Progress page, and offers you the download. Firefox and Safari are happier with `file://`. Any static host — GitHub Pages, Netlify, a folder behind nginx — works with no configuration.

SQLite itself is fetched once from a CDN (`sql.js`, about 1.2 MB of WebAssembly) and cached by the browser after that. If the fetch fails, see *When SQLite cannot load* below.

## Where progress goes

```
your ticks and attempts
        │
   store.js            keeps one copy in memory, so the screen never waits
        │
    db.js              folds it into SQLite, then saves the file
        │
  SQLite (wasm)  ──►   IndexedDB: "progress.sqlite"
        │
        └────────────► Download as .sqlite whenever you like
```

Writes are collapsed: ticking four boxes in a row is one save, 400 ms after the last one. A `pagehide` handler flushes anything still waiting, so closing the tab does not lose the last tick.

Four storage modes, chosen automatically. The Progress page always names the one in use.

| Mode | When | What it means |
|---|---|---|
| `sqlite-idb` | Normal case, served over http | SQLite in the page, file saved in IndexedDB. Survives closing the browser. |
| `sqlite-session` | IndexedDB blocked (Chrome on `file://`) | SQLite runs, nothing is saved. Download the database before you close the tab. |
| `json-idb` | `sql.js` could not be downloaded | Progress kept in IndexedDB as one document. Still saved between visits, and it migrates itself into SQLite the next time the library loads. |
| `memory` | Neither is available | The session works; nothing persists. |

No mode uses `localStorage`.

### Moving progress

- **Download database (.sqlite)** on the Progress page gives you the actual file. Open it in DB Browser for SQLite, the `sqlite3` CLI, Python's `sqlite3`, DataGrip — anything that reads SQLite.
- **Load a .sqlite file** replaces what is in this browser with that file, so you can carry progress on a USB stick or between machines.
- **Export/Import as JSON** is still there, and it reads files from the older `localStorage` build, so nothing is stranded.

## Ask your progress a question

The Progress page has a query box that runs read-only SQL against your own data — `SELECT`, `WITH`, `PRAGMA` and `EXPLAIN`, one statement at a time. Four examples are one click away. A couple worth trying:

```sql
SELECT subject_id, right_count, wrong_count, accuracy
  FROM v_subject_stats
 WHERE exam = 'cse'
 ORDER BY accuracy;
```

```sql
SELECT chapter_id, COUNT(*) AS seen, SUM(correct) AS got_right
  FROM attempt_items
 WHERE skipped = 0
 GROUP BY chapter_id
HAVING seen > 1
 ORDER BY 1.0 * SUM(correct) / COUNT(*)
 LIMIT 10;
```

## The database

The schema is in `assets/sql/schema.sql` to read, and embedded as a string in `assets/js/db.js` because a page opened from disk cannot fetch a local file. **Change both if you change either.**

Tables: `settings`, `chapter_progress`, `study_days`, `attempts`, `attempt_items`, `bookmarks`, `revision_hidden`.

Views:

- `v_chapter_percent` — 25% per box ticked
- `v_latest_verdict` — the most recent verdict on each question that was actually answered
- `v_revision_list` — last answered wrong, and not dismissed since. This is why answering a missed question correctly removes it from the revision list with no bookkeeping anywhere
- `v_subject_stats` — right, wrong, blank and accuracy per subject

Only progress lives in the database. The syllabus, the 239 questions and the resource links stay in `assets/js/data/*.js`, since they are identical for everyone and never change while the app is running.

The whole snapshot is rewritten inside one transaction on each save rather than patched row by row. At a few hundred rows that is instant, and it makes it impossible for the tables and the screen to drift apart.

## Tests

Needs Node 18+ for `store.test.js` and Node 22+ for `db.test.js`, which stands `node:sqlite` in for `sql.js`. No network, no install.

```bash
cd tests
node store.test.js
node db.test.js
node boot.test.js
```

`boot.test.js` loads the page's scripts in a fake browser and leaves one out at a time, checking the start-up message names the file that is actually missing.

Between them they check: defaults on a fresh database, ticks and settings reaching the tables, streaks, the revision list clearing itself when a question is answered right and coming back if it is missed again, dismissals, bookmarks, JSON export/import including files from the older build, a full snapshot round trip through real SQL (answer types, negative marks and all), the views, that the query box refuses writes and multiple statements, and every one of the four storage modes including the fallback migrating itself into SQLite.

## If the board will not start

It names the file that did not load. Almost always the folder structure was not kept when the files were saved, or a name changed on the way down — `app.js` and `app.css` are easy to confuse, and so are the two `db`/`store` pairs if you have the FastAPI build sitting nearby. The layout has to be exactly the tree below, with `index.html` at the top level. Opening the browser console (F12) and looking at the Network tab shows a red 404 for every file in the wrong place.

## Files

```
gate-prep-sql/
├── index.html                    shell, navigation, script loading
├── assets/
│   ├── css/app.css               design tokens, light and dark
│   ├── sql/schema.sql            readable copy of the schema
│   └── js/
│       ├── db.js                 SQLite + IndexedDB, the four modes, the query box
│       ├── store.js              progress API the rest of the app calls
│       ├── engine.js             filtering, mock blueprints, scoring, progress maths
│       ├── quiz.js               quiz runtime, timer, palette, scorecard
│       ├── app.js                router and the six views
│       └── data/                 syllabus, resources, 239 questions
└── tests/                        node tests for db.js and store.js
```

Scripts load in order from `index.html`: data, then `db`, `store`, `engine`, `quiz`, `app`. Add a data file before `db.js`.

## Editing the content

Unchanged from the static build. Questions go in `assets/js/data/questions.*.js`:

```js
{ id:'os17', subj:'os', ch:'os-sched', marks:2, type:'mcq',
  q:'Question text',
  opts:['A','B','C','D'],
  ans:2,                        // zero-based index; array for msq; number for nat
  exp:'Why that answer is right.' },
```

`subj` and `ch` must exist in `syllabus.js`. Subject weightage is `marks: { cse: 8, da: 5 }`, and each paper's column is tuned to total 100.

## Notes

- Nothing is sent anywhere. There is no server in this build, and no network call at all beyond the fonts and the SQLite library.
- IndexedDB is per-browser and per-profile, like any site's storage. Clearing site data erases it, so download the `.sqlite` now and then.
- If you would rather progress lived on a server so one person can pick up on any device, the `gate-prep-fullstack` build does exactly that: the same app on FastAPI with server-side SQL and a transfer code instead of a login.

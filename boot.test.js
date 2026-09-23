/* Loads the page's scripts in a browser-like sandbox and checks the start-up
 * preflight names the right file when one is left out. */
const vm = require('vm'), fs = require('fs');
let fails = [];
const check = (l, c, d='') => { console.log((c?'  ok   ':'  FAIL ')+l+(c?'':' '+JSON.stringify(d))); if(!c) fails.push(l); };

const ORDER = ['data/syllabus.js','data/resources.js','data/questions.cse.js','data/questions.math.js',
               'data/questions.da.js','db.js','store.js','engine.js','quiz.js','app.js'];

function run(skip) {
  let html = '', domReady = null;
  const sandbox = { console: { log(){}, warn(){}, error(){} }, setTimeout, clearTimeout, Date, Math, JSON,
    Object, Array, String, Number, Boolean, Promise, RegExp, Error, TypeError, Uint8Array, Blob: function(){},
    isNaN, parseInt, parseFloat, URL: { createObjectURL: () => '', revokeObjectURL(){} } };
  sandbox.addEventListener = function () {};
  sandbox.scrollTo = function () {};
  sandbox.confirm = function () { return true; };
  sandbox.alert = function () {};
  sandbox.window = sandbox;
  sandbox.location = { hash: '' };
  sandbox.indexedDB = undefined;                 // no storage: memory mode
  const el = () => ({ innerHTML: '', textContent: '', addEventListener(){}, setAttribute(){},
                      classList: { toggle(){} }, querySelectorAll: () => [], files: null, value: '' });
  sandbox.document = {
    createElement: el, head: { appendChild(){} }, documentElement: { setAttribute(){}, dataset: {} },
    addEventListener: (name, fn) => { if (name === 'DOMContentLoaded') domReady = fn; },
    querySelectorAll: () => [],
    getElementById: (id) => {
      if (id === 'view') return { set innerHTML(v) { html = v; }, get innerHTML() { return html; },
                                  querySelectorAll: () => [], addEventListener(){} };
      return el();
    },
  };
  const ctx = vm.createContext(sandbox);
  const loaded = [];
  for (const f of ORDER) {
    if (f === skip) continue;
    try { vm.runInContext(fs.readFileSync(__dirname + '/../assets/js/' + f, 'utf8'), ctx, { filename: f }); loaded.push(f); }
    catch (e) { loaded.push(f + ' (threw: ' + e.message + ')'); }
  }
  if (domReady) domReady();
  return { html: () => html, sandbox };
}

// everything present
let r = run(null);
check('all files present: engine is built', typeof r.sandbox.GP.engine.daysTo === 'function');
setTimeout(() => {
  check('all files present: no failure card', !/could not start/.test(r.html()), r.html().slice(0, 120));

  // each data file missing in turn
  [['data/syllabus.js', 'assets/js/data/syllabus.js'],
   ['data/questions.da.js', 'assets/js/data/questions.da.js'],
   ['engine.js', 'assets/js/engine.js'],
   ['db.js', 'assets/js/db.js']].forEach(function (pair) {
    const out = run(pair[0]).html();
    check('missing ' + pair[0] + ' is named', out.includes(pair[1]) && /could not start/.test(out),
          out.slice(0, 200));
    check('missing ' + pair[0] + ' shows the folder layout', out.includes('index.html'));
  });

  // a missing data file must not be reported as a missing engine.js: check the
  // list of culprits, not the folder layout printed underneath it
  const culprits = (run('data/syllabus.js').html().match(/<ul>[\s\S]*?<\/ul>/) || [''])[0];
  check('one missing file lists exactly one culprit',
    culprits.includes('syllabus.js') && !culprits.includes('engine.js')
    && (culprits.match(/<li>/g) || []).length === 1, culprits);

  console.log();
  console.log(fails.length ? 'FAILED: ' + fails.join(', ') : 'start-up checks passed');
  process.exit(fails.length ? 1 : 0);
}, 30);

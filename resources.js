/* ============================================================
   resources.js
   Links marked source:'sheet' are taken verbatim from
   "GATE CSE Free Resources" by Anjali (GATE AIR 13).
   Relevant-chapter mapping in that sheet is credited to
   Nikhil Dhama (AIR 8, GATE 2021).

   Links marked source:'named' are titles only, no URL, because
   the URL could not be verified offline. Search the title.
   ============================================================ */

window.GP_RESOURCES = {
  credits: [
    { label: 'Resource sheet by Anjali (GATE AIR 13)', url: 'https://www.linkedin.com/in/anjali-chauhan24/' },
    { label: 'Anjali on YouTube', url: 'https://www.youtube.com/@anjc24' },
    { label: 'Relevant chapter mapping by Nikhil Dhama (AIR 8, GATE 2021)', url: '' }
  ],

  /* common to every subject */
  common: [
    { kind: 'PYQ bank', title: 'GATE Overflow topicwise previous year questions (PDF)', url: 'https://github.com/GATEOverflow/GO-PDFs/releases/tag/gatecse-2025', source: 'sheet' },
    { kind: 'Notes', title: 'Notes from standard books for GATE CSE (Drive folder)', url: 'https://drive.google.com/drive/folders/1oGCYictHLqXE1skdkJ8PnaefBnLrRXwG', source: 'sheet' },
    { kind: 'Notes', title: 'Handwritten notes (Ankur Gupta, GitHub)', url: 'https://github.com/baquer/GATE-and-CSE-Resources-for-Students/blob/master/AnkurGuptaNotes/CompilerDesign.pdf', source: 'sheet' },
    { kind: 'Notes', title: 'Short notes and important questions (video)', url: 'https://youtu.be/9HAxjug36wA', source: 'sheet' }
  ],

  bySubject: {
    os: {
      book: 'Operating Systems — Silberschatz, Gagne, Galvin (International 9E)',
      chapters: '2.1–2.5, 3, 4.1–4.3, 4.6, 5.1–5.3, 6.1–6.10, 7, 8.1–8.6, 9.1–9.6, 9.9, 10, 11.1–11.5, 12.1–12.6',
      links: [
        { kind: 'Lectures', title: 'Operating Systems playlist', url: 'https://youtube.com/playlist?list=PLG9aCp4uE-s17rFjWM8KchGlffXgOzzVP', source: 'sheet' },
        { kind: 'Revision', title: 'Revision and PYQ video solutions', url: 'https://youtube.com/playlist?list=PLIPZ2_p3RNHixlIaarIXGPy-eggJQMxd_', source: 'sheet' },
        { kind: 'NPTEL', title: 'NPTEL Operating Systems', url: 'https://youtube.com/playlist?list=PLyqSpQzTE6M9SYI5RqwFYtFYab94gJpWk', source: 'sheet' },
        { kind: 'Test', title: 'GO 2017 OS Test 1', url: 'https://gateoverflow.in/exam/32/go2017-os-1', source: 'sheet' },
        { kind: 'Test', title: 'GO 2017 OS Test 2', url: 'https://gateoverflow.in/exam/32/go2017-os-2', source: 'sheet' },
        { kind: 'Test', title: 'GO 2017 OS Test 3', url: 'https://gateoverflow.in/exam/32/go2017-os-3', source: 'sheet' },
        { kind: 'Test', title: 'OS previous GATE test 2', url: 'https://gateoverflow.in/exam/148/operating-systems-gate2020-previous-gate-2', source: 'sheet' }
      ]
    },
    coa: {
      book: 'Computer Organisation — Carl Hamacher  •  Computer Organization and Design — Patterson & Hennessy (5E)',
      chapters: 'Hamacher: 1.6, 2.1–2.5, 2.9, 2.10, 4.1–4.2, 4.4–4.6, 5.1, 5.2, 5.4–5.8, 5.9.1, 6.1–6.4, 6.7.1, 7, 8.1–8.5, 8.8  •  Patterson: 1, 2, 4.1–4.9, 4.14, 5.1–5.10',
      links: [
        { kind: 'Lectures', title: 'COA playlist', url: 'https://youtube.com/playlist?list=PLG9aCp4uE-s0xddCBjwMDnEVyc523WbA2', source: 'sheet' },
        { kind: 'Revision', title: 'Revision and PYQ video solutions', url: 'https://youtube.com/playlist?list=PLG9aCp4uE-s2qCKKu2XD3zDK-NFEvE91n', source: 'sheet' },
        { kind: 'NPTEL', title: 'NPTEL COA', url: 'https://youtube.com/playlist?list=PLgHucKw979AvcnTpPNZMZyORdL5HvTr9m', source: 'sheet' },
        { kind: 'NPTEL', title: 'NPTEL COA (alternate)', url: 'https://youtube.com/playlist?list=PL2F82ECDF8BB71B0C', source: 'sheet' },
        { kind: 'Test', title: 'Computer architecture test 1', url: 'https://gateoverflow.in/exam/46/computer-architecture', source: 'sheet' },
        { kind: 'Test', title: 'Computer architecture test 2', url: 'https://gateoverflow.in/exam/83/computer-architecture-2', source: 'sheet' },
        { kind: 'Test', title: 'CO previous GATE 1', url: 'https://gateoverflow.in/exam/153/co-and-architecture-gate2020-previous-gate-1', source: 'sheet' },
        { kind: 'Test', title: 'CO previous GATE 2', url: 'https://gateoverflow.in/exam/154/co-and-architecture-gate2020-previous-gate-2', source: 'sheet' },
        { kind: 'Test', title: 'CO previous GATE 3', url: 'https://gateoverflow.in/exam/168/co-and-architecture-gate2020-previous-gate-3', source: 'sheet' },
        { kind: 'Test', title: 'CO previous GATE 4', url: 'https://gateoverflow.in/exam/169/co-and-architecture-gate2020-previous-gate-4', source: 'sheet' }
      ]
    },
    cn: {
      book: 'Data Communications and Networking — Behrouz A. Forouzan (5E)',
      chapters: '1.1–1.3, 2, 3.6, 8–10, 11.1–11.2, 12, 13.1–13.2, 17.1, 18–19.2, 20–21.2, 23–24.3, 25.1–25.2, 26',
      links: [
        { kind: 'Lectures', title: 'Computer Networks playlist', url: 'https://youtube.com/playlist?list=PLC36xJgs4dxHT-TxTy3U1slr5RaBJGaLd', source: 'sheet' },
        { kind: 'Revision', title: 'Revision and PYQ video solutions', url: 'https://youtube.com/playlist?list=PLIPZ2_p3RNHim3NUSNOb7ffyhaE5MSkmE', source: 'sheet' },
        { kind: 'NPTEL', title: 'NPTEL Computer Networks', url: 'https://youtube.com/playlist?list=PLbRMhDVUMngf-peFloB7kyiA40EptH1up', source: 'sheet' },
        { kind: 'Lectures', title: 'Jim Kurose networking videos', url: 'https://www.youtube.com/@JimKurose/videos', source: 'sheet' },
        { kind: 'Test', title: 'Computer networks test', url: 'https://gateoverflow.in/exam/49/computer-networks', source: 'sheet' },
        { kind: 'Test', title: 'CN previous GATE 1', url: 'https://gateoverflow.in/exam/143/computer-networks-gate2020-previous-gate-1', source: 'sheet' },
        { kind: 'Test', title: 'CN previous GATE 2', url: 'https://gateoverflow.in/exam/144/computer-networks-gate2020-previous-gate-2', source: 'sheet' }
      ]
    },
    cd: {
      book: 'Compilers: Principles, Techniques and Tools — Aho, Lam, Sethi, Ullman',
      chapters: 'Follow the lecture order; lexical analysis through data flow analysis',
      links: [
        { kind: 'Lectures', title: 'Compiler Design playlist', url: 'https://youtube.com/playlist?list=PLEbnTDJUr_IcPtUXFy2b1sGRPsLFMghhS', source: 'sheet' },
        { kind: 'Lectures', title: 'Compiler Design playlist (alternate)', url: 'https://youtube.com/playlist?list=PLIPZ2_p3RNHj8kDhh1OCIzEha8qhzfe1f', source: 'sheet' },
        { kind: 'Revision', title: 'Revision and PYQ video solutions', url: 'https://youtube.com/playlist?list=PLIPZ2_p3RNHjy3eH_qRImIs5dVUTpr9ga', source: 'sheet' },
        { kind: 'NPTEL', title: 'NPTEL Compiler Design', url: 'https://youtube.com/playlist?list=PL54i8TI-dREaHgsBFNalWnz-bC9CZkOBb', source: 'sheet' },
        { kind: 'Course', title: 'Stanford Compilers by Prof. Alex Aiken', url: 'https://www.edx.org/learn/computer-science/stanford-university-compilers', source: 'sheet' },
        { kind: 'Test', title: 'GO 2019 parsing test', url: 'https://gateoverflow.in/exam/139/go2019-compiler1-parsing', source: 'sheet' },
        { kind: 'Test', title: 'Compiler design test', url: 'https://gateoverflow.in/exam/47/compiler-design', source: 'sheet' },
        { kind: 'Test', title: 'Compilers previous GATE 1', url: 'https://gateoverflow.in/exam/151/compilers-gate2020-previous-gate-1', source: 'sheet' },
        { kind: 'Test', title: 'Compilers previous GATE 2', url: 'https://gateoverflow.in/exam/152/compilers-gate2020-previous-gate-2', source: 'sheet' },
        { kind: 'Test', title: 'Compilers previous GATE 3', url: 'https://gateoverflow.in/exam/167/compilers-gate2020-previous-gate-3', source: 'sheet' }
      ]
    },
    toc: {
      book: 'An Introduction to Formal Languages and Automata — Peter Linz (6E)',
      chapters: '1.2, 1.3, 2–12, Appendix A',
      links: [
        { kind: 'Lectures', title: 'Theory of Computation playlist', url: 'https://youtube.com/playlist?list=PLC36xJgs4dxGvebewU4z2CZYo-8nB93E7', source: 'sheet' },
        { kind: 'Revision', title: 'Revision and PYQ video solutions', url: 'https://youtube.com/playlist?list=PLIPZ2_p3RNHhXeEdbXsi34ePvUjL8I-Q9', source: 'sheet' },
        { kind: 'NPTEL', title: 'NPTEL Theory of Computation', url: 'https://youtube.com/playlist?list=PLbRMhDVUMngcwWkzVTm_kFH6JW4JCtAUM', source: 'sheet' },
        { kind: 'Test', title: 'TOC test 1', url: 'https://gateoverflow.in/exam/48/theory-of-computation', source: 'sheet' },
        { kind: 'Test', title: 'TOC test 2', url: 'https://gateoverflow.in/exam/84/theory-of-computation-test-2', source: 'sheet' },
        { kind: 'Test', title: 'TOC previous GATE 1', url: 'https://gateoverflow.in/exam/86/theory-of-computation-previous-gate-1', source: 'sheet' },
        { kind: 'Test', title: 'TOC previous GATE 2', url: 'https://gateoverflow.in/exam/149/theory-of-computation-gate2020-previous-gate-1', source: 'sheet' },
        { kind: 'Test', title: 'TOC previous GATE 3', url: 'https://gateoverflow.in/exam/150/theory-of-computation-gate2020-previous-gate-2', source: 'sheet' },
        { kind: 'Test', title: 'TOC previous GATE 4', url: 'https://gateoverflow.in/exam/170/theory-of-computation-gate2020-previous-gate-3', source: 'sheet' },
        { kind: 'Test', title: 'TOC previous GATE 5', url: 'https://gateoverflow.in/exam/171/theory-of-computation-gate2020-previous-gate-4', source: 'sheet' }
      ]
    },
    cp: {
      book: 'The C Programming Language — Kernighan and Ritchie (2E)',
      chapters: '1–8',
      links: [
        { kind: 'Lectures', title: 'C programming playlist', url: 'https://youtube.com/playlist?list=PLbE3-5DBkMUkATaUFgDIpBDbfnym0qvsQ', source: 'sheet' },
        { kind: 'NPTEL', title: 'NPTEL C programming', url: 'https://youtube.com/playlist?list=PLEAYkSg4uSQ2k6GwNhpgSHodGT8wfvgwu', source: 'sheet' },
        { kind: 'Test', title: 'GO 2017 programming 1', url: 'https://gateoverflow.in/exam/39/go2017-programming-1', source: 'sheet' },
        { kind: 'Test', title: 'Programming test 2', url: 'https://gateoverflow.in/exam/80/go_programming-test-2', source: 'sheet' },
        { kind: 'Test', title: 'Programming previous GATE 1', url: 'https://gateoverflow.in/exam/181/programming-gate2020-previous-gate-1', source: 'sheet' },
        { kind: 'Test', title: 'Programming previous GATE 2', url: 'https://gateoverflow.in/exam/182/programming-gate2020-previous-gate-2', source: 'sheet' },
        { kind: 'Book', title: 'Python Crash Course / official Python tutorial — for the DA paper', url: '', source: 'named' }
      ]
    },
    ds: {
      book: 'Data Structures and Algorithms Made Easy — Narasimha Karumanchi',
      chapters: 'All chapters up to graphs',
      links: [
        { kind: 'Lectures', title: 'Data structures playlist', url: 'https://youtube.com/playlist?list=PLIC0AxWOdm5BvHpI_AtPqqjoADnSqcYgp', source: 'sheet' },
        { kind: 'Revision', title: 'Revision and PYQ video solutions', url: 'https://youtube.com/playlist?list=PLG9aCp4uE-s3Rs4AjzG0VcXQCggmOJJ6W', source: 'sheet' },
        { kind: 'NPTEL', title: 'NPTEL Data Structures', url: 'https://youtube.com/playlist?list=PLBF3763AF2E1C572F', source: 'sheet' },
        { kind: 'Test', title: 'Data structure set 2', url: 'https://gateoverflow.in/exam/52/data-structure-set-2', source: 'sheet' },
        { kind: 'Test', title: 'DS previous GATE 1', url: 'https://gateoverflow.in/exam/177/data-structures-gate2020-previous-gate-1', source: 'sheet' },
        { kind: 'Test', title: 'DS previous GATE 2', url: 'https://gateoverflow.in/exam/178/data-structures-gate2020-previous-gate-2', source: 'sheet' },
        { kind: 'Test', title: 'DS previous GATE 3', url: 'https://gateoverflow.in/exam/179/data-structures-gate2020-previous-gate-3', source: 'sheet' },
        { kind: 'Test', title: 'DS previous GATE 4', url: 'https://gateoverflow.in/exam/180/data-structures-gate2020-previous-gate-4', source: 'sheet' }
      ]
    },
    algo: {
      book: 'Introduction to Algorithms — CLRS (3E)  •  Algorithm Design — Kleinberg and Tardos',
      chapters: 'CLRS: 1–4, 6–9, 10, 11.1–11.4, 12.1–12.3, 15, 16.1–16.3, 17, 21–25.2  •  Kleinberg: 1–6',
      links: [
        { kind: 'Lectures', title: 'Algorithms playlist', url: 'https://youtube.com/playlist?list=PLAXnLdrLnQpRcveZTtD644gM9uzYqJCwr', source: 'sheet' },
        { kind: 'Revision', title: 'Revision and PYQ video solutions', url: 'https://youtube.com/playlist?list=PLIPZ2_p3RNHjUCHdJp-_soSSmhgmO4i0T', source: 'sheet' },
        { kind: 'NPTEL', title: 'NPTEL Algorithms', url: 'https://youtube.com/playlist?list=PL7DC83C6B3312DF1E', source: 'sheet' },
        { kind: 'Test', title: 'GO 2017 algorithms 1', url: 'https://gateoverflow.in/exam/37/go2017-algorithms-1', source: 'sheet' },
        { kind: 'Test', title: 'Algorithm test 2', url: 'https://gateoverflow.in/exam/82/algorithm-test-2', source: 'sheet' },
        { kind: 'Test', title: 'Algorithms previous GATE 1', url: 'https://gateoverflow.in/exam/66/algorithms-previous-gate-1', source: 'sheet' },
        { kind: 'Test', title: 'Algorithms previous GATE 2', url: 'https://gateoverflow.in/exam/145/algorithms-gate2020-previous-gate-1', source: 'sheet' },
        { kind: 'Test', title: 'Algorithms previous GATE 3', url: 'https://gateoverflow.in/exam/146/algorithms-gate2020-previous-gate-2', source: 'sheet' }
      ]
    },
    dl: {
      book: 'Digital Logic and Computer Design — M. Morris Mano',
      chapters: '1.1–1.8, 2.1–2.7, 3–7',
      links: [
        { kind: 'Lectures', title: 'Digital logic playlist', url: 'https://youtube.com/playlist?list=PLBlnK6fEyqRjMH3mWf6kwqiTbT798eAOm', source: 'sheet' },
        { kind: 'Revision', title: 'Revision and PYQ session (live)', url: 'https://www.youtube.com/live/h-SDoV0_pwQ', source: 'sheet' },
        { kind: 'NPTEL', title: 'NPTEL Digital Circuits', url: 'https://youtube.com/playlist?list=PL803563859BF7ED8C', source: 'sheet' },
        { kind: 'Test', title: 'GO 2017 digital 1', url: 'https://gateoverflow.in/exam/33/go2017-digital-1', source: 'sheet' },
        { kind: 'Test', title: 'Digital design set 2', url: 'https://gateoverflow.in/exam/51/digital-design-set-2', source: 'sheet' },
        { kind: 'Test', title: 'Digital logic previous GATE 1', url: 'https://gateoverflow.in/exam/157/digital-logic-gate2020-previous-gate-1', source: 'sheet' },
        { kind: 'Test', title: 'Digital logic previous GATE 2', url: 'https://gateoverflow.in/exam/158/digital-logic-gate2020-previous-gate-2', source: 'sheet' },
        { kind: 'Test', title: 'Digital logic previous GATE 3', url: 'https://gateoverflow.in/exam/174/digital-logic-gate2020-previous-gate-3', source: 'sheet' },
        { kind: 'Test', title: 'Digital logic previous GATE 4', url: 'https://gateoverflow.in/exam/175/digital-logic-gate2020-previous-gate-4', source: 'sheet' }
      ]
    },
    dbms: {
      book: 'Fundamentals of Database Systems — Elmasri and Navathe (7E)',
      chapters: '1.3–1.6, 2.1–2.3, 3, 5–8, 9.1, 14.1–14.5, 14.6–14.7 (overview), 15.1–15.4, 16.1–16.7, 17.1–17.6, 20.1–20.5, 21.1–21.4, 21.7',
      links: [
        { kind: 'Lectures', title: 'DBMS playlist', url: 'https://youtube.com/playlist?list=PLG9aCp4uE-s0bu-I8fgDXXhVLO4qVROGy', source: 'sheet' },
        { kind: 'Revision', title: 'Revision and PYQ video solutions', url: 'https://youtube.com/playlist?list=PLIPZ2_p3RNHh3otU-TnAK-GkqrvvOO33C', source: 'sheet' },
        { kind: 'NPTEL', title: 'NPTEL DBMS', url: 'https://youtube.com/playlist?list=PL-wVMhlYPDDkRQ0XrQ8IuslSiAWPpSfuJ', source: 'sheet' },
        { kind: 'Test', title: 'Database systems test', url: 'https://gateoverflow.in/exam/50/database-systems', source: 'sheet' },
        { kind: 'Test', title: 'DBMS subject test 2', url: 'https://gateoverflow.in/exam/85/dbms-subject-test-2', source: 'sheet' },
        { kind: 'Test', title: 'Databases previous GATE 1', url: 'https://gateoverflow.in/exam/155/databases-gate2020-previous-gate-1', source: 'sheet' },
        { kind: 'Test', title: 'Databases previous GATE 2', url: 'https://gateoverflow.in/exam/156/databases-gate2020-previous-gate-2', source: 'sheet' },
        { kind: 'Test', title: 'Databases previous GATE 3', url: 'https://gateoverflow.in/exam/172/databases-gate2020-previous-gate-3', source: 'sheet' },
        { kind: 'Test', title: 'Databases previous GATE 4', url: 'https://gateoverflow.in/exam/173/databases-gate2020-previous-gate-4', source: 'sheet' },
        { kind: 'Book', title: 'Data Mining: Concepts and Techniques — Han, Kamber (for DA warehousing)', url: '', source: 'named' }
      ]
    },
    dm: {
      book: 'Discrete Mathematics and its Applications — Kenneth H. Rosen (Indian 7E)  •  Discrete Mathematics with Applications — Susanna Epp (4E)',
      chapters: 'Rosen: 1, 2, 4–8, 11.1–11.3  •  Epp: 1, 2.1–2.3, 3, 4 (optional), 5.1, 5.5–5.7, 6–10',
      links: [
        { kind: 'Lectures', title: 'Propositional logic', url: 'https://youtube.com/playlist?list=PLIPZ2_p3RNHillKxh1_iFeZhy9MftHeWW', source: 'sheet' },
        { kind: 'Lectures', title: 'Combinatorics', url: 'https://youtube.com/playlist?list=PLIPZ2_p3RNHgm_UqwqckMxM68HS4BkjYY', source: 'sheet' },
        { kind: 'Lectures', title: 'Recurrence relations', url: 'https://youtube.com/playlist?list=PLIPZ2_p3RNHhhTH0o1JBMgscMUvxs4E_4', source: 'sheet' },
        { kind: 'Lectures', title: 'Group theory', url: 'https://youtube.com/playlist?list=PLIPZ2_p3RNHhXves0XVa8d5O6F4rUi3KR', source: 'sheet' },
        { kind: 'Lectures', title: 'Graph theory and generating functions', url: 'https://youtube.com/playlist?list=PLIPZ2_p3RNHjQoj0k-BlI9zXE0QKdl-lI', source: 'sheet' },
        { kind: 'Lectures', title: 'Set theory', url: 'https://youtube.com/playlist?list=PLIPZ2_p3RNHjHnhdkPWFAlcizVQJ8w4TX', source: 'sheet' },
        { kind: 'Revision', title: 'Revision and PYQ video solutions', url: 'https://youtube.com/playlist?list=PL3eEXnCBViH-WZfR3PRFfYs7WjUgcBlAZ', source: 'sheet' },
        { kind: 'NPTEL', title: 'NPTEL Discrete Mathematics', url: 'https://youtube.com/playlist?list=PLgMDNELGJ1Ca7hpEIYtWvMXKcTx88OD2O', source: 'sheet' },
        { kind: 'Test', title: 'Propositional logic quiz 5', url: 'https://gateoverflow.in/exam/601/go-classes-2025-weekly-quiz-5-propositional-logic', source: 'sheet' },
        { kind: 'Test', title: 'Propositional logic quiz 6', url: 'https://gateoverflow.in/exam/602/go-classes-2025-weekly-quiz-6-propositional-logic', source: 'sheet' },
        { kind: 'Test', title: 'Propositional logic quiz 7', url: 'https://gateoverflow.in/exam/603/go-classes-2025-weekly-quiz-7-propositional-logic', source: 'sheet' },
        { kind: 'Test', title: 'Set theory quiz 8', url: 'https://gateoverflow.in/exam/605/go-classes-2025-weekly-quiz-8-set-theory', source: 'sheet' },
        { kind: 'Test', title: 'Functions quiz', url: 'https://gateoverflow.in/exam/614/go-classes-cs-2025-weekly-quiz-6-functions', source: 'sheet' },
        { kind: 'Test', title: 'Relations quiz', url: 'https://gateoverflow.in/exam/622/go-classes-cs-2025-weekly-quiz-7-relations', source: 'sheet' },
        { kind: 'Test', title: 'Lattice and poset quiz', url: 'https://gateoverflow.in/exam/641/go-classes-cs-2025-weekly-quiz-15-lattice-%26-poset', source: 'sheet' },
        { kind: 'Test', title: 'Combinatorics previous GATE', url: 'https://gateoverflow.in/exam/193/combinatorics-gate2020-previous-gate-1', source: 'sheet' },
        { kind: 'Test', title: 'Graph theory previous GATE', url: 'https://gateoverflow.in/exam/196/graph-theory-gate2020-previous-gate-1', source: 'sheet' },
        { kind: 'Test', title: 'Set theory and algebra previous GATE', url: 'https://gateoverflow.in/exam/191/set-theory-%26-algebra-gate2020-previous-gate-1', source: 'sheet' }
      ]
    },
    la: {
      book: 'Linear Algebra chapters of Rosen / Gilbert Strang — Introduction to Linear Algebra',
      chapters: 'Matrices, rank, eigenvalues, vector spaces',
      links: [
        { kind: 'Lectures', title: 'Linear algebra playlist', url: 'https://youtube.com/playlist?list=PLIPZ2_p3RNHhGLQ1ZT37KLpBMAD90CM4_', source: 'sheet' },
        { kind: 'Revision', title: 'Revision and PYQ session (live)', url: 'https://www.youtube.com/live/7vdSWFVKzZg', source: 'sheet' },
        { kind: 'NPTEL', title: 'NPTEL Linear Algebra', url: 'https://youtube.com/playlist?list=PLFW6lRTa1g80fZ1giRbqbe_XdXPdkkyqY', source: 'sheet' },
        { kind: 'Intuition', title: 'Essence of linear algebra (visual intuition)', url: 'https://youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab', source: 'sheet' },
        { kind: 'Test', title: 'LA weekly quiz 3', url: 'https://gateoverflow.in/exam/598/go-classes-2025-weekly-quiz-3-fundamental-course-and-linear-algebra', source: 'sheet' },
        { kind: 'Test', title: 'LA weekly quiz 4', url: 'https://gateoverflow.in/exam/600/go-classes-2025-weekly-quiz-4-linear-algebra', source: 'sheet' },
        { kind: 'Test', title: 'LA weekly quiz 5', url: 'https://gateoverflow.in/exam/606/go-classes-2025-common-weekly-quiz-5-linear-algebra', source: 'sheet' },
        { kind: 'Test', title: 'LA previous GATE 1', url: 'https://gateoverflow.in/exam/68/linear-algebra-previous-gate-1', source: 'sheet' },
        { kind: 'Test', title: 'LA previous GATE 2', url: 'https://gateoverflow.in/exam/161/linear-algebra-gate2020-previous-gate-1', source: 'sheet' },
        { kind: 'Test', title: 'LA previous GATE 3', url: 'https://gateoverflow.in/exam/162/linear-algebra-gate2020-previous-gate-2', source: 'sheet' }
      ]
    },
    prob: {
      book: 'Introduction to Probability Models — Sheldon M. Ross',
      chapters: 'Basics, random variables, standard distributions; add inference chapters for the DA paper',
      links: [
        { kind: 'Lectures', title: 'Probability playlist', url: 'https://youtube.com/playlist?list=PLhLZ_zxDsyOIKbQfKFM05BLYRhUZ7JP-M', source: 'sheet' },
        { kind: 'Revision', title: 'Revision and PYQ video', url: 'https://youtu.be/_nuQwy9DGmw', source: 'sheet' },
        { kind: 'NPTEL', title: 'NPTEL Probability', url: 'https://youtube.com/playlist?list=PLyqSpQzTE6M_JcleDbrVyPnE0PixKs2JE', source: 'sheet' },
        { kind: 'Reading', title: 'probabilitycourse.com', url: 'https://www.probabilitycourse.com/', source: 'sheet' },
        { kind: 'Test', title: 'Conditional probability quiz', url: 'https://gateoverflow.in/exam/623/go-classes-cs-da-2025-weekly-quiz-6-conditional-probability', source: 'sheet' },
        { kind: 'Test', title: 'Probability distributions quiz', url: 'https://gateoverflow.in/exam/628/go-classes-2025-weekly-quiz-13-probability-distributions', source: 'sheet' },
        { kind: 'Test', title: 'Probability previous GATE 1', url: 'https://gateoverflow.in/exam/67/probability-previous-gate-1', source: 'sheet' },
        { kind: 'Test', title: 'Probability previous GATE 2', url: 'https://gateoverflow.in/exam/159/probability-gate2020-previous-gate-1', source: 'sheet' },
        { kind: 'Test', title: 'Probability previous GATE 3', url: 'https://gateoverflow.in/exam/160/probability-gate2020-previous-gate-2', source: 'sheet' }
      ]
    },
    calc: {
      book: 'Any standard calculus text; Khan Academy for gaps',
      chapters: 'Limits, continuity, differentiation, maxima and minima, integration, partial derivatives',
      links: [
        { kind: 'Revision', title: 'Revision and PYQ video solutions', url: 'https://youtube.com/playlist?list=PLIPZ2_p3RNHi3R5H_NDKCB3aGvtLYlLrz', source: 'sheet' },
        { kind: 'NPTEL', title: 'NPTEL Calculus', url: 'https://youtube.com/playlist?list=PLEAYkSg4uSQ0q9CDkHkJGdUTQOgH1DLDj', source: 'sheet' },
        { kind: 'Course', title: 'Khan Academy Calculus 1', url: 'https://www.khanacademy.org/math/calculus-1', source: 'sheet' },
        { kind: 'Test', title: 'Calculus weekly quiz 21', url: 'https://gateoverflow.in/exam/659/go-classes-2025-weekly-quiz-21-calculus', source: 'sheet' },
        { kind: 'Test', title: 'Calculus previous GATE', url: 'https://gateoverflow.in/exam/164/calculus-gate2020-previous-gate-1', source: 'sheet' },
        { kind: 'Lectures', title: 'Mohit Tyagi calculus videos (pick GATE relevant ones)', url: '', source: 'named' }
      ]
    },
    apt: {
      book: 'Practice from previous year aptitude sections',
      chapters: 'Quantitative, verbal, logical reasoning, data interpretation',
      links: [
        { kind: 'Lectures', title: 'Aptitude resources, short notes, topic list', url: 'https://youtu.be/IADuDzccEOI', source: 'sheet' },
        { kind: 'Test', title: 'Aptitude monthly quiz 1', url: 'https://gateoverflow.in/exam/610/go-classes-2025-monthly-quiz-1-general-aptitude', source: 'sheet' },
        { kind: 'Test', title: 'Aptitude monthly quiz 2', url: 'https://gateoverflow.in/exam/631/go-classes-cs-da-2025-monthly-quiz-2-general-aptitude', source: 'sheet' },
        { kind: 'Test', title: 'Aptitude monthly quiz 3', url: 'https://gateoverflow.in/exam/660/go-classes-cs-da-2025-monthly-quiz-3-general-aptitude', source: 'sheet' },
        { kind: 'Test', title: 'GO 2017 aptitude 1', url: 'https://gateoverflow.in/exam/36/go2017-aptitude-1', source: 'sheet' },
        { kind: 'Test', title: 'General aptitude set 2', url: 'https://gateoverflow.in/exam/64/general-aptitude-set-2', source: 'sheet' }
      ]
    },
    ml: {
      book: 'Pattern Recognition and Machine Learning — Bishop  •  An Introduction to Statistical Learning — James, Witten, Hastie, Tibshirani',
      chapters: 'Regression, classification, trees and ensembles, clustering, PCA, model evaluation, neural networks',
      links: [
        { kind: 'Course', title: 'NPTEL Introduction to Machine Learning (Prof. Balaraman Ravindran)', url: '', source: 'named' },
        { kind: 'Course', title: 'Andrew Ng Machine Learning Specialisation (Coursera, audit free)', url: '', source: 'named' },
        { kind: 'Reading', title: 'An Introduction to Statistical Learning — free PDF on statlearning.com', url: '', source: 'named' },
        { kind: 'Reading', title: 'scikit-learn user guide — model selection and metrics sections', url: '', source: 'named' }
      ]
    },
    ai: {
      book: 'Artificial Intelligence: A Modern Approach — Russell and Norvig',
      chapters: 'Search (3–4), adversarial search (5), CSP (6), logic (7–9), uncertainty (13–14)',
      links: [
        { kind: 'Course', title: 'NPTEL Artificial Intelligence: Search Methods for Problem Solving', url: '', source: 'named' },
        { kind: 'Course', title: 'Berkeley CS188 Introduction to AI — lectures and Pacman projects', url: '', source: 'named' },
        { kind: 'Reading', title: 'AIMA chapter summaries and exercises', url: '', source: 'named' }
      ]
    }
  },

  mocks: [
    { kind: 'Mock', title: 'GO 17 Mock 1', url: 'https://gateoverflow.in/exam/70/go-17-mock-1', source: 'sheet' },
    { kind: 'Mock', title: 'GO 17 Mock 2', url: 'https://gateoverflow.in/exam/73/go-17-mock-2', source: 'sheet' },
    { kind: 'Mock', title: 'GO 17 Mock 3', url: 'https://gateoverflow.in/exam/74/go-17-mock-3', source: 'sheet' },
    { kind: 'Mock', title: 'GO 18 Mock 4', url: 'https://gateoverflow.in/exam/79/go-18-mock-4', source: 'sheet' },
    { kind: 'Mock', title: 'Test by Ruturaj Mock 1', url: 'https://gateoverflow.in/exam/126/test-by-ruturaj-mock-1', source: 'sheet' },
    { kind: 'Mock', title: 'Applied Course 2019 Mock 1', url: 'https://gateoverflow.in/exam/136/applied-course-2019-mock1', source: 'sheet' }
  ],

  pastPapers: [
    { year: '2024 Set 1', url: 'https://gateoverflow.in/exam/594/gate-cse-2024-set-1-original-paper' },
    { year: '2024 Set 2', url: 'https://gateoverflow.in/exam/595/gate-cse-2024-set-2-original-paper' },
    { year: '2023', url: 'https://gateoverflow.in/exam/430/gate-cse-2023-original-paper' },
    { year: '2022', url: 'https://gateoverflow.in/exam/298/gate-cse-2022' },
    { year: '2021 Set 1', url: 'https://gateoverflow.in/exam/263/gate-2021' },
    { year: '2021 Set 2', url: 'https://gateoverflow.in/exam/264/gate-cse-2021-set-2' },
    { year: '2020', url: 'https://gateoverflow.in/exam/218/gate-cse-2020' },
    { year: '2019', url: 'https://gateoverflow.in/exam/141/gate2019' },
    { year: '2018', url: 'https://gateoverflow.in/exam/88/gate2018' },
    { year: '2017 Set 1', url: 'https://gateoverflow.in/exam/76/gate-2017-set-1' },
    { year: '2017 Set 2', url: 'https://gateoverflow.in/exam/75/gate-2017-set-2' },
    { year: '2016 Set 1', url: 'https://gateoverflow.in/exam/8/gate-2016-1' },
    { year: '2016 Set 2', url: 'https://gateoverflow.in/exam/9/gate-2016-2' },
    { year: '2015 Set 1', url: 'https://gateoverflow.in/exam/10/gate-2015-1' },
    { year: '2015 Set 2', url: 'https://gateoverflow.in/exam/11/gate-2015-2' },
    { year: '2015 Set 3', url: 'https://gateoverflow.in/exam/12/gate-2015-3' }
  ]
};

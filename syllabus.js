/* ============================================================
   syllabus.js
   Subjects + chapters + approximate marks weightage.
   Weightage is an average over recent GATE papers, used only to
   build realistic mock tests. Edit freely.
   ============================================================ */

window.GP_SYLLABUS = {
  exams: {
    cse: { id: 'cse', code: 'CS', name: 'GATE CSE', full: 'Computer Science & Information Technology' },
    da:  { id: 'da',  code: 'DA', name: 'GATE DS & AI', full: 'Data Science & Artificial Intelligence' }
  },

  subjects: [
    /* ---------- shared ---------- */
    {
      id: 'apt', name: 'General Aptitude', exams: ['cse', 'da'], marks: { cse: 15, da: 15 }, group: 'Aptitude',
      chapters: [
        { id: 'apt-quant', name: 'Quantitative aptitude' },
        { id: 'apt-verbal', name: 'Verbal ability and reading comprehension' },
        { id: 'apt-logic', name: 'Analytical and logical reasoning' },
        { id: 'apt-di', name: 'Data interpretation' }
      ]
    },
    {
      id: 'la', name: 'Linear Algebra', exams: ['cse', 'da'], marks: { cse: 4, da: 10 }, group: 'Mathematics',
      chapters: [
        { id: 'la-matrix', name: 'Matrices, rank and system of equations' },
        { id: 'la-det', name: 'Determinants' },
        { id: 'la-eigen', name: 'Eigenvalues and eigenvectors' },
        { id: 'la-space', name: 'Vector spaces, basis, LU decomposition' },
        { id: 'la-proj', name: 'Projections, orthogonality, SVD (DA only)', exams: ['da'] }
      ]
    },
    {
      id: 'prob', name: 'Probability & Statistics', exams: ['cse', 'da'], marks: { cse: 5, da: 20 }, group: 'Mathematics',
      chapters: [
        { id: 'prob-basic', name: 'Axioms, conditional probability, Bayes theorem' },
        { id: 'prob-rv', name: 'Random variables, expectation, variance' },
        { id: 'prob-dist', name: 'Distributions: uniform, binomial, Poisson, normal, exponential' },
        { id: 'prob-stat', name: 'Descriptive statistics, correlation, regression (DA)', exams: ['da'] },
        { id: 'prob-infer', name: 'CLT, confidence intervals, hypothesis testing (DA)', exams: ['da'] }
      ]
    },
    {
      id: 'calc', name: 'Calculus & Optimization', exams: ['cse', 'da'], marks: { cse: 3, da: 5 }, group: 'Mathematics',
      chapters: [
        { id: 'calc-limit', name: 'Limits, continuity, differentiability' },
        { id: 'calc-maxmin', name: 'Maxima and minima, mean value theorems' },
        { id: 'calc-int', name: 'Integration and definite integrals' },
        { id: 'calc-multi', name: 'Partial derivatives, gradient' },
        { id: 'calc-opt', name: 'Convexity, single-variable optimization (DA)', exams: ['da'] }
      ]
    },

    /* ---------- CSE core ---------- */
    {
      id: 'dm', name: 'Discrete Mathematics', exams: ['cse'], marks: { cse: 9, da: 0 }, group: 'Mathematics',
      chapters: [
        { id: 'dm-logic', name: 'Propositional and first order logic' },
        { id: 'dm-set', name: 'Sets, relations, functions, partial orders, lattices' },
        { id: 'dm-comb', name: 'Combinatorics, counting, pigeonhole' },
        { id: 'dm-rec', name: 'Recurrence relations and generating functions' },
        { id: 'dm-graph', name: 'Graph theory: connectivity, matching, colouring' },
        { id: 'dm-group', name: 'Groups, monoids, algebraic structures' }
      ]
    },
    {
      id: 'dl', name: 'Digital Logic', exams: ['cse'], marks: { cse: 6, da: 0 }, group: 'Core CS',
      chapters: [
        { id: 'dl-num', name: 'Number systems and computer arithmetic' },
        { id: 'dl-bool', name: 'Boolean algebra and minimisation' },
        { id: 'dl-comb', name: 'Combinational circuits: mux, decoder, adders' },
        { id: 'dl-seq', name: 'Sequential circuits: flip-flops, counters, registers' },
        { id: 'dl-float', name: 'Floating point representation' }
      ]
    },
    {
      id: 'coa', name: 'Computer Organisation & Architecture', exams: ['cse'], marks: { cse: 7, da: 0 }, group: 'Core CS',
      chapters: [
        { id: 'coa-isa', name: 'Machine instructions and addressing modes' },
        { id: 'coa-alu', name: 'ALU, data path and control unit' },
        { id: 'coa-pipe', name: 'Instruction pipelining and hazards' },
        { id: 'coa-cache', name: 'Cache memory and memory hierarchy' },
        { id: 'coa-mem', name: 'Main memory organisation and secondary storage' },
        { id: 'coa-io', name: 'I/O interface, interrupts, DMA' }
      ]
    },
    {
      id: 'ds', name: 'Data Structures', exams: ['cse', 'da'], marks: { cse: 6, da: 5 }, group: 'Programming',
      chapters: [
        { id: 'ds-array', name: 'Arrays, stacks, queues' },
        { id: 'ds-ll', name: 'Linked lists' },
        { id: 'ds-tree', name: 'Trees, binary search trees, AVL' },
        { id: 'ds-heap', name: 'Heaps and priority queues' },
        { id: 'ds-hash', name: 'Hashing and collision resolution' },
        { id: 'ds-graph', name: 'Graph representations and traversals' }
      ]
    },
    {
      id: 'cp', name: 'Programming', exams: ['cse', 'da'], marks: { cse: 4, da: 5 }, group: 'Programming',
      chapters: [
        { id: 'cp-basic', name: 'Variables, operators, control flow' },
        { id: 'cp-func', name: 'Functions, scope, storage classes, recursion' },
        { id: 'cp-ptr', name: 'Pointers, arrays, strings, structures' },
        { id: 'cp-py', name: 'Python programming (DA)', exams: ['da'] }
      ]
    },
    {
      id: 'algo', name: 'Algorithms', exams: ['cse', 'da'], marks: { cse: 8, da: 5 }, group: 'Programming',
      chapters: [
        { id: 'algo-async', name: 'Asymptotic analysis and recurrences' },
        { id: 'algo-sort', name: 'Searching, sorting, selection' },
        { id: 'algo-dnc', name: 'Divide and conquer' },
        { id: 'algo-greedy', name: 'Greedy algorithms' },
        { id: 'algo-dp', name: 'Dynamic programming' },
        { id: 'algo-graph', name: 'Graph algorithms: MST, shortest path, traversal' }
      ]
    },
    {
      id: 'toc', name: 'Theory of Computation', exams: ['cse'], marks: { cse: 8, da: 0 }, group: 'Core CS',
      chapters: [
        { id: 'toc-reg', name: 'Finite automata and regular languages' },
        { id: 'toc-cfl', name: 'Context free grammars and pushdown automata' },
        { id: 'toc-closure', name: 'Closure and decidability properties' },
        { id: 'toc-tm', name: 'Turing machines and undecidability' }
      ]
    },
    {
      id: 'cd', name: 'Compiler Design', exams: ['cse'], marks: { cse: 6, da: 0 }, group: 'Core CS',
      chapters: [
        { id: 'cd-lex', name: 'Lexical analysis' },
        { id: 'cd-parse', name: 'Parsing: LL, LR, SLR, LALR' },
        { id: 'cd-sdt', name: 'Syntax directed translation' },
        { id: 'cd-runtime', name: 'Runtime environments and activation records' },
        { id: 'cd-inter', name: 'Intermediate code generation' },
        { id: 'cd-opt', name: 'Local optimisation and data flow analysis' }
      ]
    },
    {
      id: 'os', name: 'Operating Systems', exams: ['cse'], marks: { cse: 8, da: 0 }, group: 'Systems',
      chapters: [
        { id: 'os-proc', name: 'Processes, threads, system calls' },
        { id: 'os-sched', name: 'CPU scheduling' },
        { id: 'os-sync', name: 'Synchronisation, semaphores, classic problems' },
        { id: 'os-dead', name: 'Deadlock detection, avoidance, prevention' },
        { id: 'os-mem', name: 'Memory management, paging, segmentation' },
        { id: 'os-vm', name: 'Virtual memory and page replacement' },
        { id: 'os-fs', name: 'File systems and disk scheduling' }
      ]
    },
    {
      id: 'dbms', name: 'Database Management Systems', exams: ['cse', 'da'], marks: { cse: 6, da: 10 }, group: 'Systems',
      chapters: [
        { id: 'db-er', name: 'ER model and relational model' },
        { id: 'db-ra', name: 'Relational algebra, tuple calculus, SQL' },
        { id: 'db-norm', name: 'Functional dependencies and normalisation' },
        { id: 'db-file', name: 'File organisation, indexing, B and B+ trees' },
        { id: 'db-txn', name: 'Transactions and concurrency control' },
        { id: 'db-dw', name: 'Data warehousing, schemas, OLAP (DA)', exams: ['da'] }
      ]
    },
    {
      id: 'cn', name: 'Computer Networks', exams: ['cse'], marks: { cse: 5, da: 0 }, group: 'Systems',
      chapters: [
        { id: 'cn-layer', name: 'Layering, OSI and TCP/IP stacks' },
        { id: 'cn-dll', name: 'Data link layer, framing, error control, MAC' },
        { id: 'cn-net', name: 'IPv4, IPv6, addressing, subnetting, routing' },
        { id: 'cn-trans', name: 'TCP, UDP, congestion and flow control' },
        { id: 'cn-app', name: 'Application layer: DNS, HTTP, SMTP, DHCP' },
        { id: 'cn-sec', name: 'Basics of network security' }
      ]
    },

    /* ---------- DA specific ---------- */
    {
      id: 'ml', name: 'Machine Learning', exams: ['da'], marks: { cse: 0, da: 15 }, group: 'AI / ML',
      chapters: [
        { id: 'ml-sup-reg', name: 'Regression: linear, ridge, lasso' },
        { id: 'ml-sup-clf', name: 'Classification: logistic regression, naive Bayes, kNN, SVM' },
        { id: 'ml-tree', name: 'Decision trees, bagging, random forest, boosting' },
        { id: 'ml-unsup', name: 'Clustering: k-means, hierarchical' },
        { id: 'ml-dim', name: 'Dimensionality reduction and PCA' },
        { id: 'ml-eval', name: 'Bias-variance, cross validation, metrics' },
        { id: 'ml-nn', name: 'Neural networks and backpropagation' }
      ]
    },
    {
      id: 'ai', name: 'Artificial Intelligence', exams: ['da'], marks: { cse: 0, da: 10 }, group: 'AI / ML',
      chapters: [
        { id: 'ai-search', name: 'Uninformed and informed search' },
        { id: 'ai-game', name: 'Adversarial search, minimax, alpha-beta' },
        { id: 'ai-csp', name: 'Constraint satisfaction problems' },
        { id: 'ai-logic', name: 'Propositional and first order logic, resolution' },
        { id: 'ai-uncert', name: 'Reasoning under uncertainty, Bayesian networks' }
      ]
    }
  ]
};

/* ============================================================
   questions.cse.js  —  core CS subjects
   Original GATE-pattern practice questions written for this app.
   type: 'mcq' (one answer, negative marking)
         'msq' (multiple answers, no negative marking)
         'nat' (numeric answer, no negative marking)
   ans : mcq -> option index | msq -> array of indices | nat -> number
   tol : optional tolerance for nat
   ============================================================ */

window.GP_Q_CSE = [

/* ---------------- DIGITAL LOGIC ---------------- */
{ id:'dl01', subj:'dl', ch:'dl-num', marks:1, type:'nat',
  q:'What is the decimal value of the binary number (1101.101)\u2082?', ans:13.625, tol:0.001,
  exp:'8+4+0+1 = 13 for the integer part and 0.5+0+0.125 = 0.625 for the fraction, so 13.625.' },

{ id:'dl02', subj:'dl', ch:'dl-num', marks:1, type:'mcq',
  q:'The binary number 1011 is converted to Gray code. The result is',
  opts:['1110','1101','1011','1001'], ans:0,
  exp:'The MSB is copied, then each Gray bit is the XOR of adjacent binary bits: 1, 1\u22950=1, 0\u22951=1, 1\u22951=0, giving 1110.' },

{ id:'dl03', subj:'dl', ch:'dl-num', marks:1, type:'mcq',
  q:'An 8-bit register uses 2\u2019s complement representation. The range of integers it can store is',
  opts:['\u2212127 to +127','\u2212128 to +127','\u2212128 to +128','0 to 255'], ans:1,
  exp:'For n bits the range is \u22122^(n\u22121) to 2^(n\u22121)\u22121, which is \u2212128 to +127. Only one pattern represents zero.' },

{ id:'dl04', subj:'dl', ch:'dl-bool', marks:2, type:'mcq',
  q:'A function of three variables is F(A,B,C) = \u03a3m(0,1,2,3,4,5). The minimal sum of products form of F is',
  opts:["A' + B'","A' \u00b7 B'","A + B","A'B + AB'"], ans:0,
  exp:'The only missing minterms are 6 and 7, which are exactly the cases A = B = 1. So F = (AB)\u2032 = A\u2032 + B\u2032.' },

{ id:'dl05', subj:'dl', ch:'dl-bool', marks:2, type:'nat',
  q:'How many minterms does the function F = A \u2295 B \u2295 C have, where A, B and C are Boolean variables?', ans:4,
  exp:'A three input XOR is 1 whenever an odd number of inputs is 1: the minterms 001, 010, 100 and 111. That is 4 minterms.' },

{ id:'dl06', subj:'dl', ch:'dl-comb', marks:2, type:'nat',
  q:'What is the minimum number of 4-to-1 multiplexers required to build a 16-to-1 multiplexer?', ans:5,
  exp:'Four multiplexers handle the sixteen inputs in groups of four, and a fifth selects among their four outputs.' },

{ id:'dl07', subj:'dl', ch:'dl-comb', marks:2, type:'mcq',
  q:'A full adder is to be built using half adders and additional gates. The minimum requirement is',
  opts:['1 half adder and 1 OR gate','2 half adders and 1 OR gate','2 half adders and 1 AND gate','3 half adders only'], ans:1,
  exp:'Two half adders produce the sum A\u2295B\u2295C, and their two carry outputs are combined with a single OR gate to give the final carry.' },

{ id:'dl08', subj:'dl', ch:'dl-comb', marks:2, type:'nat',
  q:'In a 4-bit ripple carry adder each full adder has a propagation delay of 10 ns. After how many nanoseconds is the final carry out guaranteed to be stable?', ans:40,
  exp:'The carry ripples serially through all four stages, so the worst case delay is 4 \u00d7 10 = 40 ns.' },

{ id:'dl09', subj:'dl', ch:'dl-seq', marks:1, type:'nat',
  q:'What is the minimum number of flip-flops needed to design a decade (mod-10) counter?', ans:4,
  exp:'We need 2^n \u2265 10, so n = 4. Six of the sixteen states stay unused.' },

{ id:'dl10', subj:'dl', ch:'dl-seq', marks:1, type:'mcq',
  q:'In a JK flip-flop, if J = K = 1 at the active clock edge, the output',
  opts:['is set to 1','is reset to 0','toggles','stays unchanged'], ans:2,
  exp:'J = K = 1 is the toggle condition: Q(next) = Q\u2032. This is how JK flip-flops are used as counters.' },

{ id:'dl11', subj:'dl', ch:'dl-seq', marks:2, type:'nat',
  q:'A Johnson (twisted ring) counter is built with 4 flip-flops. How many distinct states does it cycle through?', ans:8,
  exp:'A Johnson counter with n flip-flops has 2n states, compared with n states for a plain ring counter.' },

{ id:'dl12', subj:'dl', ch:'dl-float', marks:1, type:'nat',
  q:'In the IEEE 754 single precision format, how many bits are allocated to the mantissa (significand) field?', ans:23,
  exp:'Single precision uses 1 sign bit, 8 exponent bits and 23 stored mantissa bits, with a hidden leading 1 for normalised numbers.' },

{ id:'dl13', subj:'dl', ch:'dl-float', marks:2, type:'mcq',
  q:'The exponent field of an IEEE 754 single precision number is stored with a bias of',
  opts:['64','127','128','255'], ans:1,
  exp:'With 8 exponent bits the bias is 2^7 \u2212 1 = 127, so a stored value of 127 means an actual exponent of 0.' },

/* ---------------- COA ---------------- */
{ id:'coa01', subj:'coa', ch:'coa-cache', marks:2, type:'nat',
  q:'A byte addressable machine has 32-bit addresses and a 64 KB, 4-way set associative cache with a block size of 32 bytes. How many tag bits are stored with each cache block?', ans:18,
  exp:'64 KB / 32 B = 2048 blocks, and 2048 / 4 = 512 sets, so 9 index bits and 5 offset bits. Tag = 32 \u2212 9 \u2212 5 = 18.' },

{ id:'coa02', subj:'coa', ch:'coa-cache', marks:2, type:'nat',
  q:'An L1 cache is accessed in 1 cycle. The miss rate is 10% and the miss penalty is 100 cycles. What is the average memory access time in cycles?', ans:11,
  exp:'AMAT = hit time + miss rate \u00d7 miss penalty = 1 + 0.10 \u00d7 100 = 11 cycles.' },

{ id:'coa03', subj:'coa', ch:'coa-cache', marks:2, type:'nat',
  q:'Cache access takes 10 ns and main memory access takes 100 ns. On a miss the block is first fetched into the cache and then read from it. If the hit ratio is 0.9, what is the average access time in nanoseconds?', ans:20,
  exp:'0.9 \u00d7 10 + 0.1 \u00d7 (10 + 100) = 9 + 11 = 20 ns. Note the 10 ns cache probe happens on a miss too.' },

{ id:'coa04', subj:'coa', ch:'coa-cache', marks:1, type:'mcq',
  q:'Compared with a write-through cache, a write-back cache primarily',
  opts:['reduces traffic to main memory','simplifies cache coherence','removes the need for a dirty bit','guarantees memory is always up to date'], ans:0,
  exp:'Write-back defers memory writes until eviction, so repeated writes to the same block generate one memory write instead of many. Coherence becomes harder, not easier.' },

{ id:'coa05', subj:'coa', ch:'coa-pipe', marks:2, type:'nat',
  q:'A 5-stage pipeline has stage delays of 150, 120, 150, 190 and 140 picoseconds. Each stage is followed by a latch with a delay of 5 ps. What is the minimum clock period in picoseconds?', ans:195,
  exp:'The clock is limited by the slowest stage plus its latch: 190 + 5 = 195 ps.' },

{ id:'coa06', subj:'coa', ch:'coa-pipe', marks:2, type:'nat',
  q:'An ideal 5-stage pipeline with no stalls executes 1000 independent instructions. How many clock cycles are needed?', ans:1004,
  exp:'The first instruction takes 5 cycles to fill the pipeline and each remaining instruction adds one cycle: 5 + 999 = 1004.' },

{ id:'coa07', subj:'coa', ch:'coa-pipe', marks:1, type:'mcq',
  q:'Operand forwarding (bypassing) in a pipeline is used mainly to reduce',
  opts:['structural hazards','data hazards','control hazards','cache misses'], ans:1,
  exp:'Forwarding routes a result straight from a later stage to a dependent instruction, eliminating most read-after-write stalls.' },

{ id:'coa08', subj:'coa', ch:'coa-isa', marks:2, type:'nat',
  q:'A processor supports 40 distinct instructions and has 24 general purpose registers. Each instruction has an opcode and two register operands. What is the minimum instruction size in bits?', ans:16,
  exp:'Opcode needs \u2308log\u208240\u2309 = 6 bits and each register field needs \u2308log\u208224\u2309 = 5 bits, giving 6 + 5 + 5 = 16 bits.' },

{ id:'coa09', subj:'coa', ch:'coa-isa', marks:1, type:'mcq',
  q:'Which addressing mode is most natural for stepping through the elements of an array inside a loop?',
  opts:['Immediate','Indexed','Register direct','Implied'], ans:1,
  exp:'Indexed addressing adds an index register to a base address, so incrementing the index moves to the next element.' },

{ id:'coa10', subj:'coa', ch:'coa-mem', marks:2, type:'nat',
  q:'How many address lines are needed to address every byte of a 4 GB byte addressable main memory?', ans:32,
  exp:'4 GB = 2\u00b3\u00b2 bytes, so 32 address lines are required.' },

{ id:'coa11', subj:'coa', ch:'coa-io', marks:1, type:'mcq',
  q:'The main advantage of DMA over programmed I/O is that',
  opts:['the CPU is not involved in transferring each word','it needs no interrupts at all','it works without a bus','data never passes through memory'], ans:0,
  exp:'A DMA controller moves the block itself and interrupts the CPU only when the whole transfer is finished.' },

{ id:'coa12', subj:'coa', ch:'coa-alu', marks:2, type:'mcq',
  q:'Booth\u2019s algorithm for signed multiplication is attractive because it',
  opts:['needs no shift operations','reduces the number of add/subtract steps for operands with long runs of 1s','works only for unsigned numbers','always takes exactly two cycles'], ans:1,
  exp:'Booth encoding replaces a run of 1s with one subtraction and one addition, cutting the number of arithmetic steps.' },

/* ---------------- OPERATING SYSTEMS ---------------- */
{ id:'os01', subj:'os', ch:'os-sched', marks:2, type:'nat',
  q:'Three processes arrive as follows \u2014 P1 at t = 0 with burst 5, P2 at t = 1 with burst 3, P3 at t = 2 with burst 1. Under FCFS scheduling, what is the average waiting time?', ans:3.33, tol:0.05,
  exp:'P1 waits 0, P2 starts at 5 so waits 4, P3 starts at 8 so waits 6. Average = 10/3 \u2248 3.33.' },

{ id:'os02', subj:'os', ch:'os-sched', marks:2, type:'nat',
  q:'For the same three processes \u2014 P1 (arrival 0, burst 5), P2 (arrival 1, burst 3), P3 (arrival 2, burst 1) \u2014 what is the average waiting time under shortest remaining time first?', ans:1.67, tol:0.05,
  exp:'P3 finishes at 3, P2 at 5, P1 at 9. Waiting times are 4, 1 and 0, so the average is 5/3 \u2248 1.67.' },

{ id:'os03', subj:'os', ch:'os-sched', marks:1, type:'mcq',
  q:'Which scheduling policy gives the minimum average waiting time but can starve long processes?',
  opts:['First come first served','Round robin','Shortest job first','Highest response ratio next'], ans:2,
  exp:'SJF is provably optimal for average waiting time, but a stream of short jobs can postpone a long job indefinitely.' },

{ id:'os04', subj:'os', ch:'os-dead', marks:2, type:'nat',
  q:'Three concurrent processes each need a maximum of 4 units of a single resource type. What is the minimum number of units that guarantees the system can never deadlock?', ans:10,
  exp:'Use n(k\u22121)+1 = 3 \u00d7 3 + 1 = 10. With 10 units at least one process can always reach its maximum and finish.' },

{ id:'os05', subj:'os', ch:'os-dead', marks:1, type:'msq',
  q:'Which of the following are necessary conditions for deadlock? (Select all that apply.)',
  opts:['Mutual exclusion','Hold and wait','Bounded waiting','Circular wait'], ans:[0,1,3],
  exp:'The four Coffman conditions are mutual exclusion, hold and wait, no preemption and circular wait. Bounded waiting is a property of a correct mutual exclusion solution, not a deadlock condition.' },

{ id:'os06', subj:'os', ch:'os-sync', marks:1, type:'mcq',
  q:'To enforce mutual exclusion on a critical section using a binary semaphore, the semaphore should be initialised to',
  opts:['0','1','\u22121','the number of processes'], ans:1,
  exp:'Initialising to 1 lets exactly one process pass the wait operation; all others block until a signal is issued.' },

{ id:'os07', subj:'os', ch:'os-sync', marks:2, type:'nat',
  q:'A counting semaphore S is initialised to 7. Then 20 P (wait) operations and 15 V (signal) operations are executed on it. What is the final value of S?', ans:2,
  exp:'Each P decrements and each V increments, so S = 7 \u2212 20 + 15 = 2.' },

{ id:'os08', subj:'os', ch:'os-vm', marks:2, type:'nat',
  q:'For the reference string 1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5 with 3 page frames and FIFO replacement, how many page faults occur?', ans:9,
  exp:'FIFO faults on 1, 2, 3, 4, 1, 2, 5, 3, 4 and hits on the rest, giving 9 faults.' },

{ id:'os09', subj:'os', ch:'os-vm', marks:2, type:'nat',
  q:'For the reference string 1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5 with 3 page frames and LRU replacement, how many page faults occur?', ans:10,
  exp:'LRU faults 10 times here. Comparing with FIFO on the same string shows more frames or a different policy does not always help.' },

{ id:'os10', subj:'os', ch:'os-vm', marks:1, type:'mcq',
  q:'Belady\u2019s anomaly, where adding frames increases the number of page faults, can occur with',
  opts:['LRU','Optimal replacement','FIFO','Any stack algorithm'], ans:2,
  exp:'FIFO is not a stack algorithm, so its page set for k frames need not be a subset of the set for k+1 frames. LRU and optimal are immune.' },

{ id:'os11', subj:'os', ch:'os-mem', marks:2, type:'nat',
  q:'A process has a 32-bit virtual address space with 4 KB pages. Each page table entry is 4 bytes. What is the size of a single level page table, in megabytes?', ans:4,
  exp:'2\u00b3\u00b2 / 2\u00b9\u00b2 = 2\u00b2\u2070 entries \u00d7 4 bytes = 4 MB.' },

{ id:'os12', subj:'os', ch:'os-mem', marks:2, type:'nat',
  q:'A system uses a single level page table. TLB lookup takes 10 ns, memory access takes 100 ns and the TLB hit ratio is 0.9. What is the effective memory access time in nanoseconds?', ans:120,
  exp:'0.9 \u00d7 (10 + 100) + 0.1 \u00d7 (10 + 100 + 100) = 99 + 21 = 120 ns.' },

{ id:'os13', subj:'os', ch:'os-fs', marks:2, type:'nat',
  q:'The disk head is at cylinder 50 and the request queue is 82, 170, 43, 140, 24, 16, 190. Using SSTF, what is the total head movement in cylinders?', ans:208,
  exp:'The service order is 43, 24, 16, 82, 140, 170, 190 and the movements 7+19+8+66+58+30+20 add to 208.' },

{ id:'os14', subj:'os', ch:'os-proc', marks:2, type:'nat',
  q:'A program executes three consecutive fork() calls, all of which succeed. How many child processes are created in total?', ans:7,
  exp:'After n forks there are 2\u207f processes in total, so 2\u00b3 \u2212 1 = 7 of them are children.' },

{ id:'os15', subj:'os', ch:'os-sync', marks:2, type:'mcq',
  q:'In the classic bounded buffer problem with a buffer of size N, the semaphore "empty" is initialised to N and "full" to 0. The producer must',
  opts:['wait on full, then signal empty','wait on empty, then signal full','wait on both empty and full','signal empty before waiting on full'], ans:1,
  exp:'The producer consumes an empty slot and creates a full one, so it waits on empty, inserts the item and signals full.' },

{ id:'os16', subj:'os', ch:'os-fs', marks:1, type:'mcq',
  q:'In a UNIX-style inode scheme, the maximum file size is determined mainly by',
  opts:['the number of direct and indirect pointers and the block size','the size of the directory entry','the number of inodes in the file system','the length of the file name'], ans:0,
  exp:'File capacity comes from the direct blocks plus single, double and triple indirect blocks, each holding block-size/pointer-size pointers.' },

/* ---------------- DBMS ---------------- */
{ id:'db01', subj:'dbms', ch:'db-norm', marks:2, type:'mcq',
  q:'Relation R(A, B, C, D) has the functional dependencies AB \u2192 C, C \u2192 D and D \u2192 A. What is the highest normal form that R satisfies?',
  opts:['1NF only','2NF','3NF','BCNF'], ans:2,
  exp:'The candidate keys are AB, BC and BD, so every attribute is prime and 3NF holds. C \u2192 D has a non-superkey left side, so BCNF fails.' },

{ id:'db02', subj:'dbms', ch:'db-norm', marks:1, type:'mcq',
  q:'Which statement is always true?',
  opts:['A relation in 3NF is in BCNF','A relation in BCNF is in 3NF','BCNF decomposition always preserves dependencies','Every relation has a BCNF decomposition that is dependency preserving'], ans:1,
  exp:'BCNF is strictly stronger than 3NF. BCNF decomposition is always lossless but may lose a dependency.' },

{ id:'db03', subj:'dbms', ch:'db-norm', marks:2, type:'nat',
  q:'Relation R(A, B, C, D, E) has the dependencies A \u2192 B, BC \u2192 E and ED \u2192 A. How many candidate keys does R have?', ans:3,
  exp:'C and D appear on no right side, so both are in every key. ACD, BCD and CDE each determine all attributes, giving 3 candidate keys.' },

{ id:'db04', subj:'dbms', ch:'db-ra', marks:1, type:'mcq',
  q:'A column Marks in a table of 100 rows contains 20 NULLs. What do COUNT(*) and COUNT(Marks) return?',
  opts:['100 and 100','100 and 80','80 and 80','80 and 100'], ans:1,
  exp:'COUNT(*) counts rows while COUNT(column) skips NULLs, so the answers are 100 and 80.' },

{ id:'db05', subj:'dbms', ch:'db-ra', marks:2, type:'nat',
  q:'R(A, B) has 10 tuples and S(B, C) has 5 tuples. B is the primary key of S and every R.B value is a non-null foreign key referring to S. How many tuples does the natural join of R and S contain?', ans:10,
  exp:'Each R tuple matches exactly one S tuple because B is a key in S and never null in R, so the join has 10 tuples.' },

{ id:'db06', subj:'dbms', ch:'db-txn', marks:1, type:'mcq',
  q:'The two-phase locking protocol guarantees',
  opts:['conflict serializability','freedom from deadlock','recoverability','view serializability but not conflict serializability'], ans:0,
  exp:'2PL produces conflict serializable schedules, but deadlocks are still possible and cascading rollback needs the strict variant.' },

{ id:'db07', subj:'dbms', ch:'db-txn', marks:2, type:'mcq',
  q:'Which protocol prevents cascading rollbacks?',
  opts:['Basic two-phase locking','Strict two-phase locking','Timestamp ordering without validation','Optimistic concurrency control'], ans:1,
  exp:'Strict 2PL holds exclusive locks until commit, so no transaction ever reads uncommitted data and rollbacks cannot cascade.' },

{ id:'db08', subj:'dbms', ch:'db-file', marks:2, type:'nat',
  q:'A B+ tree index uses 1024-byte blocks, 9-byte search keys and 7-byte block pointers. What is the maximum order (number of block pointers per node)?', ans:64,
  exp:'Solve 7n + 9(n\u22121) \u2264 1024, so 16n \u2264 1033 and n = 64.' },

{ id:'db09', subj:'dbms', ch:'db-file', marks:1, type:'mcq',
  q:'A key difference between a B tree and a B+ tree index is that in a B+ tree',
  opts:['internal nodes also store record pointers','all record pointers are in the leaves, which are linked','the height is always 1','duplicate keys are not allowed'], ans:1,
  exp:'B+ tree leaves hold every key with its record pointer and are chained, which makes range scans efficient.' },

{ id:'db10', subj:'dbms', ch:'db-er', marks:1, type:'mcq',
  q:'A weak entity set',
  opts:['has its own complete primary key','is identified by a partial key plus the key of its owner','cannot participate in relationships','must always be merged into its owner'], ans:1,
  exp:'A weak entity has no sufficient key of its own, so it combines a discriminator with the identifying owner\u2019s key.' },

{ id:'db11', subj:'dbms', ch:'db-ra', marks:2, type:'mcq',
  q:'Which relational algebra expression is equivalent to the SQL query: SELECT A FROM R WHERE B > 5?',
  opts:['\u03c0\u2090(\u03c3_{B>5}(R))','\u03c3_{B>5}(\u03c0\u2090(R))','\u03c0\u2090(R) \u22c8 \u03c3_{B>5}(R)','\u03c3\u2090(\u03c0_{B>5}(R))'], ans:0,
  exp:'Select the qualifying tuples first, then project. Projecting first would discard B and make the condition unevaluable.' },

{ id:'db12', subj:'dbms', ch:'db-txn', marks:2, type:'mcq',
  q:'A schedule is conflict serializable if and only if',
  opts:['it has no blind writes','its precedence (serialization) graph is acyclic','every transaction is two-phase locked','it is recoverable'], ans:1,
  exp:'Build a node per transaction and an edge for each conflicting pair in order. The schedule is conflict serializable exactly when this graph has no cycle.' },

/* ---------------- COMPUTER NETWORKS ---------------- */
{ id:'cn01', subj:'cn', ch:'cn-net', marks:1, type:'nat',
  q:'How many usable host addresses are available in the subnet 192.168.10.0/26?', ans:62,
  exp:'A /26 leaves 6 host bits, so 2\u2076 = 64 addresses, minus the network and broadcast addresses gives 62.' },

{ id:'cn02', subj:'cn', ch:'cn-net', marks:2, type:'nat',
  q:'A class C network 200.1.1.0/24 is divided into equal subnets with a /27 mask. How many subnets are created?', ans:8,
  exp:'Three extra bits are borrowed for the subnet field, so 2\u00b3 = 8 subnets of 32 addresses each.' },

{ id:'cn03', subj:'cn', ch:'cn-net', marks:1, type:'mcq',
  q:'The dotted decimal subnet mask corresponding to a /20 prefix is',
  opts:['255.255.255.240','255.255.240.0','255.240.0.0','255.255.248.0'], ans:1,
  exp:'Twenty leading ones give 11111111.11111111.11110000.00000000, which is 255.255.240.0.' },

{ id:'cn04', subj:'cn', ch:'cn-dll', marks:2, type:'nat',
  q:'A 1 Mbps link has a one-way propagation delay of 10 ms and carries 1000-bit frames using stop-and-wait. What is the link utilisation, as a percentage?', ans:4.76, tol:0.1,
  exp:'Transmission time is 1 ms, so utilisation = 1/(1 + 2 \u00d7 10) = 1/21 \u2248 4.76%.' },

{ id:'cn05', subj:'cn', ch:'cn-dll', marks:2, type:'nat',
  q:'A go-back-N protocol uses 5-bit sequence numbers. What is the maximum allowed sender window size?', ans:31,
  exp:'Go-back-N needs a window of at most 2\u207f \u2212 1, which is 31 for n = 5. Selective repeat would allow 16.' },

{ id:'cn06', subj:'cn', ch:'cn-dll', marks:2, type:'nat',
  q:'A 1 Mbps link has a round trip time of 100 ms and uses 1000-bit frames. What sender window size gives full utilisation?', ans:101,
  exp:'Transmission time is 1 ms, so the window must cover 1 + RTT/T\u209c = 1 + 100 = 101 frames.' },

{ id:'cn07', subj:'cn', ch:'cn-dll', marks:1, type:'mcq',
  q:'In CSMA/CD, the minimum frame size must be large enough that the transmission time is at least',
  opts:['one propagation delay','twice the propagation delay','half the propagation delay','the round trip queuing delay'], ans:1,
  exp:'A sender must still be transmitting when the worst case collision signal returns, which takes 2\u00d7 the one-way propagation delay.' },

{ id:'cn08', subj:'cn', ch:'cn-trans', marks:2, type:'nat',
  q:'A TCP connection starts slow start with cwnd = 1 MSS and ssthresh = 32 MSS. Assuming no loss, what is cwnd in MSS after 5 successful round trips?', ans:32,
  exp:'cwnd doubles each RTT: 1, 2, 4, 8, 16, 32. After the fifth RTT it reaches the threshold of 32 and switches to congestion avoidance.' },

{ id:'cn09', subj:'cn', ch:'cn-trans', marks:2, type:'mcq',
  q:'When a TCP sender detects loss through a timeout, the usual reaction is',
  opts:['ssthresh = cwnd/2 and cwnd = 1 MSS','cwnd is halved and slow start is skipped','cwnd is unchanged and the segment is resent','the connection is reset'], ans:0,
  exp:'A timeout is treated as severe congestion: the threshold is halved and the window collapses to one segment, restarting slow start. Fast recovery only halves cwnd.' },

{ id:'cn10', subj:'cn', ch:'cn-trans', marks:1, type:'mcq',
  q:'Which pair of features does UDP provide?',
  opts:['Connectionless delivery and an optional checksum','Reliable ordered delivery and flow control','Congestion control and retransmission','Connection setup and teardown'], ans:0,
  exp:'UDP adds only ports, length and a checksum to IP. Ordering, reliability and congestion control are left to the application.' },

{ id:'cn11', subj:'cn', ch:'cn-app', marks:1, type:'mcq',
  q:'DNS normally uses which transport protocol and port?',
  opts:['TCP port 25','UDP port 53','UDP port 67','TCP port 80'], ans:1,
  exp:'Ordinary queries use UDP port 53; TCP on the same port is used for large responses and zone transfers.' },

{ id:'cn12', subj:'cn', ch:'cn-layer', marks:1, type:'mcq',
  q:'A device that forwards packets between networks based on IP addresses operates at the',
  opts:['physical layer','data link layer','network layer','transport layer'], ans:2,
  exp:'Routers examine network layer addresses. Switches and bridges work with MAC addresses at the data link layer.' },

/* ---------------- THEORY OF COMPUTATION ---------------- */
{ id:'toc01', subj:'toc', ch:'toc-reg', marks:1, type:'nat',
  q:'What is the number of states in the minimal DFA accepting all strings over {a, b} in which the number of a\u2019s is divisible by 3?', ans:3,
  exp:'Track the count of a\u2019s modulo 3. Three states are needed and none can be merged.' },

{ id:'toc02', subj:'toc', ch:'toc-reg', marks:2, type:'nat',
  q:'How many states does the minimal DFA accepting binary strings that represent numbers divisible by 5 (read most significant bit first) have?', ans:5,
  exp:'The state is the remainder modulo 5, and each of the five remainders is reachable and distinguishable.' },

{ id:'toc03', subj:'toc', ch:'toc-reg', marks:2, type:'nat',
  q:'An NFA has 4 states. What is the maximum number of states in an equivalent DFA produced by subset construction?', ans:16,
  exp:'Subset construction can produce one DFA state per subset of NFA states, so at most 2\u2074 = 16.' },

{ id:'toc04', subj:'toc', ch:'toc-reg', marks:2, type:'nat',
  q:'How many states does the minimal DFA over {0, 1} accepting exactly the strings that end with 01 have?', ans:3,
  exp:'Remember whether the recent suffix is nothing useful, a 0, or 01. Three states suffice and all are distinguishable.' },

{ id:'toc05', subj:'toc', ch:'toc-reg', marks:1, type:'mcq',
  q:'The language L = {a\u207f b\u207f | n \u2265 1} is',
  opts:['regular','context free but not regular','context sensitive but not context free','not recursively enumerable'], ans:1,
  exp:'A finite automaton cannot count unbounded n, but a PDA can match a\u2019s against b\u2019s with its stack.' },

{ id:'toc06', subj:'toc', ch:'toc-cfl', marks:1, type:'mcq',
  q:'The language L = {a\u207f b\u207f c\u207f | n \u2265 1} is',
  opts:['regular','context free','context sensitive but not context free','undecidable'], ans:2,
  exp:'One stack cannot enforce two independent matchings, so the pumping lemma for CFLs rules it out. A linear bounded automaton accepts it.' },

{ id:'toc07', subj:'toc', ch:'toc-closure', marks:1, type:'msq',
  q:'Context free languages are closed under which of the following operations? (Select all that apply.)',
  opts:['Union','Concatenation','Intersection','Kleene star'], ans:[0,1,3],
  exp:'CFLs are closed under union, concatenation and star, but not under intersection or complement.' },

{ id:'toc08', subj:'toc', ch:'toc-closure', marks:2, type:'mcq',
  q:'Which of the following problems about context free grammars is decidable?',
  opts:['Whether the generated language is empty','Whether two grammars generate the same language','Whether a grammar is ambiguous','Whether the generated language equals \u03a3*'], ans:0,
  exp:'Emptiness is decidable by checking whether the start symbol is generating. Equivalence, ambiguity and universality are all undecidable for CFGs.' },

{ id:'toc09', subj:'toc', ch:'toc-tm', marks:1, type:'mcq',
  q:'The halting problem for Turing machines is',
  opts:['decidable','undecidable but recursively enumerable','not recursively enumerable','decidable only for deterministic machines'], ans:1,
  exp:'You can recognise halting by simulation, so the language is recursively enumerable, but no machine decides it for all inputs.' },

{ id:'toc10', subj:'toc', ch:'toc-tm', marks:2, type:'mcq',
  q:'Rice\u2019s theorem states that',
  opts:['every language is decidable','any non-trivial property of the language recognised by a Turing machine is undecidable','the union of two decidable languages is undecidable','every recursively enumerable language is decidable'], ans:1,
  exp:'Non-trivial semantic properties such as "is the language empty" or "is the language regular" are all undecidable by Rice\u2019s theorem.' },

{ id:'toc11', subj:'toc', ch:'toc-cfl', marks:2, type:'mcq',
  q:'Which statement about deterministic context free languages (DCFLs) is true?',
  opts:['DCFLs are closed under complement','DCFLs are closed under intersection','Every CFL is a DCFL','DCFLs are not closed under complement'], ans:0,
  exp:'DCFLs are closed under complement, unlike general CFLs, but they are not closed under union or intersection.' },

{ id:'toc12', subj:'toc', ch:'toc-closure', marks:1, type:'mcq',
  q:'Regular languages are closed under complement because',
  opts:['every regular language is finite','a DFA can be complemented by swapping accepting and non-accepting states','regular expressions include a complement operator','NFAs have no dead states'], ans:1,
  exp:'Complete the DFA, then flip the accepting set. This does not work directly on an NFA.' },

/* ---------------- COMPILER DESIGN ---------------- */
{ id:'cd01', subj:'cd', ch:'cd-lex', marks:1, type:'nat',
  q:'How many tokens does the lexical analyser of a C compiler produce for the statement: int a = b + 10;', ans:7,
  exp:'The tokens are int, a, =, b, +, 10 and the semicolon, which is 7.' },

{ id:'cd02', subj:'cd', ch:'cd-parse', marks:1, type:'mcq',
  q:'Which containment relation among grammar classes is correct?',
  opts:['LR(1) \u2286 LALR(1) \u2286 SLR(1)','SLR(1) \u2286 LALR(1) \u2286 LR(1)','LALR(1) \u2286 SLR(1) \u2286 LR(1)','LR(0) \u2286 LR(1) \u2286 SLR(1)'], ans:1,
  exp:'Every SLR(1) grammar is LALR(1) and every LALR(1) grammar is LR(1). The reverse inclusions fail.' },

{ id:'cd03', subj:'cd', ch:'cd-parse', marks:2, type:'mcq',
  q:'A grammar cannot be LL(1) if it',
  opts:['is left recursive','has more than three productions','uses terminals only on the right side','has an epsilon production anywhere'], ans:0,
  exp:'Left recursion makes a top-down predictive parser loop. Epsilon productions are allowed as long as the FIRST and FOLLOW sets stay disjoint.' },

{ id:'cd04', subj:'cd', ch:'cd-parse', marks:2, type:'nat',
  q:'For the grammar S \u2192 AB, A \u2192 a | \u03b5, B \u2192 b, how many terminals are in FIRST(S)?', ans:2,
  exp:'A can derive \u03b5, so FIRST(S) includes FIRST(A) = {a} and also FIRST(B) = {b}, giving 2 terminals.' },

{ id:'cd05', subj:'cd', ch:'cd-parse', marks:2, type:'nat',
  q:'Using the grammar E \u2192 E + E | id with a bottom-up parser, how many reduce moves are needed to parse id + id + id?', ans:5,
  exp:'Three reductions turn each id into E, and two more apply E \u2192 E + E, giving 5 reductions in total.' },

{ id:'cd06', subj:'cd', ch:'cd-sdt', marks:2, type:'mcq',
  q:'An S-attributed syntax directed definition',
  opts:['uses only inherited attributes and needs a top-down pass','uses only synthesized attributes and can be evaluated bottom-up','requires two passes over the parse tree','cannot be used with an LR parser'], ans:1,
  exp:'Synthesized attributes flow from children to parent, so they can be computed during a bottom-up parse on the parser stack.' },

{ id:'cd07', subj:'cd', ch:'cd-inter', marks:2, type:'nat',
  q:'How many temporary variables does a straightforward three-address code translation of a = b*c + d*e \u2212 f require?', ans:4,
  exp:'t1 = b*c, t2 = d*e, t3 = t1+t2, t4 = t3\u2212f, then a = t4, so 4 temporaries.' },

{ id:'cd08', subj:'cd', ch:'cd-opt', marks:2, type:'nat',
  q:'Consider the code: (1) i = 0  (2) if i < n goto (5)  (3) x = x + 1  (4) goto (6)  (5) x = x \u2212 1  (6) print x. How many basic blocks does this code have?', ans:4,
  exp:'The leaders are statements 1, 3, 5 and 6, so the blocks are {1,2}, {3,4}, {5} and {6}.' },

{ id:'cd09', subj:'cd', ch:'cd-runtime', marks:1, type:'mcq',
  q:'An activation record typically does NOT contain',
  opts:['the return address','space for local variables','the machine code of the function body','saved register values'], ans:2,
  exp:'Code lives in the text segment. The activation record on the stack holds the return address, parameters, locals, temporaries and saved registers.' },

{ id:'cd10', subj:'cd', ch:'cd-lex', marks:1, type:'mcq',
  q:'The use of an undeclared variable is detected during',
  opts:['lexical analysis','syntax analysis','semantic analysis','code generation'], ans:2,
  exp:'The scanner only classifies tokens and the parser only checks grammar. Symbol table checks such as declaration and type belong to semantic analysis.' },

/* ---------------- C PROGRAMMING ---------------- */
{ id:'cp01', subj:'cp', ch:'cp-ptr', marks:2, type:'mcq',
  q:'Given int a[5] = {1, 2, 3, 4, 5}; int *p = a; what does printf("%d", *(p + 2)) print?',
  opts:['2','3','4','the address of a[2]'], ans:1,
  exp:'Pointer arithmetic scales by the element size, so p+2 points to a[2] and dereferencing gives 3.' },

{ id:'cp02', subj:'cp', ch:'cp-ptr', marks:2, type:'mcq',
  q:'For int x = 5; int *p = &x; what is the difference between *p++ and (*p)++?',
  opts:['Both increment x','*p++ increments x; (*p)++ increments p','*p++ increments the pointer; (*p)++ increments x','Both increment the pointer'], ans:2,
  exp:'Postfix ++ binds tighter than unary *, so *p++ reads through p and then advances p. Parentheses force the increment onto the pointed-to value.' },

{ id:'cp03', subj:'cp', ch:'cp-func', marks:2, type:'nat',
  q:'A function is defined as f(n) = 1 if n \u2264 1, else f(n\u22121) + f(n\u22122). What is f(5)?', ans:8,
  exp:'f(2) = 2, f(3) = 3, f(4) = 5 and f(5) = 8.' },

{ id:'cp04', subj:'cp', ch:'cp-func', marks:2, type:'nat',
  q:'For the same definition f(n) = 1 if n \u2264 1 else f(n\u22121) + f(n\u22122), how many times is f called in total when f(5) is evaluated (counting the initial call)?', ans:15,
  exp:'calls(n) = 1 + calls(n\u22121) + calls(n\u22122) with calls(0) = calls(1) = 1, giving 3, 5, 9 and 15.' },

{ id:'cp05', subj:'cp', ch:'cp-basic', marks:1, type:'mcq',
  q:'What does printf("%d", 5 / 2 * 2) print in C?',
  opts:['5','4','2','2.5'], ans:1,
  exp:'Integer division and multiplication have equal precedence and associate left to right, so 5/2 gives 2 and 2*2 gives 4.' },

{ id:'cp06', subj:'cp', ch:'cp-ptr', marks:1, type:'mcq',
  q:'On a 64-bit machine, for char *s = "hello"; what does sizeof(s) return?',
  opts:['5','6','8','1'], ans:2,
  exp:'s is a pointer, so sizeof gives the pointer size of 8 bytes. sizeof("hello") would be 6, counting the terminating null.' },

{ id:'cp07', subj:'cp', ch:'cp-func', marks:1, type:'mcq',
  q:'When an array is passed to a C function, what is actually passed?',
  opts:['A copy of the whole array','A pointer to the first element','The array length','A reference in the C++ sense'], ans:1,
  exp:'The array name decays to a pointer, so the callee can modify the caller\u2019s data and sizeof inside the callee gives the pointer size.' },

{ id:'cp08', subj:'cp', ch:'cp-basic', marks:2, type:'nat',
  q:'How many times does the body of the loop for (i = 0; i < 10; i += 3) execute?', ans:4,
  exp:'i takes the values 0, 3, 6 and 9, and the loop stops at 12.' },

/* ---------------- DATA STRUCTURES ---------------- */
{ id:'ds01', subj:'ds', ch:'ds-tree', marks:2, type:'nat',
  q:'How many distinct binary search trees can be built from 4 distinct keys?', ans:14,
  exp:'The count is the Catalan number C\u2084 = C(8,4)/5 = 14.' },

{ id:'ds02', subj:'ds', ch:'ds-tree', marks:2, type:'nat',
  q:'What is the minimum number of nodes in an AVL tree of height 4 (a single node has height 0)?', ans:12,
  exp:'N(h) = N(h\u22121) + N(h\u22122) + 1 with N(0) = 1 and N(1) = 2 gives 4, 7 and then 12.' },

{ id:'ds03', subj:'ds', ch:'ds-tree', marks:1, type:'mcq',
  q:'Which traversal of a binary search tree visits the keys in sorted order?',
  opts:['Preorder','Inorder','Postorder','Level order'], ans:1,
  exp:'Inorder visits the left subtree, the node, then the right subtree, which matches the BST ordering property.' },

{ id:'ds04', subj:'ds', ch:'ds-tree', marks:2, type:'nat',
  q:'A complete binary tree has 20 nodes. How many of them are leaves?', ans:10,
  exp:'In a complete binary tree with n nodes there are \u2308n/2\u2309 leaves, which is 10.' },

{ id:'ds05', subj:'ds', ch:'ds-heap', marks:1, type:'mcq',
  q:'Building a binary heap from an unsorted array of n elements using repeated heapify from the bottom up takes',
  opts:['O(n)','O(n log n)','O(log n)','O(n\u00b2)'], ans:0,
  exp:'Most nodes are near the leaves and need little work; the sum of heights telescopes to O(n). Inserting one at a time would cost O(n log n).' },

{ id:'ds06', subj:'ds', ch:'ds-heap', marks:2, type:'nat',
  q:'A binary heap stores 1000 elements. What is its height, taking the height of a single-node heap as 0?', ans:9,
  exp:'The height is \u230alog\u2082 1000\u230b = 9 because 2\u2079 = 512 \u2264 1000 < 1024.' },

{ id:'ds07', subj:'ds', ch:'ds-array', marks:2, type:'nat',
  q:'The numbers 1, 2, 3 are pushed onto a stack in that order, with pops allowed at any time. How many distinct output permutations are possible?', ans:5,
  exp:'Stack-realisable permutations are counted by the Catalan number C\u2083 = 5; only 3, 1, 2 is impossible.' },

{ id:'ds08', subj:'ds', ch:'ds-array', marks:1, type:'mcq',
  q:'A queue is implemented with two stacks. The amortised cost per enqueue or dequeue operation is',
  opts:['O(1)','O(log n)','O(n)','O(n log n)'], ans:0,
  exp:'Each element is moved between the stacks at most once, so the amortised cost per operation is constant even though one dequeue can cost O(n).' },

{ id:'ds09', subj:'ds', ch:'ds-hash', marks:2, type:'mcq',
  q:'A hash table of size 10 uses h(k) = k mod 10 with linear probing. The keys 12, 22 and 32 are inserted in that order. Which slots do they occupy?',
  opts:['2, 2, 2','2, 3, 4','2, 12, 22','2, 4, 6'], ans:1,
  exp:'12 hashes to slot 2. 22 and 32 collide there and probe forward to slots 3 and 4.' },

{ id:'ds10', subj:'ds', ch:'ds-hash', marks:1, type:'mcq',
  q:'In a hash table with separate chaining holding n keys, the worst case time to search for a key is',
  opts:['O(1)','O(log n)','O(n)','O(n log n)'], ans:2,
  exp:'If every key hashes to the same bucket, the chain has length n and the search degenerates to a linear scan.' },

{ id:'ds11', subj:'ds', ch:'ds-ll', marks:1, type:'mcq',
  q:'In a singly linked list with only a head pointer, deleting the last node takes',
  opts:['O(1)','O(log n)','O(n)','O(n\u00b2)'], ans:2,
  exp:'You must walk to the second last node to update its next pointer, which takes linear time.' },

{ id:'ds12', subj:'ds', ch:'ds-graph', marks:1, type:'mcq',
  q:'For a sparse graph with V vertices and E edges, the space used by an adjacency list versus an adjacency matrix is',
  opts:['O(V + E) versus O(V\u00b2)','O(V\u00b2) versus O(V + E)','O(E) versus O(E)','O(V) versus O(V)'], ans:0,
  exp:'An adjacency list stores each edge once plus one entry per vertex, while a matrix always reserves V\u00b2 cells.' },

/* ---------------- ALGORITHMS ---------------- */
{ id:'al01', subj:'algo', ch:'algo-async', marks:1, type:'mcq',
  q:'The recurrence T(n) = 2T(n/2) + n with T(1) = 1 solves to',
  opts:['\u0398(n)','\u0398(n log n)','\u0398(n\u00b2)','\u0398(log n)'], ans:1,
  exp:'This is master theorem case 2 because n^log\u2082 2 = n matches the combine cost, giving \u0398(n log n).' },

{ id:'al02', subj:'algo', ch:'algo-async', marks:2, type:'mcq',
  q:'The recurrence T(n) = 4T(n/2) + n\u00b2 solves to',
  opts:['\u0398(n\u00b2)','\u0398(n\u00b2 log n)','\u0398(n\u00b3)','\u0398(n log n)'], ans:1,
  exp:'Here n^log\u2082 4 = n\u00b2 equals the work outside the recursion, so an extra log n factor appears.' },

{ id:'al03', subj:'algo', ch:'algo-async', marks:2, type:'mcq',
  q:'The recurrence T(n) = T(n\u22121) + n with T(1) = 1 solves to',
  opts:['\u0398(n)','\u0398(n log n)','\u0398(n\u00b2)','\u0398(2\u207f)'], ans:2,
  exp:'Unrolling gives 1 + 2 + \u2026 + n = n(n+1)/2, which is \u0398(n\u00b2).' },

{ id:'al04', subj:'algo', ch:'algo-sort', marks:1, type:'mcq',
  q:'The worst case running time of quicksort with the first element as pivot, on an already sorted array, is',
  opts:['\u0398(n log n)','\u0398(n)','\u0398(n\u00b2)','\u0398(log n)'], ans:2,
  exp:'Every partition splits off one element, producing n levels of \u0398(n) work each.' },

{ id:'al05', subj:'algo', ch:'algo-sort', marks:2, type:'nat',
  q:'What is the minimum number of comparisons needed to find both the minimum and the maximum of 100 distinct elements?', ans:148,
  exp:'Pairing elements gives 3n/2 \u2212 2 comparisons, which is 150 \u2212 2 = 148.' },

{ id:'al06', subj:'algo', ch:'algo-sort', marks:1, type:'mcq',
  q:'Which of these comparison sorts is stable in its standard form?',
  opts:['Heapsort','Quicksort with in-place partition','Merge sort','Selection sort'], ans:2,
  exp:'Merge sort preserves the relative order of equal keys when the merge step prefers the left run.' },

{ id:'al07', subj:'algo', ch:'algo-dp', marks:2, type:'nat',
  q:'What is the length of the longest common subsequence of ABCBDAB and BDCABA?', ans:4,
  exp:'BCBA (or BDAB) has length 4 and no common subsequence is longer.' },

{ id:'al08', subj:'algo', ch:'algo-dp', marks:1, type:'mcq',
  q:'The standard dynamic programming solution to the 0/1 knapsack problem with n items and capacity W runs in',
  opts:['O(n log W)','O(nW), which is pseudo-polynomial','O(n\u00b2)','O(2\u207f) with no better option'], ans:1,
  exp:'The table has nW cells, each filled in constant time. It is pseudo-polynomial because W is exponential in the number of bits used to write it.' },

{ id:'al09', subj:'algo', ch:'algo-graph', marks:1, type:'mcq',
  q:'Dijkstra\u2019s algorithm implemented with a binary min-heap runs in',
  opts:['O(V\u00b2)','O((V + E) log V)','O(VE)','O(E + V)'], ans:1,
  exp:'Each vertex is extracted once and each edge can trigger one decrease-key, each costing O(log V).' },

{ id:'al10', subj:'algo', ch:'algo-graph', marks:2, type:'mcq',
  q:'Which statement about the Bellman-Ford algorithm is correct?',
  opts:['It runs in O(E log V) and rejects negative edges','It runs in O(VE) and detects negative weight cycles','It is faster than Dijkstra on all graphs','It needs the graph to be acyclic'], ans:1,
  exp:'It relaxes all edges V\u22121 times, then one more pass; any further improvement proves a negative cycle exists.' },

{ id:'al11', subj:'algo', ch:'algo-graph', marks:2, type:'nat',
  q:'How many distinct labelled spanning trees does the complete graph K\u2084 have?', ans:16,
  exp:'By Cayley\u2019s formula the count is n^(n\u22122) = 4\u00b2 = 16.' },

{ id:'al12', subj:'algo', ch:'algo-greedy', marks:1, type:'mcq',
  q:'Huffman coding is an example of',
  opts:['a greedy algorithm that yields an optimal prefix code','a dynamic programming algorithm','a divide and conquer algorithm','an approximation algorithm with ratio 2'], ans:0,
  exp:'Repeatedly merging the two least frequent symbols is a greedy choice that provably minimises the expected code length.' },

{ id:'al13', subj:'algo', ch:'algo-dnc', marks:2, type:'mcq',
  q:'Strassen\u2019s matrix multiplication satisfies T(n) = 7T(n/2) + \u0398(n\u00b2). Its running time is',
  opts:['\u0398(n\u00b3)','\u0398(n^2.81) approximately','\u0398(n\u00b2)','\u0398(n\u00b2 log n)'], ans:1,
  exp:'The master theorem gives \u0398(n^log\u2082 7) and log\u2082 7 \u2248 2.807, beating the naive \u0398(n\u00b3).' },

{ id:'al14', subj:'algo', ch:'algo-greedy', marks:2, type:'mcq',
  q:'For the fractional knapsack problem, the greedy strategy that is optimal picks items in decreasing order of',
  opts:['value','weight','value per unit weight','value minus weight'], ans:2,
  exp:'Because items can be split, filling capacity with the highest value density first is optimal. This fails for 0/1 knapsack.' }

];

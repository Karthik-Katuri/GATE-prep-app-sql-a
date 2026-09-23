/* ============================================================
   questions.math.js  —  engineering mathematics and aptitude
   Original GATE-pattern practice questions written for this app.
   ============================================================ */

window.GP_Q_MATH = [

/* ---------------- DISCRETE MATHEMATICS ---------------- */
{ id:'dm01', subj:'dm', ch:'dm-comb', marks:2, type:'nat',
  q:'How many onto (surjective) functions exist from a set of 5 elements to a set of 3 elements?', ans:150,
  exp:'By inclusion-exclusion: 3\u2075 \u2212 3\u00b72\u2075 + 3\u00b71\u2075 = 243 \u2212 96 + 3 = 150.' },

{ id:'dm02', subj:'dm', ch:'dm-comb', marks:2, type:'nat',
  q:'In how many ways can 10 identical balls be placed into 4 distinct boxes, where a box may stay empty?', ans:286,
  exp:'Stars and bars gives C(10+4\u22121, 4\u22121) = C(13,3) = 286.' },

{ id:'dm03', subj:'dm', ch:'dm-comb', marks:1, type:'nat',
  q:'What is the minimum number of people needed in a room to guarantee that at least two of them were born in the same calendar month?', ans:13,
  exp:'With 12 months as pigeonholes, 13 people force a repeat.' },

{ id:'dm04', subj:'dm', ch:'dm-set', marks:2, type:'nat',
  q:'How many distinct equivalence relations can be defined on a set of 4 elements?', ans:15,
  exp:'Equivalence relations correspond to partitions, and the Bell number B\u2084 = 15.' },

{ id:'dm05', subj:'dm', ch:'dm-set', marks:2, type:'nat',
  q:'How many reflexive relations can be defined on a set of 3 elements?', ans:64,
  exp:'The 3 diagonal pairs are forced, leaving 9 \u2212 3 = 6 free pairs, so 2\u2076 = 64.' },

{ id:'dm06', subj:'dm', ch:'dm-set', marks:2, type:'nat',
  q:'In the poset of the positive divisors of 30 ordered by divisibility, how many atoms (minimal elements above the least element) are there?', ans:3,
  exp:'The divisors are 1, 2, 3, 5, 6, 10, 15, 30 and the atoms sitting directly above 1 are the primes 2, 3 and 5.' },

{ id:'dm07', subj:'dm', ch:'dm-rec', marks:2, type:'mcq',
  q:'The characteristic roots of the recurrence a\u2099 = 5a\u2099\u208b\u2081 \u2212 6a\u2099\u208b\u2082 are',
  opts:['1 and 6','2 and 3','\u22122 and \u22123','5 and \u22126'], ans:1,
  exp:'The characteristic equation x\u00b2 \u2212 5x + 6 = 0 factors as (x\u22122)(x\u22123) = 0.' },

{ id:'dm08', subj:'dm', ch:'dm-rec', marks:2, type:'nat',
  q:'Given a\u2099 = 5a\u2099\u208b\u2081 \u2212 6a\u2099\u208b\u2082 with a\u2080 = 1 and a\u2081 = 0, what is the value of a\u2083?', ans:-30,
  exp:'a\u2082 = 5(0) \u2212 6(1) = \u22126 and a\u2083 = 5(\u22126) \u2212 6(0) = \u221230.' },

{ id:'dm09', subj:'dm', ch:'dm-graph', marks:1, type:'nat',
  q:'How many edges does the complete graph K\u2081\u2080 have?', ans:45,
  exp:'In K\\u2099 every pair of distinct vertices is joined by exactly one edge, so the edge count is the number of 2-element subsets of the vertex set: C(n,2) = n(n\\u22121)/2. For n = 10 that is (10 \\u00d7 9)/2 = 45.' },

{ id:'dm10', subj:'dm', ch:'dm-graph', marks:2, type:'nat',
  q:'A simple graph has 10 vertices and every vertex has degree 3. How many edges does it have?', ans:15,
  exp:'By the handshaking lemma the sum of degrees 30 equals twice the edge count, so there are 15 edges.' },

{ id:'dm11', subj:'dm', ch:'dm-graph', marks:1, type:'nat',
  q:'What is the chromatic number of the cycle graph C\u2085?', ans:3,
  exp:'An odd cycle is not bipartite, so two colours are insufficient and three suffice.' },

{ id:'dm12', subj:'dm', ch:'dm-graph', marks:1, type:'mcq',
  q:'A connected undirected graph has an Euler circuit if and only if',
  opts:['every vertex has even degree','exactly two vertices have odd degree','it has no cycles','it is complete'], ans:0,
  exp:'Every vertex needs even degree for a closed Euler tour. Exactly two odd vertices give an open Euler path instead.' },

{ id:'dm13', subj:'dm', ch:'dm-logic', marks:1, type:'mcq',
  q:'The statement p \u2192 q is logically equivalent to',
  opts:['q \u2192 p','\u00acq \u2192 \u00acp','p \u2227 \u00acq','\u00acp \u2192 \u00acq'], ans:1,
  exp:'The contrapositive is equivalent. The converse and inverse are not.' },

{ id:'dm14', subj:'dm', ch:'dm-logic', marks:2, type:'nat',
  q:'How many of the 8 truth assignments to p, q and r satisfy (p \u2228 q) \u2227 (\u00acp \u2228 r)?', ans:4,
  exp:'The satisfying rows are (F,T,F), (F,T,T), (T,F,T) and (T,T,T).' },

{ id:'dm15', subj:'dm', ch:'dm-group', marks:2, type:'nat',
  q:'How many generators does the cyclic group (\u2124\u2081\u2082, +) have?', ans:4,
  exp:'The generators are the elements coprime to 12, and \u03c6(12) = 4, namely 1, 5, 7 and 11.' },

{ id:'dm16', subj:'dm', ch:'dm-group', marks:1, type:'mcq',
  q:'Lagrange\u2019s theorem implies that in a finite group',
  opts:['every subgroup is normal','the order of every subgroup divides the order of the group','every element has order equal to the group order','the group must be abelian'], ans:1,
  exp:'Cosets of a subgroup partition the group into equal sized blocks, so the subgroup order divides the group order.' },

{ id:'dm17', subj:'dm', ch:'dm-set', marks:2, type:'nat',
  q:'How many one-to-one (injective) functions exist from a set of 3 elements to a set of 5 elements?', ans:60,
  exp:'5 \u00d7 4 \u00d7 3 = 60 ordered choices of distinct images.' },

{ id:'dm18', subj:'dm', ch:'dm-logic', marks:2, type:'mcq',
  q:'Which formula correctly expresses "every student has read some book" using S(x) for student, B(y) for book and R(x,y) for x has read y?',
  opts:['\u2200x (S(x) \u2192 \u2203y (B(y) \u2227 R(x,y)))','\u2203y \u2200x (B(y) \u2227 R(x,y))','\u2200x \u2200y (S(x) \u2192 R(x,y))','\u2203x (S(x) \u2227 \u2200y R(x,y))'], ans:0,
  exp:'The universal quantifier ranges over students with an implication, and the book is chosen inside, so it may differ per student.' },

/* ---------------- LINEAR ALGEBRA ---------------- */
{ id:'la01', subj:'la', ch:'la-eigen', marks:2, type:'mcq',
  q:'The eigenvalues of the matrix [[4, 1], [2, 3]] are',
  opts:['1 and 6','2 and 5','3 and 4','\u22121 and 7'], ans:1,
  exp:'Trace 7 and determinant 10 give \u03bb\u00b2 \u2212 7\u03bb + 10 = 0, so \u03bb = 2 and 5.' },

{ id:'la02', subj:'la', ch:'la-eigen', marks:1, type:'nat',
  q:'What is the sum of the eigenvalues of the upper triangular matrix [[2,1,0],[0,3,4],[0,0,5]]?', ans:10,
  exp:'The eigenvalues of a triangular matrix are its diagonal entries, and the sum equals the trace: 2+3+5 = 10.' },

{ id:'la03', subj:'la', ch:'la-matrix', marks:2, type:'nat',
  q:'What is the rank of the matrix [[1,2,3],[2,4,6],[1,1,1]]?', ans:2,
  exp:'Row 2 is twice row 1, so only two rows are independent.' },

{ id:'la04', subj:'la', ch:'la-matrix', marks:1, type:'nat',
  q:'A matrix has 5 columns and rank 3. What is the dimension of its null space?', ans:2,
  exp:'By the rank-nullity theorem, nullity = number of columns \u2212 rank = 5 \u2212 3 = 2.' },

{ id:'la05', subj:'la', ch:'la-det', marks:2, type:'nat',
  q:'A is a 3 \u00d7 3 matrix with det(A) = 5. What is det(2A)?', ans:40,
  exp:'Scaling a matrix multiplies the determinant by k\u207f, so det(2A) = 2\u00b3 \u00b7 5 = 40.' },

{ id:'la06', subj:'la', ch:'la-matrix', marks:2, type:'mcq',
  q:'The system AX = b with A of size m \u00d7 n has a unique solution if and only if',
  opts:['rank(A) = rank([A|b]) = n','rank(A) < rank([A|b])','rank(A) = m','det(A) = 0'], ans:0,
  exp:'Equal ranks give consistency, and rank equal to the number of unknowns leaves no free variables.' },

{ id:'la07', subj:'la', ch:'la-eigen', marks:1, type:'mcq',
  q:'If \u03bb is an eigenvalue of A, then the corresponding eigenvalue of A\u00b2 is',
  opts:['\u03bb','2\u03bb','\u03bb\u00b2','1/\u03bb'], ans:2,
  exp:'From Av = \u03bbv we get A\u00b2v = \u03bbAv = \u03bb\u00b2v with the same eigenvector.' },

{ id:'la08', subj:'la', ch:'la-space', marks:1, type:'mcq',
  q:'For a real symmetric matrix, which statement is always true?',
  opts:['All eigenvalues are real and eigenvectors for distinct eigenvalues are orthogonal','All eigenvalues are positive','It is never diagonalisable','Its determinant is always zero'], ans:0,
  exp:'Real symmetric matrices are orthogonally diagonalisable with real eigenvalues. Positivity needs the extra condition of positive definiteness.' },

{ id:'la09', subj:'la', ch:'la-eigen', marks:2, type:'nat',
  q:'A is a 3 \u00d7 3 matrix of rank 1. What is the algebraic multiplicity of the eigenvalue 0, assuming A is diagonalisable?', ans:2,
  exp:'Nullity = 3 \u2212 1 = 2, so zero appears twice among the eigenvalues.' },

{ id:'la10', subj:'la', ch:'la-matrix', marks:2, type:'mcq',
  q:'A homogeneous system AX = 0 with A of size 3 \u00d7 4 always has',
  opts:['only the trivial solution','infinitely many solutions','no solution','exactly four solutions'], ans:1,
  exp:'With more unknowns than equations the rank is at most 3, leaving at least one free variable, so non-trivial solutions exist.' },

/* ---------------- PROBABILITY ---------------- */
{ id:'pr01', subj:'prob', ch:'prob-basic', marks:1, type:'nat',
  q:'Two fair six-sided dice are thrown. What is the probability that the sum of the faces is 7? Give your answer correct to three decimal places.', ans:0.167, tol:0.005,
  exp:'Six of the 36 equally likely outcomes sum to 7, so the probability is 1/6 \u2248 0.167.' },

{ id:'pr02', subj:'prob', ch:'prob-basic', marks:2, type:'nat',
  q:'A disease affects 1% of a population. A test is positive for 99% of people who have it and for 5% of people who do not. Given a positive result, what is the probability the person has the disease? Give your answer correct to three decimal places.', ans:0.167, tol:0.005,
  exp:'Bayes gives (0.01\u00d70.99) / (0.01\u00d70.99 + 0.99\u00d70.05) = 0.0099/0.0594 \u2248 0.167. Low prevalence keeps the posterior small.' },

{ id:'pr03', subj:'prob', ch:'prob-rv', marks:1, type:'nat',
  q:'What is the expected value of the number shown on a single roll of a fair six-sided die?', ans:3.5, tol:0.01,
  exp:'(1+2+3+4+5+6)/6 = 21/6 = 3.5.' },

{ id:'pr04', subj:'prob', ch:'prob-rv', marks:2, type:'nat',
  q:'X follows a binomial distribution with n = 10 and p = 0.5. What is Var(X)?', ans:2.5, tol:0.01,
  exp:'Var = np(1\u2212p) = 10 \u00d7 0.5 \u00d7 0.5 = 2.5.' },

{ id:'pr05', subj:'prob', ch:'prob-dist', marks:2, type:'nat',
  q:'Calls arrive at a switchboard as a Poisson process with a mean of 3 per minute. What is the probability of no call in a given minute? Give your answer correct to four decimal places.', ans:0.0498, tol:0.001,
  exp:'P(X=0) = e\u207b\u00b3 \u2248 0.0498.' },

{ id:'pr06', subj:'prob', ch:'prob-dist', marks:2, type:'nat',
  q:'The lifetime of a component is exponentially distributed with mean 2 years. What is the probability that it survives more than 2 years? Give your answer correct to three decimal places.', ans:0.368, tol:0.005,
  exp:'P(X > t) = e^(\u2212t/\u03bc) = e\u207b\u00b9 \u2248 0.368. The exponential distribution is memoryless.' },

{ id:'pr07', subj:'prob', ch:'prob-basic', marks:2, type:'nat',
  q:'A and B are independent events with P(A) = 0.3 and P(B) = 0.4. What is P(A \u222a B)?', ans:0.58, tol:0.005,
  exp:'0.3 + 0.4 \u2212 (0.3 \u00d7 0.4) = 0.7 \u2212 0.12 = 0.58.' },

{ id:'pr08', subj:'prob', ch:'prob-dist', marks:1, type:'nat',
  q:'X is uniformly distributed on the interval [0, 10]. What is P(X > 7)?', ans:0.3, tol:0.005,
  exp:'The favourable length is 3 out of a total length of 10.' },

{ id:'pr09', subj:'prob', ch:'prob-basic', marks:2, type:'nat',
  q:'A fair die is rolled 4 times. What is the probability of getting at least one six? Give your answer correct to three decimal places.', ans:0.518, tol:0.005,
  exp:'1 \u2212 (5/6)\u2074 = 1 \u2212 0.4823 \u2248 0.518.' },

{ id:'pr10', subj:'prob', ch:'prob-rv', marks:1, type:'mcq',
  q:'For any two random variables X and Y, which identity always holds?',
  opts:['E[X + Y] = E[X] + E[Y]','Var(X + Y) = Var(X) + Var(Y)','E[XY] = E[X]E[Y]','Var(X) = E[X]\u00b2'], ans:0,
  exp:'Expectation is always linear. The other two identities need independence or uncorrelatedness.' },

/* ---------------- CALCULUS ---------------- */
{ id:'ca01', subj:'calc', ch:'calc-limit', marks:1, type:'nat',
  q:'Evaluate lim(x\u21920) (sin x)/x.', ans:1, tol:0.001,
  exp:'The standard limit equals 1, which also follows from the first order Taylor expansion sin x \u2248 x.' },

{ id:'ca02', subj:'calc', ch:'calc-limit', marks:2, type:'nat',
  q:'Evaluate lim(x\u21920) (1 \u2212 cos x)/x\u00b2.', ans:0.5, tol:0.001,
  exp:'Using cos x \u2248 1 \u2212 x\u00b2/2, the expression tends to 1/2.' },

{ id:'ca03', subj:'calc', ch:'calc-maxmin', marks:2, type:'nat',
  q:'What is the maximum value of f(x) = x\u00b3 \u2212 3x on the closed interval [\u22122, 2]?', ans:2, tol:0.001,
  exp:'f\u2032(x) = 3x\u00b2 \u2212 3 vanishes at x = \u00b11. Comparing f(\u22122) = \u22122, f(\u22121) = 2, f(1) = \u22122 and f(2) = 2 gives a maximum of 2.' },

{ id:'ca04', subj:'calc', ch:'calc-int', marks:1, type:'nat',
  q:'Evaluate the definite integral of x\u00b2 from 0 to 1. Give your answer correct to three decimal places.', ans:0.333, tol:0.005,
  exp:'The antiderivative is x\u00b3/3, so the value is 1/3 \u2248 0.333.' },

{ id:'ca05', subj:'calc', ch:'calc-int', marks:1, type:'nat',
  q:'Evaluate the definite integral of sin x from 0 to \u03c0.', ans:2, tol:0.001,
  exp:'[\u2212cos x] from 0 to \u03c0 gives \u2212(\u22121) \u2212 (\u22121) = 2.' },

{ id:'ca06', subj:'calc', ch:'calc-limit', marks:1, type:'mcq',
  q:'The function f(x) = |x| at x = 0 is',
  opts:['neither continuous nor differentiable','continuous but not differentiable','differentiable but not continuous','both continuous and differentiable'], ans:1,
  exp:'The left and right limits agree so it is continuous, but the one-sided derivatives are \u22121 and +1.' },

{ id:'ca07', subj:'calc', ch:'calc-maxmin', marks:2, type:'mcq',
  q:'Rolle\u2019s theorem applies to f on [a, b] only if',
  opts:['f is continuous on [a,b], differentiable on (a,b) and f(a) = f(b)','f is merely continuous on [a,b]','f is increasing on [a,b]','f(a) \u2260 f(b)'], ans:0,
  exp:'All three hypotheses are needed to conclude that f\u2032 vanishes somewhere inside the interval.' },

{ id:'ca08', subj:'calc', ch:'calc-multi', marks:1, type:'mcq',
  q:'For f(x, y) = x\u00b2y + y\u00b3, the partial derivative \u2202f/\u2202x is',
  opts:['2xy','x\u00b2 + 3y\u00b2','2xy + 3y\u00b2','2x + 3y\u00b2'], ans:0,
  exp:'Treat y as a constant: the derivative of x\u00b2y is 2xy and y\u00b3 contributes nothing.' },

/* ---------------- GENERAL APTITUDE ---------------- */
{ id:'ap01', subj:'apt', ch:'apt-quant', marks:1, type:'nat',
  q:'An item bought for \u20b9500 is sold for \u20b9600. What is the profit percentage?', ans:20, tol:0.1,
  exp:'Profit is \u20b9100 on a cost of \u20b9500, which is 20%.' },

{ id:'ap02', subj:'apt', ch:'apt-quant', marks:2, type:'nat',
  q:'A can finish a job in 12 days and B can finish the same job in 18 days. Working together, how many days do they take? Give your answer correct to one decimal place.', ans:7.2, tol:0.05,
  exp:'Combined rate is 1/12 + 1/18 = 5/36 per day, so the time is 36/5 = 7.2 days.' },

{ id:'ap03', subj:'apt', ch:'apt-quant', marks:2, type:'nat',
  q:'A car covers 120 km in 2 hours and the next 180 km in 3 hours. What is its average speed in km/h?', ans:60, tol:0.1,
  exp:'Total distance 300 km over total time 5 hours gives 60 km/h. Averaging the two speeds would be wrong.' },

{ id:'ap04', subj:'apt', ch:'apt-quant', marks:1, type:'nat',
  q:'A 40 litre mixture contains milk and water in the ratio 3 : 2. How many litres of water does it contain?', ans:16,
  exp:'Water is 2/5 of 40 litres, which is 16 litres.' },

{ id:'ap05', subj:'apt', ch:'apt-quant', marks:2, type:'nat',
  q:'The price of a book is first increased by 20% and then decreased by 20%. What is the net percentage change? Enter a negative number for a decrease.', ans:-4, tol:0.1,
  exp:'1.2 \u00d7 0.8 = 0.96, so the price ends 4% below where it started.' },

{ id:'ap06', subj:'apt', ch:'apt-quant', marks:2, type:'nat',
  q:'The ages of two people are in the ratio 7 : 3 and their ages add up to 60 years. What is the age of the older person?', ans:42,
  exp:'One part equals 60/10 = 6 years, so the older person is 7 \u00d7 6 = 42.' },

{ id:'ap07', subj:'apt', ch:'apt-logic', marks:1, type:'nat',
  q:'What is the next term in the sequence 2, 6, 12, 20, 30, ... ?', ans:42,
  exp:'The differences are 4, 6, 8, 10 so the next difference is 12. Equivalently the nth term is n(n+1).' },

{ id:'ap08', subj:'apt', ch:'apt-verbal', marks:1, type:'mcq',
  q:'Choose the word closest in meaning to "ephemeral".',
  opts:['Everlasting','Short-lived','Mysterious','Enormous'], ans:1,
  exp:'Ephemeral describes something that lasts for a very short time.' },

{ id:'ap09', subj:'apt', ch:'apt-verbal', marks:1, type:'mcq',
  q:'Select the option that best completes the sentence: Although the report was detailed, its conclusions were _____ , leaving the committee unsure how to act.',
  opts:['equivocal','decisive','exhaustive','verbatim'], ans:0,
  exp:'The contrast set up by "although" needs a word meaning unclear or open to interpretation, which is equivocal.' },

{ id:'ap10', subj:'apt', ch:'apt-logic', marks:2, type:'mcq',
  q:'All engineers are problem solvers. Some problem solvers are poets. Which conclusion necessarily follows?',
  opts:['Some engineers are poets','All poets are engineers','Some problem solvers are engineers','No poet is an engineer'], ans:2,
  exp:'The first statement guarantees engineers sit inside the set of problem solvers. Any overlap between engineers and poets is possible but not necessary.' },

{ id:'ap11', subj:'apt', ch:'apt-di', marks:2, type:'nat',
  q:'A shop sells 40, 55, 30 and 75 units over four weeks. By what percentage do the fourth week sales exceed the average weekly sales? Give your answer correct to one decimal place.', ans:50, tol:0.2,
  exp:'The average is 200/4 = 50 units, and 75 exceeds 50 by 25, which is 50%.' },

{ id:'ap12', subj:'apt', ch:'apt-quant', marks:2, type:'nat',
  q:'What is the compound interest on \u20b91000 at 10% per annum for 2 years, compounded annually?', ans:210, tol:0.5,
  exp:'The amount grows to 1000 \u00d7 1.1\u00b2 = 1210, so the interest is \u20b9210 against \u20b9200 for simple interest.' }

];

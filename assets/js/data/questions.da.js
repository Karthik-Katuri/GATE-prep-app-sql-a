/* ============================================================
   questions.da.js  —  GATE DS & AI specific topics
   Original GATE-pattern practice questions written for this app.
   ============================================================ */

window.GP_Q_DA = [

/* ---------------- MACHINE LEARNING ---------------- */
{ id:'ml01', subj:'ml', ch:'ml-eval', marks:1, type:'mcq',
  q:'As the capacity of a model is increased while the training set stays fixed, the usual effect is',
  opts:['bias decreases and variance increases','both bias and variance decrease','bias increases and variance decreases','neither changes'], ans:0,
  exp:'A more flexible model fits the training data more closely, lowering bias but making it more sensitive to the particular sample.' },

{ id:'ml02', subj:'ml', ch:'ml-sup-reg', marks:2, type:'mcq',
  q:'Compared with ridge regression, lasso regression is preferred when you want',
  opts:['all coefficients shrunk smoothly toward zero','exact zeros in the coefficient vector, giving feature selection','a closed form solution in every case','higher variance in the estimates'], ans:1,
  exp:'The L1 penalty has corners at zero, so the optimum often lands exactly on zero for irrelevant features. L2 shrinks but rarely zeroes.' },

{ id:'ml03', subj:'ml', ch:'ml-sup-reg', marks:2, type:'mcq',
  q:'Ordinary least squares linear regression minimises',
  opts:['the sum of absolute residuals','the sum of squared residuals','the maximum residual','the number of non-zero coefficients'], ans:1,
  exp:'OLS minimises \u03a3(y\u1d62 \u2212 \u0177\u1d62)\u00b2, which has the closed form solution (X\u1d40X)\u207b\u00b9X\u1d40y when X\u1d40X is invertible.' },

{ id:'ml04', subj:'ml', ch:'ml-unsup', marks:2, type:'mcq',
  q:'The standard k-means algorithm',
  opts:['always finds the global minimum of the within-cluster sum of squares','converges to a local optimum that depends on initialisation','requires labelled data','cannot be used when k is known'], ans:1,
  exp:'Each iteration cannot increase the objective, so it converges, but the result depends on the starting centroids. This is why k-means++ initialisation is used.' },

{ id:'ml05', subj:'ml', ch:'ml-tree', marks:2, type:'nat',
  q:'A node in a decision tree contains 9 positive and 5 negative examples. What is its entropy in bits? Give your answer correct to three decimal places.', ans:0.940, tol:0.005,
  exp:'\u2212(9/14)log\u2082(9/14) \u2212 (5/14)log\u2082(5/14) = 0.410 + 0.530 \u2248 0.940.' },

{ id:'ml06', subj:'ml', ch:'ml-tree', marks:1, type:'nat',
  q:'What is the Gini impurity of a node containing an equal number of examples from two classes? Give your answer correct to two decimal places.', ans:0.5, tol:0.01,
  exp:'Gini = 1 \u2212 (0.5\u00b2 + 0.5\u00b2) = 0.5, the maximum for two classes.' },

{ id:'ml07', subj:'ml', ch:'ml-tree', marks:2, type:'mcq',
  q:'Which statement contrasts bagging and boosting correctly?',
  opts:['Bagging mainly reduces variance while boosting mainly reduces bias','Both mainly reduce bias','Bagging trains models sequentially, boosting trains them in parallel','Boosting requires all base learners to be identical in weight'], ans:0,
  exp:'Bagging averages independent high-variance learners. Boosting fits each new weak learner to the residual errors of the ensemble so far, reducing bias.' },

{ id:'ml08', subj:'ml', ch:'ml-sup-clf', marks:1, type:'mcq',
  q:'Logistic regression models which quantity as a linear function of the features?',
  opts:['The class probability','The log-odds of the positive class','The squared error','The class label directly'], ans:1,
  exp:'log(p/(1\u2212p)) = w\u1d40x + b, so the probability itself is the sigmoid of a linear score.' },

{ id:'ml09', subj:'ml', ch:'ml-sup-clf', marks:2, type:'mcq',
  q:'A 1-nearest-neighbour classifier evaluated on its own training set typically shows',
  opts:['zero training error, which says nothing about generalisation','high training error','the same error as on unseen data','undefined behaviour'], ans:0,
  exp:'Each training point is its own nearest neighbour, so training error is zero. Only a held-out set reveals the true error.' },

{ id:'ml10', subj:'ml', ch:'ml-sup-clf', marks:1, type:'mcq',
  q:'The naive Bayes classifier is called naive because it assumes',
  opts:['features are conditionally independent given the class','the prior is always uniform','the data is linearly separable','all features are continuous'], ans:0,
  exp:'The conditional independence assumption makes the likelihood a simple product of per-feature terms. It is usually false but often still works well.' },

{ id:'ml11', subj:'ml', ch:'ml-sup-clf', marks:2, type:'mcq',
  q:'In a hard margin support vector machine, the support vectors are',
  opts:['all the training points','the points closest to the hyperplane that lie on the margin boundary','the points farthest from the hyperplane','the misclassified points only'], ans:1,
  exp:'Only the margin-boundary points have non-zero dual coefficients, so removing any other point leaves the hyperplane unchanged.' },

{ id:'ml12', subj:'ml', ch:'ml-dim', marks:2, type:'mcq',
  q:'The principal components in PCA are',
  opts:['the eigenvectors of the data covariance matrix ordered by decreasing eigenvalue','the rows of the data matrix with the largest norm','randomly chosen orthogonal directions','the class means'], ans:0,
  exp:'The top eigenvectors capture the directions of maximum variance, and the eigenvalues give the variance explained along each.' },

{ id:'ml13', subj:'ml', ch:'ml-eval', marks:2, type:'nat',
  q:'A binary classifier gives TP = 40, FP = 10, FN = 20 and TN = 30. What is its precision? Give your answer correct to two decimal places.', ans:0.8, tol:0.01,
  exp:'Precision = TP/(TP+FP) = 40/50 = 0.80. Recall would be 40/60 \u2248 0.67.' },

{ id:'ml14', subj:'ml', ch:'ml-eval', marks:2, type:'nat',
  q:'For the same classifier (TP = 40, FP = 10, FN = 20, TN = 30), what is the F1 score? Give your answer correct to three decimal places.', ans:0.727, tol:0.005,
  exp:'F1 is the harmonic mean of precision 0.8 and recall 0.667: 2(0.8)(0.667)/(1.467) \u2248 0.727.' },

{ id:'ml15', subj:'ml', ch:'ml-eval', marks:1, type:'mcq',
  q:'k-fold cross validation with k equal to the number of training examples is known as',
  opts:['bootstrap sampling','leave-one-out cross validation','stratified sampling','holdout validation'], ans:1,
  exp:'Each fold has a single example, so the model is trained n times on n\u22121 points. It is nearly unbiased but expensive and high variance.' },

{ id:'ml16', subj:'ml', ch:'ml-nn', marks:2, type:'mcq',
  q:'Backpropagation computes gradients by',
  opts:['applying the chain rule backward through the computation graph','randomly perturbing each weight','inverting the weight matrices','solving a linear system exactly'], ans:0,
  exp:'Each layer receives the gradient of the loss with respect to its output and passes on the gradient with respect to its input, reusing intermediate results.' },

{ id:'ml17', subj:'ml', ch:'ml-nn', marks:1, type:'mcq',
  q:'If the learning rate in gradient descent is set far too large, the most likely outcome is',
  opts:['very slow but steady convergence','the loss oscillates or diverges','the model converges to the global optimum faster and safely','the gradient becomes exactly zero'], ans:1,
  exp:'Large steps overshoot the minimum repeatedly, so the loss can grow without bound. Too small a rate gives the slow but steady behaviour.' },

{ id:'ml18', subj:'ml', ch:'ml-eval', marks:1, type:'mcq',
  q:'A model with very low training error and much higher validation error is most likely',
  opts:['underfitting','overfitting','perfectly regularised','limited by label noise only'], ans:1,
  exp:'The gap between training and validation performance is the signature of overfitting; more data or stronger regularisation usually helps.' },

/* ---------------- ARTIFICIAL INTELLIGENCE ---------------- */
{ id:'ai01', subj:'ai', ch:'ai-search', marks:2, type:'mcq',
  q:'A* tree search returns an optimal solution provided the heuristic is',
  opts:['admissible, that is it never overestimates the true remaining cost','always zero','monotonically increasing along any path','equal to the exact cost'], ans:0,
  exp:'Admissibility suffices for tree search. For graph search with a closed list, the stronger consistency condition is needed.' },

{ id:'ai02', subj:'ai', ch:'ai-search', marks:1, type:'mcq',
  q:'Uniform cost search is essentially the same algorithm as',
  opts:['depth first search','Dijkstra\u2019s shortest path algorithm','hill climbing','minimax'], ans:1,
  exp:'Both expand the frontier node with the least cumulative path cost, so both find least-cost paths when edge costs are non-negative.' },

{ id:'ai03', subj:'ai', ch:'ai-search', marks:2, type:'nat',
  q:'A search tree has branching factor 3. How many nodes are generated in total by breadth first search that expands all nodes up to and including depth 2, counting the root?', ans:13,
  exp:'1 + 3 + 9 = 13 nodes across depths 0, 1 and 2.' },

{ id:'ai04', subj:'ai', ch:'ai-search', marks:1, type:'mcq',
  q:'Depth first search on an infinite state space is',
  opts:['complete and optimal','incomplete because it can follow an infinite path','optimal but not complete','the same as breadth first search'], ans:1,
  exp:'DFS can descend forever down one branch. Iterative deepening restores completeness while keeping the low memory use.' },

{ id:'ai05', subj:'ai', ch:'ai-game', marks:2, type:'mcq',
  q:'With perfect move ordering, alpha-beta pruning examines roughly how many leaf nodes compared with plain minimax at depth d and branching factor b?',
  opts:['O(b\u1d48) still','O(b^(d/2))','O(d\u1d47)','O(log b\u1d48)'], ans:1,
  exp:'Ideal ordering lets alpha-beta search to roughly twice the depth in the same time, since O(b^(d/2)) = O((\u221ab)\u1d48).' },

{ id:'ai06', subj:'ai', ch:'ai-game', marks:1, type:'mcq',
  q:'Alpha-beta pruning changes the result of minimax by',
  opts:['returning a possibly worse move','not at all; it returns the same value as full minimax','only working for single player games','requiring a random tie-break'], ans:1,
  exp:'Pruning only skips branches that cannot influence the root value, so the chosen move is identical to full minimax.' },

{ id:'ai07', subj:'ai', ch:'ai-csp', marks:2, type:'mcq',
  q:'In constraint satisfaction, the minimum remaining values heuristic selects',
  opts:['the variable with the fewest legal values left','the variable involved in the fewest constraints','the value that rules out the fewest options','a variable at random'], ans:0,
  exp:'Picking the most constrained variable first makes failures surface early, which prunes the search tree. Ruling out the fewest options describes the least-constraining-value heuristic for value choice.' },

{ id:'ai08', subj:'ai', ch:'ai-csp', marks:1, type:'mcq',
  q:'Arc consistency (the AC-3 algorithm) guarantees that',
  opts:['the CSP has a solution','for every value of a variable there is a consistent value in each neighbouring variable\u2019s domain','the CSP is unsatisfiable','backtracking is never needed'], ans:1,
  exp:'AC-3 prunes domains but does not decide satisfiability on its own; backtracking may still be required.' },

{ id:'ai09', subj:'ai', ch:'ai-logic', marks:2, type:'mcq',
  q:'To prove that a knowledge base KB entails a sentence \u03b1 by resolution, you',
  opts:['add \u03b1 to KB and derive the empty clause','add \u00ac\u03b1 to KB and derive the empty clause','show KB \u2227 \u03b1 is satisfiable','enumerate all models of \u03b1'], ans:1,
  exp:'Proof by refutation: entailment holds exactly when KB \u2227 \u00ac\u03b1 is unsatisfiable, signalled by deriving the empty clause.' },

{ id:'ai10', subj:'ai', ch:'ai-uncert', marks:2, type:'nat',
  q:'In a Bayesian network, a binary node has 3 binary parents. How many independent parameters does its conditional probability table require?', ans:8,
  exp:'There are 2\u00b3 = 8 parent configurations, and each needs one probability because the complement is determined.' },

{ id:'ai11', subj:'ai', ch:'ai-uncert', marks:1, type:'mcq',
  q:'Two variables X and Y with a common child Z and no other connections are',
  opts:['always dependent','independent when Z is unobserved, but generally dependent once Z is observed','always independent','dependent only if Z is unobserved'], ans:1,
  exp:'This is a collider. Observing the child couples the parents, an effect known as explaining away.' },

{ id:'ai12', subj:'ai', ch:'ai-search', marks:1, type:'mcq',
  q:'Simple hill climbing can fail because it',
  opts:['uses too much memory','gets trapped at local maxima, ridges and plateaus','cannot evaluate the objective function','requires an admissible heuristic'], ans:1,
  exp:'It only accepts immediate improvements. Random restarts or simulated annealing help escape local optima.' },

/* ---------------- PROBABILITY & STATISTICS (DA) ---------------- */
{ id:'st01', subj:'prob', ch:'prob-infer', marks:1, type:'mcq',
  q:'The central limit theorem says that for large n, the distribution of the sample mean',
  opts:['equals the population distribution','is approximately normal regardless of the population distribution','is always uniform','has the same variance as the population'], ans:1,
  exp:'For i.i.d. samples with finite variance, the standardised sample mean converges to a standard normal, whatever the parent distribution.' },

{ id:'st02', subj:'prob', ch:'prob-infer', marks:2, type:'nat',
  q:'A population has standard deviation 10. What is the standard error of the mean for a sample of size 25?', ans:2, tol:0.01,
  exp:'Standard error = \u03c3/\u221an = 10/5 = 2.' },

{ id:'st03', subj:'prob', ch:'prob-infer', marks:2, type:'nat',
  q:'A sample mean is 50 with a standard error of 2. What is the upper limit of the approximate 95% confidence interval, using 1.96 as the critical value? Give your answer correct to two decimal places.', ans:53.92, tol:0.05,
  exp:'50 + 1.96 \u00d7 2 = 53.92, and the lower limit is 46.08.' },

{ id:'st04', subj:'prob', ch:'prob-infer', marks:2, type:'mcq',
  q:'The p-value of a hypothesis test is',
  opts:['the probability that the null hypothesis is true','the probability of observing data at least as extreme as the sample, assuming the null hypothesis holds','the probability of a Type II error','the significance level chosen in advance'], ans:1,
  exp:'It is a tail probability computed under the null. It is not the probability that the null is true, a very common misreading.' },

{ id:'st05', subj:'prob', ch:'prob-infer', marks:1, type:'mcq',
  q:'Rejecting a null hypothesis that is actually true is',
  opts:['a Type I error','a Type II error','the power of the test','a consistent estimator'], ans:0,
  exp:'Type I error is a false positive, controlled by the significance level \u03b1. Failing to reject a false null is Type II error.' },

{ id:'st06', subj:'prob', ch:'prob-stat', marks:2, type:'mcq',
  q:'If the Pearson correlation between X and Y is zero, then',
  opts:['X and Y must be independent','there is no linear association, but a non-linear relationship may exist','X and Y are identical','the covariance is undefined'], ans:1,
  exp:'Zero correlation only rules out linear association. Y = X\u00b2 with X symmetric about zero has zero correlation but total dependence.' },

{ id:'st07', subj:'prob', ch:'prob-stat', marks:2, type:'nat',
  q:'X is a random variable with Var(X) = 4. What is Var(3X + 5)?', ans:36,
  exp:'Var(aX + b) = a\u00b2Var(X) = 9 \u00d7 4 = 36; the additive constant has no effect.' },

{ id:'st08', subj:'prob', ch:'prob-stat', marks:2, type:'mcq',
  q:'The maximum likelihood estimate of the success probability of a Bernoulli distribution, given x successes in n trials, is',
  opts:['x/n','(x+1)/(n+2)','n/x','x/(n\u22121)'], ans:0,
  exp:'Differentiating the log-likelihood gives the sample proportion. The second option is the Laplace-smoothed Bayesian posterior mean.' },

{ id:'st09', subj:'prob', ch:'prob-stat', marks:2, type:'mcq',
  q:'In simple linear regression, the slope estimate can be written as',
  opts:['r \u00d7 (s_y / s_x)','r \u00d7 (s_x / s_y)','r\u00b2','the mean of y divided by the mean of x'], ans:0,
  exp:'The least squares slope equals the correlation scaled by the ratio of the sample standard deviations of y and x.' },

{ id:'st10', subj:'prob', ch:'prob-stat', marks:1, type:'mcq',
  q:'For a right-skewed distribution, the usual ordering of the summary statistics is',
  opts:['mean < median < mode','mode < median < mean','mean = median = mode','median < mode < mean'], ans:1,
  exp:'The long right tail pulls the mean above the median, which sits above the mode.' },

/* ---------------- DATABASES & WAREHOUSING (DA) ---------------- */
{ id:'dw01', subj:'dbms', ch:'db-dw', marks:1, type:'mcq',
  q:'A star schema consists of',
  opts:['one central fact table joined to denormalised dimension tables','several fact tables with no dimensions','fully normalised tables only','a single flat table'], ans:0,
  exp:'The fact table holds measures and foreign keys; dimensions stay wide and denormalised to keep joins shallow.' },

{ id:'dw02', subj:'dbms', ch:'db-dw', marks:2, type:'mcq',
  q:'A snowflake schema differs from a star schema in that',
  opts:['it has no fact table','its dimension tables are normalised into sub-dimensions','it forbids foreign keys','it stores only aggregates'], ans:1,
  exp:'Normalising dimensions saves space and reduces update anomalies at the cost of more joins per query.' },

{ id:'dw03', subj:'dbms', ch:'db-dw', marks:1, type:'mcq',
  q:'Which characteristic best distinguishes OLAP workloads from OLTP workloads?',
  opts:['OLAP runs many short write transactions','OLAP runs few long read-heavy analytical queries over historical data','OLAP never uses indexes','OLTP cannot use SQL'], ans:1,
  exp:'OLTP is tuned for high-throughput short transactions; OLAP scans and aggregates large historical volumes.' },

{ id:'dw04', subj:'dbms', ch:'db-dw', marks:2, type:'mcq',
  q:'In a data warehouse pipeline, the correct order of operations in ETL is',
  opts:['extract, transform, load','extract, load, transform','transform, extract, load','load, extract, transform'], ans:0,
  exp:'Classic ETL cleans and conforms data before loading. The ELT variant loads raw data first and transforms inside the warehouse.' },

{ id:'dw05', subj:'dbms', ch:'db-dw', marks:2, type:'mcq',
  q:'The grain (granularity) of a fact table refers to',
  opts:['the number of dimension tables','the level of detail represented by one fact row','the storage engine used','the number of aggregate functions allowed'], ans:1,
  exp:'Declaring the grain, for example one row per line item per order, fixes what the measures mean and which dimensions apply.' },

{ id:'dw06', subj:'dbms', ch:'db-dw', marks:1, type:'mcq',
  q:'A materialised view in a warehouse mainly helps by',
  opts:['storing precomputed query results so repeated aggregations are fast','enforcing referential integrity','replacing the need for indexes','reducing the number of dimensions'], ans:0,
  exp:'The cost shifts from query time to refresh time, which suits workloads that read far more often than they write.' },

/* ---------------- PYTHON & DSA (DA) ---------------- */
{ id:'py01', subj:'cp', ch:'cp-py', marks:1, type:'mcq',
  q:'Which statement about Python lists and tuples is correct?',
  opts:['Both are immutable','Lists are mutable and tuples are immutable','Tuples are mutable and lists are immutable','Neither can be nested'], ans:1,
  exp:'Because tuples are immutable and hashable (when their contents are), they can serve as dictionary keys while lists cannot.' },

{ id:'py02', subj:'cp', ch:'cp-py', marks:1, type:'mcq',
  q:'The average case time complexity of a lookup in a Python dict is',
  opts:['O(1)','O(log n)','O(n)','O(n log n)'], ans:0,
  exp:'Dicts are hash tables, so lookups are constant time on average and O(n) in a pathological worst case.' },

{ id:'py03', subj:'cp', ch:'cp-py', marks:2, type:'mcq',
  q:'Appending one element to a Python list has which time complexity?',
  opts:['O(1) amortised','O(n) always','O(log n)','O(n log n)'], ans:0,
  exp:'The list over-allocates capacity, so occasional resizing is spread across many appends, giving constant amortised cost.' },

{ id:'py04', subj:'cp', ch:'cp-py', marks:2, type:'mcq',
  q:'For a Python list a, the expression b = a[:] produces',
  opts:['a reference to the same list object','a shallow copy of the list','a deep copy of all nested objects','an error'], ans:1,
  exp:'Slicing builds a new outer list, but nested objects are still shared. Use copy.deepcopy for a full copy.' },

{ id:'py05', subj:'cp', ch:'cp-py', marks:2, type:'mcq',
  q:'A NumPy array of shape (3, 1) is added to an array of shape (1, 4). The result has shape',
  opts:['(3, 1)','(1, 4)','(3, 4)','an error is raised'], ans:2,
  exp:'Broadcasting stretches each size-1 dimension to match the other operand, giving a 3 \u00d7 4 result.' },

{ id:'py06', subj:'cp', ch:'cp-py', marks:2, type:'mcq',
  q:'In pandas, df.groupby("city")["sales"].mean() returns',
  opts:['the overall mean of sales','one mean of sales per distinct city','the number of cities','the sorted sales column'], ans:1,
  exp:'The split-apply-combine pattern groups rows by the key and reduces each group, producing a Series indexed by city.' },

/* ---------------- CALCULUS & OPTIMISATION (DA) ---------------- */
{ id:'op01', subj:'calc', ch:'calc-opt', marks:1, type:'mcq',
  q:'A twice differentiable function of one variable is convex on an interval if and only if',
  opts:['its first derivative is positive there','its second derivative is non-negative there','it is increasing there','it has no stationary point there'], ans:1,
  exp:'Non-negative curvature is exactly convexity. It implies any stationary point is a global minimum.' },

{ id:'op02', subj:'calc', ch:'calc-opt', marks:1, type:'nat',
  q:'At what value of x does f(x) = x\u00b2 \u2212 4x + 7 attain its minimum?', ans:2, tol:0.001,
  exp:'f\u2032(x) = 2x \u2212 4 = 0 gives x = 2, and f\u2033 = 2 > 0 confirms a minimum.' },

{ id:'op03', subj:'calc', ch:'calc-opt', marks:2, type:'mcq',
  q:'Gradient descent updates the parameters in the direction of',
  opts:['the gradient','the negative gradient','the Hessian','a random unit vector'], ans:1,
  exp:'The gradient points toward the steepest increase, so moving against it decreases the objective locally.' },

{ id:'op04', subj:'calc', ch:'calc-opt', marks:2, type:'mcq',
  q:'The method of Lagrange multipliers is used to optimise a function subject to',
  opts:['equality constraints','integrality constraints','no constraints','only inequality constraints'], ans:0,
  exp:'Stationary points of the Lagrangian handle equality constraints; inequalities need the KKT conditions.' },

{ id:'op05', subj:'calc', ch:'calc-opt', marks:1, type:'mcq',
  q:'A set C is convex if',
  opts:['it contains the origin','for any two points in C, the entire segment joining them lies in C','it is closed and bounded','it is the graph of a convex function'], ans:1,
  exp:'The segment condition is the definition. Convex optimisation needs a convex objective over a convex feasible set.' },

/* ---------------- LINEAR ALGEBRA FOR DA ---------------- */
{ id:'lp01', subj:'la', ch:'la-proj', marks:2, type:'mcq',
  q:'Which statement about the singular value decomposition is correct?',
  opts:['It exists only for square invertible matrices','Every real matrix has an SVD, and the singular values are non-negative','It requires the matrix to be symmetric','The singular values may be complex'], ans:1,
  exp:'Any m \u00d7 n real matrix factors as U\u03a3V\u1d40 with orthogonal U and V and non-negative singular values on the diagonal of \u03a3.' },

{ id:'lp02', subj:'la', ch:'la-proj', marks:2, type:'mcq',
  q:'A matrix P represents an orthogonal projection. Which property must it satisfy?',
  opts:['P\u00b2 = P and P\u1d40 = P','P\u00b2 = I','det(P) = 1','P is always invertible'], ans:0,
  exp:'Projections are idempotent and symmetric. They are singular unless they project onto the whole space.' },

{ id:'lp03', subj:'la', ch:'la-proj', marks:1, type:'mcq',
  q:'Two non-zero vectors u and v in \u211d\u207f are orthogonal exactly when',
  opts:['u + v = 0','their dot product is zero','they have equal norm','one is a scalar multiple of the other'], ans:1,
  exp:'Orthogonality is defined by a zero inner product, which corresponds to a 90 degree angle between the vectors.' }

];

### **Core idea:**

**Training data is not a given — it is engineered, and the decisions made during sampling, labeling, and handling imbalance determine whether your model has any chance of working in production.**

Put simply: **garbage in, garbage out — but the real lesson is subtler: even well-intentioned data collection produces systematic biases that silently sabotage your model.**

---

### **The central principle**

Data is messy, complex, unpredictable, and potentially treacherous. Most ML curricula skip to the modeling step, treating data as already clean and ready. In production, this assumption fails constantly. Learning to handle data well — sampling it correctly, labeling it reliably, and balancing it appropriately — is what separates models that work from models that look good in notebooks.

---

### **Sampling**

Sampling determines what your model learns from. Two families:

**Nonprobability sampling** (avoid for reliable models):
- *Convenience*: whatever data is easiest to get
- *Snowball*: expand from existing samples (e.g., scraping Twitter friends-of-friends)
- *Purposive*: experts hand-pick samples
- *Quota*: fixed counts per group regardless of real distribution

These methods introduce selection bias. Language models trained on Wikipedia and Reddit don't represent all possible text. Self-driving car data was mostly collected in sunny Phoenix and the Bay Area — terrible for rain/snow.

**Probability sampling** (better):
- *Simple random*: equal probability for all. Risk: rare classes might not appear at all.
- *Stratified*: divide into groups (strata), sample proportionally from each. Guarantees rare classes are represented.
- *Weighted*: give higher probability to more valuable samples (e.g., recent data, rare classes).
- *Reservoir*: for streaming data. Maintains a reservoir of k samples; each new item has k/n probability of being included. Allows you to stop at any time with correct proportions.
- *Importance*: samples from a different distribution but reweights to approximate the target distribution. Used in reinforcement learning and off-policy evaluation.

---

### **Labeling**

Labels are the most expensive and most error-prone part of training data.

**Hand labeling**: humans annotate data. Problems: slow, expensive, doesn't scale, requires subject matter experts (e.g., doctors for medical imaging). Label disagreement is common — *label multiplicity*: multiple annotators disagree. The solution is not just to take a majority vote — disagreement itself is informative and should be tracked.

**Natural labels**: the system generates its own ground truth from user behavior (click-throughs, purchases, ratings). This enables a *data flywheel*: more users → more data → better model → more users. The *feedback loop* from natural labels requires careful design — you must decide the feedback window (how long to wait before treating no-click as a negative label).

**Programmatic labeling (weak supervision)**: instead of hand-labeling, write *labeling functions* — heuristics, rules, patterns, keyword matches — and combine them. Tools like Snorkel learn to combine noisy labeling functions into probabilistic labels. Faster, cheaper, and more maintainable than hand labeling. Trade-off: noisier labels.

**Data lineage**: track where every piece of data came from and how it was labeled. Essential for debugging model failures.

---

### **Class imbalance**

When one class appears far more often than others (e.g., 99.99% negative labels for fraud), models learn to always predict the majority class and still achieve high accuracy. Three strategies:

1. **Resampling**: oversample the minority class (duplicate samples or generate synthetic ones with SMOTE), or undersample the majority. Trade-off: oversampling risks overfitting; undersampling loses data.

2. **Cost-sensitive learning**: assign higher loss to misclassifying the minority class. Adjust class weights or the decision threshold.

3. **Ensemble methods**: bagging and boosting algorithms often handle imbalance better than single models.

The right metric for imbalanced data: **not accuracy**. Use precision, recall, F1, ROC-AUC, or PR-AUC depending on the relative cost of false positives vs. false negatives.

---

### **Data augmentation**

When labeled data is scarce, generate more:

- **Simple label-preserving transforms** (images): flip, crop, rotate, add noise, change brightness. Label stays the same.
- **Mixing inputs (Mixup)**: create new training examples by linearly interpolating between two existing examples and their labels.
- **Perturbation (NLP)**: replace words with synonyms, randomly delete/insert/swap words.
- **Data synthesis**: generate entirely new data (e.g., using GANs for images or language models for text).

---

### **The chapter's principle**

> Training data is engineered through careful sampling, labeling, and balancing decisions — each choice introduces potential biases and trade-offs that directly determine a model's behavior in production.

---

### **Bottom line**

If you want to:

- **Build a model that generalizes beyond your training set**

Then:

- **Use probability-based sampling**, not convenience sampling.
- **Use stratified or weighted sampling** to ensure rare but important cases are represented.

If you want to:

- **Scale labeling without breaking the bank**

Then:

- **Design for natural labels** where possible — build the feedback loop into your product.
- **Use programmatic labeling** (weak supervision) when hand labeling is too slow or expensive.

If you want to:

- **Avoid the accuracy illusion with imbalanced data**

Then:

- **Never use raw accuracy as your metric** for imbalanced problems.
- **Use cost-sensitive learning** — make the loss reflect the real cost of errors.

**Data is the most important part of your ML system, and it requires as much engineering discipline as your model code.**

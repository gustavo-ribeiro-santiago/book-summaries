### **Core idea:**

**Models degrade silently in production because the world changes — and without systematic monitoring for data distribution shifts, you won't know until the damage is done.**

Put simply: **deploying a model and walking away is like launching a product and never checking if customers are satisfied. Data distribution shifts are the norm, not the exception — and detecting them requires deliberate infrastructure.**

---

### **The central principle**

A consulting firm builds a grocery demand prediction model, hands it over, and the client is thrilled. A year later, the model is useless. This is the default trajectory for every deployed ML model. Understanding *why* models fail in production — and building the monitoring infrastructure to detect it — is what separates systems that last from systems that quietly collapse.

---

### **Types of ML system failures**

**Software failures** (non-ML, but common):
- Dependency failures (third-party package breaks)
- Deployment errors (wrong model version pushed)
- Hardware failures (GPU overheating)
- Downstream service outages

A Google study of 96 ML pipeline failures found that **60 out of 96 were caused by non-ML issues** — mostly distributed systems and data pipeline bugs. ML expertise alone is not enough.

**ML-specific failures**:
- Data distribution shifts (the main focus of this chapter)
- Edge cases (rare inputs where the model catastrophically fails)
- Degenerate feedback loops (model outputs influence future training data)

---

### **Data distribution shifts**

A model learns the distribution of its training data. In production, the distribution it encounters may differ — and will drift over time.

**Three types of shifts**:

**1. Covariate shift (input distribution changes, P(X) changes)**:
The distribution of input features changes, but the relationship between inputs and outputs stays the same. Example: a model trained on desktop user behavior deployed to mobile users. Same task, different users.

**2. Label shift (output distribution changes, P(Y) changes)**:
The prior probability of labels changes. Example: a disease diagnostic model trained during a pandemic where disease prevalence is high. Post-pandemic, prevalence drops — the model is now over-predicting.

**3. Concept drift (the relationship between X and Y changes)**:
The underlying reality changes. Example: "Wuhan" in search queries meant travel in 2019, then COVID in 2020. The model's learned mapping is no longer correct.

Shifts can happen:
- *Suddenly*: a competitor changes pricing, you launch in a new region, a celebrity mentions your product
- *Gradually*: social norms, languages, trends evolve
- *Seasonally*: rideshare demand spikes in winter; holiday shopping changes purchase patterns

**Important**: many apparent distribution shifts are actually **internal bugs** — wrong feature computation, inconsistent preprocessing between training and inference, wrong model version. Always rule out bugs before blaming the distribution.

---

### **Edge cases**

An outlier is a data point that differs from the norm. An edge case is a data point where the **model performs significantly worse** than average. Not all outliers are edge cases. A jaywalker on a highway is an outlier, but if your self-driving car correctly detects them, it's not an edge case.

Edge cases in safety-critical applications (autonomous vehicles, medical diagnosis) can be catastrophic. Even in non-safety applications, a chatbot that occasionally produces racist content is a brand risk that makes the entire system unusable.

---

### **Degenerate feedback loops**

When a model's predictions influence the data used to train the next version of the model, feedback loops can amplify biases. Example: a recommender system recommends popular content → popular content gets more clicks → clicks reinforce popularity → the model never discovers niche content. Over time, the system becomes a self-fulfilling popularity machine.

Detection: measure diversity in recommendations over time. Mitigation: inject randomness (exploration), use bandit algorithms, intentionally expose users to non-personalized content.

---

### **Monitoring**

**Operational metrics** (same as traditional software):
- Latency (p50, p90, p99 — not just mean)
- Throughput
- CPU/GPU utilization
- Memory usage
- Uptime / error rates

**ML-specific metrics**:
- *Input statistics*: mean, std, min, max, % missing values, % null — monitor these for drift
- *Output statistics*: distribution of predictions — if the model starts predicting the same class 99% of the time, something changed
- *Model accuracy* (when labels are available): requires a feedback window

**When ground truth labels are unavailable** (which is most of the time), you monitor proxies:
- Input feature distributions (statistical tests: KS test, chi-squared, PSI)
- Prediction distributions
- User behavioral signals (click-through rates, conversion rates, engagement)

**Statistical tests for distribution shift**:
- Kolmogorov-Smirnov (KS) test for continuous features
- Chi-squared test for categorical features
- Population Stability Index (PSI): classifies shift into "no change," "slight change," or "major change"

---

### **Monitoring toolbox**

**Logs**: record everything. When something breaks, you need the history.

**Dashboards**: visualize trends in operational and ML metrics. Alert when metrics cross thresholds.

**Alerts**: threshold-based or anomaly-based. Threshold alerts (e.g., latency > 200ms) are simple but require manual tuning. Anomaly detection alerts are harder to tune but catch unexpected patterns.

**Observability**: beyond monitoring (tracking known metrics) to understanding the system's internal state from its external outputs. Includes distributed tracing, log aggregation, and causality analysis.

---

### **The chapter's principle**

> Models degrade over time because data distributions shift — suddenly, gradually, or seasonally — and detecting this requires systematic monitoring of both operational metrics and ML-specific signals, with the understanding that most apparent shifts are actually bugs.

---

### **Bottom line**

If you want to:

- **Know when your model is failing before your users do**

Then:

- **Monitor input and output distributions**, not just latency and error rates.
- **Set up statistical tests** (KS, chi-squared, PSI) to detect feature drift.
- **Track prediction diversity** to catch degenerate feedback loops early.

If you want to:

- **Diagnose production failures correctly**

Then:

- **Rule out bugs first**: check for preprocessing inconsistencies, wrong model versions, data pipeline errors.
- **Distinguish types of shift**: covariate shift, label shift, and concept drift have different fixes.

**A model without monitoring is a liability. Monitoring is not overhead — it's the only way to know if what you deployed is still working.**

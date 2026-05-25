### **Core idea:**

**ML systems must be designed around business objectives and four core requirements — and building them is a never-ending iterative cycle, not a linear pipeline.**

Put simply: **if your ML metrics don't move business metrics, nobody cares about your model — and no matter how good it is, you'll always have to go back to step one.**

---

### **The central principle**

Companies don't care about accuracy improvements unless they translate into business outcomes. The ML engineer's job is to bridge the gap between ML metrics (F1, latency, log-loss) and business metrics (revenue, churn, conversion rate). Without this bridge, ML projects die prematurely.

---

### **Business objectives → ML objectives**

Most businesses ultimately want to maximize profit (directly via sales/cost-cutting, or indirectly via customer satisfaction). ML projects succeed when they are **tied to specific business metrics**.

- Netflix measures recommender system performance using *take-rate* (quality plays / recommendations shown) — and showed it correlates with streaming hours and reduced cancellations.
- Ad click-through prediction and fraud detection are popular because the business impact is directly measurable.
- Harder cases: a cybersecurity company where ML is one component of a multi-step human process. Attribution is nearly impossible.

**ROI on ML grows with maturity.** Companies that have had models in production for 5+ years can deploy in under 30 days. Newcomers often take more than 30 days for a single deployment.

---

### **Four requirements for ML systems**

**1. Reliability** — The system should perform correctly even under adversity. ML fails *silently* — no 404 error, no crash. Users might keep using a broken model without knowing it.

**2. Scalability** — Growth comes in three forms: model complexity, traffic volume, and number of models. One startup went from 1 model to 8,000 — one per enterprise customer. Scalability is not just resource scaling (up/down) — it's also **artifact management**: versioning, reproducing, monitoring hundreds of models at once.

**3. Maintainability** — Different contributors (ML engineers, DevOps, domain experts) need to work together. Code, data, and artifacts must be versioned. Models must be reproducible.

**4. Adaptability** — Systems must be able to discover performance improvements and deploy updates without interruption. Because data can change quickly, ML systems need fast development and deployment cycles.

---

### **The iterative process**

Building an ML system is never a straight line. A realistic workflow:

1. Choose a metric to optimize
2. Collect data + labels → realize labels were wrong → relabel
3. Train model → discover severe class imbalance → collect more data
4. Train again → model works on 2-month-old test set but fails on yesterday's data
5. Retrain → deploy
6. Business team: "Revenue is dropping" → switch optimization objective
7. Go to step 1

This cycle never ends. Once deployed, models must be continually monitored and updated.

---

### **Framing ML problems**

A business problem is not automatically an ML problem. You must define:
- **Input** (what goes into the model)
- **Output** (what the model predicts)
- **Objective function** (what guides the learning)

**Classification vs. regression** — House price prediction can be either; the framing choice matters. **Binary vs. multiclass vs. multilabel** — multilabel is the hardest (varying number of labels per example, extraction from raw probabilities is ambiguous).

**How you frame a problem dramatically changes difficulty.** Predicting "which of N apps will a user open next" as multiclass requires retraining every time a new app is added. Reframing as regression (score each app separately) makes the system extensible.

---

### **Decoupling objectives**

When multiple objectives conflict (e.g., maximize engagement *and* minimize misinformation), the worst solution is to combine them into one loss function. You'd have to retrain every time you adjust the weights.

**Better approach: train one model per objective**, then combine predictions at serving time with tunable weights (α × quality_score + β × engagement_score). This lets you tweak balance without retraining.

---

### **Mind vs. data**

A long-running debate: does ML success come from intelligent architectural design (mind) or massive data + compute?

- Judea Pearl: "Data is profoundly dumb." Intelligent inductive biases matter.
- Peter Norvig (Google): "We don't have better algorithms. We just have more data."
- Rich Sutton ("The Bitter Lesson"): General methods that leverage computation have always won in the long run.

**The pragmatic answer: data is essential now.** Models keep getting bigger, datasets keep growing. More data doesn't always help — low-quality or mislabeled data can hurt performance — but no data means no ML.

---

### **The chapter's principle**

> ML systems must be designed holistically around business objectives and four requirements — reliability, scalability, maintainability, and adaptability — through an iterative process that never truly ends.

---

### **Bottom line**

If you want to:

- **Build ML projects that don't get killed by management**

Then:

- **Map your ML metrics to business metrics** before writing a single line of code.
- **Identify all stakeholders early** and understand their conflicting requirements.

If you want to:

- **Design systems that don't become liabilities**

Then:

- **Decouple objectives**: separate models for separate goals, combined at serving time.
- **Embrace the iteration cycle**: your first model is never the last.

**The iterative cycle is not a failure — it's the process. Design for it from the beginning.**

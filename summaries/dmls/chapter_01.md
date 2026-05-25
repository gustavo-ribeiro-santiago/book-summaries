### **Core idea:**

**ML is not magic — it's a powerful but narrow tool with specific conditions for success, and production ML is fundamentally different from academic ML.**

Put simply: **before building an ML system, ask whether ML is even the right tool; and if it is, understand that the algorithm is the smallest part of what you're building.**

---

### **The central principle**

ML is an approach to *learn complex patterns from existing data* to make predictions on unseen data. That definition contains five conditions — each one is a constraint. When the conditions are met, ML can deliver enormous value. When they're not, it's expensive and fragile.

---

### **When ML makes sense**

Use ML when the problem has:

- **Patterns to learn** — there must be a signal, not just noise
- **Existing data** — or a pathway to collect it
- **Predictive framing** — the problem can be expressed as "what is the answer to this question?"
- **Repetitive scale** — you need many predictions, not just one
- **Changing patterns** — hardcoded rules would become stale quickly
- **Low cost of wrong predictions** — or benefits that outweigh the costs

Avoid ML when: a simpler lookup/rule works, it's unethical, or it isn't cost-effective.

---

### **ML use cases: enterprise vs. consumer**

Consumer ML is splashy (search, recommendations, translation, smart assistants), but **enterprise ML represents the majority of use cases** — fraud detection, price optimization, demand forecasting, churn prediction, customer support routing, brand monitoring. Enterprise ML tends to have stricter accuracy requirements but more latency tolerance than consumer apps.

---

### **ML in research vs. ML in production**

| Dimension | Research | Production |
|---|---|---|
| Objective | Model performance (accuracy) | Business metrics (revenue, cost) |
| Data | Static, clean, labeled | Dynamic, noisy, possibly biased |
| Stakeholders | Usually one team | Many (ML, product, infra, business) |
| Compute priority | High throughput (training) | Low latency (inference) |
| Fairness | Afterthought | Requirement |
| Interpretability | Optional | Often required |

The most painful realization for researchers entering industry: **production prioritizes fast inference, not fast training.** Every 100ms of latency can cost 7% in conversion rates.

---

### **ML systems vs. traditional software**

Traditional software: code + data are separated, logic is explicit.

ML systems: **part code, part data, part artifacts** created from both. The data can change quickly, which means the system must adapt quickly. You can't just version the code — you have to version the data and the models too.

---

### **Fairness and interpretability are not optional**

ML algorithms at scale can **discriminate at scale**. A bias affecting 2% of users might be invisible in aggregate metrics but devastating to those users. Only 13% of large companies surveyed (McKinsey, 2019) were actively mitigating fairness risks. This is changing — and should.

---

### **The chapter's principle**

> ML is a powerful but constrained tool — suited for problems with learnable patterns, existing data, and changing distributions — and production ML systems are fundamentally different from research, requiring a holistic approach beyond just the algorithm.

---

### **Bottom line**

If you want to:

- **Avoid building ML where it doesn't belong**

Then:

- **Check all five conditions**: patterns, data, predictions, scale, changing distributions.
- **Start with the simplest non-ML solution** — if it works, you're done.

If you want to:

- **Succeed with ML in production**

Then:

- **Align your ML metrics with business metrics** from day one.
- **Remember that latency, fairness, and interpretability are not afterthoughts** — they're requirements.

**The algorithm is a small part of an ML system. The surrounding system — data, monitoring, infrastructure, stakeholders — is where the real work happens.**

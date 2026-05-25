### **Core idea:**

**Continual learning is not about updating models every second — it's about building the infrastructure that lets you update models as fast as you need to, whether that's daily, hourly, or in response to detected drift.**

Put simply: **the question isn't "how often should I retrain?" — it's "how fast can I retrain?" — and the answer depends entirely on the infrastructure you've built, not the algorithm you've chosen.**

---

### **The central principle**

Most companies retrain their models from scratch on a fixed schedule. This is expensive, slow, and blind to real-world changes. Continual learning — the ability to update models incrementally as new data arrives — is the infrastructure upgrade that unlocks fast iteration, cold-start handling, and adaptation to distribution shifts.

---

### **Stateless vs. stateful training**

**Stateless retraining** (the default): train the model from scratch each time, using all historical data (or a large window). Expensive. Slow. Ignores the model's existing knowledge.

**Stateful training (fine-tuning / incremental learning)**: continue training the existing model on new data. Uses only fresh data. Converges faster. Requires much less compute.

Grubhub switched from daily stateless retraining to daily stateful training and saw:
- 45x reduction in compute cost
- 20% increase in purchase-through rate

Stateful training enables a beautiful property: you don't need to store all historical data. Each sample is used once — critical for privacy-sensitive applications.

Stateful training doesn't replace training from scratch. Periodic full retraining calibrates the model and prevents drift from compounding. Companies that use stateful training also occasionally retrain from scratch on large datasets.

---

### **Why continual learning?**

**1. Combat distribution shifts**: a ride-sharing model trained on typical Thursday evening patterns won't know about a big event happening in that neighborhood. If it can't respond in time, drivers won't mobilize, riders wait, and users churn.

**2. Adapt to rare events**: Black Friday happens once a year. No historical dataset covers "what users do during this specific Black Friday." Continual learning allows the model to adapt throughout the day.

**3. Solve the continuous cold-start problem**: recommender systems struggle with new users (classic cold start). Continual learning also helps with *existing* users who haven't been seen in a while, who switched devices, or who are browsing anonymously. TikTok's system adapts to new users in minutes — within a few videos, it predicts what you want to watch next with high accuracy.

---

### **Challenges of continual learning**

**Fresh data access**: you need a pipeline that continuously delivers labeled (or naturally labeled) data. If labels require human annotation, the delay becomes a bottleneck.

**Evaluation**: how do you evaluate an updated model quickly enough to decide whether to deploy it? Offline evaluation on static test sets is insufficient when distributions are shifting. You need test-in-production strategies.

**Catastrophic forgetting**: neural networks tend to forget what they learned on old data when trained on new data. Mitigation: use replay buffers (mix in old data), elastic weight consolidation, or periodic full retraining.

**Feature schema evolution**: if new features are added, the model architecture must change — you can't do stateful training across an architecture change. This requires retraining from scratch.

---

### **Four stages of continual learning maturity**

**Stage 1 (manual, stateless)**: train from scratch manually, triggered by engineers when performance decays. Most companies start here.

**Stage 2 (automated, stateless)**: scheduled retraining pipeline (nightly/weekly), automated evaluation and deployment. A good first goal.

**Stage 3 (automated, stateful)**: models are updated incrementally on fresh data, with automated evaluation. Champions and challengers are managed systematically.

**Stage 4 (continual, triggered)**: models update in response to detected distribution shifts, not just on a schedule. The infrastructure decides when to retrain based on monitoring signals.

---

### **How often to retrain?**

Two approaches:

**Schedule-based**: retrain every hour, day, or week. Simple to implement. May overtrain (wasting compute on stable distributions) or undertrain (too slow to catch sudden shifts).

**Performance-based**: trigger retraining when monitoring detects degradation or distribution shift. More efficient but harder to build. Requires robust monitoring infrastructure.

The right frequency depends on:
- How fast your data distribution shifts
- How much new data you accumulate per time period
- The cost of a stale model vs. the cost of retraining

---

### **Test in production**

Offline evaluation is insufficient for models that adapt to a changing world. You need to evaluate models with live users.

**Shadow deployment**: deploy the challenger model alongside the champion. The champion serves production traffic; the challenger runs in parallel but its predictions aren't shown to users. Compare outputs. Low risk, but can't measure user interaction.

**A/B testing**: split traffic between champion (control) and challenger (treatment). Measure the business metric that matters. The gold standard but requires enough traffic to achieve statistical significance.

**Canary deployment**: send a small percentage of traffic to the challenger first (e.g., 1%), monitor for issues, gradually increase. Limits blast radius of a bad model.

**Interleaving experiments**: mix predictions from both models in a single user session and measure which predictions are preferred. More statistically efficient than A/B testing. Especially popular in recommender systems.

**Multi-armed bandits**: dynamically allocate more traffic to the better-performing model in real time. More efficient than A/B testing (less regret during exploration), but harder to implement.

---

### **The chapter's principle**

> Continual learning is an infrastructure investment — not just a training paradigm — that enables models to adapt to distribution shifts, cold-start scenarios, and rare events by updating incrementally on fresh data with automated evaluation and deployment.

---

### **Bottom line**

If you want to:

- **Make your models resilient to the changing world**

Then:

- **Build for stateful training**, even if you start with stateless retraining.
- **Set up automated evaluation and deployment pipelines** — the training frequency is a knob to turn once the infrastructure exists.

If you want to:

- **Know which model is better before fully committing**

Then:

- **Use shadow deployment first**, then canary releases, then full A/B testing.
- **Consider interleaving experiments** for recommender systems — faster statistical convergence.

**The companies that win on ML are not those with the best algorithms — they're the ones that can iterate fastest. Continual learning is the infrastructure that makes fast iteration possible.**

### **Core idea:**

**Deploying a model is not the end of the process — it's the beginning of a new set of engineering problems around prediction serving, latency, scale, and model optimization that most ML courses never mention.**

Put simply: **deploying is easy if you ignore all the hard parts — and the hard parts include serving millions of users with millisecond latency, optimizing models for edge devices, and managing hundreds of models simultaneously.**

---

### **The central principle**

A model sitting in a notebook is not an ML system. Deployment means making it accessible, reliable, fast, and maintainable under real-world conditions. The gap between a demo deployment and a production deployment is enormous — and the myths engineers carry from academic settings make that gap even harder to cross.

---

### **Four myths about ML deployment**

**Myth 1: You only deploy one or two models at a time**
Reality: Uber has thousands of models. Netflix uses ML for personalization, artwork, search, content moderation, and more. A company in 20 countries with 10 models per country has 200 models. Infrastructure that handles one model won't scale.

**Myth 2: Model performance stays the same if you don't change it**
Reality: *Software rot* and *data distribution shifts* cause model performance to degrade over time, even if nothing changes in the code. A model trained in January may perform poorly by March because the world changed.

**Myth 3: You won't need to update your models very often**
Reality: The right question is not "how often should I update?" but "how fast *can* I update?" Weibo updates some models every 10 minutes. Netflix deploys thousands of times per day. Slow iteration cycles are a competitive disadvantage.

**Myth 4: Most ML engineers don't need to worry about scale**
Reality: More than half of software engineers work at companies with 100+ employees. At that scale, ML applications likely serve enough users to require scalable infrastructure.

---

### **Batch vs. online prediction**

Three modes of serving predictions:

**Batch prediction (batch features only)**:
- Predictions are precomputed on a schedule (nightly, hourly)
- Stored in a database and retrieved at serving time
- High throughput, high latency
- Good for: recommendations shown on homepage, weekly reports
- Problem: predictions become stale; can't respond to immediate context

**Online prediction (batch features only)**:
- Predictions generated in real time for each request
- Uses precomputed features (embeddings, user profiles)
- Lower latency than batch, but still limited by feature freshness

**Online/streaming prediction (batch + streaming features)**:
- Real-time features computed from live data streams
- Lowest latency, highest complexity
- Good for: fraud detection, real-time pricing, search
- Requires stream processing infrastructure (Kafka, Flink)

The choice depends on acceptable latency, feature freshness requirements, and infrastructure maturity.

---

### **Cloud vs. edge deployment**

**Cloud (server-side)**:
- Model runs on a remote server
- Network latency adds overhead
- Easy to update, easy to scale
- Privacy concern: user data must be sent to the server

**Edge (on-device)**:
- Model runs on the user's device (phone, browser, IoT sensor)
- Zero network latency
- Works offline
- Harder to update; must fit within device constraints (memory, battery, compute)
- Privacy-preserving by default

**Hybrid approaches**: run a small model on-device for fast, private inference; fall back to a larger cloud model for complex cases.

The trend toward edge ML is accelerating, driven by privacy regulations, latency requirements, and increasingly powerful mobile hardware.

---

### **Model compression**

Production models must be smaller and faster than their research counterparts. Four main techniques:

**1. Quantization**: reduce the precision of model weights and activations from 32-bit float to 16-bit or 8-bit integer. Reduces memory footprint and speeds up inference. Trade-off: small accuracy loss. Most modern hardware (TPUs, mobile SoCs) has native support for INT8 inference.

**2. Knowledge distillation**: train a small "student" model to mimic the behavior of a large "teacher" model. The student learns from the teacher's soft probability outputs (which carry more information than hard labels). Used by DistilBERT (40% smaller than BERT, retains 97% of performance).

**3. Pruning**: remove weights that contribute little to predictions. Unstructured pruning removes individual weights; structured pruning removes entire neurons or attention heads. Sparse models are harder to accelerate without specialized hardware.

**4. Low-rank factorization**: decompose large weight matrices into products of smaller matrices. Reduces parameters and computation. Common in NLP (LoRA, adapters) and recommendation systems.

---

### **ML inference optimization**

Beyond compressing the model, the serving infrastructure can be optimized:

- **Vectorization**: batch operations to leverage SIMD instructions
- **Parallelization**: spread computation across cores/devices
- **Operator/kernel fusion**: combine adjacent operations (e.g., conv + batch norm + relu → single kernel). Reduces memory bandwidth bottlenecks.
- **Caching**: store frequently requested predictions to avoid recomputation

---

### **The chapter's principle**

> Deployment is not the end of ML development but the beginning of a new phase — where prediction serving mode (batch vs. online), deployment target (cloud vs. edge), and model optimization (quantization, distillation, pruning) become the primary engineering challenges.

---

### **Bottom line**

If you want to:

- **Ship a model that survives real traffic**

Then:

- **Choose the right prediction mode** based on your latency requirements and feature freshness needs.
- **Plan for model compression** from the beginning — edge deployment requires it; cloud deployment benefits from it.

If you want to:

- **Build ML infrastructure that scales beyond one model**

Then:

- **Design for multiple models from day one** — artifact management, monitoring, and deployment pipelines must handle hundreds of models.
- **Automate model updates** — the ability to iterate fast is more valuable than any single optimization.

**Deploying is easy if you ignore all the hard parts. The engineers who succeed are the ones who don't.**

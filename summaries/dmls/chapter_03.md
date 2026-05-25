### **Core idea:**

**The data layer — how data is sourced, formatted, stored, and moved — is the unglamorous foundation that determines whether your ML system succeeds or collapses in production.**

Put simply: **the algorithm is useless without understanding where data comes from, how it flows, and what happens to it between collection and training.**

---

### **The central principle**

ML systems are data-dependent. Before you can train, evaluate, or deploy a model, you need to understand the entire data stack: its sources, its formats, its storage paradigms, and how it moves between processes. Ignoring this layer is the fastest way to build a system that works in a notebook and breaks everywhere else.

---

### **Data sources**

- **User input data** — text, images, uploads. Easily malformatted (wrong type, wrong length, wrong format). Requires heavy validation and fast processing.
- **System-generated data** — logs, model outputs, event traces. Less likely to be malformatted. Useful for debugging and monitoring. Volume grows fast — storing everything is common but finding signals in the noise is hard.
- **Internal databases** — inventory, CRM, user data. Feeds ML models directly or as lookup tables alongside model outputs.
- **Third-party data** — bought from data brokers (browsing habits, purchase history, demographics). Valuable for recommender systems. Privacy regulations are shrinking this ecosystem (Apple's IDFA opt-in).

---

### **Data formats**

Choosing the right serialization format affects file size, read/write speed, and downstream processing:

| Format | Type | Structure | Best for |
|---|---|---|---|
| JSON | Text | Key-value | Flexibility, portability |
| CSV | Text, Row-major | Tabular | Row-by-row writes, simple reads |
| Parquet | Binary, Column-major | Tabular | Column reads, analytics |

**Row-major (CSV)**: better for adding new rows, processing individual records.
**Column-major (Parquet)**: better for reading a few columns across many rows — much more common in ML analytics. AWS says Parquet is 2x faster to unload and uses 6x less storage than text formats.

**Text vs. binary**: text is human-readable but bulky (7 bytes for "1000000"); binary is compact (4 bytes for the same number as int32).

**pandas pitfall**: DataFrame is column-major. Accessing rows in a DataFrame is much slower than accessing columns. If you need fast row access, convert to a NumPy array first.

---

### **Data models**

**Relational model (SQL)**: data in tables with rows and columns. Normalized to avoid redundancy. Declarative: you specify *what* you want, the optimizer figures out *how*. Expensive joins are the trade-off for normalization.

**Document model (NoSQL)**: documents (JSON/BSON), schemaless, self-contained. Better locality (all info about an entity in one document) but harder to query across documents. Good for sparse, heterogeneous data.

**Graph model**: nodes and edges. Optimized for traversing relationships. Essential for social networks, knowledge graphs, supply chains. Queries that are trivial in a graph model are nightmarish in SQL (variable-length paths).

**Structured vs. unstructured**: structured data commits to a schema up front (writes assume structure); unstructured defers to the reader (reads assume structure). Data warehouses store structured data; data lakes store raw unstructured data. Modern solutions (Databricks, Snowflake) offer hybrid "lakehouses."

---

### **Storage engines and processing**

**OLTP (Online Transaction Processing)**: optimized for fast reads/writes of individual records. Row-major. ACID guarantees (Atomicity, Consistency, Isolation, Durability). The backbone of apps.

**OLAP (Online Analytical Processing)**: optimized for aggregate queries across many rows. Column-major. Powers business intelligence and ML feature computation.

The OLTP/OLAP divide is blurring. CockroachDB handles both transactional and analytical queries. Snowflake and BigQuery decouple storage from compute — the same data can be queried with different processing engines.

**ETL (Extract, Transform, Load)**: the classic pipeline. Extract from sources → clean and transform → load into a target. ELT (load first, transform later) became popular with cheap storage, but raw data lakes are hard to query at scale. Hybrid lakehouses are the current answer.

---

### **Modes of dataflow**

How do you pass data between processes?

1. **Through databases** — process A writes, process B reads. Simple but slow for latency-sensitive apps.
2. **Through services (REST/RPC)** — synchronous request/response. Process A sends a request to process B's API. Powers microservices. Fragile: if a dependency is down, the caller is blocked.
3. **Through real-time transports (Kafka, Kinesis)** — asynchronous event broadcasting. A service publishes events to a broker; any service that cares subscribes. Decouples producers from consumers. Resilient to partial failures.

**Pubsub** (Kafka, Kinesis): any service publishes to topics, any subscriber reads all events in those topics.
**Message queue** (RabbitMQ, RocketMQ): messages have intended consumers; the queue routes them.

Real-time transports are in-memory — fast enough for latency-sensitive applications.

---

### **Batch vs. stream processing**

**Batch processing**: data in storage is processed periodically (daily, hourly). Produces *static features* — ratings, historical aggregates. Tools: Spark, MapReduce.

**Stream processing**: data arriving in real-time transports is processed continuously (per event or every few minutes). Produces *dynamic features* — current driver availability, recent ride prices. Tools: Apache Flink, KSQL, Spark Streaming.

Most ML systems need **both**: batch features for stable context, streaming features for real-time signals. Apache Flink maintainers argue that batch processing is simply a special case of stream processing.

---

### **The chapter's principle**

> The data layer — its sources, formats, models, storage engines, and movement modes — is the foundation of every ML system; choosing the right tool for each layer determines whether the system is maintainable, efficient, and adaptable.

---

### **Bottom line**

If you want to:

- **Avoid painful data bugs in production**

Then:

- **Match your format to your access pattern**: row-major for writes, column-major for analytics.
- **Know your data model**: relational for structured joins, document for flexible schemas, graph for relationships.

If you want to:

- **Build a scalable ML data pipeline**

Then:

- **Use real-time transports** (Kafka/Kinesis) for inter-service communication — it decouples services and handles partial failures gracefully.
- **Combine batch and streaming features**: batch for stable context, streaming for real-time signals.

**The data layer is not boring infrastructure — it's the reason your ML system works or fails.**

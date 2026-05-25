# Chapter 6: RAG and Agents

## Overview
Models have a knowledge cutoff and a finite context window. To solve real-world tasks, they often need information beyond what was learned during training. This chapter covers the two dominant patterns for supplying that information: **Retrieval-Augmented Generation (RAG)** and **agents** (tool-using models).

## Why Context Matters
A model answers better when it has relevant context, just as a human answers better when informed. For a given application, the system prompt provides universal instructions while context is query-specific. **Context construction is the foundation model analog of feature engineering in classical ML** — it gives the model what it needs to produce a useful output.

Even with increasingly long context windows (Anthropic suggests that knowledge bases under 200K tokens can be put entirely in context), RAG remains relevant because:
1. Many applications need more data than any context window can hold.
2. Long contexts are expensive and slow.
3. Models don't always use long contexts well ("lost in the middle" problem).
4. RAG allows only the most relevant information to be included, reducing token cost and improving focus.

## RAG Architecture
A RAG system has two components:
1. **Retriever**: indexes documents and retrieves the most relevant chunks for each query.
2. **Generator**: uses the retrieved chunks plus the user query to produce a response.

The two are typically trained separately and assembled at inference time. The success of the whole system depends heavily on retrieval quality.

### Retrieval Pipeline
1. **Chunking**: documents are split into manageable pieces. Strategies: fixed-size, sentence-based, paragraph-based, semantic (split on topic shifts). Chunk size affects recall and precision — smaller chunks are more precise, larger chunks provide more context.
2. **Indexing**: each chunk is processed and stored for fast retrieval.
3. **Querying**: at runtime, the user query is used to find the most relevant chunks.

### Retrieval Algorithms

**Term-based retrieval (sparse)**:
- Keyword matching using TF-IDF (term frequency × inverse document frequency).
- **BM25** (Best Match 25): the most widely used term-based algorithm, extends TF-IDF with normalization for document length. Used in Elasticsearch, Lucene, and many production search systems.
- Strengths: fast, interpretable, works with exact matches (product codes, names, IDs).
- Weaknesses: fails on synonyms ("car" vs. "automobile"), paraphrasing, and multilingual queries.

**Embedding-based retrieval (dense)**:
- Documents and queries are encoded into dense vectors using embedding models (e.g., text-embedding-ada-002, E5, BGE).
- Similarity is measured by cosine similarity or dot product in embedding space.
- Supports **approximate nearest-neighbor (ANN)** search via vector databases (Pinecone, Weaviate, Qdrant, pgvector, FAISS).
- Strengths: handles semantic similarity, paraphrasing, and cross-lingual queries.
- Weaknesses: slower to index, can miss exact matches, sensitive to embedding model quality.

**Hybrid retrieval**: combine term-based and embedding-based scores (e.g., using Reciprocal Rank Fusion). Typically outperforms either alone.

### Reranking
Retrieved candidates are re-scored by a more powerful (but slower) cross-encoder model that considers both the query and document together. The top-k reranked results are passed to the generator.

### Advanced RAG Techniques
- **Query rewriting**: rephrase the query to improve retrieval (e.g., HyDE — generate a hypothetical document, then retrieve by its embedding).
- **Multi-query retrieval**: generate multiple query variants, retrieve for each, deduplicate.
- **Contextual compression**: post-process retrieved chunks to extract only the relevant sentences.
- **Parent-child chunking**: index fine-grained chunks but retrieve their parent (larger) chunks for context.

## Agents
An **agent** is a model that can use tools to take actions in the world. Tools extend a model's capabilities beyond what it can generate from memory alone.

### Tool Types
- **Retrieval tools**: web search, database queries, document lookup.
- **Computation tools**: calculators, code interpreters, SQL executors.
- **Action tools**: sending emails, booking calendars, calling APIs, posting to services.
- **Memory tools**: reading from and writing to persistent memory stores.

### How Tool Use Works
The model generates a **tool call** (structured output specifying which tool to call and with what arguments). The tool executes and returns a result. The result is added to the model's context, and the model generates the next step or final answer.

**ReAct pattern** (Yao et al., 2022): interleave reasoning ("I need to find the current weather") with actions (call weather API) in a loop until the task is complete.

### Agentic Patterns
- **Single-agent**: one model handles the entire task.
- **Multi-agent**: specialized sub-agents handle specific tasks, coordinated by an orchestrator.
- **Reflection/critique loops**: an agent generates an output, a critic agent evaluates it, and the original agent revises. Can significantly improve output quality on complex tasks.
- **Planning agents**: explicitly decompose complex tasks into sub-tasks before executing.

### Challenges of Agents
- **Compounding errors**: each step can introduce errors; over many steps, small mistakes accumulate.
- **Prompt injection via tools**: retrieved documents may contain adversarial instructions.
- **Infinite loops**: agents can get stuck repeating the same actions.
- **Cost and latency**: multi-step agentic workflows can be 10–100x more expensive than single-turn queries.
- **Reliability**: agentic systems are much harder to test and evaluate than simple query-response systems.

## RAG vs. Long Context vs. Fine-tuning
| Scenario | Recommended Approach |
|----------|---------------------|
| External knowledge needed, changes frequently | RAG |
| Fixed, small knowledge base (<200K tokens) | Long context |
| Task requires a specific output style/format | Fine-tuning |
| Knowledge is private and can't go to external API | Self-hosted model + RAG |

## Takeaway
RAG and agents are the two primary patterns for extending a model's capabilities beyond its training. RAG grounds responses in retrieved facts, reducing hallucinations. Agents enable models to take actions and process dynamic information. Both are powerful but introduce complexity — start with the simplest architecture that meets your requirements, and add complexity only when needed.

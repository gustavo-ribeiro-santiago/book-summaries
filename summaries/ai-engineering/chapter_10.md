# Chapter 10: AI Engineering Architecture and User Feedback

## Overview
This final chapter synthesizes the book's techniques into a practical production architecture. It takes a **gradual complexity** approach — start with the simplest possible system and add components only as specific needs arise. It also covers user feedback: how to collect it, extract signals from it, and use it to continuously improve the application.

## The Gradual Architecture Pattern
A common mistake in AI engineering is over-engineering from the start. The recommended approach:

**Step 0 — Baseline**: query → model API → response. No RAG, no guardrails, no optimization. Get something working first.

**Step 1 — Enhance Context**: add context construction (RAG, tool use) to give the model the information it needs. This is the highest-leverage first addition for most applications.

**Step 2 — Add Guardrails**: protect the system and users from harmful inputs and outputs.

**Step 3 — Add Router + Gateway**: support complex multi-model pipelines, load balancing, and security.

**Step 4 — Add Caching**: reduce latency and cost by reusing responses for similar queries.

**Step 5 — Add Complex Logic + Write Actions**: enable agents that take real-world actions.

**Throughout — Monitoring + Observability**: instrument every component from day one.

**Throughout — Orchestration**: chain all components together cleanly.

## Step 1: Context Construction
As discussed in Chapter 6, context construction provides the model with the specific information it needs for each query:
- **Retrieval**: text, image, or tabular data from databases and document stores.
- **Tool calls**: web search, news APIs, weather, calendar.
- **User data**: personalization based on user history and preferences.

Most model API providers (OpenAI, Anthropic, Google) offer built-in support for file uploads and tool use, but vary in limits and capabilities. Specialized RAG solutions provide more control over chunking, retrieval algorithms, and knowledge base size.

## Step 2: Guardrails
Guardrails protect against risks at input and output:

**Input guardrails**:
- **PII detection**: automatically identify and redact/block personally identifiable information before sending to external APIs (especially important for third-party model APIs).
- **Prompt injection detection**: flag inputs that appear to override system instructions.
- **Topicality filtering**: reject off-topic queries for focused applications.
- **Rate limiting and abuse detection**: prevent misuse at the request level.

**Output guardrails**:
- **Safety classifiers**: detect harmful, toxic, or policy-violating outputs.
- **Factuality checking**: compare outputs against retrieved context for hallucination detection.
- **Format validation**: ensure outputs conform to expected JSON, code, or other structured formats.
- **Sensitive information detection**: ensure the model didn't inadvertently output credentials or private data.

Guardrails are imperfect. Security is an arms race — new attack vectors emerge constantly. Guardrails add latency (each check is an additional model call or classifier invocation). The goal is risk reduction, not elimination.

## Step 3: Model Router and Gateway
**Model router**: route queries to different models based on:
- **Query complexity**: simple questions → cheaper/faster model; complex reasoning → more capable model.
- **Domain**: route coding queries to a code-specialized model, medical queries to a medical model.
- **Language**: route non-English queries to multilingual-specialized models.
- **Cost and latency constraints**: user-configurable trade-offs.

**Model gateway**: a unified API layer that:
- Abstracts over multiple model providers (OpenAI, Anthropic, Bedrock) behind a single interface.
- Handles authentication, rate limiting, retry logic, and fallback.
- Enables A/B testing by routing a percentage of traffic to a new model.
- Logs all requests and responses for monitoring.

## Step 4: Caching
Two types of caching for cost and latency reduction:
- **Prompt caching**: reuse the KV cache for repeated system prompts (supported by OpenAI and Anthropic at 50–90% cost reduction for cached tokens).
- **Semantic caching**: retrieve cached responses for semantically similar queries using embedding similarity. More aggressive but risks serving stale or inappropriate cached responses.

Cache invalidation is critical: cached responses become incorrect when the underlying knowledge changes.

## Step 5: Complex Logic and Write Actions
As the application matures, it may need to:
- Execute multi-step workflows (chained model calls).
- Take write actions (send emails, update databases, call external APIs).
- Maintain state across sessions (persistent memory).
- Run parallel sub-tasks to improve latency.

These are **agentic capabilities**. Key risks:
- Irreversible write actions amplify errors.
- Long workflows accumulate errors across steps.
- Mitigation: require human confirmation before irreversible actions; implement rollback mechanisms; validate intermediate outputs.

## Monitoring and Observability
Production AI applications require deep observability:

**What to monitor**:
- **Input distribution**: are users asking what you expected? Drift in query distribution signals a need to update the model or knowledge base.
- **Output quality metrics**: hallucination rate, format compliance, instruction following, latency, cost per query.
- **System health**: error rates, timeout rates, model API availability.
- **Business metrics**: task completion rate, user satisfaction, conversion.

**Tracing**: log the full execution trace of each request — every retrieval call, model call, tool invocation, and guardrail check. This enables debugging of complex failures in multi-step pipelines.

**Alerting**: set up alerts for sudden changes in key metrics (hallucination rate spike, latency increase, cost anomaly).

## User Feedback
User feedback is both a product quality signal and a training data source.

**Types of feedback**:
- **Explicit feedback**: thumbs up/down, ratings, corrections. High quality but low volume (most users don't bother).
- **Implicit feedback**: whether the user asked a follow-up question (suggests the answer was insufficient), whether they copied the output (suggests it was useful), how long they spent reading (engagement signal).
- **Conversational signals**: "that's wrong", "try again", "that's not what I asked" — strong negative signals extractable from conversation text.

**Feedback collection design**:
- Minimize friction: thumbs up/down is 10× more common than freetext feedback.
- Make feedback contextual: capture the exact query and response that received feedback.
- Avoid feedback fatigue: don't ask for feedback on every response.
- Use A/B testing to measure the impact of changes on implicit metrics.

**Closing the feedback loop**:
1. Collect feedback in production.
2. Route low-quality outputs to human review.
3. Use reviewed examples to augment the fine-tuning dataset.
4. Retrain/re-evaluate periodically.

This creates a **data flywheel**: more usage → more feedback → better training data → better model → more usage.

## Orchestration
All the components above need to be chained together reliably. Orchestration frameworks:
- **LangChain / LlamaIndex**: popular open-source frameworks for building RAG pipelines and agents.
- **DSPy**: optimize prompts and few-shot examples programmatically.
- **Semantic Kernel**: Microsoft's framework for integrating AI into enterprise applications.
- **Custom code**: for production, many teams prefer minimal frameworks and more control.

Key principles: keep orchestration logic simple, test each component independently, use async execution where possible to minimize latency.

## Takeaway
Successful AI applications are built incrementally. Start with the simplest architecture, measure everything, and add complexity only when it demonstrably solves a problem. User feedback is an underutilized resource — invest in collecting and acting on it. The teams that win are not those with the most sophisticated models, but those with the tightest feedback loops and the best evaluation infrastructure.

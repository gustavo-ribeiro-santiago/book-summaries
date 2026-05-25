# Chapter 4: Evaluate AI Systems

## Overview
While Chapter 3 covers evaluation methods, this chapter focuses on how to apply those methods in practice: defining evaluation criteria for your application, selecting models, choosing between proprietary and open-source options, and building an evaluation pipeline that guides the entire development lifecycle.

## Evaluation-Driven Development
A key principle: **define evaluation criteria before building**. Analogous to test-driven development in software engineering. This matters because:
- An undeployable app is bad; a deployed app with no quality signal is often worse — it costs to maintain and even more to take down.
- Many companies deploy AI features without knowing if they help or hurt users (e.g., customer support chatbots whose impact was never measured).

The most common enterprise AI applications in production are those with **clear, measurable outcomes**: recommender systems (engagement rate), fraud detection (money saved), coding assistants (functional correctness). This is the "looking under the lamppost" problem — we build what we can measure, which may miss the highest-value opportunities.

## Evaluation Criteria Taxonomy
For any application, evaluation criteria fall into four buckets:

### 1. Domain-Specific Capability
Does the model understand the domain your application requires?
- Evaluated via **domain-specific benchmarks** (public or private).
- Examples: MMLU for general knowledge, HumanEval for code, BIRD-SQL for text-to-SQL (including efficiency, not just correctness).
- Close-ended formats (multiple choice) dominate because they're easier to verify and reproduce.
- Also assess: robustness (does performance degrade on slightly different phrasings?), and latency/cost for the required domain tasks.

### 2. Generation Capability
For open-ended outputs — is the response high quality?
- **Factual consistency / hallucination rate**: does the response contradict facts in the context or make unsupported claims? Detection approaches: NLI-based (natural language inference), QA-based verification, entity checking.
- **Coherence**: is the response logically structured and readable?
- **Faithfulness**: in summarization or RAG, does the response accurately reflect the source?
- **Completeness**: does it fully address the user's query?

### 3. Instruction-Following Capability
Does the model do what you asked?
- Format compliance: does the output match the requested JSON/YAML/Markdown structure?
- Length constraints: is the response within specified limits?
- Style requirements: tone, persona, language.
- Evaluated via a mix of exact checks (format validation) and AI judges (tone/style assessment).

### 4. Cost and Latency
Real constraints for production:
- **Latency**: time to first token (TTFT) and time per output token (TPOT) — both matter for user experience.
- **Cost per query**: function of input tokens + output tokens × price per token.
- **Throughput**: how many requests per second can the system handle?

## Model Selection
With hundreds of foundation models available, selection can feel paralyzing. A practical framework:

1. **Start with public benchmarks** for coarse filtering — eliminate models that clearly lack required capabilities.
2. **Distrust leaderboards** — many are contaminated (models trained on benchmark data), and benchmark performance often doesn't predict application performance.
3. **Build a private evaluation set** from your production distribution. This is the most reliable signal.
4. **Perform head-to-head comparison** on your private set using your specific evaluation criteria.
5. **Factor in cost, latency, API reliability, and privacy** — a slightly worse model hosted privately may be preferable to a better model that requires sending sensitive data to a third party.

### Proprietary vs. Open Source
**Proprietary models** (OpenAI, Anthropic, Google):
- Pros: state-of-the-art performance, managed infrastructure, no deployment overhead.
- Cons: cost, latency, privacy concerns, dependency on external vendor, no model customization.

**Open-source models** (LLaMA, Mistral, Qwen, etc.):
- Pros: full control, data privacy, lower inference cost at scale, ability to fine-tune.
- Cons: requires engineering effort to deploy and maintain, often lags behind frontier proprietary models.

A growing middle ground: **API services built on open-source models** (Together, Fireworks, Groq). These offer open-source models with managed infrastructure.

**Rule of thumb**: start with a proprietary model to validate the application concept; move to a smaller, fine-tuned open-source model once you have a working prototype and can justify the engineering investment.

## Building an Evaluation Pipeline
An evaluation pipeline consists of:
1. **Evaluation set construction**: curate representative examples from your production distribution. Include edge cases, adversarial inputs, and examples where you know the expected output.
2. **Automated scoring**: run each example through your evaluation criteria using a mix of exact checks and AI judges.
3. **Regression testing**: after every model or prompt change, run the full evaluation suite to detect regressions.
4. **Slice analysis**: report metrics by meaningful subgroups (topic, user segment, language, query length) to identify where performance degrades.
5. **Human review queue**: route low-confidence or high-stakes outputs to human reviewers.
6. **Feedback loop**: connect production failures back into the evaluation set and fine-tuning data.

## Concrete Application Examples
The chapter walks through evaluation pipeline design for:
- **Coding assistant**: functional correctness + code readability + latency.
- **Customer support chatbot**: intent classification accuracy + response faithfulness + escalation rate.
- **Document Q&A (RAG)**: answer correctness + citation accuracy + retrieval precision/recall.

## Takeaway
Evaluation is not a one-time activity — it is the engine of application iteration. Define criteria before building, instrument everything for observability, automate as much evaluation as possible, and keep humans in the loop for high-stakes decisions. A team that invests in evaluation infrastructure early will iterate faster and ship more reliable applications.

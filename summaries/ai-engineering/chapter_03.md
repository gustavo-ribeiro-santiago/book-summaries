# Chapter 3: Evaluation Methodology

## Overview
Evaluation is the hardest and most underinvested part of AI engineering. This chapter covers *how* to evaluate foundation model outputs — the methods, metrics, and their trade-offs. The companion Chapter 4 covers *what* to evaluate and how to build a full evaluation pipeline.

## Why Evaluation Is Hard
Traditional ML evaluation is straightforward: compare a model's output to a ground truth label. Foundation models break this because:
1. **Open-ended outputs**: for most prompts, there are many correct answers. You can't enumerate them.
2. **Sophisticated tasks**: verifying a medical summary or a legal argument requires domain expertise, not just reading.
3. **Black-box models**: most model internals are hidden, so you can only evaluate by observing outputs.
4. **Rapidly saturating benchmarks**: GLUE (2018) became saturated in a year; MMLU (2020) was replaced by MMLU-Pro (2024). Models improve faster than benchmarks.
5. **Expanded scope**: general-purpose models need evaluation across unknown tasks, not just pre-defined ones.

Despite growing interest (exponential growth in LLM evaluation papers in 2023), evaluation infrastructure remains underfunded relative to model development and orchestration.

## Language Modeling Metrics: Cross-Entropy and Perplexity
For models with a language model component (most of them), these training-time metrics correlate with downstream performance:

- **Entropy**: measures how many bits are needed to encode the average token. Higher entropy = more unpredictable language.
- **Cross-entropy**: measures how difficult it is for a trained model to predict the next token in a dataset. Lower is better; it measures how well the model has learned the data distribution.
- **Perplexity**: `e^(cross_entropy)` — an intuitive measure of "how surprised" a model is by a text. A perplexity of 10 means the model is as uncertain as if choosing uniformly among 10 options at each step. Lower is better.
- **Bits-per-character (BPC) / bits-per-byte (BPB)**: variations used to compare across models with different tokenizations.

These metrics are most useful for model training and fine-tuning decisions. They're less meaningful for evaluating task-specific application performance.

## Evaluation Methods

### Exact Evaluation
Used when there is an objective correct answer:
- **Functional correctness** for code: does it pass tests?
- **Multiple-choice accuracy**: pick the correct option from a list.
- **String matching**: exact or regex comparison for structured outputs.

Limitations: can't evaluate open-ended generation. Most public benchmarks (75% of lm-evaluation-harness tasks) are multiple-choice precisely because they avoid this problem.

### Subjective Evaluation
Used for tasks where quality is inherently relative (writing, summarization, explanation quality):
- **Human evaluation**: gold standard, but slow, expensive, and inconsistent across annotators. Inter-annotator agreement is often low for complex tasks.
- **Reference-based metrics (BLEU, ROUGE)**: compare generated text to a human-written reference using n-gram overlap. Fast and cheap, but poorly correlated with human judgment — a response can score highly while being factually wrong.
- **Embedding similarity**: compare meaning using cosine similarity in embedding space. Better than n-gram overlap but still imperfect.

### AI as a Judge
The emerging dominant approach: use an LLM (e.g., GPT-4) to evaluate the outputs of another LLM.

**How it works**: provide the judge model with the input, the generated output, (optionally) a reference answer, and evaluation criteria. The judge assigns a score or comparative ranking.

**Why it's compelling**:
- Scales cheaply vs. human annotation.
- Correlates well with human judgments on many tasks.
- Can evaluate nuanced criteria (coherence, factuality, style) that rule-based metrics miss.

**Known biases and failure modes**:
- **Self-preference bias**: a model tends to rate its own outputs higher.
- **Verbosity bias**: longer responses are rated higher regardless of quality.
- **Position bias**: in pairwise comparisons, models tend to favor the first option.
- **Inconsistency**: different prompts or judge models yield different scores for the same output.

**Mitigation strategies**: use multiple judge models, randomize position in pairwise comparisons, calibrate judges with human labels, use separate specialized judge models for different criteria.

## Evaluation Frameworks and Benchmarks
Key public benchmarks:
- **MMLU / MMLU-Pro**: diverse multiple-choice across 57 subjects.
- **HumanEval / MBPP**: functional correctness for code generation.
- **BIG-Bench**: very broad capability probing.
- **MT-Bench / Chatbot Arena**: instruction following and conversational quality.

Limitations of public benchmarks:
- **Benchmark contamination**: models may have seen benchmark data during training, inflating scores.
- **Distribution mismatch**: public benchmarks may not reflect your specific application domain.
- **Saturation**: top models quickly max out benchmarks.

**Best practice**: build a private, application-specific evaluation set that mirrors your production distribution. Treat it as a first-class engineering artifact.

## Takeaway
There is no single "right" evaluation method. Exact evaluation is reliable but limited to close-ended tasks. Human evaluation is accurate but expensive. AI judges are scalable but biased. The practical approach is to layer multiple methods: use exact evaluation wherever possible, AI judges for subjective quality, and periodic human audits to calibrate both. Invest in evaluation infrastructure early — it will compound throughout the entire development lifecycle.

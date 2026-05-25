# Chapter 2: Understanding Foundation Models

## Overview
This chapter is a technical deep-dive into how foundation models are built — not to replicate the process, but to understand the design decisions that determine a model's capabilities, limitations, and suitability for downstream applications. Key topics: training data, model architecture, model size, post-training (alignment), and sampling.

## Training Data
**"A model is only as good as the data it was trained on."**

Most foundation models are trained on **Common Crawl** — a massive nonprofit crawl of billions of web pages — often combined with curated datasets like Wikipedia, books, code repositories (GitHub), and scientific papers. Common Crawl is convenient but noisy: it contains misinformation, propaganda, and low-quality content.

Key data dimensions:
- **Language distribution**: English dominates (~46% of Common Crawl). Languages like Burmese, Hindi, or Telugu are severely under-represented. This explains why GPT-4 performs dramatically worse on these languages — e.g., failing all six math problems in Burmese vs. solving most in English.
- **Domain distribution**: General models handle coding, law, science, business well. Domain-specific tasks (drug discovery, cancer screening) often need specialized models trained on curated datasets (e.g., AlphaFold for protein folding, Med-PaLM2 for medicine).
- **Tokenization efficiency**: Non-English languages can require far more tokens to express the same content. Hindi requires ~4.6x and Burmese ~10x as many tokens as English — making inference significantly slower and more expensive.

## Model Architecture
The **Transformer architecture** (Vaswani et al., 2017) dominates because of its ability to model long-range dependencies via self-attention. Key components:
- **Self-attention**: each token can attend to every other token in the context, enabling rich contextual understanding.
- **Positional encodings**: give the model a sense of token order.
- **Feed-forward layers**: process each token independently after attention.

Emerging alternatives aim to reduce the quadratic complexity of attention: **SSMs (State Space Models)** like Mamba process sequences in linear time but may struggle with tasks requiring precise recall. Hybrid architectures combining attention with SSMs are being explored.

**Model size** is measured in parameters. Bigger models are more capable but slower and costlier. The **scaling laws** (Kaplan et al., 2020) showed that performance scales predictably with parameters, data, and compute. The **Chinchilla paper** (Hoffmann et al., 2022) revised this: for a given compute budget, you should train a smaller model on more data than previously assumed. This led to models like LLaMA-1 being far more compute-efficient than GPT-3.

## Post-Training (Alignment)
Pre-training makes a model capable; post-training makes it safe and usable.

**Supervised Fine-Tuning (SFT):** Train the model on high-quality (instruction, response) pairs. This teaches it to follow instructions and adopt a helpful, conversational style.

**Preference Fine-Tuning (RLHF / DPO):** Train on comparative data — (instruction, winning response, losing response) — to align the model with human preferences using reinforcement learning from human feedback (RLHF) or direct preference optimization (DPO). This is what makes ChatGPT-style models refuse harmful requests and respond in a helpful tone.

## Sampling
Sampling is how a model selects its output from among all possible next tokens — arguably the most underrated concept in AI engineering.

- **Temperature**: controls randomness. Temperature = 0 → greedy (most probable token always chosen); higher temperature → more varied and creative outputs. Temperature > 1 can produce incoherent outputs.
- **Top-k / Top-p (nucleus) sampling**: restrict the sampling pool to the k most likely tokens, or the smallest set of tokens whose cumulative probability exceeds p. This balances diversity with coherence.
- **Beam search**: explore multiple candidate sequences in parallel and select the best overall. Common for structured generation tasks.

Key insight: **hallucinations** arise partly from sampling — the model generates a plausible-sounding but factually wrong token because it was statistically likely in context, not because it "knows" the fact is wrong. Understanding sampling helps set expectations and choose the right strategy per use case.

## Context Length
A model's **context window** determines how much text it can process at once. This includes both input and output. Longer context windows are powerful (can process entire documents or codebases) but:
- More expensive and slower (attention is O(n²) in sequence length).
- Models don't always use long context effectively; the "lost in the middle" problem shows that information in the middle of a long context is often ignored.

## Takeaway
Choosing the right model for an application requires understanding: (1) the languages and domains present in its training data, (2) the architecture and size trade-offs, (3) how post-training shapes its behavior and safety profile, and (4) how sampling parameters affect output quality and diversity. These design decisions ripple through everything downstream.

# Chapter 9: Inference Optimization

## Overview
A model that is too slow or too expensive to run in production has no value, no matter how capable it is. This chapter covers the techniques for making AI inference faster, cheaper, and more scalable — from model-level compression to hardware selection to service-level orchestration.

## Why Inference Optimization Matters
- **Latency**: for interactive applications, users expect sub-second responses. Long output generation latency hurts experience, especially for streaming responses.
- **Cost**: at scale, inference can be the dominant cost in an AI application. A 10× reduction in cost per query can determine product economics.
- **Throughput**: high-traffic applications need to serve many concurrent requests without degradation.

Inference optimization touches multiple levels: the model itself, the hardware it runs on, and the service that orchestrates requests.

## Computational Bottlenecks
Two fundamental bottlenecks determine inference performance:
- **Compute-bound**: performance is limited by the number of arithmetic operations per second (FLOP/s). The prefill phase (processing input tokens in parallel) is typically compute-bound.
- **Memory bandwidth-bound**: performance is limited by the speed at which data (weights, activations) can be moved between memory and processors. The decode phase (generating one token at a time) is memory bandwidth-bound, because it requires loading the full model weights for each token.

Most LLM inference is dominated by the decode phase, making it **memory bandwidth-bound**. Optimizations that reduce memory transfers or improve bandwidth utilization are particularly valuable.

Inference performance is also characterized by:
- **TTFT (Time to First Token)**: how long until the user sees the first output token (dominated by prefill).
- **TPOT (Time Per Output Token)**: how fast subsequent tokens are generated.
- **Throughput**: total tokens generated per second across all concurrent users.

## Model-Level Optimizations

### Quantization
Reduce the numerical precision of model weights and/or activations:
- **fp32 → fp16/bf16**: nearly lossless, ~2× memory reduction, widely used.
- **INT8**: 8-bit integers, ~4× memory reduction vs. fp32. Some accuracy loss, especially on edge cases.
- **INT4 / GPTQ / AWQ**: aggressive 4-bit quantization. Enables running 70B models on consumer GPUs. Quality degradation varies by method — AWQ and GPTQ are state-of-the-art for preserving quality.
- **Outlier-aware quantization**: sensitive weight dimensions are kept in higher precision.

### Pruning
Remove weights that contribute little to model outputs. Two types:
- **Unstructured pruning**: zero out individual weights. Theoretically efficient but hard to accelerate on modern GPUs without sparse hardware support.
- **Structured pruning**: remove entire attention heads or FFN neurons. Results in smaller dense matrices that run efficiently on standard hardware.

Magnitude pruning removes weights below a threshold. Gradient-based pruning identifies which weights can be removed with minimal performance impact.

### Knowledge Distillation
Train a smaller "student" model to mimic the output distribution of a larger "teacher" model:
- The student learns from the teacher's soft probability distributions, not just hard labels.
- Can be combined with fine-tuning (task-specific distillation).
- Example: DistilBERT retained 97% of BERT's performance with 40% fewer parameters and 60% faster inference.

### Flash Attention and Efficient Attention
Standard self-attention has O(n²) memory complexity in sequence length. Flash Attention (Dao et al., 2022) reorganizes the computation to reduce memory I/O:
- Processes attention in tiles that fit in GPU SRAM, avoiding round-trips to HBM (GPU main memory).
- 2–4× faster than standard attention for long sequences, with no accuracy loss.
- Flash Attention 2 and 3 continue improving efficiency.

**Grouped Query Attention (GQA)** and **Multi-Query Attention (MQA)** reduce the KV cache size by sharing key-value heads across multiple query heads.

## KV Cache
During autoregressive decoding, the model needs to reference the key-value pairs from all previous tokens. Recomputing these from scratch at each step is wasteful.

**KV cache**: store computed key-value pairs from previous tokens and reuse them in future steps. This dramatically reduces computation during decode at the cost of memory.

KV cache size grows linearly with sequence length × batch size × number of layers × head dimension. For long sequences and large batch sizes, KV cache can dominate memory consumption. Techniques to manage it:
- **PagedAttention** (used in vLLM): manage KV cache in variable-size pages to avoid memory fragmentation.
- **Sliding window attention**: only cache the most recent N tokens (e.g., Mistral's implementation).
- **KV cache compression**: quantize or selectively evict less important cache entries.

## Service-Level Optimizations

### Batching
Processing multiple requests together amortizes the per-request overhead of loading model weights:
- **Static batching**: wait for a fixed batch size before processing. Poor latency.
- **Dynamic (continuous) batching**: process requests as they arrive, filling the batch with waiting requests at each decode step. Used in vLLM, TensorRT-LLM.
- **In-flight batching**: add new requests to the batch mid-generation, interleaving prefill and decode.

### Prefill-Decode Disaggregation
Because prefill (compute-bound) and decode (memory bandwidth-bound) have different computational profiles, they can be run on different machines optimized for each:
- Prefill servers use high-FLOP/s GPUs for fast parallel processing.
- Decode servers use high-bandwidth-memory GPUs for fast sequential generation.
- This "disaggregated serving" improves hardware utilization and reduces TTFT.

### Speculative Decoding
Use a small, fast "draft" model to speculatively generate multiple candidate tokens. A larger "verifier" model checks and accepts/rejects them in parallel. If accepted, the large model has effectively generated multiple tokens in one forward pass.
- Can achieve 2–4× decoding speedup with no accuracy loss.
- Works best when the draft model is highly accurate (similar domain).

### Caching
- **Prompt caching**: if the system prompt is identical across requests (common in production), reuse its KV cache. OpenAI and Anthropic both offer prompt caching with significant cost savings (~50–90% for the cached portion).
- **Semantic caching**: cache responses to semantically similar queries. If a query closely matches a cached one (by embedding similarity), return the cached response without model inference.

## Hardware
AI inference is dominated by:
- **NVIDIA GPUs**: A100, H100, H200 — the industry standard. H100 delivers ~2× the throughput of A100.
- **Google TPUs**: purpose-built for matrix operations, highly efficient for batch inference.
- **AI chips**: Cerebras, Groq's LPU, Tenstorrent — optimized for specific bottlenecks (e.g., Groq's LPU is memory bandwidth-optimized, delivering very fast decode).
- **Edge chips**: Apple Neural Engine, Qualcomm AI, for on-device inference.

## Takeaway
Inference optimization is a multi-layer discipline. Start with the model: quantize aggressively (INT4 or INT8) using quality-preserving methods. Use Flash Attention and KV cache management. At the service level: implement continuous batching and prompt caching. For very high-traffic applications, consider disaggregated serving and speculative decoding. The goal is to serve the best model your budget allows, at the latency your users require.

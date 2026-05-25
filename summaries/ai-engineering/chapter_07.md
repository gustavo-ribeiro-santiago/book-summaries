# Chapter 7: Finetuning

## Overview
Fine-tuning adapts a pre-trained model to your specific task by further training it on task-relevant data. Unlike prompting (which changes behavior through instructions) or RAG (which adds external knowledge), fine-tuning modifies the model's weights. It delivers the best performance on task-specific benchmarks but requires the most investment. This chapter covers when to fine-tune, how to reduce memory costs, and the dominant techniques.

## Fine-tuning Overview
Fine-tuning is a form of **transfer learning**: knowledge gained from pre-training on broad data transfers to a specialized task with fewer examples than training from scratch. For LLMs, pre-training provides a rich understanding of language and the world; fine-tuning refines behavior for specific tasks.

Fine-tuning comes after pre-training in the training pipeline and can take several forms:
- **Continued pre-training (self-supervised fine-tuning)**: further train on unlabeled domain-specific text before adding labeled data.
- **Supervised fine-tuning (SFT)**: train on (instruction, response) pairs to improve task-specific behavior.
- **Preference fine-tuning (RLHF / DPO)**: train on (instruction, winning response, losing response) comparisons to align with human preferences.
- **Long-context fine-tuning**: extend the model's effective context window by adjusting positional encodings.

## When to Fine-tune

### Reasons To Fine-tune
1. **Task-specific performance**: a general model may perform poorly on your specific domain or output format. Fine-tuning on domain data closes this gap.
2. **Format / style enforcement**: if you need reliable JSON, YAML, or other structured output, fine-tuning is much more reliable than prompting alone.
3. **Smaller, faster models**: fine-tune a small model (7B) to match the performance of a larger model (70B) on your specific task. This reduces inference cost and latency significantly.
4. **Distillation**: use a large model to generate training data, then fine-tune a smaller model to imitate it. Grammarly's finetuned Flan-T5 outperformed a GPT-3 variant on writing tasks while being 60× smaller.
5. **Bias mitigation**: fine-tuning on carefully curated data can reduce biases present in the base model.
6. **Privacy**: if your data can't be sent to external APIs, fine-tuning a self-hosted model is the only option.

### Reasons Not to Fine-tune
1. **High cost**: requires labeled data, compute, and ML expertise.
2. **Maintenance burden**: fine-tuned models need to be re-trained when the base model updates or when your task distribution shifts.
3. **Risk of catastrophic forgetting**: fine-tuning can degrade general capabilities while improving specific ones.
4. **Prompting might be sufficient**: always try prompt engineering and RAG first. Fine-tuning typically provides 5–15% improvement over well-engineered prompts in many scenarios — not always worth the investment.

**Decision framework**: Try prompting → Try RAG → Try fine-tuning. Fine-tuning and prompting aren't mutually exclusive; real applications often use both.

## Memory and Compute Challenges
At the scale of foundation models, fine-tuning is memory-intensive. A model's memory footprint includes:
- **Model weights**: stored in fp32 (32-bit) or fp16/bf16 (16-bit). A 7B parameter model in fp32 requires ~28GB.
- **Optimizer states**: e.g., Adam optimizer stores first and second moment estimates — 2× model size.
- **Gradients**: same size as model weights.
- **Activations**: grow with batch size and sequence length.

Total memory for full fine-tuning of a 7B model can exceed 100GB — requiring multiple high-end GPUs.

## Parameter-Efficient Fine-Tuning (PEFT)
PEFT techniques reduce memory and compute costs by updating only a small fraction of parameters:

### LoRA (Low-Rank Adaptation)
The most widely used PEFT technique (Hu et al., 2021). Instead of updating the full weight matrix W, inject two low-rank matrices A and B such that the update is ΔW = A × B. With rank r << min(m,n), the number of trainable parameters drops drastically.

- A 7B model has billions of parameters. LoRA might fine-tune only ~8M parameters — a 99%+ reduction in trainable parameters.
- Only A and B are updated during training; the original W is frozen.
- At inference, ΔW can be merged into W, adding zero overhead.
- **QLoRA** (Dettmers et al., 2023) combines LoRA with 4-bit quantization, making fine-tuning of 65B models feasible on a single 48GB GPU.

### Adapters
Insert small trainable modules (adapters) between existing transformer layers. Only adapter weights are updated. Less memory-efficient than LoRA but more modular — different adapters can be swapped for different tasks on the same base model.

### Prompt Tuning / Prefix Tuning
Prepend learnable "soft tokens" (continuous embeddings) to the input. The model weights remain frozen; only the soft tokens are trained. Works best for large models (>10B parameters).

## Supervised Fine-tuning Data Considerations
- Quality over quantity: 1,000 high-quality (instruction, response) pairs often outperform 10,000 low-quality ones.
- Data should reflect the target task distribution exactly — including edge cases.
- For format compliance (JSON, YAML): even 100–500 examples can be sufficient.
- For domain-specific knowledge: typically need thousands of examples.
- OpenAI's InstructGPT paper perspective: fine-tuning doesn't teach the model new knowledge — it surfaces knowledge the model already has but doesn't naturally express in the desired way.

## Preference Fine-tuning
RLHF (Reinforcement Learning from Human Feedback) and DPO (Direct Preference Optimization) align model outputs with human preferences using comparative ratings. Key steps:
1. **Collect comparisons**: for each prompt, get a "winning" and "losing" response from annotators.
2. **Train a reward model** (RLHF) or directly optimize the policy (DPO).
3. The result: a model that generates responses that humans prefer.

DPO is simpler to implement than RLHF (no separate reward model training) and has become the dominant preference fine-tuning approach.

## Takeaway
Fine-tuning is a powerful but expensive tool. Use it when prompting and RAG cannot meet your performance requirements, when you need reliable structured outputs, or when inference cost/latency is a concern and a smaller fine-tuned model can replace a larger generic one. LoRA and QLoRA have made fine-tuning accessible to teams without massive GPU clusters. Always compare fine-tuned performance against a well-engineered prompt baseline before committing to the added complexity.

# Chapter 8: Dataset Engineering

## Overview
The quality of a fine-tuned model is bounded by the quality of its training data. As frontier model training becomes the exclusive domain of a few large organizations, data is increasingly the lever that differentiation AI applications. This chapter covers how to curate, evaluate, synthesize, and process datasets for fine-tuning — the discipline increasingly called **data-centric AI**.

## The Data-Centric vs. Model-Centric Shift
- **Model-centric AI**: improve performance by designing better architectures or training procedures, given a fixed dataset.
- **Data-centric AI**: improve performance by building better datasets, given a fixed model.

The field has shifted toward data-centric approaches. Andrew Ng's 2021 data-centric AI competition required participants to improve a fixed model's performance using only dataset modifications. DataComp (2023–2024) benchmarks the best training dataset for a CLIP model, not the best architecture. High-quality small datasets (e.g., 7B tokens of coding data to train a 1.3B model that outperforms 175B models on coding) demonstrate that data quality often matters more than data quantity.

## What Data You Need
Data requirements vary by training phase:
- **Self-supervised / continued pre-training**: raw text sequences in the target domain.
- **Supervised fine-tuning (SFT)**: (instruction, response) pairs.
- **Preference fine-tuning (RLHF/DPO)**: (instruction, winning response, losing response) triplets.
- **Reward model training**: (instruction, response, score) pairs.

The data format must match the target behavior. Teaching a model to do **chain-of-thought (CoT) reasoning** requires CoT responses in the training data — "CoT prompting only works if CoT training data exists." Multi-step tool use requires specially formatted conversation data with tool invocation traces.

## Three Pillars of Data Curation

### 1. Data Quality
Quality is multi-dimensional:
- **Correctness / accuracy**: factual errors in training data become model errors at inference.
- **Consistency**: contradictory examples confuse the model (e.g., the same question answered two different ways).
- **Completeness**: edge cases not covered in training data will be handled poorly.
- **Format compliance**: response format should match what you want the model to produce.

Detection techniques:
- **Rule-based filters**: regex for format, length, special characters.
- **Classifier-based filters**: train a classifier on good/bad examples.
- **Embedding-based deduplication**: remove near-duplicate examples to prevent overfitting to repeated content (MinHash, SimHash, or cosine similarity in embedding space).
- **LLM-based quality scoring**: use a model as a judge to rate response quality — fast and scalable.

### 2. Data Coverage
The dataset should cover the full input distribution your model will encounter in production:
- All relevant topics, user intents, phrasings, and edge cases.
- Underrepresented scenarios (minority languages, rare domains) need explicit upsampling.
- **Balanced category distribution**: if the dataset is dominated by one topic, the model will be biased toward it.

### 3. Data Quantity
More data generally helps, but with diminishing returns. Sample-efficiency depends on the task:
- Fine-tuning for format compliance: 100–500 examples may suffice.
- Domain-specific knowledge: thousands to hundreds of thousands of examples.
- General instruction following: hundreds of thousands to millions of examples.

**Quality beats quantity**: 10,000 carefully curated examples often outperform 100,000 noisy ones.

## Data Sources

### Human Annotation
The gold standard for quality but expensive and slow:
- Domain experts cost $50–$200/hour; general annotators are cheaper but less accurate.
- **Inter-annotator agreement** (e.g., Cohen's kappa) measures annotation consistency.
- Important: observe how humans perform tasks rather than just asking them to describe it — humans often omit unconscious steps.
- Annotation guidelines must be very detailed for consistency at scale.

### Data Augmentation
Expand existing datasets by creating variations:
- Paraphrase existing instructions/responses.
- Back-translation: translate to another language and back.
- Perturbation: modify examples to test edge cases.

### Data Synthesis with LLMs
Use large, capable models to generate training data for smaller models. Key approaches:
- **Self-instruct** (Wang et al., 2022): use GPT-3 to generate diverse (instruction, response) pairs from a small seed set. Used to create Alpaca.
- **Evol-Instruct**: iteratively evolve simple instructions into more complex ones using a model.
- **Constitutional AI (Anthropic)**: generate critiques and revisions of model outputs according to a "constitution" of principles, producing preference data without human annotators.
- **Distillation**: use a large teacher model (GPT-4) to generate responses; train a smaller student model to imitate them. Microsoft's Orca showed that training a smaller model on GPT-4's reasoning traces significantly closed the capability gap.

Risks of synthetic data:
- **Model collapse**: training repeatedly on model-generated data degrades quality over generations.
- **Bias amplification**: synthetic data inherits biases from the generating model.
- **Diversity loss**: LLMs tend to generate stylistically similar responses.

## Data Processing Pipeline
1. **Collection**: gather from internal systems, web scraping, annotation platforms, or LLM synthesis.
2. **Filtering**: remove low-quality, duplicated, or harmful examples.
3. **Formatting**: standardize into the required fine-tuning format.
4. **Deduplication**: both exact and fuzzy (near-duplicate) removal.
5. **Quality scoring**: automated and/or human review.
6. **Splitting**: create train/validation/test splits ensuring no leakage.

## Takeaway
Data engineering is unglamorous but decisive. The best models are built on carefully curated, high-quality, well-balanced datasets. As foundation models become more capable, the bottleneck shifts increasingly from model architecture to data quality. Teams that invest in systematic data curation processes — automated quality filtering, diverse coverage, and ongoing data maintenance — build compounding advantages over those that rely on raw model capability alone.

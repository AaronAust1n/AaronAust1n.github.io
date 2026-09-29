---
title: "[Original] What's Left After You Cut: Engram, Jev, and an Anti-Scale AGI Path"
date: 2026-09-29
description: "Engram removes static lookup and reasoning gets stronger; Jev removes text generation and judgment gets two orders of magnitude faster. The scattered work of 2026 points at the same thing—intelligence can be taken apart, and every piece gets cheaper, faster, or stronger that way."
tags:
  - Engram
  - Jev
  - AGI
  - Conditional Memory
  - Model Architecture
  - Inference Optimization
  - DeepSeek
  - System One
  - Sparse Models
  - AI Engineering
keywords: "Engram, conditional memory, Jev, TypeSafe, AGI, layered intelligence, MoE, N-gram hashing, U-shaped scaling law, compile-time, runtime, CXL, DiffusionGemma, Fugu"
---

# What's Left After You Cut: Engram, Jev, and an Anti-Scale AGI Path

> Taking intelligence apart is harder than scaling it up. Scaling needs money; taking it apart needs judgment.

*Published on September 29, 2026*

---

For the past few years, the mainstream AGI narrative could be compressed into one sentence: make the model bigger, feed it more data, stack more compute.

That narrative showed a clear crack in 2026. The crack didn't come from a shortage of compute but from disproportionate returns—public pretraining data is approaching exhaustion, marginal returns on compute keep declining, and more expensive models did not deliver proportionally more usable intelligence. Diogo Almeida, founder of TypeSafe and one of the InstructGPT authors, put it bluntly: "We have lightning in a bottle, and it's useless."

Lightning in the bottle, but the lid won't turn. A group of new works that emerged this year turn the lid in strikingly similar ways—**not by adding things, but by cutting them away.**

![Layered intelligence: compile-time memory, runtime judgment, slow reasoning](/images/posts/engram-jev-llm/three-layer-stack.svg)
*Figure: A three-layer division of labor—L0 conditional memory at compile time; L1/L2 judgment and L3 reasoning at runtime.*

---

## 1 · Engram: The Most Valuable Finding Isn't on the Leaderboard

A January 2026 DeepSeek paper (arXiv:2601.07372) proposed conditional memory as a new axis of sparsity. The approach modernizes classic N-gram embedding: hash token sequences into N-grams, look up embeddings in O(1), and inject them into Transformer layers through a learned gate. Alongside MoE, it becomes a second leg for scaling model capacity.

The paper scaled it to 27B parameters and beat a strict iso-parameter, iso-FLOPs MoE baseline across the board. But stopping there misses the point.

Look at where the gains land:

| Dimension | Improvement |
|---|---|
| Knowledge retrieval (MMLU / CMMLU) | +3.4 / +4.0 |
| General reasoning (BBH / ARC-Challenge) | +5.0 / +3.7 |
| Code / math (HumanEval / MATH) | +3.0 / +2.4 |
| Long-context retrieval (Multi-Query NIAH) | 84.2 → 97.0 |

**A lookup module improved reasoning more than knowledge. That's counterintuitive.**

The paper's mechanistic analysis explains it: Engram frees the backbone's early layers from **static pattern reconstruction**, effectively returning depth to complex reasoning. And once local dependencies are handled by lookup, attention capacity is released for global context—which is why long-context retrieval jumps from 84.2 to 97.0.

The significance goes far beyond one module. It exposes something long overlooked:

> A substantial share of a neural network's compute has been wasted on "recognizing local patterns it has already seen." That work doesn't need reasoning; it needs a table lookup. Take it away, and reasoning gets stronger.

From a programmer's familiar angle: it's like discovering that half the time in a core code path goes to re-parsing the same constants. Extract them into a precomputed table and the remaining logic runs faster—not because the code got shorter, but because the execution depth it was occupying is now free.

---

## 2 · Jev: The Interface Shape Was Wrong From the Root

Jev is TypeSafe AI's first System One Model. Its move is more radical than Engram's: **it cuts generation entirely.**

Give it a passage and it won't give a passage back. Give it a state (text, logs, JSON) plus a set of predefined questions, and it returns typed decisions—Noul gives a probability between 0 and 1, Choice gives an option distribution and confidence, Score gives a level and a probability distribution. Answers are constrained to the given space; they can't leave the type, and they need no parsing, cleaning, or fallbacks.

The cost is that it cannot write at all. The payoff is 20–200x faster, 40–400x cheaper, $0.042 per million input tokens, output entirely free, end-to-end latency of 70–500ms.

The judgment behind it matters more than the technology: **the consumer of intelligence is shifting from humans to code.** For years the industry optimized "how to say it more nicely," but what actually consumes intelligence is the if-branch inside a software pipeline. Code doesn't need style or explanation. It needs one directly executable decision.

So agent QA, ticket routing, per-step validation, deciding what context to compact—these high-frequency, low-cognitive-load, cost-hungry slots finally have a matching form factor. Within days of launch, someone in the community post-trained Qwen3.5-4B into an open-source clone (AlexWortega/openjev), which shows there's no black magic here; what's new is the interface shape and the confidence design.

---

## 3 · The Common Denominator: Subtraction

The two works look unrelated. One changes architecture at pretraining, one changes interfaces at inference; one comes from DeepSeek, one from an ex-OpenAI researcher; one chases efficiency, one chases cost. But they are doing the same thing: **removing from the neural network what the neural network should not be doing.**

Engram removes static lookup—a lookup table is enough for that, no gradient-descent generalization required. Jev removes text generation—pure overhead for a code consumer, slow and expensive, with parsing on top.

And their findings point the same way, remarkably: after Engram cuts lookup, **reasoning gets stronger**; after Jev cuts generation, **judgment gets two orders of magnitude faster.**

This is not a coincidence. It's two faces of the same thing: intelligence was never a single quantity to be scaled indefinitely. It is made of parts with different natures, each with its own optimal form. Cram them all into one autoregressive model and every part pays for the others.

---

## 4 · Three Layers: Compile-Time, Runtime, Slow Reasoning

Put the three together and what you get is not "a smarter model" but a layered thing.

```
                     Request
                        │
                        ▼
      ┌────────────────────────────────────────┐
      │  L0  Conditional memory (compile-time) │
      │                                        │
      │  Engram tables / NGM / Adapter         │
      │  · static patterns, domain knowledge   │
      │  · O(1) deterministic lookup           │
      │  · frees early-layer depth             │
      └───────────────────┬────────────────────┘
                          ▼
      ┌────────────────────────────────────────┐
      │  L1/L2  Jev (runtime, ~300ms)          │
      │                                        │
      │  routing · step validation · thresholds│
      │  high-frequency loop, calibrated probs │
      └───────────────────┬────────────────────┘
                          ▼
      ┌────────────────────────────────────────┐
      │  L3  LLM slow reasoning (runtime)      │
      │                                        │
      │  planning · generation · long chains   │
      │  draws on L0 memory internally         │
      └────────────────────────────────────────┘
```

The key is that **this layering is asymmetric**:

**L0 is compile-time.** Engram tables form mainly during pretraining or offline construction and cannot be rewritten per request. That's not a defect; it's a design constraint.

**L1/L2/L3 are runtime.** Every request decides anew.

That asymmetry defines the system's behavior: **capability changes ship through releases, not hot updates.** Post-launch behavior is predictable; each version's memory tables are fixed and reviewable, and problems can be rolled back wholesale. For a component headed into a production system, that's worth more than "can learn in real time."

---

## 5 · Four Hard Engineering Constraints

Thinking through the constraints matters more than thinking through the architecture.

### Constraint One: More Memory Is Not Better

The Engram paper raises the sparsity allocation problem and reveals a **U-shaped scaling law**—there is an optimal ratio between neural computation (MoE) and static memory (Engram), and over-inflating either side hurts.

Follow-up work (arXiv:2601.16531) found another counterintuitive effect: high-frequency keys start with lower loss but get overtaken by low-frequency positions late in training, while hash collisions turn out to act as implicit regularization. Eliminating collisions with perfect hashing does not reliably help under strict iso-parameter conditions—the bottleneck is gate credit assignment, not index precision.

Practical takeaway: don't reach for a bigger table just because "more memory improves the score." Sweep the ratio at your own scale and confirm the gate is learning correctly first.

### Constraint Two: The Learning Loop Is Version-Level

Engram tables cannot be rewritten at runtime, so "solidifying slow thinking into fast thinking in real time" doesn't work. The corrected loop is:

```
traffic ──► Jev routing/loop ──► LLM slow reasoning
                                    │
                                    ▼
                     accumulate (state, decision, verified?)
                                    │
                                    ▼
                    ─── offline batch (hours / days) ───
                    a) build / extend Engram tables
                    b) train an Engram Adapter for domain specialization
                    c) distill a standalone Jev-class small model
                    ───────────┬──────────────
                               ▼
                            next version
```

If real-time effect is genuinely required, several realistic paths exist today: NGM touches no weights at all and is plug-and-play; Engram Adapter repurposes pretrained memory as a post-hoc adapter and retains 99.4%–100.1% of OOD performance; Memory Grafting uses a stronger model to build tables offline for exact lookup; User as Engram writes different users' facts into disjoint hash slots, achieving lossless multi-user stacking with about 33,000x less memory than per-user LoRA.

Which to choose depends on whether you can accept touching weights, and whether you need multi-tenant isolation.

### Constraint Three: Deterministic Addressing Is the Biggest Engineering Sweet Spot

Engram's addressing is deterministic (N-gram hash → table offset), which means the corresponding embedding rows can be prefetched from host memory **before** the forward pass begins. Traditional MoE can't do this because experts are routed dynamically.

The direct consequence: Engram tables can be very large without living entirely in VRAM. Existing work has pushed them into CXL memory pools (arXiv:2603.10087, integrated into SGLang, near-pure-DRAM performance end to end) and SSD tiers (TF-Engram).

This means L0's capacity ceiling is far higher than expected, at almost no GPU budget. It's the most underrated engineering dividend in the whole architecture.

### Constraint Four: Confidence Must Have a Price

Jev outputs probabilities, not answers. Production logic must look like this:

```python
if p >= 0.90:
    auto()               # high confidence, execute directly
elif top1 - top2 >= 0.30:
    auto_with_flag()     # clear lead, handle and flag for review
else:
    escalate()           # distributions close, send to LLM or human
```

That middle band is the dividing line between cost and quality. And you must look at the **probability distribution**, not the winning option—`{"billing": 0.45, "technical": 0.43}` and `{"billing": 0.99}` pick the same winner, but the former should go to a human.

Without this layer, the probabilities the model hands you are just decoration.

---

## 6 · Judgments

Based on all of the above, a few judgments.

**First, AGI will not arrive as a single model. It will arrive as a layered system.** Not a bigger brain, but a nervous system with a division of labor—lookup, reflex, judgment, and reasoning each in their optimal form. The significance of Engram and Jev is not how strong they are, but that they prove "intelligence is separable" is not wishful thinking, and that once separated, every part becomes cheaper, faster, or stronger.

**Second, the moat is shifting from "I have the strongest model" to "I know how to layer."** Fugu already approaches frontier performance with a pool of open-source models; DiffusionGemma shows switching the generation paradigm costs less than 10% of the original pretraining budget; Engram shows memory beats more compute on cost-effectiveness. Models are becoming replaceable parts; the remaining differentiation is engineering design.

**Third, single-model benchmarks are losing meaning for layered systems.** Jev simply doesn't publish standard scores (it published an essay before launch saying leaderboards are obsolete on arrival); Fugu is a black box that beats the models it hires. Comparing a monolithic model's score against a layered system is itself breaking down. What will be valuable is "your own 500 labeled examples on your own business"—the only evaluation that means anything.

**Fourth, this path is friendlier to small and mid-sized teams.** The scaling narrative demands money; the layering narrative demands judgment—knowing which layer uses which form, where to set the threshold, and what deserves to enter the training set. It's an engineering problem, not a capital problem. The community cloning Jev with Qwen3.5-4B and building a training-free NGM with Qwen3-0.6B are footnotes to exactly this logic.

**Fifth, don't expect one module to do everything.** The compile-time/runtime division is a hard constraint, and violating it produces a chimera—treating Engram as a cache discards its real value (freeing reasoning depth), and treating Jev as a chatbot discards its speed advantage. The elegance of layering comes precisely from each layer not being general-purpose.

---

## Final Thoughts

Taking intelligence apart is harder than scaling it up. Scaling needs money; taking it apart needs judgment.

And this may be the first time in years that an AGI path has appeared that doesn't require raising billions first—its ticket isn't compute, but thinking clearly about which jobs should never have been given to a neural network in the first place.

That's probably what all these seemingly scattered works of 2026 have been pointing at together.

---

## References

- arXiv:2601.07372 — Conditional Memory via Scalable Lookup: A New Axis of Sparsity for LLMs (DeepSeek Engram) — https://arxiv.org/abs/2601.07372
- arXiv:2601.16531 — A Collision-Free Hot-Tier Extension for Engram-Style Conditional Memory — https://arxiv.org/abs/2601.16531
- arXiv:2605.16893 — NGM: A Plug-and-Play Training-Free Memory Module — https://arxiv.org/abs/2605.16893
- arXiv:2608.29327 — When to Adapt: Conditional Memory Adapters (EMNLP 2026 Findings) — https://arxiv.org/abs/2608.29327
- arXiv:2605.20948 — Memory Grafting: Scaling via Offline Conditional Memory — https://arxiv.org/abs/2605.20948
- arXiv:2606.19172 — User as Engram: Internalizing Per-User Memory as Local Parametric Edits — https://arxiv.org/abs/2606.19172
- arXiv:2607.07388 — TF-Engram: A Train-Free Engram with SSD-Backed Memory — https://arxiv.org/abs/2607.07388
- arXiv:2603.10087 — Pooling Engram Conditional Memory using CXL — https://arxiv.org/abs/2603.10087
- TypeSafe AI — Introducing System One Models & Jev; official docs and Use Case Map — https://typesafe.ai/blog/introducing-system-one-models-and-jev
- HuggingFace — AlexWortega/openjev (community reproduction) — https://huggingface.co/AlexWortega/openjev
- Google DeepMind — DiffusionGemma Technical Report (arXiv:2608.00146) — https://arxiv.org/abs/2608.00146
- Sakana AI — Sakana Fugu Technical Report; TRINITY (arXiv:2512.04695) — https://arxiv.org/abs/2512.04695; Conductor (arXiv:2512.04388) — https://arxiv.org/abs/2512.04388

---
[View All Posts](./index.md)
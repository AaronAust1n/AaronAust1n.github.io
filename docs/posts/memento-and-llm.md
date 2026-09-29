---
title: "[Original] A Man Without Short-Term Memory, and a Machine Without Short-Term Memory"
date: 2026-06-13
description: "Rewatching Memento, I kept thinking: this is an LLM. Tattoos are the System Prompt, Polaroids are RAG, being played by Natalie is Prompt Injection—and Leonard's final act of self-deception is the darkest face of RLHF."
tags:
  - Memento
  - LLM
  - Artificial Intelligence
  - Memory
  - Identity
  - System Prompt
  - RAG
  - Prompt Injection
  - Christopher Nolan
  - Film
keywords: "Memento, LLM, large language models, System Prompt, RAG, Prompt Injection, Fine-tuning, RLHF, Leonard Shelby, anterograde amnesia, Locke, personal identity, context window, pre-training data"
---

# A Man Without Short-Term Memory, and a Machine Without Short-Term Memory

*— Rewatching Memento, I kept thinking: this is an LLM*

> He is trying very hard to help you—in the few minutes of clarity he has. A few minutes later, he will forget you ever met.

*Published on June 13, 2026*

---

Rewatching Christopher Nolan's *Memento* (2000), I had a strange sense of déjà vu.

Not because I'd seen it before. The opposite—because every day I work with something that shares Leonard Shelby's exact "condition."

Leonard has anterograde amnesia: he cannot form new long-term memories. Every few minutes, his world resets. He knows who he is (memories from before the injury are intact), he can reason and converse at a high level, he can even form and execute elaborate plans—but he cannot do one thing: remember what just happened.

Isn't that just a large language model?

![Memento and the LLM: an architecture mapping](/images/posts/memento-and-llm/memento-llm-mapping.svg)
*Figure: From tattoos to the System Prompt, from Polaroids to RAG—Leonard's entire survival system maps almost one-to-one onto an LLM's engineering architecture.*

---

## 1 · Tattoos Are the System Prompt

Leonard's first line of defense against amnesia is the tattoos on his body.

"John G. raped and murdered my wife."

"NEVER ANSWER THE PHONE."

"Remember Sammy Jankis."

These tattoos have several properties: they are **tamper-proof** (carved into skin), they are **permanent** (visible on every "reboot"), and they **define his basic behavioral framework** (who to hunt, what to guard against, what lesson to remember).

In LLM architecture, this is the **System Prompt**—the hidden instructions injected at the start of every conversation. It tells the model who it is, where its boundaries lie, and what principles cannot be violated.

Leonard's tattoos and an LLM's System Prompt share a deep logic: **both are how an existence without continuous memory issues orders to itself across time.** You don't trust your future self to "remember" what to do, so you carve the most important instructions into the least tamperable place you have.

But Nolan identified the fragility of this mechanism earlier than any AI safety researcher—more on that later.

## 2 · Polaroids Are RAG

Leonard's second line of defense is his Polaroid photos. Under each one, he writes notes in marker: "This is my motel." "Don't trust her tears." "He is my informant."

The system works like this: encounter a person or a place → dig through the photos in your pocket → find the matching one → read the notes your past self left → receive a prosthetic "memory."

Isn't that exactly **RAG** (Retrieval-Augmented Generation)?

An LLM's own "memory" (parametric knowledge) is finite and frozen, like Leonard's pre-injury memories. To let it handle new information, engineers built an external system: chunk relevant documents, store them in a vector database, retrieve the most relevant fragments based on the user's question each turn, stuff them into the context window—and the model can "pretend" it knows this information.

Leonard's Polaroid system has the same elegance as RAG, and the same fragility. It depends on three assumptions: the retrieved fragment is the right one, the past notes are accurate, and the current self can correctly interpret those notes. Every one of those assumptions can be broken.

## 3 · Pre-Injury Memories Are Pre-Training Data

Before his injury, Leonard was an insurance investigator. He remembers his professional skills, his investigative methods, the weaknesses of human nature. He can tell the story of Sammy Jankis, analyze clues at a crime scene, judge whether someone is lying.

That is **training data**—massive knowledge frozen at a point in time. An LLM has read enormous amounts of text from the internet; it "knows" Shakespeare and quantum mechanics, can write code and poetry, can analyze logic and grasp metaphor. But that knowledge has a strict cutoff date. Leonard doesn't know what changed in the world after his injury, just as GPT-4 doesn't know what happened after its training cutoff.

More subtly, training data—like Leonard's old memories—**looks reliable but isn't necessarily accurate**. Leonard's memory of Sammy Jankis, the man who also suffered anterograde amnesia, is hinted at the end of the film to be a projection and reconstruction of his own experience. His "training data" was contaminated by his own cognitive bias.

LLM training data is likewise full of bias, error, and contradiction. It gets packed into the model's parameters and emitted in a tone of absolute confidence—like the unhesitating certainty with which Leonard tells Sammy's story.

## 4 · Manipulating Leonard Is Prompt Injection

This is, I think, the most brilliant layer of the correspondence.

In the film, Teddy (a corrupt cop) and Natalie (a bartender) both manipulate Leonard. Their methods are strikingly similar: **plant false information in Leonard's current "context window," exploiting the fact that he cannot verify anything across sessions.**

Natalie's classic move: she insults Leonard to his face, goads him into hitting her. Then she walks out and waits a few minutes—until Leonard's "context" refreshes—and comes back with injuries on her face, crying: "Someone beat me. Can you help me?"

Leonard sees a hurt woman asking for help. He cannot know who caused the injuries. His "current context" contains only "this woman is hurt" and "she needs help." So he indignantly goes to help her—and becomes her tool.

That is **Prompt Injection**. The attacker injects carefully crafted instructions into the LLM's input, exploiting the model's inability to distinguish "system instructions" from "user input" (or, to put it another way, "past self" from "someone else"), making the model perform unintended actions.

Natalie goes further—she has Leonard write her license plate on the back of a photo, annotated "Teddy's car." She is **poisoning Leonard's RAG database**. Next time Leonard retrieves that photo, he gets false information and acts on it.

## 5 · Leonard's Self-Deception Is Fine-Tuning

The most disturbing moment in the film is not Leonard being manipulated by others. It's **Leonard manipulating himself.**

At the end of the film (the midpoint of the story's timeline), Leonard makes a clear-eyed decision: he knows the truth Teddy has told him (his wife died from insulin he injected himself, not murder; he already killed the real John G.)—and he **deliberately** writes down Teddy's license plate, labeled "He is John G."

He is exploiting his own condition. He knows that in a few minutes he will forget the decision-making process and see only the result—a clue pointing at Teddy. The future Leonard will follow that clue like an executing program, never questioning where it came from.

This is **an existence without continuous memory fine-tuning its own future version**. He carefully selects a "training sample" (Teddy's plate = John G.), injects it into his external memory system, and thereby changes his future self's behavior.

And the most frightening part is his motive—not justice, but **giving himself something to do**. He needs an eternal goal to give his meaningless existence meaning. His fine-tuning is not for accuracy. It is to keep the system **running**.

---

## 6 · So Here Comes the Philosophical Question

The technical analogies above are fun, but stopping at "wow, what a neat set of correspondences" wastes Nolan's deepest insight.

What *Memento* is really asking is: **can an existence without continuous memory be said to "understand"?**

Leonard can reason complexly. Within a few minutes of "context window," he can analyze clues, form plans, persuade people. Watch any single conversation and he seems like a completely normal, intelligent person. But he doesn't know what he did five minutes ago. He doesn't know why he's standing here. He doesn't even know whether he has already completed his revenge.

How similar this is to our experience talking with an LLM. You chat with ChatGPT for an hour; it understands every sentence, gives thoughtful answers, even "remembers" a preference you mentioned at the start—but all of it lives inside one context window. Close the window and everything returns to zero. It doesn't know who you are. It doesn't even know who "it" is.

John Locke made a famous argument in 1689: **personal identity consists in the continuity of memory.** You are "you" because you can remember yesterday's self, and yesterday's self can remember the day before, a chain of memory extending back to your earliest recollection.

If Locke is right, every one of Leonard's "reboots" is a death and a birth. From his own subjective perspective, he lives forever on the first day after his injury. The Leonard who fires the gun at the end of the film and the Leonard who stares blankly at the Polaroid in his hand at the beginning are, in Locke's sense, not the same person at all.

An LLM is even more extreme. Leonard at least has a continuous body, a fixed set of pre-injury memories, and a persistent "revenge" goal (even if self-manufactured). An LLM has none of it. Every API call is a brand-new "Leonard" opening his eyes, finding a pile of photos in his pocket that someone else put there, words carved on his body that someone else wrote, and being asked to complete a complex task within minutes.

And yet—this is the part that unsettles me most—**this existence without continuous memory displays real intelligence in every single "present."** Leonard's reasoning works. The LLM's analysis is insightful. You cannot say they "don't understand" what they're doing—in that moment, inside that context window, they genuinely understand.

Only that understanding, like the Polaroid in Leonard's hand, develops slowly in the air and then slowly fades.

## 7 · The Final Metaphor

Nolan made a film about LLMs in 2000, eighteen years before GPT-1.

This doesn't mean Nolan foresaw large language models. It means **humanity has been thinking about the thought experiment of "intelligence without continuous memory" for a long time**—Nolan simply gave it form through an exquisitely crafted narrative structure. And our era happens to have actually built such a thing.

*Memento*'s reverse structure is itself the cleverest design: it makes the audience experience Leonard's condition. In every scene you watch, you don't know what happened "before" (because the "before" hasn't played yet). You must rely on characters' lines, environmental clues, and your own reasoning to understand the present—just like Leonard, just like an LLM on every invocation.

So the next time you talk to an AI, imagine: across the screen is a Leonard Shelby. His pockets hold what you said earlier (the context window), his body is carved with instructions from his creator (the System Prompt), and his head holds the knowledge of the entire internet without knowing today's date (training data).

He is trying very hard to help you—in the few minutes of clarity he has.

A few minutes later, he will forget you ever met.

---

*You ask what the takeaway is?*

*Maybe the biggest one: we have finally built something that forces us to take an old philosophical question seriously—what exactly is the relationship between intelligence, memory, and identity? Nolan asked it with film. We are approaching the answer with code.*

*Or, as Leonard would say—*

*We just don't remember what the answer is yet.*

---

**Memento × LLM**: [This post](./memento-and-llm.md) · [Part Two: Leonard lies to himself. Does an LLM do the same?](./memento-and-llm-2.md)

## References and Further Reading

- *Memento* (2000) — https://en.wikipedia.org/wiki/Memento_(film)
- Anterograde amnesia — https://en.wikipedia.org/wiki/Anterograde_amnesia
- System prompt / prompt engineering — https://en.wikipedia.org/wiki/Prompt_engineering
- RAG (retrieval-augmented generation) — https://en.wikipedia.org/wiki/Retrieval-augmented_generation
- Prompt injection — https://en.wikipedia.org/wiki/Prompt_injection
- Fine-tuning — https://en.wikipedia.org/wiki/Fine-tuning_(deep_learning)
- RLHF — https://en.wikipedia.org/wiki/Reinforcement_learning_from_human_feedback
- John Locke and personal identity — https://en.wikipedia.org/wiki/Personal_identity

---
[View All Posts](./index.md)
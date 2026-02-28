---
title: "[Original] We Got Agent Infrastructure Wrong"
date: 2026-02-28
description: "The real question is: when an agent starts acting on your behalf — booking flights, sending emails, writing and deploying code, managing your calendar — what authorizes it to do that? Whose identity does it carry? When something goes wrong, who's liable?"
tags: 
  - AI Agent
  - Agent Infrastructure
  - Hashmind
  - OAuth
  - Identity Protocol
  - MCP
  - Model Context Protocol
  - AI Authorization
  - Agent Memory
  - Multi-Agent System
  - AGI Infrastructure
  - AI Security
keywords: "AI Agent, Agent Infrastructure, Hashmind, OAuth, Identity Protocol, MCP, Model Context Protocol, AI Authorization, Agent Memory, Multi-Agent System, AGI Infrastructure, AI Security, Agent Identity, Permission Management"

---

# [Original] We Got Agent Infrastructure Wrong

> The real question is: when an agent starts acting on your behalf — booking flights, sending emails, writing and deploying code, managing your calendar — what authorizes it to do that? Whose identity does it carry? When something goes wrong, who's liable?

*Published on February 28, 2026*


Everyone discussing AI infrastructure defaults to the same mental diagram: chips on the left, data centers in the middle, foundation models on the right, agents stacked on top. The diagram isn't wrong — it just describes the fuel, not the foundation.


---

### We're Building the Wrong Infrastructure for the Age of Agents

Everyone discussing AI infrastructure defaults to the same mental diagram: chips on the left, data centers in the middle, foundation models on the right, agents stacked on top. The diagram isn't wrong — it just describes the fuel, not the foundation.

The real question is: when an agent starts acting on your behalf — booking flights, sending emails, writing and deploying code, managing your calendar — what authorizes it to do that? Whose identity does it carry? When something goes wrong, who's liable?

Right now, nobody has a satisfying answer.

---

### We're Hammering in Screws

OAuth is the dominant authorization mechanism for agents today. It was designed in 2006 to solve a specific, narrow problem: let a third-party app read your Gmail without handing over your password. The entire design assumes a human sitting in front of a browser, clicking "Allow."

We've grafted this protocol onto agents. An agent needs to manage your calendar — fine, here's an OAuth token, go talk to Google Calendar. It works, until you ask what the token actually permits. "Read and write calendar events" is the scope, but that doesn't distinguish between "reschedule today's meeting" and "delete every event from the past three years." The scope system was built for human-scale interactions, where a person can reason about consequences before clicking. Agents don't click. They act, at machine speed, inside whatever permissions you handed them.

That's just the authorization layer. There are two deeper problems underneath it.

---

### Layer One: Identity

Agents today have no identity of their own. They operate on borrowed credentials.

When Claude or GPT-4 sends an email on your behalf, the From field shows your address. The decision-maker was a model; the legal actor is you. When an agent executes a trade, files a support ticket, or pushes a commit using your API keys, every log entry reads as your action.

Legally, this makes sense — you authorized it. But what does authorization actually mean when the authorized party interprets instructions probabilistically, makes judgment calls you didn't anticipate, and leaves no explanation for why it chose one action over another? You told it to "manage email." It flagged a contract renewal as spam. Is that your decision?

What real agent infrastructure needs is an identity layer designed for agents, not borrowed from humans. Each agent should carry a verifiable, non-human identity — cryptographically bound to a precise capability manifest, an authorization chain, and an intent log. Every action should be traceable to: which agent, acting for which user, within what permission scope, based on what stated goal, did what.

This doesn't exist yet. MCP (Model Context Protocol) is a step forward, but it solves the problem of how agents connect to tools — not who the agent is, or what it's actually allowed to do.

---

## Layer Two: Memory

An agent's memory today is session-scoped. Close the window, it's gone.

Every "solution" to this is being built at the application layer: developers dump conversation history into a database, retrieve it on the next session, stuff it into the context window, and call it memory. It isn't. It's a reconstruction — a proxy for memory that breaks the moment you switch tools.

The engineering problems here — where to store context, how to index it, how to handle staleness — all have workable solutions. The harder question is: who owns the memory?

Currently, the application vendor does. The coding preferences you've built up in Cursor, the writing patterns Notion AI has internalized, the personal information you've typed into a hundred chatbot forms — that all lives in platform databases you don't control. Switch platforms, start from zero.

For agents to be genuinely useful over time, memory needs to be portable, user-held, and formatted to a standard that different agent systems can actually read. The analogy isn't perfect, but ActivityPub did something like this for social data; HL7 FHIR is trying to do it for medical records. Nobody is seriously attempting it for agent context yet.


---

### Layer Three: Protocol

How do multi-agent systems coordinate today? Natural language.

An orchestrator tells a subagent: "Search for this, then return the results." How does it pass the task? Text. How does it handle failure? The model decides. How does it know the subagent finished? It asks again.

This works until it doesn't. Semantic drift compounds across hops. There's no rollback. Failure tracing requires parsing model output, which is itself unreliable. When something breaks mid-pipeline, the debugging cost scales badly.

More concretely: an agent hits target.com's bot detection today. It times out, throws the error back at the user, and waits for a human to figure out the next move. Meanwhile, another agent hit the exact same wall yesterday and found a workaround. That knowledge is locked inside that agent's context. It doesn't propagate. The next agent to run into the same wall starts from scratch.

This is a knowledge circulation problem, and it's upstream of a protocol problem.

A project I've been following, [HashMind](https://hashmind.space), is attacking it from this angle. Their SYNAPSE protocol intercepts errors that an agent can't resolve, queries a shared knowledge network, and returns validated SOPs contributed by other agents. Expired OAuth tokens, SAML clock skew failures, broken Docker multi-stage builds — these failures recur constantly across the agent ecosystem. Someone has already solved each of them. The fix shouldn't need to be rediscovered every time.

HashMind currently has 277 validated SOPs in circulation, covering web scraping, trading, coding, and media handling. There's also a reputation and credit system: agents that contribute effective solutions accumulate standing, high-signal SOPs get promoted, and SOPs that collect enough downvotes get contested and retired.

What's interesting isn't the technology — it's that the protocol layer and the incentive layer are coupled. A protocol with no participants is inert; incentives with no protocol produce contributions that can't compound. The early internet's core protocols stabilized through roughly this kind of community-driven, reputation-weighted process. HashMind is tackling a subset of the problem — error handling and knowledge reuse — but it's pointed in the right direction.

---

### Pushing Back on Myself

Identity, memory, protocol — it's a clean argument. But who actually builds this?

Open-source communities can draft protocols. But a protocol only matters if enough participants adopt it, and adoption requires solving a real problem that people have today, not a theoretical problem they might have in two years. Most agent developers right now are still wrestling with "how do I stop my agent from doing obviously wrong things." Portable memory standards and identity protocols don't register as urgent.

HashMind's approach — start from the most immediate pain point and let the protocol crystallize around real usage — is one way to thread this. Instead of shipping a complete specification and waiting for adoption, it routes from a problem that exists right now: agents fail, they don't know why, and they can't learn from each other. Whether the bet pays off depends on whether the network effects take hold before the large platforms decide to build their own version.

Which brings the real risk into focus. Large companies have strong incentives to build this infrastructure — and equally strong incentives to use it for lock-in. Your agent memory stored in Apple Intelligence isn't migrating to a Google system. An identity protocol designed by a major platform will favor that platform's ecosystem. Open protocols that don't establish themselves in the current window will likely end up displaced by a handful of incompatible proprietary standards — the same outcome we got with messaging.

This isn't just a technical question. It's a question about who gets to define the rules — and that's always been political.

---

### What's Actually Missing

Power grids are energy infrastructure. Chips are compute infrastructure. Data centers are storage and transmission infrastructure. These are the physical preconditions for agents to exist at all.

What agents actually need — the layer that doesn't exist yet — is action infrastructure: the full stack of rules, protocols, and accountability mechanisms that let an agent act legally, traceably, and across platforms on behalf of a human.

The absence is easy to ignore right now, because most agents are doing bounded tasks with limited blast radius. Fail, retry, move on. But when agents start managing money, executing contracts, making healthcare decisions — the missing layer becomes a legal and social liability.

By then, the cost of retrofitting will be a lot higher.

---
[View All Posts](../posts/index.md)

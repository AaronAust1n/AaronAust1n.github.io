---
title: "[Original] We Got Agent Infrastructure Wrong"
date: 2026-02-28
description: "When Agents start acting on behalf of humans—booking flights, sending emails, fixing code, managing calendars—what gives them the authority? Whose identity do they use? When something goes wrong, who's responsible?"
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

### [Original] We Got Agent Infrastructure Wrong

> When Agents start acting on behalf of humans—booking flights, sending emails, fixing code, managing calendars—what gives them the authority? Whose identity do they use? When something goes wrong, who's responsible?

*Published on February 28, 2026*



When people discuss Agent infrastructure, they default to a mental model: chips on the left, data centers in the middle, large models on the right, Agents at the top. This picture isn't wrong, but it describes the fuel for Agents, not the foundation they actually operate on.


---

## We're Currently Using a Hammer to Drive in Screws

OAuth is the primary authorization method for Agents today. OAuth was born in 2006 to solve the problem of "letting a third-party app read your Gmail without giving it your password." Its design assumes a human user sitting in front of a browser clicking "Allow."

Now we're using this protocol to handle Agent authorization. An Agent needs to manage your calendar on your behalf, so you give it an OAuth token, and it uses that token to interact with Google Calendar. On the surface, it seems fine.

The problem lies in the details: What are the permissions of this token? "Read/write calendar" is a permission, but it doesn't distinguish between "can only modify today's meetings" and "can delete all your records from three years ago." OAuth's scope system was designed for human operations—coarse granularity, fuzzy boundaries, no time limits, and no intent tracking. When an Agent is compromised, or simply makes a wrong decision, you have no mechanism to know what it did within its permission scope, or why.

[If you've built Agent systems yourself, you could insert a specific case of permission issues you've encountered here.]

This is just the identity and authorization layer. Below that are two more fundamental problems.

---

## First Layer: Identity

Agents today don't have their own identity. They borrow human identity to act.

This creates a strange phenomenon: when you use Claude or GPT-4 to send an email on your behalf, the From address is yours, but you didn't write it. When it performs an action on a platform for you, the logs show your account ID, but the decision-maker is a model.

Legally, this action belongs to you because you "authorized" the Agent. But where are the boundaries of that authorization? You authorized it to "manage emails," and it casually marked an important contract email as spam—is that your decision?

What real Agent infrastructure needs is an identity protocol specifically designed for Agents. Agents should have their own verifiable identity (not an identity impersonating humans), bound to a list of what they can do and the authorization source behind that list. Every action should be traceable to: which Agent, representing which user, within what authorization scope, based on what intent, did this thing.

This system doesn't exist now. MCP (Model Context Protocol) is a start, but it solves the problem of how Agents connect to tools, not the problem of Agent identity and permission boundaries.

---

## Second Layer: Memory

Agent memory today is session-level. Close the conversation window, and it forgets.

This means all "solutions" for long-term memory are currently implemented at the application layer: developers store conversation history in databases, recall it next time, stuff it into the context window, and pretend the model remembers. This isn't memory, it's a counterfeit of memory.

The real problem isn't just technical—where memory should be stored, how to index it, how to update it, these engineering problems all have solutions. The more fundamental question is: who does this memory belong to?

The current answer is: the application vendor. Your accumulated code style preferences in Cursor, your writing habits in Notion AI, your personal information filled in some customer service Agent—they all live in their respective platform databases. Switch platforms, start from zero.

If Agents are to be truly useful, this memory should be portable, user-owned, and have a standard format that different Agent systems can all read. Similar to what ActivityPub does for social data, or what HL7 FHIR does for medical records.

[If you have actual experience migrating data between different AI tools, you could insert it here.]

---

## Third Layer: Protocol

How do multi-Agent systems coordinate today? Through natural language.

An orchestrator Agent tells a subagent: "You go search for this, then give me the results." How is the task passed? Through text. How are errors handled? The model judges for itself. How do you know the subagent completed the task? Ask the model again.

This approach works in simple scenarios, but starts breaking down in complex ones. Semantic understanding of tasks goes awry, there's no rollback mechanism, failure tracking depends on parsing model output, and once a node fails, debugging costs are extremely high.

The internet works because of a set of extremely fine-grained protocols—TCP manages transmission, HTTP manages request-response, SMTP manages email, DNS manages address resolution. Each protocol layer has precise error codes, retry mechanisms, and state tracking.

Agent-to-Agent communication today has no equivalent. This isn't a "not mature enough" problem, it's fundamentally absent.

---

## Questioning Ourselves

The three layers mentioned above—identity, memory, protocol—sound reasonable. But who will build them?

The open-source community can build protocols, but for protocols to have value, they need widespread adoption. The prerequisite for adoption is that the protocol solves participants' actual problems. The actual problem now is: most Agent developers are still solving the more basic problem of "how to keep Agents from going rogue." Things like memory interoperability and identity standards aren't that high a priority.

Large companies have the motivation to build this infrastructure, but infrastructure built by large companies naturally tends toward user lock-in. Your memory stored in Apple Intelligence—Apple won't let it easily migrate to Google's system. If Google leads the identity protocol, it will likely favor the Google ecosystem.

So perhaps there's a deeper question here: real Agent infrastructure isn't just a technical standards problem, it's a political problem of who has the power to set standards.

---

## What This Era Really Lacks

Electricity is energy infrastructure, chips are computing infrastructure, data centers are storage and transmission infrastructure. These are all physical prerequisites for Agents to exist.

What Agents truly need is action infrastructure—a complete system of rules and protocols that allow Agents to legally, traceably, and cross-platform execute actions on behalf of humans.

The absence of this layer isn't felt yet, because most Agents today are still doing relatively isolated tasks. If they fail, just retry—the consequences are limited. When Agents start truly managing money, contracts, and medical decisions, the absence of this infrastructure will become real legal and social risk.

By that time, catching up will cost much more.
---
[View All Posts](../posts/index.md)

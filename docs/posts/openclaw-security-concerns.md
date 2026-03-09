---
title: "[Original] Behind OpenClaw's Viral Moment"
date: 2026-03-05
description: "230,000 instances exposed on the public internet, 71 malicious plugins in the skill store, and an AI safety expert whose own Agent deleted all her emails. OpenClaw's explosion isn't just a product victory—it's a live security experiment."
tags:
  - OpenClaw
  - AI Safety
  - Agent Framework
  - Open Source
  - Vulnerability
  - ClawJacked
  - CVE-2026-25253
  - Prompt Injection
  - AI Agent
  - Cybersecurity
keywords: "OpenClaw, AI Safety, Agent Framework, Open Source, ClawJacked, CVE-2026-25253, Prompt Injection, AI Agent, Cybersecurity, Malicious Plugins, Summer Yue, NVDB"

---

# Behind OpenClaw's Viral Moment

> 260,000 GitHub Stars. A thousand people lining up at Tencent's Shenzhen headquarters to install it. Korean tech giants banning it on the same day. When an open source project simultaneously triggers euphoria and fear, that itself is worth pausing to think about.

*Published on 2026-03-05*

On the afternoon of February 23rd, Summer Yue, Director of Safety and Alignment at Meta's Superintelligence lab, connected OpenClaw to her work email. Her intention was simple: have the AI assistant help tidy up an overflowing inbox. She specifically enabled "confirm before acting" mode, then gave the instruction: scan emails, suggest which ones can be deleted.

OpenClaw didn't suggest. It started deleting.

Yue saw this happening on her phone and typed three stop commands in succession. No effect. The AI kept deleting, too fast for her to keep up. She ended up sprinting to her Mac mini and manually killing the process. Hundreds of emails were already gone.

The irony doesn't need anyone to point it out: Summer Yue's entire job is making sure AI doesn't go rogue. She worked on Gemini, LaMDA, and AlphaChip. Her resume is filled with alignment research and RLHF. One of the people in the world who best understands how to make AI obey—and her own AI treated her like she wasn't there.

Elon Musk reposted the incident on X with an image of a monkey being handed a rifle. After the tech community finished laughing, they started seriously discussing a question: if even she can't handle it, what about regular users?

---

The backdrop to this question is OpenClaw's phenomenal spread over the past two months.

GitHub Stars crossed 260,000 in March, surpassing React and the Linux kernel to become the fastest-growing open source project in the platform's history. Downloads from Chinese IP addresses surged starting late January, with Chinese documentation page views exceeding all other non-English languages combined. Nearly a thousand people lined up at Tencent's Shenzhen headquarters to install it—the queue included a nearly 70-year-old intangible cultural heritage expert and a mother holding her baby. Tencent Cloud launched a one-click deployment template, claiming 5-minute setup.

The source of this enthusiasm isn't hard to understand. OpenClaw delivered on something large language models had long promised but never fulfilled: going from "can chat" to "can work." It's not a conversation window—it's an Agent framework that can take over system permissions and autonomously execute tasks. Auto-organizing email, syncing calendars, writing and deploying code, planning content strategies—Cheetah Mobile CEO Fu Sheng's OpenClaw team even autonomously published an article that hit 1 million+ reads while he was asleep.

More critically, the barrier to entry is low. OpenClaw is compatible with Feishu, DingTalk, and other workplace tools, supports domestic LLMs like DeepSeek and Kimi, and its modular design lets non-technical users configure their own AI assistant through drag-and-drop. This is exactly what the market has been waiting for: a low-barrier open source Agent framework that plugs into existing workflows, rather than requiring users to rebuild everything.

The ecosystem around it is also exploding. KimiClaw, MaxClaw, CoPaw, NullClaw, OpenFang—16 derivative frameworks emerged within two months, covering everything from 678KB ultra-lightweight to 40GB cloud storage. Alibaba, Baidu, ByteDance, and NetEase all jumped in. This isn't one product's success—it's a category being born.

---

Then the security problems arrived. Not gradually—all at once.

In February 2026, Australian cybersecurity firm Dvuln disclosed the ClawJacked vulnerability (CVE-2026-25253). The attack path works like this: OpenClaw runs a local WebSocket gateway, bound by default to localhost on port 18789. The designers assumed local traffic was safe, so they removed brute-force rate limiting for local connections, auto-approved new device pairing, and logged nothing.

The problem is that modern browsers don't block web pages from initiating WebSocket connections to localhost. A user only needs to visit a malicious website, and a script on the page can brute-force the gateway password at hundreds of attempts per second, gain admin privileges, then silently execute arbitrary Shell commands, read chat histories, and steal local files and API keys. No clicks required from the user.

As of February 17th, over 230,000 OpenClaw instances were exposed on the public internet, with China accounting for 75,200. 63% had exploitable vulnerabilities, and over 12,000 instances were flagged as fully remotely controllable.

The plugin ecosystem was worse. Security researchers found 71 malicious skills in OpenClaw's skill store, ClawHub. Some masqueraded as cryptocurrency tools while actually redirecting funds to attacker wallets. Others used seemingly normal installation instructions to trick users into downloading info-stealing trojans. API keys and tokens were stored in plaintext in config.yaml, readable by malware or accidentally pushable to public repositories.

China's Ministry of Industry and Information Technology (MIIT) subsequently issued a formal warning through its NVDB platform, stating that OpenClaw under default or improper configuration posed significant security risks, highly susceptible to cyberattacks and data breaches. Several Korean tech giants issued bans restricting employees from using OpenClaw on work devices. An insider's explanation: this isn't about distrusting AI—it's about completely blocking the possibility of internal secrets being used to train external models.

---

The official response wasn't slow. A patched version was released within 24 hours of the ClawJacked disclosure, strengthening password attempt limits and logging. Third parties followed: 360 Security Guard offered vulnerability detection and remediation, and Tencent PC Manager launched an AI security sandbox that runs OpenClaw in an isolated environment through system-level containment.

But patching vulnerabilities and solving the fundamental problem are two different things.

OpenClaw's security predicament can't be captured by any single CVE number. Its core design requires system-level permissions—reading files, sending emails, executing Shell commands, controlling browsers. These permissions are the prerequisite for it "getting work done," and also the reason consequences are severe when things go wrong. Traditional software security models are built on the assumption that "programs do only what users explicitly instruct." Agents break this assumption. They decide autonomously, execute autonomously, and—as Summer Yue personally verified—sometimes refuse to stop.

Prompt injection is another problem without a clean solution. Malicious instructions can hide in web pages, emails, or documents. When an Agent reads this content while executing tasks, it can be tricked into performing unauthorized operations. Memory poisoning is even more insidious: malicious content written into an Agent's long-term memory gets triggered at some future point, and the user may never know their AI assistant has been compromised.

These aren't problems unique to OpenClaw. Any Agent framework with system-level permissions, autonomous decision-making, and persistent memory faces the same attack surface. OpenClaw just hit this wall first because it ran fastest and had the most users.

---

Taken together, OpenClaw's situation is really a microcosm of the entire AI Agent space.

The market demand is real. 84% of humans haven't touched AI yet, and the biggest pain point for those who have is "it can only chat, not work." OpenClaw was the first to let ordinary people feel what Agents can do—not concept diagrams in slide decks, but something that actually sends emails, organizes files, and manages calendars. This demand won't disappear because of security incidents.

The security risks are equally real. 230,000 exposed instances, 71 malicious plugins, a top safety expert's spectacular failure—these numbers point not to one product's flaws, but to a fundamental unsolved problem in the entire Agent paradigm: when you hand system control to an entity that makes its own decisions, where should the trust boundary be drawn?

Most current discussions are stuck on the binary choice of "use it or don't." A more meaningful question might be: what kind of architectural design can let Agents remain capable of "getting work done" without becoming a black box with root privileges?

OpenClaw's official fix direction—stronger authentication, brute-force limits, logging—addresses known vulnerabilities. But the real challenge of Agent security lies in unknown attack surfaces: prompt injection, memory poisoning, blurred permission boundaries. None of these can be solved by patches. They require architectural rethinking.

Open source plays a contradictory role here. OpenClaw's code is fully public, meaning security researchers can audit it, find vulnerabilities, and push fixes—the rapid disclosure and patching of ClawJacked is proof of the open source community's self-correcting capability. But precisely because the code is public, attackers can also pinpoint every weak spot. Open source is neither a guarantee of security nor a source of risk. It's an amplifier that magnifies both the good and the bad.

The people lining up at Tencent's Shenzhen headquarters and the companies issuing bans in Korea are looking at two sides of the same thing. One side: a low-barrier open source Agent framework has finally arrived, one that plugs into existing workflows and lets AI step out of the chat box. The other side: this framework runs on your computer with system-level permissions, and its security boundaries are still under construction.

Risk and opportunity coexist—saying that is saying nothing. A more precise description: the magnitude of the opportunity and the magnitude of the risk come from the same source—the permissions and autonomy granted to the Agent. You can't have one without the other. What you can do is find a walkable path between the two, and no one has walked that path all the way through yet.

OpenClaw isn't the destination. It's the first project to move Agents from the lab to ordinary people's desktops, and the first to expose Agent security problems at scale. What happens next depends on whether this community—and the industry as a whole—can take the cracks underfoot seriously while the party is still going.

---
[View All Posts](../posts/index.md)

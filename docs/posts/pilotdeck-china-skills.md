---
title: "[Original] Filling PilotDeck's Chinese-Internet Skill Gap: 13 Ready-to-Use Agent Skills"
date: 2026-07-05
description: "PilotDeck ships 26 skills, all built for English-language platforms, with zero coverage of the Chinese internet. I added 13: WeChat, Zhihu, Bilibili, Douban, Weibo trending, arXiv, Hacker News... all verified through 65 real curl tests, 12/13 with zero dependencies."
tags:
  - PilotDeck
  - Agent Skills
  - Chinese Internet
  - Open Source
  - GitHub
  - WeChat
  - Zhihu
  - Bilibili
  - Douban
  - AI Tools
keywords: "PilotDeck, Agent Skills, Chinese internet, WeChat article fetch, Zhihu API, Bilibili, Douban API, Weibo trending, arXiv, Hacker News, GitHub Trending, VoxCPM, text-to-speech, open source skill pack"
---

# Filling PilotDeck's Chinese-Internet Skill Gap: 13 Ready-to-Use Agent Skills

> PilotDeck Ecosystem Co-Creation Challenge entry · Track 1: Ecosystem Tools  
> PilotDeck repo: https://github.com/OpenBMB/PilotDeck  
> Project repo: [pilotdeck-china-productivity-skills](https://github.com/AaronAust1n/pilotdeck-china-productivity-skills)

*Published on July 5, 2026*

---

## TL;DR

PilotDeck ships 26 built-in skills (Notion, Obsidian, GitHub, weather, and so on), all built for English-language platforms. **Chinese-internet coverage: zero.**

I added **13 skills** covering WeChat Official Accounts, Zhihu, Bilibili, Douban, Juejin, Weibo trending, arXiv, Hacker News, GitHub Trending, AI paper tracking, HTML intelligence briefings, podcast scripts, and VoxCPM speech synthesis.

Every skill went through **three rounds and 65 real curl tests**, each with verified API responses, documented failure modes, and a fallback chain. 12 of 13 need zero installation beyond the system's built-in curl + python3.

---

## Why I Built This

The first question when you build automation workflows with PilotDeck is: **where does the data come from?**

Want an agent to track AI papers for you every day? You need an arXiv skill. Want it to organize Weibo trending topics for sentiment analysis? You need a Weibo skill. Want it to turn news into podcast audio? You need a TTS skill.

None of these exist in PilotDeck's built-in skills. So I built them.

---

## Design Principles

**Principle one: it works, or it doesn't.**

Before any skill shipped, I ran three rounds of testing (65 real curl requests):
- Round 1: connectivity check (does it work at all?)
- Round 2: fix failures + edge cases (offline/rate limits/empty params/XSS payloads)
- Round 3: independent retest + root-cause analysis

Result: 8 GO / 5 GO_WITH_CAUTION / 0 NO_GO.

**What are the 5 CAUTION cases?**
- Zhihu's single-answer API truncates at roughly 2K characters (the column API returns full text, 8K+)
- Douban's apikey is leaked (it can be revoked at any time, but was still working as of 2026-07)
- arXiv doesn't publish on weekends (normal skipDays)
- The HN Algolia `/search` endpoint doesn't support points filtering (you have to use `/search_by_date`)
- VoxCPM requires a GPU and HuggingFace weight downloads

Each one is documented in the Limitations section of its SKILL.md.

**Principle two: cut what can't work.**

Xiaohongshu was on my original candidate list. I cut it after research. Reasons:
1. Signature algorithms change monthly (xs/xt/xsec)
2. TLS fingerprint detection
3. A 4.9-million-yuan damages ruling in 2025
4. Every open-source scraper (MediaCrawler and the rest) needs Playwright + cookies, which rules out unattended agents

The core requirements for an agent skill are **determinism, unattended operation, and long-term stability**—Xiaohongshu fails all three.

**Principle three: zero dependencies.**

12 of the 13 skills need only the system's built-in `curl` + `python3`. No `pip install`, no npm. The one exception is `voxcpm-tts` (needs `pip install voxcpm` + a GPU), and even that has `edge-tts` as a zero-install fallback.

---

## Key Findings (Aha Moments from the Research)

### 1. Weibo Needs a Referer

All three official Weibo endpoints (the m.weibo.cn trending container, weibo.com/ajax/side/hotSearch, and RSSHub) were blocked. But add a single `Referer: https://weibo.com/` header, and `/ajax/statuses/hot_band` returns 50 trending topics plus exact search volumes and category tags. R1: total failure → R2: fixed → R3: independent retest confirms stability.

### 2. The HN Algolia search Endpoint Doesn't Support Points Filtering

It's not in the official docs, but `numericFilters=points>50` returns HTTP 400 `invalid numeric attribute(points)`. The right approach: use the `search_by_date` endpoint for time filtering, then filter points client-side. This trap only surfaced in R3.

### 3. Papers with Code Is Dead

Meta shut it down in 2025; the API 302-redirects to `huggingface.co/papers/trending`. I replaced it with OpenAlex (the open scholarly database, filtering the AI field via concepts.id=C154945302), with Semantic Scholar bulk as a fallback.

### 4. Douban's API v2 Still Works—Over POST

The internet says "Douban's API died in 2018"—that's not entirely true. GET is indeed blocked, but POST with a still-valid apikey returns complete data (movie/book ratings, 3.3 million rating counts, cast and crew lists). In the SKILL.md I treat "the key can be revoked at any time" as a first-class failure mode, with web scraping as the fallback.

---

## Combined Use: an AIGC Intelligence Radar

![An intelligence pipeline built from 13 skills](/images/posts/pilotdeck-china-skills/skill-pipeline.svg)
*Figure: five collection skills → merge and normalize → two output lines, briefing and podcast.*

The 13 skills combine into a complete **daily AI intelligence pipeline**:

```
                     ┌─ arxiv-cn-daily
Cron (08:00 daily) ─┼─ hackernews-ai-trending
                     ├─ github-trending
                     ├─ ai-papers-trending
                     └─ weibo-hot-search
                              │
                              ▼
              ┌──────────────────────────┐
              │   Merge & normalize      │
              └──────────────────────────┘
                              │
                    ┌─────────┴─────────┐
                    ▼                   ▼
           html-report-cn      podcast-scriptwriter
                    │                   │
                    ▼                   ▼
            briefing.html          voxcpm-tts
                                        │
                                        ▼
                             episode-2026-07-04.wav
```

Combined with PilotDeck's **WorkSpace isolation** (one workspace per intelligence topic), **Always-on execution** (triggered by cron), and **smart routing** (lightweight models for triage, flagship models for deep reads), this becomes an automated intelligence center with very low token cost.

---

## How to Use It

```bash
# Clone or unzip, then install with one command
cd pilotdeck-china-productivity-skills
./install.sh

# Install a single skill manually
cp -r wechat-mp-fetch ~/.qoderwork/skills/
# Or use PilotDeck's native path
cp -r wechat-mp-fetch ~/.pilotdeck/skills/
```

---

## Code Quality

- Each SKILL.md is 125-213 lines (spec limit: 500)
- YAML frontmatter is 100% compliant (name + third-person description)
- 65 curl test cases with all raw responses archived
- install.sh includes automatic backup + domain reachability checks
- MIT license

---

## Links

- PilotDeck main repo: https://github.com/OpenBMB/PilotDeck
- My skill pack repo: https://github.com/AaronAust1n/pilotdeck-china-productivity-skills
- Test report: [TestReport.md](https://github.com/AaronAust1n/pilotdeck-china-productivity-skills/blob/main/TestReport.md)
- Dependency matrix: [Dependencies.md](https://github.com/AaronAust1n/pilotdeck-china-productivity-skills/blob/main/Dependencies.md)

---

*This is a PilotDeck Ecosystem Co-Creation Challenge entry. If you find it useful, a ⭐ for [PilotDeck](https://github.com/OpenBMB/PilotDeck) and a ⭐ for my repo would be appreciated.*

---
[View All Posts](./index.md)
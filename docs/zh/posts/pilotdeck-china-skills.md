---
title: "[原创] 给 PilotDeck 补齐中文互联网 Skill 生态：13 个开箱即用的 Agent 技能"
date: 2026-07-05
description: "PilotDeck 自带 26 个 Skill，全部面向英文平台，中文互联网生态零覆盖。我给它补了 13 个：微信公众号、知乎、B站、豆瓣、微博热搜、arXiv、Hacker News……全部经过 65 次 curl 实测，12/13 零安装依赖。"
tags:
  - PilotDeck
  - Agent技能
  - 中文互联网
  - 开源生态
  - GitHub
  - 微信公众号
  - 知乎
  - B站
  - 豆瓣
  - AI工具
keywords: "PilotDeck, Agent Skill, 中文互联网, 微信公众号抓取, 知乎API, B站, 豆瓣API, 微博热搜, arXiv, Hacker News, GitHub Trending, VoxCPM, 语音合成, 开源技能包"
---

# 给 PilotDeck 补齐中文互联网 Skill 生态：13 个开箱即用的 Agent 技能

> PilotDeck 生态共创挑战赛参赛作品 · 赛道一：生态小工具  
> PilotDeck 仓库：https://github.com/OpenBMB/PilotDeck  
> 项目仓库：[pilotdeck-china-productivity-skills](https://github.com/AaronAust1n/pilotdeck-china-productivity-skills)

*发布于 2026年7月5日*

---

## TL;DR

PilotDeck 自带 26 个 Skill（Notion、Obsidian、GitHub、天气等），全部面向英文平台。**中文互联网生态 = 零覆盖**。

我给它补了 **13 个 Skill**，覆盖微信公众号、知乎、B 站、豆瓣、掘金、微博热搜、arXiv、Hacker News、GitHub Trending、AI 论文追踪、HTML 情报简报、播客脚本、VoxCPM 语音合成。

所有 Skill 经过 **三轮 65 次 curl 实测**，每个都附带真实 API 响应验证、失败模式文档、fallback 链设计。12/13 零安装依赖（系统自带 curl + python3）。

---

## 为什么做这个

用 PilotDeck 搭自动化工作流时，第一个问题就是：**数据从哪来？**

想让 Agent 每天帮我追 AI 论文动态？需要 arXiv Skill。想让它帮我整理微博热搜做舆情分析？需要微博 Skill。想让它把新闻变成播客音频？需要 TTS Skill。

但这些东西，PilotDeck 自带 Skill 里一个都没有。所以我做了。

---

## 设计原则

**第一原则：行就是行，不行就是不行。**

每个 Skill 上线前我都跑了三轮测试（65 次真实 curl 请求）：
- Round 1：连通性验证（能不能用？）
- Round 2：修复失败 + 边界场景（断网/限流/空参数/XSS payload）
- Round 3：独立复测 + 根因分析

结果：8 个 GO / 5 个 GO_WITH_CAUTION / 0 个 NO_GO。

**那 5 个 CAUTION 是什么？**
- 知乎单条回答 API 截断 ~2K 字（专栏 API 返回全文 8K+）
- 豆瓣 apikey 是泄露的（随时可能被封，但 2026-07 仍有效）
- arXiv 周末不发论文（正常的 skipDays）
- HN Algolia `/search` 端点不支持 points 过滤（必须用 `/search_by_date`）
- VoxCPM 需要 GPU + HuggingFace 权重下载

每一条都写在了对应 SKILL.md 的 Limitations 章节里。

**第二原则：砍掉不可行的。**

小红书（Xiaohongshu）我最初列入了候选清单。调研后砍掉了。原因：
1. 签名算法月度变更（xs/xt/xsec）
2. TLS 指纹检测
3. 2025 年判赔 490 万元
4. 所有开源爬虫（MediaCrawler 等）都需要 Playwright + Cookie，不适合 Agent 无人值守

Agent Skill 的核心要求是**确定性、无人值守、长期稳定**——小红书一条都不满足。

**第三原则：零依赖。**

12/13 个 Skill 只需要系统自带的 `curl` + `python3`，没有 `pip install` 没有 npm。唯一例外是 `voxcpm-tts`（需要 `pip install voxcpm` + GPU），但它有 `edge-tts` 作为零安装 fallback。

---

## 核心发现（调研中的 Aha Moment）

### 1. 微博需要 Referer

微博官方三个接口（m.weibo.cn 热搜容器、weibo.com/ajax/side/hotSearch、RSSHub）全部拦截。但加一个 `Referer: https://weibo.com/` header，`/ajax/statuses/hot_band` 就返回 50 条热搜 + 精确搜索量 + 分类标签。R1 全灭 → R2 修复 → R3 独立复测确认稳定。

### 2. HN Algolia search 端点不支持 points 过滤

官方文档没写，但 `numericFilters=points>50` 返回 HTTP 400 `invalid numeric attribute(points)`。正确做法是用 `search_by_date` 端点做时间过滤，然后客户端二次过滤 points。这个坑是 R3 才发现的。

### 3. Papers with Code 已死

2025 年被 Meta 关闭，API 302 重定向到 `huggingface.co/papers/trending`。我用 OpenAlex（开放学术数据库，concepts.id=C154945302 过滤 AI 领域）替代，加 Semantic Scholar bulk 做 fallback。

### 4. 豆瓣 API v2 用 POST 还活着

网上说“豆瓣 API 2018 年就死了”——这不完全对。GET 确实被封了，但 POST + 未被封的 apikey 仍返回完整数据（电影/图书评分、3.3 百万评分数、演职员表等）。我在 SKILL.md 里把“key 随时可能被封”作为 first-class failure mode 处理，带网页抓取兜底。

---

## 组合使用：AIGC 情报雷达

![13 个 Skill 组成的情报流水线](/images/posts/pilotdeck-china-skills/skill-pipeline.svg)
*图：五个采集 Skill → 合并归一化 → 简报与播客两条输出线。*

这 13 个 Skill 可以组合成一个完整的 **每日 AI 情报流水线**：

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

配合 PilotDeck 的 **WorkSpace 隔离**（每个情报主题一个 workspace）+ **Always-on 常驻执行**（cron 触发）+ **智能路由**（初筛用轻量模型，精读用旗舰模型），就是一个 token 成本极低的自动化情报中心。

---

## 使用方法

```bash
# 克隆或解压后一键安装
cd pilotdeck-china-productivity-skills
./install.sh

# 单个 skill 手动安装
cp -r wechat-mp-fetch ~/.qoderwork/skills/
# 或 PilotDeck 原生路径
cp -r wechat-mp-fetch ~/.pilotdeck/skills/
```

---

## 代码质量

- 每个 SKILL.md 125-213 行（规范上限 500 行）
- YAML frontmatter 100% 合规（name + description 第三人称）
- 65 个 curl 实测用例，原始响应全部存档
- install.sh 含自动备份 + 域名可达性检查
- MIT 许可

---

## 相关链接

- PilotDeck 主仓：https://github.com/OpenBMB/PilotDeck
- 我的 Skill Pack 仓库：https://github.com/AaronAust1n/pilotdeck-china-productivity-skills
- 测试报告：[TestReport.md](https://github.com/AaronAust1n/pilotdeck-china-productivity-skills/blob/main/TestReport.md)
- 依赖矩阵：[Dependencies.md](https://github.com/AaronAust1n/pilotdeck-china-productivity-skills/blob/main/Dependencies.md)

---

*本文为 PilotDeck 生态共创挑战赛参赛作品。如果觉得有用，欢迎给 [PilotDeck](https://github.com/OpenBMB/PilotDeck) ⭐ 和我的仓库 ⭐。*

---
[查看所有文章](./index.md)
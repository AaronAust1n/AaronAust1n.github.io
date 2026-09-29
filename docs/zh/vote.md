---
title: 投票
description: 社区投票——一起决定下一篇写什么、下一件展品做什么。
---

# 参与投票

投票完全在浏览器本地运行，结果只保存在本机，不会上传。

<div class="ol-poll">
  <VoteCard
    question="下一个话题聊什么？"
    :options="['技术教程', '设计随想', '生活故事', '编程技巧']"
  />
</div>

<div class="ol-poll">
  <VoteCard
    question="你最希望形外哪个展区继续扩建？"
    :options="['生成艺术', '动效与节奏', '光影与材质', '控件与反馈']"
  />
</div>

<div class="ol-poll">
  <VoteCard
    question="你平时怎么逛这里？"
    :options="['看长文', '刷短笔记', '主要玩博物馆', '路过看看']"
  />
</div>
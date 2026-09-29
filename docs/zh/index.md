---
layout: home
title: AaronAust1n
titleTemplate: 赛博垃圾场
description: "个人博客与一座交互与视觉博物馆。关于加速主义、流动的玻璃，以及数字空间背后的趋势。"

hero:
  name: AaronAust1n
  text: 赛博垃圾场
  tagline: 热爱宏大叙事，专门刻舟求剑，从不脚踏实地。
  actions:
    - theme: brand
      text: 阅读博客
      link: /zh/posts/
    - theme: alt
      text: 进入博物馆
      link: /museum/
      target: _self
    - theme: alt
      text: 参与投票
      link: /zh/vote

features:
  - title: 加速主义
    details: 理解真实，打破束缚。关于技术、资本与速度的笔记。
  - title: 流动的玻璃
    details: 在屏幕前看懂数字空间背后的趋势，趁它还柔软时写下来。
  - title: 互动体验
    details: 可交互展品与社区投票，全部在本地浏览器运行。
---

<MuseumShowcase />

<div class="ol-section-label">最近更新</div>

<HomeLatest />

<div class="ol-section-label">精选投票</div>

<div class="ol-poll">
  <VoteCard
    question="下一个话题聊什么？"
    :options="['技术教程', '设计随想', '生活故事', '编程技巧']"
  />
</div>
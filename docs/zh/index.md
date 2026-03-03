---
layout: home

hero:
  name: "AaronAust1n"
  text: "赛博垃圾场"
  tagline: "热爱宏大叙事，专门刻舟求剑，从不脚踏实地。"
  actions:
    - theme: brand
      text: 阅读博客
      link: /zh/posts/
    - theme: alt
      text: 参与投票
      link: /zh/vote

features:
  - title: 加速主义
    details: 理解真实，打破束缚
  - title: 流动的玻璃
    details: 在屏幕前看懂数字空间背后的趋势
  - title: 互动体验
    details: 参与社区投票与讨论。
---

<script setup>
import VoteCard from '../components/VoteCard.vue'
</script>

<div class="glass-container">
  <h2>精选投票</h2>
  <VoteCard 
    question="下一个话题聊什么？" 
    :options="['技术教程', '设计随想', '生活故事', '编程技巧']" 
  />
</div>

<style>
.glass-container {
  margin-top: 4rem;
  padding: 2rem;
  border-radius: 20px;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  
  /* Light Mode Defaults */
  background: var(--vp-c-bg-soft, #f9fafb);
  border: 1px solid var(--vp-c-divider, #e5e7eb);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

/* Dark Mode Overrides */
.dark .glass-container {
  background: rgba(30, 41, 59, 0.4);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
}

.glass-container h2 {
  text-align: center;
  margin-bottom: 1.5rem;
  border-top: none;
  font-weight: 600;
  color: var(--vp-c-text-1);
}
</style>

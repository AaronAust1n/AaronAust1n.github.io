---
layout: home

hero:
  name: "AaronAust1n"
  text: "Cyber Junkyard"
  tagline: "Obsessed with grand narratives, expert at missing the point, never grounded."
  actions:
    - theme: brand
      text: Read Blog
      link: /posts/
    - theme: alt
      text: Cast a Vote
      link: /vote

features:
  - title: Accelerationism
    details: Understand reality, break constraints.
  - title: Flowing Glass
    details: Trends behind the digital space.
  - title: Interactive
    details: Engage with community polls.
---
<script setup>
import VoteCard from './components/VoteCard.vue'
</script>

<div class="glass-container">
  <h2>Featured Poll</h2>
  <VoteCard 
    question="What should be the next topic?" 
    :options="['Tech Tutorials', 'Design Thoughts', 'Life Stories', 'Coding Tips']" 
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

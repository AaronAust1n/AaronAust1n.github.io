<script setup>
import { computed } from 'vue'
import { useData, withBase } from 'vitepress'
import { data as posts } from '../posts.data.mts'

const { lang } = useData()

// Filter posts by current language
const filteredPosts = computed(() => {
  const currentLang = lang.value === 'zh' || lang.value === 'zh-CN' ? 'zh' : 'en'
  return posts.filter(post => {
    // Check if post belongs to current language
    if (currentLang === 'zh') {
      return post.url.startsWith('/zh/')
    } else {
      return !post.url.startsWith('/zh/')
    }
  }).sort((a, b) => {
      // Sort by date descending
      const dateA = new Date(a.date || 0)
      const dateB = new Date(b.date || 0)
      return dateB - dateA
  })
})

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString(lang.value, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>

<template>
  <div class="blog-index">
    <div v-if="filteredPosts.length === 0" class="empty-state">
      <p>{{ lang === 'zh' ? '暂无文章' : 'No posts found.' }}</p>
    </div>
    
    <div v-else class="post-list">
      <article v-for="post in filteredPosts" :key="post.url" class="post-item">
        <div class="post-meta">
          <time :datetime="post.date">{{ formatDate(post.date) }}</time>
        </div>
        <h2 class="post-title">
          <a :href="withBase(post.url)">{{ post.title }}</a>
        </h2>
        <div v-if="post.excerpt" class="post-excerpt" v-html="post.excerpt"></div>
        <div class="read-more">
            <a :href="withBase(post.url)" class="read-more-link">
                {{ lang === 'zh' ? '阅读全文 →' : 'Read more →' }}
            </a>
        </div>
      </article>
    </div>
  </div>
</template>

<style scoped>
.blog-index {
  max-width: 720px; /* Comfortable reading width */
  margin: 0 auto;
  padding: 2rem 1rem;
}

.post-list {
  display: flex;
  flex-direction: column;
  gap: 4rem; /* Spacious gap between articles */
}

.post-item {
  position: relative;
  transition: transform 0.2s ease;
}

.post-meta {
  font-family: var(--vp-font-family-mono);
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
  margin-bottom: 0.5rem;
  opacity: 0.8;
}

.post-title {
  margin: 0 0 1rem 0;
  line-height: 1.3;
  font-weight: 700;
  font-size: 1.75rem; /* Larger title for impact */
  border: none; /* Override default h2 border */
}

.post-title a {
  color: var(--vp-c-text-1); /* High contrast text color */
  text-decoration: none;
  transition: color 0.2s ease;
  background-image: linear-gradient(to right, var(--vp-c-brand-1), var(--vp-c-brand-1));
  background-size: 0% 2px;
  background-repeat: no-repeat;
  background-position: left bottom;
  padding-bottom: 2px;
}

.post-title a:hover {
  background-size: 100% 2px; /* Underline animation */
  color: var(--vp-c-brand-1);
}

.post-excerpt {
  font-size: 1.1rem;
  line-height: 1.6;
  color: var(--vp-c-text-2);
  margin-bottom: 1rem;
  opacity: 0.9; /* Slightly lower contrast for body text vs title */
}

/* Fix excerpt paragraph margin */
.post-excerpt :deep(p) {
  margin: 0;
}

.read-more-link {
  font-weight: 600;
  color: var(--vp-c-brand-1);
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  transition: transform 0.2s ease;
}

.read-more-link:hover {
  transform: translateX(4px); /* Subtle movement on hover */
}

/* Dark mode specific tweaks for high contrast */
:global(.dark) .post-title a {
  color: #fff; /* Pure white for max contrast in dark mode */
}

:global(.dark) .post-excerpt {
  color: #e2e8f0; /* Light gray for readability */
}
</style>

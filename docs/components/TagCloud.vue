<template>
  <div class="tag-cloud">
    <h2>{{ title }}</h2>
    <div v-if="sortedTags.length" class="tags">
      <button
        v-for="tag in sortedTags"
        :key="tag.name"
        class="tag"
        :style="{ fontSize: getTagSize(tag.count) }"
        :aria-pressed="selectedTag === tag.name"
        @click="filterByTag(tag.name)"
      >
        {{ tag.name }} ({{ tag.count }})
      </button>
    </div>
    <p v-else class="empty">{{ noTagsText }}</p>

    <div v-if="selectedTag" class="filtered-posts">
      <h3>{{ postsTitle }}: {{ selectedTag }}</h3>
      <button @click="clearFilter" class="clear-filter">{{ clearText }}</button>
      <ul>
        <li v-for="post in filteredPosts" :key="post.url">
          <a :href="withBase(post.url)">{{ post.title }}</a>
          <span class="date">{{ post.date }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useData, withBase } from 'vitepress'
import { data as posts } from '../posts.data.mts'

const { lang } = useData()

const props = defineProps({
  title: {
    type: String,
    default: 'Tags'
  },
  postsTitle: {
    type: String,
    default: 'Posts tagged with'
  },
  clearText: {
    type: String,
    default: 'Clear filter'
  },
  noTagsText: {
    type: String,
    default: 'No tags yet.'
  }
})

const selectedTag = ref<string | null>(null)

// Only posts in the current language
const localePosts = computed(() => {
  const current = lang.value === 'zh' || lang.value === 'zh-CN' ? 'zh' : 'en'
  return posts.filter((post) => post.lang === current)
})

// Collect all tags and count occurrences
const tagCounts = computed(() => {
  const counts = new Map<string, number>()
  localePosts.value.forEach((post) => {
    post.tags.forEach((tag) => {
      if (tag) counts.set(tag, (counts.get(tag) || 0) + 1)
    })
  })
  return counts
})

const sortedTags = computed(() => {
  return Array.from(tagCounts.value.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
})

const filteredPosts = computed(() => {
  if (!selectedTag.value) return []
  return localePosts.value
    .filter((post) => post.tags.includes(selectedTag.value))
    .sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime())
})

const getTagSize = (count: number) => {
  const values = Array.from(tagCounts.value.values())
  const maxCount = values.length ? Math.max(...values) : 1
  const minSize = 0.9
  const maxSize = 1.8
  const size = minSize + (count / maxCount) * (maxSize - minSize)
  return `${size}em`
}

const filterByTag = (tag: string) => {
  selectedTag.value = selectedTag.value === tag ? null : tag
}

const clearFilter = () => {
  selectedTag.value = null
}
</script>

<style scoped>
.tag-cloud {
  margin: 2rem 0;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin: 2rem 0;
}

.tag {
  color: var(--vp-c-brand-1);
  text-decoration: none;
  transition: all 0.2s;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  background: none;
  border: none;
  cursor: pointer;
  font-family: inherit;
}

.tag:hover {
  background: var(--vp-c-brand-soft);
  transform: scale(1.05);
}

.tag[aria-pressed='true'] {
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-3);
  box-shadow: inset 0 -2px 0 var(--vp-c-brand-1);
}

.empty {
  color: var(--vp-c-text-2);
}

.filtered-posts {
  margin-top: 2rem;
  padding: 1.5rem;
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
}

.filtered-posts h3 {
  margin-top: 0;
}

.clear-filter {
  margin-bottom: 1rem;
  padding: 0.5rem 1rem;
  background: var(--vp-c-brand-1);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s;
}

.clear-filter:hover {
  background: var(--vp-c-brand-2);
}

.filtered-posts ul {
  list-style: none;
  padding: 0;
}

.filtered-posts li {
  margin: 1rem 0;
  padding: 0.75rem;
  background: var(--vp-c-bg);
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.filtered-posts a {
  color: var(--vp-c-text-1);
  text-decoration: none;
  font-weight: 500;
}

.filtered-posts a:hover {
  color: var(--vp-c-brand-1);
}

.date {
  color: var(--vp-c-text-2);
  font-size: 0.9em;
}
</style>

<script setup>
import { computed } from 'vue'
import { useData, withBase } from 'vitepress'
import { data as posts } from '../posts.data.mts'

const { lang } = useData()
const isZh = computed(() => lang.value === 'zh' || lang.value === 'zh-CN')

const latest = computed(() => {
  return posts
    .filter((post) => (isZh.value ? post.url.startsWith('/zh/') : !post.url.startsWith('/zh/')))
    .slice(0, 4)
})

const formatDate = (value) => {
  if (!value) return ''
  // Parse YYYY-MM-DD in local time; Date-only strings are otherwise
  // interpreted as UTC and can shift the displayed day by one.
  const m = String(value).match(/^(\d{4})-(\d{2})-(\d{2})/)
  const d = m ? new Date(+m[1], +m[2] - 1, +m[3]) : new Date(value)
  return d.toLocaleDateString(isZh.value ? 'zh-CN' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
</script>

<template>
  <div class="ol-latest">
    <a
      v-for="post in latest"
      :key="post.url"
      class="ol-latest-item"
      :href="withBase(post.url)"
    >
      <span class="date">{{ formatDate(post.date) }}</span>
      <span class="title">{{ post.title }}</span>
      <span class="arrow">↗</span>
    </a>
  </div>
</template>
<script setup>
import DefaultTheme from 'vitepress/theme'
import { useRoute, useData } from 'vitepress'
import { computed, watch, onMounted } from 'vue'
import FlowField from '../../components/FlowField.vue'
import stats from '../stats.json'

const { Layout } = DefaultTheme
const route = useRoute()
const { lang } = useData()

const isZh = computed(() => lang.value === 'zh' || lang.value === 'zh-CN')

// The default theme renders the home layout for `/` and `/zh/`.
const isHome = computed(() => {
  const path = route.path.replace(/index\.html$/, '')
  return path === '/' || path === '/zh/'
})

const pad = (value) => String(value).padStart(2, '0')

const copy = computed(() => {
  const posts = isZh.value ? stats.posts.zh : stats.posts.en
  const museum = stats.museum

  return isZh.value
    ? {
        eyebrow: '永不闭馆的灵感现场',
        stats: [
          { value: String(museum.exhibits), unit: '件', label: '可交互展品' },
          { value: String(museum.departments), unit: '个', label: '灵感展区' },
          { value: pad(posts), unit: '篇', label: '博客文章' },
          { value: '02', unit: '种', label: '语言' }
        ]
      }
    : {
        eyebrow: 'A PLAYGROUND FOR CURIOSITY',
        stats: [
          { value: String(museum.exhibits), unit: '', label: 'EXHIBITS' },
          { value: String(museum.departments), unit: '', label: 'DEPARTMENTS' },
          { value: pad(posts), unit: '', label: 'POSTS' },
          { value: '02', unit: '', label: 'LANGUAGES' }
        ]
      }
})

const updateBodyClass = (path) => {
  // Check if we are in a blog post (and not the index page).
  const normalized = path !== '/' ? path.replace(/\/$/, '') : path
  const isPostsIndex =
    normalized.endsWith('/posts') ||
    normalized.endsWith('/posts/index') ||
    normalized.endsWith('/posts/index.html')

  if (normalized.includes('/posts/') && !isPostsIndex) {
    document.body.classList.add('is-blog-post')
  } else {
    document.body.classList.remove('is-blog-post')
  }
}

onMounted(() => {
  updateBodyClass(route.path)

  watch(
    () => route.path,
    (newPath) => {
      updateBodyClass(newPath)
    }
  )
})
</script>

<template>
  <Layout>
    <template #home-hero-image>
      <FlowField v-if="isHome" />
    </template>

    <template #home-hero-info-before>
      <div v-if="isHome" class="ol-eyebrow">
        <span class="ol-star">✳</span> {{ copy.eyebrow }}
      </div>
    </template>

    <template #home-hero-info-after>
      <div v-if="isHome" class="ol-stats">
        <div v-for="s in copy.stats" :key="s.label">
          <strong>{{ s.value }}<span>{{ s.unit }}</span></strong>
          <small>{{ s.label }}</small>
        </div>
      </div>
    </template>
  </Layout>
</template>
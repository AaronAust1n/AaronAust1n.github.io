<script setup>
import DefaultTheme from 'vitepress/theme'
import { useRoute } from 'vitepress'
import { watch, onMounted } from 'vue'

const { Layout } = DefaultTheme
const route = useRoute()

const updateBodyClass = (path) => {
  // Check if we are in a blog post (and not the index page).
  // VitePress routes often end with a trailing slash, so normalize first.
  const normalized = path !== '/' ? path.replace(/\/$/, '') : path
  const isPostsIndex = normalized.endsWith('/posts') || normalized.endsWith('/posts/index') || normalized.endsWith('/posts/index.html')

  if (normalized.includes('/posts/') && !isPostsIndex) {
    document.body.classList.add('is-blog-post')
  } else {
    document.body.classList.remove('is-blog-post')
  }
}

onMounted(() => {
  // Initial check
  updateBodyClass(route.path)
  
  // Watch for route changes
  watch(
    () => route.path,
    (newPath) => {
      updateBodyClass(newPath)
    }
  )
})
</script>

<template>
  <Layout />
</template>

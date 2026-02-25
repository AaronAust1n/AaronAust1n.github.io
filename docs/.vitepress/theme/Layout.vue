<script setup>
import DefaultTheme from 'vitepress/theme'
import { useRoute } from 'vitepress'
import { watch, onMounted } from 'vue'

const { Layout } = DefaultTheme
const route = useRoute()

const updateBodyClass = (path) => {
  // Check if we are in a blog post (and not the index page)
  // Logic: contains 'posts/' but doesn't end with 'posts/' or 'index.html'
  if (path.includes('posts/') && !path.endsWith('posts/') && !path.endsWith('index.html') && !path.endsWith('/')) {
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

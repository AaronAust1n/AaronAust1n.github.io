// .vitepress/theme/index.ts
import DefaultTheme from 'vitepress/theme'
import Layout from './Layout.vue'
import './style.css'
import VoteCard from '../../components/VoteCard.vue'
import BlogIndex from '../../components/BlogIndex.vue'

export default {
  extends: DefaultTheme,
  Layout, // Use our custom Layout
  enhanceApp({ app }) {
    app.component('VoteCard', VoteCard)
    app.component('BlogIndex', BlogIndex)
  }
}

// .vitepress/theme/index.ts
import DefaultTheme from 'vitepress/theme'
import Layout from './Layout.vue'
import './style.css'
import VoteCard from '../../components/VoteCard.vue'
import BlogIndex from '../../components/BlogIndex.vue'
import TagCloud from '../../components/TagCloud.vue'
import FlowField from '../../components/FlowField.vue'
import HomeLatest from '../../components/HomeLatest.vue'
import MuseumShowcase from '../../components/MuseumShowcase.vue'

export default {
  extends: DefaultTheme,
  Layout, // Use our custom Layout
  enhanceApp({ app }) {
    app.component('VoteCard', VoteCard)
    app.component('BlogIndex', BlogIndex)
    app.component('TagCloud', TagCloud)
    app.component('FlowField', FlowField)
    app.component('HomeLatest', HomeLatest)
    app.component('MuseumShowcase', MuseumShowcase)
  }
}

import { createContentLoader } from 'vitepress'

export default createContentLoader('**/posts/*.md', {
  includeSrc: false, // Don't include src to reduce payload
  render: true,
  excerpt: true, // Extract excerpt if available
  transform(rawData) {
    return rawData
      .filter(({ url }) => !url.endsWith('/posts/') && !url.endsWith('/posts/index.html') && !url.endsWith('/index')) // Exclude index pages
      .sort((a, b) => {
        return +new Date(b.frontmatter.date) - +new Date(a.frontmatter.date)
      })
      .map((page) => {
        return {
          title: page.frontmatter.title,
          url: page.url,
          date: page.frontmatter.date,
          excerpt: page.excerpt, // Use excerpt if available
          lang: page.url.startsWith('/zh/') ? 'zh' : 'en'
        }
      })
  }
})

import { createContentLoader } from 'vitepress'

function firstParagraphHtml(html: string) {
  if (!html) return ''
  const match = html.match(/<p(?:\s[^>]*)?>([\s\S]*?)<\/p>/i)
  return match?.[0] ?? ''
}

function stripHtmlToText(html: string) {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

// Only real articles: /posts/<slug>.html or /zh/posts/<slug>.html
const POST_URL = /^\/(zh\/)?posts\/[^/]+\.html$/
// Exclude scaffolding pages that also match the glob
const NON_POST = /\/(index|tags|hello-world)\.html$/

export default createContentLoader('**/posts/*.md', {
  includeSrc: false, // Don't include src to reduce payload
  render: true,
  excerpt: true, // Extract excerpt if available
  transform(rawData) {
    return rawData
      .filter(
        ({ url }) =>
          POST_URL.test(url) &&
          !NON_POST.test(url) // excludes index, tags and git-ignored hello-world drafts
      )
      .sort((a, b) => {
        const dateA = +new Date(a.frontmatter?.date ?? 0)
        const dateB = +new Date(b.frontmatter?.date ?? 0)
        return dateB - dateA
      })
      .map((page) => {
        // VitePress' excerpt extraction can sometimes be too long; keep index page concise.
        const excerptSource = page.excerpt || page.html || ''
        const excerptHtml = firstParagraphHtml(excerptSource)
        const fallbackText = stripHtmlToText(excerptSource).slice(0, 220)

        return {
          title: page.frontmatter?.title ?? page.title,
          url: page.url,
          date: page.frontmatter?.date,
          excerpt: excerptHtml || (fallbackText ? `<p>${fallbackText}…</p>` : ''),
          tags: Array.isArray(page.frontmatter?.tags) ? page.frontmatter.tags : [],
          lang: page.url.startsWith('/zh/') ? 'zh' : 'en'
        }
      })
  }
})

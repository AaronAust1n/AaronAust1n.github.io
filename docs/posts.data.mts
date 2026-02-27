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

export default createContentLoader('**/posts/*.md', {
  includeSrc: false, // Don't include src to reduce payload
  render: true,
  excerpt: true, // Extract excerpt if available
  transform(rawData) {
    return rawData
      .filter(({ url }) => !url.endsWith('/posts/') && !url.endsWith('/posts/index.html') && !url.endsWith('/index')) // Exclude index pages
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
          lang: page.url.startsWith('/zh/') ? 'zh' : 'en'
        }
      })
  }
})

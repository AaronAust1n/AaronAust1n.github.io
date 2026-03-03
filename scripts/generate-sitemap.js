import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const baseUrl = 'https://aaronaust1n.github.io'
const postsDir = path.join(__dirname, '../docs/posts')
const zhPostsDir = path.join(__dirname, '../docs/zh/posts')
const outputPath = path.join(__dirname, '../docs/.vitepress/public/sitemap.xml')

// Get current date in ISO format
const getCurrentDate = () => new Date().toISOString().split('T')[0]

// Get file modification date
const getFileDate = (filePath) => {
  try {
    const stats = fs.statSync(filePath)
    return stats.mtime.toISOString().split('T')[0]
  } catch {
    return getCurrentDate()
  }
}

// Get all markdown files from a directory
const getMarkdownFiles = (dir) => {
  try {
    return fs.readdirSync(dir)
      .filter(file => file.endsWith('.md') && file !== 'index.md')
      .map(file => ({
        name: file.replace('.md', '.html'),
        lastmod: getFileDate(path.join(dir, file))
      }))
  } catch {
    return []
  }
}

const posts = getMarkdownFiles(postsDir)
const zhPosts = getMarkdownFiles(zhPostsDir)

// Build sitemap URLs
const urls = []

// Homepage
urls.push({
  loc: `${baseUrl}/`,
  locZh: `${baseUrl}/zh/`,
  lastmod: getCurrentDate(),
  changefreq: 'monthly',
  priority: '1.0'
})

// Blog index
urls.push({
  loc: `${baseUrl}/posts/`,
  locZh: `${baseUrl}/zh/posts/`,
  lastmod: getCurrentDate(),
  changefreq: 'dayly',
  priority: '1.0'
})

// Tags page
urls.push({
  loc: `${baseUrl}/posts/tags.html`,
  locZh: `${baseUrl}/zh/posts/tags.html`,
  lastmod: getCurrentDate(),
  changefreq: 'weekly',
  priority: '0.8'
})

// Blog posts
posts.forEach(post => {
  const zhPost = zhPosts.find(p => p.name === post.name)
  urls.push({
    loc: `${baseUrl}/posts/${post.name}`,
    locZh: `${baseUrl}/zh/posts/${post.name}`,
    lastmod: post.lastmod,
    changefreq: 'weekly',
    priority: '0.7'
  })
})

// Generate XML
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${url.loc}"/>
    <xhtml:link rel="alternate" hreflang="zh" href="${url.locZh}"/>
  </url>
  <url>
    <loc>${url.locZh}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${url.loc}"/>
    <xhtml:link rel="alternate" hreflang="zh" href="${url.locZh}"/>
  </url>`).join('\n')}
</urlset>
`

// Write sitemap
fs.writeFileSync(outputPath, xml, 'utf-8')
console.log(`✅ Sitemap generated: ${outputPath}`)
console.log(`📊 Total URLs: ${urls.length * 2}`)

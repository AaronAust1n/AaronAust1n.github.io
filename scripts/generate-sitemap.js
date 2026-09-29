import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const baseUrl = 'https://aaronaust1n.github.io'
const root = path.join(__dirname, '..')
const outputPath = path.join(root, 'docs/public/sitemap.xml')

// Pages that are not posts and must not appear in the sitemap
const NON_POST_FILES = new Set(['index.md', 'tags.md', 'hello-world.md'])

const getCurrentDate = () => new Date().toISOString().split('T')[0]

// Minimal frontmatter reader: only scalar fields (title / date / ...)
function readFrontmatter(file) {
  try {
    const raw = fs.readFileSync(file, 'utf8')
    const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/)
    if (!match) return {}
    const fm = {}
    for (const line of match[1].split(/\r?\n/)) {
      const kv = line.match(/^([A-Za-z_][\w-]*):\s*"?([^"\n]*)"?\s*$/)
      if (kv) fm[kv[1]] = kv[2].trim()
    }
    return fm
  } catch {
    return {}
  }
}

const getMarkdownFiles = (dir) => {
  try {
    return fs
      .readdirSync(dir)
      .filter((file) => file.endsWith('.md') && !NON_POST_FILES.has(file))
      .map((file) => {
        const fm = readFrontmatter(path.join(dir, file))
        const stats = fs.statSync(path.join(dir, file))
        return {
          name: file.replace('.md', '.html'),
          // Prefer the published date from frontmatter; file mtime changes
          // on every checkout/clone and is meaningless to search engines.
          lastmod: fm.date || stats.mtime.toISOString().split('T')[0]
        }
      })
  } catch {
    return []
  }
}

const posts = getMarkdownFiles(path.join(root, 'docs/posts'))
const zhPosts = getMarkdownFiles(path.join(root, 'docs/zh/posts'))

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
  changefreq: 'daily',
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

// Vote page
urls.push({
  loc: `${baseUrl}/vote.html`,
  locZh: `${baseUrl}/zh/vote.html`,
  lastmod: getCurrentDate(),
  changefreq: 'monthly',
  priority: '0.6'
})

// Blog posts (union of EN and ZH, so ZH-only posts are not dropped)
const enMap = new Map(posts.map((p) => [p.name, p]))
const zhMap = new Map(zhPosts.map((p) => [p.name, p]))
for (const name of new Set([...enMap.keys(), ...zhMap.keys()])) {
  const en = enMap.get(name)
  const zh = zhMap.get(name)
  if (en && zh) {
    urls.push({
      loc: `${baseUrl}/posts/${name}`,
      locZh: `${baseUrl}/zh/posts/${name}`,
      lastmod: en.lastmod > zh.lastmod ? en.lastmod : zh.lastmod,
      changefreq: 'weekly',
      priority: '0.7'
    })
  } else {
    const existing = en || zh
    urls.push({
      loc: `${baseUrl}/${en ? '' : 'zh/'}posts/${name}`,
      locZh: null,
      lastmod: existing.lastmod,
      changefreq: 'weekly',
      priority: '0.7'
    })
  }
}

// Standalone museum (served from /public, shared by both languages)
const museumUrl = {
  loc: `${baseUrl}/museum/`,
  lastmod: getCurrentDate(),
  changefreq: 'weekly',
  priority: '0.9'
}

const renderPair = (url) => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${url.loc}"/>
    <xhtml:link rel="alternate" hreflang="zh-CN" href="${url.locZh}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${url.loc}"/>
  </url>
  <url>
    <loc>${url.locZh}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${url.loc}"/>
    <xhtml:link rel="alternate" hreflang="zh-CN" href="${url.locZh}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${url.loc}"/>
  </url>`

const renderSingle = (url) => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`

// Generate XML
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.map((url) => (url.locZh ? renderPair(url) : renderSingle(url))).join('\n')}
${renderSingle(museumUrl)}
</urlset>
`

// Write sitemap
fs.writeFileSync(outputPath, xml, 'utf-8')
console.log(`✅ Sitemap generated: ${outputPath}`)
console.log(`📊 Total URLs: ${urls.length + 1}`)

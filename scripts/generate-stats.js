import fs from 'fs'
import path from 'path'
import vm from 'vm'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const root = path.join(__dirname, '..')

const MUSEUM_GENERATED = path.join(root, 'docs/public/museum/src/generated.js')
const MUSEUM_INDEX = path.join(root, 'docs/public/museum/index.html')
const MUSEUM_I18N_DIR = path.join(root, 'docs/public/museum-i18n')
const OUTPUT = path.join(root, 'docs/.vitepress/stats.json')
const EXCLUDED_POSTS = new Set(['index.md', 'tags.md', 'hello-world.md'])

/*
 * The museum is a standalone document, so it cannot show the site navbar.
 * Keep a small "back to site" control in its top bar, injected here so that
 * overwriting docs/public/museum/ from the museum source stays safe: run
 * `npm run generate:stats` and the control is restored automatically.
 */
const MUSEUM_NAV_MARKER = 'OUTLINE SITE NAV'
const MUSEUM_NAV_HTML = `<nav class="site-nav" aria-label="返回主站 Back to site" data-lang="zh">
      <a class="site-link site-link-zh" href="/zh/">主页</a>
      <a class="site-link site-link-zh" href="/zh/posts/">博客</a>
      <a class="site-link site-link-en" href="/">Home</a>
      <a class="site-link site-link-en" href="/posts/">Blog</a>
    </nav>`
const MUSEUM_NAV_CSS =
  '.site-nav{display:flex;align-items:center;gap:6px;margin-right:16px;padding-right:16px;border-right:1px solid var(--line)}' +
  '.site-link{display:inline-flex;align-items:center;border:1px solid var(--line);border-radius:4px;padding:5px 9px;font-size:10px;line-height:1;color:var(--muted);background:var(--bg);white-space:nowrap;transition:color .2s,border-color .2s,background .2s}' +
  '.site-link:hover{color:var(--accent);border-color:var(--accent);background:var(--soft)}' +
  ".site-nav[data-lang='en'] .site-link-zh{display:none}" +
  ".site-nav[data-lang='zh'] .site-link-en{display:none}" +
  '.handbook-alt{display:inline-block;margin:10px 0 0 14px;font-size:11px;color:var(--accent);text-decoration:underline;text-underline-offset:3px}' +
  '@media(max-width:700px){.site-nav{margin-right:8px;padding-right:8px;gap:4px}.site-link{padding:4px 7px;font-size:9px}}'

function integrateMuseumNav() {
  if (!fs.existsSync(MUSEUM_INDEX)) return false
  const html = fs.readFileSync(MUSEUM_INDEX, 'utf-8')
  if (html.includes(MUSEUM_NAV_MARKER)) return false
  if (!html.includes('</head>') || !html.includes('<div class="top-actions">')) return false

  const next = html
    .replace(
      '</head>',
      () =>
        `    <!-- ${MUSEUM_NAV_MARKER} START -->\n` +
        `    <style>${MUSEUM_NAV_CSS}</style>\n` +
        `    <!-- ${MUSEUM_NAV_MARKER} END -->\n  </head>`
    )
    .replace(
      '<div class="top-actions">',
      () =>
        `<div class="top-actions">\n      <!-- ${MUSEUM_NAV_MARKER} START -->\n      ${MUSEUM_NAV_HTML}\n      <!-- ${MUSEUM_NAV_MARKER} END -->`
    )

  if (next === html) return false
  fs.writeFileSync(MUSEUM_INDEX, next, 'utf-8')
  return true
}

/*
 * English layer: loaded right after generated.js so it can translate
 * OUTLINE_DATA before app.js reads it. Parts are picked up automatically,
 * so adding en.<category>.js files needs no other change.
 */
const MUSEUM_I18N_MARKER = 'OUTLINE I18N'

function museumI18nScripts() {
  if (!fs.existsSync(MUSEUM_I18N_DIR)) return ''
  const parts = fs
    .readdirSync(MUSEUM_I18N_DIR)
    .filter((file) => /^en\..*\.js$/.test(file))
    .sort()
  return [
    ...parts.map((file) => `<script defer src="/museum-i18n/${file}"></script>`),
    '<script defer src="/museum-i18n/outline-i18n.js"></script>'
  ].join('\n    ')
}

function integrateMuseumI18n() {
  if (!fs.existsSync(MUSEUM_INDEX)) return 'missing'
  const html = fs.readFileSync(MUSEUM_INDEX, 'utf-8')
  const block =
    `<!-- ${MUSEUM_I18N_MARKER} START -->\n` +
    `    ${museumI18nScripts()}\n` +
    `    <!-- ${MUSEUM_I18N_MARKER} END -->`
  const existing = new RegExp(
    `[ \\t]*<!-- ${MUSEUM_I18N_MARKER} START -->[\\s\\S]*?<!-- ${MUSEUM_I18N_MARKER} END -->`
  )

  if (existing.test(html)) {
    const next = html.replace(existing, () => `    ${block}`)
    if (next === html) return 'present'
    fs.writeFileSync(MUSEUM_INDEX, next, 'utf-8')
    return 'updated'
  }

  const anchor = html.match(/<script[^>]*src="src\/generated\.js"[^>]*><\/script>/)
  if (!anchor) return 'no-anchor'
  fs.writeFileSync(
    MUSEUM_INDEX,
    html.replace(anchor[0], () => `${anchor[0]}\n    ${block}`),
    'utf-8'
  )
  return 'injected'
}

function loadMuseum() {
  const source = fs.readFileSync(MUSEUM_GENERATED, 'utf-8')
  const sandbox = { window: {} }
  vm.createContext(sandbox)
  vm.runInContext(source, sandbox, { timeout: 15000, filename: MUSEUM_GENERATED })

  if (fs.existsSync(MUSEUM_I18N_DIR)) {
    const parts = fs
      .readdirSync(MUSEUM_I18N_DIR)
      .filter((file) => /^en\..*\.js$/.test(file))
      .sort()
    for (const file of parts) {
      vm.runInContext(fs.readFileSync(path.join(MUSEUM_I18N_DIR, file), 'utf-8'), sandbox, {
        filename: file
      })
    }
  }

  const data = sandbox.window.OUTLINE_DATA
  if (!data || !Array.isArray(data.exhibits) || !Array.isArray(data.categories)) {
    throw new Error(`OUTLINE_DATA is missing exhibits/categories in ${MUSEUM_GENERATED}`)
  }
  return {
    data,
    source: sandbox.window.OUTLINE_SOURCE || {},
    guide: sandbox.window.OUTLINE_GUIDE || '',
    i18n: sandbox.window.OUTLINE_I18N || null
  }
}

/** Same merge the browser layer does, reused for the English handbook. */
function applyEnglish(data, i18n) {
  if (!i18n) return
  for (const category of data.categories || []) {
    const t = i18n.categories?.[category.id]
    if (!t) continue
    if (t.name) category.name = t.name
    if (t.description) category.description = t.description
  }
  for (const exhibit of data.exhibits || []) {
    const t = i18n.exhibits?.[exhibit.key]
    if (!t) continue
    if (t.name) {
      const zhName = exhibit.name
      exhibit.name = t.name
      exhibit.en = zhName
    }
    for (const field of ['action', 'param', 'principle', 'caution', 'paramDetail']) {
      if (t[field]) exhibit[field] = t[field]
    }
    if (Array.isArray(exhibit.params)) {
      for (const param of exhibit.params) {
        const pt = t.params?.[param.key]
        if (!pt) continue
        if (pt.label) param.label = pt.label
        if (pt.options) {
          for (const option of param.options || []) {
            if (pt.options[option.value]) option.label = pt.options[option.value]
          }
        }
      }
    }
  }
}

const HANDBOOK_TITLE = '# OUTLINE · {count}-Exhibit Implementation Handbook (English edition)'

function parameterTable(params) {
  const rows = ['| Parameter key | Label | Allowed values | Default |', '|---|---|---|---|']
  for (const p of params) {
    let values
    if (p.type === 'number') values = `${p.min}–${p.max} ${p.unit || ''}`.trim()
    else if (p.type === 'select') values = (p.options || []).map((o) => o.label).join(' / ')
    else values = 'true / false'
    rows.push(`| \`${p.key}\` | ${p.label} | ${values} | \`${p.default}\` |`)
  }
  return rows.join('\n')
}

function buildHandbookEn(data, source, guide) {
  const meta = guide.match(/运行版本 \*\*v([\d.]+)\*\* · ([\d-]+) · (\d+) 个展区/)
  const version = (meta && meta[1]) || data.version || 'unknown'
  const date = (meta && meta[2]) || ''
  const total = data.exhibits.length
  const out = []

  out.push(HANDBOOK_TITLE.replace('{count}', total))
  out.push('')
  out.push(
    `Runtime version **v${version}**${date ? ` · ${date}` : ''} · ${data.categories.length} departments.`
  )
  out.push('')
  out.push(
    '> Generated English edition, built from the museum catalog and the OUTLINE English layer. Source code is unchanged; the Chinese original is still available as the Chinese handbook download.'
  )
  out.push('')
  out.push('## Scope')
  out.push('')
  out.push(
    '**159 + 24 = 183 exhibits / 13 departments.** Segment A (160–167) shipped earlier; this round completes B/C: 168–183. The six in-place upgrades are 055, 077 (v3.1) and 027, 079, 087, 089 (v3.2), not recounted. This is not the 500-exhibit edition; the 352 micro-specimens are not implemented.'
  )
  out.push('')
  out.push('Relative to the read-only base-167, 163 non-upgraded registered functions stay byte-identical; upgraded exhibits keep their ids, names, categories and introduction versions. The original audio runtime is unchanged; the new player shares the same single-session bus.')
  out.push('')
  out.push('| Department | Exhibits |')
  out.push('|---|---:|')
  for (const category of data.categories) {
    const count = data.exhibits.filter((e) => e.category === category.id).length
    out.push(`| ${category.name} | ${count} |`)
  }
  out.push('')
  out.push('## Catalog')
  out.push('')
  out.push('| No. | Name | Department | Reference | This release |')
  out.push('|---|---|---|---|---|')
  for (const e of data.exhibits) {
    const status = e.new ? 'New' : e.updated ? 'Upgraded' : 'Kept'
    out.push(
      `| [${String(e.id).padStart(3, '0')}](#e${String(e.id).padStart(3, '0')}) | ${e.name} / ${e.en} | ${categoryName(data, e.category)} | ${e.specId || 'Existing exhibit'} | ${status} |`
    )
  }
  out.push('')

  for (const e of data.exhibits) {
    const id = String(e.id).padStart(3, '0')
    const cat = categoryName(data, e.category)
    const versionLine = `introduced v${e.introducedVersion}${e.updatedInVersion ? ` · upgraded v${e.updatedInVersion}` : ''}`
    out.push('---')
    out.push(`<a id="e${id}"></a>`)
    out.push(`## ${id} · ${e.name} / ${e.en}`)
    out.push('')
    out.push(`- **Department & version**: ${cat} · ${versionLine}.`)
    out.push(`- **Reference**: ${e.specId || 'Existing exhibit'}.`)
    out.push(`- **Interaction**: ${e.action}.`)
    out.push(`- **Parameters**: ${e.paramDetail || e.param || 'See the function defaults.'}`)
    out.push(`- **Principle**: ${e.principle}`)
    out.push(`- **Caution / boundary**: ${e.caution}`)
    out.push(`- **Source**: \`src/effects/${e.category}.js\`, key=\`${e.key}\`.`)
    out.push(
      '- **Replay**: destroy and remount, clearing temporary state while keeping lab parameters; audio stops and waits for an explicit restart.'
    )
    if (Array.isArray(e.params) && e.params.length) {
      out.push('')
      out.push(parameterTable(e.params))
    }
    out.push('')
    out.push('### Core code')
    out.push('')
    out.push('```js')
    out.push(String(source[e.key] || '// source unavailable'))
    out.push('```')
    out.push('')
  }

  out.push('## Verification & non-goals')
  out.push('')
  out.push(
    'Verification follows this release’s checks reports and docs/verification-report.md; earlier test claims from the uploaded README must not be cited. This library demonstrates technique and design language, not a full product or an official brand component. There is no real file deletion, account system, camera access, network collaboration or hidden upload. Chromium automation cannot replace real multi-touch devices, Safari/Firefox, screen readers, human listening or a WCAG audit.'
  )
  out.push('')
  return out.join('\n')
}

function categoryName(data, id) {
  const category = data.categories.find((c) => c.id === id)
  return category ? category.name : id
}

function countPosts(dir) {
  if (!fs.existsSync(dir)) return 0
  return fs.readdirSync(dir).filter((file) => file.endsWith('.md') && !EXCLUDED_POSTS.has(file)).length
}

const { data, source, guide, i18n } = loadMuseum()
applyEnglish(data, i18n)

const museum = {
  version: data.version ?? 'unknown',
  exhibits: data.exhibits.length,
  departments: data.categories.length
}
const stats = {
  generatedAt: new Date().toISOString().split('T')[0],
  museum,
  posts: {
    en: countPosts(path.join(root, 'docs/posts')),
    zh: countPosts(path.join(root, 'docs/zh/posts'))
  }
}

fs.writeFileSync(OUTPUT, JSON.stringify(stats, null, 2) + '\n', 'utf-8')
let handbookEn = false
if (guide && fs.existsSync(MUSEUM_I18N_DIR)) {
  fs.writeFileSync(
    path.join(MUSEUM_I18N_DIR, `handbook-${museum.exhibits}-zh.md`),
    guide,
    'utf-8'
  )
  fs.writeFileSync(
    path.join(MUSEUM_I18N_DIR, `handbook-${museum.exhibits}-en.md`),
    buildHandbookEn(data, source, guide),
    'utf-8'
  )
  handbookEn = true
}
const museumNavInjected = integrateMuseumNav()
const museumI18n = integrateMuseumI18n()
console.log(
  `📊 stats.json → museum v${stats.museum.version}: ${stats.museum.exhibits} exhibits / ${stats.museum.departments} departments; posts en=${stats.posts.en} zh=${stats.posts.zh}; museum nav ${museumNavInjected ? 'injected' : 'present'}; i18n ${museumI18n}; handbooks ${handbookEn ? 'written' : 'skipped'}`
)
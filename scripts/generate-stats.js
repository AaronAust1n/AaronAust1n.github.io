import fs from 'fs'
import path from 'path'
import vm from 'vm'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const root = path.join(__dirname, '..')

const MUSEUM_GENERATED = path.join(root, 'docs/public/museum/src/generated.js')
const OUTPUT = path.join(root, 'docs/.vitepress/stats.json')
const EXCLUDED_POSTS = new Set(['index.md', 'tags.md', 'hello-world.md'])

function readMuseumStats() {
  const source = fs.readFileSync(MUSEUM_GENERATED, 'utf-8')
  const sandbox = { window: {} }
  vm.createContext(sandbox)
  vm.runInContext(source, sandbox, { timeout: 15000, filename: MUSEUM_GENERATED })
  const data = sandbox.window.OUTLINE_DATA
  if (!data || !Array.isArray(data.exhibits) || !Array.isArray(data.categories)) {
    throw new Error(`OUTLINE_DATA is missing exhibits/categories in ${MUSEUM_GENERATED}`)
  }
  return {
    version: data.version ?? 'unknown',
    exhibits: data.exhibits.length,
    departments: data.categories.length
  }
}

function countPosts(dir) {
  if (!fs.existsSync(dir)) return 0
  return fs.readdirSync(dir).filter((file) => file.endsWith('.md') && !EXCLUDED_POSTS.has(file)).length
}

const museum = readMuseumStats()
const stats = {
  generatedAt: new Date().toISOString().split('T')[0],
  museum,
  posts: {
    en: countPosts(path.join(root, 'docs/posts')),
    zh: countPosts(path.join(root, 'docs/zh/posts'))
  }
}

fs.writeFileSync(OUTPUT, JSON.stringify(stats, null, 2) + '\n', 'utf-8')
console.log(
  `📊 stats.json → museum v${stats.museum.version}: ${stats.museum.exhibits} exhibits / ${stats.museum.departments} departments; posts en=${stats.posts.en} zh=${stats.posts.zh}`
)
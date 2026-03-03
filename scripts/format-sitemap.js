import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const sitemapPath = join(__dirname, '../docs/.vitepress/dist/sitemap.xml');

try {
  // Read the compressed sitemap
  const compressed = readFileSync(sitemapPath, 'utf-8');
  
  // Format with proper indentation
  const formatted = compressed
    .replace(/></g, '>\n<')
    .replace(/<url>/g, '\n  <url>')
    .replace(/<\/url>/g, '\n  </url>')
    .replace(/<loc>/g, '\n    <loc>')
    .replace(/<\/loc>/g, '</loc>')
    .replace(/<xhtml:link/g, '\n    <xhtml:link')
    .replace(/^<\?xml/, '<?xml')
    .replace(/^<urlset/, '\n<urlset')
    .replace(/<\/urlset>/, '\n</urlset>')
    .replace(/\n\n+/g, '\n')
    .trim() + '\n';
  
  // Write back
  writeFileSync(sitemapPath, formatted, 'utf-8');
  console.log('✅ Sitemap formatted successfully');
} catch (error) {
  console.error('❌ Error formatting sitemap:', error.message);
  process.exit(1);
}

import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const siteUrl = 'https://neptune-t.github.io';
const projectRoot = process.cwd();
const notesDirectory = path.join(projectRoot, '_notes');
const sitemapPath = path.join(projectRoot, 'public', 'sitemap.xml');

const staticRoutes = ['/', '/papers/', '/notes/', '/about/'];

const noteRoutes = fs.existsSync(notesDirectory)
  ? fs.readdirSync(notesDirectory)
      .filter((fileName) => fileName.endsWith('.md'))
      .filter((fileName) => {
        const filePath = path.join(notesDirectory, fileName);
        const { data } = matter(fs.readFileSync(filePath, 'utf8'));
        return Boolean(data.title && data.date && data.summary);
      })
      .map((fileName) => `/notes/${encodeURIComponent(fileName.replace(/\.md$/, ''))}/`)
      .sort()
  : [];

const urls = [...staticRoutes, ...noteRoutes];
const body = urls
  .map((route) => `  <url>\n    <loc>${siteUrl}${route}</loc>\n  </url>`)
  .join('\n');

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`;

fs.writeFileSync(sitemapPath, sitemap, 'utf8');
console.log(`Generated sitemap with ${urls.length} URLs at ${sitemapPath}`);

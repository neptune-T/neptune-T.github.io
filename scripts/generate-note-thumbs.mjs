import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import sharp from 'sharp';

const projectRoot = process.cwd();
const notesDirectory = path.join(projectRoot, '_notes');
const publicDirectory = path.join(projectRoot, 'public');
const thumbsDirectory = path.join(publicDirectory, 'notes', 'thumbs');

const THUMB_WIDTH = 480; // ~2x the largest display size (160px)

// Map an image URL found in a note to a local file under public/, if possible.
// Handles raw.githubusercontent.com URLs that point into this repo's public/.
function localizeImageUrl(url) {
  if (!url) return null;
  const rawMatch = url.match(/^https?:\/\/raw\.githubusercontent\.com\/[^/]+\/[^/]+\/[^/]+\/public(\/.*)$/);
  if (rawMatch) return path.join(publicDirectory, rawMatch[1]);
  if (url.startsWith('/')) return path.join(publicDirectory, url);
  return null; // external or relative URLs: no local thumbnail
}

if (!fs.existsSync(notesDirectory)) {
  console.warn("'_notes' directory not found. No note thumbnails generated.");
  process.exit(0);
}

fs.mkdirSync(thumbsDirectory, { recursive: true });

const noteIds = new Set();
let generated = 0;
let skipped = 0;

for (const fileName of fs.readdirSync(notesDirectory)) {
  if (!fileName.endsWith('.md')) continue;
  const id = fileName.replace(/\.md$/, '');
  const { data, content } = matter(fs.readFileSync(path.join(notesDirectory, fileName), 'utf8'));
  if (!data.title || !data.date || !data.summary) continue; // same rule as src/lib/notes.ts
  noteIds.add(id);

  const match = /!\[.*?\]\((.*?)\)/.exec(content);
  const sourcePath = match ? localizeImageUrl(match[1].trim()) : null;
  const thumbPath = path.join(thumbsDirectory, `${id}.webp`);

  if (!sourcePath || !fs.existsSync(sourcePath)) {
    // No localizable image: drop any stale thumbnail so the list stays consistent.
    if (fs.existsSync(thumbPath)) fs.rmSync(thumbPath);
    continue;
  }

  if (fs.existsSync(thumbPath) && fs.statSync(thumbPath).mtimeMs >= fs.statSync(sourcePath).mtimeMs) {
    skipped += 1;
    continue;
  }

  await sharp(sourcePath)
    .resize({ width: THUMB_WIDTH, withoutEnlargement: true })
    .webp({ quality: 78 })
    .toFile(thumbPath);
  generated += 1;
}

// Remove thumbnails whose note no longer exists.
for (const fileName of fs.readdirSync(thumbsDirectory)) {
  if (fileName.endsWith('.webp') && !noteIds.has(fileName.replace(/\.webp$/, ''))) {
    fs.rmSync(path.join(thumbsDirectory, fileName));
  }
}

console.log(
  `Note thumbnails: ${generated} generated, ${skipped} up to date, at ${thumbsDirectory}`,
);

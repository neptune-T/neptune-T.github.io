import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import sharp from 'sharp';

const projectRoot = process.cwd();
const notesDirectory = path.join(projectRoot, '_notes');
const publicDirectory = path.join(projectRoot, 'public');
const thumbsDirectory = path.join(publicDirectory, 'notes', 'thumbs');

const THUMB_WIDTH = 480; // ~2x the largest display size (160px)

// Full-size note images are served as WebP from this site instead of the raw PNG on
// raw.githubusercontent.com (slow, uncached, often unreachable). 1600px covers the 720px
// reading column at 2x.
const IMAGE_WIDTH = 1600;
const imagesDirectory = path.join(publicDirectory, 'notes', 'images');
const imageManifestPath = path.join(projectRoot, '_data', 'note-images.json');

// A ~20px blurred preview inlined into the page as a data URI, so something sensible is
// visible immediately on slow connections (and stays, instead of a broken-image icon, if
// the real image never arrives).
const placeholderOf = async (file) => {
  const buffer = await sharp(file).resize({ width: 20 }).webp({ quality: 40 }).toBuffer();
  return `data:image/webp;base64,${buffer.toString('base64')}`;
};

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

// --- Optimized full-size images for every image referenced by a note -----------------
// Manifest: original URL as written in the note -> { src, width, height } of the WebP.
const manifest = {};
const keptImages = new Set();
let optimized = 0;

for (const fileName of fs.readdirSync(notesDirectory)) {
  if (!fileName.endsWith('.md')) continue;
  const content = fs.readFileSync(path.join(notesDirectory, fileName), 'utf8');
  for (const [, rawUrl] of content.matchAll(/!\[[^\]]*\]\(\s*([^)\s]+)[^)]*\)/g)) {
    const url = rawUrl.trim();
    const sourcePath = localizeImageUrl(url);
    if (!sourcePath || !fs.existsSync(sourcePath) || /\.(gif|svg)$/i.test(sourcePath)) continue;

    const relative = path.relative(publicDirectory, sourcePath).replace(/\.[^.]+$/, '.webp');
    const outPath = path.join(imagesDirectory, relative);
    keptImages.add(outPath);

    if (!fs.existsSync(outPath) || fs.statSync(outPath).mtimeMs < fs.statSync(sourcePath).mtimeMs) {
      fs.mkdirSync(path.dirname(outPath), { recursive: true });
      await sharp(sourcePath)
        .resize({ width: IMAGE_WIDTH, withoutEnlargement: true })
        .webp({ quality: 82 })
        .toFile(outPath);
      optimized += 1;
    }
    const { width, height } = await sharp(outPath).metadata();
    manifest[url] = {
      src: `/${path.relative(publicDirectory, outPath).split(path.sep).join('/')}`,
      width,
      height,
      placeholder: await placeholderOf(outPath),
    };
  }
}

// Drop optimized images no note references any more.
const walk = (dir) =>
  fs.existsSync(dir)
    ? fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
        e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)],
      )
    : [];
for (const file of walk(imagesDirectory)) {
  if (!keptImages.has(file)) fs.rmSync(file);
}

fs.writeFileSync(imageManifestPath, `${JSON.stringify(manifest, null, 2)}\n`);

// Placeholders for the notes-list thumbnails, keyed by note id.
const thumbPlaceholders = {};
for (const id of noteIds) {
  const thumbPath = path.join(thumbsDirectory, `${id}.webp`);
  if (fs.existsSync(thumbPath)) thumbPlaceholders[id] = await placeholderOf(thumbPath);
}
fs.writeFileSync(
  path.join(projectRoot, '_data', 'note-thumbs.json'),
  `${JSON.stringify(thumbPlaceholders, null, 2)}\n`,
);
console.log(`Note images: ${optimized} optimized, ${Object.keys(manifest).length} total, at ${imagesDirectory}`);

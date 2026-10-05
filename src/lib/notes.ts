import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkMath from 'remark-math';
import remarkRehype from 'remark-rehype';
import rehypeKatex from 'rehype-katex';
import rehypeStringify from 'rehype-stringify';
import katex from 'katex';
import { withBasePath } from '@/lib/basePath';

const notesDirectory = path.join(process.cwd(), '_notes');

// `html` is the heading as display markup (inline math rendered with KaTeX).
export type TocItem = { id: string; text: string; html: string; depth: number };

type HastNode = {
  type: string;
  tagName?: string;
  value?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
};

const textOf = (node: HastNode): string =>
  node.type === 'text' ? node.value ?? '' : (node.children ?? []).map(textOf).join('');

const escapeHtml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const isInlineMath = (node: HastNode) => {
  const className = node.properties?.className;
  return Array.isArray(className) && className.includes('math-inline');
};

const htmlOf = (node: HastNode): string => {
  if (node.type === 'text') return escapeHtml(node.value ?? '');
  if (isInlineMath(node)) return katex.renderToString(textOf(node), { throwOnError: false });
  return (node.children ?? []).map(htmlOf).join('');
};

// Gives every h1–h4 a stable slug id (CJK kept as-is) and records it for the table of
// contents. Runs before rehype-katex so heading text is still the plain source.
const rehypeCollectHeadings = (toc: TocItem[]) => () => (tree: HastNode) => {
  const seen = new Map<string, number>();
  const walk = (node: HastNode) => {
    const match = node.type === 'element' && node.tagName?.match(/^h([1-4])$/);
    if (match) {
      const text = textOf(node).trim();
      const base =
        text.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-+|-+$/g, '') || 'section';
      const count = seen.get(base) ?? 0;
      seen.set(base, count + 1);
      const id = count ? `${base}-${count}` : base;
      node.properties = { ...node.properties, id };
      toc.push({ id, text, html: htmlOf(node).trim(), depth: Number(match[1]) });
      return;
    }
    node.children?.forEach(walk);
  };
  walk(tree);
};

type NoteImage = { src: string; width: number; height: number; placeholder?: string };

// Written by scripts/generate-note-thumbs.mjs (prebuild): original image URL in a note ->
// locally served, resized WebP plus an inline blurred placeholder.
const loadImageManifest = (): Record<string, NoteImage> => {
  const manifestPath = path.join(process.cwd(), '_data', 'note-images.json');
  return fs.existsSync(manifestPath) ? JSON.parse(fs.readFileSync(manifestPath, 'utf8')) : {};
};

// Points note images at their optimized copies and adds intrinsic size (no layout shift).
// Each known image is wrapped in a .note-figure whose background is the blurred
// placeholder; the image fades in once loaded and stays hidden if it fails, so a slow
// network shows a soft preview instead of a broken-image icon. The handlers are inline
// attributes so they work before React hydrates. The first image is the note's lead
// figure and loads eagerly; the rest load lazily.
const rehypeNoteImages = (manifest: Record<string, NoteImage>) => () => (tree: HastNode) => {
  let seen = 0;
  const walk = (node: HastNode) => {
    node.children = node.children?.map((child) => {
      if (child.type !== 'element' || child.tagName !== 'img') {
        walk(child);
        return child;
      }
      const local = manifest[String(child.properties?.src ?? '')];
      const first = seen === 0;
      seen += 1;
      const img: HastNode = {
        ...child,
        properties: {
          ...child.properties,
          ...(local && { src: local.src, width: local.width, height: local.height }),
          loading: first ? 'eager' : 'lazy',
          decoding: 'async',
          ...(first && { fetchPriority: 'high' }),
          ...(local && {
            onLoad: "this.dataset.state='loaded'",
            onError: "this.dataset.state='failed'",
          }),
        },
      };
      if (!local) return img;
      return {
        type: 'element',
        tagName: 'span',
        properties: {
          className: ['note-figure'],
          style: `aspect-ratio:${local.width}/${local.height};${
            local.placeholder ? `background-image:url(${local.placeholder})` : ''
          }`,
        },
        children: [img],
      };
    });
  };
  walk(tree);
};

const cleanTags = (tags: unknown): string[] =>
  Array.isArray(tags) ? tags.map((t) => String(t).trim()).filter(Boolean) : [];

// Rough reading time for mixed Chinese/English notes: CJK characters at ~400/min,
// Latin words at ~220/min. Code blocks, math and image markup are skipped.
const estimateReadingMinutes = (markdown: string) => {
  const prose = markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/\$\$[\s\S]*?\$\$/g, ' ')
    .replace(/!\[.*?\]\(.*?\)/g, ' ');
  const cjk = (prose.match(/[\u4e00-\u9fff]/g) || []).length;
  const words = (prose.replace(/[\u4e00-\u9fff]/g, ' ').match(/[A-Za-z0-9]+/g) || []).length;
  return Math.max(1, Math.round(cjk / 400 + words / 220));
};

export function getSortedNotesData() {
  if (!fs.existsSync(notesDirectory)) {
    console.warn("'_notes' directory not found. No notes will be displayed.");
    return [];
  }

  const fileNames = fs.readdirSync(notesDirectory);
  const thumbPlaceholdersPath = path.join(process.cwd(), '_data', 'note-thumbs.json');
  const thumbPlaceholders: Record<string, string> = fs.existsSync(thumbPlaceholdersPath)
    ? JSON.parse(fs.readFileSync(thumbPlaceholdersPath, 'utf8'))
    : {};
  const allNotesData = fileNames
    .filter((fileName) => fileName.endsWith('.md')) // Ensure we only process markdown files
    .map((fileName) => {
      const id = fileName.replace(/\.md$/, '');
      const fullPath = path.join(notesDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const matterResult = matter(fileContents);

      // List teaser: prefer the small thumbnail emitted by scripts/generate-note-thumbs.mjs
      // (prebuild). The raw first image is far too heavy to load on the notes index.
      const thumbRoute = `/notes/thumbs/${id}.webp`;
      const coverImage = fs.existsSync(path.join(process.cwd(), 'public', thumbRoute))
        ? withBasePath(thumbRoute)
        : '';

      if (!matterResult.data.title || !matterResult.data.date || !matterResult.data.summary) {
        console.warn(`Note with id '${id}' is missing required frontmatter and will be skipped.`);
        return null;
      }

      return {
        id,
        coverImage,
        coverPlaceholder: thumbPlaceholders[id] ?? '',
        ...(matterResult.data as { title: string; date: string; summary: string }),
        tags: cleanTags(matterResult.data.tags),
      };
    })
    .filter((note): note is NonNullable<typeof note> => note !== null);

  return allNotesData.sort((a, b) => {
    if (a && b) {
      if (a.date < b.date) {
        return 1;
      } else {
        return -1;
      }
    }
    return 0;
  });
}

export function getAllNoteIds() {
  if (!fs.existsSync(notesDirectory)) {
    return [];
  }
  const fileNames = fs.readdirSync(notesDirectory);
  return fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .filter((fileName) => {
      const fullPath = path.join(notesDirectory, fileName);
      const matterResult = matter(fs.readFileSync(fullPath, 'utf8'));
      return Boolean(matterResult.data.title && matterResult.data.date && matterResult.data.summary);
    })
    .map((fileName) => {
      return {
        params: {
          id: fileName.replace(/\.md$/, ''),
        },
      };
    });
}

export async function getNoteData(id: string) {
  const fullPath = path.join(notesDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const matterResult = matter(fileContents);

  const headings: TocItem[] = [];
  const processedContent = await unified()
    .use(remarkParse)
    .use(remarkMath)
    .use(remarkRehype)
    .use(rehypeCollectHeadings(headings))
    .use(rehypeNoteImages(loadImageManifest()))
    .use(rehypeKatex)
    .use(rehypeStringify)
    .process(matterResult.content);
  let contentHtml = processedContent.toString();
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  if (basePath) {
    // 让 markdown 里写的 /img/... /notes/... 在 basePath 部署下也能正常工作
    contentHtml = contentHtml
      .replace(/(src|href)="\/(?!\/)/g, `$1="${basePath}/`);
  }

  // Extract first image from content
  const imageRegex = /!\[.*?\]\((.*?)\)/;
  const match = imageRegex.exec(matterResult.content);
  const coverImage = match ? withBasePath(match[1]) : '';

  // Keep the two outermost heading levels the note actually uses (some notes start at
  // h1, others at h2).
  const topDepth = Math.min(...headings.map((h) => h.depth));
  const toc = headings.filter((h) => h.depth <= topDepth + 1);

  return {
    id,
    contentHtml,
    coverImage,
    toc,
    readingMinutes: estimateReadingMinutes(matterResult.content),
    ...(matterResult.data as { title: string; date: string; summary: string }),
    tags: cleanTags(matterResult.data.tags),
  };
}

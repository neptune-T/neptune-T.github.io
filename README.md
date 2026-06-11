# Tianshan Zhang - Academic Homepage

Source code for [Tianshan Zhang's academic homepage](https://neptune-t.github.io/), featuring research projects, publications, technical notes, and academic background.

## Research

- **DragMesh-2**: [Project page](https://aigeeksgroup.github.io/DragMesh-2/) | [Code](https://github.com/AIGeeksGroup/DragMesh-2) | [Models](https://huggingface.co/AIGeeksGroup/DragMesh-2)
- **DragMesh**: [Paper](https://arxiv.org/abs/2512.06424) | [Project page](https://aigeeksgroup.github.io/DragMesh/) | [Code](https://github.com/AIGeeksGroup/DragMesh) | [Models](https://huggingface.co/AIGeeksGroup/DragMesh)

The full publication list is available on the [Papers page](https://neptune-t.github.io/papers/).

## Site Sections

- **Home**: research profile and selected work
- **Papers**: publications, project pages, code, and model links
- **Notes**: long-form notes on 3D vision, generative modeling, mathematics, and physics
- **About**: biography, travel map, and honors

## Tech Stack

- Next.js 15 Pages Router and React 19
- TypeScript and Tailwind CSS
- Framer Motion and React Three Fiber
- Markdown, Unified, Remark, Rehype, and KaTeX
- Static export deployed through GitHub Pages

## Local Development

```bash
git clone https://github.com/neptune-T/neptune-T.github.io.git
cd neptune-T.github.io
npm install --legacy-peer-deps
npm run dev
```

Open `http://localhost:3000`.

Run a production build with:

```bash
npm run build
```

The static site is exported to `out/`.

## Content Management

### Add a Note

Create a Markdown file in `_notes/` with the required front matter:

```markdown
---
title: "Note title"
date: "2026-06"
summary: "A short description used by the notes page and search engines."
tags: ["3D Vision", "Generative AI"]
---
```

### Add a Publication

Create a Markdown file in `_papers/`:

```markdown
---
title: "Paper title"
date: 2026-06-01
venue: Preprint 2026
authors: Author One, Author Two
summary: A concise paper summary.
arxiv_url: https://arxiv.org/abs/xxxx.xxxxx
github_url: https://github.com/org/repository
url: https://project-page.example
video: /videos/papers/project/teaser.mp4
---
```

Optional fields can be omitted until a link is public. The Papers page only renders buttons for fields that are present.

## Deployment and Search Indexing

Pushes to `main` trigger `.github/workflows/deploy.yml` and deploy the static export to GitHub Pages.

Before each production build, `scripts/generate-sitemap.mjs` regenerates `public/sitemap.xml` from the static pages and valid note files. The site also publishes `robots.txt` and canonical URLs.

To request Google indexing:

1. Add `https://neptune-t.github.io/` as a URL-prefix property in [Google Search Console](https://search.google.com/search-console/).
2. Complete ownership verification using the HTML tag method.
3. Submit `https://neptune-t.github.io/sitemap.xml` under **Sitemaps**.
4. Use **URL inspection** to request indexing for the homepage and important pages.

Indexing is controlled by Google and can take several days or longer after submission.

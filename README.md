# Academic Homepage


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


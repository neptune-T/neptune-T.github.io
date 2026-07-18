# Project Instructions

## Design System

- Use `DESIGN.md` as the canonical visual design reference for UI work in this project.
- The file was installed from `/home/plote/code/awesome-design-md/design-md/apple/DESIGN.md`.
- Use `DESIGN.claude.md` as the secondary reference for the local site direction: warm canvas, coral actions, editorial serif headings, and dark product/mockup panels.
- The preferred blend is Apple structure and restraint plus Claude warmth and academic editorial tone.
- Prefer the Tailwind tokens configured in `tailwind.config.ts` before adding one-off colors, shadows, or radii.
- Treat `DESIGN.md` typography as directional: keep CSS `letter-spacing` at `0` in new UI code.
- Keep the existing Next.js Pages Router and Tailwind CSS structure unless a task explicitly asks for a larger migration.

## Local Constraints

- Use the existing `ThemeProvider` for dark/light mode state.
- Keep visual changes scoped to the page or component being modified.
- Preserve generated content in `_notes/` unless the user explicitly asks to edit notes.
- Notes-list teasers: `scripts/generate-note-thumbs.mjs` (runs in `prebuild`) shrinks the first image of each `_notes/*.md` into `public/notes/thumbs/<id>.webp`; `getSortedNotesData` exposes it as `coverImage`. A new note's teaser appears after the next `npm run build`.

## Current Design Language (2026-07 refresh)

- Visual goal: quiet, editorial, academic ("阅览室"). Flat surfaces, hairline dividers, generous whitespace; no glassmorphism, no shadows on UI chrome, no uppercase/tracked labels.
- Typography: headings use `font-serif` (IBM Plex Serif + Noto Serif SC) at weight 400/500; body/UI use `font-sans` (Inter), except long-form note bodies (`.note-prose`), which use the serif stack for an editorial reading feel. `letter-spacing` stays `0` everywhere (no `tracking-*` utilities).
- Colors: use the semantic tokens in `tailwind.config.ts` — light `paper/ink/muted/faint/line`, dark `dpaper/dink/dmuted/dfaint/dline`, single `coral` accent used sparingly (active states, small marks).
- Theming: pages style dark mode with Tailwind `dark:` variants (`darkMode: 'class'`). An inline bootstrap script in `src/pages/_document.tsx` sets the class before paint; `ThemeContext` mirrors it for JS-driven surfaces (three.js scene, echarts map). Do not reintroduce `isDarkMode ? ... : ...` class-string ternaries.
- Layout rhythm: shared `Header`/`Footer` on every page; content `max-w-5xl` (reading pages `max-w-3xl`), `px-6`, sections separated by `border-t border-line dark:border-dline` + `pt-14`, page top padding `pt-28 md:pt-36`. Exception: the homepage hero fills the first screen (`min-h-svh`, flex-centered, `pt-14` for the fixed header) so the Research section starts below the fold.

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

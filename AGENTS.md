# AGENTS.md — leamandeep.github.io

Personal site of Aman Deep (ML × Earth observation), built on the **Astro Chiri** theme.

## Commands (pnpm ONLY — never npm/yarn)

- `pnpm dev` — dev server with Keystatic CMS (runs link-metadata script first)
- `pnpm build` — typecheck + build; must pass before committing
- `pnpm new` — scaffold a new post (`scripts/new-post.ts`)
- `pnpm typecheck` / `pnpm lint` / `pnpm format` — run before finishing any task

## Project structure

- Content: `src/content/posts/**.mdx` (frontmatter schema in `src/content.config.ts`)
  - Every post has `logType: "work" | "reading"` — this distinction must stay visible in the UI
  - About page: `src/content/about/about.md`
- Theme config: `src/config.ts` (site info, layout, date/post options) — never hardcode values that belong here
- Components: `src/components/{layout,ui,widgets}/`
- Styles: `src/styles/` — `global.css` defines `--sans` / `--serif` / `--mono` and theme tokens;
  self-hosted fonts are declared in `src/styles/fonts.css` with woff2 files in `public/fonts/`
- Markdown pipeline: custom remark/rehype plugins in `src/plugins/` (wired in `astro.config.ts`)
- Imports from `src/` use the `@/` alias (e.g. `@/utils/date`)
- Feeds/OG: `src/pages/{rss.xml.ts,atom.xml.ts,open-graph/}` — keep new post routes covered by these

## Conventions

- Static output (`output: "static"`) — no server-side APIs; interactive bits are React/Svelte islands
- TypeScript strict; keep `astro check` clean
- Match existing code style: no semicolons in `.ts`? — follow Prettier (`pnpm format` decides)
- Prefer modifying Chiri's components over adding parallel ones; keep the theme minimal

## Design system (navthings-inspired, finalized)

- Font: Geist / Geist Mono / Geist Italic everywhere, incl. KaTeX math (post.css overrides)
- Light: off-white #f6f6f4; Dark: neutral #1B1B1B; soft gradient backdrop only,
  crossfaded via html::before/::after opacity (no grain — user prefers it clean)
- Blog body text is gray (--text-secondary); headings/strong stay --text-primary.
  Bold weight is 500 (medium). Hierarchy comes from spacing, not size.
- Lists: 15px rows, title left / meta right, dim-on-hover; group headings are
  month-only lowercase (no year); rows sorted newest-first across years
- Home = collapsible work/writing accordions (flat, no month groups, max 3 rows
  + "show me more" plain underlined link); full lists live on dedicated
  /work/ and /writing/ pages with a large (1.5rem) lowercase page heading
- Backdrop: soft gradient only (light #f6f6f4 wash / dark #09251c wash) —
  no grain texture (user prefers it clean)
- Dark-mode images: after the light image line add `![](name-dark.svg "dark")`;
  rehype-dark-images pairs them and CSS swaps per theme
- Theme toggle icons are CSS-driven (html.dark class) — never toggle icons in JS

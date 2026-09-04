# ajakka.net

The personal website of Abderrahim Ajakka — a mobile developer working in React
Native.

It is a **static, dependency-free site that presents itself as a shell
session**. There is no build step, no framework and no package manager: a
handful of hand-written HTML files, one stylesheet, two small scripts. Every
page is framed as a command and its output — you `cd` between directories rather
than clicking through a menu — and the whole thing is set in one monospace face
on a dark background, with a `Lights` switch for the light theme.

GitHub Pages serves the repository root, and `CNAME` points the site at
`ajakka.net`.

## Site map

| URL         | File                                  | What it is                                                                  |
| ----------- | ------------------------------------- | --------------------------------------------------------------------------- |
| `/`         | `index.html`                          | ASCII-art name, pronunciation, tagline, social links, and the `ls` nav       |
| `/about`    | `about/index.html`                    | Short intro, then `cat skills.json \| jq` printing the skill groups          |
| `/projects` | `projects/index.html`                 | `ls -la` printing the project listing, each with its link and tech tags      |
| `/blog`     | `blog/index.html`                     | `ls -la` printing the post listing with filename and date                    |
| a post      | `blog/<slug>.html`                    | The article itself: title, date, prose with sections and code blocks         |
|             | `styles.css`                          | The whole design system — tokens, layout, components                         |
|             | `scripts/lights.js`                   | Theme toggle and restore; loaded by every page                               |
|             | `scripts/ascii-art.js`                | Injects the ASCII name banner; home page only                                |
|             | `CNAME`                               | The custom domain                                                            |

Links are absolute (`/about`, `/projects`, `/blog`) and rely on directory
indexes; posts inside `blog/` may link to each other relatively.

## The terminal fiction

This is the thing to protect when adding anything:

- **A prompt names the page, not a heading.** A listing page opens with
  `┌──(~/projects)` / `└─# ls -la` and everything below it reads as that
  command's output. Prose pages — the about page, a blog post — may carry an
  `h1`, because a document has a title; a directory listing does not.
- **Navigation is movement between directories.** Every page but the home page
  starts with a `cd` prompt in its header: `cd ~` back to the root, `cd ..` from
  a post up to `/blog`. The home page is the hub, and its `ls` prints the three
  sections.
- **Hierarchy comes from color and alignment, never from weight or size.**
  Headings are `font-weight: normal`; a filename in a listing is the same size
  as the text around it and is set apart only by being brighter.
- **A terminal draws with characters.** Box-drawing glyphs, `->` for a link
  target, `[bracketed]` tags. No rounded chips, cards, badges or shadows.
- **Lights: ON/OFF**, in the same corner of every page, is the only control on
  the site.

## Anatomy of a page

```html
<body>
  <div class="page">
    <header class="page-header">
      <div class="terminal-prompt">
        <p>┌──(~/where-you-are)</p>
        <p>└─# <a href="/">cd ~</a></p>
      </div>
      <div id="theme-toggle" class="theme-toggle">
        <p id="theme-text">Lights: OFF</p>
      </div>
    </header>

    <div class="terminal-prompt">
      <p>┌──(~/where-you-are)</p>
      <p>└─# ls -la</p>
    </div>

    <div class="tree">
      <div class="tree-item">…</div>
      <div class="tree-item">…</div>
    </div>
  </div>

  <script src="/scripts/lights.js"></script>
</body>
```

The `<head>` is the same everywhere: the Sometype Mono stylesheet from Google
Fonts, `/styles.css`, and a `<title>`.

## Elements

### Layout

- `.container` — full-viewport centered layout. Home page only.
- `.page` — 800px reading column with page padding. Every other page.
- `.page-header` — top row of a page: breadcrumb prompt on the left, lights
  toggle on the right.
- `.section` / `.subsection` — vertical rhythm between blocks; direct children
  are spaced automatically.

### Components

- `.terminal-prompt` — the `┌──(~/path)` + `└─# command` pair.
- `.command-output` — indented result of a prompt.
- `.link-row` — horizontal wrapping row of links (the home nav, social links).
- `.tree` / `.tree-item` / `.tree-name` — a `tree`-style listing of command
  output (projects, blog posts). The branch line is drawn in CSS and the last
  item closes it, so items can be added or removed freely. `.tree-name` is the
  item's name, set apart by color rather than size.
- `.entry` — a plain block in command output (a skill group); consecutive
  entries space themselves.
- `.tag-list` / `.tag` — skill and tech tags, printed as `[bracketed]` words.
- `.prose` — body copy; spaces its own paragraphs.
- `.meta` — secondary text: dates, filenames, link targets.
- `.post-header` — an article's prompt, title and date.
- `.code-block` (wrapping a `<pre>`) — code samples.
- `.theme-toggle` — the `Lights: ON/OFF` control.

### Scripts

- `scripts/lights.js` — toggles `body.light-mode`, remembers the choice in
  `localStorage` under `theme`, and re-applies it on load. It runs on every
  page and tolerates pages with no toggle, so a page that omits the script is
  the one page that ignores the saved setting.
- `scripts/ascii-art.js` — injects the ASCII banner into `#ascii-art`. Home page
  only.

## Tokens

Every page loads `/styles.css` and builds itself from the tokens below. The rule
of thumb: **no page invents its own sizes, colors or spacing.** If a page needs
something new, add it to `styles.css` and document it here so the next page can
reuse it.

All tokens are CSS custom properties on `:root`, overridden on `body.light-mode`
for the lights-on theme. Use `var(--token)`, never a raw value.

### Color

| Token             | Dark (default)          | Light             | Use for                        |
| ----------------- | ----------------------- | ----------------- | ------------------------------ |
| `--color-bg`      | `#151a21`               | `#f5f5f5`         | Page background                |
| `--color-surface` | `rgba(127,133,142,.12)` | `rgba(0,0,0,.06)` | Code blocks                    |
| `--color-border`  | `rgba(127,133,142,.25)` | `rgba(0,0,0,.15)` | Tree branches, hairlines       |
| `--color-text`    | `#7f858e`               | `#333`            | Body copy and links            |
| `--color-muted`   | `#676d76`               | `#666`            | Dates, tags, link targets      |
| `--color-bright`  | `#a7adb4`               | `#000`            | Headings, link hover, emphasis |

Three levels of emphasis only: **muted → text → bright**. Nothing else.
`--bg-color`, `--text-color` and `--hover-color` still exist as aliases for older
markup; prefer the `--color-*` names.

### Type

One family everywhere: `--font-mono` (Sometype Mono, with a monospace fallback
stack). Sizes come from the scale — never hand-written `em` values.

| Token         | Size    | Use for                    |
| ------------- | ------- | -------------------------- |
| `--text-xs`   | 0.8rem  | Fine print                 |
| `--text-sm`   | 0.9rem  | `.meta`, `.tag`, code      |
| `--text-base` | 1rem    | Body copy (`body` default) |
| `--text-lg`   | 1.15rem | `h3`                       |
| `--text-xl`   | 1.35rem | `h2` — section titles      |
| `--text-2xl`  | 1.6rem  | `h1` — one per page        |

Line height: `--leading-tight` (1.3) for headings and prompts,
`--leading-normal` (1.5) default, `--leading-relaxed` (1.7) for `.prose`.

### Space

`--space-1` 4px · `--space-2` 8px · `--space-3` 12px · `--space-4` 16px ·
`--space-5` 24px · `--space-6` 32px · `--space-7` 48px.

Rough intent: `1–2` inside a component, `3` between siblings, `5` between
blocks, `6–7` between page sections.

Other shape tokens: `--radius` (4px), `--page-width` (800px), `--page-padding`.

## Adding things

**A project** — copy a `.tree-item` in `projects/index.html`: an `<a>` holding
the `.tree-name` and a `.meta` `-> domain/path`, a `<p>` describing it, and an
optional `.tag-list`. Position in the list is the only ordering; the branch line
redraws itself.

**A blog post** — add `blog/<slug>.html` using an existing post as the template
(`.post-header` with the `cd ..` prompt, `h1`, `.meta` date, then `.prose` with
`.section`/`.subsection` blocks), then add a `.tree-item` to `blog/index.html`
with the title, the `filename — date` meta line, and an excerpt.

**A page** — a new directory with an `index.html` following the skeleton above,
plus a link from the home page's `ls` output.

## Rules

1. Load `/styles.css` and `/scripts/lights.js` on every page.
2. Render the `#theme-toggle` / `#theme-text` block on every page, so the
   control is always in the same corner.
3. Page-local `<style>` is for genuinely one-off things only (e.g. the ASCII
   banner on the home page). Anything a second page could want goes in
   `styles.css`.
4. No literal colors, font sizes or pixel margins in markup — use tokens.
5. Links are plain text that brighten and underline on hover; don't restyle
   them per page.
6. Keep the terminal fiction described above.

## Running it

No build, no dependencies. Serve the directory and open it:

```sh
python3 -m http.server 8000
```

Pushing to `main` deploys.

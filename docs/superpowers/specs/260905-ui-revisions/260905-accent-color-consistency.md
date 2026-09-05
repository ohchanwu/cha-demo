# Accent color consistency with production

**Source:** Ray, 2026-09-01 21:51, with four screenshots of the demo at
`https://ohchanwu.github.io/cha-demo/index.html`.

> i just checked the demo version again and some of the colors changed.
> could we make the red color in screenshot 2, 3, and 4 the same as the color on the front page

"The front page" means the live production site at `https://chaphysicaltherapy.com/`, not the
demo's own hero. The demo has drifted to a brighter red than production uses anywhere.

## Production palette, measured

Sampled computed styles on `/`, `/treatments`, and `/pricing`:

| Hex | Token in demo | Where production uses it |
|---|---|---|
| `#d49378` | none, literal | hero `at ease.` only, one element sitewide |
| `#8e5c42` | `--preview-clay-dark` | all emphasis text: `Evidence-based…`, `Grade A`, `87%`, `73%` |
| `#b8826b` | `--preview-clay` | panel and block backgrounds |

`#d85a33` does not appear anywhere on production. It is the demo-only `--cha-bright-500`,
introduced when the 260824 brief asked for "the full-strength Volcano color" on items 2, 8,
and 10. That interpretation produced a color outside the brand palette, which is what Ray is
reacting to.

## Current demo vs production

| Screenshot | Element | Demo | Production | Action |
|---|---|---|---|---|
| 1 | hero `at ease.` | `#d49378` | `#d49378` | none, already matches |
| 2 | philosophy sentence | `#8e5c42` | `#8e5c42` | none, already matches |
| 2 | philosophy panel background | `#dabeb2` | `#b8826b` | confirm with Ray, see below |
| 3 | `Grade A` `87%` `73%` | `#d85a33` | `#8e5c42` | change |
| 4 | `Start` in CTA | `#d85a33` | black, no accent | change, see below |

## Items

### 1. Homepage (`/`), evidence metrics

`site/preview.css:1316`. Change `.home-stats strong` from `var(--cha-bright-500)` to
`var(--preview-clay-dark)`. Covers `Grade A`, `87%`, `73%`, and any later metric in that row.

Keep the black headline, body text, dividers, and `Read the research` link unchanged.

### 2. Sitewide closing CTA

`site/preview.css:820`. Change `.accent-copy` from `var(--cha-bright-500)` to
`var(--preview-clay-dark)`.

`.accent-copy` is shared: 37 spans across all 36 pages. This covers `Start` in
`Start your care journey today.` sitewide, and the `These programs are designed to go further.`
sentence on `/packages`. Both move to the production emphasis color together, which is the
sitewide consistency the 260824 brief asked for.

Note production renders this headline fully black with no accent at all. Keeping an accented
`Start` preserves what Ray explicitly requested in 260824 item 8 while fixing the hue. If he
wants a literal production match instead, the span comes out entirely and the headline goes
black. Flagged rather than assumed.

### 3. Retire the off-palette token

Once items 1 and 2 land, `--cha-bright-500` has no remaining consumers. Delete the token at
`site/preview.css:11` so the brighter red cannot creep back in.

### 4. Remove the dead rule

`site/preview.css:659-661` defines `.end h2 em.accent-copy`. No page contains
`<em class="accent-copy">`, so the rule never matches. Delete it.

## Open question: the philosophy panel background

The demo's right-hand panel is `#dabeb2`; production's is `#b8826b` at full strength. The demo
is lighter because 260824 item 1 explicitly asked to "make only the right-panel background
visibly brighter and lighter." Production also still shows the `THE CHA METHOD` eyebrow that
the same item asked to delete.

So screenshot 2 does differ from production, but by Ray's own earlier instruction, and its text
color already matches. Confirm whether he wants that panel reverted to `#b8826b` or kept as the
lighter demo treatment. Do not change it without an answer.

## Contrast

The change improves accessibility rather than costing it. Measured against white:

| Color | Ratio | WCAG AA normal | AA large |
|---|---|---|---|
| `#d85a33` current | 3.87 | fail | pass |
| `#8e5c42` proposed | 5.59 | pass | pass |

The metrics and the CTA move from failing AA for normal text to passing at every size.

## Verification

- Sample rendered pixels for the metrics and CTA on the demo, confirm `#8e5c42`.
- Diff the demo's homepage accent set against production's; only `#d49378`, `#8e5c42`, and
  `#b8826b` should remain.
- Walk the closing CTA on a sample of the 36 pages, not just the homepage.
- Check `/packages`, which carries two `.accent-copy` spans.
- Confirm the hero and the philosophy sentence are visually unchanged.
- Desktop and mobile, no console errors.

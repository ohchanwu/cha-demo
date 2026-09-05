# Accent color consistency

**Source:** Ray, 2026-09-01 21:51, with four screenshots of the demo at
`https://ohchanwu.github.io/cha-demo/index.html`.

> i just checked the demo version again and some of the colors changed.
> could we make the red color in screenshot 2, 3, and 4 the same as the color on the front page

All four screenshots are the homepage. The demo was shipping three different warm accents below
the hero, so "some of the colors changed" is accurate.

## Decision

The site standardizes on **one accent, `#d49378`**, the value the hero already used for
`at ease.`. `--preview-clay` now carries that value, and every accent resolves through the
token rather than through a literal.

This was chosen over matching the production palette. For the record, production at
`https://chaphysicaltherapy.com/` uses `#8e5c42` for emphasis text and reserves `#d49378` for
the hero alone; the demo deliberately runs lighter and warmer throughout.

## Palette

| Token | Value | Role |
|---|---|---|
| `--preview-clay` | `#d49378` | the accent: hero, metrics, `.accent-copy`, dividers, `em` |
| `--preview-clay-dark` | `#8e5c42` | secondary emphasis: the philosophy sentence, nav current-page, hover states |

`--cha-bright-500` (`#d85a33`) is deleted. It entered when the 260824 brief asked for
"the full-strength Volcano color", which produced a red outside the brand palette. It must not
return; the guard script enforces its absence.

## What changed

| Element | Selector | Before | After |
|---|---|---|---|
| hero `at ease.` | `.home-hero h1 em` | `#d49378` literal | unchanged |
| philosophy sentence | `.home-philosophy-copy p span` | `--preview-clay-dark` | unchanged |
| `Grade A` `87%` `73%` | `.home-stats strong` | `--cha-bright-500` | `var(--preview-clay)` |
| `Start` in CTA | `.accent-copy` | `--cha-bright-500` | `var(--preview-clay)` |
| dead rule | `.end h2 em.accent-copy` | matched no markup | deleted |

`.accent-copy` is shared: 37 spans across all 36 pages. It covers `Start` in
`Start your care journey today.` sitewide and the `These programs are designed to go further.`
sentence on `/packages`.

## Knock-on effects of retokening `--preview-clay`

`--preview-clay` is aliased by `--warm`, `--gold`, `--accent`, and `--cha-clay-500`, and has
seven other direct consumers. Moving it from `#b8826b` to `#d49378` also moved:

- the homepage method panel background, `color-mix(--preview-clay 52%, white)`, from `#dabeb2`
  to roughly `#e9c7b9`;
- the divider bars under `.statement` and `.headline`;
- the `.pricing-toggle` and `.reset-link` underlines;
- the generic `em` color in headings.

These are accepted. If the panel ever needs to hold still while the accent moves, introduce a
separate `--preview-clay-light` for the accent and leave `--preview-clay` as the background
clay, rather than reverting the token.

## Contrast

`#d49378` measures 2.55:1 on white, below the WCAG AA floor of 4.5 for normal text and 3.0 for
large text. `#8e5c42`, still used for the philosophy sentence, measures 5.59:1 and passes.

The accent is applied to display type at 36px and above, where the practical legibility cost is
smaller than the ratio suggests, and to the hero, which sits on video rather than white. This is
a deliberate brand choice, recorded here so it is not re-raised as a defect or silently
"fixed" later.

## Guards

`scripts/verify-static-site.mjs` encodes this decision and runs in the Pages deploy. It asserts:

- `--cha-bright-500` is absent from the stylesheet;
- `.home-stats strong` resolves through `var(--preview-clay)`;
- `.accent-copy` resolves through `var(--preview-clay)`;
- `.home-method-panel` still mixes its background from `var(--preview-clay)`.

**Any future palette change must update this script in the same commit.** These guards
previously encoded the superseded 260824 requirement and failed the deploy when the CSS moved
without them. Run `node scripts/verify-static-site.mjs` locally before pushing; a green browser
check is not a substitute.

## Open question

The homepage method panel is now `#e9c7b9`, lighter and pinker than production's `#b8826b`. The
demo has diverged here since 260824 item 1 asked to "make only the right-panel background
visibly brighter and lighter", and the retoken pushed it further.

Ray had this panel on screen in screenshot 2 and raised only the red text, so the working
assumption is that he is content with it. Worth one confirmation, not a blocker.

## Verification performed

- All 36 pages walked: every `.accent-copy` computes to `rgb(212, 147, 120)`, no deviations.
- `/packages` carries two `.accent-copy` spans; both correct.
- Homepage warm-accent set is `#d49378` and `#8e5c42` only.
- Hero and philosophy sentence visually unchanged.
- Desktop 1440 and mobile 375, no console errors.
- `node scripts/verify-static-site.mjs` passes.

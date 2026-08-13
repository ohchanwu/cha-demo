# Cha Site Reference Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:executing-plans` to implement this
> plan task-by-task. Steps use checkboxes for progress tracking.

**Goal:** Replace the internal page directory with the approved patient-facing homepage and make all
36 static pages share the supplied editorial design, navigation, contact details, responsive behavior,
and demo-safe interactions.

**Architecture:** Keep the dependency-free static architecture. Static HTML owns content and the
no-JavaScript shell; `site/preview.css` owns shared presentation; `site/preview.js` owns progressive
enhancement for route state, the mobile menu, media reveal, and form blocking; the existing Node
verifier enforces the published contract. No framework, package manager, generator, or runtime
dependency is added.

**Tech Stack:** HTML5, CSS, browser JavaScript, Node.js standard library, gstack `/browse`.

**Spec:** [`docs/specs/260814-cha-site-reference-refresh.md`](../../specs/260814-cha-site-reference-refresh.md)

## Global Constraints

- Preserve the exact 36-page manifest and existing visible page copy except where the spec explicitly
  changes it.
- Use `(646) 718-6201` and `tel:+16467186201`; do not publish the boss-supplied replacement number.
- Keep every local URL relative so GitHub Pages project-path hosting works.
- Keep all forms side-effect-free. No submission, analytics, payment, deployment, or PR work; only
  the product-owner-authorized final push is in scope.
- Keep the supplied files under `docs/reference/` unchanged and untracked.
- Scope the media fade to content media, never the wordmark or interface icons.
- Commit locally at green checkpoints. The product owner authorized the final push on 2026-08-14.

## Design Direction

The subject is a calm, evidence-led NoMad physical-therapy practice. The page's job is to reassure a
prospective patient, explain the method, and make booking feel clear rather than sales-heavy.

- **Color tokens:** white `#ffffff`, ink `#121212`, clay `#b7684f`, paper `#f4f1ec`, muted ink
  `#68635f`, and rule `#d8d2cc`.
- **Type roles:** Helvetica Neue/Helvetica for display and body, with weight, scale, and spacing—not a
  second decorative face—creating hierarchy. Compact uppercase labels are the utility role.
- **Layout:** wide editorial splits alternate copy and treatment media; evidence uses a measured
  three-column rhythm; a full clay method panel interrupts the white field.
- **Signature:** the clay method panel connected to full-bleed treatment imagery. This is specific to
  the supplied Cha reference and should not be replaced by generic cards, gradients, or pill-heavy UI.

```text
Desktop                             Mobile
┌──────── header ───────────────┐   ┌── wordmark ── menu ──┐
│ full-bleed motion + statement │   │ full-bleed motion     │
├──── philosophy ────┬── clay ─┤   ├ philosophy            ┤
├──────── evidence columns ─────┤   ├ clay method           ┤
├──── media ─────────┬── copy ──┤   ├ evidence              ┤
├── alternating program splits ─┤   ├ media / copy stacks   ┤
├──── pricing ───────┬ reviews ─┤   ├ pricing / reviews     ┤
└──── CTA + contact footer ─────┘   └ CTA + contact footer  ┘
```

The design brief already pins the commonly generic warm editorial palette, so the differentiator is
the reference's treatment-specific media sequence, clinical evidence cadence, and restrained clay
emphasis—not added ornament.

---

## Task 1: Turn the approved requirements into an executable static contract

**Files:**

- Modify: `scripts/verify-static-site.mjs`
- Test: `scripts/verify-static-site.mjs`

- [x] Run `node scripts/verify-static-site.mjs` and record the 36-page green baseline.
- [x] Add assertions for the exact page count, shared CSS/JS, header, eight navigation destinations,
  menu button, final CTA, white contact footer, live phone, and forbidden root-relative URLs.
- [x] Add focused assertions for the homepage replacement, required credentials/copy, forbidden
  Hunter/filler text, content-image limits, and form-prevention/media-fade markers.
- [x] Run the verifier and confirm it fails against the current implementation for the named missing
  contracts, not for a syntax error.
- [x] Mutation-check one assertion by temporarily weakening its fixture target, confirm the verifier
  catches the break, then restore the production target.
- [x] Do not commit a red checkpoint; continue to Task 2.

## Task 2: Implement shared progressive enhancement and responsive presentation

**Files:**

- Modify: `site/preview.js`
- Modify: `site/preview.css`
- Test: `scripts/verify-static-site.mjs`

- [x] In `preview.js`, preserve route rewriting, active-link state, and capture-phase form blocking.
- [x] Add one mobile-menu controller for `.nav`, `.nav-links`, and `.menu-toggle`: synchronize
  `aria-expanded` and the Open/Close label; close on link selection, Escape, and resize above 880px;
  lock body scrolling only while open.
- [x] Add the exact media-load-fade contract: put `media-fade-enabled` on `<html>` from JavaScript;
  for scoped `main img`/`main video`, handle cached media, `decode()`, ready state, load, and error;
  reveal errors with `is-media-error`.
- [x] In `preview.css`, add the compact desktop header, 880px mobile panel, visible focus, shared CTA,
  white contact footer, overflow-safe grids, and reduced-motion media rules.
- [x] Ensure every hidden-media selector begins with `.media-fade-enabled`; without JavaScript,
  content media must remain visible.
- [x] Run `node scripts/verify-static-site.mjs`; expected result remains red only for HTML/content work.

## Task 3: Apply the shared static shell to all 36 pages

**Files:**

- Modify: `site/*.html` (all 36 published pages)
- Test: `scripts/verify-static-site.mjs`

- [x] Replace each page's navigation with the exact relative eight-destination shell from the spec,
  including the menu button and static wordmark link.
- [x] Keep `aria-current="page"` as progressive state supplied by `preview.js`; do not hard-code a
  false active link on the homepage.
- [x] Replace every closing shell with the exact `Start your care journey today.` CTA to
  `./book.html`, then a white footer containing the clinic name, address, hours, live phone, both
  verified privacy-policy links, and `© 2026`.
- [x] Remove `.draft-badge` output and page-local menu scripts while preserving page-local content.
- [x] Run the verifier; expected failures are limited to homepage and named page-specific content.

## Task 4: Replace the directory page with the approved homepage

**Files:**

- Modify: `site/index.html`
- Modify only if homepage gaps require shared rules: `site/preview.css`
- Test: `scripts/verify-static-site.mjs`

- [x] Adapt `docs/reference/index.html` into the existing shared shell; remove its inline menu/form
  scripts and all `/static/...` or production-route navigation paths.
- [x] Preserve the required order: hero, philosophy/method, evidence, clinic space, three programs,
  pricing, reviews, shared CTA, footer.
- [x] Use the exact copy and action map from the spec. Remove primary-heading eyebrow labels and the
  old “Complete website preview”/“Every page” directory copy.
- [x] Map local media to `./schroth-hero.jpg`, `./assets/acupuncture-hero-closeup.png`, and
  `./assets/vien-le-wood-review.png`; map the six remaining media items to their exact production URLs.
- [x] Keep poster fallbacks, useful alt text, lazy-loading below the fold, and decorative-media
  semantics from the spec.
- [x] Run the verifier; expected failures are limited to named interior-page requirements.

## Task 5: Apply the named page-specific copy and layout repairs

**Files:**

- Modify: `site/research.html`, `site/about.html`, `site/pricing.html`, `site/book.html`
- Modify: `site/in-person-care.html`, `site/acupuncture.html`
- Modify: `site/schroth.html`, `site/scoliosis.html`, `site/pelvic-floor.html`
- Modify: `site/tmj.html`, `site/botox.html`, `site/manual-therapy.html`, `site/post-surgical.html`
- Modify: `site/hypermobility.html`, `site/postural-restoration.html`
- Modify: `site/plantar-fasciitis.html`, `site/pain-management.html`
- Modify only as necessary for shared layouts: `site/preview.css`
- Test: `scripts/verify-static-site.mjs`

- [x] Make only the copy, credential, CTA, image-count, crop, and width changes enumerated in the
  spec; preserve all unrelated normalized visible text.
- [x] Keep the already-current `$300` initial evaluation, `$250` follow-up, and Good Faith Estimate.
- [x] Remove Hunter College and filler-specific text, while retaining the exact NYU, DPT,
  Schroth-certified, board-certified, and modern-care statements.
- [x] Enforce zero supplemental content images on the six no-image pages and one-image maximums on
  Schroth and pelvic floor, excluding the wordmark.
- [x] Run `node scripts/verify-static-site.mjs`; expected result: `Verified 36 HTML files ...` with
  exit code 0.
- [x] Run `git diff --check`, review the cumulative diff, stage implementation files, run
  `gitleaks git --staged --redact --no-banner`, and commit locally.

## Task 6: Verify the patient path and responsive UI

**Files:**

- No product edits unless a verified defect requires returning to the relevant task.
- Store screenshots and raw QA evidence under a temporary directory, never tracked.

- [x] Start the documented static server headlessly with
  `python3 -m http.server 8000 --bind 127.0.0.1 -d site`.
- [x] With `/browse`, click all eight homepage navigation destinations and representative page CTAs;
  verify the expected destination heading/content rather than only status codes.
- [x] Submit the booking form and confirm the visible demo-only message appears with no network
  mutation.
- [x] Exercise the mobile menu by button, link selection, Escape, and resize; verify focus visibility
  and synchronized accessible state.
- [x] Walk all 36 pages at widths 360, 390, 768, 1024, and 1440. At each width check horizontal
  overflow, clipped text, overlapping controls, missing media, and console errors.
- [x] Capture and visually inspect screenshots at mobile and desktop sizes. Also inspect homepage
  program transitions, all named split layouts, pricing, booking, and single-image crops.
- [x] Verify the production media and legal/review destinations in `/browse` by matching the expected
  Cha asset or destination content. Report any credential, rate-limit, or reachability gap honestly.

## Task 7: Close the documentation lifecycle and final verification

**Files:**

- Move: `docs/superpowers/plans/260814-cha-site-reference-refresh-implementation.md` to
  `docs/superpowers/archive/260814-cha-site-reference-refresh-implementation.md`
- Modify: `docs/superpowers/README.md`
- Modify if implementation changes architecture: `docs/architecture.md` (only if it exists)

- [x] Mark all completed plan checkboxes, move the plan to the tracked archive, and update the index.
- [x] Run `node scripts/verify-static-site.mjs` and `git diff --check` from a clean server-independent
  state.
- [x] Inspect the complete staged diff for credentials, personal/healthcare data, unnecessary
  production detail, accidental reference files, and scope drift.
- [x] Run `gitleaks git --staged --redact --no-banner`; stop rather than suppress a real finding.
- [x] Commit the documentation closure locally. Confirm `docs/reference/` remains the only intended
  untracked input, then push the completed commits as authorized.

## Execution Results

- `node scripts/verify-static-site.mjs` passed with 36 HTML files and 41 published files.
- All 36 pages passed `/browse` at 360, 390, 768, 1024, and 1440 pixels with no horizontal overflow,
  missing primary heading, duplicate menu control, or console error.
- Every final CTA reached the booking page; the booking form showed the preview-only message and made
  no network request.
- Homepage production media loaded in the browser with the expected intrinsic dimensions or playable
  video state. The live privacy destination rendered the Cha Privacy Policy.
- The identity-specific Google review destination came from the live Cha site, but Google returned an
  automated-traffic challenge during final verification. Its rendered destination content therefore
  remains externally unverified; no success claim is made for that check.

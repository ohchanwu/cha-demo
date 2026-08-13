# Cha Static Site Reference Refresh

Status: Draft for review

Scope: Specification only; implementation is intentionally deferred

Verified against repository state: 2026-08-14
Primary inputs:

- `docs/reference/CHA_WEBSITE_IMPLEMENTATION_SPEC_FOR_TY.md`
- `docs/reference/index.html`
- `docs/reference/README.md`

## Context

The repository is a dependency-free GitHub Pages demo. It currently publishes 36 HTML files from
`site/`: one index page and 35 content pages. The existing verifier passes with 41 published files.

The boss-supplied packet establishes the next visual and content direction, but it is not directly
deployable in this repository:

- `docs/reference/index.html` contains 31 root-relative references that fail the GitHub Pages
  project-path verifier.
- `docs/reference/README.md` mentions `cha-first-design-pages/` and `assets/` contents that are not
  present in the packet. The target repository already contains the 35 interior pages and the three
  supplied replacement images, so no missing directory should be recreated.
- The reference homepage loads a nonexistent `cha-first-design-pages/preview.js`; the target already
  has `site/preview.js` for local route rewriting and demo-safe form handling.

The reference implementation brief is authoritative when it conflicts with the prototype homepage.
The prototype supplies visual structure and homepage content. Existing page copy remains unchanged
unless the implementation brief explicitly replaces or removes it.

## Objective

Update the static demo so its homepage and all 35 content pages present one approved editorial design
system, preserve the current no-build architecture, and remain safe to publish as a non-submitting
demo.

Success means a visitor can enter through the real homepage, navigate every page on mobile or
desktop, read the approved content without layout failures, and never trigger a real booking or data
mutation from the demo.

## Chosen Approach

Adapt the reference material into the existing static architecture:

1. Replace the current all-pages directory at `site/index.html` with the approved homepage.
2. Extend `site/preview.css` and `site/preview.js` for shared visual, navigation, media, and demo-safety
   behavior.
3. Keep static header, footer, and CTA markup in each HTML file so navigation and legal information
   remain available without JavaScript.
4. Make only the page-specific markup and copy changes named below.
5. Extend the existing Node verifier instead of adding a package manager, framework, templating
   system, or test dependency.

Rejected approaches:

- Copying the reference folder wholesale. It is incomplete and fails the current project-path rules.
- Adding a static-site generator or client-side shell injection. Both add machinery to a site that
  currently needs none, and shell injection would hide navigation when JavaScript fails.

## Current State

- `site/index.html:6-80` is an internal design-page directory, not the approved public homepage.
- `site/preview.css:1-50` already defines the approved white, ink, clay, divider, and Helvetica
  tokens.
- `site/preview.css:105-165` styles a desktop navigation bar, but none of the 36 pages contains a
  mobile menu button.
- `site/preview.css:615-688` already forces the final CTA and footer onto a white background.
- `site/preview.js:1-76` maps production-style routes to local HTML pages and applies active-page
  state.
- `site/preview.js:78-90` prevents every demo form submission and displays “Preview only. Nothing
  was submitted.” Preserve this behavior.
- All 36 pages load `preview.css` and `preview.js`; 35 pages also load production-hosted CSS and
  JavaScript.
- No page currently uses the required final CTA heading “Start your care journey today.”
- `site/about.html:173` still mentions Hunter College.
- `site/pricing.html:282-338` already includes the current $300 initial evaluation, $250 follow-up,
  and Good Faith Estimate content.
- The target already contains `site/assets/acupuncture-hero-closeup.png`,
  `site/assets/vien-le-wood-review.png`, and `site/schroth-hero.jpg`.
- `node scripts/verify-static-site.mjs` currently passes: 36 HTML files and 41 published files.

## Scope

### Public page manifest

Keep exactly one homepage plus these 35 content pages:

- Main pages: `about.html`, `book.html`, `dr-cha.html`, `in-person-care.html`, `method.html`,
  `our-space.html`, `packages.html`, `pain.html`, `pricing.html`, `providers.html`, `research.html`,
  `treatments.html`, `visit.html`, and `who-we-treat.html`.
- Treatments and programs: `acupuncture.html`, `botox.html`, `hypermobility.html`,
  `manual-therapy.html`, `pain-management.html`, `pelvic-floor.html`, `pelvic-pain.html`,
  `post-surgical.html`, `postpartum.html`, `postural-restoration.html`, `schroth.html`,
  `scoliosis.html`, and `tmj.html`.
- Pain pages: `elbow-pain.html`, `hip-pain.html`, `knee-pain.html`, `low-back-pain.html`,
  `neck-pain.html`, `plantar-fasciitis.html`, `sciatica.html`, and `shoulder-pain.html`.

Do not create a public `all-pages.html` route. The current directory-style homepage is removed, not
relocated.

## Requirements

### 1. Source precedence

Use this order when sources disagree:

1. `docs/reference/CHA_WEBSITE_IMPLEMENTATION_SPEC_FOR_TY.md`
2. `docs/reference/index.html`
3. Existing `site/*.html` content

Examples:

- Use “Start your care journey today.” rather than the prototype’s “Ready to start your care?”
- Remove small eyebrow labels above primary headings even where the prototype still shows them.
- Preserve existing body copy unless the implementation brief names a replacement or removal.

### 2. Site-wide visual system

Apply the existing shared tokens consistently across all 36 pages:

- Base: `#FFFFFF`
- Primary text: `#1E1B18`
- Accent: `#B8826B`
- Secondary text: approximately `#7A706A`, adjusted darker where needed to meet WCAG AA contrast
- Divider: `#E7E3DE`
- Optional surface: `#F7F5F2`, used sparingly and never as the Evidence page background
- Typeface: Helvetica Neue, Helvetica, Arial, sans-serif

Headings are bold, tightly spaced, and editorial. Body text uses normal weight and readable contrast.
Clay is limited to selected phrases, active navigation, and small emphasis. Do not color full pages or
long paragraphs clay.

For measurable review:

- normal body and study-summary text is 16-20px with line-height at least 1.45;
- study-card headings are 20-32px;
- clay may color one inline phrase per heading or the one explicitly approved sentence, never a full
  body paragraph; and
- non-visual sections use 56-88px vertical padding on mobile and 64-128px on desktop. Intentional
  full-height hero, clinic-space, and clinician-profile blocks are exempt.

Use thin, straight rules for editorial grouping. Rounded containers are limited to buttons, price
disclosures, and accordions. Primary buttons are pill-shaped with ink backgrounds and white text.

Remove `.draft-badge` output from public pages. Remove dark footer panels and eyebrow labels placed
above primary headings.

### 3. Shared header and navigation

Every page, including the homepage, must render the same static header markup:

- Logo -> `./index.html`
- Treatments -> `./treatments.html`
- Pain -> `./pain.html`
- Programs -> `./packages.html`
- Team -> `./about.html`
- The Cha Method -> `./method.html`
- Evidence -> `./research.html`
- Pricing -> `./pricing.html`
- Book a session -> `./book.html`

Use relative paths so the site works beneath a GitHub Pages project path. Do not copy `/static/...` or
root route URLs from the reference homepage into local navigation.

The active page link is clay and carries `aria-current="page"`. The homepage has no falsely active
content-page link.

At widths above 880px, keep the compact single-row header. At 880px and below, show a real menu
button with `aria-controls`, a synchronized `aria-expanded` value, and an Open/Close navigation label.
The menu must:

- open and close by button;
- close after a navigation link is selected;
- close on Escape;
- close when resizing above the mobile breakpoint;
- prevent background scrolling while open; and
- preserve visible keyboard focus.

Implement this once in `site/preview.js`; do not add page-local menu scripts.

### 4. Shared final CTA and footer

Every page ends with the exact CTA heading:

> Start your care journey today.

The CTA links to `./book.html` and uses the shared white editorial treatment.

Every footer has a white background and includes:

- Cha Physical Therapy
- 16 W 32nd St, Suite 1007, NoMad, New York 10001
- Monday-Friday, 9am-7pm
- `(646) 718-6201` linked with `tel:+16467186201`
- Privacy and HIPAA as real links
- `© 2026`

Both Privacy and HIPAA link to the verified live policy at
`https://www.chaphysicaltherapy.com/privacy-policy`. `/browse` returned the expected Cha Physical
Therapy Privacy Policy on 2026-08-14; `/privacy` and `/hipaa` returned 404 and must not be used.

The boss-supplied homepage uses `(646) 979-9769`, while the live pricing page showed
`(646) 718-6201` on 2026-08-14. Per the product owner's decision, this demo keeps the currently live
number and does not publish the boss-supplied replacement yet.

### 5. Responsive layout

- Use fluid type and spacing with `clamp()`.
- Use `min-width: 0` on grid children and responsive `minmax(0, 1fr)` tracks.
- Keep normal body copy between 45 and 65 characters per line where layout permits.
- Collapse split layouts into logical single-column reading order on small screens.
- Use mobile-safe viewport units for intentional full-height editorial and profile sections.
- Use `object-fit: cover` with explicit focal positioning for faces, hands, and treatment action.
- Do not allow horizontal scrolling, overlap, clipping, or one-word-wide text columns.
- Remove accidental full-screen blank space. Full-height sections are reserved for intentional visual
  moments.

Use the existing layout vocabulary rather than inventing page-specific systems: split hero,
editorial split, full-width statement, image-led section, and team profile.

A face-safe crop keeps the full forehead, eyes, nose, mouth, and chin visible with at least 5% of the
image box remaining above and below the face. The Schroth crop keeps the full prone subject visible in
the right half. The acupuncture crop keeps the hand and needle action visible. These rules replace a
subjective “looks right” judgment.

### 6. Content media loading

Add the shared progressive media fade to content media only, using `main img, main video` as the
scope. Do not fade the navigation wordmark, icons, or sprites.

The implementation must include all of these behaviors:

- JavaScript adds `media-fade-enabled` to `<html>` before CSS may hide content media.
- Cached images use `complete && naturalWidth > 0` and call `decode()` before reveal.
- Image decode rejection still reveals the image.
- Image errors add `is-media-error` so broken media never remains invisible.
- Videos reveal immediately at `readyState >= 2`, otherwise on `loadeddata`; video errors also reveal.
- `prefers-reduced-motion: reduce` disables the transition.
- Without JavaScript, all media remains visible.

### 7. Homepage

Replace `site/index.html` with an adaptation of `docs/reference/index.html`, retaining this order:

1. Hero: “Move through the world at ease.” with Book a session and Cha Method actions.
2. Philosophy: “Naturally. Scientifically.” with this exact copy: “For people who want to heal at the
   source, not just manage the symptom. Hands-on physical therapy that works with the body's own
   recovery process. Evidence-based and often more effective, and meaningfully less expensive than
   surgery or long-term medication.” Only the final sentence is clay.
3. Clay method panel: “Your body. Hands and breath.” without the “01” label.
4. Evidence: “Care supported by what works.” with these three supplied evidence statements:
   - “Grade A. Physical therapy is the first-line clinical recommendation for most musculoskeletal
     pain. Ahead of medication. Ahead of surgery.”
   - “87%. Reduction in opioid prescription risk when low-back-pain patients see a physical therapist
     first. Across 150,000-plus patients.”
   - “73%. Documented cure rate for stress urinary incontinence with pelvic floor physical therapy
     alone. No drugs. No surgery.”
5. Clinic-space media: “Explore your treatment area.”
6. Programs: “Three paths into the same method.” followed by Schroth, pelvic floor, and acupuncture.
7. Pricing: “Simple, clear care.” with initial evaluation and follow-up summaries.
8. Reviews: “Care people remember.” with Vien Le Wood first, then Nicolas Eccles and Bruna Amajones.
9. Shared final CTA and footer.

Homepage action links are fixed:

- hero Book a session -> `./book.html`
- hero and method-panel Cha Method actions -> `./method.html`
- Evidence -> `./research.html`
- clinic space -> `./in-person-care.html`
- Schroth -> `./schroth.html`
- pelvic floor -> `./pelvic-floor.html`
- acupuncture -> `./acupuncture.html`
- Pricing -> `./pricing.html`
- review summary -> the approved Google review destination

Use `site/assets/vien-le-wood-review.png` for Vien Le Wood. Use `site/schroth-hero.jpg` and
`site/assets/acupuncture-hero-closeup.png` for those homepage program images. Use these exact
production URLs for media not supplied locally, after verifying each in `/browse`:

- `https://www.chaphysicaltherapy.com/static/images/treatments/pelvic_cover_new.png`
- `https://www.chaphysicaltherapy.com/static/images/landing/reviews/nicolas.webp`
- `https://www.chaphysicaltherapy.com/static/images/landing/reviews/bruna.webp`
- `https://www.chaphysicaltherapy.com/static/images/video-posters/landing-first-frame.webp`
- `https://www.chaphysicaltherapy.com/static/videos/landing_trimmed_hevc3MB.mp4`
- `https://www.chaphysicaltherapy.com/static/videos/landing_trimmed_h264_8MB.mp4`
- `https://www.chaphysicaltherapy.com/static/images/video-posters/our-space-first-frame.webp`
- `https://www.chaphysicaltherapy.com/static/videos/our-space-hero-new-HVEC-8bit.mp4`
- `https://www.chaphysicaltherapy.com/static/videos/our-space-hero-new-H264-8bit.mp4`

Do not copy prototype `/static/...` paths. Do not create or reference `cha-first-design-pages/`.

Media-to-section mapping is fixed:

- hero video -> landing poster plus HEVC and H.264 landing sources;
- clinic-space video -> clinic-space poster plus HEVC and H.264 clinic-space sources;
- program cards -> local Schroth image, production pelvic image, local acupuncture image;
- review portraits -> local Vien image plus production Nicolas and Bruna images.

Remove the homepage’s primary-heading eyebrow labels. Keep restrained clay emphasis and eliminate
the excess vertical gaps called out in the brief. Program media must meet adjacent sections without
white seams.

### 8. Page-specific changes

#### Evidence: `site/research.html`

- Remove “By the evidence.”
- Keep the page white.
- Reduce oversized headings and study-card type to normal reading proportions.
- Use clay only for selected conclusions.
- Reduce excessive section gaps.
- Keep statistics and summaries inside their containers at every target width.

#### Team: `site/about.html`

- Keep full-height responsive clinician profiles.
- Place professional title and credentials immediately below each name.
- Replace Dr. Cha’s credential copy with: “PT, DPT. Schroth C2 (Level 2) certified, 2011.”
- Remove every Hunter College reference.
- Use the page CTA “One method. One standard.” before the shared final CTA.

#### Pricing: `site/pricing.html`

- Use an editorial heading-left/details-right split.
- Keep the $300 initial evaluation and $250 follow-up values. `/browse` verified both on the live
  pricing page on 2026-08-14. Recheck if implementation occurs after the boss-supplied packet changes.
- Preserve the Good Faith Estimate section and its non-promissory wording.

#### Booking: `site/book.html`

- Increase intro weight and contrast.
- Move the form earlier in the first viewport by reducing the gap below the intro.
- Preserve the demo-only submission block. Do not add an `action`, API call, analytics mutation,
  Stripe flow, or booking integration.

#### In-person care: `site/in-person-care.html`

- Use “A healing space dedicated to your body.”
- Remove “Come experience it.”
- Remove tinted statistic backgrounds.
- Use normal-width editorial text rather than narrow centered columns.

#### Acupuncture: `site/acupuncture.html`

- Use “Advanced acupuncture, modernized.”
- Use `site/assets/acupuncture-hero-closeup.png` as the hero.
- Do not repeat “advanced” in nearby headings or homepage program copy.

#### Schroth and scoliosis: `site/schroth.html`, `site/scoliosis.html`

- Use `site/schroth-hero.jpg` as the Schroth hero, with the subject positioned toward the right.
- Remove the secondary treatment image while preserving the navigation wordmark.
- Use: “Every Schroth case at the clinic is led by a Level 2 Schroth-certified clinician.”
- Remove every Hunter College reference.
- Prefer Level 2-certified, specialized, and three-dimensional over repeated “advanced.”

#### Pelvic floor: `site/pelvic-floor.html`

- Present specialized, modern pelvic care.
- Use a full-height image/text split with enough text width and a face-safe crop.
- Remove the lower supplemental image while preserving the navigation wordmark.

#### TMJ: `site/tmj.html`

- Move the hero focal point upward so the full head and face remain visible.
- Add thin straight rules to the two-column text sections.

#### Botox: `site/botox.html`

- Keep the page about Botox only.
- Remove filler positioning and filler-specific copy.
- Do not include Dr. Park’s profile or biography.

#### Manual therapy: `site/manual-therapy.html`

- Remove the lower supplemental image while preserving the navigation wordmark.
- Set “Leave different.” in clay.

#### Post-surgical care: `site/post-surgical.html`

- Remove the hero image while preserving the navigation wordmark.
- Replace repetitive centered sections with alternating left/right editorial layouts.

#### Supplemental-image and width repairs

Verify that supplemental content images are absent from `hypermobility.html`,
`postural-restoration.html`, `plantar-fasciitis.html`, and `pain-management.html`. Do not remove the
shared wordmark when a page has no remaining content image.

Repair narrow text columns on `method.html`, `pain-management.html`, `packages.html`, and any page
that shares the same failing selector. Fix the shared selector in `preview.css`, not each symptom
individually.

### 9. Demo routing and safety

- Keep the site dependency-free and usable from `python3 -m http.server 8000 -d site`.
- Keep every local route and asset project-relative.
- Preserve `preview.js` production-to-local route mapping for existing absolute production links.
- Preserve active-page state after route rewriting.
- Preserve capture-phase prevention for every form submission.
- Do not add cookies, analytics, network mutations, payment behavior, or production booking behavior.
- External links must remain external and must not be rewritten to local pages.

### 10. Accessibility

- Keep one meaningful H1 per page and a logical heading hierarchy.
- Preserve or improve descriptive alt text for content images; decorative media uses empty alt text or
  `aria-hidden="true"` as appropriate.
- Ensure all controls and links are keyboard reachable with visible focus.
- The mobile navigation is operable by keyboard and screen-reader state is synchronized.
- Normal text and controls meet WCAG AA contrast.
- Motion honors reduced-motion preferences.

## Files to Change During Implementation

- `site/index.html`: replace the internal directory with the approved homepage.
- `site/preview.css`: shared tokens, shell, responsive layout repairs, content-media fade, and any
  shared page corrections.
- `site/preview.js`: mobile menu behavior, content-media settling, route handling, and preserved form
  safety.
- `site/*.html`: static shared shell and CTA updates plus the named page-specific changes.
- `scripts/verify-static-site.mjs`: add structural regression checks without adding dependencies.
- `README.md`: describe the real homepage and current verification flow; retain the no-build local
  preview instructions.

Do not change `.github/workflows/deploy-pages.yml` unless the existing workflow fails after the site
changes. No deployment change is expected.

## Verification Plan

### Automated checks

Extend `scripts/verify-static-site.mjs` to fail when:

- the manifest is not exactly 36 HTML pages;
- a local URL escapes `site/`, is root-relative, or resolves to a missing target;
- a page lacks `preview.css` or `preview.js`;
- a page lacks the shared header, mobile menu button, final CTA, or footer;
- navigation labels or destinations differ from the approved map;
- a page contains a dark footer treatment or `.draft-badge` output;
- `site/index.html` contains the old “Complete website preview” or “Every page” directory copy;
- the exact required credential and CTA strings are missing;
- a forbidden Hunter College or filler string remains in its named page;
- content-image counts exceed 0 for Manual therapy, Post-surgical, Hypermobility, Postural
  restoration, Plantar fasciitis, or Pain management, excluding the navigation wordmark;
- content-image counts exceed 1 for Schroth or Pelvic floor, excluding the navigation wordmark; or
- `preview.js` no longer contains form-submission prevention.

The dark-footer check inspects `site/preview.css` and requires the shared `footer` rule to resolve to
`--preview-white` with ink or black text. It must reject literal black, brown, or dark background
declarations on `footer` or a page-local footer selector.

Run:

```bash
node scripts/verify-static-site.mjs
```

Also run:

```bash
git diff --check
gitleaks protect --staged --redact --no-banner
```

If Gitleaks is unavailable, stop and report the missing publication gate rather than silently skipping
it.

### Browser QA

Use `/browse` for all browser work. Start the site headlessly with the documented local server; do not
open the user’s default browser.

Use current stable headless Chromium on the development OS. Walk every one of the 36 pages at
390x844, 768x1024, 1024x768, 1440x900, and 1920x1080. Verify:

- `document.documentElement.scrollWidth <= window.innerWidth + 1`;
- no overlap or clipping, and no main body-copy column narrower than 260 CSS pixels at 390px;
- correct image and video focal points;
- consistent header, active state, CTA, and footer;
- mobile menu open, close, Escape, link-selection, resize, and focus behavior;
- content media under cold cache, warm cache, load error, JavaScript disabled, and reduced motion;
- zero console errors on every page;
- the booking form remains on-page and shows “Preview only. Nothing was submitted.” with no POST,
  PUT, PATCH, DELETE, `fetch`, or XHR request. Normal document, stylesheet, script, image, and video
  GET requests are allowed;
  and
- adjacent components sharing changed selectors still render correctly.

Click the logo, every primary navigation destination, and each page’s primary CTA through the real
browser path. Verify that the destination contains the expected page heading, not merely a 200
response, redirect, or generic homepage.

The primary-navigation destination checks are:

- Treatments -> `treatments.html` -> “Find the program that's right for you.”
- Pain -> `pain.html` -> “The pain you came in with. Treated at the source.”
- Programs -> `packages.html` -> “Care built around a goal, not a session count.”
- Team -> `about.html` -> “Meet the team.”
- The Cha Method -> `method.html` -> “Evidence-based physical therapy. Non-surgical. Non-drug.
  Specialist-led.”
- Evidence -> `research.html` -> “The research behind recovery and results.”
- Pricing -> `pricing.html` -> “Hands-on care, end to end. Recovery, not maintenance.”
- Book a session -> `book.html` -> “Start here. Leave different.”

For absolute production media plus Google review, map, Privacy, and HIPAA links, use `/browse` and
verify the destination’s identity and content. An image passes when `naturalWidth > 0`; a video passes
when it reaches `readyState >= 2`; the Google destinations pass only when the rendered page identifies
Cha Physical Therapy at 16 W 32nd St; and the policy passes only when its H1 is “Privacy Policy” and
the body identifies Cha Physical Therapy. The approved review destinations are:

- `https://www.google.com/maps/place/Cha+Physical+Therapy/@40.7474374,-73.9867093,17z`
- `https://www.google.com/search?q=Cha+Physical+Therapy+16+W+32nd+St+New+York+reviews`
- `https://www.chaphysicaltherapy.com/privacy-policy` for both Privacy and HIPAA labels

If an external destination is unavailable, rate-limited, or requires credentials, mark that check
unverified and do not claim release readiness.

Dark-theme testing is not applicable: the approved design is intentionally white-only and has no
theme control.

## Acceptance Criteria

1. `site/index.html` is the approved homepage, and the public manifest remains exactly 36 HTML pages.
2. All 36 pages share the approved header, eight navigation destinations, mobile menu, final CTA,
   white footer, and current contact details.
3. All internal links and assets work under a GitHub Pages project path with no root-relative URLs.
4. All page-specific copy, removal, image, crop, and layout requirements above are satisfied.
5. Existing visible text not explicitly targeted by this spec is preserved after whitespace
   normalization. Markup and whitespace may change for the shared shell or layout, but wording may not.
6. The booking form and any other form make no network request and show the demo-only confirmation.
7. Content media fades only after load/decode, reveals on failure, remains visible without JavaScript,
   and disables transitions for reduced motion.
8. The static verifier, `git diff --check`, and publication-security checks pass.
9. Every page passes the five-width browser sweep with no console errors.
10. Every clicked internal destination shows the expected page content, and every reachable external
    destination matches the source record.
11. No build system, runtime dependency, public all-pages index, production mutation, or deployment
    change is introduced.

## Rollback

This work changes only static files and tests. Revert the implementation commit or commit series. No
database, user data, payment state, or infrastructure rollback is required.

## Effort Estimate

- Homepage adaptation: 3-5 human hours.
- Shared shell, responsive behavior, and media loading: 3-5 human hours.
- Targeted edits across 35 content pages: 5-8 human hours.
- Verifier expansion and full five-width browser QA: 6-10 human hours.
- Total: approximately 17-28 human hours; an automated coding pass may be faster, but the full browser
  sweep remains the dominant cost.

## Out of Scope

- Production application or backend changes
- Real booking, payment, analytics, cookie, or form submission behavior
- A framework, static-site generator, package manager, or runtime dependency
- Downloading or mirroring every production-hosted asset
- A public `all-pages` route
- Dark mode
- New copy, claims, clinicians, services, prices, or legal destinations not authorized by the supplied
  material or verified production source
- GitHub Pages workflow changes, deployment, push, or pull-request creation

## Implementation Preconditions

Before release acceptance, verify these drift-prone facts rather than guessing:

1. The $300 initial evaluation and $250 follow-up prices remain current if the reference packet has
   changed since 2026-08-14.
2. `https://www.chaphysicaltherapy.com/privacy-policy` remains the canonical destination for both
   legal labels.
3. Every absolute production media URL used by the homepage loads the expected Cha asset.

Failure to verify any item blocks release readiness but does not justify inventing replacement data.

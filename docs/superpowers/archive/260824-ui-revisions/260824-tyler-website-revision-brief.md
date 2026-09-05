Hi Ty,

Please make the following final website revisions before your next Git push and production deploy. I listed the exact live page path and the visible copy or section for each change. I also included a ZIP of the source screenshots, renamed in the same order as this list.

Global implementation rules

- "Volcano" means the existing brand Volcano color token already used in the project, at 100% opacity. Reuse that one token everywhere below. Do not create a separate red, brown, or muted variation.
- When removing a section, image, or navigation row, collapse its height so it does not leave an empty block or extra vertical gap.
- Verify every change on desktop and mobile.

1. Homepage (`/`), split "Naturally. Scientifically." and "Your body. Hands and breath." section

- Delete the eyebrow label `THE CHA METHOD` from the top of the right panel.
- Move the right-panel heading `Your body. Hands and breath.` upward so its top edge aligns horizontally with the top edge of the left-panel heading `Naturally. Scientifically.`
- Make only the right-panel background visibly brighter and lighter. Keep its text black, and do not change the white left panel.

2. Homepage (`/`), evidence/statistics section

- Change the accent-colored metric values `Grade A`, `87%`, and `73%` to the full-strength Volcano color. Apply the same treatment to any other metric value in that same row that uses the muted accent shade.
- Keep the black headline, body text, dividers, and `Read the research` link unchanged.

3. Homepage (`/`), full-width treatment-area video and the section immediately after it

- Remove the dark overlay, opacity reduction, or dimming filter from the video so it displays at its natural brightness.
- Center the heading `Explore your treatment area.` both horizontally and vertically over the video.
- Immediately after the video, remove the entire three-item numbered treatment index containing `01 · Schroth Method`, `02 · Pelvic floor`, and `03 · Acupuncture`. Remove the row/container as well so it leaves no blank space.

4. Homepage (`/`), footer identity

- Replace the typed footer text `Cha Physical Therapy` with the official Cha Physical Therapy logo asset.
- Reuse the actual logo source used in the site header, including the correct dark/black variant. Preserve the footer placement and homepage link.

5. Treatments page (`/treatments`), hero headline

- In `Find the program that's right for you.`, increase the word space between `that's` and `right` so the `r` in `right` no longer crowds the end of `that's`.
- Adjust only that word gap. Do not add letter spacing inside `right`, and do not change the headline's font size or intended line breaks.

6. Manual Therapy page (`/manual-therapy`)

- Remove the entire standalone `Leave different.` section shown near the end of the page.
- Collapse the removed section's height so the neighboring sections connect without a large white gap.

7. Botox page (`/botox`)

- Remove the entire large treatment-use list section shown between its top and bottom dividers, including the rows that begin `Botox: jaw clenching and bruxism.`, `Botox: tension headaches.`, `Botox: expression lines.`, `Botox: chin dimpling.`, and `Consultation: no commitment.`
- Preserve the site header and the sections before and after this list.

8. Sitewide closing CTA headline

- On `/hypermobility` and every other page that reuses the headline `Start your care journey today.`, change only the word `Start` to the full-strength Volcano color.
- Keep `your care journey today.` black.
- Implement this in the shared component or sitewide source so all instances stay consistent. Do not recolor unrelated uses of the word `Start` elsewhere.

9. Low Back Pain page (`/low-back-pain`)

- Remove the entire conditions/indications list section shown between its dividers, including the rows that begin `Chronic low back pain.`, `SI joint dysfunction.`, `Disc herniation and radiculopathy.`, `Post-surgical lumbar rehab.`, and `Low back pain in pregnancy and postpartum.`
- Preserve the site header and the sections before and after this list.

10. Programs page (`/packages`)

- In the opening headline paragraph, change exactly `These programs are designed to go further.` to the full-strength Volcano color.
- Keep the preceding sentence `Most care is built around getting you out of pain and then stopping.` black, and keep the following sentence `They combine modalities because bodies don't work in isolation.` black.

11. The Cha Method page (`/method`), first clinic photo

- Remove the first full-width clinic image directly below the header. It is the front-desk/reception photo with the Cha Physical Therapy wall sign.

12. The Cha Method page (`/method`), second clinic photo

- Remove the next full-width clinic image. It shows the plant in the foreground and the patient-file shelves on the right.
- After both images are removed, collapse their image containers and surrounding media spacing so the first content section follows the header cleanly.

13. Homepage (`/`), Google review cards

- Replace the middle card for `Nicolas Eccles` with a card for `Tammy Haque`. Update the review source data so the Nicolas Eccles card is no longer shipped, rather than only hiding it with CSS.
- Use the attached `tammy-haque-google-profile.png` as Tammy's profile image.
- Display name: `Tammy Haque`
- Source label: `Google review`
- Rating: five stars
- Use this review text exactly:

  `Really great place! I come for physical therapy and acupuncture. The therapist and the assistants are very kind and gentle. I was able to improve my posture and my anxiety and I learned some new techniques to continue to improve my health`

- Keep the replacement in the same middle-card position and preserve the existing review-card layout and styling.

14. Sitewide header `Book a session` button

- Keep the button label white in every interactive and route state: default, hover, focus-visible, active/current page, pressed, and visited.
- Keep the button background dark/black unless the existing design intentionally changes it.
- Specifically verify `/book`, where the current-page state now changes the label to the Volcano/red color. It must remain white there as well.

15. Sitewide favicon and app icons

- Replace the current website favicon with the attached `cha-physical-therapy-favicon-source.png` on every page.
- Use the supplied artwork exactly. Preserve the transparent area outside the cream circle, the cream circular background, and the black Cha Physical Therapy logo. Do not recolor, crop, distort, redraw, or substitute a different mark.
- Generate and reference the standard browser favicon assets, including 16 px, 32 px, and 48 px versions plus `favicon.ico`.
- Also generate and reference a 180 px Apple touch icon. If the project uses a web manifest, update its 192 px and 512 px icon entries from this same source.
- Update the shared document head and manifest rather than editing individual pages separately. Add an appropriate cache-busting filename or version so returning visitors do not keep seeing the old favicon.
- Verify the new icon in a fresh Chrome tab, a private window, and mobile browser metadata after deployment.

Please push these changes to Git and deploy them live after checking desktop and mobile. Reply when the production update is ready for review.

Thank you,
Ray
